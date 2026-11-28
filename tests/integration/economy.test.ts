import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { STARTER_ECONOMY } from '@ww/shared';
import { advanceTime, all, createWorld, first, onboardViaBot, run, type World } from '../helpers/harness';

let world: World;
let nationA = 0;
let nationB = 0;
let adminToken = '';
let tokenA = '';
let tokenB = '';
let nationC = 0;
let nationD = 0;
let tokenC = '';
let tokenD = '';
const CYCLE = STARTER_ECONOMY.incomeCycleSeconds;

beforeAll(async () => {
  world = await createWorld({ adminIds: '777' });
  nationA = await onboardViaBot(world, 800_001, 'فولادشهر', 'آرش');
  nationB = await onboardViaBot(world, 800_002, 'میس‌شهر', 'سپهر');
  nationC = await onboardViaBot(world, 800_003, 'مالیات‌شهر', 'دارا');
  nationD = await onboardViaBot(world, 800_004, 'سریع‌شهر', 'پویا');
  adminToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 777 } })).json.token;
  tokenA = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 800_001 } })).json.token;
  tokenB = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 800_002 } })).json.token;
  tokenC = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 800_003 } })).json.token;
  tokenD = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 800_004 } })).json.token;
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

const treasury = async (nationId: number) => Number((await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nationId))!.treasury);
const claim = (token: string) => world.api('POST', '/api/player/bank/income-claim', { token, body: {} });
const revenueRows = async (nationId: number) =>
  all<{ id: number; amount: number; idempotency_key: string; balance_after: number }>(
    world.db,
    `SELECT id, amount, idempotency_key, balance_after FROM transactions WHERE nation_id = ? AND type = 'revenue' ORDER BY id`,
    nationId,
  );

describe('claim-based income via «دریافت درآمد» (atomic + idempotent)', () => {
  it('pays exactly the documented 80 000 per 24h cycle, and only for completed cycles', async () => {
    const before = await treasury(nationA);
    // less than one cycle elapsed => nothing is due
    const early = await claim(tokenA);
    expect(early.status).toBe(200);
    expect(early.json.cycles).toBe(0);
    expect(Number(await treasury(nationA))).toBe(before);

    await advanceTime(world.db, nationA, CYCLE + 30);
    const res = await claim(tokenA);
    expect(res.status).toBe(200);
    expect(res.json.cycles).toBe(1);

    const rows = await revenueRows(nationA);
    expect(rows).toHaveLength(1);
    expect(Number(rows[0]!.amount)).toBe(STARTER_ECONOMY.factoryIncome + STARTER_ECONOMY.mineIncome);
    expect(await treasury(nationA)).toBe(before + 80_000);
    expect(Number(rows[0]!.balance_after)).toBe(await treasury(nationA));
    expect(rows[0]!.idempotency_key).toBe(`rev:${nationA}:0`);
  });

  it('never pays twice for the same cycle, however often the claim button is tapped', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await claim(tokenA);
      expect(res.json.cycles).toBe(0);
    }
    expect(await revenueRows(nationA)).toHaveLength(1);
    expect(await treasury(nationA)).toBe(STARTER_ECONOMY.treasury + 80_000);
  });

  it('a single claim collects every completed cycle (oldest first)', async () => {
    await advanceTime(world.db, nationB, CYCLE * 3 + 10);
    const res = await claim(tokenB);
    expect(res.status).toBe(200);
    expect(res.json.cycles).toBe(3);
    expect(res.json.total).toBe(240_000);
    const rows = await revenueRows(nationB);
    expect(rows.map((r) => r.idempotency_key)).toEqual([`rev:${nationB}:0`, `rev:${nationB}:1`, `rev:${nationB}:2`]);
    const cycles = await all<{ cycle_index: number }>(world.db, `SELECT cycle_index FROM revenue_cycles WHERE nation_id = ? ORDER BY cycle_index`, nationB);
    expect(cycles.map((c) => Number(c.cycle_index))).toEqual([0, 1, 2]);
    expect(await treasury(nationB)).toBe(STARTER_ECONOMY.treasury + 240_000);
  });

  it('keeps the ledger consistent: balance_after of every row matches the running total', async () => {
    const rows = await all<{ amount: number; balance_after: number }>(
      world.db,
      `SELECT amount, balance_after FROM transactions WHERE nation_id = ? ORDER BY id`,
      nationB,
    );
    let running = 0;
    for (const r of rows) {
      running += Number(r.amount);
      expect(Number(r.balance_after)).toBe(running);
    }
    expect(running).toBe(await treasury(nationB));
  });

  it('honours the per-nation cycle override set by the admin', async () => {
    await run(world.db, `UPDATE nation_settings SET income_cycle_seconds = 3600 WHERE nation_id = ?`, nationD);
    const before = (await revenueRows(nationD)).length;
    await advanceTime(world.db, nationD, 3600 * 2 + 5);
    const res = await claim(tokenD);
    expect(res.status).toBe(200);
    expect(res.json.cycles).toBeGreaterThanOrEqual(2);
    expect((await revenueRows(nationD)).length).toBeGreaterThanOrEqual(before + 2);
    await run(world.db, `UPDATE nation_settings SET income_cycle_seconds = NULL WHERE nation_id = ?`, nationD);
  });
});

