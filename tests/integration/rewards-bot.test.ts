import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { all, botCallback, botText, createWorld, first, onboardViaBot, type World } from '../helpers/harness';

/** rewards card + defense arranger, driven through the bot exactly like a player */
let world: World;
const TID = 900_001;
let nation = 0;

const sentTexts = () =>
  world.sent
    .filter((s) => s.method === 'sendMessage' || s.method === 'editMessageText')
    .map((s) => String(s.payload.text ?? ''));

beforeAll(async () => {
  world = await createWorld({ adminIds: '' });
  nation = await onboardViaBot(world, TID, 'جایزه‌لو', 'داریوش');
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

describe('bot «🎁 جوایز روزانه»', () => {
  it('shows the prize list card', async () => {
    world.sent.length = 0;
    await botText(world, TID, '🎁 جوایز روزانه');
    const card = sentTexts().find((t) => t.includes('جایزه شانسی روزانه'));
    expect(card).toBeTruthy();
    expect(card).toContain('Nimitz');
    expect(card).toContain('DF-41');
  });

  it('claim button grants exactly one prize, then shows the claimed state', async () => {
    world.sent.length = 0;
    await botCallback(world, TID, 'prize:claim');
    const texts = sentTexts();
    expect(texts.some((t) => t.includes('به دارایی شما اضافه شد') || t.includes('قبلاً دریافت شده بود'))).toBe(true);

    const claims = await all<any>(world.db, `SELECT * FROM daily_prize_claims WHERE nation_id = ?`, nation);
    expect(claims).toHaveLength(1);

    // second tap — no double grant
    const before = claims[0]!.prize_key;
    world.sent.length = 0;
    await botCallback(world, TID, 'prize:claim');
    expect(sentTexts().some((t) => t.includes('قبلاً دریافت شده بود'))).toBe(true);
    const claims2 = await all<any>(world.db, `SELECT * FROM daily_prize_claims WHERE nation_id = ?`, nation);
    expect(claims2).toHaveLength(1);
    expect(claims2[0]!.prize_key).toBe(before);
  });
});

describe('bot «🛡️ دفاع» (آرایش دفاعی)', () => {
  it('opens the arrangement screen with all tiles selected by default', async () => {
    world.sent.length = 0;
    await botText(world, TID, '🛡️ دفاع');
    const card = sentTexts().find((t) => t.includes('مرکز فرماندهی دفاع'));
    expect(card).toBeTruthy();
    expect(card).toContain('12'); // همه دسته‌ها متعهدند (پیش‌فرض)
  });

  it('tapping a tile toggles it, «تأیید» persists the subset, «بازنشانی» restores default', async () => {
    world.sent.length = 0;
    await botCallback(world, TID, 'def:toggle:radars'); // رادار را از آرایش خارج کن
    await botCallback(world, TID, 'def:apply');
    const row = await first<{ defense_plan: string | null }>(world.db, `SELECT defense_plan FROM nation_settings WHERE nation_id = ?`, nation);
    const plan = row?.defense_plan ? (JSON.parse(row.defense_plan) as string[]) : null;
    expect(Array.isArray(plan)).toBe(true);
    expect(plan).not.toContain('radars');
    expect(plan).toContain('soldiers');
    expect(plan).toContain('fortification');

    // دکمهٔ «بازنشانی» همه چیز را به پیش‌فرض برمی‌گرداند
    world.sent.length = 0;
    await botCallback(world, TID, 'def:reset');
    const row2 = await first<{ defense_plan: string | null }>(world.db, `SELECT defense_plan FROM nation_settings WHERE nation_id = ?`, nation);
    expect(row2?.defense_plan).toBeNull();
  });
});
