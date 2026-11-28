import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { STARTER_ECONOMY } from '@ww/shared';
import { botCallback, botText, createWorld, first, onboardViaBot, run, type World } from '../helpers/harness';

/** 🏗️ وزارت ساخت‌وساز و 🏆 رتبه‌بندی قدرت‌های جهان — از ربات و API */
let world: World;
let nation = 0;
let token = '';

const sentTexts = () =>
  world.sent
    .filter((s) => s.method === 'sendMessage' || s.method === 'editMessageText')
    .map((s) => String(s.payload.text ?? ''));

beforeAll(async () => {
  world = await createWorld({ adminIds: '777' });
  nation = await onboardViaBot(world, 990_001, 'ساختین', 'آرمان');
  token = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 990_001 } })).json.token;
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

describe('ساخت‌وساز — API', () => {
  it('starts with six unbuilt constructions and the starter treasury', async () => {
    const res = await world.api('GET', '/api/player/buildings', { token });
    expect(res.status).toBe(200);
    expect(res.json.buildings).toHaveLength(6);
    expect(res.json.builtCount).toBe(0);
    expect(Number(res.json.treasury)).toBe(STARTER_ECONOMY.treasury);
    expect(res.json.buildings.map((b: any) => b.key)).toEqual(['barracks', 'airbase', 'factory', 'navalbase', 'shelter', 'radar']);
    expect(res.json.buildings.map((b: any) => b.cost)).toEqual([10_000, 20_000, 30_000, 25_000, 15_000, 13_000]);
  });

  it('rejects an unknown building instead of guessing', async () => {
    const res = await world.api('POST', '/api/player/buildings', { token, body: { buildingKey: 'castle' } });
    expect(res.status).toBe(422);
  });

  it('builds the barracks, debits the treasury and grants 1000 rangers atomically', async () => {
    const before = Number((await first<{ treasury: number }>(world.db, 'SELECT treasury FROM nations WHERE id = ?', nation))!.treasury);
    const res = await world.api('POST', '/api/player/buildings', { token, body: { buildingKey: 'barracks' } });
    expect(res.status).toBe(200);
    expect(Number(res.json.cost)).toBe(10_000);
    expect(Number(res.json.treasury)).toBe(before - 10_000);

    const rangers = await first<{ quantity: number }>(
      world.db,
      `SELECT COALESCE(SUM(i.quantity), 0) AS quantity FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
        WHERE i.nation_id = ? AND t.code = 'rangers'`,
      nation,
    );
    expect(Number(rangers!.quantity)).toBeGreaterThanOrEqual(1000);

    const built = await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM nation_buildings WHERE nation_id = ? AND building_key = 'barracks'`, nation);
    expect(Number(built!.c)).toBe(1);
  });

  it('rejects building the same construction twice', async () => {
    const res = await world.api('POST', '/api/player/buildings', { token, body: { buildingKey: 'barracks' } });
    expect(res.status).toBe(409);
  });

  it('fortification shelter raises the defense permanently', async () => {
    const before = Number((await first<{ fortification_level: number }>(world.db, 'SELECT fortification_level FROM nation_settings WHERE nation_id = ?', nation))!.fortification_level);
    const res = await world.api('POST', '/api/player/buildings', { token, body: { buildingKey: 'shelter' } });
    expect(res.status).toBe(200);
    const after = Number((await first<{ fortification_level: number }>(world.db, 'SELECT fortification_level FROM nation_settings WHERE nation_id = ?', nation))!.fortification_level);
    expect(after).toBe(Math.min(20, before + 2));
  });

  it('refuses construction when the treasury cannot pay', async () => {
    await run(world.db, `UPDATE nations SET treasury = 100 WHERE id = ?`, nation);
    let res: any;
    try {
      res = await world.api('POST', '/api/player/buildings', { token, body: { buildingKey: 'factory' } });
    } finally {
      await run(world.db, `UPDATE nations SET treasury = ? WHERE id = ?`, STARTER_ECONOMY.treasury - 25_000, nation);
    }
    expect(res.status).toBe(422);
    expect(String(res.json?.error?.message ?? res.json?.message ?? res.text)).toContain('موجودی ناکافی است');
    const built = await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM nation_buildings WHERE nation_id = ? AND building_key = 'factory'`, nation);
    expect(Number(built!.c)).toBe(0);
  });

  it('exposes «توسعه کشورها» as a real rankings metric backed by nation_buildings', async () => {
    const res = await world.api('GET', '/api/social/rankings?metric=development&limit=5', { token });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.json.rows)).toBe(true);
    const mine = res.json.rows.find((r: any) => Number(r.nationId) === nation);
    expect(mine).toBeTruthy();
    expect(Number(mine.score)).toBe(2); // barracks + shelter
  });
});

