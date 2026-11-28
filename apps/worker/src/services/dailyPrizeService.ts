import { DAILY_PRIZES, type DailyPrizeKey } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { dayKey, nowSeconds } from '../core/format';
import { uuid } from '../core/ids';
import type { SettingsBundle } from '../core/settings';
import { refreshNationStats, type NationRow } from '../db/queries';
import { notify } from './notificationService';

/**
 * جایزه شانسی روزانه — one claim per nation per UTC day.
 * The claim row is written in the same D1 batch as the grant itself, so a nation can
 * never be granted the prize twice and never claims a prize it did not receive.
 */

interface EquipmentPrize {
  key: DailyPrizeKey;
  emoji: string;
  labelFa: string;
  weight: number;
  kind: 'equipment';
  qty: number;
  templateCode: string;
}
interface CoinsPrize {
  key: DailyPrizeKey;
  emoji: string;
  labelFa: string;
  weight: number;
  kind: 'coins';
  amount: number;
}
type PrizeDef = EquipmentPrize | CoinsPrize;

/** weights server-side only; the display list lives in @ww/shared (DAILY_PRIZES) */
const WEIGHTS: Record<DailyPrizeKey, number> = {
  aster30_10: 10,
  soldiers_500: 18,
  su57_5: 8,
  nimitz_1: 5,
  df41_2: 6,
  coins_5000: 25,
  coins_800: 28,
};

const PRIZES: PrizeDef[] = [
  { key: 'aster30_10', emoji: '🛡️', labelFa: '۱۰ پدافند Aster 30', weight: WEIGHTS.aster30_10, kind: 'equipment', qty: 10, templateCode: 'aster_30' },
  { key: 'soldiers_500', emoji: '🪖', labelFa: '۵۰۰ سرباز تکاور', weight: WEIGHTS.soldiers_500, kind: 'equipment', qty: 500, templateCode: 'rangers' },
  { key: 'su57_5', emoji: '✈️', labelFa: '۵ جنگنده SU-57', weight: WEIGHTS.su57_5, kind: 'equipment', qty: 5, templateCode: 'su57' },
  { key: 'nimitz_1', emoji: '🚢', labelFa: '۱ ناو هواپیمابر Nimitz', weight: WEIGHTS.nimitz_1, kind: 'equipment', qty: 1, templateCode: 'nimitz' },
  { key: 'df41_2', emoji: '🚀', labelFa: '۲ موشک DF-41', weight: WEIGHTS.df41_2, kind: 'equipment', qty: 2, templateCode: 'df41' },
  { key: 'coins_5000', emoji: '💰', labelFa: '۵۰۰۰ سکه', weight: WEIGHTS.coins_5000, kind: 'coins', amount: 5000 },
  { key: 'coins_800', emoji: '💰', labelFa: '۸۰۰ سکه', weight: WEIGHTS.coins_800, kind: 'coins', amount: 800 },
];

export interface DailyPrizeView {
  key: string;
  emoji: string;
  labelFa: string;
  kind: 'equipment' | 'coins';
}

export function publicPrizes(): DailyPrizeView[] {
  return PRIZES.map(({ key, emoji, labelFa, kind }) => ({ key, emoji, labelFa, kind }));
}

function publicPrize(key: string): DailyPrizeView {
  const found = PRIZES.find((p) => p.key === key);
  if (found) {
    const { key: k, emoji, labelFa, kind } = found;
    return { key: k, emoji, labelFa, kind };
  }
  // catalogue changed since the claim was stored — show the shared display fallback honestly
  const shared = DAILY_PRIZES.find((p) => p.key === key);
  return shared
    ? { key: shared.key, emoji: shared.emoji, labelFa: shared.labelFa, kind: shared.kind as 'equipment' | 'coins' }
    : { key, emoji: '🎁', labelFa: key, kind: 'coins' };
}

/** weighted pick; rng injectable for deterministic tests */
export function pickPrize(rng: () => number = Math.random): PrizeDef {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let roll = Math.min(Math.max(rng(), 0), 1 - Number.EPSILON) * total;
  for (const prize of PRIZES) {
    roll -= prize.weight;
    if (roll < 0) return prize;
  }
  return PRIZES[PRIZES.length - 1]!;
}

