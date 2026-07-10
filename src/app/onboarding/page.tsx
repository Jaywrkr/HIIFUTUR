"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { completeOnboarding, type OnboardingState } from "@/lib/onboarding-actions";
import { LIFE_AREAS, MAX_SELECTED_AREAS, WHEEL_AREAS } from "@/lib/constants";

const initialState: OnboardingState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
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

  function toggleArea(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      if (prev.length >= MAX_SELECTED_AREAS) return prev;
      return [...prev, id];
    });
  }

  return (
    <div className="auth-shell">
      <div className="auth-card max-w-lg">
        <p className="kicker">PASO {step} DE 2</p>

        {step === 1 ? (
          <>
            <h1 className="auth-title">Que vas a cambiar</h1>
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
                    className={`text-left border rounded-xl px-4 py-3 uppercase text-sm tracking-wide transition-colors ${
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
          <form action={formAction}>
            <h1 className="auth-title">Dónde estás hoy</h1>
            <p className="auth-sub">Del 1 al 10, sin filtro. Esta es tu linea base.</p>

            {selected.map((id) => (
              <input key={id} type="hidden" name="selectedAreas" value={id} />
            ))}

            <div className="flex flex-col gap-4 mt-4">
              {WHEEL_AREAS.map((area) => (
                <div key={area.id}>
                  <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-400 mb-1">
                    <span>{area.label}</span>
                    <span className="text-accent">{scores[area.id]}</span>
                  </div>
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
                <SubmitButton />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
