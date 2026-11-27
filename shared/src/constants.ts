/**
 * World War — canonical game data.
 *
 * IMPORTANT (project rules):
 *  - Equipment PRICES are intentionally NOT defined here. `price: null` means
 *    "not configured by the admin" and the item is NOT purchasable.
 *    Seeding invented prices is forbidden (rule 12 of the brief).
 *  - Initial nation data below is taken verbatim from the game design document.
 */

export const COIN = 'سکه';
export const CURRENCY_CODE = 'coin';

/** BC-based ordering used by the UI for the 18 required categories. */
export interface CategoryDef {
  key: string;
  labelFa: string;
  /** Label used on the shop grid buttons (2 columns). */
  shopLabelFa: string;
  emoji: string;
  /** Whether owning more of this category helps attack / defense. */
  role: 'offense' | 'defense' | 'economy' | 'support';
}

export const EQUIPMENT_CATEGORIES: readonly CategoryDef[] = [
  { key: 'tanks', labelFa: 'تانک‌ها', shopLabelFa: 'خرید تانک', emoji: '🪖', role: 'offense' },
  { key: 'ground_air_defense', labelFa: 'پدافند زمینی', shopLabelFa: 'خرید پدافند زمینی', emoji: '🛡️', role: 'defense' },
  { key: 'air_air_defense', labelFa: 'پدافند هوایی', shopLabelFa: 'خرید پدافند هوایی', emoji: '🛡️', role: 'defense' },
  { key: 'naval_air_defense', labelFa: 'پدافند دریایی', shopLabelFa: 'خرید پدافند دریایی', emoji: '⚓', role: 'defense' },
  { key: 'factories', labelFa: 'کارخانه‌ها', shopLabelFa: 'خرید کارخانه', emoji: '🏭', role: 'economy' },
  { key: 'mines', labelFa: 'معادن', shopLabelFa: 'خرید معدن', emoji: '⛏️', role: 'economy' },
  { key: 'apc', labelFa: 'نفربرها', shopLabelFa: 'خرید نفربر', emoji: '🚛', role: 'offense' },
  { key: 'rockets', labelFa: 'راکت‌ها', shopLabelFa: 'خرید راکت', emoji: '🚀', role: 'offense' },
  { key: 'helicopters', labelFa: 'هلیکوپترها', shopLabelFa: 'خرید هلیکوپتر', emoji: '🚁', role: 'offense' },
  { key: 'radars', labelFa: 'رادارها', shopLabelFa: 'خرید رادار', emoji: '📡', role: 'support' },
  { key: 'submarines', labelFa: 'زیردریایی‌ها', shopLabelFa: 'خرید زیردریایی', emoji: '🌊', role: 'offense' },
  { key: 'drones', labelFa: 'پهپادها', shopLabelFa: 'خرید پهپاد', emoji: '🛩️', role: 'offense' },
  { key: 'soldiers', labelFa: 'سربازها', shopLabelFa: 'خرید سرباز', emoji: '🪖', role: 'offense' },
  { key: 'artillery', labelFa: 'توپخانه', shopLabelFa: 'خرید توپخانه', emoji: '💥', role: 'offense' },
  { key: 'ships', labelFa: 'ناوها', shopLabelFa: 'خرید ناو', emoji: '🚢', role: 'offense' },
  { key: 'transport_aircraft', labelFa: 'هواپیماهای ترابری', shopLabelFa: 'خرید هواپیمای ترابری', emoji: '✈️', role: 'support' },
  { key: 'fighters', labelFa: 'جنگنده‌ها', shopLabelFa: 'خرید جنگنده', emoji: '🛫', role: 'offense' },
  { key: 'missiles', labelFa: 'موشک‌ها', shopLabelFa: 'خرید موشک', emoji: '🚀', role: 'offense' },
] as const;

export interface ItemDef {
  code: string;
  nameFa: string;
  quantity: number;
  unitFa: string;
  /** null => price not set by the admin, purchase disabled. */
  price: number | null;
  /** Abstract game points (attack or defense value). null => not configured. */
  attackPoints: number | null;
  defensePoints: number | null;
  descriptionFa: string;
}

