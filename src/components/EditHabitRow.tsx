"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateHabit, type HabitFormState } from "@/lib/habit-actions";
import { HABIT_CATEGORIES, DAYS_BETWEEN_HABIT_EDITS } from "@/lib/constants";

const initialState: HabitFormState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary text-xs py-2 px-4">
      {pending ? "Guardando..." : "Guardar"}
    </button>
  );
}

export function EditHabitRow({
  habit,
  streak,
  doneToday,
  canEdit,
  nextEditLabel,
}: {
  habit: { id: string; name: string; description: string; category: string };
  streak: number;
  doneToday: boolean;
  canEdit: boolean;
  nextEditLabel: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const updateWithId = updateHabit.bind(null, habit.id);
  const [state, formAction] = useFormState(updateWithId, initialState);

  // Close the form once a save succeeds (no error, and the form isn't the
  // freshly-mounted initial state).
  useEffect(() => {
    if (editing && !state.error) {
      setEditing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (editing) {
    return (
      <form action={formAction} className="border-b border-line py-4 flex flex-col items-stretch gap-3">
        <div>
          <label className="field-label" htmlFor={`name-${habit.id}`}>Nombre</label>
          <input
            id={`name-${habit.id}`}
            name="name"
            type="text"
            required
            defaultValue={habit.name}
            className="field-input w-full"
          />
        </div>
        <div>
          <label className="field-label" htmlFor={`description-${habit.id}`}>Version minima</label>
          <input
            id={`description-${habit.id}`}
            name="description"
            type="text"
            required
            defaultValue={habit.description}
            className="field-input w-full"
          />
        </div>
        <div>
          <label className="field-label" htmlFor={`category-${habit.id}`}>Categoria</label>
          <select
            id={`category-${habit.id}`}
            name="category"
            required
            defaultValue={habit.category}
            className="field-input w-full"
          >
            {HABIT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-neutral-500">
          Despues de guardar, no podras volver a editar este habito por {DAYS_BETWEEN_HABIT_EDITS} dias.
        </p>
        {state.error ? <p className="form-error mt-0">{state.error}</p> : null}

        <div className="flex gap-3">
          <SaveButton />
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="btn-secondary text-xs py-2 px-4"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="list-row">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">{habit.category}</p>
        <p className="font-bold">{habit.name}</p>
        <p className="muted mt-1">{habit.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-accent uppercase tracking-widest">
            {streak} {streak === 1 ? "dia" : "dias"}
          </p>
          <p className="muted text-xs">{doneToday ? "hecho hoy" : "pendiente hoy"}</p>
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
          >
            Editar
          </button>
        ) : (
          <p className="text-[10px] text-neutral-600 text-right leading-tight max-w-[90px]">
            Editable el {nextEditLabel}
          </p>
        )}
      </div>
    </div>
  );
}
