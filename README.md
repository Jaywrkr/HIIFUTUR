# EJECUTA — Sistema de Ejecucion Sostenible

MVP de un curso interactivo basado en el Principio de Pareto: el 20% de tus
acciones genera el 80% de tus resultados. No es un curso de motivacion, es
una herramienta de sistema + aprendizaje interactivo + medicion real del
progreso.

Este es la **Version 1 (MVP)**. El contenido (mas modulos), la gamificacion
y el UI/UX se expandiran en versiones futuras.

## Stack

- **Next.js 14** (App Router) + React + TypeScript
- **Tailwind CSS** (tema negro, monospace, acento verde neon)
- **Vercel Postgres** (Neon serverless) + **Drizzle ORM**
- **Auth.js (NextAuth v4)** con Credentials Provider (email + contrasena)

## Funcionalidades del MVP

1. Registro / login con email y contrasena.
2. Onboarding: seleccion de hasta 3 areas de vida + primera medicion del
   Wheel of Life.
3. 4 modulos de aprendizaje interactivo (teoria corta + ejercicio + progreso
   guardado), desbloqueados en orden.
4. Habit tracker progresivo: maximo 5 habitos, se desbloquea el siguiente
   cada 30 dias desde la activacion del anterior. Checkbox diario, racha,
   sin castigo por fallar.
5. Wheel of Life: medicion mensual (cada 30 dias), comparacion visual
   (radar) contra el mes anterior, e insight automatico si hay correlacion
   con un habito activo.
6. Dashboard con resumen: modulos completados, habitos activos y su
   countdown de desbloqueo, y estado de la medicion mensual.

## Configuracion en Vercel (2 pasos)

1. **Crear la base de datos**: en el dashboard de tu proyecto en Vercel, ve
   a `Storage → Create Database → Postgres` (Neon). Esto genera e inyecta
   automaticamente las variables `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`,
   etc. en tu proyecto.
2. **Variables de entorno**: en `Settings → Environment Variables`, agrega
   ademas:
   - `AUTH_SECRET`: genera uno con `openssl rand -base64 32`.
   - `NEXTAUTH_URL`: la URL publica de tu deploy (ej.
     `https://tu-proyecto.vercel.app`).
   - `RESEND_API_KEY` y `EMAIL_FROM`: para que "olvidaste tu contraseña" y
     los recordatorios diarios manden un correo real. Crea una cuenta gratis
     en [resend.com](https://resend.com). Sin esto, ambos se imprimen en los
     logs del servidor en vez de enviarse — sirve para probar, no para
     produccion.
   - `CRON_SECRET`: genera uno con `openssl rand -base64 32`. Protege
     `/api/cron/reminders`, que Vercel Cron llama una vez al dia (ver
     `vercel.json`) para avisarle a quien tenga un habito activo sin marcar
     hoy. Cada correo trae un link de "dejar de recibir estos recordatorios".
   - `NEXT_PUBLIC_SENTRY_DSN` y `SENTRY_DSN` (mismo valor): para enterarte de
     errores en produccion antes de que el usuario te escriba. Crea un
     proyecto gratis en [sentry.io](https://sentry.io) (elige "Next.js").
     Sin esto, los errores no se reportan a ningun lado — no rompe nada, solo
     te quedas a ciegas. Opcional: `SENTRY_ORG`, `SENTRY_PROJECT` y
     `SENTRY_AUTH_TOKEN` para que el build suba source maps y los stack
     traces en Sentry muestren tu codigo real en vez de JS minificado.
   - `ADMIN_EMAIL`: quien puede ver `/admin/analytics` (el embudo de
     registro → onboarding → primer habito → primer check → primera
     medicion → primer modulo). Sin third parties, sin cookies de rastreo —
     los eventos se guardan en tu propia base. Default: `jaywrkr@gmail.com`.

   Ve `.env.example` para la lista completa (usalo tambien para desarrollo
   local, copialo a `.env`).

**Las migraciones corren solas**: el script `vercel-build` (que Vercel usa
automaticamente en vez de `build` cuando existe) corre `db:migrate` antes de
compilar. Cada vez que agregues una tabla o columna nueva al schema y hagas
push, el proximo deploy la crea sola — no hay que acordarse de visitar
ninguna ruta ni correr nada a mano.

Si alguna vez necesitas correrlas manualmente (por ejemplo, apuntando a la
base de datos desde tu maquina antes de desplegar), sigue disponible:

```bash
npm install
npm run db:migrate
```

Tambien existe `https://tu-proyecto.vercel.app/api/setup/migrate?secret=<SETUP_SECRET>`
como respaldo manual (idempotente, segura de visitar mas de una vez) por si
el deploy automatico fallara por alguna razon.

## Desarrollo local

```bash
npm install
cp .env.example .env   # completa POSTGRES_URL y AUTH_SECRET
npm run db:migrate
npm run dev
```

## Esquema de base de datos

- `users` — cuentas (email + hash de contrasena).
- `user_preferences` — areas de vida elegidas y primera medicion del Wheel
  of Life (onboarding).
- `habits` — habitos del usuario, orden de desbloqueo y estado.
- `habit_logs` — registro diario de cumplimiento por habito.
- `wheel_of_life_measurements` — historico de mediciones mensuales.
- `module_progress` — progreso y respuestas de ejercicios por modulo.

## Backups y recuperacion

La base de datos vive en Postgres gestionado por Vercel (Neon por debajo).
Neon guarda un historial de "point-in-time restore" — puedes volver la base
a como estaba en cualquier momento dentro de esa ventana, sin restaurar un
backup manual. La duracion exacta de esa ventana depende del plan:

- Plan gratis de Neon: normalmente 24 horas.
- Planes pagos: hasta 7-30 dias segun el tier.

Para confirmar la ventana real de tu proyecto: Vercel → `Storage` → tu base
de datos → abre el dashboard de Neon → `Backups` (o `Restore`). Si el
proyecto crece, vale la pena revisar si conviene subir de plan para tener
mas dias de margen.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` / `npm start` — build y servidor de produccion.
- `npm run db:generate` — genera migraciones SQL a partir de `src/db/schema.ts`.
- `npm run db:migrate` — aplica las migraciones contra `POSTGRES_URL`.
- `npm run db:studio` — abre Drizzle Studio para inspeccionar la base de datos.
