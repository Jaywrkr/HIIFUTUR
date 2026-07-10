"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { wheelOfLifeMeasurements } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { getWheelMeasurements } from "@/lib/queries";
import { WHEEL_AREAS, DAYS_BETWEEN_WHEEL_MEASUREMENTS } from "@/lib/constants";
import { addDays } from "@/lib/habit-utils";
import { trackEvent } from "@/lib/analytics";

const wheelAreaIds = WHEEL_AREAS.map((a) => a.id);

const wheelSchema = z.record(z.string(), z.coerce.number().min(1).max(10));

export type WheelFormState = { error?: string };

export async function recordWheelMeasurement(
  _prevState: WheelFormState,
  formData: FormData
): Promise<WheelFormState> {
  const user = await requireUser();

  const measurements = await getWheelMeasurements(user.id);
  const last = measurements[0];
  if (last) {
    const nextAllowed = addDays(last.measurementDate, DAYS_BETWEEN_WHEEL_MEASUREMENTS);
    if (new Date() < nextAllowed) {
      return { error: `Tu siguiente medición está disponible el ${nextAllowed.toLocaleDateString("es-MX")}.` };
    }
  }

  const scores: Record<string, number> = {};
  for (const areaId of wheelAreaIds) {
    scores[areaId] = Number(formData.get(`score_${areaId}`) ?? 5);
  }

  const parsed = wheelSchema.safeParse(scores);
  if (!parsed.success) {
    return { error: "Datos invalidos." };
  }

  await db.insert(wheelOfLifeMeasurements).values({
    userId: user.id,
    areaScores: parsed.data,
    notes: String(formData.get("notes") ?? "").trim() || null,
  });

  await trackEvent(user.id, "wheel_measured");

  revalidatePath("/wheel");
  revalidatePath("/dashboard");
  return {};
}
