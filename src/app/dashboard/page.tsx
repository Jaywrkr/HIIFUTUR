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
import { addDays, computeStreak, daysBetween, todayKey } from "@/lib/habit-utils";
import { MAX_HABITS, DAYS_TO_UNLOCK_NEXT_HABIT, DAYS_BETWEEN_WHEEL_MEASUREMENTS } from "@/lib/constants";
import { MODULES, PHASES } from "@/lib/modules-content";
import { computeLevel } from "@/lib/leveling";
import { evaluateCycle } from "@/lib/cycle-state";
import { CYCLE_DAYS, MAX_CYCLE_FAILS } from "@/lib/cycle";
import { getMantraOfTheDay } from "@/lib/mantras";
import { ArrivalRitual } from "@/components/ArrivalRitual";
import { PullToRefresh } from "@/components/PullToRefresh";

export default async function DashboardPage() {
  const sessionUser = await requireUser();
  const prefs = await getUserPreferences(sessionUser.id);
  if (!prefs) redirect("/onboarding");

  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/login");

  // Before reading anything cycle-dependent: this may reset points and
  // module progress if the user just hit their second miss.
  const cycle = await evaluateCycle(user);
  if (cycle.wasReset) {
    user.points = user.cycleStartPoints;
  }

  const [userHabits, measurements, moduleProgress] = await Promise.all([
    getHabitsForUser(sessionUser.id),
    getWheelMeasurements(sessionUser.id),
    getModuleProgressForUser(sessionUser.id),
  ]);

  const today = todayKey();
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

  const bestStreak = habitsWithData.reduce((max, h) => Math.max(max, h.streak), 0);
  const { level, pointsIntoLevel, nextLevelThreshold } = computeLevel(user.points);
  const levelPct = nextLevelThreshold === 0 ? 100 : Math.round((pointsIntoLevel / nextLevelThreshold) * 100);

  return (
    <>
      <ArrivalRitual mantra={getMantraOfTheDay()} />
      <Nav />
      <PullToRefresh>
        <main className="app-main">
          <p className="kicker">HOY</p>

          {cycle.wasReset ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 mb-8">
              <p className="text-xs uppercase tracking-widest text-red-400 mb-1">El ciclo se reinició</p>
              <p className="text-sm text-neutral-300">
                Fallaste dos veces en 30 días. Tus ejercicios siguen escritos, pero los módulos y
                los puntos del ciclo se perdieron. No perdiste el conocimiento — perdiste el
                derecho a avanzar. Gánatelo otra vez, hoy.
              </p>
            </div>
          ) : null}

          {habitsWithData.length === 0 ? (
            <div className="card mb-10">
              <p className="text-2xl mb-2">🌱</p>
              <p className="text-sm text-neutral-300 mb-1">Todavía no tienes nada que sostener.</p>
              <p className="muted">
                <Link href="/habits" className="link-accent">Crea tu primer hábito</Link> — el más
                pequeño que se te ocurra.
              </p>
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
                {habitsWithData.map(({ habit, streak, doneToday }, i) => (
                  <HabitCard
                    key={habit.id}
                    id={habit.id}
                    name={habit.name}
                    description={habit.description}
                    category={habit.category}
                    streak={streak}
                    doneToday={doneToday}
                    isAnchor={i === 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Where the course continues — one tap from today's check-ins. */}
          {nextModule ? (
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

          {/* Compact status band: level, points, streak — the game at a glance. */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            <Link href="/cuenta" className="card !p-4 text-center hover:border-accent/50 transition-colors">
              <p className="text-xl font-extrabold text-accent">Nv. {level}</p>
              <div className="h-1 rounded-full bg-ink border border-line overflow-hidden my-1.5">
                <div className="h-full bg-accent rounded-full" style={{ width: `${levelPct}%` }} />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Nivel</p>
            </Link>
            <Link href="/leaderboard" className="card !p-4 text-center hover:border-accent/50 transition-colors">
              <p className="text-xl font-extrabold">{user.points}</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1.5">Puntos</p>
            </Link>
            <Link href="/cuenta" className="card !p-4 text-center hover:border-accent/50 transition-colors">
              <p className="text-xl font-extrabold">{bestStreak > 0 ? `🔥 ${bestStreak}` : "—"}</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1.5">Racha</p>
            </Link>
          </div>

          <div className="border-t border-line pt-6">
            <p className="text-xs uppercase tracking-widest text-neutral-600 mb-3">Tu progreso</p>
            <div className="flex flex-col gap-1">
              <Link
                href="/habits"
                className="flex items-center justify-between py-2 text-sm text-neutral-400 hover:text-accent transition-colors"
              >
                <span>
                  {canUnlockNextHabit
                    ? userHabits.length === 0
                      ? "Crear hábito"
                      : userHabits.length >= MAX_HABITS
                        ? "Gestionar hábitos"
                        : "Desbloquear siguiente hábito"
                    : "Gestionar hábitos"}
                </span>
                {!canUnlockNextHabit ? (
                  <span className="text-xs text-neutral-600">siguiente en {daysUntilNextHabit}d</span>
                ) : null}
              </Link>
              <Link
                href="/modules"
                className="flex items-center justify-between py-2 text-sm text-neutral-400 hover:text-accent transition-colors"
              >
                <span>Todos los módulos</span>
                <span className="text-xs text-neutral-600">{completedIds.size}/{MODULES.length}</span>
              </Link>
              <Link
                href="/wheel"
                className="flex items-center justify-between py-2 text-sm text-neutral-400 hover:text-accent transition-colors"
              >
                <span>Wheel of Life</span>
                <span className="text-xs text-neutral-600">
                  {canMeasureWheel ? "medir ahora" : nextWheelDate?.toLocaleDateString("es-MX")}
                </span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center justify-between py-2 text-sm text-neutral-400 hover:text-accent transition-colors"
              >
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>
        </main>
      </PullToRefresh>
    </>
  );
}
