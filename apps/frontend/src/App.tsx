import { Suspense, lazy, useEffect, type ComponentType, type LazyExoticComponent } from 'react';
import { ROUTES } from '@ww/shared';
import { AuthProvider, useAuth } from './auth';
import { tg } from './telegram';
import { RouterProvider, useRouter } from './router';
import { Loading, ToastProvider } from './ui';
import { Shell } from './components/Shell';
import { Login } from './pages/Login';

/**
 * Route → page table.
 *
 * Every page is lazily loaded: the initial bundle only carries the shell + the dashboard, while the admin
 * console and the chart-heavy economy page are fetched on demand. The Worker serves the SPA with a single
 * immutable asset bundle, so splitting only makes first paint faster on a weak connection — which is exactly
 * the situation most players here are in.
 */
type Page = LazyExoticComponent<ComponentType<{ params?: Record<string, string> }>>;

function lazyFrom(loader: () => Promise<Record<string, unknown>>, name: string): Page {
  return lazy(async () => ({ default: (await loader())[name] as ComponentType<any> }));
}

const player = (name: string) => lazyFrom(() => import('./pages/player'), name);
const admin = (name: string) => lazyFrom(() => import('./pages/admin'), name);

const PLAYER_ROUTES: { pattern: string; Comp: Page }[] = [
  { pattern: '/app/player', Comp: player('PlayerHome') },
  { pattern: '/app/player/nation', Comp: player('NationOverview') },
  {
    pattern: '/app/player/economy',
    Comp: lazy(async () => {
      // charts live only here, so recharts stays out of the first chunk
      const mod = await import('./pages/player/Economy');
      return { default: mod.EconomyPage as ComponentType<any> };
    }),
  },
  { pattern: '/app/shop', Comp: player('ShopPage') },
  { pattern: '/app/shop/:categoryKey', Comp: player('ShopPage') },
  { pattern: '/app/military', Comp: player('MilitaryPage') },
  { pattern: '/app/defense', Comp: player('DefensePage') },
  { pattern: '/app/rewards', Comp: player('RewardsPage') },
  { pattern: '/app/wars', Comp: player('WarRoomPage') },
  { pattern: '/app/war/:id', Comp: player('WarRoomPage') },
  { pattern: '/app/ranking', Comp: player('RankingPage') },
  { pattern: '/app/build', Comp: player('BuildingsPage') },
  { pattern: '/app/industries', Comp: player('IndustriesPage') },
  { pattern: '/app/arsenal', Comp: player('ArsenalPage') },
  { pattern: '/app/army', Comp: player('ArmyPage') },
  { pattern: '/app/security', Comp: player('SecurityPage') },
  { pattern: '/app/population', Comp: player('PopulationPage') },
  { pattern: '/app/bank', Comp: player('BankPage') },
  { pattern: '/app/manage', Comp: player('ManagePage') },
  { pattern: '/app/soon', Comp: player('SoonPage') },
  { pattern: '/app/resources', Comp: player('ResourcesPage') },
  { pattern: '/app/resources/extract', Comp: player('ExtractListPage') },
  { pattern: '/app/resources/extract/:key', Comp: lazyFrom(() => import('./pages/player/Params'), 'ExtractDetailRoute') },
  { pattern: '/app/resources/refine', Comp: player('RefineryPage') },
  { pattern: '/app/resources/warehouse', Comp: player('WarehousePage') },
  { pattern: '/app/resources/sell', Comp: player('SellPage') },
  { pattern: '/app/resources/sell/:key', Comp: lazyFrom(() => import('./pages/player/Params'), 'SellDetailRoute') },
  { pattern: '/app/market', Comp: player('MarketPage') },
  { pattern: '/app/trade/export', Comp: player('ExportHubPage') },
  { pattern: '/app/trade/export/:key', Comp: lazyFrom(() => import('./pages/player/Params'), 'ExportDetailRoute') },
  { pattern: '/app/trade/import', Comp: player('ImportHubPage') },
  { pattern: '/app/trade/import/:key', Comp: lazyFrom(() => import('./pages/player/Params'), 'ImportDetailRoute') },
  { pattern: '/app/contracts', Comp: player('ContractsPage') },
  { pattern: '/app/economy-hub', Comp: player('EconomyHubPage') },
  { pattern: '/app/economy/income', Comp: player('IncomePage') },
  { pattern: '/app/economy/treasury', Comp: player('TreasuryPage') },
  { pattern: '/app/economy/debt', Comp: player('DebtPage') },
  { pattern: '/app/economy/pay-debt', Comp: player('PayDebtPage') },
  { pattern: '/app/economy/loans', Comp: player('LoansPage') },
  { pattern: '/app/economy/budget', Comp: player('BudgetPage') },
  { pattern: '/app/economy/foreign-trade', Comp: player('ForeignTradePage') },
  { pattern: '/app/friends', Comp: player('FriendsPage') },
  { pattern: '/app/statements', Comp: player('StatementsPage') },
  { pattern: '/app/profile', Comp: player('ProfilePage') },
];

