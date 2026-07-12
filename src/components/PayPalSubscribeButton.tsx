"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmSubscription } from "@/lib/paypal-actions";
import type { SubscriptionPlanId } from "@/lib/subscription-plans";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (selector: string) => void };
    };
  }
}

let sdkLoadPromise: Promise<void> | null = null;

function loadPayPalSdk(clientId: string): Promise<void> {
  if (window.paypal) return Promise.resolve();
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el SDK de PayPal."));
    document.body.appendChild(script);
  });
  return sdkLoadPromise;
}

export function PayPalSubscribeButton({
  plan,
  paypalPlanId,
}: {
  plan: SubscriptionPlanId;
  paypalPlanId: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [activated, setActivated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId || !paypalPlanId || !containerRef.current) return;

    let cancelled = false;
    loadPayPalSdk(clientId)
      .then(() => {
        if (cancelled || !window.paypal || !containerRef.current) return;
        window.paypal
          .Buttons({
            style: { shape: "pill", color: "gold", label: "subscribe" },
            createSubscription: (_data: unknown, actions: { subscription: { create: (opts: { plan_id: string }) => Promise<string> } }) =>
              actions.subscription.create({ plan_id: paypalPlanId }),
            onApprove: async (data: { subscriptionID?: string }) => {
              if (!data.subscriptionID) return;
              setConfirming(true);
              setError(null);
              try {
                const result = await confirmSubscription(plan, data.subscriptionID);
                if (result.error) {
                  setError(result.error);
                  return;
                }
                setActivated(true);
                setTimeout(() => {
                  router.push("/dashboard");
                  router.refresh();
                }, 1800);
              } catch {
                setError(
                  "PayPal aprobó tu pago pero algo falló confirmándolo acá. Refresca esta página — si sigue sin activarse, escríbenos a jaywrkr@gmail.com."
                );
              } finally {
                setConfirming(false);
              }
            },
            onError: () => setError("Algo falló con PayPal. Intenta de nuevo."),
          })
          .render(`#paypal-button-${plan}`);
      })
      .catch(() => setError("No se pudo cargar PayPal."));

    return () => {
      cancelled = true;
    };
  }, [plan, paypalPlanId, router]);

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !paypalPlanId) {
    return <p className="muted text-xs">Pagos todavía no configurados para este plan.</p>;
  }

  if (activated) {
    return <p className="text-sm font-bold text-accent">✓ Listo, tu plan quedó activo. Entrando...</p>;
  }

  return (
    <div>
      <div id={`paypal-button-${plan}`} ref={containerRef} style={confirming ? { opacity: 0.4, pointerEvents: "none" } : undefined} />
      {confirming ? <p className="muted text-xs mt-2">Confirmando con PayPal...</p> : null}
      {error ? <p className="form-error mt-2">{error}</p> : null}
    </div>
  );
}
