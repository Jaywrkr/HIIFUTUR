ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cycle_started_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cycle_start_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cycle_completed_at" timestamp;