"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createHabit, type HabitFormState } from "@/lib/habit-actions";
import { HABIT_CATEGORIES } from "@/lib/constants";

const initialState: HabitFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
      {pending ? "GUARDANDO..." : "CREAR HABITO"}
    </button>
  );
}

export function CreateHabitForm() {
  const [state, formAction] = useFormState(createHabit, initialState);

  return (
    <form action={formAction} className="card flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-accent">Nuevo habito</p>

      <div>
        <label className="field-label" htmlFor="name">Nombre</label>
        <input id="name" name="name" type="text" required className="field-input w-full" placeholder="Ej: 5 sentadillas" />
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
          className="field-input w-full"
          placeholder="Ej: Despues de cepillarme los dientes, 5 sentadillas."
        />
      </div>

      <div>
        <label className="field-label" htmlFor="category">Categoria</label>
        <select id="category" name="category" required className="field-input w-full">
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
