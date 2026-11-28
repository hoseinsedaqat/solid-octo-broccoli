import {
  RESOURCES,
  REFINED_PRODUCTS,
  REFINERY_RECIPES,
  TRADE_PARTNERS,
  CONTRACT_TYPES,
  BUDGET_POTS,
  IMPORT_SHIPPING_FEE,
  CONTRACT_TERM_DAYS,
} from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso } from '../core/format';
import { uuid } from '../core/ids';
import type { NationRow } from '../db/queries';
import { audit } from './auditService';

const resourceDef = (key: string) => RESOURCES.find((r) => r.key === key) ?? null;
const partnerDef = (key: string) => TRADE_PARTNERS.find((p) => p.key === key) ?? null;
const recipeDef = (key: string) => REFINERY_RECIPES.find((r) => r.key === key) ?? null;
const contractTypeDef = (key: string) => CONTRACT_TYPES.find((t) => t.key === key) ?? null;

async function stockOf(db: Db, nationId: number, key: string): Promise<number> {
  const row = await db.first<{ stock: number }>(sql`SELECT stock FROM nation_resources WHERE nation_id = ${nationId} AND resource_key = ${key}`);
  return Number(row?.stock ?? 0);
}

/** اتمی: خزانه را تغییر می‌دهد و یک ردیف دفتر کل می‌نویسد */
async function ledger(
  batch: ReturnType<typeof sql>[],
  nation: NationRow,
  type: string,
  amount: number,
  reason: string,
  referenceType: string,
  referenceId: number | null,
  now: number,
  meta: Record<string, unknown> = {},
) {
  batch.push(
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                  idempotency_key, reference_type, reference_id, reason, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, ${type}, ${amount}, ${nation.treasury}, ${nation.treasury + amount}, 'coin',
                 ${`${referenceType}:${nation.id}:${uuid()}`}, ${referenceType}, ${referenceId}, ${reason}, ${JSON.stringify(meta)}, ${now})`,
  );
}

/** عملیات پالایش سررسیدشده را تسویه می‌کند (تسویهٔ تنبل — idempotent) */
export async function settleRefineries(db: Db, nationId: number, now = nowSeconds()): Promise<number> {
  const due = await db.all<{ id: number; output_key: string; output_qty: number }>(
    sql`SELECT id, output_key, output_qty FROM nation_refinery_ops WHERE nation_id = ${nationId} AND settled_at IS NULL AND completes_at <= ${now}`,
  );
  if (due.length === 0) return 0;
  const batch: ReturnType<typeof sql>[] = [];
  for (const op of due) {
    batch.push(
      sql`UPDATE nation_refinery_ops SET settled_at = ${now} WHERE id = ${op.id} AND settled_at IS NULL`,
      sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
           VALUES (${nationId}, ${op.output_key}, 0, ${op.output_qty}, ${now})
           ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${op.output_qty}, updated_at = ${now}`,
    );
  }
  await db.batch(batch);
  return due.length;
}

/** قراردادهای آتی سررسیدشده را تسویه می‌کند: صادرات → پول خزانه؛ واردات → کالا در انبار */
export async function settleContracts(db: Db, nationId: number, now = nowSeconds()): Promise<number> {
  const nation = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${nationId}`);
  if (!nation) return 0;
  const due = await db.all<{ id: number; side: string; resource_key: string; quantity: number; unit_price: number; total: number; partner_key: string }>(
    sql`SELECT id, side, resource_key, quantity, unit_price, total, partner_key FROM nation_contracts
         WHERE nation_id = ${nationId} AND status = 'active' AND completes_at <= ${now}`,
  );
  if (due.length === 0) return 0;
  for (const c of due) {
    const batch: ReturnType<typeof sql>[] = [];
    batch.push(sql`UPDATE nation_contracts SET status = 'completed', settled_at = ${now} WHERE id = ${c.id} AND status = 'active'`);
    if (c.side === 'export') {
      batch.push(sql`UPDATE nations SET treasury = treasury + ${c.total}, updated_at = ${now} WHERE id = ${nationId}`);
      batch.push(
        sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                      idempotency_key, reference_type, reference_id, reason, meta, created_at)
             VALUES (${uuid()}, ${nationId}, 'contract', ${c.total}, ${nation.treasury}, ${nation.treasury + c.total}, 'coin',
                     ${`contract-settle:${c.id}`}, 'contract', ${c.id},
                     ${`تسویه قرارداد صادرات ${c.quantity.toLocaleString('en-US')} واحد ${c.resource_key}`},
                     ${JSON.stringify({ side: 'export', resourceKey: c.resource_key, quantity: c.quantity, unitPrice: c.unit_price })}, ${now})`,
      );
      batch.push(sql`UPDATE nation_economy SET total_income = total_income + ${c.total}, updated_at = ${now} WHERE nation_id = ${nationId}`);
    } else {
      batch.push(
        sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
             VALUES (${nationId}, ${c.resource_key}, 0, ${c.quantity}, ${now})
             ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${c.quantity}, updated_at = ${now}`,
      );
    }
    batch.push(
      sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
           VALUES (${nationId}, 'contract_settle', ${c.resource_key}, ${c.partner_key}, ${c.quantity}, ${c.unit_price}, ${c.total}, ${now})`,
    );
    await db.batch(batch);
  }
  return due.length;
}

