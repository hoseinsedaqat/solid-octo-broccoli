import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { all, createWorld, first, onboardViaBot, run, type World } from '../helpers/harness';

/**
 * «آرایش حمله» — committing units to a war:
 *  - committed units fight (attacker power comes from the committed subset only),
 *  - committed units are the only ones lost to battle & residual losses,
 *  - the defender gets the «هشدار وضعیت جنگی!» push at declaration and «عملیات دفاع از کشور آغاز شد!» at acceptance,
 *  - over-commitment is rejected server-side.
 */

let world: World;
let nationA = 0;
let nationB = 0;
let tokenA = '';
let tokenB = '';
let fighterTemplateId = 0;
let radarTemplateId = 0;
let warId = 0;

beforeAll(async () => {
  world = await createWorld({ adminIds: '' });
  nationA = await onboardViaBot(world, 830_001, 'آتشفشان', 'آریا');
  nationB = await onboardViaBot(world, 830_002, 'سپرکده', 'نیلو');
  tokenA = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_001 } })).json.token;
  tokenB = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 830_002 } })).json.token;

  const fighter = await first<{ id: number }>(
    world.db,
    `SELECT t.id FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
      WHERE c.role = 'offense' AND t.is_active = 1 AND c.key = 'fighters'
      ORDER BY t.id LIMIT 1`,
  );
  fighterTemplateId = Number(fighter!.id);
  const radar = await first<{ id: number }>(
    world.db,
    `SELECT t.id FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
      WHERE c.key = 'radars' AND t.is_active = 1 ORDER BY t.id LIMIT 1`,
  );
  radarTemplateId = Number(radar!.id);

  // A owns 20 committed-candidate fighters and 7 radars (radars must never be eaten by the war)
  await run(world.db, `DELETE FROM nation_inventory WHERE nation_id = ? AND template_id IN (?, ?)`, nationA, fighterTemplateId, radarTemplateId);
  await run(world.db, `INSERT INTO nation_inventory (nation_id, template_id, quantity) VALUES (?, ?, 20)`, nationA, fighterTemplateId);
  await run(world.db, `INSERT INTO nation_inventory (nation_id, template_id, quantity) VALUES (?, ?, 7)`, nationA, radarTemplateId);
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

describe('committing an attack plan', () => {
  it('rejects over-commitment (server validates against real inventory)', async () => {
    const res = await world.api('POST', '/api/war/propose', {
      token: tokenA,
      body: { targetNationId: nationB, attackPlan: [{ templateId: fighterTemplateId, quantity: 9999 }] },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('creates the war, stores the plan, and notifies the defender with the red-alert', async () => {
    const res = await world.api('POST', '/api/war/propose', {
      token: tokenA,
      body: { targetNationId: nationB, attackPlan: [{ templateId: fighterTemplateId, quantity: 20 }] },
    });
    expect(res.status).toBe(200);
    warId = Number(res.json.warId);
    expect(warId).toBeGreaterThan(0);

    const war = await first<any>(world.db, `SELECT attack_plan, attack_plan_remaining, attacker_power FROM wars WHERE id = ?`, warId);
    expect(JSON.parse(String(war!.attack_plan))).toEqual([{ templateId: fighterTemplateId, quantity: 20 }]);
    expect(JSON.parse(String(war!.attack_plan_remaining))).toEqual([{ templateId: fighterTemplateId, quantity: 20 }]);
    // committed force is much smaller than the full army — the power reflects that.
    // cross-check: power equals committing the SAME plan through the official preview endpoint
    const pv = await world.api('POST', '/api/war/preview', {
      token: tokenA,
      body: { targetNationId: nationB, attackPlan: [{ templateId: fighterTemplateId, quantity: 20 }] },
    });
    expect(pv.status).toBe(200);
    expect(Number(war!.attacker_power)).toBeCloseTo(Number(pv.json.attackerPower), 5);

    const warnings = await all<any>(world.db, `SELECT * FROM notifications WHERE nation_id = ? AND kind = 'war_warning'`, nationB);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]!.title).toContain('هشدار وضعیت جنگی');
    expect(warnings[0]!.body).toContain('کشور مهاجم');
    expect(warnings[0]!.body).toContain('جنگنده‌ها:');
  });

  it('shows the plan in the war detail for both fighters', async () => {
    const mineAttacker = await world.api('GET', `/api/war/wars/${warId}`, { token: tokenA });
    expect(mineAttacker.status).toBe(200);
    expect(Array.isArray(mineAttacker.json.attackPlan)).toBe(true);
    expect(mineAttacker.json.attackPlan).toHaveLength(1);
    expect(mineAttacker.json.attackPlan[0].quantity).toBe(20);

    const mineDefender = await world.api('GET', `/api/war/wars/${warId}`, { token: tokenB });
    expect(mineDefender.status).toBe(200);
    expect(mineDefender.json.attackPlan[0].quantity).toBe(20);
  });

  it('mobilizes the defender with the «دفاع آغاز شد» alert on accept', async () => {
    const accept = await world.api('POST', `/api/war/${warId}/respond`, { token: tokenB, body: { accept: true } });
    expect(accept.status).toBe(200);
    const mobilized = await all<any>(world.db, `SELECT * FROM notifications WHERE nation_id = ? AND kind = 'war_defense'`, nationB);
    expect(mobilized).toHaveLength(1);
    expect(mobilized[0]!.body).toContain('عملیات دفاع از کشور آغاز شد');
  });

  it('spends only committed units in battle — the rest of the army is untouched', async () => {
    const committedBefore = await first<{ quantity: number }>(world.db, `SELECT quantity FROM nation_inventory WHERE nation_id = ? AND template_id = ?`, nationA, fighterTemplateId);
    expect(Number(committedBefore!.quantity)).toBe(20);

    for (let i = 0; i < 14; i++) {
      await run(world.db, `UPDATE wars SET next_round_at = 1, started_at = 1, ends_at = 1 WHERE id = ?`, warId);
      await world.api('POST', `/api/war/${warId}/round`, { token: tokenA });
      const war = await first<any>(world.db, `SELECT status FROM wars WHERE id = ?`, warId);
      if (war!.status === 'ended') break;
    }
    const war = await first<any>(world.db, `SELECT status FROM wars WHERE id = ?`, warId);
    expect(war!.status).toBe('ended');

    // committed fighters: all or most destroyed
    const committedAfter = Number((await first<{ quantity: number }>(world.db, `SELECT quantity FROM nation_inventory WHERE nation_id = ? AND template_id = ?`, nationA, fighterTemplateId))!.quantity);
    expect(committedAfter).toBeLessThan(20);
    // uncommitted radars: EXACTLY untouched by this war
    const radarsAfter = Number((await first<{ quantity: number }>(world.db, `SELECT quantity FROM nation_inventory WHERE nation_id = ? AND template_id = ?`, nationA, radarTemplateId))!.quantity);
    expect(radarsAfter).toBe(7);
  });
});
