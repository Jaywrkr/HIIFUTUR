-- Cuentas creadas antes de que existiera el trial (columna agregada en
-- 0011) se quedaron con trial_ends_at NULL para siempre. access.ts trata
-- NULL como "no bloqueado todavía" y priceTierFor() lo trata como precio
-- "normal" — esas cuentas nunca ven el precio de descuento ($4.99/$42).
-- Les damos un trial de 7 días a partir de ahora, igual que a cualquiera
-- que complete el onboarding hoy. Guardado con WHERE IS NULL: correr esto
-- de nuevo no le toca la fecha a nadie que ya tenga una.
UPDATE "users" SET "trial_ends_at" = now() + interval '7 days' WHERE "trial_ends_at" IS NULL;--> statement-breakpoint