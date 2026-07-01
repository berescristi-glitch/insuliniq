"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Tailwind can't purge dynamic class fragments — use a complete-string lookup.
const ctaBg: Record<string, string> = {
  forest: "bg-forest-600 hover:bg-forest-700",
  sage: "bg-sage-600 hover:bg-sage-700",
  clay: "bg-clay-600 hover:bg-clay-700",
  honey: "bg-honey-600 hover:bg-honey-700",
};

interface Props {
  profileColor: "forest" | "sage" | "clay" | "honey";
  label: string;
}

export function StickyResultsCTA({ profileColor, label }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-border bg-white shadow-2xl">
      <div className="flex gap-2 p-3">
        <Link
          href="/pricing"
          className={`flex-1 rounded-xl py-3 text-center text-sm font-semibold text-white transition-colors ${ctaBg[profileColor]}`}
        >
          {label}
        </Link>
        <Link
          href="/pricing"
          className="rounded-xl border-2 border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Plans
        </Link>
      </div>
    </div>
  );
}
