import { BANK_LOAN } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { dayKey, nowSeconds, toIso } from '../core/format';
import type { SettingsBundle } from '../core/settings';
import { uuid } from '../core/ids';
import { computeNation, loadNation, type NationRow } from '../db/queries';
import { completedCycleIndex, creditCycle } from './financeService';
import { audit } from './auditService';
import { notify } from './notificationService';

export interface PendingIncome {
  /** due-but-uncollected cycles */
  cycles: number;
  /** what the «دریافت درآمد» button will pay (simulated exactly, no writes) */
  amount: number;
  netPerCycle: number;
  cycleSeconds: number;
}

/**
 * Income is claim-based: cycles complete on schedule but are only paid out when
 * the player taps «دریافت درآمد» in بانک مرکزی (the reference-game flow).
 * The simulation mirrors creditCycle exactly (same clamping), so the number on
 * the button is the number that lands in the treasury.
 */
export async function pendingIncome(db: Db, nation: NationRow, settings: SettingsBundle, now = nowSeconds()): Promise<PendingIncome> {
  const override = await db.first<{ income_cycle_seconds: number | null }>(
    sql`SELECT income_cycle_seconds FROM nation_settings WHERE nation_id = ${nation.id}`,
  );
  const cycleSeconds = Math.max(60, override?.income_cycle_seconds ?? settings.economy.incomeCycleSeconds);
  const due = completedCycleIndex(nation.income_anchor_at, cycleSeconds, now);
  const lastCredited = Number(nation.last_income_cycle ?? -1);
  const cycles = Math.max(0, due - lastCredited);
  if (cycles <= 0) return { cycles: 0, amount: 0, netPerCycle: 0, cycleSeconds };
  const computed = await computeNation(db, nation, settings);
  const rawNet = computed.income.netIncome;
  let sim = nation.treasury;
  let total = 0;
  for (let i = 0; i < cycles; i++) {
    let net = rawNet;
    if (net < 0) net = -Math.min(-net, sim);
    sim += net;
    total += net;
  }
  return { cycles, amount: total, netPerCycle: rawNet, cycleSeconds };
}

/** collects every completed (uncollected) income cycle, oldest first */
export async function claimIncome(db: Db, nation: NationRow, settings: SettingsBundle, now = nowSeconds()) {
  let current = nation;
  let cycles = 0;
  let total = 0;
  for (let i = 0; i < 240; i++) {
    const res = await creditCycle(db, current, settings, now);
    if (res.status === 'credited') {
      cycles++;
      total += res.net;
      current = await loadNation(db, nation.id);
      continue;
    }
    if (res.status === 'skipped') {
      current = await loadNation(db, nation.id);
      continue;
    }
    break; // not_due / no_change
  }
  return { cycles, total, treasury: current.treasury };
}

export interface LoanRow {
  id: number;
  principal: number;
  interest_rate: number;
  repay_amount: number;
  status: string;
  created_at: number;
  due_at: number;
  repaid_at: number | null;
}

export async function activeLoan(db: Db, nationId: number): Promise<LoanRow | null> {
  return db.first<LoanRow>(sql`SELECT * FROM nation_loans WHERE nation_id = ${nationId} AND status = 'active'`);
}

export async function bankState(db: Db, nation: NationRow, settings: SettingsBundle, now = nowSeconds()) {
  const [pending, loan] = await Promise.all([pendingIncome(db, nation, settings, now), activeLoan(db, nation.id)]);
  const daysLeft = loan ? Math.ceil((Number(loan.due_at) - now) / 86400) : null;
  return {
    treasury: nation.treasury,
    pendingIncome: pending,
    activeLoan: loan
      ? {
          principal: Number(loan.principal),
          repayAmount: Number(loan.repay_amount),
          interestRate: Number(loan.interest_rate),
          createdAt: toIso(Number(loan.created_at)),
          dueAt: toIso(Number(loan.due_at)),
          daysLeft,
          overdue: now > Number(loan.due_at),
        }
      : null,
    loanOptions: BANK_LOAN.options.map((principal) => ({
      principal,
      interestRate: BANK_LOAN.interestRate,
      repayAmount: principal + Math.round(principal * BANK_LOAN.interestRate),
      termDays: BANK_LOAN.termDays,
    })),
    canTakeLoan: !loan,
  };
}

