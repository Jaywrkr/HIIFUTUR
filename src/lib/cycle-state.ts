import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, moduleProgress } from "@/db/schema";
import { getHabitsForUser, getHabitLogs, getHabitFreezes } from "@/lib/queries";
import { trackEvent } from "@/lib/analytics";
import {
  CYCLE_DAYS,
  MAX_CYCLE_FAILS,
  countExecutedDays,
  countMissedDays,
  cycleElapsed,
  dayOfCycle,
  pointsAfterReset,
  requiredExecutedDaysForNext,
} from "@/lib/cycle";

export type CycleStatus = {
  /** No anchor habit yet: only module 1 is reachable. */
  hasAnchor: boolean;
  /** Survived the 30 days — gating and resets are over for good. */
  completed: boolean;
  day: number;
  executedDays: number;
  failsUsed: number;
  /** The second miss was detected on this evaluation and the reset just ran. */
  wasReset: boolean;
};

type CycleUser = {
  id: string;
  points: number;
  cycleStartedAt: Date | null;
  cycleStartPoints: number;
  cycleCompletedAt: Date | null;
};

/**
 * Evaluates (and lazily advances) the user's 30-day cycle. Called from the
 * pages that gate on it; safe to call on every load — it only writes when
 * the cycle starts, completes, or resets.
 */
export async function evaluateCycle(user: CycleUser): Promise<CycleStatus> {
  const userHabits = await getHabitsForUser(user.id);
  const anchor = userHabits[0];

  if (!anchor) {
    return { hasAnchor: false, completed: false, day: 0, executedDays: 0, failsUsed: 0, wasReset: false };
  }

  if (user.cycleCompletedAt) {
    return { hasAnchor: true, completed: true, day: CYCLE_DAYS, executedDays: 0, failsUsed: 0, wasReset: false };
  }

  const now = new Date();

  // First evaluation for this user (habit created before cycles existed, or
  // just created): the cycle starts today, points snapshot taken now.
  if (!user.cycleStartedAt) {
    await db
      .update(users)
      .set({ cycleStartedAt: now, cycleStartPoints: user.points })
      .where(eq(users.id, user.id));
    return { hasAnchor: true, completed: false, day: 1, executedDays: 0, failsUsed: 0, wasReset: false };
  }

  const [logs, freezes] = await Promise.all([getHabitLogs(anchor.id), getHabitFreezes(anchor.id)]);
  const logDates = logs.map((l) => l.date);
  const freezeDates = freezes.map((f) => f.date);

  const missed = countMissedDays(user.cycleStartedAt, now, logDates, freezeDates);

  if (missed > MAX_CYCLE_FAILS) {
    // Third miss: the cycle resets. Modules re-lock, and half of the points
    // earned since cycle start are lost — a penalty, not a wipe. Written
    // exercises stay untouched, so re-earning modules is fast. Habits and
    // their history are never deleted.
    const pointsAfter = pointsAfterReset(user.points, user.cycleStartPoints);
    await db
      .update(users)
      .set({ points: pointsAfter, cycleStartedAt: now, cycleStartPoints: pointsAfter })
      .where(eq(users.id, user.id));
    await db
      .update(moduleProgress)
      .set({ completed: false, completedAt: null, updatedAt: now })
      .where(eq(moduleProgress.userId, user.id));
    await trackEvent(user.id, "cycle_reset", { missed, pointsLost: user.points - pointsAfter });
    return { hasAnchor: true, completed: false, day: 1, executedDays: 0, failsUsed: 0, wasReset: true };
  }

  if (cycleElapsed(user.cycleStartedAt, now)) {
    await db.update(users).set({ cycleCompletedAt: now }).where(eq(users.id, user.id));
    await trackEvent(user.id, "cycle_completed");
    return { hasAnchor: true, completed: true, day: CYCLE_DAYS, executedDays: 0, failsUsed: 0, wasReset: false };
  }

  return {
    hasAnchor: true,
    completed: false,
    day: dayOfCycle(user.cycleStartedAt, now),
    executedDays: countExecutedDays(user.cycleStartedAt, logDates, freezeDates),
    failsUsed: missed,
    wasReset: false,
  };
}

/**
 * Whether a not-yet-completed module is still execution-locked. Completed
 * modules are always accessible; sequential order is checked separately.
 */
export function executionLocked(
  status: CycleStatus,
  completedInCycle: number
): boolean {
  if (status.completed) return false;
  if (!status.hasAnchor) return true;
  return status.executedDays < requiredExecutedDaysForNext(completedInCycle);
}
