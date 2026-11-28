import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds } from '../core/format';
import type { NationRow } from '../db/queries';
import { ensureNationExt, POLICE_UPKEEP_PER_DAY } from '../db/queries';
import { audit } from './auditService';
import { spendTreasury } from './coinSpend';

const POLICE_COST = 2_500;
const BORDER_COST_PER_LEVEL = 15_000;
const INFRA_COST_PER_LEVEL = 25_000;
const PROTECT_COST = 5_000;
export const SECURITY_MAX_LEVEL = 10;

export interface SecurityAlert {
  key: string;
  severity: 'warn' | 'critical';
  title: string;
  hint: string;
  actionLabel: string;
  actionRoute: string;
}

async function ownedAssets(db: Db, nationId: number) {
  const [factories, mines, buildings] = await Promise.all([
    db.all<{ ref: string; name: string }>(
      sql`SELECT t.id AS ref, t.name_fa AS name FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nationId} AND c.key = 'factories'`,
    ),
    db.all<{ ref: string; name: string }>(
      sql`SELECT t.id AS ref, t.name_fa AS name FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nationId} AND c.key = 'mines'`,
    ),
    db.all<{ ref: string; name: string }>(
      sql`SELECT b.building_key AS ref, b.building_key AS name FROM nation_buildings b WHERE b.nation_id = ${nationId}`,
    ),
  ]);
  const BUILDING_NAME: Record<string, string> = {
    barracks: 'پادگان نظامی',
    airbase: 'پایگاه هوایی',
    factory: 'کارخانه نظامی',
    navalbase: 'پایگاه دریایی',
    shelter: 'پناهگاه نظامی',
    radar: 'مرکز رادار',
  };
  return [
    ...factories.map((r) => ({ assetType: 'factory' as const, assetRef: String(r.ref), assetName: r.name })),
    ...mines.map((r) => ({ assetType: 'mine' as const, assetRef: String(r.ref), assetName: r.name })),
    ...buildings.map((r) => ({ assetType: 'building' as const, assetRef: String(r.ref), assetName: BUILDING_NAME[r.ref] ?? r.ref })),
  ];
}

