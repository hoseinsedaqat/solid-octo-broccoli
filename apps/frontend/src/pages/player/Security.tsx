import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { useRouter } from '../../router';
import { fa, useToast, Loading, ErrorBox, Stepper } from '../../ui';
import { LightBackButton, LightCard, LightNote, LightSectionTitle, LightShell } from '../../components/Light';

interface SecurityAlert {
  key: string;
  severity: 'warn' | 'critical';
  title: string;
  hint: string;
  actionLabel: string;
  actionRoute: string;
}
interface Candidate { assetType: 'factory' | 'mine' | 'building'; assetRef: string; assetName: string; protected: boolean }
interface SecurityState {
  status: string;
  statusTone: 'ok' | 'warn' | 'bad';
  alerts: SecurityAlert[];
  police: number;
  policeUpkeep: number;
  policeCost: number;
  borderLevel: number;
  borderCost: number;
  infraLevel: number;
  infraCost: number;
  maxLevel: number;
  borderPercent: number;
  infraPercent: number;
  protectedAssets: { assetType: string; assetRef: string; assetName: string }[];
  candidates: Candidate[];
  factoryTypes: number;
  protectCost: number;
}

const STATUS_STYLE: Record<string, string> = {
  عادی: 'border-[#16a34a]/40 bg-[#16a34a]/10 text-[#16a34a]',
  هشدار: 'border-amber-400/50 bg-amber-50 text-amber-600',
  بحرانی: 'border-red-400/50 bg-red-50 text-red-500',
};
const ASSET_TYPE_FA: Record<string, string> = { factory: 'کارخانه', mine: 'معدن', building: 'سازه' };

