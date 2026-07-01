// Server Component — no "use client" directive.
// Renders a FAQPage JSON-LD <script> tag for Google featured-snippet extraction.
// Data is always hardcoded at the call site (MDX pages), never user-supplied,
// so dangerouslySetInnerHTML is safe here.

interface FAQSchemaItem {
  question: string;
  answer: string;
}

interface SchemaFAQProps {
  items: FAQSchemaItem[];
}

export function SchemaFAQ({ items }: SchemaFAQProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify produces valid JSON — no HTML-unsafe characters in
      // the hardcoded strings, and Next.js serialises this into the <head>
      // correctly for both SSR and streaming.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
