import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds } from '../core/format';
import type { NationRow } from '../db/queries';
import { ensureNationExt } from '../db/queries';
import { audit } from './auditService';
import { spendTreasury } from './coinSpend';

export const POPULATION_MAX_LEVEL = 10;
const COSTS = { hospital: 40_000, school: 35_000, housing: 30_000 } as const;
export type PopulationUpgradeKind = keyof typeof COSTS;
const KIND_LABEL: Record<PopulationUpgradeKind, string> = {
  hospital: '🏥 ارتقای بیمارستان‌ها',
  school: '🎓 ارتقای مدارس',
  housing: '🏗️ مسکن و شهرسازی',
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

export interface PopulationState {
  total: number;
  capacity: number;
  employed: number;
  unemployed: number;
  unemploymentRate: number;
  employmentRate: number;
  birthRate: number;
  deathRate: number;
  growthRate: number;
  happiness: number;
  atCapacity: boolean;
  hospitalLevel: number;
  schoolLevel: number;
  housingLevel: number;
  hospitalCost: number;
  schoolCost: number;
  housingCost: number;
  maxLevel: number;
  factoryCount: number;
  mineCount: number;
}

async function factoryAndMineTotals(db: Db, nationId: number) {
  const row = await db.first<{ factory_level_sum: number | null; mine_count: number | null; factory_count: number | null }>(
    sql`SELECT
          COALESCE(SUM(CASE WHEN c.key = 'factories' THEN i.quantity * COALESCE(l.level, 1) ELSE 0 END), 0) AS factory_level_sum,
          COALESCE(SUM(CASE WHEN c.key = 'mines' THEN i.quantity ELSE 0 END), 0) AS mine_count,
          COALESCE(SUM(CASE WHEN c.key = 'factories' THEN i.quantity ELSE 0 END), 0) AS factory_count
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_factory_levels l ON l.nation_id = i.nation_id AND l.template_id = t.id
         WHERE i.nation_id = ${nationId}`,
  );
  return {
    factoryLevelSum: Number(row?.factory_level_sum ?? 0),
    mineCount: Number(row?.mine_count ?? 0),
    factoryCount: Number(row?.factory_count ?? 0),
  };
}

export async function populationState(db: Db, nation: NationRow): Promise<PopulationState> {
  const [ext, totals] = await Promise.all([ensureNationExt(db, nation.id), factoryAndMineTotals(db, nation.id)]);
  const housing = Math.max(1, Number(ext?.housing_level ?? 1));
  const hospital = Math.max(1, Number(ext?.hospital_level ?? 1));
  const education = Math.max(1, Number(ext?.education_level ?? 1));

  const capacity = 2_500_000 + housing * 1_200_000 + hospital * 300_000;
  const rawTotal = 2_200_000 + totals.factoryLevelSum * 180_000 + totals.mineCount * 120_000 + housing * 150_000;
  const total = clamp(Math.round(rawTotal), 500_000, capacity);
  const atCapacity = rawTotal >= capacity;

  const employmentRate = clamp(0.34 + education * 0.028 + Math.min(0.12, totals.factoryLevelSum * 0.006), 0.3, 0.78);
  const employed = Math.floor(total * employmentRate);
  const unemployed = total - employed;
  const unemploymentRate = 1 - employmentRate;

  const birthRate = round1(7.5 + housing * 0.5 + hospital * 0.3);
  const deathRate = round1(Math.max(2, 7.0 - hospital * 0.55 - housing * 0.1));
  let growthRate = round1(birthRate - deathRate + education * 0.15);
  if (atCapacity) growthRate = Math.min(growthRate, 0.2); // مسکن پر است؛ رشد متوقف می‌شود مگر ارتقا داده شود

  const happiness = clamp(Math.round(52 + (hospital + education + housing) * 5 - unemploymentRate * 100 * 0.6), 5, 99);

  return {
    total,
    capacity,
    employed,
    unemployed,
    unemploymentRate: round1(unemploymentRate * 1000) / 10,
    employmentRate: round1(employmentRate * 1000) / 10,
    birthRate,
    deathRate,
    growthRate,
    happiness,
    atCapacity,
    hospitalLevel: hospital,
    schoolLevel: education,
    housingLevel: housing,
    hospitalCost: COSTS.hospital * hospital,
    schoolCost: COSTS.school * education,
    housingCost: COSTS.housing * housing,
    maxLevel: POPULATION_MAX_LEVEL,
    factoryCount: totals.factoryCount,
    mineCount: totals.mineCount,
  };
}

export async function upgradePopulation(db: Db, nation: NationRow, kind: PopulationUpgradeKind, now = nowSeconds()) {
  if (!['hospital', 'school', 'housing'].includes(kind)) throw ApiError.validation('نوع ارتقا نامعتبر است.');
  const ext = await ensureNationExt(db, nation.id);
  const column = kind === 'hospital' ? 'hospital_level' : kind === 'school' ? 'education_level' : 'housing_level';
  const current = Math.max(1, Number((ext as any)?.[column] ?? 1));
  if (current >= POPULATION_MAX_LEVEL) throw ApiError.conflict('این بخش به حداکثر سطح ممکن رسیده است.');
  const cost = COSTS[kind] * current;
  const remaining = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: `population_${kind}`,
    reason: KIND_LABEL[kind],
    meta: { kind, fromLevel: current, toLevel: current + 1 },
    idempotencyPrefix: `pop_${kind}`,
    now,
  });
  const res = await db.first<{ hospital_level: number; education_level: number; housing_level: number }>(
    column === 'hospital_level'
      ? sql`UPDATE nation_state_ext SET hospital_level = hospital_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING hospital_level, education_level, housing_level`
      : column === 'education_level'
        ? sql`UPDATE nation_state_ext SET education_level = education_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING hospital_level, education_level, housing_level`
        : sql`UPDATE nation_state_ext SET housing_level = housing_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING hospital_level, education_level, housing_level`,
  );
  await audit(db, {
    actor: null,
    action: 'population.upgrade',
    targetType: 'nation',
    targetId: nation.id,
    before: { kind, level: current, treasury: nation.treasury },
    after: {
      kind,
      level: current + 1,
      treasury: remaining,
      hospital: Number(res?.hospital_level ?? 0),
      education: Number(res?.education_level ?? 0),
      housing: Number(res?.housing_level ?? 0),
    },
    reason: KIND_LABEL[kind],
  });
  return { kind, level: current + 1, cost, treasury: remaining };
}
