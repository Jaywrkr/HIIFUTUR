# Contexto permanente del proyecto

> Punto de entrada único para cualquier sesión de IA nueva. Si solo vas a
> leer un archivo antes de empezar a trabajar, que sea este. Se actualiza
> a mano — si algo no coincide con el código real, el código manda.

## Qué hace el producto

Ankla: curso interactivo + habit tracker basado en el Principio de
Pareto. La idea central: la motivación falla, un sistema pequeño y
sostenido no. Una persona elige **un solo hábito ancla** (el más pequeño
posible), lo sostiene día a día, y cada 30 días mide con el Radar de Vida
si algo real se movió en su vida. El contenido del curso (11 módulos) se
desbloquea con ejecución real — días de hábito cumplido — no con tiempo
transcurrido ni con haber pagado más.

## Estado actual

Producto funcionalmente completo y en producción bajo el dominio real
**ankla.app** (comprado, conectado, verificado). Cobros reales activos
con PayPal Live, emails reales funcionando (Resend + `ankla.app`
verificado), errores monitoreados (Sentry con sourcemaps). El operador
público es **Jay Jaramillo (jaywrkr)** — ya no existe "HIIFUTUR" en
ninguna superficie. Ver [`docs/current-sprint.md`](current-sprint.md)
para el detalle vivo, fase por fase, de qué falta (el pendiente más
cercano es probar un pago real de punta a punta, y terminar la Fase D de
SEO).

## Arquitectura (resumen — detalle en `docs/architecture.md`)

Monolito Next.js 14 (App Router), Server Components + Server Actions, sin
backend separado. Postgres (Neon) + Drizzle ORM. NextAuth v4 con
Credentials Provider, sesión JWT. Solo 6 rutas HTTP reales (ver
`docs/api.md`) — el resto de la escritura pasa por Server Actions.

## Módulos existentes (funcionalidades)

- Landing pública + registro/login + recuperación de contraseña.
- Onboarding (áreas de vida + Radar de Vida inicial).
- 11 módulos de curso en 4 fases, desbloqueo secuencial.
- Ciclo de formación de 30 días (2 fallos perdonados, el tercero resetea).
- Habit tracker (hasta 5 hábitos, racha, freeze, heatmap).
- Puntos y niveles (curva cuadrática).
- Radar de Vida periódico con radar comparativo.
- Dashboard "Hoy" con rituales de celebración priorizados.
- Leaderboard (solo nombre, nunca email).
- Sistema de logros con tiers.
- Suscripciones PayPal (trial 7 días, mensual/anual, normal/descuento).
- PWA instalable, push, recordatorios diarios por email.
- Modo compacto/zen y grano de película (preferencias de pantalla,
  `localStorage`, no en la base).
- Analítica propia sin cookies de rastreo (`/admin/analytics`).
- Jardín zen interactivo (Canvas 2D) en `/cuenta`.

## Funcionalidades pendientes

Ver [`docs/roadmap.md`](roadmap.md) para el detalle completo por fase.
Lo inmediato: probar un pago real end-to-end, terminar SEO (Search
Console + validación og:image/JSON-LD), RUC de persona natural, triage
de errores conocidos en Sentry.

## Convenciones (resumen — detalle en `CLAUDE.md`)

Server Components por defecto. Mutaciones = Server Actions en
`src/lib/*-actions.ts`. Sin librerías de UI externas. Migraciones de
schema siempre idempotentes (`IF NOT EXISTS`), espejadas en
`api/setup/migrate/route.ts`. `FeedbackWidget` siempre dentro de `Nav`,
nunca en el layout raíz. Nunca mostrar email de usuario en superficie
compartida.

## Errores conocidos

Ver [`docs/current-sprint.md`](current-sprint.md), sección "Bugs
conocidos" — errores reales vistos en Sentry sin triage completo aún
(`Connection terminated unexpectedly` en `/dashboard`, un par de errores
en `/onboarding`).

## Decisiones importantes

Ver [`docs/decisions.md`](decisions.md) (formato ADR) para el detalle
completo. Las que más importan para no repetir un error ya resuelto:

- CSS sin `@layer` siempre le gana a las utilidades de Tailwind, sin
  importar el orden — la solución es un selector más específico, nunca
  `!important` (ADR-005).
- `mix-blend-mode: overlay` no hace nada visible sobre el fondo negro
  puro de esta app — usar `screen` (ADR-006).
- Migraciones de schema siempre idempotentes, sin excepción (ADR-007).
- Preferencias de pantalla puramente de dispositivo van en
  `localStorage`, nunca en la base de datos (ADR-004).
- "Más simple" en este producto significa quitar elementos de la
  pantalla, no solo apretar el espaciado (ADR-003).

## Últimos cambios (más reciente primero)

1. Landing: hero y sección de método suman imágenes reales del producto
   (`public/hero-radar-ancla.png`, `public/metodo-aprender-hacer-control.png`).
2. Fase A del doc de operaciones casi completa: dominio `ankla.app`
   comprado y conectado, `NEXTAUTH_URL`/`NEXT_PUBLIC_SITE_URL`
   actualizadas, Resend verificado y probado (emails reales llegando),
   `CRON_SECRET` confirmado activo. Solo falta probar un pago real.
3. Fase B (Sentry) completa: `SENTRY_AUTH_TOKEN` seteado, sourcemaps
   subiendo en cada build.
4. Fase C (legal): decidido operar como persona natural — falta el RUC.
5. Producto renombrado de "EJECUTA" a **Ankla** en toda la app, landing,
   emails y docs públicos.
6. "HIIFUTUR" reemplazado por **Jay Jaramillo (jaywrkr)** como operador
   público en Términos, Privacidad, footer y changelog.
7. SEO: metadata de autor (title, description, OG, `meta author`)
   nombrando a Jay Jaramillo (@jaywrkr) en todo el sitio.
8. PayPal Live conectado de punta a punta: credenciales reales, 4 planes
   de suscripción, webhook verificado, cobros activos.
9. `AUTH_SECRET` de producción rotado.

## Próximas prioridades

1. Terminar Fase D (SEO): validar og:image/JSON-LD con el dominio real,
   Google Search Console + envío del sitemap.
2. Probar un pago real de punta a punta (último pendiente de Fase A).
3. RUC de persona natural (Fase C) cuando esté el trámite.
4. Triage de los errores conocidos en Sentry.
5. Fases de marca/contenido con Luna (voz de marca ya documentada en
   `docs/brand.md` — falta fotografía real, contenido de lanzamiento,
   calendario de 4 semanas).
