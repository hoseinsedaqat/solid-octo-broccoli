import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, getToken, setToken, type ApiErrorShape } from './api';
import { tg } from './telegram';

export interface SessionMe {
  userId: number;
  telegramId: number;
  username: string | null;
  role: 'player' | 'admin' | 'super_admin';
  status: string;
  isAdmin: boolean;
  isPrimaryAdmin: boolean;
  permissions: Record<string, { read: boolean; write: boolean }>;
  nationIds: number[];
  activeNationId: number | null;
  features: Record<string, boolean>;
  branding: { gameName: string; welcomeTitle: string };
  view: any;
}

interface AuthState {
  me: SessionMe | null;
  status: 'loading' | 'anonymous' | 'ready';
  error: string | null;
  refresh: () => Promise<void>;
  loginWithInitData: (initData: string) => Promise<void>;
  loginDev: (telegramId: number) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  can: (section: string, write?: boolean) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<SessionMe | null>(null);
  const [status, setStatus] = useState<AuthState['status']>('loading');
  const [error, setError] = useState<string | null>(null);

  const loadMe = useCallback(async () => {
    if (!getToken()) {
      setStatus('anonymous');
      return;
    }
    try {
      const data = await api.get<SessionMe>('/auth/me');
      setMe(data);
      setStatus('ready');
      setError(null);
    } catch (err) {
      const e = err as ApiErrorShape & Error;
      if (e.status === 401 || e.status === 403) {
        setToken(null);
        setMe(null);
        setStatus('anonymous');
        return;
      }
      setError(e.message ?? 'خطای نامشخص');
      setStatus('anonymous');
    }
  }, []);

  const exchange = useCallback(
    async (initData: string) => {
      setError(null);
      try {
        const res = await api.post<{ token: string }>('/auth/session', { initData });
        setToken(res.token);
        await loadMe();
      } catch (err) {
        const e = err as ApiErrorShape & Error;
        setError(e.message ?? 'ورود ناموفق بود');
        setStatus('anonymous');
        throw e;
      }
    },
    [loadMe],
  );

  useEffect(() => {
    tg.boot();
    void (async () => {
      if (getToken()) {
        await loadMe();
        return;
      }
      if (tg.initData) {
        try {
          await exchange(tg.initData);
        } catch {
          /* the login screen explains the error */
        }
        return;
      }
      setStatus('anonymous');
    })();
  }, [exchange, loadMe]);

  const value = useMemo<AuthState>(
    () => ({
      me,
      status,
      error,
      refresh: loadMe,
      loginWithInitData: exchange,
      async loginDev(telegramId: number) {
        const res = await api.post<{ token: string }>('/auth/dev-login', { telegramId });
        setToken(res.token);
        await loadMe();
      },
      async logout() {
        try {
          await api.post('/auth/logout');
        } finally {
          setToken(null);
          setMe(null);
          setStatus('anonymous');
        }
      },
      get isAdmin() {
        return me?.role === 'admin' || me?.role === 'super_admin';
      },
      can(section: string, write = false) {
        if (!me) return false;
        if (me.role === 'super_admin') return true;
        if (me.role !== 'admin') return false;
        const grant = me.permissions?.[section];
        if (!grant) return false;
        return write ? grant.write === true : grant.read === true;
      },
    }),
    [me, status, error, exchange, loadMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/** small data hook: loads a GET endpoint, exposes { data, loading, error, reload } */
export function useApi<T = any>(path: string | null, deps: unknown[] = []): { data: T | null; loading: boolean; error: string | null; reload: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setData(await api.get<T>(path));
      setError(null);
    } catch (err) {
      setError((err as ApiErrorShape & Error).message ?? 'خطا');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
