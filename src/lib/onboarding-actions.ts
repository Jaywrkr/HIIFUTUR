"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences, wheelOfLifeMeasurements } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { WHEEL_AREAS, MAX_SELECTED_AREAS } from "@/lib/constants";

const wheelAreaIds = WHEEL_AREAS.map((a) => a.id);

const onboardingSchema = z.object({
  selectedAreas: z
    .array(z.string())
    .min(1, "Elige al menos un area.")
    .max(MAX_SELECTED_AREAS, `Elige un maximo de ${MAX_SELECTED_AREAS} areas.`),
  scores: z.record(z.string(), z.coerce.number().min(1).max(10)),
});

export type OnboardingState = { error?: string };

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const user = await requireUser();

  const selectedAreas = formData.getAll("selectedAreas").map(String);
  const scores: Record<string, number> = {};
  for (const areaId of wheelAreaIds) {
    scores[areaId] = Number(formData.get(`score_${areaId}`) ?? 5);
  }

  const parsed = onboardingSchema.safeParse({ selectedAreas, scores });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos." };
  }

  await db
    .insert(userPreferences)
    .values({
      userId: user.id,
      selectedAreas: parsed.data.selectedAreas,
      initialWheelScores: parsed.data.scores,
      onboardingCompletedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: {
        selectedAreas: parsed.data.selectedAreas,
        initialWheelScores: parsed.data.scores,
        onboardingCompletedAt: new Date(),
      },
    });

  await db.insert(wheelOfLifeMeasurements).values({
    userId: user.id,
    areaScores: parsed.data.scores,
    notes: "Medicion inicial (onboarding).",
  });

  redirect("/modules");
}
