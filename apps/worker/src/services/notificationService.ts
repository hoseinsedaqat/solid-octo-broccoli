import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { nowSeconds } from '../core/format';
import { TelegramApi } from '../bot/telegram';

export interface NotifyInput {
  nationId: number;
  kind: string;
  title: string;
  body: string;
  data?: unknown;
  /** also push to the telegram chat of the owner */
  telegram?: { botToken: string; chatId: number; text: string; apiBase?: string } | null;
}

/**
 * In-app notifications (Mini App bell) + optional Telegram push.
 * Telegram delivery failures never roll back the game mutation: the notification
 * row is stored first and a delivery error is only logged.
 */
export async function notify(db: Db, input: NotifyInput): Promise<number> {
  const now = nowSeconds();
  const user = await db.first<{ user_id: number }>(sql`SELECT owner_user_id AS user_id FROM nations WHERE id = ${input.nationId}`);
  const row = await db.first<{ id: number }>(
    sql`INSERT INTO notifications (nation_id, user_id, kind, title, body, data, is_read, created_at)
         VALUES (${input.nationId}, ${user?.user_id ?? null}, ${input.kind}, ${input.title}, ${input.body},
                 ${input.data ? JSON.stringify(input.data).slice(0, 2000) : null}, 0, ${now})
         RETURNING id`,
  );
  if (input.telegram?.botToken) {
    await deliverTelegram(input.telegram.botToken, input.telegram.chatId, input.telegram.text, input.telegram.apiBase);
  }
  return row?.id ?? 0;
}

export async function notifyMany(db: Db, inputs: NotifyInput[]): Promise<number> {
  let n = 0;
  for (const i of inputs) n += await notify(db, i);
  return n;
}

export async function listNotifications(db: Db, nationId: number, limit = 30) {
  return db.all<Record<string, unknown>>(
    sql`SELECT id, kind, title, body, data, is_read, created_at
          FROM notifications WHERE nation_id = ${nationId}
         ORDER BY id DESC LIMIT ${Math.min(100, Math.max(1, limit))}`,
  );
}

export async function unreadCount(db: Db, nationIds: number[]): Promise<number> {
  if (nationIds.length === 0) return 0;
  const row = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM notifications WHERE nation_id IN (${nationIds}) AND is_read = 0`,
  );
  return Number(row?.c ?? 0);
}

export async function markRead(db: Db, nationIds: number[], id?: number) {
  const now = nowSeconds();
  if (id) {
    await db.run(sql`UPDATE notifications SET is_read = 1, read_at = ${now} WHERE id = ${id} AND nation_id IN (${nationIds})`);
    return;
  }
  await db.run(sql`UPDATE notifications SET is_read = 1, read_at = ${now} WHERE nation_id IN (${nationIds}) AND is_read = 0`);
}

async function deliverTelegram(botToken: string, chatId: number, text: string, apiBase?: string): Promise<void> {
  try {
    // same client as the bot, so TELEGRAM_API_BASE (relay / self-hosted server) applies everywhere
    await new TelegramApi(botToken, apiBase).sendMessage(chatId, text.slice(0, 4000), { disablePreview: true });
  } catch {
    /* telegram is best-effort: the notification row and the game mutation stay */
  }
}
