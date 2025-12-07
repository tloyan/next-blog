import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as articles from "./schema/articles";

export default drizzle({ client: sql, schema: { ...articles } });
