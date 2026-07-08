"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { habits, habitLogs } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { getHabitsForUser } from "@/lib/queries";
import {
  HABIT_CATEGORIES,
  MAX_HABITS,
  DAYS_TO_UNLOCK_NEXT_HABIT,
  DAYS_BETWEEN_HABIT_EDITS,
} from "@/lib/constants";
import { addDays, todayKey } from "@/lib/habit-utils";

const categoryIds = HABIT_CATEGORIES.map((c) => c.id);

const habitSchema = z.object({
  name: z.string().min(1, "Ponle un nombre.").max(80),
  description: z.string().min(1, "Describe la version minima de este habito.").max(240),
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
    return { error: `Ya tienes el maximo de ${MAX_HABITS} habitos.` };
  }

  const lastHabit = existing[existing.length - 1];
  if (lastHabit) {
    const unlockDate = addDays(lastHabit.activatedAt ?? lastHabit.createdAt, DAYS_TO_UNLOCK_NEXT_HABIT);
    if (new Date() < unlockDate) {
      return {
        error: `Tu siguiente habito se desbloquea el ${unlockDate.toLocaleDateString("es-MX")}.`,
      };
    }
  }

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos." };
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
  } else {
    await db.insert(habitLogs).values({ habitId, date, completed: true });
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

  if (!habit) return { error: "Habito no encontrado." };

  if (habit.lastEditedAt) {
    const nextEditDate = addDays(habit.lastEditedAt, DAYS_BETWEEN_HABIT_EDITS);
    if (new Date() < nextEditDate) {
      return {
        error: `Ya editaste este habito. Puedes volver a editarlo el ${nextEditDate.toLocaleDateString("es-MX")}.`,
      };
    }
  }

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos." };
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
