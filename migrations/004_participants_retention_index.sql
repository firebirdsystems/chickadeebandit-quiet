-- retain_days sweep key for qt_sessions, which now expires the session and
-- cascades its participants. qt_readings already expired at 90 days on its own
-- key; the session and its membership outlived every measurement they were
-- recorded for, and qt_sessions has no row policy — so the expiry lives in the
-- manifest's top-level `retention` map rather than inside a policy.
CREATE INDEX IF NOT EXISTS app_quiet_time__qt_sessions_retention_idx
  ON app_quiet_time__qt_sessions (started_at, id);
