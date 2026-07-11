"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, sql, ne, and } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { rateLimit, retryAfterText } from "@/lib/rate-limit";

export type UpdateNameState = { error?: string; ok?: boolean };

const nameSchema = z.string().trim().min(1, "Escribe tu nombre.").max(80);

export async function updateName(
  _prevState: UpdateNameState,
  formData: FormData
): Promise<UpdateNameState> {
  const user = await requireUser();

  const limited = rateLimit(`update-name:${user.id}`, { limit: 10, windowMs: 60 * 60_000 });
  if (!limited.ok) {
    return { error: `Demasiados cambios seguidos. Intenta de nuevo en ${retryAfterText(limited.retryAfterSeconds)}.` };
  }

  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nombre inválido." };
  }

  const [nameTaken] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(sql`lower(${users.name}) = lower(${parsed.data})`, ne(users.id, user.id)))
    .limit(1);

  if (nameTaken) {
    return { error: "Ese nombre ya está en uso. Elige otro." };
  }

  try {
    await db.update(users).set({ name: parsed.data }).where(eq(users.id, user.id));
  } catch {
    return { error: "Ese nombre ya está en uso. Elige otro." };
  }
  revalidatePath("/cuenta");
  revalidatePath("/leaderboard");
  return { ok: true };
}

export type DeleteAccountState = { error?: string };

// Deletes the user row; every other table (habits, logs, freezes,
// preferences, wheel measurements, module progress, reset tokens)
// cascades via its FK — see src/db/schema.ts onDelete: "cascade".
export async function deleteAccount(confirmEmail: string): Promise<DeleteAccountState> {
  const user = await requireUser();

  const limited = rateLimit(`delete-account:${user.id}`, { limit: 5, windowMs: 60 * 60_000 });
  if (!limited.ok) {
    return { error: `Demasiados intentos. Intenta de nuevo en ${retryAfterText(limited.retryAfterSeconds)}.` };
  }

  if (confirmEmail.trim().toLowerCase() !== user.email?.toLowerCase()) {
    return { error: "El email no coincide. Escribelo exactamente como aparece arriba." };
  }

  await db.delete(users).where(eq(users.id, user.id));
  return {};
}
