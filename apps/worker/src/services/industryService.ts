import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso, humanDuration } from '../core/format';
import { uuid } from '../core/ids';
import type { NationRow } from '../db/queries';
import { audit } from './auditService';
import { notify } from './notificationService';
import { spendTreasury } from './coinSpend';

/** دسته‌های مجاز برای تولید داخلی + برچسب نمایشی */
export const PRODUCT_GROUPS = [
  { key: 'aircraft', labelFa: 'هواپیما', emoji: '✈️', categories: ['fighters', 'transport_aircraft', 'helicopters'] as const },
  { key: 'missile', labelFa: 'موشک', emoji: '🚀', categories: ['missiles'] as const },
  { key: 'air_defense', labelFa: 'سامانه پدافندی', emoji: '🛡️', categories: ['ground_air_defense', 'air_air_defense', 'naval_air_defense'] as const },
  { key: 'armored', labelFa: 'خودروی زرهی', emoji: '🪖', categories: ['tanks', 'apc'] as const },
  { key: 'naval', labelFa: 'تجهیزات دریایی', emoji: '🚢', categories: ['ships', 'submarines'] as const },
  { key: 'ammo', labelFa: 'مهمات', emoji: '💥', categories: ['artillery', 'rockets'] as const },
] as const;
export type ProductGroupKey = (typeof PRODUCT_GROUPS)[number]['key'];
const ALL_PRODUCT_CATEGORIES = [...new Set(PRODUCT_GROUPS.flatMap((g) => g.categories))] as string[];

const PRODUCTION_COST_RATIO = 0.5;
const PRODUCTION_SECONDS_PER_UNIT = 120;
const FACTORY_MAX_LEVEL = 10;

export interface FactoryView {
  templateId: number;
  code: string;
  nameFa: string;
  quantity: number;
  level: number;
  incomePerCycle: number;
  incomePerDay: number;
  statusFa: 'فعال';
  upgradeCost: number | null;
  atMaxLevel: boolean;
}

function upgradeCostFor(price: number | null, level: number): number {
  return Math.max(1, Math.ceil(Number(price ?? 2_000_000) * 0.5 * level));
}

export async function sweepProductionOrders(db: Db, nationId: number, now = nowSeconds()): Promise<number> {
  const res = await db.run(
    sql`UPDATE nation_production_orders SET status = 'ready'
         WHERE nation_id = ${nationId} AND status = 'in_progress' AND completes_at <= ${now}`,
  );
  return Number((res as any)?.changes ?? 0);
}

async function factoryRows(db: Db, nationId: number) {
  return db.all<{
    template_id: number;
    code: string;
    name_fa: string;
    quantity: number;
    price: number | null;
    income_per_cycle: number | null;
    level: number | null;
  }>(
    sql`SELECT t.id AS template_id, t.code, t.name_fa, i.quantity, t.price, t.income_per_cycle, l.level
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_factory_levels l ON l.nation_id = i.nation_id AND l.template_id = t.id
         WHERE i.nation_id = ${nationId} AND c.key = 'factories'`,
  );
}

