export const LIFE_AREAS = [
  { id: "salud", label: "Salud" },
  { id: "trabajo", label: "Trabajo" },
  { id: "finanzas", label: "Finanzas" },
  { id: "relaciones", label: "Relaciones" },
  { id: "mentalidad", label: "Mentalidad" },
  { id: "disciplina", label: "Disciplina" },
] as const;

export const MAX_SELECTED_AREAS = 3;

export const WHEEL_AREAS = [
  { id: "salud_fisica", label: "Salud Fisica" },
  { id: "nutrición", label: "Nutrición" },
  { id: "ejercicio", label: "Ejercicio" },
  { id: "relaciones", label: "Relaciones" },
  { id: "trabajo_carrera", label: "Trabajo / Carrera" },
  { id: "finanzas", label: "Finanzas" },
  { id: "mentalidad", label: "Mentalidad" },
  { id: "disciplina", label: "Disciplina" },
  { id: "descanso", label: "Descanso" },
  { id: "crecimiento_personal", label: "Crecimiento Personal" },
] as const;

export const HABIT_CATEGORIES = [
  { id: "salud", label: "Salud" },
  { id: "trabajo", label: "Trabajo" },
  { id: "finanzas", label: "Finanzas" },
  { id: "relaciones", label: "Relaciones" },
  { id: "mentalidad", label: "Mentalidad" },
  { id: "disciplina", label: "Disciplina" },
] as const;

export const MAX_HABITS = 5;
export const DAYS_TO_UNLOCK_NEXT_HABIT = 30;
export const DAYS_BETWEEN_WHEEL_MEASUREMENTS = 30;

/** Editing a habit is real friction, not a free do-over — you wait between edits. */
export const DAYS_BETWEEN_HABIT_EDITS = 14;

/** One missed day shouldn't erase weeks of consistency — but it's not free either. */
export const DAYS_BETWEEN_STREAK_FREEZES = 30;

/** Maps each Wheel of Life area to the closest habit category, used for the monthly insight. */
export const WHEEL_AREA_TO_CATEGORY: Record<string, (typeof HABIT_CATEGORIES)[number]["id"]> = {
  salud_fisica: "salud",
  nutrición: "salud",
  ejercicio: "salud",
  relaciones: "relaciones",
  trabajo_carrera: "trabajo",
  finanzas: "finanzas",
  mentalidad: "mentalidad",
  disciplina: "disciplina",
  descanso: "salud",
  crecimiento_personal: "mentalidad",
};
