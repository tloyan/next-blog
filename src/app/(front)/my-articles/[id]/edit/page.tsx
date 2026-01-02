import WritePage from "./page-component";
import { getUserArticle } from "@/actions/articles/actions";
import { JSONContent } from "@tiptap/core";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const article = await getUserArticle(id);

  return <WritePage content={article.content as JSONContent} />;
}
