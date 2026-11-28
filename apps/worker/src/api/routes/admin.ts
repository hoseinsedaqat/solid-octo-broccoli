import { Hono } from 'hono';
import { z } from 'zod';
import {
  ADMIN_SECTIONS,
  GAME_SETTING_KEYS,
  formatZodError,
  type AdminSection,
  type Role,
  adminAdjustTreasurySchema,
  adminInventoryDeltaSchema,
  adminSetIncomeSchema,
  battleParamsSchema,
  brandingSchema,
  categorySchema,
  diplomacyRulesSchema,
  economyRulesSchema,
  equipmentUpsertSchema,
  featureFlagsSchema,
  profileRulesSchema,
  quotaGuardSchema,
  starterTemplateSchema,
} from '@ww/shared';
import { ApiError } from '../../core/errors';
import { sql } from '../../core/sql';
import { nowSeconds, toIso } from '../../core/format';
import { adminActorOf, parseJson, requireAdmin, requireUser, settingsFor } from '../middleware';
import { loadSettings, setSettingsBulk } from '../../core/settings';
import { Db } from '../../core/db';
import {
  adminAdjustInventory,
  adminDeleteEquipment,
  adminDeleteNation,
  adminListCategories,
  adminListEquipment,
  adminListNations,
  adminListStarterTemplates,
  adminSetCategoryWeights,
  adminSetPricesBulk,
  adminUpdateNation,
  adminUpsertCategory,
  adminUpsertEquipment,
  adminUpsertStarterTemplate,
  BACKUP_TABLES,
  exportBackup,
  getPermissions,
  listBackupRuns,
  logBackupRun,
  overview,
  revenueHealth,
  searchUsers,
  setPermissions,
  setUserRole,
  setUserStatus,
} from '../../services/adminService';
import { adminAdjustTreasury, adminSetIncome, globalMoneyStats, listTransactions } from '../../services/financeService';
import { adminListStatements, adminReviewStatement } from '../../services/statementService';
import { adminBroadcast } from '../../services/newsService';
import { audit } from '../../services/auditService';
import { snapshotQuota } from '../../services/quotaService';
import { loadNation, refreshNationStats, recomputeRankings } from '../../db/queries';
import { triggerJobsManually } from '../../scheduled/cron';
import { adminStopWar, mapWar } from '../../services/warService';
import { determineCountry } from '../../services/assignCountryService';
import type { HonoEnv } from '../../types';

export const adminRoutes = new Hono<HonoEnv>();

adminRoutes.use(requireUser);

function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}

const write = <S extends AdminSection>(section: S) => requireAdmin(section, true);

/* ------------------------------- dashboard ------------------------------ */

adminRoutes.get('/overview', requireAdmin(), async (c) => c.json(await overview(c.get('db'))));

adminRoutes.get('/me', requireAdmin(), async (c) => {
  const user = c.get('user');
  return c.json({
    userId: user.userId,
    telegramId: user.telegramId,
    role: user.role,
    sections: ADMIN_SECTIONS.map((s) => ({
      section: s,
      read: user.role === 'super_admin' ? true : (user.permissions[s]?.read ?? false),
      write: user.role === 'super_admin' ? true : (user.permissions[s]?.write ?? false),
    })),
  });
});

/* --------------------------------- users -------------------------------- */

adminRoutes.get('/users', requireAdmin('users'), async (c) => {
  const res = await searchUsers(c.get('db'), {
    search: c.req.query('q') ?? null,
    role: (c.req.query('role') as Role) || null,
    status: c.req.query('status') ?? null,
    limit: Number(c.req.query('limit') ?? 0) || undefined,
    offset: Number(c.req.query('offset') ?? 0) || undefined,
  });
  return c.json(res);
});

