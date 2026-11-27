import { ADMIN_SECTIONS, ROLES, type AdminSection, type Role } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso } from '../core/format';
import { uuid } from '../core/ids';
import type { SettingsBundle } from '../core/settings';
import { loadNation, refreshNationStats, type NationRow } from '../db/queries';
import { audit } from './auditService';
import { markJob } from './quotaService';

type NumLike = string | number | null | undefined;
const toInt = (v: NumLike, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
};

export interface AdminActor {
  userId: number;
  telegramId: number;
  role: Role;
}

/* ------------------------------- overview ------------------------------- */

export async function overview(db: Db) {
  const row = await db.first<Record<string, unknown>>(
    sql`SELECT
      (SELECT COUNT(*) FROM users) AS users_total,
      (SELECT COUNT(*) FROM users WHERE status = 'active') AS users_active,
      (SELECT COUNT(*) FROM users WHERE role IN ('admin','super_admin')) AS admins_total,
      (SELECT COUNT(*) FROM nations WHERE status <> 'dissolved') AS nations_total,
      (SELECT COUNT(*) FROM nations WHERE status = 'active') AS nations_active,
      (SELECT COUNT(*) FROM nations WHERE status = 'at_war') AS nations_at_war,
      (SELECT COALESCE(SUM(treasury),0) FROM nations) AS treasury_sum,
      (SELECT COALESCE(SUM(gross_income),0) FROM nation_economy) AS income_sum,
      (SELECT COALESCE(SUM(net_income),0) FROM nation_economy) AS net_income_sum,
      (SELECT COUNT(*) FROM wars WHERE status IN ('proposed','accepted','active','peace_requested')) AS wars_active,
      (SELECT COUNT(*) FROM wars WHERE status = 'ended') AS wars_ended,
      (SELECT COUNT(*) FROM alliances WHERE status = 'active') AS alliances_active,
      (SELECT COUNT(*) FROM diplomatic_requests WHERE status = 'pending') AS requests_pending,
      (SELECT COUNT(*) FROM statements WHERE status = 'pending_review') AS statements_pending,
      (SELECT COUNT(*) FROM statements) AS statements_total,
      (SELECT COUNT(*) FROM transactions) AS transactions_total,
      (SELECT COUNT(*) FROM notifications WHERE is_read = 0) AS notifications_unread,
      (SELECT COUNT(*) FROM users WHERE last_seen_at >= ${nowSeconds() - 86400}) AS users_24h,
      (SELECT COUNT(*) FROM users WHERE last_seen_at >= ${nowSeconds() - 7 * 86400}) AS users_7d,
      (SELECT COUNT(*) FROM nations WHERE created_at >= ${nowSeconds() - 86400}) AS nations_24h,
      (SELECT COUNT(*) FROM transactions WHERE created_at >= ${nowSeconds() - 86400}) AS tx_24h`,
  );
  const num = (k: string) => Number(row?.[k] ?? 0);
  const recentTx = await db.all<Record<string, unknown>>(
    sql`SELECT t.id, t.type, t.amount, t.created_at, n.name AS nation_name, n.flag
          FROM transactions t JOIN nations n ON n.id = t.nation_id ORDER BY t.id DESC LIMIT 15`,
  );
  const recentAudit = await db.all<Record<string, unknown>>(
    sql`SELECT a.id, a.action, a.target_type, a.target_id, a.reason, a.created_at, u.telegram_user_id
          FROM audit_logs a LEFT JOIN users u ON u.id = a.actor_user_id ORDER BY a.id DESC LIMIT 15`,
  );
  const unpriced = await db.first<{ c: number }>(sql`SELECT COUNT(*) AS c FROM v_unpriced_equipment`);
  const duplicates = await db.all<Record<string, unknown>>(sql`SELECT * FROM v_duplicate_equipment_names ORDER BY occurrences DESC LIMIT 20`);
  const jobs = await db.all<Record<string, unknown>>(sql`SELECT * FROM job_checkpoints ORDER BY job_key LIMIT 20`);

  return {
    counters: {
      users: num('users_total'),
      activeUsers: num('users_active'),
      admins: num('admins_total'),
      nations: num('nations_total'),
      activeNations: num('nations_active'),
      nationsAtWar: num('nations_at_war'),
      totalTreasury: num('treasury_sum'),
      totalIncomePerCycle: num('income_sum'),
      totalNetIncomePerCycle: num('net_income_sum'),
      activeWars: num('wars_active'),
      endedWars: num('wars_ended'),
      alliances: num('alliances_active'),
      pendingRequests: num('requests_pending'),
      pendingStatements: num('statements_pending'),
      statements: num('statements_total'),
      transactions: num('transactions_total'),
      unreadNotifications: num('notifications_unread'),
      usersLast24h: num('users_24h'),
      usersLast7d: num('users_7d'),
      newNations24h: num('nations_24h'),
      transactionsLast24h: num('tx_24h'),
    },
    dataQuality: {
      unpricedEquipment: Number(unpriced?.c ?? 0),
      duplicateNames: duplicates.map((d) => ({
        nameFa: String(d.name_fa),
        occurrences: Number(d.occurrences),
        categoryKeys: String(d.category_keys).split(','),
        templateIds: String(d.template_ids).split(',').map(Number),
      })),
      hint: 'تجهیزات هم‌نام در چند دسته (مثلاً F-22/F-35 در «پدافند هوایی» و «جنگنده‌ها») طبق سند طراحی مجاز و مستقل هستند؛ این فهرست فقط برای آگاهی مدیر است و هیچ داده‌ای خودکار ادغام نمی‌شود.',
    },
    recentTransactions: recentTx.map((t) => ({
      id: Number(t.id),
      type: String(t.type),
      amount: Number(t.amount),
      nation: String(t.nation_name),
      flag: String(t.flag),
      createdAt: toIso(Number(t.created_at)),
    })),
    recentAudit: recentAudit.map((a) => ({
      id: Number(a.id),
      action: String(a.action),
      targetType: (a.target_type as string) ?? null,
      targetId: a.target_id === null ? null : Number(a.target_id),
      reason: (a.reason as string) ?? null,
      actorTelegramId: a.telegram_user_id === null ? null : Number(a.telegram_user_id),
      createdAt: toIso(Number(a.created_at)),
    })),
    jobs: jobs.map((j) => ({
      jobKey: String(j.job_key),
      cursor: Number(j.cursor),
      rowsProcessed: Number(j.rows_processed),
      lastError: (j.last_error as string) ?? null,
      updatedAt: toIso(Number(j.updated_at)),
    })),
  };
}

