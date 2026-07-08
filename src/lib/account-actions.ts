"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/session";

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