export async function securityState(db: Db, nation: NationRow) {
  const ext = await ensureNationExt(db, nation.id);
  const [protectedRows, assets, factoryCount] = await Promise.all([
    db.all<{ asset_type: string; asset_ref: string; asset_name: string }>(
      sql`SELECT asset_type, asset_ref, asset_name FROM nation_protected_assets WHERE nation_id = ${nation.id} ORDER BY created_at ASC`,
    ),
    ownedAssets(db, nation.id),
    db.first<{ n: number | null }>(
      sql`SELECT COUNT(*) AS n FROM (SELECT DISTINCT i.template_id FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id JOIN equipment_categories c ON c.id = t.category_id WHERE i.nation_id = ${nation.id} AND c.key = 'factories')`,
    ),
  ]);
  const protectedSet = new Set(protectedRows.map((r) => `${r.asset_type}:${r.asset_ref}`));

  const police = Number(ext?.police ?? 0);
  const border = Number(ext?.border_level ?? 1);
  const infra = Number(ext?.infra_level ?? 1);
  const health = Number(ext?.equipment_health ?? 85);
  const fuel = Number(ext?.fuel_level ?? 80);
  const ammo = Number(ext?.ammo_level ?? 75);
  const policeUpkeep = police * POLICE_UPKEEP_PER_DAY;

  const alerts: SecurityAlert[] = [];
  if (health < 60) {
    alerts.push({ key: 'equipment', severity: 'critical', title: 'تجهیزات آسیب دیده‌اند', hint: `سلامت تجهیزات ${Math.round(health)}٪ است؛ تعمیر سریع لازم است.`, actionLabel: 'تعمیر تجهیزات', actionRoute: '/app/army' });
  }
  if (fuel < 30 || ammo < 30) {
    alerts.push({ key: 'supplies', severity: 'critical', title: 'ذخایر سوخت یا مهمات رو به پایان', hint: `سوخت ${Math.round(fuel)}٪ · مهمات ${Math.round(ammo)}٪`, actionLabel: 'تأمین ذخایر', actionRoute: '/app/army' });
  }
  if (border < 3) {
    alerts.push({ key: 'border', severity: 'warn', title: 'حفاظت مرز ضعیف است', hint: `سطح فعلی مرز ${border} از ${SECURITY_MAX_LEVEL}.`, actionLabel: 'تقویت مرزها', actionRoute: '/app/security' });
  }
  if (infra < 3) {
    alerts.push({ key: 'infra', severity: 'warn', title: 'زیرساخت‌ها آسیب‌پذیرند', hint: `سطح زیرساخت ${infra}؛ در بحران‌ها آسیب بیشتری می‌بینند.`, actionLabel: 'تقویت زیرساخت', actionRoute: '/app/security' });
  }
  if (police < 150) {
    alerts.push({ key: 'police', severity: 'warn', title: 'کمبود نیروی انتظامی', hint: `فقط ${police} پلیس فعال دارید.`, actionLabel: 'استخدام پلیس', actionRoute: '/app/security' });
  }
  if (protectedRows.length === 0 && assets.length > 0) {
    alerts.push({ key: 'assets', severity: 'warn', title: 'هیچ مرکز مهمی محافظت نشده', hint: 'کارخانه‌ها و معادن در بحران‌ها بی‌دفاع می‌مانند.', actionLabel: 'حفاظت از مراکز', actionRoute: '/app/security' });
  }
  if (nation.treasury < 150_000) {
    alerts.push({ key: 'budget', severity: 'warn', title: 'خزانه در تنش است', hint: `موجودی خزانه ${nation.treasury.toLocaleString('en-US')} سکه.`, actionLabel: 'دفتر مالی', actionRoute: '/app/economy/treasury' });
  }

  const hasCritical = alerts.some((a) => a.severity === 'critical');
  const status = alerts.length === 0 ? 'عادی' : hasCritical ? 'بحرانی' : 'هشدار';
  const statusTone: 'ok' | 'warn' | 'bad' = alerts.length === 0 ? 'ok' : hasCritical ? 'bad' : 'warn';

  return {
    status,
    statusTone,
    alerts,
    police,
    policeUpkeep,
    policeCost: POLICE_COST,
    borderLevel: border,
    borderCost: BORDER_COST_PER_LEVEL * border,
    infraLevel: infra,
    infraCost: INFRA_COST_PER_LEVEL * infra,
    maxLevel: SECURITY_MAX_LEVEL,
    borderPercent: Math.round((border / SECURITY_MAX_LEVEL) * 100),
    infraPercent: Math.round((infra / SECURITY_MAX_LEVEL) * 100),
    protectedAssets: protectedRows.map((r) => ({ assetType: r.asset_type, assetRef: r.asset_ref, assetName: r.asset_name })),
    candidates: assets.map((a) => ({ ...a, protected: protectedSet.has(`${a.assetType}:${a.assetRef}`) })),
    factoryTypes: Number(factoryCount?.n ?? 0),
    protectCost: PROTECT_COST,
  };
}

export async function hirePolice(db: Db, nation: NationRow, quantity: number, now = nowSeconds()) {
  const qty = Math.floor(Number(quantity));
  if (!Number.isFinite(qty) || qty < 1) throw ApiError.validation('تعداد پلیس باید دست‌کم ۱ باشد.');
  if (qty > 500) throw ApiError.validation('حداکثر ۵۰۰ پلیس در هر استخدام.');
  const cost = qty * POLICE_COST;
  const remaining = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: 'security_police',
    reason: `🚓 استخدام ${qty} نیروی انتظامی`,
    meta: { quantity: qty, cost },
    idempotencyPrefix: 'police',
    now,
  });
  await ensureNationExt(db, nation.id);
  const res = await db.first<{ police: number }>(
    sql`UPDATE nation_state_ext SET police = police + ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING police`,
  );
  await audit(db, {
    actor: null,
    action: 'security.hire_police',
    targetType: 'nation',
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { police: Number(res?.police ?? 0), treasury: remaining },
    reason: `استخدام ${qty} پلیس`,
  });
  return { police: Number(res?.police ?? 0), cost, treasury: remaining };
}

