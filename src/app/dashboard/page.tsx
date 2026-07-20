import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { HabitCard } from "@/components/HabitCard";
import { requireUser } from "@/lib/session";
import {
  getUserById,
  getUserPreferences,
  getHabitsForUser,
  getHabitLogs,
  getHabitFreezes,
  getWheelMeasurements,
  getModuleProgressForUser,
} from "@/lib/queries";
import { addDays, computeStreak, daysBetween, relativeDayLabel, todayKey } from "@/lib/habit-utils";
import { MAX_HABITS, DAYS_TO_UNLOCK_NEXT_HABIT, DAYS_BETWEEN_WHEEL_MEASUREMENTS } from "@/lib/constants";
import { MODULES } from "@/lib/modules-content";
import { computeLevel } from "@/lib/leveling";
import { evaluateCycle, executionLocked } from "@/lib/cycle-state";
import {
  CYCLE_DAYS,
  MAX_CYCLE_FAILS,
  countCompletedInCycle,
  requiredExecutedDaysForNext,
} from "@/lib/cycle";
import { getMantraOfTheDay } from "@/lib/mantras";
import { ArrivalRitual } from "@/components/ArrivalRitual";
import { ResetReentryRitual } from "@/components/ResetReentryRitual";
import { CycleCompletionRitual } from "@/components/CycleCompletionRitual";
import { PullToRefresh } from "@/components/PullToRefresh";
import { hasActiveAccess, daysLeftInTrial } from "@/lib/access";
import { IconSprout, IconFlame } from "@/components/icons";
import { SubscriptionActivatedRitual } from "@/components/SubscriptionActivatedRitual";
import { SUBSCRIPTION_PLANS, formatUsd } from "@/lib/subscription-plans";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { activated?: string };
}) {
  const sessionUser = await requireUser();
  const prefs = await getUserPreferences(sessionUser.id);
  if (!prefs) redirect("/onboarding");

  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/login");
  if (!hasActiveAccess(user)) redirect("/upgrade");

  // Before reading anything cycle-dependent: this may reset points and
  // module progress if the user just crossed the fail threshold.
  const cycle = await evaluateCycle(user);
  if (cycle.wasReset && cycle.pointsAfterReset !== undefined) {
    user.points = cycle.pointsAfterReset;
  }

  const [userHabits, measurements, moduleProgress] = await Promise.all([
    getHabitsForUser(sessionUser.id),
    getWheelMeasurements(sessionUser.id),
    getModuleProgressForUser(sessionUser.id),
  ]);

  const today = todayKey();
  const yesterday = addDays(new Date(), -1).toISOString().slice(0, 10);
  const habitsWithData = await Promise.all(
    userHabits.map(async (habit) => {
      const logs = await getHabitLogs(habit.id);
      const freezes = await getHabitFreezes(habit.id);
      const logDates = logs.map((l) => l.date);
      const freezeDates = freezes.map((f) => f.date);
      return {
        habit,
        streak: computeStreak(logDates, freezeDates),
        doneToday: logDates.includes(today),
        missedYesterday:
          logDates.length > 0 && !logDates.includes(yesterday) && !freezeDates.includes(yesterday),
      };
    })
  );

  const lastHabit = userHabits[userHabits.length - 1];
  const nextHabitUnlockDate = lastHabit
    ? addDays(lastHabit.activatedAt ?? lastHabit.createdAt, DAYS_TO_UNLOCK_NEXT_HABIT)
    : null;
  const daysUntilNextHabit = nextHabitUnlockDate ? daysBetween(new Date(), nextHabitUnlockDate) : null;
  const canUnlockNextHabit = userHabits.length < MAX_HABITS && (!nextHabitUnlockDate || daysUntilNextHabit! <= 0);

  const latestMeasurement = measurements[0];
  const nextWheelDate = latestMeasurement
    ? addDays(latestMeasurement.measurementDate, DAYS_BETWEEN_WHEEL_MEASUREMENTS)
    : null;
  const canMeasureWheel = !nextWheelDate || new Date() >= nextWheelDate;

  const completedIds = new Set(moduleProgress.filter((m) => m.completed).map((m) => m.moduleId));
  const nextModule = MODULES.find((m) => !completedIds.has(m.id)) ?? null;
  const doneCount = habitsWithData.filter((h) => h.doneToday).length;

  // Module 1 is never execution-gated (it's how the anchor habit gets
  // chosen in the first place) — every other module also waits for real
  // execution days, same gate /modules enforces. Without this check the
  // card below would point at a module the click-through would immediately
  // bounce back from.
  const nextModuleIdx = nextModule ? MODULES.findIndex((m) => m.id === nextModule.id) : -1;
  const completedInCycle = countCompletedInCycle(moduleProgress, user.cycleStartedAt, MODULES[0].id);
  const nextModuleGateLocked =
    !!nextModule && nextModuleIdx > 0 && executionLocked(cycle, completedInCycle);
  const daysMissingForNextModule = Math.max(
    0,
    requiredExecutedDaysForNext(completedInCycle) - cycle.executedDays
  );

  // The first habit is chosen exclusively at the end of Module 1 — no
  // "create habit" UI should imply it can be created any other way.
  const firstModuleDone = completedIds.has(MODULES[0].id);

  const bestStreak = habitsWithData.reduce((max, h) => Math.max(max, h.streak), 0);
  const { level, pointsIntoLevel, nextLevelThreshold } = computeLevel(user.points);
  const levelPct = nextLevelThreshold === 0 ? 100 : Math.round((pointsIntoLevel / nextLevelThreshold) * 100);

  const justActivated =
    searchParams?.activated === "1" &&
    user.subscriptionStatus === "active" &&
    user.subscriptionPlan &&
    user.subscriptionPriceTier;

  return (
    <>
      {justActivated ? (
        <SubscriptionActivatedRitual
          planLabel={SUBSCRIPTION_PLANS[user.subscriptionPlan!].label}
          priceLabel={`${formatUsd(SUBSCRIPTION_PLANS[user.subscriptionPlan!].price[user.subscriptionPriceTier!])}${SUBSCRIPTION_PLANS[user.subscriptionPlan!].unit}`}
        />
      ) : cycle.wasReset ? (
        <ResetReentryRitual />
      ) : cycle.wasJustCompleted ? (
        <CycleCompletionRitual />
      ) : (
        <ArrivalRitual mantra={getMantraOfTheDay()} />
      )}
      <Nav />
      <PullToRefresh>
        <main className="app-main">
          {user.subscriptionStatus === "trialing" ? (
            <Link
              href="/upgrade"
              className="flex items-center justify-between gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 mb-6 text-sm hover:bg-red-500/15 transition-colors"
            >
              <span className="text-red-300">
                ⚠ {daysLeftInTrial(user.trialEndsAt)} día{daysLeftInTrial(user.trialEndsAt) === 1 ? "" : "s"} de prueba
              </span>
              <span className="text-red-400 font-semibold shrink-0">Activar →</span>
            </Link>
          ) : null}

          {habitsWithData.length === 0 ? (
            <div className="card mb-14">
              <IconSprout className="w-7 h-7 text-accent mb-2" />
              <p className="text-sm text-neutral-300 mb-1">Todavía no tienes nada que sostener.</p>
              {firstModuleDone ? (
                <p className="muted">
                  <Link href="/habits" className="link-accent">Crea tu primer hábito</Link> — el más
                  pequeño que se te ocurra.
                </p>
              ) : (
                <p className="muted">
                  Tu primer hábito se crea al terminar el{" "}
                  <Link href={`/modules/${MODULES[0].id}`} className="link-accent">Módulo 1</Link>.
                </p>
              )}
            </div>
          ) : (
            <div className="mb-14">
              <div className="flex items-baseline justify-between mb-6">
                <h1 className="text-3xl font-thin tracking-tight">Lo de hoy</h1>
                <p
                  className={
                    doneCount === habitsWithData.length
                      ? "text-xs uppercase tracking-widest text-accent font-semibold"
                      : "muted text-xs uppercase tracking-widest"
                  }
                >
                  {doneCount}/{habitsWithData.length} hecho
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {habitsWithData.map(({ habit, streak, doneToday, missedYesterday }, i) => (
                  <HabitCard
                    key={habit.id}
                    id={habit.id}
                    name={habit.name}
                    description={habit.description}
                    category={habit.category}
                    streak={streak}
                    doneToday={doneToday}
                    missedYesterday={missedYesterday}
                    isAnchor={i === 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Where the course continues — one tap from today's check-ins.
              Only a link when the module is actually reachable right now;
              otherwise it explains what's still missing instead of pointing
              at something that would just bounce back from /modules. */}
          {nextModule && !nextModuleGateLocked ? (
            <Link
              href={`/modules/${nextModule.id}`}
              className="block rounded-lg border border-accent/50 p-6 mb-14 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent mb-1">
                    Tu camino
                  </p>
                  <p className="font-bold text-xl mb-1">
                    Módulo {nextModule.order}: {nextModule.title}
                  </p>
                  <p className="muted text-sm">
                    {completedIds.size} de {MODULES.length} completados — continúa donde ibas.
                  </p>
                  {!cycle.completed && cycle.hasAnchor ? (
                    <p className="text-xs uppercase tracking-widest mt-2 text-neutral-500">
                      Ciclo: día {cycle.day}/{CYCLE_DAYS} ·{" "}
                      <span className={cycle.failsUsed >= MAX_CYCLE_FAILS ? "text-red-400 font-semibold" : ""}>
                        fallos {cycle.failsUsed}/{MAX_CYCLE_FAILS}
                      </span>
                    </p>
                  ) : null}
                </div>
                <span className="text-accent text-2xl shrink-0">→</span>
              </div>
            </Link>
          ) : nextModule && nextModuleGateLocked ? (
            <div className="rounded-lg border border-line p-6 mb-14">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">
                Tu camino
              </p>
              <p className="font-bold text-xl mb-1">
                Módulo {nextModule.order} se desbloquea con más ejecución
              </p>
              <p className="muted text-sm">
                {completedIds.size} de {MODULES.length} completados — te faltan{" "}
                {daysMissingForNextModule} día{daysMissingForNextModule === 1 ? "" : "s"} de{" "}
                <Link href="/habits" className="link-accent">hábito cumplido</Link> para abrirlo.
              </p>
              {!cycle.completed && cycle.hasAnchor ? (
                <p className="text-xs uppercase tracking-widest mt-2 text-neutral-500">
                  Ciclo: día {cycle.day}/{CYCLE_DAYS} ·{" "}
                  <span className={cycle.failsUsed >= MAX_CYCLE_FAILS ? "text-red-400 font-semibold" : ""}>
                    fallos {cycle.failsUsed}/{MAX_CYCLE_FAILS}
                  </span>
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-lg border border-accent/50 p-6 mb-14">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Tu camino</p>
              <p className="font-bold text-xl mb-1">Completaste los {MODULES.length} módulos</p>
              <p className="muted text-sm">
                Ahora el sistema es tuyo. <Link href="/modules" className="link-accent">Vuelve a repasar</Link> cuando
                quieras.
              </p>
            </div>
          )}

          {/* Compact status band: level, points, streak — the game at a
              glance. Three separate square tiles, not one divided box — same
              information, more air between each number. */}
          <div className="grid grid-cols-3 gap-4 mb-14">
            <Link
              href="/cuenta"
              className="aspect-square flex flex-col items-center justify-center gap-1.5 rounded-lg border border-line text-center hover:border-accent/40 transition-colors"
            >
              <p className="text-xl font-bold text-accent">Nv. {level}</p>
              <div className="h-1 w-12 rounded-full bg-ink border border-line overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${levelPct}%` }} />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Nivel</p>
            </Link>
            <Link
              href="/leaderboard"
              className="aspect-square flex flex-col items-center justify-center gap-1.5 rounded-lg border border-line text-center hover:border-accent/40 transition-colors"
            >
              <p className="text-xl font-bold">{user.points}</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Puntos</p>
            </Link>
            <Link
              href="/cuenta"
              className="aspect-square flex flex-col items-center justify-center gap-1.5 rounded-lg border border-line text-center hover:border-accent/40 transition-colors"
            >
              <p className="text-xl font-bold flex items-center justify-center gap-1">
                {bestStreak > 0 ? (
                  <>
                    <IconFlame className="w-4 h-4 text-accent" /> {bestStreak}
                  </>
                ) : (
                  "—"
                )}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Racha</p>
            </Link>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-5">Tu progreso</p>
            {/* Square tiles, gapped — not one divided box. Each destination
                gets its own quiet space, closer to how Open lays out its
                grid of cards than to a dense settings list. */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href={userHabits.length === 0 && !firstModuleDone ? `/modules/${MODULES[0].id}` : "/habits"}
                className="aspect-square flex flex-col justify-between rounded-lg border border-line p-6 hover:border-accent/40 transition-colors group"
              >
                <span className="text-neutral-500 group-hover:text-accent transition-colors self-end">→</span>
                <span>
                  <span className="block font-bold text-sm">
                    {userHabits.length === 0 && !firstModuleDone
                      ? "Elige tu hábito en el Módulo 1"
                      : canUnlockNextHabit
                        ? userHabits.length === 0
                          ? "Crear hábito"
                          : userHabits.length >= MAX_HABITS
                            ? "Gestionar hábitos"
                            : "Desbloquear siguiente hábito"
                        : "Gestionar hábitos"}
                  </span>
                  <span className="block text-xs text-neutral-500 mt-1">
                    {userHabits.length === 0 && !firstModuleDone
                      ? "Ahí arranca tu sistema"
                      : canUnlockNextHabit
                        ? `${userHabits.length}/${MAX_HABITS} activos`
                        : `${userHabits.length}/${MAX_HABITS} activos · siguiente ${nextHabitUnlockDate ? relativeDayLabel(nextHabitUnlockDate) : "pronto"}`}
                  </span>
                </span>
              </Link>

              <Link
                href="/modules"
                className="aspect-square flex flex-col justify-between rounded-lg border border-line p-6 hover:border-accent/40 transition-colors group"
              >
                <span className="text-neutral-500 group-hover:text-accent transition-colors self-end">→</span>
                <span>
                  <span className="block font-bold text-sm">Todos los módulos</span>
                  <span className="block text-xs text-neutral-500 mt-1">
                    {completedIds.size} de {MODULES.length} completados
                  </span>
                </span>
              </Link>

              <Link
                href="/wheel"
                className="aspect-square flex flex-col justify-between rounded-lg border border-line p-6 hover:border-accent/40 transition-colors group"
              >
                <span className="text-neutral-500 group-hover:text-accent transition-colors self-end">→</span>
                <span>
                  <span className="block font-bold text-sm">Wheel of Life</span>
                  <span
                    className={`block text-xs mt-1 ${canMeasureWheel ? "text-accent" : "text-neutral-500"}`}
                  >
                    {canMeasureWheel
                      ? "Puedes medir ahora"
                      : `Próxima medición ${nextWheelDate ? relativeDayLabel(nextWheelDate) : "pronto"}`}
                  </span>
                </span>
              </Link>

              <Link
                href="/leaderboard"
                className="aspect-square flex flex-col justify-between rounded-lg border border-line p-6 hover:border-accent/40 transition-colors group"
              >
                <span className="text-neutral-500 group-hover:text-accent transition-colors self-end">→</span>
                <span>
                  <span className="block font-bold text-sm">Leaderboard</span>
                  <span className="block text-xs text-neutral-500 mt-1">
                    Los 10 primeros, por puntos
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </main>
      </PullToRefresh>
    </>
  );
}
