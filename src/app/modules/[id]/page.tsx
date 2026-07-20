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
import { ParetoDragGame } from "@/components/ParetoDragGame";
import { SystemVsGoalGame } from "@/components/SystemVsGoalGame";
import { NeverTwiceGame } from "@/components/NeverTwiceGame";
import { AnchorCascadeGame } from "@/components/AnchorCascadeGame";
import { IdentityVotesGame } from "@/components/IdentityVotesGame";
import { FrictionMeterGame } from "@/components/FrictionMeterGame";
import { TwoStoriesGame } from "@/components/TwoStoriesGame";
import { HabitChainGame } from "@/components/HabitChainGame";
import { CompassGame } from "@/components/CompassGame";
import { MantraCollectionGame } from "@/components/MantraCollectionGame";
import { getAnchorHabitOptions } from "@/lib/habit-suggestions";
import { PhotoSlot } from "@/components/PhotoSlot";

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

  // Module 1 is the only place the anchor habit gets chosen — the 5
  // options shown are ranked by the areas this person picked at onboarding
  // plus where their Wheel of Life scored lowest, not generic.
  const anchorSuggestions =
    courseModule.id === MODULES[0].id
      ? { fieldId: "habito_1", options: getAnchorHabitOptions(prefs.selectedAreas, prefs.initialWheelScores) }
      : undefined;

  return (
    <>
      <Nav />
      <main className="app-main max-w-3xl">
        <p className="kicker">
          {phase?.title} · MÓDULO {courseModule.order}
        </p>
        <h1 className="text-3xl font-thin tracking-tight mb-6">{courseModule.title}</h1>

        {/* Audio del módulo pausado por ahora: la lógica vive en
            src/components/ModuleListenButton.tsx — para reactivarla,
            volver a montar <ModuleListenButton paragraphs={...} /> aquí. */}

        {/* Progression thread: where you're coming from. */}
        {courseModule.recap ? (
          <div className="rounded-md border border-line bg-surface px-4 py-3 mb-8 flex gap-3">
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

        {/* Creative illustration of the module's core idea — some modules get
            an interactive version instead of a static graphic, since those
            lessons click better when felt than when just read. */}
        {courseModule.concept === "willpower-battery" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["willpower-battery"]}>
            <WillpowerBatteryGame />
          </ConceptFrame>
        ) : courseModule.concept === "pareto-8020" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["pareto-8020"]}>
            <ParetoDragGame />
          </ConceptFrame>
        ) : courseModule.concept === "goal-vs-system" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["goal-vs-system"]}>
            <SystemVsGoalGame />
          </ConceptFrame>
        ) : courseModule.concept === "never-twice" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["never-twice"]}>
            <NeverTwiceGame />
          </ConceptFrame>
        ) : courseModule.concept === "anchor-cascade" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["anchor-cascade"]}>
            <AnchorCascadeGame />
          </ConceptFrame>
        ) : courseModule.concept === "identity-votes" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["identity-votes"]}>
            <IdentityVotesGame />
          </ConceptFrame>
        ) : courseModule.concept === "friction-meter" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["friction-meter"]}>
            <FrictionMeterGame />
          </ConceptFrame>
        ) : courseModule.concept === "two-stories" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["two-stories"]}>
            <TwoStoriesGame />
          </ConceptFrame>
        ) : courseModule.concept === "habit-chain" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["habit-chain"]}>
            <HabitChainGame />
          </ConceptFrame>
        ) : courseModule.concept === "compass" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["compass"]}>
            <CompassGame />
          </ConceptFrame>
        ) : courseModule.concept === "mantra-collection" ? (
          <ConceptFrame caption={CONCEPT_CAPTIONS["mantra-collection"]}>
            <MantraCollectionGame
              mantras={MODULES.map((m) => ({ id: m.id, order: m.order, mantra: m.mantra }))}
            />
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
          <div className="rounded-lg border border-line bg-surface p-5 mb-8">
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

        {/* The exercise is the one thing this module actually asks you to
            do — same visual language as the module list (PhotoSlot icon +
            title), so it reads as "the session you're in", the way the
            reference highlights the class you're about to start. */}
        <div className="card">
          <div className="flex items-center gap-4 mb-5">
            <div className="shrink-0 w-14 h-14" style={{ filter: `hue-rotate(${(idx * 47) % 360}deg)` }}>
              <PhotoSlot shape="rounded" alt="" className="w-14 h-14" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Ejercicio</p>
              <h2 className="font-bold text-lg leading-tight">{courseModule.exerciseTitle}</h2>
            </div>
          </div>
          <TheoryText
            text={courseModule.exerciseDescription}
            usedTerms={usedTerms}
            className="muted mb-6"
          />

          <ModuleExerciseForm
            moduleId={courseModule.id}
            fields={courseModule.fields}
            existingData={(existing?.exerciseData as Record<string, string>) ?? {}}
            suggestionsFor={anchorSuggestions}
          />
        </div>

        {/* Progression thread: where you're going next. Same icon+title
            pattern as the exercise card and the module list — this is a
            preview, not a link, since the next module stays gated by the
            execution cycle regardless of what's shown here. */}
        <div className="rounded-lg border border-accent/40 p-5 mt-8">
          <div className="flex items-center gap-4 mb-2">
            {nextModule ? (
              <div
                className="shrink-0 w-11 h-11"
                style={{ filter: `hue-rotate(${(idx + 1) * 47 % 360}deg)` }}
              >
                <PhotoSlot shape="rounded" alt="" className="w-11 h-11" />
              </div>
            ) : null}
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-accent">
                {nextModule ? "Lo que sigue" : "Fin del curso"}
              </p>
              {nextModule ? (
                <p className="font-bold text-base leading-tight">
                  Módulo {nextModule.order}: {nextModule.title}
                </p>
              ) : null}
            </div>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">{courseModule.leadsTo}</p>
        </div>
      </main>
    </>
  );
}