async function levelUp(db: Db, nation: NationRow, column: 'border_level' | 'infra_level', costPerLevel: number, label: string, now: number) {
  const ext = await ensureNationExt(db, nation.id);
  const current = Number((ext as any)?.[column] ?? 1);
  if (current >= SECURITY_MAX_LEVEL) throw ApiError.conflict('به حداکثر سطح ممکن رسیده است.');
  const cost = costPerLevel * current;
  const remaining = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: column === 'border_level' ? 'security_border' : 'security_infra',
    reason: label,
    meta: { fromLevel: current, toLevel: current + 1 },
    idempotencyPrefix: column,
    now,
  });
  const res = await db.first<{ border_level: number; infra_level: number }>(
    column === 'border_level'
      ? sql`UPDATE nation_state_ext SET border_level = border_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING border_level, infra_level`
      : sql`UPDATE nation_state_ext SET infra_level = infra_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING border_level, infra_level`,
  );
  await audit(db, {
    actor: null,
    action: column === 'border_level' ? 'security.border_up' : 'security.infra_up',
    targetType: 'nation',
    targetId: nation.id,
    before: { level: current, treasury: nation.treasury },
    after: { level: current + 1, treasury: remaining },
    reason: `${label} → سطح ${current + 1}`,
  });
  return {
    level: column === 'border_level' ? Number(res?.border_level ?? current + 1) : Number(res?.infra_level ?? current + 1),
    cost,
    treasury: remaining,
  };
}

export function upgradeBorder(db: Db, nation: NationRow, now = nowSeconds()) {
  return levelUp(db, nation, 'border_level', BORDER_COST_PER_LEVEL, '🛡️ تقویت مرز', now);
}

export function upgradeInfra(db: Db, nation: NationRow, now = nowSeconds()) {
  return levelUp(db, nation, 'infra_level', INFRA_COST_PER_LEVEL, '🏗️ تقویت زیرساخت', now);
}

/** حفاظت از یک مرکز مهم — هزینهٔ ثبت یک‌باره؛ برداشتن رایگان */
export async function toggleProtectedAsset(
  db: Db,
  nation: NationRow,
  input: { assetType: 'factory' | 'mine' | 'building'; assetRef: string; assetName: string },
  now = nowSeconds(),
) {
  const assetType = input.assetType;
  if (!['factory', 'mine', 'building'].includes(assetType)) throw ApiError.validation('نوع مرکز نامعتبر است.');
  const assetRef = String(input.assetRef).slice(0, 64);
  const assetName = String(input.assetName).slice(0, 120);
  if (!assetRef) throw ApiError.validation('شناسهٔ مرکز نامعتبر است.');
  const existing = await db.first<{ id: number }>(
    sql`SELECT rowid AS id FROM nation_protected_assets WHERE nation_id = ${nation.id} AND asset_type = ${assetType} AND asset_ref = ${assetRef}`,
  );
  if (existing) {
    await db.run(
      sql`DELETE FROM nation_protected_assets WHERE nation_id = ${nation.id} AND asset_type = ${assetType} AND asset_ref = ${assetRef}`,
    );
    await audit(db, {
      actor: null,
      action: 'security.unprotect',
      targetType: 'nation',
      targetId: nation.id,
      before: { assetType, assetRef, assetName },
      after: null,
      reason: `حذف حفاظت از ${assetName}`,
    });
    return { protected: false, assetType, assetRef, treasury: nation.treasury };
  }
  const remaining = await spendTreasury(db, nation, {
    amount: PROTECT_COST,
    referenceType: 'security_protect',
    reason: `🛡️ حفاظت از ${assetName}`,
    meta: { assetType, assetRef, assetName },
    idempotencyPrefix: 'protect',
    now,
  });
  await db.run(
    sql`INSERT INTO nation_protected_assets (nation_id, asset_type, asset_ref, asset_name, cost, created_at)
         VALUES (${nation.id}, ${assetType}, ${assetRef}, ${assetName}, ${PROTECT_COST}, ${now})`,
  );
  await audit(db, {
    actor: null,
    action: 'security.protect',
    targetType: 'nation',
    targetId: nation.id,
    before: null,
    after: { assetType, assetRef, assetName, treasury: remaining },
    reason: `حفاظت از ${assetName}`,
  });
  return { protected: true, assetType, assetRef, treasury: remaining };
}
