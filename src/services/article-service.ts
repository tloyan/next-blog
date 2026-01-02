import "server-only";

import {
  createArticleWithTagsDao,
  deleteArticleByIdDao,
  getAllArticlesWithTagsByAuthorIdDao,
  getAllPublicArticleWithTagsDao,
  getArticleByIdDao,
  getArticleWithAuthorByIdDao,
  getTagsDao,
  updateArticleDao,
  updateArticleWithTagsDao,
} from "@/db/repository/article-repository";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isOwner } from "./authorization/authorization-service";
import {
  createArticleSchema,
  publishArticleSchema,
  updateArticleContentSchema,
} from "./validation/article/validation-service";

export async function deleteArticleService(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");
  const article = await getArticleByIdDao(id);
  if (!article) throw new Error("Something went wrong");
  const owner = await isOwner(article.authorId);
  if (!owner) throw new Error("Unauthorized: Permission Denied");
  await deleteArticleByIdDao(id);
  revalidatePath("/my-articles");
}

export async function publishArticleService({
  id,
  published,
}: {
  id: number;
  published: boolean;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");
  const parsed = publishArticleSchema.safeParse({ id, published });
  if (!parsed.success) throw new Error("Validation Failed");
  const sanitizedData = parsed.data;
  const article = await getArticleByIdDao(sanitizedData.id);
  if (!article) throw new Error("Something went wrong");
  const owner = await isOwner(article.authorId);
  if (!owner) throw new Error("Unauthorized: Permission Denied");
  await updateArticleDao(sanitizedData.id, {
    published: sanitizedData.published,
  });
  revalidatePath("/my-articles");
}

export async function createOrUpdateArticleService({
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");

  const parsed = createArticleSchema.safeParse({
    id,
    title,
    excerpt,
    tagsId,
    image,
  });
  if (!parsed.success) throw new Error("Validation failed");
  const sanitizedData = parsed.data;
  if (sanitizedData.id) {
    const article = await getArticleByIdDao(sanitizedData.id);
    if (!article) throw new Error("Something went wrong !");
    const owner = await isOwner(article.authorId);
    if (!owner) throw new Error("Unauthorized: Permission Denied");
    const result = await updateArticleWithTagsDao(sanitizedData.id, {
      title: sanitizedData.title,
      excerpt: sanitizedData.excerpt,
      tagsId: sanitizedData.tagsId,
      image: sanitizedData.image,
      authorId: session.user.id,
    });
    revalidatePath("/my-articles");
    return result;
  } else {
    const result = await createArticleWithTagsDao({
      title: sanitizedData.title,
      excerpt: sanitizedData.excerpt,
      tagsId: sanitizedData.tagsId,
      image: sanitizedData.image,
      authorId: session.user.id,
    });
    revalidatePath("/my-articles");
    return result;
  }
}

export async function getPublicArticleWithAuthorByIdService(id: number) {
  const article = await getArticleWithAuthorByIdDao(id);
  if (!article || !article.published)
    throw new Error(
      "Something went wrong: Article doesn't exist or is not public"
    );
  return article;
}

export async function getAllUserArticlesService() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");
  return await getAllArticlesWithTagsByAuthorIdDao(session.user.id);
}

export async function updateArticleContentService(
  id: number,
  data: { content: string }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");
  const parsed = updateArticleContentSchema.safeParse({ id, ...data });
  if (!parsed.success) throw new Error("Validation failed");
  const sanitizedData = parsed.data;
  const article = await getArticleByIdDao(sanitizedData.id);
  if (!article) throw new Error("Something went wrong !");
  const owner = await isOwner(article.authorId);
  if (!owner) throw new Error("Unauthorized: Permission Denied");
  return await updateArticleDao(sanitizedData.id, sanitizedData);
}

export async function getUserArticleByIdService(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");
  const article = await getArticleByIdDao(id);
  if (!article) throw new Error("Something went wrong");
  const owner = await isOwner(article.authorId);
  if (!owner) throw new Error("Unauthorized: Permission Denied");
  return article;
}

export async function getAllPublicArticleWithTagsService() {
  return await getAllPublicArticleWithTagsDao();
}

export async function getTagsService() {
  return await getTagsDao();
}
