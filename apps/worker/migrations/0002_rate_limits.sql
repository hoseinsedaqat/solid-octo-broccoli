-- Durable rate limiting: survives isolate restarts and works across isolates,
-- unlike an in-memory counter. Only expensive/mutating actions are tracked, so
-- the table stays tiny and cheap (housekeeping job prunes rows older than 1 day).
CREATE TABLE IF NOT EXISTS rate_limits (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  bucket    TEXT    NOT NULL,
  window_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_rate_limits_bucket ON rate_limits (bucket, window_at DESC);
