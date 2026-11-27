import { EQUIPMENT_CATEGORIES } from '@ww/shared';

/**
 * Abstract game scores. Equipment rows may carry explicit attack/defense points;
 * when they are NULL (the seeded default — the design doc does not define them)
 * the admin-tunable per-category power weight is used, so the game is playable
 * out of the box while the admin keeps full control.
 */

export interface InventoryRow {
  templateId: number;
  categoryKey: string;
  quantity: number;
  attackPoints: number | null;
  defensePoints: number | null;
}

export interface PowerResult {
  attackPower: number;
  defensePower: number;
  militaryPower: number;
  equipmentCount: number;
  troopsCount: number;
  radarCount: number;
  airDefenseUnits: number;
  byCategory: Record<string, { quantity: number; attack: number; defense: number }>;
}

const ROLE_BY_CATEGORY: Record<string, string> = Object.fromEntries(
  EQUIPMENT_CATEGORIES.map((c) => [c.key, c.role]),
);

export function roleOf(categoryKey: string, fallback = 'offense'): string {
  return ROLE_BY_CATEGORY[categoryKey] ?? fallback;
}

export function computePower(
  rows: InventoryRow[],
  categoryWeights: Record<string, number>,
  opts: { manpowerFactor?: number; fortificationLevel?: number } = {},
): PowerResult {
  const manpowerFactor = opts.manpowerFactor ?? 0.2;
  const byCategory: PowerResult['byCategory'] = {};
  let attackPower = 0;
  let defensePower = 0;
  let equipmentCount = 0;
  let troopsCount = 0;
  let radarCount = 0;
  let airDefenseUnits = 0;

  for (const row of rows) {
    const qty = Math.max(0, row.quantity);
    if (qty === 0) continue;
    const role = roleOf(row.categoryKey);
    const weight = Number(categoryWeights[row.categoryKey] ?? 0);
    const unitAttack = row.attackPoints ?? (role === 'economy' ? 0 : weight);
    const unitDefense = row.defensePoints ?? (role === 'economy' ? 0 : weight);

    const bucket = (byCategory[row.categoryKey] ??= { quantity: 0, attack: 0, defense: 0 });
    let attack = 0;
    let defense = 0;

    if (row.categoryKey === 'soldiers') {
      // manpower: explicit points win, otherwise manpowerFactor per head
      const per = row.attackPoints ?? manpowerFactor;
      attack = qty * per;
      defense = qty * (row.defensePoints ?? manpowerFactor);
      troopsCount += qty;
    } else if (role === 'offense') {
      attack = qty * unitAttack;
      defense = qty * (row.defensePoints ?? 0);
    } else if (role === 'defense') {
      defense = qty * unitDefense;
      attack = qty * (row.attackPoints ?? 0);
      airDefenseUnits += qty;
    } else if (role === 'support') {
      attack = qty * unitAttack * 0.5;
      defense = qty * unitDefense;
      if (row.categoryKey === 'radars') radarCount += qty;
    }
    if (row.categoryKey === 'factories' || row.categoryKey === 'mines') {
      // economy assets never fight, they earn
      attack = 0;
      defense = 0;
    }

    bucket.quantity += qty;
    bucket.attack += attack;
    bucket.defense += defense;
    attackPower += attack;
    defensePower += defense;
    if (role !== 'economy' && row.categoryKey !== 'soldiers') equipmentCount += qty;
  }

  const fortBonus = 1 + Math.max(0, opts.fortificationLevel ?? 0) * 0.02;
  defensePower *= fortBonus;

  for (const key of Object.keys(byCategory)) {
    byCategory[key] = {
      quantity: byCategory[key]!.quantity,
      attack: round2(byCategory[key]!.attack),
      defense: round2(byCategory[key]!.defense),
    };
  }

  return {
    attackPower: round2(attackPower),
    defensePower: round2(defensePower),
    militaryPower: round2(attackPower + defensePower),
    equipmentCount,
    troopsCount,
    radarCount,
    airDefenseUnits,
    byCategory,
  };
}

export function computeEconomicScore(input: {
  treasury: number;
  grossIncome: number;
  netIncome: number;
  factories: number;
  mines: number;
}): number {
  return round2(
    input.grossIncome * 0.5 + input.netIncome * 0.5 + (input.factories + input.mines) * 1000 + input.treasury * 0.01,
  );
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
