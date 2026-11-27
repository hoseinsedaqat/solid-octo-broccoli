import { FLAG_CHOICES, type PlayerPage } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { nowSeconds } from '../core/format';
import type { Env } from '../types';
import { ApiError } from '../core/errors';
import { loadSettings, type SettingsBundle } from '../core/settings';
import { upsertTelegramUser } from '../services/authService';
import {
  buildNationView,
  buildDefenseView,
  createNation,
  type NationRow,
} from '../services/nationService';
import { loadNationOwnedBy, relationCounts, txLabel } from '../db/queries';
import { listCategories, listCategoryItems, purchase, inventoryView } from '../services/shopService';
import { listTransactions } from '../services/financeService';
import { listNations, proposeWar, respondToWar, getWarsForNation, getWarDetail, resolveRound, requestPeace, mapWar } from '../services/warService';
import { listIncoming, decideRequest, listRelations } from '../services/diplomacyService';
import { createStatement, listMyStatements } from '../services/statementService';
import { feed as newsFeed, listRankings } from '../services/newsService';
import { configureTelegramApiBase, TelegramApi, escapeHtml, coins, type TgCallbackQuery, type TgMessage, type TgUpdate, type InlineKeyboardButton, type KeyboardRow } from './telegram';
import { backButton, flagKeyboard, formatNumber, formatNumber as fmt, mainMenu, pager, percent, REPLY_MENU, REPLY_TO_LABEL, statLine, yesNoRows } from './ui';

export interface BotCtx {
  db: Db;
  env: Env;
  tg: TelegramApi;
  settings: SettingsBundle;
  webAppUrl: string;
}

export function createBotCtx(env: Env, db: Db, fetchImpl?: typeof fetch): BotCtx {
  configureTelegramApiBase(env.TELEGRAM_API_BASE);
  return {
    db,
    env,
    tg: new TelegramApi(env.BOT_TOKEN ?? '', env.TELEGRAM_API_BASE, fetchImpl),
    settings: {
      battle: {}, economy: {}, profile: {}, diplomacy: {}, features: {}, quota: {}, branding: {}, rankingWeights: {}, loadedAt: 0,
    } as unknown as SettingsBundle,
    webAppUrl: (env.WEBAPP_URL || env.PUBLIC_BASE_URL || '') + '/app/player',
  };
}

/**
 * The persistent 9-button main menu (custom reply keyboard). Telegram only allows one
 * reply_markup per message, so it is installed by its own short message right after the
 * inline menu card. Reply-keyboard taps are mapped back to pages in handleUserMessage.
 */
export async function sendMainMenu(ctx: BotCtx, chatId: number): Promise<void> {
  await ctx.tg.sendMessage(chatId, '⌨️ منوی اصلی کشور (۹ بخش) به‌صورت صفحه‌کلید پایین تلگرام نصب شد. «🔄 منوی اصلی» همیشه آن را بازمی‌گرداند.', { reply: REPLY_MENU });
}

/* ------------------------------ update entry ------------------------------ */

export async function handleUpdate(ctx: BotCtx, update: TgUpdate): Promise<{ handled: string }> {
  const fresh = await ctx.db.run(
    sql`INSERT OR IGNORE INTO processed_webhook_updates (update_id, chat_id, kind, payload_hash, created_at)
         VALUES (${update.update_id}, ${update.message?.chat.id ?? update.callback_query?.message?.chat.id ?? null},
                 ${update.callback_query ? 'callback' : update.message ? 'message' : 'other'},
                 ${hashUpdate(update)}, ${nowSeconds()})`,
  );
  if (!fresh.meta.changes) return { handled: 'duplicate' };

  if (update.callback_query) return handleCallback(ctx, update.callback_query, update.update_id);
  if (update.message) return handleUserMessage(ctx, update.message, update.update_id);
  return { handled: 'ignored' };
}

function hashUpdate(update: TgUpdate): string {
  return `${update.update_id}:${update.message?.message_id ?? update.callback_query?.id ?? ''}`;
}

async function handleUserMessage(ctx: BotCtx, message: TgMessage, updateId: number): Promise<{ handled: string }> {
  const from = message.from;
  if (!from?.id) return { handled: 'no_user' };
  if (message.text?.startsWith('/')) return handleCommand(ctx, message, updateId);

  const identity = await upsertTelegramUser(ctx.db, { telegramId: from.id, username: from.username ?? null, firstName: from.first_name ?? null, lastName: from.last_name ?? null, languageCode: from.language_code ?? null }, ctx.env);
  const flow = await ctx.db.first<{ state: string; data: string | null }>(
    sql`SELECT state, data FROM bot_flow_states WHERE user_id = ${identity.userId} AND (expires_at IS NULL OR expires_at > ${nowSeconds()})`,
  );
  const text = (message.text ?? '').trim();
  if (!text) {
    await ctx.tg.sendMessage(message.chat.id, 'در این مرحله فقط <b>متن</b> ارسال کنید.');
    return { handled: 'empty' };
  }

  if (flow?.state === 'onb:name') {
    return continueOnboarding(ctx, identity.userId, from.id, 'name', text);
  }
  if (flow?.state === 'onb:leader') {
    return continueOnboarding(ctx, identity.userId, from.id, 'leader', text);
  }
  if (flow?.state === 'stmt:text') {
    const nation = await currentNation(ctx, identity.userId);
    if (!nation) {
      await clearFlow(ctx.db, identity.userId);
      return { handled: 'no_nation' };
    }
    const preview = [
      `📜 <b>پیش‌نمایش بیانیه</b>`,
      ``,
      `${nation.flag} <b>${escapeHtml(nation.name)}</b> — رئیس کشور: ${escapeHtml(nation.leader_name)}`,
      ``,
      escapeHtml(text.slice(0, 1200)),
      ``,
      `تأیید می‌کنید؟ پس از ثبت، این متن به عنوان موضع رسمی کشور شما منتشر خواهد شد.`,
    ].join('\n');
    await ctx.db.run(
      sql`INSERT INTO bot_flow_states (user_id, state, nation_id, data, updated_at, expires_at)
           VALUES (${identity.userId}, 'stmt:confirm', ${nation.id}, ${JSON.stringify({ text: text.slice(0, 1200) })}, ${nowSeconds()}, ${nowSeconds() + 3600})
           ON CONFLICT (user_id) DO UPDATE SET state = 'stmt:confirm', data = excluded.data, updated_at = excluded.updated_at, expires_at = excluded.expires_at`,
    );
    await ctx.tg.sendMessage(message.chat.id, preview, { inline: yesNoRows('sp') });
    return { handled: 'statement_preview' };
  }

  const mapped = REPLY_TO_LABEL[text];
  if (mapped) {
    await renderPage(ctx, message.chat.id, identity.userId, mapped === 'menu' ? ('dashboard' as PlayerPage) : mapped, message.message_id);
    return { handled: `reply:${mapped}` };
  }
  await ctx.tg.sendMessage(message.chat.id, 'دستور ناشناخته. از منوی پایین یا /menu استفاده کنید.');
  return { handled: 'unknown' };
}

