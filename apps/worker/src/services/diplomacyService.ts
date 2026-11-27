import { RELATION_LABELS_FA, type RelationStatus } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso } from '../core/format';
import type { SettingsBundle } from '../core/settings';
import { type NationRow } from '../db/queries';
import { audit } from './auditService';
import { notify } from './notificationService';

export type RequestKind = 'friendship' | 'alliance' | 'peace' | 'non_aggression' | 'war' | 'message' | 'dissolve';

const MUTUAL_FOR = new Set<RequestKind>(['friendship', 'non_aggression']);

/** send a diplomacy request (friendship / alliance / peace / non-aggression / message) */
export async function sendRequest(
  db: Db,
  from: NationRow,
  input: { toNationId: number; kind: RequestKind; message?: string | null; allianceName?: string | null },
  settings: SettingsBundle,
  botToken?: string,
) {
  if (!settings.features.diplomacyEnabled) throw ApiError.disabled('دیپلماسی');
  if (from.id === input.toNationId) throw ApiError.forbidden('ارسال درخواست به خودتان مجاز نیست.');
  if (input.kind === 'war') throw ApiError.validation('برای اعلام جنگ از بخش «جنگ» استفاده کنید.');
  if (input.kind === 'peace') throw ApiError.validation('درخواست صلح باید روی جنگ فعال ثبت شود.');

  const to = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${input.toNationId}`);
  if (!to || to.status === 'dissolved') throw ApiError.notFound('کشور مقصد یافت نشد.');
  if (to.status === 'banned' || to.status === 'frozen') throw ApiError.forbidden('این کشور در وضعیت فعال نیست.');

  const pendingCount = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM diplomatic_requests WHERE (from_nation_id = ${from.id} OR to_nation_id = ${from.id}) AND status = 'pending'`,
  );
  if (Number(pendingCount?.c ?? 0) >= settings.diplomacy.maxPendingRequestsPerNation) {
    throw ApiError.rateLimited('تعداد درخواست‌های در انتظار شما به سقف رسیده است.');
  }
  if (input.kind === 'friendship') {
    const friends = await db.first<{ c: number }>(
      sql`SELECT COUNT(*) AS c FROM diplomatic_relations WHERE nation_id = ${from.id} AND status = 'friend'`,
    );
    if (Number(friends?.c ?? 0) >= settings.diplomacy.maxFriends) throw ApiError.conflict('به سقف تعداد متحدان/دوستان رسیده‌اید.');
  }

  const at = nowSeconds();
  const req = await db.first<{ id: number }>(
    sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, alliance_name, message, expires_at, created_at)
         VALUES (${input.kind}, 'pending', ${from.id}, ${input.toNationId}, ${input.allianceName ?? null},
                 ${input.message ? String(input.message).slice(0, 600) : null},
                 ${at + settings.diplomacy.requestExpirySeconds}, ${at})
         RETURNING id`,
  );
  await notify(db, {
    nationId: input.toNationId,
    kind: `diplomacy_${input.kind}`,
    title: `🌐 درخواست جدید: ${kindLabel(input.kind)}`,
    body: `${from.flag} ${from.name}: ${input.message || '(بدون پیام)'}`,
    data: { requestId: req?.id },
    telegram: botToken ? { botToken, chatId: to.owner_user_id, text: `🌐 ${from.name} درخواست ${kindLabel(input.kind)} فرستاد.` } : null,
  });
  return { requestId: Number(req?.id ?? 0), status: 'pending' as const };
}

function kindLabel(kind: RequestKind) {
  return (
    {
      friendship: 'دوستی',
      alliance: 'اتحاد',
      peace: 'صلح',
      non_aggression: 'پیمان عدم تجاوز',
      war: 'جنگ',
      message: 'پیام دیپلماتیک',
      dissolve: 'لغو روابط',
    } as Record<RequestKind, string>
  )[kind];
}

export async function listIncoming(db: Db, nationId: number, status = 'pending') {
  return db.all<Record<string, unknown>>(
    sql`SELECT r.*, f.name AS from_name, f.flag AS from_flag, t.name AS to_name, t.flag AS to_flag
          FROM diplomatic_requests r
          JOIN nations f ON f.id = r.from_nation_id
          JOIN nations t ON t.id = r.to_nation_id
         WHERE r.to_nation_id = ${nationId} AND r.status = ${status}
         ORDER BY r.id DESC LIMIT 50`,
  );
}

export async function listOutgoing(db: Db, nationId: number, status = 'pending') {
  return db.all<Record<string, unknown>>(
    sql`SELECT r.*, f.name AS from_name, f.flag AS from_flag, t.name AS to_name, t.flag AS to_flag
          FROM diplomatic_requests r
          JOIN nations f ON f.id = r.from_nation_id
          JOIN nations t ON t.id = r.to_nation_id
         WHERE r.from_nation_id = ${nationId} AND r.status = ${status}
         ORDER BY r.id DESC LIMIT 50`,
  );
}

export async function cancelRequest(db: Db, requestId: number, nation: NationRow) {
  const row = await db.first<{ id: number; from_nation_id: number; status: string }>(
    sql`SELECT id, from_nation_id, status FROM diplomatic_requests WHERE id = ${requestId}`,
  );
  if (!row) throw ApiError.notFound('درخواست یافت نشد.');
  if (row.from_nation_id !== nation.id) throw ApiError.forbidden('فقط فرستنده می‌تواند درخواست را لغو کند.');
  if (row.status !== 'pending') throw ApiError.conflict('این درخواست دیگر در انتظار نیست.');
  await db.run(sql`UPDATE diplomatic_requests SET status = 'cancelled', handled_at = ${nowSeconds()} WHERE id = ${requestId}`);
  return { status: 'cancelled' };
}

/** accept / reject an incoming request — the only place relations change by consent */
export async function decideRequest(
  db: Db,
  requestId: number,
  me: NationRow,
  accept: boolean,
  settings: SettingsBundle,
  actor: { userId: number; telegramId: number },
  botToken?: string,
) {
  const req = await db.first<Record<string, unknown>>(
    sql`SELECT r.*, f.name AS from_name, f.flag AS from_flag FROM diplomatic_requests r
          JOIN nations f ON f.id = r.from_nation_id WHERE r.id = ${requestId}`,
  );
  if (!req) throw ApiError.notFound('درخواست یافت نشد.');
  if (Number(req.to_nation_id) !== me.id) throw ApiError.forbidden('این درخواست برای کشور شما نیست.');
  if (req.status !== 'pending') throw ApiError.conflict('این درخواست قبلاً رسیدگی شده است.');
  const at = nowSeconds();
  const fromId = Number(req.from_nation_id);
  const kind = String(req.kind) as RequestKind;
  const expires = Number(req.expires_at ?? 0);
  if (expires && expires < at) {
    await db.run(sql`UPDATE diplomatic_requests SET status = 'expired', handled_at = ${at} WHERE id = ${requestId}`);
    throw ApiError.conflict('این درخواست منقضی شده است.');
  }

  if (!accept) {
    await db.run(sql`UPDATE diplomatic_requests SET status = 'rejected', handled_at = ${at} WHERE id = ${requestId}`);
    await notify(db, { nationId: fromId, kind: 'diplomacy_rejected', title: '❌ درخواست رد شد', body: `${me.flag} ${me.name} درخواست ${kindLabel(kind)} را رد کرد.` });
    return { status: 'rejected' };
  }

  const stmts: { sql: string; bindings: readonly unknown[] }[] = [
    sql`UPDATE diplomatic_requests SET status = 'accepted', handled_at = ${at} WHERE id = ${requestId}`,
  ];
  let allianceId: number | null = null;

  if (kind === 'friendship' || kind === 'non_aggression') {
    const status: RelationStatus = kind === 'friendship' ? 'friend' : 'peace_treaty';
    stmts.push(
      sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
           VALUES (${me.id}, ${fromId}, ${status}, ${at}, ${at})
           ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = ${status}, updated_at = ${at}`,
      sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
           VALUES (${fromId}, ${me.id}, ${status}, ${at}, ${at})
           ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = ${status}, updated_at = ${at}`,
      sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
           VALUES ('news', ${MUTUAL_FOR.has(kind) ? 'تغییر روابط دیپلماتیک' : 'روابط دیپلماتیک'},
                   ${`${me.flag} ${me.name} و ${req.from_flag} ${req.from_name}: ${RELATION_LABELS_FA[status]}`}, 'global', ${me.id}, ${at})`,
    );
  } else if (kind === 'alliance') {
    const existing = await db.first<{ alliance_id: number }>(
      sql`SELECT alliance_id FROM alliance_members WHERE nation_id = ${fromId} LIMIT 1`,
    );
    if (existing) {
      allianceId = Number(existing.alliance_id);
      const size = await db.first<{ c: number }>(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE alliance_id = ${allianceId}`);
      if (Number(size?.c ?? 0) >= settings.diplomacy.maxAllianceMembers) throw ApiError.conflict('ظرفیت اعضای این اتحاد تکمیل شده است.');
      const meAlready = await db.first<{ c: number }>(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE nation_id = ${me.id}`);
      if (Number(meAlready?.c ?? 0) > 0) throw ApiError.conflict('کشور شما عضو یک اتحاد دیگر است.');
      stmts.push(
        sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${me.id}, 'member', ${at})
             ON CONFLICT (alliance_id, nation_id) DO NOTHING`,
      );
    } else {
      const name = String(req.alliance_name || `اتحاد ${String(req.from_name)}`).slice(0, 40);
      const created = await db.first<{ id: number }>(
        sql`INSERT INTO alliances (name, leader_nation_id, status, created_by, created_at)
             VALUES (${name}, ${fromId}, 'active', NULL, ${at}) RETURNING id`,
      );
      allianceId = Number(created?.id ?? 0);
      stmts.push(
        sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${fromId}, 'leader', ${at})
             ON CONFLICT (alliance_id, nation_id) DO NOTHING`,
        sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${me.id}, 'member', ${at})
             ON CONFLICT (alliance_id, nation_id) DO NOTHING`,
        sql`UPDATE alliances SET name = ${name} WHERE id = ${allianceId}`,
        sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
             VALUES ('alliance', 'اتحاد جدید تشکیل شد', ${`🤝 اتحاد «${name}» میان ${req.from_name} و ${me.name}.`}, 'global', ${fromId}, ${at})`,
      );
    }
    stmts.push(
      sql`UPDATE diplomatic_relations SET status = 'ally', alliance_id = ${allianceId}, updated_at = ${at}
           WHERE nation_id = ${me.id} AND other_nation_id = ${fromId}`,
      sql`UPDATE diplomatic_relations SET status = 'ally', alliance_id = ${allianceId}, updated_at = ${at}
           WHERE nation_id = ${fromId} AND other_nation_id = ${me.id}`,
    );
  } else if (kind === 'dissolve') {
    stmts.push(
      sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
           WHERE nation_id = ${me.id} AND other_nation_id = ${fromId}`,
      sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
           WHERE nation_id = ${fromId} AND other_nation_id = ${me.id}`,
    );
  } else if (kind === 'peace') {
    throw ApiError.validation('صلح از طریق جنگ ثبت می‌شود.');
  }

  await db.batch(stmts);
  await notify(db, {
    nationId: fromId,
    kind: 'diplomacy_accepted',
    title: '✅ درخواست پذیرفته شد',
    body: `${me.flag} ${me.name} درخواست ${kindLabel(kind)} را پذیرفت.`,
    data: { allianceId },
    telegram: botToken ? { botToken, chatId: Number(fromId), text: `✅ ${me.name} درخواست شما را پذیرفت.` } : null,
  });
  await audit(db, { actor, action: `diplomacy.accept_${kind}`, targetType: 'nation', targetId: me.id, after: { requestId, fromId } });
  return { status: 'accepted', allianceId };
}