/* -------------------------------- users -------------------------------- */

export async function searchUsers(
  db: Db,
  opts: { search?: string | null; role?: Role | null; status?: string | null; limit?: NumLike; offset?: NumLike },
) {
  const limit = Math.min(100, Math.max(1, toInt(opts.limit, 25)));
  const offset = Math.max(0, toInt(opts.offset, 0));
  const where: string[] = [];
  const bindings: unknown[] = [];
  if (opts.search) {
    const asNumber = Number(opts.search);
    if (Number.isFinite(asNumber) && asNumber > 0) {
      where.push('(u.telegram_user_id = ? OR u.username LIKE ?)');
      bindings.push(asNumber, `%${opts.search}%`);
    } else {
      where.push("(u.username LIKE ? OR u.first_name LIKE ? OR n.name LIKE ?)");
      bindings.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
    }
  }
  if (opts.role) {
    where.push('u.role = ?');
    bindings.push(opts.role);
  }
  if (opts.status && opts.status !== 'all') {
    where.push('u.status = ?');
    bindings.push(opts.status);
  }
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT u.*, COUNT(n.id) AS nations_count, GROUP_CONCAT(n.name) AS nation_names,
                 MAX(u.last_seen_at) AS last_seen
            FROM users u LEFT JOIN nations n ON n.owner_user_id = u.id AND n.status <> 'dissolved'
           ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
           GROUP BY u.id ORDER BY u.id DESC LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset],
  });
  // same WHERE clause as the page query, without the joins/GROUP BY
  const totalBindings = bindings.slice(0, Math.max(0, bindings.length - 0));
  const total = await db.first<{ c: number }>(
    rowsHaveGroupBy(where)
      ? { sql: `SELECT COUNT(DISTINCT u.id) AS c FROM users u LEFT JOIN nations n ON n.owner_user_id = u.id ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`, bindings: totalBindings }
      : { sql: `SELECT COUNT(*) AS c FROM users u ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`, bindings: totalBindings },
  );
  return {
    rows: rows.map((r) => ({
      id: Number(r.id),
      telegramId: Number(r.telegram_user_id),
      username: (r.username as string) ?? null,
      firstName: (r.first_name as string) ?? null,
      lastName: (r.last_name as string) ?? null,
      role: String(r.role),
      status: String(r.status),
      isPrimaryAdmin: Number(r.is_primary_admin) === 1,
      nationsCount: Number(r.nations_count),
      nationNames: r.nation_names ? String(r.nation_names).split(',') : [],
      createdAt: toIso(Number(r.created_at)),
      lastSeenAt: toIso(r.last_seen === null ? null : Number(r.last_seen)),
    })),
    total: Number(total?.c ?? 0),
  };
}

function rowsHaveGroupBy(where: string[]) {
  return where.some((w) => w.includes('n.name'));
}

export async function setUserStatus(
  db: Db,
  targetUserId: number,
  status: 'active' | 'blocked' | 'disabled',
  reason: string,
  actor: AdminActor,
) {
  const target = await db.first<{ id: number; is_primary_admin: number; status: string }>(
    sql`SELECT id, is_primary_admin, status FROM users WHERE id = ${targetUserId}`,
  );
  if (!target) throw ApiError.notFound('کاربر یافت نشد.');
  if (target.is_primary_admin === 1 && status !== 'active') {
    throw ApiError.forbidden('مدیر اصلی بازی قابل مسدود کردن نیست (برای جلوگیری از قفل شدن پنل).');
  }
  const at = nowSeconds();
  await db.batch([
    sql`UPDATE users SET status = ${status}, updated_at = ${at} WHERE id = ${targetUserId}`,
    sql`UPDATE nations SET status = CASE WHEN ${status} = 'active' THEN CASE WHEN status = 'banned' THEN 'active' ELSE status END ELSE 'banned' END,
                                 updated_at = ${at}
           WHERE owner_user_id = ${targetUserId}`,
    status === 'active'
      ? sql`SELECT NULL`
      : sql`UPDATE sessions SET revoked_at = ${at} WHERE user_id = ${targetUserId} AND revoked_at IS NULL`,
  ]);
  await audit(db, { actor, action: `user.set_status_${status}`, targetType: 'user', targetId: targetUserId, before: { status: target.status }, after: { status }, reason });
  return { status };
}

