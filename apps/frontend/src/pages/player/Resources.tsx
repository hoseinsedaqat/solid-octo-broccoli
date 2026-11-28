import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { useRouter } from '../../router';
import { fa, faMoney, useToast, Loading, ErrorBox } from '../../ui';
import { LightBlackButton, LightBullet, LightCard, LightBackButton, LightGreenButton, LightNote, LightSectionTitle, LightShell } from '../../components/Light';

export interface ResourceRow {
  key: string;
  emoji: string;
  nameFa: string;
  unitFa: string;
  market: number;
  extractCost: number;
  capacity: number;
  wells: number;
  reserves: number;
  stock: number;
}
export interface ProductsRow { key: string; emoji: string; nameFa: string; unitFa: string; stock: number }
export interface ResourcesState {
  treasury: number;
  resources: ResourceRow[];
  products: ProductsRow[];
  refineryOps: { id: number; recipeKey: string; inputKey: string; inputQty: number; outputKey: string; outputQty: number; cost: number; completesInSeconds: number }[];
  tradeTotals: { exportTotal: number; importTotal: number; exportCount: number; importCount: number };
  budgets: { key: string; emoji: string; nameFa: string; amount: number }[];
  market: { key: string; emoji: string; nameFa: string; unitFa: string; price: number }[];
}
export const useResources = () => useApi<ResourcesState>('/player/resources');

const resourceMeta = (key: string) => {
  const m: Record<string, { reserveLabel: string }> = {
    oil: { reserveLabel: 'ذخایر نفت' },
    gas: { reserveLabel: 'ذخایر گاز' },
    iron: { reserveLabel: 'ذخایر آهن' },
    gold: { reserveLabel: 'ذخایر طلا' },
    uranium: { reserveLabel: 'ذخایر اورانیوم' },
    diamond: { reserveLabel: 'ذخایر الماس' },
  };
  return m[key] ?? { reserveLabel: 'ذخایر' };
};

/* ------------------------------- 🛢️ منابع کشور ------------------------------ */

