import type { ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export const metadata = {
  title: "Sign In | InsulinIQ",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <SiteFooter />
    </>
  );
}
