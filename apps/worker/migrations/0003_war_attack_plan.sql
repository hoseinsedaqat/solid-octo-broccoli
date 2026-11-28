-- "آرایش حمله": the striking force the attacker commits at war proposal time.
-- The committed units fight for that war; the rest of the army defends home.
ALTER TABLE wars ADD COLUMN attack_plan TEXT;

-- nation switching: the Mini App can switch the active nation per session
ALTER TABLE sessions ADD COLUMN active_nation_id INTEGER;

CREATE INDEX IF NOT EXISTS ix_nation_inventory_nation_template ON nation_inventory (nation_id, template_id);