export async function listRelations(db: Db, nationId: number) {
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT r.status, r.updated_at, r.alliance_id, o.id AS other_id, o.name AS other_name, o.flag AS other_flag,
               o.leader_name AS other_leader, a.name AS alliance_name, o.treasury, o.military_power, o.world_rank
          FROM diplomatic_relations r
          JOIN nations o ON o.id = r.other_nation_id
          LEFT JOIN alliances a ON a.id = r.alliance_id
         WHERE r.nation_id = ${nationId}
         ORDER BY CASE r.status WHEN 'ally' THEN 0 WHEN 'friend' THEN 1 WHEN 'negotiating' THEN 2 WHEN 'peace_treaty' THEN 3 WHEN 'enemy' THEN 4 ELSE 5 END, o.world_rank`,
  );
  return rows.map((r) => ({
    otherNationId: Number(r.other_id),
    otherNationName: String(r.other_name),
    otherFlag: String(r.other_flag),
    otherLeaderName: String(r.other_leader),
    otherTreasury: Number(r.treasury),
    otherMilitaryPower: Number(r.military_power),
    otherWorldRank: Number(r.world_rank),
    status: String(r.status),
    statusLabelFa: RELATION_LABELS_FA[r.status as RelationStatus] ?? String(r.status),
    since: toIso(Number(r.updated_at)),
    allianceId: r.alliance_id === null ? null : Number(r.alliance_id),
    allianceName: (r.alliance_name as string) ?? null,
  }));
}

/** player-initiated dissolve (needs the other side's consent through a request) */
export async function dissolveRelation(db: Db, me: NationRow, otherNationId: number, settings: SettingsBundle, botToken?: string) {
  const rel = await db.first<{ id: number; status: string }>(
    sql`SELECT id, status FROM diplomatic_relations WHERE nation_id = ${me.id} AND other_nation_id = ${otherNationId}`,
  );
  if (!rel) throw ApiError.notFound('رابطه‌ای ثبت نشده است.');
  const at = nowSeconds();
  if (rel.status === 'ally') {
    await db.batch([
      sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, message, expires_at, created_at)
           VALUES ('dissolve', 'pending', ${me.id}, ${otherNationId}, ${`${me.name} درخواست خروج از اتحاد/لغو روابط داد.`},
                   ${at + settings.diplomacy.requestExpirySeconds}, ${at})`,
    ]);
    const allyRow = await db.first<{ alliance_id: number }>(sql`SELECT alliance_id FROM alliance_members WHERE nation_id = ${me.id} LIMIT 1`);
    if (allyRow) await leaveAlliance(db, me, Number(allyRow.alliance_id), at);
    return { status: 'pending', note: 'خروج از اتحاد نیازمند اطلاع سایر اعضا است.' };
  }
  await db.batch([
    sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
         WHERE nation_id = ${me.id} AND other_nation_id = ${otherNationId}`,
    sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
         WHERE nation_id = ${otherNationId} AND other_nation_id = ${me.id}`,
  ]);
  await notify(db, { nationId: otherNationId, kind: 'diplomacy', title: '🔚 لغو روابط', body: `${me.name} روابط دیپلماتیک را لغو کرد.`, telegram: botToken ? { botToken, chatId: otherNationId, text: '🔚 روابط دیپلماتیک لغو شد.' } : null });
  return { status: 'neutral' };
}