async function handleCommand(ctx: BotCtx, message: TgMessage, updateId: number): Promise<{ handled: string }> {
  const from = message.from;
  if (!from?.id) return { handled: 'no_user' };
  const parts = (message.text ?? '').trim().split(/\s+/);
  const cmd = (parts[0] ?? '/start').toLowerCase().split('@')[0]!;
  const identity = await upsertTelegramUser(
    ctx.db,
    { telegramId: from.id, username: from.username ?? null, firstName: from.first_name ?? null, lastName: from.last_name ?? null, languageCode: from.language_code ?? null },
    ctx.env,
  );

  const nations = await ctx.db.all<{ id: number }>(sql`SELECT id FROM nations WHERE owner_user_id = ${identity.userId} AND status <> 'dissolved'`);

  switch (cmd) {
    case '/start': {
      const startParam = parts[1] ?? '';
      if (startParam.startsWith('admin')) {
        await ctx.tg.sendMessage(message.chat.id, `🛠️ پنل مدیریت: <a href="${ctx.webAppUrl.replace('/app/player', '/app/admin')}">باز کردن</a>`);
        if (identity.role === 'player') {
          await ctx.tg.sendMessage(message.chat.id, 'شما نقش مدیریتی ندارید؛ دسترسی از پنل ادمین توسط Super Admin داده می‌شود.');
        }
        return { handled: 'start:admin' };
      }
      if (nations.length === 0) return startOnboarding(ctx, message, identity.userId);
      await ctx.tg.sendMessage(message.chat.id, await welcomeText(ctx, identity.userId), { inline: mainMenu(ctx.webAppUrl) });
      return { handled: 'start' };
    }
    case '/help':
      await ctx.tg.sendMessage(message.chat.id, helpText(), { inline: backButton('🏠 منوی اصلی') });
      return { handled: 'help' };
    case '/menu':
      if (nations.length === 0) return startOnboarding(ctx, message, identity.userId);
      await ctx.tg.sendMessage(message.chat.id, await welcomeText(ctx, identity.userId), { inline: mainMenu(ctx.webAppUrl) });
      await sendMainMenu(ctx, message.chat.id);
      return { handled: 'menu' };
    case '/economy':
      return renderPage(ctx, message.chat.id, identity.userId, 'economy', message.message_id);
    case '/assets':
    case '/military':
      return renderPage(ctx, message.chat.id, identity.userId, 'military', message.message_id);
    case '/shop':
      return renderPage(ctx, message.chat.id, identity.userId, 'marketplace', message.message_id);
    case '/war':
      return renderPage(ctx, message.chat.id, identity.userId, 'war', message.message_id);
    case '/diplomacy':
      return renderPage(ctx, message.chat.id, identity.userId, 'diplomacy', message.message_id);
    case '/statement':
    case '/statements':
      return renderPage(ctx, message.chat.id, identity.userId, 'statements', message.message_id);
    case '/rank':
    case '/rankings':
      return renderPage(ctx, message.chat.id, identity.userId, 'rankings', message.message_id);
    case '/news':
      return renderPage(ctx, message.chat.id, identity.userId, 'news', message.message_id);
    case '/country':
      return renderPage(ctx, message.chat.id, identity.userId, 'country', message.message_id);
    case '/defense':
      return renderPage(ctx, message.chat.id, identity.userId, 'defense', message.message_id);
    case '/settings':
      return renderPage(ctx, message.chat.id, identity.userId, 'settings', message.message_id);
    default:
      await ctx.tg.sendMessage(message.chat.id, 'دستور ناشناخته.\n\n' + helpText(), { inline: backButton('🏠 منوی اصلی') });
      return { handled: 'unknown_command' };
  }
  void updateId;
}

export function helpText(): string {
  return [
    'ℹ️ <b>دستورات ربات World War</b>',
    '',
    '/start — شروع بازی یا منوی اصلی',
    '/menu — منوی اصلی',
    '/country — مدیریت کشور',
    '/economy — دارایی و اقتصاد',
    '/military — دارایی‌های نظامی',
    '/shop — فروشگاه تجهیزات',
    '/war — جنگ‌ها و حملات',
    '/defense — وضعیت دفاعی',
    '/diplomacy — دیپلماسی و اتحاد',
    '/statement — صدور بیانیه رسمی',
    '/rankings — رتبه‌بندی جهانی',
    '/news — اخبار بازی',
    '/settings — تنظیمات',
    '',
    'همه عملیات مالی و نظامی در سرور انجام می‌شود و هیچ مبلغی در کلاینت محاسبه نمی‌شود.',
  ].join('\n');
}

async function welcomeText(ctx: BotCtx, userId: number): Promise<string> {
  const nation = await currentNation(ctx, userId);
  if (!nation) return ctx.settings.branding.welcomeText;
  const view = await buildNationView(ctx.db, nation, ctx.settings);
  const rel = await relationCounts(ctx.db, nation.id);
  return [
    `${ctx.settings.branding.welcomeTitle}`,
    ``,
    `${nation.flag} ${statLine('کشور', nation.name)}`,
    statLine('رئیس کشور', nation.leader_name),
    ``,
    statLine('خزانه', coins(view.economy.treasury)),
    statLine('درآمد هر دوره', coins(view.economy.netIncome)),
    statLine('قدرت نظامی', fmt(view.military.militaryPower)),
    statLine('رتبه جهانی', `#${view.nation.worldRank}`),
    statLine('متحدان', String(rel.allies)),
    statLine('دشمنان', String(rel.enemies)),
    statLine('وضعیت کشور', statusLabel(nation.status)),
    ``,
    `⏳ واریز درآمد بعدی: ${Math.round(view.economy.nextIncomeIn / 60)} دقیقه`,
  ].join('\n');
}

function statusLabel(status: string): string {
  return (
    { active: 'فعال', frozen: 'منجمد', banned: 'مسدود', at_war: 'در حال جنگ', dissolved: 'منحل‌شده' } as Record<string, string>
  )[status] ?? status;
}

/* -------------------------------- onboarding ------------------------------- */

async function startOnboarding(ctx: BotCtx, message: TgMessage, userId: number) {
  await ctx.db.run(
    sql`INSERT INTO bot_flow_states (user_id, state, data, updated_at, expires_at)
         VALUES (${userId}, 'onb:name', NULL, ${nowSeconds()}, ${nowSeconds() + 86400})
         ON CONFLICT (user_id) DO UPDATE SET state = 'onb:name', data = NULL, updated_at = excluded.updated_at, expires_at = excluded.expires_at`,
  );
  await ctx.tg.sendMessage(message.chat.id, `${ctx.settings.branding.welcomeText}\n\n${ctx.settings.branding.nationNamePrompt}`, {
    inline: [[{ text: '❌ انصراف', callback_data: 'flow:cancel' }]],
  });
  return { handled: 'onboarding' };
}

