import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { nowSeconds } from '../core/format';
import { loadSettings, type SettingsBundle } from '../core/settings';
import { recomputeRankings } from '../db/queries';
import { expireProposal, finalizeWar, listDueWars, listExpiredProposals, listOverdueWars, resolveRound } from '../services/warService';
import { expireRequests } from '../services/diplomacyService';
import { purgeExpiredSessions } from '../services/authService';
import { isCronPaused, markJob, record, snapshotQuota, flushQuota } from '../services/quotaService';
import type { Env } from '../types';

export interface JobResult {
  job: string;
  processed: number;
  ok: boolean;
  detail?: string;
}

/** what a job reports back: how much it did and (for paged jobs) where to resume */
export interface JobOutput {
  processed: number;
  detail?: string;
  /** next cursor for job_checkpoints; omitted means "keep the previous one" */
  cursor?: number;
}

export interface CronResult {
  startedAt: number;
  finishedAt: number;
  skipped?: string;
  jobs: JobResult[];
}

/**
 * Cron Triggers entry point.
 *
 * Design notes (Workers free plan):
 *  - stateless: everything is derived from D1 columns (anchor + cycle index), so
 *    a missed run is caught up later and a duplicated run pays nothing twice;
 *  - resumable: each job keeps a cursor in job_checkpoints and processes a bounded
 *    page per run, so 1000s of nations never blow the CPU budget;
 *  - the job list is ordered by importance; when the soft quota guard triggers,
 *    only the non-essential jobs are skipped.
 */
export async function runScheduled(env: Env, db: Db, eventCron?: string, now = nowSeconds()): Promise<CronResult> {
  const startedAt = now;
  const jobs: JobResult[] = [];
  const push = (j: JobResult) => jobs.push(j);
  const run = async (job: string, fn: () => Promise<JobOutput>): Promise<void> => {
    try {
      const r = await fn();
      push({ job, ok: true, processed: r.processed, detail: r.detail });
      await markJob(db, job, { ...(r.cursor === undefined ? {} : { cursor: r.cursor }), rowsProcessed: r.processed, success: true });
      record({ cronRuns: 1 });
    } catch (err) {
      const message = err instanceof Error ? err.message.slice(0, 200) : String(err);
      push({ job, processed: 0, ok: false, detail: message });
      await markJob(db, job, { error: message });
      record({ cronRuns: 1, errors: 1 });
    }
  };

  if (env.CRON_DISABLED === '1') {
    return { startedAt, finishedAt: nowSeconds(), skipped: 'CRON_DISABLED', jobs };
  }

  const settings = await loadSettings(db, { force: true });
  const paused = await isCronPaused(db, settings);

  // income is claim-based («دریافت درآمد» in بانک مرکزی) — no auto-credit cron
  await run('wars', () => warJob(db, settings, now));
  await run('war_expiry', () => warExpiryJob(db, settings, now));
  if (paused) {
    push({ job: 'ranking', processed: 0, ok: true, detail: 'skipped:quota-guard' });
    push({ job: 'diplomacy_expiry', processed: 0, ok: true, detail: 'skipped:quota-guard' });
    push({ job: 'housekeeping', processed: 0, ok: true, detail: 'skipped:quota-guard' });
  } else {
    await run('diplomacy_expiry', () => diplomacyExpiryJob(db, now));
    await run('ranking', () => rankingJob(db, settings, now));
    await run('housekeeping', () => housekeepingJob(db, now));
  }

  await snapshotQuota(db, settings);
  await flushQuota(db);
  return { startedAt, finishedAt: nowSeconds(), jobs, ...({ cron: eventCron ?? null } as object) };
}

/** executes every war round that is due (capped per run) */
async function warJob(db: Db, settings: SettingsBundle, now: number): Promise<JobOutput> {
  const due = await listDueWars(db, now, 12);
  let done = 0;
  for (const w of due) {
    try {
      await resolveRound(db, w.id, settings, { force: true });
      done++;
    } catch (err) {
      await markJob(db, 'wars', { error: `${w.id}: ${err instanceof Error ? err.message.slice(0, 120) : 'round failed'}` });
    }
  }
  const overdue = await listOverdueWars(db, now, 8);
  for (const w of overdue) {
    await finalizeWar(db, w.id, settings, now);
    done++;
  }
  return { processed: done, detail: String(done) };
}

