export type GlossaryEntry = { term: string; definition: string };

// Términos propios del curso/la app que aparecen repetido en el contenido.
// Ordenados de más largo a más corto a propósito: al buscar coincidencias se
// prueba "hábito ancla" antes que términos más cortos, para no partir una
// frase compuesta a la mitad.
export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "hábito ancla",
    definition:
      "El primer hábito que eliges, tan pequeño que puedes sostenerlo hasta en tu peor día. No es 'el más importante' — es el que jala a todos los demás sin esfuerzo extra, porque nunca falla.",
  },
  {
    term: "Principio de Pareto",
    definition:
      "También llamado la regla 80/20: el 80% de tus resultados viene de solo el 20% de tus acciones. En el curso lo usas para encontrar esa acción pequeña que mueve todo lo demás, en vez de intentar cambiar diez cosas a la vez.",
  },
  {
    term: "Wheel of Life",
    definition:
      "La 'rueda de la vida': mides del 1 al 10 varias áreas (salud, dinero, relaciones, etc.) cada 30 días. Sirve como el control del sistema — te dice con números, no con sensaciones, si tus hábitos de verdad están moviendo algo.",
  },
  {
    term: "fricción",
    definition:
      "Qué tan fácil o difícil es empezar un hábito en el momento. Menos fricción (dejar la ropa de correr lista, por ejemplo) significa más probabilidad de que lo hagas incluso sin ganas.",
  },
  {
    term: "identidad",
    definition:
      "Quién crees que eres, no solo qué haces. Cada vez que cumples tu hábito no solo tachas una tarea — le confirmas a tu cerebro 'soy alguien que sí sostiene esto', y eso hace más fácil el siguiente día.",
  },
  {
    term: "racha",
    definition:
      "Días seguidos que llevas cumpliendo un hábito. Se muestra en cada hábito de tu tablero — si un día se te pasa, puedes usar un 'freeze' para protegerla en vez de perderla.",
  },
];

export type GlossarySegment = { text: string } | { term: string; definition: string };

/** Parte un texto en segmentos planos y términos del glosario, marcando
 * solo la PRIMERA aparición de cada término que no esté ya en `usedTerms`
 * (compartido entre párrafos de un mismo módulo) — así el texto no se
 * llena de subrayados repetidos cuando un término sale diez veces. */
export function annotateGlossary(text: string, usedTerms: Set<string>): GlossarySegment[] {
  const candidates = GLOSSARY.filter((e) => !usedTerms.has(e.term));
  if (candidates.length === 0) return [{ text }];

  const pattern = new RegExp(
    `(${candidates.map((e) => e.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "i"
  );
  const match = text.match(pattern);
  if (!match || match.index === undefined) return [{ text }];

  const entry = candidates.find((e) => e.term.toLowerCase() === match[0].toLowerCase());
  if (!entry) return [{ text }];

  usedTerms.add(entry.term);
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  const afterSegments = annotateGlossary(after, usedTerms);
  return [
    ...(before ? [{ text: before }] : []),
    { term: match[0], definition: entry.definition },
    ...afterSegments,
  ];
}