adminRoutes.get('/users/:id', requireAdmin('users'), async (c) => {
  const db = c.get('db');
  const id = Number(c.req.param('id'));
  const user = await db.first<Record<string, unknown>>(sql`SELECT * FROM users WHERE id = ${id}`);
  if (!user) throw ApiError.notFound('کاربر یافت نشد.');
  const nations = await adminListNations(db, { search: null });
  const mine = nations.filter((n) => n.ownerTelegramId === Number(user.telegram_user_id));
  const tx = mine.length ? await listTransactions(db, mine[0]!.id, { limit: 10 }) : { rows: [], nextOffset: null };
  return c.json({
    user: {
      id: Number(user.id),
      telegramId: Number(user.telegram_user_id),
      username: (user.username as string) ?? null,
      firstName: (user.first_name as string) ?? null,
      role: String(user.role),
      status: String(user.status),
      isPrimaryAdmin: Number(user.is_primary_admin) === 1,
      createdAt: toIso(Number(user.created_at)),
      lastSeenAt: toIso(user.last_seen_at === null ? null : Number(user.last_seen_at)),
    },
    nations: mine,
    transactions: tx.rows,
    permissions: await getPermissions(db, id),
  });
});

/* --------------------------- 🚩 تعیین کشور بازیکن --------------------------- */

/** ادمین آیدی عددی + نام کشور را می‌دهد؛ کشور در پروفایل بازیکن ثبت می‌شود (یا همان‌جا ساخته می‌شود) */
adminRoutes.post('/determine-country', write('users'), async (c) => {
  const body = parse(
    z.object({ telegramId: z.coerce.number().int().positive(), countryName: z.string().trim().min(3).max(30) }),
    await parseJson(c),
  );
  const settings = await settingsFor(c);
  const result = await determineCountry(c.get('db'), adminActorOf(c.get('user')), body, settings);
  return c.json(result);
});

adminRoutes.post('/users/:id/status', write('users'), async (c) => {
  const body = parse(z.object({ status: z.enum(['active', 'blocked', 'disabled']), reason: z.string().trim().min(3).max(200) }), await parseJson(c));
  const res = await setUserStatus(c.get('db'), Number(c.req.param('id')), body.status, body.reason, adminActorOf(c.get('user')));
  return c.json(res);
});

adminRoutes.post('/users/:id/role', write('roles'), async (c) => {
  const body = parse(z.object({ role: z.enum(['player', 'admin', 'super_admin']), reason: z.string().trim().min(3).max(200) }), await parseJson(c));
  const res = await setUserRole(c.get('db'), Number(c.req.param('id')), body.role as Role, body.reason, adminActorOf(c.get('user')));
  return c.json(res);
});

adminRoutes.get('/users/:id/permissions', requireAdmin('roles'), async (c) => c.json({ grants: await getPermissions(c.get('db'), Number(c.req.param('id'))) }));

adminRoutes.post('/users/:id/permissions', write('roles'), async (c) => {
  const body = parse(
    z.object({
      grants: z.array(
        z.object({ resource: z.enum(ADMIN_SECTIONS), read: z.coerce.boolean(), write: z.coerce.boolean() }),
      ),
    }),
    await parseJson(c),
  );
  return c.json(await setPermissions(c.get('db'), Number(c.req.param('id')), body.grants, adminActorOf(c.get('user'))));
});

/* -------------------------------- nations ------------------------------- */

adminRoutes.get('/nations', requireAdmin('nations'), async (c) =>
  c.json({
    nations: await adminListNations(c.get('db'), {
      search: c.req.query('q') ?? null,
      status: c.req.query('status') ?? null,
      limit: Number(c.req.query('limit') ?? 0) || undefined,
      offset: Number(c.req.query('offset') ?? 0) || undefined,
    }),
  }),
);

