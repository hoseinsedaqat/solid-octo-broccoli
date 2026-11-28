import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { fa, useToast, Loading, ErrorBox } from '../../ui';
import { LightBackButton, LightCard, LightNote, LightSectionTitle, LightShell } from '../../components/Light';

interface ArmySection { key: string; labelFa: string; emoji: string; units: number; points: number; sharePercent: number }
interface ArmyState {
  troops: number;
  readiness: number;
  equipmentHealth: number;
  fuelLevel: number;
  ammoLevel: number;
  sections: ArmySection[];
  equipmentValue: number;
  equipmentUnits: number;
  repairCost: number;
  fuelCost: number;
  ammoCost: number;
  soldierUpkeepPerDay: number;
}

function meterColor(v: number) {
  return v >= 60 ? 'bg-[#16a34a]' : v >= 30 ? 'bg-amber-500' : 'bg-red-500';
}

/** «🪖 مدیریت ارتش» — آمادگی، بخش‌های نیرو و تأمین (تعمیر/سوخت/مهمات) */
export function ArmyPage() {
  const toast = useToast();
  const state = useApi<ArmyState>('/player/army');
  const data = state.data;
  const [busy, setBusy] = useState<string | null>(null);

  async function act(kind: 'repair' | 'fuel' | 'ammo') {
    setBusy(kind);
    try {
      if (kind === 'repair') {
        await api.post('/player/army/repair', {});
        toast('🔧 تجهیزات کاملاً تعمیر شدند.', 'ok');
      } else {
        await api.post('/player/army/supply', { kind });
        toast(kind === 'fuel' ? '⛽ سوخت تکمیل شد.' : '🧨 مهمات تکمیل شد.', 'ok');
      }
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <LightShell title="مدیریت ارتش" emoji="🪖">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">آمادگی نیروها، ترکیب ارتش و تأمین لجستیک</p>

      {state.loading ? <Loading label="در حال دریافت وضعیت ارتش…" /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      {data ? (
        <>
          {/* آمادگی کلی */}
          <LightCard className="text-center">
            <div className="text-[10px] font-bold text-[#6b7280]">آمادگی کلی ارتش</div>
            <div className="mt-1 text-4xl font-black tabular-nums text-[#111827]">{fa(data.readiness)}<span className="text-lg text-[#9ca3af]">/۹۹</span></div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/10">
              <div className={`h-full rounded-full ${meterColor(data.readiness)} transition-all`} style={{ width: `${data.readiness}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-[#6b7280]">
              <span>👥 نیرو: <b className="tabular-nums text-[#111827]">{fa(data.troops)}</b></span>
              <span>💰 جیره روزانه: <b className="tabular-nums text-[#111827]">{fa(data.soldierUpkeepPerDay)}</b> سکه</span>
            </div>
          </LightCard>

          {/* تجهیزات و ذخایر */}
          <LightCard className="mt-2.5 space-y-2.5">
            {[
              { label: 'سلامت تجهیزات', value: data.equipmentHealth, emoji: '❤️' },
              { label: 'سوخت', value: data.fuelLevel, emoji: '⛽' },
              { label: 'مهمات', value: data.ammoLevel, emoji: '🧨' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-[11px]">
                  <span>{row.emoji} {row.label}</span>
                  <b className="tabular-nums">{fa(row.value)}٪</b>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/10">
                  <div className={`h-full rounded-full ${meterColor(row.value)} transition-all`} style={{ width: `${Math.min(100, Math.max(0, row.value))}%` }} />
                </div>
              </div>
            ))}
          </LightCard>

          {/* تعمیر و تأمین */}
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            <button
              onClick={() => act('repair')}
              disabled={busy !== null || data.equipmentHealth >= 99}
              className="rounded-2xl border border-black/10 bg-white p-2.5 text-center shadow-sm transition active:scale-[0.98] disabled:opacity-40"
            >
              <div className="text-xl">🔧</div>
              <div className="mt-0.5 text-[9px] font-bold leading-4">تعمیر تجهیزات</div>
              <div className="text-[9px] tabular-nums text-[#6b7280]">{fa(data.repairCost)} سکه</div>
            </button>
            <button
              onClick={() => act('fuel')}
              disabled={busy !== null || data.fuelLevel >= 100}
              className="rounded-2xl border border-black/10 bg-white p-2.5 text-center shadow-sm transition active:scale-[0.98] disabled:opacity-40"
            >
              <div className="text-xl">⛽</div>
              <div className="mt-0.5 text-[9px] font-bold leading-4">تأمین سوخت</div>
              <div className="text-[9px] tabular-nums text-[#6b7280]">{fa(data.fuelCost)} سکه</div>
            </button>
            <button
              onClick={() => act('ammo')}
              disabled={busy !== null || data.ammoLevel >= 100}
              className="rounded-2xl border border-black/10 bg-white p-2.5 text-center shadow-sm transition active:scale-[0.98] disabled:opacity-40"
            >
              <div className="text-xl">🧨</div>
              <div className="mt-0.5 text-[9px] font-bold leading-4">تأمین مهمات</div>
              <div className="text-[9px] tabular-nums text-[#6b7280]">{fa(data.ammoCost)} سکه</div>
            </button>
          </div>

          {/* بخش‌های ارتش */}
          <section className="mt-3">
            <LightSectionTitle>ترکیب ارتش 🎖️</LightSectionTitle>
            <div className="space-y-1.5">
              {data.sections.map((s) => (
                <div key={s.key} className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-3 py-2 shadow-sm">
                  <span className="text-lg">{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <b>{s.labelFa}</b>
                      <span className="tabular-nums text-[#6b7280]">{fa(s.units)} واحد · {fa(s.points)} قدرت</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/10">
                      <div className="h-full rounded-full bg-[#111111]" style={{ width: `${s.sharePercent}%` }} />
                    </div>
                  </div>
                  <span className="w-8 shrink-0 text-center text-[10px] font-bold tabular-nums text-[#374151]">{fa(s.sharePercent)}٪</span>
                </div>
              ))}
            </div>
          </section>
          <LightNote>تجهیزات مستهلک شده را از اینجا تعمیر کنید؛ بدون تعمیر، اثر نبرد و آمادگی پایین می‌آید. آمار بخش‌ها از جدول قدرت نیروهای مسلح گرفته می‌شود.</LightNote>
        </>
      ) : null}

      <div className="mt-4">
        <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
      </div>
    </LightShell>
  );
}
