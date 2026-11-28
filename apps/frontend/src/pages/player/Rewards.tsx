import { useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi } from '../../auth';
import { useRouter } from '../../router';
import { Btn, Card, ErrorBox, Loading, useToast } from '../../ui';
import { DAILY_PRIZES } from './meta';

interface PrizeView {
  key: string;
  emoji: string;
  labelFa: string;
  kind: 'equipment' | 'coins';
}
interface DailyPrizeState {
  day: string;
  claimed: boolean;
  prize: PrizeView | null;
  prizes?: PrizeView[];
}

/** «🎁 جایزه شانسی روزانه» — یک بار در روز (UTC) یکی از جوایز زیر تصادفی به کشور شما اضافه می‌شود */
export function RewardsPage() {
  const { navigate } = useRouter();
  const toast = useToast();
  const state = useApi<DailyPrizeState>('/player/daily-prize');
  const [won, setWon] = useState<PrizeView | null>(null);
  const [busy, setBusy] = useState(false);

  const prizes: readonly PrizeView[] = state.data?.prizes ?? DAILY_PRIZES;
  const todayPrize = won ?? state.data?.prize ?? null;
  const claimed = Boolean(state.data?.claimed || won);

  async function claim() {
    setBusy(true);
    try {
      const res = await api.post<{ alreadyClaimed: boolean; day: string; prize: PrizeView }>('/player/daily-prize/claim', {});
      setWon(res.prize);
      toast(
        res.alreadyClaimed ? 'امروز جایزهٔ خود را قبلاً دریافت کرده‌اید.' : `🎁 «${res.prize.labelFa}» به دارایی شما اضافه شد!`,
        'ok',
      );
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطای دریافت جایزه', 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 pt-2 text-center">
      <div className="text-6xl leading-none">🎁</div>
      <h1 className="text-xl font-black">جایزه شانسی روزانه</h1>
      <p className="text-[12px] leading-6 text-slate-400">یکی از جوایز زیر به‌صورت تصادفی به شما تعلق می‌گیرد.</p>

      {state.loading ? <Loading /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      <div className="space-y-2">
        {prizes.map((p) => (
          <div
            key={p.key}
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-emerald-50/10 px-4 py-4 text-sm font-extrabold"
          >
            <span>{p.labelFa}</span>
            <span className="text-xl leading-none">{p.emoji}</span>
          </div>
        ))}
      </div>

      {todayPrize && claimed ? (
        <Card>
          <div className="py-1 text-sm font-bold text-gold-soft">
            🎉 جایزهٔ امروز شما: {todayPrize.emoji} {todayPrize.labelFa}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">به دارایی شما اضافه شد. فردا (به وقت UTC) برگردید!</p>
        </Card>
      ) : (
        <Btn
          variant="primary"
          className="!w-full !rounded-2xl !py-4 !text-base"
          loading={busy}
          disabled={claimed}
          onClick={() => void claim()}
        >
          🎁 دریافت جایزه شانسی
        </Btn>
      )}

      <div className="pt-1">
        <Btn variant="ghost" className="!w-full !rounded-2xl !py-3" onClick={() => navigate('/app/player')}>
          🔙 بازگشت به منوی اصلی
        </Btn>
      </div>
      <p className="text-[10px] text-slate-500">هر کشور در هر روز (UTC) یک بار جایزه می‌گیرد؛ سرور جایزه را یکه‌بار تحویل می‌دهد.</p>
    </div>
  );
}
