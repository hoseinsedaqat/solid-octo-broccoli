import { useEffect, useMemo, useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Row, Stat, Tabs, fa, faDateTime, useToast } from '../../ui';
import { ADMIN_SECTIONS, RANKING_METRICS } from '@ww/shared';
import { AdminBlock, BoolField, JsonView, NumField, RawTable, TextField, saveSettings, useAdminSettings } from './shared';

const BATTLE_FIELDS: { key: string; label: string; hint?: string; percent?: boolean }[] = [
  { key: 'warRandomness', label: 'ضریب تصادفی (۱ ± w)', hint: '۰ = کاملاً قطعی' },
  { key: 'damagePerRound', label: 'سهم نابودی در هر راند' },
  { key: 'maxRounds', label: 'حداکثر راند' },
  { key: 'attackerAdvantage', label: 'ضریب برتری مهاجم' },
  { key: 'defenderAdvantage', label: 'ضریب برتری مدافع' },
  { key: 'manpowerFactor', label: 'ضریب نیروی انسانی → امتیاز' },
  { key: 'radarSupportBonus', label: 'پاداف رادار به دفاع' },
  { key: 'allianceSupportRatio', label: 'سهم پشتیبانی اتحاد' },
  { key: 'indemnityPerPoint', label: 'غرامت (سکه) به‌ازای هر امتیاز از‌مرفت' },
  { key: 'warEntryTaxRate', label: 'نرخ مالیات ورود جنگ (از خزانه)' },
  { key: 'minWarDurationSeconds', label: 'حداقل طول جنگ (ثانیه)' },
  { key: 'maxActiveWarsPerNation', label: 'حداکثر جنگ هم‌زمان هر کشور' },
];

/** battle mechanics + live wars (stop / end), all rules live in `game_settings.battle_params` */
export function AdminWarConfig() {
  const { data, reload } = useAdminSettings();
  const [tab, setTab] = useState<'rules' | 'wars'>('rules');
  const wars = useApi<{ wars: any[] }>(tab === 'wars' ? '/admin/wars' : null, [tab]);
  const battle = data?.settings?.battle ?? {};

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">⚔️ قواعد جنگ</h1>
      <Tabs items={[{ key: 'rules', label: '📐 پارامترها' }, { key: 'wars', label: `🔥 جنگ‌های فعال (${fa((wars.data?.wars ?? []).filter((w: any) => ['active', 'proposed', 'peace_requested'].includes(w.status)).length)})` }]} value={tab} onChange={setTab} />

      {tab === 'rules' ? (
        <AdminBlock section="settings" title="پارامترهای نبرد" emoji="📐" right={<Badge tone="info">battle_params</Badge>}>
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            جنگ فقط یک مکانیک بازی است: هیچ شبیه‌سازی عملیاتی، هیچ داده واقعی نظامی و هیچ «راهنمای» تولیدی در کار نیست — فقط اعدادی که در موتور قطعی (PRNG با seed ثبت‌شده)
            استفاده می‌شوند. تغییر این مقادیر رتبه‌ها را بازمحاسبه می‌کند.
          </p>
          <div className="space-y-1">
            {BATTLE_FIELDS.map((f) => (
              <NumField key={f.key} section="battle_params" keyName={f.key} label={f.label} hint={f.hint} percent={f.percent} value={battle[f.key]} onSaved={reload} />
            ))}
          </div>
        </AdminBlock>
      ) : (
        <AdminBlock section="wars" title="جنگ‌ها" emoji="🔥">
          {wars.loading ? <Loading /> : null}
          {wars.error ? <ErrorBox message={wars.error} onRetry={wars.reload} /> : null}
          {(wars.data?.wars ?? []).length === 0 && !wars.loading ? <Empty text="جنگی ثبت نشده است." /> : null}
          <div className="space-y-1">
            {(wars.data?.wars ?? []).slice(0, 40).map((w: any) => (
              <WarRow key={w.id} w={w} onChanged={() => void wars.reload()} />
            ))}
          </div>
        </AdminBlock>
      )}
    </div>
  );
}

