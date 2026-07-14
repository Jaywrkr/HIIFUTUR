import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  primaryKey,
  uuid,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    remindersEnabled: boolean("reminders_enabled").notNull().default(true),
    lastReminderSentAt: timestamp("last_reminder_sent_at"),
    points: integer("points").notNull().default(0),
    // 30-day formation cycle: starts with the anchor habit. Two misses are
    // forgiven; the third one resets the cycle (points back to half of what
    // was earned since cycle start, modules re-locked — written exercises
    // are preserved).
    cycleStartedAt: timestamp("cycle_started_at"),
    cycleStartPoints: integer("cycle_start_points").notNull().default(0),
    cycleCompletedAt: timestamp("cycle_completed_at"),
    // Trial + subscription (PayPal). trialEndsAt is set once, when onboarding
    // completes (7 days out). Past it, access is hard-locked unless
    // subscriptionStatus is "active". priceTier is locked in permanently at
    // the moment the user subscribes — "descuento" if they subscribed before
    // trialEndsAt, "normal" otherwise — and never changes after that, even if
    // list prices change later.
    trialEndsAt: timestamp("trial_ends_at"),
    subscriptionPlan: text("subscription_plan").$type<"mensual" | "anual" | null>(),
    subscriptionPriceTier: text("subscription_price_tier").$type<"normal" | "descuento" | null>(),
    subscriptionStatus: text("subscription_status")
      .$type<"trialing" | "active" | "canceled" | "expired">()
      .notNull()
      .default("trialing"),
    paypalSubscriptionId: text("paypal_subscription_id").unique(),
    subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (u) => ({
    // Display names must be unique (case-insensitive) — shown on the
    // leaderboard, so two users can't be confused for one another.
    nameLowerUnique: uniqueIndex("users_name_lower_unique").on(sql`lower(${u.name})`),
    pointsIdx: index("users_points_idx").on(u.points),
  })
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: index("password_reset_tokens_user_id_idx").on(t.userId),
  })
);

// Selected life areas + the first Wheel of Life measurement from onboarding.
export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  selectedAreas: jsonb("selected_areas").$type<string[]>().notNull().default([]),
  initialWheelScores: jsonb("initial_wheel_scores").$type<Record<string, number>>(),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const habitStatusValues = ["locked", "active", "completed"] as const;
export type HabitStatus = (typeof habitStatusValues)[number];

export const habits = pgTable(
  "habits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    orderIndex: integer("order_index").notNull(),
    status: text("status").$type<HabitStatus>().notNull().default("locked"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    activatedAt: timestamp("activated_at"),
    unlockDate: timestamp("unlock_date"),
    lastEditedAt: timestamp("last_edited_at"),
    lastFreezeUsedAt: timestamp("last_freeze_used_at"),
  },
  (h) => ({
    userIdIdx: index("habits_user_id_idx").on(h.userId),
  })
);

export const habitLogs = pgTable(
  "habit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    completed: boolean("completed").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (l) => ({
    habitIdDateIdx: index("habit_logs_habit_id_date_idx").on(l.habitId, l.date),
  })
);

// A day protected by a streak freeze: counts toward the streak like a
// completed log, but isn't one — kept separate so the UI can tell them apart.
export const habitFreezes = pgTable(
  "habit_freezes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (f) => ({
    habitIdIdx: index("habit_freezes_habit_id_idx").on(f.habitId),
  })
);

export const wheelOfLifeMeasurements = pgTable(
  "wheel_of_life_measurements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    measurementDate: timestamp("measurement_date").notNull().defaultNow(),
    areaScores: jsonb("area_scores").$type<Record<string, number>>().notNull(),
    notes: text("notes"),
  },
  (w) => ({
    userIdIdx: index("wheel_measurements_user_id_idx").on(w.userId),
  })
);

export const feedbackMessages = pgTable(
  "feedback_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    pageUrl: text("page_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (f) => ({
    userIdIdx: index("feedback_messages_user_id_idx").on(f.userId),
  })
);

// First-party funnel tracking — no third-party service, no cookies, nothing
// that contradicts what /privacidad promises. Just enough to see where
// people get stuck: registered, onboarding_completed, habit_created,
// habit_checked, wheel_measured, module_completed.
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    event: text("event").notNull(),
    properties: jsonb("properties").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (a) => ({
    userIdIdx: index("analytics_events_user_id_idx").on(a.userId),
  })
);

// One row per browser/device subscribed to push. A user can have several
// (phone + laptop); each is addressed independently and removed on its own
// if the browser reports it's gone (404/410 from the push service).
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (p) => ({
    userIdIdx: index("push_subscriptions_user_id_idx").on(p.userId),
  })
);

export const moduleProgress = pgTable(
  "module_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: text("module_id").notNull(),
    completed: boolean("completed").notNull().default(false),
    completedAt: timestamp("completed_at"),
    exerciseData: jsonb("exercise_data").$type<Record<string, unknown>>(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (mp) => ({
    pk: primaryKey({ columns: [mp.userId, mp.moduleId] }),
  })
);
