import type { NationSummary } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso, humanDuration } from '../core/format';
import { uuid } from '../core/ids';
import type { SettingsBundle } from '../core/settings';
import {
  loadNation,
  loadInventory,
  loadCategoryWeights,
  loadEconomyRow,
  loadSettingsForNation,
  relationCounts,
  mapNationSummary,
  refreshNationStats,
  computeNation,
  type NationRow,
} from '../db/queries';
import { audit } from './auditService';
import { completedCycleIndex } from './financeService';

export type { NationRow } from '../db/queries';

export interface CreateNationInput {
  name: string;
  leaderName: string;
  flag: string;
}

export interface StarterTemplate {
  id: number;
  name: string;
  treasury: number;
  factory_income: number;
  mine_income: number;
  income_cycle_seconds: number;
  items: { equipment_template_id: number; quantity: number }[];
}

/** the admin-editable starter pack that new nations are seeded from */
export async function getDefaultStarterTemplate(db: Db): Promise<StarterTemplate> {
  const head = await db.first<Omit<StarterTemplate, 'items'>>(
    sql`SELECT id, name, treasury, factory_income, mine_income, income_cycle_seconds
          FROM starter_templates WHERE is_active = 1 ORDER BY is_default DESC, id ASC LIMIT 1`,
  );
  if (!head) {
    throw ApiError.internal('بسته اولیه کشور در دیتابیس نیست. seed را اجرا کنید: npm run db:seed:local / db:seed:remote');
  }
  const items = await db.all<{ equipment_template_id: number; quantity: number }>(
    sql`SELECT equipment_template_id, quantity FROM starter_template_items WHERE starter_template_id = ${head.id}`,
  );
  return { ...head, items };
}

/**
 * Creates a nation + starter economy + starter inventory + the opening
 * transaction in ONE atomic batch, so a retried request can never produce a
 * half-created nation. Name uniqueness is enforced by the DB (UNIQUE index).
 */
export async function createNation(
  db: Db,
  actor: { userId: number; telegramId: number },
  input: CreateNationInput,
  settings: SettingsBundle,
): Promise<{ nationId: number; summary: string }> {
  const name = input.name.trim();
  const leader = input.leaderName.trim();
  const flag = input.flag.trim();
  if (!name || !leader || !flag) throw ApiError.validation('نام کشور، نام رئیس و پرچم لازم است.');
  if (name.length > 30) throw ApiError.validation('نام کشور حداکثر ۳۰ نویسه می‌تواند باشد.');

  const owned = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM nations WHERE owner_user_id = ${actor.userId} AND status <> 'dissolved'`,
  );
  if (Number(owned?.c ?? 0) >= settings.profile.maxNationsPerUser) {
    throw ApiError.forbidden(
      `شما حداکثر می‌توانید ${settings.profile.maxNationsPerUser} کشور داشته باشید. محدودیت از پنل ادمین قابل تغییر است.`,
    );
  }
  const duplicate = await db.first<{ id: number }>(sql`SELECT id FROM nations WHERE name = ${name} COLLATE NOCASE`);
  if (duplicate) throw ApiError.conflict('این نام کشور قبلاً ثبت شده است. نام دیگری انتخاب کنید.');

  const starter = await getDefaultStarterTemplate(db);
  const gross = starter.factory_income + starter.mine_income;
  const now = nowSeconds();

  const nationRow = await db.first<{ id: number }>(
    sql`INSERT INTO nations (owner_user_id, name, flag, leader_name, status, treasury,
                             income_anchor_at, last_income_cycle, starter_template_id, created_at, updated_at)
         VALUES (${actor.userId}, ${name}, ${flag}, ${leader}, 'active', ${starter.treasury}, ${now}, -1, ${starter.id}, ${now}, ${now})
         RETURNING id`,
  );
  const nationId = Number(nationRow?.id ?? 0);
  if (!nationId) throw ApiError.internal('ایجاد کشور ناموفق بود.');

  const invStmts = mapStmts(nationId, now)(starter.items.filter((i) => i.quantity > 0));

  await db.batch([
    ...invStmts,
    sql`INSERT INTO nation_economy (nation_id, factory_income, mine_income, starter_factory_count, starter_mine_count,
                                    gross_income, net_income, total_income, updated_at)
         VALUES (${nationId}, ${starter.factory_income}, ${starter.mine_income},
                 (SELECT COALESCE(SUM(i.quantity), 0) FROM nation_inventory i
                    JOIN equipment_templates t ON t.id = i.template_id
                    JOIN equipment_categories c ON c.id = t.category_id
                   WHERE i.nation_id = ${nationId} AND c.key = 'factories'),
                 (SELECT COALESCE(SUM(i.quantity), 0) FROM nation_inventory i
                    JOIN equipment_templates t ON t.id = i.template_id
                    JOIN equipment_categories c ON c.id = t.category_id
                   WHERE i.nation_id = ${nationId} AND c.key = 'mines'),
                 ${gross}, ${gross}, ${starter.treasury}, ${now})`,
    sql`INSERT INTO nation_settings (nation_id, defense_mode, fortification_level, notify_enabled, updated_at)
         VALUES (${nationId}, 'standard', 0, 1, ${now})`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                   idempotency_key, reference_type, reference_id, reason, created_by_user_id, meta, created_at)
         VALUES (${uuid()}, ${nationId}, 'starter_grant', ${starter.treasury}, 0, ${starter.treasury}, 'coin',
                 ${`starter:${nationId}`}, 'nation', ${nationId}, 'دارایی اولیه کشور', ${actor.userId},
                 ${JSON.stringify({ starterTemplate: starter.name, itemCount: starter.items.length })}, ${now})`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('event', 'تأسیس کشور جدید', ${`${flag} ${name} به ریاست ${leader} به بازی پیوست.`}, 'global', ${nationId}, ${now})`,
  ]);

  const nation = await loadNation(db, nationId);
  await refreshNationStats(db, nation, settings);
  await audit(db, {
    actor: { userId: actor.userId, telegramId: actor.telegramId },
    action: 'nation.create',
    targetType: 'nation',
    targetId: nationId,
    after: { name, leaderName: leader, flag, starterTemplate: starter.name },
    reason: 'onboarding',
  });

  return {
    nationId,
    summary: [
      `${flag} کشور «${name}» تأسیس شد.`,
      `رئیس کشور: ${leader}`,
      `خزانه اولیه: ${starter.treasury.toLocaleString('en-US')} سکه`,
      `درآمد هر دوره: ${gross.toLocaleString('en-US')} سکه (کارخانه ${starter.factory_income.toLocaleString('en-US')} + معدن ${starter.mine_income.toLocaleString('en-US')})`,
      `تعداد اقلام اولیه: ${starter.items.filter((i) => i.quantity > 0).length}`,
    ].join('\n'),
  };
}

/** builds the inventory INSERT statements of the starter pack */
function mapStmts(nationId: number, now: number) {
  return (items: { equipment_template_id: number; quantity: number }[]) =>
    items.map((item) =>
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
           VALUES (${nationId}, ${item.equipment_template_id}, ${item.quantity}, ${now}, ${now})
           ON CONFLICT (nation_id, template_id) DO NOTHING`,
    );
}

