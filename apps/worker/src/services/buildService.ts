import { BUILDINGS, BUILDING_MAX_LEVEL, BUILDING_UPGRADE_COST_FACTOR, MAX_CONCURRENT_PROJECTS, type BuildingKey } from '@ww/shared';
import type { Db } from '../core/db';
import { sql } from '../core/sql';
import { ApiError } from '../core/errors';
import { nowSeconds, toIso, humanDuration } from '../core/format';
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
  level: number;
  /** هزینه و زمان لازم برای عملیات بعدی (ساخت اگر ساخته نشده، ارتقا اگر ساخته شده) */
  nextAction: 'build' | 'upgrade' | 'max';
  nextCost: number;
  nextDurationSeconds: number;
  upgradeCost: number;
  grant: { kind: string; quantity: number; templateCode?: string };
  capacityNow: number | null;
  capacityAfter: number | null;
  /** پروژۀ باز برای همین ساختمان (اگر در حال ساخت/ارتقاست) */
  activeProjectId: string | null;
}

export interface BuildProjectView {
  id: string;
  buildingKey: string;
  emoji: string;
  nameFa: string;
  kind: 'build' | 'upgrade';
  targetLevel: number;
  cost: number;
  startedAt: string;
  completesAt: string;
  progressPercent: number;
  remainingSeconds: number;
  remainingFa: string;
  descFa: string;
}

/** سرعت‌گیر پروژه‌های ساخت برای محیط توسعه/تست — BUILD_SPEED=0 پروژه را آنی تکمیل می‌کند (پیش‌فرض ۱×) */
export function buildSpeed(env: { BUILD_SPEED?: string | undefined } | null | undefined): number {
  const raw = Number(env?.BUILD_SPEED ?? '1');
  if (!Number.isFinite(raw) || raw < 0) return 1;
  return Math.min(raw, 100);
}

const BUILDING_BY_KEY = new Map(BUILDINGS.map((b) => [b.key, b] as const));

/** پادگان ظرفیت نیرو را بالا می‌برد؛ پایهٔ ظرفیت ۲ است و هر سطح +۱ */
function barracksCapacity(level: number) {
  return 2 + level;
}

function upgradeCost(baseCost: number, currentLevel: number): number {
  return Math.max(1, Math.ceil(baseCost * BUILDING_UPGRADE_COST_FACTOR * currentLevel));
}

function projectHash(nationId: number, key: string, kind: string, level: number): string {
  return `build:${nationId}:${key}:${kind}:${level}`;
}

