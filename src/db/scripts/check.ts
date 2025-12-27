#!/usr/bin/env node

import pg from "pg";
import initDotEnv from "./env";

initDotEnv();

const checkConnexion = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }
  const client = new pg.Client({
    connectionString: process.env.POSTGRES_URL,
  });

  console.log("⏳ Checking connexion ...");
  console.log(`🗄️  URL : ${process.env.POSTGRES_URL}`);

  await client.connect();

  const start = Date.now();
  await client.query(`SELECT 1`);

  const end = Date.now();

  console.log("✅ Connexion checked in", end - start, "ms");

  process.exit(0);
};

export default checkConnexion;

try {
  await checkConnexion();
} catch (error) {
  console.error("❌ Connexion failed");
  console.error(error);
  process.exit(1);
}
