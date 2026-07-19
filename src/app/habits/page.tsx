import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { CreateHabitForm } from "@/components/CreateHabitForm";
import { EditHabitRow } from "@/components/EditHabitRow";
import { UnlockBanner } from "@/components/UnlockBanner";
import { requireUser } from "@/lib/session";
import {
  getUserPreferences,
  getHabitsForUser,
  getHabitLogs,
  getHabitFreezes,
  getModuleProgressForUser,
  getAccessStatus,
} from "@/lib/queries";
import { hasActiveAccess } from "@/lib/access";
import { MODULES } from "@/lib/modules-content";
import { addDays, computeStreak, relativeDayLabel, todayKey } from "@/lib/habit-utils";
import { computeLongestStreak } from "@/lib/habit-stats";
import {
  MAX_HABITS,
  DAYS_TO_UNLOCK_NEXT_HABIT,
  DAYS_BETWEEN_HABIT_EDITS,
  DAYS_BETWEEN_STREAK_FREEZES,
} from "@/lib/constants";
import { getAnchorHabitSuggestion, OPEN_APP_SUGGESTION } from "@/lib/habit-suggestions";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function HabitsPage() {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const access = await getAccessStatus(user.id);
  if (!access || !hasActiveAccess(access)) redirect("/upgrade");

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
        nextEditLabel: nextEditDate ? relativeDayLabel(nextEditDate) : null,
        canFreeze,
        nextFreezeLabel: freezeOnCooldown ? relativeDayLabel(nextFreezeDate!) : null,
        logDates,
        freezeDates,
      };
    })
  );

  const lastHabit = userHabits[userHabits.length - 1];
  const nextUnlockDate = lastHabit
    ? addDays(lastHabit.activatedAt ?? lastHabit.createdAt, DAYS_TO_UNLOCK_NEXT_HABIT)
    : null;

  // The very first habit is exclusively unlocked by finishing Module 1 —
  // that's where the anchor habit gets chosen. Habits 2-5 don't need this.
  const firstModule = MODULES[0];
  const progress = userHabits.length === 0 ? await getModuleProgressForUser(user.id) : [];
  const firstModuleDone = progress.some((p) => p.moduleId === firstModule.id && p.completed);
  const blockedByFirstModule = userHabits.length === 0 && !firstModuleDone;

  const canCreate =
    !blockedByFirstModule &&
    userHabits.length < MAX_HABITS &&
    (!nextUnlockDate || new Date() >= nextUnlockDate);

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
          kicker="ACCIÓN · 2 DE 3"
          title="Gestiona tus hábitos"
          subtitle={
            <>
              Esta es la acción: lo que aprendes en Módulos, lo ejecutas aquí. Marcarlos día a
              día pasa en <Link href="/dashboard" className="link-accent">Hoy</Link>. Aquí los
              creas, los editas y ves tu progreso hacia el siguiente.
            </>
          }
        />

        {habitsWithData.length > 0 ? (
          <div className="flex gap-8 mb-10">
            <div>
              <p className="text-2xl font-thin text-accent">{totalDaysCompleted}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Días completados</p>
            </div>
            <div>
              <p className="text-2xl font-thin text-accent">{bestStreakEver}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Mejor racha</p>
            </div>
          </div>
        ) : null}

        {canCreate && userHabits.length > 0 && nextUnlockDate ? (
          <UnlockBanner unlockKey={nextUnlockDate.toISOString().slice(0, 10)} />
        ) : null}

        {habitsWithData.length === 0 && !blockedByFirstModule ? (
          <p className="muted mb-8">Aún no tienes hábitos. Crea el primero — el más pequeño posible.</p>
        ) : null}

        {blockedByFirstModule ? (
          <div className="rounded-lg border border-accent/50 p-6 mb-8">
            <p className="text-xs uppercase tracking-widest text-accent mb-1">Un paso antes</p>
            <p className="font-thin text-xl mb-2">Tu hábito ancla se elige en el Módulo 1</p>
            <p className="muted mb-4">
              Ahí entiendes por qué fallabas antes y eliges, sin darle mil vueltas, el hábito más
              pequeño posible para arrancar hoy.
            </p>
            <Link href={`/modules/${firstModule.id}`} className="btn-primary inline-block">
              Ir al Módulo 1
            </Link>
          </div>
        ) : null}

        {habitsWithData.length > 0 ? (
          <div className="flex flex-col gap-3 mb-8">
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
        ) : null}

        {canCreate ? (
          <CreateHabitForm suggestion={anchorSuggestion} altSuggestion={OPEN_APP_SUGGESTION} />
        ) : blockedByFirstModule ? null : userHabits.length >= MAX_HABITS ? (
          <p className="muted">Ya tienes tus {MAX_HABITS} hábitos activos. Enfocate en sostenerlos.</p>
        ) : (
          <p className="muted">
            Tu siguiente hábito se desbloquea {nextUnlockDate ? relativeDayLabel(nextUnlockDate) : "pronto"}.
            Sostener el actual es el trabajo ahora.
          </p>
        )}
      </main>
    </>
  );
}
