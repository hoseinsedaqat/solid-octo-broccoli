import { useState, type ReactNode } from 'react';
import { api, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { Badge, Btn, Card, ErrorBox, Loading, Row, Spinner, fa, useToast } from '../../ui';

/** the whole settings bundle, shared by every settings-ish admin page */
export function useAdminSettings() {
  const s = useApi<{ settings: any; sections: string[] }>('/admin/settings');
  return s;
}

export type SettingsSection = 'economy_rules' | 'battle_params' | 'profile_rules' | 'diplomacy_rules' | 'feature_flags' | 'branding' | 'quota_guard' | 'ranking_weights';

export async function saveSettings(keys: Partial<Record<string, unknown>>): Promise<{ updated: string[] }> {
  return api.post('/admin/settings', keys);
}

/** number field that only PATCHes the single value that changed, after zod-style local validation */
export function NumField({
  section,
  keyName,
  label,
  value,
  min,
  max,
  step = 1,
  hint,
  percent,
  onSaved,
}: {
  section: SettingsSection;
  keyName: string;
  label: string;
  value: number | undefined;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  percent?: boolean;
  onSaved?: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const shown = draft ?? fmtInput(value, percent);
  const dirty = draft !== null && draft !== fmtInput(value, percent);

  async function commit() {
    if (!dirty) return;
    const n = Number(String(draft).replace(/[^\d.eE+-]/g, ''));
    if (!Number.isFinite(n)) {
      setErr('عدد معتبر وارد کنید');
      return;
    }
    if (min !== undefined && n < min) return void setErr(`حداقل ${min}`);
    if (max !== undefined && n > max) return void setErr(`حداکثر ${max}`);
    // fields stored as fractions (0..1) are shown and entered as 0..100
    const stored = percent ? n / 100 : n;
    setBusy(true);
    setErr(null);
    try {
      await saveSettings({ [section]: { [keyName]: stored } });
      toast(`${label} ذخیره شد.`, 'ok');
      setDraft(null);
      onSaved?.();
    } catch (e) {
      setErr((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[11px] text-slate-300">{label}</div>
          {hint ? <div className="mt-0.5 text-[10px] leading-4 text-slate-500">{hint}</div> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <input
            className="ww-input w-28 !py-1 text-left"
            dir="ltr"
            inputMode="decimal"
            value={shown}
            step={step}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void commit();
            }}
          />
          <button className="ww-btn ww-btn-ghost" onClick={() => void commit()} disabled={!dirty || busy} aria-label="ذخیره">
            {busy ? <Spinner size={12} /> : dirty ? '💾' : '✓'}
          </button>
        </div>
      </div>
      {err ? <div className="mt-1 text-[10px] text-danger">{err}</div> : null}
    </div>
  );
}

function fmtInput(v: number | undefined, percent?: boolean): string {
  if (v === undefined || v === null || Number.isNaN(Number(v))) return '';
  const n = Number(v);
  const out = percent ? n * 100 : n;
  return String(Math.round(out * 1000) / 1000);
}

/** boolean switch stored inside a settings section (e.g. feature_flags.warEnabled) */
export function BoolField({ section, keyName, label, value, hint, onSaved }: { section: SettingsSection; keyName: string; label: string; value: boolean | undefined; hint?: string; onSaved?: () => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <Row>
      <span className="min-w-0">
        <span className="block text-[11px] text-slate-300">{label}</span>
        {hint ? <span className="block text-[10px] leading-4 text-slate-500">{hint}</span> : null}
        {err ? <span className="block text-[10px] text-danger">{err}</span> : null}
      </span>
      <button
        className={`ww-btn ${value ? 'ww-btn-primary' : ''}`}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr(null);
          try {
            await saveSettings({ [section]: { [keyName]: !value } });
            toast(`${label}: ${!value ? 'روشن' : 'خاموش'}`, 'ok');
            onSaved?.();
          } catch (e) {
            setErr((e as ApiError).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {value ? '✅ روشن' : '⬜ خاموش'}
      </button>
    </Row>
  );
}

/** text field stored inside a settings section (branding texts) */
export function TextField({ section, keyName, label, value, maxLength = 500, hint, onSaved }: { section: SettingsSection; keyName: string; label: string; value: string | undefined; maxLength?: number; hint?: string; onSaved?: () => void }) {
  const toast = useToast();
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const shown = draft ?? value ?? '';
  const dirty = shown !== (value ?? '');
  return (
    <div>
      <label className="ww-label">{label}</label>
      <textarea
        className="ww-input min-h-16"
        value={shown}
        maxLength={maxLength}
        onChange={(e) => setDraft(e.target.value)}
      />
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500">
          {hint ? <>{hint} · </> : null}
          {fa(shown.length)} / {fa(maxLength)}
        </span>
        <Btn
          loading={busy}
          disabled={!dirty || shown.trim().length === 0}
          onClick={async () => {
            setBusy(true);
            setErr(null);
            try {
              await saveSettings({ [section]: { [keyName]: shown.trim() } });
              toast('ذخیره شد.', 'ok');
              setDraft(null);
              onSaved?.();
            } catch (e) {
              setErr((e as ApiError).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          ذخیره
        </Btn>
      </div>
      {err ? <p className="mt-1 text-[10px] text-danger">{err}</p> : null}
    </div>
  );
}

/** wraps a page section and shows a read-only banner when the admin lacks write permission */
export function AdminBlock({ section, title, emoji, right, children, write = true }: { section: string; title?: string; emoji?: string; right?: ReactNode; children: ReactNode; write?: boolean }) {
  const { can, me } = useAuth();
  const allowed = me?.role === 'super_admin' ? true : Boolean(can(section, write));
  return (
    <Card title={title} emoji={emoji} right={right}>
      {!allowed ? (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-warn/40 bg-warn/10 p-2">
          <span className="text-[11px] text-warn">{write ? 'مجوز نوشتن این بخش را ندارید؛ مقادیر فقط‌خواندنی‌اند.' : 'مجوز مشاهده این بخش محدود شده است.'}</span>
          <Badge tone="warn">🔒 {section}</Badge>
        </div>
      ) : null}
      {children}
    </Card>
  );
}

export function RawTable({ rows, columns, empty = 'رکوردی نیست.' }: { rows: Record<string, unknown>[] | undefined; columns: { key: string; label: string; render?: (v: unknown, row: Record<string, unknown>) => ReactNode }[]; empty?: string }) {
  if (!rows || rows.length === 0) return <div className="py-4 text-center text-[11px] text-slate-500">{empty}</div>;
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-[11px]">
        <thead>
          <tr className="text-slate-400">
            {columns.map((c) => (
              <th key={c.key} className="whitespace-nowrap px-2 py-1 text-right font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-white/5">
              {columns.map((c) => (
                <td key={c.key} className="max-w-[240px] truncate px-2 py-1 align-top">
                  {c.render ? c.render(r[c.key], r) : String(r[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function JsonView({ data, label }: { data: unknown; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="ww-btn ww-btn-ghost !px-2 !py-1 text-[10px]" onClick={() => setOpen((v) => !v)}>
        {open ? '▲' : '▼'} {label ?? 'JSON'}
      </button>
      {open ? <pre dir="ltr" className="mt-1 max-h-56 overflow-auto rounded-xl bg-black/40 p-2 text-[10px] leading-4 text-slate-300">{JSON.stringify(data, null, 1)}</pre> : null}
    </div>
  );
}

export function AdminLoading() {
  return <Loading label="در حال خواندن از سرور…" />;
}

export function AdminError({ message, retry }: { message: string | null; retry?: () => void }) {
  if (!message) return null;
  return <ErrorBox message={message} onRetry={retry} />;
}
