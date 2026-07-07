/**
 * Mantras de Jay: frases personales del creador del curso, mostradas junto a
 * los modulos y en el dashboard. Cada modulo referencia una directamente
 * (ver MODULES en modules-content.ts); el resto rota en el dashboard.
 */
export const MANTRAS: string[] = [
  "Nadie piensa en el ahora como el futuro pasado.",
  "Productividad no es disciplina, sino hacer mas cosas que te hacen sentir feliz, menos estres y mas energia.",
  "Piensa que quieres que digan en tu funeral. No te importara el dinero, sino la persona.",
  "La vida no es justa. Pero llorar no te hace fuerte. Victimizarte te roba poder. Yo no quiero que me tengan lastima, quiero que se levanten al verme. Que digan: ‘si el pudo, yo tambien’. Eso es mas util que cualquier excusa.",
  "Como seria esto mas divertido.",
  "Escucha, habla menos.",
  "Pragmatismo.",
  "No esperes a ser mas senior para fijarte mas en los detalles.",
  "Estoy haciendo genuinamente lo mejor que puedo y aun me pregunto: como puedo hacer mas? Esa es la diferencia.",
  "El crecimiento real es cuando te cansas de tus mierdas.",
  "La gente pide tanto consejo porque tiene miedo de la prueba y error.",
  "Amate a ti mismo. Pero tambien se autocritico.",
  "Exito es tener cada dia menos arrepentimientos.",
  "La mayoria de las personas utilizan el aprendizaje como una forma de sentirse bien por haber progresado cuando, en realidad, no estan aprendiendo ni progresando. Si no tienes un proyecto, negocio o proposito para aplicar lo que aprendes, estas perdido.",
  "La gente no te ignora, simplemente esta ocupada con otras personas que anaden mas valor a sus vidas.",
  "Te sientes mal porque sabes lo que se supone que debes hacer y no lo estas haciendo.",
  "El unico atajo que tienes que buscar es no buscar atajos.",
  "Tienes una meta? Debes tener solo un plan. Nada de plan B.",
  "No se trata de encontrar lo que te encanta hacer, sino de encontrar aquello que haga que el dolor, el sacrificio y las horas de trabajo valga la pena.",
  "La mayoria de las personas tienen tanto miedo de cometer errores que cometen el mayor error de todos: no cometer errores.",
];

export function getMantraOfTheDay(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return MANTRAS[dayOfYear % MANTRAS.length];
}
