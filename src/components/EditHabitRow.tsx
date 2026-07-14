"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateHabit, freezeStreak, type HabitFormState } from "@/lib/habit-actions";
import { HABIT_CATEGORIES, DAYS_BETWEEN_HABIT_EDITS } from "@/lib/constants";
import { ShareImageButton } from "@/components/ShareImageButton";
import { drawStreakShareCard } from "@/lib/share-card";
import { HabitHeatmap } from "@/components/HabitHeatmap";

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
  longestStreak,
  doneToday,
  canEdit,
  nextEditLabel,
  canFreeze,
  nextFreezeLabel,
  isAnchor,
  logDates,
  freezeDates,
  habitCreatedAt,
}: {
  habit: { id: string; name: string; description: string; category: string };
  streak: number;
  longestStreak: number;
  doneToday: boolean;
  canEdit: boolean;
  nextEditLabel: string | null;
  canFreeze: boolean;
  nextFreezeLabel: string | null;
  isAnchor: boolean;
  logDates: string[];
  freezeDates: string[];
  habitCreatedAt: Date;
}) {
  const [editing, setEditing] = useState(false);
  const updateWithId = updateHabit.bind(null, habit.id);
  const [state, formAction] = useFormState(updateWithId, initialState);

  const [freezePending, startFreeze] = useTransition();
  const [freezeError, setFreezeError] = useState<string | null>(null);
  const [justFrozen, setJustFrozen] = useState(false);

  function handleFreeze() {
    setFreezeError(null);
    startFreeze(async () => {
      const result = await freezeStreak(habit.id);
      if (result.error) {
        setFreezeError(result.error);
      } else {
        setJustFrozen(true);
      }
    });
  }

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
      <form action={formAction} className="card flex flex-col items-stretch gap-3">
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
          <label className="field-label" htmlFor={`description-${habit.id}`}>Version mínima</label>
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
          <label className="field-label" htmlFor={`category-${habit.id}`}>Categoría</label>
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
          Después de guardar, no podrás volver a editar este hábito por {DAYS_BETWEEN_HABIT_EDITS} días.
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
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-widest text-neutral-500">{habit.category}</p>
            {isAnchor ? (
              <span className="text-[10px] uppercase tracking-widest text-accent border border-accent/40 rounded-full px-2 py-0.5">
                ⚓ Ancla
              </span>
            ) : null}
          </div>
          <p className="font-bold">{habit.name}</p>
          <p className="muted mt-1">{habit.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-accent uppercase tracking-widest">
              {streak} {streak === 1 ? "día" : "días"}
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
            <p className="text-[10px] text-neutral-400 text-right leading-tight max-w-[90px]">
              Editable {nextEditLabel}
            </p>
          )}
        </div>
      </div>

      {canFreeze && !justFrozen ? (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handleFreeze}
            disabled={freezePending}
            className="text-xs text-accent uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {freezePending ? "Congelando..." : "❄️ Ayer se te pasó — congelar racha"}
          </button>
        </div>
      ) : null}
      {justFrozen ? (
        <p className="mt-3 text-xs text-accent uppercase tracking-widest">
          ❄️ Racha protegida. Sigue como si nada.
        </p>
      ) : null}
      {freezeError ? <p className="form-error mt-3">{freezeError}</p> : null}
      {!canFreeze && nextFreezeLabel ? (
        <p className="mt-3 text-[10px] text-neutral-400">
          Vuelves a poder congelar {nextFreezeLabel}.
        </p>
      ) : null}

      {streak > 0 ? (
        <div className="mt-3">
          <ShareImageButton
            draw={(canvas) => drawStreakShareCard(canvas, { habitName: habit.name, streak })}
            fileName={`ejecuta-racha-${streak}-dias.png`}
            shareText={`${streak} ${streak === 1 ? "día" : "días"} seguidos con "${habit.name}" en EJECUTA.`}
            label="Compartir racha"
          />
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400">
          Últimas 12 semanas · mejor racha: {longestStreak} {longestStreak === 1 ? "día" : "días"}
        </p>
      </div>
      <HabitHeatmap logDates={logDates} freezeDates={freezeDates} habitCreatedAt={habitCreatedAt} />
    </div>
  );
}
