import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/session";
import { getUserPreferences, getModuleProgressForUser } from "@/lib/queries";
import { MODULES, PHASES } from "@/lib/modules-content";

export default async function ModulesPage() {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const progress = await getModuleProgressForUser(user.id);
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.moduleId));

  return (
    <>
      <Nav />
      <main className="app-main">
        <p className="kicker">APRENDIZAJE</p>
        <h1 className="section-title text-2xl mb-4">EL CAMINO</h1>

        <blockquote className="card border-l-2 border-l-accent mb-10">
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
            <div key={phase.id} className="mb-10">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">{phase.title}</p>
              <p className="muted mb-4">{phase.description}</p>

              <div className="flex flex-col gap-3">
                {phaseModules.map((module) => {
                  const idx = MODULES.findIndex((m) => m.id === module.id);
                  const done = completedIds.has(module.id);
                  const previousDone = idx === 0 || completedIds.has(MODULES[idx - 1].id);
                  const locked = !previousDone && !done;

                  return (
                    <div
                      key={module.id}
                      className={`card flex items-center justify-between ${locked ? "opacity-40" : ""}`}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
                          Modulo {module.order}
                        </p>
                        <p className="font-bold uppercase">{module.title}</p>
                      </div>
                      {locked ? (
                        <span className="text-xs uppercase text-neutral-600">Bloqueado</span>
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
