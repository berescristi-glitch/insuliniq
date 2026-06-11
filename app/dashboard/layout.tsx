import type { ReactNode } from "react";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export const metadata = {
  title: "Dashboard | InsulinIQ",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <SiteFooter />
    </>
  );
}