/** وضعیت کامل منابع کشور — با تسویهٔ تنبل پالایشگاه و قراردادها */
export async function resourceState(db: Db, nation: NationRow, now = nowSeconds()) {
  await settleRefineries(db, nation.id, now);
  await settleContracts(db, nation.id, now);

  const rows = await db.all<{ resource_key: string; reserves: number; stock: number }>(
    sql`SELECT resource_key, reserves, stock FROM nation_resources WHERE nation_id = ${nation.id}`,
  );
  const byKey = new Map(rows.map((r) => [String(r.resource_key), { reserves: Number(r.reserves), stock: Number(r.stock) }]));

  const fresh = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  const treasury = Number(fresh?.treasury ?? nation.treasury);

  const resources = RESOURCES.map((r) => ({
    key: r.key,
    emoji: r.emoji,
    nameFa: r.nameFa,
    unitFa: r.unitFa,
    market: r.market,
    extractCost: r.extractCost,
    capacity: r.capacity,
    wells: r.wells,
    reserves: byKey.get(r.key)?.reserves ?? 0,
    stock: byKey.get(r.key)?.stock ?? 0,
  }));
  const products = REFINED_PRODUCTS.map((p) => ({
    key: p.key,
    emoji: p.emoji,
    nameFa: p.nameFa,
    unitFa: p.unitFa,
    stock: byKey.get(p.key)?.stock ?? 0,
  }));

  const refineryOps = (
    await db.all<{ id: number; recipe_key: string; input_key: string; input_qty: number; output_key: string; output_qty: number; cost: number; started_at: number; completes_at: number }>(
      sql`SELECT id, recipe_key, input_key, input_qty, output_key, output_qty, cost, started_at, completes_at
            FROM nation_refinery_ops WHERE nation_id = ${nation.id} AND settled_at IS NULL ORDER BY completes_at ASC`,
    )
  ).map((op) => ({
    id: Number(op.id),
    recipeKey: String(op.recipe_key),
    inputKey: String(op.input_key),
    inputQty: Number(op.input_qty),
    outputKey: String(op.output_key),
    outputQty: Number(op.output_qty),
    cost: Number(op.cost),
    startedAt: toIso(Number(op.started_at)),
    completesAt: toIso(Number(op.completes_at)),
    completesInSeconds: Math.max(0, Number(op.completes_at) - now),
  }));

  const tradeTotals = await db.first<{ export_total: number | null; import_total: number | null; export_count: number | null; import_count: number | null }>(
    sql`SELECT SUM(CASE WHEN kind IN ('export','contract_settle') THEN total ELSE 0 END) AS export_total,
               SUM(CASE WHEN kind = 'import' THEN total ELSE 0 END) AS import_total,
               SUM(CASE WHEN kind IN ('export','contract_settle') THEN 1 ELSE 0 END) AS export_count,
               SUM(CASE WHEN kind = 'import' THEN 1 ELSE 0 END) AS import_count
          FROM trade_log WHERE nation_id = ${nation.id}`,
  );

  const pots = await db.all<{ pot_key: string; amount: number }>(sql`SELECT pot_key, amount FROM nation_budget_pots WHERE nation_id = ${nation.id}`);
  const budgets = BUDGET_POTS.map((p) => ({ key: p.key, emoji: p.emoji, nameFa: p.nameFa, amount: Number(pots.find((x) => String(x.pot_key) === p.key)?.amount ?? 0) }));

  return {
    treasury,
    resources,
    products,
    refineryOps,
    tradeTotals: {
      exportTotal: Number(tradeTotals?.export_total ?? 0),
      importTotal: Number(tradeTotals?.import_total ?? 0),
      exportCount: Number(tradeTotals?.export_count ?? 0),
      importCount: Number(tradeTotals?.import_count ?? 0),
    },
    budgets,
    market: RESOURCES.map((r) => ({ key: r.key, emoji: r.emoji, nameFa: r.nameFa, unitFa: r.unitFa, price: r.market })),
  };
}

