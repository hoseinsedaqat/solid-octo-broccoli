import { useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi } from '../../auth';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Modal, Row, Stat, Tabs, fa, faDateTime, faMoney, useToast } from '../../ui';
import { AdminBlock, JsonView, RawTable } from './shared';

type Action = 'update' | 'treasury' | 'income' | 'inventory' | 'defense' | 'delete' | null;

export function AdminNations() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [offset, setOffset] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);
  const [action, setAction] = useState<Action>(null);
  const list = useApi<{ nations: any[] }>(`/admin/nations?q=${encodeURIComponent(q)}&status=${status}&limit=20&offset=${offset}`, [q, status, offset]);
  const nations = list.data?.nations ?? [];

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">🌍 کشورها</h1>
      <AdminBlock section="nations">
        <div className="flex flex-wrap gap-2">
          <input className="ww-input flex-1" placeholder="نام کشور، رهبر یا آی‌دی تلگرام…" value={q} onChange={(e) => { setQ(e.target.value); setOffset(0); }} />
          <select className="ww-input w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0); }}>
            {['all', 'active', 'frozen', 'banned', 'at_war', 'dissolved'].map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'همه وضعیت‌ها' : statusFa(s)}
              </option>
            ))}
          </select>
        </div>
      </AdminBlock>

      {list.loading ? <Loading /> : null}
      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}
      {!list.loading && nations.length === 0 ? <Empty text="کشوری با این فیلتر نیست." /> : null}

      <div className="grid gap-2 sm:grid-cols-2">
        {nations.map((n: any) => (
          <Card key={n.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span>{n.flag}</span>
                  <span className="truncate">{n.name}</span>
                  <span className="text-[10px] text-slate-500">#{fa(n.id)}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  رهبر {n.leaderName} · {n.ownerUsername ? `@${n.ownerUsername}` : n.ownerTelegramId ? `#${fa(n.ownerTelegramId)}` : 'بی‌صاحب'}
                </p>
              </div>
              <Badge tone={n.status === 'active' ? 'ok' : n.status === 'dissolved' ? 'neutral' : 'warn'}>{statusFa(n.status)}</Badge>
            </div>
            <div className="mt-2">
              <Grid cols={2}>
                <Stat label="خزانه" value={faMoney(n.treasury)} />
                <Stat label="خالص چرخه" value={faMoney(n.netIncome)} />
                <Stat label="قدرت نظامی" value={fa(n.militaryPower)} />
                <Stat label="رتبه / امتیاز" value={`${fa(n.worldRank)} / ${fa(n.economicScore)}`} />
              </Grid>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              {fa(n.wins)} برد · {fa(n.losses)} باخت · {fa(n.inventoryRows)} قلم انبار · عضویت از {faDateTime(n.createdAt)}
            </p>
            <div className="mt-2">
              <Btn
                onClick={() => {
                  setOpenId(n.id);
                  setAction('update');
                }}
              >
                ✏️ اقدامات
              </Btn>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Btn disabled={offset <= 0} onClick={() => setOffset(Math.max(0, offset - 20))}>
          قبلی
        </Btn>
        <span className="self-center text-[11px] text-slate-500">صفحه {Math.floor(offset / 20) + 1}</span>
        <Btn disabled={nations.length < 20} onClick={() => setOffset(offset + 20)}>
          بعدی
        </Btn>
      </div>

      <Modal open={action !== null} title="اقدام مدیریتی روی کشور" onClose={() => setAction(null)}>
        <div className="mb-3 flex flex-wrap gap-1">
          {(['update', 'treasury', 'income', 'inventory', 'defense', 'delete'] as const).map((a) => (
            <button key={a} className={`ww-tab ${action === a ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setAction(a)}>
              {actionFa(a)}
            </button>
          ))}
        </div>
        {openId ? (
          <ActionForm
            key={`${openId}-${action}`}
            nationId={openId}
            action={action}
            onDone={async (msg) => {
              toast(msg, 'ok');
              await list.reload();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function statusFa(s: string) {
  return ({ active: 'فعال', frozen: 'مسدود موقت', banned: 'بن', at_war: 'در جنگ', dissolved: 'منحل‌شده' } as Record<string, string>)[s] ?? s;
}

function actionFa(a: string) {
  return ({ update: 'ویرایش', treasury: 'خزانه', income: 'درآمد', inventory: 'انبار', defense: 'دفاع', delete: 'انحلال' } as Record<string, string>)[a] ?? a;
}

function ActionForm({ nationId, action, onDone }: { nationId: number; action: Action; onDone: (msg: string) => void }) {
  const [form, setForm] = useState<Record<string, any>>({ reason: '', confirmText: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(path: string, body: Record<string, unknown>, msg: string) {
    setBusy(true);
    setError(null);
    try {
      await api.post(path, { nationId, ...body });
      onDone(msg);
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  if (!action) return null;
  const needReason = action !== 'inventory' ? true : true;

  return (
    <div className="space-y-2">
      {action === 'update' ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <L text="نام جدید (اختیاری)"><input className="ww-input" value={form.name ?? ''} onChange={set('name')} maxLength={30} /></L>
            <L text="پرچم جدید"><input className="ww-input" value={form.flag ?? ''} onChange={set('flag')} maxLength={16} /></L>
            <L text="نام رهبر"><input className="ww-input" value={form.leaderName ?? ''} onChange={set('leaderName')} maxLength={40} /></L>
            <L text="وضعیت">
              <select className="ww-input" value={form.status ?? ''} onChange={set('status')}>
                <option value="">بدون تغییر</option>
                {['active', 'frozen', 'banned', 'at_war'].map((s) => (
                  <option key={s} value={s}>{statusFa(s)}</option>
                ))}
              </select>
            </L>
          </div>
        </>
      ) : null}

      {action === 'treasury' ? (
        <div className="grid grid-cols-2 gap-2">
          <L text="مبلغ (مثبت = افزایش، منفی = کسر)"><input className="ww-input" dir="ltr" inputMode="numeric" value={form.delta ?? ''} onChange={set('delta')} /></L>
          <L text="میان‌بر">
            <div className="flex flex-wrap gap-1">
              {[100000, 1000000, -100000, -1000000].map((v) => (
                <Btn key={v} onClick={() => setForm((f) => ({ ...f, delta: String(v) }))}>{v > 0 ? '+' : ''}{fa(Math.abs(v))}</Btn>
              ))}
            </div>
          </L>
        </div>
      ) : null}

      {action === 'income' ? (
        <div className="grid grid-cols-3 gap-2">
          <L text="درآمد کارخانه (override)"><input className="ww-input" dir="ltr" inputMode="numeric" value={form.factoryIncome ?? ''} onChange={set('factoryIncome')} /></L>
          <L text="درآمد معدن (override)"><input className="ww-input" dir="ltr" inputMode="numeric" value={form.mineIncome ?? ''} onChange={set('mineIncome')} /></L>
          <L text="پایه نگهداری"><input className="ww-input" dir="ltr" inputMode="numeric" value={form.upkeepBase ?? ''} onChange={set('upkeepBase')} /></L>
          <p className="col-span-3 text-[11px] leading-5 text-slate-400">
            override برای این کشور؛ خالی بگذارید تا محاسبه خودکار از تعداد کارخانه/معدن ادامه یابد. عدد ۰ یعنی «صفر شدن درآمد از این منبع» و با خالی فرق دارد.
          </p>
        </div>
      ) : null}

      {action === 'inventory' ? (
        <InventoryPicker nationId={nationId} value={form} onChange={setForm} />
      ) : null}

      {action === 'defense' ? (
        <div className="grid grid-cols-2 gap-2">
          <L text="سطح استحکام (۰ تا ۲۰)"><input className="ww-input" dir="ltr" inputMode="numeric" value={form.fortificationLevel ?? ''} onChange={set('fortificationLevel')} /></L>
          <L text="حالت پدافند">
            <select className="ww-input" value={form.defenseMode ?? ''} onChange={set('defenseMode')}>
              {['', 'standard', 'alert', 'fortified'].map((s) => (
                <option key={s} value={s}>{s === '' ? 'انتخاب…' : s}</option>
              ))}
            </select>
          </L>
        </div>
      ) : null}

      {action === 'delete' ? (
        <div className="space-y-2">
          <p className="rounded-xl border border-danger/40 bg-danger/10 p-2 text-[11px] leading-6 text-danger">
            انحلال کشور تراکنش‌ها و تاریخچه را پاک نمی‌کند؛ کشور به وضعیت dissolved می‌رود و دارایی‌ها از circulation خارج می‌شوند. این کار بازگشت ندارد.
          </p>
          <L text='برای تأیید دقیقاً بنویسید "DISSOLVE"'><input className="ww-input" dir="ltr" value={form.confirmText} onChange={set('confirmText')} /></L>
        </div>
      ) : null}

      {needReason ? (
        <L text="دلیل (اجباری — در audit log ثبت می‌شود)">
          <textarea className="ww-input min-h-16" value={form.reason ?? ''} onChange={set('reason')} maxLength={200} placeholder="مثلاً جبران باگ، تخلف، هدیه رویداد…" />
        </L>
      ) : null}

      {error ? <p className="text-[11px] leading-5 text-danger">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Btn variant="ghost" onClick={() => onDone('بدون تغییر بسته شد.')}>بستن</Btn>
        <Btn
          variant={action === 'delete' ? 'danger' : 'primary'}
          loading={busy}
          disabled={(form.reason ?? '').trim().length < 3 || (action === 'delete' && form.confirmText !== 'DISSOLVE')}
          onClick={() => {
            const reason = (form.reason ?? '').trim();
            if (action === 'update') {
              const patch: Record<string, unknown> = { reason };
              for (const k of ['name', 'flag', 'leaderName', 'status']) if (String(form[k] ?? '').trim()) patch[k] = String(form[k]).trim();
              void submit(`/admin/nations/${nationId}/update`, patch, 'کشور به‌روزرسانی شد.');
            } else if (action === 'treasury') {
              void submit(`/admin/nations/${nationId}/treasury`, { delta: Number(form.delta), reason }, 'خزانه تنظیم شد.');
            } else if (action === 'income') {
              void submit(
                `/admin/nations/${nationId}/income`,
                {
                  reason,
                  ...(String(form.factoryIncome ?? '') !== '' ? { factoryIncome: Number(form.factoryIncome) } : {}),
                  ...(String(form.mineIncome ?? '') !== '' ? { mineIncome: Number(form.mineIncome) } : {}),
                  ...(String(form.upkeepBase ?? '') !== '' ? { upkeepBase: Number(form.upkeepBase) } : {}),
                },
                'override درآمد ثبت شد.',
              );
            } else if (action === 'inventory') {
              void submit(`/admin/nations/${nationId}/inventory`, { templateId: form.templateId, delta: Number(form.delta), reason }, 'انبار تنظیم شد.');
            } else if (action === 'defense') {
              void submit(`/admin/nations/${nationId}/defense`, { fortificationLevel: Number(form.fortificationLevel ?? 0), defenseMode: form.defenseMode }, 'دفاع به‌روزرسانی شد.');
            } else if (action === 'delete') {
              void submit(`/admin/nations/${nationId}/delete`, { confirmText: form.confirmText, reason }, 'کشور منحل شد.');
            }
          }}
        >
          ثبت تغییر
        </Btn>
      </div>
    </div>
  );
}

function InventoryPicker({ nationId, value, onChange }: { nationId: number; value: Record<string, any>; onChange: (v: Record<string, any>) => void }) {
  const [search, setSearch] = useState('');
  const items = useApi<{ items: any[] }>(`/admin/shop/equipment?q=${encodeURIComponent(search)}&limit=12`, [search]);
  void nationId;
  return (
    <div className="space-y-2">
      <L text="جست‌وجوی تجهیزات">
        <input className="ww-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="نام یا کد…" />
      </L>
      {items.loading ? <Loading /> : null}
      <div className="max-h-40 space-y-1 overflow-y-auto">
        {(items.data?.items ?? []).map((it: any) => (
          <Row key={it.id} active={value.templateId === it.id} onClick={() => onChange({ ...value, templateId: it.id, _name: it.nameFa })}>
            <span className="text-[11px]">{it.emoji} {it.nameFa} <span className="text-slate-500">({it.code})</span></span>
            <span className="text-[10px] text-slate-400">در بازی: {fa(it.totalOwned)}</span>
          </Row>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <L text="تغییر تعداد (مثبت/منفی)"><input className="ww-input" dir="ltr" inputMode="numeric" value={value.delta ?? ''} onChange={(e) => onChange({ ...value, delta: e.target.value })} /></L>
        <L text="آیتم انتخاب‌شده"><input className="ww-input" readOnly value={value._name ?? '—'} /></L>
      </div>
    </div>
  );
}

function L({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="ww-label">{text}</span>
      {children}
    </label>
  );
}

/** GET /api/admin/economy + POST /api/admin/economy/rules */
export function AdminEconomy() {
  const [tab, setTab] = useState<'rules' | 'money' | 'tx'>('rules');
  const eco = useApi<any>('/admin/economy');
  const txs = useApi<{ rows: any[] }>(tab === 'tx' ? '/admin/economy/transactions?limit=50' : null, [tab]);
  const toast = useToast();
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rules = eco.data?.rules ?? {};
  const money = eco.data?.money ?? {};
  const health = eco.data?.health ?? {};
  const val = (k: string) => draft?.[k] ?? (rules[k] === undefined ? '' : String(rules[k]));

  const fields: { key: string; label: string; hint?: string; max?: number }[] = [
    { key: 'incomeCycleSeconds', label: 'طول چرخه درآمد (ثانیه)', hint: 'حداقل ۶۰' },
    { key: 'globalMultiplier', label: 'ضریب جهانی درآمد', hint: '۱ = بدون تغییر' },
    { key: 'factoryIncomePerUnit', label: 'درآمد هر کارخانه' },
    { key: 'mineIncomePerUnit', label: 'درآمد هر معدن' },
    { key: 'taxRate', label: 'نرخ مالیات (۰ تا ۰.۹)' },
    { key: 'maintenanceRate', label: 'نرخ نگهداری (۰ تا ۰.۹)' },
    { key: 'maxCatchupCycles', label: 'حداکثر چرخه جبرانی' },
    { key: 'minTreasury', label: 'حداقل خزانه مجاز' },
  ];
  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">💰 اقتصاد</h1>
      <Tabs items={[{ key: 'rules', label: '⚙️ قواعد' }, { key: 'money', label: '📊 وضعیت' }, { key: 'tx', label: '🧾 تراکنش‌ها' }]} value={tab} onChange={setTab} />

      {eco.loading ? <Loading /> : null}
      {eco.error ? <ErrorBox message={eco.error} onRetry={eco.reload} /> : null}

      {tab === 'rules' ? (
        <AdminBlock section="economy" title="قواعد اقتصاد بازی" emoji="⚙️">
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            «درآمد کارخانه» و «درآمد معدن» در سند طراحی به‌صورت مقدار کل بخش (۵۰٬۰۰۰ و ۳۰٬۰۰۰ در بسته اولیه) تعریف شده‌اند؛ رشد واقعی از تعداد واحد در انبار محاسبه
            می‌شود. override خاص هر کشور در همان کارت کشورها تنظیم می‌شود.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <L key={f.key} text={f.label + (f.hint ? ` — ${f.hint}` : '')}>
                <input
                  className="ww-input"
                  dir="ltr"
                  inputMode="decimal"
                  value={val(f.key)}
                  onChange={(e) => setDraft((d) => ({ ...(d ?? {}), [f.key]: e.target.value }))}
                />
              </L>
            ))}
          </div>
          <Row>
            <span className="text-[11px] text-slate-300">اجازه موجودی منفی خزانه</span>
            <button className="ww-btn" onClick={() => setDraft((d) => ({ ...(d ?? {}), negativeBalanceAllowed: String(!(d?.negativeBalanceAllowed ?? rules.negativeBalanceAllowed)) === 'true' ? 'true' : 'false' }))}>
              {String(draft?.negativeBalanceAllowed ?? rules.negativeBalanceAllowed ?? false) === 'true' ? '✅ بله' : '⬜ خیر'}
            </button>
          </Row>
          <p className="mt-1 text-[10px] leading-5 text-slate-500">
            هزینه نگهداری هر تجهیز در همان ردیف تجهیزات (maintenance_per_unit) ویرایش می‌شود و وزن قدرت هر دسته در بخش تجهیزات؛ این‌جا فقط ضرایب کلی است.
          </p>
          {error ? <p className="mt-2 text-[11px] text-danger">{error}</p> : null}
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500">ذخیره فقط بخش economy_rules را بازنویسی می‌کند و بعد از آن قدرت/اقتصاد همه کشورها بازمحاسبه می‌شود.</span>
            <Btn
              variant="primary"
              loading={busy}
              disabled={!draft}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  // POST /api/admin/economy/rules validates the COMPLETE economy_rules object,
                  // so we always send the stored rules merged with the edited fields.
                  const body: Record<string, unknown> = { ...rules };
                  for (const [k, v] of Object.entries(draft ?? {})) {
                    if (v === '' ) continue;
                    body[k] = k === 'negativeBalanceAllowed' ? v === 'true' : v.includes('.') ? Number(v) : Math.round(Number(v));
                  }
                  const res = await api.post<{ updated: string[]; recalculatedNations: number }>('/admin/economy/rules', body);
                  toast(`${fa(res.recalculatedNations)} کشور بازمحاسبه شد.`, 'ok');
                  setDraft(null);
                  await eco.reload();
                } catch (e) {
                  setError((e as ApiError).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              💾 ذخیره قواعد
            </Btn>
          </div>
        </AdminBlock>
      ) : null}

      {tab === 'money' ? (
        <>
          <Card title="نقدینگی کل بازی" emoji="💵">
            <Grid cols={3}>
              <Stat label="جمع خزانه‌ها" value={faMoney(money.totalTreasury)} />
              <Stat label="ناخالص هر چرخه" value={faMoney(money.totalIncomePerCycle)} />
              <Stat label="تعداد تراکنش" value={fa(money.transactionCount)} />
            </Grid>
          </Card>
          <Card title="سلامت پرداخت درآمد" emoji="❤️">
            <Grid cols={3}>
              <Stat label="چرخه در انتظار" value={fa(health.pendingCycles ?? 0)} tone={Number(health.pendingCycles) > 0 ? 'warn' : 'ok'} />
              <Stat label="چرخه پرداخت‌شده" value={fa(health.creditedCycles ?? 0)} />
              <Stat label="قدیمی‌ترین در انتظار" value={faDateTime(health.oldestPendingAt ?? null)} tone={health.oldestPendingAt ? 'warn' : undefined} />
            </Grid>
            {Number(health.pendingCycles) > 0 ? (
              <p className="mt-2 rounded-xl border border-gold/40 bg-gold/10 p-2 text-[11px] leading-6 text-gold-soft">
                ⚠️ {fa(health.pendingCycles)} چرخه هنوز credits نشده‌اند. معمولاً یعنی کران revenue اجرا نشده (cron غیرفعال، سهمیه، یا pause دستی). از بخش «کران» دستی اجرا کنید.
              </p>
            ) : (
              <p className="mt-2 rounded-xl border border-ok/40 bg-ok/10 p-2 text-[11px] text-ok">✅ صف درآمد تمیز است.</p>
            )}
          </Card>
          <AdminBlock section="economy" title="بسته‌های اولیه (starter_templates)" emoji="📦">
            <RawTable
              rows={eco.data?.starterEconomy}
              columns={[
                { key: 'name', label: 'نام' },
                { key: 'treasury', label: 'خزانه', render: (v) => faMoney(Number(v)) },
                { key: 'factory_income', label: 'کارخانه', render: (v) => faMoney(Number(v)) },
                { key: 'mine_income', label: 'معدن', render: (v) => faMoney(Number(v)) },
                { key: 'income_cycle_seconds', label: 'چرخه', render: (v) => `${fa(Number(v))}s` },
                { key: 'is_default', label: 'پیش‌فرض', render: (v) => (Number(v) === 1 ? '✅' : '') },
              ]}
            />
          </AdminBlock>
        </>
      ) : null}

      {tab === 'tx' ? (
        <Card title="۵۰ تراکنش آخر (همه کشورها)" emoji="🧾">
          <RawTable
            rows={txs.data?.rows}
            columns={[
              { key: 'id', label: '#', render: (v) => fa(Number(v)) },
              { key: 'nation_name', label: 'کشور' },
              { key: 'type', label: 'نوع' },
              { key: 'amount', label: 'مبلغ', render: (v) => <span className={Number(v) >= 0 ? 'text-ok' : 'text-danger'}>{faMoney(Number(v))}</span> },
              { key: 'balance_after', label: 'مانده', render: (v) => faMoney(Number(v)) },
              { key: 'reason', label: 'دلیل' },
              { key: 'created_at', label: 'زمان', render: (v) => new Date(Number(v) * 1000).toLocaleString('fa-IR') },
            ]}
          />
          <JsonView data={txs.data?.rows?.[0]} label="نمونه خام ردیف" />
        </Card>
      ) : null}
    </div>
  );
}