export async function industryState(db: Db, nation: NationRow, now = nowSeconds()) {
  await sweepProductionOrders(db, nation.id, now);
  const rows = await factoryRows(db, nation.id);
  const factories: FactoryView[] = rows
    .map((r) => {
      const level = Math.max(1, Number(r.level ?? 1));
      const incomePerCycle = Math.max(0, Number(r.income_per_cycle ?? 0)) * level;
      const atMaxLevel = level >= FACTORY_MAX_LEVEL;
      return {
        templateId: Number(r.template_id),
        code: r.code,
        nameFa: r.name_fa,
        quantity: Number(r.quantity),
        level,
        incomePerCycle,
        incomePerDay: incomePerCycle,
        statusFa: 'فعال' as const,
        upgradeCost: atMaxLevel ? null : upgradeCostFor(r.price, level),
        atMaxLevel,
      };
    })
    .sort((a, b) => b.incomePerDay - a.incomePerDay);

  const factoryCount = factories.reduce((s, f) => s + f.quantity, 0);
  const productionCapacity = factories.reduce((s, f) => s + f.quantity * f.level, 0);
  const activeFactories = factories.filter((f) => f.quantity > 0).length;
  const maxFactoryLevel = factories.reduce((m, f) => Math.max(m, f.level), 1);

  const orders = await db.all<{
    id: string;
    product_key: string;
    template_id: number;
    template_name: string;
    category_key: string;
    quantity: number;
    total_cost: number;
    started_at: number;
    completes_at: number;
    status: 'in_progress' | 'ready';
  }>(
    sql`SELECT o.id, o.product_key, o.template_id, t.name_fa AS template_name, t.category_id, c.key AS category_key,
               o.quantity, o.total_cost, o.started_at, o.completes_at, o.status
          FROM nation_production_orders o
          JOIN equipment_templates t ON t.id = o.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE o.nation_id = ${nation.id} AND o.status IN ('in_progress','ready')
         ORDER BY o.completes_at ASC`,
  );
  const inProgress = orders
    .filter((o) => o.status === 'in_progress')
    .map((o) => {
      const total = Math.max(1, Number(o.completes_at) - Number(o.started_at));
      const progress = Math.min(100, Math.max(0, Math.floor(((now - Number(o.started_at)) / total) * 100)));
      const remaining = Math.max(0, Number(o.completes_at) - now);
      return {
        id: o.id,
        productKey: o.product_key,
        templateId: Number(o.template_id),
        templateName: o.template_name,
        quantity: Number(o.quantity),
        totalCost: Number(o.total_cost),
        startedAt: toIso(Number(o.started_at))!,
        completesAt: toIso(Number(o.completes_at))!,
        progressPercent: progress,
        remainingSeconds: remaining,
        remainingFa: humanDuration(remaining),
      };
    });
  const readyToClaim = orders
    .filter((o) => o.status === 'ready')
    .map((o) => ({
      id: o.id,
      productKey: o.product_key,
      templateId: Number(o.template_id),
      templateName: o.template_name,
      quantity: Number(o.quantity),
      totalCost: Number(o.total_cost),
    }));

  // گزینه‌های تولید — فقط قالب‌های فعالِ دسته‌های مجاز
  const available = await db.all<{ id: number; code: string; name_fa: string; price: number | null; category_key: string }>(
    sql`SELECT t.id, t.code, t.name_fa, t.price, c.key AS category_key
          FROM equipment_templates t
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE t.is_active = 1 AND c.key IN (${ALL_PRODUCT_CATEGORIES})`,
  );
  const byCategory = new Map<string, { templateId: number; code: string; nameFa: string; price: number | null; unitCost: number }[]>();
  for (const t of available) {
    const price = t.price === null ? null : Number(t.price);
    const unitCost = price === null ? 0 : Math.max(1, Math.floor(price * PRODUCTION_COST_RATIO));
    const arr = byCategory.get(t.category_key) ?? [];
    arr.push({ templateId: Number(t.id), code: t.code, nameFa: t.name_fa, price, unitCost });
    byCategory.set(t.category_key, arr);
  }

  return {
    treasury: nation.treasury,
    factoryCount,
    activeFactories,
    factoryLines: factories.length,
    productionCapacity,
    maxFactoryLevel,
    productionSecondsPerUnit: PRODUCTION_SECONDS_PER_UNIT,
    productionCostRatio: PRODUCTION_COST_RATIO,
    factoryUpgradeFactor: 0.5,
    factories,
    products: PRODUCT_GROUPS.map((g) => ({
      key: g.key,
      labelFa: g.labelFa,
      emoji: g.emoji,
      templates: g.categories.flatMap((c) => byCategory.get(c) ?? []),
    })),
    inProgress,
    readyToClaim,
  };
}

