"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/session";

export type UpdateNameState = { error?: string; ok?: boolean };

const nameSchema = z.string().trim().min(1, "Escribe tu nombre.").max(80);

export async function updateName(
  _prevState: UpdateNameState,
  formData: FormData
): Promise<UpdateNameState> {
  const user = await requireUser();

  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nombre invalido." };
  }

  await db.update(users).set({ name: parsed.data }).where(eq(users.id, user.id));
  revalidatePath("/cuenta");
  return { ok: true };
}

export type DeleteAccountState = { error?: string };

// Deletes the user row; every other table (habits, logs, freezes,
// preferences, wheel measurements, module progress, reset tokens)
// cascades via its FK — see src/db/schema.ts onDelete: "cascade".
export async function deleteAccount(confirmEmail: string): Promise<DeleteAccountState> {
  const user = await requireUser();

  if (confirmEmail.trim().toLowerCase() !== user.email?.toLowerCase()) {
    return { error: "El email no coincide. Escribelo exactamente como aparece arriba." };
  }

  await db.delete(users).where(eq(users.id, user.id));
  return {};
}
