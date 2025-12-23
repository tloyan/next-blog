"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";
import {
  SimpleEditor,
  type SimpleEditorRef,
} from "@/components/tiptap-templates/simple/simple-editor";
import { saveArticle } from "./actions";

import content from "@/components/tiptap-templates/simple/data/content.json";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const editorRef = useRef<SimpleEditorRef>(null);
  const router = useRouter();

  async function handleSave() {
    const contentJSON = editorRef.current?.getJSON();
    const id = await saveArticle({
      content: JSON.stringify(contentJSON),
    });
    router.push(`/my-articles/${id}/edit`);
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link href="/my-articles">
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              Draft in Inkwell
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </header>

      <SimpleEditor ref={editorRef} initialContent={content} />
    </div>
  );
}
