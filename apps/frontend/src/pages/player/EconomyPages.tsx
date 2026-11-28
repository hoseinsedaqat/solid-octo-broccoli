import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { useRouter } from '../../router';
import { Badge, fa, faDuration, useToast, Loading, ErrorBox } from '../../ui';
import { LightBackButton, LightBlackButton, LightBullet, LightCard, LightGreenButton, LightNote, LightSectionTitle, LightShell, LightTile } from '../../components/Light';
import { TradeHistoryList } from './Trade';
import { useResources } from './Resources';

interface EconomyView {
  economy: {
    treasury: number;
    netIncome: number;
    grossIncome: number;
    maintenanceCost: number;
    taxCost: number;
    factoryIncome: number;
    mineIncome: number;
    cycleSeconds: number;
    pendingIncome: number;
    pendingIncomeCycles: number;
    totalIncome: number;
    totalSpent: number;
    totalTax: number;
  };
}
interface BankState {
  treasury: number;
  activeLoan: { principal: number; repayAmount: number; interestRate: number; daysLeft: number | null; dueAt: string; overdue: boolean } | null;
  loanOptions: { principal: number; repayAmount: number; interestRate: number; termDays: number }[];
  pendingIncome: { cycles: number; amount: number; netPerCycle: number; cycleSeconds: number };
}
interface LoanRow { id: number; principal: number; repayAmount: number; interestRate: number; status: string; statusLabelFa: string; createdAt: string; dueAt: string; repaidAt: string | null }

export const useEconomyView = () => useApi<EconomyView>('/player/economy');
export const useBank = () => useApi<BankState>('/player/bank');

/* ============================== 💰 اقتصاد کشور (هاب) ============================== */

export function EconomyHubPage() {
  const { navigate } = useRouter();
  const eco = useEconomyView();
  const bank = useBank();
  const res = useResources();
  const e = eco.data?.economy;
  const debt = bank.data?.activeLoan?.repayAmount ?? 0;
  const stockValue = (res.data?.resources ?? []).reduce((n, r) => n + Math.floor(r.stock * r.market), 0);
  const wealth = (e?.treasury ?? 0) + stockValue;

  return (
    <LightShell>
      <LightCard className="text-center">
        <h1 className="flex items-center justify-center gap-2 text-[17px] font-black text-[#111827]">🏦 وضعیت اقتصادی</h1>
        <ul className="mt-3 space-y-3 text-right text-[13px]">
          <li className="flex items-center gap-2"><span>💵</span> موجودی خزانه: <b className="tabular-nums">{fa(e?.treasury)} سکه</b></li>
          <li className="flex items-center gap-2"><span>📈</span> درآمد هر دوره: <b className="tabular-nums">{fa(e?.netIncome)} سکه</b></li>
          <li className="flex items-center gap-2"><span>📉</span> بدهی بانکی: <b className="tabular-nums">{fa(debt)} سکه</b></li>
          <li className="flex items-center gap-2"><span>🏭</span> ثروت کشور (خزانه + انبار): <b className="tabular-nums">{fa(wealth)} سکه</b></li>
        </ul>
      </LightCard>

      <div className="mt-4">
        <LightSectionTitle>امکانات اقتصادی 📊</LightSectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          <LightTile emoji="💵" label="درآمد کشور" onClick={() => navigate('/app/economy/income')} />
          <LightTile emoji="🏦" label="خزانه‌داری" onClick={() => navigate('/app/economy/treasury')} />
          <LightTile emoji="📈" label="بودجه کشور" onClick={() => navigate('/app/economy/budget')} />
          <LightTile emoji="💳" label="بدهی‌های کشور" onClick={() => navigate('/app/economy/debt')} />
          <LightTile emoji="💹" label="بازار منابع" onClick={() => navigate('/app/market')} />
          <LightTile emoji="🚢" label="تجارت خارجی" onClick={() => navigate('/app/economy/foreign-trade')} />
        </div>
      </div>

      <div className="mt-3">
        <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
      </div>
      <div className="mt-2"><LightNote>موجودی‌ها و اعداد به‌صورت پویا از دادهٔ کشور شما خوانده می‌شوند.</LightNote></div>
    </LightShell>
  );
}

