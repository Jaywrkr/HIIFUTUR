# Sprint actual

> Este documento se actualiza a mano en cada sesión de trabajo — no es
> automático. Si estás leyendo esto en una sesión futura y no coincide con
> `git log`, el código y el historial de commits mandan, no este archivo.

**Última actualización**: dominio real conectado y verificado, Fase A del
documento de operaciones casi cerrada, arrancando Fase D (SEO).

## Qué se está construyendo

El producto (curso + hábitos + Radar de Vida + logros) ya está
funcionalmente completo y en producción bajo el nombre **Ankla** (antes
"EJECUTA" — renombrado en toda la app, landing, legal y docs). El
operador/responsable público es **Jay Jaramillo (jaywrkr)** — ya no
existe "HIIFUTUR" en ninguna superficie visible, era un nombre de marca
sin entidad real detrás.

El trabajo actual sigue el documento de operaciones, fase por fase
(A → dinero y cuentas reales, B → observabilidad, C → legal, D → SEO,
E → marca, F → salida al mundo, G → contenido, H → logros v2).

> **Importante para una sesión nueva**: el documento de operaciones con
> el checklist completo (`docs/ankla-operaciones.html` en este repo) es
> una versión *liviana* que **no** tiene el detalle tarea por tarea — el
> checklist real y actualizado vive como un **artifact publicado fuera
> de este repo**, mantenido a mano en las sesiones de trabajo con Jay. Si
> no tenés acceso a ese artifact, este archivo (`current-sprint.md`) es
> la mejor fuente de verdad disponible en el repo mismo.

## Qué ya está hecho

**Fase A — Dinero y cuentas reales** (8 de 10):
- ✅ Dominio real **ankla.app** comprado (GoDaddy) y conectado en Vercel
  (registro A en `@` → `216.198.79.1`, CNAME en `www` →
  `cname.vercel-dns.com`). DNS verificado, HTTPS activo.
- ✅ `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` actualizadas a
  `https://ankla.app` en Production, redeploy hecho — `robots.txt` y
  `sitemap.xml` ya sirven URLs del dominio real (verificado a mano).
- ✅ `AUTH_SECRET` de producción rotado (distinto al de desarrollo).
- ✅ PayPal Live conectado: credenciales reales, 4 planes de suscripción
  (mensual/anual × normal/descuento) creados vía
  `scripts/create-paypal-plans.ts`, webhook real verificado,
  `PAYPAL_ENV=live` en Production. Los cobros ya están activos.
- ✅ Resend conectado: dominio `ankla.app` verificado (DKIM/SPF OK),
  `RESEND_API_KEY` seteado (reusa un key que ya existía), `EMAIL_FROM`
  en `Ankla <hola@ankla.app>`. **Probado de punta a punta**: reset de
  contraseña real llegó bien.
- ✅ `CRON_SECRET` ya estaba seteado de antes. Confirmado en Vercel →
  Cron Jobs: `/api/cron/reminders` activo, invocación real registrada
  (~2.9s de duración — pasó la validación, no un 401 instantáneo).
- ⏳ **Falta**: probar el flujo de pago completo con dinero real (una
  suscripción chica, cancelarla después desde Mi cuenta).

