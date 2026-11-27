import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso, humanDuration } from '../core/format';
import { seedFromString, uuid, warTxKey } from '../core/ids';
import type { Db } from '../core/db';
import type { SettingsBundle } from '../core/settings';
import { computeNation, loadInventory, warLabel, type NationRow } from '../db/queries';
import { previewBattle, simulateBattle, type Combatant } from '../game-engine/battle';
import { audit } from './auditService';
import { notify } from './notificationService';

const ACTIVE = ['proposed', 'accepted', 'active', 'peace_requested'];

export interface WarRow {
  id: number;
  attacker_nation_id: number;
  defender_nation_id: number;
  status: string;
  initiated_by: string;
  attacker_power: number;
  defender_power: number;
  attacker_win_chance: number;
  rounds_played: number;
  max_rounds: number;
  entry_cost: number;
  indemnity_offered: number;
  indemnity_paid: number;
  winner_nation_id: number | null;
  outcome_summary: string | null;
  seed: number;
  proposed_at: number;
  accepted_at: number | null;
  started_at: number | null;
  next_round_at: number | null;
  ends_at: number | null;
  ended_at: number | null;
  peace_requested_at: number | null;
  attacker_name: string;
  attacker_flag: string;
  defender_name: string;
  defender_flag: string;
}

async function loadWar(db: Db, warId: number): Promise<WarRow> {
  const row = await db.first<WarRow>(
    sql`SELECT w.*, a.name AS attacker_name, a.flag AS attacker_flag, d.name AS defender_name, d.flag AS defender_flag
          FROM wars w
          JOIN nations a ON a.id = w.attacker_nation_id
          JOIN nations d ON d.id = w.defender_nation_id
         WHERE w.id = ${warId}`,
  );
  if (!row) throw ApiError.notFound('جنگ یافت نشد.');
  return row;
}

async function combatantOf(db: Db, nation: NationRow, settings: SettingsBundle, side: 'attacker' | 'defender'): Promise<Combatant & { categories: Record<string, number> }> {
  const computed = await computeNation(db, nation, settings);
  const inventory = await loadInventory(db, nation.id);
  const categories: Record<string, number> = {};
  for (const i of inventory) categories[i.categoryKey] = (categories[i.categoryKey] ?? 0) + i.quantity;

  let allianceSupport = 0;
  if (side === 'defender') {
    const allies = await db.all<{ military_power: number }>(
      sql`SELECT n.military_power
            FROM alliance_members am
            JOIN alliance_members am2 ON am2.alliance_id = am.alliance_id
            JOIN nations n ON n.id = am2.nation_id
           WHERE am.nation_id = ${nation.id} AND n.id <> ${nation.id} AND n.status = 'active'
           LIMIT 10`,
    );
    const shared = allies.reduce((s, a) => s + Number(a.military_power), 0);
    allianceSupport = settings.battle.allianceSupportRatio * (computed.power.defensePower > 0 ? Math.min(1, shared / computed.power.defensePower) : 0);
  }
  const ns = await db.first<{ fortification_level: number; defense_mode: string }>(
    sql`SELECT fortification_level, defense_mode FROM nation_settings WHERE nation_id = ${nation.id}`,
  );
  return {
    nationId: nation.id,
    attackPower: computed.power.attackPower,
    defensePower: computed.power.defensePower,
    troopsCount: computed.power.troopsCount,
    equipmentCount: computed.power.equipmentCount,
    treasury: nation.treasury,
    allianceSupport,
    fortificationLevel: ns?.fortification_level ?? 0,
    morale: side === 'attacker' ? 1 : ns?.defense_mode === 'fortified' ? 1.1 : 1,
    categories,
  };
}

/** public directory of countries (only non-sensitive, aggregate fields) */
export async function listNations(
  db: Db,
  opts: { search?: string | null; limit?: string | number | null; offset?: string | number | null; excludeNationId?: number | null } = {},
) {
  const limit = Math.min(50, Math.max(1, Number(opts.limit ?? 20) || 20));
  const offset = Math.max(0, Number(opts.offset ?? 0) || 0);
  const clauses: string[] = ["n.status <> 'dissolved'"];
  const bindings: unknown[] = [];
  if (opts.search) {
    clauses.push('(n.name LIKE ? OR n.leader_name LIKE ?)');
    bindings.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.excludeNationId) {
    clauses.push('n.id <> ?');
    bindings.push(opts.excludeNationId);
  }
  bindings.push(limit, offset);
  const rows = await db.all<Record<string, unknown>>({
    sql: `SELECT n.id, n.name, n.flag, n.leader_name, n.status, n.treasury, n.military_power, n.economic_score,
                 n.total_score, n.world_rank, n.allies_count, n.enemies_count, n.wins_count, n.equipment_count,
                 n.troops_count, n.created_at,
                 COALESCE(e.net_income, 0) AS net_income,
                 (SELECT COUNT(*) FROM wars w WHERE w.defender_nation_id = n.id AND w.status IN ('proposed','accepted','active','peace_requested')) AS incoming_wars,
                 rel.status AS relation_status
            FROM nations n
            LEFT JOIN nation_economy e ON e.nation_id = n.id
            LEFT JOIN diplomatic_relations rel ON rel.nation_id = ? AND rel.other_nation_id = n.id
           WHERE ${clauses.join(' AND ')}
           ORDER BY n.world_rank ASC, n.total_score DESC
           LIMIT ? OFFSET ?`,
    bindings: [opts.excludeNationId ?? 0, ...bindings],
  });
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    flag: String(r.flag),
    leaderName: String(r.leader_name),
    status: String(r.status),
    treasury: Number(r.treasury),
    militaryPower: Number(r.military_power),
    economicScore: Number(r.economic_score),
    worldRank: Number(r.world_rank),
    alliesCount: Number(r.allies_count),
    enemiesCount: Number(r.enemies_count),
    winsCount: Number(r.wins_count),
    equipmentCount: Number(r.equipment_count),
    troopsCount: Number(r.troops_count),
    incomePerCycle: Number(r.net_income),
    incomingWars: Number(r.incoming_wars),
    relationStatus: (r.relation_status as string) ?? 'neutral',
    createdAt: toIso(Number(r.created_at)),
  }));
}

