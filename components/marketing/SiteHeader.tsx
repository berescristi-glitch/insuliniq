"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/pcos", label: "PCOS" },
  { href: "/prediabetes", label: "Prediabetes" },
  { href: "/nafld", label: "NAFLD" },
  { href: "/recipes", label: "Recipes" },
  { href: "/quiz", label: "Free Quiz" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-700">InsulinIQ</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/quiz">Get Started Free</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-700 hover:text-emerald-700"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr />
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/quiz">Get Started Free</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