export async function setUserRole(
  db: Db,
  targetUserId: number,
  role: Role,
  reason: string,
  actor: AdminActor,
) {
  if (!ROLES.includes(role)) throw ApiError.validation('نقش نامعتبر است.');
  const target = await db.first<{ id: number; role: string; is_primary_admin: number }>(
    sql`SELECT id, role, is_primary_admin FROM users WHERE id = ${targetUserId}`,
  );
  if (!target) throw ApiError.notFound('کاربر یافت نشد.');
  if (target.is_primary_admin === 1 && role !== 'super_admin') {
    throw ApiError.forbidden('نقش مدیر اصلی قابل تنزل نیست.');
  }
  const at = nowSeconds();
  await db.batch([
    sql`UPDATE users SET role = ${role}, updated_at = ${at} WHERE id = ${targetUserId}`,
    sql`UPDATE user_roles SET is_active = 0 WHERE user_id = ${targetUserId}`,
    sql`INSERT INTO user_roles (user_id, role, note, granted_by, granted_at, is_active)
         VALUES (${targetUserId}, ${role}, ${reason}, ${actor.userId}, ${at}, 1)
         ON CONFLICT (user_id, role) DO UPDATE SET is_active = 1, granted_at = ${at}, note = ${reason}`,
  ]);
  await db.run(sql`UPDATE sessions SET role = ${role} WHERE user_id = ${targetUserId} AND revoked_at IS NULL`);
  await audit(db, { actor, action: 'user.set_role', targetType: 'user', targetId: targetUserId, before: { role: target.role }, after: { role }, reason });
  return { role };
}

export async function setPermissions(
  db: Db,
  targetUserId: number,
  grants: { resource: AdminSection; read: boolean; write: boolean }[],
  actor: AdminActor,
) {
  if (actor.role !== 'super_admin') throw ApiError.forbidden('فقط Super Admin می‌تواند مجوز تعریف کند.');
  const at = nowSeconds();
  const stmts = grants
    .filter((g) => (ADMIN_SECTIONS as readonly string[]).includes(g.resource))
    .map((g) =>
      sql`INSERT INTO admin_permissions (user_id, resource, can_read, can_write, updated_at)
           VALUES (${targetUserId}, ${g.resource}, ${g.read ? 1 : 0}, ${g.write ? 1 : 0}, ${at})
           ON CONFLICT (user_id, resource) DO UPDATE SET can_read = excluded.can_read, can_write = excluded.can_write, updated_at = ${at}`,
    );
  if (stmts.length) await db.batch(stmts);
  await audit(db, { actor, action: 'roles.set_permissions', targetType: 'user', targetId: targetUserId, after: { grants } });
  return { updated: stmts.length };
}

export async function getPermissions(db: Db, targetUserId: number) {
  const rows = await db.all<{ resource: AdminSection; can_read: number; can_write: number }>(
    sql`SELECT resource, can_read, can_write FROM admin_permissions WHERE user_id = ${targetUserId}`,
  );
  return ADMIN_SECTIONS.map((resource) => {
    const found = rows.find((r) => r.resource === resource);
    return { resource, read: found ? found.can_read === 1 : false, write: found ? found.can_write === 1 : false };
  });
}

/* -------------------------------- nations ------------------------------- */

export async function adminListNations(
  db: Db,
  opts: { search?: string | null; status?: string | null; limit?: NumLike; offset?: NumLike } = {},
) {
  const limit = Math.min(100, Math.max(1, toInt(opts.limit, 25)));
  const offset = Math.max(0, toInt(opts.offset, 0));
  const where: string[] = [];
  const bindings: unknown[] = [];
  if (opts.search) {
    where.push('(n.name LIKE ? OR n.leader_name LIKE ? OR u.telegram_user_id = ?)');
    bindings.push(`%${opts.search}%`, `%${opts.search}%`, Number(opts.search) || 0);
  }
  if (opts.status && opts.status !== 'all') {
    where.push('n.status = ?');
    bindings.push(opts.status);
  }
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT n.*, u.telegram_user_id, u.username, COALESCE(e.net_income,0) AS net_income, COALESCE(e.gross_income,0) AS gross_income,
                 (SELECT COUNT(*) FROM nation_inventory i WHERE i.nation_id = n.id) AS inventory_rows
            FROM nations n
            LEFT JOIN users u ON u.id = n.owner_user_id
            LEFT JOIN nation_economy e ON e.nation_id = n.id
           ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
           ORDER BY n.world_rank ASC, n.id DESC LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset],
  });
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    flag: String(r.flag),
    leaderName: String(r.leader_name),
    status: String(r.status),
    ownerTelegramId: r.telegram_user_id === null ? null : Number(r.telegram_user_id),
    ownerUsername: (r.username as string) ?? null,
    treasury: Number(r.treasury),
    grossIncome: Number(r.gross_income),
    netIncome: Number(r.net_income),
    militaryPower: Number(r.military_power),
    economicScore: Number(r.economic_score),
    worldRank: Number(r.world_rank),
    wins: Number(r.wins_count),
    losses: Number(r.losses_count),
    inventoryRows: Number(r.inventory_rows),
    createdAt: toIso(Number(r.created_at)),
  }));
}