async function continueOnboarding(ctx: BotCtx, userId: number, telegramId: number, step: 'name' | 'leader', text: string) {
  if (step === 'name') {
    const name = text.slice(0, 30);
    if (name.trim().length < 3) {
      await ctx.tg.sendMessage(telegramId, ctx.settings.branding.nationNamePrompt);
      return { handled: 'onb:retry' };
    }
    const dup = await ctx.db.first<{ id: number }>(sql`SELECT id FROM nations WHERE name = ${name.trim()} COLLATE NOCASE`);
    if (dup) {
      await ctx.tg.sendMessage(telegramId, '⚠️ این نام کشور قبلاً ثبت شده است.\n' + ctx.settings.branding.nationNamePrompt);
      return { handled: 'onb:duplicate' };
    }
    await ctx.db.run(
      sql`UPDATE bot_flow_states SET state = 'onb:leader', data = ${JSON.stringify({ name: name.trim() })}, updated_at = ${nowSeconds()} WHERE user_id = ${userId}`,
    );
    await ctx.tg.sendMessage(telegramId, ctx.settings.branding.leaderNamePrompt, { inline: [[{ text: '❌ انصراف', callback_data: 'flow:cancel' }]] });
    return { handled: 'onb:leader' };
  }

  const flow = await ctx.db.first<{ data: string | null }>(sql`SELECT data FROM bot_flow_states WHERE user_id = ${userId}`);
  const name = (safeJson(flow?.data)?.name as string) ?? text.slice(0, 30);
  const leaderName = text.slice(0, 40).trim();
  if (leaderName.length < 2) {
    await ctx.tg.sendMessage(telegramId, ctx.settings.branding.leaderNamePrompt);
    return { handled: 'onb:retry' };
  }
  await ctx.db.run(sql`UPDATE bot_flow_states SET state = 'onb:flag', data = ${JSON.stringify({ name, leaderName })} WHERE user_id = ${userId}`);
  await ctx.tg.sendMessage(telegramId, ctx.settings.branding.flagPrompt, { inline: flagKeyboard() });
  return { handled: 'onb:flag' };
}

async function finishOnboarding(ctx: BotCtx, userId: number, telegramId: number, flag: string) {
  const flow = await ctx.db.first<{ data: string | null }>(sql`SELECT data FROM bot_flow_states WHERE user_id = ${userId}`);
  const data = safeJson(flow?.data);
  const name = String(data.name ?? '');
  const leaderName = String(data.leaderName ?? '');
  if (!name || !leaderName) {
    await clearFlow(ctx.db, userId);
    await ctx.tg.sendMessage(telegramId, 'متأسفانه مراحل ثبت‌نام ناتمام ماند. دوباره /start را ارسال کنید.');
    return;
  }
  try {
    const result = await createNation(ctx.db, { userId, telegramId }, { name, leaderName, flag }, ctx.settings);
    await clearFlow(ctx.db, userId);
    await ctx.tg.sendMessage(telegramId, `✅ ${result.summary}`, { inline: mainMenu(ctx.webAppUrl) });
    await sendMainMenu(ctx, telegramId);
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'خطا در ثبت کشور. دوباره تلاش کنید.';
    await ctx.tg.sendMessage(telegramId, `⚠️ ${escapeHtml(message)}`, { inline: [[{ text: '🔁 تلاش دوباره', callback_data: 'new' }]] });
  }
}

