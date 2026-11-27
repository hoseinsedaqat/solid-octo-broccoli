import type { EconomyRules } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso } from '../core/format';
import { purchaseIdempotencyKey, uuid } from '../core/ids';
import { loadInventory, refreshNationStats, type NationRow } from '../db/queries';
import type { SettingsBundle } from '../core/settings';
import { audit } from './auditService';
import { notify } from './notificationService';

export interface CatalogItem {
  templateId: number;
  code: string;
  nameFa: string;
  unitFa: string;
  description: string;
  price: number | null;
  ownedQuantity: number;
  purchasable: boolean;
  disabledReason: string | null;
  purchaseLimitPerCycle: number | null;
  boughtThisCycle: number;
  remainingThisCycle: number | null;
  attackPoints: number | null;
  defensePoints: number | null;
  maintenancePerUnit: number | null;
}

export interface CatalogCategory {
  key: string;
  labelFa: string;
  shopLabelFa: string;
  emoji: string;
  role: string;
  sortOrder: number;
  itemCount: number;
  purchasableCount: number;
}

export async function listCategories(db: Db): Promise<CatalogCategory[]> {
  const rows = await db.all<CatalogCategory & { is_active: number }>(
    sql`SELECT c.key AS key, c.label_fa AS labelFa, c.shop_label_fa AS shopLabelFa, c.emoji AS emoji, c.role AS role,
               c.sort_order AS sortOrder,
               COUNT(t.id) AS itemCount,
               SUM(CASE WHEN t.price IS NOT NULL AND t.is_for_sale = 1 AND t.is_active = 1 THEN 1 ELSE 0 END) AS purchasableCount
          FROM equipment_categories c
          LEFT JOIN equipment_templates t ON t.category_id = c.id
         WHERE c.is_active = 1
         GROUP BY c.id
         ORDER BY c.sort_order, c.label_fa`,
  );
  return rows.map((r) => ({ ...r, itemCount: Number(r.itemCount), purchasableCount: Number(r.purchasableCount ?? 0) }));
}

