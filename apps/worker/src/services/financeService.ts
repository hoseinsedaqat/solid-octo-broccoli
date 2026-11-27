import { TRANSACTION_TYPE_LABELS_FA, type TransactionType } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { dayKey, nowSeconds, toIso } from '../core/format';
import { adminTxKey, revenueCycleKey, uuid } from '../core/ids';
import { computeNation, type NationRow } from '../db/queries';
import type { SettingsBundle } from '../core/settings';
import { audit } from './auditService';
import { notify as pushNotification } from './notificationService';

/**
 * index of the most recently COMPLETED income cycle.
 * cycle #k covers [anchor + k*cycle, anchor + (k+1)*cycle) and becomes payable
 * at anchor + (k+1)*cycle. Deterministic => replay-safe.
 */
export function completedCycleIndex(anchorAt: number, cycleSeconds: number, now: number): number {
  if (cycleSeconds <= 0) return -1;
  const elapsed = now - anchorAt;
  if (elapsed < cycleSeconds) return -1;
  return Math.floor(elapsed / cycleSeconds) - 1;
}

export interface CreditResult {
  nationId: number;
  status: 'credited' | 'skipped' | 'not_due' | 'no_change';
  cycleIndex: number;
  gross: number;
  tax: number;
  maintenance: number;
  net: number;
  treasuryAfter: number;
}

/**
 * Credits exactly one income cycle to one nation, idempotently.
 *
 * Double payment is impossible because:
 *  1. revenue_cycles has UNIQUE(nation_id, cycle_index);
 *  2. the `transactions` row uses idempotency_key = 'rev:<nation>:<cycle>' and
 *     has a UNIQUE index — if it already exists the whole batch aborts;
 *  3. everything runs inside a single D1 batch (one SQLite transaction).
 */
