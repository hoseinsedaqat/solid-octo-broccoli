import { useMemo, useState } from 'react';
import { api, type ApiError } from '../../api';
import { useAuth, useApi } from '../../auth';
import { useRouter } from '../../router';
import { Badge, Btn, Card, Grid, Input, Modal, Row, Stat, Stepper, fa, faMoney, useToast } from '../../ui';
import { EQUIPMENT_CATEGORIES } from './meta';
import { NationSearchSelect } from '../../components/nations';

/**
 * «⚔️ حمله» — انتخاب تجهیزات حمله
 * دقیقاً همان جریانی که کاربر خواسته: اول دستهٔ تجهیزات حمله، بعد آیتم‌های همان دسته از انبارِ واقعیِ کشور،
 * بعد تعدادِ دقیق (مثلاً ۲۰ راکت)، بعد هدف و ارسال پیشنهاد جنگ.
 * واحدهای آرایش‌داده‌شده نیروی ضربتیِ این جنگ‌اند؛ بقیهٔ ارتش در وطن می‌ماند (موتور قطعی روی همین واحدها محاسبه می‌کند).
 */

interface PlanItem {
  templateId: number;
  nameFa: string;
  emoji: string;
  categoryKey: string;
  quantity: number;
  attackPoints: number | null;
  defensePoints: number | null;
}