function WarRow({ w, onChanged }: { w: any; onChanged: () => void }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState('');
  const report = useApi<{ rounds: any[] }>(open ? `/admin/wars/${w.id}/report` : null, [open]);
  const isActive = ['active', 'proposed', 'peace_requested'].includes(w.status);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 text-xs">
          <span className="font-bold">#{fa(w.id)}</span> {w.attackerFlag} {w.attackerName} → {w.defenderFlag} {w.defenderName}
          <Badge tone={isActive ? 'bad' : 'neutral'}>{w.statusLabelFa ?? w.status}</Badge>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[10px] text-slate-400">
          {fa(w.roundsPlayed ?? 0)}/{fa(w.maxRounds ?? 0)} راند
          <button className="ww-btn ww-btn-ghost !px-2 !py-0.5" onClick={() => setOpen((v) => !v)}>{open ? '▲' : '▼'}</button>
        </span>
      </div>
      <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-400">
        <span>شانس مهاجم {fa(Math.round(Number(w.attackerWinChance ?? 0) * 100))}٪</span>
        <span>هزینه ورود {fa(w.entryCost)}</span>
        <span>غرامت {fa(w.indemnityPaid ?? 0)}</span>
        {w.lastRound ? <span>آخرین راند {fa(w.lastRound)}</span> : null}
        {w.endedAt ? <span>پایان {faDateTime(w.endedAt)}</span> : null}
      </div>
      {isActive ? (
        <div className="mt-2 space-y-1">
          <input className="ww-input !py-1 text-xs" placeholder="دلیل مداخله (اجباری)" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
          <div className="flex gap-1">
            {(['stop', 'end'] as const).map((mode) => (
              <Btn
                key={mode}
                variant="danger"
                loading={busy}
                disabled={reason.trim().length < 3}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await api.post(`/admin/wars/${w.id}/${mode}`, { reason: reason.trim() });
                    toast(mode === 'stop' ? 'جنگ متوقف شد.' : 'جنگ پایان یافت.', 'ok');
                    setReason('');
                    onChanged();
                  } catch (e) {
                    toast((e as ApiError).message, 'err');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {mode === 'stop' ? '⏹ توقف' : '🏁 پایان دادن'}
              </Btn>
            ))}
          </div>
          <p className="text-[10px] leading-5 text-slate-500">
            توقف = بدون برنده و با زیان‌های ثبت‌شده؛ پایان = همین‌که آخرین راند قطعی محسوب شود. هر دو فقط وضعیت جنگ را عوض می‌کنند و تراکنش جدید ساختگی نمی‌سازند.
          </p>
        </div>
      ) : null}
      {open ? (
        <div className="mt-2 border-t border-white/10 pt-2">
          {report.loading ? <Loading /> : null}
          <RawTable
            rows={report.data?.rounds}
            columns={[
              { key: 'round_no', label: 'راند' },
              { key: 'attacker_power', label: 'قدرت مهاجم' },
              { key: 'defender_power', label: 'قدرت مدافع' },
              { key: 'attacker_losses', label: 'زیان مهاجم' },
              { key: 'defender_losses', label: 'زیان مدافع' },
              { key: 'winner_nation_id', label: 'برنده' },
              { key: 'created_at', label: 'زمان', render: (v) => new Date(Number(v) * 1000).toLocaleString('fa-IR') },
            ]}
            empty="راندی ثبت نشده است."
          />
          {report.data?.rounds?.[0] ? <JsonView data={report.data.rounds[0]} label="ردیف خام battle" /> : null}
        </div>
      ) : null}
    </div>
  );
}

