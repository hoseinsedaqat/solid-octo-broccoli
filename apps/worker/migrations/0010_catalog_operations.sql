-- 0010: بازار کامل نظامی/صنعتی + زیرساخت عملیات کشور (پروژه‌های ساخت، سفارش‌های تولید، انبار یگان، ارتش، امنیت، جمعیت)
-- همهٔ قیمت‌ها به سکه است. آیتم‌های قدیمیِ خودمانی (هلیکوپترها بدون قیمت) از فروشگاه پنهان می‌شوند.
ALTER TABLE equipment_templates ADD COLUMN income_per_cycle INTEGER;
ALTER TABLE nation_buildings ADD COLUMN level INTEGER NOT NULL DEFAULT 1;
ALTER TABLE nation_economy ADD COLUMN starter_factory_template_income INTEGER NOT NULL DEFAULT 0;
ALTER TABLE nation_economy ADD COLUMN starter_mine_template_income INTEGER NOT NULL DEFAULT 0;
ALTER TABLE nation_economy ADD COLUMN starter_flat_factories INTEGER;
ALTER TABLE nation_economy ADD COLUMN starter_flat_mines INTEGER;

CREATE TABLE IF NOT EXISTS nation_build_projects (
  id TEXT PRIMARY KEY,
  nation_id INTEGER NOT NULL REFERENCES nations(id) ON DELETE CASCADE,
  building_key TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('build','upgrade')),
  level INTEGER NOT NULL DEFAULT 1,
  cost INTEGER NOT NULL CHECK (cost >= 0),
  started_at INTEGER NOT NULL,
  completes_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_build_projects_nation ON nation_build_projects(nation_id, completes_at);

CREATE TABLE IF NOT EXISTS nation_production_orders (
  id TEXT PRIMARY KEY,
  nation_id INTEGER NOT NULL REFERENCES nations(id) ON DELETE CASCADE,
  product_key TEXT NOT NULL,
  template_id INTEGER NOT NULL REFERENCES equipment_templates(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost INTEGER NOT NULL CHECK (unit_cost >= 0),
  total_cost INTEGER NOT NULL CHECK (total_cost >= 0),
  started_at INTEGER NOT NULL,
  completes_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','ready','claimed')),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_prod_orders_nation ON nation_production_orders(nation_id, status);

CREATE TABLE IF NOT EXISTS nation_factory_levels (
  nation_id INTEGER NOT NULL REFERENCES nations(id) ON DELETE CASCADE,
  template_id INTEGER NOT NULL REFERENCES equipment_templates(id),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  PRIMARY KEY (nation_id, template_id)
);

CREATE TABLE IF NOT EXISTS nation_deployed (
  nation_id INTEGER NOT NULL REFERENCES nations(id) ON DELETE CASCADE,
  template_id INTEGER NOT NULL REFERENCES equipment_templates(id),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  PRIMARY KEY (nation_id, template_id)
);

CREATE TABLE IF NOT EXISTS nation_state_ext (
  nation_id INTEGER PRIMARY KEY REFERENCES nations(id) ON DELETE CASCADE,
  police INTEGER NOT NULL DEFAULT 0,
  border_level INTEGER NOT NULL DEFAULT 1,
  infra_level INTEGER NOT NULL DEFAULT 1,
  education_level INTEGER NOT NULL DEFAULT 1,
  housing_level INTEGER NOT NULL DEFAULT 1,
  hospital_level INTEGER NOT NULL DEFAULT 1,
  fuel_level REAL NOT NULL DEFAULT 80,
  ammo_level REAL NOT NULL DEFAULT 75,
  equipment_health REAL NOT NULL DEFAULT 85,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS nation_protected_assets (
  nation_id INTEGER NOT NULL REFERENCES nations(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('factory','mine','building')),
  asset_ref TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  cost INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  PRIMARY KEY (nation_id, asset_type, asset_ref)
);
