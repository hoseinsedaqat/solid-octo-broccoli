-- 0009: منابع طبیعی کشور — استخراج، پالایش، فروش، تجارت، قراردادها و بودجه
-- ۱) transactions با نوع‌های جدید (بازسازی جدول طبق الگوی 0006/0007)
PRAGMA defer_foreign_keys = ON;

CREATE TABLE transactions_new (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid                   TEXT    NOT NULL UNIQUE,
  nation_id              INTEGER NOT NULL REFERENCES nations (id) ON DELETE RESTRICT,
  type                   TEXT    NOT NULL CHECK (type IN
                           ('starter_grant','revenue','purchase','admin_credit','admin_debit','admin_correction',
                            'war_indemnity','war_cost','tax','maintenance','battle_loss_compensation','prize',
                            'loan_disbursement','loan_repayment',
                            'resource_extract','refinery','resource_sale',
                            'trade_import','trade_export','contract','budget_transfer')),
  amount                 INTEGER NOT NULL,
  balance_before         INTEGER,
  balance_after          INTEGER,
  currency               TEXT    NOT NULL DEFAULT 'coin',
  idempotency_key        TEXT    NOT NULL UNIQUE,
  reference_type         TEXT,
  reference_id           INTEGER,
  reason                 TEXT,
  counterparty_nation_id INTEGER REFERENCES nations (id) ON DELETE SET NULL,
  created_by_user_id     INTEGER REFERENCES users (id) ON DELETE SET NULL,
  meta                   TEXT,
  created_at             INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

INSERT INTO transactions_new
  (id, uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
   reference_type, reference_id, reason, counterparty_nation_id, created_by_user_id, meta, created_at)
SELECT id, uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
       reference_type, reference_id, reason, counterparty_nation_id, created_by_user_id, meta, created_at
  FROM transactions;

DROP TRIGGER IF EXISTS trg_txn_immutable;
DROP TRIGGER IF EXISTS trg_txn_no_update_amount;
DROP INDEX IF EXISTS ix_txn_nation_time;
DROP INDEX IF EXISTS ix_txn_type;
DROP TABLE transactions;
ALTER TABLE transactions_new RENAME TO transactions;

CREATE INDEX IF NOT EXISTS ix_txn_nation_time ON transactions (nation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_txn_type ON transactions (type, created_at DESC);

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

-- ۲) انبار منابع کشور: ذخایر زیرزمینی (reserves) و موجودی قابل‌مصرف (stock)
CREATE TABLE IF NOT EXISTS nation_resources (
  nation_id    INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  resource_key TEXT    NOT NULL,
  reserves     REAL    NOT NULL DEFAULT 0 CHECK (reserves >= 0),
  stock        REAL    NOT NULL DEFAULT 0 CHECK (stock >= 0),
  updated_at   INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  PRIMARY KEY (nation_id, resource_key)
);

-- ذخایر و موجودی پیش‌فرض برای کشورهای موجود (هر منبع یک جملهٔ جدا — محدودیت ۵ عضویت در compound SELECT)
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'oil', 500000, 500000 FROM nations WHERE status <> 'dissolved';
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'gas', 800000, 800000 FROM nations WHERE status <> 'dissolved';
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'iron', 300000, 300000 FROM nations WHERE status <> 'dissolved';
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'gold', 50000, 50000 FROM nations WHERE status <> 'dissolved';
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'uranium', 2000, 2000 FROM nations WHERE status <> 'dissolved';
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'diamond', 1000, 1000 FROM nations WHERE status <> 'dissolved';
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'fuel', 0, 0 FROM nations;
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'steel', 0, 0 FROM nations;
INSERT OR IGNORE INTO nation_resources (nation_id, resource_key, reserves, stock) SELECT id, 'energy', 0, 0 FROM nations;

-- ۳) عملیات پالایش (۳۰ دقیقه‌ای) — تسویهٔ تنبل هنگام خواندن
CREATE TABLE IF NOT EXISTS nation_refinery_ops (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id    INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  recipe_key   TEXT    NOT NULL,
  input_key    TEXT    NOT NULL,
  input_qty    REAL    NOT NULL CHECK (input_qty > 0),
  output_key   TEXT    NOT NULL,
  output_qty   REAL    NOT NULL CHECK (output_qty > 0),
  cost         INTEGER NOT NULL CHECK (cost >= 0),
  started_at   INTEGER NOT NULL,
  completes_at INTEGER NOT NULL,
  settled_at   INTEGER
);
CREATE INDEX IF NOT EXISTS ix_refinery_nation ON nation_refinery_ops (nation_id, settled_at);

-- ۴) قراردادهای آتی (۷ روزه، تسویهٔ تنبل)
CREATE TABLE IF NOT EXISTS nation_contracts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id    INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  side         TEXT    NOT NULL CHECK (side IN ('export','import')),
  contract_type TEXT   NOT NULL CHECK (contract_type IN ('oil','gas','mineral','supply')),
  resource_key TEXT    NOT NULL,
  partner_key  TEXT    NOT NULL,
  quantity     REAL    NOT NULL CHECK (quantity > 0),
  unit_price   INTEGER NOT NULL CHECK (unit_price > 0),
  total        INTEGER NOT NULL CHECK (total > 0),
  status       TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  created_at   INTEGER NOT NULL,
  completes_at INTEGER NOT NULL,
  settled_at   INTEGER
);
CREATE INDEX IF NOT EXISTS ix_contracts_nation ON nation_contracts (nation_id, status, completes_at);

-- ۵) وجوه بودجهٔ کشور (زیرحساب‌های خزانه — قابل برداشت مجدد)
CREATE TABLE IF NOT EXISTS nation_budget_pots (
  nation_id  INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  pot_key    TEXT    NOT NULL CHECK (pot_key IN ('military','construction','industry','public')),
  amount     INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  PRIMARY KEY (nation_id, pot_key)
);

-- ۶) لاگ تجارت برای گزارش‌های تجاری
CREATE TABLE IF NOT EXISTS trade_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id  INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  kind       TEXT    NOT NULL CHECK (kind IN ('import','export','contract_create','contract_settle','contract_cancel')),
  resource_key TEXT  NOT NULL,
  partner_key  TEXT  NOT NULL,
  quantity   REAL    NOT NULL,
  unit_price INTEGER NOT NULL,
  total      INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS ix_trade_log_nation ON trade_log (nation_id, created_at DESC);