**Fase B — Observabilidad** (completa):
- ✅ Sentry conectado (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`,
  `SENTRY_ORG`, `SENTRY_PROJECT`).
- ✅ `SENTRY_AUTH_TOKEN` seteado (permisos granulares: Release Admin,
  Project Read, Organization Read — equivalente al scope viejo
  `project:releases`), redeploy hecho, sourcemaps subiendo en cada build.
- ⏳ Pendiente (no bloquea nada): definir qué 3-4 métricas mirar la
  primera semana en `/admin/analytics` — ya existe el embudo (registro →
  onboarding → primer hábito → primer check → Radar de Vida →
  módulo completado); faltaría agregar vistas de "registrados → pagaron"
  y "racha promedio a 7 días" si se decide que valen la pena.

**Fase C — Legal**:
- ✅ Ya no existe "HIIFUTUR" en ninguna superficie pública — Términos,
  Privacidad, footer y changelog nombran directamente a
  **Jay Jaramillo (jaywrkr)**.
- ✅ **Decidido: opera como persona natural**, no se constituye sociedad.
- ⏳ Pendiente: sacar el RUC de persona natural (SRI, online, actividad
  económica tipo "desarrollo de software"), y sumarlo a Términos/
  Privacidad cuando esté — tarea de una línea en el código una vez que
  exista el número real.

**Fase D — SEO** (en progreso):
- ✅ Metadata de autor: title (con `title.template`, se propaga a todas
  las rutas), description, Open Graph, Twitter Card y
  `meta name="author"` nombran a Jay Jaramillo (@jaywrkr) en
  `src/app/layout.tsx`. Link del footer a Instagram con su nombre.
- ✅ `og:image` (`src/app/opengraph-image.tsx`) rediseñada — antes era
  solo texto sobre negro, ahora usa `public/hero-radar-ancla.png` (Radar
  de Vida + tarjeta de hábito real) como fondo con degradado para
  legibilidad.
- ⏳ En curso ahora mismo: validar JSON-LD de la landing con el dominio
  real (Rich Results Test de Google + opengraph.xyz para confirmar cómo
  se ve la nueva `og:image`).
- ⏳ Pendiente: Google Search Console + `GOOGLE_SITE_VERIFICATION`,
  enviar el sitemap ahí.

**Landing** (fuera del checklist de operación, pero reciente):
- ✅ El hero reemplazó las tarjetas flotantes de mentira por una imagen
  real del producto (`public/hero-radar-ancla.png` — Radar de Vida +
  tarjeta de hábito ancla), con una sola tarjeta de acento encima.
- ✅ La sección "Aprendizaje. Acción. Control." suma una imagen real del
  flujo (`public/metodo-aprender-hacer-control.png`).

## Qué falta (todo lo demás)

- ⏳ Probar pago real con PayPal (Fase A, el único punto que queda ahí).
- ⏳ RUC de persona natural (Fase C).
- ⏳ Terminar Fase D (validación og:image/JSON-LD, Search Console).
- ⏳ Fase E — marca y comunicación (voz/tono documentado, fotografía
  real, taglines por canal, kit de assets, contenido de lanzamiento).
- ⏳ Fase F — salida al mundo (fecha de lanzamiento, plan de
  adquisición, soporte, QA final de punta a punta con pago real).
- ⏳ Fase G — contenido diario y distribución (cadencia, calendario de
  4 semanas, convertir la historia de Jay en pieza real de contenido).
- ⏳ Fase H — evoluciones de Logros (no bloquea el lanzamiento).
- ⏳ Triage completo de los bugs conocidos de Sentry (ver abajo).

## Bugs conocidos (Sentry, producción)

Vistos en el dashboard de Sentry en una sesión previa, sin triage
completo todavía — revisar si siguen ocurriendo ahora que hay más
tráfico real:

- `Connection terminated unexpectedly` en `/dashboard` (10 eventos al
  momento de verlo) — posible problema recurrente de conexión a
  Postgres.
- `Unknown root exit status` en `/dashboard`.
- `TypeError: null is not an object (evaluating 't.parallelRoutes.get')`
  en `/onboarding`.
- Error en Server Components render en `/onboarding` (mensaje omitido en
  build de producción).

## Próximos pasos (en orden sugerido)

1. Terminar Fase D: validar og:image/JSON-LD, Search Console + sitemap.
2. Probar un pago real de punta a punta (Fase A, el último pendiente).
3. Sacar el RUC (Fase C) cuando Jay tenga el trámite hecho.
4. Triage de los errores conocidos en Sentry.
5. Fase E en adelante (marca, contenido, lanzamiento) — depende de
   disponibilidad de Luna, no es técnico.

## Bloqueos

Ninguno técnico activo. Lo único que depende de un trámite externo (no
de código) es el RUC (SRI) para Fase C.

## Prioridades (en orden)

1. Cerrar Fase D (SEO) — en curso.
2. Probar pago real de punta a punta.
3. Triage de errores de Sentry.
4. Todo lo demás (legal/RUC, marca, contenido, logros v2).
