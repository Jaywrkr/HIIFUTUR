import { describe, expect, it } from "vitest";
import { POINTS_PER_CHECK, computeLevel, pointsForLevel } from "@/lib/leveling";

describe("pointsForLevel", () => {
  it("level 1 is free", () => {
    expect(pointsForLevel(1)).toBe(0);
    expect(pointsForLevel(0)).toBe(0);
  });

  it("follows the quadratic curve", () => {
    expect(pointsForLevel(2)).toBe(50);
    expect(pointsForLevel(3)).toBe(200);
    expect(pointsForLevel(4)).toBe(450);
    expect(pointsForLevel(5)).toBe(800);
  });

  it("each level costs more additional points than the last", () => {
    for (let level = 2; level <= 50; level++) {
      const previousGap = pointsForLevel(level) - pointsForLevel(level - 1);
      const nextGap = pointsForLevel(level + 1) - pointsForLevel(level);
      expect(nextGap).toBeGreaterThan(previousGap);
    }
  });
});

describe("computeLevel", () => {
  it("starts everyone at level 1 with 0 points", () => {
    const p = computeLevel(0);
    expect(p.level).toBe(1);
    expect(p.pointsIntoLevel).toBe(0);
    expect(p.pointsToNextLevel).toBe(50);
    expect(p.nextLevelThreshold).toBe(50);
  });

  it("levels up exactly at the threshold", () => {
    expect(computeLevel(49).level).toBe(1);
    expect(computeLevel(50).level).toBe(2);
    expect(computeLevel(199).level).toBe(2);
    expect(computeLevel(200).level).toBe(3);
  });

  it("reports progress within the current level", () => {
    const p = computeLevel(500); // level 4 spans 450..800
    expect(p.level).toBe(4);
    expect(p.pointsIntoLevel).toBe(50);
    expect(p.pointsToNextLevel).toBe(300);
    expect(p.nextLevelThreshold).toBe(350);
  });

  it("checking then unchecking a habit leaves the level unchanged", () => {
    const before = computeLevel(120);
    const after = computeLevel(120 + POINTS_PER_CHECK - POINTS_PER_CHECK);
    expect(after).toEqual(before);
  });
});
