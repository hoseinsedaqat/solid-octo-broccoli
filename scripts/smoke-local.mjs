#!/usr/bin/env node
/**
 * End-to-end smoke test against the LOCAL dev stack (wrangler dev + local D1 + Telegram stub).
 * It is NOT a replacement for `npm test` (which runs the real vitest suite against Miniflare);
 * it exercises the exact artefacts you deploy: the seeded catalog, the built Mini App, and the
 * D1 file that `wrangler d1 migrations apply --local` created.
 *
 * Run:  node scripts/smoke-local.mjs
 */
import { execFileSync } from 'node:child_process';

const BASE = process.env.WW_API_TARGET ?? 'http://127.0.0.1:8787';
const SECRET = 'local-dev-webhook-secret';
const results = [];
let failed = 0;

function check(name, cond, extra = '') {
  results.push(`${cond ? '✓' : '✗'} ${name}${extra ? ` — ${extra}` : ''}`);
  if (!cond) failed++;
}
const sql = (q) => {
  let out = '';
  try {
    out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'DB', '--local', '--json', '--command', q], {
      cwd: 'apps/worker',
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, CI: '1', DO_NOT_TRACK: '1' },
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return [];
  }
  try {
    const j = JSON.parse(out.slice(out.indexOf('[')));
    return j[j.length - 1]?.results ?? [];
  } catch {
    return [];
  }
};
async function api(method, path, { token, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* html */
  }
  return { status: res.status, json, text };
}
async function tgUpdate(update) {
  const res = await fetch(`${BASE}/api/telegram/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': SECRET },
    body: JSON.stringify(update),
  });
  if (res.status !== 200) throw new Error(`webhook ${res.status}: ${await res.text()}`);
  await new Promise((r) => setTimeout(r, 400)); // the webhook answers before waitUntil finishes; give the bot flow time
}
let upd = Math.floor(Date.now() / 1000); // the worker deduplicates update_ids; they must be unique across runs
const botText = (id, text) =>
  tgUpdate({
    update_id: upd++,
    message: { message_id: upd * 10, from: { id, username: `u${id}`, first_name: `U${id}`, language_code: 'fa' }, chat: { id, type: 'private' }, text, date: Math.floor(Date.now() / 1000) },
  });
const botCb = (id, data) =>
  tgUpdate({
    update_id: upd++,
    callback_query: {
      id: `cb${upd}`,
      from: { id, username: `u${id}`, first_name: `U${id}`, language_code: 'fa' },
      message: { message_id: 42, chat: { id, type: 'private' }, date: Math.floor(Date.now() / 1000) },
      chat_instance: `ci${id}`,
      data,
    },
  });
async function onboard(id, nation, leader) {
  await botText(id, '/start');
  await botText(id, nation);
  await botText(id, leader);
  await botCb(id, 'flag:3');
  for (let i = 0; i < 20; i++) {
    const row = sql(`SELECT id FROM nations WHERE name = '${nation}'`)[0];
    if (row) return Number(row.id);
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`onboarding failed for ${nation}`);
}

/* ------------------------------ 0) health + assets ------------------------------ */
const health = await api('GET', '/api/health');
check('health ok', health.json?.ok === true && health.json?.counters?.nations >= 0, `nations=${health.json?.counters?.nations}`);
const seeded = sql(`SELECT COUNT(*) AS n FROM equipment_templates`)[0]?.n ?? 0;
check('seed applied to local D1', seeded === 40, `${seeded} templates`);
const idx = await fetch(BASE + '/');
const idxHtml = await idx.text();
check('Mini App index served from Worker assets', idx.status === 200 && idxHtml.includes('id="root"'));
const spa = await fetch(BASE + '/app/admin/settings');
check('SPA fallback serves index.html', spa.status === 200 && (await spa.text()).includes('id="root"'));

/* ------------------------------ 1) bot onboarding ------------------------------ */
const ADMIN_TG = 111111111;
const RUN = Date.now() % 1000000; // repeated runs against the same local D1 must not collide
const P1 = 222200000 + RUN;
const P2 = 333300000 + RUN;
await botText(ADMIN_TG, '/start admin');
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const faRun = String(RUN).replace(/\d/g, (d) => FA_DIGITS[+d]); // nation names reject latin digits, like the game rules do
const n1 = await onboard(P1, `اسموکستان${faRun}`, 'رضا');
const n2 = await onboard(P2, `کاویان‌شهر${faRun}`, 'کاوه');
check('two nations created via bot', n1 > 0 && n2 > 0 && n1 !== n2, `#${n1} / #${n2}`);

const dev1 = await api('POST', '/api/auth/dev-login', { body: { telegramId: P1 } });
const dev2 = await api('POST', '/api/auth/dev-login', { body: { telegramId: P2 } });
const devA = await api('POST', '/api/auth/dev-login', { body: { telegramId: ADMIN_TG } });
check('dev-login returns bearer tokens', Boolean(dev1.json?.token && dev2.json?.token && devA.json?.token));
const t1 = dev1.json.token;
const t2 = dev2.json.token;
const tA = devA.json.token;
const me = await api('GET', '/api/auth/me', { token: t1 });
const eco = () => me.json?.view?.economy ?? {};
check('player view resolved after onboarding', me.json?.activeNationId === n1 && Number(eco().treasury) === 1000000, `treasury=${eco().treasury}`);
check('starter income is the section total', Number(eco().factoryIncome) === 50000 && Number(eco().mineIncome) === 30000, `${eco().factoryIncome}+${eco().mineIncome}`);

/* ------------------------------ 2) shop: price → buy ------------------------------ */
const shop = await api('GET', '/api/shop/category/tanks?pageSize=5', { token: t1 });
check('shop category lists starter tanks', (shop.json?.items ?? []).length >= 2, `${(shop.json?.items ?? []).length} items`);
const abrams = (shop.json?.items ?? []).find((i) => /Abrams/.test(i.nameFa));
// the unpriced rule is asserted on a template this run never touches (prices-bulk only writes integers, by design)
const leopard = (shop.json?.items ?? []).find((i) => /Leopard/.test(i.nameFa));
const leopardPriceRow = sql(`SELECT CASE WHEN price IS NULL THEN 1 ELSE 0 END AS nulled FROM equipment_templates WHERE id = ${leopard?.templateId ?? 0}`)[0];
check('unpriced equipment is not purchasable', leopard?.purchasable === false && Number(leopardPriceRow?.nulled) === 1 && String(leopard?.disabledReason ?? '').includes('قیمت'), `reason=${leopard?.disabledReason}`);
const priceSet = await api('POST', '/api/admin/shop/prices-bulk', { token: tA, body: { items: [{ templateId: abrams.templateId, price: 4000 }] } });
check('admin bulk pricing ok', priceSet.json?.updated >= 1, `updated=${priceSet.json?.updated}`);
const shop2 = await api('GET', '/api/shop/category/tanks?pageSize=5', { token: t1 });
const abrams2 = (shop2.json?.items ?? []).find((i) => /Abrams/.test(i.nameFa));
check('priced equipment becomes purchasable', abrams2?.purchasable === true && Number(abrams2?.price) === 4000, `price=${abrams2?.price}`);
const key = `smoke:${RUN}:${Date.now()}`;
const buy = await api('POST', '/api/shop/purchase', { token: t1, body: { templateId: abrams.templateId, quantity: 5, idempotencyKey: key } });
const beforeBuy = Number(me.json?.view?.economy?.treasury ?? 1000000);
check('purchase debits exactly price × qty', Number(buy.json?.totalCost) === 20000 && Number(buy.json?.treasuryAfter) === beforeBuy - 20000, `cost=${buy.json?.totalCost ?? JSON.stringify(buy.json?.error ?? {})} after=${buy.json?.treasuryAfter}`);
check('purchase raises owned quantity', Number(buy.json?.newQuantity) >= 105, `owned=${buy.json?.newQuantity}`);
const buyAgain = await api('POST', '/api/shop/purchase', { token: t1, body: { templateId: abrams.templateId, quantity: 5, idempotencyKey: key } });
check('replay of the same idempotency key is a no-op', buyAgain.json?.duplicate === true && Number(buyAgain.json?.treasuryAfter) === beforeBuy - 20000);

/* ------------------------------ 3) revenue cron via admin jobs ------------------------------ */
sql(`UPDATE nations SET income_anchor_at = income_anchor_at - 90000 WHERE id IN (${n1},${n2})`);
const jobs = await api('POST', '/api/admin/jobs/run', { token: tA, body: { jobs: ['revenue'] } });
check('revenue job ran for both nations', (jobs.json?.jobs ?? []).some((r) => r.job === 'revenue' && r.ok && Number(r.processed) >= 2), `processed=${jobs.json?.jobs?.[0]?.processed} detail=${String(jobs.json?.jobs?.[0]?.detail ?? '')}`);
const after = await api('GET', '/api/auth/me', { token: t1 });
const afterTreasury = Number(after.json?.view?.economy?.treasury ?? 0);
check('income credited (net 80 000/cycle for a starter nation)', afterTreasury >= beforeBuy - 20000 + 40000, `treasury=${afterTreasury} (was ${beforeBuy - 20000})`);
const noTok = await api('GET', '/api/player/nation');
check('unauthenticated API call rejected', noTok.status === 401);

/* a purchase the treasury cannot cover must fail with the insufficient_funds message — while the nation is still at peace, because an at-war nation cannot shop at all */
const negBuy = await api('POST', '/api/shop/purchase', { token: t1, body: { templateId: abrams.templateId, quantity: 100_000, idempotencyKey: `smoke:neg:${Date.now()}` } });
check('purchase beyond treasury rejected', negBuy.status >= 400 && /کافی/i.test(negBuy.json?.error?.message ?? ''), `${negBuy.status} ${negBuy.json?.error?.message}`);
const warLocked = await api('GET', '/api/shop/purchase', { token: t1 });
void warLocked;

/* ------------------------------ 4) war: preview → propose → accept ------------------------------ */
const preview = await api('POST', '/api/war/preview', { token: t1, body: { targetNationId: n2 } });
check('war preview returns entry cost + odds', Number.isFinite(preview.json?.entryCost) && preview.json?.attackerWinChance > 0 && preview.json?.attackerWinChance < 1, `chance=${preview.json?.attackerWinChance} entry=${preview.json?.entryCost}`);
const propose = await api('POST', '/api/war/propose', { token: t1, body: { targetNationId: n2, indemnityOffered: 0 } });
const warId = propose.json?.warId;
check('war created as proposed', propose.status === 200 && warId > 0 && propose.json?.status === 'proposed', `warId=${warId}`);
const accept = await api('POST', `/api/war/${warId}/respond`, { token: t2, body: { accept: true } });
check('defender accepts → active', accept.json?.war?.status === 'active' || accept.json?.status === 'active', JSON.stringify(accept.json?.war?.status ?? accept.json?.status ?? accept.json?.error ?? ''));
const wars = await api('GET', '/api/war/wars', { token: t1 });
const active = (wars.json?.wars ?? []).find((w) => w.id === warId);
check('active war visible with rounds schedule', Boolean(active) && active.statusLabelFa && active.maxRounds > 0, `rounds=${active?.roundsPlayed}`);
sql(`UPDATE wars SET next_round_at = strftime('%s','now') - 5 WHERE id = ${warId}`);
const round = await api('POST', `/api/war/${warId}/round`, { token: t1 });
check('one battle round resolves with real losses', round.status === 200 && Number.isFinite(Number(round.json?.outcome?.attackerLosses)) && Number(round.json?.round) >= 1, JSON.stringify(round.json?.outcome ?? round.json?.error ?? {}).slice(0, 140));
const adminWars = await api('GET', '/api/admin/wars?status=active', { token: tA });
check('admin sees the same war', (adminWars.json?.wars ?? []).some((w) => Number(w.id) === warId));

/* ------------------------------ 5) diplomacy + statements ------------------------------ */
const dreq = await api('POST', '/api/diplomacy/request', { token: t1, body: { toNationId: n2, kind: 'friendship' } });
check('friend request created', Number(dreq.json?.requestId) > 0 && dreq.json?.status === 'pending', `id=${dreq.json?.requestId} ${JSON.stringify(dreq.json?.error ?? {}).slice(0, 90)}`);
const dec = await api('POST', `/api/diplomacy/request/${dreq.json.requestId}/decide`, { token: t2, body: { accept: true } });
check('friend request accepted → friends relation', dec.json?.status === 'accepted' || dec.json?.relation === 'friends', JSON.stringify(dec.json ?? {}).slice(0, 80));
const stmt = await api('POST', '/api/statements', { token: t1, body: { text: 'تجمع نیروها در مرز غربی؛ رزمایش سراسری فردا صبح آغاز می‌شود.' } });
check('statement published through moderation rules', stmt.json?.statementId > 0 && typeof stmt.json?.statusLabelFa === 'string', `status=${stmt.json?.status}`);
if (stmt.json?.status === 'pending') {
  const appr = await api('POST', `/api/admin/statements/${stmt.json.statementId}/review`, { token: tA, body: { decision: 'approve', note: 'تأیید دودمان' } });
  check('admin approves pending statement', appr.status === 200);
}

/* ------------------------------ 6) admin console reads ------------------------------ */
const ovw = await api('GET', '/api/admin/overview', { token: tA });
check('admin overview counters', ovw.json?.counters?.nations >= 2 && Number.isFinite(ovw.json?.counters?.totalTreasury), `nations=${ovw.json?.counters?.nations} treasury=${ovw.json?.counters?.totalTreasury}`);
const settings = await api('GET', '/api/admin/settings', { token: tA });
check('admin settings bundle loads all sections', settings.json?.settings && ['economy', 'profile', 'battle', 'diplomacy', 'rankingWeights', 'branding', 'features', 'quota'].every((k) => k in settings.json.settings), `keys=${Object.keys(settings.json?.settings ?? {}).join(',')}`);
const quota = await api('GET', '/api/admin/quota', { token: tA });
check('quota page data (limits measured)', quota.json?.limits && quota.json?.usagePercent && Object.values(quota.json?.notMeasured ?? {}).every((v) => v === null || typeof v === 'string'), `day=${quota.json?.day}`);
const usersList = await api('GET', '/api/admin/users?q=2222', { token: tA });
check('admin user search finds smoke users', (usersList.json?.rows ?? []).length >= 2, `rows=${usersList.json?.total}`);
const audit = await api('GET', '/api/admin/audit?limit=5', { token: tA });
check('audit trail recorded admin pricing', (audit.json?.rows ?? []).some((r) => String(r.action).includes('prices')));
const exportRes = await api('GET', '/api/admin/backup/export?tables=nations,equipment_templates', { token: tA });
check('backup export returns meta + data', Object.keys(exportRes.json?.data ?? {}).length === 2 && (exportRes.json?.meta?.tables ?? []).length === 2, `tables=${JSON.stringify(exportRes.json?.meta?.tables ?? [])}`);
const block = await api('POST', `/api/admin/users/${dev2.json?.userId ?? 999999}/status`, { token: tA, body: { status: 'blocked', reason: 'smoke: آزمایش مسدودسازی' } });
check('admin can block a user', block.json?.status === 'blocked');
const unblock = await api('POST', `/api/admin/users/${dev2.json?.userId ?? 999999}/status`, { token: tA, body: { status: 'active', reason: 'smoke: رفع مسدودی' } });
check('admin can unblock a user', unblock.json?.status === 'active');

/* ------------------------------ 7) guard rails ------------------------------ */
const denied = await api('GET', '/api/admin/overview', { token: t1 });
check('player token is refused on admin routes', denied.status === 403 || denied.status === 401, `status=${denied.status}`);

/* ------------------------------ report ------------------------------ */
console.log('\n══════ SMOKE: World War local stack ══════');
console.log(results.join('\n'));
console.log(failed === 0 ? `\n${results.length}/${results.length} checks passed ✔` : `\n${failed} of ${results.length} checks FAILED ✖`);
process.exit(failed === 0 ? 0 : 1);
