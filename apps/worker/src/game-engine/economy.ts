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
  /** sum over owned factories of income_per_cycle x level x quantity (0 when none configured) */
  templateFactoryIncome?: number;
  /** sum over owned mines of income_per_cycle x quantity (0 when none configured) */
  templateMineIncome?: number;
  /** owned factories with NO per-template income (these grow on the flat starter rules) */
  nullIncomeFactories?: number | null;
  /** owned mines with NO per-template income (these grow on the flat starter rules) */
  nullIncomeMines?: number | null;
  /** upkeep for nation police force, added to maintenance (optional; 0/absent => no upkeep) */
  policeUpkeep?: number;
  /** null-income units inside the starter pack (NULL/absent => treat all starter units as flat) */
  starterFlatFactories?: number | null;
  starterFlatMines?: number | null;
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
  // Factories/mines seeded with a catalog income_per_cycle are paid from their own
  // listing instead — they do not also grow on the flat starter rate.
  const flatFactories = snap.nullIncomeFactories ?? snap.factoryCount;
  const flatMines = snap.nullIncomeMines ?? snap.mineCount;
  const starterFlatFactories = snap.starterFlatFactories ?? snap.starterFactoryCount;
  const starterFlatMines = snap.starterFlatMines ?? snap.starterMineCount;
  // the design-doc flat income IS the starter pack's output: it scales down when the nation
  // loses units (any kind) and stays full while the whole pack survives
  const factoryFraction = snap.starterFactoryCount > 0 ? clamp(snap.factoryCount / snap.starterFactoryCount, 0, 1) : 1;
  const mineFraction = snap.starterMineCount > 0 ? clamp(snap.mineCount / snap.starterMineCount, 0, 1) : 1;
  const extraFactories = Math.max(0, flatFactories - starterFlatFactories);
  const extraMines = Math.max(0, flatMines - starterFlatMines);
  const templateFactoryIncome = Math.max(0, snap.templateFactoryIncome ?? 0);
  const templateMineIncome = Math.max(0, snap.templateMineIncome ?? 0);

  const baseFactoryIncome = snap.factoryIncome * factoryFraction;
  const baseMineIncome = snap.mineIncome * mineFraction;
  const factoryIncomeEffective = Math.max(
    0,
    Math.round((baseFactoryIncome + rules.factoryIncomePerUnit * extraFactories + templateFactoryIncome) * multiplier),
  );
  const mineIncomeEffective = Math.max(
    0,
    Math.round((baseMineIncome + rules.mineIncomePerUnit * extraMines + templateMineIncome) * multiplier),
  );

  const grossIncome = Math.max(0, factoryIncomeEffective + mineIncomeEffective);
  const taxRate = clamp(snap.taxRateOverride ?? rules.taxRate, 0, 0.95);
  const taxCost = Math.floor(grossIncome * taxRate);

  const maintenanceCost =
    Math.floor(grossIncome * clamp(rules.maintenanceRate, 0, 0.95)) +
    Math.max(0, snap.upkeepBase) +
    Math.max(0, snap.perUnitMaintenance) +
    Math.max(0, snap.policeUpkeep ?? 0);

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
