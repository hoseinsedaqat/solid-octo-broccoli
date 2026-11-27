import { RELATION_LABELS_FA, TRANSACTION_TYPE_LABELS_FA, type TransactionType, WAR_STATUS_LABELS_FA } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso } from '../core/format';
import { computePower, computeEconomicScore, type InventoryRow } from '../game-engine/scoring';
import { computeCycleIncome, type EconomySnapshot } from '../game-engine/economy';
import { rankNations } from '../game-engine/ranking';
import type { SettingsBundle } from '../core/settings';
import type { NationSummary } from '@ww/shared';

export interface NationRow {
  id: number;
  owner_user_id: number;
  name: string;
  flag: string;
  leader_name: string;
  status: string;
  treasury: number;
  military_power: number;
  economic_score: number;
  total_score: number;
  world_rank: number;
  allies_count: number;
  enemies_count: number;
  wars_count: number;
  wins_count: number;
  losses_count: number;
  equipment_count: number;
  troops_count: number;
  income_anchor_at: number;
  last_income_cycle: number;
  last_income_at: number | null;
  last_rename_at: number | null;
  last_leader_rename_at: number | null;
  last_flag_change_at: number | null;
  starter_template_id: number | null;
  created_at: number;
}

/** raw row shape of `nation_economy` (snake_case, as stored in D1) */
export interface EconomyRow {
  nation_id: number;
  factory_income: number;
  mine_income: number;
  starter_factory_count: number;
  starter_mine_count: number;
  upkeep_base: number;
  gross_income: number;
  maintenance_cost: number;
  tax_cost: number;
  net_income: number;
  total_income: number;
  total_spent: number;
  total_tax: number;
  war_loss_total: number;
}

export async function loadNation(db: Db, nationId: number): Promise<NationRow> {
  const row = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${nationId}`);
  if (!row) throw ApiError.notFound('کشور یافت نشد.');
  return row;
}

export async function loadNationOwnedBy(db: Db, userId: number, preferId?: number | null): Promise<NationRow | null> {
  if (preferId) {
    const own = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${preferId} AND owner_user_id = ${userId}`);
    if (own) return own;
  }
  return db.first<NationRow>(sql`SELECT * FROM nations WHERE owner_user_id = ${userId} AND status <> 'dissolved' ORDER BY id LIMIT 1`);
}

