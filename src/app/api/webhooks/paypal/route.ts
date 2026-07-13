import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPaypalWebhookSignature } from "@/lib/paypal";

// PayPal calls this whenever a subscription's state changes: renewed,
// cancelled, suspended (payment failed), or expired. confirmSubscription()
// (src/lib/paypal-actions.ts) handles the moment someone first subscribes —
// this route is what keeps status correct afterward, without anyone having
// the app open.
export async function POST(request: NextRequest) {
  const body = await request.json();

  const verified = await verifyPaypalWebhookSignature(request.headers, body);
  if (!verified) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const eventType = body.event_type as string;
  const resource = body.resource ?? {};
  const paypalSubscriptionId: string | undefined = resource.id;
  if (!paypalSubscriptionId) return NextResponse.json({ ok: true });

  switch (eventType) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
      await db
        .update(users)
        .set({
          subscriptionStatus: "active",
          subscriptionCurrentPeriodEnd: resource.billing_info?.next_billing_time
            ? new Date(resource.billing_info.next_billing_time)
            : null,
        })
        .where(eq(users.paypalSubscriptionId, paypalSubscriptionId));
      break;

    case "PAYMENT.SALE.COMPLETED": {
      // Recurring renewal — extend the period end so hasActiveAccess() keeps
      // working through cancel-mid-period logic even if someone cancels
      // right after this payment.
      const subId = resource.billing_agreement_id;
      if (subId && resource.next_billing_time) {
        await db
          .update(users)
          .set({ subscriptionCurrentPeriodEnd: new Date(resource.next_billing_time) })
          .where(eq(users.paypalSubscriptionId, subId));
      }
      break;
    }

    case "BILLING.SUBSCRIPTION.CANCELLED":
      await db
        .update(users)
        .set({ subscriptionStatus: "canceled" })
        .where(eq(users.paypalSubscriptionId, paypalSubscriptionId));
      break;

    case "BILLING.SUBSCRIPTION.SUSPENDED":
    case "BILLING.SUBSCRIPTION.EXPIRED":
      await db
        .update(users)
        .set({ subscriptionStatus: "expired" })
        .where(eq(users.paypalSubscriptionId, paypalSubscriptionId));
      break;

    default:
      break;
  }

  return NextResponse.json({ ok: true });
}
