import { BUILDINGS, type BuildingKey } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso } from '../core/format';
import { uuid } from '../core/ids';
import type { NationRow } from '../db/queries';
import { audit } from './auditService';
import { notify } from './notificationService';

export interface BuildingView {
  key: string;
  emoji: string;
  nameFa: string;
  descFa: string;
  cost: number;
  built: boolean;
  builtAt: string | null;
  grant: { kind: string; quantity: number; templateCode?: string };
}

export async function buildState(db: Db, nation: NationRow) {
  const rows = await db.all<{ building_key: string; built_at: number }>(
    sql`SELECT building_key, built_at FROM nation_buildings WHERE nation_id = ${nation.id}`,
  );
  const built = new Map(rows.map((r) => [String(r.building_key), Number(r.built_at)]));
  const buildings: BuildingView[] = BUILDINGS.map((b) => ({
    key: b.key,
    emoji: b.emoji,
    nameFa: b.nameFa,
    descFa: b.descFa,
    cost: b.cost,
    built: built.has(b.key),
    builtAt: built.has(b.key) ? toIso(built.get(b.key)) : null,
    grant: b.grant.kind === 'units'
      ? { kind: 'units', quantity: b.grant.quantity, templateCode: b.grant.templateCode }
      : { kind: 'fortification', quantity: b.grant.quantity },
  }));
  return {
    treasury: nation.treasury,
    buildings,
    builtCount: buildings.filter((b) => b.built).length,
    totalCount: buildings.length,
  };
}

/** one-time construction per building; atomic with the treasury deduction (DB CHECK + batch) */
export async function construct(db: Db, nation: NationRow, key: string, now = nowSeconds()) {
  const building = BUILDINGS.find((b) => b.key === (key as BuildingKey));
  if (!building) throw ApiError.validation('سازهٔ انتخاب‌شده معتبر نیست.');
  const existing = await db.first<{ id: number }>(
    sql`SELECT id FROM nation_buildings WHERE nation_id = ${nation.id} AND building_key = ${building.key}`,
  );
  if (existing) throw ApiError.conflict('این سازه قبلاً ساخته شده است.');
  if (nation.treasury < building.cost) throw ApiError.validation('موجودی ناکافی است.');

  const at = now;
  const grant = building.grant;
  const templateId =
    grant.kind === 'units'
      ? Number(
          (
            await db.first<{ id: number }>(
              sql`SELECT id FROM equipment_templates WHERE code = ${grant.templateCode}`,
            )
          )?.id ?? 0,
        )
      : 0;
  if (grant.kind === 'units' && !templateId) {
    // the seed guarantees these templates; if one vanishes the build must fail loudly, never silently grant nothing
    throw ApiError.internal(`قالب تجهیزات موجود نیست (${grant.templateCode}).`);
  }

  const statements = [
    sql`INSERT INTO nation_buildings (nation_id, building_key, built_at) VALUES (${nation.id}, ${building.key}, ${at})`,
    sql`UPDATE nations SET treasury = treasury - ${building.cost}, updated_at = ${at} WHERE id = ${nation.id}`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                  idempotency_key, reference_type, reference_id, reason, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, 'purchase', ${-building.cost}, ${nation.treasury}, ${nation.treasury - building.cost}, 'coin',
                 ${`build:${nation.id}:${building.key}`}, 'building', NULL,
                 ${`🏗️ ساخت‌وساز: ${building.nameFa}`},
                 ${JSON.stringify({ buildingKey: building.key, grant })}, ${at})`,
    sql`UPDATE nation_economy SET total_spent = total_spent + ${building.cost}, updated_at = ${at} WHERE nation_id = ${nation.id}`,
  ];
  if (grant.kind === 'units' && templateId) {
    statements.push(
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
           VALUES (${nation.id}, ${templateId}, ${grant.quantity}, ${at}, ${at})
           ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${grant.quantity}, updated_at = ${at}`,
    );
  } else if (grant.kind === 'fortification') {
    statements.push(
      sql`UPDATE nation_settings SET fortification_level = MIN(20, COALESCE(fortification_level, 0) + ${grant.quantity}), updated_at = ${at} WHERE nation_id = ${nation.id}`,
    );
  }
  try {
    await db.batch(statements);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed/i.test(message)) throw ApiError.conflict('این سازه قبلاً ساخته شده است.');
    if (message.toLowerCase().includes('check constraint')) {
      throw ApiError.validation('موجودی ناکافی است.');
    }
    throw err;
  }

  const after = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  await audit(db, {
    actor: null,
    action: 'build.construct',
    targetType: 'nation',
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: Number(after?.treasury ?? 0), building: building.key },
    reason: `ساخت ${building.nameFa}`,
  });
  await notify(db, {
    nationId: nation.id,
    kind: 'build',
    title: '🏗️ سازه ساخته شد',
    body: `${building.emoji} ${building.nameFa} با هزینه ${building.cost.toLocaleString('en-US')} سکه ساخته شد.`,
  });
  return { building: { key: building.key, nameFa: building.nameFa, emoji: building.emoji }, cost: building.cost, treasury: Number(after?.treasury ?? nation.treasury - building.cost) };
}
