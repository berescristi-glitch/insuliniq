import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

export function FAQItem({ question, children }: FAQItemProps) {
  return (
    <details className="group mb-3 overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-sm">
      <summary className="flex cursor-pointer select-none list-none items-start justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
        <span className="text-base font-semibold text-foreground leading-snug pr-2">
          {question}
        </span>
        <ChevronDown
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-border/50 px-6 pb-6 pt-4 text-[1.0625rem] leading-[1.8] text-foreground/80 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </details>
  );
}
