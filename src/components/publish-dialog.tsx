"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface PublishDialogProps {
  onClose: () => void;
}

export function PublishDialog({ onClose }: PublishDialogProps) {
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Story Preview</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview Image */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Preview Image
            </label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <p className="text-sm text-muted-foreground">
                Click to upload an image
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1200 x 630 pixels
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-sm font-medium mb-2 block">Excerpt</label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a short description of your story..."
              className="resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will appear in previews of your story
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags (comma separated)..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add up to 5 tags to help readers find your story
            </p>
          </div>

          {/* Publishing Options */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-3">Publishing Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-input"
                  defaultChecked
                />
                <span className="text-sm">Allow responses</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-input"
                />
                <span className="text-sm">
                  Email subscribers about this story
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>Publish Now</Button>
        </div>
      </div>
    </div>
  );
}
