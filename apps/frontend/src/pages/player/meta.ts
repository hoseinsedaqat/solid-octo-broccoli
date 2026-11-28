/**
 * Labels and page metadata come from @ww/shared so the UI can never invent a category,
 * a status or a Persian label that the backend does not know about.
 */
import {
  EQUIPMENT_CATEGORIES,
  FLAG_CHOICES,
  MAX_STATEMENT_CHARS,
  MIN_STATEMENT_CHARS,
  PLAYER_PAGE_META,
  RANKING_LABELS_FA,
  RANKING_METRICS,
  RELATION_LABELS_FA,
  STATEMENT_STATUS_LABELS_FA,
  TRANSACTION_TYPE_LABELS_FA,
  WAR_STATUS_LABELS_FA,
  DIPLOMACY_KIND_LABELS_FA,
  DAILY_PRIZES,
  DEFENSE_ARRANGEMENT,
} from '@ww/shared';

export {
  EQUIPMENT_CATEGORIES,
  FLAG_CHOICES,
  MAX_STATEMENT_CHARS,
  MIN_STATEMENT_CHARS,
  RELATION_LABELS_FA,
  RANKING_LABELS_FA,
  RANKING_METRICS,
  STATEMENT_STATUS_LABELS_FA,
  TRANSACTION_TYPE_LABELS_FA,
  WAR_STATUS_LABELS_FA,
  DIPLOMACY_KIND_LABELS_FA,
  DAILY_PRIZES,
  DEFENSE_ARRANGEMENT,
};

const CATEGORY_MAP = new Map(EQUIPMENT_CATEGORIES.map((c) => [c.key, c]));

export function categoryLabel(key: string): string {
  return CATEGORY_MAP.get(key)?.labelFa ?? key;
}

export function categoryShopLabel(key: string): string {
  return CATEGORY_MAP.get(key)?.shopLabelFa ?? categoryLabel(key);
}

export function categoryEmoji(key: string): string {
  return CATEGORY_MAP.get(key)?.emoji ?? '📦';
}

export const NAV_TITLES: Record<string, string> = Object.fromEntries(
  (Object.entries(PLAYER_PAGE_META) as [string, { labelFa: string }][]).map(([key, meta]) => [key, meta.labelFa]),
);

/** tone of the money badge — never derived from the amount's sign in the browser for anything but colour */
export const TX_TONES: Record<string, 'ok' | 'bad' | 'warn' | 'info' | 'neutral'> = {
  revenue: 'ok',
  starter_grant: 'ok',
  admin_credit: 'ok',
  purchase: 'info',
  war_indemnity: 'bad',
  war_loss: 'bad',
  maintenance: 'warn',
  tax: 'warn',
  admin_debit: 'bad',
  refund: 'ok',
};

/** the honest footnote shown next to every money number */
export const ECONOMY_NOTE =
  'همه محاسبه‌ها سمت سرور انجام می‌شود: کارخانه و معدن هر دو در یک چرخه ۲۴ ساعته پرداخت می‌شوند و قیمت‌ها فقط از پایگاه داده خوانده می‌شوند.';

export const WAR_TONES: Record<string, 'ok' | 'bad' | 'warn' | 'info' | 'neutral'> = {
  proposed: 'warn',
  accepted: 'info',
  active: 'bad',
  peace_requested: 'warn',
  ended: 'neutral',
  cancelled: 'neutral',
  stopped_by_admin: 'bad',
};
