import db from "@/db";
import WritePage from "./page-component";
import { articles } from "@/db/schema/articles";
import { user } from "@/db/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const data = await db
    .select()
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(
      and(eq(articles.authorId, String(session?.user.id)), eq(articles.id, id))
    );

  return <WritePage content={data[0]?.article.content} />;
}