const ADMIN_ROUTES: { pattern: string; Comp: Page }[] = [
  { pattern: '/app/admin', Comp: admin('AdminOverview') },
  { pattern: '/app/admin/nations', Comp: admin('AdminNations') },
  { pattern: '/app/admin/users', Comp: admin('AdminUsers') },
  { pattern: '/app/admin/determine-country', Comp: admin('AdminDetermineCountry') },
  { pattern: '/app/admin/equipment', Comp: admin('AdminEquipment') },
  { pattern: '/app/admin/starter', Comp: admin('AdminStarter') },
  { pattern: '/app/admin/economy', Comp: admin('AdminEconomy') },
  { pattern: '/app/admin/war', Comp: admin('AdminWarConfig') },
  { pattern: '/app/admin/diplomacy', Comp: admin('AdminDiplomacy') },
  { pattern: '/app/admin/ranking', Comp: admin('AdminRankingConfig') },
  { pattern: '/app/admin/branding', Comp: admin('AdminBranding') },
  { pattern: '/app/admin/broadcast', Comp: admin('AdminBroadcast') },
  { pattern: '/app/admin/jobs', Comp: admin('AdminJobs') },
  { pattern: '/app/admin/audit', Comp: admin('AdminAudit') },
  { pattern: '/app/admin/settings', Comp: admin('AdminSettings') },
];

function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const a = path.split('/').filter(Boolean);
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
  }
  return params;
}

function Routes() {
  const { path, navigate } = useRouter();
  const { status, isAdmin, me } = useAuth();

  // deep links from the bot (#/app/player) and from the admin menu (#/app/admin) both work; '/' picks a home
  useEffect(() => {
    if (status !== 'ready' || !me) return;
    if (path === '/' || path === '/app') {
      navigate(isAdmin ? ROUTES.adminRoot : ROUTES.playerRoot, { replace: true });
      return;
    }
    // ?startapp=admin (the BotFather menu button / a deep link) must land an admin in the console,
    // not on the player home they were already looking at
    if (isAdmin && path === ROUTES.playerRoot && tg.startParam === 'admin') {
      navigate(ROUTES.adminRoot, { replace: true });
    }
  }, [status, me, path, isAdmin, navigate]);

  if (status === 'loading') return <Loading label="در حال برقراری ارتباط با سرور…" />;
  if (status !== 'ready') return <Login />;

  const adminArea = path.startsWith('/app/admin');
  if (adminArea && !isAdmin) return <Notice emoji="🔒" text="این بخش فقط برای مدیران فعال است. اگر مدیر هستید، از ربات با /start admin وارد شوید." />;

  const routes = adminArea ? ADMIN_ROUTES : PLAYER_ROUTES;
  for (const route of routes) {
    const params = matchRoute(route.pattern, path);
    if (params) return <route.Comp params={params} />;
  }
  return (
    <Notice
      emoji="🧭"
      text="صفحه پیدا نشد."
      action={
        <button className="ww-btn ww-btn-primary mt-4" onClick={() => navigate(adminArea ? '/app/admin' : '/app/player', { replace: true })}>
          بازگشت به خانه
        </button>
      }
    />
  );
}

function Notice({ emoji, text, action }: { emoji: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="mx-auto mt-10 max-w-md px-4 text-center">
      <div className="text-4xl">{emoji}</div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
      {action}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider>
          <Shell>
            <Suspense fallback={<Loading />}>
              <Routes />
            </Suspense>
          </Shell>
        </RouterProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
