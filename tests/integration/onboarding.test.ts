import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DEFAULT_BRANDING, STARTER_ECONOMY, EQUIPMENT_CATEGORIES, STARTER_PACK } from '@ww/shared';
import { all, createWorld, first, onboardViaBot, botText, botCallback, type World } from '../helpers/harness';

let world: World;

beforeAll(async () => {
  world = await createWorld({ adminIds: '777, 778', env: { TELEGRAM_WEBHOOK_SECRET: 'test-hook-secret' } });
}, 180_000);

afterAll(async () => {
  await world.dispose();
});

const sentTexts = () => world.sent.filter((s) => s.method === 'sendMessage' || s.method === 'editMessageText').map((s) => String(s.payload.text ?? ''));

describe('bot onboarding (the real /start flow, offline)', () => {
  it('answers /start with the documented welcome text and immediately starts onboarding', async () => {
    await botText(world, 900_001, '/start');
    const texts = sentTexts();
    expect(texts.some((t) => t.includes(DEFAULT_BRANDING.welcomeTitle))).toBe(true);
    expect(texts.some((t) => t.includes(DEFAULT_BRANDING.nationNamePrompt))).toBe(true);
  });

  it('shows the 9 main menu buttons (persistent keyboard + Mini App launcher)', async () => {
    await onboardViaBot(world, 900_010, 'دشت مارال', 'یاران', 5);
    world.sent.length = 0;
    await botText(world, 900_010, '/menu');
    const markups = world.sent
      .filter((s) => s.method === 'sendMessage')
      .map((s) => (s.payload.reply_markup ?? {}) as { keyboard?: { text: string }[][]; inline_keyboard?: { text: string; web_app?: unknown; url?: string }[][] });
    const labels = markups.flatMap((m) => (m.keyboard ?? []).flat().map((b) => String(b.text ?? '')));
    // every one of the 9 main menu entries of the design document must be tappable
    for (const needle of ['مدیریت کشور', 'دارایی', 'خرید تجهیزات', 'حمله', 'دفاع', 'دیپلماسی', 'بیانیه‌ها', 'آمار', 'تنظیمات']) {
      expect(labels.some((l) => l.includes(needle))).toBe(true);
    }
    const inline = markups.flatMap((m) => (m.inline_keyboard ?? []).flat());
    expect(inline.some((b) => Boolean(b.web_app) || Boolean(b.url))).toBe(true); // Mini App launcher
  });

  it('walks name -> leader -> flag and grants the exact starter package', async () => {
    const nationId = await onboardViaBot(world, 900_002, 'پرشیا نوین', 'رضا خان', 13);

    const nation = await first<any>(world.db, `SELECT * FROM nations WHERE id = ?`, nationId);
    expect(nation.name).toBe('پرشیا نوین');
    expect(nation.leader_name).toBe('رضا خان');
    expect(nation.flag).toBe('🦅'); // FLAG_CHOICES[13]
    expect(Number(nation.treasury)).toBe(STARTER_ECONOMY.treasury);
    expect(Number(nation.last_income_cycle)).toBe(-1);
    expect(Number(nation.income_anchor_at)).toBeGreaterThan(0);

    const inv = await all<any>(world.db, `SELECT i.quantity, t.code, t.name_fa FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id WHERE i.nation_id = ?`, nationId);
    // every starter line item exists, including the intentionally duplicated F-22 / F-35
    expect(inv).toHaveLength(Object.values(STARTER_PACK).reduce((n, items) => n + items.length, 0));
    const names = inv.map((r) => r.name_fa).sort();
    expect(names.filter((n) => n === 'F-22 Raptor')).toHaveLength(1);
    expect(names.filter((n) => n.startsWith('F-22')).length).toBeGreaterThan(1); // also in air-air defense

    const econ = await first<any>(world.db, `SELECT * FROM nation_economy WHERE nation_id = ?`, nationId);
    expect(Number(econ.factory_income)).toBe(STARTER_ECONOMY.factoryIncome);
    expect(Number(econ.mine_income)).toBe(STARTER_ECONOMY.mineIncome);
    expect(Number(econ.gross_income)).toBe(STARTER_ECONOMY.factoryIncome + STARTER_ECONOMY.mineIncome);

    const tx = await first<any>(world.db, `SELECT * FROM transactions WHERE nation_id = ? AND type = 'starter_grant'`, nationId);
    expect(Number(tx!.amount)).toBe(STARTER_ECONOMY.treasury);
    expect(tx!.idempotency_key).toBe(`starter:${nationId}`);
  });

  it('rejects a too-short name but lets the player retry in the same flow', async () => {
    await botText(world, 900_003, '/start');
    await botText(world, 900_003, 'ab');
    expect(sentTexts().some((t) => t.includes('نام کشور'))).toBe(true);
    await botText(world, 900_003, 'آتلانتیس');
    await botText(world, 900_003, 'ملکه');
    await botCallback(world, 900_003, 'flag:0');
    const row = await first<{ id: number }>(world.db, `SELECT id FROM nations WHERE name = ?`, 'آتلانتیس');
    expect(row).not.toBeNull();
  });

  it('keeps country names globally unique', async () => {
    await botText(world, 900_004, '/start');
    await botText(world, 900_004, 'پرشیا نوین'); // taken by 900_002
    const err = sentTexts().slice(-1)[0] ?? '';
    expect(err).toMatch(/قبلاً ثبت شده/);
    expect(await first(world.db, `SELECT id FROM nations WHERE name = 'پرشیا نوین' AND owner_user_id = (SELECT id FROM users WHERE telegram_user_id = 900_004)`)).toBeNull();
  });

  it('persists the flow state in D1 (no worker-memory state)', async () => {
    await botText(world, 900_005, '/start');
    await botText(world, 900_005, 'کاخ جدید');
    const state = await first<any>(world.db, `SELECT * FROM bot_flow_states WHERE user_id = (SELECT id FROM users WHERE telegram_user_id = 900_005)`);
    expect(state).not.toBeNull();
    expect(state.state).toBe('onb:leader');
    expect(JSON.parse(state.data).name).toBe('کاخ جدید');
  });

  it('ignores a replayed webhook update (dedupe by update_id)', async () => {
    const before = world.sent.length;
    const update = { update_id: 555_001, message: { message_id: 1, from: { id: 900_006, username: 'x' }, chat: { id: 900_006, type: 'private' }, text: '/help', date: 1 } };
    await world.telegramUpdate(update);
    const afterFirst = world.sent.length;
    await world.telegramUpdate(update);
    expect(world.sent.length).toBe(afterFirst); // second delivery produced nothing
    expect(afterFirst).toBeGreaterThan(before);
  });
});

