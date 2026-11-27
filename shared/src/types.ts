export interface NationSummary {
  id: number;
  name: string;
  flag: string;
  leaderName: string;
  status: string;
  treasury: number;
  incomePerCycle: number;
  militaryPower: number;
  economicScore: number;
  totalScore: number;
  worldRank: number;
  alliesCount: number;
  enemiesCount: number;
  warsCount: number;
  winsCount: number;
  lossesCount: number;
  equipmentCount: number;
  troopsCount: number;
  createdAt: string;
}

export interface NationEconomyView {
  treasury: number;
  factoryIncome: number;
  mineIncome: number;
  grossIncome: number;
  maintenanceCost: number;
  taxCost: number;
  netIncome: number;
  incomeCycleSeconds: number;
  nextIncomeAt: string | null;
  lastIncomeAt: string | null;
  cycleSeconds: number;
  upkeepBase: number;
}

export interface InventoryItem {
  id: number;
  templateId: number;
  code: string;
  nameFa: string;
  categoryKey: string;
  categoryLabelFa: string;
  emoji: string;
  quantity: number;
  unitFa: string;
  price: number | null;
  attackPoints: number | null;
  defensePoints: number | null;
  purchaseLimitPerCycle: number | null;
  purchasable: boolean;
  descriptionFa: string;
  updatedAt: string;
}

export interface ShopItem extends Omit<InventoryItem, 'quantity'> {
  templateId: number;
  ownedQuantity: number;
  purchasable: boolean;
  disabledReason: string | null;
}

export interface TransactionRow {
  id: number;
  type: string;
  typeLabelFa: string;
  amount: number;
  balanceAfter: number | null;
  note: string | null;
  counterpartyNationId: number | null;
  createdAt: string;
  items?: { nameFa: string; quantity: number; unitPrice: number | null; total: number | null }[];
}

export interface AuthPayload {
  token: string;
  userId: number;
  telegramId: number;
  role: 'player' | 'admin' | 'super_admin';
  nation: NationSummary | null;
  nations: NationSummary[];
  expiresAt: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface BattleReportSide {
  nationId: number;
  nationName: string;
  flag: string;
  power: number;
  losses: number;
  roundsWon: number;
}

export interface BattleReportView {
  id: number;
  warId: number;
  roundNo: number;
  winnerSide: 'attacker' | 'defender' | 'draw';
  attackerWinChance: number;
  attacker: BattleReportSide;
  defender: BattleReportSide;
  indemnity: number;
  createdAt: string;
  detail: { attackerLossesByCategory: Record<string, number>; defenderLossesByCategory: Record<string, number>; seed: number };
}

export interface RankingRow {
  rank: number;
  nationId: number;
  name: string;
  flag: string;
  leaderName: string;
  score: number;
  metrics: Record<string, number>;
}

export interface WarView {
  id: number;
  attackerNationId: number;
  defenderNationId: number;
  attackerName: string;
  defenderName: string;
  attackerFlag: string;
  defenderFlag: string;
  status: string;
  statusLabelFa: string;
  initiatedBy: 'attacker' | 'defender';
  attackerPower: number;
  defenderPower: number;
  attackerWinChance: number;
  roundsPlayed: number;
  maxRounds: number;
  entryCost: number;
  indemnityOffered: number;
  startedAt: string | null;
  endsAt: string | null;
  createdAt: string;
  winnerNationId: number | null;
}

export interface DiplomacyRelationRow {
  otherNationId: number;
  otherNationName: string;
  otherFlag: string;
  otherLeaderName: string;
  status: string;
  statusLabelFa: string;
  since: string;
  allianceId: number | null;
  allianceName: string | null;
}

export interface DiplomacyRequestRow {
  id: number;
  kind: string;
  kindLabelFa: string;
  status: string;
  fromNationId: number;
  fromNationName: string;
  fromFlag: string;
  toNationId: number;
  toNationName: string;
  toFlag: string;
  message: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface StatementRow {
  id: number;
  nationId: number;
  nationName: string;
  flag: string;
  leaderName: string;
  text: string;
  status: string;
  statusLabelFa: string;
  createdAt: string;
  publishedAt: string | null;
  reviewNote: string | null;
}

export interface NewsItem {
  id: number;
  kind: string;
  emoji: string;
  title: string;
  body: string;
  nationId: number | null;
  flag: string | null;
  createdAt: string;
}

export interface DefenseView {
  defenseScore: number;
  overallScore: number;
  troopsCount: number;
  radarCount: number;
  airDefenseUnits: number;
  fortificationLevel: number;
  status: 'secure' | 'exposed' | 'under_attack' | 'alert';
  statusLabelFa: string;
  breakdown: { categoryKey: string; labelFa: string; emoji: string; quantity: number; contribution: number }[];
  activeThreats: { warId: number; attackerNationId: number; attackerName: string; flag: string; roundNo: number }[];
}
