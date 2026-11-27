-- World War — initial schema (Cloudflare D1 / SQLite)
-- All timestamps are INTEGER unix-epoch seconds (portable, cheap to compare in cron math).
-- Money is INTEGER coins. Prices may be NULL => "not configured by the admin" => not purchasable.
-- NOTE: no "PRAGMA foreign_keys" here on purpose - D1 enables FK enforcement by default
-- (verified against a real D1 instance: inserting a dangling FK fails with SQLITE_CONSTRAINT),
-- and the PRAGMA itself is not executable through D1 queries.

-- ---------------------------------------------------------------- 1. users
CREATE TABLE IF NOT EXISTS users (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_user_id   INTEGER NOT NULL UNIQUE,
  username           TEXT,
  first_name         TEXT,
  last_name          TEXT,
  language_code      TEXT NOT NULL DEFAULT 'fa',
  role               TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player','admin','super_admin')),
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','blocked','disabled')),
  is_primary_admin   INTEGER NOT NULL DEFAULT 0 CHECK (is_primary_admin IN (0,1)),
  tos_accepted_at    INTEGER,
  last_seen_at       INTEGER,
  seen_count         INTEGER NOT NULL DEFAULT 0,
  created_at         INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at         INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_users_role_status ON users (role, status);
CREATE INDEX IF NOT EXISTS ix_users_username ON users (username COLLATE NOCASE);

-- ---------------------------------------------------------------- 2. nations
CREATE TABLE IF NOT EXISTS nations (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_user_id         INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name                  TEXT    NOT NULL,
  flag                  TEXT    NOT NULL,
  leader_name           TEXT    NOT NULL,
  status                TEXT    NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','frozen','banned','at_war','dissolved')),
  treasury              INTEGER NOT NULL DEFAULT 0 CHECK (treasury >= 0),
  military_power        REAL    NOT NULL DEFAULT 0,
  economic_score        REAL    NOT NULL DEFAULT 0,
  total_score           REAL    NOT NULL DEFAULT 0,
  world_rank            INTEGER NOT NULL DEFAULT 0,
  allies_count          INTEGER NOT NULL DEFAULT 0,
  enemies_count         INTEGER NOT NULL DEFAULT 0,
  wars_count            INTEGER NOT NULL DEFAULT 0,
  wins_count            INTEGER NOT NULL DEFAULT 0,
  losses_count          INTEGER NOT NULL DEFAULT 0,
  equipment_count       INTEGER NOT NULL DEFAULT 0,
  troops_count          INTEGER NOT NULL DEFAULT 0,
  income_anchor_at      INTEGER NOT NULL,
  last_income_cycle     INTEGER NOT NULL DEFAULT -1,
  last_income_at        INTEGER,
  last_rename_at        INTEGER,
  last_leader_rename_at INTEGER,
  last_flag_change_at   INTEGER,
  starter_template_id   INTEGER,
  created_at            INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at            INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (name COLLATE NOCASE)
);
CREATE INDEX IF NOT EXISTS ix_nations_owner ON nations (owner_user_id);
CREATE INDEX IF NOT EXISTS ix_nations_rank ON nations (world_rank);
CREATE INDEX IF NOT EXISTS ix_nations_score ON nations (total_score DESC);
CREATE INDEX IF NOT EXISTS ix_nations_status ON nations (status);

-- ---------------------------------------------------------------- 3. nation_settings
CREATE TABLE IF NOT EXISTS nation_settings (
  nation_id             INTEGER PRIMARY KEY REFERENCES nations (id) ON DELETE CASCADE,
  income_cycle_seconds  INTEGER,                       -- per-nation override, NULL => global
  tax_rate_override     REAL,
  defense_mode          TEXT NOT NULL DEFAULT 'standard'
                        CHECK (defense_mode IN ('standard','alert','fortified')),
  fortification_level   INTEGER NOT NULL DEFAULT 0 CHECK (fortification_level BETWEEN 0 AND 20),
  notify_enabled        INTEGER NOT NULL DEFAULT 1 CHECK (notify_enabled IN (0,1)),
  statement_auto_publish INTEGER NOT NULL DEFAULT 0 CHECK (statement_auto_publish IN (0,1)),
  war_consent_mode      TEXT NOT NULL DEFAULT 'require' CHECK (war_consent_mode IN ('require','auto')),
  notes                 TEXT,
  updated_at            INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- ---------------------------------------------------------------- 4. equipment_categories
CREATE TABLE IF NOT EXISTS equipment_categories (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  key          TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  label_fa     TEXT    NOT NULL,
  shop_label_fa TEXT   NOT NULL,
  emoji        TEXT    NOT NULL,
  role         TEXT    NOT NULL CHECK (role IN ('offense','defense','economy','support')),
  power_weight REAL    NOT NULL DEFAULT 0,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- ---------------------------------------------------------------- 5. equipment_templates
-- NOTE: name uniqueness is per category on purpose: F-22 / F-35 exist both in
-- "پدافند هوایی" and "جنگنده‌ها" as two independent rows (game design doc).
CREATE TABLE IF NOT EXISTS equipment_templates (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id            INTEGER NOT NULL REFERENCES equipment_categories (id) ON DELETE RESTRICT,
  code                   TEXT    NOT NULL,
  name_fa                TEXT    NOT NULL,
  unit_fa                TEXT    NOT NULL,
  price                  INTEGER,          -- NULL => price not set by admin => purchase disabled
  attack_points          REAL,           -- NULL => falls back to category power_weight
  defense_points         REAL,
  description            TEXT    NOT NULL DEFAULT '',
  is_active              INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  is_for_sale            INTEGER NOT NULL DEFAULT 1 CHECK (is_for_sale IN (0,1)),
  purchase_limit_per_cycle INTEGER,
  maintenance_per_unit   INTEGER,
  created_at             INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at             INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (category_id, code),
  CHECK (price IS NULL OR (price > 0 AND price <= 1000000000000))
);
CREATE INDEX IF NOT EXISTS ix_tpl_category ON equipment_templates (category_id, is_active);
CREATE INDEX IF NOT EXISTS ix_tpl_for_sale ON equipment_templates (is_for_sale, price);
CREATE INDEX IF NOT EXISTS ix_tpl_name ON equipment_templates (name_fa COLLATE NOCASE);

-- ---------------------------------------------------------------- 6. nation_inventory
CREATE TABLE IF NOT EXISTS nation_inventory (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id   INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  template_id INTEGER NOT NULL REFERENCES equipment_templates (id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at  INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (nation_id, template_id)
);
CREATE INDEX IF NOT EXISTS ix_inv_nation ON nation_inventory (nation_id);
CREATE INDEX IF NOT EXISTS ix_inv_template ON nation_inventory (template_id);

-- ---------------------------------------------------------------- 7. nation_economy
CREATE TABLE IF NOT EXISTS nation_economy (
  nation_id            INTEGER PRIMARY KEY REFERENCES nations (id) ON DELETE CASCADE,
  factory_income       INTEGER NOT NULL DEFAULT 0 CHECK (factory_income >= 0),
  mine_income          INTEGER NOT NULL DEFAULT 0 CHECK (mine_income >= 0),
  starter_factory_count INTEGER NOT NULL DEFAULT 0,
  starter_mine_count   INTEGER NOT NULL DEFAULT 0,
  upkeep_base          INTEGER NOT NULL DEFAULT 0 CHECK (upkeep_base >= 0),
  gross_income         INTEGER NOT NULL DEFAULT 0,
  maintenance_cost     INTEGER NOT NULL DEFAULT 0,
  tax_cost             INTEGER NOT NULL DEFAULT 0,
  net_income           INTEGER NOT NULL DEFAULT 0,
  total_income         INTEGER NOT NULL DEFAULT 0,
  total_spent          INTEGER NOT NULL DEFAULT 0,
  total_tax            INTEGER NOT NULL DEFAULT 0,
  war_loss_total       INTEGER NOT NULL DEFAULT 0,
  updated_at           INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- ---------------------------------------------------------------- 8. economy_settings (key/value, JSON)
CREATE TABLE IF NOT EXISTS economy_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  value_type TEXT NOT NULL DEFAULT 'json',
  description TEXT,
  updated_by INTEGER REFERENCES users (id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- ---------------------------------------------------------------- 9. transactions (append-only)
CREATE TABLE IF NOT EXISTS transactions (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid                 TEXT    NOT NULL UNIQUE,
  nation_id            INTEGER NOT NULL REFERENCES nations (id) ON DELETE RESTRICT,
  type                 TEXT    NOT NULL CHECK (type IN
                          ('starter_grant','revenue','purchase','admin_credit','admin_debit','admin_correction',
                           'war_indemnity','war_cost','tax','maintenance','battle_loss_compensation')),
  amount               INTEGER NOT NULL,
  balance_before       INTEGER,
  balance_after        INTEGER,
  currency             TEXT    NOT NULL DEFAULT 'coin',
  idempotency_key      TEXT    NOT NULL UNIQUE,
  reference_type       TEXT,
  reference_id         INTEGER,
  reason               TEXT,
  counterparty_nation_id INTEGER REFERENCES nations (id) ON DELETE SET NULL,
  created_by_user_id   INTEGER REFERENCES users (id) ON DELETE SET NULL,
  meta                 TEXT,
  created_at           INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_txn_nation_time ON transactions (nation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_txn_type ON transactions (type, created_at DESC);
-- financial records are never deleted
CREATE TRIGGER IF NOT EXISTS trg_txn_immutable
BEFORE DELETE ON transactions
BEGIN
  SELECT RAISE (ABORT, 'transactions are append-only and cannot be deleted');
END;
CREATE TRIGGER IF NOT EXISTS trg_txn_no_update_amount
BEFORE UPDATE OF amount, idempotency_key, nation_id, type ON transactions
BEGIN
  SELECT RAISE (ABORT, 'transactions are append-only and cannot be modified');
END;

-- ---------------------------------------------------------------- 10. transaction_items
CREATE TABLE IF NOT EXISTS transaction_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL REFERENCES transactions (id) ON DELETE CASCADE,
  template_id   INTEGER REFERENCES equipment_templates (id) ON DELETE SET NULL,
  name_snapshot TEXT    NOT NULL,
  category_snapshot TEXT NOT NULL DEFAULT '',
  quantity      INTEGER NOT NULL CHECK (quantity <> 0),
  unit_price    INTEGER,
  total_price   INTEGER,
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_txn_items ON transaction_items (transaction_id);

-- ---------------------------------------------------------------- 11. wars
CREATE TABLE IF NOT EXISTS wars (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  attacker_nation_id   INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  defender_nation_id   INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  status               TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN
                         ('proposed','accepted','active','peace_requested','ended','cancelled','stopped_by_admin')),
  initiated_by         TEXT NOT NULL DEFAULT 'attacker' CHECK (initiated_by IN ('attacker','defender')),
  attacker_power       REAL NOT NULL DEFAULT 0,
  defender_power       REAL NOT NULL DEFAULT 0,
  attacker_win_chance  REAL NOT NULL DEFAULT 0.5,
  rounds_played        INTEGER NOT NULL DEFAULT 0,
  max_rounds           INTEGER NOT NULL DEFAULT 12,
  entry_cost           INTEGER NOT NULL DEFAULT 0,
  indemnity_offered    INTEGER NOT NULL DEFAULT 0,
  indemnity_paid       INTEGER NOT NULL DEFAULT 0,
  winner_nation_id     INTEGER REFERENCES nations (id) ON DELETE SET NULL,
  outcome_summary      TEXT,
  seed                 INTEGER NOT NULL DEFAULT 0,
  proposed_at          INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  accepted_at          INTEGER,
  started_at           INTEGER,
  next_round_at        INTEGER,
  ends_at              INTEGER,
  ended_at             INTEGER,
  peace_requested_at   INTEGER,
  stopped_by_user_id   INTEGER REFERENCES users (id) ON DELETE SET NULL,
  CHECK (attacker_nation_id <> defender_nation_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_wars_active_pair ON wars (attacker_nation_id, defender_nation_id)
  WHERE status IN ('proposed','accepted','active','peace_requested');
CREATE INDEX IF NOT EXISTS ix_wars_defender_status ON wars (defender_nation_id, status);
CREATE INDEX IF NOT EXISTS ix_wars_attacker_status ON wars (attacker_nation_id, status);
CREATE INDEX IF NOT EXISTS ix_wars_due ON wars (status, next_round_at);

-- ---------------------------------------------------------------- 12. battles
CREATE TABLE IF NOT EXISTS battles (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  war_id          INTEGER NOT NULL REFERENCES wars (id) ON DELETE CASCADE,
  round_no        INTEGER NOT NULL,
  attacker_power  REAL NOT NULL DEFAULT 0,
  defender_power  REAL NOT NULL DEFAULT 0,
  attacker_losses REAL NOT NULL DEFAULT 0,
  defender_losses REAL NOT NULL DEFAULT 0,
  winner          TEXT NOT NULL CHECK (winner IN ('attacker','defender','draw')),
  seed            INTEGER NOT NULL DEFAULT 0,
  executed_by     INTEGER REFERENCES users (id) ON DELETE SET NULL,
  created_at      INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (war_id, round_no)
);
CREATE INDEX IF NOT EXISTS ix_battles_war ON battles (war_id, round_no);

-- ---------------------------------------------------------------- 13. battle_reports
CREATE TABLE IF NOT EXISTS battle_reports (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  battle_id           INTEGER NOT NULL REFERENCES battles (id) ON DELETE CASCADE,
  war_id              INTEGER NOT NULL REFERENCES wars (id) ON DELETE CASCADE,
  attacker_nation_id  INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  defender_nation_id  INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  attacker_win_chance REAL NOT NULL DEFAULT 0.5,
  attacker_json       TEXT NOT NULL DEFAULT '{}',
  defender_json       TEXT NOT NULL DEFAULT '{}',
  indemnity           INTEGER NOT NULL DEFAULT 0,
  detail_json         TEXT NOT NULL DEFAULT '{}',
  created_at          INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_reports_war ON battle_reports (war_id, id);
CREATE INDEX IF NOT EXISTS ix_reports_created ON battle_reports (created_at DESC);

-- ---------------------------------------------------------------- 14. diplomatic_relations
CREATE TABLE IF NOT EXISTS diplomatic_relations (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id     INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  other_nation_id INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  status        TEXT NOT NULL CHECK (status IN
                  ('neutral','friend','ally','enemy','negotiating','peace_treaty')),
  note          TEXT,
  alliance_id   INTEGER,
  updated_by    INTEGER REFERENCES users (id) ON DELETE SET NULL,
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (nation_id, other_nation_id),
  CHECK (nation_id <> other_nation_id)
);
CREATE INDEX IF NOT EXISTS ix_rel_other ON diplomatic_relations (other_nation_id, status);

-- ---------------------------------------------------------------- 15. diplomatic_requests
CREATE TABLE IF NOT EXISTS diplomatic_requests (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  kind           TEXT NOT NULL CHECK (kind IN
                   ('friendship','alliance','peace','non_aggression','war','message','dissolve')),
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN
                   ('pending','accepted','rejected','cancelled','expired')),
  from_nation_id INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  to_nation_id   INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  alliance_id    INTEGER,
  alliance_name  TEXT,
  message        TEXT,
  handled_by_user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
  handled_at     INTEGER,
  expires_at     INTEGER,
  created_at     INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  CHECK (from_nation_id <> to_nation_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_requests_pending
  ON diplomatic_requests (kind, from_nation_id, to_nation_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS ix_requests_to ON diplomatic_requests (to_nation_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_requests_expiry ON diplomatic_requests (status, expires_at);

-- ---------------------------------------------------------------- 16. alliances
CREATE TABLE IF NOT EXISTS alliances (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL COLLATE NOCASE,
  motto            TEXT,
  leader_nation_id INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','disbanded')),
  created_by       INTEGER REFERENCES users (id) ON DELETE SET NULL,
  created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  disbanded_at     INTEGER,
  UNIQUE (name COLLATE NOCASE)
);
CREATE TABLE IF NOT EXISTS alliance_members (
  alliance_id INTEGER NOT NULL REFERENCES alliances (id) ON DELETE CASCADE,
  nation_id   INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader','member')),
  joined_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  PRIMARY KEY (alliance_id, nation_id)
);
CREATE INDEX IF NOT EXISTS ix_alliance_members_nation ON alliance_members (nation_id);

-- ---------------------------------------------------------------- 17. statements
CREATE TABLE IF NOT EXISTS statements (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid           TEXT NOT NULL UNIQUE,
  nation_id      INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  leader_snapshot TEXT NOT NULL,
  text           TEXT NOT NULL CHECK (length (text) BETWEEN 10 AND 2000),
  status         TEXT NOT NULL DEFAULT 'published' CHECK (status IN
                   ('draft','pending_review','published','rejected','removed')),
  review_note    TEXT,
  reviewed_by    INTEGER REFERENCES users (id) ON DELETE SET NULL,
  reviewed_at    INTEGER,
  published_at   INTEGER,
  created_via    TEXT NOT NULL DEFAULT 'bot' CHECK (created_via IN ('bot','webapp','admin')),
  created_at     INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at     INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_statements_status ON statements (status, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_statements_nation ON statements (nation_id, created_at DESC);

-- ---------------------------------------------------------------- 18. announcements
CREATE TABLE IF NOT EXISTS announcements (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  kind          TEXT NOT NULL CHECK (kind IN ('news','event','war','statement','admin','alliance')),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  audience      TEXT NOT NULL DEFAULT 'global' CHECK (audience IN ('global','nation')),
  nation_id     INTEGER REFERENCES nations (id) ON DELETE CASCADE,
  target_nation_id INTEGER REFERENCES nations (id) ON DELETE CASCADE,
  statement_id  INTEGER REFERENCES statements (id) ON DELETE SET NULL,
  war_id        INTEGER REFERENCES wars (id) ON DELETE SET NULL,
  is_active     INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  created_by    INTEGER REFERENCES users (id) ON DELETE SET NULL,
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_announcements_feed ON announcements (is_active, audience, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_announcements_target ON announcements (target_nation_id, created_at DESC);

-- ---------------------------------------------------------------- 19. game_settings (key/value JSON)
CREATE TABLE IF NOT EXISTS game_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  value_type TEXT NOT NULL DEFAULT 'json',
  description TEXT,
  updated_by INTEGER REFERENCES users (id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- ---------------------------------------------------------------- 20. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  user_id   INTEGER REFERENCES users (id) ON DELETE CASCADE,
  kind      TEXT NOT NULL,
  title     TEXT NOT NULL,
  body      TEXT NOT NULL,
  data      TEXT,
  is_read   INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0,1)),
  read_at   INTEGER,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_notif_nation ON notifications (nation_id, is_read, created_at DESC);

-- ---------------------------------------------------------------- 21. user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('player','admin','super_admin')),
  note       TEXT,
  is_active  INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  granted_by INTEGER REFERENCES users (id) ON DELETE SET NULL,
  granted_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (user_id, role)
);

-- ---------------------------------------------------------------- 22. admin_permissions
CREATE TABLE IF NOT EXISTS admin_permissions (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  resource  TEXT NOT NULL CHECK (resource IN
              ('users','nations','economy','shop','wars','diplomacy',
               'statements','settings','roles','backup','quota','audit')),
  can_read  INTEGER NOT NULL DEFAULT 1 CHECK (can_read IN (0,1)),
  can_write INTEGER NOT NULL DEFAULT 0 CHECK (can_write IN (0,1)),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (user_id, resource)
);
CREATE INDEX IF NOT EXISTS ix_admin_perms_user ON admin_permissions (user_id);

-- ---------------------------------------------------------------- 23. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_user_id     INTEGER REFERENCES users (id) ON DELETE SET NULL,
  actor_telegram_id INTEGER,
  action            TEXT NOT NULL,
  target_type       TEXT,
  target_id         INTEGER,
  before_json       TEXT,
  after_json        TEXT,
  reason            TEXT,
  ip                TEXT,
  created_at        INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_audit_time ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS ix_audit_target ON audit_logs (target_type, target_id);
CREATE INDEX IF NOT EXISTS ix_audit_actor ON audit_logs (actor_user_id, created_at DESC);

-- ---------------------------------------------------------------- 24. scheduled_events
CREATE TABLE IF NOT EXISTS scheduled_events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  kind         TEXT NOT NULL,
  nation_id    INTEGER REFERENCES nations (id) ON DELETE CASCADE,
  payload      TEXT,
  run_at       INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','done','failed','skipped')),
  attempts     INTEGER NOT NULL DEFAULT 0,
  last_error   TEXT,
  created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  processed_at INTEGER
);
CREATE INDEX IF NOT EXISTS ix_events_due ON scheduled_events (status, run_at);

-- ---------------------------------------------------------------- 25. sessions
CREATE TABLE IF NOT EXISTS sessions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash   TEXT NOT NULL UNIQUE,
  user_id      INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  nation_id    INTEGER REFERENCES nations (id) ON DELETE SET NULL,
  role         TEXT NOT NULL DEFAULT 'player',
  ip           TEXT,
  user_agent   TEXT,
  created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  last_seen_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  expires_at   INTEGER NOT NULL,
  revoked_at   INTEGER
);
CREATE INDEX IF NOT EXISTS ix_sessions_user ON sessions (user_id, revoked_at);
CREATE INDEX IF NOT EXISTS ix_sessions_expiry ON sessions (expires_at);

-- ---------------------------------------------------------------- 26. processed_webhook_updates
CREATE TABLE IF NOT EXISTS processed_webhook_updates (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  update_id    INTEGER NOT NULL UNIQUE,
  chat_id      INTEGER,
  kind         TEXT,
  payload_hash TEXT,
  created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_webhook_updates_time ON processed_webhook_updates (created_at DESC);

-- ------------------------------------------------- extra: revenue cycle idempotency
CREATE TABLE IF NOT EXISTS revenue_cycles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id    INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  cycle_index  INTEGER NOT NULL,
  cycle_key    TEXT NOT NULL UNIQUE,
  gross_amount INTEGER NOT NULL DEFAULT 0,
  tax_amount   INTEGER NOT NULL DEFAULT 0,
  maintenance_amount INTEGER NOT NULL DEFAULT 0,
  net_amount   INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','credited','skipped')),
  transaction_id INTEGER REFERENCES transactions (id) ON DELETE SET NULL,
  computed_at  INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  credited_at  INTEGER,
  UNIQUE (nation_id, cycle_index)
);
CREATE INDEX IF NOT EXISTS ix_cycles_nation ON revenue_cycles (nation_id, cycle_index DESC);

-- ------------------------------------------------- extra: resumable cron checkpoints
CREATE TABLE IF NOT EXISTS job_checkpoints (
  job_key        TEXT PRIMARY KEY,
  cursor         INTEGER NOT NULL DEFAULT 0,
  last_run_at    INTEGER,
  last_success_at INTEGER,
  rows_processed INTEGER NOT NULL DEFAULT 0,
  last_error     TEXT,
  quota_paused   INTEGER NOT NULL DEFAULT 0 CHECK (quota_paused IN (0,1)),
  updated_at     INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- ------------------------------------------------- extra: bot conversation state
CREATE TABLE IF NOT EXISTS bot_flow_states (
  user_id    INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  state      TEXT NOT NULL,
  nation_id  INTEGER,
  data       TEXT,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  expires_at INTEGER
);

-- ------------------------------------------------- extra: starter packs (admin-editable)
CREATE TABLE IF NOT EXISTS starter_templates (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  name                TEXT NOT NULL UNIQUE COLLATE NOCASE,
  description         TEXT,
  treasury            INTEGER NOT NULL DEFAULT 0 CHECK (treasury >= 0),
  factory_income      INTEGER NOT NULL DEFAULT 0 CHECK (factory_income >= 0),
  mine_income         INTEGER NOT NULL DEFAULT 0 CHECK (mine_income >= 0),
  income_cycle_seconds INTEGER NOT NULL DEFAULT 86400,
  is_default          INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0,1)),
  is_active           INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  created_at          INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at          INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE TABLE IF NOT EXISTS starter_template_items (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  starter_template_id   INTEGER NOT NULL REFERENCES starter_templates (id) ON DELETE CASCADE,
  equipment_template_id INTEGER NOT NULL REFERENCES equipment_templates (id) ON DELETE CASCADE,
  quantity              INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  UNIQUE (starter_template_id, equipment_template_id)
);

-- ------------------------------------------------- extra: daily stat history (charts)
CREATE TABLE IF NOT EXISTS nation_stat_history (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  day       TEXT NOT NULL,
  treasury  INTEGER NOT NULL DEFAULT 0,
  income    INTEGER NOT NULL DEFAULT 0,
  power     REAL NOT NULL DEFAULT 0,
  equipment INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE (nation_id, day)
);
CREATE INDEX IF NOT EXISTS ix_stat_history ON nation_stat_history (nation_id, day);

-- ------------------------------------------------- extra: free-plan quota telemetry
CREATE TABLE IF NOT EXISTS quota_stats (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  day           TEXT NOT NULL UNIQUE,
  api_requests  INTEGER NOT NULL DEFAULT 0,
  bot_updates   INTEGER NOT NULL DEFAULT 0,
  cron_runs     INTEGER NOT NULL DEFAULT 0,
  errors        INTEGER NOT NULL DEFAULT 0,
  db_reads_est  INTEGER NOT NULL DEFAULT 0,
  db_writes_est INTEGER NOT NULL DEFAULT 0,
  nations_count INTEGER NOT NULL DEFAULT 0,
  users_count   INTEGER NOT NULL DEFAULT 0,
  transactions_count INTEGER NOT NULL DEFAULT 0,
  db_size_bytes INTEGER,
  updated_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- ------------------------------------------------- views
CREATE VIEW IF NOT EXISTS v_duplicate_equipment_names AS
SELECT name_fa,
       COUNT(*)                AS occurrences,
       GROUP_CONCAT(cat.key)   AS category_keys,
       GROUP_CONCAT(t.id)      AS template_ids
FROM equipment_templates t
JOIN equipment_categories cat ON cat.id = t.category_id
GROUP BY name_fa
HAVING COUNT(*) > 1;

CREATE VIEW IF NOT EXISTS v_unpriced_equipment AS
SELECT t.id, t.name_fa, c.key AS category_key, c.label_fa AS category_label
FROM equipment_templates t
JOIN equipment_categories c ON c.id = t.category_id
WHERE t.price IS NULL AND t.is_active = 1;

CREATE VIEW IF NOT EXISTS v_nation_leaderboard AS
SELECT n.id, n.name, n.flag, n.leader_name, n.treasury, n.military_power, n.economic_score,
       n.total_score, n.wins_count, n.equipment_count,
       ROW_NUMBER() OVER (ORDER BY n.total_score DESC, n.treasury DESC) AS rank
FROM nations n
WHERE n.status <> 'dissolved';

-- updated_at columns are maintained explicitly by the repositories
-- (self-updating triggers on the same table are avoided on purpose: they make
--  `changes()` unreliable and can recurse when recursive_triggers is enabled).
