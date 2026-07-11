"use client";

import { useState } from "react";

const MANTRA =
  "La vida no es justa. Pero llorar no te hace fuerte. Yo no quiero que me tengan lastima, quiero que se levanten al verme. Que digan: 'si el pudo, yo también'.";

/** Shown the one time a cycle reset just happened (a server-computed,
 * naturally single-fire flag — see evaluateCycle in cycle-state.ts). Replaces
 * a flat red warning banner with an actual moment: acknowledge it, reframe
 * it, and ask for one small recommitment tap instead of just informing. */
export function ResetReentryRitual() {
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
      <p className="text-xs uppercase tracking-widest text-accent mb-4">Esto también es data</p>
      <h1 className="text-2xl md:text-3xl font-extrabold leading-snug max-w-lg mb-4">
        El ciclo se reinició. Tú no.
      </h1>
      <p className="text-sm text-neutral-300 leading-relaxed max-w-md mb-8">
        Fallaste tres veces en 30 días — pasa. No perdiste todo: conservas la mitad de tus puntos
        y tus respuestas siguen escritas. Los módulos se re-desbloquean con ejecución real,
        empezando ahora.
      </p>
      <p className="text-sm italic text-neutral-400 leading-relaxed max-w-md mb-2">
        &ldquo;{MANTRA}&rdquo;
      </p>
      <p className="text-xs uppercase tracking-widest text-neutral-600 mb-10">— Jay</p>
      <button type="button" onClick={dismiss} className="btn-primary">
        Retomo hoy
      </button>
    </div>
  );
}
