import {
  DEFAULT_BATTLE_PARAMS,
  DEFAULT_BRANDING,
  DEFAULT_DIPLOMACY_RULES,
  DEFAULT_ECONOMY_RULES,
  DEFAULT_PROFILE_RULES,
  DEFAULT_QUOTA_GUARD,
  DEFAULT_RANKING_WEIGHTS,
  FEATURE_FLAGS,
  GAME_SETTING_KEYS,
  type BattleParams,
  type Branding,
} from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { nowSeconds } from '../core/format';
import { ApiError } from '../core/errors';

export interface SettingsBundle {
  battle: BattleParams;
  economy: typeof DEFAULT_ECONOMY_RULES;
  profile: typeof DEFAULT_PROFILE_RULES;
  diplomacy: typeof DEFAULT_DIPLOMACY_RULES;
  features: typeof FEATURE_FLAGS;
  quota: typeof DEFAULT_QUOTA_GUARD;
  branding: Branding;
  rankingWeights: Record<string, number>;
  loadedAt: number;
}

/** keys persisted in `economy_settings` instead of `game_settings` */
const ECONOMY_SCOPED_KEYS = new Set<string>([GAME_SETTING_KEYS.economy, 'starter_economy']);

function merge<T>(defaults: T, stored: unknown): T {
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return { ...defaults };
  const out = { ...(defaults as Record<string, unknown>) };
  for (const [k, v] of Object.entries(stored as Record<string, unknown>)) {
    if (k in out && v !== undefined) out[k] = v;
  }
  return out as T;
}

let cache: { bundle: SettingsBundle; at: number } | null = null;
/**
 * Global game config is read on almost every request, so it is cached per
 * isolate for a few seconds. Game *state* (balances, inventory, wars…) is never
 * cached — it always comes from D1. Admin writes invalidate the cache of the
 * current isolate; worst case in another isolate is <= CACHE_TTL seconds of
 * staleness for a config value, never for player data.
 */
const CACHE_TTL = 10;

export function invalidateSettingsCache() {
  cache = null;
}

export async function loadSettings(db: Db, opts: { force?: boolean } = {}): Promise<SettingsBundle> {
  const now = nowSeconds();
  if (!opts.force && cache && now - cache.at < CACHE_TTL) return cache.bundle;

  const rows = await db.all<{ key: string; value: string; src: string }>(
    sql`SELECT key, value, 'game' AS src FROM game_settings
        UNION ALL
        SELECT key, value, 'economy' AS src FROM economy_settings`,
  );
  const map: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      map[r.key] = JSON.parse(r.value);
    } catch {
      map[r.key] = r.value;
    }
  }
  const bundle: SettingsBundle = {
    battle: merge(DEFAULT_BATTLE_PARAMS, map[GAME_SETTING_KEYS.battle]) as BattleParams,
    economy: merge(DEFAULT_ECONOMY_RULES, map.economy_rules) as typeof DEFAULT_ECONOMY_RULES,
    profile: merge(DEFAULT_PROFILE_RULES, map[GAME_SETTING_KEYS.profile]) as typeof DEFAULT_PROFILE_RULES,
    diplomacy: merge(DEFAULT_DIPLOMACY_RULES, map[GAME_SETTING_KEYS.diplomacy]) as typeof DEFAULT_DIPLOMACY_RULES,
    features: merge(FEATURE_FLAGS, map[GAME_SETTING_KEYS.features]) as typeof FEATURE_FLAGS,
    quota: merge(DEFAULT_QUOTA_GUARD, map[GAME_SETTING_KEYS.quota]) as typeof DEFAULT_QUOTA_GUARD,
    branding: merge(DEFAULT_BRANDING, map[GAME_SETTING_KEYS.branding]) as Branding,
    rankingWeights: merge(DEFAULT_RANKING_WEIGHTS, map[GAME_SETTING_KEYS.rankingWeights]) as Record<string, number>,
    loadedAt: now,
  };
  cache = { bundle, at: now };
  return bundle;
}

export const SETTABLE_KEYS: Record<string, string> = {
  [GAME_SETTING_KEYS.battle]: 'battle_params',
  [GAME_SETTING_KEYS.economy]: 'economy_rules',
  [GAME_SETTING_KEYS.profile]: 'profile_rules',
  [GAME_SETTING_KEYS.diplomacy]: 'diplomacy_rules',
  [GAME_SETTING_KEYS.features]: 'feature_flags',
  [GAME_SETTING_KEYS.rankingWeights]: 'ranking_weights',
  [GAME_SETTING_KEYS.branding]: 'branding',
  [GAME_SETTING_KEYS.quota]: 'quota_guard',
};

function tableForKey(key: string): 'game_settings' | 'economy_settings' {
  return ECONOMY_SCOPED_KEYS.has(key) ? 'economy_settings' : 'game_settings';
}

export async function setSettingsBulk(
  db: Db,
  patch: Record<string, unknown>,
  actorUserId: number | null,
): Promise<string[]> {
  const keys = Object.keys(patch);
  if (keys.length === 0) return [];
  const at = nowSeconds();
  const stmts = keys.map((key) => {
    const table = tableForKey(key);
    return {
      sql: `INSERT INTO ${table} (key, value, value_type, updated_by, updated_at)
            VALUES (?, ?, 'json', ?, ?)
            ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      bindings: [key, JSON.stringify(patch[key]), actorUserId, at] as readonly unknown[],
    };
  });
  await db.batch(stmts);
  invalidateSettingsCache();
  return keys;
}

export async function setSetting(db: Db, key: string, value: unknown, actorUserId: number | null) {
  if (!(key in SETTABLE_KEYS) && !ECONOMY_SCOPED_KEYS.has(key)) {
    throw ApiError.validation(`کلید تنظیمات ناشناخته است: ${key}`);
  }
  await setSettingsBulk(db, { [key]: value }, actorUserId);
}

export async function getSettingRaw(db: Db, key: string): Promise<unknown> {
  const table = tableForKey(key);
  const row = await db.first<{ value: string }>({
    sql: `SELECT value FROM ${table} WHERE key = ?`,
    bindings: [key],
  });
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return row.value;
  }
}
