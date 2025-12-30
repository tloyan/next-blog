"use server";

import {
  createArticleWithTagsDao,
  deleteArticleByIdDao,
  getAllArticlesWithTagsByAuthorIdDao,
  getArticleByIdDao,
  getArticleWithAuthorByIdDao,
  updateArticleDao,
  updateArticleWithTagsDao,
} from "@/db/repository/article-repository";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function deleteArticle({ id }: { id: number }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");
  try {
    const article = await getArticleByIdDao(id);
    if (!article) throw new Error("Something went wrong");
    if (article.authorId !== session.user.id)
      throw new Error("Unauthorized: Permission Denied");
    await deleteArticleByIdDao(id);
    revalidatePath("/my-articles");
  } catch {}
}

export async function publishArticle({
  id,
  published,
}: {
  id: number;
  published: boolean;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");

  try {
    const article = await getArticleByIdDao(id);
    if (!article) throw new Error("Something went wrong");
    if (article.authorId !== session.user.id)
      throw new Error("Unauthorized: Permission Denied");
    await updateArticleDao(id, { published });
    revalidatePath("/my-articles");
  } catch {}
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");

  if (id) {
    // UPDATE
    try {
      // 1 - Verifier que la ressource existe
      const article = await getArticleByIdDao(id);
      // Si ressource n'existe pas throw new Error
      if (!article) throw new Error("Something went wrong !");
      // Si user na pas acces a la ressource throw new Error
      if (article.authorId !== session.user.id)
        throw new Error("Unauthorized: Permission Denied");
      // Si user a acces | UPDATE
      const result = await updateArticleWithTagsDao({
        id,
        title,
        excerpt,
        tagsId,
        image,
        authorId: session.user.id,
      });
      revalidatePath("/my-articles");
      return result;
    } catch {}
  } else {
    // CREATE
    try {
      const result = await createArticleWithTagsDao({
        title,
        excerpt,
        tagsId,
        image,
        authorId: session.user.id,
      });
      revalidatePath("/my-articles");
      return result;
    } catch {}
  }
}

export async function getPublicArticleWithAuthorById(id: number) {
  const article = await getArticleWithAuthorByIdDao(id);
  if (!article || !article.published)
    throw new Error(
      "Something went wrong: Article doesn't exist or is not public"
    );
  return article;
}

export async function getAllUserArticles() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized: No Active Session");
  return await getAllArticlesWithTagsByAuthorIdDao(session.user.id);
}
