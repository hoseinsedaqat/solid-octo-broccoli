import { useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { useRouter } from '../../router';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Row, Stat, fa, faDateTime, faDuration, faMoney, useToast } from '../../ui';
import { NationSearchSelect } from '../../components/nations';
import { NAV_TITLES, WAR_TONES } from './meta';

/**
 * War room.
 *
 * Mechanics only — no operational simulation: rounds are resolved by the deterministic engine in the Worker
 * (seeded PRNG + power ratios), so this page never computes a battle. It proposes, accepts, triggers a round
 * when the server gate is open, and displays the stored reports.
 */
export function WarRoomPage({ params }: { params: { id?: string } }) {
  const { me } = useAuth();
  const { navigate } = useRouter();
  const toast = useToast();
  const warId = params.id ? Number(params.id) : null;
  const mine = me?.nationIds ?? [];
  const list = useApi<{ wars: any[] }>('/war/wars');
  const detail = useApi<{ war: any; reports: any[] }>(warId ? `/war/wars/${warId}` : null, [warId]);
  const [tab, setTab] = useState<'list' | 'detail' | 'propose'>(warId ? 'detail' : 'list');
  const [target, setTarget] = useState<{ id: number; name: string; flag: string } | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [indemnity, setIndemnity] = useState('');

  const wars = list.data?.wars ?? [];
  const active = wars.filter((w: any) => ['active', 'proposed', 'peace_requested'].includes(w.status));
  const history = wars.filter((w: any) => !['active', 'proposed', 'peace_requested'].includes(w.status));

  async function act(fn: () => Promise<unknown>, ok: string) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      toast(ok, 'ok');
      await list.reload();
      await detail.reload();
      return true;
    } catch (e) {
      const msg = (e as ApiError).message ?? 'خطا';
      setError(msg);
      toast(msg, 'err');
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.war}</h1>

      <div className="flex gap-1 overflow-x-auto">
        {[
          { k: 'list', t: `⚔️ جبهه‌ها (${fa(active.length)})` },
          { k: 'detail', t: '🔍 پرونده جنگ' },
          { k: 'propose', t: '📩 اعلام جنگ' },
        ].map((b) => (
          <button
            key={b.k}
            className={`ww-tab ${tab === b.k ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`}
            onClick={() => {
              if (b.k === 'detail') {
                if (warId) navigate(`/app/war/${warId}`);
                else if (active[0]) navigate(`/app/war/${active[0].id}`);
                else if (wars[0]) navigate(`/app/war/${wars[0].id}`);
              } else if (b.k === 'list') navigate('/app/wars');
              else navigate('/app/wars');
              setTab(b.k as typeof tab);
            }}
          >
            {b.t}
          </button>
        ))}
      </div>

      {tab === 'list' ? (
        <>
          <Card title="قواعد مالی جنگ" emoji="💸">
            <p className="text-[11px] leading-6 text-slate-400">
              هزینه ورود بر اساس نسبتی از خزانه محاسبه می‌شود و فقط پس از پذیرش حریف کسر می‌گردد؛ غرامت نیز در پایان جنگ بر پایه قدرت از‌مرفتۀ طرف بازنده تعیین می‌شود.
              هیچ‌کدام از این اعداد در این صفحه محاسبه نمی‌شوند — فقط نمایش داده می‌شوند.
            </p>
          </Card>
          {list.loading ? <Loading /> : null}
          {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
          {active.length === 0 && history.length === 0 ? <Empty text="هنوز جنگی ندارید." /> : null}
          {active.map((w: any) => (
            <WarRow key={w.id} w={w} mine={mine} onOpen={() => navigate(`/app/war/${w.id}`)} />
          ))}
          {history.length > 0 ? (
            <Card title="سابقه جنگ‌ها" emoji="📜">
              <div className="space-y-2">
                {history.map((w: any) => (
                  <WarRow key={w.id} w={w} mine={mine} onOpen={() => navigate(`/app/war/${w.id}`)} compact />
                ))}
              </div>
            </Card>
          ) : null}
        </>
      ) : null}

      {tab === 'detail' ? (
        !warId ? (
          <Empty text="از فهرست جبهه‌ها یک جنگ را انتخاب کنید." action={<Btn onClick={() => setTab('list')}>فهرست جبهه‌ها</Btn>} />
        ) : detail.loading ? (
          <Loading />
        ) : detail.error ? (
          <ErrorBox message={detail.error} onRetry={detail.reload} />
        ) : detail.data?.war ? (
          <WarDetail war={detail.data.war} reports={detail.data.reports ?? []} mine={mine} busy={busy} onAct={act} error={error} />
        ) : (
          <Empty text="پرونده‌ای برای نمایش نیست." />
        )
      ) : null}

      {tab === 'propose' ? (
        <Card title="پیشنهاد جنگ" emoji="📩">
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            پیشنهاد جنگ فقط با پذیرش کشور حریف به جریان می‌افتد. رابطه دیپلماتیک باید روی «دشمنی» یا «مذاکره» باشد، مگر اینکه مدیران حمله به کشور خنثی را فعال کرده باشند.
          </p>
          {!target ? (
            <NationSearchSelect excludeId={me?.activeNationId ?? null} onPick={(n) => setTarget({ id: n.id, name: n.name, flag: n.flag })} />
          ) : (
            <div className="space-y-3">
              <Row active>
                <span className="text-sm">
                  {target.flag} {target.name}
                </span>
                <Btn variant="ghost" onClick={() => { setTarget(null); setPreview(null); }}>
                  تغییر هدف
                </Btn>
              </Row>

              <Btn
                loading={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    setPreview(await api.post('/war/preview', { targetNationId: target.id }));
                  } catch (e) {
                    setError((e as ApiError).message ?? 'پیش‌نمایش ناموفق');
                    setPreview(null);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                محاسبه پیش‌نمایش در سرور
              </Btn>

              {preview ? (
                <div className="space-y-2">
                  <Grid cols={4}>
                    <Stat label="شانس برد شما" value={`${fa(Math.round(Number(preview.attackerWinChance) * 100))}٪`} tone={Number(preview.attackerWinChance) >= 0.5 ? 'ok' : 'warn'} />
                    <Stat label="هزینه ورود" value={faMoney(preview.entryCost)} tone="bad" />
                    <Stat label="قدرت شما" value={fa(preview.attackerPower)} />
                    <Stat label="قدرت حریف" value={fa(preview.defenderPower)} />
                  </Grid>
                  <div className="grid grid-cols-2 gap-2">
                    <Stat label="حداکثر راند" value={fa(preview.maxRounds)} />
                    <Stat label="زیان مورد انتظار هر راند" value={`${fa(Math.round(Number(preview.expectedLossPercent ?? 0) * 100))}٪`} tone="warn" />
                  </div>
                  {Number(preview.attackerWinChance) < 0.35 ? (
                    <p className="rounded-xl border border-danger/40 bg-danger/10 p-2 text-[11px] leading-5 text-danger">
                      ⚠️ شانس برد شما پایین است؛ در این وضعیت خزانه و انبار هر دو در معرض زیان‌اند.
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <label className="ww-label" htmlFor="ww-indemnity">
                  غرامت پیشنهادی (اختیاری — سرور آن را بررسی و در صورت لزوم اصلاح می‌کند)
                </label>
                <input id="ww-indemnity" className="ww-input" inputMode="numeric" value={indemnity} onChange={(e) => setIndemnity(e.target.value.replace(/[^\d]/g, ''))} placeholder="۰" />
              </div>

              <Btn
                variant="danger"
                loading={busy}
                disabled={!preview}
                onClick={async () => {
                  const ok = await act(async () => {
                    const res = await api.post<{ warId: number }>('/war/propose', { targetNationId: target.id, indemnityOffered: Number(indemnity || 0) });
                    setTarget(null);
                    setPreview(null);
                    setIndemnity('');
                    navigate(`/app/war/${res.warId}`);
                  }, 'پیشنهاد جنگ ثبت شد و برای حریف ارسال شد.');
                  if (!ok) return;
                }}
              >
                ارسال پیشنهاد جنگ
              </Btn>
              {error ? <p className="text-xs leading-5 text-danger">{error}</p> : null}
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}

function WarRow({ w, mine, onOpen, compact = false }: { w: any; mine: number[]; onOpen: () => void; compact?: boolean }) {
  const iAmAttacker = mine.includes(w.attackerNationId);
  const opponent = iAmAttacker ? { name: w.defenderName, flag: w.defenderFlag } : { name: w.attackerName, flag: w.attackerFlag };
  const myChance = iAmAttacker ? Number(w.attackerWinChance) : 1 - Number(w.attackerWinChance);
  const nextIn = w.nextRoundAt ? Math.max(0, (new Date(w.nextRoundAt).getTime() - Date.now()) / 1000) : 0;

  return (
    <Card className={compact ? '!py-2' : ''}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>{opponent.flag}</span>
            <span className="truncate">{opponent.name}</span>
            <Badge tone={iAmAttacker ? 'bad' : 'info'}>{iAmAttacker ? '🗡️ مهاجم' : '🛡️ مدافع'}</Badge>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            راند {fa(w.roundsPlayed)} از {fa(w.maxRounds)} · شانس برد شما {fa(Math.round(myChance * 100))}٪
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {w.status === 'active' && nextIn > 0 ? `⏳ راند بعدی تا ${faDuration(nextIn)}` : w.endedAt ? `پایان: ${faDateTime(w.endedAt)}` : w.proposedAt ? `پیشنهاد: ${faDateTime(w.proposedAt)}` : ''}
          </p>
        </div>
        <div className="shrink-0 text-left">
          <Badge tone={WAR_TONES[w.status] ?? 'neutral'}>{w.statusLabelFa}</Badge>
          <div className="mt-1">
            <Btn variant="ghost" onClick={onOpen}>
              پرونده
            </Btn>
          </div>
        </div>
      </div>
    </Card>
  );
}

function WarDetail({
  war,
  reports,
  mine,
  busy,
  error,
  onAct,
}: {
  war: any;
  reports: any[];
  mine: number[];
  busy: boolean;
  error: string | null;
  onAct: (fn: () => Promise<unknown>, ok: string) => Promise<boolean>;
}) {
  const iAmAttacker = mine.includes(war.attackerNationId);
  const iAmDefender = mine.includes(war.defenderNationId);
  const opponent = iAmAttacker ? { name: war.defenderName, flag: war.defenderFlag } : { name: war.attackerName, flag: war.attackerFlag };
  const nextIn = war.nextRoundAt ? Math.max(0, (new Date(war.nextRoundAt).getTime() - Date.now()) / 1000) : 0;
  const winnerIsMine = war.winnerNationId ? mine.includes(war.winnerNationId) : null;
  const myPower = iAmAttacker ? war.attackerPower : war.defenderPower;
  const theirPower = iAmAttacker ? war.defenderPower : war.attackerPower;
  const myChance = iAmAttacker ? Number(war.attackerWinChance) : 1 - Number(war.attackerWinChance);

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{opponent.flag}</span>
              <span className="truncate text-base font-extrabold">{opponent.name}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              جنگ #{fa(war.id)} · {iAmAttacker ? 'شما مهاجم هستید' : 'شما مدافع هستید'} · پیشنهاد {faDateTime(war.proposedAt)}
            </p>
          </div>
          <Badge tone={WAR_TONES[war.status] ?? 'neutral'}>{war.statusLabelFa}</Badge>
        </div>

        <div className="mt-3">
          <Grid cols={4}>
            <Stat label="قدرت شما" value={fa(myPower)} />
            <Stat label="قدرت حریف" value={fa(theirPower)} />
            <Stat label="شانس برد شما" value={`${fa(Math.round(myChance * 100))}٪`} tone={myChance >= 0.5 ? 'ok' : 'warn'} />
            <Stat label="راند" value={`${fa(war.roundsPlayed)} / ${fa(war.maxRounds)}`} />
          </Grid>
        </div>

        <div className="mt-2">
          <Grid cols={3}>
            <Stat label="هزینه ورود" value={faMoney(war.entryCost)} tone="bad" />
            <Stat label="غرامت پیشنهادی" value={faMoney(war.indemnityOffered)} />
            <Stat label="غرامت پرداختی" value={faMoney(war.indemnityPaid)} tone={war.indemnityPaid ? 'bad' : undefined} />
          </Grid>
        </div>

        {war.outcomeSummary ? (
          <p className={`mt-2 rounded-xl border p-2 text-xs leading-6 ${winnerIsMine ? 'border-ok/40 bg-ok/10 text-ok' : winnerIsMine === false ? 'border-danger/40 bg-danger/10 text-danger' : 'border-white/10 bg-white/5 text-slate-300'}`}>
            {war.outcomeSummary}
          </p>
        ) : null}
      </Card>

      {['proposed', 'active', 'peace_requested'].includes(war.status) ? (
        <Card title="اقدام" emoji="🎮">
          <div className="flex flex-wrap items-center gap-2">
            {war.status === 'proposed' && iAmDefender ? (
              <>
                <Btn variant="primary" loading={busy} onClick={() => onAct(() => api.post(`/war/${war.id}/respond`, { accept: true }), 'جنگ آغاز شد؛ از این پس راندها اجرا می‌شوند.')}>
                  پذیرش دفاع
                </Btn>
                <Btn variant="danger" loading={busy} onClick={() => onAct(() => api.post(`/war/${war.id}/respond`, { accept: false }), 'پیشنهاد رد شد.')}>
                  رد پیشنهاد
                </Btn>
              </>
            ) : null}
            {war.status === 'proposed' && iAmAttacker ? <p className="text-xs leading-6 text-slate-400">در انتظار پاسخ {opponent.name} — تا آن لحظه هیچ مبلغی کسر نشده است.</p> : null}
            {war.status === 'active' ? (
              <>
                <Btn loading={busy} disabled={nextIn > 0} onClick={() => onAct(() => api.post(`/war/${war.id}/round`), 'راند اجرا شد.')}>
                  {nextIn > 0 ? `⏳ راند بعدی تا ${faDuration(nextIn)}` : '▶️ اجرای راند'}
                </Btn>
                <Btn variant="ghost" loading={busy} onClick={() => onAct(() => api.post(`/war/${war.id}/peace`), 'درخواست صلح برای حریف ارسال شد.')}>
                  🕊️ درخواست صلح
                </Btn>
              </>
            ) : null}
            {war.status === 'peace_requested' ? (
              <>
                <p className="w-full text-[11px] leading-5 text-slate-400">فقط کشوری که درخواست صلح نداده می‌تواند به آن پاسخ دهد؛ اگر نوبت شما نباشد سرور پیام توضیح می‌دهد.</p>
                <Btn variant="primary" loading={busy} onClick={() => onAct(() => api.post(`/war/peace/${war.id}/respond`, { accept: true }), 'صلح امضا شد.')}>
                  قبول صلح
                </Btn>
                <Btn variant="danger" loading={busy} onClick={() => onAct(() => api.post(`/war/peace/${war.id}/respond`, { accept: false }), 'صلح رد شد — جنگ ادامه دارد.')}>
                  رد صلح
                </Btn>
              </>
            ) : null}
          </div>
          {error ? <p className="mt-2 text-xs leading-5 text-danger">{error}</p> : null}
        </Card>
      ) : null}

      <Card title="گزارش راندها (مستقیم از battle_reports)" emoji="🧾">
        {reports.length === 0 ? <Empty text="هنوز راندی ثبت نشده است." /> : null}
        <div className="space-y-2">
          {reports.map((r: any) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">راند {fa(r.roundNo)}</span>
                <Badge tone={r.winner === 'draw' ? 'neutral' : (r.winner === 'attacker' && iAmAttacker) || (r.winner === 'defender' && iAmDefender) ? 'ok' : 'bad'}>
                  {r.winner === 'draw' ? 'مساوی' : r.winner === 'attacker' ? 'برد مهاجم' : 'برد مدافع'}
                </Badge>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                <span>⚔️ مهاجم: قدرت {fa(r.attacker?.power ?? 0)} · زیان {fa(r.attacker?.losses ?? 0)}</span>
                <span>🛡️ مدافع: قدرت {fa(r.defender?.power ?? 0)} · زیان {fa(r.defender?.losses ?? 0)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>شانس مهاجم این راند: {fa(Math.round(Number(r.attackerWinChance) * 100))}٪</span>
                <span>
                  غرامت {faMoney(r.indemnity)} · {faDateTime(r.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
