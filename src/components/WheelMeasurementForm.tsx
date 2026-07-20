"use client";

import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { recordWheelMeasurement, type WheelFormState } from "@/lib/wheel-actions";
import { WHEEL_AREAS, colorForWheelArea } from "@/lib/constants";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const initialState: WheelFormState = {};

function SaveButton({ onOpenConfirm }: { onOpenConfirm: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button type="button" disabled={pending} onClick={onOpenConfirm} className="btn-primary w-full mt-2">
      {pending ? "GUARDANDO..." : "GUARDAR MEDICION"}
    </button>
  );
}

export function WheelMeasurementForm({ lastScores }: { lastScores?: Record<string, number> }) {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(WHEEL_AREAS.map((a) => [a.id, lastScores?.[a.id] ?? 5]))
  );
  const [state, formAction] = useFormState(recordWheelMeasurement, initialState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={formRef} action={formAction} className="card flex flex-col gap-4 md:max-w-none">
        <p className="text-xs uppercase tracking-widest text-accent">Medición de hoy</p>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
          {WHEEL_AREAS.map((area) => {
            const color = colorForWheelArea(area.id);
            return (
              <div key={area.id}>
                <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    {area.label}
                  </span>
                  <span style={{ color }}>{scores[area.id]}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-1.5">{area.description}</p>
                <input
                  type="range"
                  min={1}
                  max={10}
                  name={`score_${area.id}`}
                  value={scores[area.id]}
                  onChange={(e) => setScores((prev) => ({ ...prev, [area.id]: Number(e.target.value) }))}
                  className="w-full"
                  style={{ accentColor: color }}
                />
              </div>
            );
          })}
        </div>

        <div>
          <label className="field-label" htmlFor="notes">Notas (opcional)</label>
          <textarea id="notes" name="notes" rows={2} className="field-input w-full" placeholder="¿Qué cambió este mes?" />
        </div>

        {state.error ? <p className="form-error">{state.error}</p> : null}

        <SaveButton onOpenConfirm={() => setConfirmOpen(true)} />
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Confirmas esta medición?"
        body="Una vez guardada, no vas a poder editarla — queda como tu foto de este mes. Tu próxima medición estará disponible en 30 días."
        confirmLabel="Sí, guardar"
        onConfirm={() => {
          setConfirmOpen(false);
          formRef.current?.requestSubmit();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