/** شروع یک سفارش تولید — هزینه = نصف قیمت فروش، زمان = ۱۲۰ ثانیه برای هر واحد (سریع‌تر با سطح کارخانه) */
export async function startProduction(db: Db, nation: NationRow, input: { templateId: number; quantity: number }, now = nowSeconds()) {
  await sweepProductionOrders(db, nation.id, now);
  const factoryRowsNow = await factoryRows(db, nation.id);
  const factoryCount = factoryRowsNow.reduce((s, r) => s + Number(r.quantity), 0);
  if (factoryCount < 1) {
    throw ApiError.conflict('برای تولید باید حداقل یک کارخانه داشته باشید. از «خرید کارخانه» یا سوداگران کارخانه را بسازید.');
  }
  const maxFactoryLevel = factoryRowsNow.reduce((m, r) => Math.max(m, Math.max(1, Number(r.level ?? 1))), 1);
  const productionCapacity = factoryRowsNow.reduce((s, r) => s + Number(r.quantity) * Math.max(1, Number(r.level ?? 1)), 0);

  const quantity = Math.floor(Number(input.quantity));
  if (!Number.isFinite(quantity) || quantity < 1) throw ApiError.validation('تعداد باید دست‌کم ۱ باشد.');
  if (quantity > productionCapacity) throw ApiError.validation(`ظرفیت تولید شما ${productionCapacity} واحد در هر سفارش است (کارخانه‌ها × سطوحشان).`);

  const template = await db.first<{ id: number; name_fa: string; price: number | null; is_active: number; category_key: string }>(
    sql`SELECT t.id, t.name_fa, t.price, t.is_active, c.key AS category_key
          FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
         WHERE t.id = ${Math.floor(Number(input.templateId))}`,
  );
  if (!template || Number(template.is_active) !== 1) throw ApiError.notFound('این محصول معتبر نیست یا غیرفعال شده است.');
  if (!ALL_PRODUCT_CATEGORIES.includes(template.category_key)) {
    throw ApiError.validation('این دسته قابل تولید در کارخانه‌های کشور نیست.');
  }
  const price = template.price === null ? null : Number(template.price);
  if (price === null || price <= 0) throw ApiError.validation('این محصول هنوز قیمت‌گذاری نشده است.');
  const unitCost = Math.max(1, Math.floor(price * PRODUCTION_COST_RATIO));
  const totalCost = unitCost * quantity;
  const durationSeconds = Math.max(15, Math.ceil((quantity * PRODUCTION_SECONDS_PER_UNIT) / (1 + 0.25 * (maxFactoryLevel - 1))));

  const productGroup = PRODUCT_GROUPS.find((g) => (g.categories as readonly string[]).includes(template.category_key));
  const remaining = await spendTreasury(db, nation, {
    amount: totalCost,
    referenceType: 'production',
    reason: `🏭 سفارش تولید: ${quantity} × ${template.name_fa}`,
    meta: { templateId: template.id, quantity, unitCost, durationSeconds },
    idempotencyPrefix: 'production',
    now,
  });

  const orderId = uuid();
  const completesAt = now + durationSeconds;
  await db.run(
    sql`INSERT INTO nation_production_orders (id, nation_id, product_key, template_id, quantity, unit_cost, total_cost, started_at, completes_at, status)
         VALUES (${orderId}, ${nation.id}, ${productGroup?.key ?? 'custom'}, ${template.id}, ${quantity}, ${unitCost}, ${totalCost}, ${now}, ${completesAt}, 'in_progress')`,
  );
  await audit(db, {
    actor: null,
    action: 'industry.production_started',
    targetType: 'nation',
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: remaining, templateId: template.id, quantity, totalCost, durationSeconds },
    reason: `شروع تولید ${quantity} × ${template.name_fa}`,
  });
  await notify(db, {
    nationId: nation.id,
    kind: 'industry',
    title: '🏭 سفارش تولید ثبت شد',
    body: `${quantity} × ${template.name_fa} — تکمیل در ${humanDuration(durationSeconds)} دیگر.`,
  });
  return {
    orderId,
    templateId: Number(template.id),
    templateName: template.name_fa,
    quantity,
    unitCost,
    totalCost,
    durationSeconds,
    completesAt: toIso(completesAt)!,
    treasury: remaining,
  };
}

