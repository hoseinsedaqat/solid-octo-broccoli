import { useState } from 'react';
import { api, authHeaders } from '../../api';
import { useApi, useAuth } from '../../auth';
import { useRouter } from '../../router';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Row, Stat, Tabs, fa, faDateTime, faMoney } from '../../ui';
import { AdminBlock, JsonView, RawTable } from './shared';

const JOB_LABELS_FA: Record<string, string> = {
  revenue: 'پرداخت درآمد',
  wars: 'راندهای جنگ',
  war_expiry: 'پایان جنگ‌های معوق',
  diplomacy_expiry: 'انقضای درخواست‌ها',
  ranking: 'رتبه‌بندی',
  housekeeping: 'نگهداری داده',
  backup: 'پشتیبان روزانه',
};

/** GET /api/admin/overview → { counters, dataQuality, recentTransactions, recentAudit, jobs } */
export function AdminOverview() {
  const { navigate } = useRouter();
  const ov = useApi<any>('/admin/overview');
  if (ov.loading) return <Loading />;
  if (ov.error) return <ErrorBox message={ov.error} onRetry={ov.reload} />;
  const c = ov.data?.counters ?? {};
  const dq = ov.data?.dataQuality ?? {};

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-extrabold">داشبورد</h1>
        <div className="flex gap-1">
          <Btn variant="ghost" onClick={() => navigate('/app/admin/jobs')}>
            ⏱️ کران
          </Btn>
          <Btn variant="ghost" onClick={() => void ov.reload()}>
            🔄
          </Btn>
        </div>
      </div>

      <Card title="جمعیت بازی" emoji="👥">
        <Grid cols={4}>
          <Stat label="کاربران" value={fa(c.users)} hint={`${fa(c.activeUsers)} فعال`} />
          <Stat label="ورود ۲۴ ساعت" value={fa(c.usersLast24h)} hint={`۷ روز: ${fa(c.usersLast7d)}`} />
          <Stat label="کشورها" value={fa(c.nations)} hint={`${fa(c.activeNations)} فعال · ${fa(c.newNations24h)} جدید`} />
          <Stat label="مدیران" value={fa(c.admins)} tone={c.admins ? 'ok' : 'warn'} />
        </Grid>
      </Card>

      <Card title="اقتصاد کل" emoji="💰">
        <Grid cols={4}>
          <Stat label="مجموع خزانه‌ها" value={faMoney(c.totalTreasury)} />
          <Stat label="ناخالص هر چرخه" value={faMoney(c.totalIncomePerCycle)} />
          <Stat label="خالص هر چرخه" value={faMoney(c.totalNetIncomePerCycle)} tone="ok" />
          <Stat label="تراکنش ۲۴ ساعت" value={fa(c.transactionsLast24h)} hint={`کل: ${fa(c.transactions)}`} />
        </Grid>
      </Card>

      <Card title="جنگ و دیپلماسی" emoji="⚔️">
        <Grid cols={4}>
          <Stat label="جنگ فعال" value={fa(c.activeWars)} tone={c.activeWars ? 'warn' : undefined} hint={`${fa(c.nationsAtWar)} کشور درگیر`} />
          <Stat label="جنگ تمام‌شده" value={fa(c.endedWars)} />
          <Stat label="درخواست دیپلماتیک باز" value={fa(c.pendingRequests)} tone={c.pendingRequests ? 'warn' : undefined} />
          <Stat label="اتحاد فعال" value={fa(c.alliances)} />
        </Grid>
      </Card>

      <Card title="کارهای در انتظار مدیر" emoji="📋">
        <div className="space-y-1">
          <Row active={Number(c.pendingStatements) > 0} onClick={() => navigate('/app/admin/settings')}>
            <span className="text-xs">📜 بیانیه‌های در انتظار بازبینی</span>
            <Badge tone={c.pendingStatements ? 'warn' : 'neutral'}>{fa(c.pendingStatements)}</Badge>
          </Row>
          <Row onClick={() => navigate('/app/admin/equipment')}>
            <span className="text-xs">🏷️ تجهیزات بدون قیمت</span>
            <Badge tone={dq.unpricedEquipment ? 'warn' : 'ok'}>{fa(dq.unpricedEquipment ?? 0)}</Badge>
          </Row>
          <Row>
            <span className="text-xs">🔔 اعلان خوانده‌نشده</span>
            <Badge tone="neutral">{fa(c.unreadNotifications)}</Badge>
          </Row>
        </div>
        {dq.duplicateNames?.length ? (
          <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="text-[11px] leading-5 text-slate-400">{dq.hint}</p>
            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-300">
              {dq.duplicateNames.slice(0, 6).map((d: any) => (
                <li key={d.nameFa}>
                  • {d.nameFa} — {fa(d.occurrences)}بار در {d.categoryKeys.join('، ')}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <Card title="وضعیت کران (job_checkpoints)" emoji="⏱️" right={<Btn variant="ghost" onClick={() => navigate('/app/admin/jobs')}>اجرای دستی</Btn>}>
        {(ov.data?.jobs ?? []).length === 0 ? <Empty text="هنوز هیچ job checkpoint ثبت نشده؛ اولین اجرای کران این جدول را پر می‌کند." /> : null}
        <div className="space-y-1">
          {(ov.data?.jobs ?? []).map((j: any) => (
            <Row key={j.jobKey}>
              <span className="text-xs">{JOB_LABELS_FA[j.jobKey] ?? j.jobKey}</span>
              <span className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>cursor {fa(j.cursor)}</span>
                <span>{fa(j.rowsProcessed)} ردیف</span>
                {j.lastError ? <Badge tone="bad">خطا</Badge> : <Badge tone="ok">سالم</Badge>}
                <span className="text-[10px]">{faDateTime(j.updatedAt)}</span>
              </span>
            </Row>
          ))}
        </div>
      </Card>

      <Card title="آخرین تراکنش‌ها" emoji="🧾">
        <RawTable
          rows={ov.data?.recentTransactions}
          columns={[
            { key: 'flag', label: '' },
            { key: 'nation', label: 'کشور' },
            { key: 'type', label: 'نوع' },
            { key: 'amount', label: 'مبلغ', render: (v) => <span className={Number(v) >= 0 ? 'text-ok' : 'text-danger'}>{faMoney(Number(v))}</span> },
            { key: 'createdAt', label: 'زمان', render: (v) => faDateTime(String(v)) },
          ]}
        />
      </Card>

      <Card title="آخرین اقدامات مدیران" emoji="🕵️">
        <RawTable
          rows={ov.data?.recentAudit}
          columns={[
            { key: 'action', label: 'عملیات' },
            { key: 'targetType', label: 'هدف' },
            { key: 'targetId', label: '#', render: (v) => fa(Number(v ?? 0)) },
            { key: 'reason', label: 'دلیل' },
            { key: 'createdAt', label: 'زمان', render: (v) => faDateTime(String(v)) },
          ]}
        />
        <div className="mt-2">
          <Btn variant="ghost" onClick={() => navigate('/app/admin/audit')}>
            Audit Log کامل
          </Btn>
        </div>
      </Card>
    </div>
  );
}

/** GET /api/admin/quota — measured counters only, with the "not measurable" block shown honestly */
export function AdminQuota() {
  const q = useApi<any>('/admin/quota');
  const data = q.data;
  return (
    <AdminBlock section="quota" write={false} title="سهمیه پلن رایگان" emoji="📈" right={<Btn variant="ghost" onClick={() => void q.reload()}>🔄</Btn>}>
      {q.loading ? <Loading /> : null}
      {q.error ? <ErrorBox message={q.error} onRetry={q.reload} /> : null}
      {data ? (
        <div className="space-y-3">
          <Grid cols={3}>
            <Stat label="درخواست Worker امروز" value={fa(data.measured.apiRequests)} hint={`سقف ${fa(data.limits.workerRequestsPerDay)} · ${fa(data.usagePercent.requests)}٪`} tone={data.usagePercent.requests > 80 ? 'bad' : data.usagePercent.requests > 55 ? 'warn' : 'ok'} />
            <Stat label="ردیف خوانده‌شده D1" value={fa(data.measured.d1RowsRead)} hint={`سقف ${fa(data.limits.d1RowsReadPerDay)} · ${fa(data.usagePercent.d1RowsRead)}٪`} tone={data.usagePercent.d1RowsRead > 80 ? 'bad' : 'warn'} />
            <Stat label="ردیف نوشته‌شده D1" value={fa(data.measured.d1RowsWritten)} hint={`سقف ${fa(data.limits.d1RowsWrittenPerDay)} · ${fa(data.usagePercent.d1RowsWritten)}٪`} />
          </Grid>
          <Grid cols={4}>
            <Stat label="بروزرسانی ربات" value={fa(data.measured.botUpdates)} />
            <Stat label="اجرای کران" value={fa(data.measured.cronRuns)} />
            <Stat label="خطاها" value={fa(data.measured.errors)} tone={data.measured.errors ? 'bad' : 'ok'} />
            <Stat label="روز" value={String(data.day)} />
          </Grid>

          {data.warnings?.length ? (
            <div className="space-y-1">
              {data.warnings.map((w: string) => (
                <p key={w} className="rounded-xl border border-warn/40 bg-warn/10 p-2 text-[11px] leading-5 text-warn">
                  ⚠️ {w}
                </p>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-ok/40 bg-ok/10 p-2 text-[11px] text-ok">✅ هنوز هیچ‌کدام از سقف‌های هشدار لمس نشده است.</p>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="text-[11px] font-bold text-slate-300">چیزهایی که از داخل Worker قابل اندازه‌گیری نیستند</p>
            <p className="mt-1 text-[11px] leading-6 text-slate-400">{data.notMeasured.note}</p>
            <div className="mt-1 flex gap-2 text-[11px] text-slate-500">
              <span>CPU: {data.notMeasured.cpuMs === null ? 'نامشخص' : data.notMeasured.cpuMs}</span>
              <span>حجم DB: {data.notMeasured.databaseBytes === null ? 'نامشخص' : fa(data.notMeasured.databaseBytes)}</span>
              <span>حافظه: {data.notMeasured.memory === null ? 'نامشخص' : data.notMeasured.memory}</span>
            </div>
          </div>

          <RawTable
            rows={data.history}
            columns={[
              { key: 'day', label: 'روز' },
              { key: 'api_requests', label: 'درخواست', render: (v) => fa(Number(v)) },
              { key: 'bot_updates', label: 'ربات', render: (v) => fa(Number(v)) },
              { key: 'cron_runs', label: 'کران', render: (v) => fa(Number(v)) },
              { key: 'db_reads_est', label: 'خواندن D1', render: (v) => fa(Number(v)) },
              {
                key: 'errors',
                label: 'خطا',
                render: (v) => <span className={Number(v) > 0 ? 'text-danger' : ''}>{fa(Number(v))}</span>,
              },
            ]}
            empty="هنوز snapshot روزانه‌ای ثبت نشده است."
          />
          <JsonView data={data.limits} label="سقف‌های ثبت‌شده در تنظیمات" />
        </div>
      ) : null}
    </AdminBlock>
  );
}

/** POST /api/admin/jobs/run + export/restore via the backup endpoints */
export function AdminJobs() {
  const { can } = useAuth();
  const [tab, setTab] = useState<'jobs' | 'backup'>('jobs');
  const [selected, setSelected] = useState<string[]>(['wars', 'ranking']);
  const [result, setResult] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tables = useApi<{ tables: string[] }>('/admin/backup/tables');
  const runs = useApi<{ runs: any[] }>('/admin/backup/runs');
  const [pickedTables, setPickedTables] = useState<string[]>([]);

  const jobs = ['wars', 'war_expiry', 'diplomacy_expiry', 'ranking', 'housekeeping'];
  // the endpoint itself is guarded by requireAdmin('settings', true) — same section as the schedule
  const canWrite = can('settings', true);

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">کران و پشتیبان</h1>
      <Tabs items={[{ key: 'jobs', label: '⏱️ اجرای دستی job' }, { key: 'backup', label: '💾 پشتیبان / بازگردانی' }]} value={tab} onChange={setTab} />

      {tab === 'jobs' ? (
        <AdminBlock section="settings" title="اجرای دستی مشاغل زمان‌بندی‌شده" emoji="⏱️">
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            cron Worker هر ۳۰ دقیقه اجرا می‌شود؛ این فرم همان توابع را با همان قواعد (cursor، idempotency، سقف چرخه جبرانی) همین حالا اجرا می‌کند. برای تست «گذر زمان»
            می‌توانید revenue را چند بار بزنید — چرخه‌های تکراری مبلغ دوباره ایجاد نمی‌کنند.
          </p>
          <div className="flex flex-wrap gap-1">
            {jobs.map((j) => (
              <button key={j} className={`ww-tab ${selected.includes(j) ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setSelected((s) => (s.includes(j) ? s.filter((x) => x !== j) : [...s, j]))}>
                {JOB_LABELS_FA[j] ?? j}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Btn
              variant="primary"
              disabled={!canWrite || selected.length === 0}
              loading={busy}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  setResult(await api.post('/admin/jobs/run', { jobs: selected }));
                } catch (e) {
                  setError((e as Error).message);
                  setResult(null);
                } finally {
                  setBusy(false);
                }
              }}
            >
              ▶️ اجرای {fa(selected.length)} شغل
            </Btn>
            {!canWrite ? <span className="text-[11px] text-warn">مجوز نوشتن بخش jobs را ندارید.</span> : null}
          </div>
          {error ? <p className="mt-2 text-[11px] text-danger">{error}</p> : null}
          {result ? (
            <div className="mt-2 space-y-1">
              <p className="text-[11px] text-slate-400">
                زمان اجرا {faDateTime(new Date(Number(result.finishedAt) * 1000).toISOString())} · {fa((result.jobs ?? []).filter((r: any) => r.ok).length)}/{fa((result.jobs ?? []).length)} موفق
                {result.skipped ? <span className="text-warn"> · رد شد: {String(result.skipped)}</span> : null}
              </p>
              {(result.jobs ?? []).map((r: any) => (
                <div key={r.job} className="rounded-xl border border-white/10 bg-white/5 p-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{JOB_LABELS_FA[r.job] ?? r.job}</span>
                    <Badge tone={r.ok ? 'ok' : 'bad'}>{r.ok ? 'موفق' : 'خطا'}</Badge>
                  </div>
                  <p className="mt-1 text-slate-400">{String(r.detail ?? '')}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{fa(r.processed)} ردیف/مورد پردازش شد</p>
                </div>
              ))}
              <JsonView data={result} label="پاسخ کامل" />
            </div>
          ) : null}
        </AdminBlock>
      ) : (
        <>
          <AdminBlock section="backup" title="خروجی JSON" emoji="⬇️">
            <p className="mb-2 text-[11px] leading-6 text-slate-400">
              جدول‌های بازی به‌صورت JSON دانلود می‌شوند تا با <code className="text-gold-soft">wrangler d1 execute</code> در D1 محلی یا ابری بازیابی شوند. اگر چیزی انتخاب
              نشود، کل پشتیبان کامل گرفته می‌شود.
            </p>
            <div className="flex flex-wrap gap-1">
              {(tables.data?.tables ?? []).map((t) => (
                <button
                  key={t}
                  className={`ww-tab ${pickedTables.includes(t) ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`}
                  onClick={() => setPickedTables((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Btn
                variant="primary"
                onClick={async () => {
                  const qs = pickedTables.length ? `?tables=${pickedTables.join(',')}` : '';
                  const res = await fetch(`/api/admin/backup/export${qs}`, { headers: authHeaders() });
                  if (!res.ok) {
                    setError(`خطا در خروجی (${res.status})`);
                    return;
                  }
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `world-war-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  await runs.reload();
                }}
              >
                ⬇️ دانلود خروجی {pickedTables.length ? `(${fa(pickedTables.length)})` : 'کامل'}
              </Btn>
              <Btn
                loading={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    const res = await fetch('/api/admin/backup/export', { headers: authHeaders() });
                    const json = await res.json();
                    const dump = JSON.stringify(json, null, 2);
                    await navigator.clipboard.writeText(dump);
                    setError('به کلیپ‌بورد کپی شد (در مرورگرهایی که اجازه دهند).');
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                📋 کپی JSON
              </Btn>
            </div>
            {error ? <p className="mt-2 text-[11px] text-warn">{error}</p> : null}
          </AdminBlock>

          <AdminBlock section="backup" title="بازگردانی از JSON" emoji="⬆️">
            <RestoreForm onDone={() => void runs.reload()} />
          </AdminBlock>

          <AdminBlock section="backup" write={false} title="سابقه عملیات" emoji="🗂️">
            <RawTable
              rows={runs.data?.runs}
              columns={[
                { key: 'createdAt', label: 'زمان', render: (v) => faDateTime(String(v)) },
                { key: 'action', label: 'عملیات' },
                { key: 'reason', label: 'یادداشت' },
              ]}
              empty="هنوز عملیات پشتیبانی ثبت نشده است."
            />
          </AdminBlock>
        </>
      )}
    </div>
  );
}

function RestoreForm({ onDone }: { onDone: () => void }) {
  const [json, setJson] = useState('');
  const [force, setForce] = useState(false);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <p className="text-[11px] leading-6 text-slate-400">
        فایل خروجی را اینجا بچسبانید. تا وقتی کشور یا تراکنشی وجود دارد، سرور بازگردانی را بدون force رد می‌کند — این عمدی است تا اشتباهی داده زنده پاک نشود.
      </p>
      <textarea className="ww-input min-h-28 font-mono text-[10px]" dir="ltr" value={json} onChange={(e) => setJson(e.target.value)} placeholder='{"meta":{...},"data":{"users":[...]}}' />
      <label className="flex items-center gap-2 text-[11px] text-slate-300">
        <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
        force: بازنویسی حتی اگر دیتابیس خالی نباشد
      </label>
      <div className="flex items-center gap-2">
        <Btn
          variant="danger"
          loading={busy}
          disabled={json.trim().length < 20}
          onClick={async () => {
            setBusy(true);
            setOut(null);
            try {
              const parsed = JSON.parse(json);
              const res = await api.post('/admin/backup/restore', { data: parsed.data ?? parsed, force });
              setOut(JSON.stringify(res));
              onDone();
            } catch (e) {
              setOut((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          ⬆️ بازگردانی
        </Btn>
      </div>
      {out ? <pre dir="ltr" className="max-h-40 overflow-auto rounded-xl bg-black/40 p-2 text-[10px] text-slate-300">{out}</pre> : null}
    </div>
  );
}
