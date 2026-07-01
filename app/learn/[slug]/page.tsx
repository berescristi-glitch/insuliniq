import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { ArticleSources } from "@/components/content/ArticleSources";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

type Article = Database["public"]["Tables"]["articles"]["Row"];

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Strips the primary XSS vectors from CMS-sourced HTML.
 * Replace with sanitize-html once npm filesystem issues are resolved:
 *   npm install sanitize-html @types/sanitize-html
 */
function sanitizeCmsHtml(html: string): string {
  return (
    html
      // Remove script tags and their contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove dangerous embeds
      .replace(
        /<(iframe|embed|object|applet|link|meta|style|base|form)\b[^>]*>[\s\S]*?<\/\1>/gi,
        ""
      )
      .replace(
        /<(iframe|embed|object|applet|link|meta|style|base|form)\b[^>]*\/?>/gi,
        ""
      )
      // Remove all on* event attributes
      .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
      // Replace javascript: hrefs/srcs
      .replace(/(href|src|action)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"')
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) return { title: "Article Not Found | InsulinIQ" };

  return {
    title: `${data.title} | InsulinIQ`,
    description: data.excerpt ?? undefined,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const article = data as Article | null;
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="secondary" className="capitalize">
            {article.category}
          </Badge>
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg text-gray-500">{article.excerpt}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="font-medium text-gray-600">{article.author}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {article.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.reading_time_minutes} min read
            </span>
          )}
        </div>
      </header>

      <div
        className="prose prose-gray prose-headings:text-gray-900 prose-a:text-forest-700 max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(article.content) }}
      />

      <ArticleSources sources={article.sources} />
      <MedicalDisclaimer />
    </div>
  );
}
