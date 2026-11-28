import type { ReactNode } from 'react';
import { useRouter } from '../router';

/**
 * «مدیریت کشور» section — light theme primitives matching the reference screenshots
 * (light gray page, white rounded cards, black pill buttons, green CTA, red outline cancel).
 * Everything is Persian RTL, no external fonts, numerals stay Persian via `fa()`.
 */

export function LightShell({ children, title, emoji }: { children: ReactNode; title?: string; emoji?: string }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-[#eceff3] px-3 pb-4 pt-3 text-[#111827] shadow-inner">
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <h1 className="text-[17px] font-black tracking-tight">
            {title}
            {emoji ? <span className="mr-1.5">{emoji}</span> : null}
          </h1>
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function LightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-black/5 bg-white p-4 shadow-sm ${className}`}>{children}</section>;
}

export function LightSectionTitle({ children }: { children: ReactNode }) {
  return <div className="mb-2 px-1 text-[13px] font-extrabold text-[#111827]">{children}</div>;
}

/** black pill button like the reference («استخراج نفت»، «فروش ۱۰۰ واحد» و ...) */
export function LightBlackButton({ children, onClick, disabled, loading, className = '' }: { children: ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-2xl bg-[#111111] px-4 py-3.5 text-[13px] font-bold text-white transition active:scale-[0.98] disabled:opacity-40 ${className}`}
    >
      {loading ? 'در حال انجام…' : children}
    </button>
  );
}

/** green CTA («تأیید و ساخت»-style confirm buttons in the references) */
export function LightGreenButton({ children, onClick, disabled, loading, className = '' }: { children: ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-2xl bg-[#16a34a] px-4 py-3.5 text-[14px] font-extrabold text-white transition hover:bg-[#15803d] active:scale-[0.98] disabled:opacity-40 ${className}`}
    >
      {loading ? 'در حال ثبت…' : children}
    </button>
  );
}

/** red outline destructive/cancel («درخواست لغو قرارداد ❌») */
export function LightRedOutlineButton({ children, onClick, disabled, loading, className = '' }: { children: ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-2xl border border-red-400 bg-transparent px-4 py-3 text-[13px] font-bold text-red-500 transition active:scale-[0.98] disabled:opacity-40 ${className}`}
    >
      {loading ? 'در حال انجام…' : children}
    </button>
  );
}

/** «⬅ بازگشت back» */
export function LightBackButton({ label = 'بازگشت', to }: { label?: string; to?: string }) {
  const { navigate, back } = useRouter();
  return (
    <button
      onClick={() => (to ? navigate(to) : back())}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e8eaed] py-3.5 text-[12px] font-bold text-[#111827] transition active:scale-[0.98]"
    >
      <span aria-hidden>⬅</span> {label} <span className="text-[9px] uppercase tracking-widest text-slate-400">BACK</span>
    </button>
  );
}

export function LightBullet({ emoji, label, value }: { emoji?: string; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <span className="flex min-w-0 items-center gap-2 text-[12px] text-[#374151]">
        {emoji ? <span className="text-base leading-none">{emoji}</span> : <span className="text-[#9ca3af]">•</span>}
        <span className="truncate">{label}</span>
      </span>
      <b className="shrink-0 text-[12px] font-extrabold tabular-nums">{value}</b>
    </div>
  );
}

export function LightNote({ children }: { children: ReactNode }) {
  return <p className="px-2 text-center text-[10px] leading-6 text-[#9ca3af]">{children}</p>;
}

/** tappable white tile used on the hub screens */
export function LightTile({ emoji, label, onClick, className = '' }: { emoji: string; label: string; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl border border-black/5 bg-white px-2 py-4 text-center shadow-sm transition active:scale-[0.98] hover:border-black/10 ${className}`}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <span className="text-[13px] font-extrabold text-[#111827]">{label}</span>
    </button>
  );
}
