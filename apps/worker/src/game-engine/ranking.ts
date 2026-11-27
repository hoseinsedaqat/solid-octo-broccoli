import { RANKING_METRICS, type RankingMetric } from '@ww/shared';

export interface RankableNation {
  nationId: number;
  name: string;
  flag: string;
  leaderName: string;
  treasury: number;
  income: number;
  militaryPower: number;
  equipmentCount: number;
  warWins: number;
  economicScore: number;
}

export interface RankedNation extends RankableNation {
  rank: number;
  score: number;
  metrics: Record<string, number>;
}

/**
 * Each metric is normalised to 0..1 against the strongest nation and then
 * weighted; weights are admin-configurable (game_settings.ranking_weights).
 * Normalising keeps the leaderboard stable when the economy inflates.
 */
export function rankNations(
  nations: RankableNation[],
  weights: Partial<Record<RankingMetric, number>> = {},
  orderBy: RankingMetric | 'total' = 'total',
): RankedNation[] {
  const max: Record<string, number> = {};
  for (const m of RANKING_METRICS) {
    max[m] = nations.reduce((acc, n) => Math.max(acc, metricOf(n, m) || 0), 0) || 1;
  }
  const scored = nations.map((n) => {
    const metrics: Record<string, number> = {};
    let total = 0;
    for (const m of RANKING_METRICS) {
      const w = weights[m] ?? 1;
      const normalized = max[m]! > 0 ? metricOf(n, m) / max[m]! : 0;
      metrics[m] = Math.round(normalized * 10000) / 10000;
      total += normalized * w * 1000;
    }
    return { ...n, metrics, score: Math.round(total * 100) / 100 } as RankedNation;
  });

  const sorted = [...scored].sort((a, b) => {
    const key = orderBy === 'total' ? b.score - a.score : metricOf(b, orderBy) - metricOf(a, orderBy);
    return key !== 0 ? key : a.nationId - b.nationId;
  });
  return sorted.map((n, i) => ({ ...n, rank: i + 1 }));
}

export function metricOf(n: RankableNation, m: RankingMetric): number {
  switch (m) {
    case 'treasury':
      return n.treasury;
    case 'military_power':
      return n.militaryPower;
    case 'income':
      return n.income;
    case 'equipment_count':
      return n.equipmentCount;
    case 'war_wins':
      return n.warWins;
    case 'economic_score':
      return n.economicScore;
    default:
      return 0;
  }
}
