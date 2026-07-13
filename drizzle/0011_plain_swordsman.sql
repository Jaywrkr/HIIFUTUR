ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "trial_ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_plan" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_price_tier" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_status" text DEFAULT 'trialing' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "paypal_subscription_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_current_period_end" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_paypal_subscription_id_unique" UNIQUE("paypal_subscription_id");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
