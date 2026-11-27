import { useMemo, useState } from 'react';
import { api, idempotencyKey, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { useRouter } from '../../router';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Input, Loading, Modal, Row, Stat, Stepper, fa, faMoney } from '../../ui';
import { NAV_TITLES } from './meta';

interface CatalogItem {
  templateId: number;
  code: string;
  nameFa: string;
  unitFa: string;
  description: string;
  price: number | null;
  ownedQuantity: number;
  purchasable: boolean;
  disabledReason: string | null;
  purchaseLimitPerCycle: number | null;
  boughtThisCycle: number;
  remainingThisCycle: number | null;
  attackPoints: number | null;
  defensePoints: number | null;
  maintenancePerUnit: number | null;
}

/**
 * Marketplace.
 * The browser never decides a price: it only sends { templateId, quantity, idempotencyKey } and the backend
 * answers with the real cost, the new balance and the new stock. Everything below is a view of that answer.
 */
export function ShopPage({ params }: { params: { categoryKey?: string } }) {
  const { me, refresh } = useAuth();
  const { navigate } = useRouter();
  const cats = useApi<{ categories: any[]; enabled: boolean }>('/shop/categories');
  const active = params.categoryKey ?? cats.data?.categories?.[0]?.key ?? '';
  const items = useApi<{ category: any; items: CatalogItem[]; treasury: number }>(active ? `/shop/category/${active}` : null, [active]);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const treasury = Number(items.data?.treasury ?? me?.view?.economy?.treasury ?? 0);
  const list = useMemo(() => items.data?.items ?? [], [items.data]);
  const purchasableCount = list.filter((i) => i.purchasable).length;

  if (cats.data && cats.data.enabled === false) {
    return <ErrorBox message="فروشگاه توسط مدیران غیرفعال شده است. برای اطلاع از زمان بازگشایی به کانال بازی سر بزنید." />;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.marketplace}</h1>

      <Card>
        <Grid cols={3}>
          <Stat label="موجودی خزانه" value={faMoney(treasury)} tone={treasury > 0 ? 'ok' : 'bad'} />
          <Stat label="دسته‌های فعال" value={fa(cats.data?.categories?.length ?? 0)} />
          <Stat label="قابل خرید در این دسته" value={fa(purchasableCount)} />
        </Grid>
      </Card>

      {cats.loading ? <Loading /> : null}
      {cats.error ? <ErrorBox message={cats.error} onRetry={cats.reload} /> : null}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {(cats.data?.categories ?? []).map((c: any) => (
          <button key={c.key} className={`ww-tab ${active === c.key ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => navigate(`/app/shop/${c.key}`)}>
            {c.emoji} {c.shopLabelFa ?? c.labelFa}
            {c.purchasableCount === 0 ? <span className="mr-1 text-[10px] text-slate-500">بدون قیمت</span> : null}
          </button>
        ))}
      </div>

      {items.loading ? <Loading /> : null}
      {items.error ? <ErrorBox message={items.error} onRetry={items.reload} /> : null}

      {!items.loading && list.length === 0 ? <Empty text="این دسته هنوز آیتمی ندارد." /> : null}

      <div className="grid gap-2 sm:grid-cols-2">
        {list.map((it) => (
          <article key={it.templateId} className={`ww-card p-3 ${it.purchasable ? '' : 'opacity-70'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold">{it.nameFa}</h3>
                <p className="text-[11px] text-slate-500">{it.code} · هر واحد = {it.unitFa || 'عدد'}</p>
              </div>
              <span className="shrink-0 text-sm font-black text-gold-soft">{it.price === null ? <Badge tone="warn">بدون قیمت</Badge> : faMoney(it.price)}</span>
            </div>

            {it.description ? <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-400">{it.description}</p> : null}

            <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-400">
              {it.attackPoints !== null && it.attackPoints !== 0 ? <span className="rounded-full bg-white/5 px-2 py-0.5">⚔️ {fa(it.attackPoints)}</span> : null}
              {it.defensePoints !== null && it.defensePoints !== 0 ? <span className="rounded-full bg-white/5 px-2 py-0.5">🛡️ {fa(it.defensePoints)}</span> : null}
              {it.maintenancePerUnit ? <span className="rounded-full bg-white/5 px-2 py-0.5">🧱 نگهداری {fa(it.maintenancePerUnit)}</span> : null}
              <span className="rounded-full bg-white/5 px-2 py-0.5">📦 شما: {fa(it.ownedQuantity)}</span>
              {it.remainingThisCycle !== null ? (
                <span className="rounded-full bg-white/5 px-2 py-0.5">
                  سقف این دوره: {fa(it.remainingThisCycle)}
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              {it.purchasable ? (
                <Btn variant="primary" onClick={() => { setSelected(it); setQty(1); setError(null); setResult(null); }}>
                  خرید
                </Btn>
              ) : (
                <span className="text-[11px] text-danger">🚫 {it.disabledReason}</span>
              )}
              {it.purchasable && Number(it.price ?? 0) * 1 > treasury ? <span className="text-[11px] text-danger">خزانه کافی نیست</span> : null}
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={selected !== null}
        title={selected ? `خرید ${selected.nameFa}` : ''}
        onClose={() => setSelected(null)}
        footer={
          result ? (
            <Btn variant="primary" onClick={() => { setSelected(null); setResult(null); void refresh(); void items.reload(); }}>
              بستن و به‌روزرسانی
            </Btn>
          ) : (
            <>
              <Btn onClick={() => setSelected(null)}>انصراف</Btn>
              <Btn
                variant="primary"
                loading={busy}
                onClick={async () => {
                  if (!selected) return;
                  setBusy(true);
                  setError(null);
                  try {
                    const res = await api.post('/shop/purchase', {
                      templateId: selected.templateId,
                      quantity: qty,
                      idempotencyKey: idempotencyKey('web'),
                    });
                    setResult(res);
                  } catch (e) {
                    setError((e as ApiError).message ?? 'خرید ناموفق بود');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                پرداخت نهایی
              </Btn>
            </>
          )
        }
      >
        {selected && !result ? (
          <div className="space-y-3">
            <p className="text-xs leading-6 text-slate-400">
              قیمت واحد و موجودی از سرور خوانده می‌شود. اگر این خرید تکراری باشد، کلید idempotency باعث می‌شود مبلغ دوباره کسر نشود.
            </p>
            <Field label="تعداد" />
            <Stepper value={qty} onChange={setQty} min={1} step={1} presets={[1, 5, 10, 25]} />
            {selected.remainingThisCycle !== null ? (
              <p className="text-[11px] text-slate-500">سقف این دوره: {fa(selected.remainingThisCycle)} — بیشتر از این مقدار سرور اجازه نمی‌دهد.</p>
            ) : null}
            <Grid cols={2}>
              <Stat label="مبلغ کل (تخمین)" value={faMoney(Number(selected.price ?? 0) * qty)} />
              <Stat label="مانده بعد از خرید" value={faMoney(treasury - Number(selected.price ?? 0) * qty)} tone={treasury - Number(selected.price ?? 0) >= 0 ? 'ok' : 'bad'} />
            </Grid>
            {error ? <p className="rounded-xl border border-danger/40 bg-danger/10 p-2 text-xs text-danger">{error}</p> : null}
          </div>
        ) : null}

        {result ? (
          <div className="space-y-2 text-xs">
            <div className="rounded-xl border border-ok/40 bg-ok/10 p-2 text-ok">
              {result.duplicate ? '♻️ این درخواست قبلاً ثبت شده بود؛ مبلغ دوباره کسر نشد.' : '✅ خرید با موفقیت ثبت شد.'}
            </div>
            <Grid cols={2}>
              <Stat label="تعداد" value={fa(result.quantity)} />
              <Stat label="قیمت واحد" value={faMoney(result.unitPrice)} />
              <Stat label="مبلغ کل" value={faMoney(result.totalCost)} tone="bad" />
              <Stat label="موجودی جدید" value={fa(result.newQuantity)} tone="ok" />
              <Stat label="خزانه قبل" value={faMoney(result.treasuryBefore)} />
              <Stat label="خزانه بعد" value={faMoney(result.treasuryAfter)} />
            </Grid>
            {result.maintenanceImpact ? <p className="text-[11px] text-slate-400">هزینه نگهداری افزوده‌شده به هر دوره: {faMoney(result.maintenanceImpact)}</p> : null}
            <p className="text-[11px] text-slate-500">شناسه تراکنش: {result.transactionUuid} (قابل پیگیری در دفتر مالی)</p>
            <Row>
              <span className="text-[11px] text-slate-400">برای دیدن ردیف تراکنش：</span>
              <Btn onClick={() => navigate('/app/player/economy')}>دفتر مالی</Btn>
            </Row>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

/* a tiny local Field so the modal does not depend on label markup elsewhere */
function Field({ label }: { label: string }) {
  return <p className="ww-label !mb-0 text-slate-300">{label}</p>;
}

export function ShopSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="نام یا کد…" />;
}
