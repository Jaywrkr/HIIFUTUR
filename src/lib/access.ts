import { TRIAL_DAYS } from "@/lib/subscription-plans";

export type AccessUser = {
  trialEndsAt: Date | null;
  subscriptionStatus: "trialing" | "active" | "canceled" | "expired";
  subscriptionCurrentPeriodEnd?: Date | null;
};

/** True while the 7-day trial is still running, or the user has an active
 * paid subscription, or they canceled but the period they already paid for
 * hasn't ended yet. False once none of those apply — that's the hard lock
 * (see /upgrade and the redirect in each gated page). */
export function hasActiveAccess(user: AccessUser, now: Date = new Date()): boolean {
  if (user.subscriptionStatus === "active") return true;
  if (user.subscriptionStatus === "canceled" && user.subscriptionCurrentPeriodEnd) {
    if (now <= user.subscriptionCurrentPeriodEnd) return true;
  }
  if (!user.trialEndsAt) return true; // onboarding hasn't set it yet — not gated mid-flow
  return now <= user.trialEndsAt;
}

export function daysLeftInTrial(trialEndsAt: Date | null, now: Date = new Date()): number {
  if (!trialEndsAt) return TRIAL_DAYS;
  const ms = trialEndsAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}