export async function prizeState(db: Db, nationId: number): Promise<{ day: string; claimed: boolean; prize: DailyPrizeView | null }> {
  const day = dayKey(nowSeconds());
  const row = await db.first<{ prize_key: string }>(
    sql`SELECT prize_key FROM daily_prize_claims WHERE nation_id = ${nationId} AND day = ${day}`,
  );
  return { day, claimed: !!row, prize: row ? publicPrize(String(row.prize_key)) : null };
}

export interface ClaimResult {
  alreadyClaimed: boolean;
  day: string;
  prize: DailyPrizeView;
}

export async function claimDailyPrize(
  db: Db,
  nation: NationRow,
  settings: SettingsBundle,
  deps: { rng?: () => number; botToken?: string } = {},
): Promise<ClaimResult> {
  const at = nowSeconds();
  const day = dayKey(at);
  const existing = await db.first<{ prize_key: string }>(
    sql`SELECT prize_key FROM daily_prize_claims WHERE nation_id = ${nation.id} AND day = ${day}`,
  );
  if (existing) return { alreadyClaimed: true, day, prize: publicPrize(String(existing.prize_key)) };

  const prize = pickPrize(deps.rng ?? Math.random);

  // resolve the template BEFORE writing anything — an equipment prize with a missing
  // template must fail loudly, never silently grant nothing
  let template: { id: number; name_fa: string } | null = null;
  if (prize.kind === 'equipment') {
    template = await db.first<{ id: number; name_fa: string }>(
      sql`SELECT id, name_fa FROM equipment_templates WHERE code = ${prize.templateCode} AND is_active = 1`,
    );
    if (!template) {
      throw ApiError.conflict('این جایزه فعلاً در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.');
    }
  }

  const txKey = `prize:${nation.id}:${day}`;
  const balanceBefore = nation.treasury;
  const stmts = [];
  if (prize.kind === 'coins') {
    const amount = prize.amount;
    stmts.push(
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reason, created_at)
           VALUES (${uuid()}, ${nation.id}, 'prize', ${amount}, ${balanceBefore}, ${balanceBefore + amount}, 'coin',
                   ${txKey}, 'prize', 'جایزه شانسی روزانه', ${at})`,
      sql`UPDATE nations SET treasury = treasury + ${amount}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`UPDATE nation_economy SET total_income = total_income + ${amount}, updated_at = ${at} WHERE nation_id = ${nation.id}`,
    );
  } else {
    stmts.push(
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity)
           VALUES (${nation.id}, ${template!.id}, ${prize.qty})
           ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + excluded.quantity, updated_at = ${at}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reason, created_at)
           VALUES (${uuid()}, ${nation.id}, 'prize', 0, ${balanceBefore}, ${balanceBefore}, 'coin',
                   ${txKey}, 'prize', ${`جایزه شانسی روزانه — ${prize.labelFa}`}, ${at})`,
    );
  }
  stmts.push(sql`INSERT INTO daily_prize_claims (nation_id, day, prize_key, created_at) VALUES (${nation.id}, ${day}, ${prize.key}, ${at})`);

  try {
    await db.batch(stmts);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('unique')) {
      // lost a race against a concurrent claim — report what was actually granted
      const winner = await db.first<{ prize_key: string }>(
        sql`SELECT prize_key FROM daily_prize_claims WHERE nation_id = ${nation.id} AND day = ${day}`,
      );
      if (winner) return { alreadyClaimed: true, day, prize: publicPrize(String(winner.prize_key)) };
    }
    throw err;
  }

  await refreshNationStats(db, { ...nation, treasury: prize.kind === 'coins' ? balanceBefore + prize.amount : balanceBefore }, settings);
  // telegram chat id = the owner's telegram id, never the internal users.id
  const owner = await db.first<{ telegram_user_id: number }>(
    sql`SELECT u.telegram_user_id FROM nations n JOIN users u ON u.id = n.owner_user_id WHERE n.id = ${nation.id}`,
  );
  await notify(db, {
    nationId: nation.id,
    kind: 'prize',
    title: '🎁 جایزه شانسی روزانه',
    body: `تبریک! «${prize.labelFa}» به دارایی شما اضافه شد.`,
    telegram: deps.botToken && owner ? { botToken: deps.botToken, chatId: Number(owner.telegram_user_id), text: `🎁 تبریک! «${prize.labelFa}» به دارایی شما اضافه شد.` } : null,
  });

  return { alreadyClaimed: false, day, prize: publicPrize(prize.key) };
}
