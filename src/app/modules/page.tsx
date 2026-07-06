import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/session";
import { getUserPreferences, getModuleProgressForUser } from "@/lib/queries";
import { MODULES } from "@/lib/modules-content";

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
        <h1 className="section-title text-2xl mb-1">MODULOS</h1>
        <p className="muted mb-8">
          Teoria corta. Ejercicio real. Completa en orden — cada modulo construye el siguiente.
        </p>

        <div className="flex flex-col gap-3">
          {MODULES.map((module, idx) => {
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
                    className={done ? "btn-secondary" : "btn-primary mt-0"}
                  >
                    {done ? "REVISAR" : "EMPEZAR"}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