/** attacker sends a war proposal; the defender must accept (unless auto-consent) */
export async function proposeWar(
  db: Db,
  attacker: NationRow,
  targetNationId: number,
  indemnityOffered: number,
  settings: SettingsBundle,
  actor: { userId: number; telegramId: number },
  botToken?: string,
) {
  if (!settings.features.warEnabled) throw ApiError.disabled('جنگ');
  if (attacker.id === targetNationId) throw ApiError.forbidden('حمله به کشور خود امکان‌پذیر نیست.');
  if (attacker.status !== 'active') throw ApiError.forbidden('وضعیت کشور شما اجازه اعلام جنگ ندارد.');

  const target = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${targetNationId}`);
  if (!target || target.status === 'dissolved') throw ApiError.notFound('کشور هدف یافت نشد.');
  if (target.status !== 'active') throw ApiError.forbidden('این کشور در وضعیت فعال نیست و نمی‌تواند هدف قرار گیرد.');

  if (!settings.diplomacy.allowNeutralAttacks) {
    const rel = await db.first<{ status: string }>(
      sql`SELECT status FROM diplomatic_relations WHERE nation_id = ${attacker.id} AND other_nation_id = ${targetNationId}`,
    );
    const allowed = ['enemy', 'negotiating'];
    if (!rel || !allowed.includes(rel.status)) throw ApiError.forbidden('حمله فقط به کشورهایی که در وضعیت دشمنی یا مذاکره هستند مجاز است.');
  }
  const peace = await db.first<{ id: number }>(
    sql`SELECT id FROM diplomatic_relations WHERE nation_id = ${attacker.id} AND other_nation_id = ${targetNationId} AND status = 'peace_treaty'`,
  );
  if (peace) throw ApiError.forbidden('با این کشور پیمان صلح دارید؛ نقض پیمان توسط مدیر ممکن است.');

  const activeWars = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM wars WHERE (attacker_nation_id = ${attacker.id} OR defender_nation_id = ${attacker.id}) AND status IN ('proposed','accepted','active','peace_requested')`,
  );
  if (Number(activeWars?.c ?? 0) >= settings.battle.maxActiveWarsPerNation) {
    throw ApiError.conflict(`شما هم‌اکنون حداکثر مجاز (${settings.battle.maxActiveWarsPerNation}) جنگ فعال دارید.`);
  }
  const attackers = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM wars WHERE defender_nation_id = ${targetNationId} AND status IN ('proposed','accepted','active')`,
  );
  if (Number(attackers?.c ?? 0) >= settings.battle.maxAttackersPerTarget) {
    throw ApiError.conflict('این کشور هم‌اکنون درگیر جنگ است (سقف مهاجمان per target تکمیل شده).');
  }
  const lastEnded = await db.first<{ ended_at: number }>(
    sql`SELECT ended_at FROM wars WHERE attacker_nation_id = ${attacker.id} AND status = 'ended' ORDER BY ended_at DESC LIMIT 1`,
  );
  if (lastEnded?.ended_at && settings.battle.warCooldownSeconds > 0) {
    const left = settings.battle.warCooldownSeconds - (nowSeconds() - lastEnded.ended_at);
    if (left > 0) throw ApiError.conflict(`برای حمله بعدی ${humanDuration(left)} باید صبر کنید.`);
  }

  const att = await combatantOf(db, attacker, settings, 'attacker');
  const def = await combatantOf(db, target, settings, 'defender');
  const preview = previewBattle(att, def, settings.battle);
  const indemnity = Math.max(0, Math.min(indemnityOffered || 0, attacker.treasury));
  const at = nowSeconds();
  const seed = seedFromString(`war:${attacker.id}:${targetNationId}:${at}`);

  const war = await db.first<{ id: number }>(
    sql`INSERT INTO wars (attacker_nation_id, defender_nation_id, status, initiated_by, attacker_power, defender_power,
                          attacker_win_chance, max_rounds, entry_cost, indemnity_offered, seed, proposed_at, ends_at)
         VALUES (${attacker.id}, ${targetNationId}, 'proposed', 'attacker', ${att.attackPower}, ${def.defensePower},
                 ${preview.attackerWinChance}, ${settings.battle.maxRounds}, ${preview.entryCost}, ${indemnity}, ${seed}, ${at}, ${at + settings.battle.minWarDurationSeconds * settings.battle.maxRounds})
         RETURNING id`,
  );
  const warId = Number(war?.id ?? 0);
  if (!warId) throw ApiError.conflict('درخواست جنگ تکراری است یا کشور هدف درگیر جنگ است.');

  await db.batch([
    sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, message, expires_at, created_at)
         VALUES ('war', 'pending', ${attacker.id}, ${targetNationId},
                 ${`درخواست جنگ با پیشنهاد غرامت ${indemnity.toLocaleString('en-US')} سکه`},
                 ${at + settings.diplomacy.requestExpirySeconds}, ${at})
         ON CONFLICT DO NOTHING`,
    sql`UPDATE diplomatic_relations SET status = 'enemy', updated_at = ${at}
         WHERE nation_id = ${attacker.id} AND other_nation_id = ${targetNationId}`,
    sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
         VALUES (${targetNationId}, ${attacker.id}, 'enemy', ${at}, ${at})
         ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = 'enemy', updated_at = ${at}`,
  ]);

  await notify(db, {
    nationId: targetNationId,
    kind: 'war_proposal',
    title: '⚔️ درخواست جنگ دریافت کردید',
    body: `${attacker.flag} ${attacker.name} به شما اعلام جنگ کرد. احتمال پیروزی مهاجم: ${Math.round(preview.attackerWinChance * 100)}٪`,
    data: { warId },
    telegram: botToken ? { botToken, chatId: target.owner_user_id, text: `⚔️ ${attacker.name} به ${target.name} اعلام جنگ داد!` } : null,
  });
  await audit(db, { actor, action: 'war.propose', targetType: 'war', targetId: warId, after: { targetNationId, indemnity } });
  return { warId, preview: { ...preview, indemnity }, status: 'proposed' };
}

export async function respondToWar(db: Db, warId: number, accept: boolean, nation: NationRow, settings: SettingsBundle, botToken?: string) {
  const war = await loadWar(db, warId);
  if (war.defender_nation_id !== nation.id) throw ApiError.forbidden('فقط کشور هدف می‌تواند به درخواست جنگ پاسخ دهد.');
  if (war.status !== 'proposed') throw ApiError.conflict(`این درخواست دیگر در وضعیت انتظار نیست (${warLabel(war.status)}).`);
  const at = nowSeconds();

  if (!accept) {
    await db.batch([
      sql`UPDATE wars SET status = 'cancelled', ended_at = ${at} WHERE id = ${warId}`,
      sql`UPDATE diplomatic_requests SET status = 'rejected', handled_at = ${at} WHERE kind = 'war' AND from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id} AND status = 'pending'`,
      sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
           VALUES ('war', 'رد درخواست جنگ', ${`${nation.flag} ${nation.name} درخواست جنگ را رد کرد.`}, 'global', ${nation.id}, ${at})`,
    ]);
    await notifyAttacker(db, war, '❌ درخواست جنگ شما رد شد.', `${nation.name} درخواست جنگ را رد کرد.`, botToken);
    return { status: 'cancelled' };
  }

  const attacker = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${war.attacker_nation_id}`);
  if (!attacker) throw ApiError.notFound('کشور مهاجم یافت نشد.');
  const att = await combatantOf(db, attacker, settings, 'attacker');
  const def = await combatantOf(db, nation, settings, 'defender');
  const preview = previewBattle(att, def, settings.battle);
  const entryCost = war.entry_cost || preview.entryCost;

  // entry cost is charged from the attacker when the defender accepts
  if (entryCost > 0) {
    await db.batch([
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, reason, created_at)
           VALUES (${uuid()}, ${attacker.id}, 'war_cost', ${-entryCost}, ${attacker.treasury}, ${attacker.treasury - entryCost}, 'coin',
                   ${warTxKey('entry', warId, 'attacker')}, 'war', ${warId}, 'هزینه ورود به جنگ', ${at})`,
      sql`UPDATE nations SET treasury = treasury - ${entryCost}, updated_at = ${at} WHERE id = ${attacker.id}`,
    ]);
  }

  await db.batch([
    sql`UPDATE wars SET status = 'active', accepted_at = ${at}, started_at = ${at}, next_round_at = ${at},
                       attacker_power = ${att.attackPower}, defender_power = ${def.defensePower},
                       attacker_win_chance = ${preview.attackerWinChance}, entry_cost = ${entryCost}
           WHERE id = ${warId}`,
    sql`UPDATE nations SET status = 'at_war' WHERE id IN (${attacker.id}, ${nation.id})`,
    sql`UPDATE diplomatic_requests SET status = 'accepted', handled_at = ${at} WHERE kind = 'war' AND from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id} AND status = 'pending'`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('war', 'جنگ آغاز شد', ${`⚔️ ${attacker.flag} ${attacker.name} در برابر ${nation.flag} ${nation.name} — احتمال پیروزی مهاجم ${Math.round(preview.attackerWinChance * 100)}٪`}, 'global', ${attacker.id}, ${at})`,
  ]);
  await notify(db, {
    nationId: attacker.id,
    kind: 'war_started',
    title: '⚔️ جنگ آغاز شد',
    body: 'دفاع از کشور درخواست جنگ را پذیرفت. نوبت‌های نبرد توسط زمان‌بند اجرا می‌شود.',
    data: { warId },
  });
  return { status: 'active', preview };
}

async function notifyAttacker(db: Db, war: WarRow, title: string, body: string, botToken?: string) {
  const attacker = await db.first<{ owner_user_id: number }>(sql`SELECT owner_user_id FROM nations WHERE id = ${war.attacker_nation_id}`);
  await notify(db, {
    nationId: war.attacker_nation_id,
    kind: 'war',
    title,
    body,
    data: { warId: war.id },
    telegram: botToken && attacker ? { botToken, chatId: attacker.owner_user_id, text: `${title}\n${body}` } : null,
  });
}

/** one battle round (called by the player when due, or by cron) */
export async function resolveRound(db: Db, warId: number, settings: SettingsBundle, opts: { force?: boolean } = {}) {
  const war = await loadWar(db, warId);
  if (!['active', 'peace_requested'].includes(war.status)) throw ApiError.conflict('این جنگ در وضعیت اجرا نیست.');
  const at = nowSeconds();
  if (!opts.force && war.next_round_at && war.next_round_at > at) {
    throw ApiError.rateLimited(`نوبت بعدی ${humanDuration(war.next_round_at - at)} دیگر فرا می‌رسد.`, war.next_round_at - at);
  }
  const attacker = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${war.attacker_nation_id}`);
  const defender = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${war.defender_nation_id}`);
  if (!attacker || !defender) throw ApiError.notFound('کشورهای درگیر یافت نشدند.');

  const att = await combatantOf(db, attacker, settings, 'attacker');
  const def = await combatantOf(db, defender, settings, 'defender');
  const roundsLeft = Math.max(1, settings.battle.maxRounds - war.rounds_played);
  const outcome = simulateBattle({
    attacker: att,
    defender: def,
    params: settings.battle,
    seed: (war.seed + war.rounds_played + 1) >>> 0,
    attackerCategories: att.categories,
    defenderCategories: def.categories,
    rounds: Math.min(roundsLeft, 1),
  });

  const nextRound = war.rounds_played + 1;
  const finished = outcome.finished || nextRound >= settings.battle.maxRounds;
  const battle = await db.first<{ id: number }>(
    sql`INSERT INTO battles (war_id, round_no, attacker_power, defender_power, attacker_losses, defender_losses, winner, seed, created_at)
         VALUES (${warId}, ${nextRound}, ${outcome.rounds[0]?.attackerPower ?? 0}, ${outcome.rounds[0]?.defenderPower ?? 0},
                 ${outcome.attackerLosses}, ${outcome.defenderLosses}, ${outcome.winner ?? 'draw'}, ${war.seed + nextRound}, ${at})
         RETURNING id`,
  );
  const battleId = Number(battle?.id ?? 0);

  await db.batch([
    sql`INSERT INTO battle_reports (battle_id, war_id, attacker_nation_id, defender_nation_id, attacker_win_chance,
                                    attacker_json, defender_json, indemnity, detail_json, created_at)
         VALUES (${battleId}, ${warId}, ${attacker.id}, ${defender.id}, ${outcome.rounds[0]?.attackerWinChance ?? 0.5},
                 ${JSON.stringify({ power: att.attackPower, remaining: outcome.attackerRemaining, losses: outcome.attackerLosses, byCategory: outcome.attackerLossesByCategory, troops: att.troopsCount })},
                 ${JSON.stringify({ power: def.defensePower, remaining: outcome.defenderRemaining, losses: outcome.defenderLosses, byCategory: outcome.defenderLossesByCategory, troops: def.troopsCount })},
                 ${outcome.indemnity}, ${JSON.stringify({ round: nextRound, finished, rolls: outcome.rolls.slice(0, 20), seed: war.seed + nextRound })}, ${at})`,
    sql`UPDATE wars SET rounds_played = ${nextRound}, next_round_at = ${at + settings.battle.minWarDurationSeconds},
                       ends_at = ${at + settings.battle.minWarDurationSeconds * Math.max(1, settings.battle.maxRounds - nextRound)}
           WHERE id = ${warId}`,
  ]);

  await applyLosses(db, attacker.id, outcome.attackerLossesByCategory, at);
  await applyLosses(db, defender.id, outcome.defenderLossesByCategory, at);

  if (finished) await finalizeWar(db, warId, settings, at);
  return { round: nextRound, finished, outcome };
}

/** shrink inventory by a per-category loss ratio (never below zero) */
async function applyLosses(db: Db, nationId: number, lossesByCategory: Record<string, number>, at: number) {
  const entries = Object.entries(lossesByCategory).filter(([, lost]) => lost > 0);
  if (entries.length === 0) return;
  const inventory = await loadInventory(db, nationId);
  const stmts = [];
  for (const [categoryKey, lost] of entries) {
    const rows = inventory.filter((i) => i.categoryKey === categoryKey && i.quantity > 0);
    if (rows.length === 0) continue;
    const totalQty = rows.reduce((s, r) => s + r.quantity, 0);
    const ratio = Math.min(1, lost / Math.max(1, totalQty));
    for (const row of rows) {
      const decrement = Math.min(row.quantity, Math.floor(row.quantity * ratio));
      if (decrement <= 0) continue;
      stmts.push(sql`UPDATE nation_inventory SET quantity = quantity - ${decrement}, updated_at = ${at} WHERE id = ${row.id}`);
    }
  }
  if (stmts.length) await db.batch(stmts);
}

/**
 * Ends a war. The winner is derived from the cumulative battle ledger
 * (initial power minus all recorded round losses), so the outcome always
 * matches the round reports the players saw — it is never a fresh re-roll.
 */
export async function finalizeWar(db: Db, warId: number, settings: SettingsBundle, at = nowSeconds()) {
  const war = await loadWar(db, warId);
  if (war.status === 'ended') return { status: 'ended', winnerNationId: war.winner_nation_id, indemnity: 0, winnerSide: 'draw' as const };
  const attacker = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${war.attacker_nation_id}`);
  const defender = await db.first<NationRow>(sql`SELECT * FROM nations WHERE id = ${war.defender_nation_id}`);
  if (!attacker || !defender) throw ApiError.notFound('کشورهای درگیر یافت نشدند.');

  const totals = await db.first<{ al: number | null; dl: number | null }>(
    sql`SELECT COALESCE(SUM(attacker_losses), 0) AS al, COALESCE(SUM(defender_losses), 0) AS dl FROM battles WHERE war_id = ${warId}`,
  );
  const attStart = Math.max(0, Number(war.attacker_power));
  const defStart = Math.max(0, Number(war.defender_power));
  const attRemaining = Math.max(0, attStart - Number(totals?.al ?? 0));
  const defRemaining = Math.max(0, defStart - Number(totals?.dl ?? 0));

  const winnerSide: 'attacker' | 'defender' | 'draw' =
    attRemaining === defRemaining ? 'draw' : attRemaining > defRemaining ? 'attacker' : 'defender';
  const winner = winnerSide === 'defender' ? defender : attacker;
  const loser = winnerSide === 'defender' ? attacker : defender;
  const destroyed = Math.max(attStart - attRemaining, defStart - defRemaining);
  const wantedIndemnity = winnerSide === 'attacker' ? Math.max(0, war.indemnity_offered) : Math.round(destroyed * settings.battle.indemnityPerPoint);
  const indemnity = winnerSide === 'draw' ? 0 : Math.min(wantedIndemnity, loser.treasury);

  await applyResidualLosses(db, attacker.id, defender.id, {
    attackerRatio: attStart > 0 ? Math.min(1, (attStart - attRemaining) / attStart) : 0,
    defenderRatio: defStart > 0 ? Math.min(1, (defStart - defRemaining) / defStart) : 0,
  }, at);

  const stmts: { sql: string; bindings: readonly unknown[] }[] = [
    sql`UPDATE wars SET status = 'ended', ended_at = ${at}, winner_nation_id = ${winnerSide === 'draw' ? null : winner.id},
                       indemnity_paid = ${indemnity}, attacker_power = ${attRemaining}, defender_power = ${defRemaining},
                       outcome_summary = ${
                         winnerSide === 'draw'
                           ? '🤝 نبرد با تساوی پایان یافت.'
                           : `برنده: ${winner.name} (قدرت باقی‌مانده مهاجم ${Math.round(attRemaining)} / مدافع ${Math.round(defRemaining)})`
                       }
           WHERE id = ${warId}`,
    sql`UPDATE nations SET status = 'active', updated_at = ${at} WHERE id IN (${attacker.id}, ${defender.id}) AND status = 'at_war'`,
    sql`UPDATE nations SET wars_count = wars_count + 1, updated_at = ${at} WHERE id IN (${attacker.id}, ${defender.id})`,
  ];
  if (winnerSide !== 'draw') {
    stmts.push(sql`UPDATE nations SET wins_count = wins_count + 1 WHERE id = ${winner.id}`);
    stmts.push(sql`UPDATE nations SET losses_count = losses_count + 1 WHERE id = ${loser.id}`);
  }
  if (indemnity > 0) {
    stmts.push(
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, counterparty_nation_id, reason, created_at)
           VALUES (${uuid()}, ${loser.id}, 'war_indemnity', ${-indemnity}, ${loser.treasury}, ${loser.treasury - indemnity}, 'coin',
                   ${warTxKey('indemnity', warId, 'loser')}, 'war', ${warId}, ${winner.id}, 'غرامت جنگ', ${at})`,
      sql`UPDATE nations SET treasury = treasury - ${indemnity} WHERE id = ${loser.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, counterparty_nation_id, reason, created_at)
           VALUES (${uuid()}, ${winner.id}, 'war_indemnity', ${indemnity}, ${winner.treasury}, ${winner.treasury + indemnity}, 'coin',
                   ${warTxKey('indemnity', warId, 'winner')}, 'war', ${warId}, ${loser.id}, 'غرامت دریافتی', ${at})`,
      sql`UPDATE nations SET treasury = treasury + ${indemnity} WHERE id = ${winner.id}`,
      sql`UPDATE nation_economy SET war_loss_total = war_loss_total + ${indemnity} WHERE nation_id = ${loser.id}`,
    );
  }
  stmts.push(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('war', 'پایان جنگ', ${
           winnerSide === 'draw'
             ? `🤝 جنگ ${war.attacker_name} و ${war.defender_name} با تساوی پایان یافت.`
             : `🏁 ${winner.flag} ${winner.name} پیروز نبرد با ${loser.flag} ${loser.name} شد (غرامت: ${indemnity.toLocaleString('en-US')} سکه).`
         }, 'global', ${winner.id}, ${at})`,
  );
  await db.batch(stmts);

  const summaryLine = winnerSide === 'draw' ? 'نتیجه: تساوی' : `برنده: ${winner.name}`;
  await notify(db, { nationId: attacker.id, kind: 'war_end', title: '🏁 جنگ پایان یافت', body: summaryLine, data: { warId } });
  await notify(db, { nationId: defender.id, kind: 'war_end', title: '🏁 جنگ پایان یافت', body: summaryLine, data: { warId } });
  await refreshAfterWar(db, attacker.id, settings);
  await refreshAfterWar(db, defender.id, settings);
  return { status: 'ended', winnerNationId: winner.id, indemnity, winnerSide };
}