export interface NationPatch {
  name?: string;
  flag?: string;
  leaderName?: string;
  status?: 'active' | 'frozen' | 'banned' | 'at_war' | 'dissolved';
}

export async function adminUpdateNation(
  db: Db,
  nationId: number,
  patch: NationPatch,
  reason: string,
  actor: AdminActor,
  settings: SettingsBundle,
) {
  const nation = await loadNation(db, nationId);
  const at = nowSeconds();
  const sets: string[] = [];
  const bindings: unknown[] = [];
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};

  if (patch.name && patch.name.trim() !== nation.name) {
    const dup = await db.first<{ id: number }>(sql`SELECT id FROM nations WHERE name = ${patch.name.trim()} COLLATE NOCASE AND id <> ${nationId}`);
    if (dup) throw ApiError.conflict('این نام کشور قبلاً ثبت شده است.');
    sets.push('name = ?');
    bindings.push(patch.name.trim());
    before.name = nation.name;
    after.name = patch.name.trim();
  }
  if (patch.flag && patch.flag.trim() && patch.flag !== nation.flag) {
    sets.push('flag = ?');
    bindings.push(patch.flag.trim());
    before.flag = nation.flag;
    after.flag = patch.flag.trim();
  }
  if (patch.leaderName && patch.leaderName.trim() !== nation.leader_name) {
    sets.push('leader_name = ?');
    bindings.push(patch.leaderName.trim());
    before.leaderName = nation.leader_name;
    after.leaderName = patch.leaderName.trim();
  }
  if (patch.status && patch.status !== nation.status) {
    if (patch.status === 'dissolved') throw ApiError.validation('برای انحلال کشور از endpoint حذف با تأیید نهایی استفاده کنید.');
    sets.push('status = ?');
    bindings.push(patch.status);
    before.status = nation.status;
    after.status = patch.status;
  }
  if (sets.length === 0) throw ApiError.validation('تغییری ارسال نشده است.');
  sets.push('updated_at = ?');
  bindings.push(at, nationId);

  await db.run({ sql: `UPDATE nations SET ${sets.join(', ')} WHERE id = ?`, bindings });
  await db.run(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('admin', 'تغییر کشور توسط مدیر', ${`${nation.name}: ${Object.keys(after).join('، ')} — دلیل: ${reason}`}, 'global', ${nationId}, ${at})`,
  );
  await refreshNationStats(db, { ...nation, ...after } as NationRow, settings);
  await audit(db, { actor, action: 'nation.admin_update', targetType: 'nation', targetId: nationId, before, after, reason });
  return { updated: Object.keys(after) };
}

/**
 * Hard delete with an explicit confirmation string. Financial records and audit
 * rows are kept (append-only); inventory and economy rows cascade away.
 */
export async function adminDeleteNation(db: Db, nationId: number, confirmText: string, reason: string, actor: AdminActor) {
  if (confirmText !== `DELETE-${nationId}`) {
    throw ApiError.validation(`برای حذف باید عبارت «DELETE-${nationId}» ارسال شود.`);
  }
  const nation = await loadNation(db, nationId);
  const at = nowSeconds();
  const stmts: { sql: string; bindings: readonly unknown[] }[] = [
    sql`UPDATE wars SET status = 'stopped_by_admin', ended_at = ${at}, outcome_summary = ${'کشور حذف شد.'} WHERE status IN ('proposed','accepted','active','peace_requested') AND (attacker_nation_id = ${nationId} OR defender_nation_id = ${nationId})`,
    sql`UPDATE diplomatic_requests SET status = 'cancelled', handled_at = ${at} WHERE status = 'pending' AND (from_nation_id = ${nationId} OR to_nation_id = ${nationId})`,
    sql`UPDATE alliances SET status = 'disbanded', disbanded_at = ${at} WHERE leader_nation_id = ${nationId}`,
    sql`DELETE FROM alliance_members WHERE nation_id = ${nationId}`,
    sql`INSERT INTO audit_logs (actor_user_id, actor_telegram_id, action, target_type, target_id, before_json, after_json, reason, created_at)
         VALUES (${actor.userId}, ${actor.telegramId}, 'nation.delete', 'nation', ${nationId},
                 ${JSON.stringify({ name: nation.name, treasury: nation.treasury })}, ${JSON.stringify({ deleted: true })}, ${reason}, ${at})`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key, reference_type, reference_id, reason, created_by_user_id, created_at)
         VALUES (${uuid()}, ${nationId}, 'admin_correction', 0, ${nation.treasury}, 0, 'coin', ${`del:${nationId}:${at}`},
                 'nation', ${nationId}, ${`حذف کشور — ${reason}`}, ${actor.userId}, ${at})`,
    // a nation is DISSOLVED, never hard-deleted: transactions.nation_id is ON DELETE RESTRICT
    // on purpose, so the financial history of a country can never disappear with it.
    sql`UPDATE nations SET status = 'dissolved', treasury = 0, military_power = 0, total_score = 0, world_rank = 0,
                           equipment_count = 0, troops_count = 0, updated_at = ${at}
          WHERE id = ${nationId}`,
    sql`DELETE FROM nation_inventory WHERE nation_id = ${nationId}`,
    sql`DELETE FROM bot_flow_states WHERE nation_id = ${nationId}`,
  ];
  await db.batch(stmts);
  return { deleted: true, dissolved: true, nationId, name: nation.name };
}

