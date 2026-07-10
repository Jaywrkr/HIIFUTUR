# EJECUTA — notas para Claude

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

## Verificacion antes de commitear

`npx tsc --noEmit` + `npx next lint` + `npm test` + `rm -rf .next && npx next build`,
y para cambios con superficie de UI: levantar `npm run start` contra Postgres
local (rol/db `ejecuta`/`ejecuta`) y probar el flujo real con Playwright
(`npm install --no-save playwright`, Chromium en `/opt/pw-browsers/chromium`).
Los tests unitarios corren con Vitest (`npm test`).
