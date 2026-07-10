"use server";

import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { habits, habitLogs, habitFreezes, users } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { getHabitsForUser, getHabitLogs, getHabitFreezes } from "@/lib/queries";
import {
  HABIT_CATEGORIES,
  MAX_HABITS,
  DAYS_TO_UNLOCK_NEXT_HABIT,
  DAYS_BETWEEN_HABIT_EDITS,
  DAYS_BETWEEN_STREAK_FREEZES,
} from "@/lib/constants";
import { POINTS_PER_CHECK } from "@/lib/leveling";
import { addDays, todayKey } from "@/lib/habit-utils";
import { trackEvent } from "@/lib/analytics";

const categoryIds = HABIT_CATEGORIES.map((c) => c.id);

const habitSchema = z.object({
  name: z.string().min(1, "Ponle un nombre.").max(80),
  description: z.string().min(1, "Describe la versión mínima de este hábito.").max(240),
  category: z.enum(categoryIds as [string, ...string[]]),
});

export type HabitFormState = { error?: string };

export async function createHabit(
  _prevState: HabitFormState,
  formData: FormData
): Promise<HabitFormState> {
  const user = await requireUser();

  const existing = await getHabitsForUser(user.id);
  if (existing.length >= MAX_HABITS) {
    return { error: `Ya tienes el máximo de ${MAX_HABITS} hábitos.` };
  }

  const lastHabit = existing[existing.length - 1];
  if (lastHabit) {
    const unlockDate = addDays(lastHabit.activatedAt ?? lastHabit.createdAt, DAYS_TO_UNLOCK_NEXT_HABIT);
    if (new Date() < unlockDate) {
      return {
        error: `Tu siguiente hábito se desbloquea el ${unlockDate.toLocaleDateString("es-MX")}.`,
      };
    }
  }

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await db.insert(habits).values({
    userId: user.id,
    name: parsed.data.name.trim(),
    description: parsed.data.description.trim(),
    category: parsed.data.category,
    orderIndex: existing.length,
    status: "active",
    activatedAt: new Date(),
  });

  await trackEvent(user.id, "habit_created", { category: parsed.data.category });

  revalidatePath("/habits");
  return {};
}

export async function toggleHabitToday(habitId: string) {
  const user = await requireUser();

  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, user.id)))
    .limit(1);

  if (!habit) return;

  const date = todayKey();
  const [existingLog] = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .limit(1);

  if (existingLog) {
    await db.delete(habitLogs).where(eq(habitLogs.id, existingLog.id));
    await db
      .update(users)
      .set({ points: sql`greatest(${users.points} - ${POINTS_PER_CHECK}, 0)` })
      .where(eq(users.id, user.id));
  } else {
    await db.insert(habitLogs).values({ habitId, date, completed: true });
    await db
      .update(users)
      .set({ points: sql`${users.points} + ${POINTS_PER_CHECK}` })
      .where(eq(users.id, user.id));
    await trackEvent(user.id, "habit_checked", { category: habit.category });
  }

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function updateHabit(
  habitId: string,
  _prevState: HabitFormState,
  formData: FormData
): Promise<HabitFormState> {
  const user = await requireUser();

  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, user.id)))
    .limit(1);

  if (!habit) return { error: "Hábito no encontrado." };

  if (habit.lastEditedAt) {
    const nextEditDate = addDays(habit.lastEditedAt, DAYS_BETWEEN_HABIT_EDITS);
    if (new Date() < nextEditDate) {
      return {
        error: `Ya editaste este hábito. Puedes volver a editarlo el ${nextEditDate.toLocaleDateString("es-MX")}.`,
      };
    }
  }

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await db
    .update(habits)
    .set({
      name: parsed.data.name.trim(),
      description: parsed.data.description.trim(),
      category: parsed.data.category,
      lastEditedAt: new Date(),
    })
    .where(eq(habits.id, habitId));

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return {};
}

export async function freezeStreak(habitId: string): Promise<HabitFormState> {
  const user = await requireUser();

  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, user.id)))
    .limit(1);

  if (!habit) return { error: "Hábito no encontrado." };

  if (habit.lastFreezeUsedAt) {
    const nextFreezeDate = addDays(habit.lastFreezeUsedAt, DAYS_BETWEEN_STREAK_FREEZES);
    if (new Date() < nextFreezeDate) {
      return {
        error: `Ya usaste tu congelamiento. El siguiente está disponible el ${nextFreezeDate.toLocaleDateString("es-MX")}.`,
      };
    }
  }

  const yesterday = addDays(new Date(), -1).toISOString().slice(0, 10);
  const logs = await getHabitLogs(habitId);
  const freezes = await getHabitFreezes(habitId);
  const logDates = logs.map((l) => l.date);
  const freezeDates = freezes.map((f) => f.date);

  if (logDates.includes(yesterday) || freezeDates.includes(yesterday)) {
    return { error: "Ayer no fue un día perdido, no hay nada que congelar." };
  }

  if (logDates.length === 0) {
    return { error: "Todavía no hay racha que proteger." };
  }

  await db.insert(habitFreezes).values({ habitId, date: yesterday });
  await db.update(habits).set({ lastFreezeUsedAt: new Date() }).where(eq(habits.id, habitId));

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return {};
}
