import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, earnedTier, getAchievementsProgress, type AchievementStats } from "@/lib/achievements";

describe("earnedTier", () => {
  const tiers = [
    { tier: 1 as const, name: "a", requirement: "", threshold: 7, points: 10 },
    { tier: 2 as const, name: "b", requirement: "", threshold: 30, points: 20 },
    { tier: 3 as const, name: "c", requirement: "", threshold: 100, points: 30 },
  ];

  it("is 0 below the first threshold", () => {
    expect(earnedTier(tiers, 0)).toBe(0);
    expect(earnedTier(tiers, 6)).toBe(0);
  });

  it("matches the exact threshold", () => {
    expect(earnedTier(tiers, 7)).toBe(1);
    expect(earnedTier(tiers, 30)).toBe(2);
    expect(earnedTier(tiers, 100)).toBe(3);
  });

  it("returns the highest tier crossed, not just the closest", () => {
    expect(earnedTier(tiers, 500)).toBe(3);
  });
});

describe("getAchievementsProgress", () => {
  const zeroStats: AchievementStats = {
    longestStreak: 0,
    modulesCompleted: 0,
    wheelAverageDelta: 0,
    activeHabits: 0,
    freezesUsed: 0,
    cycleCompleted: false,
  };

  it("returns one entry per defined achievement", () => {
    const progress = getAchievementsProgress(zeroStats);
    expect(progress).toHaveLength(ACHIEVEMENTS.length);
  });

  it("everything is locked (tier 0) with zero stats", () => {
    const progress = getAchievementsProgress(zeroStats);
    expect(progress.every((p) => p.earnedTier === 0)).toBe(true);
  });

  it("computes real tiers from real stats", () => {
    const stats: AchievementStats = {
      ...zeroStats,
      longestStreak: 35,
      modulesCompleted: 6,
      activeHabits: 3,
    };
    const progress = getAchievementsProgress(stats);

    const constancia = progress.find((p) => p.achievement.id === "constancia")!;
    expect(constancia.earnedTier).toBe(2); // crossed 30, not yet 100

    const camino = progress.find((p) => p.achievement.id === "camino")!;
    expect(camino.earnedTier).toBe(2); // crossed 6, not yet 11

    const ecosistema = progress.find((p) => p.achievement.id === "ecosistema")!;
    expect(ecosistema.earnedTier).toBe(1); // crossed 2, not yet 4
  });

  it("the single-tier ciclo achievement only unlocks at its one threshold", () => {
    const locked = getAchievementsProgress(zeroStats).find((p) => p.achievement.id === "ciclo")!;
    expect(locked.earnedTier).toBe(0);

    const unlocked = getAchievementsProgress({ ...zeroStats, cycleCompleted: true }).find(
      (p) => p.achievement.id === "ciclo"
    )!;
    expect(unlocked.earnedTier).toBe(3);
  });

  it("nextTier is null once the top tier is reached", () => {
    const maxed = getAchievementsProgress({ ...zeroStats, longestStreak: 500 }).find(
      (p) => p.achievement.id === "constancia"
    )!;
    expect(maxed.nextTier).toBeNull();
  });
});
