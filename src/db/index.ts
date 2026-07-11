import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Vercel/Neon connection strings ship their own `sslmode=require` query
// param. Passing that AND an explicit `ssl` option below is what triggers
// pg-connection-string's "SSL modes are treated as aliases" deprecation
// warning on every connection — the two specify SSL twice, ambiguously.
// Stripping sslmode here leaves TLS behavior controlled solely by the
// `ssl` option below (unchanged from before) and just silences the noise.
function withoutSslModeParam(url: string | undefined): string | undefined {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    return parsed.toString();
  } catch {
    return url;
  }
}

const pool = new Pool({
  connectionString: withoutSslModeParam(process.env.POSTGRES_URL),
  ssl: process.env.POSTGRES_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