function safeJson(v: unknown): Record<string, unknown> {
  try {
    return v ? (JSON.parse(String(v)) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function clearFlow(db: Db, userId: number) {
  await db.run(sql`DELETE FROM bot_flow_states WHERE user_id = ${userId}`);
}

async function currentNation(ctx: BotCtx, userId: number): Promise<NationRow | null> {
  return loadNationOwnedBy(ctx.db, userId);
}

/* --------------------------------- router -------------------------------- */

async function handleCallback(ctx: BotCtx, cb: TgCallbackQuery, updateId: number): Promise<{ handled: string }> {
  const data = cb.data ?? '';
  const from = cb.from;
  const chatId = cb.message?.chat.id ?? from.id;
  const messageId = cb.message?.message_id ?? 0;
  if (!from?.id) return { handled: 'no_user' };

  const identity = await upsertTelegramUser(ctx.db, { telegramId: from.id, username: from.username ?? null, firstName: from.first_name ?? null, languageCode: from.language_code ?? null }, ctx.env);
  const answer = (text?: string, alert = false) => ctx.tg.answerCallbackQuery(cb.id, text, alert);

  const [head, ...rest] = data.split(':');

  try {
    switch (head) {
      case 'noop':
        await answer();
        return { handled: 'noop' };
      case 'm':
        await ctx.tg.editMessageText(chatId, messageId, await welcomeText(ctx, identity.userId), mainMenu(ctx.webAppUrl));
        await answer();
        return { handled: 'menu' };
      case 'h':
        await ctx.tg.editMessageText(chatId, messageId, helpText(), backButton('🏠 منوی اصلی'));
        await answer();
        return { handled: 'help' };
      case 'flow':
        await clearFlow(ctx.db, identity.userId);
        await ctx.tg.editMessageText(chatId, messageId, '❌ عملیات لغو شد.', mainMenu(ctx.webAppUrl));
        await answer();
        return { handled: 'flow_cancel' };
      case 'new': {
        if (!ctx.tg.enabled) throw ApiError.internal('ربات پیکربندی نشده است.');
        await startOnboardingCallback(ctx, chatId, messageId, identity.userId);
        await answer();
        return { handled: 'onboarding' };
      }
      case 'flag': {
        const flag = FLAG_CHOICES[Number(rest[0])] ?? '🏳️';
        await finishOnboarding(ctx, identity.userId, chatId, flag);
        await answer();
        return { handled: 'flag' };
      }
      case 'nav':
        await renderPageCallback(ctx, chatId, messageId, identity.userId, rest[0] as PlayerPage);
        await answer();
        return { handled: `nav:${rest[0]}` };
      case 'cat':
        await renderShopCategory(ctx, chatId, messageId, identity.userId, rest[0]!, Number(rest[1] ?? 0));
        await answer();
        return { handled: `cat:${rest[0]}` };
      case 'item':
        await renderShopItem(ctx, chatId, messageId, identity.userId, Number(rest[0]), Number(rest[1] ?? 0));
        await answer();
        return { handled: 'item' };
      case 'buy':
        await confirmPurchaseAsk(ctx, chatId, messageId, identity.userId, Number(rest[0]), Number(rest[1]));
        await answer();
        return { handled: 'buy' };
      case 'bought': {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden('ابتدا کشور بسازید.');
        const result = await purchase(
          ctx.db,
          nation,
          { templateId: Number(rest[0]), quantity: Number(rest[1]), idempotencyKey: `tg${updateId}` },
          ctx.settings,
          { userId: identity.userId, telegramId: from.id },
          ctx.env.BOT_TOKEN,
        );
        await ctx.tg.editMessageText(
          chatId,
          messageId,
          [
            `🛒 <b>خرید انجام شد</b>${result.duplicate ? ' (تکراری — اعمال نشد)' : ''}`,
            `${result.quantity.toLocaleString('en-US')} عدد ${escapeHtml(result.nameFa)}`,
            statLine('قیمت واحد', coins(result.unitPrice)),
            statLine('مبلغ کل', coins(result.totalCost)),
            statLine('موجودی جدید', formatNumber(result.newQuantity)),
            statLine('خزانه', coins(result.treasuryAfter)),
          ].join('\n'),
          backButton(),
        );
        await answer();
        return { handled: 'purchase' };
      }
      case 'war': {
        if (rest[0] === 'list') {
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer();
          return { handled: 'war:list' };
        }
        if (rest[0] === 'targets') {
          await renderWarTargets(ctx, chatId, messageId, identity.userId, Number(rest[1] ?? 0));
          await answer();
          return { handled: 'war:targets' };
        }
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden('ابتدا کشور بسازید.');
        if (rest[0] === 'ask') {
          await renderWarPreview(ctx, chatId, messageId, nation, Number(rest[1]));
          await answer();
          return { handled: 'war:ask' };
        }
        if (rest[0] === 'go') {
          const res = await proposeWar(ctx.db, nation, Number(rest[1]), 0, ctx.settings, { userId: identity.userId, telegramId: from.id }, ctx.env.BOT_TOKEN);
          await ctx.tg.editMessageText(
            chatId,
            messageId,
            `⚔️ درخواست جنگ ارسال شد.\nشناسه جنگ: <b>${res.warId}</b>\nاحتمال پیروزی مهاجم: ${percent(res.preview.attackerWinChance)}\n\nحالا باید کشور مقابل پاسخ دهد.`,
            [[{ text: '📜 جنگ‌های من', callback_data: 'war:list' }, { text: '🏠 منو', callback_data: 'm' }]],
          );
          await answer();
          return { handled: 'war:go' };
        }
        if (rest[0] === 'no') {
          await answer('درخواست لغو شد.');
          return { handled: 'war:no' };
        }
        await answer('دستور ناشناخته', true);
        return { handled: 'war:unknown' };
      }
      case 'w': {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden('ابتدا کشور بسازید.');
        const warId = Number(rest[0]);
        const action = rest[1] ?? 'view';
        if (action === 'view') {
          const detail = await getWarDetail(ctx.db, warId, [nation.id], false);
          await ctx.tg.editMessageText(chatId, messageId, renderWarDetail(detail), [[{ text: '🔙 جنگ‌ها', callback_data: 'war:list' }, { text: '🏠 منو', callback_data: 'm' }]]);
          await answer();
          return { handled: 'war:view' };
        }
        if (action === 'yes' || action === 'reject') {
          await respondToWar(ctx.db, warId, action === 'yes', nation, ctx.settings, ctx.env.BOT_TOKEN);
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer(action === 'yes' ? 'جنگ آغاز شد ⚔️' : 'درخواست رد شد');
          return { handled: 'war:respond' };
        }
        if (action === 'round') {
          const res = await resolveRound(ctx.db, warId, ctx.settings, { force: false });
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer(`نوبت ${res.round} اجرا شد${res.finished ? ' — جنگ پایان یافت' : ''}`);
          return { handled: 'war:round' };
        }
        if (action === 'peace') {
          await requestPeace(ctx.db, warId, nation, ctx.settings, ctx.env.BOT_TOKEN);
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer('درخواست صلح ارسال شد 🕊️');
          return { handled: 'war:peace' };
        }
        await answer('نامعلوم', true);
        return { handled: 'w:unknown' };
      }
      case 'd': {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden('ابتدا کشور بسازید.');
        if (rest[0] === 'in') {
          await renderDiplomacyInbox(ctx, chatId, messageId, nation.id);
          await answer();
          return { handled: 'd:in' };
        }
        if (rest[0] === 'rel') {
          await renderRelations(ctx, chatId, messageId, nation.id);
          await answer();
          return { handled: 'd:rel' };
        }
        if (rest[0] === 'friend') {
          const target = Number(rest[1]);
          const { sendRequestFriendly } = await import('./botActions');
          const text = await sendRequestFriendly(ctx.db, nation, target, 'friendship', ctx.settings);
          await ctx.tg.editMessageText(chatId, messageId, text, [[{ text: '📥 درخواست‌ها', callback_data: 'd:in' }, { text: '🏠 منو', callback_data: 'm' }]]);
          await answer('ارسال شد');
          return { handled: 'd:friend' };
        }
        if (rest[0] === 'acc' || rest[0] === 'rej') {
          await decideRequest(ctx.db, Number(rest[1]), nation, rest[0] === 'acc', ctx.settings, { userId: identity.userId, telegramId: from.id }, ctx.env.BOT_TOKEN);
          await renderDiplomacyInbox(ctx, chatId, messageId, nation.id);
          await answer(rest[0] === 'acc' ? 'پذیرفته شد ✅' : 'رد شد ❌');
          return { handled: 'd:decide' };
        }
        await answer('نامعلوم', true);
        return { handled: 'd:unknown' };
      }
      case 'st': {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden('ابتدا کشور بسازید.');
        if (rest[0] === 'new') {
          await ctx.db.run(
            sql`INSERT INTO bot_flow_states (user_id, state, nation_id, updated_at, expires_at)
                 VALUES (${identity.userId}, 'stmt:text', ${nation.id}, ${nowSeconds()}, ${nowSeconds() + 3600})
                 ON CONFLICT (user_id) DO UPDATE SET state = 'stmt:text', nation_id = excluded.nation_id, updated_at = excluded.updated_at, expires_at = excluded.expires_at`,
          );
          await ctx.tg.editMessageText(chatId, messageId, ctx.settings.branding.statementPrompt, [[{ text: '❌ انصراف', callback_data: 'flow:cancel' }]]);
          await answer();
          return { handled: 'st:new' };
        }
        await renderStatements(ctx, chatId, messageId, identity.userId);
        await answer();
        return { handled: 'st:list' };
      }
      case 'sp': {
        const flow = await ctx.db.first<{ data: string | null }>(sql`SELECT data FROM bot_flow_states WHERE user_id = ${identity.userId}`);
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
        if (rest[0] === 'yes') {
          const text = String(safeJson(flow?.data).text ?? '');
          const result = await createStatement(ctx.db, nation, { text, via: 'bot' }, ctx.settings, { userId: identity.userId, telegramId: from.id });
          await clearFlow(ctx.db, identity.userId);
          await ctx.tg.editMessageText(
            chatId,
            messageId,
            `📜 بیانیه ثبت شد.\nوضعیت: <b>${result.statusLabelFa}</b>\nشناسه: ${result.statementId}\n\n${result.status === 'published' ? 'در بخش اخبار جهانی منتشر شد.' : 'پس از بررسی مدیر منتشر می‌شود.'}`,
            [[{ text: '📜 بیانیه‌های من', callback_data: 'st:list' }, { text: '🏠 منو', callback_data: 'm' }]],
          );
          await answer('ثبت شد');
          return { handled: 'st:confirm' };
        }
        await clearFlow(ctx.db, identity.userId);
        await ctx.tg.editMessageText(chatId, messageId, '❌ بیانیه لغو شد.', mainMenu(ctx.webAppUrl));
        await answer();
        return { handled: 'st:cancel' };
      }
      case 'set': {
        if (rest[0] === 'notify') {
          const nation = await currentNation(ctx, identity.userId);
          if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
          await ctx.db.run(
            sql`UPDATE nation_settings SET notify_enabled = CASE notify_enabled WHEN 1 THEN 0 ELSE 1 END, updated_at = ${nowSeconds()} WHERE nation_id = ${nation.id}`,
          );
          await renderPageCallback(ctx, chatId, messageId, identity.userId, 'settings');
          await answer('وضعیت اعلان‌ها تغییر کرد');
          return { handled: 'set:notify' };
        }
        if (rest[0] === 'logout') {
          await ctx.db.run(sql`UPDATE sessions SET revoked_at = ${nowSeconds()} WHERE user_id = ${identity.userId} AND revoked_at IS NULL`);
          await answer('نشست‌های Mini App بسته شد', true);
          return { handled: 'set:logout' };
        }
        await renderPageCallback(ctx, chatId, messageId, identity.userId, 'settings');
        await answer();
        return { handled: 'set' };
      }
      case 'nat': {
        const nationId = Number(rest[0]);
        const own = await ctx.db.first<{ id: number }>(sql`SELECT id FROM nations WHERE id = ${nationId} AND owner_user_id = ${identity.userId}`);
        if (!own) throw ApiError.forbidden('این کشور متعلق به شما نیست.');
        await ctx.tg.editMessageText(chatId, messageId, await welcomeText(ctx, identity.userId), mainMenu(ctx.webAppUrl));
        await answer('کشور فعال تغییر کرد');
        return { handled: 'nat' };
      }
      default:
        await answer('نامعلوم', true);
        return { handled: 'unknown' };
    }
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'خطای غیرمنتظره در پردازش درخواست.';
    await answer(`⚠️ ${message}`.slice(0, 190), true);
    if (!(err instanceof ApiError)) console.error('[bot]', err instanceof Error ? err.message : err);
    return { handled: 'error' };
  }
}

async function startOnboardingCallback(ctx: BotCtx, chatId: number, messageId: number, userId: number) {
  await ctx.db.run(
    sql`INSERT INTO bot_flow_states (user_id, state, data, updated_at, expires_at)
         VALUES (${userId}, 'onb:name', NULL, ${nowSeconds()}, ${nowSeconds() + 86400})
         ON CONFLICT (user_id) DO UPDATE SET state = 'onb:name', data = NULL, updated_at = excluded.updated_at, expires_at = excluded.expires_at`,
  );
  await ctx.tg.editMessageText(chatId, messageId, ctx.settings.branding.nationNamePrompt, [[{ text: '❌ انصراف', callback_data: 'flow:cancel' }]]);
}

/* ------------------------------- page renderers ---------------------------- */

async function renderPage(ctx: BotCtx, chatId: number, userId: number, page: PlayerPage, _messageId: number) {
  const nation = await currentNation(ctx, userId);
  if (!nation) {
    await ctx.tg.sendMessage(chatId, 'شما هنوز کشوری نساخته‌اید.\n\n' + ctx.settings.branding.nationNamePrompt, {
      inline: [[{ text: '🏳️ شروع ثبت‌نام', callback_data: 'new' }]],
    });
    await ctx.db.run(
      sql`INSERT INTO bot_flow_states (user_id, state, data, updated_at, expires_at)
           VALUES (${userId}, 'onb:name', NULL, ${nowSeconds()}, ${nowSeconds() + 86400})
           ON CONFLICT (user_id) DO UPDATE SET state = 'onb:name', updated_at = excluded.updated_at`,
    );
    return { handled: `page:${page}:no_nation` };
  }
  const { text, inline } = await renderFor(ctx, nation, page);
  await ctx.tg.sendMessage(chatId, text, { inline });
  return { handled: `page:${page}` };
}

async function renderPageCallback(ctx: BotCtx, chatId: number, messageId: number, userId: number, page: PlayerPage) {
  const nation = await currentNation(ctx, userId);
  if (!nation) {
    await ctx.tg.editMessageText(chatId, messageId, 'برای این بخش ابتدا باید کشور بسازید.', [[{ text: '🏳️ ساخت کشور', callback_data: 'new' }, { text: '🏠 منو', callback_data: 'm' }]]);
    return;
  }
  const { text, inline } = await renderFor(ctx, nation, page);
  await ctx.tg.editMessageText(chatId, messageId, text, inline);
}

async function renderFor(ctx: BotCtx, nation: NationRow, page: PlayerPage): Promise<{ text: string; inline: KeyboardRow<InlineKeyboardButton>[] }> {
  switch (page) {
    case 'economy': {
      const view = await buildNationView(ctx.db, nation, ctx.settings);
      const tx = await listTransactions(ctx.db, nation.id, { limit: 6 });
      return {
        text: [
          '💰 <b>اقتصاد کشور</b>',
          '',
          statLine('خزانه', coins(view.economy.treasury)),
          statLine('درآمد کارخانه‌ها', coins(view.economy.factoryIncome)),
          statLine('درآمد معادن', coins(view.economy.mineIncome)),
          statLine('درآمد ناخالص', coins(view.economy.grossIncome)),
          statLine('مالیات', coins(view.economy.taxCost)),
          statLine('هزینه نگهداری', coins(view.economy.maintenanceCost)),
          statLine('درآمد خالص هر دوره', coins(view.economy.netIncome)),
          statLine('دوره واریز', `${Math.round(view.economy.cycleSeconds / 3600)} ساعت`),
          statLine('واریز بعدی', `${Math.round(view.economy.nextIncomeIn / 60)} دقیقه`),
          '',
          '🧾 آخرین تراکنش‌ها:',
          ...tx.rows.map((t) => `• ${txLabel(t.type)} — ${t.amount > 0 ? '+' : ''}${formatNumber(t.amount)} سکه`),
        ].join('\n'),
        inline: [[{ text: '🖥️ نمودارها (Mini App)', url: ctx.webAppUrl + '#/economy' }], ...backButton()],
      };
    }
    case 'military': {
      const groups = await inventoryView(ctx.db, nation.id, ctx.settings);
      const view = await buildNationView(ctx.db, nation, ctx.settings);
      return {
        text: [
          `🎖️ <b>دارایی‌های نظامی ${nation.flag}</b>`,
          '',
          statLine('قدرت تهاجم', fmt(view.military.attackPower)),
          statLine('قدرت دفاعی', fmt(view.military.defensePower)),
          statLine('نیروی انسانی', fmt(view.military.troopsCount)),
          '',
          ...groups.map((g) => `${g.emoji} ${g.labelFa}: <b>${formatNumber(g.total)}</b>`),
        ].join('\n'),
        inline: [[{ text: '🔎 مشاهده جزئیات', callback_data: 'item:0:0' }], ...backButton()],
      };
    }
    case 'marketplace': {
      const cats = await listCategories(ctx.db);
      const buttons = cats.map((c) => ({ text: `${c.emoji} ${c.shopLabelFa}`, callback_data: `cat:${c.key}:0` }));
      const rows: KeyboardRow<InlineKeyboardButton>[] = [];
      for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
      rows.push([{ text: '🖥️ فروشگاه کامل', url: ctx.webAppUrl + '#/marketplace' }]);
      rows.push([{ text: '⬅️ بازگشت به منوی اصلی', callback_data: 'm' }]);
      return {
        text: [
          '🛒 <b>فروشگاه تجهیزات</b>',
          '',
          `خزانه شما: <b>${coins(nation.treasury)}</b>`,
          'قیمت هر تجهیز توسط مدیر تعیین می‌شود؛ اقلام بدون قیمت قابل خرید نیستند.',
        ].join('\n'),
        inline: rows,
      };
    }
    case 'country': {
      const view = await buildNationView(ctx.db, nation, ctx.settings, { includeStarter: true });
      return {
        text: [
          `🛡️ <b>${nation.flag} ${escapeHtml(nation.name)}</b>`,
          '',
          statLine('رئیس کشور', nation.leader_name),
          statLine('وضعیت', statusLabel(nation.status)),
          statLine('تأسیس', view.history.createdAt.slice(0, 10)),
          statLine('رتبه جهانی', `#${view.nation.worldRank}`),
          statLine('امتیاز کل', fmt(view.nation.totalScore)),
          statLine('امتیاز اقتصادی', fmt(view.nation.economicScore)),
          statLine('بسته اولیه', view.starterTemplateName ?? '-'),
          '',
          statLine('محدودیت تغییر نام', view.history.cooldowns.renameSecondsLeft ? `${Math.ceil(view.history.cooldowns.renameSecondsLeft / 3600)} ساعت` : 'آزاد'),
        ].join('\n'),
        inline: [[{ text: '✏️ تغییر مشخصات در Mini App', url: ctx.webAppUrl + '#/country' }], ...backButton()],
      };
    }
    case 'defense': {
      const d = await buildDefenseView(ctx.db, nation, ctx.settings);
      return {
        text: [
          `🛡️ <b>وضعیت دفاعی ${nation.flag} ${escapeHtml(nation.name)}</b>`,
          '',
          statLine('وضعیت', d.statusLabelFa),
          statLine('امتیاز دفاع', fmt(d.defenseScore)),
          statLine('امتیاز کلی', fmt(d.overallScore)),
          statLine('نیروها', fmt(d.troopsCount)),
          statLine('رادارها', fmt(d.radarCount)),
          statLine('واحدهای پدافندی', fmt(d.airDefenseUnits)),
          statLine('سطح استحکامات', String(d.fortificationLevel)),
          '',
          'سهم دسته‌ها در دفاع:',
          ...d.breakdown.slice(0, 8).map((b) => `${b.emoji} ${b.labelFa}: ${fmt(b.contribution)}`),
          ...(d.activeThreats.length ? ['', `⚠️ تهدید فعال: ${d.activeThreats.map((t) => t.attackerName).join('، ')}`] : []),
        ].join('\n'),
        inline: backButton(),
      };
    }
    case 'war': {
      const wars = await getWarsForNation(ctx.db, nation.id);
      const text = [
        '⚔️ <b>جنگ‌ها</b>',
        '',
        ...(wars.length === 0 ? ['جنگی ثبت نشده است.'] : []),
        ...wars.slice(0, 6).map((w) => renderWarLine(w)),
      ];
      return {
        text: text.join('\n'),
        inline: [[{ text: '🎯 انتخاب هدف حمله', callback_data: 'war:targets:0' }, { text: '📜 لیست جنگ‌ها', callback_data: 'war:list' }], ...backButton()],
      };
    }
    case 'diplomacy': {
      const rel = await listRelations(ctx.db, nation.id);
      const incoming = await listIncoming(ctx.db, nation.id);
      return {
        text: [
          '🌐 <b>دیپلماسی</b>',
          '',
          statLine('درخواست‌های در انتظار', String(incoming.length)),
          statLine('متحدان', String(rel.filter((r) => r.status === 'ally').length)),
          statLine('دوستان', String(rel.filter((r) => r.status === 'friend').length)),
          statLine('دشمنان', String(rel.filter((r) => r.status === 'enemy').length)),
          '',
          ...(rel.slice(0, 8).map((r) => `${r.otherFlag} ${r.otherNationName}: <b>${r.statusLabelFa}</b>`) as string[]),
          rel.length === 0 ? 'هنوز رابطه دیپلماتیکی ثبت نشده است.' : '',
        ].join('\n'),
        inline: [
          [{ text: '📥 درخواست‌ها', callback_data: 'd:in' }, { text: '🤝 روابط', callback_data: 'd:rel' }],
          [{ text: '🖥️ پنل دیپلماسی', url: ctx.webAppUrl + '#/diplomacy' }],
          ...backButton(),
        ],
      };
    }
    case 'statements':
      return renderStatementsBody(ctx, nation);
    case 'news': {
      const items = await newsFeed(ctx.db, { nationIds: [nation.id], limit: 8 });
      return {
        text: ['📰 <b>اخبار جهانی</b>', '', ...(items.items.length ? items.items.map((n) => `${n.emoji} <b>${escapeHtml(n.title)}</b>\n${escapeHtml(n.body).slice(0, 160)}`) : ['خبری ثبت نشده است.'])].join('\n\n'),
        inline: [[{ text: '🔄 به‌روزرسانی', callback_data: 'nav:news' }], ...backButton()],
      };
    }
    case 'rankings': {
      const rows = await listRankings(ctx.db, ctx.settings, { limit: 10 });
      const mine = rows.find((r) => r.nationId === nation.id);
      return {
        text: [
          '📊 <b>رتبه‌بندی جهانی</b>',
          '',
          ...rows.map((r) => `${r.rank}. ${r.flag} ${escapeHtml(r.name)} — ${fmt(r.score)} (خزانه ${formatNumber(r.raw.treasury)}، قدرت ${fmt(r.raw.militaryPower)})`),
          '',
          mine ? `رتبه شما: <b>#${mine.rank}</b>` : 'شما هنوز در فهرست نیستید.',
        ].join('\n'),
        inline: backButton(),
      };
    }
    case 'settings': {
      const ns = await ctx.db.first<{ notify_enabled: number }>(sql`SELECT notify_enabled FROM nation_settings WHERE nation_id = ${nation.id}`);
      const nations = await ctx.db.all<{ id: number; name: string; flag: string }>(
        sql`SELECT id, name, flag FROM nations WHERE owner_user_id = ${nation.owner_user_id}`,
      );
      return {
        text: [
          '⚙️ <b>تنظیمات</b>',
          '',
          statLine('اعلان‌های تلگرامی', ns?.notify_enabled ? 'روشن' : 'خاموش'),
          statLine('کشورهای شما', String(nations.length)),
          statLine('حداکثر مجاز', String(ctx.settings.profile.maxNationsPerUser)),
          '',
          'برای تغییر نام/پرچم/رئیس کشور به Mini App بروید (محدودیت زمانی از سوی مدیر اعمال می‌شود).',
        ].join('\n'),
        inline: [
          [{ text: '🔔 تغییر وضعیت اعلان‌ها', callback_data: 'set:notify' }],
          ...(nations.length > 1 ? [nations.map((n) => ({ text: `${n.flag} ${n.name}`, callback_data: `nat:${n.id}` }))] : []),
          [{ text: '🔒 بستن نشست‌های Mini App', callback_data: 'set:logout' }],
          ...backButton(),
        ],
      };
    }
    default:
      return { text: await welcomeText(ctx, nation.owner_user_id), inline: mainMenu(ctx.webAppUrl) };
  }
}

function renderWarLine(w: ReturnType<typeof mapWar>): string {
  const side = `${w.attackerFlag} ${w.attackerName} ⟷ ${w.defenderFlag} ${w.defenderName}`;
  return `⚔️ <b>#${w.id}</b> ${side}\n   وضعیت: ${w.statusLabelFa} | نوبت ${w.roundsPlayed}/${w.maxRounds} | شانس مهاجم ${percent(w.attackerWinChance)}${w.outcomeSummary ? `\n   ${escapeHtml(w.outcomeSummary).slice(0, 120)}` : ''}`;
}

function renderWarDetail(detail: Awaited<ReturnType<typeof getWarDetail>>): string {
  const w = detail.war;
  const reports = detail.reports.slice(0, 3).map(
    (r) =>
      `• نوبت ${r.roundNo}: برنده <b>${r.winner === 'attacker' ? w.attackerName : r.winner === 'defender' ? w.defenderName : 'تساوی'}</b> — شانس مهاجم ${percent(r.attackerWinChance)}`,
  );
  return [
    `⚔️ <b>جنگ #${w.id}</b>`,
    `${w.attackerFlag} ${w.attackerName} ⟷ ${w.defenderFlag} ${w.defenderName}`,
    '',
    statLine('وضعیت', w.statusLabelFa),
    statLine('قدرت مهاجم', fmt(w.attackerPower)),
    statLine('قدرت مدافع', fmt(w.defenderPower)),
    statLine('نوبت‌ها', `${w.roundsPlayed}/${w.maxRounds}`),
    statLine('غرامت پرداختی', coins(w.indemnityPaid)),
    w.outcomeSummary ? statLine('نتیجه', w.outcomeSummary) : '',
    '',
    ...(reports.length ? ['گزارش نبردها:', ...reports] : ['هنوز گزارشی ثبت نشده است.']),
  ]
    .filter(Boolean)
    .join('\n');
}

async function renderWarList(ctx: BotCtx, chatId: number, messageId: number, userId: number) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
  const { text, inline } = await renderFor(ctx, nation, 'war');
  await ctx.tg.editMessageText(chatId, messageId, text, inline);
}

async function renderWarTargets(ctx: BotCtx, chatId: number, messageId: number, userId: number, offset: number) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
  const list = await listNations(ctx.db, { limit: 8, offset, excludeNationId: nation.id });
  const buttons = list.map((n) => ({ text: `${n.flag} ${n.name} (#${n.worldRank})`, callback_data: `war:ask:${n.id}` }));
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  for (let i = 0; i < buttons.length; i += 1) rows.push([buttons[i]!]);
  rows.push(...pager('war:targets', offset, list.length < 8 ? offset + list.length : offset + 8, 8));
  rows.push([{ text: '⬅️ بازگشت', callback_data: 'nav:war' }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    ['🎯 <b>انتخاب هدف</b>', '', 'احتمال پیروزی و خسارت قبل از ارسال درخواست محاسبه و نمایش داده می‌شود.', ...(list.length === 0 ? ['کشور دیگری وجود ندارد.'] : [])].join('\n'),
    rows,
  );
}

async function renderWarPreview(ctx: BotCtx, chatId: number, messageId: number, nation: NationRow, targetId: number) {
  const { previewForWarTarget } = await import('./botActions');
  const p = await previewForWarTarget(ctx.db, nation, targetId, ctx.settings);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      '⚔️ <b>خلاصه درخواست جنگ</b>',
      '',
      `${nation.flag} ${escapeHtml(nation.name)} → ${p.targetFlag} ${escapeHtml(p.targetName)}`,
      '',
      statLine('قدرت شما (تهاجم)', fmt(p.attackerPower)),
      statLine('قدرت دفاع حریف', fmt(p.defenderPower)),
      statLine('احتمال پیروزی شما', percent(p.attackerWinChance)),
      statLine('هزینه ورود', coins(p.entryCost)),
      statLine('نوبت‌های حداکثری', String(p.maxRounds)),
      '',
      'پس از تأیید، درخواست برای کشور مقابل ارسال می‌شود و باید پذیرفته شود.',
    ].join('\n'),
    [
      [{ text: '✅ ارسال درخواست', callback_data: `war:go:${targetId}` }],
      [{ text: '❌ انصراف', callback_data: 'nav:war' }],
    ],
  );
}

