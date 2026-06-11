"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Condition {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  overlay: string;
  tag: string;
  photo: string;
}

const mainCondition: Condition = {
  href: "/pcos",
  title: "PCOS",
  subtitle: "Polycystic Ovary Syndrome",
  description:
    "The most common hormonal disorder in women — deeply connected to insulin resistance. Understand the vicious cycle between androgens, insulin, and inflammation, and what science says about breaking it.",
  overlay: "from-sage-700/85 via-sage-800/80 to-sage-900/90",
  tag: "Hormones & Cycles",
  photo: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
};

const sideConditions: Condition[] = [
  {
    href: "/prediabetes",
    title: "Prediabetes",
    subtitle: "Blood Sugar Dysregulation",
    description:
      "Catch it before it progresses. The landmark DPP trial found that structured lifestyle changes significantly reduced progression to type 2 diabetes — learn what that evidence actually shows.",
    overlay: "from-clay-600/85 to-clay-800/90",
    tag: "Blood Sugar",
    photo: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/nafld",
    title: "NAFLD / MASLD",
    subtitle: "Fatty Liver Disease",
    description:
      "Renamed in 2023. 1 in 4 adults worldwide has it — and most don't know.",
    overlay: "from-honey-600/85 to-honey-800/90",
    tag: "Liver Health",
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/learn/what-is-insulin-resistance",
    title: "Insulin Resistance",
    subtitle: "The Root Cause",
    description:
      "The underlying driver connecting PCOS, prediabetes, and NAFLD.",
    overlay: "from-forest-700/85 to-forest-900/90",
    tag: "Core Science",
    photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
];

const bottomCards: Condition[] = [
  {
    href: "/learn/metabolic-syndrome",
    title: "Metabolic Syndrome",
    subtitle: "Five Risk Factors",
    description:
      "Waist circumference, blood pressure, glucose, triglycerides, HDL — how they connect.",
    overlay: "from-indigo-700/85 to-indigo-900/90",
    tag: "Risk Factors",
    photo: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=700&q=80",
  },
  {
    href: "/learn",
    title: "All Articles",
    subtitle: "Full Knowledge Base",
    description:
      "Browse research summaries, practical guides, and deep dives across all metabolic conditions.",
    overlay: "from-gray-700/85 to-gray-900/90",
    tag: "Library",
    photo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80",
  },
];

function BentoCard({
  condition,
  index,
  large = false,
}: {
  condition: Condition;
  index: number;
  large?: boolean;
}) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
    >
      <Link href={condition.href} className="group block h-full">
        <div
          className={`relative overflow-hidden rounded-3xl flex flex-col justify-between h-full transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.015] ${large ? "p-8 lg:p-10 min-h-[380px]" : "p-6 min-h-[200px]"}`}
        >
          {/* Background photo */}
          <Image
            src={condition.photo}
            fill
            sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            alt=""
            aria-hidden
          />

          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${condition.overlay}`} />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <span className="text-[11px] text-white/70 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 font-semibold border border-white/10">
                {condition.tag}
              </span>
            </div>
            <h3
              className={`font-extrabold text-white leading-tight ${large ? "text-3xl lg:text-4xl" : "text-xl"}`}
            >
              {condition.title}
            </h3>
            <p className="text-white/60 text-xs font-medium mt-1">
              {condition.subtitle}
            </p>
            <p
              className={`text-white/80 leading-relaxed mt-3 ${large ? "text-base" : "text-sm"}`}
            >
              {condition.description}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-white font-semibold text-sm mt-6">
            Explore
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-forest-600 font-semibold uppercase tracking-widest text-sm mb-3">
            Explore by condition
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
            Everything is connected
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Insulin resistance doesn&apos;t act alone. Explore how these
            conditions overlap — and what the research actually shows.
          </p>
        </div>

        {/* Top row: PCOS large + 3 side cards */}
        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <div className="lg:flex-[3]">
            <BentoCard condition={mainCondition} index={0} large />
          </div>
          <div className="lg:flex-[1.4] flex flex-col gap-5">
            {sideConditions.map((c, i) => (
              <BentoCard key={c.href} condition={c} index={i + 1} />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {bottomCards.map((c, i) => (
            <BentoCard key={c.href} condition={c} index={i + 4} />
          ))}
        </div>

      </div>
    </section>
  );
}
