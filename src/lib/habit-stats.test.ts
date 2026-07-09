import { describe, expect, it } from "vitest";
import { computeLongestStreak } from "@/lib/habit-stats";

describe("computeLongestStreak", () => {
  it("is 0 with no history", () => {
    expect(computeLongestStreak([])).toBe(0);
  });

  it("finds the longest run anywhere in history, not just the latest", () => {
    const days = ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-10", "2026-01-11"];
    expect(computeLongestStreak(days)).toBe(3);
  });

  it("counts frozen days as part of a run", () => {
    expect(computeLongestStreak(["2026-01-01", "2026-01-03"], ["2026-01-02"])).toBe(3);
  });

  it("handles unsorted input and duplicates", () => {
    expect(computeLongestStreak(["2026-01-02", "2026-01-01", "2026-01-02"])).toBe(2);
  });

  it("crosses month boundaries", () => {
    expect(computeLongestStreak(["2026-01-31", "2026-02-01", "2026-02-02"])).toBe(3);
  });
});
