-- 0005: آرایش دفاعی کشور + جایزه شانسی روزانه
-- defense_plan: NULL => everybody defends (legacy behavior); JSON array of arrangement keys => committed defense subset
ALTER TABLE nation_settings ADD COLUMN defense_plan TEXT;

-- one prize claim per nation per UTC day (idempotent by construction)
CREATE TABLE IF NOT EXISTS daily_prize_claims (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id  INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  day        TEXT    NOT NULL,          -- YYYY-MM-DD (UTC)
  prize_key  TEXT    NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (nation_id, day)
);
CREATE INDEX IF NOT EXISTS ix_daily_prize_claims_day ON daily_prize_claims (day);
