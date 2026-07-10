"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { trackEvent } from "@/lib/analytics";
import { rateLimit, clientIpFromHeaders, retryAfterText } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(1, "Escribe tu nombre.").max(80),
  email: z.string().email("Email invalido."),
  password: z.string().min(8, "Mínimo 8 caracteres."),
});

export type RegisterState = {
  error?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const h = headers();
  const ip = clientIpFromHeaders(h.get("x-forwarded-for"), h.get("x-real-ip"));
  const limited = rateLimit(`register:${ip}`, { limit: 10, windowMs: 60 * 60_000 });
  if (!limited.ok) {
    return { error: `Demasiados registros. Intenta de nuevo en ${retryAfterText(limited.retryAfterSeconds)}.` };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos." };
  }

  const email = parsed.data.email.toLowerCase().trim();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { error: "Ya existe una cuenta con ese email." };
  }

  const name = parsed.data.name.trim();

  const [nameTaken] = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.name}) = lower(${name})`)
    .limit(1);

  if (nameTaken) {
    return { error: "Ese nombre ya está en uso. Elige otro." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  let newUser;
  try {
    [newUser] = await db
      .insert(users)
      .values({ name, email, passwordHash })
      .returning({ id: users.id });
  } catch {
    return { error: "Ese nombre ya está en uso. Elige otro." };
  }

  await trackEvent(newUser.id, "registered");

  redirect("/login?registered=1");
}
