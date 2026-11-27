import type { EconomyRules } from '@ww/shared';

/**
 * Pure economy math. Same code path is used by the API (previews), the cron job
 * (crediting) and the admin panel (simulating changes) — the frontend never
 * computes money.
 */

export interface EconomySnapshot {
  factoryIncome: number;
  mineIncome: number;
  starterFactoryCount: number;
  starterMineCount: number;
  factoryCount: number;
  mineCount: number;
  upkeepBase: number;
  /** per-unit maintenance configured on equipment templates, already summed per category */
  perUnitMaintenance: number;
  taxRateOverride?: number | null;
  cycleSecondsOverride?: number | null;
}

export interface IncomeResult {
  factoryIncomeEffective: number;
  mineIncomeEffective: number;
  grossIncome: number;
  taxCost: number;
  maintenanceCost: number;
  netIncome: number;
  cycleSeconds: number;
}

export function computeCycleIncome(snap: EconomySnapshot, rules: EconomyRules): IncomeResult {
  const multiplier = clamp(rules.globalMultiplier, 0, 100);

  // Starter numbers in the design doc are the TOTAL of the section, so growth is
  // only paid for units owned *beyond* the starter pack.
  const extraFactories = snap.factoryCount - snap.starterFactoryCount;
  const extraMines = snap.mineCount - snap.starterMineCount;

  const factoryIncomeEffective = Math.max(
    0,
    Math.round((snap.factoryIncome + rules.factoryIncomePerUnit * extraFactories) * multiplier),
  );
  const mineIncomeEffective = Math.max(0, Math.round((snap.mineIncome + rules.mineIncomePerUnit * extraMines) * multiplier));

  const grossIncome = Math.max(0, factoryIncomeEffective + mineIncomeEffective);
  const taxRate = clamp(snap.taxRateOverride ?? rules.taxRate, 0, 0.95);
  const taxCost = Math.floor(grossIncome * taxRate);

  const maintenanceCost = Math.floor(grossIncome * clamp(rules.maintenanceRate, 0, 0.95)) + Math.max(0, snap.upkeepBase) + Math.max(0, snap.perUnitMaintenance);

  const netIncome = grossIncome - taxCost - maintenanceCost;
  const cycleSeconds = Math.max(60, snap.cycleSecondsOverride ?? rules.incomeCycleSeconds);

  return { factoryIncomeEffective, mineIncomeEffective, grossIncome, taxCost, maintenanceCost, netIncome, cycleSeconds };
}

export function clamp(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

/** how long until the next cycle is credited (UTC seconds) */
export function secondsUntilNextCycle(anchorAt: number, cycleIndex: number, cycleSeconds: number, now: number): number {
  const dueAt = anchorAt + (cycleIndex + 1) * cycleSeconds;
  return Math.max(0, dueAt - now);
}

/** next due cycle index (may equal current if nothing is due) */
export function dueCycleIndex(anchorAt: number, lastCredited: number, cycleSeconds: number, now: number): number {
  if (cycleSeconds <= 0) return lastCredited;
  const elapsed = now - anchorAt;
  if (elapsed < cycleSeconds) return lastCredited;
  const completed = Math.floor(elapsed / cycleSeconds) - 1;
  if (completed <= lastCredited) return lastCredited;
  return completed;
}

export function totalIncomePerCycle(income: { factoryIncomeEffective: number; mineIncomeEffective: number }): number {
  return income.factoryIncomeEffective + income.mineIncomeEffective;
}
