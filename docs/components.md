# Componentes

`src/components/` tiene ~58 archivos. Este documento cubre los realmente
**reutilizables** (los que se usan en más de una pantalla, o son la pieza
base de un patrón repetido). Los específicos de un solo módulo (los
`*Game.tsx` de cada lección, los `*Ritual.tsx` de celebración) están
listados al final sin el mismo detalle — su propósito ya es evidente por
el nombre y viven donde se usan una sola vez.

## `PageHeader`

**Propósito**: encabezado estándar de toda pantalla autenticada.

```tsx
<PageHeader
  kicker="ACCIÓN · 2 DE 3"
  title="Gestiona tus hábitos"
  subtitle={<>Texto opcional, se oculta en modo compacto.</>}
/>
```

**Props**: `kicker: string`, `title: string`, `subtitle?: React.ReactNode`.

**Restricción**: el `subtitle` lleva la clase `compact-hide` internamente
— cualquier contenido puesto ahí desaparece en modo compacto por diseño.
No usar `subtitle` para algo que el usuario necesita ver siempre.

## `HabitCard`

**Propósito**: la tarjeta de "marcar hábito hoy" en el dashboard (Hoy).
Distinta de `EditHabitRow` (gestión, en `/habits`) — no son el mismo
componente aunque muestran datos parecidos.

**Props**: `id, name, category, streak, doneToday, missedYesterday?,
isAnchor?` (todos requeridos salvo los marcados `?`).

**Patrón clave**: hold-to-confirm de 650ms para marcar (evita un check
accidental), estado optimista, milestone de racha a los 7/14/30... días.
En modo compacto pierde el marco (borde/fondo) y la categoría/badge —
queda solo nombre + racha + botón.

**Restricción**: no reusar para la vista de gestión de hábitos — usa
`EditHabitRow` ahí, que sí expone edición, congelar racha y heatmap.

## `EditHabitRow`

**Propósito**: fila de gestión de un hábito en `/habits` — edición
(con cooldown), congelar racha, compartir, heatmap de 12 semanas.

**Props**: `habit, streak, longestStreak, doneToday, canEdit,
nextEditLabel, canFreeze, nextFreezeLabel, isAnchor, logDates,
freezeDates, habitCreatedAt`.

**Restricción**: es un `"use client"` con su propio `useFormState` para
edición inline — no envolver en otro formulario padre.

## `DensityToggle` / `GrainToggle`

**Propósito**: preferencias de pantalla puramente de cliente (modo
compacto, grano de película). Sin props — leen y escriben
`localStorage` + un atributo `data-*` en `<html>`.

**Patrón**: renderizan `null` hasta leer la preferencia una vez (evita
mismatch de hidratación), y un script bloqueante en `layout.tsx` aplica
el atributo antes del primer paint (sin flash).

**Restricción**: **nunca** guardar esto en la base de datos — es
explícitamente una preferencia de dispositivo/sesión, no de cuenta. Para
agregar un toggle nuevo de este tipo, copiar este patrón exacto.

## `ConfirmDialog`

**Propósito**: confirmación modal genérica antes de una acción
irreversible (ej. guardar la línea base del Radar de Vida en onboarding).

**Props**: `open, title, body, confirmLabel, onConfirm, onCancel`.

**Uso**: solo para acciones que realmente no se pueden deshacer después —
no usar como confirmación decorativa de acciones triviales.

## `WheelRadarChart`

**Propósito**: gráfica radar animada del Radar de Vida, con comparación
opcional contra la medición anterior.

**Props**: `current: Record<string, number>`, `previous?:
Record<string, number>`.

**Restricción**: las claves de `current`/`previous` deben ser exactamente
los `id` de `WHEEL_AREAS` en `src/lib/constants.ts` (incluye una con
tilde: `nutrición`) — un typo ahí deja esa área en 0 silenciosamente.

## `AchievementCard` / `AchievementsGallery`

