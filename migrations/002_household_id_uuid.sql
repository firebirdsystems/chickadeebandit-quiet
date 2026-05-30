ALTER TABLE qt_sessions     ALTER COLUMN household_id TYPE uuid USING household_id::uuid;
ALTER TABLE qt_participants ALTER COLUMN household_id TYPE uuid USING household_id::uuid;
ALTER TABLE qt_readings     ALTER COLUMN household_id TYPE uuid USING household_id::uuid;
