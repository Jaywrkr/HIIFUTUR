# Mantras y copy aprobado

Complementa [`docs/brand.md`](brand.md) (el porqué) con el copy real ya
en producción — mensajes clave y frases que ya están aprobadas y en uso,
para no reinventar el tono cada vez que se necesita una frase nueva.

## Propósito

Los mantras son frases personales del creador del curso (Jay) — no copy
de marketing genérico. Aparecen junto a cada módulo (una fija por
módulo, ver `MODULES` en `src/lib/modules-content.ts`) y rotan en el
dashboard (`getMantraOfTheDay()`, una por día del año, siempre la misma
frase en la misma fecha).

## Principio detrás de los mantras

Un mantra de EJECUTA nunca es una frase motivacional genérica que podría
estar en cualquier cuenta de Instagram de productividad — es
específico, a veces incómodo, siempre en primera persona real de
alguien que ya pasó por esto. Si un mantra nuevo se siente
intercambiable con "cree en ti mismo" o "el éxito es un viaje", no es un
mantra de EJECUTA.

## Mensajes clave (los que sostienen todo lo demás)

- **La cifra real**: *"Pasé de un 3 a un 9 en mi Radar de Vida, en 8
  meses. Sistema pequeño, sostenido, mes tras mes."* — `JAY_RESULT_LINE`
  en `src/lib/constants.ts`. Una sola redacción, reusada en landing y en
  el Módulo 1 a propósito, para no mantener dos versiones del mismo
  dato.
- **La propuesta central**: *"No es disciplina. No es fuerza de
  voluntad. Es un sistema que no pueda fallar."* — hero de la landing.
- **El filtro anti-hype**: *"Sin gurús, sin 47 hábitos a la vez, sin
  culpa cuando fallas un día."*

## Copy aprobado — mantras completos (`src/lib/mantras.ts`)

Rotan uno por día en el dashboard, 20 en total. Selección representativa
del rango de tono permitido (de reflexivo a directo/incómodo):

> "La vida no es justa. Pero llorar no te hace fuerte. Victimizarte te
> roba poder. Yo no quiero que me tengan lástima, quiero que se levanten
> al verme. Que digan: 'si él pudo, yo también'. Eso es más útil que
> cualquier excusa."

> "El crecimiento real es cuando te cansas de tus mierdas."

> "Te sientes mal porque sabes lo que se supone que debes hacer y no lo
> estás haciendo."

> "Éxito es tener cada día menos arrepentimientos."

> "No esperes a ser más senior para fijarte más en los detalles."

> "El único atajo que tienes que buscar es no buscar atajos."

Ver el archivo completo para las 20 — sirven como calibre de tono antes
de escribir cualquier frase nueva que pretenda sonar "a EJECUTA".

## Copy aprobado — mantras por módulo (fragmento representativo)

Cada uno de los 11 módulos tiene su propio mantra fijo (`mantra` en
`MODULES`, `src/lib/modules-content.ts`), pensado como cierre de esa
lección específica, no intercambiable con otro módulo:

- Módulo 1 (Por qué fallas): *"El crecimiento real es cuando te cansas
  de tus mierdas."*
- Módulo 4 (Las primeras 72 horas): *"¿Tienes una meta? Debes tener solo
  un plan. Nada de plan B."*
- Módulo 10 (Radar de Vida como brújula): *"Piensa qué quieres que digan
  en tu funeral. No te importará el dinero, sino la persona."*
- Módulo 11 (Tu mantra personal): *"Éxito es tener cada día menos
  arrepentimientos."*

## Cómo escribir un mantra o frase nueva "a la Jay"

1. Primera persona o segunda persona directa — nunca tercera persona
   plural ("la gente que triunfa...").
2. Una idea, dicha una sola vez, sin repetirla con otras palabras.
3. Preferir lo específico e incómodo sobre lo cómodo y genérico.
4. Sin signos de exclamación, sin emojis.
5. Si suena bien leído en voz alta con pausas cortas, está en el tono
   correcto — los mantras están escritos para leerse despacio, no para
   escanearse rápido como un titular.
