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

Producto funcionalmente completo y en producción, en transición de "modo
prueba" a "listo para cobrar a desconocidos". Ver
[`docs/current-sprint.md`](current-sprint.md) para el detalle vivo de qué
falta ahora mismo (dominio real, Resend, prueba de pago real).

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
Lo inmediato: dominio real, Resend, prueba de pago real end-to-end,
triage de errores conocidos en Sentry.

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

1. Documentación completa del proyecto (README, CLAUDE.md, AGENTS.md,
   `docs/*`) — esta misma tarea.
2. PayPal Live conectado de punta a punta: credenciales reales, 4 planes
   de suscripción, webhook verificado.
3. `AUTH_SECRET` de producción rotado.
4. Cuenta de prueba en producción con curso avanzado y suscripción activa.
5. Modo compacto extendido a Hábitos, Wheel, Logros y Cuenta (antes solo
   afectaba Hoy).
6. Modo compacto llevado a "quitar elementos", no solo apretar espacio.
7. Vista por defecto (no compacta) reducida un poco en toda la app.
8. Jardín zen mejorado (textura de arena, ondas de rastrillado realistas,
   sombra de contacto de piedras) + fix de un crash de `drawImage` con
   canvas en 0×0.
9. Toggle de grano de película + fix del bug de `mix-blend-mode`.
10. Toggle de modo compacto (primera versión).

## Próximas prioridades

1. Cerrar la decisión de naming/dominio y comprarlo.
2. Conectar el dominio en Vercel + `NEXTAUTH_URL`/`NEXT_PUBLIC_SITE_URL`.
3. Resend + verificación de dominio.
4. Probar un pago real de punta a punta.
5. Triage de los errores conocidos en Sentry.
6. Fases de marca/contenido con Luna (voz de marca ya documentada en
   `docs/brand.md` — falta fotografía real, contenido de lanzamiento,
   calendario de 4 semanas).
