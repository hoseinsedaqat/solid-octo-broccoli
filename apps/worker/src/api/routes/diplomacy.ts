import { Hono } from 'hono';
import { z } from 'zod';
import { formatZodError, diplomacyRequestSchema } from '@ww/shared';
import { ApiError } from '../../core/errors';
import { requireNation, requireUser, actorOf, settingsFor, parseJson } from '../middleware';
import { enforceRateLimit } from '../../core/rateLimit';
import {
  cancelRequest,
  createAlliance,
  decideRequest,
  dissolveRelation,
  leaveAlliance,
  listIncoming,
  listOutgoing,
  listRelations,
  myAlliance,
  sendRequest,
} from '../../services/diplomacyService';
import { sql } from '../../core/sql';
import type { HonoEnv } from '../../types';

export const diplomacyRoutes = new Hono<HonoEnv>();
diplomacyRoutes.use(requireUser);
diplomacyRoutes.use(requireNation);

function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}

diplomacyRoutes.get('/relations', async (c) => c.json({ relations: await listRelations(c.get('db'), c.get('nation').id) }));

diplomacyRoutes.get('/requests', async (c) => {
  const db = c.get('db');
  const status = c.req.query('status') ?? 'pending';
  const nationId = c.get('nation').id;
  return c.json({
    incoming: await listIncoming(db, nationId, status),
    outgoing: await listOutgoing(db, nationId, status),
  });
});

diplomacyRoutes.post('/request', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(diplomacyRequestSchema, await parseJson(c));
  await enforceRateLimit(db, `dip:${c.get('user').userId}`, 30, 3600, { durable: true });
  if (body.kind === 'war') throw ApiError.validation('برای اعلام جنگ از بخش جنگ استفاده کنید.');
  const res = await sendRequest(
    db,
    c.get('nation'),
    { toNationId: body.toNationId, kind: body.kind as never, message: body.message ?? null, allianceName: body.allianceName ?? null },
    settings,
    c.env.BOT_TOKEN,
  );
  return c.json(res);
});

/** path ids must be integers — otherwise the NaN would reach a D1 binding and 500 instead of 400 */
function pathId(raw: string): number {
  return parse(z.coerce.number().int().positive(), raw);
}

diplomacyRoutes.post('/request/:id/decide', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  // the request id comes from the path; the body carries only the decision
  // (requestId is accepted for clients that also send it, and must agree with the path)
  const body = parse(z.object({ requestId: z.coerce.number().int().positive().optional(), accept: z.coerce.boolean() }), await parseJson(c));
  const requestId = pathId(c.req.param('id'));
  if (body.requestId && body.requestId !== requestId) throw ApiError.validation('شناسه درخواست در آدرس و بدنه یکی نیست.');
  const res = await decideRequest(db, requestId, c.get('nation'), body.accept, settings, actorOf(c.get('user')), c.env.BOT_TOKEN);
  return c.json(res);
});

diplomacyRoutes.post('/request/:id/cancel', async (c) => {
  return c.json(await cancelRequest(c.get('db'), pathId(c.req.param('id')), c.get('nation')));
});

diplomacyRoutes.post('/dissolve', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(z.object({ otherNationId: z.coerce.number().int().positive() }), await parseJson(c));
  return c.json(await dissolveRelation(db, c.get('nation'), body.otherNationId, settings, c.env.BOT_TOKEN));
});

diplomacyRoutes.get('/alliance', async (c) => c.json({ alliance: await myAlliance(c.get('db'), c.get('nation').id) }));

diplomacyRoutes.post('/alliance', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(z.object({ name: z.string().trim().min(3).max(40) }), await parseJson(c));
  return c.json(await createAlliance(db, c.get('nation'), body.name, settings));
});

diplomacyRoutes.post('/alliance/leave', async (c) => {
  const db = c.get('db');
  const mine = await db.first<{ alliance_id: number }>(
    sql`SELECT alliance_id FROM alliance_members WHERE nation_id = ${c.get('nation').id} LIMIT 1`,
  );
  if (!mine) throw ApiError.notFound('شما عضو هیچ اتحادی نیستید.');
  return c.json(await leaveAlliance(db, c.get('nation'), Number(mine.alliance_id)));
});

export function mountDiplomacy(app: Hono<HonoEnv>) {
  app.route('/api/diplomacy', diplomacyRoutes);
}