/** پروژه‌های سررسیده را می‌بندد و اثرشان را اعمال می‌کند؛ هر مسیر خواندن/نوشتن ساخت‌وساز از اینجا رد می‌شود */
export async function sweepBuildProjects(db: Db, nationId: number, now = nowSeconds()): Promise<number> {
  const due = await db.all<{
    id: string;
    building_key: string;
    kind: 'build' | 'upgrade';
    level: number;
    cost: number;
  }>(
    sql`SELECT id, building_key, kind, level, cost FROM nation_build_projects
         WHERE nation_id = ${nationId} AND completes_at <= ${now}
         ORDER BY completes_at ASC`,
  );
  for (const project of due) {
    const building = BUILDING_BY_KEY.get(project.building_key as BuildingKey);
    if (!building) {
      // unknown building in a project: remove the project so it can't wedge the pipeline, but never grant effects for it
      await db.run(sql`DELETE FROM nation_build_projects WHERE id = ${project.id}`);
      continue;
    }
    const at = now;
    const statements = [
      sql`INSERT INTO nation_buildings (nation_id, building_key, built_at, level)
           VALUES (${nationId}, ${building.key}, ${at}, ${project.level})
           ON CONFLICT (nation_id, building_key) DO UPDATE SET level = ${project.level}`,
      sql`DELETE FROM nation_build_projects WHERE id = ${project.id}`,
    ];
    if (building.grant.kind === 'units') {
      const template = await db.first<{ id: number }>(
        sql`SELECT id FROM equipment_templates WHERE code = ${building.grant.templateCode}`,
      );
      if (template?.id) {
        statements.push(
          sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
               VALUES (${nationId}, ${template.id}, ${building.grant.quantity}, ${at}, ${at})
               ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${building.grant.quantity}, updated_at = ${at}`,
        );
      }
    } else if (building.grant.kind === 'fortification') {
      statements.push(
        sql`UPDATE nation_settings SET fortification_level = MIN(20, COALESCE(fortification_level, 0) + ${building.grant.quantity}), updated_at = ${at} WHERE nation_id = ${nationId}`,
      );
    }
    await db.batch(statements);
    await audit(db, {
      actor: null,
      action: project.kind === 'build' ? 'build.complete' : 'build.upgrade_complete',
      targetType: 'nation',
      targetId: nationId,
      before: null,
      after: { building: building.key, level: project.level, cost: project.cost },
      reason: project.kind === 'build' ? `ساخت ${building.nameFa}` : `ارتقای ${building.nameFa} به سطح ${project.level}`,
    });
    await notify(db, {
      nationId,
      kind: 'build',
      title: project.kind === 'build' ? '🏗️ سازه ساخته شد' : '⏫ ارتقای سازه کامل شد',
      body:
        project.kind === 'build'
          ? `${building.emoji} ${building.nameFa} تکمیل شد (سطح ${project.level}).`
          : `${building.emoji} ${building.nameFa} به سطح ${project.level} ارتقا یافت.`,
    });
  }
  return due.length;
}

async function activeProjects(db: Db, nationId: number) {
  return db.all<{
    id: string;
    building_key: string;
    kind: 'build' | 'upgrade';
    level: number;
    cost: number;
    started_at: number;
    completes_at: number;
  }>(
    sql`SELECT id, building_key, kind, level, cost, started_at, completes_at
          FROM nation_build_projects WHERE nation_id = ${nationId} ORDER BY completes_at ASC`,
  );
}

export async function buildState(db: Db, nation: NationRow, now = nowSeconds()) {
  await sweepBuildProjects(db, nation.id, now);
  const [rows, projects] = await Promise.all([
    db.all<{ building_key: string; built_at: number; level: number }>(
      sql`SELECT building_key, built_at, COALESCE(level, 1) AS level FROM nation_buildings WHERE nation_id = ${nation.id}`,
    ),
    activeProjects(db, nation.id),
  ]);
  const built = new Map(rows.map((r) => [String(r.building_key), { builtAt: Number(r.built_at), level: Number(r.level) || 1 }]));
  const projectByKey = new Map(projects.map((p) => [p.building_key, p]));

  const buildings: BuildingView[] = BUILDINGS.map((b) => {
    const row = built.get(b.key);
    const level = row?.level ?? 0;
    const isBuilt = Boolean(row);
    const atMax = isBuilt && level >= BUILDING_MAX_LEVEL;
    const nextAction: BuildingView['nextAction'] = !isBuilt ? 'build' : atMax ? 'max' : 'upgrade';
    const nextCost = !isBuilt ? b.cost : atMax ? 0 : upgradeCost(b.cost, level);
    const nextDurationSeconds = b.durationSeconds * (!isBuilt ? 1 : 0.5 + level * 0.5);
    const proj = projectByKey.get(b.key);
    return {
      key: b.key,
      emoji: b.emoji,
      nameFa: b.nameFa,
      descFa: b.descFa,
      cost: b.cost,
      built: isBuilt,
      builtAt: row ? toIso(row.builtAt) : null,
      level,
      nextAction,
      nextCost,
      nextDurationSeconds: Math.round(nextDurationSeconds),
      upgradeCost: isBuilt && !atMax ? upgradeCost(b.cost, level) : 0,
      grant: b.grant.kind === 'units'
        ? { kind: 'units', quantity: b.grant.quantity, templateCode: b.grant.templateCode }
        : { kind: 'fortification', quantity: b.grant.quantity },
      capacityNow: b.key === 'barracks' ? barracksCapacity(level) : null,
      capacityAfter: b.key === 'barracks' ? barracksCapacity(level + 1) : null,
      activeProjectId: proj?.id ?? null,
    };
  });

  const projectViews: BuildProjectView[] = projects.map((p) => {
    const b = BUILDING_BY_KEY.get(p.building_key as BuildingKey);
    const total = Math.max(1, p.completes_at - p.started_at);
    const progress = Math.min(100, Math.max(0, Math.floor(((now - p.started_at) / total) * 100)));
    const remaining = Math.max(0, p.completes_at - now);
    return {
      id: p.id,
      buildingKey: p.building_key,
      emoji: b?.emoji ?? '🏗️',
      nameFa: b?.nameFa ?? p.building_key,
      kind: p.kind,
      targetLevel: Number(p.level),
      cost: Number(p.cost),
      startedAt: toIso(p.started_at)!,
      completesAt: toIso(p.completes_at)!,
      progressPercent: progress,
      remainingSeconds: remaining,
      remainingFa: humanDuration(remaining),
      descFa: b?.descFa ?? '',
    };
  });

  return {
    treasury: nation.treasury,
    buildings,
    builtCount: buildings.filter((b) => b.built).length,
    totalCount: buildings.length,
    projects: projectViews,
    maxConcurrent: MAX_CONCURRENT_PROJECTS,
    activeProjectCount: projectViews.length,
    maxLevel: BUILDING_MAX_LEVEL,
  };
}

export interface ConstructResult {
  building: { key: string; nameFa: string; emoji: string };
  kind: 'build' | 'upgrade';
  level: number;
  cost: number;
  treasury: number;
  projectId: string;
  completesAt: string;
  durationSeconds: number;
  /** true وقتی BUILD_SPEED=0 یا زمان‌بندی صفر — پروژه در همان درخواست تکمیل شد */
  completed: boolean;
}

/**
 * یک پروژهٔ ساخت/ارتقا باز می‌کند. پرداخت به‌صورت اتمیک با ثبت پروژه انجام می‌شود
 * و اثر (اعطای تجهیزات / استحکامات / سطح) هنگام تکمیل پروژه اعمال می‌گردد.
 */
export async function construct(
  db: Db,
  nation: NationRow,
  key: string,
  now = nowSeconds(),
  speed = 1,
): Promise<ConstructResult> {
  const building = BUILDING_BY_KEY.get(key as BuildingKey);
  if (!building) throw ApiError.validation('سازهٔ انتخاب‌شده معتبر نیست.');

  await sweepBuildProjects(db, nation.id, now);

  const existing = await db.first<{ level: number }>(
    sql`SELECT COALESCE(level, 1) AS level FROM nation_buildings WHERE nation_id = ${nation.id} AND building_key = ${building.key}`,
  );
  const active = await db.all<{ id: string }>(
    sql`SELECT id FROM nation_build_projects WHERE nation_id = ${nation.id}`,
  );
  const kind: 'build' | 'upgrade' = existing ? 'upgrade' : 'build';
  const currentLevel = Number(existing?.level ?? 0);
  if (kind === 'upgrade' && currentLevel >= BUILDING_MAX_LEVEL) {
    throw ApiError.conflict('این سازه به حداکثر سطح ممکن رسیده است.');
  }
  const sameBuildingActive = await db.first<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM nation_build_projects WHERE nation_id = ${nation.id} AND building_key = ${building.key}`,
  );
  if (Number(sameBuildingActive?.c ?? 0) > 0) {
    throw ApiError.conflict('برای این سازه همین حالا پروژه‌ای در حال انجام است.');
  }
  if (active.length >= MAX_CONCURRENT_PROJECTS) {
    throw ApiError.conflict(`حداکثر ${MAX_CONCURRENT_PROJECTS} پروژهٔ هم‌زمان می‌توانید داشته باشید؛ صبر کنید تا یکی تکمیل شود.`);
  }

  const targetLevel = kind === 'build' ? 1 : currentLevel + 1;
  const cost = kind === 'build' ? building.cost : upgradeCost(building.cost, currentLevel);
  if (nation.treasury < cost) throw ApiError.validation('موجودی ناکافی است.');

  const durationSeconds = Math.max(0, Math.round(building.durationSeconds * speed * (kind === 'build' ? 1 : 0.5 + currentLevel * 0.5)));
  const projectId = uuid();
  const completesAt = now + durationSeconds;

  const statements = [
    sql`INSERT INTO nation_build_projects (id, nation_id, building_key, kind, level, cost, started_at, completes_at)
         VALUES (${projectId}, ${nation.id}, ${building.key}, ${kind}, ${targetLevel}, ${cost}, ${now}, ${completesAt})`,
    sql`UPDATE nations SET treasury = treasury - ${cost}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                  idempotency_key, reference_type, reference_id, reason, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, 'purchase', ${-cost}, ${nation.treasury}, ${nation.treasury - cost}, 'coin',
                 ${projectHash(nation.id, building.key, kind, targetLevel)}, 'building', NULL,
                 ${kind === 'build' ? `🏗️ ساخت‌وساز: ${building.nameFa}` : `⏫ ارتقای سازه: ${building.nameFa} → سطح ${targetLevel}`},
                 ${JSON.stringify({ buildingKey: building.key, kind, targetLevel, durationSeconds })}, ${now})`,
    sql`UPDATE nation_economy SET total_spent = total_spent + ${cost}, updated_at = ${now} WHERE nation_id = ${nation.id}`,
  ];
  try {
    await db.batch(statements);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('check constraint')) {
      throw ApiError.validation('موجودی ناکافی است.');
    }
    throw err;
  }

  // با سرعت‌گیر زادهٔ تست (BUILD_SPEED=0) پروژه همین‌جا تکمیل می‌شود — یک مسیر کد برای هر دو حالت
  if (durationSeconds === 0) {
    await sweepBuildProjects(db, nation.id, now);
  }

  if (durationSeconds > 0) {
    await audit(db, {
      actor: null,
      action: 'build.project_started',
      targetType: 'nation',
      targetId: nation.id,
      before: { treasury: nation.treasury },
      after: { treasury: nation.treasury - cost, building: building.key, kind, targetLevel, durationSeconds },
      reason: kind === 'build' ? `شروع ساخت ${building.nameFa}` : `شروع ارتقای ${building.nameFa}`,
    });
    await notify(db, {
      nationId: nation.id,
      kind: 'build',
      title: kind === 'build' ? '🏗️ پروژه ساخت آغاز شد' : '⏫ ارتقای سازه آغاز شد',
      body: `${building.emoji} ${building.nameFa} — آماده‌سازی ${humanDuration(durationSeconds)} دیگر. هزینه ${cost.toLocaleString('en-US')} سکه از خزانه کسر شد.`,
    });
  }

  const after = await db.first<{ treasury: number }>(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  return {
    building: { key: building.key, nameFa: building.nameFa, emoji: building.emoji },
    kind,
    level: targetLevel,
    cost,
    treasury: Number(after?.treasury ?? nation.treasury - cost),
    projectId,
    completesAt: toIso(completesAt)!,
    durationSeconds,
    completed: durationSeconds === 0,
  };
}