describe('ساخت‌وساز و رتبه‌بندی — ربات', () => {
  it('«🏗️ ساخت و ساز» sends the construction card with all six buttons', async () => {
    world.sent.length = 0;
    await botText(world, 990_001, '🏗️ ساخت و ساز');
    const card = world.sent.find((s) => s.method === 'sendMessage' && String(s.payload.text ?? '').includes('وزارت ساخت‌وساز'));
    expect(card).toBeTruthy();
    const buttons = ((card!.payload.reply_markup ?? {}) as { inline_keyboard?: { text: string; callback_data?: string }[][] }).inline_keyboard ?? [];
    const flat = buttons.flat();
    expect(flat.some((b) => String(b.text).includes('پادگان نظامی'))).toBe(true);
    expect(flat.some((b) => String(b.text).includes('مرکز رادار'))).toBe(true);
    expect(flat.some((b) => String(b.callback_data).includes('build:ask'))).toBe(true);
  });

  it('asks to confirm before building, then builds exactly once', async () => {
    world.sent.length = 0;
    await botCallback(world, 990_001, 'build:ask:airbase');
    expect(sentTexts().join('\n')).toContain('پایگاه هوایی');

    world.sent.length = 0;
    await botCallback(world, 990_001, 'build:go:airbase');
    expect(sentTexts().join('\n')).toContain('ساخته شد');

    world.sent.length = 0;
    await botCallback(world, 990_001, 'build:go:airbase');
    // second attempt must not double-grant: the bot reports the failure and keeps state sane
    const users = world.sent.filter((s) => s.method === 'answerCallbackQuery');
    expect(users.some((s) => String((s.payload as any).text ?? '').includes('قبلاً'))).toBe(true);
    const built = await first<{ c: number }>(world.db, `SELECT COUNT(*) AS c FROM nation_buildings WHERE nation_id = ? AND building_key = 'airbase'`, nation);
    expect(Number(built!.c)).toBe(1);
  });

  it('«🏆 رتبه‌بندی کشورها» opens the ranking card and honours tab taps', async () => {
    world.sent.length = 0;
    await botText(world, 990_001, '🏆 رتبه‌بندی کشورها');
    const card = world.sent.find((s) => s.method === 'sendMessage' && String(s.payload.text ?? '').includes('رتبه‌بندی قدرت‌های جهان'));
    expect(card).toBeTruthy();
    const buttons = ((card!.payload.reply_markup ?? {}) as { inline_keyboard?: { text: string; callback_data?: string }[][] }).inline_keyboard ?? [];
    const labels = buttons.flat().map((b) => String(b.text));
    for (const needle of ['قدرت نظامی', 'اقتصادی', 'قدرت جهانی', 'توسعه کشورها']) {
      expect(labels.some((l) => l.includes(needle))).toBe(true);
    }

    world.sent.length = 0;
    await botCallback(world, 990_001, 'rank:tab:development');
    const tab = world.sent.find((s) => s.method === 'editMessageText');
    expect(tab).toBeTruthy();
    const tabButtons = ((tab!.payload.reply_markup ?? {}) as { inline_keyboard?: { text: string; callback_data?: string }[][] }).inline_keyboard ?? [];
    const devBtn = tabButtons.flat().find((b) => b.callback_data === 'rank:tab:development');
    expect(devBtn).toBeTruthy();
    expect(String(devBtn!.text)).toContain('✅');
  });
});
