import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface Article {
  href: string;
  title: string;
  description: string;
  tag: string;
  readTime: string;
  tagBg: string;
  accentBg: string;
  photo: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    href: "/learn/what-is-insulin-resistance",
    title: "What Is Insulin Resistance — And Why Does It Matter?",
    description:
      "A clear, evidence-based explanation of how cells stop responding to insulin, why it happens, and the cascade of health effects it triggers across your body.",
    tag: "Core Science",
    readTime: "8 min read",
    tagBg: "bg-forest-100 text-forest-700",
    accentBg: "bg-forest-500",
    photo: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    href: "/pcos",
    title: "PCOS & Insulin Resistance: The Vicious Cycle",
    description:
      "How elevated insulin drives androgen production in the ovaries — and the dietary patterns that interrupt this loop.",
    tag: "PCOS",
    readTime: "12 min read",
    tagBg: "bg-sage-100 text-sage-700",
    accentBg: "bg-sage-500",
    photo: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=75",
  },
  {
    href: "/prediabetes",
    title: "Prediabetes & the DPP Trial: What the Evidence Actually Shows",
    description:
      "The landmark prevention trial that found structured lifestyle changes significantly reduced progression to type 2 diabetes — and what the study's findings mean for daily life.",
    tag: "Prediabetes",
    readTime: "10 min read",
    tagBg: "bg-clay-100 text-clay-700",
    accentBg: "bg-clay-500",
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=75",
  },
  {
    href: "/nafld",
    title: "NAFLD Renamed: What MASLD Means for Your Diagnosis",
    description:
      "The 2023 nomenclature change explained — and why the new name better reflects the metabolic origin of fatty liver disease.",
    tag: "NAFLD / MASLD",
    readTime: "7 min read",
    tagBg: "bg-honey-100 text-honey-700",
    accentBg: "bg-honey-500",
    photo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=75",
  },
];

export function FeaturedArticles() {
  const [featured, ...rest] = articles;

  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-forest-600 font-semibold uppercase tracking-widest text-sm mb-2">
              Featured reads
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
              Start here
            </h2>
          </div>
          <Link
            href="/learn"
            className="flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-700 transition-colors group"
          >
            View all articles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Featured article — large with photo header */}
          <Link href={featured.href} className="group lg:col-span-7">
            <div className="h-full overflow-hidden rounded-3xl bg-white border border-border transition-all duration-300 hover:shadow-xl hover:border-forest-200 hover:scale-[1.01] flex flex-col">

              {/* Photo header */}
              <div className="relative h-52 w-full overflow-hidden flex-shrink-0">
                <Image
                  src={featured.photo}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  alt=""
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${featured.tagBg}`}>
                    {featured.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-4">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {featured.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-forest-600 mt-6">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </div>
            </div>
          </Link>

          {/* 3 smaller cards with photo thumbnails */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {rest.map((article) => (
              <Link key={article.href} href={article.href} className="group">
                <div className="flex gap-4 items-start bg-white border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-forest-200 hover:scale-[1.01]">

                  {/* Square photo thumbnail */}
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                    <Image
                      src={article.photo}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      alt=""
                      aria-hidden
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-4 pr-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${article.tagBg}`}>
                        {article.tag}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2 text-sm">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 pr-4 self-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-forest-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