/* ============================== 💵 درآمد کشور ============================== */

export function IncomePage() {
  const toast = useToast();
  const eco = useEconomyView();
  const [busy, setBusy] = useState(false);
  const e = eco.data?.economy;
  const cycle = e?.cycleSeconds ?? 3600;
  const cyclesPerDay = 86400 / cycle;
  const perHour = cycle > 0 ? ((e?.netIncome ?? 0) * 3600) / cycle : 0;

  async function claim() {
    setBusy(true);
    try {
      const out = await api.post<{ cycles: number; total: number }>('/player/bank/income-claim', {});
      toast(out.cycles > 0 ? `💵 ${fa(out.total)} سکه درآمد دریافت شد (${fa(out.cycles)} دوره).` : 'هنوز درآمدی برای دریافت آماده نیست.', out.cycles > 0 ? 'ok' : 'info');
      await eco.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در دریافت درآمد', 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <LightShell title="درآمد کشور" emoji="💵">
      <LightCard>
        <div className="mb-2 text-[13px] font-extrabold text-[#111827]">🧾 گزارش درآمد کشور</div>
        <LightBullet emoji="⏰" label="درآمد ساعتی" value={`${fa(perHour)} سکه`} />
        <LightBullet emoji="📅" label="درآمد روزانه" value={`${fa(Math.round((e?.netIncome ?? 0) * cyclesPerDay))} سکه`} />
        <LightBullet emoji="🗓️" label="درآمد ماهانه" value={`${fa(Math.round((e?.netIncome ?? 0) * cyclesPerDay * 30))} سکه`} />
        <LightBullet emoji="💵" label="درآمد آماده دریافت" value={`${fa(e?.pendingIncome)} سکه`} />
      </LightCard>

      <div className="mt-4">
        <LightGreenButton loading={busy} disabled={(e?.pendingIncome ?? 0) <= 0} onClick={() => void claim()}>
          💵 دریافت درآمد {e?.pendingIncome ? `— ${fa(e.pendingIncome)} سکه` : ''}
        </LightGreenButton>
      </div>
      <div className="mt-2"><LightBackButton label="بازگشت به اقتصاد کشور" to="/app/economy-hub" /></div>
      <div className="mt-2"><LightNote>درآمد هر دوره: {fa(e?.netIncome)} سکه (هر {faDuration(cycle)}).</LightNote></div>
    </LightShell>
  );
}

/* ============================== 🏦 خزانه‌داری ============================== */

export function TreasuryPage() {
  const { navigate } = useRouter();
  const eco = useEconomyView();
  const e = eco.data?.economy;
  return (
    <LightShell title="خزانه‌داری کشور" emoji="🏦">
      <LightCard>
        <div className="mb-2 flex items-center justify-between border-b border-black/5 pb-2">
          <h2 className="text-[13px] font-extrabold text-[#111827]">🗓️ خزانه مرکزی کشور</h2>
        </div>
        <LightBullet emoji="💰" label="موجودی خزانه" value={`${fa(e?.treasury)} سکه`} />
        <LightBullet emoji="📈" label="درآمد کل" value={`${fa(e?.totalIncome)} سکه`} />
        <LightBullet emoji="📉" label="هزینه کل" value={`${fa(e?.totalSpent)} سکه`} />
        <LightBullet emoji="🧾" label="مالیات کل پرداختی" value={`${fa(e?.totalTax)} سکه`} />
      </LightCard>

      <div className="mt-4">
        <LightSectionTitle>امکانات خزانه‌داری</LightSectionTitle>
        <div className="space-y-2">
          <LightBlackButton onClick={() => navigate('/app/statements')}>📥 واریزی‌های کشور</LightBlackButton>
          <LightBlackButton onClick={() => navigate('/app/statements')}>📤 برداشت‌های کشور</LightBlackButton>
          <LightBlackButton onClick={() => navigate('/app/statements')}>🧾 تاریخچه تراکنش‌ها</LightBlackButton>
        </div>
      </div>
      <div className="mt-3"><LightBackButton label="بازگشت به اقتصاد کشور" to="/app/economy-hub" /></div>
    </LightShell>
  );
}

/* ============================== 💳 بدهی‌های کشور ============================== */

export function DebtPage() {
  const { navigate } = useRouter();
  const bank = useBank();
  const loan = bank.data?.activeLoan;
  const interest = loan ? Math.max(0, Math.round(loan.principal * loan.interestRate)) : 0;

  return (
    <LightShell title="بدهی‌های کشور" emoji="💳">
      <LightCard>
        <div className="mb-2 text-[13px] font-extrabold text-[#111827]">💳 وضعیت بدهی‌های بانکی</div>
        {!loan ? (
          <p className="py-3 text-center text-[12px] text-[#6b7280]">این کشور بدهی بانکی فعالی ندارد. 🎉</p>
        ) : (
          <>
            <LightBullet emoji="🏛️" label="بدهی فعلی (باقی‌مانده)" value={`${fa(loan.repayAmount)} سکه`} />
            <LightBullet emoji="📈" label="سود بدهی" value={`${fa(interest)} سکه`} />
            <LightBullet emoji="💳" label="مبلغ قابل پرداخت" value={`${fa(loan.repayAmount)} سکه`} />
            <LightBullet emoji="🗓️" label="مهلت بازپرداخت" value={loan.daysLeft !== null ? (loan.overdue ? 'سررسید گذشته!' : `${fa(loan.daysLeft)} روز`) : '—'} />
          </>
        )}
      </LightCard>

      <div className="mt-4">
        <LightSectionTitle>امکانات</LightSectionTitle>
        <div className="space-y-2">
          <LightBlackButton disabled={!loan} onClick={() => navigate('/app/economy/pay-debt')}>💵 پرداخت بدهی</LightBlackButton>
          <LightBlackButton onClick={() => navigate('/app/economy/loans')}>🧾 تاریخچه وام‌ها</LightBlackButton>
          <LightBlackButton onClick={() => navigate('/app/economy/loans')}>📅 زمان بازپرداخت</LightBlackButton>
        </div>
      </div>
      <div className="mt-3"><LightBackButton label="بازگشت به اقتصاد کشور" to="/app/economy-hub" /></div>
    </LightShell>
  );
}

/* ============================== 💵 پرداخت بدهی ============================== */

export function PayDebtPage() {
  const toast = useToast();
  const bank = useBank();
  const [busy, setBusy] = useState<number | 'full' | null>(null);
  const loan = bank.data?.activeLoan;
  const treasury = bank.data?.treasury ?? 0;

  async function pay(kind: number | 'full') {
    if (!loan) return;
    const amount = kind === 'full' ? loan.repayAmount : Math.min(kind, loan.repayAmount);
    setBusy(kind);
    try {
      const out = await api.post<{ repayAmount: number; remaining: number }>('/player/bank/loan/repay', kind === 'full' ? {} : { amount });
      toast(out.remaining > 0 ? `✅ ${fa(out.repayAmount)} سکه پرداخت شد — باقی‌مانده: ${fa(out.remaining)} سکه.` : '✅ بدهی کاملاً تسویه شد.', 'ok');
      await bank.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در پرداخت بدهی', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <LightShell title="پرداخت بدهی" emoji="💵">
      {bank.loading ? <Loading /> : null}
      {bank.error ? <ErrorBox message={bank.error} onRetry={bank.reload} /> : null}
      {!loan && bank.data ? (
        <LightCard className="py-8 text-center"><p className="text-[13px] text-[#6b7280]">بدهی فعالی برای پرداخت وجود ندارد.</p></LightCard>
      ) : null}
      {loan ? (
        <>
          <LightCard>
            <h2 className="text-[13px] font-extrabold text-[#111827]">💰 پرداخت بدهی</h2>
            <LightBullet emoji="💳" label="کل بدهی" value={`${fa(loan.repayAmount)} سکه`} />
            <LightBullet emoji="🏦" label="موجودی خزانه" value={`${fa(treasury)} سکه`} />
          </LightCard>

          <div className="mt-4 space-y-2">
            {[1_000, 5_000].map((n) => (
              <button
                key={n}
                disabled={busy !== null || n > loan.repayAmount}
                onClick={() => void pay(n)}
                className="w-full rounded-2xl bg-[#e8eaed] px-4 py-4 text-[13px] font-bold text-[#111827] transition active:scale-[0.98] disabled:opacity-40"
              >
                {busy === n ? 'در حال پرداخت…' : `${fa(n)} سکه`}
              </button>
            ))}
            <button
              disabled={busy !== null || treasury < loan.repayAmount}
              onClick={() => void pay('full')}
              className="w-full rounded-2xl bg-[#111111] px-4 py-4 text-[13px] font-extrabold text-white transition active:scale-[0.98] disabled:opacity-40"
            >
              {busy === 'full' ? 'در حال پرداخت…' : 'پرداخت کامل بدهی'}
            </button>
          </div>
          {treasury < loan.repayAmount ? <p className="mt-2 text-center text-[11px] font-bold text-red-500">موجودی خزانه برای پرداخت کامل کافی نیست — پرداخت جزئی انجام دهید.</p> : null}
        </>
      ) : null}
      <div className="mt-3"><LightBackButton label="بازگشت" to="/app/economy/debt" /></div>
    </LightShell>
  );
}

/* ============================== 🧾 تاریخچه وام‌ها ============================== */

export function LoansPage() {
  const loans = useApi<{ loans: LoanRow[] }>('/player/bank/loans');
  return (
    <LightShell title="تاریخچه وام‌ها" emoji="🧾">
      {loans.loading ? <Loading /> : null}
      {loans.error ? <ErrorBox message={loans.error} onRetry={loans.reload} /> : null}
      {loans.data ? (
        loans.data.loans.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-[#9ca3af]">هنوز وامی ثبت نشده است.</p>
        ) : (
          <div className="space-y-2">
            {loans.data.loans.map((l) => (
              <LightCard key={l.id} className="py-3 text-[11px] leading-6">
                <div className="flex items-center justify-between">
                  <b className="text-[#111827]">وام {fa(l.principal)} سکه‌ای</b>
                  <Badge tone={l.status === 'active' ? 'warn' : 'ok'}>{l.statusLabelFa}</Badge>
                </div>
                <div className="mt-1 text-[#6b7280]">بازپرداخت: <b className="tabular-nums">{fa(l.repayAmount)} سکه</b> · سررسید: {l.dueAt.slice(0, 10)}</div>
                {l.repaidAt ? <div className="text-[#9ca3af]">تسویه‌شده: {l.repaidAt.slice(0, 10)}</div> : null}
              </LightCard>
            ))}
          </div>
        )
      ) : null}
      <div className="mt-3"><LightBackButton label="بازگشت به بدهی‌های کشور" to="/app/economy/debt" /></div>
    </LightShell>
  );
}

/* ============================== 📈 بودجه کشور ============================== */

const POT_PRESETS = [10_000, 50_000, 100_000, 500_000];

export function BudgetPage() {
  const toast = useToast();
  const res = useResources();
  const [selected, setSelected] = useState<string>('military');
  const [amount, setAmount] = useState<number>(10_000);
  const [busy, setBusy] = useState<'allocate' | 'withdraw' | null>(null);
  const data = res.data;
  const treasury = data?.treasury ?? 0;
  const pots = data?.budgets ?? [];
  const selectedPot = pots.find((p) => p.key === selected);
  const allocatedTotal = pots.reduce((n, p) => n + p.amount, 0);

  async function submit(kind: 'allocate' | 'withdraw') {
    if (!selectedPot) return;
    setBusy(kind);
    try {
      await api.post(kind === 'allocate' ? '/player/budget/allocate' : '/player/budget/withdraw', { potKey: selectedPot.key, amount });
      toast(kind === 'allocate' ? `✅ ${fa(amount)} سکه به ${selectedPot.nameFa} تخصیص داده شد.` : `✅ ${fa(amount)} سکه از ${selectedPot.nameFa} برداشت شد.`, 'ok');
      await res.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در ثبت بودجه', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <LightShell title="بودجه کشور" emoji="📈">
      <LightCard>
        <div className="mb-2 text-[13px] font-extrabold text-[#111827]">📉 مدیریت بودجه ملی</div>
        <LightBullet emoji="💰" label="بودجه کشور (خزانه)" value={`${fa(treasury)} سکه`} />
        <LightBullet emoji="📦" label="مجموع تخصیص‌یافته به سرفصل‌ها" value={`${fa(allocatedTotal)} سکه`} />
      </LightCard>

      <div className="mt-4">
        <LightSectionTitle>تخصیص بودجه</LightSectionTitle>
        <div className="space-y-2">
          {pots.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelected(p.key)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[12px] font-bold transition active:scale-[0.98] ${selected === p.key ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
            >
              <span>{p.emoji} {p.nameFa}</span>
              <span className="tabular-nums">{fa(p.amount)} سکه</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <LightSectionTitle>مبلغ: {selectedPot?.nameFa}</LightSectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {POT_PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => setAmount(n)}
              className={`rounded-xl px-2 py-2 text-[10px] font-bold transition ${amount === n ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
            >
              {fa(n)}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f8f9fb] px-4 py-3 text-left text-[13px] font-bold tabular-nums outline-none focus:border-black/30"
        />
      </div>

      <div className="mt-3 space-y-2">
        <LightGreenButton loading={busy === 'allocate'} disabled={amount <= 0 || treasury < amount} onClick={() => void submit('allocate')}>
          ✅ ثبت بودجه (واریز به {selectedPot?.nameFa ?? ''})
        </LightGreenButton>
        <LightBlackButton loading={busy === 'withdraw'} disabled={amount <= 0 || (selectedPot?.amount ?? 0) < amount} onClick={() => void submit('withdraw')}>
          📤 برداشت از {selectedPot?.nameFa ?? ''}
        </LightBlackButton>
      </div>
      <div className="mt-3"><LightBackButton label="بازگشت به اقتصاد کشور" to="/app/economy-hub" /></div>
      <div className="mt-2"><LightNote>بودجه از خزانه جدا می‌شود اما قابل بازگشت است؛ هیچ پولی سوزانده نمی‌شود.</LightNote></div>
    </LightShell>
  );
}

/* ============================== 🚢 تجارت خارجی ============================== */

export function ForeignTradePage() {
  const { navigate } = useRouter();
  const res = useResources();
  const t = res.data?.tradeTotals;
  return (
    <LightShell title="تجارت خارجی" emoji="🚢">
      <LightCard>
        <div className="mb-2 text-[13px] font-extrabold text-[#111827]">🌍 مرکز تجارت خارجی</div>
        <LightBullet emoji="📤" label="صادرات کل" value={`${fa(t?.exportTotal)} سکه · ${fa(t?.exportCount)} معامله`} />
        <LightBullet emoji="📥" label="واردات کل" value={`${fa(t?.importTotal)} سکه · ${fa(t?.importCount)} معامله`} />
      </LightCard>

      <div className="mt-4">
        <LightSectionTitle>امکانات تجارت</LightSectionTitle>
        <div className="space-y-2">
          <LightBlackButton onClick={() => navigate('/app/trade/export')}>📤 صادرات منابع</LightBlackButton>
          <LightBlackButton onClick={() => navigate('/app/trade/import')}>📥 واردات منابع</LightBlackButton>
          <LightBlackButton onClick={() => navigate('/app/contracts')}>🤝 قراردادهای تجاری</LightBlackButton>
          <LightBlackButton onClick={() => navigate('/app/contracts')}>📜 قراردادهای فعال</LightBlackButton>
        </div>
      </div>

      <div className="mt-4">
        <LightSectionTitle>آخرین معاملات</LightSectionTitle>
        <LightCard><TradeHistoryList /></LightCard>
      </div>
      <div className="mt-3"><LightBackButton label="بازگشت به اقتصاد کشور" to="/app/economy-hub" /></div>
    </LightShell>
  );
}
