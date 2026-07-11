import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { requireUser } from "@/lib/session";
import { getAccessStatus } from "@/lib/queries";
import { hasActiveAccess, daysLeftInTrial } from "@/lib/access";
import { SUBSCRIPTION_PLANS, formatUsd, priceTierFor } from "@/lib/subscription-plans";
import { resolvePlanId } from "@/lib/paypal";
import { PayPalSubscribeButton } from "@/components/PayPalSubscribeButton";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function UpgradePage() {
  const user = await requireUser();
  const access = await getAccessStatus(user.id);
  if (!access) redirect("/login");

  const stillTrialing = access.subscriptionStatus !== "active" && hasActiveAccess(access);
  const tier = priceTierFor(access.trialEndsAt);
  const daysLeft = daysLeftInTrial(access.trialEndsAt);

  return (
    <>
      <Nav />
      <main className="app-main">
        <PageHeader
          kicker={stillTrialing ? `PRUEBA · ${daysLeft} DÍA${daysLeft === 1 ? "" : "S"} RESTANTE${daysLeft === 1 ? "" : "S"}` : "TU PRUEBA TERMINÓ"}
          title={stillTrialing ? "Activa tu plan y quédate con el precio de ahora" : "Elige tu plan para seguir"}
          subtitle={
            stillTrialing
              ? "Si activas dentro de tu ventana de prueba, este precio queda fijo para siempre en tu cuenta — no vuelve a subir aunque cambien las tarifas."
              : "Tus 7 días de prueba se acabaron. Tu progreso sigue ahí — actívalo para seguir donde quedaste."
          }
        />

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {(Object.entries(SUBSCRIPTION_PLANS) as [keyof typeof SUBSCRIPTION_PLANS, (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS]][]).map(
            ([planId, plan]) => (
              <div key={planId} className="card flex flex-col">
                <p className="kicker">{plan.label}</p>
                <p className="text-3xl font-extrabold mt-1">
                  {formatUsd(plan.price[tier])}
                  <span className="text-sm font-normal text-neutral-500">{plan.unit}</span>
                </p>
                {tier === "descuento" ? (
                  <p className="muted text-sm mt-1 line-through">{formatUsd(plan.price.normal)}{plan.unit}</p>
                ) : null}
                <div className="mt-6">
                  <PayPalSubscribeButton plan={planId} paypalPlanId={resolvePlanId(planId, tier)} />
                </div>
              </div>
            )
          )}
        </div>

        <p className="muted text-xs mt-8 max-w-xl">
          Puedes cancelar cuando quieras desde Mi cuenta. El pago se procesa por PayPal — puedes
          pagar con tu cuenta PayPal o con tarjeta sin tener una.
        </p>
      </main>
    </>
  );
}
