/** Persian-friendly display helpers (numbers stay ASCII in JSON, formatted in UI). */

export const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFaDigits(input: string): string {
  return input.replace(/\d/g, (d) => FA_DIGITS[Number(d)]!);
}

export function formatCoins(value: number, groupSeparator = ','): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(value));
  return sign + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
}

export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function toIso(seconds: number | null | undefined): string | null {
  if (seconds === null || seconds === undefined) return null;
  return new Date(seconds * 1000).toISOString();
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function dayKey(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

export function humanDuration(seconds: number): string {
  if (seconds <= 0) return 'اکنون';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d} روز و ${h % 24} ساعت`;
  }
  if (h > 0) return `${h} ساعت و ${m} دقیقه`;
  if (m > 0) return `${m} دقیقه و ${s} ثانیه`;
  return `${s} ثانیه`;
}

/** truncate on word boundary, safe for Telegram message limits (4096) */
export function truncate(text: string, max = 4000): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
