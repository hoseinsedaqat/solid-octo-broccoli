import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { useRouter } from '../../router';
import { Badge, Btn, Card, ErrorBox, Loading, fa, faDuration, faMoney, useToast } from '../../ui';

interface BankState {
  treasury: number;
  pendingIncome: { cycles: number; amount: number; netPerCycle: number; cycleSeconds: number };
  activeLoan: null | {
    principal: number;
    repayAmount: number;
    interestRate: number;
    createdAt: string;
    dueAt: string;
    daysLeft: number | null;
    overdue: boolean;
  };
  loanOptions: { principal: number; interestRate: number; repayAmount: number; termDays: number }[];
  canTakeLoan: boolean;
}

type Tab = 'home' | 'income' | 'loan';

/** «🏦 بانک مرکزی کشور» — آینهٔ کامل صفحه‌های بانکی ربات (parity): دریافت درآمد دوره‌ای و وام با سود ۱۰٪ */
export function BankPage() {
  const { navigate } = useRouter();
  const toast = useToast();
  const bank = useApi<BankState>('/player/bank');
  const [tab, setTab] = useState<Tab>('home');
  const [busy, setBusy] = useState<string | null>(null);

  const state = bank.data;
  async function act(key: string, fn: () => Promise<unknown>, ok: (r: any) => string) {
    setBusy(key);
    try {
      const res = await fn();
      toast(ok(res), 'ok');
      await bank.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطایی رخ داد.', 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      {/* hero */}
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-l from-gold/15 via-ink-800 to-ink-900 p-5 text-center shadow-card">
        <div aria-hidden className="pointer-events-none absolute -right-6 -top-8 select-none text-8xl opacity-10">🏦</div>
        <div aria-hidden className="pointer-events-none absolute -left-4 bottom-2 select-none text-6xl opacity-10">🏛️</div>
        <div className="relative">
          <div className="text-4xl">🏦</div>
          <h1 className="mt-1 text-lg font-black tracking-tight text-gold-soft">بانک مرکزی کشور</h1>
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-slate-400">موجودی خزانه ملی</div>
            <div className="mt-1 text-3xl font-black tabular-nums text-slate-50">
              {bank.loading ? '…' : fa(state?.treasury ?? 0)} <span className="text-base font-bold text-gold-soft">سکه</span>
            </div>
          </div>
          {state?.activeLoan ? (
            <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-3 py-1.5 text-[11px] text-gold-soft">
              🔒 وام فعال: <b>{fa(state.activeLoan.principal)} سکه</b> — بازپرداخت {fa(state.activeLoan.repayAmount)} سکه
              {state.activeLoan.overdue ? <Badge tone="bad">سررسید گذشته ⚠️</Badge> : state.activeLoan.daysLeft !== null ? <span className="text-slate-300">· {fa(state.activeLoan.daysLeft)} روز دیگر</span> : null}
            </div>
          ) : null}
        </div>
      </div>

      {bank.loading ? <Loading label="در حال اتصال به بانک مرکزی…" /> : null}
      {bank.error ? <ErrorBox message={bank.error} onRetry={bank.reload} /> : null}

      {state ? (
        <>
          {/* tabs (آینهٔ دکمه‌های ربات: دریافت درآمد / وام بانکی) */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-ink-800/60 p-1.5">
            <button className={`ww-tab py-2.5 text-[13px] ${tab === 'income' ? 'ww-tab-active' : ''}`} onClick={() => setTab('income')}>
              💵 دریافت درآمد
              {state.pendingIncome.amount > 0 ? <span className="mr-1 rounded-full bg-ok/20 px-1.5 text-[10px] font-bold text-ok">{fa(state.pendingIncome.amount)}</span> : null}
            </button>
            <button className={`ww-tab py-2.5 text-[13px] ${tab === 'loan' ? 'ww-tab-active' : ''}`} onClick={() => setTab('loan')}>
              💳 وام بانکی
              {state.activeLoan ? <span className="mr-1 rounded-full bg-gold/20 px-1.5 text-[10px] font-bold text-gold-soft">وام فعال</span> : null}
            </button>
          </div>

          {tab === 'home' ? (
            <Card>
              <div className="space-y-2 text-[12px] leading-7 text-slate-300">
                <p>💴 <b className="text-slate-100">درآمد دوره‌ای:</b> درآمد کشور در هر «{faDuration(state.pendingIncome.cycleSeconds)}» یک‌بار احتساب می‌شود و با دکمه «دریافت درآمد» به خزانه واریز می‌گردد.</p>
                <p>💳 <b className="text-slate-100">وام بانکی:</b> از ۵٬۰۰۰ تا ۲۰٬۰۰۰ سکه با سود ۱۰٪ و بازپرداخت طی ۷ روز. تا تسویهٔ وام قبلی، وام جدیدی داده نمی‌شود.</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Btn className="flex-1" onClick={() => setTab('income')}>💵 دریافت درآمد</Btn>
                <Btn className="flex-1" onClick={() => setTab('loan')}>💳 وام بانکی</Btn>
              </div>
            </Card>
          ) : null}

          {tab === 'income' ? (
            <Card>
              <div className="py-1 text-center">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">درآمد آماده دریافت</div>
                <div className="mt-2 text-4xl font-black tabular-nums text-ok">{fa(state.pendingIncome.amount)}</div>
                <div className="mt-1 text-xs text-slate-400">سکه · معادل {fa(state.pendingIncome.cycles)} دورهٔ تکمیل‌شده</div>
                <p className="mx-auto mt-3 max-w-xs text-[11px] leading-6 text-slate-500">فرمانده، درآمد اقتصادی کشور شما آمادهٔ برداشت است. مبلغ از همین حالا در خزانه احتساب می‌شود.</p>
                <Btn
                  variant="primary"
                  className="mt-4 w-full py-3 text-base"
                  loading={busy === 'income'}
                  disabled={state.pendingIncome.amount <= 0}
                  onClick={() => void act('income', () => api.post('/player/bank/income-claim', {}), (r) => `✅ ${fa(r?.total ?? r?.credited?.total ?? 0)} سکه از درآمد دوره‌ای به خزانه واریز شد.`)}
                >
                  {state.pendingIncome.amount > 0 ? `دریافت ${fa(state.pendingIncome.amount)} سکه 💰` : '✅ درآمدی آماده نیست'}
                </Btn>
              </div>
            </Card>
          ) : null}

          {tab === 'loan' ? (
            <Card title="وام بانکی" emoji="🏦">
              {state.activeLoan ? (
                <div className="space-y-3">
                  <p className="text-[12px] leading-6 text-slate-300">فرمانده، شما یک وام فعال دارید:</p>
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-[12px]">
                    <div className="flex items-center justify-between"><span className="text-slate-400">🔒 اصل وام</span><b>{fa(state.activeLoan.principal)} سکه</b></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400">مبلغ بازپرداخت (سود ۱۰٪)</span><b className="text-gold-soft">{fa(state.activeLoan.repayAmount)} سکه</b></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400">سررسید</span><b>{new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short' }).format(new Date(state.activeLoan.dueAt))}{state.activeLoan.overdue ? ' — گذشته است ⚠️' : state.activeLoan.daysLeft !== null ? ` — ${fa(state.activeLoan.daysLeft)} روز دیگر` : ''}</b></div>
                  </div>
                  <p className="text-[11px] leading-5 text-slate-500">تا تسویهٔ این وام، امکان دریافت وام جدید وجود ندارد. (تسویهٔ زودتر از موعد مجاز است)</p>
                  <Btn variant="primary" className="w-full py-3" loading={busy === 'repay'} onClick={() => void act('repay', () => api.post('/player/bank/loan/repay', {}), () => 'وام تسویه شد. 🎉')}>
                    بازپرداخت وام ({fa(state.activeLoan.repayAmount)} سکه) 💵
                  </Btn>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[12px] leading-6 text-slate-300">فرمانده، می‌تونی از بانک مرکزی وام دریافت کنی:</p>
                  <div className="grid gap-2">
                    {state.loanOptions.map((o) => (
                      <div key={o.principal} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-to-l from-white/5 to-transparent p-3">
                        <div>
                          <div className="text-sm font-extrabold text-slate-100">وام {o.principal === 5000 ? 'کوچک' : o.principal === 10000 ? 'متوسط' : 'بزرگ'}</div>
                          <div className="mt-0.5 text-[11px] leading-5 text-slate-400">سود ۱۰٪ · بازپرداخت {fa(o.repayAmount)} سکه طی {fa(o.termDays)} روز</div>
                        </div>
                        <Btn variant="primary" loading={busy === `loan:${o.principal}`} onClick={() => void act(`loan:${o.principal}`, () => api.post('/player/bank/loan', { principal: o.principal }), () => `وام ${fa(o.principal)} سکه‌ای به خزانه واریز شد.`)}>
                          {fa(o.principal)}
                        </Btn>
                      </div>
                    ))}
                  </div>
                  <ul className="space-y-1 text-[11px] leading-6 text-slate-500">
                    <li>• بازپرداخت بعد از ۷ روز</li>
                    <li>• سود وام: ۱۰٪</li>
                    <li>• تا تسویهٔ وام قبلی، امکان دریافت وام جدید وجود ندارد.</li>
                  </ul>
                </div>
              )}
            </Card>
          ) : null}

          <Btn variant="ghost" className="w-full" onClick={() => navigate('/app/player')}>⬅ بازگشت به منوی اصلی</Btn>
        </>
      ) : null}
    </div>
  );
}
