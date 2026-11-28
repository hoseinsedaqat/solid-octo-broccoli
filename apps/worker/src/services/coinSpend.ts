import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds } from '../core/format';
import { uuid } from '../core/ids';
import type { NationRow } from '../db/queries';

/**
 * کسر سکه از خزانه + ثبت در دفتر کل + total_spent، همه در یک batch اتمیک.
 * تمام دکمه‌های خرج‌دار بازی دقیقاً از همین مسیر رد می‌شوند تا دفتر مالی همیشه کامل باشد.
 */
export async function spendTreasury(
  db: Db,
  nation: NationRow,
  opts: { amount: number; referenceType: string; reason: string; meta?: Record<string, unknown> | null; idempotencyPrefix?: string; now?: number },
): Promise<number> {
  const amount = Math.max(0, Math.floor(opts.amount));
  const now = opts.now ?? nowSeconds();
  if (nation.treasury < amount) throw ApiError.validation('موجودی ناکافی است.');
  const key = `${opts.idempotencyPrefix ?? 'spend'}:${nation.id}:${opts.referenceType}:${uuid()}`;
  try {
    await db.batch([
      sql`UPDATE nations SET treasury = treasury - ${amount}, updated_at = ${now} WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${uuid()}, ${nation.id}, ${amount > 0 ? 'purchase' : 'revenue'}, ${-amount}, ${nation.treasury}, ${nation.treasury - amount}, 'coin',
                   ${key}, ${opts.referenceType}, NULL, ${opts.reason},
                   ${JSON.stringify(opts.meta ?? null)}, ${now})`,
      sql`UPDATE nation_economy SET total_spent = total_spent + ${amount}, updated_at = ${now} WHERE nation_id = ${nation.id}`,
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('check constraint')) throw ApiError.validation('موجودی ناکافی است.');
    throw err;
  }
  return nation.treasury - amount;
}

/** پرداخت به خزانه + دفتر کل (اعطای جایزه/بازگشت) */
export async function creditTreasury(
  db: Db,
  nation: NationRow,
  opts: { amount: number; referenceType: string; reason: string; meta?: Record<string, unknown> | null; idempotencyPrefix?: string; now?: number },
): Promise<number> {
  const amount = Math.max(0, Math.floor(opts.amount));
  const now = opts.now ?? nowSeconds();
  const key = `${opts.idempotencyPrefix ?? 'credit'}:${nation.id}:${opts.referenceType}:${uuid()}`;
  await db.batch([
    sql`UPDATE nations SET treasury = treasury + ${amount}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                  idempotency_key, reference_type, reference_id, reason, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, 'revenue', ${amount}, ${nation.treasury}, ${nation.treasury + amount}, 'coin',
                 ${key}, ${opts.referenceType}, NULL, ${opts.reason},
                 ${JSON.stringify(opts.meta ?? null)}, ${now})`,
    sql`UPDATE nation_economy SET total_income = total_income + ${amount}, total_spent = total_spent, updated_at = ${now} WHERE nation_id = ${nation.id}`,
  ]);
  return nation.treasury + amount;
}
