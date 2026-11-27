/**
 * Thin, defensive accessor for the Telegram Mini App bridge (see public/telegram-web-app.js).
 * Everything is optional: the app must stay usable in a normal browser tab (local development),
 * so every call is guarded and returns a safe default.
 */

interface TgWebAppLike {
  initData?: string;
  initDataUnsafe?: { user?: { id?: number; username?: string; first_name?: string; language_code?: string } };
  platform?: string;
  colorScheme?: string;
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
  get isTelegram(): boolean {
    return Boolean(webApp()?.initData);
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
