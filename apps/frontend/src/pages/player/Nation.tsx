import { useEffect, useMemo, useState } from 'react';
import { api, type ApiError } from '../../api';
import { useApi, useAuth } from '../../auth';
import { useRouter } from '../../router';
import { Badge, Btn, Card, Empty, ErrorBox, Grid, Input, Loading, Row, Stat, fa, faDateTime, faDuration, faMoney, useToast } from '../../ui';
import { EQUIPMENT_CATEGORIES, FLAG_CHOICES, NAV_TITLES, DEFENSE_ARRANGEMENT, categoryEmoji, categoryLabel } from './meta';

/* ------------------------------ nation detail ----------------------------- */

export function NationOverview() {
  const { me, refresh } = useAuth();
  const { navigate } = useRouter();
  const view = me?.view;
  const wars = useApi<{ wars: any[] }>('/war/wars');
  const activeWar = (wars.data?.wars ?? []).find((w: any) => w.status === 'active');
  if (!view?.nation) return <Empty text="کشوری برای نمایش نیست." />;

  const v = view;
  const n = v.nation;
  const flags: [string, boolean][] = [
    ['🏭 کارخانه', true],
    ['⛏️ معدن', true],
    ['📡 رادار', v.military.radarCount > 0],
    ['🛡️ پدافند', v.military.airDefenseUnits > 0],
  ];

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.country}</h1>

      <Card>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{n.flag}</span>
          <div className="min-w-0">
            <div className="truncate text-lg font-extrabold">{n.name}</div>
            <p className="text-[11px] text-slate-400">
              رهبر {n.leaderName} · از {faDateTime(n.createdAt)}
            </p>
          </div>
          <span className="mr-auto flex flex-col items-end gap-1">
            <Badge tone={n.status === 'active' ? 'ok' : 'bad'}>{n.status === 'active' ? '🟢 فعال' : n.status}</Badge>
            <span className="text-[11px] text-slate-400">رتبه {fa(n.worldRank)}</span>
          </span>
        </div>
        {v.starterTemplateName ? (
          <p className="mt-2 rounded-xl border border-white/10 bg-white/5 p-2 text-[11px] leading-5 text-slate-400">
            📦 بسته اولیه: «{v.starterTemplateName}» — دارایی‌های واقعی از انبار خوانده می‌شود، نه از این برچسب.
          </p>
        ) : null}
        {activeWar ? (
          <button className="mt-2 w-full rounded-xl border border-danger/40 bg-danger/10 p-2 text-right text-[11px] leading-5 text-danger" onClick={() => navigate(`/app/war/${activeWar.id}`)}>
            ⚔️ جنگ فعال با {n.id === activeWar.attackerNationId ? activeWar.defenderName : activeWar.attackerName} — راند {fa(activeWar.roundsPlayed)}. برای دیدن پرونده بزنید.
          </button>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-slate-400">
          {flags.map(([label, present]) => (
            <span key={label} className={`rounded-full border px-2 py-0.5 ${present ? 'border-ok/40 text-ok' : 'border-white/10 opacity-60'}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Btn variant="primary" onClick={() => navigate('/app/profile')}>
            ✏️ ویرایش کشور
          </Btn>
          <Btn loading={false} onClick={() => void refresh()}>
            🔄 تازه‌سازی
          </Btn>
        </div>
      </Card>

      <Card title="اقتصاد" emoji="💰">
        <Grid cols={4}>
          <Stat label="خزانه" value={faMoney(v.economy.treasury)} />
          <Stat label="ناخالص دوره" value={faMoney(v.economy.grossIncome)} />
          <Stat label="خالص دوره" value={faMoney(v.economy.netIncome)} tone="ok" />
          <Stat label="مالیات دوره" value={faMoney(v.economy.taxCost)} tone="warn" />
        </Grid>
        <div className="mt-2">
          <Grid cols={4}>
            <Stat label="کارخانه" value={faMoney(v.economy.factoryIncome)} />
            <Stat label="معدن" value={faMoney(v.economy.mineIncome)} />
            <Stat label="نگهداری" value={faMoney(v.economy.maintenanceCost)} tone="warn" />
            <Stat label="زیان جنگ" value={faMoney(v.economy.totalWarLosses)} tone="bad" />
          </Grid>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-slate-500">
          <span>مجموع درآمد {faMoney(v.economy.totalIncome)}</span>
          <span>مجموع خرج {faMoney(v.economy.totalSpent)}</span>
          <span>مجموع مالیات {faMoney(v.economy.totalTax)}</span>
        </div>
        <div className="mt-2">
          <Btn onClick={() => navigate('/app/player/economy')}>دفتر مالی و نمودار</Btn>
        </div>
      </Card>

      <Card title="قدرت نظامی" emoji="🎖️">
        <Grid cols={3}>
          <Stat label="حمله" value={fa(v.military.attackPower)} />
          <Stat label="دفاع" value={fa(v.military.defensePower)} />
          <Stat label="مجموع" value={fa(v.military.militaryPower)} tone="ok" />
        </Grid>
        <div className="mt-2">
          <Grid cols={3}>
            <Stat label="تجهیزات" value={fa(v.military.equipmentCount)} />
            <Stat label="سرباز" value={fa(v.military.troopsCount)} />
            <Stat label="پدافند هوایی" value={fa(v.military.airDefenseUnits)} />
          </Grid>
        </div>
        <div className="mt-2 flex gap-2">
          <Btn onClick={() => navigate('/app/military')}>🎖️ انبار</Btn>
          <Btn onClick={() => navigate('/app/defense')}>🛰️ پدافند</Btn>
        </div>
      </Card>

      <Card title="دیپلماسی و سابقه" emoji="🌐">
        <Grid cols={3}>
          <Stat label="متحدان" value={fa(v.diplomacy.allies)} tone="ok" />
          <Stat label="دشمنان" value={fa(v.diplomacy.enemies)} tone="bad" />
          <Stat label="جنگ‌ها" value={fa(n.warsCount)} hint={`${fa(n.winsCount)} برد · ${fa(n.lossesCount)} باخت`} />
        </Grid>
        <div className="mt-3 space-y-1 text-[11px] text-slate-400">
          <p>
            تغییر نام بعدی: {v.history.cooldowns.renameSecondsLeft > 0 ? `قفل تا ${faDuration(v.history.cooldowns.renameSecondsLeft)}` : 'آزاد'} · آخرین {faDateTime(v.history.lastRenameAt)}
          </p>
          <p>
            تغییر نام رهبر: {v.history.cooldowns.leaderSecondsLeft > 0 ? `قفل تا ${faDuration(v.history.cooldowns.leaderSecondsLeft)}` : 'آزاد'} · آخرین {faDateTime(v.history.lastLeaderRenameAt)}
          </p>
          <p>
            تغییر پرچم: {v.history.cooldowns.flagSecondsLeft > 0 ? `قفل تا ${faDuration(v.history.cooldowns.flagSecondsLeft)}` : 'آزاد'} · آخرین {faDateTime(v.history.lastFlagChangeAt)}
          </p>
        </div>
        <div className="mt-2">
          <Btn onClick={() => navigate('/app/friends')}>🕊️ روابط دیپلماتیک</Btn>
        </div>
      </Card>
    </div>
  );
}

/* --------------------------------- military -------------------------------- */

export function MilitaryPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const inv = useApi<{ groups: any[]; totalCategories: number }>('/player/military');
  const all = inv.data?.groups ?? [];

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all
      .filter((g: any) => cat === 'all' || g.categoryKey === cat)
      .map((g: any) => ({
        ...g,
        items: needle ? g.items.filter((i: any) => String(i.nameFa).toLowerCase().includes(needle) || String(i.code ?? '').toLowerCase().includes(needle)) : g.items,
      }))
      .filter((g: any) => g.items.length > 0);
  }, [all, q, cat]);

  const totals = all.reduce(
    (acc: any, g: any) => {
      acc.units += g.items.reduce((s: number, i: any) => s + Number(i.quantity), 0);
      return acc;
    },
    { units: 0 },
  );

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.military}</h1>

      <Card>
        <Grid cols={3}>
          <Stat label="دسته‌های فعال" value={fa(all.length)} />
          <Stat label="واحد در انبار" value={fa(totals.units)} />
          <Stat label="دسته‌های فروشگاه" value={fa(EQUIPMENT_CATEGORIES.length)} />
        </Grid>
        <div className="mt-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو در نام یا کد تجهیزات…" />
        </div>
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
          <button className={`ww-tab ${cat === 'all' ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setCat('all')}>
            همه
          </button>
          {EQUIPMENT_CATEGORIES.map((c) => (
            <button key={c.key} className={`ww-tab ${cat === c.key ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => setCat(c.key)}>
              {c.emoji} {c.labelFa}
            </button>
          ))}
        </div>
      </Card>

      {inv.loading ? <Loading /> : null}
      {inv.error ? <ErrorBox message={inv.error} onRetry={inv.reload} /> : null}

      {groups.map((g: any) => (
        <Card key={g.categoryKey} title={g.labelFa ?? categoryLabel(g.categoryKey)} emoji={g.emoji ?? categoryEmoji(g.categoryKey)} right={<Badge tone="info">مجموع {fa(g.total ?? 0)}</Badge>}>
          <div className="space-y-1">
            {g.items.map((it: any) => (
              <Row key={it.templateId}>
                <span className="flex min-w-0 items-center gap-2 text-xs">
                  <span className="truncate">{it.nameFa}</span>
                  <span className="shrink-0 text-[10px] text-slate-500">{it.code}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-[10px] text-slate-400">
                  {it.attackPoints ? <span>⚔️ {fa(it.attackPoints)}</span> : null}
                  {it.defensePoints ? <span>🛡️ {fa(it.defensePoints)}</span> : null}
                  {it.powerPoints && !it.attackPoints && !it.defensePoints ? <span>⭐ {fa(it.powerPoints)}</span> : null}
                  {it.unitUpkeep ? <span className="text-danger">🧱 {fa(it.unitUpkeep)}</span> : null}
                  <span className="text-sm font-black text-slate-100">×{fa(it.quantity)}</span>
                </span>
              </Row>
            ))}
          </div>
        </Card>
      ))}

      {!inv.loading && groups.length === 0 ? (
        <Empty
          text={q ? 'موردی با این نام پیدا نشد.' : 'انبار خالی است.'}
          action={
            <Btn variant="primary" onClick={() => navigate('/app/shop')}>
              🛒 رفتن به فروشگاه
            </Btn>
          }
        />
      ) : null}

      <p className="px-1 text-[11px] leading-6 text-slate-500">
        🧾 امتیاز حمله/دفاع هر آیتم مستقیماً از همان ردیف equipment_templates می‌آید که قدرت نظامی کشور از آن محاسبه می‌شود؛ عددی در این صفحه اضافه یا کم نمی‌شود.
      </p>
    </div>
  );
}

const navigate = (path: string) => {
  window.location.hash = path;
};

/* --------------------------------- defense --------------------------------- */

const ALL_DEFENSE_KEYS = DEFENSE_ARRANGEMENT.map((d) => d.key) as string[];

/** «🛡️ مرکز فرماندهی دفاع» — انتخاب دسته‌های متعهد به دفاع کشور */
function DefenseArrangement() {
  const toast = useToast();
  const planState = useApi<{ plan: string[] | null }>('/player/defense-plan');
  const [selected, setSelected] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (selected === null && planState.data) {
      setSelected(planState.data.plan === null ? ALL_DEFENSE_KEYS : planState.data.plan);
    }
  }, [planState.data, selected]);

  const sel = selected ?? [];
  const toggle = (key: string) =>
    setSelected((prev) => {
      const base = prev ?? ALL_DEFENSE_KEYS;
      return base.includes(key) ? base.filter((k) => k !== key) : [...base, key];
    });

  async function save() {
    if (selected === null) return;
    if (selected.length === 0) {
      const ok = window.confirm('هیچ نیرویی انتخاب نکرده‌اید؛ در حمله مدافع شما بی‌نیرو خواهد بود. تأیید می‌کنید؟');
      if (!ok) return;
    }
    setBusy(true);
    try {
      const all = selected.length === ALL_DEFENSE_KEYS.length;
      await api.put('/player/defense-plan', { categories: all ? null : selected });
      toast('✅ آرایش دفاعی ثبت شد', 'ok');
      await planState.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'ثبت آرایش دفاعی ناموفق بود', 'err');
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy(true);
    try {
      await api.put('/player/defense-plan', { categories: null });
      setSelected(ALL_DEFENSE_KEYS);
      toast('به حالت پیش‌فرض بازگشت؛ همه نیروها دفاع می‌کنند.', 'ok');
      await planState.reload();
    } catch (err) {
      toast((err as ApiError).message ?? 'بازنشانی ناموفق بود', 'err');
    } finally {
      setBusy(false);
    }
  }

  if (planState.loading && selected === null) {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>
          {fa(sel.length)} از {fa(ALL_DEFENSE_KEYS.length)} دسته متعهد شدند
        </span>
        <button className="ww-btn ww-btn-ghost !px-2 !py-1 text-[10px]" onClick={() => void reset()} disabled={busy}>
          ♻️ بازنشانی (همه نیروها)
        </button>
      </div>
      {planState.error ? <ErrorBox message={planState.error} onRetry={planState.reload} /> : null}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DEFENSE_ARRANGEMENT.map((tile) => {
          const on = sel.includes(tile.key);
          return (
            <button
              key={tile.key}
              onClick={() => toggle(tile.key)}
              aria-pressed={on}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-4 transition ${
                on ? 'border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_0_1px_rgba(52,211,153,.35)]' : 'border-white/10 bg-white/5 opacity-60'
              }`}
            >
              <span className="text-3xl leading-none">{tile.emoji}</span>
              <span className="text-xs font-extrabold">{tile.labelFa}</span>
              <span className={`text-[10px] font-bold ${on ? 'text-ok' : 'text-slate-500'}`}>{on ? '✓ در آرایش' : 'خارج'}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] leading-5 text-slate-500">
        🏰 «استحکامات دفاعی» یعنی سطح استحکامات کشور در نبرد احتساب شود. آرایش دفاعی در جنگ علیه شما اعمال می‌شود:
        فقط همین دسته‌ها دفاع می‌کنند و فقط همین‌ها خسارت می‌بینند.
      </p>
      <div className="mt-2">
        <Btn variant="primary" className="!w-full !rounded-2xl !py-3 !text-sm" loading={busy} onClick={() => void save()}>
          ✅ تأیید آرایش دفاعی
        </Btn>
      </div>
    </Card>
  );
}

export function DefensePage() {
  const def = useApi<any>('/player/defense');
  const d = def.data;
  const statusTone = d?.status === 'under_attack' ? 'bad' : d?.status === 'alert' ? 'warn' : d?.status === 'exposed' ? 'warn' : 'ok';

  return (
    <div className="space-y-3">
      <div className="pt-1 text-center">
        <h1 className="text-lg font-black">🛡️ مرکز فرماندهی دفاع</h1>
        <p className="mt-1 text-[11px] text-slate-400">تجهیزات موردنظر را برای دفاع از کشور انتخاب کنید.</p>
      </div>
      <DefenseArrangement />
      {def.loading ? <Loading /> : null}
      {def.error ? <ErrorBox message={def.error} onRetry={def.reload} /> : null}
      {d ? (
        <>
          <Card>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{d.status === 'under_attack' ? '🔥' : d.status === 'secure' ? '🛰️' : '⚠️'}</span>
                <div>
                  <div className="text-sm font-bold">{d.statusLabelFa}</div>
                  <p className="text-[11px] text-slate-400">حالت دفاع: {d.defenseMode === 'active' ? 'پویا' : d.defenseMode === 'passive' ? 'منفعل' : 'استاندارد'}</p>
                </div>
              </div>
              <Badge tone={statusTone as any}>{d.status}</Badge>
            </div>
            <div className="mt-3">
              <Grid cols={4}>
                <Stat label="امتیاز دفاع" value={fa(d.defenseScore)} />
                <Stat label="امتیاز کلی" value={fa(d.overallScore)} />
                <Stat label="استحکامات" value={fa(d.fortificationLevel)} />
                <Stat label="رادار" value={fa(d.radarCount)} />
              </Grid>
            </div>
            <div className="mt-2">
              <Grid cols={3}>
                <Stat label="سرباز" value={fa(d.troopsCount)} />
                <Stat label="پدافند هوایی" value={fa(d.airDefenseUnits)} />
                <Stat label="تهدید فعال" value={fa((d.activeThreats ?? []).length)} tone={(d.activeThreats ?? []).length ? 'bad' : 'ok'} />
              </Grid>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn onClick={() => navigate('/app/shop')}>🛒 تقویت پدافند</Btn>
              <Btn onClick={() => navigate('/app/profile')}>⚙️ تنظیم حالت دفاع</Btn>
            </div>
          </Card>

          <Card title="سهم هر دسته در دفاع" emoji="🧮">
            {(d.breakdown ?? []).length === 0 ? <Empty text="هنوز هیچ دسته دفاعی‌ای نخریده‌اید." /> : null}
            <div className="space-y-1">
              {(d.breakdown ?? []).map((b: any) => (
                <Row key={b.categoryKey}>
                  <span className="text-xs">
                    {b.emoji} {b.labelFa}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {fa(b.quantity)} واحد · {fa(b.contribution)} امتیاز
                  </span>
                </Row>
              ))}
            </div>
          </Card>

          <Card title="تهدیدهای فعال" emoji="🚨">
            {(d.activeThreats ?? []).length === 0 ? <Empty text="هیچ جنگ فعالی علیه شما در جریان نیست." /> : null}
            <div className="space-y-1">
              {(d.activeThreats ?? []).map((t: any) => (
                <Row key={t.warId} onClick={() => navigate(`/app/war/${t.warId}`)}>
                  <span className="text-xs">
                    {t.flag} {t.attackerName}
                  </span>
                  <span className="text-[11px] text-danger">راند {fa(t.roundNo)}</span>
                </Row>
              ))}
            </div>
          </Card>
        </>
      ) : null}
      <Btn variant="ghost" className="!w-full !rounded-2xl !py-3" onClick={() => navigate('/app/player')}>
        🔙 بازگشت به منوی اصلی
      </Btn>
    </div>
  );
}

/* --------------------------------- profile --------------------------------- */

export function ProfilePage() {
  const { me, refresh, logout } = useAuth();
  const toast = useToast();
  const view = me?.view;
  const n = view?.nation;
  const [name, setName] = useState(n?.name ?? '');
  const [leader, setLeader] = useState(n?.leaderName ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flagChoices: string[] = FLAG_CHOICES as unknown as string[];
  const [flag, setFlag] = useState(n?.flag ?? flagChoices[0] ?? '🏳️');

  const cooldowns = view?.history.cooldowns ?? ({ renameSecondsLeft: 0, leaderSecondsLeft: 0, flagSecondsLeft: 0 } as any);

  async function markRead() {
    setBusy(true);
    try {
      await api.post('/player/notifications/read', {});
      await notis.reload();
      await refresh();
    } catch (e) {
      setError((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }


  async function save(patch: Record<string, string>, okText: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await api.patch<{ changed: string[] }>('/player/nation', patch);
      toast(res.changed?.length ? okText : 'تغییری لازم نبود.', 'ok');
      await refresh();
    } catch (e) {
      const msg = (e as ApiError).message ?? 'خطا';
      setError(msg);
      toast(msg, 'err');
    } finally {
      setBusy(false);
    }
  }

  const notis = useApi<{ rows: any[] }>('/player/notifications');
  // the source of truth is nations.settings.notifications_enabled; the UI only mirrors the last accepted value
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.settings}</h1>
      {error ? <ErrorBox message={error} /> : null}

      <Card title="هویت کشور" emoji="🆔">
        <div className="space-y-3">
          <div>
            <label className="ww-label">نام کشور (۳ تا ۴۰ نویسه، یکتا)</label>
            <div className="flex gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
              <Btn loading={busy} disabled={cooldowns.renameSecondsLeft > 0 || name.trim() === n?.name} onClick={() => save({ name: name.trim() }, 'نام کشور تغییر کرد.')}>
                ذخیره
              </Btn>
            </div>
            {cooldowns.renameSecondsLeft > 0 ? <p className="mt-1 text-[11px] text-warn">⏳ قفل تغییر نام: {faDuration(cooldowns.renameSecondsLeft)}</p> : null}
          </div>
          <div>
            <label className="ww-label">نام رهبر</label>
            <div className="flex gap-2">
              <Input value={leader} onChange={(e) => setLeader(e.target.value)} maxLength={40} />
              <Btn loading={busy} disabled={cooldowns.leaderSecondsLeft > 0 || leader.trim() === n?.leaderName} onClick={() => save({ leaderName: leader.trim() }, 'نام رهبر تغییر کرد.')}>
                ذخیره
              </Btn>
            </div>
            {cooldowns.leaderSecondsLeft > 0 ? <p className="mt-1 text-[11px] text-warn">⏳ قفل تغییر نام رهبر: {faDuration(cooldowns.leaderSecondsLeft)}</p> : null}
          </div>
          <div>
            <label className="ww-label">پرچم (از فهرست مجاز سرور)</label>
            <div className="flex flex-wrap gap-1">
              {flagChoices.map((f) => (
                <button
                  key={f}
                  className={`ww-btn ${f === flag ? 'ww-btn-primary' : ''}`}
                  onClick={() => setFlag(f)}
                  disabled={f === n?.flag}
                  title={f === n?.flag ? 'پرچم فعلی' : 'انتخاب'}
                >
                  {f}
                </button>
              ))}
            </div>
            {flagChoices.length === 0 ? <p className="mt-1 text-[11px] text-slate-500">فهرست پرچم‌ها در این نسخه از سرور در دسترس نیست؛ تغییر پرچم از ربات انجام می‌شود.</p> : null}
            <div className="mt-2 flex items-center gap-2">
              <Btn loading={busy} disabled={cooldowns.flagSecondsLeft > 0 || flag === n?.flag || flagChoices.length === 0} onClick={() => save({ flag }, 'پرچم تغییر کرد.')}>
                اعمال پرچم
              </Btn>
              {cooldowns.flagSecondsLeft > 0 ? <span className="text-[11px] text-warn">⏳ {faDuration(cooldowns.flagSecondsLeft)}</span> : null}
            </div>
          </div>
        </div>
      </Card>

      <Card title="اعلان‌ها" emoji="🔔" right={<Btn loading={busy} onClick={() => void markRead()}>علامت‌گذاری به‌عنوان خوانده</Btn>}>
        <div className="mb-2 flex items-center gap-2">
          <Btn
            loading={busy}
            onClick={async () => {
              setBusy(true);
              try {
                const next = !enabled;
                const res = await api.post<{ enabled: boolean }>('/player/settings/notifications', { enabled: next });
                setEnabled(res.enabled !== false);
                toast(next ? 'اعلان‌ها روشن شد.' : 'اعلان‌ها خاموش شد.', 'ok');
                await refresh();
              } catch (e) {
                setError((e as ApiError).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {enabled ? '🔔 اعلان‌ها روشن' : '🔕 اعلان‌ها خاموش'}
          </Btn>
          <span className="text-[11px] text-slate-500">اگر خاموش باشد، کران برای کشور شما پیام می‌فرستد اما نوتیفیکیشن تلگرام ارسال نمی‌شود.</span>
        </div>
        {notis.loading ? <Loading /> : null}
        <div className="space-y-1">
          {(notis.data?.rows ?? []).slice(0, 12).map((r: any) => (
            <div key={r.id} className={`rounded-xl border p-2 ${r.isRead ? 'border-white/10 bg-white/5' : 'border-gold/40 bg-gold/10'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 text-xs font-semibold">{r.title}</span>
                <span className="shrink-0 text-[10px] text-slate-500">{faDateTime(r.createdAt)}</span>
              </div>
              <p className="mt-1 text-[11px] leading-6 text-slate-400">{r.body}</p>
            </div>
          ))}
          {!notis.loading && (notis.data?.rows ?? []).length === 0 ? <Empty text="اعلان جدیدی نیست." /> : null}
        </div>
      </Card>

      <Card title="دسترسی و خروج" emoji="🔐">
        <div className="space-y-2 text-[11px] leading-6 text-slate-400">
          <p>
            نقش شما: {me?.role === 'super_admin' ? 'مدیر ارشد' : me?.role === 'admin' ? 'مدیر' : 'بازیکن'} · {me?.isPrimaryAdmin ? 'مدیر اصلی (تنها کسی که می‌تواند مدیر جدید معرفی کند)' : 'کاربر بازی'}
          </p>
          <p>ورود از طریق initData تلگرام انجام می‌شود؛ توکن در sessionStorage همین مرورگر نگه داشته می‌شود و در هیچ جایی ذخیره دائمی نمی‌شود.</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Btn onClick={() => void refresh()}>🔄 همگام‌سازی با سرور</Btn>
          <Btn
            variant="danger"
            onClick={async () => {
              if (!window.confirm('خروج از حساب؟ توکن این دستگاه پاک می‌شود.')) return;
              await logout();
            }}
          >
            خروج
          </Btn>
        </div>
      </Card>

      <p className="px-1 text-[11px] leading-6 text-slate-500">
        🧾 تغییر نام/پرچم از همین صفحه با PATCH /api/player/nation انجام می‌شود؛ قفل زمانی و یکتایی‌بودن نام در سرور بررسی می‌شود، پس اگر خطا دیدید یعنی سرور اجازه نداده است.
      </p>
    </div>
  );

}

/* ----------------------------------- log ---------------------------------- */

export function LogPage() {
  const [offset, setOffset] = useState(0);
  const [kind, setKind] = useState('all');
  const feed = useApi<{ items: any[]; nextOffset: number | null }>(`/social/news?limit=20&offset=${offset}${kind === 'all' ? '' : `&kind=${kind}`}`, [offset, kind]);
  const kinds = [
    { k: 'all', t: '🌐 همه' },
    { k: 'war', t: '⚔️ جنگ' },
    { k: 'peace', t: '🕊️ صلح' },
    { k: 'alliance', t: '🤝 اتحاد' },
    { k: 'statement', t: '📣 بیانیه' },
    { k: 'economy', t: '💰 اقتصاد' },
    { k: 'announcement', t: '📢 اطلاعیه' },
    { k: 'system', t: '⚙️ سیستم' },
  ];

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">{NAV_TITLES.news}</h1>
      <Card>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {kinds.map((i) => (
            <button key={i.k} className={`ww-tab ${kind === i.k ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => { setKind(i.k); setOffset(0); }}>
              {i.t}
            </button>
          ))}
        </div>
      </Card>

      {feed.loading ? <Loading /> : null}
      {feed.error ? <ErrorBox message={feed.error} onRetry={feed.reload} /> : null}

      <div className="space-y-2">
        {(feed.data?.items ?? []).map((it: any) => (
          <article key={it.id} className="ww-card p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="min-w-0 truncate text-sm font-bold">
                <span className="ml-1">{it.emoji}</span>
                {it.title}
              </h3>
              <span className="shrink-0 text-[10px] text-slate-500">{faDateTime(it.createdAt)}</span>
            </div>
            {it.flag || it.nationName ? (
              <p className="mt-1 text-[11px] text-slate-400">
                {it.flag} {it.nationName}
              </p>
            ) : null}
            <p className="mt-1 whitespace-pre-wrap text-[11px] leading-6 text-slate-300">{it.body}</p>
          </article>
        ))}
        {!feed.loading && (feed.data?.items ?? []).length === 0 ? <Empty text="خبری در این دسته نیست." /> : null}
      </div>

      <div className="flex items-center justify-between">
        <Btn disabled={offset <= 0} onClick={() => setOffset(Math.max(0, offset - 20))}>
          جدیدتر
        </Btn>
        <Btn disabled={feed.data?.nextOffset === null} onClick={() => setOffset(feed.data?.nextOffset ?? offset + 20)}>
          قدیمی‌تر
        </Btn>
      </div>
    </div>
  );
}