export async function creditCycle(db: Db, nation: NationRow, settings: SettingsBundle, now = nowSeconds()): Promise<CreditResult> {
  const override = await db.first<{ income_cycle_seconds: number | null }>(
    sql`SELECT income_cycle_seconds FROM nation_settings WHERE nation_id = ${nation.id}`,
  );
  const cycleSeconds = Math.max(60, override?.income_cycle_seconds ?? settings.economy.incomeCycleSeconds);
  const due = completedCycleIndex(nation.income_anchor_at, cycleSeconds, now);
  const lastCredited = Number(nation.last_income_cycle ?? -1);
  if (due <= lastCredited) {
    return { nationId: nation.id, status: 'not_due', cycleIndex: lastCredited, gross: 0, tax: 0, maintenance: 0, net: 0, treasuryAfter: nation.treasury };
  }
  const cycleIndex = lastCredited + 1; // oldest-first, one per call => resumable
  const computed = await computeNation(db, nation, settings);
  const { grossIncome, taxCost, maintenanceCost } = computed.income;

  let net = grossIncome - taxCost - maintenanceCost;
  if (net < 0) net = -Math.min(-net, nation.treasury); // never push the treasury below zero (DB CHECK mirrors this)

  const key = revenueCycleKey(nation.id, cycleIndex);
  const txUuid = uuid();
  const at = nowSeconds();

  if (net === 0) {
    await db.batch([
      sql`INSERT OR IGNORE INTO revenue_cycles (nation_id, cycle_index, cycle_key, gross_amount, tax_amount, maintenance_amount, net_amount, status, computed_at, credited_at)
           VALUES (${nation.id}, ${cycleIndex}, ${key}, ${grossIncome}, ${taxCost}, ${maintenanceCost}, 0, 'skipped', ${at}, ${at})`,
      sql`UPDATE nations SET last_income_cycle = ${cycleIndex}, last_income_at = ${at}, updated_at = ${at} WHERE id = ${nation.id}`,
    ]);
    return { nationId: nation.id, status: 'skipped', cycleIndex, gross: grossIncome, tax: taxCost, maintenance: maintenanceCost, net: 0, treasuryAfter: nation.treasury };
  }

  try {
    await db.batch([
      sql`INSERT OR IGNORE INTO revenue_cycles (nation_id, cycle_index, cycle_key, gross_amount, tax_amount, maintenance_amount, net_amount, status, computed_at)
           VALUES (${nation.id}, ${cycleIndex}, ${key}, ${grossIncome}, ${taxCost}, ${maintenanceCost}, ${net}, 'pending', ${at})`,
      sql`UPDATE nations
             SET treasury = treasury + COALESCE((SELECT net_amount FROM revenue_cycles WHERE cycle_key = ${key} AND status = 'pending'), 0),
                 last_income_cycle = ${cycleIndex},
                 last_income_at = ${at},
                 updated_at = ${at}
           WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${txUuid}, ${nation.id}, 'revenue', ${net}, ${nation.treasury},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), 'coin',
                   ${key}, 'revenue_cycle',
                   (SELECT id FROM revenue_cycles WHERE cycle_key = ${key}),
                   ${`درآمد دوره ${cycleIndex + 1}`},
                   ${JSON.stringify({ gross: grossIncome, tax: taxCost, maintenance: maintenanceCost })}, ${at})`,
      sql`UPDATE revenue_cycles
              SET status = 'credited', credited_at = ${at},
                  transaction_id = (SELECT id FROM transactions WHERE idempotency_key = ${key})
            WHERE cycle_key = ${key} AND status = 'pending'`,
      sql`UPDATE nation_economy
              SET total_income = total_income + ${Math.max(0, net)},
                  total_tax = total_tax + ${taxCost},
                  updated_at = ${at}
            WHERE nation_id = ${nation.id}`,
      sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
           VALUES (${nation.id}, ${dayKey(at)},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), ${net},
                   (SELECT military_power FROM nations WHERE id = ${nation.id}),
                   (SELECT equipment_count FROM nations WHERE id = ${nation.id}), ${at})
           ON CONFLICT (nation_id, day) DO UPDATE SET
             treasury = excluded.treasury, income = nation_stat_history.income + excluded.income,
             power = excluded.power, equipment = excluded.equipment`,
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed: (revenue_cycles|transactions)/i.test(message)) {
      const balance = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
      return { nationId: nation.id, status: 'no_change', cycleIndex, gross: grossIncome, tax: taxCost, maintenance: maintenanceCost, net: 0, treasuryAfter: Number(balance?.treasury ?? nation.treasury) };
    }
    throw err;
  }

  const balance = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  return {
    nationId: nation.id,
    status: 'credited',
    cycleIndex,
    gross: grossIncome,
    tax: taxCost,
    maintenance: maintenanceCost,
    net,
    treasuryAfter: Number(balance?.treasury ?? nation.treasury),
  };
}

export interface TxRow {
  id: number;
  uuid: string;
  type: TransactionType;
  typeLabelFa: string;
  amount: number;
  balanceBefore: number | null;
  balanceAfter: number | null;
  reason: string | null;
  referenceType: string | null;
  referenceId: number | null;
  createdAt: string | null;
  items: { nameFa: string; quantity: number; unitPrice: number | null; totalPrice: number | null }[];
}

export async function listTransactions(
  db: Db,
  nationId: number,
  opts: { limit?: number; offset?: number; type?: string | null } = {},
): Promise<{ rows: TxRow[]; nextOffset: number | null }> {
  const limit = Math.min(100, Math.max(1, opts.limit ?? 25));
  const offset = Math.max(0, opts.offset ?? 0);
  const where = opts.type && opts.type !== 'all' ? 'AND t.type = ?' : '';
  const bindings = [nationId, ...(opts.type && opts.type !== 'all' ? [opts.type] : []), limit + 1, offset];
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT t.* FROM transactions t WHERE t.nation_id = ? ${where} ORDER BY t.id DESC LIMIT ? OFFSET ?`,
    bindings,
  });
  const page = rows.slice(0, limit);
  const ids = page.map((r) => Number(r.id));
  const items = ids.length
    ? await db.all<Record<string, unknown>>(
        sql`SELECT transaction_id, name_snapshot, quantity, unit_price, total_price
              FROM transaction_items WHERE transaction_id IN (${ids})`,
      )
    : [];
  const byTx = new Map<number, TxRow['items'][number][]>();
  for (const it of items) {
    const list = byTx.get(Number(it.transaction_id)) ?? [];
    list.push({
      nameFa: String(it.name_snapshot),
      quantity: Number(it.quantity),
      unitPrice: it.unit_price === null ? null : Number(it.unit_price),
      totalPrice: it.total_price === null ? null : Number(it.total_price),
    });
    byTx.set(Number(it.transaction_id), list);
  }
  return {
    rows: page.map((r) => ({
      id: Number(r.id),
      uuid: String(r.uuid),
      type: r.type as TransactionType,
      typeLabelFa: TRANSACTION_TYPE_LABELS_FA[r.type as TransactionType] ?? String(r.type),
      amount: Number(r.amount),
      balanceBefore: r.balance_before === null ? null : Number(r.balance_before),
      balanceAfter: r.balance_after === null ? null : Number(r.balance_after),
      reason: (r.reason as string) ?? null,
      referenceType: (r.reference_type as string) ?? null,
      referenceId: r.reference_id === null ? null : Number(r.reference_id),
      createdAt: toIso(Number(r.created_at)),
      items: byTx.get(Number(r.id)) ?? [],
    })),
    nextOffset: rows.length > limit ? offset + limit : null,
  };
}

