import { describe, expect, it } from "vitest";
import {
  CYCLE_DAYS,
  MAX_CYCLE_FAILS,
  countCompletedInCycle,
  countExecutedDays,
  countMissedDays,
  cycleElapsed,
  dayOfCycle,
  pointsAfterReset,
  requiredExecutedDaysForNext,
} from "@/lib/cycle";

const start = new Date("2026-06-01T10:00:00Z");
const day = (n: number) => `2026-06-${String(n).padStart(2, "0")}`;
const at = (n: number) => new Date(`2026-06-${String(n).padStart(2, "0")}T10:00:00Z`);

describe("countMissedDays", () => {
  it("no full days elapsed yet means nothing to miss", () => {
    expect(countMissedDays(start, at(1), [])).toBe(0);
  });

  it("today never counts as missed — the day is not over", () => {
    expect(countMissedDays(start, at(2), [day(1)])).toBe(0);
    expect(countMissedDays(start, at(2), [])).toBe(1);
  });

  it("counts every uncovered day since cycle start", () => {
    expect(countMissedDays(start, at(5), [day(1), day(3)])).toBe(2);
  });

  it("freezes cover a day exactly like a check", () => {
    expect(countMissedDays(start, at(4), [day(1), day(3)], [day(2)])).toBe(0);
  });

  it("two misses stay within the forgiven range", () => {
    const missed = countMissedDays(start, at(4), [day(1)]);
    expect(missed).toBe(2);
    expect(missed > MAX_CYCLE_FAILS).toBe(false);
  });

  it("third miss crosses the reset threshold", () => {
    const missed = countMissedDays(start, at(7), [day(1), day(4), day(5)]);
    expect(missed).toBe(3);
    expect(missed > MAX_CYCLE_FAILS).toBe(true);
  });
});

describe("pointsAfterReset", () => {
  it("keeps half of the points earned since cycle start", () => {
    expect(pointsAfterReset(150, 100)).toBe(125);
  });

  it("rounds to the nearest point", () => {
    expect(pointsAfterReset(101, 100)).toBe(101); // 0.5 earned -> rounds up to 1
    expect(pointsAfterReset(103, 100)).toBe(102); // 3 earned -> keeps 1.5 -> 2
  });

  it("never drops below the cycle-start value", () => {
    expect(pointsAfterReset(100, 100)).toBe(100);
    expect(pointsAfterReset(90, 100)).toBe(100);
  });
});

describe("countExecutedDays", () => {
  it("only counts days inside the cycle", () => {
    expect(countExecutedDays(start, ["2026-05-30", "2026-05-31", day(1), day(2)])).toBe(2);
  });

  it("freezes count as execution and duplicates collapse", () => {
    expect(countExecutedDays(start, [day(1), day(1)], [day(2)])).toBe(2);
  });
});

describe("dayOfCycle / cycleElapsed", () => {
  it("starts at day 1 and caps at 30", () => {
    expect(dayOfCycle(start, at(1))).toBe(1);
    expect(dayOfCycle(start, at(15))).toBe(15);
    expect(dayOfCycle(start, new Date("2026-08-01T00:00:00Z"))).toBe(CYCLE_DAYS);
  });

  it("elapses exactly at 30 full days", () => {
    expect(cycleElapsed(start, new Date("2026-06-30T10:00:00Z"))).toBe(false);
    expect(cycleElapsed(start, new Date("2026-07-01T10:00:00Z"))).toBe(true);
  });
});

describe("requiredExecutedDaysForNext", () => {
  it("first module after the entrance needs 3 executed days", () => {
    expect(requiredExecutedDaysForNext(0)).toBe(0);
    expect(requiredExecutedDaysForNext(1)).toBe(3);
  });

  it("a full fresh run lands module 11 at 30 executed days", () => {
    // 10 modules completed in-cycle (1..10) -> the 11th needs 30 days.
    expect(requiredExecutedDaysForNext(10)).toBe(CYCLE_DAYS);
  });
});

describe("countCompletedInCycle", () => {
  const before = new Date("2026-05-20T00:00:00Z");
  const inCycle = new Date("2026-06-05T00:00:00Z");
  const row = (moduleId: string, completedAt: Date | null, completed = true) => ({
    moduleId,
    completed,
    completedAt,
  });

  it("module 1 counts even when completed before the cycle started", () => {
    expect(countCompletedInCycle([row("m1", before)], start, "m1")).toBe(1);
  });

  it("other pre-cycle completions do not count (legacy users are not over-locked)", () => {
    const progress = [row("m1", before), row("m2", before), row("m3", inCycle)];
    expect(countCompletedInCycle(progress, start, "m1")).toBe(2);
  });

  it("uncompleted rows (post-reset) do not count even with old data", () => {
    expect(countCompletedInCycle([row("m2", null, false)], start, "m1")).toBe(0);
  });

  it("no cycle means no gate input", () => {
    expect(countCompletedInCycle([row("m1", before)], null, "m1")).toBe(0);
  });
});
