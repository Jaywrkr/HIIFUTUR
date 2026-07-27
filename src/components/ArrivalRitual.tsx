"use client";

import { useEffect, useState } from "react";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function storageKey() {
  return `ejecuta_arrival_${todayKey()}`;
}

export function ArrivalRitual({ mantra }: { mantra: string }) {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  // Runs client-only, after hydration — avoids a server/client mismatch
  // since both render "hidden" first. Shows once per calendar day: this is
  // meant to be a brief arrival moment, not a recurring interruption.
  useEffect(() => {
    if (!localStorage.getItem(storageKey())) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    if (dismissing) return;
    setDismissing(true);
    localStorage.setItem(storageKey(), "1");
    setTimeout(() => setVisible(false), 400);
  }

  if (!visible) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dismiss();
        }
      }}
      aria-label="Toca para entrar"
      className={`fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center px-6 cursor-pointer transition-opacity duration-[400ms] ${
        dismissing ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-xs uppercase tracking-widest text-accent mb-6 breathing-text">Mantra de hoy</p>
      <p className="text-xl md:text-2xl font-bold text-center leading-snug max-w-2xl breathing-text">
        &ldquo;{mantra}&rdquo;
      </p>
      <p className="text-xs uppercase tracking-widest text-neutral-500 mt-6 breathing-text">— Jay</p>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-16 animate-pulse">
        toca para entrar
      </p>
    </div>
  );
}
