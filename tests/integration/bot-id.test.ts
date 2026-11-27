import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { botText, createWorld, first, type World } from '../helpers/harness';

/**
 * /id exists because ADMIN_TELEGRAM_IDS is the one setup step that needs your own numeric
 * Telegram id — and a third-party "what is my id" bot is not a trusted source in a game where
 * that number *is* the admin credential. The answer must come from the verified update itself.
 */
let world: World;

beforeAll(async () => {
  world = await createWorld({ adminIds: '777', env: { TELEGRAM_WEBHOOK_SECRET: 'test-hook-secret' } });
}, 180_000);

afterAll(async () => {
  await world.dispose();
});

const sentTexts = () =>
  world.sent.filter((s) => s.method === 'sendMessage' || s.method === 'editMessageText').map((s) => String(s.payload.text ?? ''));

describe('bot /id (admin bootstrap)', () => {
  it('prints the caller id, the player role and how to become admin', async () => {
    world.sent.length = 0;
    await botText(world, 900_401, '/id');
    const text = sentTexts().join('\n');
    expect(text).toContain('900401'); // the number that has to go into ADMIN_TELEGRAM_IDS
    expect(text).toContain('بازیکن');
    expect(text).toContain('نیستید');
    expect(text).toContain('ADMIN_TELEGRAM_IDS');
  });

  it('confirms listing and promotes the listed account to super_admin on the same update', async () => {
    const before = await first<{ role: string }>(world.db, `SELECT role FROM users WHERE telegram_user_id = 777`);
    expect(before?.role).toBeUndefined(); // not provisioned yet

    world.sent.length = 0;
    await botText(world, 777, '/id');
    const text = sentTexts().join('\n');
    expect(text).toContain('777');
    expect(text).toContain('هستید');
    expect(text).toContain('سوپر ادمین'); // upsertTelegramUser promoted it before replying

    const after = await first<{ role: string; is_primary_admin: number }>(world.db, `SELECT role, is_primary_admin FROM users WHERE telegram_user_id = 777`);
    expect(after?.role).toBe('super_admin');
    expect(after?.is_primary_admin).toBe(1);
  });

  it('is listed in /help so the command is discoverable', async () => {
    world.sent.length = 0;
    await botText(world, 900_402, '/help');
    expect(sentTexts().join('\n')).toContain('/id');
  });
});
