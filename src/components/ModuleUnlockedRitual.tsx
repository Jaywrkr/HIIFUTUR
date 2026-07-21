"use client";

import { useState } from "react";
import Link from "next/link";

/** Shown the instant a new module becomes reachable — a naturally
 * single-fire moment, driven by the server (see dashboard/page.tsx):
 * lastUnlockedModuleNotifiedId only gets written to this module's id the
 * one time this component actually renders. A felicitation, not a task
 * notice — the module itself still says what it's about. */
export function ModuleUnlockedRitual({
  moduleId,
  order,
  title,
}: {
  moduleId: string;
  order: number;
  title: string;
}) {
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
      <p className="text-xs uppercase tracking-widest text-accent mb-4">Nuevo módulo</p>
      <h1 className="text-2xl md:text-3xl font-extrabold leading-snug max-w-lg mb-4">
        Sostuviste lo suficiente. Módulo {order} desbloqueado.
      </h1>
      <p className="text-sm text-neutral-300 leading-relaxed max-w-md mb-8">
        &ldquo;{title}&rdquo; ya te está esperando — se ganó con tus días reales, no con el
        calendario.
      </p>
      <div className="flex gap-3">
        <Link href={`/modules/${moduleId}`} className="btn-primary" onClick={dismiss}>
          Empezar módulo {order}
        </Link>
        <button type="button" onClick={dismiss} className="btn-secondary">
          En un momento
        </button>
      </div>
    </div>
  );
}
