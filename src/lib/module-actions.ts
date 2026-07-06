"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { moduleProgress } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { getModuleById } from "@/lib/modules-content";

export async function completeModule(moduleId: string, formData: FormData) {
  const user = await requireUser();
  const courseModule = getModuleById(moduleId);
  if (!courseModule) return;

  const exerciseData: Record<string, string> = {};
  for (const field of courseModule.fields) {
    exerciseData[field.id] = String(formData.get(field.id) ?? "").trim();
  }

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

  revalidatePath("/modules");
  redirect("/modules");
}
