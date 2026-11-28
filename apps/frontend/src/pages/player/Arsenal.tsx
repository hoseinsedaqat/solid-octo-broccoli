import { useState } from 'react';
import { useApi } from '../../auth';
import { api, type ApiError } from '../../api';
import { fa, useToast, Loading, ErrorBox, Modal, Stepper } from '../../ui';
import { LightBackButton, LightBullet, LightCard, LightNote, LightSectionTitle, LightShell } from '../../components/Light';

interface ArsenalItem {
  templateId: number;
  code: string;
  nameFa: string;
  quantity: number;
  deployed: number;
  total: number;
  unitFa: string;
  price: number | null;
  powerPoints: number;
  statusFa: string;
}
interface ArsenalGroup { key: string; labelFa: string; emoji: string; units: number; items: ArsenalItem[] }
interface ArsenalState {
  capacity: number;
  used: number;
  available: number;
  percent: number;
  health: number;
  shelterLevel: number;
  deployedUnits: number;
  warehouseUnits: number;
  groups: ArsenalGroup[];
}

/** «📦 انبار تجهیزات» — موجودی، سلامت و استقرار تجهیزات در یگان‌ها */
export function ArsenalPage() {
  const toast = useToast();
  const state = useApi<ArsenalState>('/player/arsenal');
  const data = state.data;

  const [openGroup, setOpenGroup] = useState<string>('armored');
  const [moveTarget, setMoveTarget] = useState<{ item: ArsenalItem; mode: 'deploy' | 'recall' } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  async function doMove() {
    if (!moveTarget) return;
    setBusy(true);
    try {
      const endpoint = moveTarget.mode === 'deploy' ? '/player/arsenal/deploy' : '/player/arsenal/recall';
      await api.post(endpoint, { templateId: moveTarget.item.templateId, quantity });
      toast(moveTarget.mode === 'deploy' ? '✅ تجهیزات به یگان منتقل شد.' : '✅ تجهیزات به انبار بازگشتند.', 'ok');
      setMoveTarget(null);
      await state.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'خطا', 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <LightShell title="انبار تجهیزات" emoji="📦">
      <p className="-mt-1 mb-3 px-1 text-[11px] text-[#6b7280]">موجودی انبار، سلامت تجهیزات و اعزام به یگان‌ها</p>

      {state.loading ? <Loading label="در حال دریافت انبار…" /> : null}
      {state.error ? <ErrorBox message={state.error} onRetry={state.reload} /> : null}

      {data ? (
        <>
          {/* ظرفیت انبار */}
          <LightCard>
            <div className="flex items-center justify-between gap-2 text-[12px]">
              <b>ظرفیت انبار</b>
              <span className="tabular-nums text-[#6b7280]">{fa(data.used)} / {fa(data.capacity)} واحد</span>
            </div>
            <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-black/10">
              <div
                className={`h-full rounded-full transition-all ${data.percent >= 90 ? 'bg-red-500' : data.percent >= 70 ? 'bg-amber-500' : 'bg-[#16a34a]'}`}
                style={{ width: `${data.percent}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[9px] text-[#9ca3af]">
              <span>{fa(data.available)} واحد خالی</span>
              <span>سطح پناهگاه (ظرفیت‌افزا): {fa(data.shelterLevel)}</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'در انبار', value: fa(data.warehouseUnits), emoji: '📦' },
                { label: 'در یگان', value: fa(data.deployedUnits), emoji: '🪖' },
                { label: 'سلامت', value: `${fa(data.health)}٪`, emoji: '❤️' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-[#eceff3] p-2">
                  <div className="text-base leading-none">{s.emoji}</div>
                  <div className="mt-0.5 text-[12px] font-black tabular-nums">{s.value}</div>
                  <div className="text-[9px] text-[#6b7280]">{s.label}</div>
                </div>
              ))}
            </div>
          </LightCard>

          {/* گروه‌ها */}
          <section className="mt-3 space-y-1.5">
            <LightSectionTitle>گروه‌های تجهیزاتی 🗂️</LightSectionTitle>
            {data.groups.map((g) => (
              <div key={g.key} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <button onClick={() => setOpenGroup(openGroup === g.key ? '' : g.key)} className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-right">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{g.emoji}</span>
                    <b className="text-[12px]">{g.labelFa}</b>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-bold tabular-nums text-[#374151]">{fa(g.units)} واحد</span>
                  </span>
                  <span className="text-[11px] text-[#9ca3af]">{openGroup === g.key ? '▲' : '▼'}</span>
                </button>
                {openGroup === g.key ? (
                  <div className="border-t border-black/5">
                    {g.items.length === 0 ? (
                      <p className="px-3 py-3 text-center text-[10px] text-[#9ca3af]">در این گروه چیزی ندارید.</p>
                    ) : (
                      g.items.map((item) => (
                        <div key={item.templateId} className="flex items-center justify-between gap-2 border-b border-black/5 px-3 py-2 last:border-0">
                          <span className="min-w-0">
                            <b className="block truncate text-[11px]">{item.nameFa}</b>
                            <span className="text-[9px] text-[#6b7280]">
                              انبار: {fa(item.quantity)} · یگان: {fa(item.deployed)} · قدرت: {fa(item.powerPoints)} · {item.statusFa}
                            </span>
                          </span>
                          <span className="flex shrink-0 gap-1">
                            <button
                              disabled={item.quantity < 1}
                              onClick={() => { setMoveTarget({ item, mode: 'deploy' }); setQuantity(1); }}
                              title="انتقال به یگان"
                              className="rounded-lg bg-[#111111] px-2 py-1.5 text-[10px] font-bold text-white disabled:opacity-30"
                            >
                              اعزام ▲
                            </button>
                            <button
                              disabled={item.deployed < 1}
                              onClick={() => { setMoveTarget({ item, mode: 'recall' }); setQuantity(1); }}
                              title="بازگشت به انبار"
                              className="rounded-lg border border-black/15 bg-transparent px-2 py-1.5 text-[10px] font-bold text-[#374151] disabled:opacity-30"
                            >
                              بازگشت ▼
                            </button>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </section>
          <LightNote>ظرفیت انبار با ارتقای «پناهگاه نظامی» در ساخت‌وساز (+۲۵۰ واحد به ازای هر سطح) افزایش می‌یابد.</LightNote>
        </>
      ) : null}

      {/* مودال اعزام/بازگشت */}
      <Modal
        open={Boolean(moveTarget)}
        title={moveTarget ? (moveTarget.mode === 'deploy' ? `اعزام ${moveTarget.item.nameFa}` : `بازگشت ${moveTarget.item.nameFa}`) : ''}
        onClose={() => setMoveTarget(null)}
        footer={
          moveTarget ? (
            <>
              <button className="rounded-xl border border-red-400 px-4 py-2 text-[12px] font-bold text-red-500" onClick={() => setMoveTarget(null)}>انصراف ❌</button>
              <button className="rounded-xl bg-[#16a34a] px-5 py-2 text-[12px] font-extrabold text-white disabled:opacity-40" disabled={busy} onClick={doMove}>
                {busy ? 'در حال انجام…' : '✅ تأیید'}
              </button>
            </>
          ) : undefined
        }
      >
        {moveTarget ? (
          <div className="space-y-3 text-[12px] text-[#374151]">
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2">
              <span>{moveTarget.mode === 'deploy' ? 'قابل اعزام از انبار' : 'مستقر در یگان'}</span>
              <b className="tabular-nums">{fa(moveTarget.mode === 'deploy' ? moveTarget.item.quantity : moveTarget.item.deployed)} واحد</b>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="shrink-0">تعداد</span>
              <Stepper
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={moveTarget.mode === 'deploy' ? moveTarget.item.quantity : moveTarget.item.deployed}
                step={1}
                presets={[1, 5, 10, 25]}
              />
            </div>
          </div>
        ) : null}
      </Modal>

      <div className="mt-4">
        <LightBackButton label="بازگشت به مدیریت کشور" to="/app/manage" />
      </div>
    </LightShell>
  );
}
