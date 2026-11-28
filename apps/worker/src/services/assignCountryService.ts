import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds } from '../core/format';
import type { SettingsBundle } from '../core/settings';
import { createNation } from './nationService';
import { loadNationOwnedBy } from '../db/queries';
import { audit } from './auditService';
import { refreshNationStats } from '../db/queries';

export interface AssignCountryInput {
  telegramId: number;
  countryName: string;
}

export interface AssignCountryResult {
  nationId: number;
  nationName: string;
  created: boolean;
  user: { id: number; telegramId: number; firstName: string | null; username: string | null };
}

/**
 * «تعیین کشور بازیکن» (فقط ادمین):
 * اگر بازیکن کشور دارد → نام همان کشور به‌روزرسانی می‌شود.
 * اگر کشور ندارد → با همان نام یک کشور تازه برای او ساخته می‌شود (بستهٔ اولیه اعطا می‌گردد).
 * در هر دو حالت، بازیکن دیگر هیچ‌جا کشورش را دستی تایپ نمی‌کند.
 */
export async function determineCountry(
  db: Db,
  actor: { userId: number; telegramId: number; role: string },
  input: AssignCountryInput,
  settings: SettingsBundle,
  now = nowSeconds(),
): Promise<AssignCountryResult> {
  const telegramId = Math.floor(Number(input.telegramId));
  if (!Number.isFinite(telegramId) || telegramId <= 0) throw ApiError.validation('آیدی عددی نامعتبر است.');
  const countryName = String(input.countryName ?? '').trim();
  if (countryName.length < 3) throw ApiError.validation('نام کشور باید دست‌کم ۳ نویسه باشد.');
  if (countryName.length > 30) throw ApiError.validation('نام کشور حداکثر ۳۰ نویسه می‌تواند باشد.');

  const user = await db.first<{ id: number; telegram_user_id: number; first_name: string | null; username: string | null }>(
    sql`SELECT id, telegram_user_id, first_name, username FROM users WHERE telegram_user_id = ${telegramId}`,
  );
  if (!user) throw ApiError.notFound('بازیکنی با این آیدی یافت نشد.');

  const owned = await loadNationOwnedBy(db, user.id);
  const dup = await db.first<{ id: number; owner_user_id: number }>(
    sql`SELECT id, owner_user_id FROM nations WHERE name = ${countryName} COLLATE NOCASE`,
  );
  if (dup && (!owned || Number(dup.id) !== Number(owned.id))) {
    throw ApiError.conflict('این نام کشور قبلاً ثبت شده است.');
  }

  let nationId: number;
  let created = false;
  if (owned) {
    if (owned.name !== countryName) {
      await db.run(sql`UPDATE nations SET name = ${countryName}, updated_at = ${now} WHERE id = ${owned.id}`);
      // کش‌های مشتق‌شده (رتبه‌بندی/قدرت) باید نام جدید را بلافاصله ببینند
      await refreshNationStats(db, { ...owned, name: countryName }, settings).catch(() => undefined);
    }
    nationId = owned.id;
  } else {
    const result = await createNation(
      db,
      { userId: user.id, telegramId: Number(user.telegram_user_id) },
      { name: countryName, leaderName: (user.first_name ?? '').trim() || 'فرمانده', flag: '🏳️' },
      settings,
    );
    nationId = result.nationId;
    created = true;
  }

  await audit(db, {
    actor,
    action: 'admin.assign_country',
    targetType: 'nation',
    targetId: nationId,
    before: { telegramId, previousName: owned?.name ?? null },
    after: { telegramId, name: countryName, created },
    reason: `تعیین کشور بازیکن توسط ادمین: ${countryName}`,
  });

  return {
    nationId,
    nationName: countryName,
    created,
    user: { id: Number(user.id), telegramId, firstName: user.first_name, username: user.username },
  };
}
