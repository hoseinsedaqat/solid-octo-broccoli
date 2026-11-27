import type { BattleParams } from '@ww/shared';
import { clamp } from './economy';

/**
 * Abstract, turn-based war resolution.
 *
 * This is a game mechanic only: every number is a virtual score of the strategy
 * game. No real-world operational data, units, tactics or instructions are used
 * or represented anywhere in this module.
 */

/** deterministic PRNG (mulberry32) so a battle can be replayed from its seed */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Combatant {
  nationId: number;
  /** raw offensive score (attacker) */
  attackPower: number;
  /** raw defensive score (defender) */
  defensePower: number;
  troopsCount: number;
  equipmentCount: number;
  treasury: number;
  /** score shared by alliance partners (defender side) */
  allianceSupport: number;
  fortificationLevel: number;
  morale: number;
}

export interface RoundResult {
  roundNo: number;
  attackerPower: number;
  defenderPower: number;
  attackerWinChance: number;
  attackerWonRound: boolean;
  attackerLosses: number;
  defenderLosses: number;
  attackerRemaining: number;
  defenderRemaining: number;
}

export interface BattleOutcome {
  finished: boolean;
  winner: 'attacker' | 'defender' | 'draw' | null;
  rounds: RoundResult[];
  attackerRemaining: number;
  defenderRemaining: number;
  attackerLosses: number;
  defenderLosses: number;
  attackerLossRatio: number;
  defenderLossRatio: number;
  /** share of each category's stock destroyed (used to shrink inventory) */
  attackerLossesByCategory: Record<string, number>;
  defenderLossesByCategory: Record<string, number>;
  indemnity: number;
  rolls: number[];
}

export function effectivePower(
  side: 'attacker' | 'defender',
  combatant: Combatant,
  params: BattleParams,
  random: number,
): number {
  const base = side === 'attacker' ? combatant.attackPower : combatant.defensePower;
  const advantage = side === 'attacker' ? params.attackerAdvantage : params.defenderAdvantage;
  const fortification = side === 'defender' ? 1 + clamp(combatant.fortificationLevel, 0, 20) * 0.02 : 1;
  const support = side === 'defender' ? 1 + clamp(combatant.allianceSupport, 0, 1) : 1;
  const morale = clamp(combatant.morale, 0.5, 1.5);
  const jitter = 1 + (random * 2 - 1) * clamp(params.warRandomness, 0, 0.5);
  return Math.max(0, base * advantage * fortification * support * morale * jitter);
}

export interface PreviewResult {
  attackerWinChance: number;
  defenderWinChance: number;
  expectedRounds: number;
  expectedLossPercent: number;
  entryCost: number;
  suggestedIndemnity: number;
}

export function previewBattle(attacker: Combatant, defender: Combatant, params: BattleParams): PreviewResult {
  const att = attacker.attackPower * params.attackerAdvantage;
  const def = defender.defensePower * params.defenderAdvantage * (1 + clamp(defender.fortificationLevel, 0, 20) * 0.02) * (1 + clamp(defender.allianceSupport, 0, 1));
  const chance = att + def <= 0 ? 0.5 : att / (att + def);
  const ratio = att + def <= 0 ? 1 : att / Math.max(att, def);
  const expectedRounds = Math.max(1, Math.min(params.maxRounds, Math.round(params.maxRounds * (1 - clamp(ratio, 0, 1) * 0.6))));
  const lossPercent = clamp(params.damagePerRound * 100 * expectedRounds * (1 - chance), 0, 90);
  return {
    attackerWinChance: round4(chance),
    defenderWinChance: round4(1 - chance),
    expectedRounds,
    expectedLossPercent: Math.round(lossPercent),
    entryCost: Math.round(attacker.treasury * clamp(params.warEntryTaxRate, 0, 0.5)),
    suggestedIndemnity: Math.round((att + def) * 0.05 * params.indemnityPerPoint),
  };
}

export interface SimulateInput {
  attacker: Combatant;
  defender: Combatant;
  params: BattleParams;
  seed: number;
  /** category -> quantity, needed to distribute losses proportionally */
  attackerCategories?: Record<string, number>;
  defenderCategories?: Record<string, number>;
  /** number of rounds to run (default: until finish or maxRounds) */
  rounds?: number;
}

/**
 * Simulates a war. `startStrength` lets the scheduler continue an ongoing war
 * across cron runs without re-rolling history.
 */
