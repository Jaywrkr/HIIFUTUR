# Guía para contribuir

Proyecto de un solo dueño (Jay), con trabajo asistido por Claude Code.
Esta guía aplica igual a un desarrollador humano nuevo que a una sesión
de IA.

## Estilo de código

- TypeScript estricto, sin `any` salvo justificación clara en comentario.
- Server Components por defecto; `"use client"` solo con estado, efectos
  o eventos.
- Sin librerías de UI externas — Tailwind + las clases ya definidas en
  `globals.css`.
- Comentarios solo para el *por qué*, nunca para describir *qué* hace el
  código si el nombre ya lo dice.
- Ver el detalle completo en [`CLAUDE.md`](../CLAUDE.md).

## Branches

- Cada tarea nueva parte de una **rama nueva** desde la rama por defecto
  del repo — no se acumulan tareas no relacionadas en la misma rama.
- Nombre de rama descriptivo del cambio (ej. `claude/compact-density-mode`).
- Si el PR de una rama ya se mergeó y aparece trabajo de seguimiento
  relacionado, esa rama se reinicia desde la rama por defecto actualizada
  — nunca se apilan commits nuevos sobre historia ya mergeada.

## Commits

- Mensajes descriptivos en **español**, modo indicativo corto ("Corrige
  X", no "Corrigiendo X" ni "Fixed X").
- Primera línea: resumen de una oración. Cuerpo (si hace falta): el
  *por qué* del cambio, no una lista de archivos (eso ya lo muestra el
  diff).
- Feature nueva: bump de versión (minor) en `package.json` + entrada en
  `src/lib/changelog.ts`, mismo número de versión, texto en español
  dirigido al usuario final.

## Pull Requests

- El dueño del proyecto revisa y mergea — no se mergea sin su
  aprobación explícita, incluso si el PR pasa toda la verificación.
- Descripción del PR: qué cambia y por qué, no una lista mecánica de
  archivos tocados.
- Un PR no debería mezclar cambios no relacionados — si mientras se
  trabaja en algo aparece un bug no relacionado, se corrige en un PR
  aparte salvo que sea trivial y directamente relacionado.

## Revisiones

Al revisar un PR (propio o ajeno), confirmar:

1. Que el checklist de verificación (abajo) efectivamente se corrió, no
   solo se asume.
2. Que ninguna regla de "qué nunca debe romper" (`CLAUDE.md`) quedó
   comprometida.
3. Que el cambio es consistente con patrones ya existentes (¿reusa una
   clase CSS ya definida, o inventa una nueva sin necesidad? ¿sigue el
   patrón de Server Actions, o agrega una ruta API sin justificación?).
4. Si toca `schema.ts`: que la migración generada sea idempotente y esté
   espejada en `api/setup/migrate/route.ts`.

## Checklist antes de abrir un Pull Request

1. `npx tsc --noEmit` — sin errores.
2. `npx next lint` — sin warnings.
3. `npm test` — todo en verde.
4. `rm -rf .next && npx next build` — build de producción limpio.
5. Si el cambio toca UI: `npm run start` contra Postgres local, probar el
   flujo real con Playwright.
6. Si es feature nueva: bump de versión + entrada en changelog.
7. Mensaje de commit en español, describiendo el *por qué*.
8. Ninguna regla de "qué nunca debe romper" (`CLAUDE.md`) comprometida.

Ver también [`AGENTS.md`](../AGENTS.md) si quien contribuye es un agente
de IA — tiene la misma checklist con más contexto de "dónde busco qué".
