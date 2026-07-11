CREATE INDEX IF NOT EXISTS app_quiet_time__qt_readings_retention_idx
  ON app_quiet_time__qt_readings (recorded_at, id);
