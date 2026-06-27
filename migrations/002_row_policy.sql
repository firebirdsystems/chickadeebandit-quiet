-- Game participation and score rows are everyone-readable — the participant list
-- and the results leaderboard both need to see all players' rows — but each member
-- may write only their OWN row, so no one can forge or delete another player's
-- participation or scores (owner_or_visibility + write_owner_only, keyed on
-- member_id with an everyone-visibility column).
--
-- qt_sessions intentionally has NO row policy: a session's status is a shared
-- state machine written by several participants (the host starts it, the first
-- joiner activates it, whichever player's timer expires completes it), so there
-- is no single owner to scope writes to. It is collaborative shared state.
ALTER TABLE app_quiet_time__qt_participants ADD COLUMN visibility TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_quiet_time__qt_readings     ADD COLUMN visibility TEXT NOT NULL DEFAULT 'everyone';
