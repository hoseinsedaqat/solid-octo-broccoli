import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
void (0 as unknown as AddressInfo);

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLE_PATH = join(ROOT, 'tests/.cache/worker.bundle.mjs');

/**
 * Bundles the worker from source. Rebuilt on every createWorld() call (esbuild takes
 * ~0.5s) so a test can never run against a stale bundle after an edit.
 */
export async function bundleWorker(): Promise<string> {
  mkdirSync(dirname(BUNDLE_PATH), { recursive: true });
  await build({
    absWorkingDir: ROOT,
    entryPoints: ['apps/worker/src/index.ts'],
    outfile: 'tests/.cache/worker.bundle.mjs',
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    conditions: ['workerd', 'worker', 'browser', 'import', 'default'],
    external: ['node:*'],
    legalComments: 'none',
    logLevel: 'error',
  });
  return readFileSync(BUNDLE_PATH, 'utf8');
}

/**
 * Miniflare's D1 exec() splits on semicolons naively and chokes on leading comments,
 * so the harness runs scripts statement-by-statement with a quote/comment-aware
 * splitter. (Real D1 accepts the same file through "wrangler d1 migrations apply".)
 */
const SQ = String.fromCharCode(39);
const NEWLINE = String.fromCharCode(10);

export function splitSql(sql: string): string[] {
  const out: string[] = [];
  const SQ = String.fromCharCode(39);
  const NL = String.fromCharCode(10);
  let cur = '';
  let inStr = false;
  let inLineComment = false;
  let inBlockComment = false;
  let trigDepth = 0; // "BEGIN ... END" trigger bodies contain semicolons
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i]!;
    const next = sql[i + 1];
    if (inLineComment) {
      if (ch === NL) {
        inLineComment = false;
        cur += ch;
      }
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inStr) {
      cur += ch;
      if (ch === SQ) {
        if (next === SQ) {
          cur += next;
          i++;
        } else inStr = false;
      }
      continue;
    }
    if (ch === '-' && next === '-') {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === SQ) {
      inStr = true;
      cur += ch;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < sql.length && /[A-Za-z0-9_]/.test(sql[j]!)) j++;
      const word = sql.slice(i, j).toUpperCase();
      const boundary = i === 0 || !/[A-Za-z0-9_]/.test(sql[i - 1]!);
      const after = sql.slice(j);
      const isTxnStart = /^\s*(?:(?:DEFERRED|IMMEDIATE|EXCLUSIVE)?\s*TRANSACTION)?\s*;/i.test(after);
      if (boundary && word === 'BEGIN' && trigDepth === 0 && !isTxnStart) trigDepth++;
      else if (boundary && word === 'END') trigDepth = Math.max(0, trigDepth - 1);
      cur += sql.slice(i, j);
      i = j - 1;
      continue;
    }
    if (ch === ';' && trigDepth === 0) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export async function execScript(db: D1Database, sql: string): Promise<number> {
  // explicit transaction control is rejected by D1's JS API (each statement is
  // already committed on its own), so it is skipped in the test harness.
  const statements = splitSql(sql).filter((stmt) => !/^\s*(?:BEGIN|COMMIT|ROLLBACK)\s*(?:TRANSACTION\s*)?;?\s*$/i.test(stmt));
  for (const stmt of statements) await db.prepare(stmt).all();
  return statements.length;
}

export const BOT_TOKEN = '123456:TEST-token-for-harness-only';

export const MIGRATIONS = ['0001_init.sql', '0002_rate_limits.sql', '0003_war_attack_plan.sql', '0004_attack_plan_remaining.sql', '0005_defense_plan_daily_prizes.sql', '0006_transactions_prize_type.sql', '0007_central_bank.sql'].map((f) => ({
  name: f,
  sql: readFileSync(join(ROOT, 'apps/worker/migrations', f), 'utf8'),
}));
export const SEED_SQL = readFileSync(join(ROOT, 'apps/worker/seeds/seed.sql'), 'utf8');

export interface SentTelegramCall {
  method: string;
  payload: Record<string, any>;
  url: string;
}

