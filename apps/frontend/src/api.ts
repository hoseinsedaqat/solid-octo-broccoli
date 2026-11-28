/**
 * Typed-ish fetch wrapper for the World War API.
 *
 * Rules that come straight from the security design:
 *  - the token is sent as a bearer header; it is the ONLY thing that identifies the player;
 *  - no secret, no bot token and no price math ever lives here;
 *  - every error from the backend carries { error: { code, message } } in Persian -> we surface it as-is.
 */

export interface ApiErrorShape {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const TOKEN_KEY = 'ww.token';

/**
 * A Telegram Mini App (and the iframe-based previews some people test through) can run with
 * storage access blocked — sessionStorage then THROWS on every read/write. Without an
 * in-memory copy, a successful dev-login POST would lose its token immediately and the app
 * would sit on the login screen looking "dead". The memory variable is authoritative;
 * sessionStorage only mirrors it so a manual reload can keep the session.
 */
let memoryToken: string | null = null;

function safeStorage(): Storage | null {
  try {
    const store = globalThis.sessionStorage;
    const probe = '__ww_probe';
    store.setItem(probe, '1');
    store.removeItem(probe);
    return store;
  } catch {
    return null; // blocked / private mode / storageless iframe
  }
}

export function getToken(): string | null {
  if (memoryToken) return memoryToken;
  try {
    return safeStorage()?.getItem(TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  memoryToken = token;
  try {
    const store = safeStorage();
    if (!store) return;
    if (token) store.setItem(TOKEN_KEY, token);
    else store.removeItem(TOKEN_KEY);
  } catch {
    /* the mirror is best-effort only */
  }
}

type Query = Record<string, string | number | boolean | null | undefined>;

function withQuery(path: string, query?: Query): string {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function request<T = any>(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', path: string, opts: { body?: unknown; query?: Query } = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['content-type'] = 'application/json';
  if (token) headers.authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(withQuery(`/api${path}`, opts.query), {
      method,
      headers,
      ...(opts.body === undefined ? {} : { body: typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body) }),
    });
  } catch {
    throw new ApiError(0, 'network_error', 'اتصال اینترنتی برقرار نیست. دوباره تلاش کنید.');
  }

  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) {
    const err = data?.error ?? {};
    throw new ApiError(res.status, String(err.code ?? 'error'), String(err.message ?? `خطا (${res.status})`), err.details);
  }
  return data as T;
}

/** headers for raw fetch() calls that must bypass the JSON wrapper (file download) */
export function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getToken();
  return { ...extra, ...(token ? { authorization: `Bearer ${token}` } : {}) };
}

export const api = {
  get: <T = any>(path: string, query?: Query) => request<T>('GET', path, { query }),
  post: <T = any>(path: string, body?: unknown, query?: Query) => request<T>('POST', path, { body, query }),
  patch: <T = any>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
  put: <T = any>(path: string, body?: unknown) => request<T>('PUT', path, { body }),
  del: <T = any>(path: string, body?: unknown) => request<T>('DELETE', path, { body }),
};

/** random key for idempotent shop purchases (the backend replays it instead of double-charging) */
export function idempotencyKey(prefix = 'web'): string {
  const rnd = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `${prefix}-${Date.now().toString(36)}-${rnd.slice(0, 12)}`;
}
