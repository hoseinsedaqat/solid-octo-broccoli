import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Script, createContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

/**
 * The Mini App bridge is the single point where a Telegram client hands the app its `initData`.
 * Getting this wrong does not show up as an error — every player simply lands on the login screen
 * while the Worker looks perfectly healthy. These tests run the SHIPPED file
 * (apps/frontend/public/telegram-web-app.js) against fake clients, so the exact shapes Telegram
 * uses stay pinned: the launch query is split across `?` and `#`, initData arrives as `tgWebAppData`
 * inside the fragment, and it is recovered from the navigation entry / cache after a reload.
 */

const BRIDGE_PATH = resolve(process.cwd(), 'apps/frontend/public/telegram-web-app.js');

class FakeEvent {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
}

interface BootOptions {
  search?: string;
  hash?: string;
  existingWebApp?: Record<string, unknown>;
  navigationName?: string;
  storage?: Record<string, string>;
}

function boot(opts: BootOptions = {}) {
  const src = readFileSync(BRIDGE_PATH, 'utf8');
  const listeners: Record<string, (() => void)[]> = {};
  const store = new Map<string, string>(Object.entries(opts.storage ?? {}));

  const win: any = {
    location: {
      search: opts.search ?? '',
      hash: opts.hash ?? '',
      // a real browser keeps the whole URL here, fragment included
      href: `https://world-war.example.com/app/player${opts.search ?? ''}${opts.hash ?? ''}`,
    },
    parent: null,
    invoked: [] as any[],
    addEventListener: (type: string, fn: () => void) => {
      (listeners[type] = listeners[type] || []).push(fn);
    },
    removeEventListener: (type: string, fn: () => void) => {
      listeners[type] = (listeners[type] || []).filter((f) => f !== fn);
    },
    dispatchEvent: (ev: { type: string }) => {
      (listeners[ev.type] ?? []).forEach((f) => f());
      return true;
    },
    open: () => undefined,
  };
  win.parent = win; // top-level window, so the iframe channel stays silent
  if (opts.existingWebApp) win.Telegram = { WebApp: opts.existingWebApp };
  // browsers expose these on window as well
  if (opts.navigationName) win.performance = { getEntriesByType: () => [{ name: opts.navigationName }] };
  win.external = { invoke: (raw: string) => void win.invoked.push(JSON.parse(raw)) };

  const context = createContext({
    window: win,
    Event: FakeEvent,
    URLSearchParams,
    JSON,
    String,
    Number,
    Boolean,
    Object,
    Array,
    Promise,
    setTimeout,
    clearTimeout,
    console,
    decodeURIComponent,
    encodeURIComponent,
    sessionStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  });
  new Script(src, { filename: 'telegram-web-app.js' }).runInContext(context as never);

  return {
    win,
    cachedQuery: () => store.get('ww.launchParamsQuery') ?? '',
    /** resolves after the microtask the bridge would use to answer */
    deliver: async (payload: unknown) => {
      win.Telegram.WebAppReceive(typeof payload === 'string' ? payload : JSON.stringify(payload));
      await Promise.resolve();
    },
  };
}

/** initData shaped like Telegram's; the bridge must parse it, never verify it (verification is the server's job) */
function initDataRaw(userId: number, username: string): string {
  const user = encodeURIComponent(JSON.stringify({ id: userId, username, first_name: 'Test', language_code: 'fa' }));
  return `auth_date=1730000000&hash=deadbeef&query_id=aa&user=${user}`;
}

