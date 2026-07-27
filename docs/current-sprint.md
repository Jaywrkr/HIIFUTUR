# Sprint actual

> Este documento se actualiza a mano en cada sesión de trabajo — no es
> automático. Si estás leyendo esto en una sesión futura y no coincide con
> `git log`, el código y el historial de commits mandan, no este archivo.

**Última actualización**: post-lanzamiento técnico de pagos reales,
pre-lanzamiento público (dominio aún pendiente).

## Qué se está construyendo

El producto (curso + hábitos + Radar de Vida + logros) ya está
funcionalmente completo y en producción. El trabajo actual es **la
transición de "app en modo prueba" a "app lista para cobrar a
desconocidos"** — Fase A del documento de operaciones
(`docs/ankla-operaciones.html` si existe en el repo, o el artifact
publicado equivalente).

## Qué ya está hecho (Fase A — Dinero y cuentas reales)

- ✅ PayPal Live conectado: credenciales reales, 4 planes de suscripción
  (mensual/anual × normal/descuento) creados vía
  `scripts/create-paypal-plans.ts`, webhook real verificado.
- ✅ `AUTH_SECRET` de producción rotado (distinto al de desarrollo).
- ✅ Sentry conectado (DSN, org, project — ya capturando errores reales).
- ✅ Cuenta de prueba en producción (`todoprueba1@ejecuta.app`) con curso
  avanzado, hábitos con racha real y suscripción activa, para probar
  cambios sin registrar de cero cada vez.

## Qué falta

- ⏳ **Comprar y conectar el dominio real** — bloquea `NEXTAUTH_URL`,
  `NEXT_PUBLIC_SITE_URL`, y la verificación de Resend (SPF/DKIM). Hay una
  encuesta corta en curso con el equipo para decidir el nombre final
  entre varios candidatos con dominio `.app` disponible.
- ⏳ Probar el flujo de pago completo con dinero real (una suscripción
  chica, cancelarla después) — desbloqueado, no depende del dominio.
- ⏳ Cuenta Resend + verificación de dominio (bloqueado por el dominio).
- ⏳ `CRON_SECRET` — no confirmado si ya existe en producción.
- ⏳ Documentación completa del proyecto (README, CLAUDE.md, AGENTS.md,
  `docs/*`) — en progreso ahora mismo, esta misma tarea.

## Bugs conocidos (Sentry, producción)

Vistos en el dashboard de Sentry, sin triage completo todavía:

- `Connection terminated unexpectedly` en `/dashboard` (10 eventos,
  estado "Ongoing" al momento de verlo) — posible problema recurrente de
  conexión a Postgres, vale la pena investigar antes del lanzamiento
  público.
- `Unknown root exit status` en `/dashboard`.
- `TypeError: null is not an object (evaluating 't.parallelRoutes.get')`
  en `/onboarding`.
- Error en Server Components render en `/onboarding` (mensaje omitido en
  build de producción).

## Próximos pasos

1. Cerrar la encuesta de naming y comprar el dominio elegido.
2. Conectar `NEXTAUTH_URL`/`NEXT_PUBLIC_SITE_URL` al dominio real.
3. Resend + verificación SPF/DKIM.
4. Probar pago real end-to-end.
5. Triage de los errores de Sentry listados arriba.
6. Fase B en adelante del doc de operaciones (legal, SEO, marca/contenido
   con Luna, salida al mundo).

## Bloqueos

Ninguno técnico activo — el bloqueo actual es de decisión (nombre/dominio
final), no de código ni infraestructura.

## Prioridades (en orden)

1. Dominio real conectado.
2. Pago real probado de punta a punta.
3. Resend funcionando (emails reales, no solo log).
4. Triage de errores de Sentry.
5. Todo lo demás (SEO, legal, marca, contenido).
