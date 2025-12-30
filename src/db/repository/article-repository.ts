import db from "@/db";
import { AddArticleModel, articles, articlesToTags } from "../schema/articles";
import { eq } from "drizzle-orm";

export async function createArticleWithTagsDao(
  newArticle: AddArticleModel & { tagsId: string[] }
) {
  return await db.transaction(async (tx) => {
    const [article] = await tx.insert(articles).values(newArticle).returning();
    await tx.insert(articlesToTags).values(
      newArticle.tagsId.map((id) => ({
        articleId: article.id,
        tagId: id,
      }))
    );
    return article;
  });
}

export async function getArticleByIdDao(id: Required<AddArticleModel>["id"]) {
  return await db.query.articles.findFirst({
    where: (articles, { eq }) => eq(articles.id, id),
  });
}

export async function updateArticleDao(
  articleId: number,
  updatedData: AddArticleModel
) {
  const [updatedArticle] = await db
    .update(articles)
    .set(updatedData)
    .where(eq(articles.id, articleId))
    .returning();
  return updatedArticle;
}

export async function updateArticleWithTagsDao(
  newArticle: AddArticleModel & { tagsId: string[] }
) {
  return await db.transaction(async (tx) => {
    const [article] = await tx
      .update(articles)
      .set(newArticle)
      .where(eq(articles.id, newArticle.id as number))
      .returning();

    await tx
      .delete(articlesToTags)
      .where(eq(articlesToTags.articleId, newArticle.id as number));

    await tx.insert(articlesToTags).values(
      newArticle.tagsId.map((id) => ({
        articleId: newArticle.id as number,
        tagId: id,
      }))
    );
    return article;
  });
}

export async function deleteArticleByIdDao(
  id: Required<AddArticleModel>["id"]
) {
  await db.delete(articles).where(eq(articles.id, id));
}

export async function getAllPublicArticleWithTagsDao() {
  const results = await db.query.articles.findMany({
    with: {
      tags: { with: { tag: true } },
      author: true,
    },
    where: (articles, { eq }) => eq(articles.published, true),
  });

  return results.map(({ tags, ...rest }) => ({
    ...rest,
    tags: tags.map(({ tag }) => ({ ...tag })),
  }));
}

export async function getArticleWithAuthorByIdDao(
  id: Required<AddArticleModel>["id"]
) {
  return await db.query.articles.findFirst({
    where: (articles, { eq }) => eq(articles.id, id),
    with: {
      author: true,
    },
  });
}

export async function getAllArticlesWithTagsByAuthorIdDao(
  authorId: Required<AddArticleModel>["authorId"]
) {
  const results = await db.query.articles.findMany({
    where: (articles, { eq }) => eq(articles.authorId, authorId as string),
    with: {
      tags: {
        with: { tag: true },
      },
    },
  });

  return results.map(({ tags, ...rest }) => ({
    ...rest,
    tags: tags.map(({ tag }) => ({ ...tag })),
  }));
}

export async function getTagsDao() {
  return await db.query.tags.findMany();
}
