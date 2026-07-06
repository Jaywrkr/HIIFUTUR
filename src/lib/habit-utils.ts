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

/** Consecutive-day streak counted backwards from today. A missed day (before today) breaks it. */
export function computeStreak(logDates: string[]): number {
  const set = new Set(logDates);
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
