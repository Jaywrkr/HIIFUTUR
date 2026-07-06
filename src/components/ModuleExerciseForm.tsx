"use client";

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
          ) : (
            <input
              id={field.id}
              name={field.id}
              type="text"
              required
              defaultValue={existingData[field.id] ?? ""}
              placeholder={field.placeholder}
              className="field-input w-full"
            />
          )}
        </div>
      ))}
      <SubmitButton />
    </form>
  );
}
