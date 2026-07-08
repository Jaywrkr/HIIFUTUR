import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { habits, habitLogs, users } from "@/db/schema";
import { todayKey } from "@/lib/habit-utils";
import { getMantraOfTheDay } from "@/lib/mantras";
import { sendReminderEmail } from "@/lib/email";
import { signUnsubscribeToken } from "@/lib/reminder-token";

// Triggered daily by Vercel Cron (see vercel.json). Reminds users who have an
// active habit still unmarked today. Guarded by CRON_SECRET so it can't be
// triggered by randoms hitting the URL.

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const today = todayKey();
  const appUrl = process.env.NEXTAUTH_URL ?? "https://hiifutur.vercel.app";
  const mantra = getMantraOfTheDay();

  const pending = await db
    .select({
      userId: users.id,
      email: users.email,
      lastReminderSentAt: users.lastReminderSentAt,
      habitName: habits.name,
    })
    .from(habits)
    .innerJoin(users, eq(habits.userId, users.id))
    .leftJoin(
      habitLogs,
      and(eq(habitLogs.habitId, habits.id), eq(habitLogs.date, today))
    )
    .where(
      and(eq(habits.status, "active"), eq(users.remindersEnabled, true), isNull(habitLogs.id))
    );

  const seen = new Set<string>();
  let sent = 0;

  for (const row of pending) {
    if (seen.has(row.userId)) continue;
    seen.add(row.userId);

    if (row.lastReminderSentAt && row.lastReminderSentAt.toISOString().slice(0, 10) === today) {
      continue;
    }

    const token = signUnsubscribeToken(row.userId);
    const unsubscribeUrl = `${appUrl}/api/reminders/unsubscribe?uid=${row.userId}&token=${token}`;

    await sendReminderEmail(row.email, row.habitName, mantra, appUrl, unsubscribeUrl);
    await db.update(users).set({ lastReminderSentAt: new Date() }).where(eq(users.id, row.userId));
    sent += 1;
  }

  return NextResponse.json({ ok: true, sent });
}
