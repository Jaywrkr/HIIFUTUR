import { notFound, redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/session";
import { getUserById, getUserPreferences, getModuleProgressForUser } from "@/lib/queries";
import { evaluateCycle, executionLocked } from "@/lib/cycle-state";
import { countCompletedInCycle } from "@/lib/cycle";
import { getModuleById, getPhaseById, MODULES } from "@/lib/modules-content";
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

  const phase = getPhaseById(courseModule.phaseId);

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

  // Uncompleted modules beyond the first also wait for real habit
  // execution — same gate as the module list, enforced against direct URLs.
  if (idx > 0 && !existing?.completed) {
    const fullUser = await getUserById(user.id);
    if (!fullUser) redirect("/login");
    const cycle = await evaluateCycle(fullUser);
    const progress = await getModuleProgressForUser(user.id);
    const completedInCycle = countCompletedInCycle(progress, fullUser.cycleStartedAt, MODULES[0].id);
    if (executionLocked(cycle, completedInCycle)) redirect("/modules");
  }

  return (
    <>
      <Nav />
      <main className="app-main max-w-3xl">
        <p className="kicker">
          {phase?.title} · MÓDULO {courseModule.order}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">{courseModule.title}</h1>

        <blockquote className="border-l-2 border-l-accent pl-4 mb-8">
          <p className="text-sm leading-relaxed text-neutral-300 italic">
            {courseModule.narrative}
          </p>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">— Jay</p>
        </blockquote>

        <div className="flex flex-col gap-4 mb-8">
          {courseModule.theory.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-neutral-300">
              {p}
            </p>
          ))}
        </div>

        <div className="card mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-accent mb-2">Mantra de Jay</p>
          <p className="text-base font-bold leading-snug">&ldquo;{courseModule.mantra}&rdquo;</p>
        </div>

        <div className="card">
          <p className="text-xs uppercase tracking-widest text-accent mb-2">Ejercicio</p>
          <h2 className="font-bold text-lg mb-2">{courseModule.exerciseTitle}</h2>
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
