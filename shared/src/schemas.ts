import { z } from 'zod';
import { MAX_STATEMENT_CHARS, MIN_STATEMENT_CHARS, RELATION_STATUSES, DIPLOMACY_REQUEST_KINDS } from './constants';

/** Persian-safe name rules: letters (fa/ar/latin), digits, spaces and a few marks. */
const NAME_RE = /^[\p{L}\p{N}][\p{L}\p{N} .،()\-_]{1,58}[\p{L}\p{N} .،()\-_]$/u;

export const nationNameSchema = z
  .string()
  .trim()
  .min(3, 'نام کشور باید حداقل ۳ نویسه باشد')
  .max(30, 'نام کشور باید حداکثر ۳۰ نویسه باشد')
  .regex(NAME_RE, 'نام کشور شامل نویسه‌های مجاز نیست')
  .refine((v) => !/^\s+$/.test(v), 'نام کشور نامعتبر است');

export const leaderNameSchema = z
  .string()
  .trim()
  .min(2, 'نام رئیس کشور باید حداقل ۲ نویسه باشد')
  .max(40, 'نام رئیس کشور باید حداکثر ۴۰ نویسه باشد')
  .regex(NAME_RE, 'نام رئیس کشور شامل نویسه‌های مجاز نیست');

export const flagSchema = z.string().trim().min(1, 'پرچم لازم است').max(24, 'پرچم بیش از حد طولانی است');

export const statementTextSchema = z
  .string()
  .trim()
  .min(MIN_STATEMENT_CHARS, `متن بیانیه باید حداقل ${MIN_STATEMENT_CHARS} نویسه باشد`)
  .max(MAX_STATEMENT_CHARS, `متن بیانیه باید حداکثر ${MAX_STATEMENT_CHARS} نویسه باشد`)
  .refine((t) => !/<[^>]+>/.test(t), 'متن بیانیه نمی‌تواند شامل تگ HTML باشد');

export const purchaseSchema = z.object({
  templateId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(100000),
  idempotencyKey: z.string().trim().min(8).max(80),
});

export const relationSchema = z.object({
  otherNationId: z.coerce.number().int().positive(),
  status: z.enum(RELATION_STATUSES),
});

export const diplomacyRequestSchema = z.object({
  toNationId: z.coerce.number().int().positive(),
  kind: z.enum(DIPLOMACY_REQUEST_KINDS),
  message: z.string().trim().max(600).optional().nullable(),
  allianceId: z.coerce.number().int().positive().optional().nullable(),
  allianceName: z.string().trim().min(3).max(40).optional().nullable(),
});

export const requestDecisionSchema = z.object({
  requestId: z.coerce.number().int().positive(),
  accept: z.coerce.boolean(),
});

export const warProposeSchema = z.object({
  targetNationId: z.coerce.number().int().positive(),
  indemnityOffered: z.coerce.number().int().min(0).max(1_000_000_000).optional().default(0),
});

export const equipmentUpsertSchema = z.object({
  id: z.coerce.number().int().positive().optional().nullable(),
  categoryKey: z.string().trim().min(1).max(40),
  code: z.string().trim().min(1).max(60).regex(/^[a-z0-9_]+$/i, 'کد تجهیزات فقط می‌تواند حروف، رقم و _ باشد'),
  nameFa: z.string().trim().min(1).max(80),
  unitFa: z.string().trim().min(1).max(16),
  /** null => not priced, purchase disabled */
  price: z.coerce.number().int().min(1, "قیمت باید عدد صحیح مثبت باشد (برای «قیمت‌گذاری‌نشده» خالی بگذارید)").nullable().optional().default(null),
  attackPoints: z.coerce.number().min(0).nullable().optional().default(null),
  defensePoints: z.coerce.number().min(0).nullable().optional().default(null),
  descriptionFa: z.string().trim().max(200).optional().default(''),
  isActive: z.coerce.boolean().optional().default(true),
  isForSale: z.coerce.boolean().optional().default(true),
  purchaseLimitPerCycle: z.coerce.number().int().min(1).nullable().optional().default(null),
  maintenancePerUnit: z.coerce.number().min(0).int().nullable().optional().default(null),
});

export const adminAdjustTreasurySchema = z.object({
  nationId: z.coerce.number().int().positive(),
  delta: z.coerce.number().int().refine((v) => v !== 0, 'مقدار تغییر نمی‌تواند صفر باشد'),
  reason: z.string().trim().min(3).max(200),
});

export const adminSetIncomeSchema = z.object({
  nationId: z.coerce.number().int().positive(),
  factoryIncome: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  mineIncome: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  upkeepBase: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  reason: z.string().trim().min(3).max(200),
});

export const adminInventoryDeltaSchema = z.object({
  nationId: z.coerce.number().int().positive(),
  templateId: z.coerce.number().int().positive(),
  delta: z.coerce.number().int().refine((v) => v !== 0, 'مقدار تغییر نمی‌تواند صفر باشد'),
  reason: z.string().trim().min(3).max(200),
});

export const categorySchema = z.object({
  key: z.string().trim().min(1).max(40).regex(/^[a-z0-9_]+$/i),
  labelFa: z.string().trim().min(1).max(40),
  shopLabelFa: z.string().trim().min(1).max(60),
  emoji: z.string().trim().min(1).max(8),
  role: z.enum(['offense', 'defense', 'economy', 'support']),
  sortOrder: z.coerce.number().int().min(0).optional().default(999),
  isActive: z.coerce.boolean().optional().default(true),
});