/** برداشت سفارش تکمیل‌شده به انبار */
export async function claimProduction(db: Db, nation: NationRow, orderId: string, now = nowSeconds()) {
  await sweepProductionOrders(db, nation.id, now);
  const order = await db.first<{
    id: string;
    template_id: number;
    quantity: number;
    status: string;
    total_cost: number;
    name_fa: string;
  }>(
    sql`SELECT o.id, o.template_id, o.quantity, o.status, o.total_cost, t.name_fa
          FROM nation_production_orders o JOIN equipment_templates t ON t.id = o.template_id
         WHERE o.id = ${String(orderId)} AND o.nation_id = ${nation.id}`,
  );
  if (!order) throw ApiError.notFound('این سفارش پیدا نشد.');
  if (order.status !== 'ready') throw ApiError.conflict('این سفارش هنوز آماده دریافت نیست.');
  await db.batch([
    sql`UPDATE nation_production_orders SET status = 'claimed' WHERE id = ${order.id}`,
    sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
         VALUES (${nation.id}, ${order.template_id}, ${order.quantity}, ${now}, ${now})
         ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${order.quantity}, updated_at = ${now}`,
  ]);
  await audit(db, {
    actor: null,
    action: 'industry.production_claimed',
    targetType: 'nation',
    targetId: nation.id,
    before: null,
    after: { templateId: Number(order.template_id), quantity: Number(order.quantity) },
    reason: `دریافت سفارش تولید: ${order.quantity} × ${order.name_fa}`,
  });
  return { orderId: order.id, templateId: Number(order.template_id), templateName: order.name_fa, quantity: Number(order.quantity) };
}

/** ارتقای کارخانه — درآمدش در هر چرخه × سطح می‌شود */
export async function upgradeFactory(db: Db, nation: NationRow, templateId: number, now = nowSeconds()) {
  const row = await db.first<{ price: number | null; quantity: number; name_fa: string; level: number | null }>(
    sql`SELECT t.price, i.quantity, t.name_fa, l.level
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_factory_levels l ON l.nation_id = i.nation_id AND l.template_id = t.id
         WHERE i.nation_id = ${nation.id} AND t.id = ${Math.floor(Number(templateId))} AND c.key = 'factories'`,
  );
  if (!row) throw ApiError.notFound('این کارخانه را ندارید.');
  const level = Math.max(1, Number(row.level ?? 1));
  if (level >= FACTORY_MAX_LEVEL) throw ApiError.conflict('کارخانه به حداکثر سطح (۱۰) رسیده است.');
  const cost = upgradeCostFor(row.price === null ? null : Number(row.price), level);
  const remaining = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: 'factory_upgrade',
    reason: `⏫ ارتقای کارخانه: ${row.name_fa} → سطح ${level + 1}`,
    meta: { templateId, fromLevel: level, toLevel: level + 1 },
    idempotencyPrefix: 'factory_upgrade',
    now,
  });
  await db.run(
    sql`INSERT INTO nation_factory_levels (nation_id, template_id, level, updated_at)
         VALUES (${nation.id}, ${Math.floor(Number(templateId))}, ${level + 1}, ${now})
         ON CONFLICT (nation_id, template_id) DO UPDATE SET level = ${level + 1}, updated_at = ${now}`,
  );
  await audit(db, {
    actor: null,
    action: 'industry.factory_upgraded',
    targetType: 'nation',
    targetId: nation.id,
    before: { level, treasury: nation.treasury },
    after: { level: level + 1, treasury: remaining },
    reason: `ارتقای ${row.name_fa} به سطح ${level + 1}`,
  });
  return { templateId: Math.floor(Number(templateId)), level: level + 1, cost, treasury: remaining };
}
