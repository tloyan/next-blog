import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: integer(),
  title: varchar({ length: 30 }),
});