export async function listCategoryItems(
  db: Db,
  nation: NationRow,
  categoryKey: string,
  settings: SettingsBundle,
): Promise<{ category: CatalogCategory; items: CatalogItem[] }> {
  const category = await db.first<CatalogCategory & { id: number }>(
    sql`SELECT id, key, label_fa AS labelFa, shop_label_fa AS shopLabelFa, emoji, role, sort_order AS sortOrder
          FROM equipment_categories WHERE key = ${categoryKey} COLLATE NOCASE`,
  );
  if (!category) throw ApiError.notFound('دسته‌بندی یافت نشد.');

  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT t.id AS templateId, t.code, t.name_fa AS nameFa, t.unit_fa AS unitFa, t.description,
               t.price, t.attack_points AS attackPoints, t.defense_points AS defensePoints,
               t.purchase_limit_per_cycle AS purchaseLimitPerCycle, t.maintenance_per_unit AS maintenancePerUnit,
               t.is_for_sale AS isForSale, t.is_active AS isActive,
               COALESCE(i.quantity, 0) AS ownedQuantity
          FROM equipment_templates t
          LEFT JOIN nation_inventory i ON i.template_id = t.id AND i.nation_id = ${nation.id}
         WHERE t.category_id = ${category.id} AND t.is_active = 1
         ORDER BY t.name_fa`,
  );

  const cycleWindow = await currentCycleWindow(db, nation, settings);
  const items: CatalogItem[] = [];
  for (const r of rows) {
    const price = r.price === null || r.price === undefined ? null : Number(r.price);
    const owned = Number(r.ownedQuantity ?? 0);
    const limit = r.purchaseLimitPerCycle === null || r.purchaseLimitPerCycle === undefined ? null : Number(r.purchaseLimitPerCycle);
    let boughtThisCycle = 0;
    if (limit) boughtThisCycle = await boughtInWindow(db, nation.id, Number(r.templateId), cycleWindow);
    const remaining = limit ? Math.max(0, limit - boughtThisCycle) : null;

    let disabledReason: string | null = null;
    if (!settings.features.shopEnabled) disabledReason = 'فروشگاه غیرفعال است';
    else if (Number(r.isActive) !== 1) disabledReason = 'این تجهیزات غیرفعال است';
    else if (Number(r.isForSale) !== 1) disabledReason = 'فروش متوقف شده است';
    else if (price === null) disabledReason = 'قیمت توسط مدیر تعیین نشده است';
    else if (price <= 0) disabledReason = 'قیمت نامعتبر است';
    else if (remaining === 0) disabledReason = 'سقف خرید این دوره تکمیل شده است';
    else if (price > nation.treasury) disabledReason = 'موجودی خزانه کافی نیست';

    items.push({
      templateId: Number(r.templateId),
      code: String(r.code),
      nameFa: String(r.nameFa),
      unitFa: String(r.unitFa),
      description: String(r.description ?? ''),
      price,
      ownedQuantity: owned,
      purchasable: disabledReason === null,
      disabledReason,
      purchaseLimitPerCycle: limit,
      boughtThisCycle,
      remainingThisCycle: remaining,
      attackPoints: r.attackPoints === null || r.attackPoints === undefined ? null : Number(r.attackPoints),
      defensePoints: r.defensePoints === null || r.defensePoints === undefined ? null : Number(r.defensePoints),
      maintenancePerUnit: r.maintenancePerUnit === null || r.maintenancePerUnit === undefined ? null : Number(r.maintenancePerUnit),
    });
  }
  return {
    category: {
      key: category.key,
      labelFa: category.labelFa,
      shopLabelFa: category.shopLabelFa,
      emoji: category.emoji,
      role: category.role,
      sortOrder: Number(category.sortOrder),
      itemCount: items.length,
      purchasableCount: items.filter((i) => i.purchasable).length,
    },
    items,
  };
}

async function currentCycleWindow(db: Db, nation: NationRow, settings: SettingsBundle): Promise<{ from: number; to: number }> {
  const override = await db.first<{ income_cycle_seconds: number | null }>(
    sql`SELECT income_cycle_seconds FROM nation_settings WHERE nation_id = ${nation.id}`,
  );
  const cycle = Math.max(60, override?.income_cycle_seconds ?? settings.economy.incomeCycleSeconds);
  const completed = Math.max(0, Math.floor((nowSeconds() - nation.income_anchor_at) / cycle));
  return { from: nation.income_anchor_at + completed * cycle, to: nation.income_anchor_at + (completed + 1) * cycle };
}

async function boughtInWindow(db: Db, nationId: number, templateId: number, window: { from: number; to: number }): Promise<number> {
  const row = await db.first<{ c: number | null }>(
    sql`SELECT COALESCE(SUM(ti.quantity), 0) AS c
          FROM transaction_items ti
          JOIN transactions t ON t.id = ti.transaction_id
         WHERE t.nation_id = ${nationId} AND t.type = 'purchase'
           AND ti.template_id = ${templateId}
           AND t.created_at >= ${window.from} AND t.created_at < ${window.to}`,
  );
  return Number(row?.c ?? 0);
}

export interface PurchaseInput {
  templateId: number;
  quantity: number;
  idempotencyKey: string;
}

export interface PurchaseResult {
  duplicate: boolean;
  transactionId: number;
  transactionUuid: string;
  templateId: number;
  nameFa: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  treasuryBefore: number;
  treasuryAfter: number;
  newQuantity: number;
  maintenanceImpact: number;
}

/**
 * Atomic marketplace purchase.
 *
 * Guarantees:
 *  - a UNIQUE idempotency_key inside the same D1 batch makes a replayed request
 *    impossible to double-charge (the whole batch aborts and the stored result
 *    is returned instead);
 *  - `nations.treasury CHECK (treasury >= 0)` makes an overdraft impossible at
 *    the database level, even if two requests race past the pre-check;
 *  - prices are read from D1 only — never from the client.
 */
export async function purchase(
  db: Db,
  nation: NationRow,
  input: PurchaseInput,
  settings: SettingsBundle,
  actor: { userId: number; telegramId: number },
  botToken?: string,
): Promise<PurchaseResult> {
  if (!settings.features.shopEnabled) throw ApiError.disabled('فروشگاه');
  if (nation.status !== 'active') throw ApiError.forbidden('این کشور امکان خرید ندارد.');
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw ApiError.validation('تعداد نامعتبر است.');
  if (input.quantity > 100000) throw ApiError.validation('حداکثر تعداد در هر خرید ۱۰۰,۰۰۰ عدد است.');

  const tpl = await db.first<Record<string, unknown>>(
    sql`SELECT t.id, t.code, t.name_fa, t.unit_fa, t.price, t.is_for_sale, t.is_active, t.purchase_limit_per_cycle,
               t.maintenance_per_unit, c.label_fa AS category_label, c.key AS category_key
          FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
         WHERE t.id = ${input.templateId}`,
  );
  if (!tpl) throw ApiError.notFound('تجهیزات یافت نشد.');
  if (Number(tpl.is_active) !== 1) throw ApiError.forbidden('این تجهیزات غیرفعال است.');
  if (Number(tpl.is_for_sale) !== 1) throw ApiError.forbidden('فروش این تجهیزات متوقف شده است.');
  const unitPrice = tpl.price === null || tpl.price === undefined ? null : Number(tpl.price);
  if (unitPrice === null) {
    throw ApiError.validation(`قیمت «${tpl.name_fa}» هنوز توسط مدیر تعیین نشده است؛ خرید آن غیرفعال است.`);
  }
  if (!(unitPrice > 0)) throw ApiError.validation('قیمت این تجهیزات نامعتبر است (صفر یا منفی).');

  const limit = tpl.purchase_limit_per_cycle === null || tpl.purchase_limit_per_cycle === undefined ? null : Number(tpl.purchase_limit_per_cycle);
  if (limit) {
    const window = await currentCycleWindow(db, nation, settings);
    const already = await boughtInWindow(db, nation.id, input.templateId, window);
    if (already + input.quantity > limit) {
      throw ApiError.validation(`سقف خرید این تجهیزات در هر دوره ${limit} عدد است (تاکنون ${already} خرید شده).`);
    }
  }

  const totalCost = unitPrice * input.quantity;
  if (totalCost > nation.treasury) {
    throw ApiError.insufficientFunds(
      `موجودی خزانه کافی نیست. هزینه: ${totalCost.toLocaleString('en-US')} سکه — موجودی: ${nation.treasury.toLocaleString('en-US')} سکه.`,
      { required: totalCost, available: nation.treasury },
    );
  }

  const key = purchaseIdempotencyKey(nation.id, input.idempotencyKey);
  const txUuid = uuid();
  const now = nowSeconds();
  const maintenancePerUnit = tpl.maintenance_per_unit === null || tpl.maintenance_per_unit === undefined ? 0 : Number(tpl.maintenance_per_unit);

  try {
    await db.batch([
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                     idempotency_key, reference_type, reference_id, reason, created_by_user_id, meta, created_at)
           VALUES (${txUuid}, ${nation.id}, 'purchase', ${-totalCost}, ${nation.treasury}, ${nation.treasury - totalCost}, 'coin',
                   ${key}, 'equipment_template', ${input.templateId}, 'خرید تجهیزات', ${actor.userId},
                   ${JSON.stringify({ templateId: input.templateId, quantity: input.quantity, unitPrice })}, ${now})`,
      sql`INSERT INTO transaction_items (transaction_id, template_id, name_snapshot, category_snapshot, quantity, unit_price, total_price, created_at)
           VALUES (
             (SELECT id FROM transactions WHERE idempotency_key = ${key}),
             ${input.templateId}, ${String(tpl.name_fa)}, ${String(tpl.category_key)}, ${input.quantity}, ${unitPrice}, ${totalCost}, ${now})`,
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
           VALUES (${nation.id}, ${input.templateId}, ${input.quantity}, ${now}, ${now})
           ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${input.quantity}, updated_at = ${now}`,
      sql`UPDATE nations SET treasury = treasury - ${totalCost}, updated_at = ${now} WHERE id = ${nation.id}`,
      sql`UPDATE nation_economy SET total_spent = total_spent + ${totalCost}, updated_at = ${now} WHERE nation_id = ${nation.id}`,
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (isDuplicateKeyError(message, 'idempotency_key') || isDuplicateKeyError(message, 'sqlite_autoindex')) {
      const existing = await db.first<Record<string, unknown>>(
        sql`SELECT t.id, t.uuid, t.amount, t.balance_after, ti.quantity, ti.unit_price, ti.total_price
               FROM transactions t JOIN transaction_items ti ON ti.transaction_id = t.id
              WHERE t.idempotency_key = ${key} LIMIT 1`,
      );
      if (existing) {
        return {
          duplicate: true,
          transactionId: Number(existing.id),
          transactionUuid: String(existing.uuid),
          templateId: input.templateId,
          nameFa: String(tpl.name_fa),
          quantity: Number(existing.quantity),
          unitPrice: Number(existing.unit_price ?? unitPrice),
          totalCost: Math.abs(Number(existing.amount)),
          treasuryBefore: Number(existing.balance_after) + Math.abs(Number(existing.amount)),
          treasuryAfter: Number(existing.balance_after),
          newQuantity: await quantityOf(db, nation.id, input.templateId),
          maintenanceImpact: 0,
        };
      }
      throw ApiError.conflict('درخواست تکراری رد شد؛ نتیجه خرید قبلی در دسترس نیست.');
    }
    if (message.toLowerCase().includes('check constraint')) {
      throw ApiError.insufficientFunds('موجودی خزانه برای این خرید کافی نیست (ممنوعیت موجودی منفی).');
    }
    throw err;
  }

  const after = await db.first<{ treasury: number; tx_id: number | null }>(
    sql`SELECT n.treasury AS treasury,
               (SELECT t.id FROM transactions t WHERE t.idempotency_key = ${key}) AS tx_id
          FROM nations n WHERE n.id = ${nation.id}`,
  );
  const treasuryAfter = Number(after?.treasury ?? nation.treasury - totalCost);
  await refreshNationStats(db, { ...nation, treasury: treasuryAfter }, settings);
  await audit(db, {
    actor: { userId: actor.userId, telegramId: actor.telegramId },
    action: 'shop.purchase',
    targetType: 'nation',
    targetId: nation.id,
    after: { templateId: input.templateId, code: tpl.code, quantity: input.quantity, unitPrice, totalCost },
    reason: 'marketplace',
  });
  await notify(db, {
    nationId: nation.id,
    kind: 'purchase',
    title: '✅ خرید انجام شد',
    body: `${input.quantity.toLocaleString('en-US')} × ${tpl.name_fa} برای ${nation.name} خریداری شد (${totalCost.toLocaleString('en-US')} سکه).`,
    telegram: botToken ? { botToken, chatId: actor.telegramId, text: `✅ خرید موفق\n${input.quantity} عدد ${tpl.name_fa}\nهزینه: ${totalCost.toLocaleString('en-US')} سکه` } : null,
  });

  return {
    duplicate: false,
    transactionId: Number(after?.tx_id ?? 0),
    transactionUuid: txUuid,
    templateId: input.templateId,
    nameFa: String(tpl.name_fa),
    quantity: input.quantity,
    unitPrice,
    totalCost,
    treasuryBefore: nation.treasury,
    treasuryAfter,
    newQuantity: await quantityOf(db, nation.id, input.templateId),
    maintenanceImpact: maintenancePerUnit * input.quantity,
  };
}

function isDuplicateKeyError(message: string, indexName: string): boolean {
  const m = message.toLowerCase();
  return (m.includes('unique') || m.includes('constraint failed')) && (m.includes(indexName) || m.includes('transactions'));
}

async function quantityOf(db: Db, nationId: number, templateId: number): Promise<number> {
  const row = await db.first<{ quantity: number }>(
    sql`SELECT quantity FROM nation_inventory WHERE nation_id = ${nationId} AND template_id = ${templateId}`,
  );
  return Number(row?.quantity ?? 0);
}

export interface InventoryItemView {
  inventoryId: number;
  templateId: number;
  code: string;
  nameFa: string;
  quantity: number;
  unitFa: string;
  price: number | null;
  attackPoints: number | null;
  defensePoints: number | null;
  description: string;
  purchasable: boolean;
  updatedAt: string | null;
}

export interface InventoryGroupView {
  categoryKey: string;
  labelFa: string;
  emoji: string;
  total: number;
  items: InventoryItemView[];
}

export async function inventoryView(db: Db, nationId: number, settings: SettingsBundle): Promise<InventoryGroupView[]> {
  const rows = await loadInventory(db, nationId);
  const grouped = new Map<string, { labelFa: string; emoji: string; items: InventoryItemView[]; total: number }>();
  for (const r of rows) {
    const bucket = grouped.get(r.categoryKey) ?? { labelFa: r.categoryLabelFa, emoji: r.emoji, items: [], total: 0 };
    bucket.items.push({
      inventoryId: r.id,
      templateId: r.templateId,
      code: r.code,
      nameFa: r.nameFa,
      quantity: r.quantity,
      unitFa: r.unitFa,
      price: r.price,
      attackPoints: r.attackPoints,
      defensePoints: r.defensePoints,
      description: r.description,
      purchasable: Number(r.is_for_sale) === 1 && r.price !== null,
      updatedAt: toIso(r.updated_at),
    });
    bucket.total += r.quantity;
    grouped.set(r.categoryKey, bucket);
  }
  void settings;
  return [...grouped.entries()].map(([key, v]) => ({ categoryKey: key, labelFa: v.labelFa, emoji: v.emoji, total: v.total, items: v.items }));
}

export function estimateMaintenance(rules: EconomyRules, gross: number, perUnit: number, upkeepBase: number) {
  return Math.floor(gross * rules.maintenanceRate) + perUnit + upkeepBase;
}
