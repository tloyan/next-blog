"use server";

import {
  createOrUpdateArticleService,
  deleteArticleService,
  getAllPublicArticleWithTagsService,
  getAllUserArticlesService,
  getPublicArticleWithAuthorByIdService,
  getTagsService,
  getUserArticleByIdService,
  publishArticleService,
  updateArticleContentService,
} from "@/services/article-service";

export async function deleteArticle({ id }: { id: number }) {
  return await deleteArticleService(id);
}

export async function publishArticle({
  id,
  published,
}: {
  id: number;
  published: boolean;
}) {
  return await publishArticleService({ id, published });
}

export async function createOrUpdateArticle({
  id,
  title,
  excerpt,
  tagsId,
  image,
}: {
  id?: number;
  title?: string;
  excerpt?: string;
  tagsId: string[];
  image?: string;
}) {
  return await createOrUpdateArticleService({
    id,
    title,
    excerpt,
    tagsId,
    image,
  });
}

export async function getPublicArticleWithAuthorById(id: number) {
  return await getPublicArticleWithAuthorByIdService(id);
}

export async function getAllUserArticles() {
  return await getAllUserArticlesService();
}

export async function saveArticleContent(articleId: number, content: string) {
  return await updateArticleContentService(articleId, { content });
}

export async function getUserArticle(articleId: number) {
  return await getUserArticleByIdService(articleId);
}

export async function getAllPublicArticleWithTags() {
  return await getAllPublicArticleWithTagsService();
}

export async function getTags() {
  return await getTagsService();
}