async function renderDiplomacyInbox(ctx: BotCtx, chatId: number, messageId: number, nationId: number) {
  const incoming = await listIncoming(ctx.db, nationId);
  const rows: KeyboardRow<InlineKeyboardButton>[] = [];
  for (const r of incoming.slice(0, 8)) {
    const id = Number(r.id);
    rows.push([{ text: `${r.from_flag} ${String(r.from_name)} — ${kindFa(String(r.kind))}`, callback_data: 'noop' }]);
    rows.push([
      { text: '✅ پذیرش', callback_data: `d:acc:${id}` },
      { text: '❌ رد', callback_data: `d:rej:${id}` },
    ]);
  }
  rows.push([{ text: '🤝 روابط من', callback_data: 'd:rel' }]);
  rows.push([{ text: '⬅️ بازگشت', callback_data: 'nav:diplomacy' }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    ['📥 <b>درخواست‌های دیپلماتیک</b>', '', ...(incoming.length ? incoming.slice(0, 8).map((r) => `${r.from_flag} ${String(r.from_name)}: ${kindFa(String(r.kind))}`) : ['درخواستی وجود ندارد.'])].join('\n'),
    rows,
  );
}

async function renderRelations(ctx: BotCtx, chatId: number, messageId: number, nationId: number) {
  const rel = await listRelations(ctx.db, nationId);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    ['🤝 <b>روابط دیپلماتیک</b>', '', ...(rel.length ? rel.slice(0, 12).map((r) => `${r.otherFlag} ${r.otherNationName} — <b>${r.statusLabelFa}</b>${r.allianceName ? ` (${r.allianceName})` : ''}`) : ['روابطی ثبت نشده است.'])].join('\n'),
    [[{ text: '📥 درخواست‌ها', callback_data: 'd:in' }], [{ text: '⬅️ بازگشت', callback_data: 'nav:diplomacy' }]],
  );
}

