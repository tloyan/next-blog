import { Card } from "@/components/ui/card";

import ArticleDatatable, {
  type Item,
} from "@/components/datatable-article-graph";
import db from "@/db";
import { articles, articlesToTags, tags } from "@/db/schema/articles";
import { user } from "@/db/schema/auth-schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ArticlesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // const articleData = await db
  //   .select({ ...getTableColumns(articles) })
  //   .from(articles)
  //   .leftJoin(user, eq(user.id, articles.authorId))
  //   .where(eq(articles.authorId, String(session?.user.id)));

  const articleData = await db
    .select({
      ...getTableColumns(articles),
      tags: sql<{ id: string; value: string; label: string }[]>`
        COALESCE(
          json_agg(
            json_build_object(
              'id', ${tags.id},
              'value', ${tags.value},
              'label', ${tags.label}
            )
          ) FILTER (WHERE ${tags.id} IS NOT NULL),
          '[]'::json
        )
      `,
    })
    .from(articles)
    .leftJoin(articlesToTags, eq(articles.id, articlesToTags.articleId))
    .leftJoin(tags, eq(articlesToTags.tagId, tags.id))
    .where(eq(articles.authorId, String(session?.user.id)))
    .groupBy(articles.id);

  const tagsData = await db.select().from(tags);

  return (
    <div className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-250 py-0">
          <ArticleDatatable data={articleData} tagsData={tagsData} />
        </Card>
      </div>
    </div>
  );
}
