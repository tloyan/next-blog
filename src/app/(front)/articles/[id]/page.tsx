import db from "@/db";
import { articles } from "@/db/schema/articles";
import { user } from "@/db/schema/auth-schema";
import { auth } from "@/lib/auth";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import { generateHTML } from "@tiptap/html";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";
import { ArticleActions } from "@/components/article-actions";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  // const data = await db
  //   .select()
  //   .from(articles)
  //   .leftJoin(user, eq(user.id, articles.authorId))
  //   .where(and(eq(articles.published, true), eq(articles.id, id)));

  const data = await db.query.articles.findFirst({
    where: (article, { eq, and }) =>
      and(eq(article.published, true), eq(article.id, id)),
    with: {
      author: true,
    },
  });

  const html = generateHTML(data?.content, [
    StarterKit.configure({
      horizontalRule: false,
      link: {
        openOnClick: false,
        enableClickSelection: true,
      },
    }),
    HorizontalRule,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
  ]);

  // console.log(data);

  return (
    <div className="simple-editor-wrapper mt-20">
      <div className="simple-editor-content">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-balance">
          The Evolution of Modern Web Development: From Static Pages to Dynamic
          Experiences
        </h1>

        <div className="flex items-center justify-between mb-8 pb-8 border-b">
          <div className="flex items-center gap-4">
            <Link href={`/profile/${data?.author?.name}`}>
              <Avatar className="w-12 h-12">
                <AvatarImage src={data?.author?.image || "/placeholder.svg"} />
                <AvatarFallback>{data?.author?.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="font-medium">{data?.author?.name}</div>
              {/* <div className="text-sm text-muted-foreground">
                Published on Dec 5, 2024 · 8 min read
              </div> */}
            </div>
          </div>
        </div>

        <ArticleActions />

        <img
          src={data?.image}
          alt="Image presentation"
          className="w-full h-auto rounded-lg mb-12"
        />
        <div
          className="tiptap ProseMirror"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
