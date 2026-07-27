import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { sql, eq, gte } from "drizzle-orm";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { db } from "@/db";
import { analyticsEvents, users } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { addDays } from "@/lib/habit-utils";

const FUNNEL_EVENTS = [
  { event: "registered", label: "Se registro" },
  { event: "onboarding_completed", label: "Termino onboarding" },
  { event: "habit_created", label: "Creo un hábito" },
  { event: "habit_checked", label: "Marco un hábito" },
  { event: "wheel_measured", label: "Midio su Radar de Vida" },
  { event: "module_completed", label: "Completo un módulo" },
] as const;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminAnalyticsPage() {
  const user = await requireUser();
  const adminEmail = process.env.ADMIN_EMAIL ?? "jaywrkr@gmail.com";
  if ((user.email ?? "").toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/dashboard");
  }

  const [{ count: totalUsers }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);

  const funnel = await Promise.all(
    FUNNEL_EVENTS.map(async ({ event, label }) => {
      const [row] = await db
        .select({ count: sql<number>`count(distinct ${analyticsEvents.userId})::int` })
        .from(analyticsEvents)
        .where(eq(analyticsEvents.event, event));
      return { event, label, count: row?.count ?? 0 };
    })
  );

  const since = addDays(new Date(), -14);
  const recentEvents = await db
    .select({
      day: sql<string>`to_char(${analyticsEvents.createdAt}, 'YYYY-MM-DD')`,
      event: analyticsEvents.event,
      count: sql<number>`count(*)::int`,
    })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.createdAt, since))
    .groupBy(sql`to_char(${analyticsEvents.createdAt}, 'YYYY-MM-DD')`, analyticsEvents.event)
    .orderBy(sql`to_char(${analyticsEvents.createdAt}, 'YYYY-MM-DD') desc`);

  return (
    <>
      <Nav />
      <main className="app-main">
        <PageHeader
          kicker="SOLO TU"
          title="Analítica"
          subtitle="Datos propios, sin terceros. Nada de esto se comparte ni se vende — ver /privacidad."
        />

        <div className="mb-10">
          <p className="section-title">Usuarios totales</p>
          <p className="text-4xl font-extrabold text-accent">{totalUsers}</p>
        </div>

        <div className="mb-10">
          <p className="section-title">Embudo (usuarios únicos que llegaron a cada paso)</p>
          {funnel.map((step) => (
            <div key={step.event} className="list-row">
              <p className="font-bold">{step.label}</p>
              <p className="text-accent">{step.count}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="section-title">Eventos, últimos 14 días</p>
          {recentEvents.length === 0 ? (
            <p className="muted">Todavía no hay eventos en este rango.</p>
          ) : (
            recentEvents.map((row) => (
              <div key={`${row.day}-${row.event}`} className="list-row">
                <p className="muted">
                  {row.day} · {row.event}
                </p>
                <p className="text-accent">{row.count}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
