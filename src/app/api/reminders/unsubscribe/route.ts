import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyUnsubscribeToken } from "@/lib/reminder-token";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("uid");
  const token = request.nextUrl.searchParams.get("token");

  if (!userId || !token || !verifyUnsubscribeToken(userId, token)) {
    return NextResponse.json({ error: "Enlace invalido." }, { status: 400 });
  }

  await db.update(users).set({ remindersEnabled: false }).where(eq(users.id, userId));

  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="es">
      <head><meta charset="utf-8" /><title>EJECUTA</title></head>
      <body style="font-family: sans-serif; background: #0F0C09; color: #F2ECE2; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0;">
        <p>Listo. No te vamos a mandar mas recordatorios.</p>
      </body>
    </html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
