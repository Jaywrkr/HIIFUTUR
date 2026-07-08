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
  salud: { name: "5 sentadillas", description: "Al despertar o antes de dormir. Nada mas." },
  trabajo: { name: "Una tarea de 2 minutos", description: "La mas chica de tu lista. Solo esa." },
  finanzas: { name: "Revisar mis gastos de hoy", description: "30 segundos, sin juzgarte." },
  relaciones: { name: "Un mensaje a alguien que quieres", description: "Un 'como estas' cuenta." },
  mentalidad: { name: "Escribir una linea", description: "Lo que sea que tengas en la cabeza." },
  disciplina: { name: "Tender la cama", description: "Lo primero que haces al levantarte." },
};

// The floor: if nothing else feels pequeño, esto lo es. Abrir la app y
// presionar el boton, 30 dias seguidos, ya es un habito.
export const OPEN_APP_SUGGESTION: HabitSuggestion = {
  name: "Abrir la app y presionar el boton",
  description: "Nada mas. Si haces eso 30 dias seguidos, ya es un habito.",
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
