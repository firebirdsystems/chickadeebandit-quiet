CREATE TABLE IF NOT EXISTS app_quiet_time__qt_sessions (
  id               TEXT PRIMARY KEY,
  created_by       TEXT NOT NULL,
  duration_sec     INTEGER NOT NULL,
  participant_mode TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending',
  started_at       TEXT NOT NULL,
  ended_at         TEXT
);

CREATE TABLE IF NOT EXISTS app_quiet_time__qt_participants (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL,
  member_id    TEXT NOT NULL,
  notified_at  TEXT,
  joined_at    TEXT
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
