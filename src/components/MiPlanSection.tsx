"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cancelSubscription } from "@/lib/paypal-actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function MiPlanSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleCancel() {
    setPending(true);
    const result = await cancelSubscription();
    setPending(false);
    setConfirmOpen(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={pending}
        className="text-sm text-neutral-500 hover:text-red-400 transition-colors"
      >
        {pending ? "Cancelando..." : "Cancelar suscripción"}
      </button>
      {error ? <p className="form-error mt-2">{error}</p> : null}
      <ConfirmDialog
        open={confirmOpen}
        title="¿Cancelar tu suscripción?"
        body="Mantienes acceso hasta el final del periodo que ya pagaste. Después, tu cuenta queda bloqueada hasta que actives de nuevo."
        confirmLabel="Sí, cancelar"
        cancelLabel="No, seguir suscrito"
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export function MiPlanCard({
  status,
  plan,
  priceLabel,
  nextBillingDate,
  daysLeftInTrial,
}: {
  status: "trialing" | "active" | "canceled" | "expired";
  plan: string | null;
  priceLabel: string | null;
  nextBillingDate: string | null;
  daysLeftInTrial: number;
}) {
  return (
    <div className="card mb-6">
      <p className="section-title">Mi plan</p>
      {status === "trialing" ? (
        <>
          <p className="text-sm text-neutral-300 mb-1">
            Estás en tu prueba gratis — {daysLeftInTrial} día{daysLeftInTrial === 1 ? "" : "s"} restante
            {daysLeftInTrial === 1 ? "" : "s"}.
          </p>
          <Link href="/upgrade" className="link-accent text-sm font-semibold">
            Activar mi plan y quedarme con el precio de ahora →
          </Link>
        </>
      ) : status === "active" ? (
        <>
          <p className="text-sm text-neutral-300 mb-1">
            Plan <span className="font-bold text-text">{plan}</span> — {priceLabel}
          </p>
          {nextBillingDate ? (
            <p className="muted text-xs mb-4">Próximo cobro: {nextBillingDate}</p>
          ) : null}
          <MiPlanSection />
        </>
      ) : status === "canceled" ? (
        <>
          <p className="text-sm text-neutral-300 mb-1">
            Cancelaste tu suscripción. Mantienes acceso hasta {nextBillingDate ?? "el final del periodo pagado"}.
          </p>
          <Link href="/upgrade" className="link-accent text-sm font-semibold">
            Reactivar →
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-neutral-300 mb-1">Tu acceso está vencido.</p>
          <Link href="/upgrade" className="link-accent text-sm font-semibold">
            Elegir un plan →
          </Link>
        </>
      )}
    </div>
  );
}
