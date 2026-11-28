import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { fa, useToast, Loading, ErrorBox } from '../../ui';
import { LightBlackButton, LightBullet, LightCard, LightBackButton, LightGreenButton, LightNote, LightSectionTitle, LightShell } from '../../components/Light';
import { REFINERY_RECIPES, RESOURCES } from '@ww/shared';
import { useResources } from './Resources';

/** «🏭 مرکز پالایش کشور» — recipes from @ww/shared; 30-minute lazy-settled operations */
export function RefineryPage() {
  const toast = useToast();
  const res = useResources();
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const data = res.data;
  const recipe = REFINERY_RECIPES.find((r) => r.key === selected) ?? null;
  const inputDef = recipe ? RESOURCES.find((r) => r.key === recipe.inputKey) : null;

  async function start() {
    if (!recipe) return;
    setBusy(true);
    try {
      await api.post('/player/refinery/start', { recipeKey: recipe.key });
      toast('✅ عملیات پالایش آغاز شد.', 'ok');
      setSelected(null);
      await res.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در شروع عملیات', 'err');
    } finally {
      setBusy(false);
    }
  }

  const stockOf = (key: string) => data?.resources.find((r) => r.key === key)?.stock ?? 0;
  const productName = (key: string) => ({ fuel: 'سوخت ⛽', steel: 'فولاد ⚙️', energy: 'انرژی ⚡' } as Record<string,string>)[key] ?? key;

  return (
    <LightShell title={recipe ? 'جزئیات عملیات پالایش' : 'مرکز پالایش کشور'} emoji="🏭">
      {res.loading ? <Loading label="در حال دریافت پالایشگاه…" /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}

      {!recipe ? (
        <>
          <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">منابع خام را به محصولات قابل استفاده تبدیل کن.</p>
          <div className="space-y-2.5">
            {REFINERY_RECIPES.map((rc) => {
              const input = RESOURCES.find((r) => r.key === rc.inputKey)!;
              const out = { fuel: { emoji: '⛽', nameFa: 'سوخت' }, steel: { emoji: '⚙️', nameFa: 'فولاد' }, energy: { emoji: '⚡', nameFa: 'انرژی' } }[rc.outputKey]!;
              return (
                <button
                  key={rc.key}
                  onClick={() => setSelected(rc.key)}
                  className="w-full rounded-3xl border border-black/5 bg-white p-4 text-center shadow-sm transition active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-2 text-[13px] font-extrabold text-[#111827]">
                    {input.emoji} {input.nameFa} خام
                  </div>
                  <div className="my-1.5 text-[#9ca3af]">↓</div>
                  <div className="flex items-center justify-center gap-2 text-[13px] font-extrabold text-[#111827]">
                    تولید: {out.emoji} {out.nameFa}
                  </div>
                  <div className="mt-2 text-[10px] tabular-nums text-[#6b7280]">ورودی {fa(rc.inputQty)} {input.unitFa} ← خروجی {fa(rc.outputQty)} واحد · هزینه {fa(rc.cost)} سکه · {fa(rc.minutes)} دقیقه</div>
                </button>
              );
            })}
          </div>

          {data && data.refineryOps.length > 0 ? (
            <div className="mt-4">
              <LightSectionTitle>عملیات‌های در حال اجرا ⏳</LightSectionTitle>
              <div className="space-y-2">
                {data.refineryOps.map((op) => (
                  <LightCard key={op.id} className="py-3 text-center">
                    <span className="inline-block rounded-full bg-[#dcfce7] px-3 py-1 text-[10px] font-extrabold text-[#15803d]">عملیات آغاز شد</span>
                    <div className="mt-2 text-[14px] font-black text-[#111827]">🏭 پالایشگاه کشور</div>
                    <p className="mt-1 text-[12px] leading-7 text-[#374151]">پالایش {fa(op.inputQty)} واحد {op.inputKey} آغاز شد.</p>
                    <p className="mt-1 text-[12px] font-extrabold tabular-nums text-[#111827]">زمان باقی‌مانده: {fa(Math.floor(op.completesInSeconds / 60))} دقیقه ⏳</p>
                    <p className="mt-1 text-[10px] text-[#9ca3af]">پس از تکمیل عملیات، محصول به انبار کشور اضافه می‌شود.</p>
                  </LightCard>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-3">
            <LightGreenButton onClick={() => toast('یک دستور پالایش را از بالا انتخاب کنید.', 'info')}>🏭 شروع پالایش</LightGreenButton>
          </div>
          <div className="mt-2">
            <LightBackButton label="بازگشت" to="/app/resources" />
          </div>
        </>
      ) : (
        <>
          <LightCard className="divide-y divide-black/5">
            <LightBullet emoji="🛢️" label="ماده خام" value={`${inputDef?.emoji} ${inputDef?.nameFa} خام`} />
            <LightBullet emoji="📥" label="مقدار ورودی" value={`${fa(recipe.inputQty)} ${inputDef?.unitFa}`} />
            <LightBullet emoji="🏭" label="محصول نهایی" value={productName(recipe.outputKey)} />
            <LightBullet emoji="📤" label="مقدار خروجی" value={`${fa(recipe.outputQty)} واحد`} />
            <LightBullet emoji="💰" label="هزینه پالایش" value={`${fa(recipe.cost)} سکه`} />
            <LightBullet emoji="⏱️" label="زمان تکمیل" value={`${fa(recipe.minutes)} دقیقه`} />
          </LightCard>

          <h2 className="mt-4 text-center text-[13px] font-extrabold text-[#111827]">آیا عملیات پالایش را شروع می‌کنید؟</h2>
          <div className="mt-2 space-y-2">
            <LightGreenButton loading={busy} disabled={stockOf(recipe.inputKey) < recipe.inputQty} onClick={() => void start()}>
              ✅ تأیید و شروع پالایش
            </LightGreenButton>
            <button onClick={() => setSelected(null)} className="w-full rounded-2xl border border-black/10 py-3 text-[13px] font-bold text-[#374151]">
              لغو عملیات ❌
            </button>
          </div>
          {stockOf(recipe.inputKey) < recipe.inputQty ? <p className="mt-2 text-center text-[11px] font-bold text-red-500">موجودی مادهٔ خام کافی نیست ({fa(stockOf(recipe.inputKey))} از {fa(recipe.inputQty)}).</p> : null}

          <div className="mt-4">
            <LightSectionTitle>بعد از تأیید چه اتفاقی می‌افتد؟</LightSectionTitle>
            <ol className="list-decimal space-y-1.5 pr-5 text-[11px] leading-6 text-[#374151]">
              <li>{inputDef?.nameFa} خام از انبار کم بشه.</li>
              <li>هزینه پالایش از خزانه کم بشه.</li>
              <li>تایمر {fa(recipe.minutes)} دقیقه‌ای شروع بشه.</li>
              <li>بعد از پایان، {fa(recipe.outputQty)} واحد محصول به انبار اضافه بشه.</li>
            </ol>
          </div>
          <div className="mt-3"><LightNote>پس از تکمیل عملیات، محصول به انبار کشور اضافه می‌شود.</LightNote></div>
        </>
      )}
    </LightShell>
  );
}
