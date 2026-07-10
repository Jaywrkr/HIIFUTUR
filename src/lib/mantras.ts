/**
 * Mantras de Jay: frases personales del creador del curso, mostradas junto a
 * los módulos y en el dashboard. Cada módulo referencia una directamente
 * (ver MODULES en modules-content.ts); el resto rota en el dashboard.
 */
export const MANTRAS: string[] = [
  "Nadie piensa en el ahora como el futuro pasado.",
  "Productividad no es disciplina, sino hacer más cosas que te hacen sentir feliz, menos estrés y más energía.",
  "Piensa que quieres que digan en tu funeral. No te importara el dinero, sino la persona.",
  "La vida no es justa. Pero llorar no te hace fuerte. Victimizarte te roba poder. Yo no quiero que me tengan lastima, quiero que se levanten al verme. Que digan: ‘si el pudo, yo tambien’. Eso es más útil que cualquier excusa.",
  "Cómo sería esto más divertido.",
  "Escucha, habla menos.",
  "Pragmatismo.",
  "No esperes a ser más senior para fijarte más en los detalles.",
  "Estoy haciendo genuinamente lo mejor que puedo y aún me pregunto: como puedo hacer más? Esa es la diferencia.",
  "El crecimiento real es cuando te cansas de tus mierdas.",
  "La gente pide tanto consejo porque tiene miedo de la prueba y error.",
  "Amate a ti mismo. Pero también se autocritico.",
  "Exito es tener cada día menos arrepentimientos.",
  "La mayoría de las personas utilizan el aprendizaje como una forma de sentirse bien por haber progresado cuando, en realidad, no estan aprendiendo ni progresando. Si no tienes un proyecto, negocio o propósito para aplicar lo que aprendes, estás perdido.",
  "La gente no te ignora, simplemente está ocupada con otras personas que anaden más valor a sus vidas.",
  "Te sientes mal porque sabes lo que se supone que debes hacer y no lo estás haciendo.",
  "El único atajo que tienes que buscar es no buscar atajos.",
  "Tienes una meta? Debes tener solo un plan. Nada de plan B.",
  "No se trata de encontrar lo que te encanta hacer, sino de encontrar aquello que haga que el dolor, el sacrificio y las horas de trabajo valga la pena.",
  "La mayoría de las personas tienen tanto miedo de cometer errores que cometen el mayor error de todos: no cometer errores.",
];

export function getMantraOfTheDay(): string {
  return getMantraForDate(new Date());
}

/** Same rotation as getMantraOfTheDay, but for an arbitrary date — used to
 * show "the mantra of that day" when looking back at a past day. */
export function getMantraForDate(date: Date): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return MANTRAS[dayOfYear % MANTRAS.length];
}
