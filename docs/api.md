# API

La mayoría de la escritura de datos en ANKLA pasa por **Server Actions**,
no por rutas HTTP — ver la segunda mitad de este documento. Las rutas
HTTP reales son solo 6, y cada una existe porque el caller no es el propio
navegador de la app en un flujo normal de React.

## Rutas HTTP (`src/app/api/**/route.ts`)

### `GET /api/auth/[...nextauth]` y `POST /api/auth/[...nextauth]`

Manejado por NextAuth v4 (`src/auth.ts`) — login, logout, callback de
sesión. Ver [`docs/architecture.md`](architecture.md#autenticación).

### `GET /api/cron/reminders`

**Quién la llama**: Vercel Cron, una vez al día a las 13:00 UTC (definido
en `vercel.json`).

**Auth**: header `Authorization: Bearer <CRON_SECRET>`. Sin el header
correcto, `401`.

**Qué hace**: busca usuarios con un hábito activo sin marcar hoy y
recordatorios habilitados, y les manda un email (Resend) + push (Web
Push) — como mucho uno por usuario por día (`lastReminderSentAt`).

**Respuesta**: `{ ok: true, sent: <número> }`.

### `POST /api/habits/[id]/check`

**Quién la llama**: el Service Worker, desde la acción "Marcar hecho" de
una notificación push. No se usa desde la UI normal — ahí se usa la
Server Action `toggleHabitToday` directamente.

**Auth**: cookie de sesión (el `fetch()` del Service Worker la manda
automático, same-origin). `401` si no hay sesión.

**Rate limit**: 30 requests/minuto por usuario.

**Respuesta**: `{ ok: true }` o `404` si el hábito no existe/no es del
usuario.

### `GET /api/reminders/unsubscribe?uid=<userId>&token=<token>`

**Quién la llama**: el link "dejar de recibir recordatorios" dentro del
email — pensado para clickearse sin estar logueado.

**Auth**: token firmado (`src/lib/reminder-token.ts`), no sesión.

**Qué hace**: `remindersEnabled = false` para ese usuario, y devuelve una
página HTML de confirmación simple (no JSON — es para verse en el
navegador).

### `POST /api/webhooks/paypal`

**Quién la llama**: PayPal, cuando cambia el estado de una suscripción.

**Auth**: verificación de firma del webhook (`verifyPaypalWebhookSignature`
en `src/lib/paypal.ts`), usando `PAYPAL_WEBHOOK_ID`. `401` si la firma no
verifica.

**Eventos manejados** (`event_type`):

| Evento | Efecto |
|---|---|
| `BILLING.SUBSCRIPTION.ACTIVATED` | `subscriptionStatus = "active"`, guarda próxima fecha de cobro |
| `PAYMENT.SALE.COMPLETED` | Extiende `subscriptionCurrentPeriodEnd` (renovación) |
| `BILLING.SUBSCRIPTION.CANCELLED` | `subscriptionStatus = "canceled"` (sigue activo hasta que venza el período ya pagado) |
| `BILLING.SUBSCRIPTION.SUSPENDED` / `.EXPIRED` | `subscriptionStatus = "expired"` |
| Cualquier otro | Se ignora (`default: break`) |

Este webhook es la **única** fuente de verdad del estado real de una
suscripción — nada del lado del cliente marca "activo" por su cuenta.

### `GET /api/setup/migrate?secret=<SETUP_SECRET>`

**Cuándo usarla**: respaldo manual. Las migraciones normalmente corren
solas en el build (`vercel-build`) — esta ruta es solo por si ese paso
fallara y hubiera que forzarlas desde el navegador.

**Auth**: doble candado — `SETUP_MIGRATE_ENABLED` debe ser exactamente
`"1"` (si no, `404`, no `401` — invisible cuando está apagada) **y** el
query param `secret` debe matchear `SETUP_SECRET` (si no, `401`).

**Idempotente**: todo el SQL usa `CREATE TABLE IF NOT EXISTS`,
`ADD COLUMN IF NOT EXISTS` y bloques `DO $$ ... EXCEPTION WHEN
duplicate_object THEN null; END $$` para constraints — segura de correr
más de una vez.

## Server Actions (la escritura real de la app)

Viven en `src/lib/*-actions.ts`. Se llaman directo desde formularios
(`action={miAction}`) o desde `onClick` en Client Components — no hay capa
HTTP intermedia, Next.js serializa la llamada.

| Archivo | Qué hace |
|---|---|
| `habit-actions.ts` | Crear/editar hábito, `toggleHabitToday`, `markHabitDone`, congelar racha |
| `onboarding-actions.ts` | Completar onboarding (áreas + Wheel inicial) |
| `module-actions.ts` | Guardar respuestas de ejercicio, marcar módulo completado |
| `wheel-actions.ts` | Registrar nueva medición del Radar de Vida |
| `account-actions.ts` | Editar nombre, borrar cuenta |
| `password-reset-actions.ts` | Solicitar / confirmar reset de contraseña |
| `push-actions.ts` | Suscribir/desuscribir un dispositivo a push |
| `feedback-actions.ts` | Enviar mensaje del `FeedbackWidget` |
| `achievement-actions.ts` | `evaluateAndGrantAchievements` — evalúa y otorga logros |
| `paypal-actions.ts` | `confirmSubscription` — confirma una suscripción nueva desde el cliente tras el checkout de PayPal |
| `auth-actions.ts` | Registro de cuenta nueva (login lo maneja NextAuth directo) |

**Convención**: cada Server Action valida su propia entrada (con Zod donde
aplica) y su propia autorización (`requireUser()`/`getCurrentUser()`) — no
asumas que el middleware ya cubrió el caso, el middleware solo protege
páginas completas, no cada acción individual.