adminRoutes.post('/nations/:id/update', write('nations'), async (c) => {
  const db = c.get('db');
  const body = parse(
    z.object({
      name: z.string().trim().min(3).max(30).optional(),
      flag: z.string().trim().min(1).max(24).optional(),
      leaderName: z.string().trim().min(2).max(40).optional(),
      status: z.enum(['active', 'frozen', 'banned', 'at_war']).optional(),
      reason: z.string().trim().min(3).max(200),
    }),
    await parseJson(c),
  );
  const { reason, ...patch } = body;
  const res = await adminUpdateNation(db, Number(c.req.param('id')), patch, reason, adminActorOf(c.get('user')), await settingsFor(c));
  return c.json(res);
});

adminRoutes.post('/nations/:id/treasury', write('economy'), async (c) => {
  const db = c.get('db');
  const body = parse(adminAdjustTreasurySchema, await parseJson(c));
  const nation = await loadNation(db, body.nationId);
  const res = await adminAdjustTreasury(db, nation, body.delta, body.reason, adminActorOf(c.get('user')));
  return c.json(res);
});

adminRoutes.post('/nations/:id/income', write('economy'), async (c) => {
  const db = c.get('db');
  const nationId = Number(c.req.param('id'));
  const body = parse(adminSetIncomeSchema, await parseJson(c));
  const nation = await loadNation(db, nationId);
  const res = await adminSetIncome(
    db,
    nation,
    { factoryIncome: body.factoryIncome, mineIncome: body.mineIncome, upkeepBase: body.upkeepBase },
    body.reason,
    await settingsFor(c),
    adminActorOf(c.get('user')),
  );
  return c.json({ income: res });
});

adminRoutes.post('/nations/:id/inventory', write('nations'), async (c) => {
  const db = c.get('db');
  const body = parse(adminInventoryDeltaSchema, await parseJson(c));
  const res = await adminAdjustInventory(db, body.nationId, body.templateId, body.delta, body.reason, await settingsFor(c), adminActorOf(c.get('user')));
  return c.json(res);
});

adminRoutes.post('/nations/:id/defense', write('nations'), async (c) => {
  const body = parse(z.object({ fortificationLevel: z.coerce.number().int().min(0).max(20), defenseMode: z.enum(['standard', 'alert', 'fortified']) }), await parseJson(c));
  await c
    .get('db')
    .run(sql`UPDATE nation_settings SET fortification_level = ${body.fortificationLevel}, defense_mode = ${body.defenseMode}, updated_at = ${nowSeconds()} WHERE nation_id = ${Number(c.req.param('id'))}`);
  await audit(c.get('db'), { actor: adminActorOf(c.get('user')), action: 'nation.set_defense', targetType: 'nation', targetId: Number(c.req.param('id')), after: body });
  return c.json({ ok: true });
});

adminRoutes.post('/nations/:id/delete', write('nations'), async (c) => {
  const body = parse(z.object({ confirmText: z.string().min(4), reason: z.string().trim().min(3).max(200) }), await parseJson(c));
  const res = await adminDeleteNation(c.get('db'), Number(c.req.param('id')), body.confirmText, body.reason, adminActorOf(c.get('user')));
  // the leaderboard of the remaining countries is recomputed so no rank points at the dissolved nation
  await recomputeRankings(c.get('db'), await settingsFor(c));
  return c.json(res);
});

/* -------------------------------- economy ------------------------------- */

adminRoutes.get('/economy', requireAdmin('economy'), async (c) => {
  const db = c.get('db');
  const settings = await loadSettings(db);
  return c.json({
    money: await globalMoneyStats(db),
    rules: settings.economy,
    starterEconomy: await db.all<Record<string, unknown>>(sql`SELECT * FROM starter_templates ORDER BY id`),
    health: await revenueHealth(db),
  });
});

adminRoutes.post('/economy/rules', write('economy'), async (c) => {
  const db = c.get('db');
  const body = parse(economyRulesSchema, await parseJson(c));
  const updated = await setSettingsBulk(db, { [GAME_SETTING_KEYS.economy]: body }, c.get('user').userId);
  await audit(db, { actor: adminActorOf(c.get('user')), action: 'settings.economy_rules', after: body });
  const nations = await db.all<{ id: number }>(sql`SELECT id FROM nations WHERE status <> 'dissolved' LIMIT 200`);
  for (const n of nations) {
    const nation = await loadNation(db, n.id);
    await refreshNationStats(db, nation, await loadSettings(db, { force: true }));
  }
  return c.json({ updated, recalculatedNations: nations.length });
});