/** diplomacy rules + relations graph + pending requests */
export function AdminDiplomacy() {
  const { data, reload } = useAdminSettings();
  const { me } = useAuth();
  const dip = useApi<any>('/admin/diplomacy');
  const [tab, setTab] = useState<'rules' | 'relations' | 'requests' | 'alliances'>('rules');
  const rules = data?.settings?.diplomacy ?? {};

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">🕊️ دیپلماسی</h1>
      <Tabs
        items={[
          { key: 'rules', label: '📐 قواعد' },
          { key: 'relations', label: `🌐 روابط (${fa((dip.data?.relations ?? []).length)})` },
          { key: 'requests', label: `📥 درخواست‌ها (${fa((dip.data?.requests ?? []).length)})` },
          { key: 'alliances', label: `🤝 اتحادها (${fa((dip.data?.alliances ?? []).length)})` },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'rules' ? (
        <AdminBlock section="settings" title="قواعد دیپلماسی" emoji="📐">
          <div className="space-y-1">
            <NumField section="diplomacy_rules" keyName="maxPendingRequestsPerNation" label="حداکثر درخواست باز هر کشور" value={rules.maxPendingRequestsPerNation} onSaved={reload} />
            <NumField section="diplomacy_rules" keyName="maxFriends" label="حداکثر دوست برای هر کشور" value={rules.maxFriends} onSaved={reload} />
            <NumField section="diplomacy_rules" keyName="maxAllianceMembers" label="حداکثر عضو اتحاد" value={rules.maxAllianceMembers} onSaved={reload} />
            <NumField section="diplomacy_rules" keyName="requestExpirySeconds" label="اعتبار درخواست (ثانیه)" value={rules.requestExpirySeconds} onSaved={reload} />
            <BoolField section="diplomacy_rules" keyName="allowNeutralAttacks" label="حمله به کشور خنثی مجاز باشد" hint="خاموش = باید اول رابطه دشمنی ثبت شود" value={rules.allowNeutralAttacks} onSaved={reload} />
          </div>
        </AdminBlock>
      ) : null}

      {tab === 'relations' ? (
        <AdminBlock section="diplomacy" write={false} title="روابط" emoji="🌐">
          {dip.loading ? <Loading /> : null}
          <RawTable
            rows={dip.data?.relations}
            columns={[
              { key: 'n1', label: 'کشور اول', render: (v, r) => `${(r.f1 as string) ?? ''} ${String(v)}` },
              { key: 'n2', label: 'کشور دوم', render: (v, r) => `${(r.f2 as string) ?? ''} ${String(v)}` },
              { key: 'status', label: 'وضعیت' },
              { key: 'alliance_id', label: 'اتحاد' },
              { key: 'updated_at', label: 'به‌روزرسانی', render: (v) => new Date(Number(v) * 1000).toLocaleString('fa-IR') },
            ]}
            empty="هنوز رابطه‌ای ثبت نشده است."
          />
          <p className="mt-2 text-[11px] leading-6 text-slate-500">
            قطع رابطه یا انحلال اتحاد از همین‌جا انجام نمی‌شود — فقط خود کشورها می‌توانند رابطه را تغییر دهند؛ کار مدیر فقط در شرایط استثنایی (تخلف) توقف جنگ یا انحلال اتحاد است.
          </p>
        </AdminBlock>
      ) : null}

      {tab === 'requests' ? (
        <AdminBlock section="diplomacy" write={false} title="درخواست‌های باز" emoji="📥">
          <RawTable
            rows={dip.data?.requests}
            columns={[
              { key: 'id', label: '#', render: (v) => fa(Number(v)) },
              { key: 'kind', label: 'نوع' },
              { key: 'from_name', label: 'فرستنده' },
              { key: 'to_name', label: 'گیرنده' },
              { key: 'message', label: 'پیام' },
              { key: 'expires_at', label: 'انقضا', render: (v) => (v ? new Date(Number(v) * 1000).toLocaleString('fa-IR') : '—') },
            ]}
            empty="درخواست بازی نیست؛ کران diplomacy_expiry آن‌ها را منقضی می‌کند."
          />
        </AdminBlock>
      ) : null}

      {tab === 'alliances' ? (
        <AdminBlock section="diplomacy" title="اتحادها" emoji="🤝">
          <div className="space-y-1">
            {(dip.data?.alliances ?? []).map((a: any) => (
              <AllianceRow key={a.id} a={a} canWrite={me?.role === 'super_admin' || Boolean(me?.permissions?.diplomacy?.write)} onDone={() => void dip.reload()} />
            ))}
            {(dip.data?.alliances ?? []).length === 0 && !dip.loading ? <Empty text="هیچ اتحاد فعالی نیست." /> : null}
          </div>
        </AdminBlock>
      ) : null}
    </div>
  );
}

