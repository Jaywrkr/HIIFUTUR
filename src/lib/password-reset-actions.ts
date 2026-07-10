"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit, clientIpFromHeaders, retryAfterText } from "@/lib/rate-limit";

export type ForgotPasswordState = { message?: string };

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();

  const genericMessage = "Si ese email existe, te enviamos un enlace para recuperar tu cuenta.";

  // Freno de spam de correos de recuperacion (por IP y por email). El mensaje de
  // throttling es por IP, asi que no revela si el email esta registrado.
  const h = headers();
  const ip = clientIpFromHeaders(h.get("x-forwarded-for"), h.get("x-real-ip"));
  const perIp = rateLimit(`reset:ip:${ip}`, { limit: 5, windowMs: 15 * 60_000 });
  const perEmail = rateLimit(`reset:email:${email}`, { limit: 3, windowMs: 60 * 60_000 });
  if (!perIp.ok || !perEmail.ok) {
    const secs = Math.max(perIp.retryAfterSeconds, perEmail.retryAfterSeconds);
    return { message: `Demasiados intentos. Espera ${retryAfterText(secs)} antes de volver a pedirlo.` };
  }

  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) return { message: genericMessage };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  // Always return the same message whether or not the account exists —
  // otherwise this endpoint becomes a way to check which emails are registered.
  if (!user) return { message: genericMessage };

  const { rawToken, tokenHash } = generateResetToken();
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return { message: genericMessage };
}

export type ResetPasswordState = { error?: string };

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Mínimo 8 caracteres."),
});

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos." };
  }

  const tokenHash = hashResetToken(parsed.data.token);

  const [tokenRow] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!tokenRow) {
    return { error: "Ese enlace es invalido o ya expiro. Pide uno nuevo." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, tokenRow.userId));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, tokenRow.id));

  redirect("/login?reset=1");
}
