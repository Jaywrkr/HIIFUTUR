# Sprint actual

> Este documento se actualiza a mano en cada sesión de trabajo — no es
> automático. Si estás leyendo esto en una sesión futura y no coincide con
> `git log`, el código y el historial de commits mandan, no este archivo.

**Última actualización**: Fase D (SEO) cerrada — Search Console
verificado, sitemap enviado, y se corrigió un bug de producción
("Vercel Authentication" bloqueaba todo el sitio con 403). Primer QA
manual real de la app (no solo landing/decks) hecho contra Postgres
local, sin bugs bloqueantes. Sentry ya revisado por Jay — no es un
pendiente técnico de esta sesión.

## Qué se está construyendo

El producto (curso + hábitos + Radar de Vida + logros) ya está
funcionalmente completo y en producción bajo el nombre **ANKLA** (antes
"EJECUTA" — renombrado en toda la app, landing, legal y docs). El
operador/responsable público es **Jay Jaramillo (jaywrkr)** — ya no
existe "HIIFUTUR" en ninguna superficie visible, era un nombre de marca
sin entidad real detrás.

El trabajo actual sigue el documento de operaciones, fase por fase
(A → dinero y cuentas reales, B → observabilidad, C → legal, D → SEO,
E → marca, F → salida al mundo, G → contenido, H → logros v2).

