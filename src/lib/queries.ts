import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  userPreferences,
  habits,
  habitLogs,
  wheelOfLifeMeasurements,
  moduleProgress,
} from "@/db/schema";

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
