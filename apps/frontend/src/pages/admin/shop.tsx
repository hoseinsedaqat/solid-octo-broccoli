import { useMemo, useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Loading, Modal, Row, Stat, Tabs, fa, faMoney, useToast } from '../../ui';
import { EQUIPMENT_CATEGORIES } from '@ww/shared';
import { AdminBlock, RawTable } from './shared';

/**
 * Equipment + pricing.
 *
 * The one rule that matters here: an item without a price is NOT purchasable — the player shop shows a Persian
 * reason instead of a fake 0-cost button. Prices are only ever written by this page (or the bot admin flow).
 */
export function AdminEquipment() {
  const { me } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<'items' | 'pricing' | 'categories' | 'sales'>('items');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [unpricedOnly, setUnpricedOnly] = useState(false);
  const list = useApi<{ items: any[] }>(`/admin/shop/equipment?q=${encodeURIComponent(q)}&category=${category}&unpriced=${unpricedOnly ? 1 : 0}&limit=200`, [q, category, unpricedOnly, tab]);
  const cats = useApi<{ categories: any[] }>('/admin/shop/categories');
  const sales = useApi<{ rows: any[] }>(tab === 'sales' ? '/admin/shop/sales' : null, [tab]);
  const items = list.data?.items ?? [];
  const canWrite = me?.role === 'super_admin' || Boolean(me?.permissions?.shop?.write);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [edit, setEdit] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unpriced = items.filter((i: any) => !i.priceSet);

  const dirty = useMemo(() => Object.entries(priceDraft).filter(([, v]) => v !== ''), [priceDraft]);

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">🔧 تجهیزات و قیمت‌ها</h1>
      <Tabs
        items={[
          { key: 'items', label: `🧩 آیتم‌ها (${fa(items.length)})`, badge: unpriced.length },
          { key: 'pricing', label: '🏷️ قیمت‌گذاری گروهی' },
          { key: 'categories', label: '🗂️ دسته‌بندی‌ها' },
          { key: 'sales', label: '📊 فروش' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'items' || tab === 'pricing' ? (
        <AdminBlock section="shop" title="فیلترها" emoji="🔎" write={false}>
          <div className="flex flex-wrap gap-2">
            <input className="ww-input flex-1" placeholder="نام یا کد…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="ww-input w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">همه دسته‌ها</option>
              {(cats.data?.categories ?? []).map((c: any) => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.labelFa}
                </option>
              ))}
            </select>
            <button className={`ww-tab ${unpricedOnly ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setUnpricedOnly((v) => !v)}>
              فقط بدون قیمت ({fa(unpriced.length)})
            </button>
          </div>
        </AdminBlock>
      ) : null}

      {list.loading ? <Loading /> : null}
      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}

      {tab === 'items' ? (
        <div className="space-y-2">
          <div className="flex justify-end">
            <Btn
              variant="primary"
              onClick={() =>
                setEdit({
                  id: null,
                  categoryKey: 'tanks',
                  code: '',
                  nameFa: '',
                  unitFa: 'عدد',
                  price: null,
                  attackPoints: null,
                  defensePoints: null,
                  description: '',
                  isActive: true,
                  isForSale: false,
                  purchaseLimitPerCycle: null,
                  maintenancePerUnit: null,
                })
              }
            >
              ➕ افزودن تجهیزات جدید
            </Btn>
          </div>
          {items.length === 0 && !list.loading ? <p className="py-4 text-center text-xs text-slate-500">آیتمی مطابق فیلتر نیست. برای ساخت آیتم جدید دکمهٔ بالا را بزنید.</p> : null}
          {items.map((it: any) => (
            <Card key={it.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                    <span className="truncate">{it.nameFa}</span>
                    <span className="text-[10px] text-slate-500">{it.emoji} {it.categoryLabel ?? it.categoryKey} · {it.code}</span>
                    {it.priceSet ? null : <Badge tone="bad">بدون قیمت</Badge>}
                    {it.isForSale === false ? <Badge tone="warn">فروش متوقف</Badge> : null}
                    {it.isActive === false ? <Badge tone="neutral">غیرفعال</Badge> : null}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-400">
                    <span>قیمت: {it.price === null ? '—' : faMoney(it.price)}</span>
                    <span>⚔️ {fa(it.attackPoints ?? 0)}</span>
                    <span>🛡️ {fa(it.defensePoints ?? 0)}</span>
                    <span>🧱 نگهداری {fa(it.maintenancePerUnit ?? 0)}</span>
                    <span>سقف چرخه: {it.purchaseLimitPerCycle ? fa(it.purchaseLimitPerCycle) : 'ندارد'}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-slate-500">
                    <span>مالکان: {fa(it.holderCount)}</span>
                    <span>تعداد در بازی: {fa(it.totalOwned)}</span>
                    <span>ف رفته: {fa(it.totalSold)}</span>
                    <span>درآمد: {faMoney(it.totalRevenue)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="w-28"><input dir="ltr" className="ww-input !py-1 text-left" placeholder={String(it.price ?? 'قیمت')} value={priceDraft[String(it.id)] ?? ''} onChange={(e) => setPriceDraft((d) => ({ ...d, [String(it.id)]: e.target.value.replace(/[^\d]/g, '') }))} /></span>
                  <div className="flex gap-1">
                    <Btn variant="ghost" onClick={() => setEdit(it)}>ویرایش</Btn>
                    {canWrite && priceDraft[String(it.id)] ? (
                      <Btn
                        variant="primary"
                        onClick={async () => {
                          setBusy(true);
                          try {
                            await api.post('/admin/shop/prices-bulk', { items: [{ templateId: it.id, price: Number(priceDraft[String(it.id)]) }] });
                            toast('قیمت ثبت شد.', 'ok');
                            setPriceDraft((d) => ({ ...d, [String(it.id)]: '' }));
                            await list.reload();
                          } catch (e) {
                            toast((e as ApiError).message, 'err');
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        💾
                      </Btn>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {!list.loading && items.length === 0 ? <Empty text="آیتمی با این فیلترها نیست." /> : null}
        </div>
      ) : null}

      {tab === 'pricing' ? (
        <AdminBlock section="shop" title={`قیمت‌گذاری گروهی (${fa(dirty.length)} تغییر آماده)`} emoji="🏷️">
          <p className="mb-2 text-[11px] leading-6 text-slate-400">
            فقط ردیف‌هایی ذخیره می‌شوند که برایشان عدد نوشته‌اید. خالی‌گذاشتن قیمت یعنی «قابل خرید نیست» — هیچ قیمت صفر یا تصادفی ثبت نمی‌شود.
          </p>
          <div className="space-y-1">
            {(unpricedOnly ? unpriced : items).map((it: any) => (
              <Row key={it.id}>
                <span className="min-w-0 truncate text-xs">
                  {it.nameFa} <span className="text-[10px] text-slate-500">{it.categoryKey}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-[10px] text-slate-500">{it.price === null ? 'بدون قیمت' : faMoney(it.price)}</span>
                  <input
                    dir="ltr"
                    className="ww-input w-24 !py-1 text-left"
                    placeholder="قیمت"
                    value={priceDraft[String(it.id)] ?? ''}
                    onChange={(e) => setPriceDraft((d) => ({ ...d, [String(it.id)]: e.target.value.replace(/[^\d]/g, '') }))}
                  />
                </span>
              </Row>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500">هر ردیف یک transaction_item جدا با unit_price_snapshot می‌سازد؛ قیمت لحظه خرید در تاریخ می‌ماند.</span>
            <Btn
              variant="primary"
              loading={busy}
              disabled={dirty.length === 0 || !canWrite}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  const res = await api.post<{ updated: number }>('/admin/shop/prices-bulk', {
                    items: dirty.map(([id, v]) => ({ templateId: Number(id), price: Number(v) })),
                  });
                  toast(`${fa(res.updated)} قیمت ذخیره شد.`, 'ok');
                  setPriceDraft({});
                  await list.reload();
                } catch (e) {
                  setError((e as ApiError).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              💾 ذخیره {fa(dirty.length)} قیمت
            </Btn>
          </div>
          {error ? <p className="mt-1 text-[11px] text-danger">{error}</p> : null}
        </AdminBlock>
      ) : null}

      {tab === 'categories' ? (
        <div className="space-y-3">
          <AdminBlock section="shop" write={false} title="دسته‌بندی‌ها" emoji="🗂️">
            <p className="mb-2 text-[11px] leading-6 text-slate-400">
              ۱۸ دسته از فایل‌های اولیه وارد شده‌اند. نام آیتم‌های هم‌نام در دسته‌های مختلف (مثلاً جنگنده و پدافند هوایی) طبق سند طراحی مجاز و مستقل است؛ هیچ ادغام خودکاری انجام
              نمی‌شود.
            </p>
            <div className="space-y-1">
              {(cats.data?.categories ?? []).map((c: any) => (
                <Row key={c.key}>
                  <span className="text-xs">
                    {c.emoji} {c.labelFa} <span className="text-[10px] text-slate-500">({c.key} · {c.role})</span>
                  </span>
                  <span className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{fa(c.templates)} آیتم</span>
                    <Badge tone={c.unpriced > 0 ? 'bad' : 'ok'}>{fa(c.priced)} قیمت‌دار</Badge>
                    <span>وزن قدرت {fa(c.powerWeight)}</span>
                    <span>ترتیب {fa(c.sortOrder)}</span>
                  </span>
                </Row>
              ))}
            </div>
          </AdminBlock>

          <CategoryWeights categories={cats.data?.categories ?? []} canWrite={Boolean(me?.role === 'super_admin' || me?.permissions?.settings?.write)} onSaved={() => void cats.reload()} />

          <AdminBlock section="shop" title="ساخت/ویرایش دسته" emoji="➕">
            <CategoryForm onSaved={() => void cats.reload()} />
          </AdminBlock>
        </div>
      ) : null}

      {tab === 'sales' ? (
        <Card title="پرفروش‌ترین‌ها (از transaction_items)" emoji="📊">
          {sales.loading ? <Loading /> : null}
          <RawTable
            rows={sales.data?.rows}
            columns={[
              { key: 'name', label: 'آیتم' },
              { key: 'category', label: 'دسته' },
              { key: 'units', label: 'تعداد', render: (v) => fa(Number(v)) },
              { key: 'revenue', label: 'درآمد', render: (v) => faMoney(Number(v)) },
              { key: 'buyers', label: 'خریدار', render: (v) => fa(Number(v)) },
            ]}
            empty="هنوز خریدی ثبت نشده است."
          />
        </Card>
      ) : null}

      <Modal open={edit !== null} title={edit?.id ? `ویرایش ${edit.nameFa}` : 'افزودن تجهیزات جدید'} onClose={() => setEdit(null)}>
        {edit ? <EquipmentForm item={edit} onSaved={async () => { setEdit(null); await list.reload(); }} /> : null}
      </Modal>
    </div>
  );
}

function EquipmentForm({ item, onSaved }: { item: any; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState<Record<string, any>>({
    categoryKey: item.categoryKey,
    code: item.code,
    nameFa: item.nameFa,
    unitFa: item.unitFa ?? 'عدد',
    price: item.price === null ? '' : String(item.price),
    attackPoints: item.attackPoints === null || item.attackPoints === undefined ? '' : String(item.attackPoints),
    defensePoints: item.defensePoints === null || item.defensePoints === undefined ? '' : String(item.defensePoints),
    descriptionFa: item.description ?? '',
    isActive: item.isActive !== false,
    isForSale: item.isForSale !== false,
    purchaseLimitPerCycle: item.purchaseLimitPerCycle ? String(item.purchaseLimitPerCycle) : '',
    maintenancePerUnit: item.maintenancePerUnit === null || item.maintenancePerUnit === undefined ? '' : String(item.maintenancePerUnit),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const num = (v: any) => (String(v ?? '') === '' ? null : Number(v));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <L text="نام فارسی"><input className="ww-input" value={f.nameFa} onChange={set('nameFa')} maxLength={80} /></L>
        <L text="کد (latino/digits/_)" hint="مثلاً f22_raptor"><input className="ww-input" dir="ltr" value={f.code} onChange={set('code')} /></L>
        <L text="دسته">
          <select className="ww-input" value={f.categoryKey} onChange={set('categoryKey')}>
            {EQUIPMENT_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.emoji} {c.labelFa}</option>
            ))}
          </select>
        </L>
        <L text="واحد"><input className="ww-input" value={f.unitFa} onChange={set('unitFa')} maxLength={16} /></L>
        <L text="قیمت (خالی = بدون قیمت)"><input className="ww-input" dir="ltr" inputMode="numeric" value={f.price} onChange={set('price')} /></L>
        <L text="سقف خرید هر چرخه"><input className="ww-input" dir="ltr" inputMode="numeric" value={f.purchaseLimitPerCycle} onChange={set('purchaseLimitPerCycle')} /></L>
        <L text="امتیاز حمله"><input className="ww-input" dir="ltr" inputMode="numeric" value={f.attackPoints} onChange={set('attackPoints')} /></L>
        <L text="امتیاز دفاع"><input className="ww-input" dir="ltr" inputMode="numeric" value={f.defensePoints} onChange={set('defensePoints')} /></L>
        <L text="نگهداری هر واحد"><input className="ww-input" dir="ltr" inputMode="numeric" value={f.maintenancePerUnit} onChange={set('maintenancePerUnit')} /></L>
        <L text="توضیح"><input className="ww-input" value={f.descriptionFa} onChange={set('descriptionFa')} maxLength={200} /></L>
      </div>
      <div className="flex gap-2">
        <button className={`ww-tab ${f.isActive ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setF((s) => ({ ...s, isActive: !s.isActive }))}>فعال در بازی</button>
        <button className={`ww-tab ${f.isForSale ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setF((s) => ({ ...s, isForSale: !s.isForSale }))}>قابل خرید</button>
      </div>
      {error ? <p className="text-[11px] text-danger">{error}</p> : null}
      <div className="flex justify-end gap-2">
        {item.id ? (
        <Btn
          variant="danger"
          loading={busy}
          onClick={async () => {
            if (!window.confirm('این آیتم غیرفعال می‌شود (حذف فیزیکی نیست تا مالکیت‌ها و تراکنش‌ها نشکنند). ادامه می‌دهید؟')) return;
            setBusy(true);
            try {
              await api.post(`/admin/shop/equipment/${item.id}/delete`);
              toast('آیتم غیرفعال شد.', 'ok');
              onSaved();
            } catch (e) {
              setError((e as ApiError).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          🗑 غیرفعال کردن
        </Btn>
        ) : null}
        <Btn
          variant="primary"
          loading={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            if (!String(f.nameFa).trim()) {
              setError('نام فارسی آیتم را بنویسید.');
              setBusy(false);
              return;
            }
            if (!String(f.code).trim() || !/^[a-z0-9_]{2,40}$/i.test(String(f.code).trim())) {
              setError('کد آیتم باید ۲ تا ۴۰ کاراکتر لاتین/عدد/زیرخط باشد.');
              setBusy(false);
              return;
            }
            try {
              await api.post('/admin/shop/equipment', {
                ...(item.id ? { id: item.id } : {}),
                categoryKey: f.categoryKey,
                code: f.code,
                nameFa: f.nameFa.trim(),
                unitFa: f.unitFa.trim() || 'عدد',
                price: num(f.price),
                attackPoints: num(f.attackPoints),
                defensePoints: num(f.defensePoints),
                descriptionFa: f.descriptionFa,
                isActive: f.isActive,
                isForSale: f.isForSale,
                purchaseLimitPerCycle: num(f.purchaseLimitPerCycle),
                maintenancePerUnit: num(f.maintenancePerUnit),
              });
              toast('ذخیره شد.', 'ok');
              onSaved();
            } catch (e) {
              setError((e as ApiError).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          💾 ذخیره
        </Btn>
      </div>
    </div>
  );
}

function CategoryForm({ onSaved }: { onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ key: '', labelFa: '', shopLabelFa: '', emoji: '📦', role: 'offense', sortOrder: '999', isActive: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <L text="کلید (لاتین)"><input className="ww-input" dir="ltr" value={f.key} onChange={(e) => setF({ ...f, key: e.target.value })} /></L>
        <L text="برچسب"><input className="ww-input" value={f.labelFa} onChange={(e) => setF({ ...f, labelFa: e.target.value })} /></L>
        <L text="برچسب فروشگاه"><input className="ww-input" value={f.shopLabelFa} onChange={(e) => setF({ ...f, shopLabelFa: e.target.value })} /></L>
        <L text="ایموجی"><input className="ww-input" value={f.emoji} onChange={(e) => setF({ ...f, emoji: e.target.value })} /></L>
        <L text="نقش">
          <select className="ww-input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
            {['offense', 'defense', 'economy', 'support'].map((r) => (<option key={r} value={r}>{r}</option>))}
          </select>
        </L>
        <L text="ترتیب"><input className="ww-input" dir="ltr" value={f.sortOrder} onChange={(e) => setF({ ...f, sortOrder: e.target.value })} /></L>
      </div>
      {error ? <p className="text-[11px] text-danger">{error}</p> : null}
      <Btn
        variant="primary"
        loading={busy}
        disabled={f.key.trim().length < 2 || f.labelFa.trim().length < 1}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            await api.post('/admin/shop/categories', { ...f, sortOrder: Number(f.sortOrder), isActive: f.isActive });
            toast('دسته ذخیره شد.', 'ok');
            setF({ ...f, key: '', labelFa: '', shopLabelFa: '' });
            onSaved();
          } catch (e) {
            setError((e as ApiError).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        ➕ ثبت دسته
      </Btn>
    </div>
  );
}

function CategoryWeights({ categories, canWrite, onSaved }: { categories: any[]; canWrite: boolean; onSaved: () => void }) {
  const toast = useToast();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const dirty = Object.entries(draft).filter(([, v]) => v !== '');
  return (
    <AdminBlock section="settings" title="وزن قدرت هر دسته" emoji="⚖️">
      <p className="mb-2 text-[11px] leading-6 text-slate-400">
        وزن ضرب‌شده در امتیاز هر آیتم برای محاسبه قدرت نظامی. تغییر وزن باعث بازمحاسبه شدن فوری رتبه‌ها می‌شود.
      </p>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {categories.map((c: any) => (
          <Row key={c.key}>
            <span className="text-[11px]">{c.emoji} {c.labelFa}</span>
            <input dir="ltr" className="ww-input w-20 !py-0.5 text-left" placeholder={String(c.powerWeight ?? 0)} value={draft[c.key] ?? ''} onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.value.replace(/[^\d.]/g, '') }))} />
          </Row>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <Btn
          variant="primary"
          loading={busy}
          disabled={!canWrite || dirty.length === 0}
          onClick={async () => {
            setBusy(true);
            try {
              const res = await api.post<{ updated: number }>('/admin/shop/category-weights', { weights: Object.fromEntries(dirty.map(([k, v]) => [k, Number(v)])) });
              toast(`${fa(res.updated)} وزن به‌روزرسانی شد.`, 'ok');
              setDraft({});
              onSaved();
            } catch (e) {
              toast((e as ApiError).message, 'err');
            } finally {
              setBusy(false);
            }
          }}
        >
          💾 ذخیره {fa(dirty.length)} وزن
        </Btn>
      </div>
    </AdminBlock>
  );
}

function L({ text, hint, children }: { text: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="ww-label">{text}{hint ? <span className="mr-1 text-[10px] text-slate-500">({hint})</span> : null}</span>
      {children}
    </label>
  );
}

/** GET /api/admin/starter-templates (+ /:id/items), POST /api/admin/starter-templates */
export function AdminStarter() {
  const { me } = useAuth();
  const toast = useToast();
  const list = useApi<{ templates: any[] }>('/admin/starter-templates');
  const [openId, setOpenId] = useState<number | null>(null);
  const items = useApi<{ rows: any[] }>(openId ? `/admin/starter-templates/${openId}/items` : null, [openId]);
  const canWrite = me?.role === 'super_admin' || Boolean(me?.permissions?.economy?.write);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">📦 بسته‌های اولیه</h1>
      <AdminBlock section="economy" write={false}>
        <p className="text-[11px] leading-6 text-slate-400">
          بسته اولیه همان ۴۰ آیتم + خزانه ۱٬۰۰۰٬۰۰۰ سکه + درآمد ۵۰٬۰۰۰ از کارخانه و ۳۰٬۰۰۰ از معدن است. این‌جا فقط می‌توانید بسته جدید بسازید یا پیش‌فرض را عوض کنید —
          داده اولیه سند طراحی تغییر نمی‌کند مگر آنکه خودتان بسته تازه‌ای تعریف کنید.
        </p>
      </AdminBlock>

      {list.loading ? <Loading /> : null}
      {list.error ? <ErrorBox message={list.error} onRetry={list.reload} /> : null}

      <div className="space-y-2">
        {(list.data?.templates ?? []).map((t: any) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  {t.name}
                  {t.isDefault ? <Badge tone="ok">پیش‌فرض</Badge> : null}
                  {t.isActive === false ? <Badge tone="neutral">غیرفعال</Badge> : null}
                </div>
                {t.description ? <p className="mt-1 text-[11px] leading-5 text-slate-400">{t.description}</p> : null}
                <div className="mt-2">
                  <Grid cols={4}>
                    <Stat label="خزانه" value={faMoney(t.treasury)} />
                    <Stat label="کارخانه" value={faMoney(t.factoryIncome)} />
                    <Stat label="معدن" value={faMoney(t.mineIncome)} />
                    <Stat label="چرخه" value={`${fa(t.incomeCycleSeconds)}s`} />
                  </Grid>
                </div>
                <p className="mt-2 text-[10px] text-slate-500">{fa(t.itemCount)} قلم · {fa(t.totalUnits)} واحد · استفاده‌شده توسط {fa(t.usedBy)} کشور</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <Btn onClick={() => setOpenId(openId === t.id ? null : t.id)}>{openId === t.id ? 'بستن' : 'مشاهده اقلام'}</Btn>
                {canWrite && !t.isDefault ? (
                  <Btn
                    variant="primary"
                    onClick={async () => {
                      try {
                        // the upsert replaces the WHOLE template, so re-fetch this template's items first
                        // (GET /:id/items answers raw snake_case: {quantity, template_id, name_fa, label_fa, emoji})
                        const dump = await api.get<{ rows: any[] }>(`/admin/starter-templates/${t.id}/items`);
                        await api.post('/admin/starter-templates', {
                          id: t.id,
                          name: t.name,
                          treasury: t.treasury,
                          factoryIncome: t.factoryIncome,
                          mineIncome: t.mineIncome,
                          incomeCycleSeconds: t.incomeCycleSeconds,
                          setAsDefault: true,
                          items: (dump.rows ?? []).map((r: any) => ({ templateId: Number(r.template_id), quantity: Number(r.quantity) })),
                        });
                        toast('بسته پیش‌فرض تغییر کرد.', 'ok');
                        if (openId === t.id) await items.reload();
                        await list.reload();
                      } catch (e) {
                        toast((e as ApiError).message, 'err');
                      }
                    }}
                  >
                    ⭐ پیش‌فرض کردن
                  </Btn>
                ) : null}
              </div>
            </div>
            {openId === t.id ? (
              <div className="mt-2 border-t border-white/10 pt-2">
                {items.loading ? <Loading /> : null}
                <div className="grid gap-1 sm:grid-cols-2">
                  {(items.data?.rows ?? []).map((r: any) => (
                    <Row key={`${t.id}-${r.template_id}`}>
                      <span className="text-[11px]">{r.emoji} {r.name_fa} <span className="text-slate-500">({r.label_fa})</span></span>
                      <span className="text-[11px] text-slate-400">×{fa(r.quantity)}</span>
                    </Row>
                  ))}
                </div>
                {(items.data?.rows ?? []).length === 0 && !items.loading ? <p className="py-2 text-center text-[11px] text-slate-500">این بسته آیتمی ندارد.</p> : null}
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      {canWrite ? (
        <AdminBlock section="economy" title="بسته جدید" emoji="➕">
          {creating ? (
            <NewStarterForm onDone={async () => { setCreating(false); await list.reload(); }} />
          ) : (
            <Btn variant="primary" onClick={() => setCreating(true)}>➕ ساخت بسته اولیه جدید</Btn>
          )}
        </AdminBlock>
      ) : null}
    </div>
  );
}

function NewStarterForm({ onDone }: { onDone: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ name: '', treasury: '1000000', factoryIncome: '50000', mineIncome: '30000', incomeCycleSeconds: '86400' });
  const [items, setItems] = useState<{ templateId: number; quantity: number }[]>([]);
  const [search, setSearch] = useState('');
  const eq = useApi<{ items: any[] }>(`/admin/shop/equipment?q=${encodeURIComponent(search)}&limit=8`, [search]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <L text="نام بسته"><input className="ww-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></L>
        <L text="چرخه (ثانیه)"><input className="ww-input" dir="ltr" value={f.incomeCycleSeconds} onChange={(e) => setF({ ...f, incomeCycleSeconds: e.target.value })} /></L>
        <L text="خزانه"><input className="ww-input" dir="ltr" value={f.treasury} onChange={(e) => setF({ ...f, treasury: e.target.value })} /></L>
        <L text="کارخانه / معدن">
          <div className="flex gap-1">
            <input className="ww-input" dir="ltr" value={f.factoryIncome} onChange={(e) => setF({ ...f, factoryIncome: e.target.value })} />
            <input className="ww-input" dir="ltr" value={f.mineIncome} onChange={(e) => setF({ ...f, mineIncome: e.target.value })} />
          </div>
        </L>
      </div>

      <L text="افزودن آیتم">
        <input className="ww-input" placeholder="جست‌وجوی تجهیزات…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </L>
      <div className="max-h-40 space-y-1 overflow-y-auto">
        {(eq.data?.items ?? []).map((it: any) => (
          <Row key={it.id}>
            <span className="text-[11px]">{it.emoji} {it.nameFa} <span className="text-slate-500">({it.code})</span></span>
            <Btn onClick={() => setItems((list) => [...list.filter((x) => x.templateId !== it.id), { templateId: it.id, quantity: 1 }])}>➕</Btn>
          </Row>
        ))}
      </div>

      {items.length ? (
        <div className="space-y-1 rounded-xl border border-white/10 p-2">
          {items.map((i) => (
            <Row key={i.templateId}>
              <span className="text-[11px]">آیتم #{fa(i.templateId)}</span>
              <span className="flex items-center gap-1">
                <input dir="ltr" className="ww-input w-20 !py-0.5 text-left" value={String(i.quantity)} onChange={(e) => setItems((list) => list.map((x) => (x.templateId === i.templateId ? { ...x, quantity: Math.max(0, Number(e.target.value.replace(/[^\d]/g, '')) || 0) } : x)))} />
                <Btn variant="ghost" onClick={() => setItems((list) => list.filter((x) => x.templateId !== i.templateId))}>✕</Btn>
              </span>
            </Row>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-[11px] text-danger">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Btn variant="ghost" onClick={() => onDone()}>انصراف</Btn>
        <Btn
          variant="primary"
          loading={busy}
          disabled={f.name.trim().length < 2}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await api.post('/admin/starter-templates', {
                name: f.name.trim(),
                treasury: Number(f.treasury || 0),
                factoryIncome: Number(f.factoryIncome || 0),
                mineIncome: Number(f.mineIncome || 0),
                incomeCycleSeconds: Number(f.incomeCycleSeconds || 86400),
                setAsDefault: false,
                items,
              });
              toast('بسته ساخته شد.', 'ok');
              onDone();
            } catch (e) {
              setError((e as ApiError).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          💾 ساخت بسته
        </Btn>
      </div>
    </div>
  );
}
