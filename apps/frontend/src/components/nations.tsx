import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { Btn, Spinner, fa } from '../ui';

export interface NationOption {
  id: number;
  name: string;
  flag: string;
  leaderName?: string;
  status?: string;
  worldRank?: number;
  militaryPower?: number;
  treasury?: number;
}

/**
 * Nation picker used everywhere a player has to point at another country.
 * It always searches through the API (never a list kept in the browser) so the set of visible
 * nations matches exactly what the backend is willing to expose.
 */
export function NationSearchSelect({
  includeSelf = false,
  excludeId,
  onPick,
  placeholder = 'جست‌وجوی نام کشور…',
  autoFocus,
}: {
  includeSelf?: boolean;
  excludeId?: number | null;
  onPick: (nation: NationOption) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<NationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void load(), 250);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<{ nations: NationOption[] }>('/social/nations', { q: q || undefined, limit: 12 });
      setItems((res.nations ?? []).filter((n) => (includeSelf || n.id !== excludeId) && n.status !== 'dissolved'));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input className="ww-input" autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
        {loading ? <Spinner /> : null}
      </div>
      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      <ul className="mt-2 divide-y divide-white/5 overflow-y-auto rounded-xl border border-white/10" style={{ maxHeight: 240 }}>
        {items.length === 0 && !loading ? <li className="p-3 text-center text-xs text-slate-500">نتیجه‌ای نیست.</li> : null}
        {items.map((n) => (
          <li key={n.id}>
            <button className="flex w-full items-center justify-between gap-2 px-3 py-2 text-right text-sm hover:bg-white/5" onClick={() => onPick(n)}>
              <span>
                <span className="ml-1">{n.flag}</span>
                {n.name}
                {n.leaderName ? <span className="mr-1 text-xs text-slate-500">— {n.leaderName}</span> : null}
              </span>
              <span className="text-[11px] text-slate-400">
                {n.worldRank ? <span className="ml-2">رتبه {fa(n.worldRank)}</span> : null}
                {n.militaryPower !== undefined ? `🛡️ ${fa(n.militaryPower)}` : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** compact "choose your country" list for admins acting on one nation */
export function NationPicker({ value, onChange }: { value: number | null; onChange: (id: number | null) => void }) {
  const [open, setOpen] = useState(false);
  const selected = useRef<NationOption | null>(null);
  const label = useMemo(() => (selected.current ? `${selected.current.flag} ${selected.current.name}` : value ? `کشور #${fa(value)}` : 'انتخاب کشور'), [value]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm">{label}</span>
        <Btn onClick={() => setOpen((v) => !v)}>{open ? 'بستن' : 'تغییر'}</Btn>
      </div>
      {open ? (
        <div className="mt-2">
          <NationSearchSelect
            includeSelf
            onPick={(n) => {
              selected.current = n;
              onChange(n.id);
              setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