function AllianceRow({ a, canWrite, onDone }: { a: any; canWrite: boolean; onDone: () => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <Row>
      <span className="min-w-0 text-xs">
        <span className="font-bold">#{fa(Number(a.id))} {a.name}</span>
        <span className="mr-2 text-[10px] text-slate-400">{fa(Number(a.members ?? 0))} عضو · رهبر: {a.leader_name ?? '—'}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-[10px] text-slate-500">{new Date(Number(a.created_at) * 1000).toLocaleDateString('fa-IR')}</span>
        {canWrite ? (
          <Btn
            variant="danger"
            loading={busy}
            onClick={async () => {
              if (!window.confirm(`اتحاد #${fa(Number(a.id))} منحل شود؟ اعضا فقط «دوست» می‌مانند.`)) return;
              setBusy(true);
              try {
                await api.post(`/admin/diplomacy/alliance/${Number(a.id)}/disband`);
                toast('اتحاد منحل شد.', 'ok');
                onDone();
              } catch (e) {
                toast((e as ApiError).message, 'err');
              } finally {
                setBusy(false);
              }
            }}
          >
            انحلال
          </Btn>
        ) : null}
      </span>
    </Row>
  );
}

/** ranking_weights + the live leaderboard (same data the players see) */
export function AdminRankingConfig() {
  const { data, reload } = useAdminSettings();
  const board = useApi<{ rows: any[]; metric: string; weights: Record<string, number>; available: string[] }>('/social/rankings?limit=50&metric=total');
  const [tab, setTab] = useState<'weights' | 'board'>('weights');
  const weights = data?.settings?.rankingWeights ?? {};
  const metrics = RANKING_METRICS as readonly string[];

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">🏆 رتبه‌بندی</h1>
      <Tabs items={[{ key: 'weights', label: '⚖️ وزن معیارها' }, { key: 'board', label: `🌍 جدول (${fa((board.data?.rows ?? []).length)})` }]} value={tab} onChange={setTab} />

      {tab === 'weights' ? (
        <AdminBlock section="settings" title="وزن هر معیار در امتیاز کل" emoji="⚖️">
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            هر معیار روی بزرگ‌ترین مقدار جاری نرمال می‌شود و در وزنش ضرب می‌شود؛ سپس round(*1000). جمع وزن‌ها لازم است ۱ باشد ولی سرور آن را تحمیل نمی‌کند — برای
            سادگی، وزن‌ها را نسبتی ببندید. تغییر وزن بلافاصله جدول را بازمحاسبه می‌کند.
          </p>
          <WeightsEditor weights={weights} metrics={metrics} onSaved={reload} />
        </AdminBlock>
      ) : (
        <Card title="جدول فعلی (بدون تغییر در سرور)" emoji="🌍" right={<Btn variant="ghost" onClick={() => void board.reload()}>🔄</Btn>}>
          {board.loading ? <Loading /> : null}
          <div className="space-y-1">
            {(board.data?.rows ?? []).slice(0, 25).map((r: any) => (
              <Row key={r.nationId}>
                <span className="text-xs">
                  {fa(r.rank)}. {r.flag} {r.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {fa(r.score)} · 🛡️ {fa(r.militaryPower ?? 0)} · 💰 {fa(r.treasury ?? 0)}
                </span>
              </Row>
            ))}
            {(board.data?.rows ?? []).length === 0 && !board.loading ? <Empty text="هنوز کشوری رتبه ندارد." /> : null}
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * POST /admin/settings REPLACES the whole `ranking_weights` record (only the other sections get merged
 * server-side), so a single field would silently reset every other weight to its default.
 * The editor therefore keeps a full draft and saves the complete map.
 */
function WeightsEditor({ weights, metrics, onSaved }: { weights: Record<string, number>; metrics: readonly string[]; onSaved: () => void }) {
  const toast = useToast();
  const { can } = useAuth();
  const draft0 = useMemo(() => {
    const d: Record<string, string> = {};
    for (const m of metrics) d[m] = String(weights[m] ?? 0);
    return d;
  }, [weights, metrics]);
  const [draft, setDraft] = useState<Record<string, string>>(draft0);
  useEffect(() => setDraft(draft0), [draft0]);
  const [busy, setBusy] = useState(false);
  const numeric = (m: string) => Number(draft[m] || 0);
  const dirty = metrics.some((m) => numeric(m) !== Number(weights[m] ?? 0));
  const sum = metrics.reduce((acc, m) => acc + numeric(m), 0);

  return (
    <>
      <div className="space-y-1">
        {metrics.map((m) => (
          <Row key={m}>
            <span className="text-[11px]">{metricFa(m)}</span>
            <input
              dir="ltr"
              className={`ww-input w-24 !py-0.5 text-left ${numeric(m) < 0 || numeric(m) > 10 ? 'border-danger' : ''}`}
              value={draft[m] ?? ''}
              disabled={!can('settings', true)}
              onChange={(e) => setDraft((d) => ({ ...d, [m]: e.target.value.replace(/[^\d.]/g, '') }))}
            />
          </Row>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2 text-[11px] text-slate-400">
        <span>
          جمع وزن‌ها: <span className={sum > 10.001 ? 'font-bold text-danger' : 'font-bold text-slate-200'}>{fa(sum)}</span> — لازم نیست ۱ باشد؛ سرور هر معیار را روی
          بزرگ‌ترین مقدار نرمال می‌کند.
        </span>
        <Btn
          variant="primary"
          disabled={!can('settings', true) || !dirty}
          loading={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const full: Record<string, number> = {};
              for (const m of metrics) full[m] = Math.min(10, Math.max(0, numeric(m)));
              await api.post('/admin/settings', { ranking_weights: full });
              toast('وزن‌ها ذخیره شد؛ جدول بازمحاسبه شد.', 'ok');
              onSaved();
            } catch (e) {
              toast((e as ApiError).message, 'err');
            } finally {
              setBusy(false);
            }
          }}
        >
          💾 ذخیره کامل
        </Btn>
      </div>
    </>
  );
}

function metricFa(m: string) {
  return ({ treasury: 'خزانه', military_power: 'قدرت نظامی', income: 'درآمد', equipment_count: 'تعداد تجهیزات', war_wins: 'برد در جنگ', economic_score: 'امتیاز اقتصادی' } as Record<string, string>)[m] ?? m;
}

/** branding + starter text shown in the bot */
export function AdminBranding() {
  const { data } = useAdminSettings();
  const b = data?.settings?.branding ?? {};
  const [welcome, setWelcome] = useState<string | null>(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const welcomeText = welcome ?? b.welcomeText ?? '';

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">🏷️ برندینگ و متن‌ها</h1>
      <AdminBlock section="settings" title="متن‌های قابل تنظیم" emoji="🏷️">
        <div className="space-y-2">
          <TextField section="branding" keyName="gameName" label="نام بازی" maxLength={40} value={b.gameName} hint="در هدر مینی‌اپ و /start استفاده می‌شود" />
          <TextField section="branding" keyName="welcomeTitle" label="عنوان خوش‌آمد" maxLength={120} value={b.welcomeTitle} />
          <div>
            <label className="ww-label">متن خوش‌آمد (تا ۱۵۰۰ نویسه — داخل ربات نمایش داده می‌شود)</label>
            <textarea className="ww-input min-h-32" value={welcomeText} maxLength={1500} onChange={(e) => setWelcome(e.target.value)} />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">{fa(welcomeText.length)} / ۱۵۰۰</span>
              <Btn
                variant="primary"
                loading={busy}
                disabled={welcome === null || welcome.trim().length < 1}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await saveSettings({ branding: { welcomeText: welcome!.trim() } });
                    toast('متن خوش‌آمد ذخیره شد.', 'ok');
                    setWelcome(null);
                  } catch (e) {
                    toast((e as ApiError).message, 'err');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                💾 ذخیره متن
              </Btn>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-6 text-slate-500">
          رنگ‌ها، لوگو و فونت در Tailwind (apps/frontend) تعریف شده‌اند و عمداً در دیتابیس نیستند — تغییر ظاهر باید با بازبینی کد و deploy انجام شود، نه با یک فیلد متنی.
        </p>
      </AdminBlock>
    </div>
  );
}

/** POST /api/admin/announcements + statement review queue */
export function AdminBroadcast() {
  const [tab, setTab] = useState<'send' | 'review'>('send');
  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">📣 اطلاع‌رسانی</h1>
      <Tabs items={[{ key: 'send', label: '📤 ارسال اطلاعیه' }, { key: 'review', label: '📜 بازبینی بیانیه‌ها' }]} value={tab} onChange={setTab} />
      {tab === 'send' ? <BroadcastForm /> : <StatementReview />}
    </div>
  );
}

function BroadcastForm() {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [out, setOut] = useState<any | null>(null);

  return (
    <div className="space-y-3">
      <AdminBlock section="statements" title="اطلاعیه سراسری یا برای یک کشور" emoji="📤">
        <div className="space-y-2">
          <label className="block">
            <span className="ww-label">عنوان (۳ تا ۱۲۰ نویسه)</span>
            <input className="ww-input" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className="ww-label">متن (۳ تا ۱۲۰۰ نویسه)</span>
            <textarea className="ww-input min-h-28" value={body} maxLength={1200} onChange={(e) => setBody(e.target.value)} />
          </label>
          <label className="block">
            <span className="ww-label">آی‌دی کشور (اختیاری — خالی = همه)</span>
            <input className="ww-input" dir="ltr" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^\d]/g, ''))} />
          </label>
          <p className="text-[11px] leading-6 text-slate-400">
            اطلاعیه در جدول announcements ذخیره می‌شود و اگر BOT_TOKEN تنظیم شده باشد برای هدف‌ها ارسال
            تلگرامی می‌شود (اگر ارسال ناموفق باشد، اطلاعیه بازم منتشر می‌شود و خطای ارسال در پاسخ می‌آید).
          </p>
          {error ? <p className="text-[11px] text-danger">{error}</p> : null}
          <Btn
            variant="primary"
            loading={busy}
            disabled={title.trim().length < 3 || body.trim().length < 3}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                const res = await api.post('/admin/announcements', {
                  title: title.trim(),
                  body: body.trim(),
                  ...(target ? { targetNationId: Number(target) } : {}),
                });
                setOut(res);
                toast('اطلاعیه منتشر شد.', 'ok');
                setTitle('');
                setBody('');
                setTarget('');
              } catch (e) {
                setError((e as ApiError).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            📤 انتشار اطلاعیه
          </Btn>
        </div>
      </AdminBlock>
      {out ? (
        <Card title="پاسخ سرور" emoji="✅">
          <Grid cols={3}>
            <Stat label="شناسه اطلاعیه" value={fa(out.id ?? 0)} />
            <Stat label="ارسال تلگرام" value={out.delivered === undefined ? '—' : out.delivered ? 'انجام شد' : 'انجام نشد'} tone={out.delivered ? 'ok' : 'warn'} />
            <Stat label="مقیاس" value={target ? 'یک کشور' : 'سراسری'} />
          </Grid>
          <JsonView data={out} label="پاسخ کامل" />
        </Card>
      ) : null}
    </div>
  );
}

function StatementReview() {
  const toast = useToast();
  const [status, setStatus] = useState('pending_review');
  const [q, setQ] = useState('');
  const [note, setNote] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const list = useApi<{ rows: any[]; counts: Record<string, number> }>(`/admin/statements?status=${status}&q=${encodeURIComponent(q)}&limit=30`, [status, q]);
  const rows = list.data?.rows ?? [];
  const counts = list.data?.counts ?? {};

  async function review(id: number, decision: 'approve' | 'reject' | 'remove') {
    setBusy(id);
    try {
      await api.post(`/admin/statements/${id}/review`, { decision, ...(note[String(id)]?.trim() ? { note: note[String(id)].trim() } : {}) });
      toast(decision === 'approve' ? 'بیانیه منتشر شد.' : decision === 'reject' ? 'بیانیه رد شد.' : 'بیانیه حذف شد.', 'ok');
      await list.reload();
    } catch (e) {
      toast((e as ApiError).message, 'err');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <AdminBlock section="statements" write={false}>
        <div className="flex flex-wrap items-center gap-2">
          <select className="ww-input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            {['pending_review', 'all', 'published', 'rejected', 'removed'].map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'همه' : s}</option>
            ))}
          </select>
          <input className="ww-input flex-1" placeholder="جست‌وجو در متن یا نام کشور…" value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="flex gap-1 text-[10px] text-slate-400">
            {Object.entries(counts).map(([k, v]) => (
              <span key={k} className="rounded-full border border-white/10 px-2 py-0.5">
                {k}: {fa(v)}
              </span>
            ))}
          </span>
        </div>
      </AdminBlock>

      {list.loading ? <Loading /> : null}
      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      {!list.loading && rows.length === 0 ? <Empty text="موردی برای بازبینی نیست 🎉" /> : null}

      <div className="space-y-2">
        {rows.map((s: any) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold">
                {s.flag} {s.nationName ?? s.nation_name} · {s.leaderName}
              </span>
              <span className="flex items-center gap-1">
                <Badge tone={s.status === 'pending_review' ? 'warn' : s.status === 'published' ? 'ok' : 'neutral'}>{s.statusLabelFa ?? s.status}</Badge>
                <span className="text-[10px] text-slate-500">{faDateTime(s.createdAt)}</span>
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-[11px] leading-6 text-slate-200">{s.text}</p>
            {s.reviewNote ? <p className="mt-1 text-[10px] text-warn">یادداشت قبلی: {s.reviewNote}</p> : null}
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <input className="ww-input !py-1 text-xs" placeholder="یادداشت مدیر (اختیاری)" value={note[String(s.id)] ?? ''} onChange={(e) => setNote((n) => ({ ...n, [String(s.id)]: e.target.value }))} maxLength={200} />
              <Btn variant="primary" loading={busy === s.id} onClick={() => review(s.id, 'approve')}>✅ تأیید</Btn>
              <Btn loading={busy === s.id} onClick={() => review(s.id, 'reject')}>↩️ رد</Btn>
              {s.status === 'published' ? (
                <Btn variant="danger" loading={busy === s.id} onClick={() => review(s.id, 'remove')}>🗑 حذف از دیوار</Btn>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** feature flags, profile rules, quota guard, maintenance window — plus the raw settings dump */
export function AdminSettings() {
  const { data, loading, error, reload } = useAdminSettings();
  const [tab, setTab] = useState<'flags' | 'profile' | 'quota' | 'raw'>('flags');
  const s = data?.settings ?? {};
  const me = useApi<any>('/admin/me');

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">⚙️ تنظیمات بازی</h1>
      <Tabs items={[{ key: 'flags', label: '🚩 کلیدها' }, { key: 'profile', label: '👤 پروفایل' }, { key: 'quota', label: '📈 سهمیه' }, { key: 'raw', label: '🧾 خام' }]} value={tab} onChange={setTab} />
      {loading ? <Loading /> : null}
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}

      {tab === 'flags' ? (
        <AdminBlock section="settings" title="Feature flags" emoji="🚩">
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            هر کلید هم در API و هم در ربات رعایت می‌شود؛ مثلاً با خاموش‌کردن warEnabled هیچ درخواست جنگ تازه‌ای ثبت نمی‌شود اما جنگ‌های جاری تا پایان می‌روند.
          </p>
          <div className="space-y-1">
            <BoolField section="feature_flags" keyName="miniAppEnabled" label="مینی‌اپ فعال" hint="خاموش = صفحه‌ی «به‌زودی» برای بازیکن" value={s.features?.miniAppEnabled} onSaved={reload} />
            <BoolField section="feature_flags" keyName="shopEnabled" label="فروشگاه" value={s.features?.shopEnabled} onSaved={reload} />
            <BoolField section="feature_flags" keyName="warEnabled" label="جنگ" value={s.features?.warEnabled} onSaved={reload} />
            <BoolField section="feature_flags" keyName="diplomacyEnabled" label="دیپلماسی" value={s.features?.diplomacyEnabled} onSaved={reload} />
            <BoolField section="feature_flags" keyName="statementsEnabled" label="بیانیه‌ها" value={s.features?.statementsEnabled} onSaved={reload} />
            <BoolField section="feature_flags" keyName="statementsRequireApproval" label="بیانیه نیاز به تأیید مدیر دارد" value={s.features?.statementsRequireApproval} onSaved={reload} />
            <BoolField section="feature_flags" keyName="attacksRequireVictimApproval" label="حمله نیاز به پذیرش حریف دارد" hint="روشن = جنگ فقط بعد از accept شروع می‌شود" value={s.features?.attacksRequireVictimApproval} onSaved={reload} />
          </div>
        </AdminBlock>
      ) : null}

      {tab === 'profile' ? (
        <AdminBlock section="settings" title="قواعد پروفایل کشور" emoji="👤">
          <div className="space-y-1">
            <NumField section="profile_rules" keyName="renameCooldownSeconds" label="قفل تغییر نام کشور (ثانیه)" value={s.profile?.renameCooldownSeconds} onSaved={reload} />
            <NumField section="profile_rules" keyName="leaderRenameCooldownSeconds" label="قفل تغییر نام رهبر" value={s.profile?.leaderRenameCooldownSeconds} onSaved={reload} />
            <NumField section="profile_rules" keyName="flagChangeCooldownSeconds" label="قفل تغییر پرچم" value={s.profile?.flagChangeCooldownSeconds} onSaved={reload} />
            <NumField section="profile_rules" keyName="maxNationsPerUser" label="حداکثر کشور هر کاربر" min={1} max={20} value={s.profile?.maxNationsPerUser} onSaved={reload} />
          </div>
        </AdminBlock>
      ) : null}

      {tab === 'quota' ? (
        <AdminBlock section="settings" title="نگهبان سهمیه" emoji="📈">
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            این مقادیر رفتار محافظتی را تنظیم می‌کنند؛ عدد مصرف واقعی را از پنل «سهمیه» ببینید. اگر کران متوقف شود، فقط با زدن دکمه ادامه (یا بالا بردن سقف) از سر گرفته
            می‌شود.
          </p>
          <div className="space-y-1">
            <NumField section="quota_guard" keyName="d1RowsDailySoftLimit" label="سقف نرم ردیف D1 در روز" value={s.quota?.d1RowsDailySoftLimit} onSaved={reload} />
            <NumField section="quota_guard" keyName="cronFailuresBeforePause" label="شکست‌های متوالی تا توقف کران" min={1} value={s.quota?.cronFailuresBeforePause} onSaved={reload} />
            <NumField section="quota_guard" keyName="warnAtPercent" label="درصد هشدار" min={1} max={100} value={s.quota?.warnAtPercent} onSaved={reload} />
          </div>
        </AdminBlock>
      ) : null}

      {tab === 'raw' ? (
        <>
          <Card title="مجوزهای خودتان" emoji="🔐">
            <div className="flex flex-wrap gap-1">
              {(me.data?.sections ?? ADMIN_SECTIONS).map((row: any) => (
                <span key={row.section} className="rounded-full border border-white/10 px-2 py-0.5 text-[10px]">
                  {row.section}: {row.read ? '👁' : '—'} {row.write ? '✏️' : ''}
                </span>
              ))}
            </div>
          </Card>
          <Card title="bundle کامل تنظیمات" emoji="🧾">
            <JsonView data={data} label="GET /api/admin/settings" />
          </Card>
        </>
      ) : null}
    </div>
  );
}
