import { Card } from "@/components/ui/card";

import ArticleDatatable, {
  type Item,
} from "@/components/datatable-article-graph";

const articleData: Item[] = [
  {
    id: "1",
    articleImage:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png",
    title: "article's title 1",
    content: "this is the content of my article",
  },
  {
    id: "2",
    articleImage:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png",
    title: "article's title 2",
    content: "this is the content of my article",
  },
  {
    id: "3",
    articleImage:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png",
    title: "article's title 3",
    content: "this is the content of my article",
  },
  {
    id: "4",
    title: "article's title 4",
    content: "this is the content of my article",
  },
  {
    id: "5",
    title: "article's title 5",
    content: "this is the content of my article",
  },
];

export default function ArticlesPage() {
  return (
    <div className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-250 py-0">
          <ArticleDatatable data={articleData} />
        </Card>
      </div>
    </div>
  );
}
