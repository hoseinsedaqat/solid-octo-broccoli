import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { EQUIPMENT_CATEGORIES, STARTER_ECONOMY } from '@ww/shared';
import { advanceTime, all, createWorld, first, onboardViaBot, run, type World } from '../helpers/harness';

let world: World;
let nationA = 0;
let adminToken = '';
let tokenA = '';
let tankTemplateId = 0;
const TANK_CODE = 'leopard_2a7';

beforeAll(async () => {
  world = await createWorld({ adminIds: '777' });
  nationA = await onboardViaBot(world, 810_001, 'چکش‌آهن', 'کاوه');
  await onboardViaBot(world, 810_002, 'سنگ‌شهر', 'بهرام');
  adminToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 777 } })).json.token;
  tokenA = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 810_001 } })).json.token;
  const tpl = await first<{ id: number }>(world.db, `SELECT id FROM equipment_templates WHERE code = ?`, TANK_CODE);
  tankTemplateId = Number(tpl!.id);
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

const treasury = async () => Number((await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nationA))!.treasury);
const owned = async (templateId: number) =>
  Number((await first<{ quantity: number }>(world.db, `SELECT quantity FROM nation_inventory WHERE nation_id = ? AND template_id = ?`, nationA, templateId))?.quantity ?? 0);

