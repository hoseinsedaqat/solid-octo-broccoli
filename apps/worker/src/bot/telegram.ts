import { truncate } from '../core/format';

/** default Telegram endpoint; override with the TELEGRAM_API_BASE variable */
export const TELEGRAM_API_BASE = 'https://api.telegram.org';

let apiBase = TELEGRAM_API_BASE;

/**
 * Remembers TELEGRAM_API_BASE for the whole isolate (a static config value, not game
 * state) so every outbound Telegram call — including best-effort notification pushes
 * created deep inside services — uses the same endpoint.
 */
export function configureTelegramApiBase(base?: string | null): void {
  if (base && base.trim()) apiBase = base.trim().replace(/\/$/, '');
}

export function telegramApiBase(): string {
  return apiBase;
}

export interface TgUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TgUpdate {
  update_id: number;
  message?: TgMessage;
  callback_query?: TgCallbackQuery;
  edited_message?: TgMessage;
  my_chat_member?: unknown;
}

export interface TgMessage {
  message_id: number;
  from?: TgUser;
  chat: { id: number; type?: string; username?: string };
  text?: string;
  entities?: { type: string; offset: number; length: number }[];
  date: number;
}

export interface TgCallbackQuery {
  id: string;
  from: TgUser;
  message?: TgMessage;
  data?: string;
  chat_instance?: string;
}

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
  web_app?: { url: string };
}
export interface ReplyKeyboardButton {
  text: string;
  request_contact?: boolean;
}
export type KeyboardRow<T> = T[];

/**
 * Thin Telegram Bot API client. Kept tiny on purpose: no bot framework, so the
 * whole Worker stays inside the free CPU budget and has no runtime deps.
 */
export class TelegramApi {
  /**
   * @param apiBase official Bot API by default; configurable via TELEGRAM_API_BASE so a
   * network that cannot reach api.telegram.org can use its own telegram-bot-api server/relay.
   * @param fetchImpl NOT `= fetch`: calling an unbound reference to the global with the class
   * instance as `this` is rejected by workerd ("Illegal invocation"). The arrow keeps the
   * global receiver and still lets tests inject a stub.
   */
  constructor(
    private readonly token: string,
    private readonly apiBase: string = telegramApiBase(),
    private readonly fetchImpl: typeof fetch = (input, init) => fetch(input, init),
  ) {}

  get enabled(): boolean {
    return Boolean(this.token);
  }

  private async call<T = Record<string, unknown>>(method: string, payload: Record<string, unknown> = {}): Promise<T> {
    if (!this.token) throw new Error('BOT_TOKEN is not configured');
    const res = await this.fetchImpl(`${(this.apiBase || TELEGRAM_API_BASE).replace(/\/+$/, '')}/bot${this.token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { ok: boolean; result?: T; description?: string; error_code?: number; parameters?: unknown };
    if (!json.ok) {
      const err = new Error(`telegram ${method} failed: ${json.description ?? res.status}`) as Error & { payload?: unknown };
      err.payload = json;
      throw err;
    }
    return json.result as T;
  }

  async sendMessage(
    chatId: number,
    text: string,
    opts: {
      inline?: KeyboardRow<InlineKeyboardButton>[];
      reply?: KeyboardRow<ReplyKeyboardButton>[];
      removeReplyKeyboard?: boolean;
      disablePreview?: boolean;
    } = {},
  ) {
    // Telegram accepts only ONE reply_markup per message: inline buttons win, so a
    // caller that needs the persistent main keyboard must install it with its own
    // message (see sendMainMenu in handlers.ts).
    const reply_markup: Record<string, unknown> = {};
    if (opts.inline?.length) {
      reply_markup.inline_keyboard = opts.inline;
    } else if (opts.reply?.length) {
      reply_markup.keyboard = opts.reply;
      reply_markup.resize_keyboard = true;
      reply_markup.is_persistent = true;
    } else if (opts.removeReplyKeyboard) {
      reply_markup.remove_keyboard = true;
    }
    return this.call('sendMessage', {
      chat_id: chatId,
      text: truncate(text, 4000),
      parse_mode: 'HTML',
      disable_web_page_preview: opts.disablePreview !== false,
      ...(Object.keys(reply_markup).length ? { reply_markup } : {}),
    });
  }

  async editMessageText(chatId: number, messageId: number, text: string, inline?: KeyboardRow<InlineKeyboardButton>[]) {
    try {
      return await this.call('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: truncate(text, 4000),
        parse_mode: 'HTML',
        ...(inline?.length ? { reply_markup: { inline_keyboard: inline } } : {}),
      });
    } catch {
      // "message is not modified" is expected when re-rendering the same view
      return null;
    }
  }

  async answerCallbackQuery(callbackQueryId: string, text?: string, showAlert = false) {
    try {
      return await this.call('answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        ...(text ? { text: truncate(text, 190), show_alert: showAlert } : {}),
      });
    } catch {
      return null;
    }
  }

  async setMyCommands(commands: { command: string; description: string }[]) {
    return this.call('setMyCommands', { commands, scope: { type: 'default' } });
  }

  async setWebhook(url: string, secretToken: string) {
    return this.call('setWebhook', {
      url,
      secret_token: secretToken,
      drop_pending_updates: false,
      allowed_updates: ['message', 'callback_query', 'edited_message', 'my_chat_member'],
    });
  }

  async deleteWebhook(dropPending = false) {
    return this.call('deleteWebhook', { drop_pending_updates: dropPending });
  }

  async getWebhookInfo() {
    return this.call<{ url: string; pending_update_count: number; last_error_message?: string; last_error_date?: number }>('getWebhookInfo');
  }

  async getUpdates(offset = 0, limit = 25) {
    return this.call<TgUpdate[]>('getUpdates', { offset, limit, timeout: 0, allowed_updates: ['message', 'callback_query'] });
  }

  async getMe() {
    return this.call<{ id: number; username: string; first_name: string }>('getMe');
  }
}

export function inlineKeyboard(rows: KeyboardRow<InlineKeyboardButton>[]) {
  return rows;
}

export function twoColumns(items: InlineKeyboardButton[], lastFullRow?: InlineKeyboardButton): KeyboardRow<InlineKeyboardButton>[] {
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  if (lastFullRow) rows.push([lastFullRow]);
  return rows;
}

export function escapeHtml(text: string): string {
  return String(text).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
}

export const coins = (value: number) => `${value < 0 ? '-' : ''}${Math.abs(Math.round(value)).toLocaleString('en-US')} سکه`;
