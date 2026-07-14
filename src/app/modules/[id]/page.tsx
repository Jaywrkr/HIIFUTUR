import { notFound, redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/session";
import { getUserById, getUserPreferences, getModuleProgressForUser, getAccessStatus } from "@/lib/queries";
import { hasActiveAccess } from "@/lib/access";
import { evaluateCycle, executionLocked } from "@/lib/cycle-state";
import { countCompletedInCycle } from "@/lib/cycle";
import {
  getModuleById,
  getPhaseById,
  resolveFieldValue,
  MODULES,
} from "@/lib/modules-content";
import { ModuleExerciseForm } from "@/components/ModuleExerciseForm";
import { ModuleConcept, ConceptFrame, CONCEPT_CAPTIONS } from "@/components/ModuleConcept";
import { TheoryText } from "@/components/TheoryText";
import { WillpowerBatteryGame } from "@/components/WillpowerBatteryGame";
import { SystemVsGoalGame } from "@/components/SystemVsGoalGame";

export default async function ModuleDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const access = await getAccessStatus(user.id);
  if (!access || !hasActiveAccess(access)) redirect("/upgrade");

  const courseModule = getModuleById(params.id);
  if (!courseModule) notFound();

  const phase = getPhaseById(courseModule.phaseId);

  const idx = MODULES.findIndex((m) => m.id === courseModule.id);
  const nextModule = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  // One read of the user's whole course history — powers the sequential
  // gate, the current answers, and the callbacks that echo prior modules.
  const allProgress = await getModuleProgressForUser(user.id);
  const progressByModule = new Map(allProgress.map((p) => [p.moduleId, p]));
  const existing = progressByModule.get(courseModule.id);

  if (idx > 0 && !progressByModule.get(MODULES[idx - 1].id)?.completed) {
    redirect("/modules");
  }

  // Uncompleted modules beyond the first also wait for real habit
  // execution — same gate as the module list, enforced against direct URLs.
  if (idx > 0 && !existing?.completed) {
    const fullUser = await getUserById(user.id);
    if (!fullUser) redirect("/login");
    const cycle = await evaluateCycle(fullUser);
    const completedInCycle = countCompletedInCycle(allProgress, fullUser.cycleStartedAt, MODULES[0].id);
    if (executionLocked(cycle, completedInCycle)) redirect("/modules");
  }

  // Resolve the "what you already wrote" callbacks against real answers,
  // dropping any the user hasn't filled in yet.
  const callbacks = (courseModule.callbacks ?? [])
    .map((cb) => {
      const data = progressByModule.get(cb.moduleId)?.exerciseData as
        | Record<string, string>
        | undefined;
      return { label: cb.label, value: resolveFieldValue(cb.moduleId, cb.fieldId, data?.[cb.fieldId]) };
    })
    .filter((cb) => cb.value);

  // Shared across theory paragraphs AND the exercise description, so a term
  // already explained higher up on the page doesn't get underlined twice.
  const usedTerms = new Set<string>();

  return (
    <>
      <Nav />
      <main className="app-main max-w-3xl">
        <p className="kicker">
          {phase?.title} · MÓDULO {courseModule.order}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">{courseModule.title}</h1>

        {/* Audio del módulo pausado por ahora: la lógica vive en
            src/components/ModuleListenButton.tsx — para reactivarla,
            volver a montar <ModuleListenButton paragraphs={...} /> aquí. */}

        {/* Progression thread: where you're coming from. */}
        {courseModule.recap ? (
          <div className="rounded-xl border border-line bg-surface px-4 py-3 mb-8 flex gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-500 shrink-0 mt-0.5">
              Vienes de
            </span>
            <p className="text-sm text-neutral-300 leading-relaxed">{courseModule.recap}</p>
          </div>
        ) : null}

        <blockquote className="border-l-2 border-l-accent pl-4 mb-8">
          <p className="text-sm leading-relaxed text-neutral-300 italic">
            {courseModule.narrative}
          </p>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">— Jay</p>
        </blockquote>

        <div className="mb-8">
          <div className="flex flex-col gap-4">
            {courseModule.theory.map((p, i) => (
              <TheoryText key={i} text={p} usedTerms={usedTerms} />
            ))}
          </div>
          {usedTerms.size > 0 ? (
            <p className="text-xs text-neutral-500 mt-3">
              Los términos subrayados se pueden tocar para ver qué significan.
            </p>
          ) : null}
        </div>

        {/* Creative illustration of the module's core idea — modules 1 and 3
            get an interactive version instead of a static graphic, since
            those lessons (willpower depletes; a system beats a goal because
            it never skips a day) click better when felt than when read. */}
        {courseModule.concept === "willpower-battery" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["willpower-battery"]}>
            <WillpowerBatteryGame />
          </ConceptFrame>
        ) : courseModule.concept === "goal-vs-system" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["goal-vs-system"]}>
            <SystemVsGoalGame />
          </ConceptFrame>
        ) : (
          <ModuleConcept concept={courseModule.concept} />
        )}

        <div className="card mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-accent mb-2">Mantra de Jay</p>
          <p className="text-base font-bold leading-snug">&ldquo;{courseModule.mantra}&rdquo;</p>
        </div>

        {/* Callbacks: the course reflects your own prior answers back at you. */}
        {callbacks.length > 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-5 mb-8">
            <p className="text-xs uppercase tracking-widest text-accent mb-3">Lo que ya construiste</p>
            <div className="flex flex-col gap-3">
              {callbacks.map((cb) => (
                <div key={cb.label}>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">{cb.label}</p>
                  <p className="text-sm font-bold text-neutral-200">{cb.value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              Este módulo se apoya en esto. No empiezas de cero.
            </p>
          </div>
        ) : null}

        <div className="card">
          <p className="text-xs uppercase tracking-widest text-accent mb-2">Ejercicio</p>
          <h2 className="font-bold text-lg mb-2">{courseModule.exerciseTitle}</h2>
          <TheoryText
            text={courseModule.exerciseDescription}
            usedTerms={usedTerms}
            className="muted mb-6"
          />

          <ModuleExerciseForm
            moduleId={courseModule.id}
            fields={courseModule.fields}
            existingData={(existing?.exerciseData as Record<string, string>) ?? {}}
          />
        </div>

        {/* Progression thread: where you're going next. */}
        <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 mt-8">
          <p className="text-xs uppercase tracking-widest text-accent mb-2">
            {nextModule ? "Lo que sigue" : "Fin del curso"}
          </p>
          {nextModule ? (
            <p className="font-bold text-base mb-2">
              Módulo {nextModule.order}: {nextModule.title}
            </p>
          ) : null}
          <p className="text-sm text-neutral-300 leading-relaxed">{courseModule.leadsTo}</p>
        </div>
      </main>
    </>
  );
}
