"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";
import {
  SimpleEditor,
  type SimpleEditorRef,
} from "@/components/tiptap-templates/simple/simple-editor";

import { useParams } from "next/navigation";
import { saveArticle } from "../../new/actions";

export default function WritePage({ content }) {
  console.log(content);
  const editorRef = useRef<SimpleEditorRef>(null);
  const params = useParams<{ id: string }>();

  async function handleSave() {
    const contentJSON = editorRef.current?.getJSON();
    await saveArticle({
      id: parseInt(params.id),
      content: JSON.stringify(contentJSON),
    });
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
            <Button variant="ghost" onClick={handleSave}>
              Save Draft
            </Button>
            <Button>Publish</Button>
          </div>
        </div>
      </header>

      <SimpleEditor ref={editorRef} initialContent={content} />
    </div>
  );
}
