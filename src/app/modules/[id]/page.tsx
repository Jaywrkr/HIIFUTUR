import { notFound, redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/session";
import { getUserPreferences } from "@/lib/queries";
import { getModuleById, MODULES } from "@/lib/modules-content";
import { db } from "@/db";
import { moduleProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ModuleExerciseForm } from "@/components/ModuleExerciseForm";

export default async function ModuleDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const courseModule = getModuleById(params.id);
  if (!courseModule) notFound();

  const idx = MODULES.findIndex((m) => m.id === courseModule.id);
  if (idx > 0) {
    const [prev] = await db
      .select()
      .from(moduleProgress)
      .where(
        and(eq(moduleProgress.userId, user.id), eq(moduleProgress.moduleId, MODULES[idx - 1].id))
      )
      .limit(1);
    if (!prev?.completed) redirect("/modules");
  }

  const [existing] = await db
    .select()
    .from(moduleProgress)
    .where(and(eq(moduleProgress.userId, user.id), eq(moduleProgress.moduleId, courseModule.id)))
    .limit(1);

  return (
    <>
      <Nav />
      <main className="app-main max-w-2xl">
        <p className="kicker">MODULO {courseModule.order}</p>
        <h1 className="text-2xl font-bold uppercase mb-6">{courseModule.title}</h1>

        <div className="flex flex-col gap-4 mb-10">
          {courseModule.theory.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-neutral-300">
              {p}
            </p>
          ))}
        </div>

        <div className="card">
          <p className="text-xs uppercase tracking-widest text-accent mb-2">Ejercicio</p>
          <h2 className="font-bold uppercase mb-2">{courseModule.exerciseTitle}</h2>
          <p className="muted mb-6">{courseModule.exerciseDescription}</p>

          <ModuleExerciseForm
            moduleId={courseModule.id}
            fields={courseModule.fields}
            existingData={(existing?.exerciseData as Record<string, string>) ?? {}}
          />
        </div>
      </main>
    </>
  );
}
