# EJECUTA — notas para Claude

## Objetivo del producto

Curso interactivo + habit tracker. La idea central: la motivacion falla,
un sistema pequeno y sostenido no. Una persona elige **un solo habito
ancla** (el mas pequeno posible), lo sostiene dia a dia, y cada 30 dias
mide con el Wheel of Life si algo real se movio. El contenido del curso
(11 modulos) se desbloquea con ejecucion real — dias de habito cumplido —
no con tiempo transcurrido ni con dinero pagado. Ver
[`docs/context.md`](docs/context.md) para el estado actual completo y
[`docs/brand.md`](docs/brand.md) para la marca.

## Filosofia del proyecto

- **Sistema, no motivacion.** Nunca se vende "date ganas" — se vende algo
  tan chico que no hace falta tener ganas.
- **Numeros reales, no promesas.** "Pasaste de un 3 a un 9" convence mas
  que un adjetivo. Preferir datos concretos sobre superlativos en todo
  el copy y en toda decision de producto.
- **El fallo esta incluido en el diseno**, no es una excepcion. El ciclo
  de 30 dias perdona 2 fallos antes de resetear; el streak freeze protege
  un dia perdido. Ningun flujo debe asumir que el usuario es perfecto.
- **Menos elementos, no solo menos espacio.** Cuando se pide "mas simple"
  o "mas zen", la respuesta es quitar cosas de la pantalla, no solo
  achicarlas (ver el patron `.compact-hide` / modo compacto).

## Que nunca debe romper

- La generacion estatica de las paginas publicas (landing, terminos,
  privacidad, changelog). Ver la regla de `FeedbackWidget` mas abajo —
  ya causo una regresion real.
- Los emails de usuario nunca se muestran en superficies compartidas
  (leaderboard, etc.) — ver regla dura mas abajo.
- Las migraciones de base de datos en produccion — deben poder correr
  mas de una vez sin fallar (idempotentes).
- El login/registro tras cualquier cambio en `AUTH_SECRET`,
  `NEXTAUTH_URL` o el schema de `users`.
- El flujo de pago de PayPal (webhook, planes, trial) — es dinero real
  de usuarios reales, no un feature mas.

## Prioridades

1. Que la app en produccion siga funcionando (build, login, pagos, cron).
2. Que las migraciones nunca rompan datos existentes.
3. Consistencia visual con lo ya construido antes que un patron nuevo.
4. Todo lo demas (features nuevas, pulido visual, copy).

## Flujo de trabajo (instruccion del dueño)

- **Cada tarea nueva va en una rama nueva** partiendo de la rama por defecto.
  El dueño (Jay) hace el pull request y el merge — no crear PRs ni mergear
  sin que lo pida.
- Commits con mensajes descriptivos en español, un bump de version en
  `package.json` por feature (minor) y entrada en `src/lib/changelog.ts`.

## Reglas duras del proyecto

- **Migraciones idempotentes**: despues de `npx drizzle-kit generate`, editar
  el SQL generado para que todo `ALTER TABLE ... ADD COLUMN` lleve
  `IF NOT EXISTS` (ya causo un incidente en produccion). Espejar cada cambio
  de schema en `src/app/api/setup/migrate/route.ts`.
- `FeedbackWidget` vive dentro de `Nav`, NO en el layout raiz (moverlo
  fuerza todas las paginas a dinamicas y rompe la generacion estatica de
  las publicas).
- Nunca mostrar emails de usuarios en superficies compartidas (leaderboard
  muestra nombre o "Usuario").

## Como escribir codigo aqui

- **Server Components por defecto.** `"use client"` solo cuando el
  componente necesita estado, efectos, o manejadores de evento — no por
  costumbre.
- **Mutaciones via Server Actions**, no rutas API hechas a mano. Viven en
  `src/lib/*-actions.ts` (ej. `habit-actions.ts`, `onboarding-actions.ts`).
  Las 6 rutas API que existen (`src/app/api/**/route.ts`) son excepciones
  deliberadas: NextAuth, el cron, el webhook de PayPal, y un par de casos
  donde hace falta un endpoint real (Service Worker, unsubscribe por link
  de email).
- **Un archivo, una responsabilidad.** `lib/` separa queries
  (`queries.ts`) de actions (`*-actions.ts`) de logica pura sin efectos
  secundarios (`cycle.ts`, `leveling.ts`, `habit-utils.ts` — estos son los
  que tienen tests unitarios junto al archivo).
