"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { moduleProgress, users } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { getModuleById } from "@/lib/modules-content";
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

  revalidatePath("/modules");
  revalidatePath("/dashboard");
  redirect("/modules");
}
