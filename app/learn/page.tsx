import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/content/ArticleCard";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export const metadata: Metadata = {
  title: "Learn — Insulin Resistance & Metabolic Health | InsulinIQ",
  description:
    "Evidence-based articles on insulin resistance, PCOS, prediabetes, NAFLD, and metabolic syndrome.",
};

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

  const articles = rawArticles as Pick<ArticleRow, "slug" | "title" | "excerpt" | "category" | "tags" | "featured_image" | "reading_time_minutes" | "author" | "created_at">[] | null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
        <p className="mt-2 text-gray-500">
          Research-backed articles on insulin resistance and metabolic health.
        </p>
      </header>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-20">
          Articles coming soon. Check back shortly.
        </p>
      )}
    </div>
  );
}
