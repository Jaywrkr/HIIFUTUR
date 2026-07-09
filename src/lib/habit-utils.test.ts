import { describe, expect, it } from "vitest";
import { addDays, computeStreak, daysBetween, todayKey } from "@/lib/habit-utils";

function key(daysAgo: number): string {
  return addDays(new Date(), -daysAgo).toISOString().slice(0, 10);
}

describe("addDays / daysBetween / todayKey", () => {
  it("addDays moves forward and backward across month boundaries", () => {
    const d = new Date("2026-01-31T12:00:00Z");
    expect(addDays(d, 1).toISOString().slice(0, 10)).toBe("2026-02-01");
    expect(addDays(d, -31).toISOString().slice(0, 10)).toBe("2025-12-31");
  });

  it("daysBetween floors partial days", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    expect(daysBetween(from, new Date("2026-01-03T00:00:00Z"))).toBe(2);
    expect(daysBetween(from, new Date("2026-01-03T23:59:00Z"))).toBe(2);
  });

  it("todayKey is a YYYY-MM-DD string", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("computeStreak", () => {
  it("is 0 with no logs", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("counts consecutive days back from today", () => {
    expect(computeStreak([key(0), key(1), key(2)])).toBe(3);
  });

  it("not having checked today yet does not break the streak", () => {
    expect(computeStreak([key(1), key(2), key(3)])).toBe(3);
  });

  it("a gap before today breaks the streak", () => {
    expect(computeStreak([key(0), key(2), key(3)])).toBe(1);
    expect(computeStreak([key(2), key(3)])).toBe(0);
  });

  it("a freeze covers the missed day", () => {
    expect(computeStreak([key(0), key(2), key(3)], [key(1)])).toBe(4);
  });

  it("duplicate dates do not inflate the streak", () => {
    expect(computeStreak([key(0), key(0), key(1)])).toBe(2);
  });
});
