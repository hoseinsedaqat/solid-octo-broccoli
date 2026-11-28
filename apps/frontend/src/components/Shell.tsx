import { useState, type ReactNode } from 'react';
import { useAuth } from '../auth';
import { useRouter } from '../router';
import { api } from '../api';
import { Badge, Loading, fa } from '../ui';

const PLAYER_NAV: { path: string; label: string; emoji: string }[] = [
  { path: '/app/player', label: 'خانه', emoji: '🏠' },
  { path: '/app/shop', label: 'فروشگاه', emoji: '🛒' },
  { path: '/app/military', label: 'نظامی', emoji: '🛡️' },
  { path: '/app/wars', label: 'جنگ', emoji: '⚔️' },
  { path: '/app/ranking', label: 'رتبه', emoji: '🏆' },
  { path: '/app/rewards', label: 'جوایز', emoji: '🎁' },
  { path: '/app/friends', label: 'دیپلماسی', emoji: '🕊️' },
  { path: '/app/statements', label: 'بیانیه', emoji: '📣' },
  { path: '/app/profile', label: 'پروفایل', emoji: '👤' },
];

const ADMIN_NAV: { path: string; label: string; emoji: string }[] = [
  { path: '/app/admin', label: 'داشبورد', emoji: '📊' },
  { path: '/app/admin/nations', label: 'کشورها', emoji: '🌍' },
  { path: '/app/admin/users', label: 'کاربران', emoji: '👥' },
  { path: '/app/admin/equipment', label: 'تجهیزات', emoji: '🔧' },
  { path: '/app/admin/starter', label: 'بسته اولیه', emoji: '📦' },
  { path: '/app/admin/economy', label: 'اقتصاد', emoji: '💰' },
  { path: '/app/admin/war', label: 'جنگ', emoji: '⚔️' },
  { path: '/app/admin/diplomacy', label: 'دیپلماسی', emoji: '🕊️' },
  { path: '/app/admin/ranking', label: 'رتبه‌بندی', emoji: '🏆' },
  { path: '/app/admin/branding', label: 'برندینگ', emoji: '🏷️' },
  { path: '/app/admin/broadcast', label: 'اطلاع‌رسانی', emoji: '📣' },
  { path: '/app/admin/jobs', label: 'کران', emoji: '⏱️' },
  { path: '/app/admin/audit', label: 'گزارش‌ها', emoji: '📜' },
  { path: '/app/admin/settings', label: 'تنظیمات', emoji: '⚙️' },
];

export function Shell({ children }: { children: ReactNode }) {
  const { me, status, isAdmin, refresh, logout } = useAuth();
  const { path, navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // only a genuine in-flight check may block the screen; an anonymous visitor must reach <Login/>
  if (status === 'loading') return <Loading label="در حال ورود…" />;
  if (!me) return <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-3 pt-6">{children}</div>;

  const nav = isAdmin && path.startsWith('/app/admin') ? ADMIN_NAV : PLAYER_NAV;
  const nations = me.nationIds ?? [];
  const view = me.view?.nation;
  const active = nations.length > 0;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/85 backdrop-blur">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-lg">🌍</span>
            <span className="truncate text-sm font-extrabold text-gold-soft">{me.branding?.gameName ?? 'World War'}</span>
            {isAdmin ? <Badge tone="warn">مدیر</Badge> : null}
          </div>
          <div className="flex items-center gap-1">
            {active ? (
              <button className="ww-btn ww-btn-ghost" onClick={() => navigate('/app/player/nation')}>
                <span>{view?.flag ?? '🏳️'}</span>
                <span className="max-w-24 truncate">{view?.name ?? 'کشور'}</span>
              </button>
            ) : null}
            <button className="ww-btn ww-btn-ghost" onClick={() => setMenuOpen((v) => !v)} aria-label="منو">
              ⋯
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 px-3 py-2 text-xs">
            <div className="mb-2 flex items-center justify-between text-slate-400">
              <span>کاربر: {me.username ? `@${me.username}` : `#${fa(me.telegramId)}`}</span>
              <span>نقش: {me.role === 'super_admin' ? 'مدیر ارشد' : me.role === 'admin' ? 'مدیر' : 'بازیکن'}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {nations.length > 1 ? (
                <button
                  className="ww-btn"
                  onClick={async () => {
                    const current = me.activeNationId ?? nations[0];
                    const next = nations[(nations.indexOf(current) + 1) % nations.length];
                    await api.post('/auth/switch-nation', { nationId: next });
                    await refresh();
                    setMenuOpen(false);
                  }}
                >
                  🔄 تغییر کشور
                </button>
              ) : null}
              <button className="ww-btn" onClick={() => navigate('/app/log')}>
                📜 رویدادها
              </button>
              <button className="ww-btn" onClick={() => navigate('/app/profile')}>
                ⚙️ کشور من
              </button>
              <button
                className="ww-btn ww-btn-danger"
                onClick={async () => {
                  await logout();
                }}
              >
                خروج
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <nav className="sticky top-[44px] z-20 overflow-x-auto border-b border-white/10 bg-ink-900/70 px-2 py-1.5 backdrop-blur">
        <div className="flex gap-1">
          {nav.map((item) => {
            const isActive = item.path === path || (item.path !== '/app/player' && item.path !== '/app/admin' && path.startsWith(item.path));
            return (
              <button key={item.path} className={`ww-tab ${isActive ? 'ww-tab ww-tab-active' : 'ww-tab hover:bg-white/5'}`} onClick={() => navigate(item.path)}>
                <span className="ml-1">{item.emoji}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 px-3 pb-8 pt-3">{active || isAdmin ? children : <NoNation />}</main>
    </div>
  );
}

function NoNation() {
  const { me } = useAuth();
  const link = (me as { botDeepLink?: string } & Record<string, any>).branding;
  void link;
  return (
    <div className="mx-auto mt-10 max-w-md px-4 text-center">
      <div className="text-5xl">🏳️</div>
      <h2 className="mt-3 text-base font-bold">هنوز کشوری نساخته‌اید</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        ساخت کشور از داخل ربات انجام می‌شود: در تلگرام /start را بفرستید، نام کشور، نام رهبر و پرچم را انتخاب کنید. بعد از آن اقتصاد، ارتش، دیپلماسی و بیانیه‌ها همین‌جا باز می‌شوند.
      </p>
    </div>
  );
}
