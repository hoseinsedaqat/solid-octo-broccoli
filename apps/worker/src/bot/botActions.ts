import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import type { SettingsBundle } from '../core/settings';
import { loadNation, type NationRow } from '../db/queries';
import { sendRequest } from '../services/diplomacyService';
import type { Combatant } from '../game-engine/battle';
import { previewBattle } from '../game-engine/battle';
import { computeNation } from '../db/queries';

/** thin wrappers so the bot reuses exactly the same services as the API */

export async function sendRequestFriendly(
  db: Db,
  from: NationRow,
  toNationId: number,
  kind: 'friendship' | 'non_aggression' | 'alliance' | 'message',
  settings: SettingsBundle,
): Promise<string> {
  try {
    const res = await sendRequest(
      db,
      from,
      { toNationId, kind, message: kind === 'friendship' ? `درخواست دوستی از سوی ${from.name}` : null },
      settings,
    );
    return `✅ درخواست ${kind === 'friendship' ? 'دوستی' : kind === 'alliance' ? 'اتحاد' : kind === 'message' ? 'پیام' : 'عدم تجاوز'} ارسال شد (شناسه ${res.requestId}). در انتظار پاسخ کشور مقابل.`;
  } catch (err) {
    if (err instanceof ApiError) return `⚠️ ${err.message}`;
    throw err;
  }
}

export interface WarPreviewCard {
  targetName: string;
  targetFlag: string;
  attackerPower: number;
  defenderPower: number;
  attackerWinChance: number;
  entryCost: number;
  maxRounds: number;
  expectedLossPercent: number;
}

export async function previewForWarTarget(db: Db, attacker: NationRow, targetId: number, settings: SettingsBundle): Promise<WarPreviewCard> {
  if (attacker.id === targetId) throw ApiError.forbidden('حمله به کشور خود امکان‌پذیر نیست.');
  const target = await loadNation(db, targetId);
  const att = await combatant(db, attacker, settings, 'attacker');
  const def = await combatant(db, target, settings, 'defender');
  const p = previewBattle(att, def, settings.battle);
  return {
    targetName: target.name,
    targetFlag: target.flag,
    attackerPower: att.attackPower,
    defenderPower: def.defensePower,
    attackerWinChance: p.attackerWinChance,
    entryCost: p.entryCost,
    maxRounds: settings.battle.maxRounds,
    expectedLossPercent: p.expectedLossPercent,
  };
}

async function combatant(db: Db, nation: NationRow, settings: SettingsBundle, side: 'attacker' | 'defender'): Promise<Combatant> {
  const computed = await computeNation(db, nation, settings);
  const ns = await db.first<{ fortification_level: number }>(
    sql`SELECT fortification_level FROM nation_settings WHERE nation_id = ${nation.id}`,
  );
  return {
    nationId: nation.id,
    attackPower: computed.power.attackPower,
    defensePower: computed.power.defensePower,
    troopsCount: computed.power.troopsCount,
    equipmentCount: computed.power.equipmentCount,
    treasury: nation.treasury,
    allianceSupport: 0,
    fortificationLevel: ns?.fortification_level ?? 0,
    morale: 1,
  };
}