describe('authentication & initData validation', () => {
  it('accepts a correctly signed initData payload and issues a bearer token', async () => {
    const initData = await world.signedInitData({ id: 900_002, username: 'persia', first_name: 'Reza' });
    const res = await world.api('POST', '/api/auth/session', { body: { initData } });
    expect(res.status).toBe(200);
    expect(res.json.token).toBeTruthy();
    expect(res.json.nations?.length ?? 0).toBeGreaterThanOrEqual(1);
    const me = await world.api('GET', '/api/auth/me', { token: res.json.token });
    expect(me.status).toBe(200);
    expect(me.json.telegramId).toBe(900_002);
    expect(me.json.role).toBe('player');
    expect(me.json.isPrimaryAdmin).toBe(false);
  });

  it('rejects a tampered hash and a stale auth_date', async () => {
    const initData = await world.signedInitData({ id: 900_002, username: 'persia' });
    const tampered = initData.replace(/hash=[0-9a-f]+/, 'hash=' + '0'.repeat(64));
    const bad = await world.api('POST', '/api/auth/session', { body: { initData: tampered } });
    expect(bad.status).toBe(401);

    const stale = await world.signedInitData({ id: 900_002 }, { authDate: Math.floor(Date.now() / 1000) - 40 * 3600 });
    const staleRes = await world.api('POST', '/api/auth/session', { body: { initData: stale } });
    expect(staleRes.status).toBe(401);
  });

  it('never lets the client assert an identity without initData', async () => {
    const res = await world.api('POST', '/api/auth/session', { body: { initData: 'user={"id":777}&auth_date=1&hash=deadbeef' } });
    expect(res.status).toBe(401);
    const noAuth = await world.api('GET', '/api/player/nation');
    expect(noAuth.status).toBe(401);
  });

  it('bootstraps ADMIN_TELEGRAM_IDS into the super admin role, everyone else stays a player', async () => {
    const admin = await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 777 } });
    expect(admin.json.role).toBe('super_admin');
    const player = await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 900_002 } });
    expect(player.json.role).toBe('player');
    const rows = await all<any>(world.db, `SELECT telegram_user_id, role, is_primary_admin FROM users WHERE telegram_user_id IN (777, 900_002)`);
    expect(rows.map((r) => `${r.telegram_user_id}:${r.role}`).sort()).toEqual(['777:super_admin', '900002:player']);
    expect(rows.filter((r) => r.is_primary_admin === 1).map((r) => r.telegram_user_id)).toEqual([777]);
  });

  it('refuses a webhook that does not carry the secret token', async () => {
    const res = await world.api('POST', '/api/telegram/webhook', { body: { update_id: 1, message: { text: '/start', chat: { id: 1 }, from: { id: 1 } } } });
    expect(res.status).toBe(401);
  });

  it('reports health without leaking secrets', async () => {
    const res = await world.api('GET', '/api/health');
    expect(res.status).toBe(200);
    expect(res.text).not.toContain('test-hook-secret');
    expect(res.json.telegramBotConfigured).toBe(true);
    expect(res.text).not.toContain('123456:TEST');
  });
});

