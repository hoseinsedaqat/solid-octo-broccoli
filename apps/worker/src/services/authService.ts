import type { AdminSection, Role } from '@ww/shared';
import { sql } from '../core/sql';
import type { Db } from '../core/db';
import { ApiError } from '../core/errors';
import { randomToken, sha256Hex } from '../core/ids';
import { nowSeconds } from '../core/format';
import type { SessionUser, Env } from '../types';
import { verifyInitDataFull } from '../core/telegram-auth';

const SESSION_TTL_SECONDS = 7 * 24 * 3600;

export function parseAdminIds(env: Env): Set<number> {
  return new Set(
    (env.ADMIN_TELEGRAM_IDS ?? '')
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0),
  );
}

export interface UpsertUserResult {
  userId: number;
  role: Role;
  status: 'active' | 'blocked' | 'disabled';
  created: boolean;
}

/** Idempotent user bootstrap from a verified telegram identity. */
export async function upsertTelegramUser(
  db: Db,
  identity: { telegramId: number; username?: string | null; firstName?: string | null; lastName?: string | null; languageCode?: string | null },
  env: Env,
): Promise<UpsertUserResult> {
  if (!identity.telegramId || identity.telegramId <= 0) throw ApiError.unauthorized('شناسه تلگرام معتبر نیست.');
  const now = nowSeconds();
  const adminIds = parseAdminIds(env);
  const shouldBeAdmin = adminIds.has(identity.telegramId);

  const existing = await db.first<{ id: number; role: Role; status: 'active' | 'blocked' | 'disabled'; is_primary_admin: number }>(
    sql`SELECT id, role, status, is_primary_admin FROM users WHERE telegram_user_id = ${identity.telegramId}`,
  );

  if (existing) {
    await db.run(
      sql`UPDATE users SET username = ${identity.username ?? null}, first_name = ${identity.firstName ?? null},
               last_name = ${identity.lastName ?? null}, language_code = COALESCE(${identity.languageCode ?? null}, language_code),
               last_seen_at = ${now}, seen_count = seen_count + 1, updated_at = ${now}
           WHERE id = ${existing.id}`,
    );
    let role = existing.role;
    if (shouldBeAdmin && role === 'player') {
      await db.batch([
        sql`UPDATE users SET role = 'super_admin', updated_at = ${now} WHERE id = ${existing.id}`,
        sql`INSERT INTO user_roles (user_id, role, note, granted_by, is_active)
             VALUES (${existing.id}, 'super_admin', 'promoted from ADMIN_TELEGRAM_IDS', ${existing.id}, 1)
             ON CONFLICT (user_id, role) DO UPDATE SET is_active = 1, granted_at = ${now}`,
      ]);
      role = 'super_admin';
    }
    return { userId: existing.id, role, status: existing.status, created: false };
  }

  const primary = shouldBeAdmin && adminIds.size > 0 ? Number([...adminIds][0]) === identity.telegramId : false;
  const role: Role = shouldBeAdmin ? 'super_admin' : 'player';
  const inserted = await db.first<{ id: number }>(
    sql`INSERT INTO users (telegram_user_id, username, first_name, last_name, language_code, role, status, is_primary_admin, last_seen_at, seen_count, tos_accepted_at)
         VALUES (${identity.telegramId}, ${identity.username ?? null}, ${identity.firstName ?? null}, ${identity.lastName ?? null},
                 ${identity.languageCode ?? 'fa'}, ${role}, 'active', ${primary ? 1 : 0}, ${now}, 1, ${now})
         RETURNING id`,
  );
  const userId = inserted!.id;
  await db.run(
    sql`INSERT INTO user_roles (user_id, role, note, granted_by, is_active)
         VALUES (${userId}, ${role}, 'bootstrap', NULL, 1)
         ON CONFLICT (user_id, role) DO UPDATE SET is_active = 1`,
  );
  return { userId, role, status: 'active', created: true };
}

