"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/actions/auth";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/pcos", label: "PCOS" },
  { href: "/prediabetes", label: "Prediabetes" },
  { href: "/nafld", label: "NAFLD" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get current session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  const userEmail = user?.email ?? "";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-forest-100/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 shadow-sm shadow-forest-900/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center shadow-sm group-hover:bg-forest-700 transition-colors">
              <span className="text-white font-black text-sm leading-none">IQ</span>
            </div>
            <span className="text-xl font-extrabold text-forest-800 tracking-tight">
              InsulinIQ
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-foreground/70 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forest-50 border border-forest-100">
                  <div className="h-6 w-6 rounded-full bg-forest-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{userInitial}</span>
                  </div>
                  <span className="text-sm font-medium text-forest-800 max-w-[140px] truncate">
                    {userEmail}
                  </span>
                </div>
                <form action={logoutAction}>
                  <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <LogOut size={14} />
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-forest-600 hover:bg-forest-700 text-white rounded-lg px-4 shadow-sm shadow-forest-600/20"
                  asChild
                >
                  <Link href="/register">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:bg-forest-50 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-md px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border mt-3 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-forest-50 border border-forest-100">
                  <UserCircle size={16} className="text-forest-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-forest-800 truncate">{userEmail}</span>
                </div>
                <form action={logoutAction}>
                  <Button variant="outline" size="sm" className="w-full gap-1.5" type="submit">
                    <LogOut size={14} />
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
                </Button>
                <Button
                  className="w-full bg-forest-600 hover:bg-forest-700 text-white rounded-lg"
                  asChild
                >
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
