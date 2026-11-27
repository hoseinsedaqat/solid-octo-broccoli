import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { dayKey, nowSeconds } from '../core/format';
import type { SettingsBundle } from '../core/settings';

/**
 * Official Cloudflare Free-plan limits, hardcoded ONLY so the admin panel can
 * show how close the account is to a documented ceiling. Values are from the
 * public plan tables (Workers Free / D1 free tier) as of 2025-06 and are shown
 * as "documented limits", never as measured usage.
 */
export const FREE_PLAN_LIMITS = {
  workerRequestsPerDay: 100_000,
  workerCpuMsPerRequest: 10,
  workerCpuMsPerCron: 30_000,
  d1RowsReadPerDay: 5_000_000,
  d1RowsWrittenPerDay: 100_000,
  d1DatabaseSizeMB: 5,
  d1RequestsPerDay: 500_000,
  cronTriggersMax: 5,
} as const;

export interface QuotaDelta {
  apiRequests?: number;
  botUpdates?: number;
  cronRuns?: number;
  errors?: number;
  dbReads?: number;
  dbWrites?: number;
  rowsRead?: number;
  rowsWritten?: number;
}

const counters: QuotaDelta = {};
let pendingNationStats: { nations: number; users: number; transactions: number } | null = null;

/**
 * Counters are accumulated in the isolate and flushed once per request — an
 * UPDATE per request would double the D1 write quota we are trying to protect.
 */
export function record(delta: QuotaDelta) {
  counters.apiRequests = (counters.apiRequests ?? 0) + (delta.apiRequests ?? 0);
  counters.botUpdates = (counters.botUpdates ?? 0) + (delta.botUpdates ?? 0);
  counters.cronRuns = (counters.cronRuns ?? 0) + (delta.cronRuns ?? 0);
  counters.errors = (counters.errors ?? 0) + (delta.errors ?? 0);
  counters.dbReads = (counters.dbReads ?? 0) + (delta.dbReads ?? 0);
  counters.dbWrites = (counters.dbWrites ?? 0) + (delta.dbWrites ?? 0);
  counters.rowsRead = (counters.rowsRead ?? 0) + (delta.rowsRead ?? 0);
  counters.rowsWritten = (counters.rowsWritten ?? 0) + (delta.rowsWritten ?? 0);
}

export function takeCounters(): QuotaDelta {
  const copy = { ...counters };
  for (const k of Object.keys(counters) as (keyof QuotaDelta)[]) delete counters[k];
  return copy;
}

export async function flushQuota(db: Db): Promise<void> {
  const delta = takeCounters();
  const hasDelta = Object.values(delta).some((v) => (v ?? 0) > 0);
  if (!hasDelta && !pendingNationStats) return;
  const day = dayKey(nowSeconds());
  await db.run(
    sql`INSERT INTO quota_stats (day, api_requests, bot_updates, cron_runs, errors, db_reads_est, db_writes_est,
                                 nations_count, users_count, transactions_count, updated_at)
         VALUES (${day}, ${delta.apiRequests ?? 0}, ${delta.botUpdates ?? 0}, ${delta.cronRuns ?? 0}, ${delta.errors ?? 0},
                 ${delta.rowsRead ?? 0}, ${delta.rowsWritten ?? 0},
                 ${pendingNationStats?.nations ?? 0}, ${pendingNationStats?.users ?? 0}, ${pendingNationStats?.transactions ?? 0}, ${nowSeconds()})
         ON CONFLICT (day) DO UPDATE SET
           api_requests = quota_stats.api_requests + excluded.api_requests,
           bot_updates = quota_stats.bot_updates + excluded.bot_updates,
           cron_runs = quota_stats.cron_runs + excluded.cron_runs,
           errors = quota_stats.errors + excluded.errors,
           db_reads_est = quota_stats.db_reads_est + excluded.db_reads_est,
           db_writes_est = quota_stats.db_writes_est + excluded.db_writes_est,
           nations_count = CASE WHEN excluded.nations_count > 0 THEN excluded.nations_count ELSE quota_stats.nations_count END,
           users_count = CASE WHEN excluded.users_count > 0 THEN excluded.users_count ELSE quota_stats.users_count END,
           transactions_count = CASE WHEN excluded.transactions_count > 0 THEN excluded.transactions_count ELSE quota_stats.transactions_count END,
           updated_at = excluded.updated_at`,
  );
  pendingNationStats = null;
}

