# Deployment

## Vercel

Proyecto desplegado en Vercel (`hiifutur`, equipo
`jaywrkr-1498's projects`), framework Next.js autodetectado. Cada push a
una rama con PR abierto genera un **preview deployment**; el merge a la
rama por defecto dispara un **production deployment**.

**Build command real**: `vercel-build` (no `build`) —
`npm run db:migrate && next build`. Vercel usa `vercel-build`
automáticamente en vez de `build` cuando existe en `package.json`. Esto
significa que **las migraciones corren en cada deploy a producción**, sin
paso manual.

## Variables de entorno

Ver [`.env.example`](../.env.example) para la lista completa con
comentarios de qué pasa si falta cada una. Resumen por categoría:

| Categoría | Variables | Sin ellas... |
|---|---|---|
| Postgres | `POSTGRES_URL` (+ variantes que Vercel inyecta solo) | La app no arranca |
| Auth | `AUTH_SECRET`, `NEXTAUTH_URL` | Login roto |
| Sitio público | `NEXT_PUBLIC_SITE_URL` | Cae al fallback del código |
| Setup manual | `SETUP_MIGRATE_ENABLED`, `SETUP_SECRET` | Endpoint de respaldo inaccesible (por diseño, default off) |
| Email | `RESEND_API_KEY`, `EMAIL_FROM` | Emails se imprimen en log, no se envían |
| Cron | `CRON_SECRET` | El cron diario rechaza todo con 401 |
| Push | `VAPID_*` | Push se salta en silencio, recordatorios siguen por email |
| Feedback | `FEEDBACK_TO_EMAIL` | Cae al default (`jaywrkr@gmail.com`) |
| Analítica | `ADMIN_EMAIL` | `/admin/analytics` usa el default |
| Sentry | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Sin reporte de errores (no rompe nada) |
| PayPal | `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_PLAN_ID_*` (4) | No se puede cobrar |
| SEO | `GOOGLE_SITE_VERIFICATION` | Sin tag de verificación, no rompe nada |
| Ads | `NEXT_PUBLIC_META_PIXEL_ID` | Pixel no se renderiza, no-op |

**Importante**: cada variable se agrega en Vercel para el ambiente
correcto (**Production** y/o **Preview**) — agregarla solo a Preview no
la hace disponible en producción, y viceversa. Cambiar una env var no
aplica sola, requiere un redeploy.

## Dominios

El dominio real es **`ankla.app`** (comprado en GoDaddy), conectado en
Vercel y verificado:

- Registro `A` en `@` → `216.198.79.1`.
- Registro `CNAME` en `www` → `cname.vercel-dns.com`.
- `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` en `https://ankla.app` en
  Production.

El fallback en el código (`hiifutur.vercel.app`, el dominio `.vercel.app`
del proyecto) sigue ahí como valor por defecto si esas env vars no
estuvieran seteadas en algún ambiente — no se tocó ni hace falta
tocarlo, solo importa que las env vars de Production tengan el valor
real.

Si en el futuro se conecta un dominio nuevo (poco probable, pero por si
pasa):

1. Vercel → `Project → Settings → Domains → Add`, seguir las
   instrucciones DNS que muestra ahí (típicamente `A` o `CNAME`).
2. Actualizar `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` al dominio nuevo.
3. Redeploy.
4. Confirmar que `sitemap.xml`, `robots.txt` y el `og:image` de la
   landing ya apuntan al dominio nuevo.

## Build

`vercel-build` = `npm run db:migrate && next build`. Localmente, el
equivalente sin desplegar es `npm run build` (sin migrar) o
`rm -rf .next && npx next build` para un build limpio de verificación
(ver el checklist en `CLAUDE.md`).

## Rollback

Vercel mantiene cada deployment anterior accesible — un rollback es
promover un deployment previo a producción desde el dashboard
(`Deployments → [deployment anterior] → Promote to Production`), sin
necesidad de revertir el commit en git primero.

**Cuidado con las migraciones**: un rollback de código no revierte
cambios de schema ya aplicados a la base (las migraciones no tienen
"down"). Si un deploy rompió algo por un cambio de schema, revertir el
deploy no deshace la migración — hay que evaluar caso por caso si el
schema nuevo es compatible con el código anterior antes de hacer
rollback.

## Producción / Staging

No hay un ambiente de "staging" separado con su propia base de datos —
los **preview deployments** de Vercel (uno por PR) cumplen ese rol,
pero comparten la misma base de datos de producción salvo que se
configure explícitamente lo contrario. Tener esto en cuenta: un preview
deployment que corre una migración o escribe datos de prueba, lo hace
contra la base real.

Para pruebas que necesitan aislarse de verdad, la alternativa usada en
este proyecto es correr Postgres local (`ejecuta`/`ejecuta`, ver
`CLAUDE.md`) — no la base de Neon.

## Backups y recuperación

Postgres gestionado (Neon) con "point-in-time restore" — se puede volver
la base a cualquier momento dentro de la ventana del plan (24h en el plan
gratis, 7-30 días en planes pagos), sin restaurar un backup manual. Para
confirmar la ventana real: Vercel → `Storage` → la base → dashboard de
Neon → `Backups`/`Restore`.

## Cron

Un solo cron definido en `vercel.json`: `/api/cron/reminders`, todos los
días a las **13:00 UTC** (`0 13 * * *`). Vercel lo dispara solo — no
requiere configuración extra en el plan Hobby para 1 ejecución diaria.
Verificar que está activo en `Vercel → Settings → Cron Jobs` después de
cada deploy que toque esa ruta.
