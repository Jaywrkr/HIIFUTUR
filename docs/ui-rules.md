# Reglas de interfaz

Complementa [`docs/design-system.md`](design-system.md) (los tokens) y
[`docs/ux-principles.md`](ux-principles.md) (el criterio detrás de las
reglas). Esto es la lista concreta de "así se ve, así se comporta".

## Cómo deben verse las pantallas

- Cada pantalla autenticada abre con `<PageHeader kicker title subtitle
  />` — kicker en mayúsculas dentro de una píldora, título en
  `font-thin`, subtítulo opcional que se oculta entero en modo compacto.
- Nunca dos pantallas resuelven el mismo tipo de contenido con un patrón
  visual distinto — si una lista de hábitos usa `.list-row`, otra lista
  de la misma naturaleza también.
- El contenido crítico (lo que el usuario vino a hacer) va arriba, sin
  scroll; lo secundario (estadísticas, enlaces a otras secciones) abajo.

## Márgenes y espaciados

Ver la tabla completa en `design-system.md`. Regla práctica: **no
inventar un valor de spacing nuevo** — usar `mb-14`/`mb-10`/`mb-8`/`gap-4`
ya establecidos, que además responden automáticamente al modo compacto
por los selectores en `globals.css`. Un `mb-6` suelto sin pasar por esos
selectores no se comprime en modo compacto — probablemente un bug.

## Jerarquías visuales

1. Kicker (contexto de sección) → 2. Título (qué es esta pantalla) →
3. Contenido accionable → 4. Contenido informativo secundario → 5.
Navegación a otras secciones. El tamaño de fuente y el peso bajan en ese
mismo orden.

## Botones

- **Primario** (`.btn-primary`): fondo blanco, texto negro, `rounded-full`,
  uppercase, tracking-widest. Uno solo por pantalla/sección — si hay dos
  acciones, la segunda es `.btn-secondary`.
- **Secundario** (`.btn-secondary`): borde, sin relleno, mismo
  `rounded-full`. Hover: borde + texto pasan a `accent`.
- Texto de botón siempre en mayúsculas vía `uppercase tracking-widest`,
  nunca mezcla de mayúsculas/minúsculas dentro de un mismo botón.
- Estado pending: el texto del botón cambia (`"Guardando..."`), no se
  agrega un spinner aparte.
- El botón de marcar hábito (`HabitCard`) es la única excepción al patrón
  texto — es un cuadrado con hold-to-confirm (650ms), pensado para evitar
  un check accidental en un gesto de una sola línea de código repetido
  muchas veces al día.

## Inputs

- `.field-input`: fondo `ink`, borde `line`, `rounded-md`, foco cambia
  borde a `accent` (sin anillo extra — el borde ya es la señal).
- `.field-label` siempre arriba del input, nunca placeholder-como-label.
- Errores de formulario: `.form-error`, texto rojo chico debajo del
  campo o del formulario completo — nunca un toast para errores de
  validación de formulario (el toast es para confirmaciones async).

## Cards

- `.card`: la unidad para contenido "objeto" — un hábito en el dashboard,
  un módulo, un logro. **No** usar `.card` para listas largas y repetidas
  (eso es `.list-row` — diez cards apiladas se leen como un panel de
  admin, no como una pantalla de producto).
- En modo compacto, `HabitCard` específicamente pierde su marco entero
  (borde + fondo) y pasa a ser una fila plana con un solo divisor — ver
  `docs/decisions.md` para el razonamiento.

## Tablas

No hay tablas HTML en la app — donde otras apps usarían una tabla
(leaderboard, historial), Ankla usa filas (`.list-row`) con columnas
implícitas via flexbox. Mantener esa convención antes de introducir un
`<table>` real.

## Modales

- Overlay a pantalla completa (`fixed inset-0 z-50`), fondo sólido
  `bg-ink` (no translúcido — un fondo semitransparente dejaba ver la
  grilla detrás en el detalle de logros, ver `docs/decisions.md`).
- Cierre siempre con 3 vías: botón "Cerrar ✕" visible, tecla `Escape`, y
  click en el overlay (no en el contenido — `stopPropagation` en el panel
  interno).
- `role="dialog" aria-modal="true" aria-label="..."` siempre.

## Animaciones

- Duración corta: 150-300ms para casi todo (`fadeIn 220ms`, `toastPop
  200ms`, lift-on-hover `300ms`).
- Una sola animación "de marca": el `breathing-dot` (4s, ease-in-out) del
  punto junto al wordmark — el único lugar donde se permite un cue
  contemplativo, porque es sutil y periférico, no en el flujo principal.
- **Todo** respeta `prefers-reduced-motion: reduce` — cada `@keyframes`
  tiene su contraparte `animation: none` en el media query.

## Microinteracciones

- Estado optimista en acciones frecuentes (marcar hábito) — la UI cambia
  antes de que el servidor confirme, y se reconcilia después.
- Milestones de racha (7, 14, 30... días) muestran un overlay chico
  dentro de la misma card por 2.6s, no un modal aparte.
- Hover con `lift-on-hover` en tarjetas clickeables de escritorio — nunca
  en mobile (no tiene sentido con touch, y el CSS ya lo excluye vía
  `@media (hover: hover)`).

## Qué nunca hacer

- No agregar una segunda familia tipográfica.
- No usar `!important` para pisar un estilo — si una utilidad de
  Tailwind no aplica, es casi siempre el bug de cascade layers descrito
  en `docs/decisions.md`; la solución es un selector más específico.
- No poner el `FeedbackWidget` en el layout raíz (rompe la generación
  estática de páginas públicas).
- No mostrar el email de un usuario en ninguna superficie compartida.
- No usar `.card` para una lista larga y repetida.
- No animar algo sin su contraparte `prefers-reduced-motion`.
- No inventar un nuevo tono de spacing/color fuera de lo ya establecido
  sin buena razón — la consistencia visual pesa más que la variedad.
