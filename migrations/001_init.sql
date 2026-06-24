CREATE TABLE IF NOT EXISTS app_quiet_time__qt_sessions (
  id                  TEXT PRIMARY KEY,
  created_by          TEXT NOT NULL,
  duration_sec        INTEGER NOT NULL,
  participant_mode    TEXT NOT NULL,
  specific_member_ids TEXT,
  status              TEXT NOT NULL DEFAULT 'pending',
  started_at          TEXT NOT NULL,
  ended_at            TEXT
);

CREATE TABLE IF NOT EXISTS app_quiet_time__qt_participants (
  id          TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL,
  member_id   TEXT NOT NULL,
  joined_at   TEXT NOT NULL,
  UNIQUE(session_id, member_id)
);

CREATE TABLE IF NOT EXISTS app_quiet_time__qt_readings (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL,
  member_id    TEXT NOT NULL,
  recorded_at  TEXT NOT NULL,
  avg_db       REAL NOT NULL,
  peak_db      REAL NOT NULL,
  loud_events  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_qt_participants_session ON app_quiet_time__qt_participants (session_id);
CREATE INDEX IF NOT EXISTS idx_qt_readings_session     ON app_quiet_time__qt_readings (session_id);
CREATE INDEX IF NOT EXISTS idx_qt_sessions_status      ON app_quiet_time__qt_sessions (status);
