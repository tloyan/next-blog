import * as dotenv from "dotenv";

function initDotEnv() {
  const environment = process.env.NODE_ENV || "development";
  const envFilePath =
    environment === "production" ? ".env.production" : ".env.development";
  dotenv.config({ path: envFilePath });
}

export default initDotEnv;