function kindFa(kind: string): string {
  return (
    { friendship: 'دوستی', alliance: 'اتحاد', peace: 'صلح', non_aggression: 'عدم تجاوز', war: 'جنگ', message: 'پیام', dissolve: 'لغو روابط' } as Record<string, string>
  )[kind] ?? kind;
}

async function renderStatements(ctx: BotCtx, chatId: number, messageId: number, userId: number) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
  const { text, inline } = await renderStatementsBody(ctx, nation);
  await ctx.tg.editMessageText(chatId, messageId, text, inline);
}

async function renderStatementsBody(ctx: BotCtx, nation: NationRow) {
  const list = await listMyStatements(ctx.db, [nation.id], 6);
  return {
    text: [
      '📜 <b>بیانیه‌های رسمی</b>',
      '',
      ...(list.length ? list.map((s) => `${s.statusLabelFa} | ${escapeHtml(s.text.slice(0, 110))}`) : ['هنوز بیانیه‌ای منتشر نکرده‌اید.']),
      '',
      'بیانیه پس از ثبت به عنوان موضع رسمی کشور شما منتشر می‌شود.',
    ].join('\n'),
    inline: [[{ text: '✍️ صدور بیانیه جدید', callback_data: 'st:new' }], ...backButton()],
  };
}

