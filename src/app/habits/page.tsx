import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
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
        <h1 className="section-title text-2xl mb-1">GESTIONA TUS HABITOS</h1>
        <p className="muted mb-8">
          Marcarlos dia a dia pasa en <Link href="/dashboard" className="link-accent">Hoy</Link>. Aqui
          los creas y ves tu progreso hacia el siguiente.
        </p>

        {habitsWithData.length === 0 ? (
          <p className="muted mb-8">Aun no tienes habitos. Crea el primero — el mas pequeno posible.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-8">
            {habitsWithData.map(({ habit, streak, doneToday }) => (
              <div key={habit.id} className="flex items-center justify-between border-b border-line py-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-500">{habit.category}</p>
                  <p className="font-bold uppercase">{habit.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-accent uppercase tracking-widest">
                    {streak} {streak === 1 ? "dia" : "dias"}
                  </p>
                  <p className="muted text-xs">{doneToday ? "hecho hoy" : "pendiente hoy"}</p>
                </div>
              </div>
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
