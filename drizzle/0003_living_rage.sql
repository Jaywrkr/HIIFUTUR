ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reminders_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_reminder_sent_at" timestamp;