async function renderShopCategory(ctx: BotCtx, chatId: number, messageId: number, userId: number, categoryKey: string, offset: number) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
  const { items } = await listCategoryItems(ctx.db, nation, categoryKey, ctx.settings);
  const page = items.slice(offset, offset + 10);
  const rows: KeyboardRow<InlineKeyboardButton>[] = page.map((item) => [
    {
      text: item.purchasable ? `${item.nameFa} — ${formatNumber(item.price ?? 0)}` : `${item.nameFa} — 🔒 ${item.disabledReason ?? ''}`,
      callback_data: item.purchasable ? `item:${item.templateId}:0` : 'noop',
    },
  ]);
  rows.push(...pager(`cat:${categoryKey}`, offset, items.length, 10));
  rows.push([{ text: '🔙 دسته‌بندی‌ها', callback_data: 'nav:marketplace' }, { text: '🏠 منو', callback_data: 'm' }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      `🛒 <b>${items.length} تجهیز در این دسته</b>`,
      '',
      statLine('خزانه', coins(nation.treasury)),
      'تعداد خریداری‌شده در پرانتز نمایش داده می‌شود.',
      ...page.map((i) => `• ${i.nameFa} (موجودی فعلی: ${formatNumber(i.ownedQuantity)})`),
    ].join('\n'),
    rows,
  );
}

