/// <reference types="@cloudflare/workers-types" />
import type { Role, AdminSection } from '@ww/shared';

export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
  /** comma separated telegram user ids that are bootstrap super admins */
  ADMIN_TELEGRAM_IDS?: string;
  BOT_TOKEN?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  APP_SECRET?: string;
  WEBAPP_URL?: string;
  PUBLIC_BASE_URL?: string;
  APP_ENV?: string;
  /** Telegram Bot API endpoint; set it to a self-hosted telegram-bot-api server if the network blocks api.telegram.org */
  TELEGRAM_API_BASE?: string;
  /** hard kill-switch for cron jobs (set to "1" to pause all background work) */
  CRON_DISABLED?: string;
}

export interface SessionUser {
  userId: number;
  telegramId: number;
  role: Role;
  username?: string | null;
  status: 'active' | 'blocked' | 'disabled';
  permissions: Partial<Record<AdminSection, { read: boolean; write: boolean }>>;
  nationIds: number[];
  activeNationId: number | null;
  sessionId: number;
  /** the account listed first in ADMIN_TELEGRAM_IDS — cannot be blocked or demoted */
  isPrimaryAdmin: boolean;
}

export interface AppContext {
  env: Env;
  now: number;
  requestId: string;
  ip: string | null;
  dbReads: number;
  dbWrites: number;
}

export interface HonoEnv {
  Bindings: Env;
  Variables: {
    ctx: AppContext;
    user: SessionUser;
    nationId: number;
    db: import('./core/db').Db;
    nation: import('./services/nationService').NationRow;
    settings: import('./core/settings').SettingsBundle;
  };
}
