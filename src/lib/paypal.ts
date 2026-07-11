import type { SubscriptionPlanId, PriceTier } from "@/lib/subscription-plans";

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

/** OAuth2 client-credentials token — short-lived, fetched fresh per call.
 * PayPal's REST API doesn't have a high-volume path in this app (checkout
 * button creation + occasional webhook lookups), so no caching layer. */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET no configurados.");
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal OAuth falló: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function paypalFetch(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`PayPal API ${path} falló: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

/** Env var name for a given plan+tier's PayPal Billing Plan ID — created
 * once via scripts/create-paypal-plans.ts and pasted into Vercel. */
function planEnvVarName(plan: SubscriptionPlanId, tier: PriceTier): string {
  return `PAYPAL_PLAN_ID_${plan.toUpperCase()}_${tier.toUpperCase()}`;
}

export function resolvePlanId(plan: SubscriptionPlanId, tier: PriceTier): string | null {
  return process.env[planEnvVarName(plan, tier)] ?? null;
}

/** Verifies a PayPal webhook's signature against the configured webhook ID.
 * Without this, anyone who finds the endpoint URL could forge
 * "subscription activated" events and get free access. */
export async function verifyPaypalWebhookSignature(
  headers: Headers,
  body: unknown
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const verification = await paypalFetch("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: body,
    }),
  });

  return verification?.verification_status === "SUCCESS";
}
