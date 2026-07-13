"use client";

import { useEffect, useState } from "react";

/** Shown the one time right after a subscription activates — the
 * counterpart to CycleCompletionRitual, but for the business moment
 * instead of the habit moment. Fired via a one-shot ?activated=1 query
 * param set by PayPalSubscribeButton's redirect after confirmSubscription
 * succeeds; the dashboard strips the param so a refresh won't re-trigger it. */
export function SubscriptionActivatedRitual({
  planLabel,
  priceLabel,
}: {
  planLabel: string;
  priceLabel: string;
}) {
  const [dismissing, setDismissing] = useState(false);
  const [visible, setVisible] = useState(true);

  // Strip ?activated=1 right away so a refresh doesn't re-trigger this —
  // the query param is a one-shot signal from the redirect after payment,
  // not persistent page state.
  useEffect(() => {
    window.history.replaceState(null, "", "/dashboard");
  }, []);

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
      <p className="text-xs uppercase tracking-widest text-accent mb-4">Bienvenido de verdad</p>
      <h1 className="text-2xl md:text-3xl font-extrabold leading-snug max-w-lg mb-4">
        Listo. Tu sistema ya es tuyo, para siempre.
      </h1>
      <p className="text-sm text-neutral-300 leading-relaxed max-w-md mb-3">
        Plan <span className="font-bold text-white">{planLabel}</span> a{" "}
        <span className="font-bold text-accent">{priceLabel}</span> — ese precio queda bloqueado en
        tu cuenta y no vuelve a subir, aunque cambien las tarifas de lista.
      </p>
      <p className="text-sm text-neutral-300 leading-relaxed max-w-md mb-8">
        De aquí en adelante: los 11 módulos siguen abiertos, tus hasta 5 hábitos activos, tu Wheel
        of Life cada 30 días, y recordatorios — sin fecha de corte. Puedes cancelar cuando quieras
        desde Mi cuenta, sin escribirnos ni pedir permiso.
      </p>
      <button type="button" onClick={dismiss} className="btn-primary">
        Vamos
      </button>
    </div>
  );
}
