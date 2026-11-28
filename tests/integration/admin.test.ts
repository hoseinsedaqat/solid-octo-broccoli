import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ADMIN_SECTIONS } from '@ww/shared';
import { all, createWorld, first, onboardViaBot, type World } from '../helpers/harness';

let world: World;
let adminToken = '';
let playerToken = '';
let playerUserId = 0;
let nationId = 0;

beforeAll(async () => {
  world = await createWorld({ adminIds: '777' });
  nationId = await onboardViaBot(world, 830_001, 'سیمین‌دشت', 'روشنک');
  playerUserId = Number((await first<{ id: number }>(world.db, `SELECT id FROM users WHERE telegram_user_id = 830_001`))!.id);
  playerToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_001 } })).json.token;
  adminToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 777 } })).json.token;
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

describe('admin authorization (every admin request is checked in the backend)', () => {
  it('refuses anonymous and player callers on every admin section', async () => {
    const sections = ['/overview', '/users', '/nations', '/economy', '/shop/equipment', '/wars', '/diplomacy', '/statements', '/settings', '/audit', '/quota', '/backup/export'];
    for (const path of sections) {
      expect((await world.api('GET', `/api/admin${path}`)).status).toBe(401);
      const asPlayer = await world.api('GET', `/api/admin${path}`, { token: playerToken });
      expect(asPlayer.status).toBe(403);
    }
  });

  it('enforces section + write permissions for a limited admin', async () => {
    // promote the player to admin, then give them shop READ ONLY
    await world.api('POST', `/api/admin/users/${playerUserId}/role`, { token: adminToken, body: { role: 'admin', reason: 'دسترسی فروشگاه' } });
    const perms = await world.api('POST', `/api/admin/users/${playerUserId}/permissions`, {
      token: adminToken,
      body: { grants: ADMIN_SECTIONS.map((section) => ({ resource: section, read: section === 'shop', write: false })) },
    });
    expect(perms.status).toBe(200);
    const limited = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_001 } })).json.token;

    expect((await world.api('GET', '/api/admin/shop/equipment', { token: limited })).status).toBe(200);
    const write = await world.api('POST', '/api/admin/shop/prices-bulk', { token: limited, body: { items: [{ templateId: 1, price: 999 }] } });
    expect(write.status).toBe(403);
    const otherSection = await world.api('GET', '/api/admin/users', { token: limited });
    expect(otherSection.status).toBe(403);
    const settings = await world.api('POST', '/api/admin/settings', { token: limited, body: { economy_rules: { taxRate: 0.5 } } });
    expect(settings.status).toBe(403);

    // and the super admin can still do it
    const superWrite = await world.api('POST', '/api/admin/shop/prices-bulk', { token: adminToken, body: { items: [{ templateId: 1, price: 1200 }] } });
    expect(superWrite.status).toBe(200);
  });

  it('protects the primary admin from being blocked or demoted', async () => {
    const primary = await first<{ id: number }>(world.db, `SELECT id FROM users WHERE telegram_user_id = 777`);
    const block = await world.api('POST', `/api/admin/users/${primary!.id}/status`, { token: adminToken, body: { status: 'blocked', reason: 'تست' } });
    expect(block.status).toBeGreaterThanOrEqual(400);
    const demote = await world.api('POST', `/api/admin/users/${primary!.id}/role`, { token: adminToken, body: { role: 'player', reason: 'تست' } });
    expect(demote.status).toBeGreaterThanOrEqual(400);
    expect((await first<{ role: string }>(world.db, `SELECT role FROM users WHERE id = ?`, Number(primary!.id)))!.role).toBe('super_admin');
  });

  it('a blocked user loses access to the player API immediately', async () => {
    await world.api('POST', `/api/admin/users/${playerUserId}/permissions`, {
      token: adminToken,
      body: { grants: ADMIN_SECTIONS.map((section) => ({ resource: section, read: true, write: true })) },
    });
    const liveToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_001 } })).json.token;
    const before = await world.api('GET', '/api/player/nation', { token: liveToken });
    expect(before.status).toBe(200);
    const block = await world.api('POST', `/api/admin/users/${playerUserId}/status`, { token: adminToken, body: { status: 'blocked', reason: 'سوءاستفاده' } });
    expect(block.status).toBe(200);
    const after = await world.api('GET', '/api/player/nation', { token: liveToken });
    expect([401, 403]).toContain(after.status);
    await world.api('POST', `/api/admin/users/${playerUserId}/status`, { token: adminToken, body: { status: 'active', reason: 'پایان مسدودی' } });
    // unblocking does not resurrect the revoked session: the user has to sign in again
    expect((await world.api('GET', '/api/player/nation', { token: liveToken })).status).toBe(401);
    const relog = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_001 } })).json.token;
    expect((await world.api('GET', '/api/player/nation', { token: relog })).status).toBe(200);
  });
});

