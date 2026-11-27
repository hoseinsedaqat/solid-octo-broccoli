import { FLAG_CHOICES, PLAYER_PAGES, PLAYER_PAGE_META, type PlayerPage } from '@ww/shared';
import type { InlineKeyboardButton, KeyboardRow, ReplyKeyboardButton } from './telegram';
import { escapeHtml } from './telegram';

export const REPLY_MENU: KeyboardRow<ReplyKeyboardButton>[] = [
  [{ text: '🛡️ مدیریت کشور' }, { text: '💰 دارایی' }],
  [{ text: '🛒 خرید تجهیزات' }, { text: '⚔️ حمله' }],
  [{ text: '🛡️ دفاع' }, { text: '🌐 دیپلماسی' }],
  [{ text: '📜 بیانیه‌ها' }, { text: '📊 آمار و اطلاعات' }],
  [{ text: '🌍 اخبار جهانی' }, { text: '⚙️ تنظیمات' }],
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
  '🌍 اخبار جهانی': 'news',
  '⚙️ تنظیمات': 'settings',
};

export function mainMenu(webAppUrl?: string): KeyboardRow<InlineKeyboardButton>[] {
  const buttons: InlineKeyboardButton[] = PLAYER_PAGES.filter((p) => p !== 'dashboard').map((p) => ({
    text: `${PLAYER_PAGE_META[p].emoji} ${PLAYER_PAGE_META[p].labelFa}`,
    callback_data: `nav:${p}`,
  }));
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
  if (webAppUrl) rows.unshift([{ text: '🖥️ باز کردن بازی (Mini App)', web_app: { url: webAppUrl } }]);
  rows.push([{ text: 'ℹ️ راهنما', callback_data: 'h' }, { text: '🔄 منوی اصلی', callback_data: 'm' }]);
  return rows;
}

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
