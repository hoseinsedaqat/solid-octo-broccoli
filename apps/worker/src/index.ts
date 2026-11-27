import { app } from './app';
import { Db } from './core/db';
import { runScheduled } from './scheduled/cron';
import { flushQuota } from './services/quotaService';
import type { Env } from './types';

/**
 * Worker entry point.
 *  - fetch: Hono app (REST API + telegram webhook + static assets)
 *  - scheduled: cron triggers (revenue, war rounds, expiries, rankings)
 * No server, no persistent process, no in-memory state.
 */
const handler: ExportedHandler<Env> = {
  fetch: (request, env, ctx) => app.fetch(request, env, ctx),

  async scheduled(event, env, ctx) {
    const db = new Db(env.DB);
    ctx.waitUntil(
      (async () => {
        try {
          const result = await runScheduled(env, db, event.cron);
          const failed = result.jobs.filter((j) => !j.ok);
          console.log(
            JSON.stringify({
              type: 'cron',
              cron: event.cron,
              skipped: result.skipped ?? null,
              jobs: result.jobs.map((j) => `${j.job}:${j.processed}${j.ok ? '' : ':FAILED'}`),
              at: new Date().toISOString(),
            }),
          );
          if (failed.length) {
            console.error('[cron] failed jobs', JSON.stringify(failed));
          }
        } catch (err) {
          console.error('[cron] fatal', err instanceof Error ? err.message : String(err));
        } finally {
          await flushQuota(db).catch(() => undefined);
        }
      })(),
    );
  },
};

export default handler;