export function simulateBattle(input: SimulateInput): BattleOutcome {
  const { attacker, defender, params, seed } = input;
  const rng = mulberry32(seed >>> 0);
  const roundsToRun = input.rounds ?? params.maxRounds;

  let attRemaining = Math.max(0, attacker.attackPower);
  let defRemaining = Math.max(0, defender.defensePower * (1 + clamp(defender.fortificationLevel, 0, 20) * 0.02) * (1 + clamp(defender.allianceSupport, 0, 1) * params.radarSupportBonus * 4));

  const attStart = Math.max(1, attRemaining);
  const defStart = Math.max(1, defRemaining);
  let attLostTotal = 0;
  let defLostTotal = 0;
  const rounds: RoundResult[] = [];
  const rolls: number[] = [];
  const breakdownAtt = input.attackerCategories ?? {};
  const breakdownDef = input.defenderCategories ?? {};
  let attCatRatio = 0;
  let defCatRatio = 0;

  for (let roundNo = 1; roundNo <= roundsToRun; roundNo++) {
    const rAtt = rng();
    const rDef = rng();
    rolls.push(Math.round(rAtt * 10000) / 10000);
    const attPower = attRemaining * params.attackerAdvantage * (1 + (rAtt * 2 - 1) * params.warRandomness) * clamp(attacker.morale, 0.5, 1.5);
    const defPower = defRemaining * params.defenderAdvantage * (1 + (rDef * 2 - 1) * params.warRandomness) * clamp(defender.morale, 0.5, 1.5);
    const chance = attPower + defPower <= 0 ? 0.5 : attPower / (attPower + defPower);
    const roll = rng();
    rolls.push(Math.round(roll * 10000) / 10000);
    const attackerWonRound = roll < chance;

    const margin = attPower + defPower === 0 ? 0 : Math.abs(attPower - defPower) / (attPower + defPower);
    const damage = clamp(params.damagePerRound * (1 + margin), 0.005, 0.6);

    let attackerLosses = 0;
    let defenderLosses = 0;
    if (attackerWonRound) {
      defenderLosses = defRemaining * damage;
      defRemaining = Math.max(0, defRemaining - defenderLosses);
      defLostTotal += defenderLosses;
      defCatRatio = defStart > 0 ? defLostTotal / defStart : 0;
    } else {
      attackerLosses = attRemaining * damage;
      attRemaining = Math.max(0, attRemaining - attackerLosses);
      attLostTotal += attackerLosses;
      attCatRatio = attStart > 0 ? attLostTotal / attStart : 0;
    }
    // the losing side also inflicts proportional attrition on the winner
    const attrition = damage * 0.35;
    if (attackerWonRound) {
      const l = attRemaining * attrition;
      attRemaining = Math.max(0, attRemaining - l);
      attLostTotal += l;
      attCatRatio = attStart > 0 ? attLostTotal / attStart : 0;
      attackerLosses += l;
    } else {
      const l = defRemaining * attrition;
      defRemaining = Math.max(0, defRemaining - l);
      defLostTotal += l;
      defCatRatio = defStart > 0 ? defLostTotal / defStart : 0;
      defenderLosses += l;
    }

    rounds.push({
      roundNo,
      attackerPower: round2(attPower),
      defenderPower: round2(defPower),
      attackerWinChance: round4(chance),
      attackerWonRound,
      attackerLosses: round2(attackerLosses),
      defenderLosses: round2(defenderLosses),
      attackerRemaining: round2(attRemaining),
      defenderRemaining: round2(defRemaining),
    });

    if (attRemaining <= attStart * 0.1 || defRemaining <= defStart * 0.1) break;
  }

  const finished = attRemaining <= attStart * 0.1 || defRemaining <= defStart * 0.1 || rounds.length >= params.maxRounds;
  let winner: BattleOutcome['winner'] = null;
  if (attRemaining <= attStart * 0.1 && defRemaining <= defStart * 0.1) winner = 'draw';
  else if (attRemaining <= attStart * 0.1) winner = 'defender';
  else if (defRemaining <= defStart * 0.1) winner = 'attacker';
  else if (rounds.length >= params.maxRounds || rounds.length >= roundsToRun) {
    if (Math.abs(attRemaining / attStart - defRemaining / defStart) < 0.01) winner = 'draw';
    else winner = attRemaining / attStart > defRemaining / defStart ? 'attacker' : 'defender';
  }

  const loserRemainingRatio = winner === 'attacker' ? defRemaining / defStart : winner === 'defender' ? attRemaining / attStart : 0;
  const destroyedPower = winner === 'draw' ? attLostTotal + defLostTotal : (attStart + defStart) * (1 - loserRemainingRatio) * 0.5;
  const indemnity = Math.max(0, Math.round(destroyedPower * params.indemnityPerPoint));

  return {
    finished,
    winner,
    rounds,
    attackerRemaining: round2(attRemaining),
    defenderRemaining: round2(defRemaining),
    attackerLosses: round2(attLostTotal),
    defenderLosses: round2(defLostTotal),
    attackerLossRatio: round4(clamp(attCatRatio, 0, 1)),
    defenderLossRatio: round4(clamp(defCatRatio, 0, 1)),
    attackerLossesByCategory: allocateLosses(breakdownAtt, attCatRatio),
    defenderLossesByCategory: allocateLosses(breakdownDef, defCatRatio),
    indemnity,
    rolls,
  };
}

/** proportional unit loss per category (integer, never below 0) */
export function allocateLosses(categories: Record<string, number>, ratio: number): Record<string, number> {
  const out: Record<string, number> = {};
  const r = clamp(ratio, 0, 1);
  for (const [key, qty] of Object.entries(categories)) {
    const lost = qty > 0 ? Math.min(qty, Math.floor(qty * r)) : 0;
    if (lost > 0) out[key] = lost;
  }
  return out;
}

function round2(v: number) {
  return Math.round(v * 100) / 100;
}
function round4(v: number) {
  return Math.round(v * 10000) / 10000;
}