adminRoutes.get('/economy/transactions', requireAdmin('economy'), async (c) => {
  const db = c.get('db');
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT t.*, n.name AS nation_name FROM transactions t JOIN nations n ON n.id = t.nation_id
         ORDER BY t.id DESC LIMIT ${Math.min(200, Math.max(10, Number(c.req.query('limit') ?? 50)))}`,
  );
  return c.json({ rows });
});

/* ------------------------------ shop / items ---------------------------- */

adminRoutes.get('/shop/equipment', requireAdmin('shop'), async (c) =>
  c.json({
    items: await adminListEquipment(c.get('db'), {
      categoryKey: c.req.query('category') ?? null,
      search: c.req.query('q') ?? null,
      onlyUnpriced: c.req.query('unpriced') === '1',
      limit: Number(c.req.query('limit') ?? 0) || undefined,
      offset: Number(c.req.query('offset') ?? 0) || undefined,
    }),
  }),
);

adminRoutes.post('/shop/equipment', write('shop'), async (c) => {
  const body = parse(equipmentUpsertSchema, await parseJson(c));
  return c.json(await adminUpsertEquipment(c.get('db'), body as unknown as Record<string, unknown>, adminActorOf(c.get('user'))));
});

adminRoutes.post('/shop/equipment/:id/delete', write('shop'), async (c) =>
  c.json(await adminDeleteEquipment(c.get('db'), Number(c.req.param('id')), adminActorOf(c.get('user')))),
);

adminRoutes.post('/shop/prices-bulk', write('shop'), async (c) => {
  const body = parse(
    z.object({ items: z.array(z.object({ templateId: z.coerce.number().int().positive(), price: z.coerce.number().int().min(1).nullable() })) }),
    await parseJson(c),
  );
  return c.json(await adminSetPricesBulk(c.get('db'), body.items, adminActorOf(c.get('user'))));
});

adminRoutes.get('/shop/categories', requireAdmin('shop'), async (c) => c.json({ categories: await adminListCategories(c.get('db')) }));

adminRoutes.post('/shop/categories', write('shop'), async (c) => {
  const body = parse(categorySchema, await parseJson(c));
  return c.json(await adminUpsertCategory(c.get('db'), { ...body, powerWeight: undefined } as never, adminActorOf(c.get('user'))));
});

adminRoutes.post('/shop/category-weights', write('settings'), async (c) => {
  const body = parse(z.object({ weights: z.record(z.coerce.number().min(0).max(100000)) }), await parseJson(c));
  return c.json(await adminSetCategoryWeights(c.get('db'), body.weights, adminActorOf(c.get('user'))));
});

adminRoutes.get('/shop/sales', requireAdmin('shop'), async (c) => {
  const rows = await c.get('db').all<Record<string, unknown>>(
    sql`SELECT ti.name_snapshot AS name, c.label_fa AS category, SUM(ti.quantity) AS units, SUM(COALESCE(ti.total_price,0)) AS revenue,
               COUNT(DISTINCT tx.nation_id) AS buyers
          FROM transaction_items ti
          JOIN transactions tx ON tx.id = ti.transaction_id
          LEFT JOIN equipment_templates t ON t.id = ti.template_id
          LEFT JOIN equipment_categories c ON c.id = t.category_id
         WHERE tx.type = 'purchase'
         GROUP BY ti.name_snapshot, c.label_fa
         ORDER BY revenue DESC LIMIT 50`,
  );
  return c.json({ rows });
});

/* --------------------------- starter templates -------------------------- */

adminRoutes.get('/starter-templates', requireAdmin('economy'), async (c) => c.json({ templates: await adminListStarterTemplates(c.get('db')) }));

adminRoutes.post('/starter-templates', write('economy'), async (c) => {
  const body = parse(starterTemplateSchema, await parseJson(c));
  return c.json(await adminUpsertStarterTemplate(c.get('db'), { ...body, items: body.items?.map((i) => ({ templateId: i.templateId, quantity: i.quantity })) }, adminActorOf(c.get('user'))));
});

adminRoutes.get('/starter-templates/:id/items', requireAdmin('economy'), async (c) => {
  const rows = await c.get('db').all<Record<string, unknown>>(
    sql`SELECT i.quantity, t.id AS template_id, t.name_fa, c.label_fa, c.emoji
          FROM starter_template_items i JOIN equipment_templates t ON t.id = i.equipment_template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.starter_template_id = ${Number(c.req.param('id'))} ORDER BY c.sort_order`,
  );
  return c.json({ rows });
});

/* --------------------------------- wars --------------------------------- */

adminRoutes.get('/wars', requireAdmin('wars'), async (c) => {
  const db = c.get('db');
  const status = c.req.query('status') ?? 'all';
  const allowed = ['proposed', 'accepted', 'active', 'peace_requested', 'ended', 'cancelled', 'stopped_by_admin'];
  const filter = allowed.includes(status) ? 'WHERE w.status = ?' : '';
  const bindings: unknown[] = filter ? [status, 100] : [100];
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT w.*, a.name AS attacker_name, a.flag AS attacker_flag, d.name AS defender_name, d.flag AS defender_flag,
                 (SELECT COUNT(*) FROM battles b WHERE b.war_id = w.id) AS battle_count,
                 (SELECT MAX(round_no) FROM battles b2 WHERE b2.war_id = w.id) AS last_round
            FROM wars w JOIN nations a ON a.id = w.attacker_nation_id JOIN nations d ON d.id = w.defender_nation_id
           ${filter}
           ORDER BY w.id DESC LIMIT ?`,
    bindings,
  });
  return c.json({
    wars: rows.map((r) => ({
      ...mapWar({
        ...r,
        id: Number(r.id),
        attacker_nation_id: Number(r.attacker_nation_id),
        defender_nation_id: Number(r.defender_nation_id),
        attacker_power: Number(r.attacker_power),
        defender_power: Number(r.defender_power),
        attacker_win_chance: Number(r.attacker_win_chance),
        rounds_played: Number(r.rounds_played),
        max_rounds: Number(r.max_rounds),
        entry_cost: Number(r.entry_cost),
        indemnity_offered: Number(r.indemnity_offered),
        indemnity_paid: Number(r.indemnity_paid),
        seed: Number(r.seed),
        proposed_at: Number(r.proposed_at),
        winner_nation_id: r.winner_nation_id === null ? null : Number(r.winner_nation_id),
      } as never),
      battles: Number(r.battle_count),
      lastRound: r.last_round === null ? null : Number(r.last_round),
    })),
  });
});

