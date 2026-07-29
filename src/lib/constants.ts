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
  {
    id: "salud_fisica",
    label: "Salud Fisica",
    description: "Energía y cómo se siente tu cuerpo día a día. Ej: dormir lo suficiente, no vivir agotado.",
  },
  {
    id: "nutrición",
    label: "Nutrición",
    description: "Qué tan bien te alimentas, no cuánto pesas. Ej: comer variado, no saltarte comidas por flojera.",
  },
  {
    id: "ejercicio",
    label: "Ejercicio",
    description: "Movimiento regular, no rendimiento atlético. Ej: caminar, entrenar, estirar — lo que hagas seguido.",
  },
  {
    id: "relaciones",
    label: "Relaciones",
    description: "Calidad de tus vínculos cercanos: familia, pareja, amigos. Ej: ¿te sientes acompañado o aislado?",
  },
  {
    id: "trabajo_carrera",
    label: "Trabajo / Carrera",
    description: "Qué tan realizado te sientes con lo que haces para vivir. Ej: crecimiento y propósito, no solo el sueldo.",
  },
  {
    id: "finanzas",
    label: "Finanzas",
    description: "Tu relación con el dinero: control y tranquilidad. Ej: ¿sabes a dónde se va lo que ganas?",
  },
  {
    id: "mentalidad",
    label: "Mentalidad",
    description: "Cómo te hablas a ti mismo ante los problemas. Ej: ¿te tratas con dureza o con calma?",
  },
  {
    id: "disciplina",
    label: "Disciplina",
    description: "Qué tanto cumples lo que te propones sin depender del ánimo. Ej: hacer lo que dijiste, aunque no tengas ganas.",
  },
  {
    id: "descanso",
    label: "Descanso",
    description: "Sueño y tiempo libre real, no solo horas en la cama. Ej: ¿te levantas descansado? ¿tienes tiempo para no hacer nada?",
  },
  {
    id: "crecimiento_personal",
    label: "Crecimiento Personal",
    description: "Qué tanto estás aprendiendo o evolucionando. Ej: leer, un curso, reflexionar — no solo acumular información.",
  },
] as const;

export const HABIT_CATEGORIES = [
  { id: "salud", label: "Salud" },
  { id: "trabajo", label: "Trabajo" },
  { id: "finanzas", label: "Finanzas" },
  { id: "relaciones", label: "Relaciones" },
  { id: "mentalidad", label: "Mentalidad" },
  { id: "disciplina", label: "Disciplina" },
] as const;

/** The app's one named accent palette — muted, earthy, never saturated,
 * same rule Open uses for its editorial color cards. Defined once here so
 * every screen (hábitos, Radar de Vida, cuestionarios) draws from the same
 * six tones instead of each inventing its own. */
export const BRAND_PALETTE = {
  oliva: "#9AA07A",
  mostaza: "#D0A24A",
  coral: "#D1948A",
  cielo: "#8FB0C9",
  salvia: "#A7C08A",
  terracota: "#B5654A",
} as const;

/** One color per category, all the way down — a small dot next to a label,
 * never a fill or a badge. Color marks context, it doesn't shout. */
export const HABIT_CATEGORY_COLORS: Record<(typeof HABIT_CATEGORIES)[number]["id"], string> = {
  salud: BRAND_PALETTE.oliva,
  trabajo: BRAND_PALETTE.cielo,
  finanzas: BRAND_PALETTE.mostaza,
  relaciones: BRAND_PALETTE.coral,
  mentalidad: BRAND_PALETTE.salvia,
  disciplina: BRAND_PALETTE.terracota,
};

export const MAX_HABITS = 5;
export const DAYS_TO_UNLOCK_NEXT_HABIT = 30;
export const DAYS_BETWEEN_WHEEL_MEASUREMENTS = 30;

/** Editing a habit is real friction, not a free do-over — you wait between edits. */
export const DAYS_BETWEEN_HABIT_EDITS = 14;

/** One missed day shouldn't erase weeks of consistency — but it's not free either. */
export const DAYS_BETWEEN_STREAK_FREEZES = 30;

/** Maps each Radar de Vida area to the closest habit category, used for the monthly insight. */
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

/** The color for a Radar de Vida area, inherited from its habit category —
 * "Nutrición", "Ejercicio" y "Descanso" comparten el oliva de Salud a
 * propósito: son la misma familia, y un color por cada una de las 10 áreas
 * (contra solo 6 tonos definidos) hubiera forzado repeticiones sin sentido. */
export function colorForWheelArea(areaId: string): string {
  const category = WHEEL_AREA_TO_CATEGORY[areaId] ?? "disciplina";
  return HABIT_CATEGORY_COLORS[category];
}

/** La cifra real detrás de ANKLA — una sola redacción, usada en landing y
 * en el Módulo 1, para no mantener dos versiones del mismo dato. */
export const JAY_RESULT_LINE =
  "Pasé de un 3 a un 9 en mi Radar de Vida, en 8 meses. Sistema pequeño, sostenido, mes tras mes.";
