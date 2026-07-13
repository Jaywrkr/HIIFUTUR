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
import { IconShieldCheck } from "@/components/icons";

const UPGRADE_FAQ = [
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, desde Mi cuenta, sin escribirnos ni pedir permiso. Mantienes acceso hasta el final del periodo que ya pagaste.",
  },
  {
    q: "¿Es seguro pagar aquí?",
    a: "El cobro lo procesa PayPal directamente — nosotros nunca vemos ni guardamos tu número de tarjeta.",
  },
  {
    q: "¿El precio puede subir después?",
    a: "El precio que actives hoy queda fijo en tu cuenta para siempre, aunque más adelante cambiemos las tarifas de lista.",
  },
];

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

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          {(Object.entries(SUBSCRIPTION_PLANS) as [keyof typeof SUBSCRIPTION_PLANS, (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS]][]).map(
            ([planId, plan]) => (
              <div
                key={planId}
                className={`relative rounded-3xl p-6 flex flex-col ${
                  plan.highlight ? "bg-accent/15 border border-accent/40" : "border border-line bg-surface"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Mejor valor
                  </span>
                ) : null}
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">{plan.label}</p>
                <p className="mb-1">
                  <span className="text-4xl font-extrabold">{formatUsd(plan.price[tier])}</span>{" "}
                  <span className="text-sm text-neutral-400">{plan.unit}</span>
                </p>
                {tier === "descuento" ? (
                  <p className="text-sm text-neutral-500 mb-1 line-through">
                    {formatUsd(plan.price.normal)}
                    {plan.unit}
                  </p>
                ) : null}
                <p className="muted mb-6">{plan.tagline}</p>
                <div className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5 shrink-0">✓</span>
                      <span className="text-sm text-neutral-300">{f}</span>
                    </div>
                  ))}
                </div>
                <PayPalSubscribeButton plan={planId} paypalPlanId={resolvePlanId(planId, tier)} />
              </div>
            )
          )}
        </div>

        <p className="flex items-center gap-2 text-xs text-neutral-500 mt-6 max-w-xl">
          <IconShieldCheck className="w-4 h-4 text-accent shrink-0" />
          Pago seguro, procesado por PayPal. Nunca vemos ni guardamos tu número de tarjeta.
        </p>

        <div className="max-w-xl mt-12">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Antes de activar</p>
          <div className="flex flex-col gap-4">
            {UPGRADE_FAQ.map((item) => (
              <div key={item.q}>
                <p className="font-bold text-sm mb-1">{item.q}</p>
                <p className="muted text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
