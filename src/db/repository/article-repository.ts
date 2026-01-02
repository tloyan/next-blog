import db from "@/db";
import {
  AddArticleModel,
  ArticleModel,
  articles,
  articlesToTags,
  TagModel,
} from "../schema/articles";
import { eq } from "drizzle-orm";

export async function createArticleWithTagsDao(
  newArticle: AddArticleModel & { tagsId: string[] }
): Promise<ArticleModel> {
  return await db.transaction(async (tx) => {
    const [article] = await tx.insert(articles).values(newArticle).returning();
    if (!newArticle.tagsId.length) return article;
    await tx.insert(articlesToTags).values(
      newArticle.tagsId.map((id) => ({
        articleId: article.id,
        tagId: id,
      }))
    );
    return article;
  });
}

export async function getArticleByIdDao(
  id: Required<AddArticleModel>["id"]
): Promise<ArticleModel | undefined> {
  return await db.query.articles.findFirst({
    where: (articles, { eq }) => eq(articles.id, id),
  });
}

export async function updateArticleDao(
  articleId: number,
  updatedData: Partial<AddArticleModel>
): Promise<ArticleModel> {
  const [updatedArticle] = await db
    .update(articles)
    .set(updatedData)
    .where(eq(articles.id, articleId))
    .returning();
  return updatedArticle;
}

export async function updateArticleWithTagsDao(
  articleId: number,
  newArticle: AddArticleModel & { tagsId: string[] }
) {
  return await db.transaction(async (tx) => {
    const [article] = await tx
      .update(articles)
      .set(newArticle)
      .where(eq(articles.id, articleId))
      .returning();

    await tx
      .delete(articlesToTags)
      .where(eq(articlesToTags.articleId, articleId));

    if (!newArticle.tagsId.length) return article;
    await tx.insert(articlesToTags).values(
      newArticle.tagsId.map((id) => ({
        articleId: articleId,
        tagId: id,
      }))
    );
    return article;
  });
}

export async function deleteArticleByIdDao(
  id: Required<AddArticleModel>["id"]
): Promise<ArticleModel[]> {
  return await db.delete(articles).where(eq(articles.id, id)).returning();
}

export async function getAllPublicArticleWithTagsDao(): Promise<
  ArticleModel[]
> {
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
): Promise<ArticleModel | undefined> {
  return await db.query.articles.findFirst({
    where: (articles, { eq }) => eq(articles.id, id),
    with: {
      author: true,
    },
  });
}

export async function getAllArticlesWithTagsByAuthorIdDao(
  authorId: Required<AddArticleModel>["authorId"]
): Promise<ArticleModel[]> {
  const results = await db.query.articles.findMany({
    where: (articles, { eq }) => eq(articles.authorId, authorId),
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

export async function getTagsDao(): Promise<TagModel[]> {
  return await db.query.tags.findMany();
}
