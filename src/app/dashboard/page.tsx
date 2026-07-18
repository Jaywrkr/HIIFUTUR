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
import { MODULES, PHASES } from "@/lib/modules-content";
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
  const nextPhase = nextModule ? PHASES.find((p) => p.id === nextModule.phaseId) : null;
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
              className="flex items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 mb-6 text-sm hover:bg-red-500/15 transition-colors"
            >
              <span className="text-red-300">
                ⚠ Prueba: {daysLeftInTrial(user.trialEndsAt)} día{daysLeftInTrial(user.trialEndsAt) === 1 ? "" : "s"} restante
                {daysLeftInTrial(user.trialEndsAt) === 1 ? "" : "s"} — activa y quédate con el precio de ahora
              </span>
              <span className="text-red-400 font-semibold shrink-0">Ver planes →</span>
            </Link>
          ) : null}

          {habitsWithData.length === 0 ? (
            <div className="card mb-10">
              <IconSprout className="w-7 h-7 text-accent mb-2" />
              <p className="text-sm text-neutral-300 mb-1">Todavía no tienes nada que sostener.</p>
              {firstModuleDone ? (
                <p className="muted">
                  <Link href="/habits" className="link-accent">Crea tu primer hábito</Link> — el más
                  pequeño que se te ocurra.
                </p>
              ) : (
                <p className="muted">
                  Tu primer hábito se elige al terminar el{" "}
                  <Link href={`/modules/${MODULES[0].id}`} className="link-accent">Módulo 1</Link>.
                </p>
              )}
            </div>
          ) : (
            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-5">
                <h1 className="text-3xl font-extrabold tracking-tight">Lo de hoy</h1>
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
              <div className="flex flex-col gap-3">
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
              className="block rounded-3xl bg-accent/10 border border-accent/40 p-6 mb-10 hover:bg-accent/15 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent mb-1">
                    Tu camino · {nextPhase?.title}
                  </p>
                  <p className="font-extrabold text-xl mb-1">
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
            <div className="rounded-3xl bg-surface border border-line p-6 mb-10">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">
                Tu camino · {nextPhase?.title}
              </p>
              <p className="font-extrabold text-xl mb-1">
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
            <div className="rounded-3xl bg-accent/10 border border-accent/40 p-6 mb-10">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Tu camino</p>
              <p className="font-extrabold text-xl mb-1">Completaste los {MODULES.length} módulos</p>
              <p className="muted text-sm">
                Ahora el sistema es tuyo. <Link href="/modules" className="link-accent">Vuelve a repasar</Link> cuando
                quieras.
              </p>
            </div>
          )}

          {/* Compact status band: level, points, streak — the game at a
              glance. One shared card with internal dividers instead of
              three separate boxes: same info, a third of the borders. */}
          <div className="card !p-0 grid grid-cols-3 divide-x divide-line mb-10 overflow-hidden">
            <Link href="/cuenta" className="p-4 text-center hover:bg-ink/40 transition-colors">
              <p className="text-xl font-extrabold text-accent">Nv. {level}</p>
              <div className="h-1 rounded-full bg-ink border border-line overflow-hidden my-1.5">
                <div className="h-full bg-accent rounded-full" style={{ width: `${levelPct}%` }} />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Nivel</p>
            </Link>
            <Link href="/leaderboard" className="p-4 text-center hover:bg-ink/40 transition-colors">
              <p className="text-xl font-extrabold">{user.points}</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1.5">Puntos</p>
            </Link>
            <Link href="/cuenta" className="p-4 text-center hover:bg-ink/40 transition-colors">
              <p className="text-xl font-extrabold flex items-center justify-center gap-1">
                {bestStreak > 0 ? (
                  <>
                    <IconFlame className="w-4 h-4 text-accent" /> {bestStreak}
                  </>
                ) : (
                  "—"
                )}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1.5">Racha</p>
            </Link>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Tu progreso</p>
            {/* One shared card with a divider between rows instead of four
                separate boxes — same links, same info, a lot less border. */}
            <div className="card !p-0 divide-y divide-line overflow-hidden">
              <Link
                href={userHabits.length === 0 && !firstModuleDone ? `/modules/${MODULES[0].id}` : "/habits"}
                className="flex items-center gap-4 px-5 py-4 hover:bg-ink/40 transition-colors group"
              >
                <span className="flex-1 min-w-0">
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
                  <span className="block text-xs text-neutral-500 mt-0.5">
                    {userHabits.length === 0 && !firstModuleDone
                      ? "Ahí arranca tu sistema"
                      : canUnlockNextHabit
                        ? `${userHabits.length}/${MAX_HABITS} activos`
                        : `${userHabits.length}/${MAX_HABITS} activos · siguiente ${nextHabitUnlockDate ? relativeDayLabel(nextHabitUnlockDate) : "pronto"}`}
                  </span>
                </span>
                <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
              </Link>

              <Link
                href="/modules"
                className="flex items-center gap-4 px-5 py-4 hover:bg-ink/40 transition-colors group"
              >
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-sm">Todos los módulos</span>
                  <span className="block text-xs text-neutral-500 mt-0.5">
                    {completedIds.size} de {MODULES.length} completados
                  </span>
                </span>
                <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
              </Link>

              <Link
                href="/wheel"
                className="flex items-center gap-4 px-5 py-4 hover:bg-ink/40 transition-colors group"
              >
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-sm">Wheel of Life</span>
                  <span
                    className={`block text-xs mt-0.5 ${canMeasureWheel ? "text-accent" : "text-neutral-500"}`}
                  >
                    {canMeasureWheel
                      ? "Puedes medir ahora"
                      : `Próxima medición ${nextWheelDate ? relativeDayLabel(nextWheelDate) : "pronto"}`}
                  </span>
                </span>
                <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
              </Link>

              <Link
                href="/leaderboard"
                className="flex items-center gap-4 px-5 py-4 hover:bg-ink/40 transition-colors group"
              >
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-sm">Leaderboard</span>
                  <span className="block text-xs text-neutral-500 mt-0.5">
                    Los 10 primeros, por puntos
                  </span>
                </span>
                <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
              </Link>
            </div>
          </div>
        </main>
      </PullToRefresh>
    </>
  );
}
