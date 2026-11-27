import { useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Modal, Row, Stat, Tabs, fa, faDateTime, useToast } from '../../ui';
import { ADMIN_SECTIONS } from '@ww/shared';
import { AdminBlock, JsonView, RawTable } from './shared';

const SECTION_FA: Record<string, string> = {
  users: 'کاربران',
  nations: 'کشورها',
  economy: 'اقتصاد',
  shop: 'فروشگاه',
  wars: 'جنگ',
  diplomacy: 'دیپلماسی',
  statements: 'بیانیه‌ها',
  settings: 'تنظیمات',
  roles: 'نقش‌ها',
  backup: 'پشتیبان',
  quota: 'سهمیه',
  audit: 'گزارش رسیدگی',
};

/** GET /api/admin/users?q=&role=&status=&limit=&offset= → { rows, total } */
export function AdminUsers() {
  const { me } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<'users' | 'detail' | 'audit'>('users');
  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const users = useApi<{ rows: any[]; total: number }>(`/admin/users?q=${encodeURIComponent(q)}&role=${role}&status=${status}&limit=20&offset=${offset}`, [q, role, status, offset]);
  const detail = useApi<any>(selected ? `/admin/users/${selected}` : null, [selected]);
  const audit = useApi<{ rows: any[] }>(tab === 'audit' ? '/admin/audit?limit=50' : null, [tab]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'status' | 'role' | 'permissions'; value?: string; grants?: any[] } | null>(null);
  const [reason, setReason] = useState('');

  const rows = users.data?.rows ?? [];
  const canWrite = me?.role === 'super_admin' || Boolean(me?.permissions?.users?.write);
  const canRoles = me?.role === 'super_admin' || Boolean(me?.permissions?.roles?.write);

  async function run(fn: () => Promise<unknown>, msg: string) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      toast(msg, 'ok');
      setConfirm(null);
      setReason('');
      await users.reload();
      await detail.reload();
      return true;
    } catch (e) {
      const m = (e as ApiError).message;
      setError(m);
      toast(m, 'err');
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">👥 کاربران و نقش‌ها</h1>
      <Tabs
        items={[
          { key: 'users', label: `👥 کاربران (${fa(users.data?.total ?? 0)})` },
          { key: 'detail', label: '🔍 پرونده کاربر' },
          { key: 'audit', label: '📜 گزارش مدیران' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'users' ? (
        <>
          <AdminBlock section="users" write={false}>
            <div className="flex flex-wrap gap-2">
              <input className="ww-input flex-1" placeholder="نام کاربری، نام، آی‌دی تلگرام یا نام کشور…" value={q} onChange={(e) => { setQ(e.target.value); setOffset(0); }} />
              <select className="ww-input w-auto" value={role} onChange={(e) => { setRole(e.target.value); setOffset(0); }}>
                {['all', 'player', 'admin', 'super_admin'].map((r) => (
                  <option key={r} value={r}>{r === 'all' ? 'همه نقش‌ها' : roleFa(r)}</option>
                ))}
              </select>
              <select className="ww-input w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0); }}>
                {['all', 'active', 'blocked', 'disabled'].map((s) => (
                  <option key={s} value={s}>{s === 'all' ? 'همه وضعیت‌ها' : statusFa(s)}</option>
                ))}
              </select>
            </div>
          </AdminBlock>

          {users.loading ? <Loading /> : null}
          {users.error ? <ErrorBox message={users.error} onRetry={users.reload} /> : null}
          {!users.loading && rows.length === 0 ? <Empty text="کاربری با این فیلترها نیست." /> : null}

          <div className="space-y-2">
            {rows.map((u: any) => (
              <Card key={u.id}>
                <div className="flex items-start justify-between gap-2">
                  <button className="min-w-0 text-right" onClick={() => { setSelected(u.id); setTab('detail'); }}>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <span>{u.username ? `@${u.username}` : `#${fa(u.telegramId)}`}</span>
                      {u.isPrimaryAdmin ? <Badge tone="warn">مدیر اصلی</Badge> : null}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'} · {fa(u.nationsCount)} کشور
                      {u.nationNames?.length ? `: ${u.nationNames.slice(0, 3).join('، ')}` : ''}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      آخرین فعالیت {faDateTime(u.lastSeenAt)} · عضو از {faDateTime(u.createdAt)}
                    </p>
                  </button>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <div className="flex gap-1">
                      <Badge tone={u.role === 'super_admin' ? 'warn' : u.role === 'admin' ? 'info' : 'neutral'}>{roleFa(u.role)}</Badge>
                      <Badge tone={u.status === 'active' ? 'ok' : 'bad'}>{statusFa(u.status)}</Badge>
                    </div>
                    {canWrite && u.id !== me?.userId ? (
                      <div className="flex gap-1">
                        {u.status === 'active' ? (
                          <Btn variant="danger" onClick={() => setConfirm({ kind: 'status', value: 'block' })}>مسدود</Btn>
                        ) : (
                          <Btn onClick={() => setConfirm({ kind: 'status', value: 'unblock' })}>رفع مسدود</Btn>
                        )}
                      </div>
                    ) : null}
                    {canRoles && u.id !== me?.userId && !u.isPrimaryAdmin ? (
                      <Btn variant="ghost" onClick={() => { setConfirm({ kind: 'role', value: u.role === 'player' ? 'admin' : 'player' }); }}>
                        {u.role === 'player' ? '⬆️ مدیر کردن' : '⬇️ بازیکن کردن'}
                      </Btn>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Btn disabled={offset <= 0} onClick={() => setOffset(Math.max(0, offset - 20))}>قبلی</Btn>
            <span className="text-[11px] text-slate-500">{fa(rows.length)} از {fa(users.data?.total ?? 0)}</span>
            <Btn disabled={rows.length < 20} onClick={() => setOffset(offset + 20)}>بعدی</Btn>
          </div>
        </>
      ) : null}

      {tab === 'detail' ? (
        selected ? (
          detail.loading ? (
            <Loading />
          ) : detail.error ? (
            <ErrorBox message={detail.error} onRetry={detail.reload} />
          ) : detail.data ? (
            <div className="space-y-3">
              <Card title={`پرونده ${detail.data.user.username ? '@' + detail.data.user.username : '#' + fa(detail.data.user.telegramId)}`} emoji="🔍">
                <Grid cols={4}>
                  <Stat label="نقش" value={roleFa(detail.data.user.role)} />
                  <Stat label="وضعیت" value={statusFa(detail.data.user.status)} tone={detail.data.user.status === 'active' ? 'ok' : 'bad'} />
                  <Stat label="کشورها" value={fa((detail.data.nations ?? []).length)} />
                  <Stat label="مدیر اصلی" value={detail.data.user.isPrimaryAdmin ? 'بله' : 'خیر'} />
                </Grid>
                <p className="mt-2 text-[11px] text-slate-400">
                  آی‌دی تلگرام: <span dir="ltr">{fa(detail.data.user.telegramId)}</span> · آی‌دی کاربری: #{fa(detail.data.user.id)} · آخرین فعالیت {faDateTime(detail.data.user.lastSeenAt)}
                </p>
                {(detail.data.nations ?? []).length ? (
                  <div className="mt-2 space-y-1">
                    {detail.data.nations.map((n: any) => (
                      <Row key={n.id}>
                        <span className="text-xs">{n.flag} {n.name}</span>
                        <span className="text-[10px] text-slate-400">{n.status} · رتبه {fa(n.worldRank ?? 0)}</span>
                      </Row>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-slate-500">این کاربر هنوز کشوری نساخته است.</p>
                )}
              </Card>

              <Card title="آخرین تراکنش‌های کشور اصلی" emoji="🧾">
                <RawTable
                  rows={(detail.data.transactions ?? []).slice(0, 8)}
                  columns={[
                    { key: 'createdAt', label: 'زمان', render: (v) => faDateTime(String(v)) },
                    { key: 'type', label: 'نوع' },
                    { key: 'amount', label: 'مبلغ', render: (v) => `${Number(v) >= 0 ? '+' : '−'}${fa(Math.abs(Number(v)))}` },
                    { key: 'reason', label: 'دلیل' },
                  ]}
                  empty="تراکنشی ثبت نشده است."
                />
              </Card>

              <PermissionsEditor userId={detail.data.user.id} grants={detail.data.permissions ?? []} canSave={canRoles} onSaved={() => void detail.reload()} />

              <div className="flex flex-wrap gap-2">
                {canWrite ? (
                  detail.data.user.status === 'active' ? (
                    <Btn variant="danger" onClick={() => setConfirm({ kind: 'status', value: 'block' })}>🚫 مسدود کردن کاربر</Btn>
                  ) : (
                    <Btn onClick={() => setConfirm({ kind: 'status', value: 'unblock' })}>✅ رفع مسدودی</Btn>
                  )
                ) : null}
                {canRoles && !detail.data.user.isPrimaryAdmin ? (
                  detail.data.user.role === 'player' ? (
                    <Btn variant="primary" onClick={() => setConfirm({ kind: 'role', value: 'admin' })}>⬆️ ارتقا به مدیر</Btn>
                  ) : (
                    <Btn onClick={() => setConfirm({ kind: 'role', value: 'player' })}>⬇️ بازگرداندن به بازیکن</Btn>
                  )
                ) : null}
                {detail.data.user.isPrimaryAdmin ? <p className="text-[11px] text-slate-500">مدیر اصلی قابل تنزل یا مسدودی نیست (قفل ایمنی در سرور).</p> : null}
              </div>
            </div>
          ) : null
        ) : (
          <Empty text="از فهرست کاربران یک نفر را انتخاب کنید." action={<Btn onClick={() => setTab('users')}>فهرست کاربران</Btn>} />
        )
      ) : null}

      {tab === 'audit' ? (
        <Card title="گزارش رسیدگی (audit)" emoji="📜" right={<Btn variant="ghost" onClick={() => void audit.reload()}>🔄</Btn>}>
          {audit.loading ? <Loading /> : null}
          <RawTable
            rows={audit.data?.rows}
            columns={[
              { key: 'created_at', label: 'زمان', render: (v) => new Date(Number(v) * 1000).toLocaleString('fa-IR') },
              { key: 'actor_username', label: 'مدیر', render: (v, r) => (v ? `@${String(v)}` : `#${fa(Number(r.actor_user_id))}`) },
              { key: 'action', label: 'عملیات' },
              { key: 'target_type', label: 'نوع هدف' },
              { key: 'target_id', label: 'هدف' },
              { key: 'reason', label: 'دلیل' },
            ]}
            empty="هنوز اقدام مدیریتی‌ای ثبت نشده است."
          />
        </Card>
      ) : null}

      <Modal open={confirm !== null} title={confirm?.kind === 'role' ? 'تغییر نقش' : confirm?.kind === 'status' ? 'تغییر وضعیت' : 'ذخیره مجوزها'} onClose={() => setConfirm(null)}>
        {confirm ? (
          <div className="space-y-2">
            <p className="text-[11px] leading-6 text-slate-400">
              {confirm.kind === 'status'
                ? confirm.value === 'block'
                  ? 'با مسدود کردن، نشست‌های فعال این کاربر باطل می‌شود و اجازه ورود به مینی‌اپ را ندارد.'
                  : 'رفع مسدودی فقط اجازه ورود را برمی‌گرداند؛ کشورها و داده‌های کاربر دست‌نخورده است.'
                : confirm.value === 'admin'
                  ? 'مدیر جدید به بخش‌هایی که در جدول مجوزها برایش فعال کنید دسترسی خواهد داشت. مدیر ارشد شدن فقط از طریق متغیر محیطی ADMIN_TELEGRAM_IDS انجام می‌شود.'
                  : 'با این کار کاربر به حالت بازیکن برمی‌گردد و دسترسی مدیریتی‌اش بلافاصله قطع می‌شود.'}
            </p>
            {confirm.kind !== 'permissions' ? (
              <label className="block">
                <span className="ww-label">دلیل (اجباری — در audit log ثبت می‌شود)</span>
                <textarea className="ww-input min-h-16" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
              </label>
            ) : null}
            {error ? <p className="text-[11px] text-danger">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <Btn onClick={() => setConfirm(null)}>انصراف</Btn>
              <Btn
                variant={confirm.kind === 'status' && confirm.value === 'block' ? 'danger' : 'primary'}
                loading={busy}
                disabled={reason.trim().length < 3}
                onClick={() => {
                  if (!selected) return;
                  if (confirm.kind === 'status') {
                    void run(() => api.post(`/admin/users/${selected}/status`, { status: confirm.value === 'block' ? 'blocked' : 'active', reason: reason.trim() }), 'وضعیت کاربر تغییر کرد.');
                  } else if (confirm.kind === 'role') {
                    void run(() => api.post(`/admin/users/${selected}/role`, { role: confirm.value, reason: reason.trim() }), 'نقش کاربر تغییر کرد.');
                  }
                }}
              >
                تأیید و ثبت
              </Btn>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function roleFa(r: string) {
  return ({ player: 'بازیکن', admin: 'مدیر', super_admin: 'مدیر ارشد' } as Record<string, string>)[r] ?? r;
}
function statusFa(s: string) {
  return ({ active: 'فعال', blocked: 'مسدود', disabled: 'غیرفعال', frozen: 'منجمد', banned: 'بن', dissolved: 'منحل', at_war: 'در جنگ' } as Record<string, string>)[s] ?? s;
}

/** POST /api/admin/users/:id/permissions { grants: [{section, canRead, canWrite}] } */
function PermissionsEditor({ userId, grants, canSave, onSaved }: { userId: number; grants: any[]; canSave: boolean; onSaved: () => void }) {
  const toast = useToast();
  const [draft, setDraft] = useState<Record<string, { read: boolean; write: boolean }> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current: Record<string, { read: boolean; write: boolean }> = Object.fromEntries(
    (grants ?? []).map((g: any) => [String(g.resource ?? g.section), { read: Boolean(g.read ?? g.canRead), write: Boolean(g.write ?? g.canWrite) }]),
  );
  const value = draft ?? current;
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(current);

  return (
    <AdminBlock section="roles" title="مجوز بخش‌ها" emoji="🔐">
      <p className="mb-2 text-[11px] leading-6 text-slate-400">
        هر بخش دو سطح دارد: خواندن و نوشتن. «نوشتن» فقط وقتی معنی دارد که «خواندن» هم فعال باشد — سرور همین قاعده را اعمال می‌کند. مدیر ارشد همه‌چیز را دارد و قابل تغییر نیست.
      </p>
      <div className="space-y-1">
        {ADMIN_SECTIONS.map((section) => {
          const g = value[section] ?? { read: false, write: false };
          return (
            <Row key={section}>
              <span className="text-xs font-semibold">{SECTION_FA[section] ?? section}</span>
              <span className="flex gap-1">
                <button
                  className={`ww-tab ${g.read ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`}
                  disabled={!canSave}
                  onClick={() => setDraft({ ...value, [section]: { read: !g.read, write: !g.read ? g.write : false } })}
                >
                  👁 خواندن {g.read ? '✓' : ''}
                </button>
                <button
                  className={`ww-tab ${g.write ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`}
                  disabled={!canSave || !g.read}
                  onClick={() => setDraft({ ...value, [section]: { read: g.read, write: !g.write } })}
                >
                  ✏️ نوشتن {g.write ? '✓' : ''}
                </button>
              </span>
            </Row>
          );
        })}
      </div>
      {!canSave ? <p className="mt-2 text-[11px] text-warn">فقط مدیر ارشد یا کسی که مجوز نوشتن بخش «نقش‌ها» را دارد می‌تواند مجوزها را تغییر دهد.</p> : null}
      {error ? <p className="mt-1 text-[11px] text-danger">{error}</p> : null}
      <div className="mt-2 flex justify-end">
        <Btn
          variant="primary"
          loading={busy}
          disabled={!canSave || !dirty}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await api.post(`/admin/users/${userId}/permissions`, {
                grants: ADMIN_SECTIONS.map((s) => ({ resource: s, read: Boolean(value[s]?.read), write: Boolean(value[s]?.write) })),
              });
              toast('مجوزها ذخیره شد.', 'ok');
              setDraft(null);
              onSaved();
            } catch (e) {
              setError((e as ApiError).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          💾 ذخیره مجوزها
        </Btn>
      </div>
      <div className="mt-2">
        <JsonView data={value} label="وضعیت فعلی" />
      </div>
    </AdminBlock>
  );
}

export function AdminAudit() {
  const [limit, setLimit] = useState(50);
  const [action, setAction] = useState('');
  const a = useApi<{ rows: any[]; total: number }>(`/admin/audit?limit=${limit}${action ? `&action=${encodeURIComponent(action)}` : ''}`, [limit, action]);
  const rows = a.data?.rows ?? [];
  const groups = new Map<string, number>();
  for (const r of rows) {
    const key = String(r.action ?? '').split('.')[0] || 'other';
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">📜 گزارش رسیدگی</h1>
      <AdminBlock section="audit" write={false}>
        <div className="flex flex-wrap gap-2">
          <input className="ww-input flex-1" placeholder="فیلتر action (مثلاً shop.price_bulk)" value={action} onChange={(e) => setAction(e.target.value)} />
          <select className="ww-input w-auto" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {[20, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{fa(n)} ردیف</option>
            ))}
          </select>
        </div>
      </AdminBlock>

      <Card title="خلاصه بر اساس بخش" emoji="📊">
        <div className="flex flex-wrap gap-1">
          {[...groups.entries()].map(([k, v]) => (
            <span key={k} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
              {k}: {fa(v)}
            </span>
          ))}
          {groups.size === 0 ? <span className="text-[11px] text-slate-500">داده‌ای نیست.</span> : null}
        </div>
      </Card>

      <Card title="ردیف‌ها" emoji="🧾" right={<Btn variant="ghost" onClick={() => void a.reload()}>🔄</Btn>}>
        {a.loading ? <Loading /> : null}
        {a.error ? <ErrorBox message={a.error} onRetry={a.reload} /> : null}
        <RawTable
          rows={rows}
          columns={[
            { key: 'id', label: '#', render: (v) => fa(Number(v)) },
            { key: 'created_at', label: 'زمان', render: (v) => new Date(Number(v) * 1000).toLocaleString('fa-IR') },
            { key: 'actor_username', label: 'مدیر', render: (v, r) => (v ? `@${String(v)}` : `#${fa(Number(r.actor_user_id ?? 0))}`) },
            { key: 'action', label: 'عملیات' },
            { key: 'target_type', label: 'هدف' },
            { key: 'target_id', label: 'شماره', render: (v) => (v === null || v === undefined ? '—' : fa(Number(v))) },
            { key: 'reason', label: 'دلیل' },
          ]}
          empty="هیچ اقدام مدیریتی‌ای ثبت نشده است."
        />
        <p className="mt-2 text-[11px] leading-6 text-slate-500">
          پیش‌فرض این دید فقط خلاصه است؛ before/after کامل (برای تغییرات مالی، همان‌طور که در سند آمده، فقط شناسه تراکنش ثبت می‌شود) در جدول audit_logs مانده و با
          آی‌دی ردیف قابل بازیابی است.
        </p>
      </Card>
    </div>
  );
}
