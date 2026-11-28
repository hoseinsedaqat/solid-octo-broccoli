import { useApi, useAuth } from '../../auth';
import { useRouter } from '../../router';
import { Badge, Card, Empty, ErrorBox, Grid, Loading, Row, Stat, fa, faDateTime, faDuration, faMoney } from '../../ui';
import { ECONOMY_NOTE, categoryLabel } from './meta';

/**
 * Dashboard = the one page that must never be empty.
 * Everything on it is read from the API; nothing is cached in the browser except the render itself.
 */
export function PlayerHome() {
  const { me } = useAuth();
  const { navigate } = useRouter();
  const view = me?.view;
  const eco = useApi<{ economy: Record<string, number>; history: { day: string; treasury: number; income: number }[] }>('/player/economy');
  const wars = useApi<{ wars: any[] }>('/war/wars');
  const reqs = useApi<{ incoming: any[] }>('/diplomacy/requests');

  const econ = { ...(view?.economy ?? {}), ...(eco.data?.economy ?? {}) } as Record<string, number>;
  const nation = view?.nation;
  const activeWars = (wars.data?.wars ?? []).filter((w: any) => ['active', 'peace_requested'].includes(String(w.status)));

  if (!view || !nation) return <Empty text="برای شروع، کشور خود را از ربات بسازید." />;

  return (
    <div className="space-y-3">
      <Card className="relative overflow-hidden border-gold/20 bg-gradient-to-l from-gold/10 via-ink-800/80 to-ink-900/80">
        <div aria-hidden className="pointer-events-none absolute -left-5 -top-6 select-none text-8xl opacity-[0.07]">{nation.flag}</div>
        <div className="relative flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-3xl">{nation.flag}</span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight text-slate-50">{nation.name}</h1>
              <p className="mt-0.5 text-[11px] text-slate-400">
                رهبر {nation.leaderName} · از {faDateTime(nation.createdAt)}
              </p>
            </div>
          </div>
          <div className="shrink-0 rounded-2xl border border-gold/25 bg-gold/10 px-3 py-1.5 text-center">
            <div className="text-[9px] font-bold uppercase tracking-widest text-gold-soft/80">رتبه جهانی</div>
            <div className="text-2xl font-black leading-7 text-gold-soft">{fa(nation.worldRank)}</div>
          </div>
        </div>

        <Grid cols={4}>
          <Stat label="خزانه" value={faMoney(econ.treasury ?? nation.treasury)} />
          <Stat label="خالص هر دوره" value={faMoney(econ.netIncome ?? nation.incomePerCycle)} tone="ok" />
          <Stat label="قدرت نظامی" value={fa(nation.militaryPower)} />
          <Stat label="سرباز" value={fa(nation.troopsCount)} />
        </Grid>

        <button onClick={() => navigate('/app/bank')} className="group mt-3 flex w-full items-center justify-between rounded-2xl border border-gold/25 bg-gold/10 px-3 py-2.5 text-right transition hover:border-gold/40 hover:bg-gold/15 active:scale-[0.99]">
          <span className="text-xs text-slate-300">🏦 درآمد آماده دریافت</span>
          <span className="text-sm font-black text-gold-soft">
            {faMoney(Number(econ.pendingIncome ?? 0))} سکه
            {econ.cycleSeconds ? <span className="ml-1 text-[11px] font-normal text-slate-400">هر {faDuration(econ.cycleSeconds)}</span> : null}
            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-0.5">⬅</span>
          </span>
        </button>
      </Card>

      {activeWars.length > 0 || (reqs.data?.incoming ?? []).length > 0 ? (
        <Card title="نیاز به اقدام" emoji="🔔">
          <div className="space-y-2">
            {(reqs.data?.incoming ?? []).slice(0, 3).map((r: any) => (
              <Row key={`req-${r.id}`} onClick={() => navigate('/app/friends')}>
                <span className="text-xs">
                  {r.from_flag} {r.from_name} درخواست {r.kind === 'friendship' ? 'دوستی' : r.kind === 'alliance' ? 'اتحاد' : r.kind === 'peace' ? 'صلح' : 'مذاکره'} داده است
                </span>
                <Badge tone="warn">پاسخ</Badge>
              </Row>
            ))}
            {activeWars.slice(0, 3).map((w: any) => (
              <Row key={`war-${w.id}`} onClick={() => navigate(`/app/war/${w.id}`)}>
                <span className="text-xs">
                  ⚔️ جنگ با {w.opponentName ?? 'حریف'} — راند {fa(Number(w.roundNo ?? 0))}
                </span>
                <Badge tone={w.status === 'active' ? 'bad' : 'warn'}>{w.statusLabelFa ?? (w.status === 'active' ? 'در جریان' : 'در انتظار')}</Badge>
              </Row>
            ))}
          </div>
        </Card>
      ) : null}

      {eco.data?.history?.length ? (
        <Card title="روند خزانه" emoji="📈" right={<button className="ww-btn ww-btn-ghost text-xs" onClick={() => navigate('/app/player/economy')}>جزئیات</button>}>
          <MiniTreasury history={eco.data.history} />
        </Card>
      ) : null}

      <Grid>
        <Stat label="کارخانه" value={faMoney(econ.factoryIncome)} hint={`معادل ${fa(categoryShare(econ.factoryIncome, econ.grossIncome))}٪ درآمد`} />
        <Stat label="معدن" value={faMoney(econ.mineIncome)} hint={`معادل ${fa(categoryShare(econ.mineIncome, econ.grossIncome))}٪ درآمد`} />
        <Stat label="هزینه نگهداری" value={faMoney(econ.maintenanceCost)} tone="warn" />
        <Stat label="مالیات" value={faMoney(econ.taxCost)} tone="warn" />
      </Grid>

      <Card title="دارایی‌های کلیدی" emoji="🎖️">
        <Grid cols={4}>
          <Stat label="تجهیزات" value={fa(nation.equipmentCount)} />
          <Stat label="متحدان" value={fa(nation.alliesCount)} tone="ok" />
          <Stat label="دشمنان" value={fa(nation.enemiesCount)} tone="bad" />
          <Stat label="بردها" value={fa(nation.winsCount)} />
        </Grid>
        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-slate-400">
          {['tanks', 'fighters', 'missiles', 'radars', 'soldiers'].map((k) => (
            <span key={k} className="rounded-full bg-white/5 px-2 py-1">
              {categoryLabel(k)}
            </span>
          ))}
        </div>
      </Card>

      <Card title="دسترسی سریع" emoji="🎮">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { p: '/app/shop', t: '🛒 فروشگاه' },
            { p: '/app/military', t: '🎖️ ارتش' },
            { p: '/app/wars', t: '⚔️ اتاق جنگ' },
            { p: '/app/ranking', t: '🏆 رتبه‌ها' },
            { p: '/app/friends', t: '🕊️ دیپلماسی' },
            { p: '/app/bank', t: '🏦 بانک' },
            { p: '/app/build', t: '🏗️ ساخت‌وساز' },
            { p: '/app/ranking', t: '🏆 رتبه‌بندی' },
          ].map((b) => (
            <button key={b.p} className="ww-btn justify-center py-3" onClick={() => navigate(b.p)}>
              {b.t}
            </button>
          ))}
        </div>
      </Card>

      <p className="px-1 text-[11px] leading-6 text-slate-500">🧾 {ECONOMY_NOTE}</p>
    </div>
  );
}

function categoryShare(part: number | undefined, total: number | undefined): number {
  if (!part || !total) return 0;
  return Math.round((part / total) * 100);
}

function MiniTreasury({ history }: { history: { day: string; treasury: number }[] }) {
  // a dependency-free sparkline: the heavy chart library is only loaded on the economy page
  const rows = history.slice(-14);
  const values = rows.map((h) => Number(h.treasury) || 0);
  const max = Math.max(1, ...values);
  const min = Math.min(...values, 0);
  const w = 300;
  const h = 64;
  const pts = values
    .map((v, i) => {
      const x = rows.length > 1 ? (i / (rows.length - 1)) * w : w / 2;
      const y = h - ((v - min) / Math.max(1, max - min)) * (h - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <div>
      <div dir="ltr" className="w-full">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-16 w-full">
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e4b642" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#e4b642" stopOpacity="0" />
            </linearGradient>
          </defs>
          {pts ? <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#spark)" /> : null}
          <polyline points={pts} fill="none" stroke="#e4b642" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>{rows[0]?.day?.slice(5)} · {faMoney(values[0])}</span>
        <span>{rows[rows.length - 1]?.day?.slice(5)} · {faMoney(values[values.length - 1])}</span>
      </div>
    </div>
  );
}
