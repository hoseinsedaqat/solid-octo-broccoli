import { useMemo, useState } from 'react';
import { useAuth, useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { useRouter } from '../../router';
import { fa, useToast, Loading, ErrorBox } from '../../ui';
import { LightBackButton, LightBullet, LightCard, LightGreenButton, LightNote, LightSectionTitle, LightShell } from '../../components/Light';
import { RESOURCES, TRADE_PARTNERS, IMPORT_SHIPPING_FEE } from '@ww/shared';
import { useResources } from './Resources';

const resourceByKey = (key: string) => RESOURCES.find((r) => r.key === key);
const partnerByKey = (key: string | null) => TRADE_PARTNERS.find((p) => p.key === key) ?? null;

/** pressets sized for normal reserves; they scale down automatically for scarce resources */
function amountPresets(stock: number): number[] {
  if (stock <= 0) return [100];
  if (stock <= 5_000) return [100, Math.min(500, stock), Math.min(1_000, stock)].filter((v, i, a) => v > 0 && a.indexOf(v) === i);
  return [1_000, 5_000, 10_000];
}

/* ------------------------------ صادرات منابع (hub) ------------------------------ */

export function ExportHubPage() {
  const { navigate } = useRouter();
  const res = useResources();
  return (
    <LightShell title="مرکز صادرات کشور" emoji="🚢">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">منبع موردنظر برای صادرات را انتخاب کنید.</p>
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {res.data ? (
        <div className="space-y-2">
          {res.data.resources.map((r) => (
            <button
              key={r.key}
              onClick={() => navigate(`/app/trade/export/${r.key}`)}
              className="flex w-full items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-4 text-[13px] font-extrabold text-[#111827] shadow-sm transition active:scale-[0.98]"
            >
              <span className="text-xl">{r.emoji}</span> صادرات {r.nameFa}
            </button>
          ))}
          <LightBackButton label="بازگشت به تجارت خارجی" to="/app/economy/foreign-trade" />
          <LightNote>بعد از انتخاب منبع: موجودی انبار نمایش داده شود، مقدار صادرات انتخاب شود، کشور مقصد انتخاب شود و مبلغ دریافتی مشخص شود.</LightNote>
        </div>
      ) : null}
    </LightShell>
  );
}

export function ImportHubPage() {
  const { navigate } = useRouter();
  const res = useResources();
  return (
    <LightShell title="مرکز واردات کشور" emoji="🚢">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">منابع موردنیاز خود را از کشورهای دیگر خریداری کنید.</p>
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {res.data ? (
        <div className="space-y-2">
          {res.data.resources.map((r) => (
            <button
              key={r.key}
              onClick={() => navigate(`/app/trade/import/${r.key}`)}
              className="flex w-full items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-4 text-[13px] font-extrabold text-[#111827] shadow-sm transition active:scale-[0.98]"
            >
              <span className="text-xl">{r.emoji}</span> واردات {r.nameFa}
            </button>
          ))}
          <LightBackButton label="بازگشت به تجارت خارجی" to="/app/economy/foreign-trade" />
          <LightNote>بعد از انتخاب منبع: کشور فروشنده انتخاب شود، مقدار خرید مشخص شود، قیمت کل و هزینه حمل نمایش داده شود و پس از تأیید و پرداخت، منابع وارد انبار شوند.</LightNote>
        </div>
      ) : null}
    </LightShell>
  );
}

/* --------------------------- جزئیات صادرات (یک منبع) --------------------------- */

export function ExportDetailPage({ resourceKey }: { resourceKey: string }) {
  const toast = useToast();
  const { me } = useAuth();
  const { navigate } = useRouter();
  const res = useResources();
  const [qty, setQty] = useState<number | null>(null);
  const [partner, setPartner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const def = resourceByKey(resourceKey);
  const r = res.data?.resources.find((x) => x.key === resourceKey);

  const presets = r ? amountPresets(r.stock) : [1_000];
  const amount = qty ?? 0;
  const total = Math.floor(amount * (def?.market ?? 0));
  const nationName = me?.view?.nation?.name ?? 'ایران';

  async function confirm() {
    if (!def || !r) return;
    if (amount <= 0) {
      toast('مقدار صادرات را انتخاب کنید.', 'err');
      return;
    }
    if (!partner) {
      toast('کشور خریدار را انتخاب کنید.', 'err');
      return;
    }
    if (r.stock < amount) {
      toast('موجودی انبار کافی نیست.', 'err');
      return;
    }
    setBusy(true);
    try {
      const out = await api.post<{ total: number }>('/player/trade/export', { resourceKey: def.key, quantity: amount, partnerKey: partner });
      toast(`✅ صادرات تأیید شد — ${fa(out.total)} سکه دریافت شد.`, 'ok');
      navigate('/app/economy/foreign-trade');
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در صادرات', 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <LightShell title={`مرکز صادرات ${def?.nameFa ?? ''}`} emoji="🚢">
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {r && def ? (
        <>
          <LightCard>
            <p className="text-[12px] font-bold text-[#374151]">کشور: <b className="text-[#111827]">{nationName}</b></p>
            <div className="my-2 border-t border-black/5" />
            <LightBullet emoji="📦" label={`موجودی ${def.nameFa}`} value={`${fa(r.stock)} ${def.unitFa}`} />
            <LightBullet emoji="🏷️" label={`قیمت هر ${def.unitFa}`} value={`${fa(def.market)} سکه`} />
          </LightCard>

          <div className="mt-4">
            <LightSectionTitle>مقدار {def.nameFa} برای صادرات را انتخاب کنید ⚙️</LightSectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((n) => (
                <button
                  key={n}
                  onClick={() => setQty(n)}
                  className={`rounded-2xl px-3 py-3 text-[12px] font-bold transition active:scale-[0.98] ${qty === n ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
                >
                  {fa(n)} {def.unitFa}
                </button>
              ))}
              <button
                onClick={() => setQty(r.stock)}
                className={`rounded-2xl px-3 py-3 text-[12px] font-bold transition active:scale-[0.98] ${qty === r.stock ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
              >
                همه موجودی
              </button>
            </div>
          </div>

          <div className="mt-4">
            <LightSectionTitle>انتخاب کشور خریدار 🌍</LightSectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {TRADE_PARTNERS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPartner(p.key)}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-bold transition active:scale-[0.98] ${partner === p.key ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
                >
                  {p.flag} {p.nameFa}
                </button>
              ))}
            </div>
          </div>

          <LightCard className="mt-4 text-[11px] leading-7 text-[#374151]">
            <div className="mb-1 text-[10px] font-extrabold text-[#16a34a]">مثال معامله</div>
            <div>مقدار: {fa(amount || 1_000)} {def.unitFa}</div>
            <div>مبلغ دریافتی: {fa(Math.floor((amount || 1_000) * def.market))} سکه</div>
            {partner ? <div className="mt-1 border-t border-black/5 pt-1">خریدار: {partnerByKey(partner)?.flag} {partnerByKey(partner)?.nameFa}</div> : null}
          </LightCard>

          <div className="mt-3">
            <LightGreenButton loading={busy} disabled={amount <= 0 || !partner} onClick={() => void confirm()}>
              ✅ تأیید صادرات {amount > 0 ? `— ${fa(total)} سکه` : ''}
            </LightGreenButton>
          </div>
          <div className="mt-2">
            <LightBackButton label="بازگشت" to="/app/trade/export" />
          </div>
        </>
      ) : null}
    </LightShell>
  );
}

/* --------------------------- جزئیات واردات (یک منبع) --------------------------- */

export function ImportDetailPage({ resourceKey }: { resourceKey: string }) {
  const toast = useToast();
  const { navigate } = useRouter();
  const res = useResources();
  const [qty, setQty] = useState<number | null>(null);
  const [partner, setPartner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const def = resourceByKey(resourceKey);
  const r = res.data?.resources.find((x) => x.key === resourceKey);

  const treasury = res.data?.treasury ?? 0;
  const presets = [1_000, 5_000, 10_000, 20_000];
  const amount = qty ?? 0;
  const goods = Math.floor(amount * (def?.market ?? 0));
  const total = goods + IMPORT_SHIPPING_FEE;
  const selectedPartner = partnerByKey(partner);

  async function confirm() {
    if (!def) return;
    if (!partner) {
      toast('کشور فروشنده را انتخاب کنید.', 'err');
      return;
    }
    if (amount <= 0) {
      toast('مقدار خرید را انتخاب کنید.', 'err');
      return;
    }
    setBusy(true);
    try {
      const out = await api.post<{ total: number }>('/player/trade/import', { resourceKey: def.key, quantity: amount, partnerKey: partner });
      toast(`✅ خرید ${def.nameFa} تأیید شد — ${fa(out.total)} سکه پرداخت شد.`, 'ok');
      navigate('/app/economy/foreign-trade');
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در خرید', 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <LightShell title={`مرکز واردات ${def?.nameFa ?? ''}`} emoji="📥">
      {res.loading ? <Loading /> : null}
      {res.error ? <ErrorBox message={res.error} onRetry={res.reload} /> : null}
      {def ? (
        <>
          <LightCard>
            <LightBullet emoji="📦" label={`موجودی فعلی ${def.nameFa}`} value={`${fa(r?.stock ?? 0)} ${def.unitFa}`} />
            <LightBullet emoji="🏷️" label={`قیمت هر ${def.unitFa}`} value={`${fa(def.market)} سکه`} />
            <LightBullet emoji="🚚" label="هزینه حمل" value={`${fa(IMPORT_SHIPPING_FEE)} سکه`} />
            <LightBullet emoji="🏦" label="موجودی خزانه" value={`${fa(treasury)} سکه`} />
          </LightCard>

          <div className="mt-4">
            <LightSectionTitle>کشور فروشنده را انتخاب کنید 🌍</LightSectionTitle>
            <div className="space-y-2">
              {TRADE_PARTNERS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPartner(p.key)}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-3.5 text-[13px] font-bold transition active:scale-[0.98] ${partner === p.key ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
                >
                  {p.flag} {p.nameFa}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <LightSectionTitle>مقدار {def.nameFa} موردنیاز را انتخاب کن ⚙️</LightSectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((n) => (
                <button
                  key={n}
                  onClick={() => setQty(n)}
                  className={`rounded-2xl px-3 py-3 text-[12px] font-bold transition active:scale-[0.98] ${qty === n ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
                >
                  {fa(n)} {def.unitFa}
                </button>
              ))}
            </div>
          </div>

          <LightCard className="mt-4 text-[12px] leading-8 text-[#374151]">
            <div className="mb-1 text-[10px] font-extrabold text-[#16a34a]">مثال معامله</div>
            <div>مقدار خرید: {fa(amount || 5_000)} {def.unitFa}</div>
            <div>قیمت خرید: {fa(Math.floor((amount || 5_000) * def.market))} سکه</div>
            <div>هزینه حمل: {fa(IMPORT_SHIPPING_FEE)} سکه</div>
            <div className="font-extrabold text-[#111827]">مبلغ نهایی: {fa(Math.floor((amount || 5_000) * def.market) + IMPORT_SHIPPING_FEE)} سکه</div>
            {selectedPartner ? <div className="mt-1 border-t border-black/5 pt-1 text-[11px]">فروشنده: {selectedPartner.flag} {selectedPartner.nameFa}</div> : null}
          </LightCard>

          <div className="mt-3">
            <LightGreenButton loading={busy} disabled={amount <= 0 || !partner || treasury < total} onClick={() => void confirm()}>
              ✅ تأیید خرید {def.nameFa} {amount > 0 ? `— ${fa(total)} سکه` : ''}
            </LightGreenButton>
          </div>
          {amount > 0 && treasury < total ? <p className="mt-2 text-center text-[11px] font-bold text-red-500">موجودی خزانه برای این خرید کافی نیست.</p> : null}
          <div className="mt-2">
            <LightBackButton label="بازگشت" to="/app/trade/import" />
          </div>
        </>
      ) : null}
    </LightShell>
  );
}

/* ------------------------------ گزارش تجارت خارجی ------------------------------ */

export function TradeHistoryList() {
  const history = useApi<{ rows: { id: number; kindLabelFa: string; resourceKey: string; partnerLabelFa: string; partnerFlag: string; quantity: number; total: number; createdAt: string }[] }>('/player/trade/history?limit=20');
  if (history.loading) return <Loading />;
  if (history.error) return <ErrorBox message={history.error} onRetry={history.reload} />;
  if (!history.data?.rows.length) return <p className="py-6 text-center text-[11px] text-[#9ca3af]">هنوز معامله‌ای ثبت نشده است.</p>;
  return (
    <div className="divide-y divide-black/5">
      {history.data.rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-2 py-2 text-[11px]">
          <span className="min-w-0">
            <span className="block font-extrabold text-[#111827]">{row.kindLabelFa} {row.partnerFlag} {row.partnerLabelFa}</span>
            <span className="block tabular-nums text-[#6b7280]">{fa(row.quantity)} واحد · {row.createdAt.slice(0, 10)}</span>
          </span>
          <b className="shrink-0 tabular-nums text-[#111827]">{fa(row.total)} سکه</b>
        </div>
      ))}
    </div>
  );
}
