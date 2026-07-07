"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { completeModule } from "@/lib/module-actions";
import type { ExerciseField } from "@/lib/modules-content";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
      {pending ? "GUARDANDO..." : "MARCAR COMO COMPLETADO"}
    </button>
  );
}

export function ModuleExerciseForm({
  moduleId,
  fields,
  existingData,
}: {
  moduleId: string;
  fields: ExerciseField[];
  existingData: Record<string, string>;
}) {
  const boundAction = completeModule.bind(null, moduleId);

  const [scaleValues, setScaleValues] = useState<Record<string, number>>(
    Object.fromEntries(
      fields
        .filter((f) => f.type === "scale")
        .map((f) => [f.id, Number(existingData[f.id]) || 5])
    )
  );

  return (
    <form action={boundAction} className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="field-label" htmlFor={field.id}>
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.id}
              name={field.id}
              required
              rows={3}
              defaultValue={existingData[field.id] ?? ""}
              placeholder={field.placeholder}
              className="field-input w-full"
            />
          ) : field.type === "text" ? (
            <input
              id={field.id}
              name={field.id}
              type="text"
              required
              defaultValue={existingData[field.id] ?? ""}
              placeholder={field.placeholder}
              className="field-input w-full"
            />
          ) : field.type === "scale" ? (
            <div>
              <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-400 mb-1">
                <span>1</span>
                <span className="text-accent">{scaleValues[field.id]}</span>
                <span>10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                name={field.id}
                value={scaleValues[field.id]}
                onChange={(e) =>
                  setScaleValues((prev) => ({ ...prev, [field.id]: Number(e.target.value) }))
                }
                className="w-full accent-accent"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 border border-line px-3 py-2 text-sm text-neutral-300 has-[:checked]:border-accent has-[:checked]:text-accent cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    required
                    defaultChecked={existingData[field.id] === option.value}
                    className="accent-accent"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <SubmitButton />
    </form>
  );
}
