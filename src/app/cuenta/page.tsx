import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import { EditNameSection } from "@/components/EditNameSection";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { MiPlanCard } from "@/components/MiPlanSection";
import { IconUser, IconMail, IconLock, IconBell, IconFlame } from "@/components/icons";
import { requireUser } from "@/lib/session";
import { getUserById, getHabitsForUser, getHabitLogs, getHabitFreezes } from "@/lib/queries";
import { computeStreak, daysBetween, todayKey, addDays } from "@/lib/habit-utils";
import { computeLongestStreak, STREAK_MILESTONES } from "@/lib/habit-stats";
import { computeLevel, POINTS_PER_CHECK } from "@/lib/leveling";
import { daysLeftInTrial } from "@/lib/access";
import { SUBSCRIPTION_PLANS, formatUsd } from "@/lib/subscription-plans";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CuentaPage() {
  const sessionUser = await requireUser();
  const user = await getUserById(sessionUser.id);
  if (!user) return null;
  const userHabits = await getHabitsForUser(user.id);

  const habitsWithData = await Promise.all(
    userHabits.map(async (habit) => {
      const logs = await getHabitLogs(habit.id);
      const freezes = await getHabitFreezes(habit.id);
      const logDates = logs.map((l) => l.date);
      const freezeDates = freezes.map((f) => f.date);
      return {
        logDates,
        freezeDates,
        streak: computeStreak(logDates, freezeDates),
        longestStreak: computeLongestStreak(logDates, freezeDates),
      };
    })
  );

  const bestCurrentStreak = habitsWithData.reduce((max, h) => Math.max(max, h.streak), 0);
  const bestEverStreak = habitsWithData.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const allLogDates = new Set(habitsWithData.flatMap((h) => h.logDates));
  const daysTogether = daysBetween(user.createdAt, new Date());

  const { level, pointsIntoLevel, pointsToNextLevel, nextLevelThreshold } = computeLevel(user.points);
  const progressPct = nextLevelThreshold === 0 ? 100 : Math.round((pointsIntoLevel / nextLevelThreshold) * 100);

  const today = todayKey();
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(new Date(today), -(6 - i)));
  const yesterdayKey = addDays(new Date(today), -1).toISOString().slice(0, 10);
  const missedYesterday = userHabits.length > 0 && !allLogDates.has(yesterdayKey);

  const nextMilestone = STREAK_MILESTONES.find((m) => m > bestCurrentStreak);

  return (
    <>
      <Nav />
      <main className="app-main">
        {/* Header: name + level */}
        <div className="card mb-6 text-center">
          <p className="kicker mx-auto">TU PERFIL</p>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">{user.name?.trim() || "Usuario"}</h1>
          <p className="muted text-sm mb-5">{daysTogether} días en EJECUTA</p>

          <div className="flex items-center justify-center gap-8 mb-5">
            <div>
              <p className="text-2xl font-extrabold text-accent">Nv. {level}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Nivel</p>
            </div>
            <div className="w-px h-10 bg-line" />
            <div>
              <p className="text-2xl font-extrabold">{user.points}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Puntos</p>
            </div>
          </div>

          <div className="max-w-xs mx-auto text-left">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Progreso al Nv. {level + 1}</span>
              <span>{pointsIntoLevel}/{nextLevelThreshold}</span>
            </div>
            <div className="h-2 rounded-full bg-ink border border-line overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {pointsToNextLevel} puntos más · cada hábito marcado suma {POINTS_PER_CHECK}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="card mb-10">
          <p className="section-title">Tu racha</p>
          <div className="flex items-center justify-between gap-2 mb-4">
            {last7.map((d) => {
              const key = d.toISOString().slice(0, 10);
              const hit = allLogDates.has(key);
              return (
                <div key={key} className="flex flex-col items-center gap-1 flex-1">
                  <IconFlame className={`w-5 h-5 ${hit ? "text-accent" : "text-neutral-500"}`} />
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                    {d.toLocaleDateString("es-MX", { weekday: "narrow" })}
                  </span>
                </div>
              );
            })}
          </div>

          {missedYesterday ? (
            <p className="text-xs text-amber-500 mb-4">Ayer se quedó sin marcar.</p>
          ) : null}

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border border-line rounded-md py-3">
              <p className="text-xl font-extrabold">{bestCurrentStreak}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Racha actual</p>
            </div>
            <div className="border border-line rounded-md py-3">
              <p className="text-xl font-extrabold">{bestEverStreak}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Mejor racha</p>
            </div>
          </div>

          {nextMilestone ? (
            <p className="text-xs text-neutral-400 mt-4">
              Siguiente meta: {nextMilestone} días seguidos ({nextMilestone - bestCurrentStreak} por delante)
            </p>
          ) : null}
        </div>

        <MiPlanCard
          status={user.subscriptionStatus}
          plan={user.subscriptionPlan ? SUBSCRIPTION_PLANS[user.subscriptionPlan].label : null}
          priceLabel={
            user.subscriptionPlan && user.subscriptionPriceTier
              ? `${formatUsd(SUBSCRIPTION_PLANS[user.subscriptionPlan].price[user.subscriptionPriceTier])}${SUBSCRIPTION_PLANS[user.subscriptionPlan].unit}`
              : null
          }
          nextBillingDate={
            user.subscriptionCurrentPeriodEnd
              ? user.subscriptionCurrentPeriodEnd.toLocaleDateString("es-MX")
              : null
          }
          daysLeftInTrial={daysLeftInTrial(user.trialEndsAt)}
        />

        {/* Account settings */}
        <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Tu cuenta</p>

        <div className="card !p-0 mb-6 divide-y divide-line overflow-hidden">
          <div className="px-6 py-5 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
              <IconUser className="w-5 h-5 text-accent" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Nombre</p>
              <EditNameSection initialName={user.name ?? ""} />
            </div>
          </div>

          <div className="px-6 py-5 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
              <IconMail className="w-5 h-5 text-accent" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Email</p>
              <p className="font-bold truncate">{user.email}</p>
            </div>
          </div>

          <Link
            href="/forgot-password"
            className="px-6 py-5 flex items-center gap-4 hover:bg-accent/5 transition-colors group"
          >
            <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
              <IconLock className="w-5 h-5 text-accent" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Contraseña</p>
              <p className="font-bold text-sm">Cambiar mi contraseña</p>
            </div>
            <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
          </Link>

          <div className="px-6 py-5 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
              <IconBell className="w-5 h-5 text-accent" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Notificaciones push</p>
              <PushNotificationToggle />
            </div>
          </div>
        </div>

        <div className="card !p-0 mb-6 divide-y divide-line overflow-hidden">
          <Link
            href="/terminos"
            className="px-6 py-4 flex items-center justify-between text-sm hover:bg-accent/5 transition-colors group"
          >
            <span className="text-neutral-300">Términos de uso</span>
            <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
          </Link>
          <Link
            href="/privacidad"
            className="px-6 py-4 flex items-center justify-between text-sm hover:bg-accent/5 transition-colors group"
          >
            <span className="text-neutral-300">Política de privacidad</span>
            <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
          </Link>
          <Link
            href="/changelog"
            className="px-6 py-4 flex items-center justify-between text-sm hover:bg-accent/5 transition-colors group"
          >
            <span className="text-neutral-300">Novedades de la app</span>
            <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
          </Link>
        </div>

        <div className="rounded-lg border border-red-500/25 bg-red-500/5 px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-red-400/80 mb-3">Zona de riesgo</p>
          <DeleteAccountSection userEmail={user.email ?? ""} />
        </div>
      </main>
    </>
  );
}
