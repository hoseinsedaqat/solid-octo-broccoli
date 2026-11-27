import { useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Modal, Row, Stat, Tabs, fa, faDateTime, faMoney, useToast } from '../../ui';
import { NationSearchSelect } from '../../components/nations';
import { DIPLOMACY_KIND_LABELS_FA, MAX_STATEMENT_CHARS, MIN_STATEMENT_CHARS, NAV_TITLES, RANKING_LABELS_FA, RELATION_LABELS_FA, STATEMENT_STATUS_LABELS_FA } from './meta';

/* -------------------------------- ranking -------------------------------- */

export function RankingPage() {
  const { me } = useAuth();
  const [metric, setMetric] = useState('total');
  const rank = useApi<{ metric: string; rows: any[]; available: string[]; weights: Record<string, number> }>(`/social/rankings?limit=50&metric=${metric}`, [metric]);
  const mine = me?.activeNationId ?? null;
  const rows = rank.data?.rows ?? [];
  const podium = rows.slice(0, 3);

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.rankings}</h1>

      <Card title="پودیوم" emoji="🥇">
        <Grid cols={3}>
          {podium.map((r: any, i: number) => (
            <Stat
              key={r.nationId}
              label={`${['🥇', '🥈', '🥉'][i]} رتبه ${fa(r.rank)}`}
              value={`${r.flag} ${r.name}`}
              hint={`امتیاز ${fa(r.score)}`}
              tone={i === 0 ? 'ok' : undefined}
            />
          ))}
          {podium.length === 0 ? <Empty text="هنوز رتبه‌ای محاسبه نشده است." /> : null}
        </Grid>
      </Card>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {(rank.data?.available ?? ['total', ...Object.keys(RANKING_LABELS_FA)]).map((m) => (
          <button key={m} className={`ww-tab ${metric === m ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setMetric(m)}>
            {m === 'total' ? 'مجموع' : (RANKING_LABELS_FA as Record<string, string>)[m] ?? m}
            {rank.data?.weights?.[m] !== undefined ? <span className="mr-1 text-[10px] text-slate-500">وزن {fa(rank.data.weights[m])}</span> : null}
          </button>
        ))}
      </div>

      <Card title="جدول جهانی" emoji="🌍">
        {rank.loading ? <Loading /> : null}
        {rank.error ? <ErrorBox message={rank.error} onRetry={rank.reload} /> : null}
        <div className="space-y-1">
          {rows.map((r: any) => (
            <Row key={r.nationId} active={mine === r.nationId}>
              <span className="flex min-w-0 items-center gap-2 text-xs">
                <span className="w-8 shrink-0 text-slate-400">{fa(r.rank)}</span>
                <span className="shrink-0">{r.flag}</span>
                <span className="truncate font-semibold">{r.name}</span>
                {mine === r.nationId ? <Badge tone="ok">شما</Badge> : null}
              </span>
              <span className="shrink-0 text-[11px] text-slate-400">
                {fa(r.score)} · {metric === 'total' ? 'امتیاز کل' : (RANKING_LABELS_FA as Record<string, string>)[metric] ?? metric}
              </span>
            </Row>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          رتبه‌ها در کران پس‌زمینه (rankingJob) بازنویسی می‌شوند؛ اعداد اینجا دقیقاً همان مقدار ذخیره‌شده در nations.total_score / world_rank است.
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------- diplomacy ------------------------------- */

const REQUEST_KINDS = ['friendship', 'alliance', 'non_aggression', 'message'] as const;

export function FriendsPage() {
  const { me } = useAuth();
  const toast = useToast();
  const relations = useApi<{ relations: any[] }>('/diplomacy/relations');
  const requests = useApi<{ incoming: any[]; outgoing: any[] }>('/diplomacy/requests');
  const alliance = useApi<{ alliance: any }>('/diplomacy/alliance');
  const [tab, setTab] = useState<'relations' | 'incoming' | 'outgoing' | 'alliance'>('relations');
  const [modal, setModal] = useState<{ kind: (typeof REQUEST_KINDS)[number] } | null>(null);
  const [message, setMessage] = useState('');
  const [allianceName, setAllianceName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rel = relations.data?.relations ?? [];
  const friends = rel.filter((r: any) => ['friend', 'ally', 'peace_treaty', 'negotiating'].includes(r.status));
  const enemies = rel.filter((r: any) => r.status === 'enemy');
  const incoming = requests.data?.incoming ?? [];
  const outgoing = requests.data?.outgoing ?? [];

  async function decide(id: number, accept: boolean) {
    setBusy(true);
    setError(null);
    try {
      await api.post(`/diplomacy/request/${id}/decide`, { accept });
      toast(accept ? 'درخواست پذیرفته شد.' : 'درخواست رد شد.', 'ok');
      await Promise.all([requests.reload(), relations.reload(), alliance.reload()]);
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  async function send(targetId: number) {
    if (!modal) return;
    setBusy(true);
    setError(null);
    try {
      await api.post('/diplomacy/request', {
        toNationId: targetId,
        kind: modal.kind,
        ...(message.trim() ? { message: message.trim() } : {}),
        ...(modal.kind === 'alliance' && allianceName.trim() ? { allianceName: allianceName.trim() } : {}),
      });
      toast('درخواست ارسال شد.', 'ok');
      setModal(null);
      setMessage('');
      setAllianceName('');
      await requests.reload();
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.diplomacy}</h1>

      <Grid cols={4}>
        <Stat label="دوستان/متحدان" value={fa(friends.length)} tone="ok" />
        <Stat label="دشمنان" value={fa(enemies.length)} tone="bad" />
        <Stat label="درخواست‌های شما" value={fa(incoming.length)} tone={incoming.length ? 'warn' : undefined} />
        <Stat label="ارسالی‌ها" value={fa(outgoing.length)} />
      </Grid>

      <Tabs
        items={[
          { key: 'relations', label: '🌐 روابط', badge: incoming.length },
          { key: 'incoming', label: `📥 درخواست‌ها (${fa(incoming.length)})` },
          { key: 'outgoing', label: '📤 ارسالی‌ها' },
          { key: 'alliance', label: '🤝 اتحاد' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {error ? <ErrorBox message={error} /> : null}

      {tab === 'relations' ? (
        <Card title="روابط دیپلماتیک" emoji="🌐">
          {relations.loading ? <Loading /> : null}
          {rel.length === 0 && !relations.loading ? <Empty text="هنوز رابطه‌ای ثبت نشده؛ از طریق درخواست دوستی شروع کنید." /> : null}
          <div className="space-y-1">
            {rel.map((r: any) => (
              <Row key={r.otherNationId}>
                <span className="flex min-w-0 items-center gap-2 text-xs">
                  <span>{r.otherFlag}</span>
                  <span className="truncate font-semibold">{r.otherNationName}</span>
                  <Badge tone={r.status === 'enemy' ? 'bad' : r.status === 'ally' ? 'ok' : r.status === 'friend' ? 'ok' : 'neutral'}>
                    {r.statusLabelFa ?? (RELATION_LABELS_FA as Record<string, string>)[r.status] ?? r.status}
                  </Badge>
                  {r.allianceName ? <span className="text-[10px] text-steel">🤝 {r.allianceName}</span> : null}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <span className="text-[10px] text-slate-500">{faDateTime(r.since)}</span>
                  {['friend', 'ally', 'enemy'].includes(r.status) ? (
                    <Btn
                      variant="ghost"
                      loading={busy}
                      onClick={async () => {
                        if (!window.confirm(`رابطه با ${r.otherNationName} قطع شود؟`)) return;
                        setBusy(true);
                        try {
                          await api.post('/diplomacy/dissolve', { otherNationId: r.otherNationId });
                          toast('رابطه به حالت خنثی برگشت.', 'ok');
                          await relations.reload();
                        } catch (e) {
                          setError((e as ApiError).message);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      قطع رابطه
                    </Btn>
                  ) : null}
                </span>
              </Row>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {REQUEST_KINDS.map((k) => (
              <Btn key={k} variant={k === 'friendship' ? 'primary' : 'default'} onClick={() => setModal({ kind: k })}>
                ➕ {DIPLOMACY_KIND_LABELS_FA[k as keyof typeof DIPLOMACY_KIND_LABELS_FA] ?? k}
              </Btn>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'incoming' ? (
        <Card title="درخواست‌های ورودی" emoji="📥">
          {incoming.length === 0 && !requests.loading ? <Empty text="درخواستی نرسیده است." /> : null}
          <div className="space-y-2">
            {incoming.map((q: any) => (
              <div key={q.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 text-xs font-bold">
                    {q.from_flag} {q.from_name ?? q.fromNationName}
                    <Badge tone="warn">{DIPLOMACY_KIND_LABELS_FA[q.kind as keyof typeof DIPLOMACY_KIND_LABELS_FA] ?? q.kind}</Badge>
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-500">
                    {q.expires_at ?? q.expiresAt ? `اعتتا تا ${faDateTime(isoOf(q.expires_at ?? q.expiresAt))}` : ''}
                  </span>
                </div>
                {q.message ? <p className="mt-1 text-[11px] leading-5 text-slate-400">{q.message}</p> : null}
                {q.alliance_name ?? q.allianceName ? <p className="mt-1 text-[11px] text-steel">نام اتحاد پیشنهادی: {q.alliance_name ?? q.allianceName}</p> : null}
                <div className="mt-2 flex gap-2">
                  <Btn variant="primary" loading={busy} onClick={() => decide(Number(q.id), true)}>
                    پذیرش
                  </Btn>
                  <Btn variant="danger" loading={busy} onClick={() => decide(Number(q.id), false)}>
                    رد
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'outgoing' ? (
        <Card title="درخواست‌های ارسالی" emoji="📤">
          {outgoing.length === 0 && !requests.loading ? <Empty text="درخواستی نفرستاده‌اید." /> : null}
          <div className="space-y-1">
            {outgoing.map((q: any) => (
              <Row key={q.id}>
                <span className="flex min-w-0 items-center gap-2 text-xs">
                  {q.to_flag} {q.to_name ?? q.toNationName}
                  <Badge tone="info">{DIPLOMACY_KIND_LABELS_FA[q.kind as keyof typeof DIPLOMACY_KIND_LABELS_FA] ?? q.kind}</Badge>
                </span>
                <span className="flex items-center gap-2 text-[10px] text-slate-500">
                  {q.status}
                  <Btn
                    variant="ghost"
                    loading={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api.post(`/diplomacy/request/${q.id}/cancel`);
                        toast('درخواست لغو شد.', 'ok');
                        await requests.reload();
                      } catch (e) {
                        setError((e as ApiError).message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    لغو
                  </Btn>
                </span>
              </Row>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'alliance' ? (
        <Card title="اتحاد" emoji="🤝">
          {alliance.data?.alliance ? (
            <div className="space-y-2">
              <div className="rounded-xl border border-steel/40 bg-steel/10 p-3">
                <div className="text-sm font-bold text-steel">{alliance.data.alliance.name}</div>
                <p className="mt-1 text-[11px] text-slate-400">
                  عضو از {faDateTime(alliance.data.alliance.createdAt ?? alliance.data.alliance.created_at)} · اعضا: {fa(alliance.data.alliance.memberCount ?? (alliance.data.alliance.members ?? []).length)}
                </p>
              </div>
              {(alliance.data.alliance.members ?? []).map((m: any) => (
                <Row key={m.nationId ?? m.nation_id}>
                  <span className="text-xs">
                    {m.flag} {m.name ?? m.nationName}
                  </span>
                  <span className="text-[10px] text-slate-500">{m.role === 'leader' ? 'بنیان‌گذار' : 'عضو'}</span>
                </Row>
              ))}
              <Btn
                variant="danger"
                loading={busy}
                onClick={async () => {
                  if (!window.confirm('از اتحاد خارج شوید؟')) return;
                  setBusy(true);
                  try {
                    await api.post('/diplomacy/alliance/leave');
                    toast('از اتحاد خارج شدید.', 'ok');
                    await alliance.reload();
                    await relations.reload();
                  } catch (e) {
                    setError((e as ApiError).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                خروج از اتحاد
              </Btn>
            </div>
          ) : (
            <Empty text="شما عضو هیچ اتحادی نیستید. برای ساخت اتحاد، به کشور دوست درخواست اتحاد بفرستید." action={<Btn onClick={() => setTab('relations')}>درخواست اتحاد</Btn>} />
          )}
        </Card>
      ) : null}

      <Modal open={modal !== null} title={modal ? (DIPLOMACY_KIND_LABELS_FA[modal.kind as keyof typeof DIPLOMACY_KIND_LABELS_FA] ?? 'درخواست') : ''} onClose={() => setModal(null)}>
        {modal ? (
          <div className="space-y-3">
            <NationSearchSelect excludeId={me?.activeNationId ?? null} onPick={(n) => void send(n.id)} />
            <div>
              <label className="ww-label">پیام همراه درخواست (اختیاری)</label>
              <textarea className="ww-input min-h-20" maxLength={600} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="متن کوتاه برای حریف…" />
            </div>
            {modal.kind === 'alliance' ? (
              <div>
                <label className="ww-label">نام اتحاد (۳ تا ۴۰ نویسه)</label>
                <input className="ww-input" value={allianceName} onChange={(e) => setAllianceName(e.target.value)} placeholder="مثلاً پیمان صلح خاورمیانه" />
              </div>
            ) : null}
            <p className="text-[11px] leading-5 text-slate-500">
              انتخاب کشور از طریق جست‌وجوی سرور انجام می‌شود؛ فهرستی از همه کشورها در مرورگر نگه داشته نمی‌شود.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

/** the API sends ISO strings for *_at fields on mapped rows, unix seconds on raw rows */
function isoOf(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return new Date(value * 1000).toISOString();
  return String(value);
}

/* ------------------------------- statements ------------------------------ */

export function StatementsPage() {
  const { me } = useAuth();
  const toast = useToast();
  const mine = useApi<{ statements: any[] }>('/statements');
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{ preview: string; chars: number; signature: string; needsApproval: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chars = text.trim().length;
  const nationId = me?.activeNationId ?? null;
  const wall = useApi<{ rows: any[] }>(nationId ? `/statements/published/${nationId}` : null, [nationId]);

  async function doPreview() {
    setBusy(true);
    setError(null);
    try {
      setPreview(await api.post('/statements/preview', { text }));
    } catch (e) {
      setError((e as ApiError).message);
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ statusLabelFa: string; statementId: number }>('/statements', { text });
      toast(res.statusLabelFa ? `بیانیه ثبت شد: ${res.statusLabelFa}` : 'بیانیه ثبت شد.', 'ok');
      setText('');
      setPreview(null);
      await Promise.all([mine.reload(), wall.reload()]);
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.statements}</h1>

      <Card title="بیانیه جدید" emoji="📣">
        <textarea
          className="ww-input min-h-32"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setPreview(null);
          }}
          maxLength={MAX_STATEMENT_CHARS}
          placeholder="متن بیانیه رسمی… (بدون HTML و بدون لینک)"
        />
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className={chars < MIN_STATEMENT_CHARS || chars > MAX_STATEMENT_CHARS ? 'text-danger' : 'text-slate-400'}>
            {fa(chars)} نویسه (مجاز: {fa(MIN_STATEMENT_CHARS)} تا {fa(MAX_STATEMENT_CHARS)})
          </span>
          <span className="text-slate-500">ارسال‌شده از مینی‌اپ</span>
        </div>
        <div className="mt-2 flex gap-2">
          <Btn loading={busy} disabled={chars < MIN_STATEMENT_CHARS} onClick={doPreview}>
            پیش‌نمایش
          </Btn>
          <Btn variant="primary" loading={busy} disabled={!preview} onClick={publish}>
            انتشار نهایی
          </Btn>
        </div>
        {error ? <p className="mt-2 rounded-xl border border-danger/40 bg-danger/10 p-2 text-[11px] leading-5 text-danger">{error}</p> : null}
      </Card>

      {preview ? (
        <Card title="پیش‌نمایش (همان چیزی که منتشر می‌شود)" emoji="👁️">
          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="whitespace-pre-wrap text-xs leading-7 text-slate-200">{preview.preview}</p>
            <p className="mt-2 border-t border-white/10 pt-2 text-[11px] text-gold-soft">{preview.signature}</p>
          </div>
          {preview.needsApproval ? (
            <p className="mt-2 rounded-xl border border-warn/40 bg-warn/10 p-2 text-[11px] leading-5 text-warn">
              ⏳ «نیاز به تأیید مدیر» روشن است؛ بیانیه شما پس از بازبینی منتشر می‌شود.
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-slate-500">با انتشار، بیانیه بلافاصله در دیوار عمومی کشور و در اخبار جهان دیده می‌شود.</p>
          )}
        </Card>
      ) : null}

      <Card title="بیانیه‌های من" emoji="🗂️">
        {mine.loading ? <Loading /> : null}
        {(mine.data?.statements ?? []).length === 0 && !mine.loading ? <Empty text="هنوز بیانیه‌ای منتشر نکرده‌اید." /> : null}
        <div className="space-y-2">
          {(mine.data?.statements ?? []).map((s: any) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="flex items-center justify-between gap-2">
                <Badge tone={s.status === 'published' ? 'ok' : s.status === 'pending_review' ? 'warn' : s.status === 'rejected' ? 'bad' : 'neutral'}>
                  {s.statusLabelFa ?? (STATEMENT_STATUS_LABELS_FA as Record<string, string>)[s.status] ?? s.status}
                </Badge>
                <span className="text-[10px] text-slate-500">{faDateTime(s.publishedAt ?? s.createdAt)}</span>
              </div>
              <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[11px] leading-6 text-slate-300">{s.text}</p>
              {s.reviewNote ? <p className="mt-1 text-[10px] text-warn">یادداشت بازبینی: {s.reviewNote}</p> : null}
              {s.status === 'pending_review' ? (
                <div className="mt-2">
                  <Btn
                    variant="ghost"
                    loading={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api.del(`/statements/${s.id}`);
                        toast('پیش‌نویس پس گرفته شد.', 'ok');
                        await mine.reload();
                      } catch (e) {
                        setError((e as ApiError).message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    پس گرفتن
                  </Btn>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card title="دیوار عمومی کشور شما" emoji="🏛️">
        {(wall.data?.rows ?? []).length === 0 && !wall.loading ? <Empty text="بیانیه منتشرشده‌ای روی دیوار نیست." /> : null}
        <div className="space-y-2">
          {(wall.data?.rows ?? []).map((s: any) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-black/20 p-2">
              <p className="whitespace-pre-wrap text-[11px] leading-6 text-slate-200">{s.text}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {s.leader_snapshot} · {faDateTime(typeof s.published_at === 'number' ? new Date(s.published_at * 1000).toISOString() : s.published_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <p className="px-1 text-[11px] leading-6 text-slate-500">
        🧾 برای شفافیت: «ویرایش بعد از انتشار» عمداً وجود ندارد — بیانیه منتشرشده سند تاریخی است و فقط با پس‌گرفتن (پیش از انتشار) یا حذف مدیریتی از دیوار می‌رود.
      </p>
    </div>
  );
}
