# Base de datos

Postgres (Neon, vía la integración de Vercel Postgres) + Drizzle ORM.
`src/db/schema.ts` es la fuente de verdad — 10 tablas, todas descienden
de `users` con `ON DELETE CASCADE`.

## Diagrama ER

```mermaid
erDiagram
  users ||--o| user_preferences : "1:1"
  users ||--o{ habits : "1:N"
  users ||--o{ wheel_of_life_measurements : "1:N"
  users ||--o{ module_progress : "1:N"
  users ||--o{ user_achievements : "1:N"
  users ||--o{ password_reset_tokens : "1:N"
  users ||--o{ feedback_messages : "1:N"
  users ||--o{ analytics_events : "1:N"
  users ||--o{ push_subscriptions : "1:N"
  habits ||--o{ habit_logs : "1:N"
  habits ||--o{ habit_freezes : "1:N"

  users {
    uuid id PK
    text name "único (case-insensitive)"
    text email UK
    text password_hash
    int points
    timestamp cycle_started_at
    text subscription_status "trialing|active|canceled|expired"
    text paypal_subscription_id UK
  }
  habits {
    uuid id PK
    uuid user_id FK
    text name
    text category
    int order_index
    text status "locked|active|completed"
  }
  habit_logs {
    uuid id PK
    uuid habit_id FK
    date date
    boolean completed
  }
  module_progress {
    uuid user_id PK_FK
    text module_id PK
    boolean completed
    jsonb exercise_data
  }
  wheel_of_life_measurements {
    uuid id PK
    uuid user_id FK
    timestamp measurement_date
    jsonb area_scores
  }
```

## Tablas

### `users`
Cuenta, puntos, y todo el estado del ciclo de 30 días + suscripción.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | `defaultRandom()` |
| `name` | text | único case-insensitive (índice `users_name_lower_unique`) |
| `email` | text | único, not null |
| `password_hash` | text | bcrypt |
| `reminders_enabled` | boolean | default true |
| `last_reminder_sent_at` | timestamp | evita duplicar el cron diario |
| `points` | integer | default 0, indexado (`users_points_idx`, leaderboard) |
| `cycle_started_at` / `cycle_start_points` / `cycle_completed_at` | | ciclo de 30 días |
| `trial_ends_at` | timestamp | se fija una sola vez, al completar onboarding |
| `subscription_plan` | text | `"mensual" \| "anual" \| null` |
| `subscription_price_tier` | text | `"normal" \| "descuento" \| null` — se fija para siempre |
| `subscription_status` | text | `"trialing" \| "active" \| "canceled" \| "expired"`, default `trialing` |
| `paypal_subscription_id` | text | único |
| `subscription_current_period_end` | timestamp | |
| `last_unlocked_module_notified_id` | text | evita repetir el ritual de desbloqueo |

### `password_reset_tokens`
`user_id` FK cascade, `token_hash`, `expires_at`, `used_at`.

### `user_preferences`
1:1 con `users` (`user_id` es PK y FK a la vez). `selected_areas` (jsonb
array), `initial_wheel_scores` (jsonb), `onboarding_completed_at`.

### `habits`
`user_id` FK cascade. `name`, `description`, `category`, `order_index`
(orden de desbloqueo, el `0` es el hábito ancla), `status`
(`locked|active|completed`), `activated_at`, `unlock_date`,
`last_edited_at` (cooldown de edición), `last_freeze_used_at` (cooldown
de congelamiento).

### `habit_logs`
`habit_id` FK cascade, `date` (tipo `date`, no timestamp), `completed`
default true. Índice compuesto `(habit_id, date)`.

### `habit_freezes`
Un día protegido por el congelador de racha — cuenta como día ejecutado
para el ciclo, pero se guarda separado de `habit_logs` para que la UI
pueda distinguir "lo hice" de "estaba protegido".

### `wheel_of_life_measurements`
`user_id` FK cascade, `measurement_date`, `area_scores` (jsonb — claves =
los `id` de `WHEEL_AREAS`), `notes` opcional.

### `module_progress`
**Sin `id` propio** — PK compuesta `(user_id, module_id)`. `completed`,
`completed_at`, `exercise_data` (jsonb, las respuestas del ejercicio).

### `feedback_messages`
`user_id` FK cascade, `message`, `page_url` opcional.

### `analytics_events`
First-party, sin third parties. `user_id` FK cascade, `event` (string
libre: `registered`, `onboarding_completed`, `habit_created`,
`habit_checked`, `wheel_measured`, `module_completed`), `properties`
(jsonb libre).

### `push_subscriptions`
Un dispositivo/navegador suscrito a Web Push. `endpoint` único,
`p256dh`, `auth` (claves de cifrado del navegador).

### `user_achievements`
**Sin `id` propio** — PK compuesta `(user_id, achievement_id, tier)`. Un
registro por tier ganado, nunca se borra — historial permanente aunque
la métrica subyacente baje después.

## Relaciones

Todo cuelga de `users.id` con `ON DELETE CASCADE` — borrar una cuenta
(`account-actions.ts`) borra automáticamente todo lo demás sin tener que
recorrer tabla por tabla. `habit_logs` y `habit_freezes` cuelgan de
`habits.id`, también cascade.

## Índices

- `users_name_lower_unique` — único, case-insensitive, sobre `lower(name)`.
- `users_points_idx` — para el leaderboard (top 10 por puntos).
- `habit_logs_habit_id_date_idx` — compuesto, la consulta más frecuente
  del sistema (rachas, heatmap).
- Un índice simple `<tabla>_user_id_idx` (o `habit_id_idx`) en cada tabla
  con FK a `users`/`habits`, para los `WHERE user_id = ...` constantes.

## Restricciones

- `users.email` único, `users.name` único case-insensitive (constraint a
  nivel de índice, no de columna).
- `users.paypal_subscription_id` único.
- `push_subscriptions.endpoint` único.
- PKs compuestas en `module_progress` y `user_achievements` en vez de
  `id` propio — no puede haber dos filas de progreso para el mismo
  módulo, ni dos del mismo tier de logro, por diseño.

## Migraciones

Generadas con `npm run db:generate` (Drizzle Kit, a partir de
`schema.ts`) en `drizzle/*.sql`. **Regla dura del proyecto**: después de
generar, hay que editar el SQL a mano para que todo `ALTER TABLE ... ADD
COLUMN` lleve `IF NOT EXISTS` — ya causó un incidente en producción sin
eso. Cada cambio de schema también se espeja manualmente en
`src/app/api/setup/migrate/route.ts` (el respaldo manual).

Corren solas en cada deploy: `vercel-build` = `npm run db:migrate && next
build`. Localmente: `npm run db:migrate` (lee `POSTGRES_URL` de `.env`).

Ver [`docs/deployment.md`](deployment.md) para el flujo completo de
deploy y [`docs/decisions.md`](decisions.md) para el porqué de la regla
de idempotencia.
