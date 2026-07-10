import Link from "next/link";
import { Nav } from "@/components/Nav";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import { EditNameSection } from "@/components/EditNameSection";
import { requireUser } from "@/lib/session";
import { getUserById, getHabitsForUser, getHabitLogs, getHabitFreezes } from "@/lib/queries";
import { computeStreak, daysBetween, todayKey, addDays } from "@/lib/habit-utils";
import { computeLongestStreak, STREAK_MILESTONES } from "@/lib/habit-stats";
import { computeLevel, POINTS_PER_CHECK } from "@/lib/leveling";

export default async function CuentaPage() {
  const sessionUser = await requireUser();
  const user = await getUserById(sessionUser.id);
  if (!user) return null;
  const userHabits = await getHabitsForUser(user.id);

  const habitsWithData = await Promise.all(
    userHabits.map(async (habit) => {
      const logs = await getHabitLogs(habit.id);
      const freezes = await getHabitFreezes(habit.id);
      const logDates = logs.map((l) => l.date);
      const freezeDates = freezes.map((f) => f.date);
      return {
        logDates,
        freezeDates,
        streak: computeStreak(logDates, freezeDates),
        longestStreak: computeLongestStreak(logDates, freezeDates),
      };
    })
  );

  const bestCurrentStreak = habitsWithData.reduce((max, h) => Math.max(max, h.streak), 0);
  const bestEverStreak = habitsWithData.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const allLogDates = new Set(habitsWithData.flatMap((h) => h.logDates));
  const daysTogether = daysBetween(user.createdAt, new Date());

  const { level, pointsIntoLevel, pointsToNextLevel, nextLevelThreshold } = computeLevel(user.points);
  const progressPct = nextLevelThreshold === 0 ? 100 : Math.round((pointsIntoLevel / nextLevelThreshold) * 100);

  const today = todayKey();
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(new Date(today), -(6 - i)));
  const yesterdayKey = addDays(new Date(today), -1).toISOString().slice(0, 10);
  const missedYesterday = userHabits.length > 0 && !allLogDates.has(yesterdayKey);

  const nextMilestone = STREAK_MILESTONES.find((m) => m > bestCurrentStreak);

  return (
    <>
      <Nav />
      <main className="app-main">
        {/* Header: name + level */}
        <div className="card mb-6 text-center">
          <p className="kicker mx-auto">TU PERFIL</p>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">{user.name?.trim() || "Usuario"}</h1>
          <p className="muted text-sm mb-5">{daysTogether} días en EJECUTA</p>

          <div className="flex items-center justify-center gap-8 mb-5">
            <div>
              <p className="text-2xl font-extrabold text-accent">Nv. {level}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Nivel</p>
            </div>
            <div className="w-px h-10 bg-line" />
            <div>
              <p className="text-2xl font-extrabold">{user.points}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Puntos</p>
            </div>
          </div>

          <div className="max-w-xs mx-auto text-left">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Progreso al Nv. {level + 1}</span>
              <span>{pointsIntoLevel}/{nextLevelThreshold}</span>
            </div>
            <div className="h-2 rounded-full bg-ink border border-line overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              {pointsToNextLevel} puntos más · cada hábito marcado suma {POINTS_PER_CHECK}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="card mb-10">
          <p className="section-title">Tu racha</p>
          <div className="flex items-center justify-between gap-2 mb-4">
            {last7.map((d) => {
              const key = d.toISOString().slice(0, 10);
              const hit = allLogDates.has(key);
              return (
                <div key={key} className="flex flex-col items-center gap-1 flex-1">
                  <span className={`text-lg ${hit ? "" : "opacity-20 grayscale"}`}>🔥</span>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-600">
                    {d.toLocaleDateString("es-MX", { weekday: "narrow" })}
                  </span>
                </div>
              );
            })}
          </div>

          {missedYesterday ? (
            <p className="text-xs text-amber-500 mb-4">Ayer se quedo sin marcar.</p>
          ) : null}

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border border-line rounded-xl py-3">
              <p className="text-xl font-extrabold">{bestCurrentStreak}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Racha actual</p>
            </div>
            <div className="border border-line rounded-xl py-3">
              <p className="text-xl font-extrabold">{bestEverStreak}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Mejor racha</p>
            </div>
          </div>

          {nextMilestone ? (
            <p className="text-xs text-neutral-600 mt-4">
              Siguiente meta: {nextMilestone} días seguidos ({nextMilestone - bestCurrentStreak} por delante)
            </p>
          ) : null}
        </div>

        {/* Account settings */}
        <div className="mb-10">
          <p className="section-title">Nombre</p>
          <div className="mb-4">
            <EditNameSection initialName={user.name ?? ""} />
          </div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Email</p>
          <p className="font-bold">{user.email}</p>
        </div>

        <div className="mb-10">
          <p className="section-title">Contraseña</p>
          <Link href="/forgot-password" className="link-accent text-sm">
            Cambiar mi contraseña
          </Link>
        </div>

        <div className="mb-10">
          <p className="section-title">Legal</p>
          <div className="flex flex-col gap-1">
            <Link href="/términos" className="link-accent text-sm">Términos de uso</Link>
            <Link href="/privacidad" className="link-accent text-sm">Política de privacidad</Link>
          </div>
        </div>

        <div>
          <p className="section-title">Zona de riesgo</p>
          <DeleteAccountSection userEmail={user.email ?? ""} />
        </div>
      </main>
    </>
  );
}
