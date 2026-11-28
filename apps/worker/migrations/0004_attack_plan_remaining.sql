-- Remaining committed units are tracked per template across rounds,
-- so a committed plan can be depleted exactly as the battle reports claim.
ALTER TABLE wars ADD COLUMN attack_plan_remaining TEXT;
