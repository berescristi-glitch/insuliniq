"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">IQ</span>
            </div>
            <span className="text-xl font-extrabold text-forest-800 tracking-tight">
              InsulinIQ
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {email && (
              <span className="hidden sm:block text-sm text-muted-foreground">
                {email}
              </span>
            )}
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