export const battleParamsSchema = z.object({
  warRandomness: z.coerce.number().min(0).max(0.5),
  damagePerRound: z.coerce.number().min(0.01).max(0.5),
  maxRounds: z.coerce.number().int().min(1).max(50),
  attackerAdvantage: z.coerce.number().min(0.5).max(2),
  defenderAdvantage: z.coerce.number().min(0.5).max(2),
  manpowerFactor: z.coerce.number().min(0).max(5),
  radarSupportBonus: z.coerce.number().min(0).max(1),
  allianceSupportRatio: z.coerce.number().min(0).max(1),
  indemnityPerPoint: z.coerce.number().min(0).max(100000),
  warEntryTaxRate: z.coerce.number().min(0).max(0.5),
  minWarDurationSeconds: z.coerce.number().int().min(0).max(86400),
  warCooldownSeconds: z.coerce.number().int().min(0).max(604800),
  maxActiveWarsPerNation: z.coerce.number().int().min(0).max(20),
  maxAttackersPerTarget: z.coerce.number().int().min(0).max(20),
  peaceCooldownSeconds: z.coerce.number().int().min(0).max(604800),
});

export const economyRulesSchema = z.object({
  incomeCycleSeconds: z.coerce.number().int().min(60).max(30 * 86400),
  factoryIncomePerUnit: z.coerce.number().min(0).max(1_000_000),
  mineIncomePerUnit: z.coerce.number().min(0).max(1_000_000),
  taxRate: z.coerce.number().min(0).max(0.9),
  maintenanceRate: z.coerce.number().min(0).max(0.9),
  maintenancePerUnit: z.record(z.coerce.number().min(0).max(100000)),
  maxCatchupCycles: z.coerce.number().int().min(1).max(720),
  minTreasury: z.coerce.number().int().min(0),
  negativeBalanceAllowed: z.coerce.boolean(),
  globalMultiplier: z.coerce.number().min(0.1).max(10),
});

export const profileRulesSchema = z.object({
  renameCooldownSeconds: z.coerce.number().int().min(0).max(365 * 86400),
  leaderRenameCooldownSeconds: z.coerce.number().int().min(0).max(365 * 86400),
  flagChangeCooldownSeconds: z.coerce.number().int().min(0).max(365 * 86400),
  maxNationsPerUser: z.coerce.number().int().min(1).max(50),
});

export const diplomacyRulesSchema = z.object({
  maxPendingRequestsPerNation: z.coerce.number().int().min(1).max(500),
  maxFriends: z.coerce.number().int().min(1).max(500),
  maxAllianceMembers: z.coerce.number().int().min(2).max(100),
  requestExpirySeconds: z.coerce.number().int().min(300).max(90 * 86400),
  allowNeutralAttacks: z.coerce.boolean(),
});

export const featureFlagsSchema = z.object({
  warEnabled: z.boolean(),
  shopEnabled: z.boolean(),
  diplomacyEnabled: z.boolean(),
  statementsEnabled: z.boolean(),
  statementsRequireApproval: z.boolean(),
  attacksRequireVictimApproval: z.boolean(),
  miniAppEnabled: z.boolean(),
});

export const brandingSchema = z.object({
  gameName: z.string().trim().min(1).max(40),
  welcomeTitle: z.string().trim().min(1).max(120),
  welcomeText: z.string().trim().min(1).max(1500),
  nationNamePrompt: z.string().trim().min(1).max(500),
  leaderNamePrompt: z.string().trim().min(1).max(500),
  flagPrompt: z.string().trim().min(1).max(500),
  statementPrompt: z.string().trim().min(1).max(1000),
});

export const quotaGuardSchema = z.object({
  d1RowsDailySoftLimit: z.coerce.number().int().min(1000),
  cronFailuresBeforePause: z.coerce.number().int().min(1).max(100),
  warnAtPercent: z.coerce.number().min(1).max(100),
});

export const starterTemplateSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  name: z.string().trim().min(2).max(40),
  treasury: z.coerce.number().int().min(0).max(1_000_000_000),
  factoryIncome: z.coerce.number().int().min(0).max(1_000_000_000),
  mineIncome: z.coerce.number().int().min(0).max(1_000_000_000),
  incomeCycleSeconds: z.coerce.number().int().min(60).max(30 * 86400),
  setAsDefault: z.coerce.boolean().optional().default(false),
  items: z
    .array(
      z.object({
        templateId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().min(0),
      }),
    )
    .optional()
    .default([]),
});

export const nationUpdateSchema = z.object({
  name: nationNameSchema.optional(),
  leaderName: leaderNameSchema.optional(),
  flag: flagSchema.optional(),
});

export const telegramIdSchema = z.coerce.number().int().positive();

export const statementCreateSchema = z.object({ text: statementTextSchema });

export const apiErrorCodes = [
  'unauthorized',
  'forbidden',
  'not_found',
  'validation_error',
  'conflict',
  'insufficient_funds',
  'rate_limited',
  'feature_disabled',
  'quota_exceeded',
  'duplicate_request',
  'internal_error',
] as const;
export type ApiErrorCode = (typeof apiErrorCodes)[number];

export function formatZodError(err: z.ZodError): { code: 'validation_error'; message: string; fields: Record<string, string> } {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || '_';
    if (!fields[key]) fields[key] = issue.message;
  }
  const first = err.issues[0];
  return { code: 'validation_error', message: first ? first.message : 'داده‌های ارسالی نامعتبر است', fields };
}
