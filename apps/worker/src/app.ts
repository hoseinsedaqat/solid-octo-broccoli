import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ROUTES } from '@ww/shared';
import { ApiError } from './core/errors';
import { Db } from './core/db';
import { sql } from './core/sql';
import { checkWebhookSecret } from './core/telegram-auth';
import { loadSettings } from './core/settings';
import { record } from './services/quotaService';
import { createContext, errorHandler } from './api/middleware';
import { mountAuth } from './api/routes/auth';
import { mountPlayer } from './api/routes/player';
import { mountShop } from './api/routes/shop';
import { mountDiplomacy } from './api/routes/diplomacy';
import { mountStatements } from './api/routes/statements';
import { mountSocial } from './api/routes/social';
import { mountAdmin } from './api/routes/admin';
import { createBotCtx, handleUpdate, helpText } from './bot/handlers';
import type { HonoEnv, Env } from './types';

export function createApp(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.use('*', errorHandler);
  app.use('*', createContext);
  app.use(
    '/api/*',
    cors({
      // the Mini App is always served from the same origin (Workers Static Assets);
      // CORS is only opened for local development (vite on :5173)
      origin: (origin) => (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') ? origin : null),
      allowHeaders: ['content-type', 'authorization'],
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      maxAge: 600,
    }),
  );

  app.get('/api/health', async (c) => {
    const db = new Db(c.env.DB);
    const row = await db.first<{ nations: number; users: number }>(
      sql`SELECT (SELECT COUNT(*) FROM nations) AS nations, (SELECT COUNT(*) FROM users) AS users`,
    );
    return c.json({
      ok: true,
      service: 'world-war',
      time: new Date().toISOString(),
      env: c.env.APP_ENV ?? 'production',
      counters: { nations: Number(row?.nations ?? 0), users: Number(row?.users ?? 0) },
      telegramBotConfigured: Boolean(c.env.BOT_TOKEN),
      webhookSecretConfigured: Boolean(c.env.TELEGRAM_WEBHOOK_SECRET),
    });
  });

  /** public bootstrap info for the Mini App (no secrets, no prices) */
  app.get('/api/config', async (c) => {
    const settings = await loadSettings(new Db(c.env.DB));
    return c.json({
      gameName: settings.branding.gameName,
      welcomeTitle: settings.branding.welcomeTitle,
      features: settings.features,
      cycleSeconds: settings.economy.incomeCycleSeconds,
      webAppPath: ROUTES.playerRoot,
      adminPath: ROUTES.adminRoot,
    });
  });

  /* ------------------------------ telegram webhook ----------------------------- */

  app.post(ROUTES.webhook, async (c) => {
    if (!checkWebhookSecret(c.req.header('x-telegram-bot-api-secret-token'), c.env.TELEGRAM_WEBHOOK_SECRET)) {
      return c.json({ error: { code: 'unauthorized', message: 'invalid secret token' } }, 401);
    }
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body !== 'object') return c.json({ ok: true, skipped: 'empty' });

    const db = new Db(c.env.DB);
    const settings = await loadSettings(db);
    const ctx = { ...createBotCtx(c.env, db), settings, webAppUrl: appUrl(c.env) + ROUTES.playerRoot };
    record({ botUpdates: 1 });

    // answer fast: everything slow goes through waitUntil
    c.executionCtx.waitUntil(
      (async () => {
        try {
          await handleUpdate(ctx, body as never);
        } catch (err) {
          console.error('[webhook]', err instanceof Error ? err.message : err);
          record({ errors: 1 });
        }
      })(),
    );
    return c.json({ ok: true });
  });

  /** alias so the webhook can be configured with either path */
  app.post('/bot/webhook', async (c) => {
    const url = new URL(c.req.url);
    return c.redirect(`${url.origin}${ROUTES.webhook}`, 307);
  });

  /** long-polling fallback: only works when no webhook is set (dev / blocked webhook delivery) */
  app.post('/api/telegram/poll', async (c) => {
    if (!c.env.BOT_TOKEN) throw ApiError.internal('BOT_TOKEN تنظیم نشده است.');
    const secret = c.req.header('x-admin-secret');
    if (!c.env.APP_SECRET || secret !== c.env.APP_SECRET) throw ApiError.forbidden('x-admin-secret الزامی است.');
    const db = new Db(c.env.DB);
    const settings = await loadSettings(db);
    const { TelegramApi } = await import('./bot/telegram');
    const api = new TelegramApi(c.env.BOT_TOKEN, c.env.TELEGRAM_API_BASE);
    const offset = Number(c.req.query('offset') ?? 0);
    const updates = await api.getUpdates(offset, 25);
    const ctx = { ...createBotCtx(c.env, db), settings, webAppUrl: appUrl(c.env) + ROUTES.playerRoot };
    let last = offset;
    for (const u of updates) {
      await handleUpdate(ctx, u as never);
      last = Math.max(last, u.update_id + 1);
    }
    return c.json({ received: updates.length, offset: last, help: helpText() });
  });

  mountAuth(app);
  mountPlayer(app);
  mountShop(app);
  mountDiplomacy(app);
  mountStatements(app);
  mountSocial(app);
  mountAdmin(app);

  app.get('/api', (c) => c.json({ name: 'World War API', version: 1, docs: '/api/health' }));

  /**
   * Anything that is not /api/* or /bot/* is a Mini App route.
   * wrangler.jsonc sets assets.run_worker_first = true (a boolean is the only form accepted by every
   * wrangler version), so the Worker itself must hand the request to the static-asset binding.
   */
  app.notFound(async (c) => {
    const url = new URL(c.req.url);
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/bot')) {
      return c.json({ error: { code: 'not_found', message: 'مسیر API یافت نشد.' } }, 404);
    }
    if (!c.env.ASSETS) return c.text('World War — این آدرس فقط API سرو می‌کند؛ مینی‌اپ از Static Assets خوانده می‌شود.', 404);
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    if (asset.status !== 404) return asset;
    // SPA fallback (index.html for client-side routes) in case not_found_handling is not honoured
    return c.env.ASSETS.fetch(new Request(new URL('/index.html', url).toString(), c.req.raw));
  });

  app.onError((err, c) => {
    const api = err instanceof ApiError ? err : ApiError.internal('خطای داخلی سرور.', err instanceof Error ? err.message : String(err));
    if (!(err instanceof ApiError)) console.error('[onError]', err);
    return c.json({ error: { code: api.code, message: api.message, ...(api.details === undefined ? {} : { details: api.details }) } }, api.status as 400);
  });

  return app;
}

function appUrl(env: Env): string {
  return (env.WEBAPP_URL || env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
}

export const app = createApp();
export default app;
