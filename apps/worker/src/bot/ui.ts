import { EQUIPMENT_CATEGORIES, FLAG_CHOICES, PLAYER_PAGES, PLAYER_PAGE_META, type PlayerPage } from '@ww/shared';
import type { InlineKeyboardButton, KeyboardRow, ReplyKeyboardButton } from './telegram';
import { escapeHtml } from './telegram';

export const REPLY_MENU: KeyboardRow<ReplyKeyboardButton>[] = [
  [{ text: '🛡️ مدیریت کشور' }, { text: '💰 دارایی' }],
  [{ text: '🛒 خرید تجهیزات' }, { text: '⚔️ حمله' }],
  [{ text: '🛡️ دفاع' }, { text: '🎁 جوایز روزانه' }],
  [{ text: '📜 بیانیه‌ها' }, { text: '📊 آمار و اطلاعات' }],
  [{ text: '🏦 بانک مرکزی' }, { text: '⚙️ تنظیمات' }],
];

export const REPLY_TO_LABEL: Record<string, PlayerPage | 'menu'> = {
  '🛡️ مدیریت کشور': 'country',
  '💰 دارایی': 'economy',
  '🛒 خرید تجهیزات': 'marketplace',
  '⚔️ حمله': 'war',
  '🛡️ دفاع': 'defense',
  '🌐 دیپلماسی': 'diplomacy',
  '📜 بیانیه‌ها': 'statements',
  '📊 آمار و اطلاعات': 'rankings',
  '⚙️ تنظیمات': 'settings',
};

/**
 * Main menu — the classic World War bot layout:
 * a wide launcher button on top, the five core actions as a 2×2 grid plus defense,
 * and info / the remaining sections on the last row.
 */
export function mainMenu(webAppUrl?: string): KeyboardRow<InlineKeyboardButton>[] {
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  if (webAppUrl) rows.push([{ text: '🤖 ورود به بازی کسب‌درآمد 🤖', web_app: { url: webAppUrl } }]);
  rows.push(
    [{ text: '💰 دارایی', callback_data: 'nav:economy' }, { text: '🛡️ مدیریت کشور', callback_data: 'nav:country' }],
    [{ text: '🛒 خرید تجهیزات', callback_data: 'nav:marketplace' }, { text: '⚔️ حمله', callback_data: 'nav:war' }],
    [{ text: '🛡️ دفاع', callback_data: 'nav:defense' }],
    [{ text: 'ℹ️ اطلاعات بیشتر و تنظیمات', callback_data: 'h' }, { text: '🧭 سایر بخش‌ها', callback_data: 'm:more' }],
  );
  return rows;
}

/** the old full grid — every page of the design document, reachable via «سایر بخش‌ها» */
export function moreMenu(webAppUrl?: string): KeyboardRow<InlineKeyboardButton>[] {
  const buttons: InlineKeyboardButton[] = PLAYER_PAGES.filter((p) => p !== 'dashboard').map((p) => ({
    text: `${PLAYER_PAGE_META[p].emoji} ${PLAYER_PAGE_META[p].labelFa}`,
    callback_data: `nav:${p}`,
  }));
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
  if (webAppUrl) rows.unshift([{ text: '🖥️ باز کردن بازی (Mini App)', web_app: { url: webAppUrl } }]);
  rows.push([{ text: '⬅️ بازگشت به منوی اصلی', callback_data: 'm' }]);
  return rows;
}

/* --------------- the 18-button purchase keypad (persistent, 2 columns) --------------- */

/** button label → category key, e.g. «خرید تانک» → 'tanks' */
export const CATEGORY_TO_KEY: Record<string, string> = Object.fromEntries(
  EQUIPMENT_CATEGORIES.map((c) => [c.shopLabelFa, c.key]),
);

export const CATEGORY_BACK_TEXT = '⬅️ بازگشت به منوی اصلی';

export const CATEGORY_ENTRY_TEXT = 'خب، حالا چه کاری برای انجام بدم؟ 👇 از منوی پایین انتخاب کن';

export const CATEGORY_KEYPAD: KeyboardRow<ReplyKeyboardButton>[] = (() => {
  const buttons: ReplyKeyboardButton[] = EQUIPMENT_CATEGORIES.map((c) => ({ text: c.shopLabelFa }));
  const rows: KeyboardRow<ReplyKeyboardButton>[] = [];
  for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
  rows.push([{ text: CATEGORY_BACK_TEXT }]);
  return rows;
})();

export function backButton(label = '⬅️ بازگشت به منوی اصلی'): KeyboardRow<InlineKeyboardButton>[] {
  return [[{ text: label, callback_data: 'm' }]];
}

export function flagKeyboard(): KeyboardRow<InlineKeyboardButton>[] {
  const buttons = FLAG_CHOICES.map((flag, index) => ({ text: flag, callback_data: `flag:${index}` }));
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  for (let i = 0; i < buttons.length; i += 4) rows.push(buttons.slice(i, i + 4));
  rows.push([{ text: '❌ انصراف', callback_data: 'flow:cancel' }]);
  return rows;
}

export function yesNoRows(callbackPrefix: string, yes = '✅ تأیید', no = '❌ لغو'): KeyboardRow<InlineKeyboardButton>[] {
  return [[{ text: yes, callback_data: `${callbackPrefix}:yes` }, { text: no, callback_data: `${callbackPrefix}:no` }]];
}

export function pager(prefix: string, offset: number, total: number, pageSize = 8): KeyboardRow<InlineKeyboardButton>[] {
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  const page = Math.floor(offset / pageSize);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const nav: InlineKeyboardButton[] = [];
  if (page > 0) nav.push({ text: '⏮️ قبلی', callback_data: `${prefix}:${offset - pageSize}` });
  nav.push({ text: `صفحه ${page + 1}/${pages}`, callback_data: 'noop' });
  if ((page + 1) * pageSize < total) nav.push({ text: '➡️ بعدی', callback_data: `${prefix}:${offset + pageSize}` });
  rows.push(nav);
  return rows;
}

export function statLine(label: string, value: string): string {
  return `${escapeHtml(label)}: <b>${escapeHtml(value)}</b>`;
}

export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export function percent(v: number): string {
  return `${Math.round(v * 100)}٪`;
}
