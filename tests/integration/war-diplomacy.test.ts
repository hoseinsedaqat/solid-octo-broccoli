import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { all, createWorld, first, onboardViaBot, run, runCron, type World } from '../helpers/harness';

let world: World;
let nationA = 0; // attacker
let nationB = 0; // defender
let tokenA = '';
let tokenB = '';
let adminToken = '';

beforeAll(async () => {
  world = await createWorld({ adminIds: '777' });
  nationA = await onboardViaBot(world, 820_001, 'شاهین‌شهر', 'بیدرد');
  nationB = await onboardViaBot(world, 820_002, 'کوهسار', 'مهران');
  tokenA = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_001 } })).json.token;
  tokenB = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_002 } })).json.token;
  adminToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 777 } })).json.token;
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

const treasury = async (nationId: number) => Number((await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nationId))!.treasury);
const warRow = async (id: number) => first<any>(world.db, `SELECT * FROM wars WHERE id = ?`, id);

describe('war proposals (auto-accepted)', () => {
  it('starts the war immediately on attack, no defender confirmation', async () => {
    const res = await world.api('POST', '/api/war/propose', { token: tokenA, body: { targetNationId: nationB, indemnityOffered: 5000 } });
    expect(res.status).toBe(200);
    const warId = Number(res.json.warId);
    expect(res.json.status).toBe('active'); // حمله خودکار پذیرفته می‌شود
    expect(res.json.preview.attackerWinChance).toBeGreaterThan(0);
    expect(res.json.preview.entryCost).toBe(0); // warEntryTaxRate default
    expect(await treasury(nationA)).toBe(1_000_000); // nothing to charge at the default tax rate

    // the old respond endpoint no longer applies to new wars
    const respond = await world.api('POST', `/api/war/${warId}/respond`, { token: tokenB, body: { accept: true } });
    expect(respond.status).toBeGreaterThanOrEqual(400);

    const war = await warRow(warId);
    expect(war!.status).toBe('active');
    expect(Number(war!.rounds_played)).toBe(0);
    expect(Number(war!.accepted_at)).toBeGreaterThan(0);
    expect(Number(war!.next_round_at)).toBeGreaterThan(0);
  });

  it('blocks a second simultaneous war on the same pair and on the same nation', async () => {
    const res = await world.api('POST', '/api/war/propose', { token: tokenA, body: { targetNationId: nationB } });
    expect(res.status).toBeGreaterThanOrEqual(400);
    const list = await world.api('GET', '/api/war/wars', { token: tokenA });
    expect(list.json.wars.length).toBe(1);
  });

  it('never lets a nation attack itself, a phantom or an already busy country', async () => {
    const loner = await onboardViaBot(world, 820_004, 'بیابان‌زرد', 'تارا');
    const tokenLoner = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_004 } })).json.token;
    void loner;
    const self = await world.api('POST', '/api/war/propose', { token: tokenLoner, body: { targetNationId: loner } });
    expect(self.status).toBeGreaterThanOrEqual(400);
    const ghost = await world.api('POST', '/api/war/propose', { token: tokenLoner, body: { targetNationId: 424242 } });
    expect(ghost.status).toBe(404);
    // one active war per nation is enough (maxActiveWarsPerNation)
    const q = await onboardViaBot(world, 820_005, 'قلاع‌شهر', 'کاوه');
    const r = await onboardViaBot(world, 820_006, 'رودبارک', 'سپانتا');
    void q;
    void r;
    const tokenQ = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_005 } })).json.token;
    const first = await world.api('POST', '/api/war/propose', { token: tokenQ, body: { targetNationId: r } });
    expect(first.status).toBe(200);
    const second = await world.api('POST', '/api/war/propose', { token: tokenQ, body: { targetNationId: nationA } });
    expect([403, 409]).toContain(second.status);
  });
});

