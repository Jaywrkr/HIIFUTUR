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
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

export const wheelOfLifeMeasurements = pgTable("wheel_of_life_measurements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  measurementDate: timestamp("measurement_date").notNull().defaultNow(),
  areaScores: jsonb("area_scores").$type<Record<string, number>>().notNull(),
  notes: text("notes"),
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