function url0(href: string): string {
  try {
    return new URL(href).pathname.split('/').pop() ?? '';
  } catch {
    return '';
  }
}

export interface World {
  mf: Miniflare;
  db: D1Database;
  api: (
    method: string,
    path: string,
    opts?: { token?: string | null; body?: unknown; headers?: Record<string, string> },
  ) => Promise<{ status: number; json: any; text: string }>;
  login: (telegramId: number) => Promise<{ token: string; userId: number; role: string }>;
  signedInitData: (user: { id: number; username?: string; first_name?: string }, opts?: { authDate?: number }) => Promise<string>;
  /** drives the real bot code path, offline (outbound fetch is intercepted) */
  telegramUpdate: (update: Record<string, unknown>) => Promise<void>;
  sent: SentTelegramCall[];
  dispose: () => Promise<void>;
}

let updateCounter = 1_000_000;

export async function createWorld(opts: { adminIds?: string; env?: Record<string, string> } = {}): Promise<World> {
  const script = await bundleWorker();
  const bindings: Record<string, string> = {
    BOT_TOKEN,
    APP_SECRET: 'dev-admin-secret',
    APP_ENV: 'test',
    ADMIN_TELEGRAM_IDS: opts.adminIds ?? '',
    ...opts.env,
  };
  // a local recorder stands in for api.telegram.org: every outbound Bot API call of
  // the worker lands here (TELEGRAM_API_BASE), so tests assert on real payloads
  // without any network access.
  const sent: SentTelegramCall[] = [];
  const server = createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      const method = String(req.url ?? '').split('/').pop() ?? '';
      let payload: Record<string, any> = {};
      try {
        payload = JSON.parse(raw || '{}') as Record<string, any>;
      } catch {
        payload = { raw };
      }
      sent.push({ method, payload, url: req.url ?? '' });
      res.writeHead(200, { 'content-type': 'application/json' });
      const result =
        method === 'getMe'
          ? { id: 123456, username: 'world_war_test_bot', first_name: 'World War' }
          : method === 'getUpdates'
            ? []
            : method === 'setWebhook' || method === 'setMyCommands'
              ? true
              : { message_id: sent.length + 1, chat: { id: payload.chat_id }, date: Math.floor(Date.now() / 1000), text: payload.text ?? '' };
      res.end(JSON.stringify({ ok: true, result }));
    });
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const port = (server.address() as { port: number }).port;

  const mf = new Miniflare({
    modules: true,
    script,
    d1Databases: { DB: 'world-war-test' },
    unsafeEphemeralD1: true,
    bindings: { ...bindings, TELEGRAM_API_BASE: `http://127.0.0.1:${port}` },
    compatibilityDate: '2025-06-01',
    compatibilityFlags: ['nodejs_compat'],
  });

  const db = (await mf.getD1Database('DB')) as unknown as D1Database;
  for (const m of MIGRATIONS) await execScript(db, m.sql);
  await execScript(db, SEED_SQL);

  const api: World['api'] = async (method, path, a = {}) => {
    const res = await mf.dispatchFetch('http://miniflare.test' + path, {
      method,
      headers: {
        'content-type': 'application/json',
        ...(a.token ? { authorization: `Bearer ${a.token}` } : {}),
        ...(a.headers ?? {}),
      },
      ...(a.body === undefined ? {} : { body: typeof a.body === 'string' ? a.body : JSON.stringify(a.body) }),
    });
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return { status: res.status, json, text };
  };

  const world: World = {
    mf,
    db,
    api,
    sent,
    async login(telegramId: number) {
      const res = await api('POST', '/api/auth/dev-login', { body: { telegramId } });
      if (res.status !== 200) throw new Error(`dev-login failed: ${res.status} ${res.text}`);
      return { token: res.json.token, userId: res.json.userId, role: res.json.role };
    },
    async signedInitData(user, init = {}) {
      const authDate = init.authDate ?? Math.floor(Date.now() / 1000);
      const params = new URLSearchParams();
      params.set('user', JSON.stringify({ id: user.id, username: user.username ?? null, first_name: user.first_name ?? 'Player', allows_write_to_pm: true }));
      params.set('auth_date', String(authDate));
      params.set('query_id', 'AAH-test');
      const dataCheckString = [...params.entries()]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');
      const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
      const hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
      params.set('hash', hash);
      return params.toString();
    },
    async telegramUpdate(update) {
      const update_id = (update.update_id as number) ?? ++updateCounter;
      const res = await api('POST', '/api/telegram/webhook', {
        body: { update_id, ...update },
        headers: { 'x-telegram-bot-api-secret-token': bindings.TELEGRAM_WEBHOOK_SECRET ?? '' },
      });
      if (res.status !== 200) throw new Error(`webhook ${res.status}: ${res.text}`);
      // give waitUntil work a chance to finish (webhook answers fast on purpose)
      await new Promise((r) => setTimeout(r, 40));
    },
    async dispose() {
      await mf.dispose();
      await new Promise<void>((r) => server.close(() => r()));
    },
  };
  return world;
}

