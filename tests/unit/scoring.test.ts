import { describe, expect, it } from 'vitest';
import { DEFAULT_CATEGORY_POWER_WEIGHTS, DEFAULT_RANKING_WEIGHTS } from '@ww/shared';
import { computeEconomicScore, computePower } from '../../apps/worker/src/game-engine/scoring';
import { rankNations } from '../../apps/worker/src/game-engine/ranking';

const weights = DEFAULT_CATEGORY_POWER_WEIGHTS;

describe('power scoring', () => {
  it('uses explicit per-item points when the admin has set them', () => {
    const p = computePower([{ templateId: 1, categoryKey: 'tanks', quantity: 10, attackPoints: 7, defensePoints: 1 }], weights);
    expect(p.attackPower).toBe(70);
    expect(p.defensePower).toBe(10);
  });

  it('falls back to the category weight while points are NULL (seeded default)', () => {
    const p = computePower([{ templateId: 1, categoryKey: 'tanks', quantity: 10, attackPoints: null, defensePoints: null }], weights);
    expect(p.attackPower).toBe(10 * weights.tanks!);
    expect(p.defensePower).toBe(0); // tanks are an offensive category
  });

  it('counts defense categories into defence only', () => {
    const p = computePower([{ templateId: 2, categoryKey: 'ground_air_defense', quantity: 20, attackPoints: null, defensePoints: null }], weights);
    expect(p.defensePower).toBe(20 * weights.ground_air_defense!);
    expect(p.attackPower).toBe(0);
    expect(p.airDefenseUnits).toBe(20);
  });

  it('treats manpower separately from equipment count', () => {
    const p = computePower([{ templateId: 3, categoryKey: 'soldiers', quantity: 10_000, attackPoints: null, defensePoints: null }], weights, { manpowerFactor: 0.2 });
    expect(p.troopsCount).toBe(10_000);
    expect(p.equipmentCount).toBe(0);
    expect(p.attackPower).toBe(2000);
  });

  it('never lets economy assets fight, but counts radars for early warning', () => {
    const p = computePower(
      [
        { templateId: 4, categoryKey: 'factories', quantity: 2, attackPoints: null, defensePoints: null },
        { templateId: 5, categoryKey: 'mines', quantity: 3, attackPoints: null, defensePoints: null },
        { templateId: 6, categoryKey: 'radars', quantity: 5, attackPoints: null, defensePoints: null },
      ],
      weights,
    );
    // factories/mines are economy-only; radars are a dual-role category
    expect(p.radarCount).toBe(5);
    expect(p.defensePower).toBe(5 * weights.radars!);
  });

  it('fortification raises defence only', () => {
    const row = { templateId: 2, categoryKey: 'ground_air_defense', quantity: 10, attackPoints: null, defensePoints: null } as const;
    const plain = computePower([row], weights);
    const fortified = computePower([row], weights, { fortificationLevel: 10 });
    expect(fortified.defensePower).toBeCloseTo(plain.defensePower * 1.2, 2);
    expect(fortified.attackPower).toBe(plain.attackPower);
  });

  it('ignores negative quantities', () => {
    const p = computePower([{ templateId: 1, categoryKey: 'tanks', quantity: -50, attackPoints: 10, defensePoints: 10 }], weights);
    expect(p.attackPower).toBe(0);
  });
});

describe('economic score + leaderboard', () => {
  it('rewards income and stockpiles', () => {
    const a = computeEconomicScore({ treasury: 1_000_000, grossIncome: 80_000, netIncome: 80_000, factories: 2, mines: 3 });
    const b = computeEconomicScore({ treasury: 100_000, grossIncome: 10_000, netIncome: 9_000, factories: 1, mines: 1 });
    expect(a).toBeGreaterThan(b);
  });

  it('ranks by total score and supports per-metric sorting', () => {
    const nations = [
      { nationId: 1, name: 'A', flag: '🅰️', leaderName: 'x', treasury: 10, income: 5, militaryPower: 900, equipmentCount: 1, warWins: 0, economicScore: 1 },
      { nationId: 2, name: 'B', flag: '🅱️', leaderName: 'y', treasury: 1000, income: 1, militaryPower: 1, equipmentCount: 1, warWins: 3, economicScore: 1 },
    ];
    const total = rankNations(nations, DEFAULT_RANKING_WEIGHTS);
    expect(total[0]!.rank).toBe(1);
    const richest = rankNations(nations, DEFAULT_RANKING_WEIGHTS, 'treasury');
    expect(richest[0]!.nationId).toBe(2);
    const strongest = rankNations(nations, DEFAULT_RANKING_WEIGHTS, 'military_power');
    expect(strongest[0]!.nationId).toBe(1);
  });

  it('lets admin weights change the winner', () => {
    const nations = [
      { nationId: 1, name: 'A', flag: '', leaderName: '', treasury: 100, income: 0, militaryPower: 0, equipmentCount: 0, warWins: 0, economicScore: 0 },
      { nationId: 2, name: 'B', flag: '', leaderName: '', treasury: 90, income: 1e9, militaryPower: 0, equipmentCount: 0, warWins: 0, economicScore: 0 },
    ];
    expect(rankNations(nations, { treasury: 10, income: 0 })[0]!.nationId).toBe(1);
    expect(rankNations(nations, { treasury: 0, income: 10 })[0]!.nationId).toBe(2);
  });

  it('handles an empty world and ties deterministically', () => {
    expect(rankNations([], {})).toEqual([]);
    const tie = rankNations(
      [
        { nationId: 9, name: 'Z', flag: '', leaderName: '', treasury: 5, income: 0, militaryPower: 0, equipmentCount: 0, warWins: 0, economicScore: 0 },
        { nationId: 3, name: 'Y', flag: '', leaderName: '', treasury: 5, income: 0, militaryPower: 0, equipmentCount: 0, warWins: 0, economicScore: 0 },
      ],
      {},
    );
    expect(tie.map((t) => t.nationId)).toEqual([3, 9]);
  });
});
