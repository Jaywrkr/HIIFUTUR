function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** Plain-language "when" instead of a raw date — "hoy", "mañana", "en 12
 * días". Rounds up so "en 1 día" means less than 48h away, matching how
 * someone would actually describe it out loud. */
export function relativeDayLabel(target: Date, now: Date = new Date()): string {
  const days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "hoy";
  if (days === 1) return "mañana";
  return `en ${days} días`;
}

/**
 * Consecutive-day streak counted backwards from today. A missed day (before
 * today) breaks it, unless that day was protected by a streak freeze —
 * frozenDates count toward the streak the same as a real completed log.
 */
export function computeStreak(logDates: string[], frozenDates: string[] = []): number {
  const set = new Set([...logDates, ...frozenDates]);
  let streak = 0;
  let cursor = new Date();

  // Today not logged yet is fine — it just doesn't count until checked.
  if (!set.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  while (set.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}