/** استخراج از میدان — هزینه ثابت هر عملیات، مقدار در هر عملیات ≤ ظرفیت */
export async function extract(db: Db, nation: NationRow, key: string, amount: number, now = nowSeconds()) {
  const def = resourceDef(key);
  if (!def) throw ApiError.validation('منبع انتخاب‌شده معتبر نیست.');
  const qty = Math.floor(Number(amount));
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation('مقدار استخراج نامعتبر است.');
  if (qty > def.capacity) throw ApiError.validation(`حداکثر ظرفیت هر عملیات ${def.capacity.toLocaleString('en-US')} واحد است.`);
  if (nation.treasury < def.extractCost) throw ApiError.validation('موجودی ناکافی است.');
  const row = await db.first<{ reserves: number }>(sql`SELECT reserves FROM nation_resources WHERE nation_id = ${nation.id} AND resource_key = ${def.key}`);
  const reserves = Number(row?.reserves ?? 0);
  if (reserves < qty) throw ApiError.validation('ذخایر این منبع کافی نیست.');

  const batch: ReturnType<typeof sql>[] = [
    sql`UPDATE nation_resources SET reserves = reserves - ${qty}, stock = stock + ${qty}, updated_at = ${now}
         WHERE nation_id = ${nation.id} AND resource_key = ${def.key} AND reserves >= ${qty}`,
    sql`UPDATE nations SET treasury = treasury - ${def.extractCost}, updated_at = ${now} WHERE id = ${nation.id}`,
  ];
  await ledger(batch, nation, 'resource_extract', -def.extractCost, `استخراج ${qty.toLocaleString('en-US')} ${def.unitFa} ${def.nameFa}`, 'resource', null, now, { resourceKey: def.key, quantity: qty });
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${def.extractCost}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  await db.batch(batch);
  await audit(db, { actor: null, action: 'resource.extract', targetType: 'nation', targetId: nation.id, before: { reserves, treasury: nation.treasury }, after: { reserves: reserves - qty, stockDelta: qty }, reason: `استخراج ${def.nameFa}` });
  return { resourceKey: def.key, extracted: qty, cost: def.extractCost, reservesLeft: reserves - qty };
}

