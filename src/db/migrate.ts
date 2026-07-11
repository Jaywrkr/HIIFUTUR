import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { withoutSslModeParam } from "@/lib/db-url";

async function main() {
  const pool = new Pool({
    connectionString: withoutSslModeParam(process.env.POSTGRES_URL),
    ssl: process.env.POSTGRES_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
  });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
