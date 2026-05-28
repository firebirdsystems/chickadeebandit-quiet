import { describe, it, expect } from "vitest";
import {
  dBFSToDisplay,
  formatCountdown,
  computeResults,
  rankLabel,
  resolveParticipants,
} from "../src/logic.js";

// ── dBFSToDisplay ─────────────────────────────────────────────────────────────

describe("dBFSToDisplay", () => {
  it("maps 0 dBFS to 100 dB", () => {
    expect(dBFSToDisplay(0)).toBe(100);
  });

  it("maps -100 dBFS to 0 dB", () => {
    expect(dBFSToDisplay(-100)).toBe(0);
  });

  it("maps -50 dBFS to 50 dB", () => {
    expect(dBFSToDisplay(-50)).toBe(50);
  });

  it("clamps values below -100 to 0", () => {
    expect(dBFSToDisplay(-160)).toBe(0);
    expect(dBFSToDisplay(-200)).toBe(0);
  });

  it("clamps values above 0 to 100", () => {
    expect(dBFSToDisplay(10)).toBe(100);
  });
});

// ── formatCountdown ───────────────────────────────────────────────────────────

describe("formatCountdown", () => {
  it("formats zero as 00:00", () => {
    expect(formatCountdown(0)).toBe("00:00");
  });

  it("formats 90 seconds as 01:30", () => {
    expect(formatCountdown(90)).toBe("01:30");
  });

  it("formats 10 minutes as 10:00", () => {
    expect(formatCountdown(600)).toBe("10:00");
  });

  it("formats 3599 seconds as 59:59", () => {
    expect(formatCountdown(3599)).toBe("59:59");
  });

  it("clamps negative values to 00:00", () => {
    expect(formatCountdown(-5)).toBe("00:00");
  });

  it("floors fractional seconds", () => {
    expect(formatCountdown(61.9)).toBe("01:01");
  });
});

// ── computeResults ────────────────────────────────────────────────────────────

describe("computeResults — no readings", () => {
  it("returns hasData:false for participants with no readings", () => {
    const participants = [{ member_id: "a" }, { member_id: "b" }];
    const results = computeResults(participants, []);
    expect(results).toHaveLength(2);
    expect(results.every(r => !r.hasData)).toBe(true);
    expect(results.every(r => r.totalLoudEvents === 0)).toBe(true);
  });
});

describe("computeResults — single participant", () => {
  it("computes avg_db as mean of readings", () => {
    const participants = [{ member_id: "a" }];
    const readings = [
      { member_id: "a", avg_db: 30, peak_db: 40, loud_events: 0 },
      { member_id: "a", avg_db: 50, peak_db: 60, loud_events: 2 },
    ];
    const [result] = computeResults(participants, readings);
    expect(result.avgDb).toBe(40);
    expect(result.peakDb).toBe(60);
    expect(result.totalLoudEvents).toBe(2);
    expect(result.hasData).toBe(true);
  });
});

describe("computeResults — sorting", () => {
  it("sorts quieter participants first", () => {
    const participants = [{ member_id: "loud" }, { member_id: "quiet" }];
    const readings = [
      { member_id: "loud",  avg_db: 70, peak_db: 80, loud_events: 5 },
      { member_id: "quiet", avg_db: 20, peak_db: 30, loud_events: 0 },
    ];
    const results = computeResults(participants, readings);
    expect(results[0].memberId).toBe("quiet");
    expect(results[1].memberId).toBe("loud");
  });

  it("places participants with no readings last", () => {
    const participants = [{ member_id: "no-data" }, { member_id: "has-data" }];
    const readings = [
      { member_id: "has-data", avg_db: 90, peak_db: 95, loud_events: 10 },
    ];
    const results = computeResults(participants, readings);
    expect(results[0].memberId).toBe("has-data");
    expect(results[1].memberId).toBe("no-data");
  });

  it("preserves order of no-data participants relative to each other", () => {
    const participants = [{ member_id: "a" }, { member_id: "b" }];
    const results = computeResults(participants, []);
    // Both have no data — original order preserved
    expect(results[0].memberId).toBe("a");
    expect(results[1].memberId).toBe("b");
  });
});

describe("computeResults — empty participants", () => {
  it("returns empty array for no participants", () => {
    expect(computeResults([], [])).toEqual([]);
  });
});

// ── rankLabel ─────────────────────────────────────────────────────────────────

describe("rankLabel", () => {
  it("returns 🥇 for index 0", () => {
    expect(rankLabel(0)).toBe("🥇");
  });

  it("returns 🥈 for index 1", () => {
    expect(rankLabel(1)).toBe("🥈");
  });

  it("returns 🥉 for index 2", () => {
    expect(rankLabel(2)).toBe("🥉");
  });

  it("returns numeric string for index 3+", () => {
    expect(rankLabel(3)).toBe("4");
    expect(rankLabel(9)).toBe("10");
  });
});

// ── resolveParticipants ───────────────────────────────────────────────────────

const MEMBERS = [
  { id: "adult-1", role: "adult" },
  { id: "adult-2", role: "adult" },
  { id: "child-1", role: "child" },
  { id: "child-2", role: "child" },
];

describe("resolveParticipants — everyone", () => {
  it("returns all member IDs", () => {
    const ids = resolveParticipants("everyone", MEMBERS);
    expect(ids).toEqual(["adult-1", "adult-2", "child-1", "child-2"]);
  });
});

describe("resolveParticipants — children_only", () => {
  it("returns only child IDs", () => {
    const ids = resolveParticipants("children_only", MEMBERS);
    expect(ids).toEqual(["child-1", "child-2"]);
  });

  it("returns empty array when no children", () => {
    const adultsOnly = MEMBERS.filter(m => m.role === "adult");
    expect(resolveParticipants("children_only", adultsOnly)).toEqual([]);
  });
});

describe("resolveParticipants — specific", () => {
  it("returns only IDs that exist in members list", () => {
    const ids = resolveParticipants("specific", MEMBERS, ["child-1", "adult-2", "ghost-99"]);
    expect(ids).toEqual(["child-1", "adult-2"]);
  });

  it("returns empty array when no IDs provided", () => {
    expect(resolveParticipants("specific", MEMBERS, [])).toEqual([]);
  });

  it("returns empty array when all provided IDs are unknown", () => {
    expect(resolveParticipants("specific", MEMBERS, ["unknown"])).toEqual([]);
  });
});
