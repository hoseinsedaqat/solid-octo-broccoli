import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { nowSeconds, toIso } from '../core/format';
import { ApiError } from '../core/errors';
import type { SettingsBundle } from '../core/settings';
import { rankNations } from '../game-engine/ranking';
import { audit } from './auditService';
import { notify } from './notificationService';

const KIND_EMOJI: Record<string, string> = {
  news: '📰',
  event: '🌍',
  war: '⚔️',
  statement: '📜',
  admin: '📢',
  alliance: '🤝',
};

export interface NewsInput {
  kind: 'news' | 'event' | 'war' | 'statement' | 'admin' | 'alliance';
  title: string;
  body: string;
  nationId?: number | null;
  targetNationId?: number | null;
  statementId?: number | null;
  warId?: number | null;
}

export async function publish(db: Db, input: NewsInput, isActive = true) {
  const at = nowSeconds();
  const row = await db.first<{ id: number }>(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, target_nation_id, statement_id, war_id, is_active, created_at)
         VALUES (${input.kind}, ${input.title.slice(0, 120)}, ${input.body.slice(0, 1200)},
                 ${input.targetNationId ? 'nation' : 'global'}, ${input.nationId ?? null}, ${input.targetNationId ?? null},
                 ${input.statementId ?? null}, ${input.warId ?? null}, ${isActive ? 1 : 0}, ${at})
         RETURNING id`,
  );
  return Number(row?.id ?? 0);
}

export async function adminBroadcast(
  db: Db,
  input: { title: string; body: string; targetNationId?: number | null },
  actor: { userId: number; telegramId: number },
  botToken?: string,
) {
  if (!input.title.trim() || !input.body.trim()) throw ApiError.validation('عنوان و متن اطلاعیه الزامی است.');
  const id = await publish(db, {
    kind: 'admin',
    title: input.title.trim(),
    body: input.body.trim(),
    targetNationId: input.targetNationId ?? null,
  });
  if (input.targetNationId) {
    await notify(db, {
      nationId: input.targetNationId,
      kind: 'admin',
      title: `📢 ${input.title.trim()}`,
      body: input.body.trim(),
    });
  }
  await audit(db, { actor, action: 'announcement.publish', targetType: 'announcement', targetId: id, after: input });
  return { id, audience: input.targetNationId ? 'nation' : 'global', botTokenProvided: Boolean(botToken) };
}

export async function listRankings(
  db: Db,
  settings: SettingsBundle,
  opts: { metric?: string; limit?: number } = {},
) {
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  // «توسعه کشورها» بر اساس تعداد سازه‌های ساخته‌شده — یک مسیر جدا از امتیازهای وزنی
  if (opts.metric === 'development') {
    const devRows = await db.all<Record<string, unknown>>(
      sql`SELECT n.id, n.name, n.flag, n.leader_name, n.treasury, n.military_power, n.economic_score,
                 n.equipment_count, n.wins_count, COALESCE(e.net_income, 0) AS net_income,
                 COALESCE(b.c, 0) AS development
            FROM nations n
            LEFT JOIN nation_economy e ON e.nation_id = n.id
            LEFT JOIN (SELECT nation_id, COUNT(*) AS c FROM nation_buildings GROUP BY nation_id) b ON b.nation_id = n.id
           WHERE n.status <> 'dissolved'
           ORDER BY development DESC, n.total_score DESC
           LIMIT 500`,
    );
    return devRows.map((r, i) => ({
      rank: i + 1,
      nationId: Number(r.id),
      name: String(r.name),
      flag: String(r.flag),
      leaderName: String(r.leader_name),
      score: Number(r.development),
      metrics: { development: Number(r.development) },
      raw: {
        treasury: Number(r.treasury),
        income: Number(r.net_income),
        militaryPower: Number(r.military_power),
        equipmentCount: Number(r.equipment_count),
        warWins: Number(r.wins_count),
        economicScore: Number(r.economic_score),
        development: Number(r.development),
      },
    })).slice(0, limit);
  }
  const rows = await db.all<Record<string, unknown>>(
    sql`SELECT n.id, n.name, n.flag, n.leader_name, n.treasury, n.military_power, n.economic_score,
               n.equipment_count, n.wins_count, COALESCE(e.net_income, 0) AS net_income
          FROM nations n LEFT JOIN nation_economy e ON e.nation_id = n.id
         WHERE n.status <> 'dissolved'
         ORDER BY n.total_score DESC LIMIT 500`,
  );
  const ranked = rankNations(
    rows.map((r) => ({
      nationId: Number(r.id),
      name: String(r.name),
      flag: String(r.flag),
      leaderName: String(r.leader_name),
      treasury: Number(r.treasury),
      income: Number(r.net_income),
      militaryPower: Number(r.military_power),
      equipmentCount: Number(r.equipment_count),
      warWins: Number(r.wins_count),
      economicScore: Number(r.economic_score),
    })),
    settings.rankingWeights,
    (opts.metric as never) ?? 'total',
  );
  return ranked.slice(0, limit).map((r) => ({
    rank: r.rank,
    nationId: r.nationId,
    name: r.name,
    flag: r.flag,
    leaderName: r.leaderName,
    score: r.score,
    metrics: r.metrics,
    raw: {
      treasury: r.treasury,
      income: r.income,
      militaryPower: r.militaryPower,
      equipmentCount: r.equipmentCount,
      warWins: r.warWins,
      economicScore: r.economicScore,
    },
  }));
}
