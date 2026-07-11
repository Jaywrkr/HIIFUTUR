/** Trial length: hard access lock kicks in this many days after onboarding
 * completes, unless the user has an active subscription by then. */
export const TRIAL_DAYS = 7;

export type SubscriptionPlanId = "mensual" | "anual";
export type PriceTier = "normal" | "descuento";

/** Prices in USD cents. "descuento" is what you lock in permanently by
 * subscribing before your trial ends — it never reverts to "normal" for
 * that subscription, even after the trial window has passed. */
export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlanId,
  { label: string; unit: string; price: Record<PriceTier, number> }
> = {
  mensual: {
    label: "Mensual",
    unit: "/ mes",
    price: { normal: 699, descuento: 499 },
  },
  anual: {
    label: "Anual",
    unit: "/ año",
    price: { normal: 5900, descuento: 4200 },
  },
};

export function formatUsd(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

/** Which price tier a still-deciding user would lock in right now. */
export function priceTierFor(trialEndsAt: Date | null, now: Date = new Date()): PriceTier {
  if (!trialEndsAt) return "normal";
  return now <= trialEndsAt ? "descuento" : "normal";
}
