-- Non-destructive idempotent schema migration for service_management_db
ALTER TABLE applications ADD COLUMN IF NOT EXISTS fee_amount DOUBLE PRECISION DEFAULT 20.0;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS payment_status VARCHAR(255) DEFAULT 'PAID';
UPDATE applications SET fee_amount = 20.0 WHERE fee_amount IS NULL;
UPDATE applications SET payment_status = 'PAID' WHERE payment_status IS NULL;
