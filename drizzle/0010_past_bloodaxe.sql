CREATE INDEX IF NOT EXISTS "analytics_events_user_id_idx" ON "analytics_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "feedback_messages_user_id_idx" ON "feedback_messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habit_freezes_habit_id_idx" ON "habit_freezes" USING btree ("habit_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habit_logs_habit_id_date_idx" ON "habit_logs" USING btree ("habit_id","date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habits_user_id_idx" ON "habits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_id_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_points_idx" ON "users" USING btree ("points");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wheel_measurements_user_id_idx" ON "wheel_of_life_measurements" USING btree ("user_id");