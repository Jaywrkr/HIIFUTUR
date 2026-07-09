import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { HabitCard } from "@/components/HabitCard";
import { requireUser } from "@/lib/session";
import {
  getUserPreferences,
  getHabitsForUser,
  getHabitLogs,
  getHabitFreezes,
  getWheelMeasurements,
  getModuleProgressForUser,
} from "@/lib/queries";
import { addDays, computeStreak, daysBetween, todayKey } from "@/lib/habit-utils";
import { MAX_HABITS, DAYS_TO_UNLOCK_NEXT_HABIT, DAYS_BETWEEN_WHEEL_MEASUREMENTS } from "@/lib/constants";
import { MODULES } from "@/lib/modules-content";
import { getMantraOfTheDay } from "@/lib/mantras";
import { ArrivalRitual } from "@/components/ArrivalRitual";
import { PullToRefresh } from "@/components/PullToRefresh";

export default async function DashboardPage() {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const [userHabits, measurements, moduleProgress] = await Promise.all([
    getHabitsForUser(user.id),
    getWheelMeasurements(user.id),
    getModuleProgressForUser(user.id),
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

  const completedModules = moduleProgress.filter((m) => m.completed).length;
  const doneCount = habitsWithData.filter((h) => h.doneToday).length;

  return (
    <>
      <ArrivalRitual mantra={getMantraOfTheDay()} />
      <Nav />
      <PullToRefresh>
        <main className="app-main">
          <p className="kicker">HOY</p>

          {habitsWithData.length === 0 ? (
            <div className="card mb-12">
              <p className="text-2xl mb-2">🌱</p>
              <p className="text-sm text-neutral-300 mb-1">Todavia no tienes nada que sostener.</p>
              <p className="muted">
                <Link href="/habits" className="link-accent">Crea tu primer habito</Link> — el mas
                pequeno que se te ocurra.
              </p>
            </div>
          ) : (
            <div className="mb-12">
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
                      ? "Crear habito"
                      : userHabits.length >= MAX_HABITS
                        ? "Gestionar habitos"
                        : "Desbloquear siguiente habito"
                    : "Gestionar habitos"}
                </span>
                {!canUnlockNextHabit ? (
                  <span className="text-xs text-neutral-600">siguiente en {daysUntilNextHabit}d</span>
                ) : null}
              </Link>
              <Link
                href="/modules"
                className="flex items-center justify-between py-2 text-sm text-neutral-400 hover:text-accent transition-colors"
              >
                <span>Modulos</span>
                <span className="text-xs text-neutral-600">{completedModules}/{MODULES.length}</span>
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
