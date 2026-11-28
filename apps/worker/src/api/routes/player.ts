import { Hono } from 'hono';
import { z } from 'zod';
import { formatZodError, nationUpdateSchema } from '@ww/shared';
import { ApiError } from '../../core/errors';
import { sql } from '../../core/sql';
import { nowSeconds, toIso } from '../../core/format';
import { requireNation, requireUser, actorOf, settingsFor, parseJson } from '../middleware';
import { buildDefenseView, buildNationView, updateNationProfile, type NationRow } from '../../services/nationService';
import { inventoryView } from '../../services/shopService';
import { listTransactions, treasuryHistory } from '../../services/financeService';
import { listNotifications, markRead, unreadCount } from '../../services/notificationService';
import { DEFENSE_ARRANGEMENT_KEYS, DEFENSE_ARRANGEMENT } from '@ww/shared';
import { claimDailyPrize, prizeState, publicPrizes } from '../../services/dailyPrizeService';
import type { HonoEnv } from '../../types';

export const playerRoutes = new Hono<HonoEnv>();

playerRoutes.use(requireUser);
playerRoutes.use(requireNation);

function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}

playerRoutes.get('/nation', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const view = await buildNationView(db, c.get('nation'), settings, { includeStarter: true });
  const unread = await unreadCount(db, c.get('user').nationIds);
  return c.json({ ...view, unreadNotifications: unread });
});

playerRoutes.patch('/nation', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(nationUpdateSchema, await parseJson(c));
  const nation = c.get('nation');
  const changed = await updateNationProfile(db, nation, body, settings, actorOf(c.get('user')));
  const fresh = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${nation.id}`);
  const view = fresh ? await buildNationView(db, fresh, settings) : null;
  return c.json({ changed, view });
});

playerRoutes.get('/economy', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const view = await buildNationView(db, c.get('nation'), settings);
  const days = Math.min(180, Math.max(7, Number(c.req.query('days') ?? 30)));
  const history = await treasuryHistory(db, c.get('nation').id, days);
  return c.json({ economy: view.economy, history });
});

playerRoutes.get('/transactions', async (c) => {
  const db = c.get('db');
  const limit = Math.min(50, Math.max(5, Number(c.req.query('limit') ?? 20)));
  const offset = Math.max(0, Number(c.req.query('offset') ?? 0));
  const res = await listTransactions(db, c.get('nation').id, { limit, offset, type: c.req.query('type') ?? null });
  return c.json(res);
});

playerRoutes.get('/inventory', async (c) => inventoryHandler(c));
playerRoutes.get('/military', async (c) => inventoryHandler(c));
async function inventoryHandler(c: any) {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const groups = await inventoryView(db, c.get('nation').id, settings);
  const search = (c.req.query('q') ?? '').trim().toLowerCase();
  const category = c.req.query('category') ?? null;
  let out = groups;
  if (category && category !== 'all') out = out.filter((g) => g.categoryKey === category);
  if (search) {
    out = out
      .map((g) => ({ ...g, items: g.items.filter((i) => i.nameFa.toLowerCase().includes(search) || String(i.code).toLowerCase().includes(search)) }))
      .filter((g) => g.items.length > 0);
  }
  return c.json({ groups: out, totalCategories: groups.length });
}

playerRoutes.get('/defense', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  return c.json(await buildDefenseView(db, c.get('nation'), settings));
});

/** آرایش دفاعی کشور: NULL => everybody defends; array => committed subset */
playerRoutes.get('/defense-plan', async (c) => {
  const db = c.get('db');
  const ns = await db.first<{ defense_plan: string | null }>(
    sql`SELECT defense_plan FROM nation_settings WHERE nation_id = ${c.get('nation').id}`,
  );
  let plan: string[] | null = null;
  try {
    const parsed = ns?.defense_plan ? (JSON.parse(ns.defense_plan) as unknown) : null;
    plan = Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : null;
  } catch {
    plan = null;
  }
  return c.json({ plan, tiles: DEFENSE_ARRANGEMENT });
});

playerRoutes.put('/defense-plan', async (c) => {
  const db = c.get('db');
  const body = parse(z.object({ categories: z.array(z.string()).max(DEFENSE_ARRANGEMENT.length).nullable() }), await parseJson(c));
  let value: string | null = null;
  if (body.categories !== null) {
    const unique = [...new Set(body.categories)];
    const invalid = unique.filter((k) => !DEFENSE_ARRANGEMENT_KEYS.includes(k));
    if (invalid.length) throw ApiError.validation(`دسته نامعتبر: ${invalid.join('، ')}`);
    value = JSON.stringify(unique);
  }
  await db.run(
    sql`INSERT INTO nation_settings (nation_id, defense_plan, updated_at) VALUES (${c.get('nation').id}, ${value}, ${nowSeconds()})
        ON CONFLICT (nation_id) DO UPDATE SET defense_plan = excluded.defense_plan, updated_at = excluded.updated_at`,
  );
  return c.json({ plan: value === null ? null : JSON.parse(value) });
});

/** جایزه شانسی روزانه — state (shown list + today's status) */
playerRoutes.get('/daily-prize', async (c) => {
  const db = c.get('db');
  const state = await prizeState(db, c.get('nation').id);
  return c.json({ ...state, prizes: publicPrizes() });
});

/** دریافت جایزه شانسی — idempotent per UTC day, atomic with the grant */
playerRoutes.post('/daily-prize/claim', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const result = await claimDailyPrize(db, c.get('nation'), settings, { botToken: c.env.BOT_TOKEN });
  return c.json(result);
});

playerRoutes.get('/notifications', async (c) => {
  const db = c.get('db');
  const rows = await listNotifications(db, c.get('nation').id, Number(c.req.query('limit') ?? 30));
  return c.json({
    rows: rows.map((r) => ({
      id: Number(r.id),
      kind: String(r.kind),
      title: String(r.title),
      body: String(r.body),
      isRead: Number(r.is_read) === 1,
      createdAt: toIso(Number(r.created_at)),
    })),
  });
});

playerRoutes.post('/notifications/read', async (c) => {
  const db = c.get('db');
  const body = await c.req.json().catch(() => ({}));
  const id = Number((body as { id?: number }).id ?? 0) || undefined;
  await markRead(db, c.get('user').nationIds, id);
  return c.json({ ok: true });
});

playerRoutes.post('/settings/notifications', async (c) => {
  const db = c.get('db');
  const body = parse(z.object({ enabled: z.coerce.boolean() }), await parseJson(c));
  await db.run(
    sql`UPDATE nation_settings SET notify_enabled = ${body.enabled ? 1 : 0}, updated_at = ${nowSeconds()} WHERE nation_id = ${c.get('nation').id}`,
  );
  return c.json({ enabled: body.enabled });
});

/** one nation of the player becomes the active one for the whole session UI */
playerRoutes.post('/settings/active-nation', async (c) => {
  const user = c.get('user');
  const body = parse(z.object({ nationId: z.coerce.number().int().positive() }), await parseJson(c));
  const { setActiveNation } = await import('../../services/authService');
  return c.json(await setActiveNation(c.get('db'), user.userId, user.sessionId, body.nationId, user.nationIds));
});

export function mountPlayer(app: Hono<HonoEnv>) {
  app.route('/api/player', playerRoutes);
}
