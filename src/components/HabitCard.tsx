"use client";

import { useTransition } from "react";
import { toggleHabitToday } from "@/lib/habit-actions";

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

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">{category}</p>
        <p className="font-bold uppercase">{name}</p>
        <p className="muted mt-1">{description}</p>
        <p className="text-xs text-accent mt-2 uppercase tracking-widest">
          Racha: {streak} {streak === 1 ? "dia" : "dias"}
        </p>
      </div>
      <button
        disabled={pending}
        onClick={() => startTransition(() => toggleHabitToday(id))}
        className={`h-12 w-12 shrink-0 border flex items-center justify-center text-lg transition-colors ${
          doneToday ? "border-accent bg-accent text-black" : "border-line text-neutral-500"
        }`}
        aria-label="Marcar habito de hoy"
      >
        {doneToday ? "X" : ""}
      </button>
    </div>
  );
}
