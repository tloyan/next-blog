import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const articles = pgTable("article", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: text(),
  excerpt: text(),
  content: json(),
  image: text(),
  published: boolean().$default(() => false),
  authorId: text("author_id").references(() => user.id),
});

export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  label: text(),
  value: text(),
});

export const articlesToTags = pgTable(
  "articles_to_tags",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.tagId] })]
);

export const articlesToTagsRelation = relations(articlesToTags, ({ one }) => ({
  article: one(articles, {
    fields: [articlesToTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articlesToTags.tagId],
    references: [tags.id],
  }),
}));

export const articleRelation = relations(articles, ({ one, many }) => ({
  author: one(user, {
    fields: [articles.authorId],
    references: [user.id],
  }),
  tags: many(articlesToTags),
}));

export const tagRelation = relations(tags, ({ many }) => ({
  articles: many(articlesToTags),
}));
