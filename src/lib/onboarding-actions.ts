"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userPreferences, wheelOfLifeMeasurements, users } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { WHEEL_AREAS, MAX_SELECTED_AREAS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { TRIAL_DAYS } from "@/lib/subscription-plans";
import { addDays } from "@/lib/habit-utils";

const wheelAreaIds = WHEEL_AREAS.map((a) => a.id);

const onboardingSchema = z.object({
  selectedAreas: z
    .array(z.string())
    .min(1, "Elige al menos un area.")
    .max(MAX_SELECTED_AREAS, `Elige un máximo de ${MAX_SELECTED_AREAS} áreas.`),
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
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
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
    notes: "Medición inicial (onboarding).",
  });

  // Trial clock starts now, not at registration — someone who registers and
  // wanders off shouldn't burn trial days before they've even started.
  await db
    .update(users)
    .set({ trialEndsAt: addDays(new Date(), TRIAL_DAYS) })
    .where(eq(users.id, user.id));

  await trackEvent(user.id, "onboarding_completed", { areas: parsed.data.selectedAreas });

  redirect("/modules?bienvenida=1");
}
