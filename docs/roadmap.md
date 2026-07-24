# Roadmap

## MVP (construido)

- Registro / login / recuperación de contraseña.
- Onboarding: áreas de vida + Wheel of Life inicial.
- 11 módulos de curso interactivo en 4 fases, desbloqueo secuencial.
- Ciclo de formación de 30 días (ejecución real desbloquea contenido).
- Habit tracker: hasta 5 hábitos, racha, congelador de racha, heatmap.
- Puntos y niveles.
- Wheel of Life periódico con radar comparativo.
- Dashboard "Hoy".
- Leaderboard (top 10, solo nombre).
- Landing pública, changelog público.
- PWA instalable, notificaciones push, recordatorios diarios por email.
- Sistema de logros con tiers.
- Analítica propia sin cookies de rastreo (`/admin/analytics`).

## Beta (en curso — pre-lanzamiento público)

Ver [`docs/current-sprint.md`](current-sprint.md) para el detalle vivo.

- Cuentas reales de dinero: PayPal Live, planes, webhook (✅ hecho).
- `AUTH_SECRET` de producción, Sentry (✅ hecho).
- Dominio real comprado y conectado (⏳ en curso — encuesta de naming).
- Resend con dominio verificado (⏳ bloqueado por el dominio).
- Prueba de pago real de punta a punta.
- Triage de errores conocidos en Sentry.
- Voz de marca documentada (✅ hecho — `docs/brand.md`).
- Documentación técnica completa (✅ hecho — este set de docs).

## v1.0 (lanzamiento público)

- Google Search Console + sitemap real enviado.
- Contenido de lanzamiento con Luna (historia real como pieza de
  contenido, no solo copy).
- Calendario de contenido de las primeras 4 semanas.
- Fotografía real reemplazando los `PhotoSlot` placeholder.
- Decisión legal resuelta (persona natural vs. entidad).
- Plan de adquisición inicial (canales, orden).
- QA final de punta a punta en producción real.

## v2.0 (evoluciones post-lanzamiento)

- Logros: contar ciclos de 30 días completos (no solo si el actual se
  sostuvo), más logros allá del set inicial deliberadamente corto, arte
  propio por logro (no solo `PhotoSlot` con hue distinto), mostrar el
  logro más alto de otros en el leaderboard.
- Ampliar el kit de marca: asset kit para redes, mensajes clave por
  canal.
- Revisar si conviene subir de plan en Neon (ventana de backups más
  larga) según crecimiento real de usuarios.

## Backlog (sin fecha, ideas vivas)

- Más de 5 hábitos activos simultáneos (hoy es un límite deliberado del
  producto — solo mover si hay evidencia real de que frena a usuarios
  avanzados, no por defecto).
- Landing o pieza de pre-lanzamiento para generar lista de espera antes
  de tener dominio final (evaluado, no descartado).
- Integraciones de calendario/recordatorios más allá de email + push.
- Internacionalización (hoy 100% español, LATAM).

> Este roadmap se actualiza cuando cambian las prioridades reales del
> proyecto — no es un compromiso de fechas, es la mejor foto disponible
> del orden de trabajo.
