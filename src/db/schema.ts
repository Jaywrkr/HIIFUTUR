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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (u) => ({
    // Display names must be unique (case-insensitive) — shown on the
    // leaderboard, so two users can't be confused for one another.
    nameLowerUnique: uniqueIndex("users_name_lower_unique").on(sql`lower(${u.name})`),
  })
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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

export const habits = pgTable("habits", {
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
});

export const habitLogs = pgTable("habit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  completed: boolean("completed").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// A day protected by a streak freeze: counts toward the streak like a
// completed log, but isn't one — kept separate so the UI can tell them apart.
export const habitFreezes = pgTable("habit_freezes", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const wheelOfLifeMeasurements = pgTable("wheel_of_life_measurements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  measurementDate: timestamp("measurement_date").notNull().defaultNow(),
  areaScores: jsonb("area_scores").$type<Record<string, number>>().notNull(),
  notes: text("notes"),
});

export const feedbackMessages = pgTable("feedback_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  pageUrl: text("page_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// First-party funnel tracking — no third-party service, no cookies, nothing
// that contradicts what /privacidad promises. Just enough to see where
// people get stuck: registered, onboarding_completed, habit_created,
// habit_checked, wheel_measured, module_completed.
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  event: text("event").notNull(),
  properties: jsonb("properties").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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
