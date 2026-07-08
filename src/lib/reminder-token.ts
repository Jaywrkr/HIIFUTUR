import { createHmac, timingSafeEqual } from "crypto";

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET no esta configurado.");
  return s;
}

export function signUnsubscribeToken(userId: string): string {
  return createHmac("sha256", secret()).update(userId).digest("hex");
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = signUnsubscribeToken(userId);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
