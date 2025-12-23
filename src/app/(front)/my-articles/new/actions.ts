"use server";

import db from "@/db";
import { articles } from "@/db/schema/articles";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function saveArticle({
  content,
  id,
}: {
  content: string;
  id?: number;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Action not authorized");

  const contentJson = JSON.parse(content);

  const res = await db
    .insert(articles)
    .values({
      id,
      content: contentJson,
      authorId: session?.user.id,
    })
    .onConflictDoUpdate({
      target: articles.id,
      set: { content: contentJson, authorId: session?.user.id },
    })
    .returning({ id: articles.id });

  return res[0]?.id;
}
