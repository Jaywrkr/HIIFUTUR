"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toggleHabitToday } from "@/lib/habit-actions";
import { STREAK_MILESTONES } from "@/lib/habit-stats";

const HOLD_MS = 650;

export function HabitCard({
  id,
  name,
  description,
  category,
  streak,
  doneToday,
  missedYesterday,
  isAnchor,
}: {
  id: string;
  name: string;
  description: string;
  category: string;
  streak: number;
  doneToday: boolean;
  missedYesterday?: boolean;
  isAnchor?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const [holding, setHolding] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Releasing the pointer right after a hold completes fires a trailing
  // native "click" on the same element. Without this guard that click would
  // immediately fire the undo handler, since by then displayDone is already
  // true — the habit would un-check itself the instant it got checked.
  const completedAt = useRef(0);
  const prevStreak = useRef(streak);

  const displayDone = optimistic ?? doneToday;

  // Once the server confirms the real state, drop the optimistic override.
  useEffect(() => {
    setOptimistic(null);
  }, [doneToday]);

  // Celebrate when the confirmed streak (not the optimistic one) lands on a
  // round number — real data, not a guess about what the server will say.
  useEffect(() => {
    if (streak > prevStreak.current && STREAK_MILESTONES.includes(streak)) {
      setMilestone(streak);
      const t = setTimeout(() => setMilestone(null), 2600);
      return () => clearTimeout(t);
    }
    prevStreak.current = streak;
  }, [streak]);

  // Elegant, not alarming: once it's late and today is still unmarked, the
  // streak label warms from accent to amber instead of popping a banner.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);
  const streakAtRisk = !displayDone && !!now && now.getHours() >= 20;

  function commit(next: boolean) {
    setOptimistic(next);
    startTransition(() => toggleHabitToday(id));
  }

  function startHold(e: React.PointerEvent<HTMLButtonElement>) {
    if (displayDone || pending) return;
    // Capture the pointer so small finger drift during the hold doesn't
    // fire a premature pointerleave/cancel — only an actual release should
    // stop it, matching how a physical hold-button behaves.
    e.currentTarget.setPointerCapture(e.pointerId);
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      setHolding(false);
      setJustCompleted(true);
      completedAt.current = Date.now();
      setTimeout(() => setJustCompleted(false), 220);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(15);
      }
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
    <div className="card flex items-center justify-between gap-4 relative overflow-hidden">
      {milestone ? (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 flex items-center justify-center bg-ink/95 z-20 animate-[fadeIn_150ms_ease-out]"
        >
          <p className="text-lg font-bold text-accent">{milestone} días seguidos</p>
        </div>
      ) : null}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs uppercase tracking-widest text-neutral-500">{category}</p>
          {isAnchor ? (
            <span className="text-[10px] uppercase tracking-widest text-accent border border-accent/40 rounded-full px-2 py-0.5">
              Ancla
            </span>
          ) : null}
        </div>
        <p className="font-bold text-lg">{name}</p>
        <p className="muted mt-1">{description}</p>
        <p
          aria-live="polite"
          className={`text-xs mt-2 uppercase tracking-widest ${streakAtRisk ? "text-amber-400" : "text-accent"}`}
        >
          Racha: {streak} {streak === 1 ? "día" : "días"}
          {streakAtRisk ? " · se te va a ir el día" : ""}
        </p>
        {missedYesterday ? (
          <p className="text-xs mt-1 text-amber-400">Ayer te quedaste sin marcar.</p>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <button
          disabled={pending}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerCancel={cancelHold}
          onClick={displayDone ? undo : undefined}
          onKeyDown={handleKeyDown}
          style={{
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          }}
          className={`relative h-14 w-14 overflow-hidden border rounded-lg flex items-center justify-center text-lg transition-transform duration-200 ${
            displayDone ? "border-accent bg-accent text-black" : "border-line text-neutral-500"
          } ${justCompleted ? "scale-110" : "scale-100"}`}
          aria-label={displayDone ? "Deshacer hábito de hoy" : "Mantén presionado para marcar hábito de hoy"}
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
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 text-center leading-tight">
          {displayDone ? "toca para deshacer" : "mantén para marcar"}
        </span>
      </div>
    </div>
  );
}