describe('telegram-web-app.js bridge (self-hosted: telegram.org may be unreachable)', () => {
  it('reads the hash form Telegram mobile uses (#tgWebAppData=…&tgWebAppPlatform=…)', () => {
    const raw = initDataRaw(8899, 'mobile_player');
    const { win, cachedQuery } = boot({
      hash: `#tgWebAppData=${encodeURIComponent(raw)}&tgWebAppPlatform=android&tgWebAppVersion=8.2&tgWebAppStartParam=admin`,
    });
    const app = win.Telegram.WebApp;
    expect(app.initData).toBe(raw);
    expect(app.platform).toBe('android');
    expect(app.version).toBe('8.2');
    expect(app.startParam).toBe('admin');
    expect(app.initDataUnsafe.user.id).toBe(8899);
    expect(app.initDataUnsafe.user.username).toBe('mobile_player');
    expect(app.launchSource).toBe('url');
    // the query is cached, so the next load still works after the client drops the fragment
    expect(cachedQuery()).toContain('tgWebAppData=');
    // data was present, so no bridge round-trip is needed
    expect(win.invoked.some((c: any) => c?.method === 'web_view_data_request' || c?.data?.method === 'web_view_data_request')).toBe(false);
  });

  it('also accepts the plain query-string form (web clients)', () => {
    const raw = initDataRaw(4242, 'webz_player');
    const { win } = boot({ search: `?tgWebAppData=${encodeURIComponent(raw)}&tgWebAppPlatform=webz&tgWebAppVersion=7.7` });
    const app = win.Telegram.WebApp;
    expect(app.initData).toBe(raw);
    expect(app.platform).toBe('webz');
    expect(app.initDataUnsafe.user.id).toBe(4242);
    expect(app.launchSource).toBe('url');
  });

  it('recovers the launch data from the navigation entry when the hash was already stripped', () => {
    const raw = initDataRaw(3, 'after_reload');
    const href = `https://world-war.example.com/app/player#tgWebAppData=${encodeURIComponent(raw)}&tgWebAppPlatform=ios`;
    const { win } = boot({ navigationName: href });
    expect(win.Telegram.WebApp.initData).toBe(raw);
    expect(win.Telegram.WebApp.launchSource).toBe('navigation');
  });

  it('falls back to the cached query on reload, when even performance is gone', () => {
    const raw = initDataRaw(4, 'third_load');
    const { win } = boot({ storage: { 'ww.launchParamsQuery': `tgWebAppData=${encodeURIComponent(raw)}&tgWebAppPlatform=tgraph` } });
    expect(win.Telegram.WebApp.initData).toBe(raw);
    expect(win.Telegram.WebApp.launchSource).toBe('storage');
  });

  it('understands the legacy #tq= debug form', () => {
    const raw = initDataRaw(9, 'legacy');
    const tq = encodeURIComponent(JSON.stringify({ initDataRaw: raw, initParams: { platform: 'webk', version: '7.7', theme_params: { bg_color: '#111' } } }));
    const { win } = boot({ hash: `#tq=${tq}` });
    const app = win.Telegram.WebApp;
    expect(app.initData).toBe(raw);
    expect(app.platform).toBe('webk');
    expect(app.initDataUnsafe.user.username).toBe('legacy');
  });

  it('asks the client over the bridge when the URL carried nothing, and takes the answer', async () => {
    const raw = initDataRaw(77, 'late_joiner');
    const { win, deliver } = boot({ search: '?tgWebAppPlatform=ios' });
    const app = win.Telegram.WebApp;
    expect(app.initData).toBe('');
    expect(win.invoked.some((c: any) => c?.method === 'web_view_data_request' || c?.data?.method === 'web_view_data_request')).toBe(true);

    let initEvents = 0;
    win.addEventListener('ww:telegram-init', () => void initEvents++);

    await deliver({ event: 'web_view_data', data: { initData: raw, themeParams: { bg_color: '#000000' } } });
    expect(app.initData).toBe(raw);
    expect(app.initDataUnsafe.user.id).toBe(77);
    expect(app.themeParams).toEqual({ bg_color: '#000000' });
    expect(app.launchSource).toBe('bridge');
    expect(initEvents).toBe(1); // the auth provider listens for exactly this
  });

  it('never overwrites a real SDK that already produced initData', () => {
    const real = { initData: 'REAL', initDataUnsafe: { user: { id: 1 } }, platform: 'tdata', ready: () => undefined };
    const raw = initDataRaw(1, 'ignored');
    const { win } = boot({ hash: `#tgWebAppData=${encodeURIComponent(raw)}`, existingWebApp: real });
    expect(win.Telegram.WebApp).toBe(real);
    expect(win.Telegram.WebApp.initData).toBe('REAL');
  });

  it('routes sendData and haptics through the bridge instead of swallowing them', () => {
    const raw = initDataRaw(5, 'u');
    const { win } = boot({ hash: `#tgWebAppData=${encodeURIComponent(raw)}` });
    win.Telegram.WebApp.sendData(JSON.stringify({ action: 'ping' }));
    win.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    expect(win.invoked.some((c: any) => c?.method === 'web_app_data' || c?.data?.method === 'web_app_data')).toBe(true);
    expect(win.invoked.some((c: any) => c?.method === 'web_app_trigger_haptic_feedback' || c?.data?.method === 'web_app_trigger_haptic_feedback')).toBe(true);
  });
});
