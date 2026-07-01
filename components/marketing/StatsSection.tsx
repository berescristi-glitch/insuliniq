"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
}

const stats: Stat[] = [
  {
    prefix: "1 in ",
    value: 3,
    suffix: "",
    label: "adults has insulin resistance",
    description: "CDC & IDF Diabetes Atlas estimates",
    color: "text-forest-400",
  },
  {
    prefix: "",
    value: 80,
    suffix: "%+",
    label: "of people with prediabetes are unaware",
    description: "CDC National Diabetes Statistics, 2023",
    color: "text-honey-400",
  },
  {
    prefix: "",
    value: 541,
    suffix: "M+",
    label: "adults estimated to have prediabetes globally",
    description: "IDF Diabetes Atlas, 2023",
    color: "text-clay-300",
  },
];

function StatItem({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1800;
        const startTime = performance.now();

        function animate(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * stat.value));
          if (progress < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div ref={ref} className="text-center px-4">
      <div
        className={`text-6xl md:text-7xl lg:text-8xl font-black tabular-nums leading-none ${stat.color}`}
      >
        {stat.prefix}
        {count}
        {stat.suffix}
      </div>
      <div className="mt-4 text-white text-lg font-semibold">{stat.label}</div>
      <div className="mt-1.5 text-white/50 text-sm">{stat.description}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-forest-900 py-20 md:py-28 relative overflow-hidden">
      {/* decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-forest-600/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-forest-700/20 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-forest-400 font-semibold uppercase tracking-widest text-sm mb-3">
            The global reality
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Insulin resistance is a{" "}
            <br className="hidden sm:block" />
            <span className="text-honey-400">silent epidemic</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/30 text-xs max-w-xl mx-auto">
            Sources: IDF Diabetes Atlas 2023 (prediabetes prevalence) · CDC National Diabetes Statistics Report 2023
            (prediabetes awareness) · WHO Global Report on Diabetes (metabolic health burden)
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-forest-600/50 to-transparent"
      />
    </section>
  );
}