/** grants one of the documented loan options; one active loan per nation (DB-enforced) */
export async function takeLoan(db: Db, nation: NationRow, principal: number, now = nowSeconds()) {
  const allowed = BANK_LOAN.options.find((o) => o === principal);
  if (!allowed) throw ApiError.validation('مبلغ وام منتخب معتبر نیست.');
  const repayAmount = allowed + Math.round(allowed * BANK_LOAN.interestRate);
  const existing = await activeLoan(db, nation.id);
  if (existing) throw ApiError.conflict('شما یک وام فعال دارید؛ تا تسویه آن امکان دریافت وام جدید وجود ندارد.');
  const at = now;
  const dueAt = at + BANK_LOAN.termDays * 86400;
  const idempotencyKey = `loan:${nation.id}:${uuid().slice(0, 12)}`;
  try {
    await db.batch([
      sql`INSERT INTO nation_loans (nation_id, principal, interest_rate, repay_amount, status, created_at, due_at)
           VALUES (${nation.id}, ${allowed}, ${BANK_LOAN.interestRate}, ${repayAmount}, 'active', ${at}, ${dueAt})`,
      sql`UPDATE nations SET treasury = treasury + ${allowed}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${uuid()}, ${nation.id}, 'loan_disbursement', ${allowed}, ${nation.treasury}, ${nation.treasury + allowed}, 'coin',
                   ${idempotencyKey}, 'nation_loan',
                   (SELECT id FROM nation_loans WHERE nation_id = ${nation.id} AND status = 'active' ORDER BY id DESC LIMIT 1),
                   ${`دریافت وام بانکی ${allowed.toLocaleString('en-US')} سکه‌ای`},
                   ${JSON.stringify({ principal: allowed, interestRate: BANK_LOAN.interestRate, repayAmount, dueAt })}, ${at})`,
      sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
           VALUES (${nation.id}, ${dayKey(at)},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), 0,
                   (SELECT military_power FROM nations WHERE id = ${nation.id}),
                   (SELECT equipment_count FROM nations WHERE id = ${nation.id}), ${at})
           ON CONFLICT (nation_id, day) DO UPDATE SET treasury = excluded.treasury`,
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed/i.test(message)) {
      throw ApiError.conflict('شما یک وام فعال دارید؛ تا تسویه آن امکان دریافت وام جدید وجود ندارد.');
    }
    throw err;
  }
  const after = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  await audit(db, {
    actor: null,
    action: 'bank.take_loan',
    targetType: 'nation',
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: Number(after?.treasury ?? 0), principal: allowed, dueAt },
    reason: 'وام بانکی',
  });
  await notify(db, {
    nationId: nation.id,
    kind: 'bank',
    title: 'وام بانکی دریافت شد',
    body: `وام ${allowed.toLocaleString('en-US')} سکه‌ای به خزانه واریز شد. مبلغ بازپرداخت ${repayAmount.toLocaleString('en-US')} سکه (سود ۱۰٪) تا ${new Date(dueAt * 1000).toISOString().slice(0, 10)}.`,
  });
  return { principal: allowed, repayAmount, dueAt, treasury: Number(after?.treasury ?? nation.treasury + allowed) };
}

/** repays the active loan early or on due date; treasury may never go negative.
 *  Optional `partial` pays a smaller amount against the outstanding repay amount (the «پرداخت بدهی» screen). */
export async function repayLoan(db: Db, nation: NationRow, now = nowSeconds(), partial?: number) {
  const loan = await activeLoan(db, nation.id);
  if (!loan) throw ApiError.validation('وامی برای بازپرداخت ندارید.');
  const fullAmount = Number(loan.repay_amount);
  const repayAmount = partial === undefined ? fullAmount : Math.floor(Number(partial));
  if (!Number.isFinite(repayAmount) || repayAmount <= 0) throw ApiError.validation('مبلغ بازپرداخت نامعتبر است.');
  if (repayAmount > fullAmount) throw ApiError.validation('مبلغ بازپرداخت بیشتر از باقی‌ماندهٔ بدهی است.');
  if (nation.treasury < repayAmount) {
    throw ApiError.validation(`موجودی خزانه (${nation.treasury.toLocaleString('en-US')} سکه) برای بازپرداخت وام (${repayAmount.toLocaleString('en-US')} سکه) کافی نیست.`);
  }
  const isPartial = repayAmount < fullAmount;
  const at = now;
  const idempotencyKey = isPartial ? `loan-repay:${loan.id}:${at}:${repayAmount}` : `loan-repay:${loan.id}`;
  try {
    await db.batch([
      isPartial
        ? sql`UPDATE nation_loans SET repay_amount = repay_amount - ${repayAmount} WHERE id = ${loan.id} AND status = 'active' AND repay_amount >= ${repayAmount}`
        : sql`UPDATE nation_loans SET status = 'repaid', repaid_at = ${at} WHERE id = ${loan.id} AND status = 'active'`,
      sql`UPDATE nations SET treasury = treasury - ${repayAmount}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${uuid()}, ${nation.id}, 'loan_repayment', ${-repayAmount}, ${nation.treasury}, ${nation.treasury - repayAmount}, 'coin',
                   ${idempotencyKey}, 'nation_loan', ${loan.id},
                   ${`تسویه وام بانکی ${Number(loan.principal).toLocaleString('en-US')} سکه‌ای (سود ۱۰٪)`},
                   ${JSON.stringify({ principal: Number(loan.principal), interestRate: Number(loan.interest_rate), repayAmount })}, ${at})`,
      sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
           VALUES (${nation.id}, ${dayKey(at)},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), 0,
                   (SELECT military_power FROM nations WHERE id = ${nation.id}),
                   (SELECT equipment_count FROM nations WHERE id = ${nation.id}), ${at})
           ON CONFLICT (nation_id, day) DO UPDATE SET treasury = excluded.treasury`,
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed/i.test(message)) {
      throw ApiError.validation('این وام قبلاً تسویه شده است.');
    }
    if (message.toLowerCase().includes('check constraint')) {
      throw ApiError.validation('بازپرداخت باعث منفی شدن خزانه می‌شود و مجاز نیست.');
    }
    throw err;
  }
  const after = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  await audit(db, {
    actor: null,
    action: 'bank.repay_loan',
    targetType: 'nation',
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: Number(after?.treasury ?? 0), repayAmount },
    reason: isPartial ? 'پرداخت جزئی بدهی بانکی' : 'تسویه وام بانکی',
  });
  return { repayAmount, partial: isPartial, remaining: isPartial ? fullAmount - repayAmount : 0, treasury: Number(after?.treasury ?? nation.treasury - repayAmount) };
}

/** تاریخچهٔ همهٔ وام‌های کشور — برای صفحهٔ «تاریخچه وام‌ها» */
export async function listLoans(db: Db, nationId: number, limit = 20) {
  const rows = await db.all<{ id: number; principal: number; repay_amount: number; interest_rate: number; status: string; created_at: number; due_at: number; repaid_at: number | null }>(
    sql`SELECT id, principal, repay_amount, interest_rate, status, created_at, due_at, repaid_at
          FROM nation_loans WHERE nation_id = ${nationId} ORDER BY id DESC LIMIT ${Math.min(50, Math.max(1, limit))}`,
  );
  return {
    loans: rows.map((r) => ({
      id: Number(r.id),
      principal: Number(r.principal),
      repayAmount: Number(r.repay_amount),
      interestRate: Number(r.interest_rate),
      status: String(r.status),
      statusLabelFa: String(r.status) === 'active' ? 'فعال' : String(r.status) === 'repaid' ? 'تسویه‌شده' : String(r.status),
      createdAt: toIso(Number(r.created_at)),
      dueAt: toIso(Number(r.due_at)),
      repaidAt: r.repaid_at ? toIso(Number(r.repaid_at)) : null,
    })),
  };
}
