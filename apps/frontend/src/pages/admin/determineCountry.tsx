import { useState } from 'react';
import { api, type ApiError } from '../../api';
import { useAuth } from '../../auth';
import { Badge, Btn, Card, Grid, Stat, fa, useToast } from '../../ui';
import { AdminBlock } from './shared';

interface AssignResult {
  nationId: number;
  nationName: string;
  created: boolean;
  user: { id: number; telegramId: number; firstName: string | null; username: string | null };
}

/** «🚩 تعیین کشور بازیکن» (فقط مدیران): آیدی عددی تلگرام + نام کشور — کشور در پروفایل بازیکن ثبت می‌شود */
export function AdminDetermineCountry() {
  const { me } = useAuth();
  const toast = useToast();
  const canWrite = me?.role === 'super_admin' || Boolean(me?.permissions?.users?.write);

  const [telegramId, setTelegramId] = useState('');
  const [countryName, setCountryName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssignResult | null>(null);

  async function submit() {
    setError(null);
    setResult(null);
    const id = Number(telegramId.replace(/[^\d]/g, ''));
    const name = countryName.trim();
    if (!Number.isFinite(id) || id <= 0) {
      setError('آیدی عددی تلگرام نامعتبر است.');
      return;
    }
    if (name.length < 3) {
      setError('نام کشور باید دست‌کم ۳ نویسه باشد.');
      return;
    }
    if (name.length > 30) {
      setError('نام کشور حداکثر ۳۰ نویسه می‌تواند باشد.');
      return;
    }
    setBusy(true);
    try {
      const res = await api.post<AssignResult>('/admin/determine-country', { telegramId: id, countryName: name });
      setResult(res);
      toast(res.created ? '🚩 کشور تازه برای بازیکن ساخته شد.' : '✏️ نام کشور بازیکن به‌روز شد.', 'ok');
    } catch (e) {
      setError((e as ApiError).message);
      toast((e as ApiError).message, 'err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-base font-extrabold">🚩 تعیین کشور بازیکن</h1>
      <p className="text-[11px] leading-6 text-slate-400">
        نام کشورِ هر بازیکن فقط از همین‌جا تعیین می‌شود. اگر بازیکن قبلاً کشور داشته باشد، نامش به‌روزرسانی می‌شود؛
        در غیر این صورت یک کشور تازه با بستهٔ اولیه برای او ساخته می‌شود. بازیکن دیگر نام کشورش را دستی تایپ نمی‌کند.
      </p>

      <AdminBlock section="users" title="تعیین کشور" emoji="🚩">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canWrite || busy) return;
            void submit();
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="mb-1 block text-[11px] text-slate-400">آیدی عددی تلگرام بازیکن</span>
            <input
              className="ww-input tabular-nums"
              inputMode="numeric"
              placeholder="مثلاً 812345678"
              value={telegramId}
              onChange={(e) => { setTelegramId(e.target.value); setResult(null); }}
              disabled={!canWrite || busy}
              autoFocus
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] text-slate-400">نام کشور</span>
            <input
              className="ww-input"
              placeholder="مثلاً جم‌هورستان"
              value={countryName}
              maxLength={30}
              onChange={(e) => { setCountryName(e.target.value); setResult(null); }}
              disabled={!canWrite || busy}
            />
            <span className="mt-1 block text-[9px] text-slate-500">۳ تا ۳۰ نویسه · نام‌های تکراری پذیرفته نمی‌شود</span>
          </label>

          {error ? <div className="rounded-xl border border-danger/40 bg-danger/10 p-2 text-[11px] text-danger">{error}</div> : null}

          <Btn type="submit" variant="primary" loading={busy} disabled={!canWrite} className="w-full">
            {busy ? 'در حال ثبت…' : '🚩 ثبت کشور برای بازیکن'}
          </Btn>
        </form>
      </AdminBlock>

      {result ? (
        <Card title={result.created ? 'کشور جدید ساخته شد' : 'کشور بازیکن به‌روز شد'} emoji={result.created ? '🆕' : '✏️'}>
          <Grid cols={2}>
            <Stat label="کشور" value={<span className="text-gold-soft">{result.nationName}</span>} />
            <Stat label="شناسه کشور" value={`#${fa(result.nationId)}`} />
            <Stat label="بازیکن" value={result.user.firstName ?? '—'} />
            <Stat label="آیدی تلگرام" value={`#${fa(result.user.telegramId)}`} />
            <Stat label="یوزرنیم" value={result.user.username ? `@${result.user.username}` : '—'} />
            <Stat label="وضعیت" value={result.created ? 'ایجاد شد' : 'به‌روزرسانی شد'} tone="ok" />
          </Grid>
          {result.created ? (
            <p className="mt-2 text-[10px] leading-5 text-slate-500">بستهٔ اولیه (خزانه، تجهیزات و درآمد پایه) به کشور تازه اعطا شد و بازیکن بلافاصله می‌تواند بازی کند.</p>
          ) : (
            <p className="mt-2 text-[10px] leading-5 text-slate-500">نام کشوری که بازیکن می‌بیند و در رتبه‌بندی نمایش داده می‌شود به‌روز شد؛ سایر اطلاعات کشور دست‌نخورده ماند.</p>
          )}
        </Card>
      ) : null}
    </div>
  );
}
