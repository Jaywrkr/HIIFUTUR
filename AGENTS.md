# AGENTS.md — guía para cualquier agente de IA en este repo

Este archivo es para cualquier agente (Claude Code, Cursor, Copilot Workspace,
lo que sea) que trabaje en este repo. Si eres Claude Code específicamente, lee
también [`CLAUDE.md`](CLAUDE.md) — tiene reglas más detalladas de estilo y
flujo de trabajo del dueño.

## Qué es esto

Ankla: curso interactivo + habit tracker, Next.js 14 (App Router) +
TypeScript + Postgres (Drizzle). Monolito — sin backend separado. Ver
[`docs/architecture.md`](docs/architecture.md) para el detalle completo.

## Arquitectura, en una frase

El navegador pide una página → un Server Component la renderiza leyendo
Postgres directo → las mutaciones son Server Actions (no una API REST hecha
a mano) → solo 6 rutas HTTP reales existen porque *tienen* que serlo
(NextAuth, cron, webhook de PayPal, endpoint de check llamado desde el
Service Worker, unsubscribe por link de email, setup de migraciones).

## Flujo de trabajo

1. Cada tarea parte de una rama nueva desde la rama por defecto del repo.
2. El dueño del proyecto (Jay) revisa y mergea los pull requests — un agente
   no debe mergear sin que se le pida explícitamente.
3. Antes de proponer cualquier cambio, correr la verificación completa (ver
   checklist más abajo) — no proponer un PR con `tsc`, lint, tests o build
   rotos.

## Cómo encontrar información

| Necesito saber... | Voy a... |
|---|---|
| Qué hace el producto, estado actual | [`docs/context.md`](docs/context.md) |
| Cómo está armado técnicamente | [`docs/architecture.md`](docs/architecture.md) |
| El schema real de la base de datos | [`docs/database.md`](docs/database.md) o `src/db/schema.ts` directo |
| Qué endpoints/actions existen | [`docs/api.md`](docs/api.md) |
| Cómo se ve y suena la marca | [`docs/brand.md`](docs/brand.md), [`docs/mantras.md`](docs/mantras.md) |
| Reglas de diseño (colores, espaciado, tipografía) | [`docs/design-system.md`](docs/design-system.md) |
| Cómo deben comportarse las pantallas | [`docs/ui-rules.md`](docs/ui-rules.md) |
| Un componente reutilizable existente | [`docs/components.md`](docs/components.md) |
| Un flujo de usuario completo | [`docs/user-flows.md`](docs/user-flows.md) |
| Por qué se tomó una decisión técnica | [`docs/decisions.md`](docs/decisions.md) |
| Qué falta / en qué se está trabajando | [`docs/current-sprint.md`](docs/current-sprint.md) |
| Reglas de commits, código, checklist | [`CLAUDE.md`](CLAUDE.md), [`docs/contributing.md`](docs/contributing.md) |

Si un documento y el código no coinciden, **el código manda** — los docs
pueden quedar desactualizados, el código nunca miente. Si notas esa
discrepancia, corrige el doc como parte de tu cambio.

## Qué carpetas contienen qué

```
src/app/          Rutas (App Router). Una carpeta = una URL.
src/app/api/      Las únicas 6 rutas HTTP reales — todo lo demás es
                   Server Component o Server Action, no API.
src/components/   Componentes React, un archivo por componente.
src/lib/          Server Actions (*-actions.ts), queries (queries.ts),
                   y lógica de negocio pura y testeada (cycle.ts,
                   leveling.ts, habit-utils.ts, etc.).
src/db/           schema.ts es la fuente de verdad del modelo de datos.
drizzle/          Migraciones SQL generadas — nunca editar el contenido
                   generado salvo para agregar IF NOT EXISTS.
scripts/          Scripts de una sola vez, no parte del runtime normal.
docs/             Esta documentación.
tests/e2e/        Playwright.
```

## Convenciones (resumen — ver CLAUDE.md para el detalle)

- Server Components por defecto; `"use client"` solo con estado/efectos/eventos.
- Mutaciones = Server Actions en `src/lib/*-actions.ts`, no rutas API nuevas.
- Sin librerías de componentes UI externas (Radix, MUI, shadcn) — todo con
  Tailwind y las clases ya definidas en `globals.css`.
- Sin state manager global de cliente — el estado de servidor vive en
  Postgres, el estado de UI local usa `useState` en el componente.
- Comentarios solo para el *por qué*, nunca para describir *qué* hace el
  código si el nombre ya lo dice.
- Migraciones de schema siempre idempotentes (`IF NOT EXISTS`), y
  espejadas manualmente en `src/app/api/setup/migrate/route.ts`.

## Cómo hacer cambios sin romper el proyecto

- **Nunca** muevas `FeedbackWidget` fuera de `Nav` ni al layout raíz —
  fuerza todas las páginas a dinámicas y rompe la generación estática de
  las públicas (landing, términos, privacidad, changelog). Ya pasó una vez.
- **Nunca** muestres el email de un usuario en una superficie compartida
  (leaderboard, etc.) — solo nombre o "Usuario".
- Antes de tocar `src/db/schema.ts`: generar la migración con
  `npx drizzle-kit generate`, editar el SQL resultante para que cada
  `ALTER TABLE ... ADD COLUMN` lleve `IF NOT EXISTS`, y espejar el cambio
  en `src/app/api/setup/migrate/route.ts`.
- Antes de tocar cualquier CSS: revisar si la clase que estás sobreescribiendo
  vive en un `@layer components` o fuera de él. CSS sin capa (unlayered)
  siempre le gana a las utilidades de Tailwind sin importar el orden — ya
  causó bugs reales (ver `docs/decisions.md`). El patrón de solución es un
  selector con más especificidad (`[data-density="compact"] .card`), no
  `!important`.
- No agregues una dependencia nueva sin revisar primero si ya existe algo
  equivalente en el proyecto (ver la lista de librerías preferidas/prohibidas
  en `CLAUDE.md`).

## Checklist antes de crear un Pull Request

1. `npx tsc --noEmit` sin errores.
2. `npx next lint` sin warnings.
3. `npm test` — todos los tests unitarios en verde.
4. `rm -rf .next && npx next build` — build de producción limpio.
5. Si el cambio toca UI: `npm run start` contra Postgres local y probar el
   flujo real con Playwright (Chromium en `/opt/pw-browsers/chromium`).
6. Si es una feature nueva: bump de versión (minor) en `package.json` +
   entrada en `src/lib/changelog.ts`.
7. Confirmar que ninguna de las reglas de "Cómo hacer cambios sin romper
   el proyecto" (arriba) quedó comprometida.
8. Mensaje de commit descriptivo en español — el *por qué*, no una lista
   de archivos tocados.
