import { addDays } from "@/lib/habit-utils";

// The 30-day formation cycle. It starts the day the anchor habit is created:
// modules unlock as real execution accumulates (one every 3 checked days),
// one miss is forgiven, and the second miss resets the cycle — points go back
// to the value they had at cycle start and modules re-lock. Written exercises
// are never deleted: re-earning a module you already wrote is fast on purpose.
export const CYCLE_DAYS = 30;
export const MAX_CYCLE_FAILS = 1;
export const DAYS_PER_MODULE = 3;

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Distinct executed days (checks or freezes) on/after the cycle start day. */
export function countExecutedDays(
  cycleStart: Date,
  logDates: string[],
  frozenDates: string[] = []
): number {
  const startKey = toDateKey(cycleStart);
  const covered = new Set([...logDates, ...frozenDates]);
  let count = 0;
  for (const day of covered) {
    if (day >= startKey) count += 1;
  }
  return count;
}

/**
 * Full days inside the cycle (start day through yesterday) with neither a
 * check nor a freeze. Today never counts — the day isn't over yet.
 */
export function countMissedDays(
  cycleStart: Date,
  now: Date,
  logDates: string[],
  frozenDates: string[] = []
): number {
  const covered = new Set([...logDates, ...frozenDates]);
  const todayKey = toDateKey(now);
  let missed = 0;
  let cursor = new Date(cycleStart);
  while (toDateKey(cursor) < todayKey) {
    if (!covered.has(toDateKey(cursor))) missed += 1;
    cursor = addDays(cursor, 1);
  }
  return missed;
}

/** 1-based day of the cycle, capped at CYCLE_DAYS. */
export function dayOfCycle(cycleStart: Date, now: Date): number {
  const ms = now.getTime() - cycleStart.getTime();
  const day = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(day, CYCLE_DAYS));
}

export function cycleElapsed(cycleStart: Date, now: Date): boolean {
  const ms = now.getTime() - cycleStart.getTime();
  return ms >= CYCLE_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Executed days required before the NEXT module opens, given how many
 * modules were already completed inside this cycle. Each completed module
 * raises the bar by 3 executed days: for someone starting from zero that
 * lands module 2 at 3 days and module 11 at day 30. Counting completions
 * relative to the cycle (instead of absolute module order) means users who
 * completed modules before this cycle existed aren't retroactively locked
 * out for weeks — they earn each *new* module at the same 3-day pace.
 */
export function requiredExecutedDaysForNext(completedInCycle: number): number {
  return Math.max(0, completedInCycle) * DAYS_PER_MODULE;
}

type ModuleProgressRow = {
  moduleId: string;
  completed: boolean;
  completedAt: Date | null;
};

/**
 * Modules that count toward the execution gate. Normally those completed
 * inside the current cycle — but module 1 counts whenever it was completed,
 * because it's always finished BEFORE the cycle exists (it's the module that
 * tells you to create your habit). Without this, module 2 would be free.
 */
export function countCompletedInCycle(
  progress: ModuleProgressRow[],
  cycleStartedAt: Date | null,
  firstModuleId: string
): number {
  if (!cycleStartedAt) return 0;
  return progress.filter(
    (p) =>
      p.completed &&
      (p.moduleId === firstModuleId || (p.completedAt !== null && p.completedAt >= cycleStartedAt))
  ).length;
}
