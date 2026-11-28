import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds } from '../core/format';
import type { NationRow } from '../db/queries';
import { ensureNationExt } from '../db/queries';
import { audit } from './auditService';

export const ARSENAL_GROUPS = [
  { key: 'aircraft', labelFa: 'هواپیماها', emoji: '✈️', categories: ['fighters', 'transport_aircraft', 'helicopters', 'drones'] as const },
  { key: 'missiles', labelFa: 'موشک‌ها', emoji: '🚀', categories: ['missiles'] as const },
  { key: 'air_defense', labelFa: 'سامانه‌های پدافندی', emoji: '🛡️', categories: ['ground_air_defense', 'air_air_defense', 'naval_air_defense', 'radars'] as const },
  { key: 'armored', labelFa: 'تانک‌ها و خودروهای زرهی', emoji: '🪖', categories: ['tanks', 'apc'] as const },
  { key: 'naval', labelFa: 'تجهیزات دریایی', emoji: '🚢', categories: ['ships', 'submarines'] as const },
  { key: 'weapons', labelFa: 'سلاح و مهمات', emoji: '💥', categories: ['artillery', 'rockets'] as const },
  { key: 'fuel', labelFa: 'سوخت نظامی', emoji: '⛽', categories: ['fuel'] as const },
] as const;
export const ARSENAL_CATEGORY_KEYS = [...new Set(ARSENAL_GROUPS.flatMap((g) => g.categories))] as string[];

const BASE_CAPACITY = 1000;
const SHELTER_CAPACITY_PER_LEVEL = 500;
/** سرباز/نیروی انسانی در انبار ذخیره نمی‌شود و ظرفیت اشغال نمی‌کند */
const NON_STORED_CATEGORIES = ['soldiers'] as const;

export async function arsenalState(db: Db, nation: NationRow) {
  const [rows, deployedRows, buildingRow, ext] = await Promise.all([
    db.all<{
      template_id: number;
      code: string;
      name_fa: string;
      quantity: number;
      price: number | null;
      attack_points: number | null;
      defense_points: number | null;
      maintenance_per_unit: number | null;
      category_key: string;
      category_label: string;
      unit_fa: string;
      power_weight: number;
    }>(
      sql`SELECT t.id AS template_id, t.code, t.name_fa, i.quantity, t.price, t.attack_points, t.defense_points,
                 t.maintenance_per_unit, c.key AS category_key, c.label_fa AS category_label, t.unit_fa, c.power_weight
            FROM nation_inventory i
            JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nation.id} AND t.is_active = 1
           ORDER BY c.sort_order, t.name_fa`,
    ),
    db.all<{ template_id: number; quantity: number }>(
      sql`SELECT template_id, quantity FROM nation_deployed WHERE nation_id = ${nation.id} AND quantity > 0`,
    ),
    db.first<{ level: number | null }>(
      sql`SELECT COALESCE(level, 1) AS level FROM nation_buildings WHERE nation_id = ${nation.id} AND building_key = 'shelter'`,
    ),
    ensureNationExt(db, nation.id),
  ]);

  const deployed = new Map(deployedRows.map((r) => [Number(r.template_id), Number(r.quantity)]));
  const shelterLevel = buildingRow ? Math.max(1, Number(buildingRow.level ?? 1)) : 0;
  const capacity = BASE_CAPACITY + shelterLevel * SHELTER_CAPACITY_PER_LEVEL;
  // ظرفیت فقط برای سخت‌افزار است؛ نیروی انسانی شمارش نمی‌شود
  const totalItems = rows.reduce((s, r) => s + (NON_STORED_CATEGORIES.includes(r.category_key as 'soldiers') ? 0 : Number(r.quantity)), 0);
  const percent = capacity > 0 ? Math.min(100, Math.round((totalItems / capacity) * 100)) : 0;
  const health = Number(ext?.equipment_health ?? 85);

  const byCategory = new Map<string, typeof rows>();
  for (const r of rows) {
    const arr = byCategory.get(r.category_key) ?? [];
    arr.push(r);
    byCategory.set(r.category_key, arr);
  }

  const mapItem = (r: (typeof rows)[number]) => {
    const dep = deployed.get(Number(r.template_id)) ?? 0;
    const total = Number(r.quantity);
    const stock = Math.max(0, total - dep);
    const power = Number(r.attack_points ?? 0) + Number(r.defense_points ?? 0);
    return {
      templateId: Number(r.template_id),
      code: r.code,
      nameFa: r.name_fa,
      quantity: stock,
      deployed: dep,
      total,
      unitFa: r.unit_fa || 'عدد',
      price: r.price === null ? null : Number(r.price),
      attackPoints: r.attack_points === null ? null : Number(r.attack_points),
      defensePoints: r.defense_points === null ? null : Number(r.defense_points),
      /** امتیاز قدرت مؤثر — اگر قالب امتیاز تخصصی نداشته باشد، وزن دسته اعمال می‌شود */
      powerPoints: power > 0 ? power : Math.round(total * Number(r.power_weight ?? 0)),
      statusFa: health >= 60 ? 'عملیاتی' : 'نیازمند تعمیر',
    };
  };

  const groups = ARSENAL_GROUPS.map((g) => {
    const items = g.categories.flatMap((c) => byCategory.get(c) ?? []).map(mapItem);
    const units = items.reduce((s, i) => s + i.total, 0);
    return { key: g.key, labelFa: g.labelFa, emoji: g.emoji, units, items };
  });

  const deployedUnits = [...deployed.values()].reduce((s, n) => s + n, 0);
  return {
    capacity,
    used: totalItems,
    available: Math.max(0, capacity - totalItems),
    percent,
    health,
    shelterLevel,
    deployedUnits,
    warehouseUnits: Math.max(0, totalItems - deployedUnits),
    groups,
  };
}

