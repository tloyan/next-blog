"use client";

import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

export function ArticleActions() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex items-center gap-6 mb-12 pb-6 border-b sticky top-16 bg-background/95 backdrop-blur -mx-4 px-4 py-4 z-40">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setLiked(!liked)}
        >
          <ThumbsUp className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm">248</span>
        </Button>

        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">32</span>
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setBookmarked(!bookmarked)}
        >
          <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
        </Button>

        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
