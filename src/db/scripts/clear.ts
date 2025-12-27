import pg from "pg";
import initDotEnv, { getEnvFromArg } from "./env";

const env = getEnvFromArg();
console.log("clear.ts with env", env);
initDotEnv(env);

const clearDb = async (shouldExit: boolean = false) => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not use in production");
  }
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }
  const client = new pg.Client({ connectionString: process.env.POSTGRES_URL });
  console.log("⏳ Checking connexion ...");
  console.log(`🗄️  URL : ${process.env.POSTGRES_URL}`);
  await client.connect();
  const start = Date.now();
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; `);
  await client.query(` 
    DO $$ 
    DECLARE 
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
    `);
  await client.query(`
    DO $$ 
    DECLARE 
      r RECORD;
    BEGIN
      FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
      END LOOP;
    END $$;
    `);
  const end = Date.now();
  console.log("✅ Tables deleted in", end - start, "ms");
  if (shouldExit) {
    process.exit(0);
  }
};

export default clearDb;
const shouldExit = process.argv[2] === "true";

try {
  await clearDb(shouldExit);
} catch (error) {
  console.error("❌ Connexion failed");
  console.error(error);
  process.exit(1);
}
