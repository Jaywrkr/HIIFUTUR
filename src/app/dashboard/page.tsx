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
      <main className="app-main">
        <p className="kicker">HOY</p>

        {habitsWithData.length === 0 ? (
          <div className="mb-10">
            <p className="text-sm text-neutral-300 mb-1">Todavia no tienes nada que sostener.</p>
            <p className="muted">
              <Link href="/habits" className="link-accent">Crea tu primer habito</Link> — el mas
              pequeno que se te ocurra.
            </p>
          </div>
        ) : (
          <div className="mb-10">
            <div className="flex items-baseline justify-between mb-4">
              <h1 className="text-2xl font-extrabold tracking-tight">Lo de hoy</h1>
              <p className="muted text-xs uppercase tracking-widest">
                {doneCount}/{habitsWithData.length} hecho
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {habitsWithData.map(({ habit, streak, doneToday }) => (
                <HabitCard
                  key={habit.id}
                  id={habit.id}
                  name={habit.name}
                  description={habit.description}
                  category={habit.category}
                  streak={streak}
                  doneToday={doneToday}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-neutral-500 border-t border-line pt-6">
          <Link href="/habits" className="hover:text-accent transition-colors">
            {canUnlockNextHabit
              ? userHabits.length === 0
                ? "Crear habito"
                : userHabits.length >= MAX_HABITS
                  ? "Gestionar habitos"
                  : "Desbloquear siguiente habito"
              : `Gestionar habitos · siguiente en ${daysUntilNextHabit}d`}
          </Link>
          <Link href="/modules" className="hover:text-accent transition-colors">
            Modulos {completedModules}/{MODULES.length}
          </Link>
          <Link href="/wheel" className="hover:text-accent transition-colors">
            {canMeasureWheel ? "Medir Wheel of Life" : `Wheel of Life · ${nextWheelDate?.toLocaleDateString("es-MX")}`}
          </Link>
        </div>
      </main>
    </>
  );
}
