import type { Db } from './db';
import { sql } from './sql';
import { ApiError } from './errors';
import { nowSeconds } from './format';

const memory = new Map<string, { count: number; resetAt: number }>();

/**
 * Two layers:
 *  1. an in-isolate counter (free, no D1 write) that absorbs bursts;
 *  2. a D1-backed fixed window for actions that cost money or create records,
 *     so the limit still holds across isolates and restarts.
 * When a limit is hit the API answers 429 with a retry hint — never a silent drop.
 */
export async function enforceRateLimit(
  db: Db,
  bucket: string,
  limit: number,
  windowSeconds: number,
  opts: { durable?: boolean } = {},
): Promise<void> {
  const now = nowSeconds();
  const resetAt = now + windowSeconds;

  const hit = memory.get(bucket);
  if (hit && hit.resetAt > now) {
    if (hit.count >= limit) throw ApiError.rateLimited('تعداد درخواست‌های شما بیش از حد مجاز است. کمی صبر کنید.', hit.resetAt - now);
    hit.count += 1;
    if (memory.size > 5000) memory.clear();
    return;
  }
  memory.set(bucket, { count: 1, resetAt });

  if (!opts.durable) return;
  const windowStart = now - windowSeconds;
  const row = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM rate_limits WHERE bucket = ${bucket} AND window_at > ${windowStart}`,
  );
  const count = Number(row?.c ?? 0);
  if (count >= limit) {
    throw ApiError.rateLimited('سقف درخواست‌های این عملیات پر شده است. کمی بعد دوباره تلاش کنید.', Math.max(1, windowSeconds - (now % windowSeconds)));
  }
  await db.run(sql`INSERT INTO rate_limits (bucket, window_at, created_at) VALUES (${bucket}, ${now}, ${now})`);
}

export function resetRateLimitMemory() {
  memory.clear();
}