/* ------------------------------ db helpers ------------------------------ */

export async function all<T = Record<string, any>>(db: D1Database, sql: string, ...bindings: unknown[]): Promise<T[]> {
  const r = await db.prepare(sql).bind(...bindings).all<T>();
  return r.results ?? [];
}

export async function first<T = Record<string, any>>(db: D1Database, sql: string, ...bindings: unknown[]): Promise<T | null> {
  return (await db.prepare(sql).bind(...bindings).first<T>()) ?? null;
}

export async function run(db: D1Database, sql: string, ...bindings: unknown[]) {
  return db.prepare(sql).bind(...bindings).run();
}

/** shift a nation's income anchor back in time so N cycles become due */
export async function advanceTime(db: D1Database, nationId: number, seconds: number) {
  await run(db, `UPDATE nations SET income_anchor_at = income_anchor_at - ? WHERE id = ?`, seconds, nationId);
}

/**
 * Runs one cron tick. Miniflare cannot fire Cron Triggers, so the tick goes through
 * POST /api/admin/jobs/run, which calls the very same job functions as the worker's
 * `scheduled` handler (see src/scheduled/cron.ts: triggerJobsManually).
 */
export async function runCron(world: World, adminToken: string, jobs: ('wars' | 'war_expiry' | 'ranking' | 'diplomacy_expiry' | 'housekeeping')[] = ['wars', 'ranking', 'diplomacy_expiry']): Promise<any> {
  const res = await world.api('POST', '/api/admin/jobs/run', { token: adminToken, body: { jobs } });
  if (res.status !== 200) throw new Error(`jobs/run failed: ${res.status} ${res.text}`);
  return res.json;
}

/* ------------------------- bot-flow driving helpers ------------------------- */

export async function botText(world: World, telegramId: number, text: string, chatId?: number) {
  await world.telegramUpdate({
    message: { message_id: telegramId * 1000 + Date.now() % 1000, from: { id: telegramId, username: `u${telegramId}`, first_name: `User${telegramId}`, language_code: 'fa' }, chat: { id: chatId ?? telegramId, type: 'private' }, text, date: Math.floor(Date.now() / 1000) },
  });
}

export async function botCallback(world: World, telegramId: number, data: string, chatId?: number) {
  await world.telegramUpdate({
    callback_query: {
      id: `cb${++updateCounter}`,
      from: { id: telegramId, username: `u${telegramId}`, first_name: `User${telegramId}`, language_code: 'fa' },
      message: { message_id: 42, chat: { id: chatId ?? telegramId, type: 'private' }, date: Math.floor(Date.now() / 1000) },
      chat_instance: `ci${telegramId}`,
      data,
    },
  });
}

/** full onboarding through the bot, exactly like a real player */
export async function onboardViaBot(world: World, telegramId: number, nationName: string, leaderName: string, flagIndex = 0) {
  await botText(world, telegramId, '/start');
  await botText(world, telegramId, nationName);
  await botText(world, telegramId, leaderName);
  await botCallback(world, telegramId, `flag:${flagIndex}`);
  const row = await first<{ id: number }>(world.db, `SELECT id FROM nations WHERE name = ?`, nationName);
  if (!row) throw new Error(`onboarding did not create "${nationName}"`);
  return Number(row.id);
}
