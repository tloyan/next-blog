import { getAllPublicArticleWithTags } from "@/actions/articles/actions";
import { ArticleCard } from "@/components/article-card";

export default async function HomePage() {
  const articles = await getAllPublicArticleWithTags();

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
