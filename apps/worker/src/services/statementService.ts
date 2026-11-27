import { MAX_STATEMENT_CHARS, STATEMENT_STATUS_LABELS_FA, type StatementStatus } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso, truncate } from '../core/format';
import { uuid } from '../core/ids';
import type { SettingsBundle } from '../core/settings';
import { type NationRow } from '../db/queries';
import { audit } from './auditService';

export interface CreateStatementInput {
  text: string;
  via?: 'bot' | 'webapp' | 'admin';
}

function sanitize(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .trim()
    .slice(0, MAX_STATEMENT_CHARS);
}

export function validateStatement(text: string): string {
  const clean = sanitize(text ?? '');
  if (clean.length < 10) throw ApiError.validation('متن بیانیه باید حداقل ۱۰ نویسه باشد.');
  if (clean.length > MAX_STATEMENT_CHARS) throw ApiError.validation(`حداکثر طول بیانیه ${MAX_STATEMENT_CHARS} نویسه است.`);
  return clean;
}

/**
 * Publish flow (design doc §13): the bot first shows a preview, only the
 * confirmed text reaches this function. If the admin enabled moderation the
 * statement becomes `pending_review` and is not shown in the news feed.
 */
export async function createStatement(
  db: Db,
  nation: NationRow,
  input: CreateStatementInput,
  settings: SettingsBundle,
  actor: { userId: number; telegramId: number },
) {
  if (!settings.features.statementsEnabled) throw ApiError.disabled('بیانیه‌ها');
  if (nation.status === 'banned' || nation.status === 'frozen') throw ApiError.forbidden('امکان انتشار بیانیه برای این کشور وجود ندارد.');
  const text = validateStatement(input.text);

  const needsReview = settings.features.statementsRequireApproval;
  const status: StatementStatus = needsReview ? 'pending_review' : 'published';
  const at = nowSeconds();

  const row = await db.first<{ id: number }>(
    sql`INSERT INTO statements (uuid, nation_id, leader_snapshot, text, status, published_at, created_via, created_at, updated_at)
         VALUES (${uuid()}, ${nation.id}, ${nation.leader_name}, ${text}, ${status}, ${status === 'published' ? at : null},
                 ${input.via ?? 'bot'}, ${at}, ${at})
         RETURNING id`,
  );
  const statementId = Number(row?.id ?? 0);

  // one news item per statement; visibility is toggled by moderation instead of
  // inserting duplicate rows (keeps D1 writes minimal)
  await db.run(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, statement_id, is_active, created_at)
         VALUES ('statement', ${`${nation.flag} بیانیه رسمی ${nation.name}`}, ${truncate(text, 900)}, 'global', ${nation.id}, ${statementId}, ${status === 'published' ? 1 : 0}, ${at})`,
  );
  if (status === 'pending_review') {
    await db.run(
      sql`INSERT INTO notifications (nation_id, user_id, kind, title, body, is_read, created_at)
           SELECT ${nation.id}, owner_user_id, 'statement', 'بیانیه در انتظار بررسی',
                  'بیانیه شما ثبت شد و پس از تأیید مدیر منتشر می‌شود.', 0, ${at} FROM nations WHERE id = ${nation.id}`,
    );
  }
  await audit(db, { actor, action: 'statement.create', targetType: 'statement', targetId: statementId, after: { status, length: text.length } });
  return { statementId, status, statusLabelFa: STATEMENT_STATUS_LABELS_FA[status], preview: text };
}

export async function listMyStatements(db: Db, nationIds: number[], limit = 30) {
  if (nationIds.length === 0) return [];
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT s.*, n.name AS nation_name, n.flag AS flag
          FROM statements s JOIN nations n ON n.id = s.nation_id
         WHERE s.nation_id IN (${nationIds}) AND s.status <> 'removed'
         ORDER BY s.id DESC LIMIT ${Math.min(100, Math.max(1, limit))}`,
  );
  return rows.map(mapStatement);
}

export function mapStatement(r: Record<string, unknown>) {
  const status = String(r.status) as StatementStatus;
  return {
    id: Number(r.id),
    nationId: Number(r.nation_id),
    nationName: String(r.nation_name ?? ''),
    flag: String(r.flag ?? ''),
    leaderName: String(r.leader_snapshot ?? ''),
    text: String(r.text),
    status,
    statusLabelFa: STATEMENT_STATUS_LABELS_FA[status] ?? status,
    createdAt: toIso(Number(r.created_at)),
    publishedAt: toIso(r.published_at === null ? null : Number(r.published_at)),
    reviewNote: (r.review_note as string) ?? null,
  };
}

