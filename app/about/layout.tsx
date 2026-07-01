import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-forest-50/40 via-background to-background">
        <main className="pb-20">{children}</main>
      </div>
      <SiteFooter />
    </>
  );
}