/**
 * Applies the leftover inventory shrink for a finished war. Rounds already
 * removed stock; here only the difference between "power lost" and "stock
 * destroyed so far" is applied, capped at 50% per category and never below 0.
 */
async function applyResidualLosses(
  db: Db,
  attackerId: number,
  defenderId: number,
  ratios: { attackerRatio: number; defenderRatio: number },
  at: number,
) {
  for (const [nationId, ratio] of [
    [attackerId, ratios.attackerRatio],
    [defenderId, ratios.defenderRatio],
  ] as const) {
    if (ratio <= 0.05) continue;
    const effective = Math.min(0.5, ratio * 0.5);
    const inventory = await loadInventory(db, nationId);
    const stmts = inventory
      .filter((i) => i.categoryKey !== 'factories' && i.categoryKey !== 'mines' && i.quantity > 1)
      .map((row) => {
        const decrement = Math.floor(row.quantity * effective);
        return sql`UPDATE nation_inventory SET quantity = MAX(0, quantity - ${decrement}), updated_at = ${at} WHERE id = ${row.id} AND quantity >= ${decrement}`;
      })
      .filter((_, idx) => idx < 40);
    if (stmts.length) await db.batch(stmts);
  }
}

async function refreshAfterWar(db: Db, nationId: number, settings: SettingsBundle) {
  const { loadNation, refreshNationStats } = await import('../db/queries');
  const nation = await loadNation(db, nationId);
  await refreshNationStats(db, nation, settings);
}