/** player cancels their own not-yet-published statement */
export async function cancelStatement(db: Db, statementId: number, nationIds: number[]) {
  const row = await db.first<{ id: number; status: string; nation_id: number }>(
    sql`SELECT id, status, nation_id FROM statements WHERE id = ${statementId}`,
  );
  if (!row) throw ApiError.notFound('بیانیه یافت نشد.');
  if (!nationIds.includes(row.nation_id)) throw ApiError.forbidden('این بیانیه متعلق به شما نیست.');
  if (row.status === 'published') {
    await db.batch([
      sql`UPDATE statements SET status = 'removed', updated_at = ${nowSeconds()} WHERE id = ${statementId}`,
      sql`UPDATE announcements SET is_active = 0 WHERE statement_id = ${statementId}`,
    ]);
    return { status: 'removed' };
  }
  if (row.status !== 'pending_review') throw ApiError.conflict('این بیانیه قابل لغو نیست.');
  await db.run(sql`UPDATE statements SET status = 'draft', updated_at = ${nowSeconds()} WHERE id = ${statementId}`);
  return { status: 'draft' };
}

/* ---------------------------------- admin ---------------------------------- */

export async function adminListStatements(db: Db, filter: { status?: string | null; search?: string | null; limit?: number; offset?: number } = {}) {
  const limit = Math.min(100, Math.max(1, filter.limit ?? 30));
  const offset = Math.max(0, filter.offset ?? 0);
  const where: string[] = [];
  const bindings: unknown[] = [];
  if (filter.status && filter.status !== 'all') {
    where.push('s.status = ?');
    bindings.push(filter.status);
  }
  if (filter.search) {
    where.push('(s.text LIKE ? OR n.name LIKE ?)');
    bindings.push(`%${filter.search}%`, `%${filter.search}%`);
  }
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT s.*, n.name AS nation_name, n.flag AS flag
            FROM statements s JOIN nations n ON n.id = s.nation_id
           ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
           ORDER BY s.id DESC LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset],
  });
  const counts = await db.all<{ status: string; c: number }>(sql`SELECT status, COUNT(*) AS c FROM statements GROUP BY status`);
  return { rows: rows.map(mapStatement), counts: Object.fromEntries(counts.map((c) => [c.status, Number(c.c)])) };
}

export async function adminReviewStatement(
  db: Db,
  statementId: number,
  decision: 'approve' | 'reject' | 'remove',
  note: string | null,
  actor: { userId: number; telegramId: number },
) {
  const row = await db.first<{ id: number; nation_id: number; status: string; text: string }>(
    sql`SELECT id, nation_id, status, text FROM statements WHERE id = ${statementId}`,
  );
  if (!row) throw ApiError.notFound('بیانیه یافت نشد.');
  const at = nowSeconds();
  if (decision === 'approve') {
    await db.batch([
      sql`UPDATE statements SET status = 'published', published_at = ${at}, review_note = ${note}, reviewed_by = ${actor.userId}, reviewed_at = ${at}, updated_at = ${at} WHERE id = ${statementId}`,
      sql`UPDATE announcements SET is_active = 1, title = ${'بیانیه رسمی'}, body = ${row.text.slice(0, 900)} WHERE statement_id = ${statementId}`,
    ]);
  } else if (decision === 'reject') {
    await db.batch([
      sql`UPDATE statements SET status = 'rejected', review_note = ${note}, reviewed_by = ${actor.userId}, reviewed_at = ${at}, updated_at = ${at} WHERE id = ${statementId}`,
      sql`INSERT INTO notifications (nation_id, user_id, kind, title, body, is_read, created_at)
           SELECT ${row.nation_id}, owner_user_id, 'statement', 'بیانیه رد شد', ${`یادداشت مدیر: ${note ?? '-'}`}, 0, ${at}
             FROM nations WHERE id = ${row.nation_id}`,
    ]);
  } else {
    await db.batch([
      sql`UPDATE statements SET status = 'removed', review_note = ${note}, reviewed_by = ${actor.userId}, updated_at = ${at} WHERE id = ${statementId}`,
      sql`UPDATE announcements SET is_active = 0 WHERE statement_id = ${statementId}`,
    ]);
  }
  await audit(db, { actor, action: `statement.${decision}`, targetType: 'statement', targetId: statementId, reason: note });
  return { status: decision === 'approve' ? 'published' : decision === 'reject' ? 'rejected' : 'removed' };
}
