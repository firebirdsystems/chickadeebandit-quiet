// Pure business logic — no DOM, no fetch. Imported by index.html and tested by __tests__.

/**
 * Convert dBFS metering value (-160..0) to a display dB value (0..100).
 * Maps -100 dBFS → 0 dB, 0 dBFS → 100 dB. Clamps to [0, 100].
 */
export function dBFSToDisplay(metering) {
  return Math.max(0, Math.min(100, 100 + metering));
}

/**
 * Format a duration in seconds as "MM:SS".
 */
export function formatCountdown(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

/**
 * Aggregate per-window readings into per-participant results and sort
 * quietest-first (lowest avg dB wins). Participants with no readings
 * come last.
 *
 * @param {Array<{member_id: string}>} participants
 * @param {Array<{member_id: string, avg_db: number, peak_db: number, loud_events: number}>} readings
 * @returns {Array<{memberId: string, avgDb: number|null, peakDb: number|null, totalLoudEvents: number, hasData: boolean}>}
 */
export function computeResults(participants, readings) {
  const results = participants.map((p) => {
    const memberReadings = readings.filter((r) => r.member_id === p.member_id);
    if (memberReadings.length === 0) {
      return { memberId: p.member_id, avgDb: null, peakDb: null, totalLoudEvents: 0, hasData: false };
    }
    const avgDb = memberReadings.reduce((s, r) => s + r.avg_db, 0) / memberReadings.length;
    const peakDb = Math.max(...memberReadings.map((r) => r.peak_db));
    const totalLoudEvents = memberReadings.reduce((s, r) => s + r.loud_events, 0);
    return { memberId: p.member_id, avgDb, peakDb, totalLoudEvents, hasData: true };
  });

  results.sort((a, b) => {
    if (a.hasData && !b.hasData) return -1;
    if (!a.hasData && b.hasData) return 1;
    if (!a.hasData && !b.hasData) return 0;
    return a.avgDb - b.avgDb;
  });

  return results;
}

/**
 * Return the rank label for a zero-based index.
 * Indices 0–2 get medal emojis; others get their 1-based number.
 */
export function rankLabel(index) {
  return ["🥇", "🥈", "🥉"][index] ?? String(index + 1);
}

/**
 * Determine participant IDs for a session based on mode.
 *
 * @param {"everyone"|"children_only"|"specific"} mode
 * @param {Array<{id: string, role: string}>} members
 * @param {string[]} [specificIds] - required when mode === "specific"
 * @returns {string[]}
 */
export function resolveParticipants(mode, members, specificIds = []) {
  if (mode === "children_only") return members.filter((m) => m.role === "child").map((m) => m.id);
  if (mode === "specific") return specificIds.filter((id) => members.some((m) => m.id === id));
  return members.map((m) => m.id); // "everyone"
}