async function warExpiryJob(db: Db, settings: SettingsBundle, now: number): Promise<JobOutput> {
  const expired = await listExpiredProposals(db, settings.diplomacy.requestExpirySeconds, now, 20);
  for (const w of expired) await expireProposal(db, w.id, now);
  return { processed: expired.length, detail: String(expired.length) };
}

async function diplomacyExpiryJob(db: Db, now: number): Promise<JobOutput> {
  const expired = await expireRequests(db, now, 200);
  return { processed: expired, detail: String(expired) };
}

async function rankingJob(db: Db, settings: SettingsBundle, now: number): Promise<JobOutput> {
  const last = await db.first<{ last_success_at: number }>(sql`SELECT last_success_at FROM job_checkpoints WHERE job_key = 'ranking'`);
  if (last?.last_success_at && now - Number(last.last_success_at) < 600) {
    return { processed: 0, detail: 'too-soon' };
  }
  const total = await recomputeRankings(db, settings);
  // counts + snapshots in the same pass keeps the leaderboard and charts cheap
  await db.batch([
    sql`UPDATE nations SET
          allies_count = (SELECT COUNT(*) FROM diplomatic_relations r WHERE r.nation_id = nations.id AND r.status IN ('friend','ally')),
          enemies_count = (SELECT COUNT(*) FROM diplomatic_relations r WHERE r.nation_id = nations.id AND r.status = 'enemy')`,
  ]);
  const day = new Date(now * 1000).toISOString().slice(0, 10);
  await db.run(
    sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
         SELECT n.id, ${day}, n.treasury, COALESCE(e.net_income, 0), n.military_power, n.equipment_count, ${now}
           FROM nations n LEFT JOIN nation_economy e ON e.nation_id = n.id
          WHERE n.status <> 'dissolved'
          ON CONFLICT (nation_id, day) DO UPDATE SET treasury = excluded.treasury, income = excluded.income,
                                                      power = excluded.power, equipment = excluded.equipment`,
  );
  return { processed: total, detail: String(total) };
}

async function housekeepingJob(db: Db, now: number): Promise<JobOutput> {
  const sessions = await purgeExpiredSessions(db, now);
  const webhook = await db.run(
    sql`DELETE FROM processed_webhook_updates WHERE created_at < ${now - 30 * 86400} AND id IN (SELECT id FROM processed_webhook_updates WHERE created_at < ${now - 30 * 86400} ORDER BY id LIMIT 500)`,
  );
  const stale = await db.run(
    sql`DELETE FROM bot_flow_states WHERE expires_at IS NOT NULL AND expires_at < ${now} AND user_id IN (SELECT user_id FROM bot_flow_states WHERE expires_at < ${now} ORDER BY user_id LIMIT 200)`,
  );
  return { processed: sessions, detail: `sessions=${sessions} webhook=${webhook.meta.changes ?? 0} flows=${stale.meta.changes ?? 0}` };
}

/** manual trigger used by the admin panel (same code path as cron) */
export async function triggerJobsManually(env: Env, db: Db, jobs: string[]): Promise<CronResult> {
  const settings = await loadSettings(db, { force: true });
  const now = nowSeconds();
  const results: JobResult[] = [];
  const runOne = async (job: string, fn: () => Promise<JobOutput>) => {
    try {
      const r = await fn();
      results.push({ job, ok: true, processed: r.processed, detail: r.detail });
      await markJob(db, job, { ...(r.cursor === undefined ? {} : { cursor: r.cursor }), rowsProcessed: r.processed, success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message.slice(0, 200) : String(err);
      results.push({ job, processed: 0, ok: false, detail: message });
      await markJob(db, job, { error: message });
    }
  };
  for (const job of jobs) {
    switch (job) {
      case 'wars':
        await runOne(job, () => warJob(db, settings, now));
        break;
      case 'war_expiry':
        await runOne(job, () => warExpiryJob(db, settings, now));
        break;
      case 'ranking':
        await runOne(job, () => rankingJob(db, settings, now));
        break;
      case 'diplomacy_expiry':
        await runOne(job, () => diplomacyExpiryJob(db, now));
        break;
      case 'housekeeping':
        await runOne(job, () => housekeepingJob(db, now));
        break;
      default:
        results.push({ job, processed: 0, ok: false, detail: 'unknown job' });
    }
  }
  return { startedAt: now, finishedAt: nowSeconds(), jobs: results };
}