/** فروش در بازار منابع — اگر شریک تجاری داده شود، در لاگ تجارت ثبت می‌شود */
export async function sellResource(db: Db, nation: NationRow, key: string, amount: number, partnerKey: string | null = null, now = nowSeconds()) {
  const def = resourceDef(key);
  if (!def) throw ApiError.validation('منبع انتخاب‌شده معتبر نیست.');
  const qty = Number(amount);
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation('مقدار فروش نامعتبر است.');
  const income = Math.floor(qty * def.market);
  const stock = await stockOf(db, nation.id, def.key);
  if (stock < qty) throw ApiError.validation('موجودی این منبع در انبار کافی نیست.');

  const isTrade = partnerKey !== null && partnerDef(partnerKey) !== null;
  const batch: ReturnType<typeof sql>[] = [
    sql`UPDATE nation_resources SET stock = stock - ${qty}, updated_at = ${now}
         WHERE nation_id = ${nation.id} AND resource_key = ${def.key} AND stock >= ${qty}`,
    sql`UPDATE nations SET treasury = treasury + ${income}, updated_at = ${now} WHERE id = ${nation.id}`,
  ];
  await ledger(batch, nation, isTrade ? 'trade_export' : 'resource_sale', income,
    `${isTrade ? 'صادرات' : 'فروش'} ${qty.toLocaleString('en-US')} ${def.unitFa} ${def.nameFa}`,
    'resource', null, now, { resourceKey: def.key, quantity: qty, unitPrice: def.market, partnerKey: partnerKey ?? undefined });
  batch.push(sql`UPDATE nation_economy SET total_income = total_income + ${income}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  if (isTrade && partnerKey) {
    batch.push(
      sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
           VALUES (${nation.id}, 'export', ${def.key}, ${partnerKey}, ${qty}, ${def.market}, ${income}, ${now})`,
    );
  }
  await db.batch(batch);
  await audit(db, { actor: null, action: isTrade ? 'trade.export' : 'resource.sell', targetType: 'nation', targetId: nation.id, before: { stock, treasury: nation.treasury }, after: { stock: stock - qty, treasury: nation.treasury + income }, reason: `${isTrade ? 'صادرات' : 'فروش'} ${def.nameFa}` });
  return { resourceKey: def.key, sold: qty, unitPrice: def.market, total: income, treasury: nation.treasury + income };
}

