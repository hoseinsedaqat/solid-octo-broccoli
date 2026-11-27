import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { nowSeconds } from '../core/format';
export interface AuditActor {
  userId: number;
  telegramId: number;
}

export interface AuditInput {
  actor: AuditActor | null;
  action: string;
  targetType?: string | null;
  targetId?: number | string | null;
  before?: unknown;
  after?: unknown;
  reason?: string | null;
  ip?: string | null;
}

const MAX_JSON = 4000;
function safeJson(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  try {
    const s = JSON.stringify(value);
    return s.length > MAX_JSON ? s.slice(0, MAX_JSON) + '…' : s;
  } catch {
    return null;
  }
}

/** every admin mutation is recorded (rule: all admin activity in the audit log) */
export async function audit(db: Db, input: AuditInput): Promise<void> {
  const now = nowSeconds();
  await db.run(
    sql`INSERT INTO audit_logs (actor_user_id, actor_telegram_id, action, target_type, target_id, before_json, after_json, reason, ip, created_at)
         VALUES (${input.actor?.userId ?? null}, ${input.actor?.telegramId ?? null}, ${input.action},
                 ${input.targetType ?? null}, ${typeof input.targetId === 'number' ? input.targetId : null},
                 ${safeJson(input.before)}, ${safeJson(input.after)}, ${input.reason ?? null}, ${input.ip ?? null}, ${now})`,
  );
}

export async function listAudit(db: Db, opts: { limit?: number; offset?: number; actorId?: number | null } = {}) {
  const limit = Math.min(200, Math.max(1, opts.limit ?? 50));
  const offset = Math.max(0, opts.offset ?? 0);
  const where = opts.actorId ? 'WHERE a.actor_user_id = ?' : '';
  const bindings = opts.actorId ? [opts.actorId] : [];
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT a.*, u.username AS actor_username, u.telegram_user_id AS actor_telegram_id
             FROM audit_logs a LEFT JOIN users u ON u.id = a.actor_user_id
           ${where}
           ORDER BY a.id DESC LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset],
  });
  return rows.map((r) => ({ ...r, created_at_iso: toIso(r.created_at) }));
}

function toIso(sec: unknown) {
  const n = Number(sec);
  return n ? new Date(n * 1000).toISOString() : null;
}
