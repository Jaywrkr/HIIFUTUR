import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { HabitCard } from "@/components/HabitCard";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { requireUser } from "@/lib/session";
import { getUserPreferences, getHabitsForUser, getHabitLogs } from "@/lib/queries";
import { addDays, computeStreak, todayKey } from "@/lib/habit-utils";
import { MAX_HABITS, DAYS_TO_UNLOCK_NEXT_HABIT } from "@/lib/constants";

export default async function HabitsPage() {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const userHabits = await getHabitsForUser(user.id);
  const today = todayKey();

  const habitsWithData = await Promise.all(
    userHabits.map(async (habit) => {
      const logs = await getHabitLogs(habit.id);
      const logDates = logs.map((l) => l.date);
      return {
        habit,
        streak: computeStreak(logDates),
        doneToday: logDates.includes(today),
      };
    })
  );

  const lastHabit = userHabits[userHabits.length - 1];
  const nextUnlockDate = lastHabit
    ? addDays(lastHabit.activatedAt ?? lastHabit.createdAt, DAYS_TO_UNLOCK_NEXT_HABIT)
    : null;
  const canCreate = userHabits.length < MAX_HABITS && (!nextUnlockDate || new Date() >= nextUnlockDate);

  return (
    <>
      <Nav />
      <main className="app-main">
        <p className="kicker">EL SISTEMA</p>
        <h1 className="section-title text-2xl mb-1">HABITOS</h1>
        <p className="muted mb-8">Hoy completaste. Manana, lo mismo.</p>

        {habitsWithData.length === 0 ? (
          <p className="muted mb-6">Aun no tienes habitos. Crea el primero — el mas pequeno posible.</p>
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

        {canCreate ? (
          <CreateHabitForm />
        ) : userHabits.length >= MAX_HABITS ? (
          <p className="muted">Ya tienes tus {MAX_HABITS} habitos activos. Enfocate en sostenerlos.</p>
        ) : (
          <p className="muted">
            Tu siguiente habito se desbloquea el {nextUnlockDate?.toLocaleDateString("es-MX")}.
            Sostener el actual es el trabajo ahora.
          </p>
        )}
      </main>
    </>
  );
}
