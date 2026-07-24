# Principios de UX

Complementa [`docs/ui-rules.md`](ui-rules.md) (las reglas concretas) con
el criterio de fondo — el "por qué" detrás de cada regla, para poder
decidir casos nuevos que las reglas no cubren todavía.

## Minimalismo con intención, no por estética

Cada pantalla muestra lo que hace falta para la acción de ese momento —
no todo lo que *podría* mostrarse. El dashboard "Hoy" prioriza los
hábitos a marcar sobre las estadísticas; las estadísticas existen, pero
más abajo. Cuando se pide "más simple" en este producto, la respuesta
correcta es **quitar elementos de la pantalla**, no solo apretar el
espaciado entre ellos — ver el modo compacto/zen como el ejemplo más
extremo de este principio ya implementado (`docs/decisions.md`, ADR-003).

## Claridad sobre densidad de información

Un número sin contexto no sirve — "20" junto a "PUNTOS" es claro, "20"
solo no lo es. Pero el contexto se da con la etiqueta mínima necesaria
(`.kicker`, labels chicos en mayúsculas), no con un párrafo explicativo.
Si algo necesita un párrafo para entenderse, probablemente el diseño de
esa pantalla necesita cambiar, no agregar más texto.

## Foco: una acción principal por pantalla

Cada pantalla tiene un `.btn-primary` como máximo, casi siempre uno solo
en el viewport inicial. Acciones secundarias son `.btn-secondary` o
enlaces de texto — la jerarquía visual nunca compite por atención con la
acción principal del momento (marcar el hábito, completar el ejercicio,
medir el Wheel).

## Tono emocional: calma, nunca urgencia artificial

Sin countdown timers falsos, sin "¡últimos cupos!", sin rojo agresivo
salvo para lo que realmente es una alerta (trial por vencer, racha en
riesgo — y ahí es un ámbar cálido, no rojo puro). El aviso de racha en
riesgo cambia de color, no aparece un modal interrumpiendo. Ver
[`docs/brand.md`](brand.md) para las emociones a transmitir/evitar a
nivel de marca — esto es la traducción a interacción.

## El fallo es parte del diseño, no una excepción visual

El sistema perdona 2 fallos antes de resetear el ciclo — y la UI lo
refleja sin dramatizar: un contador ("Fallos 1/2"), nunca un ícono de
alerta roja por un solo día perdido. El congelador de racha existe
específicamente para que un mal día no se sienta como un fracaso del
sistema completo.

## Animación: apoyo, nunca protagonista

Duración corta (150-300ms) en casi todo; una sola animación
"contemplativa" deliberada (el `breathing-dot`, 4s, periférico). Ninguna
animación bloquea una acción del usuario ni existe solo por verse bien —
cada una comunica un cambio de estado real (algo se guardó, algo se
desbloqueó, algo cambió de valor). Toda animación respeta
`prefers-reduced-motion`.

## Rituales: celebrar sin interrumpir el flujo diario

Los momentos grandes (desbloquear un módulo, ganar un logro, completar
el ciclo) tienen su propia pantalla de celebración — pero nunca compiten
entre sí el mismo día (hay una cadena de prioridad explícita en
`dashboard/page.tsx`) ni se repiten dos veces por el mismo evento. La
celebración es genuina pero acotada — un momento, no una interrupción
constante.

## Estado optimista donde la acción es frecuente

Marcar un hábito es la interacción más repetida de la app — por eso
`HabitCard` actualiza visualmente antes de que el servidor confirme.
Acciones infrecuentes (editar un hábito, completar un ejercicio de
módulo) no necesitan ese optimismo — el costo de un pequeño delay ahí es
bajo, y la complejidad de manejar la reconciliación no se justifica.

## Progresivo, no abrumador, en el onboarding

Una decisión a la vez (áreas de vida → Wheel of Life → hábito ancla, en
ese orden, cada uno en su propia pantalla) — nunca un formulario largo
con todo junto. El límite explícito de 3 áreas ("no más — el sistema
funciona porque es pequeño") es una regla de producto expresada
literalmente en el copy del paso, no solo aplicada en silencio.

## Accesibilidad como requisito, no como capa extra

Foco de teclado siempre visible, `aria-live` en valores que cambian sin
recargar, `prefers-reduced-motion` respetado en absolutamente toda
animación, sin información transmitida solo por color. Ver la lista
completa en [`docs/design-system.md`](design-system.md#accesibilidad).