**Propósito**: `AchievementCard` es la tarjeta chica de la grilla de
`/logros`; `AchievementsGallery` envuelve la grilla y agrega la vista de
detalle (modal grande, navegable con flechas/teclado) al hacer click.

**Props de `AchievementCard`**: `progress: AchievementProgress, index:
number` (el `index` solo se usa para variar el hue del `PhotoSlot`).

**Restricción**: en modo compacto, `AchievementCard` oculta narrativa,
puntitos de tier y el hint de "Siguiente:" — mantener esa clase
`compact-hide` si se edita.

## `PhotoSlot`

**Propósito**: placeholder visual reutilizado en toda la app donde
debería ir una foto real (perfil, thumbnails de módulo, arte de logros).
Genera un degradado + textura de ruido (grano vía `feTurbulence`), con
`hue-rotate` variable por índice para que una lista no se vea repetida.

**Props**: `shape: "circle" | "rounded"`, `alt: string`, `className?`.

**Restricción**: es intencionalmente un placeholder — el plan es
reemplazarlo por fotografía real (ver `docs/roadmap.md`, Fase de marca).
No construir lógica que dependa de que siga siendo un degradado
generado.

## `ZenGarden` / `ZenGardenLauncher`

**Propósito**: mini-experiencia de jardín zen rastrillable (Canvas 2D)
en `/cuenta`, pensada como "un momento para ti", no como una feature de
producto con métricas.

**Restricción**: usa `requestAnimationFrame` con guard contra
contenedor en 0×0 (el modal puede montar un frame antes de tener layout
real — ver `docs/decisions.md`). Si se reusa en otro lugar, mantener ese
guard.

## `Nav`

**Propósito**: navegación de la app autenticada — header en desktop, tab
bar fija abajo en mobile. Incluye el `FeedbackWidget`.

**Restricción dura**: `FeedbackWidget` vive **dentro** de `Nav`, nunca en
el layout raíz — moverlo fuerza todas las páginas (incluidas las
públicas) a renderizado dinámico y rompe la generación estática de la
landing, términos, privacidad y changelog.

## `Toast`

**Propósito**: confirmaciones async no bloqueantes (ej. "Guardado").
Animación `toastPop` 200ms, respeta `prefers-reduced-motion`.

**Restricción**: no usar para errores de validación de formulario —
esos van inline con `.form-error` (ver `docs/ui-rules.md`).

## Otros componentes (un solo uso, nombre autoexplicativo)

- **Juegos de módulo** (`WillpowerBatteryGame`, `ParetoDragGame`,
  `SystemVsGoalGame`, `NeverTwiceGame`, `AnchorCascadeGame`,
  `IdentityVotesGame`, `FrictionMeterGame`, `TwoStoriesGame`,
  `HabitChainGame`, `CompassGame`, `MantraCollectionGame`) — cada uno es
  la ilustración interactiva de un módulo específico, montado por
  `ModuleConcept.tsx` según el campo `concept` del módulo en
  `modules-content.ts`. No se reusan entre módulos.
- **Rituales** (`ArrivalRitual`, `ModuleUnlockedRitual`,
  `AchievementUnlockedRitual`, `CycleCompletionRitual`,
  `ResetReentryRitual`, `SubscriptionActivatedRitual`) — pantallas
  completas de celebración, priorizadas explícitamente en
  `dashboard/page.tsx`. Ver `docs/architecture.md`.
- **Formularios de sección de Cuenta** (`EditNameSection`,
  `DeleteAccountSection`, `MiPlanSection`) — cada uno autocontenido con
  su propio Server Action.
- **Utilitarios de presentación** (`Reveal`, `ScrollTextLine`,
  `WordReveal`, `MarqueeTicker`) — animaciones de entrada usadas
  principalmente en la landing pública.
- **Compartir** (`ShareImageButton`, `ShareWheelButton`) — generan una
  imagen a partir de un `<canvas>` (`src/lib/share-card.ts`) para
  compartir racha o Radar de Vida.
