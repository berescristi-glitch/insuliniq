import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ── Headings ──────────────────────────────────────────────────
    h1: ({ children }) => (
      <h1 className="text-4xl sm:text-[2.75rem] font-extrabold tracking-tight text-foreground leading-tight mt-2 mb-6">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <div className="mt-16 mb-7 scroll-mt-24">
        <div className="flex items-start gap-3.5">
          <span
            className="mt-1.5 block h-7 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-forest-400 to-sage-400"
            aria-hidden
          />
          <h2 className="text-[1.625rem] font-bold text-foreground leading-tight">
            {children}
          </h2>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
      </div>
    ),

    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 flex items-center gap-2.5 text-lg font-semibold text-forest-700">
        <span className="block h-4 w-0.5 rounded-full bg-forest-300 flex-shrink-0" aria-hidden />
        {children}
      </h3>
    ),

    // ── Body text ─────────────────────────────────────────────────
    p: ({ children }) => (
      <p className="my-5 text-[1.0625rem] leading-[1.85] text-foreground/80">
        {children}
      </p>
    ),

    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),

    em: ({ children }) => (
      <em className="italic text-foreground/70">{children}</em>
    ),

    // ── Lists ─────────────────────────────────────────────────────
    ul: ({ children }) => (
      <ul className="my-5 space-y-3">{children}</ul>
    ),

    ol: ({ children }) => (
      <ol className="my-5 space-y-3">{children}</ol>
    ),

    li: ({ children }) => (
      <li className="flex items-start gap-3 text-[1.0625rem] leading-[1.8] text-foreground/80">
        <span
          className="mt-[0.6rem] h-2 w-2 flex-shrink-0 rounded-full bg-forest-300"
          aria-hidden
        />
        <span className="flex-1">{children}</span>
      </li>
    ),

    // ── Blockquote ────────────────────────────────────────────────
    blockquote: ({ children }) => (
      <blockquote className="relative my-10 overflow-hidden rounded-2xl bg-forest-50 px-8 py-6 text-foreground/85 italic border border-forest-100">
        <span
          className="absolute -top-2 left-4 font-serif text-7xl leading-none text-forest-200 select-none"
          aria-hidden
        >
          "
        </span>
        <div className="relative">{children}</div>
      </blockquote>
    ),

    // ── Horizontal rule ───────────────────────────────────────────
    hr: () => (
      <div className="my-14 flex items-center gap-4" aria-hidden>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-border/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-border/30" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    ),

    // ── Table ─────────────────────────────────────────────────────
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto rounded-2xl border border-border shadow-sm">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className="border-b border-border bg-secondary/60">{children}</thead>
    ),

    th: ({ children }) => (
      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </th>
    ),

    tr: ({ children }) => (
      <tr className="border-b border-border/40 transition-colors last:border-0 even:bg-muted/20 hover:bg-muted/30">
        {children}
      </tr>
    ),

    td: ({ children }) => (
      <td className="px-5 py-3.5 text-foreground/80">{children}</td>
    ),

    // ── Links ─────────────────────────────────────────────────────
    a: ({ children, href }) => (
      <a
        href={href}
        className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 transition-colors hover:text-forest-800 hover:decoration-forest-400"
      >
        {children}
      </a>
    ),

    // ── Code ──────────────────────────────────────────────────────
    code: ({ children }) => (
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground/90">
        {children}
      </code>
    ),

    // Pass through all custom components (StatGrid, KeyInsight, etc.)
    ...components,
  };
}
