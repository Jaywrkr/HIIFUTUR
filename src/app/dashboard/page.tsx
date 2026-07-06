import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { HabitCard } from "@/components/HabitCard";
import { requireUser } from "@/lib/session";
import {
  getUserPreferences,
  getHabitsForUser,
  getHabitLogs,
  getWheelMeasurements,
  getModuleProgressForUser,
} from "@/lib/queries";
import { addDays, computeStreak, daysBetween, todayKey } from "@/lib/habit-utils";
import { MAX_HABITS, DAYS_TO_UNLOCK_NEXT_HABIT, DAYS_BETWEEN_WHEEL_MEASUREMENTS } from "@/lib/constants";
import { MODULES } from "@/lib/modules-content";

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
      const logDates = logs.map((l) => l.date);
      return { habit, streak: computeStreak(logDates), doneToday: logDates.includes(today) };
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

  return (
    <>
      <Nav />
      <main className="app-main">
        <p className="kicker">HOY</p>
        <h1 className="section-title text-2xl mb-1">DASHBOARD</h1>
        <p className="muted mb-8">Sin ruido. Solo lo esencial.</p>

        <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div className="card">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Modulos</p>
            <p className="text-2xl font-bold">{completedModules}/{MODULES.length}</p>
            <Link href="/modules" className="link-accent text-xs">Ver modulos</Link>
          </div>

          <div className="card">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Habitos activos</p>
            <p className="text-2xl font-bold">{userHabits.length}/{MAX_HABITS}</p>
            <p className="muted text-xs mt-1">
              {canUnlockNextHabit
                ? userHabits.length >= MAX_HABITS
                  ? "Al maximo."
                  : "Siguiente habito disponible."
                : `Siguiente en ${daysUntilNextHabit} dias.`}
            </p>
          </div>

          <div className="card">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Wheel of Life</p>
            <p className="text-2xl font-bold">{measurements.length} {measurements.length === 1 ? "medicion" : "mediciones"}</p>
            {canMeasureWheel ? (
              <Link href="/wheel" className="link-accent text-xs">Medir hoy</Link>
            ) : (
              <p className="muted text-xs mt-1">Siguiente: {nextWheelDate?.toLocaleDateString("es-MX")}</p>
            )}
          </div>
        </div>

        <h2 className="section-title text-lg">TUS HABITOS DE HOY</h2>
        {habitsWithData.length === 0 ? (
          <p className="muted mb-8">
            Aun no tienes habitos activos. <Link href="/habits" className="link-accent">Crea el primero</Link>.
          </p>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
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
        )}
      </main>
    </>
  );
}