export async function requestPeace(db: Db, warId: number, nation: NationRow, settings: SettingsBundle, botToken?: string) {
  const war = await loadWar(db, warId);
  if (war.status !== 'active') throw ApiError.conflict('این جنگ فعال نیست.');
  const at = nowSeconds();
  const initiatorIsAttacker = war.attacker_nation_id === nation.id;
  if (!initiatorIsAttacker && war.defender_nation_id !== nation.id) throw ApiError.forbidden('شما طرف این جنگ نیستید.');
  const otherSide = initiatorIsAttacker ? war.defender_nation_id : war.attacker_nation_id;
  await db.batch([
    sql`UPDATE wars SET status = 'peace_requested', peace_requested_at = ${at} WHERE id = ${warId}`,
    sql`UPDATE diplomatic_requests SET status = 'cancelled' WHERE kind = 'peace' AND from_nation_id = ${nation.id} AND to_nation_id = ${otherSide} AND status = 'pending'`,
    sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, message, expires_at, created_at)
         VALUES ('peace', 'pending', ${nation.id}, ${otherSide}, ${`${nation.name} درخواست صلح داد (پایان جنگ ${warId}).`},
                 ${at + settings.diplomacy.requestExpirySeconds}, ${at})`,
  ]);
  const other = await db.first<{ owner_user_id: number }>(sql`SELECT owner_user_id FROM nations WHERE id = ${otherSide}`);
  await notify(db, {
    nationId: otherSide,
    kind: 'peace_request',
    title: '🕊️ درخواست صلح',
    body: `${nation.flag} ${nation.name} درخواست پایان جنگ داد.`,
    data: { warId },
    telegram: botToken && other ? { botToken, chatId: other.owner_user_id, text: `🕊️ ${nation.name} از شما درخواست صلح کرد.` } : null,
  });
  return { status: 'peace_requested' };
}

export async function respondPeace(db: Db, warId: number, accept: boolean, nation: NationRow, botToken?: string) {
  const war = await loadWar(db, warId);
  if (war.status !== 'peace_requested') throw ApiError.conflict('درخواست صلحی برای پاسخ دادن ثبت نشده است.');
  if (war.attacker_nation_id !== nation.id && war.defender_nation_id !== nation.id) {
    throw ApiError.forbidden('شما طرف این جنگ نیستید.');
  }
  const at = nowSeconds();
  // only the side that did NOT ask for peace can answer the offer: the pending
  // diplomatic request of kind 'peace' between these two countries is the offer itself
  const offer = await db.first<{ from_nation_id: number }>(
    sql`SELECT from_nation_id FROM diplomatic_requests
          WHERE kind = 'peace' AND status = 'pending'
            AND ((from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id})
              OR (from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id}))
          ORDER BY id DESC LIMIT 1`,
  );
  const requesterId = Number(offer?.from_nation_id ?? 0);
  if (requesterId && requesterId === nation.id) {
    throw ApiError.forbidden('درخواست صلح را همین کشور ثبت کرده است؛ باید طرف مقابل پاسخ دهد.');
  }

  if (!accept) {
    await db.batch([
      sql`UPDATE wars SET status = 'active', next_round_at = ${at} WHERE id = ${warId}`,
      sql`UPDATE diplomatic_requests SET status = 'rejected', handled_at = ${at}
            WHERE kind = 'peace' AND status = 'pending'
              AND ((from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id})
                OR (from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id}))`,
    ]);
    await notify(db, { nationId: war.attacker_nation_id === nation.id ? war.defender_nation_id : war.attacker_nation_id, kind: 'peace', title: '❌ درخواست صلح رد شد', body: `${nation.name} درخواست صلح را رد کرد.`, data: { warId } });
    return { status: 'active' as const };
  }

  await db.batch([
    sql`UPDATE wars SET status = 'ended', ended_at = ${at}, outcome_summary = ${'🕊️ پیمان صلح امضا شد — بدون غرامت.'} WHERE id = ${warId}`,
    sql`UPDATE diplomatic_requests SET status = 'accepted', handled_at = ${at}
          WHERE kind = 'peace' AND status = 'pending'
            AND ((from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id})
              OR (from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id}))`,
    sql`UPDATE nations SET status = 'active' WHERE id IN (${war.attacker_nation_id}, ${war.defender_nation_id}) AND status = 'at_war'`,
    sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
         VALUES (${war.attacker_nation_id}, ${war.defender_nation_id}, 'peace_treaty', ${at}, ${at})
         ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = 'peace_treaty', updated_at = ${at}`,
    sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
         VALUES (${war.defender_nation_id}, ${war.attacker_nation_id}, 'peace_treaty', ${at}, ${at})
         ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = 'peace_treaty', updated_at = ${at}`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('war', 'پیمان صلح', ${`🕊️ صلح میان ${war.attacker_name} و ${war.defender_name} امضا شد.`}, 'global', ${nation.id}, ${at})`,
  ]);
  await notify(db, { nationId: war.attacker_nation_id === nation.id ? war.defender_nation_id : war.attacker_nation_id, kind: 'peace', title: '🕊️ صلح امضا شد', body: 'جنگ با پیمان صلح پایان یافت.', data: { warId }, telegram: botToken ? { botToken, chatId: nation.id, text: '🕊️ پیمان صلح امضا شد.' } : null });
  return { status: 'ended' as const };
}

