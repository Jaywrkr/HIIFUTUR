"use server";

import { z } from "zod";
import { db } from "@/db";
import { feedbackMessages } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { sendFeedbackNotification } from "@/lib/email";
import { rateLimit, retryAfterText } from "@/lib/rate-limit";

const feedbackSchema = z.object({
  message: z.string().trim().min(3, "Escribe un poco más.").max(2000, "Máximo 2000 caracteres."),
  pageUrl: z.string().max(300).optional(),
});

export type FeedbackState = { error?: string; ok?: boolean };

export async function submitFeedback(
  _prevState: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const user = await requireUser();

  // Freno de spam de feedback (por usuario): evita golpear el correo de aviso.
  const limited = rateLimit(`feedback:${user.id}`, { limit: 10, windowMs: 60 * 60_000 });
  if (!limited.ok) {
    return { error: `Recibimos varios mensajes tuyos. Intenta de nuevo en ${retryAfterText(limited.retryAfterSeconds)}.` };
  }

  const parsed = feedbackSchema.safeParse({
    message: formData.get("message"),
    pageUrl: formData.get("pageUrl") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await db.insert(feedbackMessages).values({
    userId: user.id,
    message: parsed.data.message,
    pageUrl: parsed.data.pageUrl ?? null,
  });

  await sendFeedbackNotification(user.email ?? "", parsed.data.message, parsed.data.pageUrl ?? null);

  return { ok: true };
}
