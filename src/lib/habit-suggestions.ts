import { WHEEL_AREAS, WHEEL_AREA_TO_CATEGORY } from "@/lib/constants";

export type HabitSuggestion = {
  name: string;
  description: string;
  category: string;
  areaLabel?: string;
};

// One tiny, "can't fail" starting point per category. Not the only option —
// just a suggestion the user is free to ignore and type their own.
const SUGGESTIONS_BY_CATEGORY: Record<string, { name: string; description: string }> = {
  salud: { name: "5 sentadillas", description: "Al despertar o antes de dormir. Nada más." },
  trabajo: { name: "Una tarea de 2 minutos", description: "La más chica de tu lista. Solo esa." },
  finanzas: { name: "Revisar mis gastos de hoy", description: "30 segundos, sin juzgarte." },
  relaciones: { name: "Un mensaje a alguien que quieres", description: "Un 'como estas' cuenta." },
  mentalidad: { name: "Escribir una línea", description: "Lo que sea que tengas en la cabeza." },
  disciplina: { name: "Tender la cama", description: "Lo primero que haces al levantarte." },
};

// The floor: if nothing else feels pequeño, esto lo es. Abrir la app y
// presionar el botón, 30 días seguidos, ya es un hábito.
export const OPEN_APP_SUGGESTION: HabitSuggestion = {
  name: "Abrir la app y presionar el botón",
  description: "Nada más. Si haces eso 30 días seguidos, ya es un hábito.",
  category: "disciplina",
};

/**
 * Suggests an anchor habit from the area with the lowest initial Wheel of
 * Life score — the idea being that's where a small habit moves the needle
 * most. Purely a suggestion: the form stays fully editable regardless.
 */
export function getAnchorHabitSuggestion(
  scores: Record<string, number> | null | undefined
): HabitSuggestion | null {
  if (!scores || Object.keys(scores).length === 0) return null;

  let lowestArea: (typeof WHEEL_AREAS)[number] | null = null;
  let lowestScore = Infinity;
  for (const area of WHEEL_AREAS) {
    const score = scores[area.id];
    if (typeof score === "number" && score < lowestScore) {
      lowestScore = score;
      lowestArea = area;
    }
  }
  if (!lowestArea) return null;

  const category = WHEEL_AREA_TO_CATEGORY[lowestArea.id];
  const base = SUGGESTIONS_BY_CATEGORY[category];
  if (!base) return null;

  return { ...base, category, areaLabel: lowestArea.label };
}

/**
 * Ranks all habit categories by how relevant they are to THIS user — the
 * areas they picked as priorities at onboarding, plus the Radar de Vida
 * areas where they scored themselves lowest (most room to move) — and
 * returns one suggestion per category for the top 5. Used at Module 1,
 * where the anchor habit is chosen, so the options aren't generic: they're
 * shaped by what the person already told the app matters to them.
 */
export function getAnchorHabitOptions(
  selectedAreas: string[] | null | undefined,
  scores: Record<string, number> | null | undefined
): HabitSuggestion[] {
  const selected = new Set(selectedAreas ?? []);

  const totals: Record<string, { sum: number; count: number }> = {};
  for (const area of WHEEL_AREAS) {
    const score = scores?.[area.id];
    if (typeof score !== "number") continue;
    const category = WHEEL_AREA_TO_CATEGORY[area.id];
    totals[category] ??= { sum: 0, count: 0 };
    totals[category].sum += score;
    totals[category].count += 1;
  }

  const PREFERENCE_BONUS = 3;

  const ranked = Object.keys(SUGGESTIONS_BY_CATEGORY)
    .map((category) => {
      const avg = totals[category] ? totals[category].sum / totals[category].count : 5;
      const deficit = 10 - avg; // bigger gap = more room a tiny habit can move
      const priority = deficit + (selected.has(category) ? PREFERENCE_BONUS : 0);
      const areaLabel = WHEEL_AREAS.find((a) => WHEEL_AREA_TO_CATEGORY[a.id] === category)?.label;
      return { category, priority, areaLabel };
    })
    .sort((a, b) => b.priority - a.priority);

  return ranked.slice(0, 5).map(({ category, areaLabel }) => ({
    ...SUGGESTIONS_BY_CATEGORY[category],
    category,
    areaLabel,
  }));
}
