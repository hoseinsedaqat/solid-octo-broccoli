import { useMemo, useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { useRouter } from '../../router';
import { fa, faDuration, useToast, Loading, ErrorBox, Modal, Stepper, Tabs, Badge } from '../../ui';
import { LightBackButton, LightBullet, LightCard, LightBlackButton, LightGreenButton, LightNote, LightSectionTitle, LightShell } from '../../components/Light';

interface FactoryView {
  templateId: number;
  code: string;
  nameFa: string;
  quantity: number;
  level: number;
  incomePerCycle: number;
  incomePerDay: number;
  statusFa: string;
  upgradeCost: number | null;
  atMaxLevel: boolean;
}
interface ProductTemplate { templateId: number; code: string; nameFa: string; price: number | null; unitCost: number }
interface ProductGroup { key: string; labelFa: string; emoji: string; templates: ProductTemplate[] }
interface InProgressOrder {
  id: string;
  templateName: string;
  productKey: string;
  quantity: number;
  totalCost: number;
  completesAt: string;
  progressPercent: number;
  remainingSeconds: number;
  remainingFa: string;
}
interface ReadyOrder { id: string; templateName: string; quantity: number; totalCost: number }
interface IndustryState {
  treasury: number;
  factoryCount: number;
  activeFactories: number;
  factoryLines: number;
  productionCapacity: number;
  maxFactoryLevel: number;
  productionSecondsPerUnit: number;
  factories: FactoryView[];
  products: ProductGroup[];
  inProgress: InProgressOrder[];
  readyToClaim: ReadyOrder[];
}

/** «🏭 صنایع و تولید» — وضعیت کارخانه‌ها، ارتقا و سفارش تولید تجهیزات */
export function IndustriesPage() {
  const { navigate } = useRouter();
  const toast = useToast();
  const state = useApi<IndustryState>('/player/industries');
  const data = state.data;

  const [tab, setTab] = useState<'factories' | 'produce'>('factories');
  const [groupKey, setGroupKey] = useState<string>('aircraft');
  const [selected, setSelected] = useState<ProductTemplate | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);

  const groups = data?.products ?? [];
  const activeGroup = groups.find((g) => g.key === groupKey) ?? groups[0];
  const totalCost = selected ? selected.unitCost * quantity : 0;
  const productionSecondsPerUnit = data?.productionSecondsPerUnit ?? 120;
  const estimatedSeconds = Math.max(15, Math.ceil((quantity * productionSecondsPerUnit) / (1 + 0.25 * ((data?.maxFactoryLevel ?? 1) - 1))));

  async function upgradeFactory(f: FactoryView) {
    if (f.upgradeCost === null) return;
    setBusy(`up-${f.templateId}`);
    try {
      await api.post('/player/industries/upgrade-factory', { templateId: f.templateId });
      toast(`⬆️ ${f.nameFa} به سطح ${fa(f.level + 1)} ارتقا یافت.`, 'ok');
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا', 'err');
    } finally {
      setBusy(null);
    }
  }

  async function startProduction() {
    if (!selected) return;
    setBusy('start');
    try {
      await api.post('/player/industries/start', { templateId: selected.templateId, quantity });
      toast(`🏭 سفارش تولید ${fa(quantity)} × ${selected.nameFa} ثبت شد.`, 'ok');
      setSelected(null);
      setQuantity(1);
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا', 'err');
    } finally {
      setBusy(null);
    }
  }

  async function claim(order: ReadyOrder) {
    setBusy(`claim-${order.id}`);
    try {
      await api.post('/player/industries/claim', { orderId: order.id });
      toast(`📦 ${fa(order.quantity)} × ${order.templateName} تحویل گرفته شد.`, 'ok');
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <LightShell title="صنایع و تولید" emoji="🏭">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">کارخانه‌های شما، ارتقای آن‌ها و تولید تجهیزات نظامی</p>

      {state.loading ? <Loading label="در حال دریافت وضعیت صنایع…" /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      {data ? (
        <>
          {/* آمار کلی */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'کارخانه', value: fa(data.factoryCount), emoji: '🏭' },
              { label: 'ظرفیت تولید', value: fa(data.productionCapacity), emoji: '⚙️' },
              { label: 'بالاترین سطح', value: fa(data.maxFactoryLevel), emoji: '📈' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-2.5 text-center shadow-sm">
                <div className="text-lg leading-none">{s.emoji}</div>
                <div className="mt-1 text-[15px] font-black tabular-nums">{s.value}</div>
                <div className="text-[10px] text-[#6b7280]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Tabs
              items={[
                { key: 'factories' as const, label: 'کارخانه‌ها 🏭' },
                { key: 'produce' as const, label: 'تولید ⚙️', badge: data.readyToClaim.length || undefined },
              ]}
              value={tab}
              onChange={setTab}
            />
          </div>

          {tab === 'factories' ? (
            <div className="mt-3 space-y-2">
              {data.factories.length === 0 ? (
                <LightCard className="text-center text-[12px] text-[#6b7280]">هنوز کارخانه‌ای ندارید. از «خرید کارخانه» در فروشگاه می‌توانید کارخانه بسازید.</LightCard>
              ) : (
                data.factories.map((f) => (
                  <LightCard key={f.templateId} className="!p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🏭</span>
                          <b className="truncate text-[13px]">{f.nameFa}</b>
                        </div>
                        <div className="mt-0.5 text-[10px] text-[#6b7280]">
                          ×{fa(f.quantity)} عدد · سطح <b className="text-[#111827]">{fa(f.level)}</b> · درآمد روزانه{' '}
                          <b className="tabular-nums text-[#16a34a]">{fa(f.incomePerDay)}</b> سکه
                        </div>
                      </div>
                      {f.atMaxLevel ? (
                        <Badge tone="ok">حداکثر ✅</Badge>
                      ) : (
                        <button
                          onClick={() => upgradeFactory(f)}
                          disabled={busy === `up-${f.templateId}`}
                          className="shrink-0 rounded-xl bg-[#111111] px-3 py-2 text-[10px] font-bold text-white disabled:opacity-40"
                        >
                          {busy === `up-${f.templateId}` ? '…' : `ارتقا ⏫ (${fa(f.upgradeCost)})`}
                        </button>
                      )}
                    </div>
                  </LightCard>
                ))
              )}
              <LightNote>هر سطح کارخانه، بازده همان نوع را ×سطح می‌کند. بازده کارخانه‌های بستهٔ اولیه داخل «درآمد پایهٔ روزانه» احتساب می‌شود؛ باقی‌مانده‌ها جداگانه به خزانه می‌نشینند.</LightNote>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {/* گروه‌های محصول */}
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {groups.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => setGroupKey(g.key)}
                    className={`shrink-0 rounded-2xl border px-3 py-2 text-[11px] font-bold transition ${
                      activeGroup?.key === g.key ? 'border-[#111111] bg-[#111111] text-white' : 'border-black/10 bg-white text-[#111827]'
                    }`}
                  >
                    {g.emoji} {g.labelFa}
                  </button>
                ))}
              </div>

              {activeGroup?.templates.length === 0 ? (
                <LightCard className="text-center text-[12px] text-[#6b7280]">در این گروه محصولی برای تولید تعریف نشده است.</LightCard>
              ) : null}

              <div className="max-h-72 space-y-1.5 overflow-y-auto">
                {activeGroup?.templates.map((t) => (
                  <button
                    key={t.templateId}
                    onClick={() => {
                      setSelected(t);
                      setQuantity(1);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white px-3 py-2.5 text-right shadow-sm transition active:scale-[0.99]"
                  >
                    <span className="min-w-0">
                      <b className="block truncate text-[12px]">{t.nameFa}</b>
                      <span className="text-[9px] text-[#6b7280]">قیمت فروش: {t.price === null ? '—' : `${fa(t.price)} سکه`}</span>
                    </span>
                    <span className="shrink-0 rounded-xl bg-[#111111] px-2.5 py-1.5 text-[10px] font-bold text-white tabular-nums">
                      {fa(t.unitCost)} سکه / واحد
                    </span>
                  </button>
                ))}
              </div>

              <LightNote>هزینهٔ تولید = نصف قیمت فروش · زمان تولید = {fa(data.productionSecondsPerUnit)} ثانیه به‌ازای هر واحد (با سطح کارخانه سریع‌تر)</LightNote>
            </div>
          )}

          {/* سفارش‌های فعال */}
          {data.inProgress.length > 0 ? (
            <section className="mt-3">
              <LightSectionTitle>⏳ در حال تولید ({fa(data.inProgress.length)})</LightSectionTitle>
              <div className="space-y-1.5">
                {data.inProgress.map((o) => (
                  <LightCard key={o.id} className="!p-3">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <b className="truncate">{o.quantity} × {o.templateName}</b>
                      <span className="shrink-0 text-[#6b7280] tabular-nums">{fa(o.remainingSeconds)} ثانیه</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/10">
                      <div className="h-full rounded-full bg-[#16a34a] transition-all" style={{ width: `${o.progressPercent}%` }} />
                    </div>
                  </LightCard>
                ))}
              </div>
            </section>
          ) : null}

          {/* آماده دریافت */}
          {data.readyToClaim.length > 0 ? (
            <section className="mt-3">
              <LightSectionTitle>📦 آماده دریافت</LightSectionTitle>
              <div className="space-y-1.5">
                {data.readyToClaim.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-2 rounded-2xl border border-[#16a34a]/40 bg-[#16a34a]/5 px-3 py-2.5">
                    <span className="min-w-0 text-[11px]">
                      <b>{o.quantity} × {o.templateName}</b>
                      <span className="block text-[9px] text-[#6b7280]">به انبار اضافه می‌شود</span>
                    </span>
                    <button
                      onClick={() => claim(o)}
                      disabled={busy === `claim-${o.id}`}
                      className="shrink-0 rounded-xl bg-[#16a34a] px-3 py-2 text-[11px] font-bold text-white disabled:opacity-40"
                    >
                      {busy === `claim-${o.id}` ? '…' : 'دریافت 📥'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {/* مودال سفارش تولید */}
      <Modal
        open={Boolean(selected)}
        title={selected ? `تولید ${selected.nameFa}` : ''}
        onClose={() => setSelected(null)}
        footer={
          selected ? (
            <>
              <button className="rounded-xl border border-red-400 px-4 py-2 text-[12px] font-bold text-red-500" onClick={() => setSelected(null)}>انصراف ❌</button>
              <button className="rounded-xl bg-[#16a34a] px-5 py-2 text-[12px] font-extrabold text-white disabled:opacity-40" disabled={busy === 'start'} onClick={startProduction}>
                {busy === 'start' ? 'در حال ثبت…' : '✅ تأیید سفارش'}
              </button>
            </>
          ) : undefined
        }
      >
        {selected ? (
          <div className="space-y-3 text-[12px] text-[#374151]">
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span>هزینهٔ هر واحد</span>
              <b className="tabular-nums">{fa(selected.unitCost)} سکه</b>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="shrink-0">تعداد</span>
              <Stepper value={quantity} onChange={setQuantity} min={1} max={data?.productionCapacity ?? 100} step={1} presets={[1, 5, 10, 25]} />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span>هزینهٔ کل</span>
              <b className={`tabular-nums ${data && data.treasury < totalCost ? 'text-red-500' : ''}`}>{fa(totalCost)} سکه</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span>زمان تولید</span>
              <b>{faDuration(estimatedSeconds)}</b>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span>خزانهٔ شما پس از سفارش</span>
              <b className="tabular-nums">{fa((data?.treasury ?? 0) - totalCost)} سکه</b>
            </div>
            {data && data.treasury < totalCost ? <p className="text-[11px] font-bold text-red-500">موجودی خزانه ناکافی است.</p> : null}
            <p className="text-[10px] text-[#9ca3af]">حداکثر ظرفیت هر سفارش = مجموع (تعداد × سطح) کارخانه‌های شما: {fa(data?.productionCapacity)} واحد.</p>
          </div>
        ) : null}
      </Modal>

      <div className="mt-4">
        <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
      </div>
    </LightShell>
  );
}
