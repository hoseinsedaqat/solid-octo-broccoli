import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { STARTER_ECONOMY } from '@ww/shared';
import { advanceTime, botCallback, botText, createWorld, first, onboardViaBot, type World } from '../helpers/harness';

/** 🏦 بانک مرکزی — موجودی، درآمد «دریافت‌آمدنی» و وام بانکی (e2e از ربات و API) */
let world: World;
let nation = 0;
let other = 0;
let token = '';
let otherToken = '';
let adminToken = '';
const CYCLE = STARTER_ECONOMY.incomeCycleSeconds;

/** every text payload the bot sent (sendMessage + editMessageText) */
const sentTexts = () =>
  world.sent
    .filter((s) => s.method === 'sendMessage' || s.method === 'editMessageText')
    .map((s) => String(s.payload.text ?? ''));

const treasury = async (nationId: number) =>
  Number((await first<{ treasury: number }>(world.db, `SELECT treasury FROM nations WHERE id = ?`, nationId))!.treasury);

beforeAll(async () => {
  world = await createWorld({ adminIds: '777' });
  nation = await onboardViaBot(world, 880_001, 'بانک‌شهر', 'کمبرخان');
  other = await onboardViaBot(world, 880_002, 'وام‌شهر', 'عماد');
  token = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 880_001 } })).json.token;
  otherToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 880_002 } })).json.token;
  adminToken = (await world.api('POST', '/api/auth/dev-login', { body: { telegramId: 777 } })).json.token;
}, 240_000);

afterAll(async () => {
  await world.dispose();
});