/** «🛡️ امنیت کشور» — وضعیت امنیتی، پلیس، مرز، زیرساخت و حفاظت از مراکز مهم */
export function SecurityPage() {
  const toast = useToast();
  const { navigate } = useRouter();
  const state = useApi<SecurityState>('/player/security');
  const data = state.data;

  const [policeQty, setPoliceQty] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);

  async function post(path: string, body: unknown, okText: string, busyKey: string) {
    setBusy(busyKey);
    try {
      await api.post(path, body);
      toast(okText, 'ok');
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <LightShell title="امنیت کشور" emoji="🛡️">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">نیروی انتظامی، مرزها، زیرساخت‌ها و محافظت از مراکز حیاتی</p>

      {state.loading ? <Loading label="در حال دریافت وضعیت امنیت…" /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      {data ? (
        <>
          {/* وضعیت کلی */}
          <div className={`rounded-3xl border px-4 py-3 text-center shadow-sm ${STATUS_STYLE[data.status] ?? STATUS_STYLE['هشدار']}`}>
            <div className="text-[10px] font-bold opacity-80">وضعیت امنیتی کشور</div>
            <div className="mt-0.5 text-2xl font-black">{data.status}</div>
            <div className="mt-0.5 text-[9px] opacity-75">{fa(data.alerts.length)} هشدار فعال</div>
          </div>

          {/* هشدارها */}
          {data.alerts.length > 0 ? (
            <section className="mt-3">
              <LightSectionTitle>هشدارها ⚠️</LightSectionTitle>
              <div className="space-y-1.5">
                {data.alerts.map((a) => (
                  <div key={a.key} className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 ${a.severity === 'critical' ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}`}>
                    <div className="min-w-0">
                      <b className="block text-[11px] text-[#111827]">{a.severity === 'critical' ? '🔴' : '🟡'} {a.title}</b>
                      <span className="block text-[9px] leading-4 text-[#6b7280]">{a.hint}</span>
                    </div>
                    <button onClick={() => navigate(a.actionRoute)} className="shrink-0 rounded-xl bg-[#111111] px-2.5 py-1.5 text-[9px] font-bold text-white">
                      {a.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* پلیس */}
          <LightCard className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚓</span>
                <div>
                  <b className="text-[12px]">نیروی انتظامی</b>
                  <div className="text-[9px] text-[#6b7280]">{fa(data.police)} پلیس فعال · جیره روزانه {fa(data.policeUpkeep)} سکه</div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <Stepper value={policeQty} onChange={setPoliceQty} min={1} max={500} step={1} presets={[10, 25, 50, 100]} />
              <button
                disabled={busy !== null}
                onClick={() => post('/player/security/police', { quantity: policeQty }, `🚓 ${fa(policeQty)} پلیس استخدام شد.`, 'police')}
                className="shrink-0 rounded-2xl bg-[#111111] px-3 py-2.5 text-[10px] font-bold text-white disabled:opacity-40"
              >
                استخدام ({fa(policeQty * data.policeCost)})
              </button>
            </div>
          </LightCard>

          {/* مرز و زیرساخت */}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {[
              { label: 'حفاظت مرز', emoji: '🛡️', level: data.borderLevel, percent: data.borderPercent, cost: data.borderCost, key: 'border' as const, path: '/player/security/border' },
              { label: 'زیرساخت‌ها', emoji: '🏗️', level: data.infraLevel, percent: data.infraPercent, cost: data.infraCost, key: 'infra' as const, path: '/player/security/infra' },
            ].map((s) => (
              <LightCard key={s.key} className="!p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{s.emoji}</span>
                  <div>
                    <b className="text-[11px]">{s.label}</b>
                    <div className="text-[9px] tabular-nums text-[#6b7280]">سطح {fa(s.level)} از {fa(data.maxLevel)}</div>
                  </div>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/10">
                  <div className="h-full rounded-full bg-[#111111]" style={{ width: `${s.percent}%` }} />
                </div>
                <button
                  disabled={busy !== null || s.level >= data.maxLevel}
                  onClick={() => post(s.path, {}, `${s.emoji} ${s.label} ارتقا یافت.`, s.key)}
                  className="mt-1.5 w-full rounded-xl bg-[#111111] px-2 py-2 text-[9px] font-bold text-white disabled:opacity-30"
                >
                  {s.level >= data.maxLevel ? 'حداکثر سطح ✅' : `ارتقا ⏫ (${fa(s.cost)})`}
                </button>
              </LightCard>
            ))}
          </div>

          {/* حفاظت از مراکز مهم */}
          <section className="mt-3">
            <LightSectionTitle>حفاظت از مراکز مهم 🏭</LightSectionTitle>
            {data.candidates.length === 0 ? (
              <p className="rounded-2xl border border-black/5 bg-white px-3 py-4 text-center text-[10px] text-[#9ca3af]">هنوز مرکز قابل محافظتی ندارید.</p>
            ) : (
              <div className="space-y-1.5">
                {data.candidates.map((c) => (
                  <div key={`${c.assetType}:${c.assetRef}`} className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 ${c.protected ? 'border-[#16a34a]/40 bg-[#16a34a]/5' : 'border-black/5 bg-white'}`}>
                    <div className="min-w-0">
                      <b className="block truncate text-[11px]">{c.assetName}</b>
                      <span className="text-[9px] text-[#6b7280]">{ASSET_TYPE_FA[c.assetType]} {c.protected ? '· 🛡️ محافظت‌شده' : ''}</span>
                    </div>
                    <button
                      disabled={busy !== null}
                      onClick={() => post('/player/security/protect', { assetType: c.assetType, assetRef: c.assetRef, assetName: c.assetName }, c.protected ? 'حفاظت برداشته شد.' : `🛡️ ${c.assetName} محافظت شد.`, `prot-${c.assetRef}`)}
                      className={`shrink-0 rounded-xl px-2.5 py-2 text-[9px] font-bold disabled:opacity-40 ${c.protected ? 'border border-black/15 text-[#374151]' : 'bg-[#111111] text-white'}`}
                    >
                      {c.protected ? 'لغو حفاظت' : `محافظت (${fa(data.protectCost)})`}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <LightNote>ثبت حفاظت یک‌بار {fa(data.protectCost)} سکه هزینه دارد و برداشتن آن رایگان است. مراکز محافظت‌شده در بحران‌ها کمتر آسیب می‌بینند.</LightNote>
          </section>
        </>
      ) : null}

      <div className="mt-4">
        <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
      </div>
    </LightShell>
  );
}