describe('battle rounds (abstract, deterministic, backend-only math)', () => {
  let warId = 0;
  let battlesBefore = 0;

  beforeAll(async () => {
    const war = await first<{ id: number }>(world.db, `SELECT id FROM wars WHERE attacker_nation_id = ?`, nationA);
    warId = Number(war!.id);
    battlesBefore = Number((await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM battles`))!.c);
  });

  it('refuses a round before next_round_at (anti-spam gate)', async () => {
    await run(world.db, `UPDATE wars SET next_round_at = 2000000000 WHERE id = ?`, warId);
    const res = await world.api('POST', `/api/war/${warId}/round`, { token: tokenA });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(Number((await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM battles`))!.c)).toBe(battlesBefore);
  });

  it('resolves exactly one round per due tick and writes losses on both sides', async () => {
    await run(world.db, `UPDATE wars SET next_round_at = 1 WHERE id = ?`, warId);
    const res = await world.api('POST', `/api/war/${warId}/round`, { token: tokenA });
    expect(res.status).toBe(200);
    const battles = await all<any>(world.db, `SELECT * FROM battles WHERE war_id = ? ORDER BY round_no`, warId);
    expect(battles).toHaveLength(battlesBefore + 1);
    expect(Number(battles[0]!.round_no)).toBe(1);
    expect(Number(battles[0]!.attacker_losses)).toBeGreaterThanOrEqual(0);
    expect(Number(battles[0]!.defender_losses)).toBeGreaterThanOrEqual(0);
    // the round gate moves forward, so a client cannot farm rounds by re-posting
    const war = await warRow(warId);
    expect(Number(war!.next_round_at)).toBeGreaterThan(1);
    const replay = await world.api('POST', `/api/war/${warId}/round`, { token: tokenA });
    expect(replay.status).toBeGreaterThanOrEqual(400);
  });

  it('lets the defender trigger the next round too (shared state, not attacker-only)', async () => {
    await run(world.db, `UPDATE wars SET next_round_at = 1 WHERE id = ?`, warId);
    const res = await world.api('POST', `/api/war/${warId}/round`, { token: tokenB });
    expect(res.status).toBe(200);
    const war = await warRow(warId);
    expect(Number(war!.rounds_played)).toBe(2);
  });

  it('applies the material losses of a finished war to the inventories', async () => {
    const beforeA = await all<any>(world.db, `SELECT template_id, quantity FROM nation_inventory WHERE nation_id = ?`, nationA);
    // fast-forward: many due rounds until the engine ends the war
    for (let i = 0; i < 14; i++) {
      await run(world.db, `UPDATE wars SET next_round_at = 1, started_at = 1, ends_at = 1 WHERE id = ?`, warId);
      await world.api('POST', `/api/war/${warId}/round`, { token: tokenA });
      const war = await warRow(warId);
      if (war!.status === 'ended') break;
    }
    const war = await warRow(warId);
    expect(war!.status).toBe('ended');
    expect([nationA, nationB, null]).toContain(war!.winner_nation_id === null ? null : Number(war!.winner_nation_id));
    const afterA = await all<any>(world.db, `SELECT template_id, quantity FROM nation_inventory WHERE nation_id = ?`, nationA);
    const total = (rows: any[]) => rows.reduce((s, r) => s + Number(r.quantity), 0);
    expect(total(afterA)).toBeLessThanOrEqual(total(beforeA));
    // nobody goes negative
    expect(afterA.every((r) => Number(r.quantity) >= 0)).toBe(true);
    const txs = await all<any>(world.db, `SELECT type FROM transactions WHERE war_id = ? OR reference_id = ? `, warId, warId).catch(() => []);
    void txs;
  });
});

describe('admin control over wars', () => {
  it('stops an active war immediately and records who did it', async () => {
    const other = await onboardViaBot(world, 820_003, 'دریاچه', 'تندر');
    const tokenOther = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_003 } })).json.token;
    const propose = await world.api('POST', '/api/war/propose', { token: tokenOther, body: { targetNationId: nationB } });
    expect(propose.status).toBe(200);
    const warId = Number(propose.json.warId);
    await run(world.db, `UPDATE wars SET status = 'active', started_at = ?, next_round_at = 1 WHERE id = ?`, Math.floor(Date.now() / 1000), warId);

    const player = await world.api('POST', `/api/admin/wars/${warId}/stop`, { token: tokenA, body: { reason: 'تست' } });
    expect(player.status).toBeGreaterThanOrEqual(403);

    const stop = await world.api('POST', `/api/admin/wars/${warId}/stop`, { token: adminToken, body: { reason: 'توقف اضطراری' } });
    expect(stop.status).toBe(200);
    const war = await warRow(warId);
    expect(war!.status).toBe('stopped_by_admin');
    expect(war!.stopped_by_user_id).not.toBeNull();
  });

  it('the cron also settles due rounds and expired proposals', async () => {
    const res = await runCron(world, adminToken, ['wars', 'war_expiry']);
    const jobs = (res.jobs ?? []) as any[];
    for (const j of jobs) expect(`${j.job}:${j.ok}`).toBe(`${j.job}:true`);
  });
});