export async function getWarsForNation(db: Db, nationId: number) {
  const rows = await db.all<WarRow>(
    sql`SELECT w.*, a.name AS attacker_name, a.flag AS attacker_flag, d.name AS defender_name, d.flag AS defender_flag
          FROM wars w JOIN nations a ON a.id = w.attacker_nation_id JOIN nations d ON d.id = w.defender_nation_id
         WHERE (w.attacker_nation_id = ${nationId} OR w.defender_nation_id = ${nationId})
         ORDER BY (w.status IN ('proposed','accepted','active','peace_requested')) DESC, w.id DESC
         LIMIT 50`,
  );
  return rows.map((w) => mapWar(w));
}

export function mapWar(w: WarRow) {
  return {
    id: w.id,
    attackerNationId: w.attacker_nation_id,
    defenderNationId: w.defender_nation_id,
    attackerName: w.attacker_name,
    defenderName: w.defender_name,
    attackerFlag: w.attacker_flag,
    defenderFlag: w.defender_flag,
    status: w.status,
    statusLabelFa: warLabel(w.status),
    initiatedBy: w.initiated_by,
    attackerPower: Number(w.attacker_power),
    defenderPower: Number(w.defender_power),
    attackerWinChance: Number(w.attacker_win_chance),
    roundsPlayed: Number(w.rounds_played),
    maxRounds: Number(w.max_rounds),
    entryCost: Number(w.entry_cost),
    indemnityOffered: Number(w.indemnity_offered),
    indemnityPaid: Number(w.indemnity_paid),
    winnerNationId: w.winner_nation_id,
    outcomeSummary: w.outcome_summary,
    proposedAt: toIso(w.proposed_at),
    startedAt: toIso(w.started_at),
    nextRoundAt: toIso(w.next_round_at),
    endedAt: toIso(w.ended_at),
    endsAt: toIso(w.ends_at),
  };
}

