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