adminRoutes.post('/wars/:id/stop', write('wars'), async (c) => {
  const body = parse(z.object({ reason: z.string().trim().min(3).max(200) }), await parseJson(c));
  return c.json(await adminStopWar(c.get('db'), Number(c.req.param('id')), 'stop', adminActorOf(c.get('user')), body.reason));
});

adminRoutes.post('/wars/:id/end', write('wars'), async (c) => {
  const body = parse(z.object({ reason: z.string().trim().min(3).max(200) }), await parseJson(c));
  return c.json(await adminStopWar(c.get('db'), Number(c.req.param('id')), 'end', adminActorOf(c.get('user')), body.reason));
});

adminRoutes.get('/wars/:id/report', requireAdmin('wars'), async (c) => {
  const rows = await c.get('db').all<Record<string, unknown>>(
    sql`SELECT b.*, br.attacker_json, br.defender_json, br.indemnity, br.attacker_win_chance
          FROM battles b LEFT JOIN battle_reports br ON br.battle_id = b.id
         WHERE b.war_id = ${Number(c.req.param('id'))} ORDER BY b.round_no`,
  );
  return c.json({ rounds: rows });
});

/* ------------------------------- diplomacy ------------------------------ */

adminRoutes.get('/diplomacy', requireAdmin('diplomacy'), async (c) => {
  const db = c.get('db');
  const relations = await db.all<Record<string, unknown>>(
    sql`SELECT r.*, a.name AS n1, b.name AS n2, a.flag AS f1, b.flag AS f2
          FROM diplomatic_relations r JOIN nations a ON a.id = r.nation_id JOIN nations b ON b.id = r.other_nation_id
         ORDER BY r.updated_at DESC LIMIT 200`,
  );
  const requests = await db.all<Record<string, unknown>>(
    sql`SELECT r.*, a.name AS from_name, b.name AS to_name FROM diplomatic_requests r
          JOIN nations a ON a.id = r.from_nation_id JOIN nations b ON b.id = r.to_nation_id
         WHERE r.status = 'pending' ORDER BY r.id DESC LIMIT 100`,
  );
  const alliances = await db.all<Record<string, unknown>>(
    sql`SELECT al.*, COUNT(m.nation_id) AS members, l.name AS leader FROM alliances al
          LEFT JOIN alliance_members m ON m.alliance_id = al.id
          LEFT JOIN nations l ON l.id = al.leader_nation_id
         GROUP BY al.id ORDER BY al.id DESC LIMIT 50`,
  );
  return c.json({ relations, requests, alliances });
});

