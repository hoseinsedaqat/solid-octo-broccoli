/** Ids, keys and deterministic cycle math. */

const ENC = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let s = '';
  for (const b of buf) s += ENC[b % ENC.length];
  return s;
}

export function uuid(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** stable hash used for idempotency + duplicate detection */
export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export async function timingSafeEqualHex(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const revenueCycleKey = (nationId: number, cycleIndex: number) => `rev:${nationId}:${cycleIndex}`;
export const purchaseIdempotencyKey = (nationId: number, key: string) => `buy:${nationId}:${key}`;
export const adminTxKey = (action: string, nationId: number, at: number, seq: string) =>
  `adm:${action}:${nationId}:${at}:${seq}`;
export const warTxKey = (kind: 'entry' | 'indemnity' | 'cost', warId: number, side: string) =>
  `war:${kind}:${warId}:${side}`;

/**
 * Cycle index for a nation: how many complete income cycles elapsed since the
 * nation's anchor. Deterministic => re-running cron can never double-pay.
 */
export function cycleIndexFor(anchorAt: number, nowSeconds: number, cycleSeconds: number): number {
  if (cycleSeconds <= 0) return -1;
  const elapsed = nowSeconds - anchorAt;
  if (elapsed < cycleSeconds) return -1;
  return Math.floor(elapsed / cycleSeconds);
}

/** deterministic 31-bit seed from a string (reproducible battle reports) */
export function seedFromString(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
