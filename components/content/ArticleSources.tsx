import type { Json } from "@/types/database";

interface Source {
  title: string;
  url: string;
  authors?: string;
  year?: number;
}

interface ArticleSourcesProps {
  sources: Json;
}

export function ArticleSources({ sources }: ArticleSourcesProps) {
  if (!sources || !Array.isArray(sources) || sources.length === 0) return null;

  const typedSources = sources as unknown as Source[];

  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Sources</h2>
      <ol className="list-decimal list-inside space-y-2">
        {typedSources.map((s, i) => (
          <li key={i} className="text-sm text-gray-600">
            {s.authors && <span>{s.authors}. </span>}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-700 underline hover:text-forest-900"
            >
              {s.title}
            </a>
            {s.year && <span> ({s.year})</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