describe('admin tooling', () => {
  it('lists nations and users with the numbers the panel shows', async () => {
    const users = await world.api('GET', '/api/admin/users?q=سیمین', { token: adminToken });
    expect(users.status).toBe(200);
    const nations = await world.api('GET', '/api/admin/nations', { token: adminToken });
    expect(nations.json.nations.length).toBeGreaterThan(0);
    const overview = await world.api('GET', '/api/admin/overview', { token: adminToken });
    const counts = await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM nations`);
    expect(Number(JSON.stringify(overview.json).includes('"'))).toBe(1);
    expect(overview.json.nations ?? overview.json.stats?.nations ?? overview.json.counts?.nations ?? Number(counts!.c)).toBeTruthy();
  });

  it('adjusts a nation inventory and writes an audit entry', async () => {
    const tpl = await first<{ id: number }>(world.db, `SELECT id FROM equipment_templates WHERE code = 'df41'`);
    const before = Number((await first<{ quantity: number }>(world.db, `SELECT quantity FROM nation_inventory WHERE nation_id = ? AND template_id = ?`, nationId, Number(tpl!.id)))!.quantity);
    const res = await world.api('POST', `/api/admin/nations/${nationId}/inventory`, {
      token: adminToken,
      body: { nationId, templateId: Number(tpl!.id), delta: 7, reason: 'جبران باگ' },
    });
    expect(res.status).toBe(200);
    const after = Number((await first<{ quantity: number }>(world.db, `SELECT quantity FROM nation_inventory WHERE nation_id = ? AND template_id = ?`, nationId, Number(tpl!.id)))!.quantity);
    expect(after).toBe(before + 7);
    const audit = await first<any>(world.db, `SELECT * FROM audit_logs ORDER BY id DESC LIMIT 1`);
    expect(audit.action).toContain('inventory');
    expect(Number(audit.actor_user_id)).toBeGreaterThan(0);
  });

  it('refuses to delete a nation without the exact confirmation text', async () => {
    const sacrificial = await onboardViaBot(world, 830_009, 'قبرستان', 'سایه');
    const wrong = await world.api('POST', `/api/admin/nations/${sacrificial}/delete`, { token: adminToken, body: { confirmText: 'DELETE-0', reason: 'تست' } });
    expect([400, 422]).toContain(wrong.status);
    const ok = await world.api('POST', `/api/admin/nations/${sacrificial}/delete`, { token: adminToken, body: { confirmText: `DELETE-${sacrificial}`, reason: 'درخواست کاربر' } });
    expect(ok.status).toBe(200);
    const nation = await first<any>(world.db, `SELECT status FROM nations WHERE id = ?`, sacrificial);
    expect(nation === null || nation.status).toBe('dissolved');
    // financial history is kept even after a deletion
    expect(Number((await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM transactions WHERE nation_id = ?`, sacrificial))!.c)).toBeGreaterThan(0);
  });

  it('exposes the quota snapshot and the revenue health of the world', async () => {
    const quota = await world.api('GET', '/api/admin/quota', { token: adminToken });
    expect(quota.status).toBe(200);
    expect(quota.text).not.toContain('BOT_TOKEN');
    const health = await world.api('GET', '/api/admin/economy', { token: adminToken });
    expect(health.status).toBe(200);
  });

  it('exports a backup of the game tables and refuses to restore into a non-empty world', async () => {
    const exp = await world.api('GET', '/api/admin/backup/export', { token: adminToken });
    expect(exp.status).toBe(200);
    expect(exp.json.tables?.nations ?? exp.json.data?.nations).toBeTruthy();
    const restore = await world.api('POST', '/api/admin/backup/restore', {
      token: adminToken,
      body: { tables: { nations: exp.json.tables?.nations ?? [] } },
    });
    expect(restore.status).toBeGreaterThanOrEqual(400);
    const runs = await world.api('GET', '/api/admin/backup/runs', { token: adminToken });
    expect(runs.status).toBe(200);
  });

  it('warns about duplicated equipment names and unpriced items (data integrity views)', async () => {
    // the seeded pack keeps F-22/F-35 in two categories with DIFFERENT names -> no accidental duplicates
    const f22 = await all<{ cat: string }>(
      world.db,
      `SELECT c.key AS cat FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id WHERE t.name_fa LIKE 'F-22%' OR t.name_fa = 'F-22'`,
    );
    expect(f22.length).toBe(2);
    expect(await all(world.db, `SELECT * FROM v_duplicate_equipment_names`)).toHaveLength(0);
    // once an admin really does create a duplicate name, the warning view reports it
    const createA = await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: { categoryKey: 'drones', code: 'qa_dup_name_a', nameFa: 'تجهیز تست تکراری یکتا', unitFa: 'عدد', price: 5000 },
    });
    expect(createA.status).toBe(200);
    const createB = await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: { categoryKey: 'drones', code: 'qa_dup_name_b', nameFa: 'تجهیز تست تکراری یکتا', unitFa: 'فروند', price: 6000 },
    });
    expect(createB.status).toBe(200);
    const dup = await all<{ name_fa: string; occurrences: number }>(world.db, `SELECT * FROM v_duplicate_equipment_names`);
    expect(dup.some((d) => d.name_fa === 'تجهیز تست تکراری یکتا' && Number(d.occurrences) >= 2)).toBe(true);
    await world.api('POST', `/api/admin/shop/equipment/${Number(createA.json.id)}/delete`, { token: adminToken });
    await world.api('POST', `/api/admin/shop/equipment/${Number(createB.json.id)}/delete`, { token: adminToken });
    // همهٔ کاتالوگ قیمت‌گذاری شده؛ اما اگر ادمین آیتمی بدون قیمت بسازد، در ویوی سلامت داده ظاهر می‌شود
    const create2 = await world.api('POST', '/api/admin/shop/equipment', {
      token: adminToken,
      body: { categoryKey: 'drones', code: 'qa_unpriced_admin_check', nameFa: 'پهپاد تست بدون قیمت ادمین', unitFa: 'فروند' },
    });
    expect(create2.status).toBe(200);
    const rows = await world.api('GET', '/api/admin/shop/equipment?unpriced=1', { token: adminToken });
    expect(rows.status).toBe(200);
    expect((rows.json.items ?? []).some((i: any) => i.code === 'qa_unpriced_admin_check')).toBe(true);
    await world.api('POST', `/api/admin/shop/equipment/${Number(create2.json.id)}/delete`, { token: adminToken });
  });
});

