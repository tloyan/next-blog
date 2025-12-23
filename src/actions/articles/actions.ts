"use server";

import db from "@/db";
import { articles, articlesToTags } from "@/db/schema/articles";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function deleteArticle({ id }: { id: number }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unautorized");

  await db
    .delete(articles)
    .where(and(eq(articles.id, id), eq(articles.authorId, session.user.id)))
    .returning();

  revalidatePath("/my-articles");
}

export async function publishArticle({
  id,
  published,
}: {
  id: number;
  published: boolean;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unautorized");

  console.log();

  await db
    .update(articles)
    .set({ published: published })
    .where(and(eq(articles.id, id), eq(articles.authorId, session.user.id)))
    .returning();

  revalidatePath("/my-articles");
}

export async function createArticle({
  id,
  title,
  excerpt,
  tagIds,
  image,
}: {
  id?: number;
  title?: string;
  excerpt?: string;
  tagIds: string[];
  image?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  console.log("createArticle formData:", {
    title,
    excerpt,
    tagIds,
    // image,
  });

  const q = await db.transaction(async (tx) => {
    const [article] = await tx
      .insert(articles)
      .values({
        id,
        title,
        excerpt,
        image,
        authorId: session.user.id,
      })
      .onConflictDoUpdate({
        target: articles.id,
        set: { title, excerpt, image },
      })
      .returning();

    await tx
      .delete(articlesToTags)
      .where(eq(articlesToTags.articleId, article.id));

    await tx
      .insert(articlesToTags)
      .values(tagIds.map((id) => ({ articleId: article.id, tagId: id })));

    return article;
  });

  revalidatePath("/my-articles");
  return q;
}