> **Importante para una sesión nueva**: `docs/ankla-operaciones.html` en
> este repo ya tiene el checklist completo tarea por tarea (fases A-H,
> con quién la toma, cómo se hizo o el hint de cómo hacerla, y filtro por
> owner) — dejó de ser una versión liviana. También está publicado como
> [artifact](https://claude.ai/code/artifact/ea2bd95c-2a94-47e4-91dd-378118e51d82)
> para compartir fuera del repo; ambas copias deberían mantenerse en
> sync a mano. `docs/deck-ankla-vision.html` es el deck de marca y
> visión (filosofía, método, para quién), también completo en el repo.
> Si alguna sesión no tiene acceso al artifact, los dos `.html` del repo
> son la fuente de verdad.

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
  en `ANKLA <hola@ankla.app>`. **Probado de punta a punta**: reset de
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
- ✅ JSON-LD de la landing validado con el dominio real (Rich Results
  Test de Google: 1 valid item, Software Apps, sin errores críticos).
- ✅ Google Search Console: propiedad `https://ankla.app/` verificada
  por HTML tag (`GOOGLE_SITE_VERIFICATION` seteada en Vercel Production).
  De paso se encontró y corrigió un bug real: **"Vercel Authentication"
  (Deployment Protection) estaba activo en producción**, devolviendo 403
  a cualquier visita sin sesión de Vercel — bloqueaba a Googlebot y a
  cualquier usuario nuevo sin loguearse. Se desactivó.
- ✅ Sitemap (`sitemap.xml`) enviado en Search Console.
- Fase D: **completa.**

**Landing** (fuera del checklist de operación, pero reciente):
- ✅ El hero reemplazó las tarjetas flotantes de mentira por una imagen
  real del producto (`public/hero-radar-ancla.png` — Radar de Vida +
  tarjeta de hábito ancla), con una sola tarjeta de acento encima.
- ✅ La sección "Aprendizaje. Acción. Control." suma una imagen real del
  flujo (`public/metodo-aprender-hacer-control.png`).

## QA manual de la app (no landing/decks) — sesión actual

Primera pasada real de la app en sí, contra Postgres local, con
Playwright simulando un usuario nuevo: registro → onboarding (áreas +
Radar de Vida baseline) → Módulo 1 (ejercicio interactivo, hábito
ancla) → marcar hábito (mantener presionado, no un click) → dashboard →
hábitos → editar hábito → jardín zen → modo compacto → leaderboard →
cuenta → mobile viewport.

**Resultado: cero errores 500 del servidor, cero errores de consola
reales en todo el recorrido.** Todo lo probado funciona como se
diseñó:
- Onboarding completo, con su modal de confirmación de línea base
  ("una vez guardada, no la puedes editar").
- Módulo 1: causa raíz + hábito ancla (sugerencia o texto propio) +
  creencia limitante, con validación de campos faltantes.
- Marcar hábito: gesto de mantener presionado 650ms (con vibración en
  móvil), no un tap simple — deliberado, evita marcar sin querer.
- Edición de hábito: cambia nombre, pero bloquea la edición por 14 días
  después de guardar (anti-abuso).
- Agregar un segundo hábito: no hay botón — es intencional, se
  desbloquea a los 30 días de sostener el primero.
- Jardín zen: modal con canvas de arena rastrillada, sin errores.
- Modo compacto: aplica `data-density="compact"` al `<html>` y de
  verdad saca elementos (no solo los achica), tal como pide el
  CLAUDE.md.
- Registro: nombres únicos globalmente (por el leaderboard compartido)
  y rate limit de 10 registros/hora por IP — ambos confirmados como
  decisiones de diseño en `auth-actions.ts`, no bugs.

**Hallazgo menor, para criterio de Jay (no es un bug de código)**:
en Cuenta dice "0 días en ANKLA" el mismo día del registro —
matemáticamente correcto (`daysBetween` cuenta días completos
transcurridos), pero puede sentirse raro para alguien que recién
empezó. Fácil de cambiar si se prefiere que diga "Día 1" ese primer
día.

**Ciclo de 30 días con fallos perdonados — probado end-to-end**:
además de los 19 tests unitarios que ya pasaban (`src/lib/cycle.test.ts`),
se simuló el escenario real manipulando `cycle_started_at` en Postgres
local (5 días atrás, sin logs de hábito → 3+ fallos). `evaluateCycle`
detectó el tercer fallo al cargar `/dashboard` solo, sin cron: reseteó
puntos a la fórmula esperada (mitad de lo ganado en el ciclo, nunca
menos de lo que tenía al empezar), re-bloqueó los módulos
(`0 de 11 completados`), y mostró la pantalla de reset con el mensaje
"El ciclo se reinició. Tú no." — bien resuelta, coherente con la
filosofía de que el fallo está incluido en el diseño.

**Notificaciones push — probado hasta donde el entorno lo permite**:
se generaron claves VAPID de prueba, se activó el toggle en Cuenta con
permiso de notificación concedido, y no hubo ningún error 500 ni
crash del servidor. Pero suscribirse de verdad requiere que el
navegador alcance el servicio de push de Google/Mozilla por red, y este
entorno de pruebas no tiene esa salida — la suscripción quedó en 0 en
`push_subscriptions`. **Esto no es una confirmación de que funcione en
producción**, solo de que el código no truena; falta probarlo en un
dispositivo real con internet normal antes de darlo por bueno. De paso
se encontró un ícono (`icon-192.png`) que a veces tira un warning de
consola al navegar muy rápido entre páginas — confirmado con `curl`
directo que el archivo es un PNG válido y se sirve con 200, así que es
un artefacto de la velocidad de navegación automatizada, no un archivo
roto.

**Reset de contraseña — probado end-to-end, funciona perfecto**: pedido
del reset (mensaje genérico, no revela si el email existe — correcto
por seguridad), link real con token (visible en consola local sin
`RESEND_API_KEY`, en producción va por email real ya probado antes),
cambio de contraseña, login con la nueva funciona, login con la vieja
lo rechaza ("Email o contraseña incorrectos"), y **reusar el mismo
link ya usado lo rechaza** ("Ese enlace es inválido o ya expiró") — el
token es de un solo uso, validado en el server action
(`isNull(usedAt)` + expiración), aunque la página del formulario se
renderiza igual sin chequear antes (el rechazo pasa recién al enviar,
lo cual es un comportamiento aceptable, no un bug).

**Sin probar todavía**: pago real con PayPal, notificaciones push en un
dispositivo real, y un mobile real (el viewport angosto se vio bien,
pero eso no reemplaza un teléfono real).

## Qué falta (todo lo demás)

- ⏳ Probar pago real con PayPal (Fase A, el único punto que queda ahí).
- ⏳ RUC de persona natural (Fase C).
- ⏳ Fase E — marca y comunicación (voz/tono documentado, fotografía
  real, taglines por canal, kit de assets, contenido de lanzamiento).
- ⏳ Fase F — salida al mundo (fecha de lanzamiento, plan de
  adquisición, soporte, QA final de punta a punta con pago real).
- ⏳ Fase G — contenido diario y distribución (cadencia, calendario de
  4 semanas, convertir la historia de Jay en pieza real de contenido).
- ⏳ Fase H — evoluciones de Logros (no bloquea el lanzamiento).
- ⏳ Terminar el QA manual de la app: reset de contraseña, pago real,
  push, mobile en dispositivo real.

## Próximos pasos (en orden sugerido)

1. Probar un pago real de punta a punta (Fase A, el último pendiente) y
   reset de contraseña real.
2. Sacar el RUC (Fase C) cuando Jay tenga el trámite hecho.
3. Fase E en adelante (marca, contenido, lanzamiento) — depende de
   disponibilidad de Luna, no es técnico.

## Bloqueos

Ninguno técnico activo. Lo único que depende de un trámite externo (no
de código) es el RUC (SRI) para Fase C.

## Prioridades (en orden)

1. Terminar QA manual de la app.
2. Probar pago real de punta a punta + reset de contraseña.
3. Todo lo demás (legal/RUC, marca, contenido, logros v2).
