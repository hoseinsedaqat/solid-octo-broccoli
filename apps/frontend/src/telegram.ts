/**
 * Thin, defensive accessor for the Telegram Mini App bridge (see public/telegram-web-app.js).
 * Everything is optional: the app must stay usable in a normal browser tab (local development),
 * so every call is guarded and returns a safe default.
 */

interface TgWebAppLike {
  initData?: string;
  initDataUnsafe?: { user?: { id?: number; username?: string; first_name?: string; language_code?: string }; start_param?: string | { text?: string } };
  platform?: string;
  colorScheme?: string;
  startParam?: string;
  isDataRecovered?: boolean;
  launchSource?: string;
  ready?: () => void;
  expand?: () => void;
  setShow?: (v: boolean) => void;
  show?: () => void;
  hide?: () => void;
  on?: (event: string, handler: () => void) => void;
  off?: (event: string, handler: () => void) => void;
  HapticFeedback?: { impactOccurred?: (style: string) => void; notificationOccurred?: (type: string) => void };
  BackButton?: { show?: () => void; hide?: () => void; onClick?: (fn: () => void) => void };
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
}

function webApp(): TgWebAppLike | undefined {
  return (globalThis as { Telegram?: { WebApp?: TgWebAppLike } }).Telegram?.WebApp;
}

/**
 * Telegram hands the app its launch parameters in the URL, split across BOTH separators: everything
 * after the first `?` or `#` is one flat query (`#tgWebAppData=…&tgWebAppPlatform=…`). Reading it
 * directly is what keeps the app usable even when the bridge never answers.
 */
function searchParam(name: string): string {
  try {
    const flat = String(globalThis.location?.href ?? '').replace(/^[^?#]*[?#]/, '').replace(/[?#]/g, '&');
    return new URLSearchParams(flat).get(name) ?? '';
  } catch {
    return '';
  }
}

export const tg = {
  get raw(): TgWebAppLike | undefined {
    return webApp();
  },
  get initData(): string {
    return webApp()?.initData ?? '';
  },
  get user() {
    return webApp()?.initDataUnsafe?.user ?? undefined;
  },
  get platform(): string {
    return webApp()?.platform ?? searchParam('tgWebAppPlatform') ?? '';
  },
  /** where the launch data came from — shown on the login screen so a failure is diagnosable */
  get launchSource(): string {
    return String(webApp()?.launchSource ?? '') || (searchParam('tgWebAppData') ? 'url' : 'none');
  },
  /** `?startapp=` / tgWebAppStartParam — the bot uses it for deep links like /start admin */
  get startParam(): string {
    const fromInitData = webApp()?.initDataUnsafe?.start_param;
    return (
      String(webApp()?.startParam ?? '') ||
      (typeof fromInitData === 'string' ? fromInitData : String(fromInitData?.text ?? '')) ||
      searchParam('tgWebAppStartParam') ||
      searchParam('startapp')
    );
  },
  /**
   * "are we running inside Telegram?" — must not depend on initData, because the whole point
   * of the self-hosted bridge is that data can still be on its way when the app boots.
   */
  get isTelegram(): boolean {
    return (
      Boolean(webApp()?.initData) ||
      Boolean(searchParam('tgWebAppPlatform')) ||
      Boolean(searchParam('tgWebAppData')) ||
      Boolean(searchParam('startapp'))
    );
  },
  /**
   * initData sometimes lands a tick after boot (older clients answer the bridge request
   * asynchronously). Resolves with '' when we are outside Telegram or nothing arrives in time.
   */
  initDataWhenReady(timeoutMs = 1500): Promise<string> {
    const immediate = webApp()?.initData ?? '';
    if (immediate) return Promise.resolve(immediate);
    if (!tg.isTelegram) return Promise.resolve('');
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        globalThis.removeEventListener?.('ww:telegram-init', finish);
        clearTimeout(timer);
        resolve(webApp()?.initData ?? '');
      };
      const timer = setTimeout(finish, timeoutMs);
      globalThis.addEventListener?.('ww:telegram-init', finish);
    });
  },
  /** must be called once, as early as possible */
  boot(): void {
    const app = webApp();
    if (!app) return;
    try {
      app.ready?.();
      app.expand?.();
      app.setHeaderColor?.('#070a12');
      app.setBackgroundColor?.('#070a12');
    } catch {
      /* older clients ignore unknown methods */
    }
  },
  notify(type: 'error' | 'success' | 'warning'): void {
    try {
      webApp()?.HapticFeedback?.notificationOccurred?.(type);
    } catch {
      /* haptics are a nicety */
    }
  },
  tap(): void {
    try {
      webApp()?.HapticFeedback?.impactOccurred?.('light');
    } catch {
      /* ignore */
    }
  },
  /** native back button -> our own history */
  onBack(handler: () => void): () => void {
    const back = webApp()?.BackButton;
    if (!back?.show || !back.onClick) return () => undefined;
    back.onClick(handler);
    back.show();
    return () => {
      try {
        back.hide?.();
      } catch {
        /* ignore */
      }
    };
  },
};
