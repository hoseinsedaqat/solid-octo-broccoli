import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { fa, faDuration, useToast, Loading, ErrorBox, Modal, Badge } from '../../ui';
import { LightBackButton, LightCard, LightNote, LightSectionTitle, LightShell } from '../../components/Light';

interface BuildingView {
  key: string;
  emoji: string;
  nameFa: string;
  descFa: string;
  cost: number;
  built: boolean;
  builtAt: string | null;
  level: number;
  nextAction: 'build' | 'upgrade' | 'max';
  nextCost: number;
  nextDurationSeconds: number;
  upgradeCost: number;
  grant: { kind: string; quantity: number; templateCode?: string };
  capacityNow: number | null;
  capacityAfter: number | null;
  activeProjectId: string | null;
}
interface BuildProjectView {
  id: string;
  buildingKey: string;
  emoji: string;
  nameFa: string;
  kind: 'build' | 'upgrade';
  targetLevel: number;
  cost: number;
  progressPercent: number;
  remainingSeconds: number;
  remainingFa: string;
}
interface BuildState {
  treasury: number;
  buildings: BuildingView[];
  builtCount: number;
  totalCount: number;
  projects: BuildProjectView[];
  maxConcurrent: number;
  activeProjectCount: number;
  maxLevel: number;
}

