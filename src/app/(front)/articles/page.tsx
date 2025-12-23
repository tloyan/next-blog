import { ArticleCard } from "@/components/article-card";
import db from "@/db";
import { articles, articlesToTags, tags } from "@/db/schema/articles";
import { user } from "@/db/schema/auth-schema";
import { eq, getTableColumns, sql } from "drizzle-orm";

export default async function HomePage() {
  const data = await db.query.articles.findMany({
    with: {
      tags: { with: { tag: true } },
      author: true,
    },
    where: (articles, { eq }) => eq(articles.published, true),
  });

  const cleanedData = data.map((d) => {
    return {
      ...d,
      tags: [
        ...d.tags.map((tag) => {
          return tag.tag;
        }),
      ],
    };
  });


  return (
    <div className="min-h-screen">
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr] gap-12 max-w-2xl mx-auto">
          <div className="space-y-0">
            {cleanedData.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
