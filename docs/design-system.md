# Design System

Todo lo de aquí es Tailwind CSS + un puñado de clases propias en
`src/app/globals.css`. No hay librería de componentes — cada clase
reutilizable (`.card`, `.btn-primary`, `.list-row`...) está escrita a mano
ahí. Antes de inventar una clase nueva, revisa si ya existe una parecida.

## Tipografía

**Una sola familia, monoespaciada**: Geist Mono, cargada localmente
(`src/fonts/`, sin Google Fonts) en 5 pesos — 100 (thin), 400 (regular),
600 (semibold), 700 (bold), 900 (black). Aplicada como variable CSS
(`--font-geist-mono`) en todo `html, body`.

- **Títulos de pantalla**: `font-thin` (100) + `tracking-tight`. Antes
  `text-3xl`, ahora `text-2xl` en `PageHeader` (se redujo a propósito —
  ver `docs/decisions.md`).
- **Kickers/eyebrows** (`.kicker`): `text-xs uppercase tracking-widest
  font-semibold`, en una píldora (`rounded-full border`).
- **Cuerpo**: `text-sm` la mayoría del texto de UI, `text-xs` para
  metadatos (categorías, fechas, labels).
- **Nunca** una segunda familia tipográfica — el mono es la identidad
  visual completa, incluidos los títulos.

## Escalas (Tailwind por defecto, sin config custom)

`text-[9px]` a `text-5xl` según Tailwind estándar. Los tamaños chicos con
valor arbitrario (`text-[9px]`, `text-[10px]`, `text-[11px]`) se usan para
metadatos casi decorativos (el hint "mantén" bajo el botón de check, los
labels de tier de logros).

## Colores

Definidos en `tailwind.config.ts` (tema oscuro, sin modo claro en la app
autenticada — la app siempre es dark):

| Token | Valor | Uso |
|---|---|---|
| `accent` | `#FFFFFF` | Blanco puro — acento principal, CTAs, texto destacado |
| `accent-hover` | `#D4D4D4` | Hover de elementos con `accent` |
| `surface` | `#0A0A0A` | Fondo de cards y superficies elevadas |
| `line` | `#262626` | Bordes en toda la app |
| `ink` | `#000000` | Fondo base (`html, body`) |

Colores fuera del config, usados con clases estándar de Tailwind:
`text-neutral-{400,500}` para texto secundario/muted, `text-amber-{400,500}`
para avisos (racha en riesgo, freeze), `text-red-{300,400}` para trial
por vencer/errores, `bg-accent/10` etc. para variantes translúcidas.

Colores por categoría de hábito (`HABIT_CATEGORY_COLORS` en
`src/lib/constants.ts`) — un tono por categoría (salud, trabajo,
finanzas, relaciones, mentalidad, disciplina), usados como el puntito de
color junto al nombre de categoría, nunca como fondo grande.

## Espaciados

Sin escala custom — Tailwind estándar (`0.25rem` por unidad). Patrones
reales del proyecto:

- Padding de tarjeta (`.card`): `p-5` (1.25rem) por defecto — bajado
  desde `p-6` cuando se redujo la vista por defecto.
- `.app-main`: `pt-10 pb-8` en el shell autenticado, con padding extra
  abajo en mobile (`calc(6rem + env(safe-area-inset-bottom))`) para
  dejar espacio a la tab bar fija.
- Separación entre secciones grandes: `mb-14` / `mb-10` / `mb-8` según
  jerarquía — hoy pisados a valores más chicos vía selectores de mayor
  especificidad (ver `docs/decisions.md`, el bug de cascade layers).
- **Modo compacto** (`data-density="compact"` en `<html>`): reduce estos
  mismos valores aún más y oculta elementos completos marcados con la
  clase `.compact-hide` — ver [`docs/ui-rules.md`](ui-rules.md).

## Border radius

- `rounded-md` (0.375rem) — inputs, campos de formulario.
- `rounded-lg` (0.5rem) — cards, botones secundarios, casi todo lo
  rectangular.
- `rounded-full` — botones primarios, kickers, badges, chips de filtro.
- Sin radios custom fuera de la escala de Tailwind.

## Sombras

Uso mínimo y deliberado — no hay elevación tipo Material Design.
`shadow-lg shadow-black/20` en el círculo de foto de perfil (`Cuenta`) es
prácticamente el único uso real de sombra en la app; el resto de la
jerarquía visual se resuelve con borde (`border-line`) y contraste de
fondo (`surface` vs `ink`), no con sombra.

## Grid

Sin sistema de grid propio — `grid grid-cols-{2,3}` de Tailwind
directamente donde hace falta (status band de Hoy, tiles de "Tu
progreso", grilla de logros `grid-cols-2 md:grid-cols-3`).

## Breakpoints

Los estándar de Tailwind, sin override: `sm` 640px, `md` 768px, `lg`
1024px, `xl` 1280px. El quiebre más usado en la app es `md:` (768px) —
la app es mobile-first, con una tab bar fija abajo que solo aparece bajo
`md`.

## Componentes base

Ver [`docs/components.md`](components.md) para el detalle de props/uso.
Las clases CSS reutilizables clave en `globals.css`:

- `.card` — tarjeta base (borde + fondo `surface` + `rounded-lg`).
- `.btn-primary` / `.btn-secondary` — botones, siempre `rounded-full`.
- `.list-row` — fila de lista con divisor inferior, no caja — reservado
  para listas repetidas (hábitos en modo compacto, leaderboard).
- `.kicker` — eyebrow/etiqueta de sección.
- `.field-label` / `.field-input` — formularios.
- `.muted` — texto secundario (`text-neutral-400 text-sm`).

## Estados

- **Hover** (`@media (hover: hover)` — nunca en touch): `.lift-on-hover`
  sube el elemento `-translate-y-4px` con transición suave.
- **Focus**: anillo blanco 2px con offset, global vía `:focus-visible`
  (no se muestra en click de mouse/touch, solo teclado).
- **Disabled**: `opacity-40` a `opacity-50` según el componente.
- **Loading/pending**: texto del botón cambia ("Guardando...") en vez de
  un spinner — patrón consistente en toda la app.
- **Optimista**: `HabitCard` actualiza el estado visual antes de que la
  Server Action confirme, y reconcilia si el servidor responde distinto.

## Accesibilidad

- Foco de teclado siempre visible (`:focus-visible`, ver Estados).
- `aria-live="polite"` en contadores/estados que cambian sin recargar
  (racha, milestone de hábito).
- `aria-pressed` en el botón de check de hábito.
- `prefers-reduced-motion: reduce` respetado en todas las animaciones
  (marquee, page transitions, breathing dot, float cards).
- Sin texto solo-color: los avisos de riesgo combinan color + texto
  explícito, nunca solo un cambio de tono.

## Responsive

Mobile-first en todo momento — la app autenticada usa una tab bar fija
abajo en mobile (oculta en `md:` donde la navegación pasa al header). El
`.app-main` tiene padding extra abajo en mobile para no quedar tapado por
la tab bar + el safe area del home indicator de iOS.