adminRoutes.post('/diplomacy/alliance/:id/disband', write('diplomacy'), async (c) => {
  const db = c.get('db');
  const id = Number(c.req.param('id'));
  const at = nowSeconds();
  await db.batch([
    sql`UPDATE alliances SET status = 'disbanded', disbanded_at = ${at} WHERE id = ${id}`,
    sql`DELETE FROM alliance_members WHERE alliance_id = ${id}`,
    sql`UPDATE diplomatic_relations SET status = 'friend', alliance_id = NULL, updated_at = ${at} WHERE alliance_id = ${id}`,
  ]);
  await audit(db, { actor: adminActorOf(c.get('user')), action: 'diplomacy.disband_alliance', targetType: 'alliance', targetId: id });
  return c.json({ disbanded: true });
});

/* ------------------------------- statements ------------------------------ */

adminRoutes.get('/statements', requireAdmin('statements'), async (c) =>
  c.json(await adminListStatements(c.get('db'), { status: c.req.query('status') ?? 'all', search: c.req.query('q') ?? null, limit: Number(c.req.query('limit') ?? 0) || undefined, offset: Number(c.req.query('offset') ?? 0) || undefined })),
);

adminRoutes.post('/statements/:id/review', write('statements'), async (c) => {
  const body = parse(z.object({ decision: z.enum(['approve', 'reject', 'remove']), note: z.string().trim().max(200).optional() }), await parseJson(c));
  return c.json(await adminReviewStatement(c.get('db'), Number(c.req.param('id')), body.decision, body.note ?? null, adminActorOf(c.get('user'))));
});

adminRoutes.post('/announcements', write('statements'), async (c) => {
  const body = parse(z.object({ title: z.string().trim().min(3).max(120), body: z.string().trim().min(3).max(1200), targetNationId: z.coerce.number().int().positive().nullable().optional() }), await parseJson(c));
  return c.json(await adminBroadcast(c.get('db'), { title: body.title, body: body.body, targetNationId: body.targetNationId ?? null }, adminActorOf(c.get('user')), c.env.BOT_TOKEN));
});

/* -------------------------------- settings ------------------------------ */