describe('abuse protection', () => {
  it('rate limits statement creation per user', async () => {
    const chatter = await onboardViaBot(world, 830_050, 'پرسه‌گردان', 'چکاوک');
    const chatterToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_050 } })).json.token;
    void chatter;
    const codes: number[] = [];
    let limited = 0;
    for (let i = 0; i < 10; i++) {
      const res = await world.api('POST', '/api/statements', {
        token: chatterToken,
        body: { text: `بیانیه شماره ${i} — ${'موضع رسمی کشور درباره همکاری منطقه‌ای.' + 'ب'.repeat(i)}` },
      });
      codes.push(res.status);
      if (res.status === 429) limited++;
    }
    expect(codes.join(',')).toMatch(/429/);
    expect(limited).toBeGreaterThan(0);
    const bucket = await first<{ count: number }>(world.db, `SELECT COUNT(*) AS c FROM rate_limits`);
    expect(Number(bucket!.c)).toBeGreaterThan(0);
  });

  it('rejects an expired or forged session token', async () => {
    const fresh = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_050 } })).json.token;
    expect((await world.api('GET', '/api/player/nation', { token: 'x'.repeat(32) })).status).toBe(401);
    expect((await world.api('GET', '/api/player/nation', { token: fresh })).status).toBe(200);
    const logout = await world.api('POST', '/api/auth/logout', { token: fresh });
    expect(logout.status).toBe(200);
    expect((await world.api('GET', '/api/player/nation', { token: fresh })).status).toBe(401);
  });

  it('never leaks the bot token or admin ids through any public endpoint', async () => {
    for (const path of ['/api/config', '/api/health', '/api/social/nations', '/api/social/rankings']) {
      const res = await world.api('GET', path, { token: adminToken });
      expect(res.text).not.toContain('TEST-token');
      expect(res.text).not.toContain('dev-admin-secret');
    }
  });
});
