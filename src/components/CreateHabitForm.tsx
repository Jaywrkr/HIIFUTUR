"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createHabit, type HabitFormState } from "@/lib/habit-actions";
import { HABIT_CATEGORIES } from "@/lib/constants";
import type { HabitSuggestion } from "@/lib/habit-suggestions";

const initialState: HabitFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
      {pending ? "GUARDANDO..." : "CREAR HABITO"}
    </button>
  );
}

export function CreateHabitForm({
  suggestion,
  altSuggestion,
}: {
  suggestion?: HabitSuggestion | null;
  altSuggestion?: HabitSuggestion | null;
}) {
  const [state, formAction] = useFormState(createHabit, initialState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(HABIT_CATEGORIES[0].id);

  function applySuggestion(s: HabitSuggestion) {
    setName(s.name);
    setDescription(s.description);
    setCategory(s.category);
  }

  return (
    <form action={formAction} className="card flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-accent">Nuevo habito</p>

      {suggestion ? (
        <div className="rounded-2xl border border-line bg-ink p-4">
          <p className="text-xs text-neutral-500 mb-2">
            Segun tu Wheel of Life, <span className="text-accent">{suggestion.areaLabel}</span> es
            donde mas puedes ganar terreno. Una sugerencia, no una obligacion:
          </p>
          <p className="font-bold">{suggestion.name}</p>
          <p className="muted mt-1">{suggestion.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => applySuggestion(suggestion)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Usar esta sugerencia
            </button>
            {altSuggestion ? (
              <button
                type="button"
                onClick={() => applySuggestion(altSuggestion)}
                className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
              >
                O algo mas simple todavia →
              </button>
            ) : null}
          </div>
          <p className="text-[11px] text-neutral-600 mt-3">
            Son solo ideas. Elige lo que tu quieras — lo unico que importa es que no puedas fallar.
          </p>
        </div>
      ) : null}

      <div>
        <label className="field-label" htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field-input w-full"
          placeholder="Ej: 5 sentadillas"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="description">
          Version minima (tan pequena que no puedas fallar)
        </label>
        <input
          id="description"
          name="description"
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="field-input w-full"
          placeholder="Ej: Despues de cepillarme los dientes, 5 sentadillas."
        />
      </div>

      <div>
        <label className="field-label" htmlFor="category">Categoria</label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="field-input w-full"
        >
          {HABIT_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {state.error ? <p className="form-error">{state.error}</p> : null}

      <SubmitButton />
    </form>
  );
}
