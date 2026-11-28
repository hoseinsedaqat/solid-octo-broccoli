import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { useRouter } from '../../router';
import { Badge, Btn, Card, ErrorBox, Loading, Modal, fa, faMoney, useToast } from '../../ui';

interface BuildingView {
  key: string;
  emoji: string;
  nameFa: string;
  descFa: string;
  cost: number;
  built: boolean;
  builtAt: string | null;
  grant: { kind: string; quantity: number; templateCode?: string };
}
interface BuildState {
  treasury: number;
  buildings: BuildingView[];
  builtCount: number;
  totalCount: number;
}

/** «🏗️ وزارت ساخت‌وساز» — سازه‌های یک‌بارساخت که با سکهٔ خزانه ساخته می‌شوند (آینهٔ ربات) */
export function BuildingsPage() {
  const { navigate } = useRouter();
  const toast = useToast();
  const state = useApi<BuildState>('/player/buildings');
  const [confirm, setConfirm] = useState<BuildingView | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const data = state.data;
  const treasury = data?.treasury ?? 0;

  async function build(key: string) {
    setBusy(key);
    try {
      const res = await api.post<{ building: { nameFa: string; emoji: string }; cost: number; treasury: number }>('/player/buildings', { buildingKey: key });
      toast(`${res.building.emoji} ${res.building.nameFa} ساخته شد!`, 'ok');
      setConfirm(null);
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطایی رخ داد.', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      {/* hero — مطابق اسکرین‌شات «وزارت ساخت‌وساز 🏗️» */}
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-l from-amber-600/15 via-ink-800 to-ink-900 p-5 text-center shadow-card">
        <div aria-hidden className="pointer-events-none absolute -right-6 -top-8 select-none text-8xl opacity-10">🏗️</div>
        <div aria-hidden className="pointer-events-none absolute -left-5 bottom-1 select-none text-6xl opacity-10">🏛️</div>
        <div className="relative">
          <div className="text-4xl">🏗️</div>
          <h1 className="mt-1 text-lg font-black tracking-tight text-gold-soft">وزارت ساخت‌وساز</h1>
          <p className="mt-1 text-[11px] leading-6 text-slate-400">فرمانده، برای توسعه کشور خود سازه‌های جدید بساز.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-gold-soft">
            💰 موجودی خزانه: <b className="tabular-nums">{state.loading ? '…' : fa(treasury)} سکه</b>
          </div>
          {data ? <p className="mt-1.5 text-[10px] text-slate-500">سازه‌های تکمیل‌شده: {fa(data.builtCount)} از {fa(data.totalCount)}</p> : null}
        </div>
      </div>

      {state.loading ? <Loading label="در حال دریافت وضعیت سازه‌ها…" /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      {data ? (
        <div className="grid grid-cols-2 gap-2.5">
          {data.buildings.map((b) => (
            <button
              key={b.key}
              onClick={() => (b.built ? toast('این سازه قبلاً ساخته شده است.', 'info') : setConfirm(b))}
              className={`group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border p-3 pb-3 text-center transition active:scale-[0.98] ${
                b.built ? 'border-ok/40 bg-ok/5' : 'border-white/10 bg-ink-800/70 hover:border-gold/30'
              }`}
            >
              {b.built ? <span className="absolute left-2 top-2 rounded-full border border-ok/40 bg-ok/10 px-2 py-0.5 text-[10px] font-bold text-ok">✅ ساخته شد</span> : null}
              <span className="pointer-events-none absolute -bottom-4 -right-3 select-none text-7xl opacity-[0.08]">{b.emoji}</span>
              <span className="text-5xl leading-none drop-shadow">{b.emoji}</span>
              <span className="mt-1 text-[13px] font-extrabold text-slate-100">{b.nameFa}</span>
              <span className="text-[10px] leading-5 text-slate-500">{b.descFa}</span>
              <span className={`mt-1 rounded-full border px-3 py-0.5 text-[11px] font-bold tabular-nums ${b.built ? 'border-white/10 bg-white/5 text-slate-500' : 'border-gold/30 bg-gold/10 text-gold-soft'}`}>
                {b.built ? `${b.emoji} تکمیل شد` : `${fa(b.cost)} سکه`}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* تأیید ساخت — همان تایید ربات (build:ask → build:go) */}
      <Modal
        open={Boolean(confirm)}
        title={`${confirm?.emoji} ${confirm?.nameFa}`}
        onClose={() => setConfirm(null)}
        footer={
          confirm ? (
            <>
              <Btn variant="danger" onClick={() => setConfirm(null)}>انصراف ❌</Btn>
              <Btn variant="primary" loading={busy === confirm.key} onClick={() => void build(confirm.key)}>✅ تأیید و ساخت</Btn>
            </>
          ) : undefined
        }
      >
        {confirm ? (
          <div className="space-y-2 text-[12px] leading-7 text-slate-300">
            <p>{confirm.descFa}</p>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-slate-400">هزینهٔ ساخت</span>
              <b className="text-gold-soft">{fa(confirm.cost)} سکه</b>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-slate-400">خزانهٔ شما پس از ساخت</span>
              <b className={treasury - confirm.cost < 0 ? 'text-danger' : 'text-slate-100'}>{fa(treasury - confirm.cost)} سکه</b>
            </div>
            {treasury < confirm.cost ? <p className="text-[11px] font-bold text-danger">موجودی ناکافی است.</p> : null}
            <p className="text-[10px] text-slate-500">این سازه یک‌بار ساخته می‌شود و جایزهٔ آن بلافاصله به کشور شما اضافه می‌گردد.</p>
          </div>
        ) : null}
      </Modal>

      <Btn variant="ghost" className="w-full" onClick={() => navigate('/app/player')}>⬅ بازگشت به منوی اصلی</Btn>
    </div>
  );
}