export async function snapshotQuota(db: Db, settings: SettingsBundle) {
  const day = dayKey(nowSeconds());
  const [today, recent, counts] = await Promise.all([
    db.first<Record<string, unknown>>(sql`SELECT * FROM quota_stats WHERE day = ${day}`),
    db.all<Record<string, unknown>>(sql`SELECT * FROM quota_stats ORDER BY day DESC LIMIT 14`),
    db.first<{ nations: number; users: number; transactions: number }>(
      sql`SELECT (SELECT COUNT(*) FROM nations) AS nations, (SELECT COUNT(*) FROM users) AS users,
                 (SELECT COUNT(*) FROM transactions) AS transactions`,
    ),
  ]);
  pendingNationStats = {
    nations: Number(counts?.nations ?? 0),
    users: Number(counts?.users ?? 0),
    transactions: Number(counts?.transactions ?? 0),
  };
  const apiRequests = Number(today?.api_requests ?? 0);
  const rowsRead = Number(today?.db_reads_est ?? 0);
  const rowsWritten = Number(today?.db_writes_est ?? 0);
  const pct = (value: number, limit: number) => Math.round((value / Math.max(1, limit)) * 1000) / 10;
  const warnAt = settings.quota.warnAtPercent;

  const series = ['api_requests', 'bot_updates', 'cron_runs', 'errors', 'db_reads_est'] as const;
  return {
    day,
    measured: {
      apiRequests,
      botUpdates: Number(today?.bot_updates ?? 0),
      cronRuns: Number(today?.cron_runs ?? 0),
      errors: Number(today?.errors ?? 0),
      // D1 reports rows_read / rows_written per statement in `meta` — these are
      // measured values, not estimates.
      d1RowsRead: rowsRead,
      d1RowsWritten: rowsWritten,
      nations: Number(counts?.nations ?? 0),
      users: Number(counts?.users ?? 0),
      transactions: Number(counts?.transactions ?? 0),
    },
    /** NOT available from inside the Worker: the panel must show "unknown". */
    notMeasured: {
      cpuMs: null,
      databaseBytes: null,
      memory: null,
      note: 'مصرف CPU و حجم دقیق دیتابیس از داخل Worker قابل اندازه‌گیری نیست؛ برای این اعداد از داشبورد Cloudflare استفاده کنید.',
    },
    limits: FREE_PLAN_LIMITS,
    usagePercent: {
      requests: pct(apiRequests, FREE_PLAN_LIMITS.workerRequestsPerDay),
      d1RowsRead: pct(rowsRead, FREE_PLAN_LIMITS.d1RowsReadPerDay),
      d1RowsWritten: pct(rowsWritten, FREE_PLAN_LIMITS.d1RowsWrittenPerDay),
    },
    warnings: [
      pct(apiRequests, FREE_PLAN_LIMITS.workerRequestsPerDay) >= warnAt ? 'تعداد درخواست‌های امروز به سقف پلن رایگان نزدیک شده است.' : null,
      pct(rowsRead, FREE_PLAN_LIMITS.d1RowsReadPerDay) >= warnAt ? 'مصرف رشته‌های خوانده‌شده D1 نزدیک سقف است؛ کش‌کردن آمار و لیست‌ها بهینه شود.' : null,
      pct(rowsWritten, FREE_PLAN_LIMITS.d1RowsWrittenPerDay) >= warnAt ? 'نوشته‌های D1 امروز نزدیک سقف روزانه است.' : null,
    ].filter(Boolean) as string[],
    history: recent.map((r) => ({
      day: String(r.day),
      ...Object.fromEntries(series.map((k) => [k, Number(r[k] ?? 0)])),
    })).reverse(),
  };
}

/** quota guard used by cron: pause non-essential work above the soft limit */
export async function isCronPaused(db: Db, settings: SettingsBundle): Promise<boolean> {
  if (settings.quota.d1RowsDailySoftLimit <= 0) return false;
  const row = await db.first<{ db_reads_est: number }>(sql`SELECT db_reads_est FROM quota_stats WHERE day = ${dayKey(nowSeconds())}`);
  return Number(row?.db_reads_est ?? 0) > settings.quota.d1RowsDailySoftLimit;
}

export async function markJob(
  db: Db,
  jobKey: string,
  patch: { cursor?: number; rowsProcessed?: number; error?: string | null; success?: boolean },
): Promise<void> {
  const at = nowSeconds();
  // a job that does not page keeps its previous cursor, so it must never be reset by the upsert
  const cursor = patch.cursor ?? Number((await db.first<{ cursor: number }>(sql`SELECT cursor FROM job_checkpoints WHERE job_key = ${jobKey}`))?.cursor ?? 0);
  const failed = patch.error !== undefined && patch.error !== null;
  const ok = !failed && patch.success !== false;
  await db.run({
    sql: `INSERT INTO job_checkpoints (job_key, cursor, last_run_at, last_success_at, rows_processed, last_error, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT (job_key) DO UPDATE SET
             cursor = excluded.cursor,
             last_run_at = excluded.last_run_at,
             last_success_at = COALESCE(excluded.last_success_at, job_checkpoints.last_success_at),
             rows_processed = job_checkpoints.rows_processed + excluded.rows_processed,
             last_error = CASE WHEN excluded.last_success_at IS NULL THEN COALESCE(excluded.last_error, job_checkpoints.last_error) ELSE NULL END,
             updated_at = excluded.updated_at`,
    bindings: [jobKey, cursor, at, ok ? at : null, patch.rowsProcessed ?? 0, failed ? String(patch.error).slice(0, 400) : null, at],
  });
}

export async function getJobState(db: Db, jobKey: string) {
  return db.first<{ cursor: number; rows_processed: number; last_error: string | null; updated_at: number }>(
    sql`SELECT cursor, rows_processed, last_error, updated_at FROM job_checkpoints WHERE job_key = ${jobKey}`,
  );
}
