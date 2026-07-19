"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { moduleProgress, users, habits } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { getModuleById, MODULES } from "@/lib/modules-content";
import { getHabitsForUser, getUserPreferences } from "@/lib/queries";
import { getAnchorHabitOptions } from "@/lib/habit-suggestions";
import { POINTS_PER_MODULE } from "@/lib/leveling";
import { trackEvent } from "@/lib/analytics";

export async function completeModule(moduleId: string, formData: FormData) {
  const user = await requireUser();
  const courseModule = getModuleById(moduleId);
  if (!courseModule) return;

  const exerciseData: Record<string, string> = {};
  for (const field of courseModule.fields) {
    exerciseData[field.id] = String(formData.get(field.id) ?? "").trim();
  }

  const [existing] = await db
    .select({ completed: moduleProgress.completed })
    .from(moduleProgress)
    .where(and(eq(moduleProgress.userId, user.id), eq(moduleProgress.moduleId, moduleId)))
    .limit(1);

  await db
    .insert(moduleProgress)
    .values({
      userId: user.id,
      moduleId,
      completed: true,
      completedAt: new Date(),
      exerciseData,
    })
    .onConflictDoUpdate({
      target: [moduleProgress.userId, moduleProgress.moduleId],
      set: {
        completed: true,
        completedAt: new Date(),
        exerciseData,
        updatedAt: new Date(),
      },
    });

  // Points only on the transition to completed — re-saving a finished
  // exercise, or re-earning one after a cycle reset, both qualify; editing
  // an already-completed one doesn't.
  if (!existing?.completed) {
    await db
      .update(users)
      .set({ points: sql`${users.points} + ${POINTS_PER_MODULE}` })
      .where(eq(users.id, user.id));
  }

  await trackEvent(user.id, "module_completed", { moduleId });

  // Module 1 is where the anchor habit is chosen — "elige tu hábito ancla"
  // shouldn't mean typing it twice. If this is the first habit and the
  // exercise named one, create it for real here instead of leaving it
  // stranded as text inside exerciseData that the /habits form can't see.
  if (moduleId === MODULES[0].id && exerciseData.habito_1) {
    const existingHabits = await getHabitsForUser(user.id);
    if (existingHabits.length === 0) {
      const prefs = await getUserPreferences(user.id);
      const options = getAnchorHabitOptions(prefs?.selectedAreas, prefs?.initialWheelScores);
      const chosen = options.find(
        (o) => o.name.toLowerCase() === exerciseData.habito_1.toLowerCase()
      );

      await db.insert(habits).values({
        userId: user.id,
        name: exerciseData.habito_1.slice(0, 80),
        description: chosen?.description ?? "La versión mínima que elegiste en el Módulo 1.",
        category: chosen?.category ?? options[0]?.category ?? "disciplina",
        orderIndex: 0,
        status: "active",
        activatedAt: new Date(),
      });

      await trackEvent(user.id, "habit_created", {
        category: chosen?.category ?? options[0]?.category ?? "disciplina",
        source: "module_1",
      });

      revalidatePath("/habits");
    }
  }

  revalidatePath("/modules");
  revalidatePath("/dashboard");
  redirect("/modules");
}
