import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { fa, useToast, Loading, ErrorBox } from '../../ui';
import { LightBackButton, LightBullet, LightCard, LightNote, LightSectionTitle, LightShell } from '../../components/Light';

interface PopulationState {
  total: number;
  capacity: number;
  employed: number;
  unemployed: number;
  unemploymentRate: number;
  employmentRate: number;
  birthRate: number;
  deathRate: number;
  growthRate: number;
  happiness: number;
  atCapacity: boolean;
  hospitalLevel: number;
  schoolLevel: number;
  housingLevel: number;
  hospitalCost: number;
  schoolCost: number;
  housingCost: number;
  maxLevel: number;
  factoryCount: number;
  mineCount: number;
}

type UpgradeKind = 'hospital' | 'school' | 'housing';

/** «👥 مدیریت جمعیت» — آمار جمعیت، اشتغال و ارتقای زیرساخت‌های انسانی */
export function PopulationPage() {
  const toast = useToast();
  const state = useApi<PopulationState>('/player/population');
  const data = state.data;
  const [busy, setBusy] = useState<UpgradeKind | null>(null);

  async function upgrade(kind: UpgradeKind, label: string) {
    setBusy(kind);
    try {
      await api.post('/player/population/upgrade', { kind });
      toast(`✅ ${label} ارتقا یافت.`, 'ok');
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا', 'err');
    } finally {
      setBusy(null);
    }
  }

  const fill = data ? Math.min(100, Math.round((data.total / Math.max(1, data.capacity)) * 100)) : 0;

  const upgrades: { kind: UpgradeKind; emoji: string; label: string; level: number; cost: number; hint: string }[] = data
    ? [
        { kind: 'hospital', emoji: '🏥', label: 'بیمارستان‌ها', level: data.hospitalLevel, cost: data.hospitalCost, hint: 'کاهش مرگ‌ومیر و ظرفیت بیشتر' },
        { kind: 'school', emoji: '🎓', label: 'مدارس و دانشگاه', level: data.schoolLevel, cost: data.schoolCost, hint: 'افزایش نرخ اشتغال و رشد' },
        { kind: 'housing', emoji: '🏗️', label: 'مسکن و شهرسازی', level: data.housingLevel, cost: data.housingCost, hint: 'افزایش ظرفیت و نرخ زادوولد' },
      ]
    : [];

  return (
    <LightShell title="مدیریت جمعیت" emoji="👥">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">جمعیت، اشتغال و سطح رفاه شهروندان کشور</p>

      {state.loading ? <Loading label="در حال دریافت آمار جمعیت…" /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      {data ? (
        <>
          {/* آمار کلی */}
          <LightCard className="text-center">
            <div className="text-[10px] font-bold text-[#6b7280]">جمعیت کشور</div>
            <div className="mt-1 text-4xl font-black tabular-nums text-[#111827]">{fa(data.total)}</div>
            <div className="mt-0.5 text-[10px] text-[#6b7280]">ظرفیت پذیرش: {fa(data.capacity)} نفر {data.atCapacity ? '· 🔴 تکمیل' : ''}</div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/10">
              <div className={`h-full rounded-full transition-all ${fill >= 95 ? 'bg-red-500' : 'bg-[#16a34a]'}`} style={{ width: `${fill}%` }} />
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="rounded-2xl bg-[#eceff3] p-2">
                <div className="text-base leading-none">😊</div>
                <div className="mt-0.5 font-black tabular-nums">{fa(data.happiness)}٪</div>
                <div className="text-[#6b7280]">رضایت</div>
              </div>
              <div className="rounded-2xl bg-[#eceff3] p-2">
                <div className="text-base leading-none">📈</div>
                <div className="mt-0.5 font-black tabular-nums">{fa(data.growthRate)}٪</div>
                <div className="text-[#6b7280]">نرخ رشد</div>
              </div>
              <div className="rounded-2xl bg-[#eceff3] p-2">
                <div className="text-base leading-none">💼</div>
                <div className="mt-0.5 font-black tabular-nums">{fa(data.employmentRate)}٪</div>
                <div className="text-[#6b7280]">اشتغال</div>
              </div>
            </div>
          </LightCard>

          {/* بیکاری و نیروی کار */}
          <LightCard className="mt-2.5">
            <LightSectionTitle>نیروی کار 💼</LightSectionTitle>
            <LightBullet emoji="👷" label="شاغل" value={fa(data.employed)} />
            <LightBullet emoji="🪧" label="بیکار" value={`${fa(data.unemployed)} (${fa(data.unemploymentRate)}٪)`} />
            <LightBullet emoji="🏭" label="کارخانه‌ها / معادن" value={`${fa(data.factoryCount)} / ${fa(data.mineCount)}`} />
          </LightCard>

          {/* نرخ‌ها */}
          <LightCard className="mt-2.5">
            <LightSectionTitle>نرخ‌های حیاتی 📊</LightSectionTitle>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="rounded-2xl bg-[#eceff3] p-2">
                <div className="font-black tabular-nums text-[#16a34a]">+{fa(data.birthRate)}‰</div>
                <div className="text-[#6b7280]">زادوولد</div>
              </div>
              <div className="rounded-2xl bg-[#eceff3] p-2">
                <div className="font-black tabular-nums text-red-500">−{fa(data.deathRate)}‰</div>
                <div className="text-[#6b7280]">مرگ‌ومیر</div>
              </div>
              <div className="rounded-2xl bg-[#eceff3] p-2">
                <div className="font-black tabular-nums text-[#111827]">{fa(data.growthRate)}٪</div>
                <div className="text-[#6b7280]">رشد خالص</div>
              </div>
            </div>
          </LightCard>

          {/* ارتقاها */}
          <section className="mt-3">
            <LightSectionTitle>ارتقای زیرساخت‌های انسانی 🏗️</LightSectionTitle>
            <div className="space-y-1.5">
              {upgrades.map((u) => (
                <LightCard key={u.kind} className="!p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-2xl">{u.emoji}</span>
                      <div className="min-w-0">
                        <b className="text-[12px]">{u.label}</b>
                        <div className="text-[9px] text-[#6b7280]">سطح {fa(u.level)} از {fa(data.maxLevel)} · {u.hint}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => upgrade(u.kind, u.label)}
                      disabled={busy !== null || u.level >= data.maxLevel}
                      className="shrink-0 rounded-xl bg-[#111111] px-2.5 py-2 text-[9px] font-bold text-white disabled:opacity-30"
                    >
                      {u.level >= data.maxLevel ? 'حداکثر ✅' : `ارتقا ⏫ (${fa(u.cost)})`}
                    </button>
                  </div>
                </LightCard>
              ))}
            </div>
            <LightNote>رشد جمعیت به سطح مسکن وابسته است؛ وقتی ظرفیت پر باشد، نرخ رشد متوقف می‌شود.</LightNote>
          </section>
        </>
      ) : null}

      <div className="mt-4">
        <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
      </div>
    </LightShell>
  );
}
