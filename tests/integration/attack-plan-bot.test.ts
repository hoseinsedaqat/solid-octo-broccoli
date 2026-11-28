import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { all, botCallback, createWorld, first, onboardViaBot, run, type World } from '../helpers/harness';

/** The in-bot attack wizard: انتخاب هدف → آرایش حمله → تعداد → تأیید */
let world: World;
const TID_A = 840_001;
const TID_B = 840_002;
let nationA = 0;
let nationB = 0;
let fighterTpl = 0;

const sentTexts = () =>
  world.sent
    .filter((s) => s.method === 'sendMessage' || s.method === 'editMessageText')
    .map((s) => String(s.payload.text ?? ''));

beforeAll(async () => {
  world = await createWorld({ adminIds: '' });
  nationA = await onboardViaBot(world, TID_A, 'بات‌ون', 'آرش');
  nationB = await onboardViaBot(world, TID_B, 'بات‌دفاع', 'دریا');
  const fighter = await first<{ id: number }>(
    world.db,
    `SELECT t.id FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
      WHERE c.key = 'fighters' AND t.is_active = 1 ORDER BY t.id LIMIT 1`,
  );
  fighterTpl = Number(fighter!.id);
  await run(world.db, `DELETE FROM nation_inventory WHERE nation_id = ? AND template_id = ?`, nationA, fighterTpl);
  await run(world.db, `INSERT INTO nation_inventory (nation_id, template_id, quantity) VALUES (?, ?, 25)`, nationA, fighterTpl);
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

describe('bot attack wizard (آرایش حمله, step by step)', () => {
  it('walks: war page → targets → picker → category → unit → quantity → preview → proposal stored', async () => {
    // «⚔️ حمله» page renders the target picker entry point
    world.sent.length = 0;
    await botCallback(world, TID_A, 'nav:war');
    expect(sentTexts().some((t) => t.includes('جنگ'))).toBe(true);

    // target list renders the other nation as a tappable button
    world.sent.length = 0;
    await botCallback(world, TID_A, 'war:targets:0');
    const targetMsg = world.sent.find((s) => s.method === 'editMessageText');
    const inline = ((targetMsg?.payload.reply_markup ?? {}) as { inline_keyboard?: { text: string }[][] }).inline_keyboard ?? [];
    expect(inline.flat().some((b) => b.text.includes('بات‌دفاع'))).toBe(true);

    // tapping a target opens the «آرایش حمله» picker (NOT a blind war request)
    world.sent.length = 0;
    await botCallback(world, TID_A, `war:ask:${nationB}`);
    const picker = sentTexts().find((t) => t.includes('آرایش حمله'));
    expect(picker).toBeTruthy();
    expect(picker).toContain('نیروهای متعهد');

    // category screen lists owned fighters
    world.sent.length = 0;
    await botCallback(world, TID_A, `atk:cat:${nationB}:fighters`);
    expect(sentTexts().some((t) => t.includes('کدام واحد؟'))).toBe(true);

    // unit screen shows owned quantity
    world.sent.length = 0;
    await botCallback(world, TID_A, `atk:tpl:${nationB}:${fighterTpl}`);
    expect(sentTexts().some((t) => t.includes('موجودی'))).toBe(true);

    // choose «همه (25)» → draft is saved and the picker shows the committed line
    world.sent.length = 0;
    await botCallback(world, TID_A, `atk:qty:${nationB}:${fighterTpl}:25`);
    const afterQty = sentTexts().find((t) => t.includes('آرایش حمله'));
    expect(afterQty).toBeTruthy();
    expect(afterQty).toContain('25');

    // preview screen
    world.sent.length = 0;
    await botCallback(world, TID_A, `atk:preview:${nationB}`);
    expect(sentTexts().some((t) => t.includes('پیش‌نمایش حمله'))).toBe(true);

    // confirm → war proposed with the committed plan persisted
    world.sent.length = 0;
    await botCallback(world, TID_A, `war:go:${nationB}`);
    expect(sentTexts().some((t) => t.includes('حمله آغاز شد'))).toBe(true);

    const war = await first<any>(world.db, `SELECT * FROM wars WHERE attacker_nation_id = ? AND defender_nation_id = ?`, nationA, nationB);
    expect(war).toBeTruthy();
    expect(JSON.parse(String(war!.attack_plan))).toEqual([{ templateId: fighterTpl, quantity: 25 }]);

    // the defender was notified with the red-alert push
    const warnings = await all<any>(world.db, `SELECT * FROM notifications WHERE nation_id = ? AND kind = 'war_warning'`, nationB);
    expect(warnings).toHaveLength(1);
  });

  it('refuses to send without an آرایش (war:go falls back to the picker)', async () => {
    // fresh target: use a third nation as a new target to avoid the existing proposal
    const nationC = await onboardViaBot(world, 840_003, 'بات‌هدف‌جدید', 'کیان');
    world.sent.length = 0;
    await botCallback(world, TID_A, `war:go:${nationC}`);
    expect(sentTexts().some((t) => t.includes('آرایش حمله'))).toBe(true);
    const wars = await all<any>(world.db, `SELECT id FROM wars WHERE attacker_nation_id = ? AND defender_nation_id = ?`, nationA, nationC);
    expect(wars).toHaveLength(0);
  });
});