/** which part of the loaded settings bundle holds the current value of a settings key */
const SETTINGS_BUNDLE_KEY: Record<string, keyof import('../../core/settings').SettingsBundle> = {
  [GAME_SETTING_KEYS.battle]: 'battle',
  [GAME_SETTING_KEYS.economy]: 'economy',
  [GAME_SETTING_KEYS.profile]: 'profile',
  [GAME_SETTING_KEYS.diplomacy]: 'diplomacy',
  [GAME_SETTING_KEYS.features]: 'features',
  [GAME_SETTING_KEYS.branding]: 'branding',
  [GAME_SETTING_KEYS.quota]: 'quota',
};

const SETTINGS_SCHEMAS: Record<string, z.ZodType<unknown>> = {
  [GAME_SETTING_KEYS.battle]: battleParamsSchema as z.ZodType<unknown>,
  [GAME_SETTING_KEYS.economy]: economyRulesSchema as unknown as z.ZodType<unknown>,
  [GAME_SETTING_KEYS.profile]: profileRulesSchema as z.ZodType<unknown>,
  [GAME_SETTING_KEYS.diplomacy]: diplomacyRulesSchema as z.ZodType<unknown>,
  [GAME_SETTING_KEYS.features]: featureFlagsSchema as unknown as z.ZodType<unknown>,
  [GAME_SETTING_KEYS.branding]: brandingSchema as z.ZodType<unknown>,
  [GAME_SETTING_KEYS.quota]: quotaGuardSchema as z.ZodType<unknown>,
};

adminRoutes.get('/settings', requireAdmin(), async (c) => {
  const db = c.get('db');
  const settings = await loadSettings(db, { force: true });
  return c.json({
    settings,
    sections: ADMIN_SECTIONS,
    freePlan: { note: 'مقادیر سهمیه در پنل «سهمیه» نمایش داده می‌شود.' },
  });
});

adminRoutes.post('/settings', write('settings'), async (c) => {
  const db = c.get('db');
  const body = (await parseJson(c)) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  const current = await loadSettings(db, { force: true });
  for (const [key, schema] of Object.entries(SETTINGS_SCHEMAS)) {
    if (!(key in body)) continue;
    const bundleKey = SETTINGS_BUNDLE_KEY[key];
    if (!bundleKey) throw ApiError.internal(`کلید تنظیمات ${key} شناخته‌شده نیست.`);
    // partial patches are merged with the stored section BEFORE validation, so an admin
    // form can send a single field while the schema still sees a complete object
    const merged = { ...((current[bundleKey] as object) ?? {}), ...((body[key] as object) ?? {}) };
    const res = schema.safeParse(merged);
    if (!res.success) throw ApiError.validation(`تنظیمات «${key}» نامعتبر است`, formatZodError(res.error).fields);
    patch[key] = res.data;
  }
  if (GAME_SETTING_KEYS.rankingWeights in body) {
    const w = parse(z.object({ rankingWeights: z.record(z.coerce.number().min(0).max(10)) }), { rankingWeights: body[GAME_SETTING_KEYS.rankingWeights] });
    patch[GAME_SETTING_KEYS.rankingWeights] = w.rankingWeights;
  }
  const keys = Object.keys(patch);
  if (keys.length === 0) throw ApiError.validation('هیچ تنظیمات معتبری ارسال نشد.');
  const updated = await setSettingsBulk(db, patch, c.get('user').userId);
  await audit(db, { actor: adminActorOf(c.get('user')), action: 'settings.update', after: { keys, patch } });
  if (keys.includes(GAME_SETTING_KEYS.rankingWeights) || keys.includes(GAME_SETTING_KEYS.battle)) await recomputeRankings(db, await loadSettings(db, { force: true }));
  return c.json({ updated });
});


/* --------------------------------- audit -------------------------------- */

