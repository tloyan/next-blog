import { ArticleCard } from "@/components/article-card";
import { getAllPublicArticleWithTagsDao } from "@/db/repository/article-repository";

export default async function HomePage() {
  const articles = await getAllPublicArticleWithTagsDao();

  return (
    <div className="min-h-screen">
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr] gap-12 max-w-2xl mx-auto">
          <div className="space-y-0">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
