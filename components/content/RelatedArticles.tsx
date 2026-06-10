import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COLOR_MAP = {
  forest: {
    badge: "bg-forest-50 text-forest-700 border-forest-200",
    arrow: "text-forest-600",
    border: "hover:border-forest-200",
  },
  sage: {
    badge: "bg-sage-50 text-sage-700 border-sage-200",
    arrow: "text-sage-600",
    border: "hover:border-sage-200",
  },
  clay: {
    badge: "bg-clay-50 text-clay-700 border-clay-200",
    arrow: "text-clay-600",
    border: "hover:border-clay-200",
  },
  honey: {
    badge: "bg-honey-50 text-honey-700 border-honey-200",
    arrow: "text-honey-600",
    border: "hover:border-honey-200",
  },
};

export interface RelatedArticle {
  href: string;
  title: string;
  category: string;
  color: keyof typeof COLOR_MAP;
}

export function RelatedArticles({
  articles,
  heading = "Continue Learning",
}: {
  articles: RelatedArticle[];
  heading?: string;
}) {
  if (!articles.length) return null;
  return (
    <section className="mt-12 border-t border-border pt-10 not-prose">
      <h2 className="mb-5 text-lg font-bold text-foreground">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => {
          const c = COLOR_MAP[a.color];
          return (
            <Link
              key={a.href}
              href={a.href}
              className={`group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm ${c.border}`}
            >
              <span
                className={`mb-3 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.badge}`}
              >
                {a.category}
              </span>
              <p className="flex-1 text-sm font-semibold leading-snug text-foreground group-hover:text-foreground/80">
                {a.title}
              </p>
              <div
                className={`mt-3 flex items-center gap-1 text-xs font-medium ${c.arrow}`}
              >
                Read article
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