async function renderShopItem(ctx: BotCtx, chatId: number, messageId: number, userId: number, templateId: number, _offset: number) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
  if (!templateId) {
    const groups = await inventoryView(ctx.db, nation.id, ctx.settings);
    await ctx.tg.editMessageText(
      chatId,
      messageId,
      ['🎖️ <b>موجودی کشور</b>', '', ...groups.map((g) => `${g.emoji} ${g.labelFa}: ${formatNumber(g.total)}`)].join('\n'),
      backButton(),
    );
    return;
  }
  const item = await ctx.db.first<Record<string, unknown>>(
    sql`SELECT t.id, t.name_fa, t.unit_fa, t.price, t.description, c.key AS cat, c.label_fa AS cat_label, c.emoji,
               COALESCE(i.quantity, 0) AS owned
          FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_inventory i ON i.template_id = t.id AND i.nation_id = ${nation.id}
         WHERE t.id = ${templateId}`,
  );
  if (!item) throw ApiError.notFound('تجهیزات یافت نشد.');
  const price = item.price === null ? null : Number(item.price);
  const qtyButtons = [1, 5, 10, 25, 100]
    .filter((q) => price !== null && q * price <= nation.treasury)
    .map((q) => ({ text: `${q}`, callback_data: `buy:${templateId}:${q}` }));
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      `${item.emoji} <b>${escapeHtml(String(item.name_fa))}</b> (${item.cat_label})`,
      '',
      price === null ? '🔒 قیمت توسط مدیر تعیین نشده است؛ خرید غیرفعال است.' : statLine('قیمت هر عدد', coins(price)),
      statLine('موجودی شما', `${formatNumber(Number(item.owned))} ${item.unit_fa}`),
      item.description ? `\n${escapeHtml(String(item.description))}` : '',
      '',
      'تعداد مورد نظر را انتخاب کنید:',
    ].join('\n'),
    [qtyButtons.length ? qtyButtons : [{ text: '⚠️ قابل خرید نیست', callback_data: 'noop' }], [{ text: '🔙 بازگشت', callback_data: `cat:${String(item.cat)}:0` }]],
  );
}

async function confirmPurchaseAsk(ctx: BotCtx, chatId: number, messageId: number, userId: number, templateId: number, quantity: number) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden('کشوری یافت نشد.');
  const item = await ctx.db.first<{ name_fa: string; price: number | null; unit_fa: string }>(
    sql`SELECT name_fa, price, unit_fa FROM equipment_templates WHERE id = ${templateId}`,
  );
  if (!item) throw ApiError.notFound('تجهیزات یافت نشد.');
  if (item.price === null) throw ApiError.validation('قیمت این تجهیزات هنوز تعیین نشده است.');
  const total = item.price * quantity;
  if (total > nation.treasury) throw ApiError.insufficientFunds(`موجودی خزانه کافی نیست (نیاز: ${coins(total)}).`);
  const summary = [
    '🧾 <b>خلاصه سفارش</b>',
    '',
    statLine('تجهیز', String(item.name_fa)),
    statLine('تعداد', `${formatNumber(quantity)} ${item.unit_fa}`),
    statLine('قیمت واحد', coins(item.price)),
    statLine('مبلغ کل', coins(total)),
    statLine('خزانه فعلی', coins(nation.treasury)),
    statLine('خزانه پس از خرید', coins(nation.treasury - total)),
    '',
    'با تأیید، مبلغ از خزانه کسر و تجهیزات به انبار اضافه می‌شود.',
  ].join('\n');
  await ctx.tg.editMessageText(chatId, messageId, summary, [
    [{ text: '✅ تأیید و پرداخت', callback_data: `bought:${templateId}:${quantity}` }],
    [{ text: '❌ انصراف', callback_data: `item:${templateId}:0` }],
  ]);
}
