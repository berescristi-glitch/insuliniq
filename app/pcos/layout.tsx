import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function PCOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-sage-50/70 via-background to-background">
        <main className="pb-20">{children}</main>
      </div>
      <SiteFooter />
    </>
  );
}