export async function assertNationAccess(user: { userId: number; role: string; nationIds: number[] }, db: Db, nationId: number) {
  const ok = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM nations WHERE id = ${nationId} AND owner_user_id = ${user.userId}`,
  );
  if (!ok || Number(ok.c) === 0) throw ApiError.forbidden('این کشور متعلق به شما نیست.');
}

export interface InventoryRowFull extends InventoryRow {
  id: number;
  code: string;
  nameFa: string;
  unitFa: string;
  price: number | null;
  categoryLabelFa: string;
  emoji: string;
  description: string;
  is_for_sale: number;
  is_active: number;
  purchase_limit_per_cycle: number | null;
  maintenance_per_unit: number | null;
  updated_at: number;
}

export async function loadInventory(db: Db, nationId: number): Promise<InventoryRowFull[]> {
  const rows = await db.all<InventoryRowFull & { templateId: number; categoryKey: string }>(
    sql`SELECT i.id AS id, t.id AS templateId, t.code AS code, t.name_fa AS nameFa, t.unit_fa AS unitFa,
               t.price AS price, t.attack_points AS attackPoints, t.defense_points AS defensePoints,
               t.description AS description, t.is_for_sale AS is_for_sale, t.is_active AS is_active,
               t.purchase_limit_per_cycle AS purchase_limit_per_cycle, t.maintenance_per_unit AS maintenance_per_unit,
               c.key AS categoryKey, c.label_fa AS categoryLabelFa, c.emoji AS emoji,
               i.quantity AS quantity, i.updated_at AS updated_at
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.nation_id = ${nationId} AND t.is_active = 1
         ORDER BY c.sort_order, t.name_fa`,
  );
  return rows as InventoryRowFull[];
}

export async function loadCategoryWeights(db: Db): Promise<Record<string, number>> {
  const rows = await db.all<{ key: string; power_weight: number }>(sql`SELECT key, power_weight FROM equipment_categories`);
  return Object.fromEntries(rows.map((r) => [r.key, Number(r.power_weight)]));
}

export async function loadEconomyRow(db: Db, nationId: number) {
  return db.first<EconomyRow>(
    sql`SELECT nation_id, factory_income, mine_income, starter_factory_count, starter_mine_count,
               upkeep_base, gross_income, maintenance_cost, tax_cost, net_income,
               total_income, total_spent, total_tax, war_loss_total
          FROM nation_economy WHERE nation_id = ${nationId}`,
  );
}

export async function loadSettingsForNation(db: Db, nationId: number) {
  return db.first<{ income_cycle_seconds: number | null; tax_rate_override: number | null; defense_mode: string; fortification_level: number }>(
    sql`SELECT income_cycle_seconds, tax_rate_override, defense_mode, fortification_level FROM nation_settings WHERE nation_id = ${nationId}`,
  );
}

/** Inventory category -> quantity (skips soldiers? no: includes everything). */
export function categoryQuantities(rows: { categoryKey: string; quantity: number }[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) out[r.categoryKey] = (out[r.categoryKey] ?? 0) + Math.max(0, r.quantity);
  return out;
}

export async function perUnitMaintenance(db: Db, nationId: number, rules: SettingsBundle['economy']): Promise<number> {
  const row = await db.first<{ total: number | null }>(
    sql`SELECT COALESCE(SUM(COALESCE(t.maintenance_per_unit, 0) * i.quantity), 0) AS total
          FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
         WHERE i.nation_id = ${nationId}`,
  );
  const byCategory = await db.all<{ category_key: string; qty: number }>(
    sql`SELECT c.key AS category_key, SUM(i.quantity) AS qty
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.nation_id = ${nationId} GROUP BY c.key`,
  );
  let extra = 0;
  for (const b of byCategory) extra += (rules.maintenancePerUnit[b.category_key] ?? 0) * Number(b.qty);
  return Math.round(Number(row?.total ?? 0) + extra);
}

export interface NationComputed {
  income: ReturnType<typeof computeCycleIncome>;
  power: ReturnType<typeof computePower>;
  economicScore: number;
  factoryCount: number;
  mineCount: number;
}

export async function computeNation(db: Db, nation: NationRow, settings: SettingsBundle, opts: { forceZeroMaintenance?: boolean } = {}): Promise<NationComputed> {
  const inventory = await loadInventory(db, nation.id);
  const weights = await loadCategoryWeights(db);
  const economyRow = await loadEconomyRow(db, nation.id);
  const nationSettings = await loadSettingsForNation(db, nation.id);
  const factoryCount = inventory.filter((i) => i.categoryKey === 'factories').reduce((s, i) => s + i.quantity, 0);
  const mineCount = inventory.filter((i) => i.categoryKey === 'mines').reduce((s, i) => s + i.quantity, 0);
  const perUnit = opts.forceZeroMaintenance ? 0 : await perUnitMaintenance(db, nation.id, settings.economy);

  const snap: EconomySnapshot = {
    factoryIncome: Number(economyRow?.factory_income ?? 0),
    mineIncome: Number(economyRow?.mine_income ?? 0),
    starterFactoryCount: Number(economyRow?.starter_factory_count ?? 0),
    starterMineCount: Number(economyRow?.starter_mine_count ?? 0),
    factoryCount,
    mineCount,
    upkeepBase: Number(economyRow?.upkeep_base ?? 0),
    perUnitMaintenance: perUnit,
    taxRateOverride: nationSettings?.tax_rate_override ?? null,
    cycleSecondsOverride: nationSettings?.income_cycle_seconds ?? null,
  };
  const income = computeCycleIncome(snap, settings.economy);
  const power = computePower(inventory, weights, {
    manpowerFactor: settings.battle.manpowerFactor,
    fortificationLevel: nationSettings?.fortification_level ?? 0,
  });
  const economicScore = computeEconomicScore({
    treasury: nation.treasury,
    grossIncome: income.grossIncome,
    netIncome: income.netIncome,
    factories: factoryCount,
    mines: mineCount,
  });
  return { income, power, economicScore, factoryCount, mineCount };
}

/** persist cached stats for one nation (never trust the client with them) */
export async function refreshNationStats(db: Db, nation: NationRow, settings: SettingsBundle): Promise<NationComputed> {
  const computed = await computeNation(db, nation, settings);
  await db.batch([
    sql`UPDATE nations SET military_power = ${computed.power.militaryPower}, economic_score = ${computed.economicScore},
               equipment_count = ${computed.power.equipmentCount}, troops_count = ${computed.power.troopsCount},
               updated_at = ${nowSeconds()}
           WHERE id = ${nation.id}`,
    sql`UPDATE nation_economy SET gross_income = ${computed.income.grossIncome}, tax_cost = ${computed.income.taxCost},
               maintenance_cost = ${computed.income.maintenanceCost}, net_income = ${computed.income.netIncome},
               updated_at = ${nowSeconds()}
           WHERE nation_id = ${nation.id}`,
  ]);
  return computed;
}

/** global ranking pass — one CASE statement per chunk, cheap on D1 */
export async function recomputeRankings(db: Db, settings: SettingsBundle, chunkSize = 80): Promise<number> {
  const rows = await db.all<{
    id: number;
    name: string;
    flag: string;
    leader_name: string;
    treasury: number;
    military_power: number;
    economic_score: number;
    equipment_count: number;
    wins_count: number;
    net_income: number | null;
  }>(
    sql`SELECT n.id, n.name, n.flag, n.leader_name, n.treasury, n.military_power, n.economic_score,
               n.equipment_count, n.wins_count, e.net_income
          FROM nations n LEFT JOIN nation_economy e ON e.nation_id = n.id
         WHERE n.status <> 'dissolved'`,
  );
  const ranked = rankNations(
    rows.map((n) => ({
      nationId: n.id,
      name: n.name,
      flag: n.flag,
      leaderName: n.leader_name,
      treasury: Number(n.treasury),
      income: Number(n.net_income ?? 0),
      militaryPower: Number(n.military_power),
      equipmentCount: Number(n.equipment_count),
      warWins: Number(n.wins_count),
      economicScore: Number(n.economic_score),
    })),
    settings.rankingWeights,
  );

  const stmts = [];
  for (let i = 0; i < ranked.length; i += chunkSize) {
    const chunk = ranked.slice(i, i + chunkSize);
    const whenRank = chunk.map((r) => `WHEN ${Number(r.nationId)} THEN ${r.rank}`).join(' ');
    const whenScore = chunk.map((r) => `WHEN ${Number(r.nationId)} THEN ${Number(r.score).toFixed(2)}`).join(' ');
    const ids = chunk.map((r) => Number(r.nationId));
    stmts.push({
      sql: `UPDATE nations SET world_rank = CASE id ${whenRank} ELSE world_rank END,
                                   total_score = CASE id ${whenScore} ELSE total_score END
              WHERE id IN (${ids.map(() => '?').join(', ')})`,
      bindings: ids,
    });
  }
  if (stmts.length) await db.batch(stmts);
  return ranked.length;
}


export function mapNationSummary(
  n: NationRow,
  extra: { incomePerCycle: number; allies: number; enemies: number } = { incomePerCycle: 0, allies: 0, enemies: 0 },
): NationSummary {
  return {
    id: n.id,
    name: n.name,
    flag: n.flag,
    leaderName: n.leader_name,
    status: n.status,
    treasury: Number(n.treasury),
    incomePerCycle: Math.round(extra.incomePerCycle),
    militaryPower: Number(n.military_power),
    economicScore: Number(n.economic_score),
    totalScore: Number(n.total_score),
    worldRank: Number(n.world_rank),
    alliesCount: extra.allies || Number(n.allies_count),
    enemiesCount: extra.enemies || Number(n.enemies_count),
    warsCount: Number(n.wars_count),
    winsCount: Number(n.wins_count),
    lossesCount: Number(n.losses_count),
    equipmentCount: Number(n.equipment_count),
    troopsCount: Number(n.troops_count),
    createdAt: toIso(n.created_at) ?? '',
  };
}

export async function relationCounts(db: Db, nationId: number) {
  const rows = await db.all<{ status: string; c: number }>(
    sql`SELECT status, COUNT(*) AS c FROM diplomatic_relations WHERE nation_id = ${nationId} GROUP BY status`,
  );
  const map: Record<string, number> = {};
  for (const r of rows) map[r.status] = Number(r.c);
  return {
    allies: (map.ally ?? 0) + (map.friend ?? 0),
    enemies: map.enemy ?? 0,
    neutral: map.neutral ?? 0,
    negotiating: map.negotiating ?? 0,
    peace: map.peace_treaty ?? 0,
  };
}

export const relationLabel = (status: string) => RELATION_LABELS_FA[status as keyof typeof RELATION_LABELS_FA] ?? status;
export const txLabel = (type: string) => TRANSACTION_TYPE_LABELS_FA[type as TransactionType] ?? type;
export const warLabel = (status: string) => WAR_STATUS_LABELS_FA[status as keyof typeof WAR_STATUS_LABELS_FA] ?? status;
