import initDotEnv from "./src/db/scripts/env";
import { defineConfig } from "drizzle-kit";

initDotEnv();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
  casing: "snake_case",
});
