CREATE TABLE IF NOT EXISTS "habit_freezes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" uuid NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN IF NOT EXISTS "last_freeze_used_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "habit_freezes" ADD CONSTRAINT "habit_freezes_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
