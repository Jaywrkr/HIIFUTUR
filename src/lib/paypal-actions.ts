"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { paypalFetch } from "@/lib/paypal";
import { priceTierFor, type SubscriptionPlanId } from "@/lib/subscription-plans";
import { getAccessStatus } from "@/lib/queries";
import { trackEvent } from "@/lib/analytics";

export type ConfirmSubscriptionState = { error?: string; ok?: boolean };

/** Called right after the PayPal button's onApprove fires client-side.
 * Doesn't trust the client's word alone — re-fetches the subscription from
 * PayPal's API and only activates access if PayPal itself says ACTIVE. The
 * webhook (src/app/api/webhooks/paypal/route.ts) is still the source of
 * truth for later changes (renewal, cancellation, payment failure); this
 * just avoids making the user wait on webhook delivery for their first
 * activation. */
export async function confirmSubscription(
  plan: SubscriptionPlanId,
  paypalSubscriptionId: string
): Promise<ConfirmSubscriptionState> {
  const user = await requireUser();

  const access = await getAccessStatus(user.id);
  if (!access) return { error: "Cuenta no encontrada." };

  // Locked in at the moment of subscribing — never recalculated later, even
  // if this same subscription renews after the trial window would've closed.
  const tier = priceTierFor(access.trialEndsAt);

  const subscription = await paypalFetch(`/v1/billing/subscriptions/${paypalSubscriptionId}`);
  if (subscription?.status !== "ACTIVE") {
    return { error: "PayPal todavía no confirma el pago. Espera un momento y refresca." };
  }

  await db
    .update(users)
    .set({
      subscriptionPlan: plan,
      subscriptionPriceTier: tier,
      subscriptionStatus: "active",
      paypalSubscriptionId,
      subscriptionCurrentPeriodEnd: subscription.billing_info?.next_billing_time
        ? new Date(subscription.billing_info.next_billing_time)
        : null,
    })
    .where(eq(users.id, user.id));

  await trackEvent(user.id, "subscription_activated", { plan, tier });

  return { ok: true };
}

export type CancelSubscriptionState = { error?: string; ok?: boolean };

export async function cancelSubscription(): Promise<CancelSubscriptionState> {
  const user = await requireUser();
  const access = await getAccessStatus(user.id);
  const full = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const paypalSubscriptionId = full[0]?.paypalSubscriptionId;

  if (!access || access.subscriptionStatus !== "active" || !paypalSubscriptionId) {
    return { error: "No tienes una suscripción activa para cancelar." };
  }

  await paypalFetch(`/v1/billing/subscriptions/${paypalSubscriptionId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason: "Cancelado por el usuario desde EJECUTA." }),
  });

  await db
    .update(users)
    .set({ subscriptionStatus: "canceled" })
    .where(eq(users.id, user.id));

  await trackEvent(user.id, "subscription_canceled", {});

  return { ok: true };
}
