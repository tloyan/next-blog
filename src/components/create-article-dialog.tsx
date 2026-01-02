"use client";

import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Trash2 } from "lucide-react";
import type { Option } from "@/components/ui/multi-select";
import MultipleSelector from "@/components/ui/multi-select";
import { createOrUpdateArticle } from "@/actions/articles/actions";
import { useRouter } from "next/navigation";
import { ArticleModel, TagModel } from "@/db/schema/articles";

interface CreateDialogProps {
  onClose: () => void;
  availableTags: TagModel[];
  defaultValues?: (ArticleModel & { tags: TagModel[] }) | null;
}

export function CreateDialog({
  onClose,
  availableTags,
  defaultValues,
}: CreateDialogProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [excerpt, setExcerpt] = useState(defaultValues?.excerpt ?? "");
  const [tags, setTags] = useState<Option[]>(
    defaultValues?.tags
      ?.filter((tag): tag is { id: string; label: string; value: string } =>
        tag.label !== null && tag.value !== null
      )
      .map(tag => ({ id: tag.id, value: tag.value, label: tag.label })) ?? []
  );
  const [imageBase64, setImageBase64] = useState(defaultValues?.image ?? undefined);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
    }
  }

  function handleRemoveImage() {
    setImageBase64(undefined);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await createOrUpdateArticle({
          id: defaultValues?.id,
          title: title.trim(),
          excerpt: excerpt.trim(),
          tagsId: tags.map((t) => t.id as string),
          image: imageBase64,
        });

        if (!result) throw new Error("Uncaught Exception");

        if (!defaultValues?.id) router.push(`/my-articles/${result.id}/edit`);
        onClose();
      } catch (error) {
        // toast.error(error instanceof Error ? error.message : "Erreur");
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <form
        className="bg-background border rounded-lg shadow-lg w-full max-w-2xl"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Story Preview</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Write an appealing title"
            />
          </div>

          {/* Preview Image */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Preview Image
            </label>

            {/* ✅ Si image uploadée, afficher la preview */}
            {imageBase64 ? (
              <div className="relative border rounded-lg overflow-hidden">
                <img
                  src={imageBase64}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block"
                htmlFor="image-upload"
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {isUploading ? "Chargement..." : "Click to upload an image"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1200 x 630 pixels (max 5MB)
                </p>
              </label>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-sm font-medium mb-2 block">Excerpt</label>
            <Textarea
              name="excerpt"
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
            <MultipleSelector
              commandProps={{
                label: "Select categories",
              }}
              value={tags}
              onChange={setTags}
              defaultOptions={availableTags
                .filter((tag): tag is { id: string; label: string; value: string } =>
                  tag.label !== null && tag.value !== null
                )
                .map(tag => ({ id: tag.id, value: tag.value, label: tag.label }))}
              placeholder="Select categories"
              hidePlaceholderWhenSelected
              emptyIndicator={
                <p className="text-center text-sm">No results found</p>
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {defaultValues?.id ? "Update" : "Create Draft"}
          </Button>
        </div>
      </form>
    </div>
  );
}