export async function getWarDetail(db: Db, warId: number, viewerNationIds: number[], isAdmin: boolean) {
  const war = await loadWar(db, warId);
  if (!isAdmin && !viewerNationIds.includes(war.attacker_nation_id) && !viewerNationIds.includes(war.defender_nation_id)) {
    throw ApiError.forbidden('دسترسی به این جنگ ندارید.');
  }
  const reports = await db.all<Record<string, unknown>>(
    sql`SELECT br.*, b.round_no, b.winner, b.attacker_losses, b.defender_losses
          FROM battle_reports br JOIN battles b ON b.id = br.battle_id
         WHERE br.war_id = ${warId} ORDER BY b.round_no DESC LIMIT 30`,
  );
  return {
    war: mapWar(war),
    reports: reports.map((r) => ({
      id: Number(r.id),
      roundNo: Number(r.round_no),
      winner: String(r.winner),
      attackerWinChance: Number(r.attacker_win_chance),
      attacker: safeParse(r.attacker_json as string),
      defender: safeParse(r.defender_json as string),
      indemnity: Number(r.indemnity),
      detail: safeParse(r.detail_json as string),
      createdAt: toIso(Number(r.created_at)),
    })),
  };
}

function safeParse(text: string) {
  try {
    return JSON.parse(text || '{}');
  } catch {
    return {};
  }
}

