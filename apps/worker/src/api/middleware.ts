import { createMiddleware } from 'hono/factory';
import type { Context, Next } from 'hono';
import type { AdminSection } from '@ww/shared';
import { Db } from '../core/db';
import { ApiError, toApiError } from '../core/errors';
import { nowSeconds } from '../core/format';
import { configureTelegramApiBase } from '../bot/telegram';
import { randomToken } from '../core/ids';
import { loadSettings } from '../core/settings';
import { loadSessionUser } from '../services/authService';
import { loadNationOwnedBy, type NationRow } from '../db/queries';
import { flushQuota, record } from '../services/quotaService';
import type { HonoEnv, SessionUser } from '../types';

export const createContext = createMiddleware<HonoEnv>(async (c, next) => {
  configureTelegramApiBase(c.env.TELEGRAM_API_BASE);
  const db = new Db(c.env.DB);
  c.set('db', db);
  const requestId = randomToken(8);
  const started = Date.now();
  try {
    await next();
  } finally {
    const metrics = db.metrics;
    record({
      apiRequests: 1,
      dbReads: metrics.reads,
      dbWrites: metrics.writes,
      rowsRead: metrics.rowsRead,
      rowsWritten: metrics.rowsWritten,
      errors: c.res.status >= 500 ? 1 : 0,
    });
    await flushQuota(db).catch(() => undefined);
    if (c.env.APP_ENV === 'development') {
      console.log(JSON.stringify({ requestId, path: new URL(c.req.url).pathname, status: c.res.status, ms: Date.now() - started, queries: metrics.queries }));
    }
  }
});

export const errorHandler = createMiddleware<HonoEnv>(async (c, next) => {
  try {
    await next();
  } catch (err) {
    const api = toApiError(err);
    if (api.status >= 500) console.error(`[error:${api.code}]`, api.message);
    return c.json(
      {
        error: {
          code: api.code,
          message: api.message,
          ...(api.details === undefined ? {} : { details: api.details }),
          requestId: nowSeconds().toString(36),
        },
      },
      api.status as 400,
    );
  }
});

export async function settingsFor(c: Context<HonoEnv>) {
  const cached = c.get('settings');
  if (cached) return cached;
  const settings = await loadSettings(c.get('db'));
  c.set('settings', settings);
  return settings;
}

function bearer(c: Context<HonoEnv>): string | null {
  const header = c.req.header('authorization') ?? c.req.header('Authorization');
  if (header?.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  const q = c.req.query('token');
  return q && q.length >= 16 ? q : null;
}

export const requireUser = createMiddleware<HonoEnv>(async (c, next) => {
  const token = bearer(c);
  if (!token) throw ApiError.unauthorized();
  const user = await loadSessionUser(c.get('db'), token);
  if (!user) throw ApiError.unauthorized('نشست منقضی یا نامعتبر است؛ Mini App را دوباره باز کنید.');
  if (user.status !== 'active') throw ApiError.forbidden(user.status === 'blocked' ? 'حساب شما مسدود شده است.' : 'حساب شما غیرفعال است.');
  c.set('user', user);
  await next();
});

/** every player endpoint resolves the nation ON THE SERVER (never from the client) */
export const requireNation = createMiddleware<HonoEnv>(async (c, next) => {
  const user = c.get('user');
  const nation = await loadNationOwnedBy(c.get('db'), user.userId, user.activeNationId);
  if (!nation) throw new ApiError('not_found', 'شما هنوز کشوری نساخته‌اید. از ربات تلگرام /start را ارسال کنید.', 404);
  if (nation.status === 'banned') throw ApiError.forbidden('کشور شما مسدود شده است. با مدیر بازی تماس بگیرید.');
  if (nation.status === 'frozen') throw ApiError.forbidden('کشور شما به صورت موقت منجمد شده است.');
  c.set('nationId', nation.id);
  c.set('nation', nation as NationRow);
  await next();
});

export function requireAdmin(section?: AdminSection, write = false) {
  return createMiddleware<HonoEnv>(async (c: Context<HonoEnv>, next: Next) => {
    const user: SessionUser = c.get('user');
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      throw ApiError.forbidden('این بخش فقط برای مدیران بازی است.');
    }
    if (section && user.role !== 'super_admin') {
      const grant = user.permissions[section];
      if (!grant?.read) throw ApiError.forbidden(`مجوز مشاهده بخش «${section}» را ندارید.`);
      if (write && !grant.write) throw ApiError.forbidden(`مجوز ویرایش بخش «${section}» را ندارید.`);
    }
    await next();
  });
}

export function actorOf(user: SessionUser) {
  return { userId: user.userId, telegramId: user.telegramId };
}

export function adminActorOf(user: SessionUser) {
  return { userId: user.userId, telegramId: user.telegramId, role: user.role };
}

export async function parseJson<T extends object>(c: Context<HonoEnv>): Promise<T> {
  try {
    return (await c.req.json()) as T;
  } catch {
    throw ApiError.validation('بدنه درخواست باید JSON معتبر باشد.');
  }
}
