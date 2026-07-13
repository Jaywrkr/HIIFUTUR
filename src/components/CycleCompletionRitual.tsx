"use client";

import { useState } from "react";
import Link from "next/link";

/** Shown the one time a 30-day cycle just finished — the positive
 * counterpart to ResetReentryRitual. A naturally single-fire flag (see
 * evaluateCycle in cycle-state.ts): wasJustCompleted is only true on the
 * exact evaluation where cycleCompletedAt gets set. */
export function CycleCompletionRitual() {
  const [dismissing, setDismissing] = useState(false);
  const [visible, setVisible] = useState(true);

  function dismiss() {
    if (dismissing) return;
    setDismissing(true);
    setTimeout(() => setVisible(false), 400);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center px-6 text-center transition-opacity duration-[400ms] ${
        dismissing ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-xs uppercase tracking-widest text-accent mb-4">30 de 30</p>
      <h1 className="text-2xl md:text-3xl font-extrabold leading-snug max-w-lg mb-4">
        Sostuviste el ciclo completo.
      </h1>
      <p className="text-sm text-neutral-300 leading-relaxed max-w-md mb-8">
        30 días, hábito ancla activo, sin que se te reiniciara. Eso ya no es suerte — es
        evidencia de que puedes sostener algo. El sistema sigue: tus hábitos, tu progreso y tu
        Wheel of Life continúan igual, sin gating de ciclo desde ahora.
      </p>
      <p className="text-sm italic text-neutral-400 leading-relaxed max-w-md mb-2">
        &ldquo;El crecimiento real es cuando te cansas de tus mierdas.&rdquo;
      </p>
      <p className="text-xs uppercase tracking-widest text-neutral-600 mb-10">— Jay</p>
      <div className="flex gap-3">
        <Link href="/wheel" className="btn-primary" onClick={dismiss}>
          Mide tu Wheel of Life
        </Link>
        <button type="button" onClick={dismiss} className="btn-secondary">
          Sigo en lo mío
        </button>
      </div>
    </div>
  );
}
