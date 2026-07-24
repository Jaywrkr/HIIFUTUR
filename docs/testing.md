# Testing

## Unit tests (Vitest)

`npm test` (o `npm run test:watch` en modo watch). 8 archivos, junto al
código que prueban en `src/lib/`:

| Archivo | Qué cubre |
|---|---|
| `cycle.test.ts` | Ciclo de 30 días: días ejecutados, fallos, cálculo de puntos post-reset |
| `leveling.test.ts` | Curva de puntos → nivel |
| `habit-utils.test.ts` | Cálculo de racha (streak) a partir de logs + freezes |
| `habit-stats.test.ts` | Mejor racha histórica, milestones |
| `habit-suggestions.test.ts` | Sugerencia de hábito ancla según áreas + Wheel inicial |
| `modules-content.test.ts` | Integridad de datos del curso (IDs únicos, orden correlativo, campos requeridos) |
| `achievements.test.ts` | Lógica de tiers de logros |
| `rate-limit.test.ts` | Rate limiter en memoria |

**Filosofía**: se testea lógica de negocio pura (sin efectos secundarios,
sin base de datos) — no hay tests unitarios de componentes React ni de
Server Actions directamente. Si una función tiene una regla no obvia
(fórmula de puntos, ventana de fallos permitidos), tiene test.

## Integration tests

No hay una suite de integration tests separada — el equivalente más
cercano es correr las migraciones contra un Postgres real en CI (ver
abajo), que valida que el schema completo aplica limpio, no solo que
compile.

## E2E (Playwright)

`npm run test:e2e`. 2 specs + helpers compartidos en `tests/e2e/`:

- `onboarding.spec.ts` — flujo de registro → onboarding completo.
- `habits-gate.spec.ts` — que el gate de hábitos (bloqueado hasta
  completar el Módulo 1, después bloqueado por ejecución) funcione de
  verdad, no solo visualmente.

**Config clave** (`playwright.config.ts`): corre **serial, 1 worker** a
propósito — los tests comparten un servidor de desarrollo (rate limits en
memoria) y una sola instancia de Postgres, así que correr en paralelo
daba resultados flaky. La suite es chica, el costo de correr serial es
bajo.

En este entorno sandbox, Chromium ya viene preinstalado
(`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) — no correr
`playwright install`, apuntar `executablePath` ahí si hace falta.

## Verificación manual (fuera de la suite automatizada)

Para cambios con superficie de UI, la regla del proyecto (`CLAUDE.md`) es
levantar `npm run start` contra Postgres local (rol/db `ejecuta`/`ejecuta`)
y probar el flujo real con un script de Playwright ad-hoc (no
necesariamente parte de `tests/e2e/`) — capturas de pantalla antes/después,
sobre todo para cambios visuales que un assert automatizado no capturaría
bien (espaciado, contraste, si algo "se ve" distinto).

## Cobertura esperada

No hay un umbral de cobertura configurado ni exigido en CI — el criterio
es cualitativo: **toda función con una regla no obvia** (fórmulas,
ventanas de tiempo, casos límite de fallo) debe tener test unitario. La
UI se verifica con Playwright ad-hoc + los 2 specs de e2e existentes, no
con cobertura de línea.

## Casos críticos ya cubiertos

- Que el ciclo de 30 días perdone exactamente 2 fallos y resetee al
  tercero, preservando el 50% de los puntos ganados desde el inicio del
  ciclo.
- Que la curva de niveles sea estrictamente creciente y no tenga
  divisiones por cero en el punto de entrada (nivel 1, 0 puntos).
- Que el contenido de los 11 módulos no tenga IDs duplicados ni huecos en
  el orden.
- Que el gate de hábitos bloquee correctamente antes del Módulo 1 y
  respete el gate de ejecución después.

## CI

`.github/workflows/ci.yml` corre en cada push a `main`/`claude/**` y en
cada PR: instala, `next lint`, `tsc --noEmit`, `npm test`, migraciones
contra un Postgres 16 real (contenedor de servicio), `next build`, e
`npm run test:e2e` con Chromium instalado vía `--with-deps`. Un PR con
cualquiera de estos pasos en rojo no debería mergearse.
