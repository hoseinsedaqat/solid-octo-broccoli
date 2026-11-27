import { Hono } from 'hono';
import { z } from 'zod';
import { formatZodError, purchaseSchema } from '@ww/shared';
import { ApiError } from '../../core/errors';
import { sql } from '../../core/sql';
import { requireNation, requireUser, actorOf, settingsFor, parseJson } from '../middleware';
import { enforceRateLimit } from '../../core/rateLimit';
import { listCategories, listCategoryItems, purchase } from '../../services/shopService';
import { loadNationsPublic } from './helpers';
import type { HonoEnv } from '../../types';

export const shopRoutes = new Hono<HonoEnv>();
shopRoutes.use(requireUser);

function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}

/** 18 categories for the shop grid (two columns in the UI) */
shopRoutes.get('/categories', async (c) => {
  const cats = await listCategories(c.get('db'));
  return c.json({ categories: cats, enabled: (await settingsFor(c)).features.shopEnabled });
});

shopRoutes.get('/category/:key', requireNation, async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const offset = Math.max(0, Number(c.req.query('offset') ?? 0));
  const res = await listCategoryItems(db, c.get('nation'), c.req.param('key'), settings);
  return c.json({ ...res, offset, pageSize: 12, treasury: c.get('nation').treasury });
});

/** the public country directory (used by war + diplomacy pickers) */
shopRoutes.get('/nations', async (c) => {
  const db = c.get('db');
  return c.json({ nations: await loadNationsPublic(db, { search: c.req.query('q') ?? null, limit: c.req.query('limit'), offset: c.req.query('offset') }) });
});

/**
 * Buy equipment. The request only carries (templateId, quantity, idempotencyKey):
 * price, balance and inventory deltas are computed and enforced in the backend.
 */
shopRoutes.post('/purchase', requireNation, async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const nation = c.get('nation');
  const body = parse(purchaseSchema, await parseJson(c));
  const user = c.get('user');

  await enforceRateLimit(db, `buy:${user.userId}`, 30, 60, { durable: true });

  const result = await purchase(
    db,
    nation,
    { templateId: body.templateId, quantity: body.quantity, idempotencyKey: body.idempotencyKey },
    settings,
    actorOf(user),
    c.env.BOT_TOKEN,
  );
  const fresh = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  return c.json({
    ...result,
    treasuryAfter: Number(fresh?.treasury ?? result.treasuryAfter),
    message: result.duplicate
      ? 'این خرید قبلاً ثبت شده بود؛ مبلغ دوباره کسر نشد.'
      : `${result.quantity.toLocaleString('en-US')} عدد ${result.nameFa} به انبار اضافه شد.`,
  });
});

export const warRoutes = new Hono<HonoEnv>();
warRoutes.use(requireUser);
warRoutes.use(requireNation);

warRoutes.get('/wars', async (c) => {
  const db = c.get('db');
  const { getWarsForNation } = await import('../../services/warService');
  return c.json({ wars: await getWarsForNation(db, c.get('nation').id) });
});

warRoutes.get('/wars/:id', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const { getWarDetail } = await import('../../services/warService');
  return c.json(await getWarDetail(db, Number(c.req.param('id')), user.nationIds, user.role === 'admin' || user.role === 'super_admin'));
});

warRoutes.post('/propose', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(
    z.object({ targetNationId: z.coerce.number().int().positive(), indemnityOffered: z.coerce.number().int().min(0).max(1_000_000_000).optional().default(0) }),
    await parseJson(c),
  );
  await enforceRateLimit(db, `war:${c.get('user').userId}`, 10, 3600, { durable: true });
  const { proposeWar } = await import('../../services/warService');
  const res = await proposeWar(db, c.get('nation'), body.targetNationId, body.indemnityOffered ?? 0, settings, actorOf(c.get('user')), c.env.BOT_TOKEN);
  return c.json(res);
});

function warIdOf(raw: string): number {
  return parse(z.coerce.number().int().positive(), raw);
}

warRoutes.post('/:id/respond', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(z.object({ accept: z.coerce.boolean() }), await parseJson(c));
  const { respondToWar } = await import('../../services/warService');
  return c.json(await respondToWar(db, warIdOf(c.req.param('id')), body.accept, c.get('nation'), settings, c.env.BOT_TOKEN));
});

warRoutes.post('/:id/round', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const { resolveRound, getWarDetail } = await import('../../services/warService');
  const id = warIdOf(c.req.param('id'));
  const res = await resolveRound(db, id, settings);
  const detail = await getWarDetail(db, id, [c.get('nation').id], false);
  return c.json({ ...res, war: detail.war, report: detail.reports[0] ?? null });
});

warRoutes.post('/:id/peace', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const { requestPeace } = await import('../../services/warService');
  return c.json(await requestPeace(db, warIdOf(c.req.param('id')), c.get('nation'), settings, c.env.BOT_TOKEN));
});

warRoutes.post('/peace/:id/respond', async (c) => {
  const db = c.get('db');
  const body = parse(z.object({ accept: z.coerce.boolean() }), await parseJson(c));
  const { respondPeace } = await import('../../services/warService');
  return c.json(await respondPeace(db, warIdOf(c.req.param('id')), body.accept, c.get('nation'), c.env.BOT_TOKEN));
});

/** pre-strike calculation, shown before the player confirms (never trust the UI) */
warRoutes.post('/preview', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(z.object({ targetNationId: z.coerce.number().int().positive() }), await parseJson(c));
  const { previewForWarTarget } = await import('../../bot/botActions');
  return c.json(await previewForWarTarget(db, c.get('nation'), body.targetNationId, settings));
});

export function mountShop(app: Hono<HonoEnv>) {
  app.route('/api/shop', shopRoutes);
  app.route('/api/war', warRoutes);
}