adminRoutes.get('/audit', requireAdmin('audit'), async (c) => {
  const db = c.get('db');
  const limit = Math.min(200, Math.max(10, Number(c.req.query('limit') ?? 50)));
  const offset = Math.max(0, Number(c.req.query('offset') ?? 0));
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT a.*, u.username, u.telegram_user_id FROM audit_logs a LEFT JOIN users u ON u.id = a.actor_user_id
         ORDER BY a.id DESC LIMIT ${limit} OFFSET ${offset}`,
  );
  return c.json({ rows: rows.map((r) => ({ ...r, created_at_iso: toIso(Number(r.created_at)) })) });
});

/* --------------------------------- quota -------------------------------- */

adminRoutes.get('/quota', requireAdmin('quota'), async (c) => c.json(await snapshotQuota(c.get('db'), await loadSettings(c.get('db')))));

adminRoutes.post('/jobs/run', write('settings'), async (c) => {
  const body = parse(
    z.object({ jobs: z.array(z.enum(['wars', 'war_expiry', 'ranking', 'diplomacy_expiry', 'housekeeping'])).min(1).max(6) }),
    await parseJson(c),
  );
  const res = await triggerJobsManually(c.env, c.get('db'), body.jobs);
  await audit(c.get('db'), { actor: adminActorOf(c.get('user')), action: 'jobs.run', after: body });
  return c.json(res);
});

/* ------------------------------ backup / data --------------------------- */

adminRoutes.get('/backup/export', requireAdmin('backup'), async (c) => {
  const db = c.get('db');
  const tables = (c.req.query('tables') ?? '').split(',').filter(Boolean);
  const dump = await exportBackup(db, { tables: tables.length ? tables : null });
  await logBackupRun(db, 'backup.export', dump.meta.tables.length, adminActorOf(c.get('user')), 'manual export');
  return new Response(JSON.stringify(dump), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="world-war-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
});

adminRoutes.get('/backup/tables', requireAdmin('backup'), async (c) => c.json({ tables: [...BACKUP_TABLES] }));

adminRoutes.get('/backup/runs', requireAdmin('backup'), async (c) => c.json({ runs: await listBackupRuns(c.get('db')) }));

/**
 * Restore. Deliberately conservative: only allowed on an empty game world
 * (no nations) unless `force` is provided, and never deletes transactions of an
 * existing world. Row inserts are wrapped per table in a D1 batch.
 */
adminRoutes.post('/backup/restore', write('backup'), async (c) => {
  const db = c.get('db');
  const body = (await parseJson(c)) as { data?: Record<string, unknown[]>; force?: boolean };
  if (!body.data || typeof body.data !== 'object') throw ApiError.validation('ساختار فایل پشتیبان نامعتبر است.');
  const nations = await db.first<{ c: number }>(sql`SELECT COUNT(*) AS c FROM nations`);
  if (Number(nations?.c ?? 0) > 0 && !body.force) {
    throw ApiError.conflict('دیتابیس خالی نیست. برای بازنویسی force: true بفرستید (یا از wrangler d1 restore استفاده کنید).');
  }
  const allowed = new Set<string>(BACKUP_TABLES);
  const applied: Record<string, number> = {};
  for (const [table, rows] of Object.entries(body.data)) {
    if (!allowed.has(table) || !Array.isArray(rows)) continue;
    let count = 0;
    for (const row of rows.slice(0, 500)) {
      const obj = row as Record<string, unknown>;
      const keys = Object.keys(obj).filter((k) => /^[a-z_]+$/.test(k));
      if (keys.length === 0) continue;
      const stmt = {
        sql: `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
        bindings: keys.map((k) => (typeof obj[k] === 'boolean' ? Number(obj[k]) : (obj[k] as never))),
      };
      await db.run(stmt);
      count++;
    }
    applied[table] = count;
  }
  await audit(db, { actor: adminActorOf(c.get('user')), action: 'backup.restore', after: { tables: applied } });
  return c.json({ applied });
});

export function mountAdmin(app: Hono<HonoEnv>) {
  app.route('/api/admin', adminRoutes);
}

/** exported for the webhook/dev tools that build their own Db */
export function makeDb(env: { DB: D1Database }): Db {
  return new Db(env.DB);
}
