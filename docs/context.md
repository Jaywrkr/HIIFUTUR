# Contexto permanente del proyecto

> Punto de entrada único para cualquier sesión de IA nueva. Si solo vas a
> leer un archivo antes de empezar a trabajar, que sea este. Se actualiza
> a mano — si algo no coincide con el código real, el código manda.

## Qué hace el producto

ANKLA: curso interactivo + habit tracker basado en el Principio de
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
ninguna superficie. Fase D (SEO) ya cerrada. Primer QA manual real de la
app (no solo landing) hecho, sin bugs bloqueantes. Ver
[`docs/current-sprint.md`](current-sprint.md) para el detalle vivo,
fase por fase, de qué falta (el pendiente más cercano es probar un pago
real de punta a punta).

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
Lo inmediato: probar un pago real end-to-end, RUC de persona natural,
terminar el QA manual de la app (ciclo de 30 días con fallos, reset de
contraseña, push, mobile real).

## Convenciones (resumen — detalle en `CLAUDE.md`)

Server Components por defecto. Mutaciones = Server Actions en
`src/lib/*-actions.ts`. Sin librerías de UI externas. Migraciones de
schema siempre idempotentes (`IF NOT EXISTS`), espejadas en
`api/setup/migrate/route.ts`. `FeedbackWidget` siempre dentro de `Nav`,
nunca en el layout raíz. Nunca mostrar email de usuario en superficie
compartida.

## Errores conocidos

Ninguno bloqueante. Sentry ya revisado por Jay. Primer QA manual real de
la app (registro → onboarding → módulo 1 → hábito ancla → marcar hábito
→ editar hábito → jardín zen → modo compacto → leaderboard → cuenta)
hecho en esta sesión, contra Postgres local: cero errores 500, cero
errores de consola. Detalle en [`docs/current-sprint.md`](current-sprint.md),
sección "QA manual de la app".

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

1. Primer QA manual real de la app (no solo landing/decks): registro,
   onboarding, Módulo 1, hábito ancla, marcar hábito, editar hábito,
   jardín zen, modo compacto, leaderboard, cuenta — cero errores 500,
   cero errores de consola. Un hallazgo menor sin resolver: "0 días en
   ANKLA" en Cuenta el mismo día del registro (correcto matemáticamente,
   pendiente de criterio de Jay sobre si vale la pena cambiarlo).
2. Fase D (SEO) cerrada: JSON-LD validado (Rich Results Test), og:image
   rediseñada con visual real del producto, Google Search Console
   verificado (HTML tag) y sitemap enviado. De paso se encontró y
   corrigió un bug real de producción: "Vercel Authentication"
   (Deployment Protection) estaba activo, devolviendo 403 a cualquier
   visita sin sesión de Vercel — bloqueaba a Googlebot y a usuarios
   nuevos. Se desactivó.
3. El nombre "Ankla" pasa a escribirse siempre en mayúsculas (ANKLA) en
   todo el texto visible de la app, landing, emails y docs.
4. Landing: hero y sección de método suman imágenes reales del producto
   (`public/hero-radar-ancla.png`, `public/metodo-aprender-hacer-control.png`).
5. Fase A del doc de operaciones casi completa: dominio `ankla.app`
   comprado y conectado, `NEXTAUTH_URL`/`NEXT_PUBLIC_SITE_URL`
   actualizadas, Resend verificado y probado (emails reales llegando),
   `CRON_SECRET` confirmado activo. Solo falta probar un pago real.
6. Fase B (Sentry) completa: `SENTRY_AUTH_TOKEN` seteado, sourcemaps
   subiendo en cada build.
7. Fase C (legal): decidido operar como persona natural — falta el RUC.
8. Producto renombrado de "EJECUTA" a **ANKLA** en toda la app, landing,
   emails y docs públicos.
9. "HIIFUTUR" reemplazado por **Jay Jaramillo (jaywrkr)** como operador
   público en Términos, Privacidad, footer y changelog.
10. PayPal Live conectado de punta a punta: credenciales reales, 4 planes
    de suscripción, webhook verificado, cobros activos.
11. `AUTH_SECRET` de producción rotado.

## Próximas prioridades

1. Terminar el QA manual de la app: ciclo de 30 días con fallos
   perdonados, reset de contraseña real, pago real con PayPal,
   notificaciones push, mobile en dispositivo real.
2. RUC de persona natural (Fase C) cuando esté el trámite.
3. Fases de marca/contenido con Luna (voz de marca ya documentada en
   `docs/brand.md` — falta fotografía real, contenido de lanzamiento,
   calendario de 4 semanas).
