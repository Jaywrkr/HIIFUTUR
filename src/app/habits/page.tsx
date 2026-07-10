import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { EditHabitRow } from "@/components/EditHabitRow";
import { UnlockBanner } from "@/components/UnlockBanner";
import { requireUser } from "@/lib/session";
import { getUserPreferences, getHabitsForUser, getHabitLogs, getHabitFreezes } from "@/lib/queries";
import { addDays, computeStreak, todayKey } from "@/lib/habit-utils";
import { computeLongestStreak } from "@/lib/habit-stats";
import {
  MAX_HABITS,
  DAYS_TO_UNLOCK_NEXT_HABIT,
  DAYS_BETWEEN_HABIT_EDITS,
  DAYS_BETWEEN_STREAK_FREEZES,
} from "@/lib/constants";
import { getAnchorHabitSuggestion, OPEN_APP_SUGGESTION } from "@/lib/habit-suggestions";

export default async function HabitsPage() {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const userHabits = await getHabitsForUser(user.id);
  const today = todayKey();

  const yesterday = addDays(new Date(), -1).toISOString().slice(0, 10);

  const habitsWithData = await Promise.all(
    userHabits.map(async (habit) => {
      const logs = await getHabitLogs(habit.id);
      const freezes = await getHabitFreezes(habit.id);
      const logDates = logs.map((l) => l.date);
      const freezeDates = freezes.map((f) => f.date);

      const nextEditDate = habit.lastEditedAt
        ? addDays(habit.lastEditedAt, DAYS_BETWEEN_HABIT_EDITS)
        : null;
      const canEdit = !nextEditDate || new Date() >= nextEditDate;

      const nextFreezeDate = habit.lastFreezeUsedAt
        ? addDays(habit.lastFreezeUsedAt, DAYS_BETWEEN_STREAK_FREEZES)
        : null;
      const freezeOnCooldown = !!nextFreezeDate && new Date() < nextFreezeDate;
      const yesterdayMissed = !logDates.includes(yesterday) && !freezeDates.includes(yesterday);
      const canFreeze = logDates.length > 0 && yesterdayMissed && !freezeOnCooldown;

      return {
        habit,
        streak: computeStreak(logDates, freezeDates),
        longestStreak: computeLongestStreak(logDates, freezeDates),
        totalDays: new Set(logDates).size,
        doneToday: logDates.includes(today),
        canEdit,
        nextEditLabel: nextEditDate ? nextEditDate.toLocaleDateString("es-MX") : null,
        canFreeze,
        nextFreezeLabel: freezeOnCooldown ? nextFreezeDate!.toLocaleDateString("es-MX") : null,
        logDates,
        freezeDates,
      };
    })
  );

  const lastHabit = userHabits[userHabits.length - 1];
  const nextUnlockDate = lastHabit
    ? addDays(lastHabit.activatedAt ?? lastHabit.createdAt, DAYS_TO_UNLOCK_NEXT_HABIT)
    : null;
  const canCreate = userHabits.length < MAX_HABITS && (!nextUnlockDate || new Date() >= nextUnlockDate);

  // The anchor-habit suggestion only makes sense for the very first habit —
  // after that, the person already knows how the system feels.
  const anchorSuggestion =
    userHabits.length === 0 ? getAnchorHabitSuggestion(prefs.initialWheelScores) : null;

  const totalDaysCompleted = habitsWithData.reduce((sum, h) => sum + h.totalDays, 0);
  const bestStreakEver = habitsWithData.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  return (
    <>
      <Nav />
      <main className="app-main">
        <PageHeader
          kicker="EL SISTEMA"
          title="Gestiona tus hábitos"
          subtitle={
            <>
              Marcarlos día a día pasa en <Link href="/dashboard" className="link-accent">Hoy</Link>.
              Aquí los creas, los editas y ves tu progreso hacia el siguiente.
            </>
          }
        />

        {habitsWithData.length > 0 ? (
          <div className="flex gap-8 mb-10">
            <div>
              <p className="text-2xl font-extrabold text-accent">{totalDaysCompleted}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Días completados</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-accent">{bestStreakEver}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Mejor racha</p>
            </div>
          </div>
        ) : null}

        {canCreate && userHabits.length > 0 && nextUnlockDate ? (
          <UnlockBanner unlockKey={nextUnlockDate.toISOString().slice(0, 10)} />
        ) : null}

        {habitsWithData.length === 0 ? (
          <p className="muted mb-8">🌱 Aún no tienes hábitos. Crea el primero — el más pequeño posible.</p>
        ) : (
          <div className="mb-8">
            {habitsWithData.map(
              (
                {
                  habit,
                  streak,
                  longestStreak,
                  doneToday,
                  canEdit,
                  nextEditLabel,
                  canFreeze,
                  nextFreezeLabel,
                  logDates,
                  freezeDates,
                },
                i
              ) => (
                <EditHabitRow
                  key={habit.id}
                  habit={habit}
                  streak={streak}
                  longestStreak={longestStreak}
                  doneToday={doneToday}
                  canEdit={canEdit}
                  nextEditLabel={nextEditLabel}
                  canFreeze={canFreeze}
                  nextFreezeLabel={nextFreezeLabel}
                  isAnchor={i === 0}
                  logDates={logDates}
                  freezeDates={freezeDates}
                  habitCreatedAt={habit.createdAt}
                />
              )
            )}
          </div>
        )}

        {canCreate ? (
          <CreateHabitForm suggestion={anchorSuggestion} altSuggestion={OPEN_APP_SUGGESTION} />
        ) : userHabits.length >= MAX_HABITS ? (
          <p className="muted">Ya tienes tus {MAX_HABITS} hábitos activos. Enfocate en sostenerlos.</p>
        ) : (
          <p className="muted">
            Tu siguiente hábito se desbloquea el {nextUnlockDate?.toLocaleDateString("es-MX")}.
            Sostener el actual es el trabajo ahora.
          </p>
        )}
      </main>
    </>
  );
}
