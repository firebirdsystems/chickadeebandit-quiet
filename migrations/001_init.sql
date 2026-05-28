CREATE TABLE IF NOT EXISTS qt_sessions (
  id               TEXT PRIMARY KEY,
  household_id     TEXT NOT NULL,
  created_by       TEXT NOT NULL,
  duration_sec     INTEGER NOT NULL,
  participant_mode TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending',
  started_at       TEXT NOT NULL,
  ended_at         TEXT
);

CREATE TABLE IF NOT EXISTS qt_participants (
  id           TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  session_id   TEXT NOT NULL,
  member_id    TEXT NOT NULL,
  notified_at  TEXT,
  joined_at    TEXT
);

CREATE TABLE IF NOT EXISTS qt_readings (
  id           TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  session_id   TEXT NOT NULL,
  member_id    TEXT NOT NULL,
  recorded_at  TEXT NOT NULL,
  avg_db       REAL NOT NULL,
  peak_db      REAL NOT NULL,
  loud_events  INTEGER NOT NULL DEFAULT 0
);
