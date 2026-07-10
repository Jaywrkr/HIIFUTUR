import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { requireUser } from "@/lib/session";
import { getUserById, getUserPreferences, getModuleProgressForUser } from "@/lib/queries";
import { MODULES, PHASES } from "@/lib/modules-content";
import { evaluateCycle, executionLocked } from "@/lib/cycle-state";
import { WelcomeTour } from "@/components/WelcomeTour";
import {
  MAX_CYCLE_FAILS,
  CYCLE_DAYS,
  DAYS_PER_MODULE,
  countCompletedInCycle,
  requiredExecutedDaysForNext,
} from "@/lib/cycle";

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
          kicker="APRENDIZAJE"
          title="El camino"
          subtitle={`${completedIds.size} de ${MODULES.length} modulos completados.`}
        />

        {cycle.wasReset ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 mb-8">
            <p className="text-xs uppercase tracking-widest text-red-400 mb-1">El ciclo se reinicio</p>
            <p className="text-sm text-neutral-300">
              Fallaste dos veces en 30 dias. No perdiste el conocimiento — tus ejercicios siguen
              escritos — pero perdiste el derecho a avanzar. Ganatelo otra vez: los modulos se
              re-desbloquean con ejecucion real.
            </p>
          </div>
        ) : null}

        {!cycle.completed && cycle.hasAnchor && !cycle.wasReset ? (
          <div className="card mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent mb-1">
                Ciclo de formacion · dia {cycle.day} de {CYCLE_DAYS}
              </p>
              <p className="text-sm text-neutral-400">
                Cada {DAYS_PER_MODULE} dias de ejecucion real desbloquean el siguiente modulo.
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
            Este curso nace de mi propia transformacion: pase de un promedio de 3 a un 9 en mi
            Wheel of Life, en 8 meses. No fue un giro de 180 grados de un dia para otro — fue un
            sistema pequeño, sostenido, mes tras mes. Este es ese sistema, en 11 modulos.
          </p>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-3">— Jay</p>
        </blockquote>

        {PHASES.map((phase) => {
          const phaseModules = MODULES.filter((m) => m.phaseId === phase.id);

          return (
            <div key={phase.id} className="mb-12">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">{phase.title}</p>
              <p className="muted mb-2">{phase.description}</p>

              <div>
                {phaseModules.map((module) => {
                  const idx = MODULES.findIndex((m) => m.id === module.id);
                  const done = completedIds.has(module.id);
                  const previousDone = idx === 0 || completedIds.has(MODULES[idx - 1].id);
                  // Beyond sequential order, uncompleted modules (except the
                  // first) also wait for real habit execution.
                  const needsExecution = !done && idx > 0 && previousDone && gateLocked;
                  const locked = (!previousDone || needsExecution) && !done;

                  return (
                    <div key={module.id} className={`list-row ${locked ? "opacity-40" : ""}`}>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
                          Modulo {module.order}
                        </p>
                        <p className="font-bold">{module.title}</p>
                      </div>
                      {locked ? (
                        <span className="text-xs uppercase text-neutral-600 text-right">
                          {needsExecution
                            ? cycle.hasAnchor
                              ? `${daysMissing} dia${daysMissing === 1 ? "" : "s"} de ejecucion`
                              : "Crea tu habito primero"
                            : "Bloqueado"}
                        </span>
                      ) : (
                        <Link
                          href={`/modules/${module.id}`}
                          className={done ? "btn-secondary" : "btn-primary"}
                        >
                          {done ? "REVISAR" : "EMPEZAR"}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
