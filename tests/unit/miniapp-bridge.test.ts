import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Script, createContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

/**
 * The Mini App bridge is the single point where a Telegram client hands the app its `initData`.
 * Real clients put it in the WebView *query string* (`tgWebAppInitData`) and only fall back to the
 * postMessage bridge on older versions — if that parsing is wrong, every player lands on the login
 * screen while the Worker itself looks perfectly healthy. These tests run the shipped file
 * (apps/frontend/public/telegram-web-app.js) against fake clients, so the contract stays honest.
 */

const BRIDGE_PATH = resolve(process.cwd(), 'apps/frontend/public/telegram-web-app.js');

class FakeEvent {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
}

interface FakeWindow {
  location: { search: string; hash: string; href: string };
  Telegram?: any;
  external?: { invoke: (raw: string) => void };
  parent: any;
  addEventListener: (type: string, fn: () => void) => void;
  removeEventListener: (type: string, fn: () => void) => void;
  dispatchEvent: (ev: { type: string }) => boolean;
  open: (url: string) => void;
  events: Record<string, number>;
  invoked: any[];
}

function boot(opts: { search?: string; hash?: string; existingWebApp?: any } = {}): { win: FakeWindow; run: (fn: () => void) => Promise<void> } {
  const src = readFileSync(BRIDGE_PATH, 'utf8');
  const listeners: Record<string, (() => void)[]> = {};
  const win: FakeWindow = {
    location: { search: opts.search ?? '', hash: opts.hash ?? '', href: `https://world-war.example.com/app/player${opts.search ?? ''}` },
    parent: null,
    events: {},
    invoked: [],
    addEventListener: (type, fn) => ((listeners[type] = listeners[type] || []).push(fn), undefined),
    removeEventListener: (type, fn) => {
      listeners[type] = (listeners[type] || []).filter((f) => f !== fn);
    },
    dispatchEvent: (ev) => {
      win.events[ev.type] = (win.events[ev.type] ?? 0) + 1;
      (listeners[ev.type] ?? []).forEach((f) => f());
      return true;
    },
    open: () => undefined,
  };
  win.parent = win; // top-level window, so the iframe channel stays silent
  win.external = { invoke: (raw) => void win.invoked.push(JSON.parse(raw)) };

  const context = createContext({ window: win, Telegram: undefined, Event: FakeEvent, URLSearchParams, JSON, String, Number, Boolean, Object, Array, Promise, setTimeout, clearTimeout, console, decodeURIComponent, encodeURIComponent });
  if (opts.existingWebApp) win.Telegram = { WebApp: opts.existingWebApp };
  new Script(src, { filename: 'telegram-web-app.js' }).runInContext(context as never);
  return {
    win,
    run: async (fn) => {
      fn();
      await Promise.resolve();
    },
  };
}

/** a initData payload shaped like Telegram's, signed by nobody — the bridge must not verify, only parse */
function initDataRaw(userId: number, username: string): string {
  const user = encodeURIComponent(JSON.stringify({ id: userId, username, first_name: 'Test', language_code: 'fa' }));
  return `auth_date=1730000000&hash=deadbeef&query_id=aa&user=${user}`;
}

describe('telegram-web-app.js bridge (shipped in public/, used because telegram.org may be blocked)', () => {
  it('reads initData from the tgWebApp* launch params the clients actually use', () => {
    const raw = initDataRaw(4242, 'player_one');
    const { win } = boot({ search: `?tgWebAppInitData=${encodeURIComponent(raw)}&tgWebAppPlatform=android&tgWebAppVersion=8.0&tgWebAppStartParam=admin` });
    const app = win.Telegram.WebApp;
    expect(app.initData).toBe(raw);
    expect(app.platform).toBe('android');
    expect(app.version).toBe('8.0');
    expect(app.startParam).toBe('admin');
    expect(app.initDataUnsafe.user.id).toBe(4242);
    expect(app.initDataUnsafe.user.username).toBe('player_one');
    // data was present, so no bridge round-trip is needed
    expect(win.invoked.some((c) => c?.data?.method === 'web_view_data_request' || c?.method === 'web_view_data_request')).toBe(false);
  });

  it('asks the client for the data and takes it when the bridge answers', async () => {
    const raw = initDataRaw(77, 'late_joiner');
    const { win, run } = boot({ search: '?tgWebAppPlatform=ios' });
    const app = win.Telegram.WebApp;
    expect(app.initData).toBe('');
    expect(win.invoked.some((c) => c?.data?.method === 'web_view_data_request' || c?.method === 'web_view_data_request')).toBe(true);

    let sawInitEvent = 0;
    win.addEventListener('ww:telegram-init', () => void sawInitEvent++);

    await run(() => win.Telegram.WebAppReceive(JSON.stringify({ event: 'web_view_data', data: { initData: raw, themeParams: { bg_color: '#000000' } } })));
    expect(app.initData).toBe(raw);
    expect(app.initDataUnsafe.user.id).toBe(77);
    expect(app.themeParams).toEqual({ bg_color: '#000000' });
    expect(sawInitEvent).toBe(1); // the auth provider listens for exactly this
  });

  it('still understands the legacy #tq= form used by debug links', () => {
    const raw = initDataRaw(9, 'legacy');
    const { win } = boot({ hash: `#tq=${encodeURIComponent(JSON.stringify({ initDataRaw: raw, initParams: { platform: 'webk', version: '7.7', theme_params: { bg_color: '#111' } } }))}` });
    const app = win.Telegram.WebApp;
    expect(app.initData).toBe(raw);
    expect(app.platform).toBe('webk');
    expect(app.initDataUnsafe.user.username).toBe('legacy');
  });

  it('never overwrites a real SDK that already produced initData', () => {
    const real = { initData: 'REAL', initDataUnsafe: { user: { id: 1 } }, platform: 'tdata', ready: () => undefined };
    const { win } = boot({ search: `?tgWebAppInitData=${encodeURIComponent('FAKE')}`, existingWebApp: real });
    expect(win.Telegram.WebApp).toBe(real);
    expect(win.Telegram.WebApp.initData).toBe('REAL');
  });

  it('routes sendData and haptics through the bridge instead of swallowing them', () => {
    const { win } = boot({ search: `?tgWebAppInitData=${encodeURIComponent(initDataRaw(5, 'u'))}` });
    win.Telegram.WebApp.sendData(JSON.stringify({ action: 'ping' }));
    win.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    expect(win.invoked.some((c) => c?.data?.method === 'web_app_data')).toBe(true);
    expect(win.invoked.some((c) => c?.data?.method === 'web_app_trigger_haptic_feedback')).toBe(true);
  });
});