export async function createAlliance(db: Db, me: NationRow, name: string, settings: SettingsBundle) {
  if (!settings.features.diplomacyEnabled) throw ApiError.disabled('دیپلماسی');
  const clean = name.trim().slice(0, 40);
  if (clean.length < 3) throw ApiError.validation('نام اتحاد حداقل ۳ نویسه باید باشد.');
  const alreadyMember = await db.first<{ c: number }>(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE nation_id = ${me.id}`);
  if (Number(alreadyMember?.c ?? 0) > 0) throw ApiError.conflict('کشور شما عضو یک اتحاد است. ابتدا خارج شوید.');
  const dupName = await db.first<{ id: number }>(sql`SELECT id FROM alliances WHERE name = ${clean} COLLATE NOCASE AND status = 'active'`);
  if (dupName) throw ApiError.conflict('این نام اتحاد قبلاً ثبت شده است.');
  const at = nowSeconds();
  const created = await db.first<{ id: number }>(
    sql`INSERT INTO alliances (name, leader_nation_id, status, created_at) VALUES (${clean}, ${me.id}, 'active', ${at}) RETURNING id`,
  );
  const allianceId = Number(created?.id ?? 0);
  await db.batch([
    sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${me.id}, 'leader', ${at})`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('alliance', 'اتحاد جدید', ${`🛡️ اتحاد «${clean}» توسط ${me.name} تأسیس شد.`}, 'global', ${me.id}, ${at})`,
  ]);
  return { allianceId, name: clean };
}

export async function leaveAlliance(db: Db, me: NationRow, allianceId: number, at = nowSeconds()) {
  const membership = await db.first<{ role: string }>(
    sql`SELECT role FROM alliance_members WHERE alliance_id = ${allianceId} AND nation_id = ${me.id}`,
  );
  if (!membership) throw ApiError.notFound('شما عضو این اتحاد نیستید.');
  const size = await db.first<{ c: number }>(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE alliance_id = ${allianceId}`);
  const stmts = [
    sql`DELETE FROM alliance_members WHERE alliance_id = ${allianceId} AND nation_id = ${me.id}`,
    sql`UPDATE diplomatic_relations SET status = 'friend', alliance_id = NULL, updated_at = ${at}
         WHERE alliance_id = ${allianceId} AND nation_id = ${me.id}`,
  ];
  if (membership.role === 'leader') {
    const next = await db.first<{ nation_id: number }>(
      sql`SELECT nation_id FROM alliance_members WHERE alliance_id = ${allianceId} AND nation_id <> ${me.id} ORDER BY joined_at LIMIT 1`,
    );
    if (next && Number(size?.c ?? 0) > 1) {
      stmts.push(sql`UPDATE alliances SET leader_nation_id = ${next.nation_id} WHERE id = ${allianceId}`);
    } else {
      stmts.push(sql`UPDATE alliances SET status = 'disbanded', disbanded_at = ${at} WHERE id = ${allianceId}`);
    }
  }
  await db.batch(stmts);
  return { left: true };
}

