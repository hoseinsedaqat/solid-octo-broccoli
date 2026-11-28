import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { all, createWorld, first, onboardViaBot, run, type World } from '../helpers/harness';

/** آرایش دفاعی — defender commits a subset of categories; war math honors it */
let world: World;
let nationA = 0; // attacker
let nationB = 0; // defender
let tokenA = '';
let tokenB = '';

beforeAll(async () => {
  world = await createWorld({ adminIds: '' });
  nationA = await onboardViaBot(world, 880_001, 'آرایش‌کش', 'آرش');
  nationB = await onboardViaBot(world, 880_002, 'دیواركش', 'نیلو');
  tokenA = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 880_001 } })).json.token;
  tokenB = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 880_002 } })).json.token;
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

const ownedByCategory = (nationId: number) =>
  all<{ categoryKey: string; qty: number }>(
    world.db,
    `SELECT c.key AS categoryKey, SUM(i.quantity) AS qty
       FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id JOIN equipment_categories c ON c.id = t.category_id
      WHERE i.nation_id = ? GROUP BY c.key`,
    nationId,
  );

describe('defense plan API', () => {
  it('defaults to NULL (legacy: everyone defends)', async () => {
    const res = await world.api('GET', '/api/player/defense-plan', { token: tokenB });
    expect(res.status).toBe(200);
    expect(res.json.plan).toBeNull();
    expect(Array.isArray(res.json.tiles)).toBe(true);
    expect(res.json.tiles.length).toBe(12);
  });

  it('rejects unknown arrangement keys', async () => {
    const res = await world.api('PUT', '/api/player/defense-plan', { token: tokenB, body: { categories: ['radars', 'not_a_category'] } });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('saves and reads back an explicit subset', async () => {
    const res = await world.api('PUT', '/api/player/defense-plan', { token: tokenB, body: { categories: ['radars'] } });
    expect(res.status).toBe(200);
    expect(res.json.plan).toEqual(['radars']);
    const check = await world.api('GET', '/api/player/defense-plan', { token: tokenB });
    expect(check.json.plan).toEqual(['radars']);
  });
});

describe('defense plan in war math', () => {
  it('defender power drops when the plan commits a weak subset, restores on reset', async () => {
    // committed: radars only
    const weak = await world.api('POST', '/api/war/preview', { token: tokenA, body: { targetNationId: nationB } });
    expect(weak.status).toBe(200);
    // reset to default (everyone defends)
    const reset = await world.api('PUT', '/api/player/defense-plan', { token: tokenB, body: { categories: null } });
    expect(reset.status).toBe(200);
    const full = await world.api('POST', '/api/war/preview', { token: tokenA, body: { targetNationId: nationB } });
    expect(full.status).toBe(200);
    // restore the weak plan for the next test BEFORE asserting, so a failed assert cannot leak state
    const restore = await world.api('PUT', '/api/player/defense-plan', { token: tokenB, body: { categories: ['radars'] } });
    expect(restore.status).toBe(200);
    expect(Number(full.json.defenderPower)).toBeGreaterThan(Number(weak.json.defenderPower));
  });

  it('uncommitted defender categories take zero losses from battle', async () => {
    // make the plan explicit — do not rely on the previous test's end state
    const setPlan = await world.api('PUT', '/api/player/defense-plan', { token: tokenB, body: { categories: ['radars'] } });
    expect(setPlan.status).toBe(200);
    const owned = await ownedByCategory(nationB);
    const outside = owned.filter((r) => String(r.categoryKey) !== 'radars' && Number(r.qty) > 0);
    const beforeAll_ = new Map(owned.map((r) => [String(r.categoryKey), Number(r.qty)]));

    // attack and resolve one round
    const prop = await world.api('POST', '/api/war/propose', { token: tokenA, body: { targetNationId: nationB } });
    expect(prop.status).toBe(200);
    const warId = Number(prop.json.warId);
    // حمله خودکار پذیرفته می‌شود
    const alreadyActive = await first<{ status: string }>(world.db, `SELECT status FROM wars WHERE id = ?`, warId);
    expect(alreadyActive!.status).toBe('active');
    await run(world.db, `UPDATE wars SET next_round_at = 1, started_at = 1, ends_at = 1 WHERE id = ?`, warId);
    const round = await world.api('POST', `/api/war/${warId}/round`, { token: tokenA });
    expect(round.status).toBe(200);

    const after = await ownedByCategory(nationB);
    const afterMap = new Map(after.map((r) => [String(r.categoryKey), Number(r.qty)]));
    for (const { categoryKey } of outside) {
      expect(afterMap.get(String(categoryKey)) ?? 0).toBe(beforeAll_.get(String(categoryKey)));
    }
  });
});
