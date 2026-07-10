"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { recordWheelMeasurement, type WheelFormState } from "@/lib/wheel-actions";
import { WHEEL_AREAS } from "@/lib/constants";

const initialState: WheelFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
      {pending ? "GUARDANDO..." : "GUARDAR MEDICION"}
    </button>
  );
}

export function WheelMeasurementForm({ lastScores }: { lastScores?: Record<string, number> }) {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(WHEEL_AREAS.map((a) => [a.id, lastScores?.[a.id] ?? 5]))
  );
  const [state, formAction] = useFormState(recordWheelMeasurement, initialState);

  return (
    <form action={formAction} className="card flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-accent">Medición de hoy</p>

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
            onChange={(e) => setScores((prev) => ({ ...prev, [area.id]: Number(e.target.value) }))}
            className="w-full accent-accent"
          />
        </div>
      ))}

      <div>
        <label className="field-label" htmlFor="notes">Notas (opcional)</label>
        <textarea id="notes" name="notes" rows={2} className="field-input w-full" placeholder="Que cambio este mes?" />
      </div>

      {state.error ? <p className="form-error">{state.error}</p> : null}

      <SubmitButton />
    </form>
  );
}
