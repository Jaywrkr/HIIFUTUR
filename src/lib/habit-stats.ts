/** Longest run of consecutive days across all of history — not just the
 * current streak, which only looks backward from today. */
export function computeLongestStreak(logDates: string[], frozenDates: string[] = []): number {
  const days = [...new Set([...logDates, ...frozenDates])].sort();
  if (days.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    current = diffDays === 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
  }

  return longest;
}

export const STREAK_MILESTONES = [7, 30, 100, 200, 365];
