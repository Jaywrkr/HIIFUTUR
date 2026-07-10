// Every habit check-in awards the same fixed amount of points — no bonuses,
// no streak multipliers. What gets harder is climbing levels: each level
// needs more additional points than the last (quadratic curve), so early
// levels come fast and later ones take sustained consistency.
export const POINTS_PER_CHECK = 10;

// Completing a course module pays the same as three days of checks — the
// pace at which modules unlock, so course and habit progress weigh alike.
export const POINTS_PER_MODULE = 30;

const LEVEL_STEP = 50;

/** Total cumulative points needed to reach a given level. Level 1 needs 0. */
export function pointsForLevel(level: number): number {
  if (level <= 1) return 0;
  return LEVEL_STEP * (level - 1) ** 2;
}

export type LevelProgress = {
  level: number;
  pointsIntoLevel: number;
  pointsToNextLevel: number;
  nextLevelThreshold: number;
};

export function computeLevel(points: number): LevelProgress {
  let level = 1;
  while (points >= pointsForLevel(level + 1)) {
    level += 1;
  }
  const currentThreshold = pointsForLevel(level);
  const nextLevelThreshold = pointsForLevel(level + 1);
  return {
    level,
    pointsIntoLevel: points - currentThreshold,
    pointsToNextLevel: nextLevelThreshold - points,
    nextLevelThreshold: nextLevelThreshold - currentThreshold,
  };
}