export async function createSession(
  db: Db,
  user: { userId: number; role: Role },
  meta: { ip?: string | null; userAgent?: string | null },
): Promise<{ token: string; expiresAt: number }> {
  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  const now = nowSeconds();
  const expiresAt = now + SESSION_TTL_SECONDS;
  await db.run(
    sql`INSERT INTO sessions (token_hash, user_id, role, ip, user_agent, created_at, last_seen_at, expires_at)
         VALUES (${tokenHash}, ${user.userId}, ${user.role}, ${meta.ip ?? null}, ${meta.userAgent ? meta.userAgent.slice(0, 180) : null}, ${now}, ${now}, ${expiresAt})`,
  );
  return { token, expiresAt };
}

export async function loadSessionUser(db: Db, token: string): Promise<SessionUser | null> {
  const tokenHash = await sha256Hex(token);
  const now = nowSeconds();
  const row = await db.first<Record<string, unknown>>(
    sql`SELECT s.id AS session_id, s.expires_at, u.id AS user_id, u.telegram_user_id, u.role, u.status, u.username,
               u.is_primary_admin, s.active_nation_id AS session_active_nation_id
          FROM sessions s
          JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = ${tokenHash} AND s.revoked_at IS NULL`,
  );
  if (!row) return null;
  if (Number(row.expires_at) < now) {
    await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE id = ${row.session_id}`);
    return null;
  }
  const nations = await db.all<{ id: number }>(
    sql`SELECT id FROM nations WHERE owner_user_id = ${row.user_id} AND status <> 'dissolved' ORDER BY id`,
  );
  const permissions = await loadPermissions(db, Number(row.user_id), row.role as Role);
  await db.run(sql`UPDATE sessions SET last_seen_at = ${now} WHERE id = ${row.session_id}`);

  return {
    userId: Number(row.user_id),
    telegramId: Number(row.telegram_user_id),
    role: row.role as Role,
    username: (row.username as string) ?? null,
    status: row.status as SessionUser['status'],
    permissions,
    nationIds: nations.map((n) => n.id),
    activeNationId: activeNation(nations.map((n) => n.id), row.session_active_nation_id),
    sessionId: Number(row.session_id),
    isPrimaryAdmin: Number(row.is_primary_admin) === 1,
  };
}

function activeNation(ids: number[], preferred: unknown): number | null {
  if (ids.length === 0) return null;
  const pref = Number(preferred);
  return ids.includes(pref) ? pref : ids[0]!;
}

export async function loadPermissions(db: Db, userId: number, role: Role): Promise<SessionUser['permissions']> {
  if (role === 'super_admin') return {};
  const rows = await db.all<{ resource: AdminSection; can_read: number; can_write: number }>(
    sql`SELECT resource, can_read, can_write FROM admin_permissions WHERE user_id = ${userId}`,
  );
  const out: SessionUser['permissions'] = {};
  for (const r of rows) out[r.resource] = { read: r.can_read === 1, write: r.can_write === 1 };
  return out;
}

/** switch the active nation for THIS session (nation switching in the Mini App) */
export async function setActiveNation(db: Db, userId: number, sessionId: number, nationId: number, nationIds: number[]) {
  if (!nationIds.includes(nationId)) throw ApiError.forbidden('این کشور متعلق به شما نیست.');
  await db.run(sql`UPDATE sessions SET active_nation_id = ${nationId} WHERE id = ${sessionId} AND user_id = ${userId}`);
  return { activeNationId: nationId };
}

export async function revokeSession(db: Db, userId: number, sessionId?: number) {
  const now = nowSeconds();
  if (sessionId) await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE user_id = ${userId} AND id = ${sessionId}`);
  else await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE user_id = ${userId} AND revoked_at IS NULL`);
}

export async function purgeExpiredSessions(db: Db, now = nowSeconds()) {
  const r = await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE revoked_at IS NULL AND expires_at < ${now}`);
  return r.meta.changes ?? 0;
}

/** Verify initData and return a ready session (Mini App entry point). */
export async function authenticateInitData(db: Db, env: Env, initData: string, meta: { ip?: string | null; userAgent?: string | null }) {
  const { user } = await verifyInitDataFull(initData, env.BOT_TOKEN ?? '');
  const upsert = await upsertTelegramUser(db, user, env);
  if (upsert.status !== 'active') {
    throw new ApiError('forbidden', upsert.status === 'blocked' ? 'حساب شما مسدود شده است.' : 'حساب شما غیرفعال است.', 403);
  }
  const session = await createSession(db, upsert, meta);
  return { upsert, session };
}