export async function treasuryHistory(db: Db, nationId: number, days = 30) {
  const rows = await db.all<{ day: string; treasury: number; income: number; power: number; equipment: number }>(
    sql`SELECT day, treasury, income, power, equipment FROM nation_stat_history
          WHERE nation_id = ${nationId} ORDER BY day DESC LIMIT ${Math.min(365, Math.max(2, days))}`,
  );
  const history = rows.reverse();
  if (history.length > 0) return history;
  // fall back to a reconstruction from the ledger when no snapshots exist yet
  return db.all<{ day: string; treasury: number; income: number }>(
    sql`SELECT strftime('%Y-%m-%d', created_at, 'unixepoch') AS day,
               SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income,
               SUM(amount) AS treasury
          FROM transactions WHERE nation_id = ${nationId}
         GROUP BY day ORDER BY day ASC LIMIT ${Math.min(365, Math.max(2, days))}`,
  );
}

/** admin: add / remove coins with a mandatory reason (append-only ledger) */
export async function adminAdjustTreasury(
  db: Db,
  nation: NationRow,
  delta: number,
  reason: string,
  actor: { userId: number; telegramId: number },
): Promise<{ treasuryBefore: number; treasuryAfter: number }> {
  if (!Number.isInteger(delta) || delta === 0) throw ApiError.validation('مقدار تغییر نامعتبر است.');
  if (reason.trim().length < 3) throw ApiError.validation('ثبت دلیل برای اصلاح مالی الزامی است.');
  const at = nowSeconds();
  const key = adminTxKey(delta > 0 ? 'credit' : 'debit', nation.id, at, uuid().slice(0, 8));
  const type: TransactionType = delta > 0 ? 'admin_credit' : 'admin_debit';
  try {
    await db.batch([
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, reason, created_by_user_id, created_at)
           VALUES (${uuid()}, ${nation.id}, ${type}, ${delta}, ${nation.treasury}, ${nation.treasury + delta}, 'coin', ${key},
                   'admin', ${actor.userId}, ${reason.trim()}, ${actor.userId}, ${at})`,
      sql`UPDATE nations SET treasury = treasury + ${delta}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`UPDATE nation_economy
              SET total_income = total_income + CASE WHEN ${delta} > 0 THEN ${delta} ELSE 0 END,
                  total_spent  = total_spent  + CASE WHEN ${delta} < 0 THEN ${-delta} ELSE 0 END,
                  updated_at = ${at}
            WHERE nation_id = ${nation.id}`,
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('check constraint')) {
      throw ApiError.validation('کاهش موجودی باعث منفی شدن خزانه می‌شود و مجاز نیست.');
    }
    throw err;
  }
  const after = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  await audit(db, {
    actor,
    action: 'economy.adjust_treasury',
    targetType: 'nation',
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: Number(after?.treasury ?? 0), delta },
    reason: reason.trim(),
  });
  await pushNotification(db, {
    nationId: nation.id,
    kind: 'admin',
    title: delta > 0 ? 'افزایش خزانه توسط مدیر' : 'کاهش خزانه توسط مدیر',
    body: `${delta > 0 ? '+' : ''}${delta.toLocaleString('en-US')} سکه — دلیل: ${reason.trim()}`,
  });
  return { treasuryBefore: nation.treasury, treasuryAfter: Number(after?.treasury ?? 0) };
}

