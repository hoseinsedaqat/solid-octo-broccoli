import { useMemo, useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { fa, useToast, Loading, ErrorBox } from '../../ui';
import { LightBackButton, LightBullet, LightCard, LightGreenButton, LightNote, LightRedOutlineButton, LightSectionTitle, LightShell } from '../../components/Light';
import { CONTRACT_TYPES, RESOURCES, TRADE_PARTNERS, CONTRACT_TERM_DAYS } from '@ww/shared';
import { useResources } from './Resources';

interface ContractRow {
  id: number;
  side: 'export' | 'import' | string;
  sideLabelFa: string;
  contractType: string;
  contractTypeLabelFa: string;
  resourceKey: string;
  partnerKey: string;
  partnerLabelFa: string;
  partnerFlag: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
  daysLeft: number | null;
  completesAt: string;
}

/** «قراردادهای تجاری» — ایجاد قرارداد ۷ روزه + لیست قراردادهای فعال کشور (تسویهٔ تنبل روی سرور) */
export function ContractsPage() {
  const toast = useToast();
  const res = useResources();
  const contracts = useApi<{ contracts: ContractRow[] }>('/player/contracts');

  const [side, setSide] = useState<'export' | 'import'>('export');
  const [contractType, setContractType] = useState<string>('oil');
  const [resourceKey, setResourceKey] = useState<string>('oil');
  const [partnerKey, setPartnerKey] = useState<string>('russia');
  const [quantity, setQuantity] = useState<string>('10000');
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);

  const qty = Number(quantity);
  const market = RESOURCES.find((r) => r.key === resourceKey)?.market ?? 0;
  const total = Number.isFinite(qty) && qty > 0 ? Math.floor(qty * market) : 0;
  const active = (contracts.data?.contracts ?? []).filter((c) => c.status === 'active');
  const history = (contracts.data?.contracts ?? []).filter((c) => c.status !== 'active');
  const stockOf = (key: string) => res.data?.resources.find((r) => r.key === key)?.stock ?? 0;

  async function create() {
    if (!Number.isFinite(qty) || qty <= 0) {
      toast('مقدار معامله را به‌درستی وارد کنید.', 'err');
      return;
    }
    setBusy(true);
    try {
      await api.post('/player/contracts', { side, contractType, resourceKey, partnerKey, quantity: qty });
      toast('✅ قرارداد ثبت شد و برای کشور مقابل ارسال شد.', 'ok');
      await Promise.all([contracts.reload(), res.reload()]);
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در ثبت قرارداد', 'err');
    } finally {
      setBusy(false);
    }
  }

  async function cancel(id: number) {
    setCancelId(id);
    try {
      await api.post(`/player/contracts/${id}/cancel`, {});
      toast('❌ قرارداد لغو شد و مبالغ/کالا بازگردانده شد.', 'ok');
      await Promise.all([contracts.reload(), res.reload()]);
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا در لغو قرارداد', 'err');
    } finally {
      setCancelId(null);
    }
  }

  return (
    <LightShell title="قراردادهای تجاری" emoji="📜">
      {contracts.loading ? <Loading label="در حال دریافت قراردادها…" /> : null}
      {contracts.error ? <ErrorBox message={contracts.error} onRetry={contracts.reload} /> : null}

      {/* ------- ایجاد قرارداد تجاری ------- */}
      <LightCard>
        <div className="mb-2 text-[13px] font-extrabold text-[#111827]">🤝 ایجاد قرارداد تجاری</div>
        <ul className="mb-3 list-disc space-y-1 pr-5 text-[11px] leading-6 text-[#6b7280]">
          <li>انتخاب کشور طرف قرارداد</li>
          <li>انتخاب نوع قرارداد</li>
          <li>انتخاب منبع مورد معامله</li>
          <li>تعیین مقدار معامله</li>
          <li>تعیین قیمت و مدت قرارداد (۷ روز)</li>
        </ul>

        <div className="mb-1 text-[11px] font-extrabold text-[#374151]">جهت قرارداد</div>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <button onClick={() => setSide('export')} className={`rounded-2xl px-3 py-2.5 text-[12px] font-bold transition ${side === 'export' ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}>📤 صادرات</button>
          <button onClick={() => setSide('import')} className={`rounded-2xl px-3 py-2.5 text-[12px] font-bold transition ${side === 'import' ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}>📥 واردات</button>
        </div>

        <div className="mb-1 text-[11px] font-extrabold text-[#374151]">نوع قرارداد</div>
        <div className="mb-2 grid grid-cols-2 gap-2">
          {CONTRACT_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setContractType(t.key)}
              className={`rounded-2xl px-3 py-2.5 text-[11px] font-bold transition ${contractType === t.key ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
            >
              {t.emoji} {t.nameFa}
            </button>
          ))}
        </div>

        <div className="mb-1 text-[11px] font-extrabold text-[#374151]">منبع مورد معامله</div>
        <div className="mb-2 grid grid-cols-3 gap-2">
          {RESOURCES.map((r) => (
            <button
              key={r.key}
              onClick={() => setResourceKey(r.key)}
              className={`flex items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-bold transition ${resourceKey === r.key ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
            >
              {r.emoji} {r.nameFa}
            </button>
          ))}
        </div>

        <div className="mb-1 text-[11px] font-extrabold text-[#374151]">کشور طرف قرارداد</div>
        <div className="mb-2 grid grid-cols-2 gap-2">
          {TRADE_PARTNERS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPartnerKey(p.key)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-[11px] font-bold transition ${partnerKey === p.key ? 'bg-[#111111] text-white' : 'bg-[#e8eaed] text-[#111827]'}`}
            >
              {p.flag} {p.nameFa}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-[11px] font-extrabold text-[#374151]" htmlFor="contract-qty">مقدار معامله ({RESOURCES.find((r) => r.key === resourceKey)?.unitFa})</label>
        <input
          id="contract-qty"
          type="number"
          min={1}
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="mb-2 w-full rounded-2xl border border-black/10 bg-[#f8f9fb] px-4 py-3 text-left text-[13px] font-bold tabular-nums outline-none focus:border-black/30"
          placeholder="مثلاً 10000"
        />

        <div className="mb-2 flex items-center justify-between rounded-2xl bg-[#f3f4f6] px-4 py-2.5 text-[11px] text-[#374151]">
          <span>قیمت واحد: <b className="tabular-nums">{fa(market)} سکه</b></span>
          <span>مبلغ کل: <b className="tabular-nums">{fa(total)} سکه</b></span>
        </div>
        <p className="mb-2 px-1 text-[10px] leading-6 text-[#6b7280]">بعد از ثبت، قرارداد برای کشور مقابل ارسال شود و طرف مقابل بتواند قبول یا رد کند.</p>
        <LightGreenButton loading={busy} onClick={() => void create()}>✅ ثبت قرارداد — {fa(total)} سکه</LightGreenButton>
        {side === 'export' ? <p className="mt-1 px-1 text-[10px] text-[#9ca3af]">موجودی انبار شما: {fa(stockOf(resourceKey))} — کالا تا زمان تسویه در امانت قرار می‌گیرد.</p> : null}
      </LightCard>

      {/* ------- قراردادهای فعال ------- */}
      <div className="mt-4">
        <LightSectionTitle>قراردادهای فعال 📜</LightSectionTitle>
        {active.length === 0 && !contracts.loading ? <p className="px-2 py-4 text-center text-[11px] text-[#9ca3af]">قرارداد فعالی ندارید.</p> : null}
        <div className="space-y-3">
          {active.map((c) => {
            const open = expanded === c.id;
            return (
              <LightCard key={c.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold text-[#15803d]">قرارداد فعال</span>
                  <span className="text-[10px] tabular-nums text-[#9ca3af]">{c.sideLabelFa}</span>
                </div>
                <h3 className="mt-1 flex items-center gap-2 text-[14px] font-black text-[#111827]">{c.partnerFlag} {c.contractTypeLabelFa} با کشور {c.partnerLabelFa}</h3>
                <div className="mt-2 grid grid-cols-2 gap-y-1.5 text-[11px] leading-6 text-[#374151]">
                  <span>مقدار: <b className="tabular-nums">{fa(c.quantity)} واحد</b></span>
                  <span>مبلغ: <b className="tabular-nums">{fa(c.total)} سکه</b></span>
                  <span>مدت: <b className="tabular-nums">{CONTRACT_TERM_DAYS} روز</b></span>
                  <span>وضعیت: <b>{c.daysLeft !== null ? `در حال اجرا (${fa(c.daysLeft)} روز مانده)` : 'در حال اجرا'}</b></span>
                </div>
                {open ? (
                  <div className="mt-2 border-t border-black/5 pt-2 text-[11px] leading-7 text-[#374151]">
                    <div>نوع: {c.contractTypeLabelFa}</div>
                    <div>منبع: {RESOURCES.find((r) => r.key === c.resourceKey)?.nameFa ?? c.resourceKey}</div>
                    <div>قیمت واحد: {fa(c.unitPrice)} سکه</div>
                    <div>زمان پایان: {c.completesAt.slice(0, 10)}</div>
                    <div>جهت: {c.sideLabelFa}</div>
                  </div>
                ) : null}
                <div className="mt-3 space-y-2">
                  <button onClick={() => setExpanded(open ? null : c.id)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-4 py-3 text-[12px] font-bold text-white">
                    📄 {open ? 'بستن جزئیات قرارداد' : 'جزئیات قرارداد'}
                  </button>
                  <LightRedOutlineButton loading={cancelId === c.id} onClick={() => void cancel(c.id)}>
                    درخواست لغو قرارداد ❌
                  </LightRedOutlineButton>
                </div>
              </LightCard>
            );
          })}
        </div>
      </div>

      {/* ------- آرشیو قراردادها ------- */}
      {history.length > 0 ? (
        <div className="mt-4">
          <LightSectionTitle>قراردادهای پایان‌یافته</LightSectionTitle>
          <div className="space-y-1.5">
            {history.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white px-3 py-2 text-[10px] text-[#6b7280]">
                <span>{c.partnerFlag} {c.contractTypeLabelFa} {c.sideLabelFa} · {fa(c.quantity)} واحد</span>
                <span>{c.status === 'completed' ? '✅ تسویه‌شده' : '❌ لغوشده'}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-3">
        <LightBackButton label="بازگشت" to="/app/economy/foreign-trade" />
      </div>
      <div className="mt-2"><LightNote>تمام مقادیر و قیمت‌ها پویا و از بازار منابع خوانده می‌شوند.</LightNote></div>
    </LightShell>
  );
}
