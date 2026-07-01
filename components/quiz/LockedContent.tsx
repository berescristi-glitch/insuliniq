import { Lock } from "lucide-react";
import Link from "next/link";

interface Props {
  day: number;
  title: string;
  preview: string;
  href: string;
}

export function LockedContent({ day, title, preview, href }: Props) {
  return (
    <div className="relative rounded-xl border-2 border-dashed border-border bg-white overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {day}
          </span>
          <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        </div>
        {/* Blurred preview text */}
        <p
          className="text-sm text-muted-foreground leading-relaxed select-none"
          style={{ filter: "blur(4px)", userSelect: "none" }}
          aria-hidden
        >
          {preview}
        </p>
      </div>
      {/* Gradient overlay + unlock link */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent flex items-end justify-center pb-3">
        <Link
          href={href}
          className="text-xs font-semibold text-forest-700 underline underline-offset-2 hover:text-forest-800 transition-colors"
        >
          Unlock with Full Plan →
        </Link>
      </div>
    </div>
  );
}
