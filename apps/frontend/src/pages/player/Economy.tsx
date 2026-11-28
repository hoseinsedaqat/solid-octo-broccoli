import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApi } from '../../auth';
import { useRouter } from '../../router';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Stat, Tabs, fa, faDateTime, faDuration, faMoney } from '../../ui';
import { ECONOMY_NOTE, NAV_TITLES, TX_TONES } from './meta';

export function EconomyPage() {
  const [tab, setTab] = useState<'chart' | 'ledger'>('chart');
  const eco = useApi<{
    economy: Record<string, number>;
    history: { day: string; treasury: number; income: number; power: number; equipment: number }[];
  }>('/player/economy');
  const econ = (eco.data?.economy ?? {}) as Record<string, number>;

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.economy}</h1>

      <Card>
        <Grid cols={4}>
          <Stat label="خزانه" value={faMoney(econ.treasury)} />
          <Stat label="ناخالص دوره" value={faMoney(econ.grossIncome)} tone="ok" />
          <Stat label="خالص دوره" value={faMoney(econ.netIncome)} tone="ok" />
          <Stat label="مالیات دوره" value={faMoney(econ.taxCost)} tone="warn" />
        </Grid>
        <div className="mt-2">
          <Grid cols={4}>
            <Stat label="ذخیره کارخانه" value={faMoney(econ.factoryIncome)} />
            <Stat label="ذخیره معدن" value={faMoney(econ.mineIncome)} />
            <Stat label="نگهداری" value={faMoney(econ.maintenanceCost)} tone="warn" />
            <Stat label="زیان جنگ" value={faMoney(econ.totalWarLosses)} tone="bad" />
          </Grid>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
          <span>مجموع درآمد: {faMoney(econ.totalIncome)}</span>
          <span>مجموع خرج: {faMoney(econ.totalSpent)}</span>
          <span>مجموع مالیات: {faMoney(econ.totalTax)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-400">
          <span>طول چرخه: {faDuration(econ.cycleSeconds)}</span>
          <span>پرداخت بعدی: {faDuration(econ.nextIncomeIn)}</span>
          <span>آخرین پرداخت: {faDateTime(econ.lastIncomeAt ? new Date(Number(econ.lastIncomeAt) * 1000).toISOString() : null)}</span>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">{ECONOMY_NOTE}</p>
      </Card>

      <MilitaryAssets />
      <LatestTransactions />

      <Tabs items={[{ key: 'chart', label: '📈 نمودار' }, { key: 'ledger', label: '🧾 دفتر مالی' }]} value={tab} onChange={setTab} />

      {tab === 'chart' ? (
        <Card title="تاریخچه (snapshot روزانه از nation_stat_history)" emoji="📊">
          {eco.loading ? <Loading /> : null}
          {eco.error ? <ErrorBox message={eco.error} onRetry={eco.reload} /> : null}
          {eco.data?.history?.length ? (
            <div className="space-y-4">
              <TreasuryChart history={eco.data.history} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Stat label="بیشترین خزانه" value={faMoney(Math.max(...eco.data.history.map((h) => Number(h.treasury))))} tone="ok" />
                <Stat label="کمترین خزانه" value={faMoney(Math.min(...eco.data.history.map((h) => Number(h.treasury))))} tone="warn" />
              </div>
              <PowerChart history={eco.data.history} />
            </div>
          ) : (
            <Empty text="هنوز snapshot روزانه‌ای ثبت نشده؛ بعد از اولین اجرای کران این نمودار پر می‌شود." />
          )}
        </Card>
      ) : (
        <Ledger />
      )}
    </div>
  );
}

export function TreasuryChart({ history }: { history: { day: string; treasury: number }[] }) {
  const data = history.map((h) => ({ label: String(h.day).slice(5), treasury: Number(h.treasury) }));
  return (
    <div dir="ltr" className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e4b642" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#e4b642" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ffffff14" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#8f9bb3', fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#8f9bb3', fontSize: 10 }} tickFormatter={(v: number) => compact(v)} width={46} />
          <Tooltip
            contentStyle={{ background: '#0e1526', border: '1px solid #ffffff1f', borderRadius: 12, fontSize: 12, direction: 'rtl' }}
            formatter={(v: any) => [faMoney(Number(v)), 'خزانه']}
            labelFormatter={(l: any) => `روز ${l}`}
          />
          <Area type="monotone" dataKey="treasury" stroke="#e4b642" strokeWidth={2} fill="url(#goldFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PowerChart({ history }: { history: { day: string; power?: number; income?: number; equipment?: number }[] }) {
  const data = history.map((h) => ({ label: String(h.day).slice(5), power: Number(h.power ?? 0), income: Number(h.income ?? 0) }));
  return (
    <div dir="ltr" className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -14 }}>
          <CartesianGrid stroke="#ffffff14" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#8f9bb3', fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#8f9bb3', fontSize: 10 }} tickFormatter={(v: number) => compact(v)} width={46} />
          <Tooltip contentStyle={{ background: '#0e1526', border: '1px solid #ffffff1f', borderRadius: 12, fontSize: 12 }} />
          <Line type="monotone" dataKey="power" stroke="#3d6bff" strokeWidth={2} dot={false} name="قدرت نظامی" />
          <Line type="monotone" dataKey="income" stroke="#3ddc97" strokeWidth={2} dot={false} name="درآمد" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function compact(v: number): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return '';
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(Math.round(n));
}

