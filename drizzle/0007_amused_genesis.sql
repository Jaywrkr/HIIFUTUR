ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Disambiguate any pre-existing duplicate names before the unique index is
-- created, so this migration never fails on production data.
UPDATE "users" u SET "name" = u."name" || ' ' || substr(u."id"::text, 1, 4)
WHERE u."name" IS NOT NULL AND EXISTS (
  SELECT 1 FROM "users" u2
  WHERE lower(u2."name") = lower(u."name") AND u2."id" != u."id" AND u2."id" > u."id"
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_name_lower_unique" ON "users" USING btree (lower("name"));