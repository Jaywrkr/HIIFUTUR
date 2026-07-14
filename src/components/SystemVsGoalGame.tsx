"use client";

import { useState } from "react";

// A fixed, deterministic "month" — not random — so the lesson always lands
// the same way: motivation shows up in a burst, goes quiet for a long
// stretch, then flickers back a couple more times. The system never skips.
const MOTIVATED_DAYS = new Set([2, 3, 4, 17, 22, 27]);
const GOAL_STEP = 4;
const SYSTEM_STEP = 1;
const TOTAL_DAYS = 30;
const MAX_VALUE = TOTAL_DAYS * SYSTEM_STEP; // the system's final value — used as the bar scale

function cumulativeGoal(day: number): number {
  let total = 0;
  for (let d = 1; d <= day; d++) {
    if (MOTIVATED_DAYS.has(d)) total += GOAL_STEP;
  }
  return total;
}

function captionFor(day: number): string {
  if (day <= 4) return "Al principio la motivación pega fuerte — la meta va ganando.";
  if (day <= 16) return "Pero la motivación no dura. Sin ganas, la meta se queda quieta día tras día.";
  if (day < TOTAL_DAYS) return "El sistema nunca dejó de moverse. Ni un solo día.";
  return "30 días después: el sistema ganó — no por ser intenso, sino por nunca detenerse.";
}

/** Drag through a simulated month comparing two approaches: chasing a goal
 * (only moves on days with motivation, and those days are scripted to
 * cluster then run dry — how motivation actually behaves) vs. running a
 * system (a small fixed step, every single day). The system wins not by
 * being bigger, but by never stopping — the module's whole point, raced
 * out instead of stated. */
export function SystemVsGoalGame() {
  const [day, setDay] = useState(1);
  const goalValue = cumulativeGoal(day);
  const systemValue = day * SYSTEM_STEP;
  const goalPct = Math.min(100, (goalValue / MAX_VALUE) * 100);
  const systemPct = Math.min(100, (systemValue / MAX_VALUE) * 100);
  const motivatedToday = MOTIVATED_DAYS.has(day);

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra para avanzar el mes, día a día
      </p>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Con la meta (depende de ganas)</span>
            {motivatedToday ? (
              <span className="text-accent font-semibold">¡hoy con ganas!</span>
            ) : null}
          </div>
          <div className="h-3 rounded-full bg-ink border border-line overflow-hidden">
            <div
              className="h-full bg-neutral-500 rounded-full transition-all duration-300"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-neutral-400 mb-1">Con el sistema (todos los días, igual)</p>
          <div className="h-3 rounded-full bg-ink border border-line overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${systemPct}%` }}
            />
          </div>
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={TOTAL_DAYS}
        value={day}
        onChange={(e) => setDay(Number(e.target.value))}
        className="w-full accent-accent mb-2"
        aria-label="Día del mes"
      />
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
        Día {day} de {TOTAL_DAYS}
      </p>

      <p role="status" aria-live="polite" className="text-sm text-neutral-300 leading-relaxed">
        {captionFor(day)}
      </p>
    </div>
  );
}
