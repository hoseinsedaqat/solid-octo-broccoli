import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { tg } from './telegram';

/* ------------------------------- formatting ------------------------------- */

const faNumber = new Intl.NumberFormat('fa-IR');

/** 1234567 -> ۱٬۲۳۴٬۵۶۷ (Persian digits, always the same everywhere in the app) */
export function fa(value: number | null | undefined, fallback = '—'): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return fallback;
  return faNumber.format(Math.round(Number(value)));
}

export function faMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const n = Number(value);
  const sign = n < 0 ? '−' : '';
  return `${sign}${faNumber.format(Math.abs(Math.round(n)))} سکه`;
}

export function faPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(Number(value) * 100)}٪`;
}

export function faDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function faDuration(seconds: number | null | undefined): string {
  const s = Math.max(0, Math.floor(Number(seconds ?? 0)));
  if (!s) return 'اکنون';
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d) return `${fa(d)} روز و ${fa(h)} ساعت`;
  if (h) return `${fa(h)} ساعت و ${fa(m)} دقیقه`;
  return `${fa(m)} دقیقه`;
}

/* --------------------------------- toast --------------------------------- */

type ToastKind = 'ok' | 'err' | 'info';
interface ToastItem {
  id: number;
  text: string;
  kind: ToastKind;
}
const ToastContext = createContext<(text: string, kind?: ToastKind) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((text: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((list) => [...list, { id, text, kind }]);
    if (kind === 'err') tg.notify('error');
    if (kind === 'ok') tg.notify('success');
    setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), 4200);
  }, []);
  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex flex-col items-center gap-2 px-3">
        {items.map((i) => (
          <div
            key={i.id}
            className={`ww-card pointer-events-auto max-w-md px-3 py-2 text-sm shadow-lg ${
              i.kind === 'err' ? 'border-danger/40 text-danger' : i.kind === 'ok' ? 'border-ok/40 text-ok' : 'text-slate-200'
            }`}
          >
            {i.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

/* ------------------------------- primitives ------------------------------ */

export function Card({ title, emoji, right, children, className = '' }: { title?: string; emoji?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`ww-card p-3 ${className}`}>
      {(title || right) && (
        <header className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-200">
            {emoji ? <span className="ml-1">{emoji}</span> : null}
            {title}
          </h2>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'default',
  disabled,
  loading,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => unknown;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const [busy, setBusy] = useState(false);
  const cls = variant === 'primary' ? 'ww-btn ww-btn-primary' : variant === 'danger' ? 'ww-btn ww-btn-danger' : variant === 'ghost' ? 'ww-btn ww-btn-ghost' : 'ww-btn';
  return (
    <button
      type={type}
      className={`${cls} ${className}`}
      disabled={disabled || busy || loading}
      onClick={async () => {
        if (!onClick) return;
        tg.tap();
        setBusy(true);
        try {
          await onClick();
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy || loading ? <Spinner size={14} /> : null}
      {children}
    </button>
  );
}

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      className="ml-2 inline-block animate-spin rounded-full border-2 border-white/20 border-t-gold align-middle"
      style={{ width: size, height: size }}
    />
  );
}

export function Loading({ label = 'در حال بارگذاری…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
      <Spinner />
      {label}
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="ww-card border-danger/40 p-3 text-sm text-danger">
      <div className="mb-2">⚠️ {message}</div>
      {onRetry ? (
        <Btn onClick={onRetry}>تلاش دوباره</Btn>
      ) : null}
    </div>
  );
}

export function Empty({ text = 'چیزی برای نمایش نیست.', action }: { text?: string; action?: ReactNode }) {
  return (
    <div className="ww-card flex flex-col items-center gap-2 p-6 text-center text-sm text-slate-400">
      <span className="text-2xl opacity-60">🗂️</span>
      {text}
      {action}
    </div>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: 'ok' | 'warn' | 'bad' }) {
  const toneCls = tone === 'ok' ? 'text-ok' : tone === 'warn' ? 'text-gold-soft' : tone === 'bad' ? 'text-danger' : 'text-slate-100';
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={`text-base font-bold ${toneCls}`}>{value}</div>
      {hint ? <div className="text-[11px] text-slate-500">{hint}</div> : null}
    </div>
  );
}

export function Grid({ cols = 2, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  const cls = cols === 4 ? 'grid-cols-2 sm:grid-cols-4' : cols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2';
  return <div className={`grid gap-2 ${cls}`}>{children}</div>;
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'ok' | 'warn' | 'bad' | 'info' }) {
  const cls =
    tone === 'ok'
      ? 'border-ok/40 bg-ok/10 text-ok'
      : tone === 'warn'
        ? 'border-gold/40 bg-gold/10 text-gold-soft'
        : tone === 'bad'
          ? 'border-danger/40 bg-danger/10 text-danger'
          : tone === 'info'
            ? 'border-steel/40 bg-steel/10 text-steel'
            : 'border-white/10 bg-white/5 text-slate-300';
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{children}</span>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="ww-label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`ww-input ${props.className ?? ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`ww-input min-h-24 ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`ww-input ${props.className ?? ''}`} />;
}

export function Stepper({ value, onChange, step = 1, min = 0, max = 1_000_000_000, presets = [] }: { value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; presets?: number[] }) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Btn onClick={() => onChange(clamp(value - step))}>−</Btn>
      <input
        className="ww-input w-28 text-center"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number(String(e.target.value).replace(/[^\d-]/g, ''));
          onChange(clamp(Number.isFinite(n) ? n : min));
        }}
      />
      <Btn onClick={() => onChange(clamp(value + step))}>+</Btn>
      {presets.map((p) => (
        <button key={p} className="ww-btn ww-btn-ghost" onClick={() => onChange(clamp(p))}>
          {fa(p)}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({ items, value, onChange }: { items: { key: T; label: string; badge?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
      {items.map((i) => (
        <button key={i.key} className={`ww-tab ${value === i.key ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => onChange(i.key)}>
          {i.label}
          {i.badge ? <span className="mr-1 rounded-full bg-danger/20 px-1.5 text-[10px] text-danger">{fa(i.badge)}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Pager({ offset, total, pageSize, onMove }: { offset: number; total: number; pageSize: number; onMove: (next: number) => void }) {
  const last = Math.max(0, Math.ceil(total / pageSize) - 1);
  const page = Math.floor(offset / pageSize);
  if (last <= 0) return null;
  return (
    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
      <Btn disabled={page <= 0} onClick={() => onMove(Math.max(0, page - 1) * pageSize)}>
        قبلی
      </Btn>
      <span>
        صفحه {fa(page + 1)} از {fa(last + 1)}
      </span>
      <Btn disabled={page >= last} onClick={() => onMove(Math.min(last, page + 1) * pageSize)}>
        بعدی
      </Btn>
    </div>
  );
}

export function Modal({ open, title, children, onClose, footer }: { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-3 sm:items-center" onClick={onClose}>
      <div className="ww-card max-h-[85vh] w-full max-w-lg overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold">{title}</h3>
          <button className="ww-btn ww-btn-ghost" onClick={onClose} aria-label="بستن">
            ✕
          </button>
        </div>
        {children}
        {footer ? <div className="mt-3 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}

/** confirmation that types the exact word (used for destructive admin actions) */
export async function confirmDanger(message: string, word: string): Promise<boolean> {
  const answer = window.prompt(`${message}\n\nبرای تأیید دقیقاً بنویسید: ${word}`);
  return answer !== null && answer.trim() === word;
}

export function Row({ children, onClick, active }: { children: ReactNode; onClick?: () => void; active?: boolean }) {
  const cls = `flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm ${
    active ? 'border-gold/40 bg-gold/10' : 'border-white/10 bg-white/5'
  } ${onClick ? 'cursor-pointer hover:bg-white/10' : ''}`;
  return (
    <div className={cls} onClick={onClick}>
      {children}
    </div>
  );
}
