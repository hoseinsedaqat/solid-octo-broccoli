import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ECONOMY_RULES,
  STARTER_ECONOMY,
  FACTORY_COUNT_IN_STARTER,
  MINE_COUNT_IN_STARTER,
  DERIVED_FACTORY_INCOME_PER_UNIT,
  DERIVED_MINE_INCOME_PER_UNIT,
} from '@ww/shared';
import { computeCycleIncome, type EconomySnapshot } from '../../apps/worker/src/game-engine/economy';
import { completedCycleIndex } from '../../apps/worker/src/services/financeService';

const rules = DEFAULT_ECONOMY_RULES;

const starterSnapshot = (over: Partial<EconomySnapshot> = {}): EconomySnapshot => ({
  factoryIncome: STARTER_ECONOMY.factoryIncome,
  mineIncome: STARTER_ECONOMY.mineIncome,
  starterFactoryCount: FACTORY_COUNT_IN_STARTER,
  starterMineCount: MINE_COUNT_IN_STARTER,
  factoryCount: FACTORY_COUNT_IN_STARTER,
  mineCount: MINE_COUNT_IN_STARTER,
  upkeepBase: 0,
  perUnitMaintenance: 0,
  ...over,
});

describe('starter economy (design document values)', () => {
  it('gives a new nation exactly 80 000 coins per cycle (50k factories + 30k mines)', () => {
    const r = computeCycleIncome(starterSnapshot(), rules);
    expect(r.factoryIncomeEffective).toBe(50_000);
    expect(r.mineIncomeEffective).toBe(30_000);
    expect(r.grossIncome).toBe(80_000);
    expect(r.taxCost).toBe(0);
    expect(r.maintenanceCost).toBe(0);
    expect(r.netIncome).toBe(80_000);
    expect(r.cycleSeconds).toBe(86_400);
  });

  it('treats the starter numbers as section totals, not per-unit values', () => {
    expect(STARTER_ECONOMY.factoryIncome).toBe(50_000);
    expect(FACTORY_COUNT_IN_STARTER).toBe(3);
    expect(MINE_COUNT_IN_STARTER).toBe(5);
    // per-unit growth is derived from the document, never invented:
    expect(DERIVED_FACTORY_INCOME_PER_UNIT).toBe(Math.round(50_000 / 3));
    expect(DERIVED_MINE_INCOME_PER_UNIT).toBe(6_000);
  });

  it('pays for factories/mines bought above the starter pack', () => {
    const r = computeCycleIncome(starterSnapshot({ factoryCount: 5, mineCount: 7 }), rules);
    expect(r.factoryIncomeEffective).toBe(50_000 + 2 * DERIVED_FACTORY_INCOME_PER_UNIT);
    expect(r.mineIncomeEffective).toBe(30_000 + 2 * DERIVED_MINE_INCOME_PER_UNIT);
    expect(r.grossIncome).toBe(80_000 + 2 * 16_667 + 2 * 6_000);
  });

  it('reduces factory income when plants are destroyed below the starter count', () => {
    const r = computeCycleIncome(starterSnapshot({ factoryCount: 2 }), rules);
    expect(r.factoryIncomeEffective).toBe(50_000 - DERIVED_FACTORY_INCOME_PER_UNIT);
  });

  it('never goes below zero income even if assets are gone', () => {
    const r = computeCycleIncome(starterSnapshot({ factoryCount: 0, mineCount: 0 }), rules);
    expect(r.factoryIncomeEffective).toBe(0);
    expect(r.mineIncomeEffective).toBe(0);
    expect(r.grossIncome).toBe(0);
  });

  it('applies tax, upkeep base and per-unit maintenance on top of gross income', () => {
    const r = computeCycleIncome(
      starterSnapshot({ upkeepBase: 5_000, perUnitMaintenance: 1_000, taxRateOverride: 0.1 }),
      { ...rules, maintenanceRate: 0.05 },
    );
    expect(r.grossIncome).toBe(80_000);
    expect(r.taxCost).toBe(8_000); // 10% of gross
    expect(r.maintenanceCost).toBe(4_000 + 5_000 + 1_000); // 5% of gross + upkeep base + per unit
    expect(r.netIncome).toBe(80_000 - 8_000 - 10_000);
  });

  it('respects per-nation cycle override and the global multiplier', () => {
    const r = computeCycleIncome(starterSnapshot({ cycleSecondsOverride: 3600 }), { ...rules, globalMultiplier: 2 });
    expect(r.cycleSeconds).toBe(3600);
    expect(r.grossIncome).toBe(160_000);
  });

  it('ignores an invalid cycle override (never shorter than 60s)', () => {
    const r = computeCycleIncome(starterSnapshot({ cycleSecondsOverride: 1 }), rules);
    expect(r.cycleSeconds).toBe(60);
  });
});

describe('income cycle math (cron idempotency foundation)', () => {
  const anchor = 1_700_000_000;
  const cycle = 86_400;

  it('pays nothing before the first cycle completes', () => {
    expect(completedCycleIndex(anchor, cycle, anchor + 10)).toBe(-1);
    expect(completedCycleIndex(anchor, cycle, anchor + cycle - 1)).toBe(-1);
  });

  it('numbers cycles from zero and only for fully elapsed windows', () => {
    expect(completedCycleIndex(anchor, cycle, anchor + cycle)).toBe(0);
    expect(completedCycleIndex(anchor, cycle, anchor + cycle * 2 - 1)).toBe(0);
    expect(completedCycleIndex(anchor, cycle, anchor + cycle * 2)).toBe(1);
    expect(completedCycleIndex(anchor, cycle, anchor + cycle * 5)).toBe(4);
  });

  it('guards against a broken cycle length', () => {
    expect(completedCycleIndex(anchor, 0, anchor + 1e9)).toBe(-1);
  });
});
