import { Hono } from 'hono';
import { z } from 'zod';
import { formatZodError } from '@ww/shared';
import { ApiError } from '../../core/errors';
import { authenticateInitData, upsertTelegramUser, parseAdminIds, revokeSession } from '../../services/authService';
import { loadSessionUser } from '../../services/authService';
import { Db } from '../../core/db';
import { buildNationView, type NationRow } from '../../services/nationService';
import { loadSettings } from '../../core/settings';
import { sql } from '../../core/sql';
import { createContext, errorHandler, requireUser } from '../middleware';
import type { HonoEnv } from '../../types';

export const authRoutes = new Hono<HonoEnv>();

const sessionSchema = z.object({ initData: z.string().min(20, 'initData نامعتبر است') });

/** environments in which the dev-login shortcut is allowed; anything else (including unset) is treated as production */
export const DEV_LOGIN_ENVS = new Set(['development', 'test', 'local']);

/**
 * POST /api/auth/session
 * The ONLY way the frontend becomes authenticated: a signed Telegram initData
 * blob is verified server-side (HMAC with the bot token) and exchanged for a
 * session token. The client can never assert a telegram id of its own.
 */
authRoutes.post('/session', async (c) => {
  const db = new Db(c.env.DB);
  const body = await c.req.json().catch(() => null);
  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    const e = formatZodError(parsed.error);
    throw ApiError.validation(e.message, e.fields);
  }
  const { upsert, session } = await authenticateInitData(db, c.env, parsed.data.initData, {
    ip: c.req.header('cf-connecting-ip') ?? null,
    userAgent: c.req.header('user-agent') ?? null,
  });
  const user = await loadSessionUser(db, session.token);
  const nations = user ? await db.all<{ id: number }>(sql`SELECT id FROM nations WHERE owner_user_id = ${user.userId} AND status <> 'dissolved' ORDER BY id`) : [];
  let view = null;
  if (user?.activeNationId) {
    const settings = await loadSettings(db);
    const nation = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${user.activeNationId}`);
    if (nation) view = await buildNationView(db, nation, settings, { includeStarter: true });
  }
  return c.json({
    token: session.token,
    expiresAt: new Date(session.expiresAt * 1000).toISOString(),
    user: {
      userId: upsert.userId,
      role: upsert.role,
      isAdmin: upsert.role === 'admin' || upsert.role === 'super_admin',
      isPrimaryAdmin: Boolean(user?.isPrimaryAdmin),
    },
    nations: nations.map((n) => n.id),
    view,
  });
});

authRoutes.use('/me', requireUser);
authRoutes.use('/logout', requireUser);

authRoutes.get('/me', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const settings = await loadSettings(db);
  const nationId = user.activeNationId;
  const nationRow = nationId ? await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${nationId}`) : null;
  const view = nationRow ? await buildNationView(db, nationRow, settings) : null;
  return c.json({
    userId: user.userId,
    telegramId: user.telegramId,
    username: user.username,
    role: user.role,
    status: user.status,
    permissions: user.permissions,
    nationIds: user.nationIds,
    activeNationId: user.activeNationId,
    isAdmin: user.role === 'admin' || user.role === 'super_admin',
    isPrimaryAdmin: user.isPrimaryAdmin,
    features: settings.features,
    branding: { gameName: settings.branding.gameName, welcomeTitle: settings.branding.welcomeTitle },
    view,
  });
});

authRoutes.post('/logout', async (c) => {
  const user = c.get('user');
  await revokeSession(c.get('db'), user.userId, user.sessionId);
  return c.json({ ok: true });
});

/** dev-only helper so the Mini App can be tested outside Telegram (disabled in prod) */
authRoutes.post('/dev-login', async (c) => {
  // locked unless the deployment explicitly opts into a development environment
  if (!DEV_LOGIN_ENVS.has(c.env.APP_ENV ?? 'production')) {
    throw ApiError.forbidden('این مسیر فقط در حالت توسعه فعال است (APP_ENV=development|test|local).');
  }
  const db = new Db(c.env.DB);
  const body = await c.req.json().catch(() => ({}));
  const telegramId = Number((body as { telegramId?: number }).telegramId ?? 1);
  if (!Number.isInteger(telegramId) || telegramId <= 0) throw ApiError.validation('telegramId نامعتبر است.');
  const upsert = await upsertTelegramUser(db, { telegramId, username: `dev_${telegramId}`, firstName: 'Dev', lastName: null, languageCode: 'fa' }, c.env);
  const { createSession } = await import('../../services/authService');
  const session = await createSession(db, upsert, { ip: '127.0.0.1', userAgent: 'dev' });
  return c.json({ token: session.token, userId: upsert.userId, role: upsert.role });
});

export function mountAuth(app: Hono<HonoEnv>) {
  app.route('/api/auth', authRoutes);
}
