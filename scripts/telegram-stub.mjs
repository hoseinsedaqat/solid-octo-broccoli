#!/usr/bin/env node
/**
 * Offline Telegram Bot API stub — LOCAL DEVELOPMENT ONLY.
 *
 * Why this exists: from a sandbox, a country behind filtering, or any machine without access to
 * api.telegram.org, the Worker cannot deliver a single message, and the onboarding flow (which posts a
 * welcome message, a reply keyboard and callback answers) would look broken. Pointing TELEGRAM_API_BASE at
 * this stub makes every Bot API call succeed against a local recorder instead, so the whole game — bot flows
 * included — can be exercised without the internet.
 *
 * Usage:
 *   node scripts/telegram-stub.mjs                # listens on 127.0.0.1:9999
 *   PORT=9999 DUMP=/tmp/tg.jsonl node scripts/telegram-stub.mjs
 *
 * Then in apps/worker/.dev.vars (or the environment of `wrangler dev`):
 *   TELEGRAM_API_BASE=http://127.0.0.1:9999
 *
 * Every request body is also appended as one JSON line to DUMP (default: .wrangler/telegram-stub.jsonl),
 * so you can read back exactly what the bot "sent". It never talks to the network itself.
 */
import { createServer } from 'node:http';
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const PORT = Number(process.env.PORT ?? 9999);
const HOST = process.env.HOST ?? '127.0.0.1';
const DUMP = resolve(process.env.DUMP ?? '.wrangler/telegram-stub.jsonl');

try {
  mkdirSync(dirname(DUMP), { recursive: true });
} catch {
  /* the dump file is a nicety */
}

/** responses that Bot API clients actually parse */
function resultFor(method) {
  if (method === 'getUpdates') return [];
  if (method === 'deleteWebhook' || method === 'setWebhook') return true;
  if (method === 'getWebhookInfo') return { url: '', pending_update_count: 0 };
  // sendMessage & friends: a fake message object
  return { message_id: Math.floor(Math.random() * 1e6), date: Math.floor(Date.now() / 1000), text: '(stub)' };
}

createServer((req, res) => {
  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 4_000_000) req.destroy();
  });
  req.on('end', () => {
    const method = (req.url ?? '').split('/').filter(Boolean).pop() ?? 'unknown';
    let payload = null;
    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      payload = { raw };
    }
    const line = JSON.stringify({ at: new Date().toISOString(), method, payload });
    console.log(line);
    try {
      appendFileSync(DUMP, `${line}\n`);
    } catch {
      /* ignore write failures (read-only fs) */
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, result: resultFor(method) }));
  });
}).listen(PORT, HOST, () => {
  console.log(`Telegram stub listening on http://${HOST}:${PORT} — set TELEGRAM_API_BASE=http://${HOST}:${PORT}`);
  console.log(`recording calls to ${DUMP}`);
});
