import { Hono } from 'hono';
import { z } from 'zod';
import { formatZodError, statementCreateSchema } from '@ww/shared';
import { ApiError } from '../../core/errors';
import { requireNation, requireUser, actorOf, settingsFor, parseJson } from '../middleware';
import { enforceRateLimit } from '../../core/rateLimit';
import { cancelStatement, createStatement, listMyStatements } from '../../services/statementService';
import { sql } from '../../core/sql';
import type { HonoEnv } from '../../types';

export const statementRoutes = new Hono<HonoEnv>();
statementRoutes.use(requireUser);
statementRoutes.use(requireNation);

function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}

statementRoutes.get('/', async (c) => {
  const db = c.get('db');
  return c.json({ statements: await listMyStatements(db, c.get('user').nationIds, Number(c.req.query('limit') ?? 30)) });
});

statementRoutes.post('/', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const body = parse(statementCreateSchema, await parseJson(c));
  await enforceRateLimit(db, `statement:${c.get('user').userId}`, 6, 3600, { durable: true });
  const res = await createStatement(db, c.get('nation'), { text: body.text, via: 'webapp' }, settings, actorOf(c.get('user')));
  return c.json(res);
});

/** preview endpoint: the UI shows this text before the player confirms */
statementRoutes.post('/preview', async (c) => {
  const body = parse(statementCreateSchema, await parseJson(c));
  const nation = c.get('nation');
  return c.json({
    preview: body.text.trim(),
    chars: body.text.trim().length,
    signature: `${nation.flag} ${nation.name} — ${nation.leader_name}`,
    needsApproval: (await settingsFor(c)).features.statementsRequireApproval,
  });
});

statementRoutes.delete('/:id', async (c) => {
  const res = await cancelStatement(c.get('db'), Number(c.req.param('id')), c.get('user').nationIds);
  return c.json(res);
});

/** public wall of published statements for one country (or your own list) */
statementRoutes.get('/published/:nationId', async (c) => {
  const db = c.get('db');
  const nationId = Number(c.req.param('nationId'));
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT s.id, s.text, s.created_at, s.published_at, s.leader_snapshot, n.name AS nation_name, n.flag
          FROM statements s JOIN nations n ON n.id = s.nation_id
         WHERE s.nation_id = ${nationId} AND s.status = 'published'
         ORDER BY s.id DESC LIMIT 30`,
  );
  return c.json({ rows });
});

export function mountStatements(app: Hono<HonoEnv>) {
  app.route('/api/statements', statementRoutes);
}
