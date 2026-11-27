import { ApiError } from './errors';
import { timingSafeEqualHex } from './ids';

/**
 * Official Telegram Mini App `initData` validation
 * (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).
 *
 * The frontend is never trusted with a self-declared telegram id: the id is only
 * accepted when it comes out of a payload whose HMAC was produced by the bot
 * token itself, held in Cloudflare Secrets.
 */

export interface TelegramWebAppUser {
  telegramId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  languageCode: string | null;
  allowsWriteToPm: boolean;
  authDate: number;
}

const MAX_AGE_SECONDS = 24 * 3600;
const encoder = new TextEncoder();

async function hmacBytes(secret: Uint8Array | string, data: string): Promise<Uint8Array> {
  const material = secret as unknown as ArrayBuffer;
  const key =
    typeof secret === 'string'
      ? await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      : await crypto.subtle.importKey('raw', material, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data)));
}

const toHex = (bytes: Uint8Array) => [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');

/** secret_key = HMAC_SHA256(key = "WebAppData", data = bot_token) */
export async function deriveWebAppSecretKey(botToken: string): Promise<Uint8Array> {
  return hmacBytes('WebAppData', botToken);
}

export interface InitDataCheckResult {
  user: TelegramWebAppUser;
  startParam: string | null;
  queryId: string | null;
  raw: Record<string, string>;
}

export async function verifyInitDataFull(initData: string, botToken: string, opts: { maxAgeSeconds?: number } = {}): Promise<InitDataCheckResult> {
  if (!botToken) throw ApiError.internal('BOT_TOKEN تنظیم نشده است.');
  if (!initData || initData === 'undefined' || initData === 'null') {
    throw ApiError.unauthorized('initData ارسال نشده است؛ بازی را از داخل تلگرام باز کنید.');
  }

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(initData);
  } catch {
    throw ApiError.unauthorized('initData قابل تجزیه نیست.');
  }
  const hash = params.get('hash');
  if (!hash) throw ApiError.unauthorized('initData بدون امضا است.');

  const dataCheckString = [...params.entries()]
    .filter(([k]) => k !== 'hash')
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = await deriveWebAppSecretKey(botToken);
  const computed = toHex(await hmacBytes(secretKey, dataCheckString));
  if (!(await timingSafeEqualHex(computed, hash.toLowerCase()))) {
    throw ApiError.unauthorized('امضای initData معتبر نیست.');
  }

  const authDate = Number(params.get('auth_date') ?? 0);
  const maxAge = opts.maxAgeSeconds ?? MAX_AGE_SECONDS;
  if (!authDate) throw ApiError.unauthorized('auth_date وجود ندارد.');
  if (maxAge > 0 && Math.floor(Date.now() / 1000) - authDate > maxAge) {
    throw ApiError.unauthorized('نشست تلگرام منقضی شده است؛ Mini App را ببندید و دوباره باز کنید.');
  }

  let user: Record<string, unknown> | null = null;
  try {
    const rawUser = params.get('user');
    if (rawUser) user = JSON.parse(rawUser) as Record<string, unknown>;
  } catch {
    throw ApiError.unauthorized('اطلاعات کاربر initData معتبر نیست.');
  }
  if (!user || typeof user.id !== 'number') throw ApiError.unauthorized('کاربر در initData وجود ندارد.');

  const raw: Record<string, string> = {};
  for (const [k, v] of params.entries()) if (k !== 'hash' && k !== 'user') raw[k] = v;

  return {
    user: {
      telegramId: user.id as number,
      username: (user.username as string) ?? null,
      firstName: (user.first_name as string) ?? null,
      lastName: (user.last_name as string) ?? null,
      languageCode: (user.language_code as string) ?? null,
      allowsWriteToPm: Boolean(user.allows_write_to_pm ?? true),
      authDate,
    },
    startParam: params.get('start_param'),
    queryId: params.get('query_id'),
    raw,
  };
}

export async function verifyInitData(initData: string, botToken: string, opts: { maxAgeSeconds?: number } = {}): Promise<TelegramWebAppUser> {
  const res = await verifyInitDataFull(initData, botToken, opts);
  return res.user;
}

/** webhook hardening: X-Telegram-Bot-Api-Secret-Token must match */
export function checkWebhookSecret(header: string | null | undefined, expected: string | undefined): boolean {
  if (!expected) return true; // optional, but strongly recommended in the README
  return typeof header === 'string' && header === expected;
}

/** debug/init-only id extraction (never used for authorisation) */
export function peekTelegramId(initData: string): number | null {
  try {
    const raw = new URLSearchParams(initData).get('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id?: number };
    return typeof parsed.id === 'number' ? parsed.id : null;
  } catch {
    return null;
  }
}
