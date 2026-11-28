import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds } from '../core/format';
import type { NationRow } from '../db/queries';
import { ensureNationExt } from '../db/queries';
import { audit } from './auditService';
import { spendTreasury } from './coinSpend';

export const ARMY_SECTIONS = [
  { key: 'ground', labelFa: 'نیروی زمینی', emoji: '🪖', categories: ['soldiers', 'tanks', 'apc', 'artillery'] as const },
  { key: 'air', labelFa: 'نیروی هوایی', emoji: '🛫', categories: ['fighters', 'transport_aircraft', 'helicopters', 'drones'] as const },
  { key: 'naval', labelFa: 'نیروی دریایی', emoji: '🚢', categories: ['ships', 'submarines'] as const },
  { key: 'missile', labelFa: 'یگان موشکی', emoji: '🚀', categories: ['missiles', 'rockets'] as const },
  { key: 'defense', labelFa: 'یگان پدافندی', emoji: '🛡️', categories: ['ground_air_defense', 'air_air_defense', 'naval_air_defense', 'radars'] as const },
] as const;

const REPAIR_BASE_COST = 5_000;
const REPAIR_VALUE_RATIO = 0.02;
const SUPPLY_FUEL_COST_PER_UNIT = 3; // به‌ازای هر نفر نیرو
const SUPPLY_AMMO_COST_PER_UNIT = 2; // به‌ازای هر نفر نیرو

export async function armyState(db: Db, nation: NationRow) {
  const [rows, ext, equipmentValueRow] = await Promise.all([
    db.all<{ category_key: string; quantity: number; ap: number | null; dp: number | null; price: number | null; power_weight: number }>(
      sql`SELECT c.key AS category_key, SUM(i.quantity) AS quantity,
                 MAX(t.attack_points) AS ap, MAX(t.defense_points) AS dp, SUM(i.quantity * COALESCE(t.price, 0)) AS price,
                 MAX(c.power_weight) AS power_weight
            FROM nation_inventory i
            JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nation.id}
           GROUP BY c.key`,
    ),
    ensureNationExt(db, nation.id),
    db.first<{ value: number | null; units: number | null }>(
      sql`SELECT SUM(i.quantity * COALESCE(t.price, 0)) AS value, SUM(i.quantity) AS units
            FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
           WHERE i.nation_id = ${nation.id} AND t.price IS NOT NULL`,
    ),
  ]);

  const qty = (keys: readonly string[]) => rows.filter((r) => keys.includes(r.category_key)).reduce((s, r) => s + Number(r.quantity), 0);
  const points = (keys: readonly string[]) =>
    rows.filter((r) => keys.includes(r.category_key)).reduce((s, r) => s + Number(r.quantity) * Number(r.power_weight ?? 0), 0);

  const troops = qty(['soldiers']);
  const sections = ARMY_SECTIONS.map((s) => ({
    key: s.key,
    labelFa: s.labelFa,
    emoji: s.emoji,
    units: qty(s.categories),
    points: Math.round(points(s.categories)),
  }));
  const totalPoints = sections.reduce((s, x) => s + x.points, 0);
  for (const s of sections) {
    // سهم هر بخش از قدرت مجموع — برای نمایش نسبی
    (s as any).sharePercent = totalPoints > 0 ? Math.round((s.points / totalPoints) * 100) : 0;
  }

  const health = Number(ext?.equipment_health ?? 85);
  const fuel = Number(ext?.fuel_level ?? 80);
  const ammo = Number(ext?.ammo_level ?? 75);
  const readiness = Math.min(99, Math.max(5, Math.round(40 + health * 0.45 + Math.min(15, troops / 1000))));
  const equipmentValue = Number(equipmentValueRow?.value ?? 0);
  const equipmentUnits = Number(equipmentValueRow?.units ?? 0);
  const repairCost = Math.max(REPAIR_BASE_COST, Math.round(equipmentValue * REPAIR_VALUE_RATIO));
  const fuelCost = Math.max(2_000, troops * SUPPLY_FUEL_COST_PER_UNIT + equipmentUnits * 2);
  const ammoCost = Math.max(2_000, Math.round(troops * SUPPLY_AMMO_COST_PER_UNIT * 1.25 + equipmentUnits));

  return {
    troops,
    readiness,
    equipmentHealth: health,
    fuelLevel: fuel,
    ammoLevel: ammo,
    sections,
    equipmentValue,
    equipmentUnits,
    repairCost,
    fuelCost,
    ammoCost,
    soldierUpkeepPerDay: troops * 50,
  };
}

export async function repairEquipment(db: Db, nation: NationRow, now = nowSeconds()) {
  const state = await armyState(db, nation);
  if (state.equipmentHealth >= 99) throw ApiError.conflict('تجهیزات همین حالا در بهترین وضعیت هستند.');
  const remaining = await spendTreasury(db, nation, {
    amount: state.repairCost,
    referenceType: 'army_repair',
    reason: '🔧 تعمیر تجهیزات کشور',
    meta: { healthBefore: state.equipmentHealth, cost: state.repairCost },
    idempotencyPrefix: 'repair',
    now,
  });
  await db.run(
    sql`UPDATE nation_state_ext SET equipment_health = 100, updated_at = ${now} WHERE nation_id = ${nation.id}`,
  );
  await audit(db, {
    actor: null,
    action: 'army.repair',
    targetType: 'nation',
    targetId: nation.id,
    before: { health: state.equipmentHealth, treasury: nation.treasury },
    after: { health: 100, treasury: remaining },
    reason: 'تعمیر کامل تجهیزات',
  });
  return { equipmentHealth: 100, cost: state.repairCost, treasury: remaining };
}

export async function supply(db: Db, nation: NationRow, kind: 'fuel' | 'ammo', now = nowSeconds()) {
  if (kind !== 'fuel' && kind !== 'ammo') throw ApiError.validation('نوع تأمین نامعتبر است.');
  const state = await armyState(db, nation);
  const cost = kind === 'fuel' ? state.fuelCost : state.ammoCost;
  const label = kind === 'fuel' ? '⛽ تأمین سوخت' : '🧨 تأمین مهمات';
  const remaining = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: kind === 'fuel' ? 'army_fuel' : 'army_ammo',
    reason: label,
    meta: { cost },
    idempotencyPrefix: kind,
    now,
  });
  await db.run(
    kind === 'fuel'
      ? sql`UPDATE nation_state_ext SET fuel_level = 100, updated_at = ${now} WHERE nation_id = ${nation.id}`
      : sql`UPDATE nation_state_ext SET ammo_level = 100, updated_at = ${now} WHERE nation_id = ${nation.id}`,
  );
  await audit(db, {
    actor: null,
    action: kind === 'fuel' ? 'army.supply_fuel' : 'army.supply_ammo',
    targetType: 'nation',
    targetId: nation.id,
    before: { level: kind === 'fuel' ? state.fuelLevel : state.ammoLevel, treasury: nation.treasury },
    after: { level: 100, treasury: remaining },
    reason: label,
  });
  return { kind, level: 100, cost, treasury: remaining };
}