export async function listAlliances(db: Db, limit = 30) {
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT a.id, a.name, a.motto, a.status, a.created_at, l.name AS leader_name, l.flag AS leader_flag,
               COUNT(m.nation_id) AS members,
               COALESCE(SUM(n.military_power), 0) AS power,
               COALESCE(SUM(n.treasury), 0) AS treasury
          FROM alliances a
          JOIN nations l ON l.id = a.leader_nation_id
          LEFT JOIN alliance_members m ON m.alliance_id = a.id
          LEFT JOIN nations n ON n.id = m.nation_id
         WHERE a.status = 'active'
         GROUP BY a.id ORDER BY power DESC LIMIT ${Math.min(100, Math.max(1, limit))}`,
  );
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    motto: (r.motto as string) ?? null,
    status: String(r.status),
    leaderName: String(r.leader_name),
    leaderFlag: String(r.leader_flag),
    members: Number(r.members),
    power: Number(r.power),
    treasury: Number(r.treasury),
    createdAt: toIso(Number(r.created_at)),
  }));
}

export async function myAlliance(db: Db, nationId: number) {
  const row = await db.first<Record<string, unknown>>(
    sql`SELECT a.id, a.name, a.status, am.role, a.leader_nation_id, a.created_at
          FROM alliances a JOIN alliance_members am ON am.alliance_id = a.id
         WHERE am.nation_id = ${nationId} AND a.status = 'active' LIMIT 1`,
  );
  if (!row) return null;
  const members = await db.all<Record<string, unknown>>(
    sql`SELECT n.id, n.name, n.flag, n.leader_name, n.military_power, n.world_rank, am.role, am.joined_at
          FROM alliance_members am JOIN nations n ON n.id = am.nation_id
         WHERE am.alliance_id = ${row.id} ORDER BY CASE am.role WHEN 'leader' THEN 0 ELSE 1 END, n.world_rank`,
  );
  return {
    id: Number(row.id),
    name: String(row.name),
    status: String(row.status),
    myRole: String(row.role),
    leaderNationId: Number(row.leader_nation_id),
    createdAt: toIso(Number(row.created_at)),
    members: members.map((m) => ({
      nationId: Number(m.id),
      name: String(m.name),
      flag: String(m.flag),
      leaderName: String(m.leader_name),
      militaryPower: Number(m.military_power),
      worldRank: Number(m.world_rank),
      role: String(m.role),
      joinedAt: toIso(Number(m.joined_at)),
    })),
  };
}

export async function expireRequests(db: Db, now = nowSeconds(), limit = 50) {
  const r = await db.run(
    sql`UPDATE diplomatic_requests SET status = 'expired'
         WHERE status = 'pending' AND expires_at IS NOT NULL AND expires_at < ${now}
           AND id IN (SELECT id FROM diplomatic_requests WHERE status = 'pending' AND expires_at < ${now} ORDER BY id LIMIT ${limit})`,
  );
  return r.meta.changes ?? 0;
}
