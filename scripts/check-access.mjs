#!/usr/bin/env node
/**
 * Connectivity report for filtered networks (Iran) and plain sandboxes.
 *
 * The game is designed so that NOTHING on the critical path depends on a third-party CDN:
 * the Mini App SDK is served from our own origin and the Bot API is only ever called by the
 * Worker (server-side), never by the browser. This script answers one practical question:
 * "which endpoints can this machine reach right now?"
 *
 *   node scripts/check-access.mjs               # default probes
 *   BOT_TOKEN=... node scripts/check-access.mjs # also validates the token via getMe
 */
const TIMEOUT_MS = Number(process.env.PROBE_TIMEOUT_MS ?? 6000);
const API_BASE = process.env.TELEGRAM_API_BASE ?? 'https://api.telegram.org';

const PROBES = [
  { name: 'Telegram Bot API (api.telegram.org)', url: `${API_BASE.replace(/\/$/, '')}/` },
  { name: 'Cloudflare Workers static (cdnjs.cloudflare.com)', url: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js' },
  { name: 'Telegram CDN (telegram.org — فقط برای تست؛ بازی به آن نیاز ندارد)', url: 'https://telegram.org/js/telegram-web-app.js' },
];

async function probe({ name, url }) {
  const started = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'manual' });
    return { name, ok: true, status: res.status, ms: Date.now() - started };
  } catch (err) {
    const reason = err?.cause?.code ?? err?.name ?? String(err);
    return { name, ok: false, reason, ms: Date.now() - started };
  }
}

console.log('\n══════ World War — دسترسی شبکه ══════\n');
if (API_BASE !== 'https://api.telegram.org') {
  console.log(`ℹ️  TELEGRAM_API_BASE روی ${API_BASE} ست شده — یعنی stub محلی؛ اتصال واقعی تست نمی‌شود.\n`);
}
for (const p of PROBES) {
  const r = await probe(p);
  const line = r.ok ? `✓ ${r.name} — HTTP ${r.status} (${r.ms}ms)` : `✗ ${r.name} — ${r.reason} (${r.ms}ms)`;
  console.log(line);
}

const token = process.env.BOT_TOKEN ?? (await readFirstArg());
if (token) {
  const url = `${API_BASE.replace(/\/$/, '')}/bot${token}/getMe`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = await res.json().catch(() => null);
    if (body?.ok) console.log(`✓ توکن ربات معتبر است — @${body.result?.username}`);
    else console.log(`✗ getMe خطا داد: ${JSON.stringify(body?.description ?? res.status)}`);
  } catch (err) {
    console.log(`✗ getMe نرسید: ${err?.cause?.code ?? err?.message} — اگر شبکه فیلتر است، با TELEGRAM_API_BASE=http://127.0.0.1:9999 و اجرای ` + 'node scripts/telegram-stub.mjs' + ' مسیر آفلاین را تمرین کنید.');
  }
} else {
  console.log('ℹ️  BOT_TOKEN ست نشده — اعتبار توکن بررسی نشد.');
}
console.log('\nخلاصه: مینی‌اپ و API هر دو روی یک Worker سرو می‌شوند؛ اگر api.telegram.org از نقطه‌ی شما مسدود است،');
console.log('وب‌هوک را از یک سرور/کشور قابل‌دسترس ست کنید یا در حالت توسعه از stub محلی استفاده کنید (README بخش «شبکه فیلتر»).\n');

function readFirstArg() {
  const arg = process.argv[2];
  return arg ? Promise.resolve(arg) : Promise.resolve('');
}
