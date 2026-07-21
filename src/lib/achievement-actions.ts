import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, userAchievements } from "@/db/schema";
import {
  getHabitsForUser,
  getHabitLogs,
  getHabitFreezes,
  getUserPreferences,
  getWheelMeasurements,
  getModuleProgressForUser,
} from "@/lib/queries";
import { computeLongestStreak } from "@/lib/habit-stats";
import { MODULES } from "@/lib/modules-content";
import {
  ACHIEVEMENTS,
  earnedTier,
  type AchievementStats,
  type AchievementProgress,
  getAchievementsProgress,
} from "@/lib/achievements";

function averageScore(scores: Record<string, number> | null | undefined): number {
  if (!scores) return 0;
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Gathers every real stat an achievement can measure, from the same
 * queries the rest of the app already uses (habits/logs/freezes, module
 * progress, Wheel of Life, cycle state) — nothing here is a new source of
 * truth, just a read across tables that already exist. */
export async function getAchievementStats(user: {
  id: string;
  cycleCompletedAt: Date | null;
}): Promise<AchievementStats> {
  const [habits, prefs, measurements, moduleProgressRows] = await Promise.all([
    getHabitsForUser(user.id),
    getUserPreferences(user.id),
    getWheelMeasurements(user.id),
    getModuleProgressForUser(user.id),
  ]);

  const habitsWithData = await Promise.all(
    habits.map(async (habit) => {
      const [logs, freezes] = await Promise.all([getHabitLogs(habit.id), getHabitFreezes(habit.id)]);
      return {
        habit,
        longestStreak: computeLongestStreak(
          logs.map((l) => l.date),
          freezes.map((f) => f.date)
        ),
        freezesUsed: freezes.length,
      };
    })
  );

  const longestStreak = habitsWithData.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const freezesUsed = habitsWithData.reduce((sum, h) => sum + h.freezesUsed, 0);
  const activeHabits = habits.filter((h) => h.status === "active").length;
  const modulesCompleted = moduleProgressRows.filter((m) => m.completed).length;

  const latestMeasurement = measurements[0];
  const baseline = averageScore(prefs?.initialWheelScores as Record<string, number> | undefined);
  const current = latestMeasurement
    ? averageScore(latestMeasurement.areaScores as Record<string, number>)
    : baseline;
  const wheelAverageDelta = Math.max(0, current - baseline);

  return {
    longestStreak,
    modulesCompleted: Math.min(modulesCompleted, MODULES.length),
    wheelAverageDelta,
    activeHabits,
    freezesUsed,
    cycleCompleted: !!user.cycleCompletedAt,
  };
}

/** Diffs earned tiers against what's already persisted, inserts any newly
 * crossed tier (never re-grants one already recorded), and adds up real
 * points onto the user's balance — the same one leveling.ts reads. Safe to
 * call on every page load: a tier already in user_achievements is a no-op. */
export async function evaluateAndGrantAchievements(
  userId: string,
  stats: AchievementStats
): Promise<{ progress: AchievementProgress[]; newlyUnlocked: AchievementProgress[] }> {
  const existingRows = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));
  const existingKeys = new Set(existingRows.map((r) => `${r.achievementId}:${r.tier}`));

  const newlyUnlocked: AchievementProgress[] = [];
  let bonusPoints = 0;

  for (const achievement of ACHIEVEMENTS) {
    const value = Number(stats[achievement.stat]);
    const tier = earnedTier(achievement.tiers, value);
    for (const t of achievement.tiers) {
      if (t.tier > tier) continue;
      const key = `${achievement.id}:${t.tier}`;
      if (existingKeys.has(key)) continue;

      await db
        .insert(userAchievements)
        .values({ userId, achievementId: achievement.id, tier: t.tier })
        .onConflictDoNothing();
      bonusPoints += t.points;
      newlyUnlocked.push({ achievement, earnedTier: t.tier, currentValue: value, nextTier: null });
    }
  }

  if (bonusPoints > 0) {
    // Increment in SQL (points = points + N) rather than read-then-write,
    // so this can't race with whatever else touches points same request.
    await db
      .update(users)
      .set({ points: sql`${users.points} + ${bonusPoints}` })
      .where(eq(users.id, userId));
  }

  return { progress: getAchievementsProgress(stats), newlyUnlocked };
}
