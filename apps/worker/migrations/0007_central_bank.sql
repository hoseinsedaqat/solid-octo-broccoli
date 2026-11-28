-- 0007: بانک مرکزی — وام بانکی + انواع تراکنش وام
-- اول جدول transactions بازسازی می‌شود تا نوع‌های loan_disbursement و loan_repayment را بپذیرد
-- (SQLite نمی‌تواند CHECK constraint را تغییر دهد). defer_foreign_keys فقط برای همین تراکنش معتبر است.
PRAGMA defer_foreign_keys = ON;

CREATE TABLE transactions_new (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid                 TEXT    NOT NULL UNIQUE,
  nation_id            INTEGER NOT NULL REFERENCES nations (id) ON DELETE RESTRICT,
  type                 TEXT    NOT NULL CHECK (type IN
                          ('starter_grant','revenue','purchase','admin_credit','admin_debit','admin_correction',
                           'war_indemnity','war_cost','tax','maintenance','battle_loss_compensation','prize',
                           'loan_disbursement','loan_repayment')),
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

-- وام‌های بانکی: هر کشور در هر لحظه فقط یک وام فعال دارد (partial unique index)
CREATE TABLE IF NOT EXISTS nation_loans (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nation_id     INTEGER NOT NULL REFERENCES nations (id) ON DELETE CASCADE,
  principal     INTEGER NOT NULL CHECK (principal > 0),
  interest_rate REAL    NOT NULL CHECK (interest_rate >= 0 AND interest_rate <= 1),
  repay_amount  INTEGER NOT NULL CHECK (repay_amount >= principal),
  status        TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active','repaid','defaulted')),
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  due_at        INTEGER NOT NULL,
  repaid_at     INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_nation_loans_one_active ON nation_loans (nation_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS ix_nation_loans_status_due ON nation_loans (status, due_at);
