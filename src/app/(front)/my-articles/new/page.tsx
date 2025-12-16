"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/editor-toolbar";
import { PublishDialog } from "@/components/publish-dialog";
import Link from "next/link";
import { X } from "lucide-react";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPublish, setShowPublish] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Simple Header for Editor */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              Draft in Inkwell
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost">Save Draft</Button>
            <Button onClick={() => setShowPublish(true)}>Publish</Button>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-12">
        {/* Title Input */}
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-4xl md:text-5xl font-bold mb-4 resize-none border-none outline-none bg-transparent placeholder:text-muted-foreground/40"
          rows={2}
          style={{ overflow: "hidden" }}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
          }}
        />

        {/* Editor Toolbar */}
        <EditorToolbar />

        {/* Content Editor */}
        <div className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full text-xl leading-relaxed resize-none border-none outline-none bg-transparent placeholder:text-muted-foreground/40 min-h-[500px]"
            style={{ overflow: "hidden" }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + "px";
            }}
          />
        </div>
      </main>

      {showPublish && <PublishDialog onClose={() => setShowPublish(false)} />}
    </div>
  );
}