/** واردات از شرکای تجاری — قیمت بازار + هزینهٔ حمل ثابت */
export async function importResource(db: Db, nation: NationRow, key: string, quantity: number, partnerKey: string, now = nowSeconds()) {
  const def = resourceDef(key);
  if (!def) throw ApiError.validation('منبع انتخاب‌شده معتبر نیست.');
  const partner = partnerDef(partnerKey);
  if (!partner) throw ApiError.validation('کشور فروشنده معتبر نیست.');
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation('مقدار خرید نامعتبر است.');
  const goods = Math.floor(qty * def.market);
  const total = goods + IMPORT_SHIPPING_FEE;
  if (nation.treasury < total) throw ApiError.validation('موجودی ناکافی است.');

  const batch: ReturnType<typeof sql>[] = [
    sql`UPDATE nations SET treasury = treasury - ${total}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
         VALUES (${nation.id}, ${def.key}, 0, ${qty}, ${now})
         ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${qty}, updated_at = ${now}`,
  ];
  await ledger(batch, nation, 'trade_import', -total,
    `واردات ${qty.toLocaleString('en-US')} ${def.unitFa} ${def.nameFa} از ${partner.nameFa}`,
    'trade', null, now, { resourceKey: def.key, quantity: qty, unitPrice: def.market, shippingFee: IMPORT_SHIPPING_FEE, partnerKey });
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${total}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  batch.push(
    sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
         VALUES (${nation.id}, 'import', ${def.key}, ${partnerKey}, ${qty}, ${def.market}, ${total}, ${now})`,
  );
  await db.batch(batch);
  await audit(db, { actor: null, action: 'trade.import', targetType: 'nation', targetId: nation.id, before: { treasury: nation.treasury }, after: { treasury: nation.treasury - total }, reason: `واردات ${def.nameFa} از ${partner.nameFa}` });
  return { resourceKey: def.key, quantity: qty, goods, shippingFee: IMPORT_SHIPPING_FEE, total, treasury: nation.treasury - total };
}

/** شروع یک عملیات پالایش — ۳۰ دقیقه تا تسویهٔ تنبل */
export async function startRefinery(db: Db, nation: NationRow, recipeKey: string, now = nowSeconds()) {
  const recipe = recipeDef(recipeKey);
  if (!recipe) throw ApiError.validation('دستور پالایش انتخاب‌شده معتبر نیست.');
  const stock = await stockOf(db, nation.id, recipe.inputKey);
  if (stock < recipe.inputQty) throw ApiError.validation('موجودی مادهٔ خام کافی نیست.');
  if (nation.treasury < recipe.cost) throw ApiError.validation('موجودی ناکافی است.');
  const inputDef = resourceDef(recipe.inputKey)!;

  const batch: ReturnType<typeof sql>[] = [
    sql`UPDATE nation_resources SET stock = stock - ${recipe.inputQty}, updated_at = ${now}
         WHERE nation_id = ${nation.id} AND resource_key = ${recipe.inputKey} AND stock >= ${recipe.inputQty}`,
    sql`UPDATE nations SET treasury = treasury - ${recipe.cost}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO nation_refinery_ops (nation_id, recipe_key, input_key, input_qty, output_key, output_qty, cost, started_at, completes_at)
         VALUES (${nation.id}, ${recipe.key}, ${recipe.inputKey}, ${recipe.inputQty}, ${recipe.outputKey}, ${recipe.outputQty}, ${recipe.cost}, ${now}, ${now + recipe.minutes * 60})`,
  ];
  await ledger(batch, nation, 'refinery', -recipe.cost,
    `پالایش ${recipe.inputQty.toLocaleString('en-US')} ${inputDef.unitFa} ${inputDef.nameFa}`,
    'refinery', null, now, { recipeKey: recipe.key, inputKey: recipe.inputKey, outputKey: recipe.outputKey, outputQty: recipe.outputQty });
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${recipe.cost}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  await db.batch(batch);
  await audit(db, { actor: null, action: 'refinery.start', targetType: 'nation', targetId: nation.id, reason: `پالایش ${recipe.key}`, after: { inputQty: recipe.inputQty, cost: recipe.cost } });
  return { recipeKey: recipe.key, inputKey: recipe.inputKey, inputQty: recipe.inputQty, outputKey: recipe.outputKey, outputQty: recipe.outputQty, cost: recipe.cost, completesInSeconds: recipe.minutes * 60 };
}

/** ایجاد قرارداد آتی ۷ روزه — صادرات: کالا در امضای قرارداد امانت می‌شود؛ واردات: کل مبلغ پرداخت می‌شود */
export async function createContract(db: Db, nation: NationRow, input: { side: string; contractType: string; resourceKey: string; partnerKey: string; quantity: number }, now = nowSeconds()) {
  const def = resourceDef(String(input.resourceKey));
  if (!def) throw ApiError.validation('منبع معامله معتبر نیست.');
  const type = contractTypeDef(String(input.contractType));
  if (!type) throw ApiError.validation('نوع قرارداد معتبر نیست.');
  const partner = partnerDef(String(input.partnerKey));
  if (!partner) throw ApiError.validation('کشور طرف قرارداد معتبر نیست.');
  if (input.side !== 'export' && input.side !== 'import') throw ApiError.validation('جهت قرارداد معتبر نیست.');
  const qty = Number(input.quantity);
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation('مقدار قرارداد نامعتبر است.');
  const total = Math.floor(qty * def.market);
  const completesAt = now + CONTRACT_TERM_DAYS * 86400;

  const batch: ReturnType<typeof sql>[] = [];
  if (input.side === 'export') {
    const stock = await stockOf(db, nation.id, def.key);
    if (stock < qty) throw ApiError.validation('موجودی این منبع در انبار کافی نیست.');
    batch.push(sql`UPDATE nation_resources SET stock = stock - ${qty}, updated_at = ${now}
                    WHERE nation_id = ${nation.id} AND resource_key = ${def.key} AND stock >= ${qty}`);
  } else {
    if (nation.treasury < total) throw ApiError.validation('موجودی ناکافی است.');
    batch.push(sql`UPDATE nations SET treasury = treasury - ${total}, updated_at = ${now} WHERE id = ${nation.id}`);
  }
  batch.push(
    sql`INSERT INTO nation_contracts (nation_id, side, contract_type, resource_key, partner_key, quantity, unit_price, total, status, created_at, completes_at)
         VALUES (${nation.id}, ${input.side}, ${type.key}, ${def.key}, ${partner.key}, ${qty}, ${def.market}, ${total}, 'active', ${now}, ${completesAt})`,
  );
  if (input.side === 'export') {
    // امانت کالا پول نیست؛ فقط لاگ
  } else {
    await ledger(batch, nation, 'contract', -total,
      `قرارداد واردات ${qty.toLocaleString('en-US')} ${def.unitFa} ${def.nameFa} از ${partner.nameFa}`,
      'contract', null, now, { side: 'import', resourceKey: def.key, quantity: qty, unitPrice: def.market });
    batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${total}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  }
  batch.push(
    sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
         VALUES (${nation.id}, 'contract_create', ${def.key}, ${partner.key}, ${qty}, ${def.market}, ${total}, ${now})`,
  );
  await db.batch(batch);
  const row = await db.first<{ id: number }>(sql`SELECT id FROM nation_contracts WHERE nation_id = ${nation.id} ORDER BY id DESC LIMIT 1`);
  await audit(db, { actor: null, action: 'contract.create', targetType: 'nation', targetId: nation.id, after: { side: input.side, resourceKey: def.key, quantity: qty, total }, reason: `قرارداد ${type.nameFa}` });
  return { contractId: Number(row?.id ?? 0), side: input.side, resourceKey: def.key, quantity: qty, unitPrice: def.market, total, completesInDays: CONTRACT_TERM_DAYS };
}