describe('بانک مرکزی — API', () => {
  it('starts with zero pending income and three documented loan options', async () => {
    const res = await world.api('GET', '/api/player/bank', { token });
    expect(res.status).toBe(200);
    expect(Number(res.json.treasury)).toBe(STARTER_ECONOMY.treasury);
    expect(res.json.pendingIncome.cycles).toBe(0);
    expect(res.json.pendingIncome.amount).toBe(0);
    expect(res.json.activeLoan).toBeNull();
    expect(res.json.loanOptions.map((o: any) => o.principal)).toEqual([5000, 10000, 20000]);
    expect(res.json.loanOptions.map((o: any) => o.repayAmount)).toEqual([5500, 11000, 22000]);
    expect(res.json.loanOptions[0].interestRate).toBe(0.1);
    expect(res.json.loanOptions[0].termDays).toBe(7);
    expect(res.json.canTakeLoan).toBe(true);
  });

  it('shows accrued income once a cycle completes', async () => {
    await advanceTime(world.db, nation, CYCLE + 30);
    const res = await world.api('GET', '/api/player/bank', { token });
    expect(res.json.pendingIncome.cycles).toBe(1);
    expect(res.json.pendingIncome.amount).toBe(STARTER_ECONOMY.factoryIncome + STARTER_ECONOMY.mineIncome);
  });

  it('grants the 10,000 loan, credits the treasury and records the ledger row', async () => {
    const before = await treasury(nation);
    const res = await world.api('POST', '/api/player/bank/loan', { token, body: { principal: 10000 } });
    expect(res.status).toBe(200);
    expect(Number(res.json.repayAmount)).toBe(11000);
    expect(await treasury(nation)).toBe(before + 10000);

    const tx = await first<{ type: string; amount: number }>(
      world.db,
      `SELECT type, amount FROM transactions WHERE nation_id = ? AND type = 'loan_disbursement' ORDER BY id DESC LIMIT 1`,
      nation,
    );
    expect(tx?.type).toBe('loan_disbursement');
    expect(Number(tx?.amount)).toBe(10000);

    const state = await world.api('GET', '/api/player/bank', { token });
    expect(state.json.activeLoan.principal).toBe(10000);
    expect(state.json.activeLoan.repayAmount).toBe(11000);
    expect(state.json.canTakeLoan).toBe(false);
  });

  it('rejects unknown loan amounts instead of inventing terms', async () => {
    const res = await world.api('POST', '/api/player/bank/loan', { token: otherToken, body: { principal: 7777 } });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('refuses a second loan while one is active (409)', async () => {
    const res = await world.api('POST', '/api/player/bank/loan', { token, body: { principal: 5000 } });
    expect(res.status).toBe(409);
  });

  it('repays the active loan and refuses a second repayment', async () => {
    const before = await treasury(nation);
    const res = await world.api('POST', '/api/player/bank/loan/repay', { token });
    expect(res.status).toBe(200);
    expect(Number(res.json.repayAmount)).toBe(11000);
    expect(await treasury(nation)).toBe(before - 11000);

    const again = await world.api('POST', '/api/player/bank/loan/repay', { token });
    expect(again.status).toBeGreaterThanOrEqual(400);

    const state = await world.api('GET', '/api/player/bank', { token });
    expect(state.json.activeLoan).toBeNull();
    expect(state.json.canTakeLoan).toBe(true);

    const tx = await first<{ type: string; amount: number }>(
      world.db,
      `SELECT type, amount FROM transactions WHERE nation_id = ? AND type = 'loan_repayment' ORDER BY id DESC LIMIT 1`,
      nation,
    );
    expect(Number(tx?.amount)).toBe(-11000);
  });

  it('refuses repayment when the treasury cannot cover it', async () => {
    // drain the second nation first (admin adjust to the limit: never below zero)
    const drain = await world.api('POST', `/api/admin/nations/${other}/treasury`, {
      token: adminToken,
      body: { nationId: other, delta: -STARTER_ECONOMY.treasury, reason: 'خالی‌کردن خزانه برای تست بازپرداخت' },
    });
    expect(drain.status).toBe(200);
    const loan = await world.api('POST', '/api/player/bank/loan', { token: otherToken, body: { principal: 20000 } });
    expect(loan.status).toBe(200);
    // treasury is 20,000 after the loan; give away 19,000 so it cannot cover the 22,000 repayment
    const drain2 = await world.api('POST', `/api/admin/nations/${other}/treasury`, {
      token: adminToken,
      body: { nationId: other, delta: -19000, reason: 'کاهش برای پوشش‌ندادن بازپرداخت' },
    });
    expect(drain2.status).toBe(200);
    const res = await world.api('POST', '/api/player/bank/loan/repay', { token: otherToken });
    expect(res.status).toBeGreaterThanOrEqual(400);
    const state = await world.api('GET', '/api/player/bank', { token: otherToken });
    expect(state.json.activeLoan).not.toBeNull();
  });
});

describe('بانک مرکزی — ربات', () => {
  it('«🏦 بانک مرکزی» shows the bank home with treasury and the two action buttons', async () => {
    world.sent.length = 0;
    await botText(world, 880_001, '🏦 بانک مرکزی');
    const texts = sentTexts();
    const home = texts.find((t) => t.includes('بانک مرکزی کشور'));
    expect(home).toBeTruthy();
    expect(home).toContain('موجودی خزانه ملی');
  });

  it('«دریافت درآمد» opens the claim screen; the claim button pays the pending income', async () => {
    // one cycle has accrued since the «income accrued» API test — read the truth from the API, don't hardcode it
    const state = await world.api('GET', '/api/player/bank', { token });
    const pending = Number(state.json.pendingIncome.amount);
    expect(pending).toBe(STARTER_ECONOMY.factoryIncome + STARTER_ECONOMY.mineIncome);

    world.sent.length = 0;
    await botCallback(world, 880_001, 'bank:income');
    const screen = sentTexts().find((t) => t.includes('درآمد آماده دریافت'));
    expect(screen).toBeTruthy();
    expect(screen).toContain(pending.toLocaleString('en-US'));

    const before = await treasury(nation);
    world.sent.length = 0;
    await botCallback(world, 880_001, 'bank:claim_income');
    expect(sentTexts().some((t) => t.includes('به خزانه واریز شد'))).toBe(true);
    expect(await treasury(nation)).toBe(before + pending);
  });

  it('«وام بانکی» shows the three tiers and the terms, and taking one blocks a second', async () => {
    world.sent.length = 0;
    await botCallback(world, 880_001, 'bank:loan');
    const screen = sentTexts().find((t) => t.includes('وام کوچک'));
    expect(screen).toBeTruthy();
    expect(screen).toContain('وام متوسط');
    expect(screen).toContain('وام بزرگ');
    expect(screen).toContain('بازپرداخت بعد از ۷ روز');
    expect(screen).toContain('سود وام: ۱۰٪');

    const before = await treasury(nation);
    world.sent.length = 0;
    await botCallback(world, 880_001, 'bank:take:5000');
    expect(sentTexts().some((t) => t.includes('وام') && t.includes('واریز شد'))).toBe(true);
    expect(await treasury(nation)).toBe(before + 5000);

    // the loan screen now shows the active loan and the repay button
    world.sent.length = 0;
    await botCallback(world, 880_001, 'bank:loan');
    const active = sentTexts().find((t) => t.includes('وام فعال'));
    expect(active).toBeTruthy();

    // and «بازپرداخت» settles it
    const before2 = await treasury(nation);
    world.sent.length = 0;
    await botCallback(world, 880_001, 'bank:repay');
    expect(sentTexts().some((t) => t.includes('تسویه شد'))).toBe(true);
    expect(await treasury(nation)).toBe(before2 - 5500);
  });
});
