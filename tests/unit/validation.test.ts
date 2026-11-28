import { describe, expect, it } from 'vitest';
import {
  battleParamsSchema,
  equipmentUpsertSchema,
  leaderNameSchema,
  nationNameSchema,
  purchaseSchema,
  statementTextSchema,
  STARTER_PACK,
  EQUIPMENT_CATEGORIES,
} from '@ww/shared';

describe('input validation (shared between bot, Mini App and API)', () => {
  it('accepts persian and latin country names, rejects junk', () => {
    expect(nationNameSchema.safeParse('پرشیا').success).toBe(true);
    expect(nationNameSchema.safeParse('New Atlantis').success).toBe(true);
    expect(nationNameSchema.safeParse('ab').success).toBe(false);
    expect(nationNameSchema.safeParse('a'.repeat(31)).success).toBe(false);
    expect(nationNameSchema.safeParse('<script>x</script>').success).toBe(false);
    expect(nationNameSchema.safeParse('   ').success).toBe(false);
  });

  it('validates leader names', () => {
    expect(leaderNameSchema.safeParse('رضا خان').success).toBe(true);
    expect(leaderNameSchema.safeParse('x').success).toBe(false);
  });

  it('keeps statements inside the design limits and free of markup', () => {
    expect(statementTextSchema.safeParse('بیانیه رسمی کشور درباره اقتصاد جدید.').success).toBe(true);
    expect(statementTextSchema.safeParse('کوتاه').success).toBe(false);
    expect(statementTextSchema.safeParse('<b>bold</b> statement text here').success).toBe(false);
    expect(statementTextSchema.safeParse('a'.repeat(1201)).success).toBe(false);
  });

  it('requires an idempotency key on every purchase', () => {
    expect(purchaseSchema.safeParse({ templateId: '12', quantity: '5', idempotencyKey: 'abc12345' }).success).toBe(true);
    expect(purchaseSchema.safeParse({ templateId: 12, quantity: 5 }).success).toBe(false);
    expect(purchaseSchema.safeParse({ templateId: 12, quantity: 0, idempotencyKey: 'abc12345' }).success).toBe(false);
    expect(purchaseSchema.safeParse({ templateId: 12, quantity: -3, idempotencyKey: 'abc12345' }).success).toBe(false);
  });

  it('models "price unknown" as null and rejects zero/negative prices', () => {
    const base = { categoryKey: 'tanks', code: 'leopard', nameFa: 'Leopard', unitFa: 'عدد' };
    expect(equipmentUpsertSchema.safeParse({ ...base }).success).toBe(true);
    expect(equipmentUpsertSchema.safeParse({ ...base, price: null }).success).toBe(true);
    expect(equipmentUpsertSchema.safeParse({ ...base, price: 0 }).success).toBe(false); // "no price" is null, never 0
    expect(equipmentUpsertSchema.safeParse({ ...base, price: 1.5 }).success).toBe(false);
    expect(equipmentUpsertSchema.safeParse({ ...base, price: -5 }).success).toBe(false);
    expect(equipmentUpsertSchema.safeParse({ ...base, code: 'bad code!' }).success).toBe(false);
  });

  it('clamps battle parameters to a sane range', () => {
    expect(battleParamsSchema.safeParse({ ...{
      warRandomness: 0.15, damagePerRound: 0.08, maxRounds: 12, attackerAdvantage: 1.05, defenderAdvantage: 1.1,
      manpowerFactor: 0.2, radarSupportBonus: 0.05, allianceSupportRatio: 0.25, indemnityPerPoint: 100, warEntryTaxRate: 0,
      minWarDurationSeconds: 3600, warCooldownSeconds: 21600, maxActiveWarsPerNation: 1, maxAttackersPerTarget: 1, peaceCooldownSeconds: 43200,
    } }).success).toBe(true);
    expect(
      battleParamsSchema.safeParse({
        warRandomness: 5, damagePerRound: 0.08, maxRounds: 999, attackerAdvantage: 1.05, defenderAdvantage: 1.1,
        manpowerFactor: 0.2, radarSupportBonus: 0.05, allianceSupportRatio: 0.25, indemnityPerPoint: 100, warEntryTaxRate: 0,
        minWarDurationSeconds: 3600, warCooldownSeconds: 21600, maxActiveWarsPerNation: 1, maxAttackersPerTarget: 1, peaceCooldownSeconds: 43200,
      }).success,
    ).toBe(false);
  });
});

describe('canonical game data', () => {
  it('has the 18 canonical categories + the سوخت نظامی بازار', () => {
    expect(EQUIPMENT_CATEGORIES).toHaveLength(19);
    expect(new Set(EQUIPMENT_CATEGORIES.map((c) => c.key)).size).toBe(19);
    expect(EQUIPMENT_CATEGORIES.map((c) => c.shopLabelFa)).toContain('خرید تانک');
    expect(EQUIPMENT_CATEGORIES.map((c) => c.shopLabelFa)).toContain('خرید هواپیمای ترابری');
  });

  it('keeps F-22 / F-35 duplicated in their two categories (never merged)', () => {
    const ad = STARTER_PACK.air_air_defense!.map((i) => [i.nameFa, i.quantity]);
    const fighters = STARTER_PACK.fighters!.map((i) => [i.nameFa, i.quantity]);
    expect(ad).toContainEqual(['F-35', 5]);
    expect(ad).toContainEqual(['F-22', 3]);
    expect(fighters).toContainEqual(['F-22 Raptor', 5]);
    expect(fighters).toContainEqual(['F-35 Lightning II', 10]);
    expect(fighters).toContainEqual(['Su-57', 5]);
  });

  it('carries the exact starter quantities from the design document', () => {
    const flat = Object.entries(STARTER_PACK).flatMap(([cat, items]) => items.map((i) => `${cat}:${i.nameFa}:${i.quantity}`));
    expect(flat).toContain('tanks:M1 Abrams:100');
    expect(flat).toContain('tanks:Leopard 2A7:50');
    expect(flat).toContain('soldiers:سرباز پیاده:10000');
    expect(flat).toContain('soldiers:تک‌تیرانداز:300');
    expect(flat).toContain('ships:Gerald R. Ford:1');
    expect(flat).toContain('missiles:BrahMos:10');
    expect(flat).toHaveLength(40);
    // no invented prices anywhere
    expect(flat.filter(Boolean).length).toBe(40);
    for (const items of Object.values(STARTER_PACK)) {
      for (const item of items) {
        expect(item.price).toBeNull();
        expect(item.attackPoints).toBeNull();
        expect(item.defensePoints).toBeNull();
      }
    }
  });
});