describe('player API isolation', () => {
  it('serves only the nation owned by the session, never the one named in the query', async () => {
    const a = await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 900_002 } });
    const b = await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 900_003 } });
    const nationA = await first<{ id: number }>(world.db, `SELECT id FROM nations WHERE name = 'پرشیا نوین'`);
    const nationB = await first<{ id: number }>(world.db, `SELECT id FROM nations WHERE name = 'آتلانتیس'`);
    expect(nationA).not.toBeNull();
    expect(nationB).not.toBeNull();

    const natA = await world.api('GET', '/api/player/nation', { token: a.json.token });
    expect(natA.status).toBe(200);
    expect(natA.json.nation.id).toBe(Number(nationA!.id));
    // a client-supplied nationId is simply ignored (it is never read by the API)
    const spoof = await world.api('GET', `/api/player/nation?nationId=${nationB!.id}`, { token: a.json.token });
    expect(spoof.json.nation.id).toBe(Number(nationA!.id));
    const spoofPatch = await world.api('PATCH', `/api/player/nation?nationId=${nationB!.id}`, { token: a.json.token, body: { leaderName: 'متجاوز' } });
    expect([200, 400].includes(spoofPatch.status)).toBe(true);
    const leaderB = await first<{ leader_name: string }>(world.db, `SELECT leader_name FROM nations WHERE id = ?`, Number(nationB!.id));
    expect(leaderB!.leader_name).not.toBe('متجاوز');

    const natB = await world.api('GET', '/api/player/nation', { token: b.json.token });
    expect(natB.json.nation.id).toBe(Number(nationB!.id));

    // economy rows only ever belong to the session nation
    const econA = await world.api('GET', '/api/player/economy', { token: a.json.token });
    expect(econA.status).toBe(200);
    expect(Number(econA.json.economy.treasury)).toBeGreaterThan(0);
    const txA = await world.api('GET', '/api/player/transactions', { token: a.json.token });
    const idsA = new Set((txA.json.rows ?? []).map((t: any) => Number(t.id)));
    const foreignTx = await first<{ id: number }>(
      world.db,
      `SELECT id FROM transactions WHERE nation_id = ? AND id NOT IN (SELECT id FROM transactions WHERE nation_id = ?)`,
      Number(nationB!.id),
      Number(nationA!.id),
    );
    expect(foreignTx).not.toBeNull();
    expect(idsA.has(Number(foreignTx!.id))).toBe(false);

    const cats = await world.api('GET', '/api/shop/categories', { token: a.json.token });
    expect(cats.json.categories).toHaveLength(EQUIPMENT_CATEGORIES.length);
    const tanks = await world.api('GET', '/api/shop/category/tanks', { token: a.json.token });
    expect(tanks.json.items.length).toBeGreaterThan(0);
    expect(tanks.json.items.every((i: any) => typeof i.ownedQuantity === 'number' && typeof i.templateId === 'number')).toBe(true);
    // nothing is purchasable before the admin sets a price (no invented prices)
    expect(tanks.json.items.every((i: any) => i.price === null ? i.purchasable === false && i.disabledReason.includes('قیمت') : true)).toBe(true);
  });
});