/** The starter pack, exactly as specified in the design document. */
export const STARTER_PACK: Readonly<Record<string, readonly ItemDef[]>> = {
  tanks: [
    { code: 'm1_abrams', nameFa: 'M1 Abrams', quantity: 100, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'تانک اصلی میدان نبرد' },
    { code: 'leopard_2a7', nameFa: 'Leopard 2A7', quantity: 50, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'تانک سبک و چابک' },
  ],
  ground_air_defense: [
    { code: 'patriot', nameFa: 'Patriot', quantity: 20, unitFa: 'واحد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'سامت پدافند زمینی' },
    { code: 's400', nameFa: 'S-400', quantity: 10, unitFa: 'واحد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'سامت پدافند زمینی' },
  ],
  air_air_defense: [
    { code: 'f35_ad', nameFa: 'F-35', quantity: 5, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'پدافند هوایی (ثبت جدا از دسته جنگنده‌ها)' },
    { code: 'f22_ad', nameFa: 'F-22', quantity: 3, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'پدافند هوایی (ثبت جدا از دسته جنگنده‌ها)' },
  ],
  naval_air_defense: [
    { code: 'aegis', nameFa: 'Aegis', quantity: 5, unitFa: 'واحد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'سامت پدافند دریایی' },
    { code: 'aster_30', nameFa: 'Aster 30', quantity: 10, unitFa: 'واحد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'سامت پدافند دریایی' },
  ],
  factories: [
    { code: 'steel_plant', nameFa: 'کارخانه فولاد', quantity: 2, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'تولید درآمد کارخانه‌ای' },
    { code: 'aircraft_plant', nameFa: 'کارخانه هواپیماسازی', quantity: 1, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'تولید درآمد کارخانه‌ای' },
  ],
  mines: [
    { code: 'gold_mine', nameFa: 'معدن طلا', quantity: 2, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'تولید درآمد معدنی' },
    { code: 'iron_mine', nameFa: 'معدن آهن', quantity: 3, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'تولید درآمد معدنی' },
  ],
  apc: [
    { code: 'm113_apc', nameFa: 'M113 APC', quantity: 100, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'نفربر زرهی' },
    { code: 'stryker_icv', nameFa: 'Stryker ICV', quantity: 50, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'نفربر زرهی' },
  ],
  rockets: [
    { code: 'hydra_70', nameFa: 'Hydra 70', quantity: 100, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'راکت هوا‌به‌زمین' },
    { code: 's8_rocket', nameFa: 'S-8 Rocket', quantity: 50, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'راکت هوا‌به‌زمین' },
  ],
  helicopters: [
    { code: 'ah64_apache', nameFa: 'AH-64 Apache', quantity: 10, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'هلیکوپتر تهاجمی' },
    { code: 'mi28_havoc', nameFa: 'Mi-28 Havoc', quantity: 5, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'هلیکوپتر تهاجمی' },
  ],
  radars: [
    { code: 'an_tpy2', nameFa: 'AN/TPY-2', quantity: 5, unitFa: 'دستگاه', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'رادار هشدار زودهنگام' },
    { code: 'an_spy6', nameFa: 'AN/SPY-6', quantity: 3, unitFa: 'دستگاه', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'رادار هشدار زودهنگام' },
  ],
  submarines: [
    { code: 'virginia_class', nameFa: 'Virginia-class', quantity: 2, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'زیردریایی' },
    { code: 'kilo_class', nameFa: 'Kilo-class', quantity: 3, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'زیردریایی' },
  ],
  drones: [
    { code: 'mq9_reaper', nameFa: 'MQ-9 Reaper', quantity: 10, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'پهپاد رزمی' },
    { code: 'bayraktar_tb2', nameFa: 'Bayraktar TB2', quantity: 20, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'پهپاد رزمی' },
  ],
  soldiers: [
    { code: 'infantry', nameFa: 'سرباز پیاده', quantity: 10000, unitFa: 'نفر', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'نیروی انسانی پایه' },
    { code: 'rangers', nameFa: 'تکاور', quantity: 2000, unitFa: 'نفر', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'نیروی ویژه رزمی' },
    { code: 'special_forces', nameFa: 'نیروی ویژه', quantity: 500, unitFa: 'نفر', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'نیروی ویژه' },
    { code: 'snipers', nameFa: 'تک‌تیرانداز', quantity: 300, unitFa: 'نفر', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'تک‌تیرانداز' },
  ],
  artillery: [
    { code: 'pzh2000', nameFa: 'PzH 2000', quantity: 10, unitFa: 'دستگاه', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'توپخانه خودکشش' },
    { code: 'k9_thunder', nameFa: 'K9 Thunder', quantity: 15, unitFa: 'دستگاه', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'توپخانه خودکشش' },
  ],
  ships: [
    { code: 'gerald_r_ford', nameFa: 'Gerald R. Ford', quantity: 1, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'ناو هواپیمابر' },
    { code: 'nimitz', nameFa: 'Nimitz', quantity: 1, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'ناو هواپیمابر' },
  ],
  transport_aircraft: [
    { code: 'c17_globemaster', nameFa: 'C-17 Globemaster III', quantity: 5, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'هواپیمای ترابری سنگین' },
    { code: 'c130j_super_hercules', nameFa: 'C-130J Super Hercules', quantity: 10, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'هواپیمای ترابری تاکتیکی' },
  ],
  fighters: [
    { code: 'f22_raptor', nameFa: 'F-22 Raptor', quantity: 5, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'جنگنده (ثبت جدا از دسته پدافند هوایی)' },
    { code: 'f35_lightning2', nameFa: 'F-35 Lightning II', quantity: 10, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'جنگنده (ثبت جدا از دسته پدافند هوایی)' },
    { code: 'su57', nameFa: 'Su-57', quantity: 5, unitFa: 'فروند', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'جنگنده' },
  ],
  missiles: [
    { code: 'df41', nameFa: 'DF-41', quantity: 5, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'موشک بالستیک' },
    { code: 'tomahawk', nameFa: 'Tomahawk', quantity: 20, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'موشک کروز' },
    { code: 'brahmos', nameFa: 'BrahMos', quantity: 10, unitFa: 'عدد', price: null, attackPoints: null, defensePoints: null, descriptionFa: 'موشک کروز' },
  ],
};

export interface StarterEconomyDef {
  treasury: number;
  factoryIncome: number;
  mineIncome: number;
  /** seconds between automatic revenue credits */
  incomeCycleSeconds: number;
}

export const STARTER_ECONOMY: StarterEconomyDef = {
  treasury: 1_000_000,
  factoryIncome: 50_000,
  mineIncome: 30_000,
  incomeCycleSeconds: 24 * 60 * 60,
};

/**
 * incomeCycleSeconds = 86400 (24h). Total income = factory + mine = 80000.
 *
 * The design document gives the income of a starter nation as SECTION TOTALS
 * (50 000 from factories, 30 000 from mines) but never prices a single plant, so
 * the per-unit growth values are DERIVED from the starter pack instead of invented:
 *   factory unit = 50 000 / 3 factories  = 16 667 / cycle
 *   mine unit    = 30 000 / 5 mines       = 6 000 / cycle
 * A starter nation therefore earns exactly 50 000 + 30 000 = 80 000 per cycle, and
 * every factory/mine bought beyond the starter pack adds the derived unit value.
 * Both values stay admin-configurable (economy_settings) if the balance should change.
 */
function starterUnitCount(category: string): number {
  const list = (STARTER_PACK as Record<string, readonly ItemDef[] | undefined>)[category];
  return (list ?? []).reduce((sum, item) => sum + item.quantity, 0);
}

export const FACTORY_COUNT_IN_STARTER = starterUnitCount('factories'); // 2 steel + 1 aircraft = 3
export const MINE_COUNT_IN_STARTER = starterUnitCount('mines'); // 2 gold + 3 iron = 5
export const DERIVED_FACTORY_INCOME_PER_UNIT = FACTORY_COUNT_IN_STARTER > 0 ? Math.round(STARTER_ECONOMY.factoryIncome / FACTORY_COUNT_IN_STARTER) : 0; // 16667
export const DERIVED_MINE_INCOME_PER_UNIT = MINE_COUNT_IN_STARTER > 0 ? Math.round(STARTER_ECONOMY.mineIncome / MINE_COUNT_IN_STARTER) : 0; // 6000

/** Flags offered at onboarding (emoji only -> no paid image assets). */
export const FLAG_CHOICES = [
  '🏳️', '🏴', '🟦🟨🟥', '🟩🟨🟥', '⬛⬜🟥', '🟥⬜🟦', '🟨🟩', '🟦🟥',
  '🔵🟡', '🟢⚪🔴', '🟣🟠', '⚪🔵', '🌙⭐', '🦅', '🐉', '🛡️',
] as const;

export const RELATION_STATUSES = ['neutral', 'friend', 'ally', 'enemy', 'negotiating', 'peace_treaty'] as const;
export type RelationStatus = (typeof RELATION_STATUSES)[number];

export const RELATION_LABELS_FA: Record<RelationStatus, string> = {
  neutral: 'بی‌طرف',
  friend: 'دوست',
  ally: 'متحد',
  enemy: 'دشمن',
  negotiating: 'در حال مذاکره',
  peace_treaty: 'دارای پیمان صلح',
};

export const ROLES = ['player', 'admin', 'super_admin'] as const;
export type Role = (typeof ROLES)[number];

export const NATIONALITY_STATUS = ['active', 'frozen', 'banned', 'at_war', 'in_alliance'] as const;
export type NationStatus = (typeof NATIONALITY_STATUS)[number];

export const TRANSACTION_TYPES = [
  'starter_grant',
  'revenue',
  'purchase',
  'admin_credit',
  'admin_debit',
  'admin_correction',
  'war_indemnity',
  'war_cost',
  'tax',
  'maintenance',
  'battle_loss_compensation',
] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_TYPE_LABELS_FA: Record<TransactionType, string> = {
  starter_grant: 'دارایی اولیه کشور',
  revenue: 'درآمد دوره‌ای',
  purchase: 'خرید تجهیزات',
  admin_credit: 'افزایش توسط مدیر',
  admin_debit: 'کاهش توسط مدیر',
  admin_correction: 'اصلاح مالی مدیر',
  war_indemnity: 'غرامت جنگ',
  war_cost: 'هزینه جنگ',
  tax: 'مالیات',
  maintenance: 'هزینه نگهداری',
  battle_loss_compensation: 'جبران خسارت',
};

export const WAR_STATUS = ['proposed', 'accepted', 'active', 'peace_requested', 'ended', 'cancelled', 'stopped_by_admin'] as const;
export type WarStatus = (typeof WAR_STATUS)[number];

export const WAR_STATUS_LABELS_FA: Record<WarStatus, string> = {
  proposed: 'در انتظار پذیرش',
  accepted: 'پذیرفته‌شده',
  active: 'فعال',
  peace_requested: 'درخواست صلح',
  ended: 'پایان‌یافته',
  cancelled: 'لغوشده',
  stopped_by_admin: 'متوقف‌شده توسط مدیر',
};

export const REQUEST_STATUS = ['pending', 'accepted', 'rejected', 'cancelled', 'expired'] as const;
export type RequestStatus = (typeof REQUEST_STATUS)[number];

export const DIPLOMACY_REQUEST_KINDS = ['friendship', 'alliance', 'peace', 'non_aggression', 'war', 'message', 'dissolve'] as const;
export type DiplomacyRequestKind = (typeof DIPLOMACY_REQUEST_KINDS)[number];

export const DIPLOMACY_KIND_LABELS_FA: Record<DiplomacyRequestKind, string> = {
  friendship: 'درخواست دوستی',
  alliance: 'درخواست اتحاد',
  peace: 'درخواست صلح',
  non_aggression: 'پیمان عدم تجاوز',
  war: 'اعلام جنگ',
  message: 'پیام دیپلماتیک',
  dissolve: 'لغو روابط',
};

export const STATEMENT_STATUS = ['draft', 'pending_review', 'published', 'rejected', 'removed'] as const;
export type StatementStatus = (typeof STATEMENT_STATUS)[number];

export const STATEMENT_STATUS_LABELS_FA: Record<StatementStatus, string> = {
  draft: 'پیش‌نویس',
  pending_review: 'در انتظار تأیید مدیر',
  published: 'منتشرشده',
  rejected: 'ردشده',
  removed: 'حذف‌شده',
};

/** Ranking metrics; weights are admin-configurable via game_settings. */
export const RANKING_METRICS = [
  'treasury',
  'military_power',
  'income',
  'equipment_count',
  'war_wins',
  'economic_score',
] as const;
export type RankingMetric = (typeof RANKING_METRICS)[number];

export const RANKING_LABELS_FA: Record<RankingMetric, string> = {
  treasury: 'ثروتمندترین کشور',
  military_power: 'قوی‌ترین کشور',
  income: 'بیشترین درآمد',
  equipment_count: 'بیشترین تجهیزات',
  war_wins: 'بیشترین پیروزی',
  economic_score: 'بهترین عملکرد اقتصادی',
};

export const DEFAULT_RANKING_WEIGHTS: Record<RankingMetric, number> = {
  treasury: 1,
  military_power: 1,
  income: 1,
  equipment_count: 0.5,
  war_wins: 1,
  economic_score: 1,
};

/**
 * Abstract per-category power weights. These are *structural defaults* for the
 * battle engine (not prices) and are fully editable by the admin in
 * /app/admin → «ضرایب نبرد». Equipment rows keep their own attack/defense
 * points as NULL until the admin sets them; while NULL, the category weight is
 * used so that the game can run at all.
 */
export const DEFAULT_CATEGORY_POWER_WEIGHTS: Record<string, number> = {
  tanks: 10, ground_air_defense: 8, air_air_defense: 9, naval_air_defense: 7,
  factories: 0, mines: 0, apc: 3, rockets: 2, helicopters: 6, radars: 4,
  submarines: 12, drones: 4, soldiers: 0.2, artillery: 8, ships: 30,
  transport_aircraft: 1, fighters: 12, missiles: 15,
};

export const DEFAULT_BATTLE_PARAMS = {
  /** controlled randomness range: 1 ± warRandomness */
  warRandomness: 0.15,
  /** share of the enemy pool destroyed per round */
  damagePerRound: 0.08,
  maxRounds: 12,
  /** attacker advantage multiplier */
  attackerAdvantage: 1.05,
  /** defender (home) advantage multiplier */
  defenderAdvantage: 1.1,
  /** manpower -> points factor (used when soldiers have no explicit points) */
  manpowerFactor: 0.2,
  /** radar support bonus ratio applied to defense */
  radarSupportBonus: 0.05,
  /** alliance defense sharing ratio */
  allianceSupportRatio: 0.25,
  /** coin indemnity per destroyed power point */
  indemnityPerPoint: 100,
  /** flat entry cost multiplier of treasury */
  warEntryTaxRate: 0,
  minWarDurationSeconds: 3600,
  warCooldownSeconds: 6 * 3600,
  maxActiveWarsPerNation: 1,
  maxAttackersPerTarget: 1,
  peaceCooldownSeconds: 12 * 3600,
} as const;

export type BattleParams = typeof DEFAULT_BATTLE_PARAMS;

/** Country-management rate limits, admin-configurable. */
export const DEFAULT_PROFILE_RULES = {
  renameCooldownSeconds: 7 * 24 * 3600,
  leaderRenameCooldownSeconds: 7 * 24 * 3600,
  flagChangeCooldownSeconds: 24 * 3600,
  maxNationsPerUser: 1,
} as const;

/** Diplomacy limits, admin-configurable. */
export const DEFAULT_DIPLOMACY_RULES = {
  maxPendingRequestsPerNation: 20,
  maxFriends: 30,
  maxAllianceMembers: 12,
  requestExpirySeconds: 72 * 3600,
  allowNeutralAttacks: true,
} as const;

/** Economy rules, admin-configurable. */
export const DEFAULT_ECONOMY_RULES = {
  incomeCycleSeconds: STARTER_ECONOMY.incomeCycleSeconds,
  factoryIncomePerUnit: DERIVED_FACTORY_INCOME_PER_UNIT,
  mineIncomePerUnit: DERIVED_MINE_INCOME_PER_UNIT,
  /** tax on gross revenue, ratio 0..1 */
  taxRate: 0,
  /** maintenance per cycle, ratio of a configured upkeep base */
  maintenanceRate: 0,
  /** per-unit upkeep by category (admin-filled) */
  maintenancePerUnit: {} as Record<string, number>,
  /** max cycles credited in one cron run (catch-up cap) */
  maxCatchupCycles: 3,
  /** minimum treasury allowed (DB CHECK mirrors 0) */
  minTreasury: 0,
  negativeBalanceAllowed: false,
  globalMultiplier: 1,
} as const;

export type EconomyRules = typeof DEFAULT_ECONOMY_RULES;

/** Game sections that can be toggled on/off by the admin. */
export const FEATURE_FLAGS = {
  warEnabled: true,
  shopEnabled: true,
  diplomacyEnabled: true,
  statementsEnabled: true,
  statementsRequireApproval: false,
  attacksRequireVictimApproval: true,
  miniAppEnabled: true,
} as const;

export const GAME_SETTING_KEYS = {
  battle: 'battle_params',
  economy: 'economy_rules',
  profile: 'profile_rules',
  diplomacy: 'diplomacy_rules',
  features: 'feature_flags',
  rankingWeights: 'ranking_weights',
  categoryWeights: 'category_power_weights',
  branding: 'branding',
  quota: 'quota_guard',
} as const;

export const DEFAULT_BRANDING = {
  gameName: 'World War',
  welcomeTitle: '🌍 به World War خوش آمدید!',
  welcomeText:
    '🌍 به World War خوش آمدید!\n\nکشور خود را بسازید، اقتصاد آن را توسعه دهید، ارتش بچینید و در جنگ‌های جهانی شرکت کنید.\nبرای شروع «ایجاد کشور» را بزنید.',
  nationNamePrompt: '✍️ نام کشور خود را ارسال کنید (۳ تا ۳۰ نویسه، یکتا):',
  leaderNamePrompt: '✍️ نام رئیس کشور را ارسال کنید (۲ تا ۴۰ نویسه):',
  flagPrompt: '🚩 پرچم کشور خود را انتخاب کنید:',
  statementPrompt:
    '📜 صدور بیانیه\n\nلطفاً متن بیانیه خود را ارسال کنید.\n\nبیانیه شما پس از ثبت، به عنوان موضع رسمی کشور شما منتشر خواهد شد.\n\n✍️ متن بیانیه را در یک پیام ارسال کنید.',
} as const;

export type Branding = typeof DEFAULT_BRANDING;

/** Quota guard thresholds (free plan), admin-configurable. */
export const DEFAULT_QUOTA_GUARD = {
  /** stop non-essential cron work above this share of the daily D1 read limit */
  d1RowsDailySoftLimit: 5_000_000,
  cronFailuresBeforePause: 5,
  warnAtPercent: 80,
} as const;

export const ROUTES = {
  playerRoot: '/app/player',
  adminRoot: '/app/admin',
  apiRoot: '/api',
  webhook: '/api/telegram/webhook',
} as const;

export const PLAYER_PAGES = [
  'dashboard', 'economy', 'military', 'marketplace', 'country', 'war',
  'defense', 'diplomacy', 'statements', 'news', 'rankings', 'settings',
] as const;
export type PlayerPage = (typeof PLAYER_PAGES)[number];

export const PLAYER_PAGE_META: Record<PlayerPage, { labelFa: string; emoji: string }> = {
  dashboard: { labelFa: 'داشبورد', emoji: '🏠' },
  economy: { labelFa: 'اقتصاد', emoji: '💰' },
  military: { labelFa: 'دارایی نظامی', emoji: '🎖️' },
  marketplace: { labelFa: 'فروشگاه', emoji: '🛒' },
  country: { labelFa: 'مدیریت کشور', emoji: '🛡️' },
  war: { labelFa: 'جنگ', emoji: '⚔️' },
  defense: { labelFa: 'دفاع', emoji: '🛡️' },
  diplomacy: { labelFa: 'دیپلماسی', emoji: '🌐' },
  statements: { labelFa: 'بیانیه‌ها', emoji: '📜' },
  news: { labelFa: 'اخبار', emoji: '📰' },
  rankings: { labelFa: 'رتبه‌بندی', emoji: '📊' },
  settings: { labelFa: 'تنظیمات', emoji: '⚙️' },
};

export const ADMIN_PAGES = [
  'overview', 'users', 'nations', 'economy', 'shop', 'categories', 'wars',
  'diplomacy', 'statements', 'settings', 'audit', 'quota', 'backup', 'roles',
] as const;
export type AdminPage = (typeof ADMIN_PAGES)[number];

export const ADMIN_PAGE_META: Record<AdminPage, { labelFa: string; emoji: string }> = {
  overview: { labelFa: 'داشبورد', emoji: '📊' },
  users: { labelFa: 'کاربران', emoji: '👥' },
  nations: { labelFa: 'کشورها', emoji: '🌍' },
  economy: { labelFa: 'اقتصاد', emoji: '💰' },
  shop: { labelFa: 'فروشگاه', emoji: '🛒' },
  categories: { labelFa: 'دسته‌بندی‌ها', emoji: '🗂️' },
  wars: { labelFa: 'جنگ‌ها', emoji: '⚔️' },
  diplomacy: { labelFa: 'دیپلماسی', emoji: '🌐' },
  statements: { labelFa: 'بیانیه‌ها', emoji: '📜' },
  settings: { labelFa: 'تنظیمات بازی', emoji: '⚙️' },
  audit: { labelFa: 'Audit Log', emoji: '🧾' },
  quota: { labelFa: 'سهمیه', emoji: '📈' },
  backup: { labelFa: 'پشتیبان‌گیری', emoji: '💾' },
  roles: { labelFa: 'نقش‌ها', emoji: '🔐' },
};

/** Admin permission sections (mirrors admin_permissions.resource). */
export const ADMIN_SECTIONS = [
  'users', 'nations', 'economy', 'shop', 'wars', 'diplomacy',
  'statements', 'settings', 'roles', 'backup', 'quota', 'audit',
] as const;
export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export const MAX_STATEMENT_CHARS = 1200;
export const MIN_STATEMENT_CHARS = 10;
