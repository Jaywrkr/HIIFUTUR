"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { completeModule } from "@/lib/module-actions";
import type { ExerciseField } from "@/lib/modules-content";
import type { HabitSuggestion } from "@/lib/habit-suggestions";

function SubmitButton({ shaking }: { shaking: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn-primary w-full mt-2 ${shaking ? "shake-error !bg-red-500" : ""}`}
    >
      {pending ? "GUARDANDO..." : "MARCAR COMO COMPLETADO"}
    </button>
  );
}

function OptionHint({ hint }: { hint: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="block mt-1">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        className="text-[11px] uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
      >
        {open ? "Ocultar qué significa ▲" : "¿Qué significa esto? ▾"}
      </button>
      {open ? <span className="block text-xs text-neutral-500 mt-1">{hint}</span> : null}
    </span>
  );
}

function getFieldValue(form: HTMLFormElement, id: string): string {
  const el = form.elements.namedItem(id);
  if (!el) return "";
  if (el instanceof RadioNodeList) return String(el.value ?? "");
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return el.value;
  return "";
}

export function ModuleExerciseForm({
  moduleId,
  fields,
  existingData,
  suggestionsFor,
}: {
  moduleId: string;
  fields: ExerciseField[];
  existingData: Record<string, string>;
  /** Personalized options shown above one specific text field (e.g. the
   * anchor habit at Module 1) — click one to fill the field, still fully
   * editable afterward. */
  suggestionsFor?: { fieldId: string; options: HabitSuggestion[] };
}) {
  const boundAction = completeModule.bind(null, moduleId);
  const formRef = useRef<HTMLFormElement>(null);
  const [shaking, setShaking] = useState(false);
  const [missingLabels, setMissingLabels] = useState<string[]>([]);

  const [scaleValues, setScaleValues] = useState<Record<string, number>>(
    Object.fromEntries(
      fields
        .filter((f) => f.type === "scale")
        .map((f) => [f.id, Number(existingData[f.id]) || 5])
    )
  );

  const [textValues, setTextValues] = useState<Record<string, string>>(
    Object.fromEntries(
      fields
        .filter((f) => f.type === "text" || f.type === "textarea")
        .map((f) => [f.id, existingData[f.id] ?? ""])
    )
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const missing = fields.filter(
      (f) => f.type !== "scale" && !getFieldValue(form, f.id).trim()
    );
    if (missing.length === 0) {
      setMissingLabels([]);
      return;
    }
    e.preventDefault();
    setMissingLabels(missing.map((f) => f.label));
    setShaking(true);
    setTimeout(() => setShaking(false), 1000);
  }

  return (
    <form ref={formRef} action={boundAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="field-label" htmlFor={field.id}>
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.id}
              name={field.id}
              rows={3}
              value={textValues[field.id] ?? ""}
              onChange={(e) => setTextValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
              placeholder={field.placeholder}
              className="field-input w-full"
            />
          ) : field.type === "text" ? (
            <>
              {suggestionsFor?.fieldId === field.id ? (
                <div className="flex flex-col gap-2 mb-3">
                  {suggestionsFor.options.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() =>
                        setTextValues((prev) => ({ ...prev, [field.id]: option.name }))
                      }
                      className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                        textValues[field.id] === option.name
                          ? "border-accent/50 bg-accent/10"
                          : "border-line hover:border-accent/30"
                      }`}
                    >
                      <span className="block text-sm font-bold">{option.name}</span>
                      <span className="block text-xs text-neutral-500 mt-0.5">
                        {option.description}
                        {option.areaLabel ? ` · ${option.areaLabel}` : ""}
                      </span>
                    </button>
                  ))}
                  <p className="text-[11px] text-neutral-500">
                    Son sugerencias según lo que elegiste al empezar y tu Wheel of Life — toca una
                    para usarla, o escribe la tuya abajo.
                  </p>
                </div>
              ) : null}
              <input
                id={field.id}
                name={field.id}
                type="text"
                value={textValues[field.id] ?? ""}
                onChange={(e) => setTextValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                className="field-input w-full"
              />
            </>
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
                  className="flex items-start gap-3 border border-line px-3 py-2 text-sm text-neutral-300 has-[:checked]:border-accent has-[:checked]:text-accent cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    defaultChecked={existingData[field.id] === option.value}
                    className="accent-accent mt-0.5"
                  />
                  <span className="flex-1">
                    <span className="block">{option.label}</span>
                    <OptionHint hint={option.hint} />
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <SubmitButton shaking={shaking} />
      {missingLabels.length > 0 ? (
        <p role="alert" className="form-error -mt-2">
          Te falta completar: {missingLabels.join(", ")}.
        </p>
      ) : null}
    </form>
  );
}