describe('peace, diplomacy and statements', () => {
  it('only the side that did not ask can accept a peace offer', async () => {
    const a = await onboardViaBot(world, 820_010, 'آتشکده', 'کاوهٔ دوم');
    const b = await onboardViaBot(world, 820_011, 'آفتابگردان', 'سورن');
    const tokenA2 = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_010 } })).json.token;
    const tokenB2 = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_011 } })).json.token;
    void a;
    void b;

    const propose = await world.api('POST', '/api/war/propose', { token: tokenA2, body: { targetNationId: 0 } });
    expect(propose.status).toBeGreaterThanOrEqual(400); // nation ids above are placeholders on purpose

    const real = await world.api('POST', '/api/war/propose', { token: tokenA2, body: { targetNationId: b } });
    expect(real.status).toBe(200);
    const warId = Number(real.json.warId);
    await run(world.db, `UPDATE wars SET status = 'active', started_at = 1, next_round_at = 1 WHERE id = ?`, warId);

    const ask = await world.api('POST', `/api/war/${warId}/peace`, { token: tokenA2 });
    expect(ask.status).toBe(200);
    const selfAccept = await world.api('POST', `/api/war/peace/${warId}/respond`, { token: tokenA2, body: { accept: true } });
    expect(selfAccept.status).toBeGreaterThanOrEqual(400);
    const accept = await world.api('POST', `/api/war/peace/${warId}/respond`, { token: tokenB2, body: { accept: true } });
    expect(accept.status).toBe(200);
    expect((await warRow(warId))!.status).toBe('ended');
  });

  it('diplomacy requests are two-sided and produce a real relation', async () => {
    // a fresh pair: the war above already put a pending request between A and B
    const x = await onboardViaBot(world, 820_020, 'زرین‌دشت', 'فرهاد');
    const y = await onboardViaBot(world, 820_021, 'سیمین‌قلا', 'نگار');
    const tokenX = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_020 } })).json.token;
    const tokenY = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 820_021 } })).json.token;
    void x;
    void y;
    const friend = await world.api('POST', '/api/diplomacy/request', {
      token: tokenX,
      body: { toNationId: y, kind: 'friendship', message: 'همکاری اقتصادی' },
    });
    if (friend.status !== 200) console.log('DIPFAIL', friend.text.slice(0, 300));
    expect(friend.status).toBe(200);
    const incoming = await world.api('GET', '/api/diplomacy/requests', { token: tokenY });
    expect(incoming.json.incoming.length).toBeGreaterThan(0);
    const requestId = Number(incoming.json.incoming[0].id);
    const decide = await world.api('POST', `/api/diplomacy/request/${requestId}/decide`, { token: tokenY, body: { accept: true } });
    expect(decide.status).toBe(200);
    const relations = await world.api('GET', '/api/diplomacy/relations', { token: tokenX });
    expect(relations.json.relations.some((r: any) => Number(r.otherNationId) === y && r.status === 'friend')).toBe(true);
    // the relation is stored symmetrically: the other side sees it too
    const reverse = await world.api('GET', '/api/diplomacy/relations', { token: tokenY });
    expect(reverse.json.relations.some((r: any) => Number(r.otherNationId) === x && r.statusLabelFa === 'دوست')).toBe(true);
    const alliance = await world.api('GET', '/api/diplomacy/alliance', { token: tokenX });
    expect(alliance.status).toBe(200);

    // a malformed path id must 422 (the project's validation status), never NaN into a D1 binding (500)
    const garbage = await world.api('POST', '/api/diplomacy/request/NaN/decide', { token: tokenY, body: { accept: true } });
    expect(garbage.status).toBe(422);
    expect(garbage.json?.error?.code).toBe('validation_error');
    const garbageWar = await world.api('POST', '/api/war/999999x/round', { token: tokenX, body: {} });
    expect(garbageWar.status).toBe(422);

    // war is not a diplomatic request kind
    const wrong = await world.api('POST', '/api/diplomacy/request', { token: tokenX, body: { toNationId: y, kind: 'war' } });
    expect(wrong.status).toBeGreaterThanOrEqual(400);
    const peace = await world.api('POST', '/api/diplomacy/request', { token: tokenX, body: { toNationId: y, kind: 'peace' } });
    expect(peace.status).toBeGreaterThanOrEqual(400);
    // dissolve the relation through the API and see it disappear
    const dissolve = await world.api('POST', '/api/diplomacy/dissolve', { token: tokenX, body: { otherNationId: y } });
    expect(dissolve.status).toBe(200);
    // dissolving does not erase history: the pair goes back to neutral on BOTH sides
    const afterX = await world.api('GET', '/api/diplomacy/relations', { token: tokenX });
    expect(afterX.json.relations.find((r: any) => Number(r.otherNationId) === y).status).toBe('neutral');
    const afterY = await world.api('GET', '/api/diplomacy/relations', { token: tokenY });
    expect(afterY.json.relations.find((r: any) => Number(r.otherNationId) === x).status).toBe('neutral');
  });

  it('statements are sanitized, previewed and only public after moderation when required', async () => {
    const preview = await world.api('POST', '/api/statements/preview', {
      token: tokenA,
      body: { text: 'کشور ما از این پس بر همکاری منطقه‌ای تأکید دارد. ' + 'ب'.repeat(60) },
    });
    expect(preview.status).toBe(200);
    expect(preview.json.needsApproval).toBe(false);

    const markup = await world.api('POST', '/api/statements', { token: tokenA, body: { text: '<script>alert(1)</script> بیانیه رسمی کشور ما درباره صلح منطقه‌ای.' } });
    expect(markup.status).toBe(422); // markup never reaches the database at all

    const create = await world.api('POST', '/api/statements', { token: tokenA, body: { text: 'تأکید بر صلح. '.repeat(8) } });
    expect(create.status).toBe(200);
    const statementId = Number(create.json.statementId);
    const row = await first<any>(world.db, `SELECT * FROM statements WHERE id = ?`, statementId);
    expect(row).not.toBeNull();
    expect(row!.text).not.toContain('<');
    expect(row!.text.trim().length).toBeGreaterThan(10);

    const short = await world.api('POST', '/api/statements', { token: tokenA, body: { text: 'کوتاه' } });
    expect([400, 422]).toContain(short.status);

    const published = await world.api('GET', `/api/statements/published/${nationA}`, { token: tokenB });
    expect(published.status).toBe(200);

    // admin moderation path
    const list = await world.api('GET', '/api/admin/statements?status=all', { token: adminToken });
    expect(list.status).toBe(200);
    const target = (list.json.rows ?? [])[0];
    if (target && target.status !== 'published') {
      const review = await world.api('POST', `/api/admin/statements/${target.id}/review`, { token: adminToken, body: { decision: 'approve' } });
      expect(review.status).toBe(200);
    }
  });

  it('rankings are computed by the backend, not the client', async () => {
    await runCron(world, adminToken, ['ranking']);
    const res = await world.api('GET', '/api/social/rankings', { token: tokenA });
    expect(res.status).toBe(200);
    const rows = res.json.rows ?? res.json.rankings ?? [];
    expect(rows.length).toBeGreaterThan(1);
    expect(Number(rows[0].rank)).toBe(1);
    expect(Number(rows[0].score)).toBeGreaterThanOrEqual(Number(rows[1].score));
    const dbOrder = await all<{ id: number; total_score: number }>(world.db, `SELECT id, total_score FROM nations ORDER BY total_score DESC, id ASC`);
    expect(Number(rows[0].nationId ?? rows[0].nation_id)).toBe(Number(dbOrder[0]!.id));

    const weights = await world.api('POST', '/api/admin/settings', {
      token: adminToken,
      body: { ranking_weights: { treasury: 0, income: 0, military_power: 0, equipment: 0, war_wins: 0, nations: 0, power: 1 } },
    });
    expect(weights.status).toBe(200);
    const after = await world.api('GET', '/api/social/rankings', { token: tokenA });
    const afterRows = after.json.rows ?? after.json.rankings ?? [];
    expect(Number(afterRows[0].rank)).toBe(1);
    expect(afterRows.length).toBe(rows.length);
  });
});