export function AttackProposal({ onProposed }: { onProposed: (warId: number) => void }) {
  const { me } = useAuth();
  const { navigate } = useRouter();
  const toast = useToast();
  const inventory = useApi<{ groups: any[] }>('/player/military');
  const groups = inventory.data?.groups ?? [];

  const [plan, setPlan] = useState<Map<number, PlanItem>>(new Map());
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [qty, setQty] = useState(1);
  const [target, setTarget] = useState<{ id: number; name: string; flag: string } | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [indemnity, setIndemnity] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offenseCategories = useMemo(() => EQUIPMENT_CATEGORIES.filter((c) => c.role === 'offense'), []);
  const ownedIn = (key: string) => (groups.find((g: any) => g.categoryKey === key)?.items ?? []) as any[];
  const totalOwnedIn = (key: string) => ownedIn(key).reduce((n: number, i: any) => n + Number(i.quantity), 0);

  const planList = useMemo(() => [...plan.values()], [plan]);
  const planUnits = planList.reduce((n, i) => n + i.quantity, 0);
  const planAttack = planList.reduce((n, i) => (i.attackPoints === null || i.attackPoints === undefined ? n : n + Number(i.attackPoints) * i.quantity), 0);
  const planCategories = new Set(planList.map((i) => i.categoryKey)).size;

  function addToPlan() {
    if (!activeItem) return;
    const owned = Math.max(1, Number(activeItem.quantity) || 1);
    const n = Math.max(1, Math.min(owned, Math.floor(qty)));
    const cat = EQUIPMENT_CATEGORIES.find((c) => c.key === activeItem.categoryKey);
    setPlan((prev) => {
      const next = new Map(prev);
      next.set(activeItem.templateId, {
        templateId: activeItem.templateId,
        nameFa: activeItem.nameFa,
        emoji: cat?.emoji ?? '🎖️',
        categoryKey: activeItem.categoryKey,
        quantity: n,
        attackPoints: activeItem.attackPoints ?? null,
        defensePoints: activeItem.defensePoints ?? null,
      });
      return next;
    });
    toast(`${fa(n)} × ${activeItem.nameFa} به آرایش اضافه شد.`, 'ok');
    setActiveItem(null);
  }

  function removeFromPlan(templateId: number) {
    setPlan((prev) => {
      const next = new Map(prev);
      next.delete(templateId);
      return next;
    });
  }

  async function calcPreview() {
    if (!target) return;
    setBusy(true);
    setError(null);
    try {
      setPreview(
        await api.post('/war/preview', {
          targetNationId: target.id,
          attackPlan: planList.length ? planList.map((p) => ({ templateId: p.templateId, quantity: p.quantity })) : undefined,
        }),
      );
    } catch (e) {
      setError((e as ApiError).message ?? 'پیش‌نمایش ناموفق');
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!target) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ warId: number }>('/war/propose', {
        targetNationId: target.id,
        indemnityOffered: Number(indemnity || 0),
        attackPlan: planList.length ? planList.map((p) => ({ templateId: p.templateId, quantity: p.quantity })) : undefined,
      });
      setPlan(new Map());
      setTarget(null);
      setPreview(null);
      setIndemnity('');
      toast('پیشنهاد جنگ همراه با آرایش حمله ثبت شد.', 'ok');
      onProposed(res.warId);
      navigate(`/app/war/${res.warId}`);
    } catch (e) {
      setError((e as ApiError).message ?? 'ثبت پیشنهاد ناموفق بود.');
      toast('ثبت پیشنهاد ناموفق بود.', 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* انتخاب تجهیزات حمله */}
      <Card title="انتخاب تجهیزات حمله" emoji="⚔️">
        <p className="mb-2 text-[11px] leading-5 text-slate-400">تجهیزات موردنظر برای عملیات را انتخاب کنید. واحدهای انتخاب‌شده نیروی ضربتی این حمله‌اند؛ بقیهٔ ارتش برای دفاع از کشور می‌ماند.</p>
        {inventory.loading ? <p className="py-6 text-center text-xs text-slate-500">در حال خواندن انبار…</p> : null}
        <div className="grid grid-cols-2 gap-2">
          {offenseCategories.map((c) => {
            const owned = totalOwnedIn(c.key);
            return (
              <button
                key={c.key}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-2 py-3 transition-colors hover:border-gold/40 hover:bg-gold/5"
                onClick={() => setActiveCat(c.key)}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="mt-1 text-xs font-bold">{c.labelFa.replace(/‌ها$/, '')}</span>
                <span className="text-[10px] text-slate-500">{fa(owned)} واحد موجود</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* آرایش فعلی */}
      {planList.length > 0 ? (
        <Card title="آرایش حمله" emoji="🎯" right={<Badge tone="info">مجموع {fa(planUnits)} واحد</Badge>}>
          <div className="space-y-1">
            {planList.map((item) => (
              <Row key={item.templateId}>
                <span className="flex min-w-0 items-center gap-2 text-xs">
                  <span>{item.emoji}</span>
                  <span className="truncate">{item.nameFa}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-[11px]">
                  <span className="font-black text-slate-100">×{fa(item.quantity)}</span>
                  <button className="ww-btn ww-btn-ghost !px-2 !py-1" onClick={() => removeFromPlan(item.templateId)} aria-label="حذف">
                    ✕
                  </button>
                </span>
              </Row>
            ))}
          </div>
          <div className="mt-2">
            <Grid cols={2}>
              <Stat label="واحد اعزامی" value={fa(planUnits)} />
              <Stat label="دسته‌های درگیر" value={fa(planCategories)} />
            </Grid>
          </div>
          {planAttack > 0 ? <p className="mt-1 text-[11px] text-slate-400">امتیاز حمله آرایش: {fa(planAttack)} — قدرت نهایی توسط سرور از روی وزن‌ها محاسبه می‌شود.</p> : null}
          <Btn variant="ghost" className="mt-2" onClick={() => setPlan(new Map())}>
            پاک‌کردن آرایش
          </Btn>
        </Card>
      ) : (
        <p className="px-1 text-[11px] leading-6 text-slate-500">اگر آرایشی انتخاب نکنید، با کل نیروی نظامی کشور حمله خواهید کرد.</p>
      )}

      {/* انتخاب کشور هدف */}
      <Card title="انتخاب کشور هدف" emoji="🌍">
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

            <Btn loading={busy} onClick={calcPreview}>
              محاسبه پیش‌نمایش در سرور {planList.length ? '(بسته به آرایش)' : ''}
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
                  <p className="rounded-xl border border-danger/40 bg-danger/10 p-2 text-[11px] leading-5 text-danger">⚠️ شانس برد شما پایین است.</p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label className="ww-label" htmlFor="ww-indemnity">
                غرامت پیشنهادی (اختیاری)
              </label>
              <Input id="ww-indemnity" inputMode="numeric" dir="ltr" value={indemnity} onChange={(e) => setIndemnity(e.target.value.replace(/[^\d]/g, ''))} placeholder="۰" />
            </div>

            <Btn variant="danger" className="w-full" loading={busy} disabled={!preview} onClick={submit}>
              ⚔️ ارسال پیشنهاد جنگ {planList.length ? `با ${fa(planUnits)} واحد اعزامی` : ''}
            </Btn>
            {error ? <p className="text-xs leading-5 text-danger">{error}</p> : null}
          </div>
        )}
      </Card>

      {/* دسته → آیتم‌ها */}
      <Modal
        open={activeCat !== null}
        title={activeCat ? `${EQUIPMENT_CATEGORIES.find((c) => c.key === activeCat)?.emoji ?? ''} ${EQUIPMENT_CATEGORIES.find((c) => c.key === activeCat)?.labelFa ?? ''}` : ''}
        onClose={() => setActiveCat(null)}
      >
        <div className="space-y-2">
          {ownedIn(activeCat!).length === 0 ? (
            <div className="space-y-2 py-4 text-center">
              <p className="text-sm text-slate-400">از این دسته موجودی ندارید.</p>
              <Btn variant="primary" onClick={() => navigate('/app/shop')}>
                🛒 رفتن به فروشگاه
              </Btn>
            </div>
          ) : (
            ownedIn(activeCat!).map((item: any) => {
              const chosen = plan.get(item.templateId)?.quantity ?? 0;
              return (
                <button
                  key={item.templateId}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right transition-colors hover:border-gold/40"
                  onClick={() => {
                    setActiveItem({ ...item, categoryKey: activeCat });
                    setQty(Math.min(Math.max(1, chosen || 1), Number(item.quantity)));
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">{item.nameFa}</span>
                    <span className="text-[10px] text-slate-500" dir="ltr">
                      {item.code}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-[11px]">
                    <span className="text-slate-400">×{fa(item.quantity)}</span>
                    {chosen > 0 ? <Badge tone="ok">{fa(chosen)} در آرایش</Badge> : <Badge tone="info">انتخاب</Badge>}
                  </span>
                </button>
              );
            })
          )}
          <div className="flex justify-end pt-1">
            <Btn variant="ghost" onClick={() => setActiveCat(null)}>
              ⬅️ بازگشت
            </Btn>
          </div>
        </div>
      </Modal>

      {/* انتخاب تعداد */}
      <Modal
        open={activeItem !== null}
        title={activeItem ? String(activeItem.nameFa) : ''}
        onClose={() => setActiveItem(null)}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setActiveItem(null)}>
              انصراف
            </Btn>
            <Btn variant="primary" onClick={addToPlan}>
              ✅ افزودن به آرایش
            </Btn>
          </>
        }
      >
        {activeItem ? (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">موجودی شما: {fa(activeItem.quantity)} واحد</p>
            <Stepper value={qty} onChange={setQty} min={1} max={Number(activeItem.quantity)} step={1} presets={[1, 5, 10, 20, Number(activeItem.quantity)]} />
            <p className="text-center text-[11px] text-slate-500">
              {fa(qty)} / {fa(activeItem.quantity)}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