/** admin controls */
export async function adminStopWar(db: Db, warId: number, mode: 'stop' | 'end', actor: { userId: number; telegramId: number }, reason: string) {
  const war = await loadWar(db, warId);
  const at = nowSeconds();
  const status = mode === 'stop' ? 'stopped_by_admin' : 'ended';
  await db.batch([
    sql`UPDATE wars SET status = ${status}, ended_at = ${at}, stopped_by_user_id = ${actor.userId},
                       outcome_summary = ${`توسط مدیر: ${reason}`} WHERE id = ${warId}`,
    sql`UPDATE nations SET status = 'active' WHERE id IN (${war.attacker_nation_id}, ${war.defender_nation_id}) AND status = 'at_war'`,
    sql`UPDATE diplomatic_requests SET status = 'cancelled', handled_at = ${at} WHERE kind = 'war' AND status = 'pending'
           AND from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id}`,
    sql`INSERT INTO announcements (kind, title, body, audience, created_at)
         VALUES ('admin', 'توقف جنگ توسط مدیر', ${`جنگ #${warId} (${war.attacker_name} ↔ ${war.defender_name}) متوقف شد. دلیل: ${reason}`}, 'global', ${at})`,
  ]);
  await audit(db, { actor, action: `war.${mode}`, targetType: 'war', targetId: warId, reason });
  return { status };
}