/** the ledger — every row here is a row of the `transactions` table, nothing is computed in the browser */
export function Ledger({ pageSize = 20 }: { pageSize?: number }) {
  const [offset, setOffset] = useState(0);
  const [type, setType] = useState('all');
  const txs = useApi<{ rows: any[]; nextOffset: number | null }>(`/player/transactions?limit=${pageSize}&offset=${offset}${type === 'all' ? '' : `&type=${type}`}`, [offset, type]);

  return (
    <Card title="دفتر مالی" emoji="🧾">
      <div className="mb-2 flex flex-wrap gap-1">
        {[
          { k: 'all', t: 'همه' },
          { k: 'revenue', t: 'درآمد' },
          { k: 'purchase', t: 'خرید' },
          { k: 'war_indemnity', t: 'غرامت جنگ' },
          { k: 'war_loss', t: 'زیان جنگ' },
          { k: 'tax', t: 'مالیات' },
          { k: 'admin_credit', t: 'اعتبار مدیر' },
          { k: 'admin_debit', t: 'کسر مدیر' },
        ].map((f) => (
          <button
            key={f.k}
            className={`ww-tab ${type === f.k ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`}
            onClick={() => {
              setType(f.k);
              setOffset(0);
            }}
          >
            {f.t}
          </button>
        ))}
      </div>

      {txs.loading ? <Loading /> : null}
      {txs.error ? <ErrorBox message={txs.error} onRetry={txs.reload} /> : null}

      <div className="space-y-2">
        {(txs.data?.rows ?? []).map((t: any) => (
          <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-[11px] text-slate-300">
                <Badge tone={TX_TONES[t.type] ?? 'neutral'}>{t.typeLabelFa}</Badge>
                <span className="truncate">{t.reason ?? ''}</span>
              </span>
              <span className={`text-sm font-bold ${t.amount >= 0 ? 'text-ok' : 'text-danger'}`}>
                {t.amount >= 0 ? '+' : '−'}
                {faMoney(Math.abs(Number(t.amount)))}
              </span>
            </div>
            {t.items?.length ? (
              <ul className="mt-1 space-y-0.5 text-[11px] text-slate-400">
                {t.items.map((it: any, i: number) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span>
                      {it.nameFa} × {fa(Number(it.quantity))}
                    </span>
                    <span>{it.unitPrice === null ? 'بدون قیمت' : faMoney(Number(it.unitPrice))}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>{faDateTime(t.createdAt)}</span>
              <span>
                مانده بعد: {faMoney(Number(t.balanceAfter))} · #{fa(t.id)}
              </span>
            </div>
          </div>
        ))}
        {!txs.loading && (txs.data?.rows ?? []).length === 0 ? <Empty text="تراکنشی برای این فیلتر ثبت نشده." /> : null}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Btn disabled={offset <= 0} onClick={() => setOffset(Math.max(0, offset - pageSize))}>
          قبلی
        </Btn>
        <span className="text-[11px] text-slate-500">صفحه {Math.floor(offset / pageSize) + 1}</span>
        <Btn disabled={txs.data?.nextOffset === null} onClick={() => setOffset(txs.data?.nextOffset ?? offset + pageSize)}>
          بعدی
        </Btn>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        یادداشت: «درخواست پرینت» و «ارسال به ایمیل» عمداً ساخته نشده‌اند — خروجی گرفتن از داده فقط از طریق API و با احراز هویت ممکن است تا داده کشورها درز نکند.
      </p>
    </Card>
  );
}

function MilitaryAssets() {
  const { navigate } = useRouter();
  const inv = useApi<{ groups: any[]; totalCategories: number }>('/player/military');
  const all = inv.data?.groups ?? [];
  const totalUnits = all.reduce((n: number, g: any) => n + (g.items ?? []).reduce((m: number, i: any) => m + Number(i.quantity), 0), 0);
  return (
    <Card
      title="دارایی نظامی"
      emoji="🎖️"
    >
      {inv.loading ? <Loading /> : null}
      {inv.error ? <ErrorBox message={inv.error} onRetry={inv.reload} /> : null}
      {!inv.loading && all.length === 0 ? (
        <Empty text="انبار نظامی خالی است." action={<Btn variant="primary" onClick={() => navigate('/app/military')}>🎖️ دارایی کامل نظامی</Btn>} />
      ) : null}
      {all.length > 0 ? (
        <>
          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>{fa(all.length)} دسته · مجموع {fa(totalUnits)} واحد</span>
            <Btn variant="ghost" className="!px-2 !py-1" onClick={() => navigate('/app/military')}>همه جزییات 🎖️</Btn>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {all.map((g: any) => (
              <div key={g.categoryKey} className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center">
                <div className="text-lg leading-6">{g.emoji}</div>
                <div className="mt-0.5 truncate text-[10px] text-slate-400">{g.labelFa ?? g.categoryKey}</div>
                <div className="text-xs font-black text-slate-100">{fa((g.items ?? []).reduce((m: number, i: any) => m + Number(i.quantity), 0))}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </Card>
  );
}

function LatestTransactions() {
  const { navigate } = useRouter();
  const txs = useApi<{ rows: any[] }>('/player/transactions?limit=6&offset=0');
  const rows = txs.data?.rows ?? [];
  if (!rows.length && txs.loading) return null;
  return (
    <Card title="آخرین تراکنش‌ها" emoji="🧾">
      {txs.error ? <ErrorBox message={txs.error} onRetry={txs.reload} /> : null}
      <div className="space-y-1">
        {rows.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-[11px]">
            <span className="min-w-0 truncate text-slate-300">{t.reason ?? t.type}</span>
            <span className={Number(t.amount) >= 0 ? 'shrink-0 text-ok' : 'shrink-0 text-danger'} dir="ltr">
              {Number(t.amount) >= 0 ? '+' : ''}
              {faMoney(Number(t.amount))}
            </span>
          </div>
        ))}
        {!txs.loading && rows.length === 0 ? <p className="py-2 text-center text-[11px] text-slate-500">تراکنشی ثبت نشده است.</p> : null}
      </div>
    </Card>
  );
}
