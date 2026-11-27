import { useState } from 'react';
import { useAuth } from '../auth';
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
  // pre-filled with the id from the sample .dev.vars — one tap in and you are primary admin
  const [devId, setDevId] = useState('111111111');
  const inTelegram = tg.isTelegram;

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
                try {
                  await loginWithInitData(tg.initData);
                } catch {
                  /* error text is shown below */
                } finally {
                  setBusy(false);
                }
              }}
            >
              تلاش دوباره برای ورود
            </Btn>
          </>
        ) : (
          <>
            <p className="mb-3 text-sm leading-6 text-slate-300">
              این صفحه فقط برای توسعه محلی است: در تلگرام، ورود با initData به‌صورت خودکار انجام می‌شود.
            </p>
            <Field label="آی‌دی عددی تلگرام (dev-login)">
              <Input value={devId} onChange={(e) => setDevId(e.target.value)} inputMode="numeric" placeholder="مثلاً ۱۲۳۴۵۶۷۸۹" />
            </Field>
            <Btn
              className="mt-3 w-full ww-btn-primary"
              loading={busy}
              onClick={async () => {
                const id = Number(devId.replace(/[^\d]/g, ''));
                if (!id) return;
                setBusy(true);
                try {
                  await loginDev(id);
                } catch {
                  /* shown below */
                } finally {
                  setBusy(false);
                }
              }}
            >
              ورود توسعه‌دهنده
            </Btn>
          </>
        )}

        {error ? <p className="mt-3 rounded-xl border border-danger/40 bg-danger/10 p-2 text-xs text-danger">{error}</p> : null}
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-500">
        زمان سرور: {fa(Math.floor(Date.now() / 1000))} — اگر initData منقضی شده باشد، مینی‌اپ را ببندید و دوباره از ربات باز کنید.
      </p>
    </div>
  );
}
