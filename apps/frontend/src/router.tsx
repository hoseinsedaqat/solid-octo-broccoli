import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Hash router.
 *
 * Why hash-based: the Worker serves the SPA bundle for every path (SPA routing), but the app also has to
 * work when opened from a file://-like or cached context and inside the Telegram WebView where a deep link
 * such as /app/admin/rate-limits must survive a reload without the browser URL being rewritten by us.
 * Hash routes are also trivially linkable from the bot's inline menu (web_app buttons).
 */

interface RouterValue {
  path: string;
  query: Record<string, string>;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
  back: () => void;
  canGoBack: boolean;
}

const RouterContext = createContext<RouterValue | null>(null);

function readHash(): string {
  const raw = window.location.hash.replace(/^#/, '');
  return raw.startsWith('/') ? raw : '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [href, setHref] = useState<string>(() => readHash());

  useEffect(() => {
    const onChange = () => setHref(readHash());
    window.addEventListener('hashchange', onChange);
    // a fresh launch with /app/player in the pathname keeps working
    if (!window.location.hash && window.location.pathname.startsWith('/app')) {
      window.location.replace(`${window.location.pathname}#${window.location.pathname}`);
    }
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const next = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`;
    if (opts?.replace) window.location.replace(next);
    else window.location.hash = next.slice(1);
    setHref(readHash());
  }, []);

  const value = useMemo<RouterValue>(() => {
    const [path, qs = ''] = href.split('?');
    return {
      path,
      query: Object.fromEntries(new URLSearchParams(qs)),
      navigate,
      back: () => window.history.back(),
      canGoBack: window.history.length > 1,
    };
  }, [href, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}

/** matches '/app/shop/:categoryKey' style patterns; returns params or null */
export function matchRoute(pattern: string, path: string): Record<string, string> | null {
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

export function useRouteParams(pattern: string): Record<string, string> | null {
  const { path } = useRouter();
  return useMemo(() => matchRoute(pattern, path), [pattern, path]);
}

/** counts down from `seconds`, restarting when the target changes */
export function useCountdown(seconds: number | null | undefined): number {
  const [left, setLeft] = useState(Math.max(0, Math.floor(seconds ?? 0)));
  useEffect(() => {
    setLeft(Math.max(0, Math.floor(seconds ?? 0)));
    if (!seconds) return;
    const id = setInterval(() => setLeft((v) => (v <= 1 ? 0 : v - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  return left;
}
