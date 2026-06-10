import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Database } from "@/types/database";

type Article = Database["public"]["Tables"]["articles"]["Row"];

export interface ArticleCardProps {
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

const ACCENT: Record<string, string> = {
  pcos:         "#508368",  // sage-500
  prediabetes:  "#c2502b",  // clay-500
  nafld:        "#bf7c0f",  // honey-500
  masld:        "#bf7c0f",
  fatty:        "#bf7c0f",
};

function accentColor(category = ""): string {
  const key = category.toLowerCase();
  for (const [k, v] of Object.entries(ACCENT)) {
    if (key.includes(k)) return v;
  }
  return "#277a4a"; // forest-500 (default / insulin resistance)
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/learn/${article.slug}`} className="group block h-full">
      <article
        className="h-full rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow flex flex-col border-t-[6px]"
        style={{ borderTopColor: accentColor(article.category) }}
      >
        {article.featured_image && (
          <div className="relative h-44 w-full bg-muted">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {article.category}
            </Badge>
            {article.reading_time_minutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {article.reading_time_minutes} min read
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-forest-700 transition-colors line-clamp-2 flex-1">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {article.excerpt}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">{article.author}</p>
        </div>
      </article>
    </Link>
  );
}
