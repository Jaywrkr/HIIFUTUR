"use client";

import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { completeOnboarding, type OnboardingState } from "@/lib/onboarding-actions";
import { LIFE_AREAS, MAX_SELECTED_AREAS, WHEEL_AREAS } from "@/lib/constants";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const initialState: OnboardingState = {};

function SubmitButton({ onOpenConfirm }: { onOpenConfirm: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button type="button" disabled={pending} onClick={onOpenConfirm} className="btn-primary w-full">
      {pending ? "GUARDANDO..." : "EMPEZAR MI SISTEMA"}
    </button>
  );
}


export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(WHEEL_AREAS.map((a) => [a.id, 5]))
  );
  const [state, formAction] = useFormState(completeOnboarding, initialState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function toggleArea(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      if (prev.length >= MAX_SELECTED_AREAS) return prev;
      return [...prev, id];
    });
  }

  return (
    <div className="auth-shell">
      <div className={`auth-card ${step === 2 ? "max-w-3xl" : "max-w-lg"}`}>
        <p className="kicker">PASO {step} DE 2</p>

        {step === 1 ? (
          <>
            <h1 className="auth-title">Qué vas a cambiar</h1>
            <p className="auth-sub">
              Elige hasta {MAX_SELECTED_AREAS} áreas. No más. El sistema funciona porque es pequeño.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              {LIFE_AREAS.map((area) => {
                const active = selected.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    className={`text-left border rounded-md px-4 py-3 uppercase text-sm tracking-wide transition-colors ${
                      active ? "border-accent text-accent" : "border-line text-neutral-400"
                    }`}
                  >
                    {area.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => setStep(2)}
              className="btn-primary w-full mt-6"
            >
              CONTINUAR
            </button>
          </>
        ) : (
          <form ref={formRef} action={formAction}>
            <h1 className="auth-title">Dónde estás hoy</h1>
            <p className="auth-sub">Del 1 al 10, sin filtro. Esta es tu línea base.</p>

            <details className="mt-3 rounded-md border border-line bg-surface px-4 py-3 group">
              <summary className="cursor-pointer text-xs uppercase tracking-widest text-accent list-none flex items-center justify-between">
                Qué es esto y por qué funciona
                <span className="text-neutral-500 group-open:rotate-90 transition-transform">›</span>
              </summary>
              <div className="mt-3 flex flex-col gap-3 text-sm text-neutral-300 leading-relaxed">
                <p>
                  Vas a medir tu <strong>Wheel of Life</strong> (rueda de la vida): una foto
                  honesta de 10 áreas de tu vida, del 1 al 10. Es una herramienta clásica de
                  coaching creada por Paul J. Meyer, y aquí es tu punto de partida — cada 30
                  días la vuelves a medir para ver qué movió tu hábito.
                </p>
                <p>
                  No es un test psicológico, pero lo que hace sí tiene respaldo:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-2 text-neutral-400">
                  <li>
                    Evaluar tu satisfacción de vida por áreas es un método válido y confiable
                    en psicología (Diener et al., 1985, <em>The Satisfaction With Life
                    Scale</em>).
                  </li>
                  <li>
                    Monitorear tu progreso hacia una meta aumenta significativamente la
                    probabilidad de lograrla — meta-análisis de 138 estudios (Harkin et al.,
                    2016, <em>Psychological Bulletin</em>).
                  </li>
                  <li>
                    Las metas específicas y medibles producen mejor desempeño que el
                    &ldquo;voy a echarle ganas&rdquo; (Locke &amp; Latham, 2002, teoría de
                    fijación de metas).
                  </li>
                </ul>
                <p className="text-neutral-500 text-xs">
                  Sé honesto: el número bajo no te castiga. Solo marca dónde el sistema puede
                  trabajar.
                </p>
              </div>
            </details>

            {selected.map((id) => (
              <input key={id} type="hidden" name="selectedAreas" value={id} />
            ))}

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
              {WHEEL_AREAS.map((area) => (
                <div key={area.id}>
                  <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-400 mb-1">
                    <span>{area.label}</span>
                    <span className="text-accent">{scores[area.id]}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-1.5">{area.description}</p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    name={`score_${area.id}`}
                    value={scores[area.id]}
                    onChange={(e) =>
                      setScores((prev) => ({ ...prev, [area.id]: Number(e.target.value) }))
                    }
                    className="w-full accent-accent"
                  />
                </div>
              ))}
            </div>

            {state.error ? <p className="form-error">{state.error}</p> : null}

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                ATRAS
              </button>
              <div className="flex-1">
                <SubmitButton onOpenConfirm={() => setConfirmOpen(true)} />
              </div>
            </div>
          </form>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Confirmas tu línea base?"
        body="Esta es tu punto de partida: una vez guardada, no vas a poder editarla — así puedes comparar contra ella de verdad en 30 días. Revísala una última vez si quieres."
        confirmLabel="Sí, así estoy hoy"
        onConfirm={() => {
          setConfirmOpen(false);
          formRef.current?.requestSubmit();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
