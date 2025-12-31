import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, MoreHorizontal } from "lucide-react";

export interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  // date: string;
  // readTime: string;
  image: string;
  tags: { id: string; label: string; value: string }[];
}

export function ArticleCard({
  id,
  title,
  excerpt,
  author,
  // date,
  // readTime,
  image,
  tags,
}: ArticleCardProps) {
  return (
    <article className="py-6 border-b last:border-0">
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Link href={`/profile/${author.name}`}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <Link
              href={`/profile/${author.name}`}
              className="text-sm font-medium hover:underline"
            >
              {author.name}
            </Link>
          </div>

          <Link href={`/articles/${id}`} className="group">
            <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:underline leading-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-base mb-4 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {/* <span>{date}</span>
              <span>·</span>
              <span>{readTime} read</span> */}

              <>
                {/* <span>·</span> */}

                {tags.length > 0 &&
                  tags.map(({ id, label }) => (
                    <Link
                      key={id}
                      href={`/tag/${id}`}
                      className="px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                    >
                      {label}
                    </Link>
                  ))}
              </>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {image && (
          <Link href={`/articles/${id}`} className="hidden sm:block">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-32 h-32 object-cover rounded"
            />
          </Link>
        )}
      </div>
    </article>
  );
}
