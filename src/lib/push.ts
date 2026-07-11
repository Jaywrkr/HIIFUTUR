import webpush from "web-push";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { getPushSubscriptionsForUser } from "@/lib/queries";

const configured = !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

if (configured) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:jaywrkr@gmail.com",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  /** If set, the notification gets a "Marcar hecho" action that checks this
   * habit off without opening the app. */
  habitId?: string;
};

/** Sends a push to every device the user has subscribed on. Devices that
 * report gone (404/410 — uninstalled, permission revoked) are dropped from
 * the table instead of retried forever. Silent no-op if VAPID isn't
 * configured yet (local dev without keys, or before they're set in prod). */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  if (!configured) return;

  const subscriptions = await getPushSubscriptionsForUser(userId);
  if (subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        }
        // Other errors (network blip, push service hiccup): leave the
        // subscription in place, try again next time.
      }
    })
  );
}