export function ResourcesPage() {
  const { navigate } = useRouter();
  const res = useResources();
  const data = res.data;

  return (
    <LightShell title="منابع کشور" emoji="🛢️">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">وضعیت منابع طبیعی و ذخایر کشور</p>
      {res.loading ? <Loading label="در حال دریافت منابع…" /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}

      {data ? (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            {[...data.resources].sort((a, b) => ['oil', 'gas', 'gold', 'iron', 'diamond', 'uranium'].indexOf(a.key) - ['oil', 'gas', 'gold', 'iron', 'diamond', 'uranium'].indexOf(b.key)).map((r) => (
              <div key={r.key} className="flex flex-col items-center gap-1.5 rounded-2xl border border-black/5 bg-white p-3 text-center shadow-sm">
                <span className="text-3xl leading-none">{r.emoji}</span>
                <span className="text-[12px] font-extrabold text-[#111827]">{r.nameFa}</span>
                <span className="text-[10px] tabular-nums text-[#6b7280]">
                  {fa(r.reserves)} {r.unitFa}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <LightSectionTitle>امکانات منابع</LightSectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <LightBlackButton onClick={() => navigate('/app/resources/extract')}>⛏️ استخراج منابع</LightBlackButton>
              <LightBlackButton onClick={() => navigate('/app/resources/refine')}>🏭 پالایش منابع</LightBlackButton>
              <LightBlackButton onClick={() => navigate('/app/resources/sell')}>🚢 فروش منابع</LightBlackButton>
              <LightBlackButton onClick={() => navigate('/app/resources/warehouse')}>📦 انبار منابع</LightBlackButton>
            </div>
          </div>
          <div className="mt-3">
            <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
          </div>
        </>
      ) : null}
    </LightShell>
  );
}

/* ------------------------------ ⛏️ مرکز استخراج ------------------------------ */

export function ExtractListPage() {
  const { navigate } = useRouter();
  const res = useResources();
  return (
    <LightShell title="مرکز استخراج منابع" emoji="⛏️">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">منبع موردنظر برای استخراج را انتخاب کنید.</p>
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {res.data ? (
        <div className="space-y-2.5">
          {res.data.resources.map((r) => (
            <button
              key={r.key}
              onClick={() => navigate(`/app/resources/extract/${r.key}`)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-5 text-[14px] font-extrabold text-[#111827] shadow-sm transition active:scale-[0.98]"
            >
              <span className="text-lg">{r.emoji}</span> استخراج {r.nameFa}
            </button>
          ))}
          <LightBackButton label="بازگشت" to="/app/resources" />
        </div>
      ) : null}
    </LightShell>
  );
}

export function ExtractDetailPage({ resourceKey }: { resourceKey: string }) {
  const toast = useToast();
  const { navigate } = useRouter();
  const res = useResources();
  const [busy, setBusy] = useState<number | 'max' | null>(null);
  const r = res.data?.resources.find((x) => x.key === resourceKey);

  async function doExtract(amount: number | 'max') {
    if (!r) return;
    const qty = amount === 'max' ? Math.min(r.capacity, r.reserves) : amount;
    if (qty <= 0) {
      toast('ذخایر یا موجودی کافی نیست.', 'err');
      return;
    }
    setBusy(amount);
    try {
      await api.post(`/player/resources/${r.key}/extract`, { amount: qty });
      toast(`⛏️ ${fa(qty)} ${r.unitFa} ${r.nameFa} استخراج شد.`, 'ok');
      await res.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در استخراج', 'err');
    } finally {
      setBusy(null);
    }
  }

  const title = r ? ({ oil: 'وضعیت میدان نفتی', gas: 'اطلاعات میدان گازی' } as Record<string, string>)[r.key] ?? `اطلاعات میدان ${r.nameFa}` : 'میدان استخراج';

  return (
    <LightShell title={title} emoji="📊">
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {r ? (
        <>
          <LightCard>
            <LightBullet emoji="🛢️" label={`${resourceMeta(r.key).reserveLabel}`} value={`${fa(r.reserves)} ${r.unitFa}`} />
            <LightBullet emoji="⚙️" label="ظرفیت استخراج" value={`${fa(r.capacity)} ${r.unitFa} در هر عملیات`} />
            <LightBullet emoji="🕳️" label="چاه‌های فعال" value={`${fa(r.wells)} حلقه`} />
            <LightBullet emoji="💰" label="هزینه هر عملیات" value={`${fa(r.extractCost)} سکه`} />
            <LightBullet emoji="📦" label="موجودی انبار" value={`${fa(r.stock)} ${r.unitFa}`} />
          </LightCard>

          <div className="mt-4">
            <LightSectionTitle>انتخاب مقدار استخراج ⚙️</LightSectionTitle>
            <div className="space-y-2">
              {[2_000, 5_000, 10_000].map((n) => {
                const allowed = n <= Math.min(r.capacity, r.reserves);
                return (
                  <LightBlackButton key={n} disabled={!allowed} loading={busy === n} onClick={() => void doExtract(n)}>
                    {r.emoji} استخراج {fa(n)} {r.unitFa}
                  </LightBlackButton>
                );
              })}
              <LightBlackButton loading={busy === 'max'} onClick={() => void doExtract('max')}>
                {r.emoji} استخراج حداکثر ظرفیت
              </LightBlackButton>
            </div>
          </div>
          <div className="mt-3">
            <LightBackButton label="بازگشت به منابع کشور" to="/app/resources" />
          </div>
          <div className="mt-2"><LightNote>اعداد نمونه نیستند — از پایگاه دادهٔ بازی خوانده می‌شوند.</LightNote></div>
        </>
      ) : null}
    </LightShell>
  );
}

/* ------------------------------- 📦 انبار منابع ------------------------------ */

export function WarehousePage() {
  const res = useResources();
  const data = res.data;
  const all = [...(data?.resources ?? []), ...(data?.products ?? [])];
  return (
    <LightShell title="انبار منابع" emoji="📦">
      <LightCard>
        <div className="mb-2 flex items-center justify-between border-b border-black/5 pb-2">
          <h2 className="text-[13px] font-extrabold text-[#111827]">📦 انبار مرکزی کشور</h2>
          <span className="text-[10px] text-[#6b7280]">موجودی تمام منابع کشور</span>
        </div>
        <div className="flex items-center justify-between border-b border-black/10 pb-2 text-[11px] font-extrabold text-[#374151]">
          <span>منبع</span>
          <span>موجودی</span>
        </div>
        {res.loading ? <Loading /> : null}
        {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
        {all.map((r: any) => (
          <div key={r.key} className="flex items-center justify-between border-b border-black/5 py-2.5 last:border-0">
            <span className="flex items-center gap-2 text-[12px] font-bold text-[#111827]">
              <span className="text-base">{r.emoji}</span> {r.nameFa}
            </span>
            <span className="text-[12px] font-extrabold tabular-nums text-[#111827]">{fa(r.stock)}</span>
          </div>
        ))}
      </LightCard>
      <div className="mt-3">
        <LightBackButton label="بازگشت" to="/app/resources" />
      </div>
      <div className="mt-2"><LightNote>موجودی‌ها بر اساس دادهٔ واقعی کشور شماست.</LightNote></div>
    </LightShell>
  );
}

/* ------------------------------- 📊 بازار جهانی منابع ------------------------------ */

export function MarketPage() {
  const res = useResources();
  const [view, setView] = useState<'prices' | 'changes'>('prices');
  const [flash, setFlash] = useState<string | null>(null);
  return (
    <LightShell title="بازار جهانی منابع" emoji="💹">
      <LightCard>
        <p className="mb-2 text-[11px] text-[#6b7280]">قیمت‌های بازار جهانی ({view === 'prices' ? 'نمایش قیمت‌ها' : 'تغییرات بازار'})</p>
        {view === 'prices' ? (
          <>
            <div className="flex items-center justify-between border-b border-black/10 pb-2 text-[11px] font-extrabold text-[#374151]">
              <span>منبع</span>
              <span>قیمت واحد</span>
            </div>
            {res.loading ? <Loading /> : null}
            {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
            {(res.data?.market ?? []).map((m) => (
              <div key={m.key} className="flex items-center justify-between border-b border-black/5 py-2.5 last:border-0">
                <span className="flex items-center gap-2 text-[12px] font-bold text-[#111827]">
                  <span className="text-base">{m.emoji}</span> {m.nameFa}
                  <span className="text-[10px] font-normal text-[#9ca3af]">(هر {m.unitFa})</span>
                </span>
                <button onClick={() => setFlash(`${m.nameFa}: ${fa(m.price)} سکه`)} className="rounded-lg px-2 py-1 text-[12px] font-extrabold tabular-nums text-[#111827] transition hover:bg-black/5">
                  {fa(m.price)} سکه
                </button>
              </div>
            ))}
            {flash ? <p className="mt-2 rounded-xl bg-[#f0fdf4] px-3 py-2 text-center text-[11px] font-bold text-[#15803d]">{flash}</p> : null}
          </>
        ) : (
          <div className="space-y-2 py-2 text-[11px] leading-7 text-[#374151]">
            <p className="rounded-2xl bg-[#f8f9fb] p-3">قیمت‌های بازار در این نسخه توسط مدیر بازی تنظیم می‌شوند و برای همهٔ بازیکنان یکسان و یکسان‌نگر هستند.</p>
            <p className="rounded-2xl bg-[#f8f9fb] p-3">این قیمت‌ها همان مبنای «خرید»، «فروش» و «قراردادهای تجاری» هستند؛ هیچ بازیکن یا گروهی نمی‌تواند آن‌ها را جابه‌جا کند.</p>
            <p className="rounded-2xl bg-[#f8f9fb] p-3">تغییر قیمت‌ها فقط با بروزرسانی بازی اعمال می‌شود و در همهٔ صفحات بلافاصله بازتاب پیدا می‌کند.</p>
          </div>
        )}
      </LightCard>

      <div className="mt-3 space-y-2">
        <button onClick={() => setView('prices')} className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[13px] font-bold transition active:scale-[0.98] ${view === 'prices' ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}>📊 مشاهده قیمت‌ها</button>
        <button onClick={() => setView('changes')} className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[13px] font-bold transition active:scale-[0.98] ${view === 'changes' ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}>📈 تغییرات بازار</button>
      </div>
      <div className="mt-2">
        <LightBackButton label="بازگشت" to="/app/economy-hub" />
      </div>
    </LightShell>
  );
}

/* ------------------------------- 🚢 فروش منابع ------------------------------ */

/** «بازار فروش منابع» — ردیف‌ها به صفحهٔ انتخاب مقدار می‌روند؛ دکمهٔ سبز کل موجودی را یک‌جا می‌فروشد */
export function SellPage() {
  const toast = useToast();
  const { navigate } = useRouter();
  const res = useResources();
  const [busy, setBusy] = useState(false);
  const data = res.data;
  const totalValue = (data?.resources ?? []).reduce((n, r) => n + Math.floor(r.stock * r.market), 0);

  async function sellAll() {
    if (!data) return;
    const withStock = data.resources.filter((r) => r.stock > 0);
    if (withStock.length === 0) {
      toast('موجودی انبار خالی است.', 'err');
      return;
    }
    setBusy(true);
    try {
      let earned = 0;
      for (const r of withStock) {
        const out = await api.post<{ total: number }>(`/player/resources/${r.key}/sell`, { amount: r.stock });
        earned += out.total;
      }
      toast(`✅ تمام موجودی فروخته شد — ${fa(earned)} سکه به خزانه اضافه شد.`, 'ok');
      await res.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در فروش', 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <LightShell title="بازار فروش منابع" emoji="🚢">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">منابع خود را بفروش و سکه دریافت کن.</p>
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {data ? (
        <>
          <LightCard className="space-y-2">
            {data.resources.map((r) => (
              <button
                key={r.key}
                onClick={() => navigate(`/app/resources/sell/${r.key}`)}
                className="flex w-full items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-4 text-right transition active:scale-[0.98]"
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-extrabold text-[#111827]">{r.nameFa}</span>
                  <span className="mt-0.5 block text-[11px] text-[#6b7280]">انتخاب مقدار برای فروش</span>
                </span>
                <span className="text-[#9ca3af]">⬇</span>
              </button>
            ))}
          </LightCard>
          <div className="mt-3">
            <LightGreenButton loading={busy} disabled={totalValue <= 0} onClick={() => void sellAll()}>
              💰 فروش تمام موجودی منابع {totalValue > 0 ? `| ${fa(totalValue)} سکه` : ''}
            </LightGreenButton>
          </div>
          <div className="mt-2">
            <LightBackButton label="بازگشت" to="/app/resources" />
          </div>
        </>
      ) : null}
    </LightShell>
  );
}

export function SellDetailPage({ resourceKey }: { resourceKey: string }) {
  const toast = useToast();
  const res = useResources();
  const [busy, setBusy] = useState<number | 'all' | null>(null);
  const r = res.data?.resources.find((x) => x.key === resourceKey);

  async function sell(amount: number | 'all') {
    if (!r) return;
    const qty = amount === 'all' ? r.stock : Math.min(amount, r.stock);
    if (qty <= 0) {
      toast('موجودی کافی نیست.', 'err');
      return;
    }
    setBusy(amount);
    try {
      const out = await api.post<{ total: number; treasury: number }>(`/player/resources/${r.key}/sell`, { amount: qty });
      toast(`✅ ${fa(qty)} ${r.unitFa} ${r.nameFa} فروخته شد — ${fa(out.total)} سکه دریافت شد.`, 'ok');
      await res.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در فروش', 'err');
    } finally {
      setBusy(null);
    }
  }

  const value = r ? Math.floor(r.stock * r.market) : 0;
  const options = r && r.stock < 1_000 ? [100, 200, 500] : [1_000, 5_000, 10_000];

  return (
    <LightShell title={`بازار ${r?.nameFa ?? ''} کشور`} emoji="🛢️">
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {r ? (
        <>
          <LightCard>
            <LightBullet emoji="📦" label="موجودی" value={`${fa(r.stock)} ${r.unitFa}`} />
            <LightBullet emoji="🏷️" label={`قیمت هر ${r.unitFa}`} value={`${fa(r.market)} سکه`} />
            <LightBullet emoji="🏦" label="ارزش کل موجودی" value={`${fa(value)} سکه`} />
          </LightCard>

          <div className="mt-4">
            <LightSectionTitle>انتخاب مقدار فروش 💰</LightSectionTitle>
            <div className="space-y-2">
              {options.map((n) => (
                <LightBlackButton key={n} disabled={r.stock < n} loading={busy === n} onClick={() => void sell(n)}>
                  فروش {fa(n)} {r.unitFa} | {fa(n * r.market)} سکه
                </LightBlackButton>
              ))}
              <LightBlackButton loading={busy === 'all'} onClick={() => void sell('all')}>
                فروش تمام موجودی | {fa(value)} سکه
              </LightBlackButton>
            </div>
          </div>

          <div className="mt-3">
            <LightBackButton label="بازگشت به بازار فروش" to="/app/resources/sell" />
          </div>
          <div className="mt-2"><LightNote>قیمت‌ها از «قیمت‌های بازار منابع» خوانده می‌شوند و قابل‌تغییر توسط بازیکن نیستند.</LightNote></div>
        </>
      ) : null}
    </LightShell>
  );
}