- **Comentarios solo para el porque, nunca el que.** Si el nombre de la
  funcion/variable ya explica que hace, no se comenta. Se comenta una
  decision no obvia, un bug que ya paso, una restriccion externa (ver los
  comentarios existentes en `schema.ts` y `globals.css` como referencia
  del tono esperado).
- **Sin abstracciones prematuras.** Tres lineas parecidas en tres sitios
  es mejor que una abstraccion equivocada. No se disena para
  requerimientos hipoteticos.

## Convenciones

- **Nombres de archivo:**
  - Componentes: `PascalCase.tsx` (`HabitCard.tsx`, `WheelRadarChart.tsx`).
  - Modulos de `lib/`: `kebab-case.ts` (`habit-actions.ts`, `cycle-state.ts`).
  - Rutas: carpetas en `kebab-case` bajo `src/app/`, archivo siempre
    `page.tsx` (o `route.ts` para las 6 rutas API).
  - Tests: junto al archivo que prueban, mismo nombre + `.test.ts`.
- **Manejo de estado:** estado de servidor vive en Postgres, se lee con
  Server Components en cada render — no hay store global de cliente
  (Redux, Zustand, etc.) ni cache manual. Estado de UI puramente local
  (un toggle, un formulario abierto) usa `useState`/`useTransition` en el
  componente que lo necesita. Preferencias puramente de pantalla que no
  son datos de cuenta (modo compacto, grano) van en `localStorage` +
  atributo `data-*` en `<html>`, nunca en la base de datos — ver
  `DensityToggle.tsx` / `GrainToggle.tsx` como patron de referencia.
- **Componentes:** un componente por archivo, export nombrado (no
  default) salvo `page.tsx`/`layout.tsx` donde Next.js lo exige. Props
  tipadas inline con `{ prop }: { prop: Tipo }` para componentes chicos;
  un `type Props` solo si el componente es grande o las props se
  reutilizan.

## Librerias

**Preferidas / ya en el proyecto** — usar estas antes de agregar algo
nuevo: Drizzle ORM (no Prisma), NextAuth v4 con Credentials Provider (no
Clerk/Auth0), Tailwind CSS puro (sin librerias de componentes), Zod para
validacion, Vitest para unit tests, Playwright para e2e, Resend para
email, web-push para notificaciones push, Sentry para errores.

**Prohibidas / evitar:**
- Cualquier libreria de componentes UI (Radix, MUI, Chakra, shadcn) — el
  sistema visual completo (`.card`, `.btn-primary`, `.list-row`, etc.) ya
  esta en `globals.css`, escrito a mano.
- Un ORM o cliente de base de datos distinto a Drizzle/`pg`.
- State managers globales de cliente (Redux, Zustand, Jotai) — no hacen
  falta con el modelo de Server Components actual.
- Analytics o tracking de terceros (Google Analytics, Mixpanel, etc.) —
  `/admin/analytics` es first-party a proposito, sin cookies de rastreo,
  para poder prometerlo en `/privacidad`.

## Como escribir commits

- Mensajes descriptivos en espanol, en modo indicativo/imperativo corto
  ("Corrige X", "Agrega Y", no "Corrigiendo X").
- Primera linea: resumen de una oracion. Cuerpo (si hace falta): el
  *porque*, no una lista de archivos tocados — eso ya lo muestra el diff.
- Un bump de version en `package.json` (minor) por feature nueva, y una
  entrada correspondiente en `src/lib/changelog.ts` con el mismo numero
  de version, en espanol, dirigida al usuario final (no al desarrollador).

## Que revisar antes de terminar cualquier tarea

1. `npx tsc --noEmit` — sin errores de tipos.
2. `npx next lint` — sin warnings.
3. `npm test` — todos los tests unitarios en verde.
4. `rm -rf .next && npx next build` — build de produccion limpio.
5. Si el cambio toca UI: levantar `npm run start` contra Postgres local y
   probar el flujo real con Playwright (ver seccion de abajo).
6. Bump de version + entrada en changelog si es una feature nueva
   (no hace falta para un fix chico).
7. Confirmar que ninguna regla de "Que nunca debe romper" (arriba) quedo
   comprometida por el cambio.

## Verificacion antes de commitear

`npx tsc --noEmit` + `npx next lint` + `npm test` + `rm -rf .next && npx next build`,
y para cambios con superficie de UI: levantar `npm run start` contra Postgres
local (rol/db `ejecuta`/`ejecuta`) y probar el flujo real con Playwright
(`npm install --no-save playwright`, Chromium en `/opt/pw-browsers/chromium`).
Los tests unitarios corren con Vitest (`npm test`).