export async function updateNationProfile(
  db: Db,
  nation: NationRow,
  patch: { name?: string; leaderName?: string; flag?: string },
  settings: SettingsBundle,
  actor: { userId: number; telegramId: number } | null,
): Promise<string[]> {
  const now = nowSeconds();
  const changes: string[] = [];
  const stmts = [];

  if (patch.name && patch.name.trim() !== nation.name) {
    const cd = settings.profile.renameCooldownSeconds;
    if (cd > 0 && nation.last_rename_at && now - nation.last_rename_at < cd) {
      throw ApiError.conflict(`تغییر نام کشور هر ${humanDuration(cd)} یک‌بار مجاز است. باقی‌مانده: ${humanDuration(cd - (now - nation.last_rename_at))}.`);
    }
    const dup = await db.first<{ id: number }>(
      sql`SELECT id FROM nations WHERE name = ${patch.name.trim()} COLLATE NOCASE AND id <> ${nation.id}`,
    );
    if (dup) throw ApiError.conflict('این نام کشور قبلاً ثبت شده است.');
    stmts.push(sql`UPDATE nations SET name = ${patch.name.trim()}, last_rename_at = ${now}, updated_at = ${now} WHERE id = ${nation.id}`);
    changes.push('نام کشور');
  }
  if (patch.leaderName && patch.leaderName.trim() !== nation.leader_name) {
    const cd = settings.profile.leaderRenameCooldownSeconds;
    if (cd > 0 && nation.last_leader_rename_at && now - nation.last_leader_rename_at < cd) {
      throw ApiError.conflict(`تغییر نام رئیس کشور هر ${humanDuration(cd)} یک‌بار مجاز است.`);
    }
    stmts.push(sql`UPDATE nations SET leader_name = ${patch.leaderName.trim()}, last_leader_rename_at = ${now}, updated_at = ${now} WHERE id = ${nation.id}`);
    changes.push('نام رئیس کشور');
  }
  if (patch.flag && patch.flag.trim() !== nation.flag) {
    const cd = settings.profile.flagChangeCooldownSeconds;
    if (cd > 0 && nation.last_flag_change_at && now - nation.last_flag_change_at < cd) {
      throw ApiError.conflict(`تغییر پرچم هر ${humanDuration(cd)} یک‌بار مجاز است.`);
    }
    stmts.push(sql`UPDATE nations SET flag = ${patch.flag.trim()}, last_flag_change_at = ${now}, updated_at = ${now} WHERE id = ${nation.id}`);
    changes.push('پرچم');
  }
  if (stmts.length === 0) return [];

  await db.batch([
    ...stmts,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('news', 'تغییر مشخصات کشور', ${`${nation.name}: ${changes.join('، ')} به‌روزرسانی شد.`}, 'global', ${nation.id}, ${now})`,
  ]);
  await audit(db, {
    actor,
    action: 'nation.profile_update',
    targetType: 'nation',
    targetId: nation.id,
    before: { name: nation.name, leaderName: nation.leader_name, flag: nation.flag },
    after: patch,
  });
  return changes;
}

export interface NationView {
  nation: NationSummary;
  economy: {
    treasury: number;
    factoryIncome: number;
    mineIncome: number;
    grossIncome: number;
    maintenanceCost: number;
    taxCost: number;
    netIncome: number;
    cycleSeconds: number;
    nextIncomeIn: number;
    nextIncomeAt: string | null;
    /** درآمد انباشته و دریافت‌نشده (claim-based economy) */
    pendingIncome: number;
    pendingIncomeCycles: number;
    lastIncomeAt: string | null;
    totalIncome: number;
    totalSpent: number;
    totalTax: number;
    totalWarLosses: number;
  };
  military: {
    attackPower: number;
    defensePower: number;
    militaryPower: number;
    equipmentCount: number;
    troopsCount: number;
    radarCount: number;
    airDefenseUnits: number;
  };
  diplomacy: { allies: number; enemies: number; neutral: number; negotiating: number; peace: number };
  history: {
    createdAt: string;
    lastRenameAt: string | null;
    lastLeaderRenameAt: string | null;
    lastFlagChangeAt: string | null;
    cooldowns: { renameSecondsLeft: number; flagSecondsLeft: number; leaderSecondsLeft: number };
  };
  starterTemplateName?: string;
}

export async function buildNationView(
  db: Db,
  nation: NationRow,
  settings: SettingsBundle,
  opts: { includeStarter?: boolean } = {},
): Promise<NationView> {
  const [economyRow, rel] = await Promise.all([loadEconomyRow(db, nation.id), relationCounts(db, nation.id)]);
  const computed = await computeNation(db, nation, settings);
  // درآمد آماده دریافت (claim-based) — محاسبه روی همان snapshot، بدون computeNation اضافه
  const dueCycle = completedCycleIndex(nation.income_anchor_at, computed.income.cycleSeconds, nowSeconds());
  const pendingCycles = Math.max(0, dueCycle - Number(nation.last_income_cycle ?? -1));
  let pendingAmount = 0;
  {
    let sim = nation.treasury;
    for (let i = 0; i < pendingCycles; i++) {
      let net = computed.income.netIncome;
      if (net < 0) net = -Math.min(-net, sim);
      sim += net;
      pendingAmount += net;
    }
  }
  const pending = { cycles: pendingCycles, amount: pendingAmount };
  const cycleSeconds = computed.income.cycleSeconds;
  const elapsed = nowSeconds() - nation.income_anchor_at;
  const completed = Math.max(0, Math.floor(elapsed / cycleSeconds));
  const nextIncomeIn = Math.max(0, (completed + 1) * cycleSeconds - elapsed);

  const view: NationView = {
    nation: mapNationSummary(nation, { incomePerCycle: computed.income.netIncome, allies: rel.allies, enemies: rel.enemies }),
    economy: {
      treasury: nation.treasury,
      factoryIncome: computed.income.factoryIncomeEffective,
      mineIncome: computed.income.mineIncomeEffective,
      grossIncome: computed.income.grossIncome,
      maintenanceCost: computed.income.maintenanceCost,
      taxCost: computed.income.taxCost,
      netIncome: computed.income.netIncome,
      cycleSeconds,
      nextIncomeIn,
      nextIncomeAt: toIso(nowSeconds() + nextIncomeIn),
      pendingIncome: pending.amount,
      pendingIncomeCycles: pending.cycles,
      lastIncomeAt: toIso(nation.last_income_at),
      totalIncome: Number(economyRow?.total_income ?? 0),
      totalSpent: Number(economyRow?.total_spent ?? 0),
      totalTax: Number(economyRow?.total_tax ?? 0),
      totalWarLosses: Number(economyRow?.war_loss_total ?? 0),
    },
    military: {
      attackPower: computed.power.attackPower,
      defensePower: computed.power.defensePower,
      militaryPower: computed.power.militaryPower,
      equipmentCount: computed.power.equipmentCount,
      troopsCount: computed.power.troopsCount,
      radarCount: computed.power.radarCount,
      airDefenseUnits: computed.power.airDefenseUnits,
    },
    diplomacy: rel,
    history: {
      createdAt: toIso(nation.created_at) ?? '',
      lastRenameAt: toIso(nation.last_rename_at),
      lastLeaderRenameAt: toIso(nation.last_leader_rename_at),
      lastFlagChangeAt: toIso(nation.last_flag_change_at),
      cooldowns: {
        renameSecondsLeft: remaining(nation.last_rename_at, settings.profile.renameCooldownSeconds),
        leaderSecondsLeft: remaining(nation.last_leader_rename_at, settings.profile.leaderRenameCooldownSeconds),
        flagSecondsLeft: remaining(nation.last_flag_change_at, settings.profile.flagChangeCooldownSeconds),
      },
    },
  };
  if (opts.includeStarter && nation.starter_template_id) {
    const t = await db.first<{ name: string }>(sql`SELECT name FROM starter_templates WHERE id = ${nation.starter_template_id}`);
    if (t) view.starterTemplateName = t.name;
  }
  return view;
}

function remaining(lastAt: number | null, cooldown: number): number {
  if (!cooldown || !lastAt) return 0;
  return Math.max(0, cooldown - (nowSeconds() - lastAt));
}

export interface DefenseViewPayload {
  defenseScore: number;
  overallScore: number;
  troopsCount: number;
  radarCount: number;
  airDefenseUnits: number;
  fortificationLevel: number;
  defenseMode: string;
  status: 'secure' | 'exposed' | 'under_attack' | 'alert';
  statusLabelFa: string;
  breakdown: { categoryKey: string; labelFa: string; emoji: string; quantity: number; contribution: number }[];
  activeThreats: { warId: number; attackerNationId: number; attackerName: string; flag: string; roundNo: number }[];
}

/** every number on the defense page is computed in the backend (rule 8) */
export async function buildDefenseView(db: Db, nation: NationRow, settings: SettingsBundle): Promise<DefenseViewPayload> {
  const [inventory, weights, nationSettings] = await Promise.all([
    loadInventory(db, nation.id),
    loadCategoryWeights(db),
    loadSettingsForNation(db, nation.id),
  ]);
  const computed = await computeNation(db, nation, settings);

  const byCat = new Map<string, { label: string; emoji: string; qty: number; value: number }>();
  for (const item of inventory) {
    const entry = byCat.get(item.categoryKey) ?? { label: item.categoryLabelFa, emoji: item.emoji, qty: 0, value: 0 };
    const weight = item.defensePoints ?? weights[item.categoryKey] ?? 0;
    entry.qty += item.quantity;
    entry.value += item.quantity * (item.categoryKey === 'factories' || item.categoryKey === 'mines' ? 0 : weight);
    byCat.set(item.categoryKey, entry);
  }
  const breakdown = [...byCat.entries()]
    .filter(([, v]) => v.value > 0)
    .map(([categoryKey, v]) => ({
      categoryKey,
      labelFa: v.label,
      emoji: v.emoji,
      quantity: v.qty,
      contribution: Math.round(v.value * 100) / 100,
    }))
    .sort((a, b) => b.contribution - a.contribution);

  const threats = await db.all<{ warId: number; attackerNationId: number; attackerName: string; flag: string; roundNo: number }>(
    sql`SELECT w.id AS warId, w.attacker_nation_id AS attackerNationId, n.name AS attackerName, n.flag AS flag, w.rounds_played AS roundNo
          FROM wars w JOIN nations n ON n.id = w.attacker_nation_id
         WHERE w.defender_nation_id = ${nation.id} AND w.status IN ('active', 'proposed', 'peace_requested')`,
  );
  const mode = nationSettings?.defense_mode ?? 'standard';
  const status: DefenseViewPayload['status'] =
    threats.length > 0
      ? 'under_attack'
      : mode === 'fortified' || mode === 'alert'
        ? 'alert'
        : computed.power.defensePower < computed.power.attackPower * 0.5
          ? 'exposed'
          : 'secure';

  return {
    defenseScore: computed.power.defensePower,
    overallScore: Math.round((computed.power.defensePower + computed.power.attackPower * 0.5) * 100) / 100,
    troopsCount: computed.power.troopsCount,
    radarCount: computed.power.radarCount,
    airDefenseUnits: computed.power.airDefenseUnits,
    fortificationLevel: nationSettings?.fortification_level ?? 0,
    defenseMode: mode,
    status,
    statusLabelFa: { secure: 'ایمن', exposed: 'آسیب‌پذیر', under_attack: 'تحت حمله', alert: 'هشدار' }[status],
    breakdown,
    activeThreats: threats,
  };
}
