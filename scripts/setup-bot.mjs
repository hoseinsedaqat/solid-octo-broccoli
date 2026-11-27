#!/usr/bin/env node
/**
 * One-shot bot setup: validates the token and points the Telegram webhook at this deployment.
 *
 *   BOT_TOKEN=123:abc PUBLIC_BASE_URL=https://world-war.example.workers.dev \
 *   TELEGRAM_WEBHOOK_SECRET=long-random node scripts/setup-bot.mjs            # set webhook
 *   node scripts/setup-bot.mjs --token=123:abc --delete                         # remove webhook
 *   node scripts/setup-bot.mjs --token=123:abc --base=https://… --secret=… --poll  # polling fallback
 *
 * TELEGRAM_API_BASE may point at scripts/telegram-stub.mjs to dry-run offline (nothing real is sent).
 */
/**
 * Windows-friendly: `FOO=bar node script.mjs` is POSIX-only, so every value may also be
 * passed as a flag — `--token=… --base=… --secret=… --api=…` (flag wins over the variable).
 */
function flag(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 3)) : ''; // '--name='.length === name.length + 3
}

const API_BASE = (flag('api') || process.env.TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/$/, '');
const TOKEN = flag('token') || process.env.BOT_TOKEN || '';
const BASE = (flag('base') || process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
const SECRET = flag('secret') || process.env.TELEGRAM_WEBHOOK_SECRET || '';
const MODE = process.argv.includes('--delete') ? 'delete' : process.argv.includes('--poll') ? 'poll' : 'set';
const APP_SECRET = flag('app-secret') || process.env.APP_SECRET || 'APP_SECRET';

if (!TOKEN) die('BOT_TOKEN لازم است (از @BotFather).');

async function call(method, payload) {
  const res = await fetch(`${API_BASE}/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
    signal: AbortSignal.timeout(15000),
  });
  const body = await res.json().catch(() => null);
  if (!body?.ok) die(`${method} ناموفق: ${body?.description ?? `HTTP ${res.status}`}`);
  return body.result;
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const me = await call('getMe');
console.log(`✓ ربات: @${me.username} (id ${me.id})`);

if (MODE === 'delete') {
  await call('deleteWebhook', { drop_pending_updates: false });
  console.log('✓ وب‌هوک حذف شد. حالا می‌توانید با getUpdates پولینگ کنید (POST /api/telegram/poll) .');
  process.exit(0);
}

if (MODE === 'poll') {
  await call('deleteWebhook', { drop_pending_updates: false });
  console.log('✓ وب‌هوک حذف شد؛ برای تحویل آپدیت‌ها در حالت توسعه:');
  console.log(`  curl -X POST "http://localhost:8787/api/telegram/poll" -H "x-admin-secret: ${APP_SECRET}"`);
  process.exit(0);
}

if (!BASE) die('PUBLIC_BASE_URL لازم است — آدرس عمومی Worker که مسیر /api/telegram/webhook را سرو می‌کند.');
if (!SECRET) die('TELEGRAM_WEBHOOK_SECRET لازم است — بدون آن هر کسی می‌تواند جعل آپدیت بفرستد.');

const url = `${BASE}/api/telegram/webhook`;
const ok = await call('setWebhook', {
  url,
  secret_token: SECRET,
  drop_pending_updates: true,
  allowed_updates: ['message', 'callback_query'],
});
if (!ok) die('setWebhook پاسخ غیرمنتظره داد.');
const info = await call('getWebhookInfo');
console.log(`✓ وب‌هوک ست شد: ${info.url}`);
if (info.pending_update_count) console.log(`  (${info.pending_update_count} آپدیت در صف)`);
console.log('مراحل بعدی: wrangler deploy → /api/health را چک کنید → در تلگرام /start بزنید.');
