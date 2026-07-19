import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { requireUser } from "@/lib/session";
import { getUserById, getUserPreferences, getModuleProgressForUser } from "@/lib/queries";
import { MODULES, PHASES } from "@/lib/modules-content";
import { evaluateCycle, executionLocked } from "@/lib/cycle-state";
import { WelcomeTour } from "@/components/WelcomeTour";
import { hasActiveAccess } from "@/lib/access";
import {
  MAX_CYCLE_FAILS,
  CYCLE_DAYS,
  DAYS_PER_MODULE,
  countCompletedInCycle,
  requiredExecutedDaysForNext,
} from "@/lib/cycle";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ModulesPage({
  searchParams,
}: {
  searchParams?: { bienvenida?: string };
}) {
  const sessionUser = await requireUser();
  const prefs = await getUserPreferences(sessionUser.id);
  if (!prefs) redirect("/onboarding");

  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/login");
  if (!hasActiveAccess(user)) redirect("/upgrade");

  const cycle = await evaluateCycle(user);
  const progress = await getModuleProgressForUser(user.id);
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.moduleId));
  const completedInCycle = countCompletedInCycle(progress, user.cycleStartedAt, MODULES[0].id);
  const gateLocked = executionLocked(cycle, completedInCycle);
  const daysMissing = Math.max(0, requiredExecutedDaysForNext(completedInCycle) - cycle.executedDays);

  return (
    <>
      {searchParams?.bienvenida === "1" ? <WelcomeTour /> : null}
      <Nav />
      <main className="app-main">
        <PageHeader
          kicker="APRENDIZAJE · 1 DE 3"
          title="El camino"
          subtitle={`${completedIds.size} de ${MODULES.length} módulos completados. Aquí aprendes — la acción pasa en Hábitos, el control en Wheel of Life.`}
        />

        {cycle.wasReset ? (
          <div className="rounded-lg border border-accent/50 p-5 mb-8">
            <p className="text-xs uppercase tracking-widest text-accent mb-1">El ciclo se reinició. Tú no.</p>
            <p className="text-sm text-neutral-300">
              No perdiste todo: tus ejercicios siguen escritos y conservas la mitad de tus puntos.
              Los módulos se re-desbloquean con ejecución real, empezando ahora.
            </p>
          </div>
        ) : null}

        {!cycle.completed && cycle.hasAnchor && !cycle.wasReset ? (
          <div className="card mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent mb-1">
                Ciclo de formación · día {cycle.day} de {CYCLE_DAYS}
              </p>
              <p className="text-sm text-neutral-400">
                Cada {DAYS_PER_MODULE} días de ejecución real desbloquean el siguiente módulo.
              </p>
            </div>
            <p
              className={`text-xs uppercase tracking-widest shrink-0 ${
                cycle.failsUsed >= MAX_CYCLE_FAILS ? "text-red-400 font-semibold" : "text-neutral-500"
              }`}
            >
              Fallos {cycle.failsUsed}/{MAX_CYCLE_FAILS}
            </p>
          </div>
        ) : null}

        <blockquote className="border-l-2 border-l-accent pl-4 mb-12">
          <p className="text-sm leading-relaxed text-neutral-300">
            Pasé de un 3 a un 9 en mi Wheel of Life, en 8 meses. No fue un giro de un día para
            otro — fue un sistema pequeño, sostenido, mes tras mes. Este es ese sistema, en 11
            módulos.
          </p>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-3">— Jay</p>
        </blockquote>

        {PHASES.map((phase, phaseIdx) => {
          const phaseModules = MODULES.filter((m) => m.phaseId === phase.id);
          const phaseDone = phaseModules.filter((m) => completedIds.has(m.id)).length;
          const phaseComplete = phaseDone === phaseModules.length;

          return (
            <section key={phase.id} className="mb-10">
              {/* Phase header: a clear, labeled band so each of the four
                  sections reads as its own block instead of a flat list. */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    phaseComplete
                      ? "bg-accent text-black"
                      : "border border-accent/50 text-accent"
                  }`}
                >
                  {phaseIdx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-accent truncate">
                      {phase.title}
                    </h2>
                    <span className="text-xs uppercase tracking-widest text-neutral-500 shrink-0">
                      {phaseDone}/{phaseModules.length}
                    </span>
                  </div>
                  <p className="muted mt-0.5">{phase.description}</p>
                </div>
              </div>

              <div className="card !p-0 divide-y divide-line overflow-hidden">
                {phaseModules.map((module) => {
                  const idx = MODULES.findIndex((m) => m.id === module.id);
                  const done = completedIds.has(module.id);
                  const previousDone = idx === 0 || completedIds.has(MODULES[idx - 1].id);
                  // Beyond sequential order, uncompleted modules (except the
                  // first) also wait for real habit execution.
                  const needsExecution = !done && idx > 0 && previousDone && gateLocked;
                  const locked = (!previousDone || needsExecution) && !done;

                  const lockLabel = needsExecution
                    ? cycle.hasAnchor
                      ? `${daysMissing} día${daysMissing === 1 ? "" : "s"} de ejecución`
                      : "Crea tu hábito primero"
                    : "Termina el anterior";

                  return (
                    <div
                      key={module.id}
                      className={`flex items-center gap-4 px-5 py-4 ${locked ? "opacity-70" : ""}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          done
                            ? "bg-accent text-black"
                            : locked
                              ? "border border-line text-neutral-400"
                              : "border border-accent/50 text-accent"
                        }`}
                      >
                        {done ? "✓" : locked ? "–" : module.order}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                          Módulo {module.order}
                        </p>
                        <p className="font-normal text-sm leading-tight">{module.title}</p>
                      </div>

                      {locked ? (
                        <span className="text-[11px] uppercase tracking-widest text-neutral-400 text-right shrink-0 max-w-[6.5rem] leading-tight">
                          {lockLabel}
                        </span>
                      ) : (
                        <Link
                          href={`/modules/${module.id}`}
                          className={done ? "btn-secondary shrink-0" : "btn-primary shrink-0"}
                        >
                          {done ? "REVISAR" : "EMPEZAR"}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
