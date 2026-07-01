import type { ReactNode } from "react";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export const metadata = {
  title: "Settings | InsulinIQ",
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <SiteFooter />
    </>
  );
}
