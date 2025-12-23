"use server";

import db from "@/db";
import { articles } from "@/db/schema/articles";
import { auth } from "@/lib/auth";
import { NodeType } from "@tiptap/core";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateArticle({
  id,
  content,
}: {
  id: number;
  title: string;
  content: NodeType;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Action not authorized");

  await db
    .update(articles)
    .set({
      title,
      content: content,
    })
    .where(eq(articles.id, id));
}
