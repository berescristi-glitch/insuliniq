import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export const metadata: Metadata = {
  title: "Learn — Insulin Resistance & Metabolic Health | InsulinIQ",
  description:
    "Evidence-based articles on insulin resistance, PCOS, prediabetes, NAFLD, and metabolic syndrome.",
};

const MDX_ARTICLES = [
  {
    href: "/learn/what-is-insulin-resistance",
    title: "What Is Insulin Resistance? A Plain-English Guide",
    excerpt:
      "A clear, science-backed explanation of how insulin resistance develops, how it's measured, and what the evidence says actually helps — for anyone without a medical background.",
    category: "Insulin Resistance",
    readingTime: 11,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    href: "/pcos",
    title: "PCOS and Insulin Resistance: Understanding the Connection",
    excerpt:
      "Why insulin resistance drives so many PCOS symptoms — acne, irregular cycles, hair loss — and what interventions the research supports. Written for women who want real answers.",
    category: "PCOS",
    readingTime: 14,
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    href: "/nafld",
    title: "Fatty Liver Disease and Insulin Resistance: What the Research Shows",
    excerpt:
      "How insulin resistance causes fat to build up in the liver, why the name changed from NAFLD to MASLD, and what diet and exercise research shows about improving liver health.",
    category: "NAFLD / MASLD",
    readingTime: 12,
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    href: "/prediabetes",
    title: "What Is Prediabetes? Understanding Your Numbers and Your Options",
    excerpt:
      "What fasting glucose and HbA1c numbers actually mean, the landmark DPP trial that proved lifestyle intervention works, and questions worth bringing to your next appointment.",
    category: "Prediabetes",
    readingTime: 12,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: rawArticles } = await supabase
    .from("articles")
    .select(
      "slug, title, excerpt, category, tags, featured_image, reading_time_minutes, author, created_at"
    )
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const articles = rawArticles as Pick<
    ArticleRow,
    | "slug"
    | "title"
    | "excerpt"
    | "category"
    | "tags"
    | "featured_image"
    | "reading_time_minutes"
    | "author"
    | "created_at"
  >[] | null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
        <p className="mt-2 text-gray-500">
          Research-backed articles on insulin resistance and metabolic health.
        </p>
      </header>

      {/* Static MDX articles — always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
        {MDX_ARTICLES.map((article) => (
          <Link key={article.href} href={article.href} className="group block">
            <article className="h-full rounded-xl border bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={`text-xs ${article.badge}`}>
                  {article.category}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {article.readingTime} min read
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 flex-1 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-700">
                Read article
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* CMS articles from Supabase (when available) */}
      {articles && articles.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
