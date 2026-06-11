import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-br from-forest-50 via-background to-sage-50">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