describe('economy rules & charts', () => {
  it('tax and maintenance configured by the admin reduce the credited amount', async () => {
    await world.api('POST', '/api/admin/settings', {
      token: adminToken,
      body: { economy_rules: { taxRate: 0.1, maintenanceRate: 0.05 } },
    });
    await advanceTime(world.db, nationC, CYCLE * 3 + 60);
    await claim(tokenC);
    const row = (await revenueRows(nationC)).at(-1)!;
    // restore the documented defaults BEFORE asserting, so a failure cannot leak settings into other tests
    const restore = await world.api('POST', '/api/admin/settings', { token: adminToken, body: { economy_rules: { taxRate: 0, maintenanceRate: 0 } } });
    expect(restore.status).toBe(200);
    // gross 80 000 - 10% tax - 5% maintenance = 68 000
    expect(Number(row.amount)).toBe(68_000);

    await advanceTime(world.db, nationC, CYCLE + 60);
    await claim(tokenC);
    expect(Number((await revenueRows(nationC)).at(-1)!.amount)).toBe(80_000);
  });

  it('exposes the series and the transaction list the dashboard charts need', async () => {
    const res = await world.api('GET', '/api/player/economy', { token: tokenA });
    expect(res.status).toBe(200);
    expect(Number(res.json.economy.treasury)).toBe(await treasury(nationA));
    expect(res.json.economy.cycleSeconds).toBeGreaterThan(0);
    expect(res.json.economy.nextIncomeIn).toBeLessThanOrEqual(res.json.economy.cycleSeconds);
    expect(Array.isArray(res.json.history)).toBe(true);
    expect(res.json.history.length).toBeGreaterThan(0);
    expect(res.json.history[0]).toHaveProperty('treasury');

    const tx = await world.api('GET', '/api/player/transactions?limit=10', { token: tokenA });
    expect(tx.json.rows.length).toBeGreaterThan(0);
    expect(tx.json.rows.every((r: any) => typeof r.type === 'string' && typeof r.amount === 'number')).toBe(true);
    expect(tx.json.rows.every((r: any) => r.nation_id === undefined || Number(r.nation_id) === nationA)).toBe(true);
  });

  it('counts total money in the world for the admin dashboard', async () => {
    const res = await world.api('GET', '/api/admin/economy', { token: adminToken });
    expect(res.status).toBe(200);
    const nations = await all<{ treasury: number }>(world.db, `SELECT treasury FROM nations`);
    const total = nations.reduce((s, n) => s + Number(n.treasury), 0);
    expect(Number(res.json.money?.totalTreasury ?? res.json.totals?.totalTreasury ?? res.json.global?.totalTreasury)).toBe(total);
  });
});

describe('admin money operations', () => {
  it('credits and debits the treasury through audited, replay-safe transactions', async () => {
    const before = await treasury(nationA);
    const ok = await world.api('POST', `/api/admin/nations/${nationA}/treasury`, {
      token: adminToken,
      body: { nationId: nationA, delta: 12_345, reason: 'کمک بلادیدگان' },
    });
    expect(ok.status).toBe(200);
    expect(await treasury(nationA)).toBe(before + 12_345);

    const neg = await world.api('POST', `/api/admin/nations/${nationA}/treasury`, {
      token: adminToken,
      body: { nationId: nationA, delta: -(before + 12_345 + 1), reason: 'بیش از موجودی' },
    });
    expect(neg.status).toBeGreaterThanOrEqual(400);
    expect(await treasury(nationA)).toBe(before + 12_345); // unchanged

    const audit = await first<{ id: number }>(world.db, `SELECT id FROM audit_logs WHERE action LIKE '%treasury%' ORDER BY id DESC`);
    expect(audit).not.toBeNull();
  });

  it('rejects an admin adjustment without a reason', async () => {
    const res = await world.api('POST', `/api/admin/nations/${nationA}/treasury`, { token: adminToken, body: { nationId: nationA, delta: 5 } });
    expect([400, 422]).toContain(res.status);
  });

  it('lets the admin change a nation income and the next cycle uses the new value', async () => {
    const set = await world.api('POST', `/api/admin/nations/${nationB}/income`, {
      token: adminToken,
      body: { nationId: nationB, factoryIncome: 70_000, mineIncome: 20_000, reason: 'تغییر ساختار اقتصادی' },
    });
    expect(set.status).toBe(200);

    await advanceTime(world.db, nationB, CYCLE + 7);
    const res = await claim(tokenB);
    expect(res.status).toBe(200);
    const last = (await revenueRows(nationB)).at(-1)!;
    expect(Number(last.amount)).toBe(90_000);
  });
});
