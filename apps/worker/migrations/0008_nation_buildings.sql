-- 0008: ساخت‌وساز — یکیٔ هر سازه در هر کشور (یک‌بار ساخته می‌شود)
CREATE TABLE IF NOT EXISTS nation_buildings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id   INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  building_key TEXT   NOT NULL,
  built_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (nation_id, building_key)
);
CREATE INDEX IF NOT EXISTS ix_nation_buildings_nation ON nation_buildings (nation_id);