/* ------------------------------- inventory ------------------------------ */

export async function adminAdjustInventory(
  db: Db,
  nationId: number,
  templateId: number,
  delta: number,
  reason: string,
  settings: SettingsBundle,
  actor: AdminActor,
) {
  if (!Number.isInteger(delta) || delta === 0) throw ApiError.validation('مقدار تغییر نامعتبر است.');
  if (reason.trim().length < 3) throw ApiError.validation('ذکر دلیل الزامی است.');
  const nation = await loadNation(db, nationId);
  const tpl = await db.first<{ id: number; name_fa: string }>(sql`SELECT id, name_fa FROM equipment_templates WHERE id = ${templateId}`);
  if (!tpl) throw ApiError.notFound('تجهیزات یافت نشد.');
  const at = nowSeconds();
  try {
    await db.batch([
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
           VALUES (${nationId}, ${templateId}, ${Math.max(0, delta)}, ${at}, ${at})
           ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = MAX(0, quantity + ${delta}), updated_at = ${at}`,
    ]);
  } catch (e) {
    throw ApiError.validation(`تغییر ناممکن: ${e instanceof Error ? e.message : 'خطا'}`);
  }
  await audit(db, {
    actor,
    action: 'nation.adjust_inventory',
    targetType: 'nation',
    targetId: nationId,
    after: { templateId, delta, nameFa: tpl.name_fa },
    reason: reason.trim(),
  });
  await refreshNationStats(db, nation, settings);
  const after = await db.first<{ quantity: number }>(
    sql`SELECT quantity FROM nation_inventory WHERE nation_id = ${nationId} AND template_id = ${templateId}`,
  );
  return { quantity: Number(after?.quantity ?? 0) };
}

/* ---------------------------- equipment / shop --------------------------- */

export async function adminListEquipment(
  db: Db,
  opts: { categoryKey?: string | null; search?: string | null; onlyUnpriced?: boolean; limit?: NumLike; offset?: NumLike } = {},
) {
  const limit = Math.min(200, Math.max(1, toInt(opts.limit, 100)));
  const offset = Math.max(0, toInt(opts.offset, 0));
  const where: string[] = [];
  const bindings: unknown[] = [];
  if (opts.categoryKey && opts.categoryKey !== 'all') {
    where.push('c.key = ?');
    bindings.push(opts.categoryKey);
  }
  if (opts.search) {
    where.push('(t.name_fa LIKE ? OR t.code LIKE ?)');
    bindings.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.onlyUnpriced) where.push('t.price IS NULL');
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT t.*, c.key AS category_key, c.label_fa AS category_label, c.emoji,
                 (SELECT COUNT(*) FROM nation_inventory i WHERE i.template_id = t.id) AS holder_count,
                 (SELECT COALESCE(SUM(i.quantity),0) FROM nation_inventory i WHERE i.template_id = t.id) AS total_owned,
                 (SELECT COALESCE(SUM(ti.total_price),0) FROM transaction_items ti JOIN transactions tx ON tx.id = ti.transaction_id WHERE ti.template_id = t.id AND tx.type = 'purchase') AS total_revenue,
                 (SELECT COALESCE(SUM(ti.quantity),0) FROM transaction_items ti JOIN transactions tx ON tx.id = ti.transaction_id WHERE ti.template_id = t.id AND tx.type = 'purchase') AS total_sold
            FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
           ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
           ORDER BY c.sort_order, t.name_fa LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset],
  });
  return rows.map((r) => ({
    id: Number(r.id),
    code: String(r.code),
    nameFa: String(r.name_fa),
    unitFa: String(r.unit_fa),
    categoryKey: String(r.category_key),
    categoryLabel: String(r.category_label),
    emoji: String(r.emoji),
    price: r.price === null ? null : Number(r.price),
    priceSet: r.price !== null,
    attackPoints: r.attack_points === null ? null : Number(r.attack_points),
    defensePoints: r.defense_points === null ? null : Number(r.defense_points),
    description: String(r.description ?? ''),
    isActive: Number(r.is_active) === 1,
    isForSale: Number(r.is_for_sale) === 1,
    purchaseLimitPerCycle: r.purchase_limit_per_cycle === null ? null : Number(r.purchase_limit_per_cycle),
    maintenancePerUnit: r.maintenance_per_unit === null ? null : Number(r.maintenance_per_unit),
    holderCount: Number(r.holder_count),
    totalOwned: Number(r.total_owned),
    totalRevenue: Number(r.total_revenue),
    totalSold: Number(r.total_sold),
    updatedAt: toIso(Number(r.updated_at)),
  }));
}

export async function adminUpsertEquipment(db: Db, input: Record<string, unknown>, actor: AdminActor) {
  const category = await db.first<{ id: number }>(sql`SELECT id FROM equipment_categories WHERE key = ${String(input.categoryKey)} COLLATE NOCASE`);
  if (!category) throw ApiError.validation('دسته‌بندی نامعتبر است.');
  const at = nowSeconds();
  const price = input.price === null || input.price === undefined || input.price === '' ? null : Number(input.price);
  if (price !== null && (!Number.isFinite(price) || price <= 0)) throw ApiError.validation('قیمت باید عدد صحیح بزرگ‌تر از صفر باشد (قیمت نامشخص = NULL).');
  const payload = {
    category_id: category.id,
    code: String(input.code),
    name_fa: String(input.nameFa),
    unit_fa: String(input.unitFa),
    price,
    attack_points: input.attackPoints === null || input.attackPoints === undefined || input.attackPoints === '' ? null : Number(input.attackPoints),
    defense_points: input.defensePoints === null || input.defensePoints === undefined || input.defensePoints === '' ? null : Number(input.defensePoints),
    description: String(input.descriptionFa ?? ''),
    is_active: input.isActive === false ? 0 : 1,
    is_for_sale: input.isForSale === false ? 0 : 1,
    purchase_limit_per_cycle: !input.purchaseLimitPerCycle ? null : Number(input.purchaseLimitPerCycle),
    maintenance_per_unit: input.maintenancePerUnit === null || input.maintenancePerUnit === undefined || input.maintenancePerUnit === '' ? null : Number(input.maintenancePerUnit),
    updated_at: at,
  };
  if (input.id) {
    const id = Number(input.id);
    const before = await db.first<Record<string, unknown>>(sql`SELECT * FROM equipment_templates WHERE id = ${id}`);
    if (!before) throw ApiError.notFound('تجهیزات یافت نشد.');
    await db.run({
      sql: `UPDATE equipment_templates SET ${Object.keys(payload).map((k) => `${k} = ?`).join(', ')} WHERE id = ?`,
      bindings: [...Object.values(payload), id],
    });
    await audit(db, { actor, action: 'shop.update_equipment', targetType: 'equipment_template', targetId: id, before, after: payload });
    return { id, created: false };
  }
  const created = await db.first<{ id: number }>(
    sql`INSERT INTO equipment_templates (category_id, code, name_fa, unit_fa, price, attack_points, defense_points, description,
                                         is_active, is_for_sale, purchase_limit_per_cycle, maintenance_per_unit, created_at, updated_at)
         VALUES (${payload.category_id}, ${payload.code}, ${payload.name_fa}, ${payload.unit_fa}, ${payload.price},
                 ${payload.attack_points}, ${payload.defense_points}, ${payload.description}, ${payload.is_active},
                 ${payload.is_for_sale}, ${payload.purchase_limit_per_cycle}, ${payload.maintenance_per_unit}, ${at}, ${at})
         RETURNING id`,
  );
  const id = Number(created?.id ?? 0);
  await audit(db, { actor, action: 'shop.create_equipment', targetType: 'equipment_template', targetId: id, after: payload });
  return { id, created: true };
}

export async function adminSetPricesBulk(db: Db, items: { templateId: number; price: number | null }[], actor: AdminActor) {
  if (items.length === 0) throw ApiError.validation('هیچ قیمتی ارسال نشده است.');
  const at = nowSeconds();
  const stmts = items.map((i) => {
    if (i.price !== null && (!Number.isInteger(i.price) || i.price <= 0)) {
      throw ApiError.validation('قیمت باید عدد صحیح مثبت یا NULL (تعیین‌نشده) باشد.');
    }
    return sql`UPDATE equipment_templates SET price = ${i.price}, updated_at = ${at} WHERE id = ${i.templateId}`;
  });
  await db.batch(stmts);
  await audit(db, { actor, action: 'shop.set_prices_bulk', targetType: 'equipment_template', after: { count: items.length } });
  return { updated: items.length };
}

export async function adminDeleteEquipment(db: Db, templateId: number, actor: AdminActor) {
  const holders = await db.first<{ c: number }>(sql`SELECT COUNT(*) AS c FROM nation_inventory WHERE template_id = ${templateId} AND quantity > 0`);
  if (Number(holders?.c ?? 0) > 0) {
    throw ApiError.conflict('این تجهیزات در انبار کشورها وجود دارد؛ به‌جای حذف، آن را از فروش غیرفعال کنید.');
  }
  const tpl = await db.first<{ name_fa: string }>(sql`SELECT name_fa FROM equipment_templates WHERE id = ${templateId}`);
  if (!tpl) throw ApiError.notFound('تجهیزات یافت نشد.');
  await db.batch([
    sql`DELETE FROM starter_template_items WHERE equipment_template_id = ${templateId}`,
    sql`UPDATE equipment_templates SET is_active = 0, is_for_sale = 0, updated_at = ${nowSeconds()} WHERE id = ${templateId}`,
  ]);
  await audit(db, { actor, action: 'shop.deactivate_equipment', targetType: 'equipment_template', targetId: templateId, after: { nameFa: tpl.name_fa } });
  return { deactivated: true };
}

export async function adminUpsertCategory(db: Db, input: { key: string; labelFa: string; shopLabelFa: string; emoji: string; role: string; sortOrder?: number; isActive?: boolean; powerWeight?: number }, actor: AdminActor) {
  const at = nowSeconds();
  const exists = await db.first<{ id: number }>(sql`SELECT id FROM equipment_categories WHERE key = ${input.key} COLLATE NOCASE`);
  if (exists) {
    await db.run(
      sql`UPDATE equipment_categories SET label_fa = ${input.labelFa}, shop_label_fa = ${input.shopLabelFa}, emoji = ${input.emoji},
                 role = ${input.role}, sort_order = ${input.sortOrder ?? 999}, is_active = ${input.isActive === false ? 0 : 1},
                 power_weight = ${input.powerWeight ?? 0}, updated_at = ${at}
           WHERE id = ${exists.id}`,
    );
    await audit(db, { actor, action: 'shop.update_category', targetType: 'category', targetId: exists.id, after: input });
    return { id: exists.id, created: false };
  }
  const created = await db.first<{ id: number }>(
    sql`INSERT INTO equipment_categories (key, label_fa, shop_label_fa, emoji, role, sort_order, is_active, power_weight, created_at, updated_at)
         VALUES (${input.key}, ${input.labelFa}, ${input.shopLabelFa}, ${input.emoji}, ${input.role}, ${input.sortOrder ?? 999},
                 ${input.isActive === false ? 0 : 1}, ${input.powerWeight ?? 0}, ${at}, ${at}) RETURNING id`,
  );
  await audit(db, { actor, action: 'shop.create_category', targetType: 'category', targetId: Number(created?.id ?? 0), after: input });
  return { id: Number(created?.id ?? 0), created: true };
}

export async function adminSetCategoryWeights(db: Db, weights: Record<string, number>, actor: AdminActor) {
  const at = nowSeconds();
  const stmts = Object.entries(weights).map(([key, weight]) => {
    const value = Number(weight);
    if (!Number.isFinite(value) || value < 0 || value > 100000) throw ApiError.validation(`وزن نامعتبر برای ${key}`);
    return sql`UPDATE equipment_categories SET power_weight = ${value}, updated_at = ${at} WHERE key = ${key} COLLATE NOCASE`;
  });
  if (stmts.length === 0) throw ApiError.validation('هیچ وزنی ارسال نشده است.');
  await db.batch(stmts);
  await audit(db, { actor, action: 'settings.category_weights', after: weights });
  return { updated: stmts.length };
}

export async function adminListCategories(db: Db) {
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT c.*, COUNT(t.id) AS templates,
               SUM(CASE WHEN t.price IS NOT NULL THEN 1 ELSE 0 END) AS priced
          FROM equipment_categories c LEFT JOIN equipment_templates t ON t.category_id = c.id
         GROUP BY c.id ORDER BY c.sort_order`,
  );
  return rows.map((r) => ({
    id: Number(r.id),
    key: String(r.key),
    labelFa: String(r.label_fa),
    shopLabelFa: String(r.shop_label_fa),
    emoji: String(r.emoji),
    role: String(r.role),
    sortOrder: Number(r.sort_order),
    isActive: Number(r.is_active) === 1,
    powerWeight: Number(r.power_weight),
    templates: Number(r.templates),
    priced: Number(r.priced ?? 0),
    unpriced: Number(r.templates) - Number(r.priced ?? 0),
  }));
}

/* ----------------------------- starter templates ------------------------- */

export async function adminListStarterTemplates(db: Db) {
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT s.*, COUNT(i.id) AS item_count, COALESCE(SUM(i.quantity),0) AS total_units,
               (SELECT COUNT(*) FROM nations n WHERE n.starter_template_id = s.id) AS used_by
          FROM starter_templates s LEFT JOIN starter_template_items i ON i.starter_template_id = s.id
         GROUP BY s.id ORDER BY s.is_default DESC, s.id`,
  );
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    description: (r.description as string) ?? null,
    treasury: Number(r.treasury),
    factoryIncome: Number(r.factory_income),
    mineIncome: Number(r.mine_income),
    totalIncome: Number(r.factory_income) + Number(r.mine_income),
    incomeCycleSeconds: Number(r.income_cycle_seconds),
    isDefault: Number(r.is_default) === 1,
    isActive: Number(r.is_active) === 1,
    itemCount: Number(r.item_count),
    totalUnits: Number(r.total_units),
    usedBy: Number(r.used_by),
  }));
}

export async function adminUpsertStarterTemplate(
  db: Db,
  input: {
    id?: number;
    name: string;
    treasury: number;
    factoryIncome: number;
    mineIncome: number;
    incomeCycleSeconds: number;
    setAsDefault?: boolean;
    items?: { templateId: number; quantity: number }[];
  },
  actor: AdminActor,
) {
  if (input.name.trim().length < 2) throw ApiError.validation('نام بسته حداقل ۲ نویسه باید باشد.');
  const at = nowSeconds();
  let id = Number(input.id ?? 0);
  if (id) {
    const exists = await db.first<{ id: number }>(sql`SELECT id FROM starter_templates WHERE id = ${id}`);
    if (!exists) throw ApiError.notFound('بسته اولیه یافت نشد.');
    await db.run(
      sql`UPDATE starter_templates SET name = ${input.name.trim()}, treasury = ${input.treasury}, factory_income = ${input.factoryIncome},
                 mine_income = ${input.mineIncome}, income_cycle_seconds = ${input.incomeCycleSeconds}, updated_at = ${at}
           WHERE id = ${id}`,
    );
  } else {
    const created = await db.first<{ id: number }>(
      sql`INSERT INTO starter_templates (name, treasury, factory_income, mine_income, income_cycle_seconds, is_default, is_active, created_at, updated_at)
           VALUES (${input.name.trim()}, ${input.treasury}, ${input.factoryIncome}, ${input.mineIncome}, ${input.incomeCycleSeconds}, 0, 1, ${at}, ${at})
           RETURNING id`,
    );
    id = Number(created?.id ?? 0);
  }
  if (input.items) {
    await db.run(sql`DELETE FROM starter_template_items WHERE starter_template_id = ${id}`);
    const stmts = input.items
      .filter((i) => Number(i.quantity) > 0)
      .map((i) =>
        sql`INSERT INTO starter_template_items (starter_template_id, equipment_template_id, quantity)
             VALUES (${id}, ${i.templateId}, ${i.quantity}) ON CONFLICT (starter_template_id, equipment_template_id) DO UPDATE SET quantity = ${i.quantity}`,
      );
    if (stmts.length) await db.batch(stmts);
  }
  if (input.setAsDefault) {
    await db.batch([
      sql`UPDATE starter_templates SET is_default = 0 WHERE id <> ${id}`,
      sql`UPDATE starter_templates SET is_default = 1, is_active = 1 WHERE id = ${id}`,
    ]);
  }
  await audit(db, { actor, action: 'settings.starter_template', targetType: 'starter_template', targetId: id, after: { name: input.name, treasury: input.treasury, items: input.items?.length ?? 0 } });
  return { id };
}

/* ------------------------------- backup --------------------------------- */

const EXPORT_TABLES = [
  'users',
  'nations',
  'nation_settings',
  'nation_economy',
  'nation_inventory',
  'equipment_categories',
  'equipment_templates',
  'transactions',
  'transaction_items',
  'revenue_cycles',
  'wars',
  'battles',
  'battle_reports',
  'diplomatic_relations',
  'diplomatic_requests',
  'alliances',
  'alliance_members',
  'statements',
  'announcements',
  'notifications',
  'game_settings',
  'economy_settings',
  'user_roles',
  'admin_permissions',
  'starter_templates',
  'starter_template_items',
  'nation_stat_history',
  'scheduled_events',
] as const;

export const BACKUP_TABLES = EXPORT_TABLES;

/**
 * JSON export of the game state (streamed table by table). Used by the admin
 * panel's download button and by `scripts/backup.mjs`.
 */
export async function exportBackup(db: Db, opts: { tables?: string[] | null; since?: number | null } = {}) {
  const tables = (opts.tables?.length ? opts.tables : EXPORT_TABLES).filter((t) => (EXPORT_TABLES as readonly string[]).includes(t));
  const out: Record<string, unknown[]> = {};
  for (const table of tables) {
    const sinceClause = opts.since ? `WHERE created_at >= ${Number(opts.since)}` : '';
    const rows = await db.all<Record<string, unknown>>({
      sql: `SELECT * FROM ${table} ${sinceClause} ORDER BY rowid LIMIT 5000`,
      bindings: [],
    });
    out[table] = rows;
  }
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      tables: Object.keys(out).map((t) => ({ table: t, rows: (out[t] as unknown[]).length })),
      note: 'برای بکاپ کامل و رسمی D1 از «D1 backups» در داشبورد Cloudflare یا wrangler d1 export استفاده کنید.',
    },
    data: out,
  };
}

export async function listBackupRuns(db: Db, limit = 20) {
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT id, action, target_type, target_id, reason, created_at, after_json
          FROM audit_logs WHERE action IN ('backup.export','backup.restore','backup.import') ORDER BY id DESC LIMIT ${Math.min(50, Math.max(1, limit))}`,
  );
  return rows.map((r) => ({
    id: Number(r.id),
    action: String(r.action),
    reason: (r.reason as string) ?? null,
    createdAt: toIso(Number(r.created_at)),
    detail: safeJson(r.after_json),
  }));
}

function safeJson(v: unknown) {
  try {
    return v ? JSON.parse(String(v)) : null;
  } catch {
    return null;
  }
}

export async function logBackupRun(db: Db, action: 'backup.export' | 'backup.restore', tables: number, actor: AdminActor, reason?: string) {
  await markJob(db, `backup:${action}`, { cursor: Date.now(), rowsProcessed: tables });
  await audit(db, {
    actor,
    action,
    targetType: 'backup',
    after: { tables, at: new Date().toISOString() },
    reason: reason ?? null,
  });
}

/** last-credit telemetry, used by the admin overview + player settings */
export async function revenueHealth(db: Db) {
  const row = await db.first<{ pending: number; credited: number; oldest: number | null }>(
    sql`SELECT SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
               SUM(CASE WHEN status = 'credited' THEN 1 ELSE 0 END) AS credited,
               MIN(computed_at) AS oldest
          FROM revenue_cycles WHERE status = 'pending'`,
  );
  return {
    pendingCycles: Number(row?.pending ?? 0),
    creditedCycles: Number(row?.credited ?? 0),
    oldestPendingAt: row?.oldest ? toIso(Number(row.oldest)) : null,
  };
}
