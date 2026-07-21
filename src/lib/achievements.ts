import { BRAND_PALETTE } from "@/lib/constants";

/** A single evolution of an achievement — each one is a real threshold
 * against real data, never a vanity number. Points are real too: they land
 * in the same balance leveling.ts already uses, not a separate fake
 * currency (EJECUTA's own rule: números, no sensaciones). */
export type AchievementTier = {
  tier: 1 | 2 | 3;
  name: string;
  requirement: string;
  threshold: number;
  points: number;
};

export type Achievement = {
  id: string;
  title: string;
  narrative: string;
  color: string;
  /** Which stat (from AchievementStats) this achievement measures. */
  stat: keyof AchievementStats;
  tiers: AchievementTier[];
};

export type AchievementStats = {
  /** Longest run any single habit has ever sustained, freezes counted in. */
  longestStreak: number;
  /** Modules completed, out of the full 11. */
  modulesCompleted: number;
  /** Average Wheel of Life score now minus the average at onboarding —
   * can be negative; achievements only look at positive movement. */
  wheelAverageDelta: number;
  /** Habits currently active at once (not paused/locked). */
  activeHabits: number;
  /** Streak freezes ever used, across all habits. */
  freezesUsed: number;
  /** Whether the current 30-day formation cycle was sustained end to end. */
  cycleCompleted: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "camino",
    title: "El Camino",
    narrative: "El curso no se lee — se gana con ejecución real, un módulo a la vez.",
    color: BRAND_PALETTE.cielo,
    stat: "modulesCompleted",
    tiers: [
      { tier: 1, name: "Arrancaste", requirement: "Completa el Módulo 1", threshold: 1, points: 20 },
      { tier: 2, name: "A mitad de camino", requirement: "Completa 6 módulos", threshold: 6, points: 50 },
      { tier: 3, name: "El sistema es tuyo", requirement: "Completa los 11 módulos", threshold: 11, points: 150 },
    ],
  },
  {
    id: "constancia",
    title: "Constancia",
    narrative: "Todos los días le gana a algunos días increíbles.",
    color: BRAND_PALETTE.oliva,
    stat: "longestStreak",
    tiers: [
      { tier: 1, name: "Una semana", requirement: "7 días seguidos en un hábito", threshold: 7, points: 20 },
      { tier: 2, name: "Un mes", requirement: "30 días seguidos en un hábito", threshold: 30, points: 60 },
      { tier: 3, name: "Cien días", requirement: "100 días seguidos en un hábito", threshold: 100, points: 150 },
    ],
  },
  {
    id: "brujula",
    title: "La Brújula",
    narrative: "No es examen, es brújula — y la aguja se está moviendo.",
    color: BRAND_PALETTE.salvia,
    stat: "wheelAverageDelta",
    tiers: [
      { tier: 1, name: "Se mueve algo", requirement: "Tu Wheel of Life sube +1 en promedio", threshold: 1, points: 20 },
      { tier: 2, name: "Se nota", requirement: "Tu Wheel of Life sube +2 en promedio", threshold: 2, points: 60 },
      { tier: 3, name: "Es innegable", requirement: "Tu Wheel of Life sube +3 en promedio", threshold: 3, points: 150 },
    ],
  },
  {
    id: "ecosistema",
    title: "Ecosistema",
    narrative: "Un hábito a la vez, hasta que sean varios sosteniéndose solos.",
    color: BRAND_PALETTE.mostaza,
    stat: "activeHabits",
    tiers: [
      { tier: 1, name: "El segundo", requirement: "2 hábitos activos a la vez", threshold: 2, points: 20 },
      { tier: 2, name: "Cuatro frentes", requirement: "4 hábitos activos a la vez", threshold: 4, points: 60 },
      { tier: 3, name: "El sistema completo", requirement: "5 hábitos activos a la vez", threshold: 5, points: 150 },
    ],
  },
  {
    id: "resiliencia",
    title: "Resiliencia",
    narrative: "Fallar es parte del sistema, no su fracaso — lo que importa es que seguiste.",
    color: BRAND_PALETTE.terracota,
    stat: "freezesUsed",
    tiers: [
      { tier: 1, name: "Seguiste", requirement: "Usa tu primer congelamiento de racha", threshold: 1, points: 20 },
      { tier: 2, name: "Sin drama", requirement: "Usa 3 congelamientos de racha", threshold: 3, points: 60 },
      { tier: 3, name: "Nada te saca del sistema", requirement: "Usa 5 congelamientos de racha", threshold: 5, points: 150 },
    ],
  },
  {
    id: "ciclo",
    title: "30 de 30",
    narrative:
      "30 días, hábito ancla activo, sin que se te reiniciara. Eso ya no es suerte — es evidencia.",
    color: BRAND_PALETTE.coral,
    stat: "cycleCompleted",
    // Un solo tramo por ahora: la app todavía no cuenta cuántos ciclos
    // completos lleva una persona, solo si el actual se sostuvo. El día que
    // ese conteo exista, este logro puede crecer a 3 niveles como los demás.
    tiers: [{ tier: 3, name: "Ciclo sostenido", requirement: "Completa un ciclo de 30 días", threshold: 1, points: 200 }],
  },
];

/** Highest tier reached for a given stat value — 0 means none yet. */
export function earnedTier(tiers: AchievementTier[], value: number): number {
  let best = 0;
  for (const t of tiers) {
    if (value >= t.threshold) best = t.tier;
  }
  return best;
}

export type AchievementProgress = {
  achievement: Achievement;
  earnedTier: number;
  currentValue: number;
  nextTier: AchievementTier | null;
};

/** Read-only view for rendering — no writes, no side effects. Granting
 * points for newly-crossed tiers happens separately, server-side, in
 * achievement-actions.ts. */
export function getAchievementsProgress(stats: AchievementStats): AchievementProgress[] {
  return ACHIEVEMENTS.map((achievement) => {
    const currentValue = Number(stats[achievement.stat]);
    const tier = earnedTier(achievement.tiers, currentValue);
    const nextTier = achievement.tiers.find((t) => t.tier > tier) ?? null;
    return { achievement, earnedTier: tier, currentValue, nextTier };
  });
}
