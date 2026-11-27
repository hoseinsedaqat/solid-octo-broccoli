import { describe, expect, it } from 'vitest';
import { DEFAULT_BATTLE_PARAMS } from '@ww/shared';
import {
  allocateLosses,
  effectivePower,
  mulberry32,
  previewBattle,
  simulateBattle,
  type Combatant,
} from '../../apps/worker/src/game-engine/battle';

const params = DEFAULT_BATTLE_PARAMS;

const side = (over: Partial<Combatant> = {}): Combatant => ({
  nationId: 1,
  attackPower: 1000,
  defensePower: 1000,
  troopsCount: 10_000,
  equipmentCount: 500,
  treasury: 1_000_000,
  allianceSupport: 0,
  fortificationLevel: 0,
  morale: 1,
  ...over,
});

describe('deterministic rng', () => {
  it('replays identically from the same seed', () => {
    expect([...Array(5)].map(mulberry32(42))).toEqual([...Array(5)].map(mulberry32(42)));
  });
  it('stays inside [0,1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 500; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('battle preview', () => {
  it('gives the stronger attacker a higher win chance', () => {
    const strong = previewBattle(side({ attackPower: 3000 }), side({ defensePower: 1000 }), params);
    const even = previewBattle(side({ attackPower: 1000 }), side({ defensePower: 1000 }), params);
    expect(strong.attackerWinChance).toBeGreaterThan(even.attackerWinChance);
    expect(strong.attackerWinChance).toBeGreaterThan(0.5);
    expect(Math.round((strong.attackerWinChance + strong.defenderWinChance) * 1000)).toBe(1000);
  });

  it('rewards defender fortification and alliance support', () => {
    const base = previewBattle(side(), side(), params).attackerWinChance;
    const fortified = previewBattle(side(), side({ fortificationLevel: 20 }), params).attackerWinChance;
    const allied = previewBattle(side(), side({ allianceSupport: 1 }), params).attackerWinChance;
    expect(fortified).toBeLessThan(base);
    expect(allied).toBeLessThan(base);
  });

  it('computes the entry cost from the configured tax rate only', () => {
    expect(previewBattle(side({ treasury: 500_000 }), side(), params).entryCost).toBe(0);
    expect(previewBattle(side({ treasury: 500_000 }), side(), { ...params, warEntryTaxRate: 0.1 }).entryCost).toBe(50_000);
  });
});

describe('battle simulation', () => {
  it('is reproducible: same seed => same report', () => {
    const input = { attacker: side({ attackPower: 2000 }), defender: side({ defensePower: 1200 }), params, seed: 1234 };
    const a = simulateBattle(input);
    const b = simulateBattle(input);
    expect(a).toEqual(b);
  });

  it('a one-sided match ends with a decisive winner and losses on both sides', () => {
    const out = simulateBattle({
      attacker: side({ attackPower: 10_000 }),
      defender: side({ defensePower: 100 }),
      params,
      seed: 99,
      attackerCategories: { tanks: 100, missiles: 20 },
      defenderCategories: { tanks: 10 },
    });
    expect(out.winner).toBe('attacker');
    expect(out.finished).toBe(true);
    expect(out.defenderLosses).toBeGreaterThan(0);
    expect(out.attackerLossesByCategory.tanks ?? 0).toBeLessThanOrEqual(100);
  });

  it('never destroys more than the stock a nation owns', () => {
    const out = simulateBattle({
      attacker: side({ attackPower: 50_000 }),
      defender: side({ defensePower: 10 }),
      params: { ...params, damagePerRound: 0.5, maxRounds: 50 },
      seed: 5,
      defenderCategories: { tanks: 50, soldiers: 10_000 },
    });
    expect(out.defenderLossesByCategory.tanks ?? 0).toBeLessThanOrEqual(50);
    expect(out.defenderLossesByCategory.soldiers ?? 0).toBeLessThanOrEqual(10_000);
  });

  it('respects the maxRounds cap', () => {
    const out = simulateBattle({ attacker: side(), defender: side(), params: { ...params, maxRounds: 3 }, seed: 11 });
    expect(out.rounds.length).toBeLessThanOrEqual(3);
  });

  it('allocates losses proportionally and never negative', () => {
    const lost = allocateLosses({ tanks: 100, missiles: 10, soldiers: 10_000 }, 0.25);
    expect(lost.tanks).toBe(25);
    expect(lost.missiles).toBe(2);
    expect(lost.soldiers).toBe(2500);
    expect(Object.values(allocateLosses({ tanks: 4 }, 0)).length).toBe(0);
    expect(Object.values(allocateLosses({ tanks: 4 }, -1)).length).toBe(0);
  });

  it('caps controlled randomness so an underdog can still win a round', () => {
    const r = mulberry32(2024);
    let attackerWins = 0;
    for (let i = 0; i < 200; i++) {
      const out = simulateBattle({ attacker: side({ attackPower: 1100 }), defender: side({ defensePower: 1000 }), params, seed: i });
      if (out.winner === 'attacker') attackerWins++;
    }
    expect(attackerWins).toBeGreaterThan(0);
    expect(attackerWins).toBeLessThan(200);
    expect(r()).toBeTypeOf('number');
  });
});

describe('effective power modifiers', () => {
  it('applies the attacker advantage and the defender home bonus', () => {
    const att = effectivePower('attacker', side(), params, 0.5);
    const def = effectivePower('defender', side(), params, 0.5);
    expect(att).toBeCloseTo(1000 * params.attackerAdvantage, 5);
    expect(def).toBeCloseTo(1000 * params.defenderAdvantage, 5);
  });

  it('clamps hostile morale / support inputs instead of trusting callers', () => {
    expect(effectivePower('attacker', side({ morale: -5 }), params, 0.5)).toBeCloseTo(1000 * params.attackerAdvantage * 0.5, 5);
    expect(effectivePower('defender', side({ allianceSupport: 99 }), params, 0.5)).toBeCloseTo(1000 * params.defenderAdvantage * 2, 5);
  });
});
