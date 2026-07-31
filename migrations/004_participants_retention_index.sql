-- retain_days sweep key for qt_participants. qt_readings already expired at 90
-- days; the participant rows behind them did not, so a session's membership
-- outlived every measurement it was recorded for.
CREATE INDEX IF NOT EXISTS app_quiet_time__qt_participants_retention_idx
  ON app_quiet_time__qt_participants (joined_at, id);
