/** One-time setup script: creates the Ankla product and its 4 billing
 * plans (mensual/anual x normal/descuento) in PayPal, and prints the plan
 * IDs to paste into env vars (PAYPAL_PLAN_ID_MENSUAL_NORMAL, etc).
 *
 * Run with: npx tsx scripts/create-paypal-plans.ts
 * Requires PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV in .env.
 * Safe to re-run against a fresh sandbox account; it always creates new
 * plans rather than checking for existing ones — this is meant to run once
 * per environment (sandbox, then again for live), not repeatedly. */
import "dotenv/config";
import { paypalFetch } from "../src/lib/paypal";
import { SUBSCRIPTION_PLANS, type SubscriptionPlanId, type PriceTier } from "../src/lib/subscription-plans";

async function main() {
  const product = await paypalFetch("/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({
      name: "Ankla",
      description: "Curso, hábitos y Radar de Vida — sistema de ejecución sostenible.",
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });
  console.log(`Producto creado: ${product.id}`);

  const intervalUnit: Record<SubscriptionPlanId, "MONTH" | "YEAR"> = {
    mensual: "MONTH",
    anual: "YEAR",
  };

  const results: string[] = [];

  for (const planId of Object.keys(SUBSCRIPTION_PLANS) as SubscriptionPlanId[]) {
    for (const tier of ["normal", "descuento"] as PriceTier[]) {
      const cents = SUBSCRIPTION_PLANS[planId].price[tier];
      const dollars = (cents / 100).toFixed(2);

      const plan = await paypalFetch("/v1/billing/plans", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.id,
          name: `Ankla ${planId} (${tier})`,
          billing_cycles: [
            {
              frequency: { interval_unit: intervalUnit[planId], interval_count: 1 },
              tenure_type: "REGULAR",
              sequence: 1,
              total_cycles: 0, // 0 = until cancelled
              pricing_scheme: { fixed_price: { value: dollars, currency_code: "USD" } },
            },
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            payment_failure_threshold: 2,
          },
        }),
      });

      const envVar = `PAYPAL_PLAN_ID_${planId.toUpperCase()}_${tier.toUpperCase()}`;
      results.push(`${envVar}=${plan.id}`);
      console.log(`Creado: ${planId}/${tier} → ${plan.id}`);
    }
  }

  console.log("\nPega esto en tus variables de entorno (Vercel + .env local):\n");
  console.log(results.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