describe('shop catalogue', () => {
  it('exposes the 18 categories with the shop labels of the design document', async () => {
    const res = await world.api('GET', '/api/shop/categories', { token: tokenA });
    expect(res.status).toBe(200);
    expect(res.json.categories).toHaveLength(EQUIPMENT_CATEGORIES.length);
    expect(res.json.categories.map((c: any) => c.key)).toEqual(EQUIPMENT_CATEGORIES.map((c) => c.key));
    expect(res.json.categories.every((c: any) => c.shopLabelFa.startsWith('خرید '))).toBe(true);
    expect(res.json.enabled).toBe(true);
  });

  it('marks un-priced items as not purchasable instead of inventing a price', async () => {
    // کاتالوگ همه‌چیز را قیمت‌گذاری کرده؛ اما اصل «بدون قیمت = غیرقابل‌خرید» برای آیتم‌های آینده ادمین هم باید برقرار بماند
    const create = await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: { categoryKey: 'tanks', code: 'qa_unpriced_template', nameFa: 'تانک آزمایشی بدون قیمت', unitFa: 'عدد' },
    });
    expect(create.status).toBe(200);
    const qaId = Number(create.json.id);
    const res = await world.api('GET', '/api/shop/category/tanks', { token: tokenA });
    expect(res.status).toBe(200);
    const item = res.json.items.find((i: any) => i.templateId === qaId);
    expect(item).toBeTruthy();
    expect(item.price).toBeNull();
    expect(item.purchasable).toBe(false);
    expect(String(item.disabledReason)).toContain('قیمت');
    const unpriced = await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM v_unpriced_equipment`);
    expect(Number(unpriced!.c)).toBeGreaterThan(0);
    await world.api('POST', `/api/admin/shop/equipment/${qaId}/delete`, { token: adminToken });
  });

  it('refuses to sell an item the admin has not priced, without touching the inventory', async () => {
    const create = await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: { categoryKey: 'tanks', code: 'qa_refusal_template', nameFa: 'تانک نخریدنی تست', unitFa: 'عدد' },
    });
    expect(create.status).toBe(200);
    const qaId = Number(create.json.id);
    const invBefore = await all(world.db, `SELECT * FROM nation_inventory WHERE nation_id = ?`, nationA);
    const res = await world.api('POST', '/api/shop/purchase', {
      token: tokenA,
      body: { templateId: qaId, quantity: 1, idempotencyKey: 'try-unpriced-0001' },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.json.error.code).toBeTruthy();
    const invAfter = await all(world.db, `SELECT * FROM nation_inventory WHERE nation_id = ?`, nationA);
    expect(invAfter).toHaveLength(invBefore.length);
    expect(await first(world.db, `SELECT id FROM transactions WHERE idempotency_key = 'buy:${nationA}:try-unpriced-0001'`)).toBeNull();
    await world.api('POST', `/api/admin/shop/equipment/${qaId}/delete`, { token: adminToken });
  });
});

describe('buying equipment', () => {
  it('prices an item and deducts exactly price × quantity in one atomic step', async () => {
    const priced = await world.api('POST', '/api/admin/shop/prices-bulk', {
      token: adminToken,
      body: { items: [{ templateId: tankTemplateId, price: 1500 }] },
    });
    expect(priced.status).toBe(200);

    const before = await treasury();
    const ownedBefore = await owned(tankTemplateId);
    const res = await world.api('POST', '/api/shop/purchase', {
      token: tokenA,
      body: { templateId: tankTemplateId, quantity: 3, idempotencyKey: 'buy-tanks-0001' },
    });
    expect(res.status).toBe(200);
    expect(res.json.duplicate).toBe(false);
    expect(res.json.totalCost).toBe(4500);
    expect(Number(res.json.transactionId)).toBeGreaterThan(0);
    // the same call also pushed a telegram notification for the buyer
    expect(world.sent.some((x) => x.method === 'sendMessage' && String(x.payload.text ?? '').includes('خرید موفق'))).toBe(true);
    expect(res.json.unitPrice).toBe(1500);
    expect(res.json.newQuantity).toBe(ownedBefore + 3);
    expect(res.json.treasuryBefore).toBe(before);
    expect(await treasury()).toBe(before - 4500);
    expect(await owned(tankTemplateId)).toBe(ownedBefore + 3);
    expect(res.json.treasuryAfter).toBe(await treasury());

    const tx = await first<any>(world.db, `SELECT * FROM transactions WHERE idempotency_key = ?`, `buy:${nationA}:buy-tanks-0001`);
    expect(Number(tx!.amount)).toBe(-4500);
    expect(tx!.type).toBe('purchase');
    const items = await all<any>(world.db, `SELECT * FROM transaction_items WHERE transaction_id = ?`, Number(tx!.id));
    expect(items).toHaveLength(1);
    expect(Number(items[0]!.quantity)).toBe(3);
    expect(Number(items[0]!.unit_price)).toBe(1500);
    expect(Number(items[0]!.total_price)).toBe(4500);
  });

  it('replays a retried request instead of charging twice (idempotency key)', async () => {
    const before = await treasury();
    const ownedBefore = await owned(tankTemplateId);
    const again = await world.api('POST', '/api/shop/purchase', {
      token: tokenA,
      body: { templateId: tankTemplateId, quantity: 3, idempotencyKey: 'buy-tanks-0001' },
    });
    expect(again.status).toBe(200);
    expect(again.json.duplicate).toBe(true);
    expect(await treasury()).toBe(before);
    expect(await owned(tankTemplateId)).toBe(ownedBefore);
  });

  it('rejects negative or zero quantities and unknown items', async () => {
    const zero = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: tankTemplateId, quantity: 0, idempotencyKey: 'qty-zero-0001' } });
    expect([400, 422]).toContain(zero.status);
    const negative = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: tankTemplateId, quantity: -2, idempotencyKey: 'qty-neg-0001' } });
    expect([400, 422]).toContain(negative.status);
    const missing = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: 999999, quantity: 1, idempotencyKey: 'missing-0001' } });
    expect([400, 404, 422]).toContain(missing.status);
  });

  it('refuses a purchase the treasury cannot cover and keeps the ledger unchanged', async () => {
    const before = await treasury();
    const items = await all<{ id: number }>(world.db, `SELECT id FROM equipment_templates WHERE price IS NOT NULL`);
    void items;
    await run(world.db, `UPDATE equipment_templates SET price = 500000 WHERE id = ?`, tankTemplateId);
    const res = await world.api('POST', '/api/shop/purchase', {
      token: tokenA,
      body: { templateId: tankTemplateId, quantity: Math.ceil((before + 1) / 500_000), idempotencyKey: 'broke-0001' },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.json.error.code).toBe('insufficient_funds');
    expect(await treasury()).toBe(before);
    await run(world.db, `UPDATE equipment_templates SET price = 1500 WHERE id = ?`, tankTemplateId);
  });

  it('enforces the per-cycle purchase limit set by the admin', async () => {
    const apc = await first<{ id: number }>(world.db, `SELECT id FROM equipment_templates WHERE code = 'm113_apc'`);
    const apcId = Number(apc!.id);
    const upsert = await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: {
        id: apcId,
        categoryKey: 'apc',
        code: 'm113_apc',
        nameFa: 'M113 APC',
        unitFa: 'عدد',
        price: 1000,
        purchaseLimitPerCycle: 2,
      },
    });
    expect(upsert.status).toBe(200);

    const tooMany = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: apcId, quantity: 5, idempotencyKey: 'apc-5-0001' } });
    expect(tooMany.status).toBeGreaterThanOrEqual(400);

    const ok = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: apcId, quantity: 2, idempotencyKey: 'apc-2-0001' } });
    expect(ok.status).toBe(200);
    const afterLimit = await world.api('GET', '/api/shop/category/apc', { token: tokenA });
    const item = afterLimit.json.items.find((i: any) => i.templateId === apcId);
    expect(item.remainingThisCycle).toBe(0);
    expect(item.purchasable).toBe(false);

    const blocked = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: apcId, quantity: 1, idempotencyKey: 'apc-1-0002' } });
    expect(blocked.status).toBeGreaterThanOrEqual(400);

    // the limit is per income cycle: purchases that fall in an earlier cycle stop counting
    await run(world.db, `UPDATE transactions SET created_at = created_at - ? WHERE nation_id = ? AND type = 'purchase'`, STARTER_ECONOMY.incomeCycleSeconds * 2, nationA);
    const nextCycle = await world.api('GET', '/api/shop/category/apc', { token: tokenA });
    expect(nextCycle.json.items.find((i: any) => i.templateId === apcId).remainingThisCycle).toBe(2);
    const allowedAgain = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: apcId, quantity: 1, idempotencyKey: 'apc-1-0003' } });
    expect(allowedAgain.status).toBe(200);
  });

  it('lets the admin stop selling an item without deleting owned stock', async () => {
    const before = await owned(tankTemplateId);
    const off = await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: { id: tankTemplateId, categoryKey: 'tanks', code: TANK_CODE, nameFa: 'Leopard 2A7', unitFa: 'عدد', price: 1500, isForSale: false },
    });
    expect(off.status).toBe(200);
    const res = await world.api('POST', '/api/shop/purchase', { token: tokenA, body: { templateId: tankTemplateId, quantity: 1, idempotencyKey: 'sold-out-01' } });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(await owned(tankTemplateId)).toBe(before);
    const del = await world.api('POST', `/api/admin/shop/equipment/${tankTemplateId}/delete`, { token: adminToken });
    expect(del.json.error.code).toBe('conflict'); // still in a warehouse -> deactivation only
    await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: { id: tankTemplateId, categoryKey: 'tanks', code: TANK_CODE, nameFa: 'Leopard 2A7', unitFa: 'عدد', price: 1500, isForSale: true },
    });
  });

  it('charges the maintenance of what was bought on the next cycle', async () => {
    const before = await treasury();
    await advanceTime(world.db, nationA, STARTER_ECONOMY.incomeCycleSeconds + 60);
    const claim = await world.api('POST', '/api/player/bank/income-claim', { token: tokenA, body: {} });
    expect(claim.status).toBe(200);
    const row = await first<{ amount: number }>(
      world.db,
      `SELECT amount FROM transactions WHERE nation_id = ? AND type = 'revenue' ORDER BY id DESC LIMIT 1`,
      nationA,
    );
    expect(Number(row!.amount)).toBe(Number(claim.json.total));
    expect(await treasury()).toBe(before + Number(row!.amount));
  });

  it('keeps the starter economy untouched in a fresh nation', async () => {
    const fresh = await first<any>(world.db, `SELECT treasury FROM nations WHERE name = 'سنگ‌شهر'`);
    expect(Number(fresh!.treasury)).toBe(STARTER_ECONOMY.treasury);
  });
});