async function getStock(db: Db, nationId: number, templateId: number) {
  const row = await db.first<{ quantity: number }>(
    sql`SELECT COALESCE(SUM(i.quantity), 0) AS quantity FROM nation_inventory i WHERE i.nation_id = ${nationId} AND i.template_id = ${templateId}`,
  );
  return Number(row?.quantity ?? 0);
}

async function getDeployed(db: Db, nationId: number, templateId: number) {
  const row = await db.first<{ quantity: number }>(
    sql`SELECT quantity FROM nation_deployed WHERE nation_id = ${nationId} AND template_id = ${templateId}`,
  );
  return Number(row?.quantity ?? 0);
}

export async function deployUnits(db: Db, nation: NationRow, templateId: number, quantity: number, now = nowSeconds()) {
  const tid = Math.floor(Number(templateId));
  const qty = Math.floor(Number(quantity));
  if (!Number.isFinite(tid) || tid <= 0) throw ApiError.validation('تجهیز نامعتبر است.');
  if (!Number.isFinite(qty) || qty < 1) throw ApiError.validation('تعداد باید دست‌کم ۱ باشد.');
  const stock = await getStock(db, nation.id, tid);
  const dep = await getDeployed(db, nation.id, tid);
  const available = Math.max(0, stock - dep);
  if (qty > available) throw ApiError.validation(`فقط ${available} واحد قابل انتقال به یگان است.`);
  await db.run(
    sql`INSERT INTO nation_deployed (nation_id, template_id, quantity, updated_at)
         VALUES (${nation.id}, ${tid}, ${qty}, ${now})
         ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${qty}, updated_at = ${now}`,
  );
  await audit(db, {
    actor: null,
    action: 'arsenal.deployed',
    targetType: 'nation',
    targetId: nation.id,
    before: { deployed: dep },
    after: { deployed: dep + qty },
    reason: `انتقال ${qty} واحد تجهیز به یگان (قالب #${tid})`,
  });
  return { templateId: tid, deployed: dep + qty, moved: qty };
}

export async function recallUnits(db: Db, nation: NationRow, templateId: number, quantity: number, now = nowSeconds()) {
  const tid = Math.floor(Number(templateId));
  const qty = Math.floor(Number(quantity));
  if (!Number.isFinite(tid) || tid <= 0) throw ApiError.validation('تجهیز نامعتبر است.');
  if (!Number.isFinite(qty) || qty < 1) throw ApiError.validation('تعداد باید دست‌کم ۱ باشد.');
  const dep = await getDeployed(db, nation.id, tid);
  if (qty > dep) throw ApiError.validation(`فقط ${dep} واحد در یگان‌ها مستقر است.`);
  await db.run(
    sql`UPDATE nation_deployed SET quantity = quantity - ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id} AND template_id = ${tid}`,
  );
  await audit(db, {
    actor: null,
    action: 'arsenal.recalled',
    targetType: 'nation',
    targetId: nation.id,
    before: { deployed: dep },
    after: { deployed: dep - qty },
    reason: `بازگشت ${qty} واحد تجهیز از یگان (قالب #${tid})`,
  });
  return { templateId: tid, deployed: dep - qty, moved: qty };
}