export async function adminSetIncome(
  db: Db,
  nation: NationRow,
  patch: { factoryIncome?: number; mineIncome?: number; upkeepBase?: number },
  reason: string,
  settings: SettingsBundle,
  actor: { userId: number; telegramId: number },
) {
  const at = nowSeconds();
  const sets: string[] = [];
  const bindings: unknown[] = [];
  for (const [col, value] of [
    ['factory_income', patch.factoryIncome],
    ['mine_income', patch.mineIncome],
    ['upkeep_base', patch.upkeepBase],
  ] as const) {
    if (value === undefined) continue;
    if (!Number.isInteger(value) || (value as number) < 0) throw ApiError.validation('مقادیر درآمد و هزینه نگهداری باید عدد صحیح غیرمنفی باشند.');
    sets.push(`${col} = ?`);
    bindings.push(value);
  }
  if (sets.length === 0) throw ApiError.validation('هیچ تغییری ارسال نشده است.');
  if (reason.trim().length < 3) throw ApiError.validation('ثبت دلیل الزامی است.');
  bindings.push(at, nation.id);
  await db.run({
    sql: `UPDATE nation_economy SET ${sets.join(', ')}, updated_at = ? WHERE nation_id = ?`,
    bindings,
  });
  const updated = await db.first<{ factory_income: number; mine_income: number }>(
    sql`SELECT factory_income, mine_income FROM nation_economy WHERE nation_id = ${nation.id}`,
  );
  await db.run(
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                  reference_type, reference_id, reason, created_by_user_id, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, 'admin_correction', 0, ${nation.treasury}, ${nation.treasury}, 'coin', ${adminTxKey('income', nation.id, at, uuid().slice(0, 8))},
                 'economy', NULL, ${reason.trim()}, ${actor.userId}, ${JSON.stringify({ ...patch })}, ${at})`,
  );
  await refreshNationStatsAfterIncomeChange(db, nation, settings);
  await audit(db, {
    actor,
    action: 'economy.set_income',
    targetType: 'nation',
    targetId: nation.id,
    before: { factoryIncome: (await loadIncome(db, nation.id))?.factory_income },
    after: { ...patch, factory_income: updated?.factory_income, mine_income: updated?.mine_income },
    reason: reason.trim(),
  });
  return updated;
}

async function loadIncome(db: Db, nationId: number) {
  return db.first<{ factory_income: number; mine_income: number; upkeep_base: number }>(
    sql`SELECT factory_income, mine_income, upkeep_base FROM nation_economy WHERE nation_id = ${nationId}`,
  );
}

async function refreshNationStatsAfterIncomeChange(db: Db, nation: NationRow, settings: SettingsBundle) {
  const { refreshNationStats } = await import('../db/queries');
  await refreshNationStats(db, nation, settings);
}

export async function globalMoneyStats(db: Db) {
  const row = await db.first<{ total_treasury: number | null; total_income: number | null; total_tx: number | null }>(
    sql`SELECT (SELECT COALESCE(SUM(treasury),0) FROM nations) AS total_treasury,
               (SELECT COALESCE(SUM(gross_income),0) FROM nation_economy) AS total_income,
               (SELECT COUNT(*) FROM transactions) AS total_tx`,
  );
  return {
    totalTreasury: Number(row?.total_treasury ?? 0),
    totalIncomePerCycle: Number(row?.total_income ?? 0),
    transactionCount: Number(row?.total_tx ?? 0),
  };
}
