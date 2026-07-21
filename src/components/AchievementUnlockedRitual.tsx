"use client";

import { useState } from "react";
import Link from "next/link";
import { AchievementCard } from "@/components/AchievementCard";
import type { AchievementProgress } from "@/lib/achievements";

/** Shown right after evaluateAndGrantAchievements finds newly-crossed
 * tiers — a naturally single-fire moment, same shape as
 * ModuleUnlockedRitual: the server only passes unlocked achievements the
 * one time they were actually just granted (see dashboard/page.tsx). If
 * more than one landed in the same evaluation, this pages through them one
 * card at a time instead of dumping a wall of cards at once. */
export function AchievementUnlockedRitual({ unlocked }: { unlocked: AchievementProgress[] }) {
  const [index, setIndex] = useState(0);
  const [dismissing, setDismissing] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible || unlocked.length === 0) return null;

  function dismiss() {
    if (dismissing) return;
    setDismissing(true);
    setTimeout(() => setVisible(false), 400);
  }

  const current = unlocked[index];
  const isLast = index === unlocked.length - 1;

  return (
    <div
      className={`fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center px-6 text-center transition-opacity duration-[400ms] ${
        dismissing ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-xs uppercase tracking-widest text-accent mb-4">
        {unlocked.length > 1 ? `Nuevo logro · ${index + 1} de ${unlocked.length}` : "Nuevo logro"}
      </p>
      <div className="w-full max-w-[260px] mb-6">
        <AchievementCard progress={current} index={index} />
      </div>
      <p className="text-sm text-neutral-300 leading-relaxed max-w-md mb-8">{current.achievement.narrative}</p>
      <div className="flex gap-3">
        {isLast ? (
          <Link href="/logros" className="btn-primary" onClick={dismiss}>
            Ver todos mis logros
          </Link>
        ) : (
          <button type="button" className="btn-primary" onClick={() => setIndex((i) => i + 1)}>
            Siguiente logro
          </button>
        )}
        <button type="button" onClick={dismiss} className="btn-secondary">
          Cerrar
        </button>
      </div>
    </div>
  );
}