export async function listDueWars(db: Db, now = nowSeconds(), limit = 20) {
  return db.all<{ id: number }>(
    sql`SELECT id FROM wars WHERE status = 'active' AND (next_round_at IS NULL OR next_round_at <= ${now}) ORDER BY id LIMIT ${limit}`,
  );
}

/** proposals that were never answered expire (cron) */
export async function listExpiredProposals(db: Db, expirySeconds: number, now = nowSeconds(), limit = 25) {
  return db.all<{ id: number; attacker_nation_id: number; defender_nation_id: number }>(
    sql`SELECT id, attacker_nation_id, defender_nation_id FROM wars
          WHERE status = 'proposed' AND proposed_at < ${now - Math.max(300, expirySeconds)}
         ORDER BY id LIMIT ${limit}`,
  );
}

export async function expireProposal(db: Db, warId: number, at = nowSeconds()) {
  await db.batch([
    sql`UPDATE wars SET status = 'cancelled', ended_at = ${at}, outcome_summary = ${'درخواست جنگ بدون پاسخ ماند و منقضی شد.'} WHERE id = ${warId}`,
    sql`UPDATE diplomatic_requests SET status = 'expired', handled_at = ${at} WHERE kind = 'war' AND status = 'pending'
           AND from_nation_id = (SELECT attacker_nation_id FROM wars WHERE id = ${warId})`,
  ]);
}

/** wars whose schedule passed the hard deadline are force-ended by cron */
export async function listOverdueWars(db: Db, now = nowSeconds(), limit = 25) {
  return db.all<{ id: number }>(
    sql`SELECT id FROM wars WHERE status IN ('active','peace_requested') AND ends_at IS NOT NULL AND ends_at < ${now} ORDER BY id LIMIT ${limit}`,
  );
}
