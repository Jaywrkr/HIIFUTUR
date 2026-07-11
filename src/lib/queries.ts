import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  userPreferences,
  habits,
  habitLogs,
  habitFreezes,
  wheelOfLifeMeasurements,
  moduleProgress,
  pushSubscriptions,
  users,
} from "@/db/schema";

export async function getUserById(userId: string) {
  const [row] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return row ?? null;
}

/** Cheap existence check — used to catch sessions whose user was deleted
 * (account deletion, or a stale cookie from a wiped dev/test account)
 * before any write tries to use that id as a foreign key. */
export async function userExists(userId: string): Promise<boolean> {
  const [row] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  return !!row;
}

export async function getUserPreferences(userId: string) {
  const [prefs] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return prefs ?? null;
}

export async function getHabitsForUser(userId: string) {
  return db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId))
    .orderBy(habits.orderIndex);
}

export async function getHabitLogs(habitId: string) {
  return db
    .select()
    .from(habitLogs)
    .where(eq(habitLogs.habitId, habitId))
    .orderBy(desc(habitLogs.date));
}

export async function getHabitFreezes(habitId: string) {
  return db
    .select()
    .from(habitFreezes)
    .where(eq(habitFreezes.habitId, habitId))
    .orderBy(desc(habitFreezes.date));
}

export async function getLogForDate(habitId: string, date: string) {
  const [log] = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .limit(1);
  return log ?? null;
}

export async function getWheelMeasurements(userId: string) {
  return db
    .select()
    .from(wheelOfLifeMeasurements)
    .where(eq(wheelOfLifeMeasurements.userId, userId))
    .orderBy(desc(wheelOfLifeMeasurements.measurementDate));
}

export async function getModuleProgressForUser(userId: string) {
  return db
    .select()
    .from(moduleProgress)
    .where(eq(moduleProgress.userId, userId));
}

export async function getPushSubscriptionsForUser(userId: string) {
  return db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));
}

export const LEADERBOARD_SIZE = 10;

export async function getTopUsers() {
  return db
    .select({ id: users.id, name: users.name, points: users.points })
    .from(users)
    .orderBy(desc(users.points))
    .limit(LEADERBOARD_SIZE);
}
