"use client";

import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Link2,
  ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Plus,
} from "lucide-react";

export function EditorToolbar() {
  return (
    <div className="flex items-center gap-1 py-3 border-b border-t overflow-x-auto">
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Add">
        <Plus className="h-5 w-5" />
      </Button>

      <div className="w-px h-6 bg-border mx-2" />

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Heading">
        <Heading2 className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Bold">
        <Bold className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Italic">
        <Italic className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Underline">
        <Underline className="h-5 w-5" />
      </Button>

      <div className="w-px h-6 bg-border mx-2" />

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Link">
        <Link2 className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Image">
        <ImageIcon className="h-5 w-5" />
      </Button>

      <div className="w-px h-6 bg-border mx-2" />

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        title="Bullet List"
      >
        <List className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        title="Numbered List"
      >
        <ListOrdered className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Quote">
        <Quote className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Code">
        <Code className="h-5 w-5" />
      </Button>
    </div>
  );
}
