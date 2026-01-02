import { Card } from "@/components/ui/card";
import ArticleDatatable from "@/components/datatable-article-graph";
import { getAllUserArticles, getTags } from "@/actions/articles/actions";

export default async function ArticlesPage() {
  const articles = await getAllUserArticles();
  const tags = await getTags();

  return (
    <div className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-250 py-0">
          <ArticleDatatable data={articles} tagsData={tags} />
        </Card>
      </div>
    </div>
  );
}
