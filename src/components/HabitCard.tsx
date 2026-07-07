"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toggleHabitToday } from "@/lib/habit-actions";

const HOLD_MS = 650;

export function HabitCard({
  id,
  name,
  description,
  category,
  streak,
  doneToday,
}: {
  id: string;
  name: string;
  description: string;
  category: string;
  streak: number;
  doneToday: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const [holding, setHolding] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Releasing the pointer right after a hold completes fires a trailing
  // native "click" on the same element. Without this guard that click would
  // immediately fire the undo handler, since by then displayDone is already
  // true — the habit would un-check itself the instant it got checked.
  const completedAt = useRef(0);

  const displayDone = optimistic ?? doneToday;

  // Once the server confirms the real state, drop the optimistic override.
  useEffect(() => {
    setOptimistic(null);
  }, [doneToday]);

  function commit(next: boolean) {
    setOptimistic(next);
    startTransition(() => toggleHabitToday(id));
  }

  function startHold() {
    if (displayDone || pending) return;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      setHolding(false);
      setJustCompleted(true);
      completedAt.current = Date.now();
      setTimeout(() => setJustCompleted(false), 220);
      commit(true);
    }, HOLD_MS);
  }

  function cancelHold() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setHolding(false);
  }

  function undo() {
    if (!displayDone || pending) return;
    if (Date.now() - completedAt.current < 400) return;
    commit(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (displayDone) {
      undo();
    } else if (!pending) {
      setJustCompleted(true);
      completedAt.current = Date.now();
      setTimeout(() => setJustCompleted(false), 220);
      commit(true);
    }
  }

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">{category}</p>
        <p className="font-bold text-lg">{name}</p>
        <p className="muted mt-1">{description}</p>
        <p className="text-xs text-accent mt-2 uppercase tracking-widest">
          Racha: {streak} {streak === 1 ? "dia" : "dias"}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <button
          disabled={pending}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onClick={displayDone ? undo : undefined}
          onKeyDown={handleKeyDown}
          style={{ touchAction: "manipulation", userSelect: "none" }}
          className={`relative h-14 w-14 overflow-hidden border rounded-2xl flex items-center justify-center text-lg transition-transform duration-200 ${
            displayDone ? "border-accent bg-accent text-black" : "border-line text-neutral-500"
          } ${justCompleted ? "scale-110" : "scale-100"}`}
          aria-label={displayDone ? "Deshacer habito de hoy" : "Mantén presionado para marcar habito de hoy"}
          aria-pressed={displayDone}
        >
          {!displayDone && (
            <span
              className="absolute inset-x-0 bottom-0 bg-accent/50 pointer-events-none"
              style={{
                height: holding ? "100%" : "0%",
                transition: holding ? `height ${HOLD_MS}ms linear` : "height 150ms ease-out",
              }}
            />
          )}
          <span className="relative z-10">{displayDone ? "X" : ""}</span>
        </button>
        <span className="text-[10px] uppercase tracking-widest text-neutral-600 text-center leading-tight">
          {displayDone ? "toca para deshacer" : "mantén para marcar"}
        </span>
      </div>
    </div>
  );
}
