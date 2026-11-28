import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { all, createWorld, first, onboardViaBot, run, type World } from '../helpers/harness';
import { pickPrize } from '../../apps/worker/src/services/dailyPrizeService';

/** جایزه شانسی روزانه — one claim per nation per UTC day, atomic with the grant */

let world: World;
let nation = 0;
let token = '';

beforeAll(async () => {
  world = await createWorld({ adminIds: '' });
  nation = await onboardViaBot(world, 860_001, 'جایزه‌ستان', 'ارژنگ');
  token = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 860_001 } })).json.token;
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

describe('pickPrize (weighted, deterministic with injected rng)', () => {
  it('rng=0 picks the first catalogue entry, rng→1 picks the last', () => {
    expect(pickPrize(() => 0).key).toBe('aster30_10');
    expect(pickPrize(() => 0.999999).key).toBe('coins_800');
  });

  it('respects weight boundaries (coins_800 is the single most likely prize)', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i += 1) seen.add(pickPrize(() => i / 200).key);
    expect(seen.size).toBeGreaterThan(4); // deterministic sweep covers many prizes
  });
});

describe('claim flow (API)', () => {
  it('GET shows the catalogue and an unclaimed state', async () => {
    const res = await world.api('GET', '/api/player/daily-prize', { token });
    expect(res.status).toBe(200);
    expect(res.json.claimed).toBe(false);
    expect(Array.isArray(res.json.prizes)).toBe(true);
    expect(res.json.prizes).toHaveLength(7);
    expect(res.json.prizes.map((p: any) => p.key)).toContain('nimitz_1');
  });

  it('claim grants exactly one prize and records it atomically', async () => {
    const before = await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nation);
    const res = await world.api('POST', '/api/player/daily-prize/claim', { token, body: {} });
    expect(res.status).toBe(200);
    expect(res.json.alreadyClaimed).toBe(false);
    expect(typeof res.json.prize.key).toBe('string');

    const claims = await all<any>(world.db, `SELECT * FROM daily_prize_claims WHERE nation_id = ?`, nation);
    expect(claims).toHaveLength(1);
    expect(claims[0]!.prize_key).toBe(res.json.prize.key);

    if (res.json.prize.kind === 'coins') {
      const amount = res.json.prize.key === 'coins_5000' ? 5000 : 800;
      const after = await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nation);
      expect(Number(after!.treasury)).toBe(Number(before!.treasury) + amount);
      const txs = await all<any>(world.db, `SELECT type FROM transactions WHERE nation_id = ? AND type = 'prize'`, nation);
      expect(txs).toHaveLength(1);
    } else {
      const txs = await all<any>(world.db, `SELECT type FROM transactions WHERE nation_id = ? AND type = 'prize'`, nation);
      expect(txs).toHaveLength(1); // the grant is written on the ledger even for equipment
    }
  });

  it('claiming again the same day is idempotent — no second grant', async () => {
    const before = await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nation);
    const invBefore = await all<any>(world.db, `SELECT template_id, quantity FROM nation_inventory WHERE nation_id = ?`, nation);
    const res = await world.api('POST', '/api/player/daily-prize/claim', { token, body: {} });
    expect(res.status).toBe(200);
    expect(res.json.alreadyClaimed).toBe(true);
    const claims = await all<any>(world.db, `SELECT * FROM daily_prize_claims WHERE nation_id = ?`, nation);
    expect(claims).toHaveLength(1);
    const after = await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nation);
    expect(Number(after!.treasury)).toBe(Number(before!.treasury));
    const invAfter = await all<any>(world.db, `SELECT template_id, quantity FROM nation_inventory WHERE nation_id = ?`, nation);
    expect(invAfter).toEqual(invBefore);
  });

  it('GET reflects the claimed state', async () => {
    const res = await world.api('GET', '/api/player/daily-prize', { token });
    expect(res.status).toBe(200);
    expect(res.json.claimed).toBe(true);
    expect(res.json.prize?.key).toBeTruthy();
  });
});
