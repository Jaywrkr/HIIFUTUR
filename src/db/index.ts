import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { withoutSslModeParam } from "@/lib/db-url";

const pool = new Pool({
  connectionString: withoutSslModeParam(process.env.POSTGRES_URL),
  ssl: process.env.POSTGRES_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
