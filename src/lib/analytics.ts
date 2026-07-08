import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";

/** Fire-and-forget: measuring the product must never break it. */
export async function trackEvent(
  userId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  try {
    await db.insert(analyticsEvents).values({ userId, event, properties: properties ?? null });
  } catch (error) {
    console.error("[analytics] failed to track event", event, error);
  }
}
