import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { EditHabitRow } from "@/components/EditHabitRow";
import { requireUser } from "@/lib/session";
import { getUserPreferences, getHabitsForUser, getHabitLogs } from "@/lib/queries";
import { addDays, computeStreak, todayKey } from "@/lib/habit-utils";
import { MAX_HABITS, DAYS_TO_UNLOCK_NEXT_HABIT, DAYS_BETWEEN_HABIT_EDITS } from "@/lib/constants";

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
      const nextEditDate = habit.lastEditedAt
        ? addDays(habit.lastEditedAt, DAYS_BETWEEN_HABIT_EDITS)
        : null;
      const canEdit = !nextEditDate || new Date() >= nextEditDate;
      return {
        habit,
        streak: computeStreak(logDates),
        doneToday: logDates.includes(today),
        canEdit,
        nextEditLabel: nextEditDate ? nextEditDate.toLocaleDateString("es-MX") : null,
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
        <PageHeader
          kicker="EL SISTEMA"
          title="Gestiona tus habitos"
          subtitle={
            <>
              Marcarlos dia a dia pasa en <Link href="/dashboard" className="link-accent">Hoy</Link>.
              Aqui los creas, los editas y ves tu progreso hacia el siguiente.
            </>
          }
        />

        {habitsWithData.length === 0 ? (
          <p className="muted mb-8">Aun no tienes habitos. Crea el primero — el mas pequeno posible.</p>
        ) : (
          <div className="mb-8">
            {habitsWithData.map(({ habit, streak, doneToday, canEdit, nextEditLabel }) => (
              <EditHabitRow
                key={habit.id}
                habit={habit}
                streak={streak}
                doneToday={doneToday}
                canEdit={canEdit}
                nextEditLabel={nextEditLabel}
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
