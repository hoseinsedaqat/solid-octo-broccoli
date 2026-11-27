import { useState } from 'react';
import { useApi, useAuth } from '../auth';
import { Btn, Field, Input, fa } from '../ui';
import { tg } from '../telegram';

/**
 * Login screen.
 *
 * Inside Telegram the token is obtained automatically from initData (that's the whole point of a Mini App:
 * no password, no session cookie). This screen only appears when initData is missing/invalid/expired, and in
 * development it exposes the `dev-login` endpoint (which the Worker refuses to run outside development/test).
 */
export function Login() {
  const { loginWithInitData, loginDev, error } = useAuth();
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);
  // pre-filled with the id from the sample .dev.vars — one tap in and you are primary admin
  const [devId, setDevId] = useState('111111111');
  const inTelegram = tg.isTelegram;
  // dev-login is a development shortcut; showing it in production only produces a confusing 403
  const { data: cfg } = useApi<{ devLoginEnabled?: boolean; gameName?: string }>('/config');
  const devAllowed = cfg?.devLoginEnabled === true;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-10">
      <div className="text-center">
        <div className="text-5xl">🌍</div>
        <h1 className="mt-3 text-xl font-extrabold text-gold-soft">World War</h1>
        <p className="mt-2 text-xs leading-6 text-slate-400">
          بازی استراتژیک تحت وب تلگرام — اقتصاد، ارتش، دیپلماسی و جنگ در یک مینی‌اپ.
        </p>
      </div>

      <div className="ww-card mt-6 p-4">
        {inTelegram ? (
          <>
            <p className="text-sm leading-6 text-slate-300">
              اتصال از طریق تلگرام برقرار نشد. اگر لینک را از بیرون باز کرده‌اید، مینی‌اپ را از داخل ربات باز کنید؛ در غیر این صورت دوباره تلاش کنید.
            </p>
            <Btn
              className="mt-4 w-full ww-btn-primary"
              loading={busy}
              onClick={async () => {
                setBusy(true);
                setLocalErr(null);
                try {
                  await loginWithInitData(tg.initData);
                } catch (e) {
                  setLocalErr((e as Error)?.message ?? 'ورود با تلگرام انجام نشد');
                } finally {
                  setBusy(false);
                }
              }}
            >
              تلاش دوباره برای ورود
            </Btn>
          </>
        ) : devAllowed ? (
          <>
            <p className="mb-3 text-sm leading-6 text-slate-300">
              حالت توسعه: ورود با initData انجام نشد، می‌توانید با آی‌دی عددی وارد شوید.
            </p>
            <Field label="آی‌دی عددی تلگرام (dev-login)">
              <Input value={devId} onChange={(e) => setDevId(e.target.value)} inputMode="numeric" placeholder="مثلاً ۱۲۳۴۵۶۷۸۹" />
            </Field>
            <Btn
              className="mt-3 w-full ww-btn-primary"
              loading={busy}
              onClick={async () => {
                const id = Number(devId.replace(/[^\d]/g, ''));
                if (!id) {
                  setLocalErr('اول آی‌دی عددی تلگرام را وارد کنید (مثلاً همین 111111111).');
                  return;
                }
                setBusy(true);
                setLocalErr(null);
                try {
                  await loginDev(id);
                } catch (e) {
                  setLocalErr((e as Error)?.message ?? 'ورود ناموفق بود — سرور dev-login را در حالت development باز بگذارد.');
                } finally {
                  setBusy(false);
                }
              }}
            >
              ورود توسعه‌دهنده
            </Btn>
          </>
        ) : (
          <>
            <p className="text-sm leading-6 text-slate-300">
              ورود به بازی فقط از داخل ربات تلگرام انجام می‌شود: ربات را باز کنید، <b>/start</b> بزنید و دکمهٔ سبز
              «ورود به بازی» را بزنید. اگر مینی‌اپ را از تلگرام باز کرده‌اید و این پیام را می‌بینید، یک بار آن را ببندید
              و دوباره باز کنید (تلگرام گاهی لینک قدیمی را نگه می‌دارد).
            </p>
            <Btn
              className="mt-4 w-full ww-btn-primary"
              loading={busy}
              onClick={async () => {
                setBusy(true);
                setLocalErr(null);
                const initData = await tg.initDataWhenReady(2500);
                if (!initData) {
                  setLocalErr('دادهٔ ورود تلگرام به این صفحه نرسید. مینی‌اپ را از داخل ربات باز کنید.');
                  setBusy(false);
                  return;
                }
                try {
                  await loginWithInitData(initData);
                } catch (e) {
                  setLocalErr((e as Error)?.message ?? 'ورود با تلگرام انجام نشد');
                } finally {
                  setBusy(false);
                }
              }}
            >
              تلاش دوباره برای اتصال به تلگرام
            </Btn>
          </>
        )}

        {localErr || error ? <p className="mt-3 rounded-xl border border-danger/40 bg-danger/10 p-2 text-xs text-danger">{localErr ?? error}</p> : null}
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-500">
        زمان سرور: {fa(Math.floor(Date.now() / 1000))} — اگر initData منقضی شده باشد، مینی‌اپ را ببندید و دوباره از ربات باز کنید.
      </p>

      {/* diagnostics: which channel delivered (or failed to deliver) the launch data */}
      <p className="mt-2 text-center text-[10px] text-slate-600" dir="ltr">
        bridge: {tg.launchSource} · platform: {tg.platform || '—'} · initData: {tg.initData ? 'ok' : 'empty'}
      </p>
    </div>
  );
}
