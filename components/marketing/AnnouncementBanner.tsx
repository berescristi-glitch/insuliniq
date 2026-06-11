import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBanner() {
  return (
    <div className="w-full bg-forest-900 py-2.5 px-4 text-center text-sm">
      <Link
        href="/learn/metabolic-syndrome"
        className="inline-flex items-center gap-2 text-forest-200 hover:text-white transition-colors group"
      >
        <span className="bg-forest-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
          New
        </span>
        <span>Metabolic Syndrome hub is now live — 5 risk factors explained</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