/** «🏗️ وزارت ساخت‌وساز» — پروژه‌های زمان‌دار ساخت/ارتقا با اثر در پایان پروژه (آینهٔ ربات) */
export function BuildingsPage() {
  const toast = useToast();
  const state = useApi<BuildState>('/player/buildings');
  const [confirm, setConfirm] = useState<BuildingView | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const data = state.data;
  const treasury = data?.treasury ?? 0;

  async function build(b: BuildingView) {
    setBusy(b.key);
    try {
      const res = await api.post<{ kind: 'build' | 'upgrade'; level: number; nameFa?: string; building: { nameFa: string; emoji: string }; durationSeconds: number; completed: boolean }>('/player/buildings', { buildingKey: b.key });
      if (res.completed) {
        toast(`${b.emoji} ${b.nameFa} تکمیل شد!`, 'ok');
      } else {
        toast(b.nextAction === 'build' ? `🏗️ ساخت ${b.nameFa} آغاز شد.` : `⏫ ارتقای ${b.nameFa} آغاز شد.`, 'ok');
      }
      setConfirm(null);
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطایی رخ داد.', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <LightShell title="وزارت ساخت‌وساز" emoji="🏗️">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">فرمانده، برای توسعه کشور خود سازه بسازید یا ارتقا دهید. اثر سازه پس از پایان پروژه اعمال می‌شود.</p>

      {state.loading ? <Loading label="در حال دریافت وضعیت سازه‌ها…" /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      {data ? (
        <>
          {/* خلاصه */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'موجودی خزانه', value: `${fa(data.treasury)}`, emoji: '💰' },
              { label: 'تکمیل‌شده', value: `${fa(data.builtCount)} از ${fa(data.totalCount)}`, emoji: '✅' },
              { label: 'پروژهٔ فعال', value: `${fa(data.activeProjectCount)} از ${fa(data.maxConcurrent)}`, emoji: '⏳' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-2.5 shadow-sm">
                <div className="text-lg leading-none">{s.emoji}</div>
                <div className="mt-1 text-[11px] font-black tabular-nums">{s.value}</div>
                <div className="text-[9px] text-[#6b7280]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* پروژه‌های در حال ساخت */}
          {data.projects.length > 0 ? (
            <section className="mt-3">
              <LightSectionTitle>پروژه‌های در حال ساخت ⏳</LightSectionTitle>
              <div className="space-y-1.5">
                {data.projects.map((p) => (
                  <LightCard key={p.id} className="!p-3">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <b className="truncate">{p.emoji} {p.nameFa} — {p.kind === 'build' ? 'ساخت' : 'ارتقا'} به سطح {fa(p.targetLevel)}</b>
                      <span className="shrink-0 tabular-nums text-[#6b7280]">{p.remainingFa}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/10">
                      <div className="h-full rounded-full bg-[#16a34a] transition-all" style={{ width: `${p.progressPercent}%` }} />
                    </div>
                  </LightCard>
                ))}
              </div>
            </section>
          ) : null}

          {/* جدول سازه‌ها */}
          <section className="mt-3">
            <LightSectionTitle>سازه‌ها 🏗️</LightSectionTitle>
            <div className="grid grid-cols-2 gap-2.5">
              {data.buildings.map((b) => {
                const busyProject = Boolean(b.activeProjectId);
                const isMax = b.nextAction === 'max';
                return (
                  <button
                    key={b.key}
                    onClick={() => (isMax || busyProject ? undefined : setConfirm(b))}
                    disabled={isMax || busyProject}
                    className={`relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl border p-3 pb-2.5 text-center shadow-sm transition active:scale-[0.98] ${
                      isMax ? 'border-black/5 bg-white/60' : 'border-black/5 bg-white hover:border-black/15'
                    }`}
                  >
                    {b.built ? (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-[#16a34a]/10 px-2 py-0.5 text-[9px] font-bold text-[#16a34a]">سطح {fa(b.level)}</span>
                    ) : null}
                    <span className="pointer-events-none absolute -bottom-4 -right-3 select-none text-7xl opacity-[0.07]">{b.emoji}</span>
                    <span className="text-5xl leading-none drop-shadow">{b.emoji}</span>
                    <span className="mt-0.5 text-[13px] font-extrabold text-[#111827]">{b.nameFa}</span>
                    <span className="min-h-8 text-[9px] leading-4 text-[#6b7280]">{b.descFa}</span>
                    {b.key === 'barracks' && b.capacityNow !== null ? (
                      <span className="text-[8px] tabular-nums text-[#9ca3af]">ظرفیت نیرو: {fa(b.capacityNow)}{b.capacityAfter !== null ? ` → ${fa(b.capacityAfter)}` : ''}</span>
                    ) : null}
                    <span
                      className={`mt-0.5 rounded-full px-3 py-1 text-[9px] font-bold tabular-nums ${
                        busyProject ? 'bg-amber-100 text-amber-600' : isMax ? 'bg-black/5 text-[#9ca3af]' : 'bg-[#111111] text-white'
                      }`}
                    >
                      {busyProject ? '⏳ در حال انجام…' : isMax ? 'حداکثر سطح ✅' : b.nextAction === 'build' ? `ساخت — ${fa(b.nextCost)} سکه` : `ارتقا ⏫ — ${fa(b.nextCost)} سکه`}
                    </span>
                    {!isMax && !busyProject ? <span className="text-[8px] tabular-nums text-[#9ca3af]">زمان: {faDuration(b.nextDurationSeconds)}</span> : null}
                  </button>
                );
              })}
            </div>
          </section>
          <LightNote>اثر سازه (تجهیزات / استحکامات / ظرفیت) پس از پایان پروژه اعمال می‌شود، نه در لحظهٔ شروع. حداکثر {fa(data.maxConcurrent)} پروژه به‌صورت هم‌زمان.</LightNote>
        </>
      ) : null}

      {/* تأیید ساخت/ارتقا */}
      <Modal
        open={Boolean(confirm)}
        title={confirm ? `${confirm.emoji} ${confirm.nameFa}` : ''}
        onClose={() => setConfirm(null)}
        footer={
          confirm ? (
            <>
              <button className="rounded-xl border border-red-400 px-4 py-2 text-[12px] font-bold text-red-500" onClick={() => setConfirm(null)}>انصراف ❌</button>
              <button
                className="rounded-xl bg-[#16a34a] px-5 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
                disabled={busy === confirm.key || treasury < confirm.nextCost}
                onClick={() => void build(confirm)}
              >
                {busy === confirm.key ? 'در حال ثبت…' : confirm.nextAction === 'build' ? '✅ تأیید و ساخت' : '✅ تأیید و ارتقا'}
              </button>
            </>
          ) : undefined
        }
      >
        {confirm ? (
          <div className="space-y-2 text-[12px] leading-7 text-[#374151]">
            <p>{confirm.descFa}</p>
            {confirm.nextAction === 'upgrade' ? <p className="text-[10px] text-[#6b7280]">ارتقا از سطح {fa(confirm.level)} به {fa(confirm.level + 1)}</p> : null}
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span className="text-[#6b7280]">{confirm.nextAction === 'build' ? 'هزینهٔ ساخت' : 'هزینهٔ ارتقا'}</span>
              <b className="tabular-nums">{fa(confirm.nextCost)} سکه</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span className="text-[#6b7280]">زمان پروژه</span>
              <b>{faDuration(confirm.nextDurationSeconds)}</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span className="text-[#6b7280]">خزانهٔ شما پس از پرداخت</span>
              <b className={`tabular-nums ${treasury - confirm.nextCost < 0 ? 'text-red-500' : ''}`}>{fa(treasury - confirm.nextCost)} سکه</b>
            </div>
            {treasury < confirm.nextCost ? <p className="text-[11px] font-bold text-red-500">موجودی ناکافی است.</p> : null}
            <p className="text-[10px] text-[#9ca3af]">پاداش پس از تکمیل پروژه به کشور شما اضافه می‌شود.</p>
          </div>
        ) : null}
      </Modal>

      <div className="mt-4">
        <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
      </div>
    </LightShell>
  );
}