/** لغو قرارداد فعال — صادرات: کالا برمی‌گردد؛ واردات: مبلغ بازمی‌گردد */
export async function cancelContract(db: Db, nation: NationRow, contractId: number, now = nowSeconds()) {
  const row = await db.first<{ id: number; side: string; resource_key: string; quantity: number; total: number; status: string; partner_key: string }>(
    sql`SELECT id, side, resource_key, quantity, total, status, partner_key FROM nation_contracts WHERE id = ${contractId} AND nation_id = ${nation.id}`,
  );
  if (!row) throw ApiError.notFound('قرارداد یافت نشد.');
  if (String(row.status) !== 'active') throw ApiError.conflict('این قرارداد دیگر فعال نیست.');

  const batch: ReturnType<typeof sql>[] = [sql`UPDATE nation_contracts SET status = 'cancelled', settled_at = ${now} WHERE id = ${row.id} AND status = 'active'`];
  if (String(row.side) === 'export') {
    batch.push(
      sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
           VALUES (${nation.id}, ${row.resource_key}, 0, ${Number(row.quantity)}, ${now})
           ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${Number(row.quantity)}, updated_at = ${now}`,
    );
  } else {
    batch.push(sql`UPDATE nations SET treasury = treasury + ${Number(row.total)}, updated_at = ${now} WHERE id = ${nation.id}`);
    await ledger(batch, nation, 'contract', Number(row.total),
      `لغو قرارداد واردات — بازگشت ${Number(row.total).toLocaleString('en-US')} سکه`,
      'contract', Number(row.id), now, { side: 'import', cancelled: true });
  }
  batch.push(
    sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
         VALUES (${nation.id}, 'contract_cancel', ${row.resource_key}, ${row.partner_key}, ${Number(row.quantity)}, 0, ${Number(row.total)}, ${now})`,
  );
  await db.batch(batch);
  await audit(db, { actor: null, action: 'contract.cancel', targetType: 'nation', targetId: nation.id, after: { contractId: row.id }, reason: 'لغو قرارداد' });
  return { contractId: row.id, cancelled: true };
}

export async function listContracts(db: Db, nation: NationRow, now = nowSeconds()) {
  await settleContracts(db, nation.id, now);
  const rows = await db.all<{ id: number; side: string; contract_type: string; resource_key: string; partner_key: string; quantity: number; unit_price: number; total: number; status: string; created_at: number; completes_at: number }>(
    sql`SELECT id, side, contract_type, resource_key, partner_key, quantity, unit_price, total, status, created_at, completes_at
          FROM nation_contracts WHERE nation_id = ${nation.id} ORDER BY id DESC LIMIT 20`,
  );
  return {
    contracts: rows.map((r) => ({
      id: Number(r.id),
      side: String(r.side),
      sideLabelFa: String(r.side) === 'export' ? 'صادرات' : 'واردات',
      contractType: String(r.contract_type),
      contractTypeLabelFa: contractTypeDef(String(r.contract_type))?.nameFa ?? String(r.contract_type),
      resourceKey: String(r.resource_key),
      partnerKey: String(r.partner_key),
      partnerLabelFa: partnerDef(String(r.partner_key))?.nameFa ?? String(r.partner_key),
      partnerFlag: partnerDef(String(r.partner_key))?.flag ?? '',
      quantity: Number(r.quantity),
      unitPrice: Number(r.unit_price),
      total: Number(r.total),
      status: String(r.status),
      daysLeft: String(r.status) === 'active' ? Math.max(0, Math.ceil((Number(r.completes_at) - now) / 86400)) : null,
      createdAt: toIso(Number(r.created_at)),
      completesAt: toIso(Number(r.completes_at)),
    })),
  };
}

export async function tradeHistory(db: Db, nationId: number, limit = 20) {
  const rows = await db.all<{ id: number; kind: string; resource_key: string; partner_key: string; quantity: number; unit_price: number; total: number; created_at: number }>(
    sql`SELECT id, kind, resource_key, partner_key, quantity, unit_price, total, created_at
          FROM trade_log WHERE nation_id = ${nationId} ORDER BY id DESC LIMIT ${Math.min(50, Math.max(1, limit))}`,
  );
  const kindFa: Record<string, string> = { import: 'واردات', export: 'صادرات', contract_create: 'قرارداد (ایجاد)', contract_settle: 'قرارداد (تسویه)', contract_cancel: 'قرارداد (لغو)' };
  return {
    rows: rows.map((r) => ({
      id: Number(r.id),
      kind: String(r.kind),
      kindLabelFa: kindFa[String(r.kind)] ?? String(r.kind),
      resourceKey: String(r.resource_key),
      partnerKey: String(r.partner_key),
      partnerLabelFa: partnerDef(String(r.partner_key))?.nameFa ?? String(r.partner_key),
      partnerFlag: partnerDef(String(r.partner_key))?.flag ?? '',
      quantity: Number(r.quantity),
      unitPrice: Number(r.unit_price),
      total: Number(r.total),
      createdAt: toIso(Number(r.created_at)),
    })),
  };
}

/** بودجهٔ کشور — زیرحساب‌های خزانه؛ قابل واریز و برداشت مجدد */
export async function budgetAllocate(db: Db, nation: NationRow, potKey: string, amount: number, now = nowSeconds()) {
  const pot = BUDGET_POTS.find((p) => p.key === potKey);
  if (!pot) throw ApiError.validation('سرفصل بودجه معتبر نیست.');
  const qty = Math.floor(Number(amount));
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation('مبلغ نامعتبر است.');
  if (nation.treasury < qty) throw ApiError.validation('موجودی ناکافی است.');

  const batch: ReturnType<typeof sql>[] = [
    sql`UPDATE nations SET treasury = treasury - ${qty}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO nation_budget_pots (nation_id, pot_key, amount, updated_at)
         VALUES (${nation.id}, ${pot.key}, ${qty}, ${now})
         ON CONFLICT (nation_id, pot_key) DO UPDATE SET amount = amount + ${qty}, updated_at = ${now}`,
  ];
  await ledger(batch, nation, 'budget_transfer', -qty, `واریز به ${pot.nameFa}`, 'budget', null, now, { potKey: pot.key });
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  await db.batch(batch);
  return { potKey: pot.key, allocated: qty, treasury: nation.treasury - qty };
}

export async function budgetWithdraw(db: Db, nation: NationRow, potKey: string, amount: number, now = nowSeconds()) {
  const pot = BUDGET_POTS.find((p) => p.key === potKey);
  if (!pot) throw ApiError.validation('سرفصل بودجه معتبر نیست.');
  const qty = Math.floor(Number(amount));
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation('مبلغ نامعتبر است.');
  const row = await db.first<{ amount: number }>(sql`SELECT amount FROM nation_budget_pots WHERE nation_id = ${nation.id} AND pot_key = ${pot.key}`);
  const current = Number(row?.amount ?? 0);
  if (current < qty) throw ApiError.validation('موجودی این سرفصل کافی نیست.');

  const batch: ReturnType<typeof sql>[] = [
    sql`UPDATE nation_budget_pots SET amount = amount - ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id} AND pot_key = ${pot.key} AND amount >= ${qty}`,
    sql`UPDATE nations SET treasury = treasury + ${qty}, updated_at = ${now} WHERE id = ${nation.id}`,
  ];
  await ledger(batch, nation, 'budget_transfer', qty, `برداشت از ${pot.nameFa}`, 'budget', null, now, { potKey: pot.key });
  await db.batch(batch);
  return { potKey: pot.key, withdrawn: qty, treasury: nation.treasury + qty };
}
