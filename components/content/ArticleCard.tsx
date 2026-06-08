import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Database } from "@/types/database";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface ArticleCardProps {
  article: Pick<
    Article,
    | "slug"
    | "title"
    | "excerpt"
    | "category"
    | "tags"
    | "featured_image"
    | "reading_time_minutes"
    | "author"
    | "created_at"
  >;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/learn/${article.slug}`} className="group block">
      <article className="rounded-xl overflow-hidden border bg-white hover:shadow-md transition-shadow">
        {article.featured_image && (
          <div className="relative h-48 w-full bg-gray-100">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {article.category}
            </Badge>
            {article.reading_time_minutes && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {article.reading_time_minutes} min read
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-3">
              {article.excerpt}
            </p>
          )}
          <p className="mt-3 text-xs text-gray-400">{article.author}</p>
        </div>
      </article>
    </Link>
  );
}
