"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const metrics = [
  { label: "Fasting Glucose", value: "92", unit: "mg/dL", pct: 66, color: "#72b487" },
  { label: "Insulin Sensitivity", value: "74", unit: "%", pct: 74, color: "#508368" },
  { label: "Metabolic Score", value: "76", unit: "pts", pct: 76, color: "#429464" },
];

function MetricBar({
  label, value, unit, pct, color, delay,
}: {
  label: string; value: string; unit: string; pct: number; color: string; delay: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-white/55 font-medium">{label}</span>
        <span className="text-xs font-bold text-white">
          {value} <span className="text-white/35 font-normal">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-background to-sage-50 min-h-[88vh] flex items-center py-20 md:py-28">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full bg-forest-100 opacity-25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-sage-100 opacity-35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full bg-forest-100 border border-forest-200 px-4 py-1.5 text-sm font-medium text-forest-700 mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500" />
              </span>
              Science-backed metabolic education
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-foreground leading-[1.05]">
              Finally understand
              <br />
              <span className="text-forest-600">insulin resistance</span>
            </h1>

            <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-lg">
              Clear, research-backed education on PCOS, prediabetes, NAFLD, and
              metabolic syndrome — made for real people, not doctors.
            </p>

            <ul className="mt-8 space-y-3.5">
              {[
                "Free personalized metabolic profile quiz",
                "Evidence-based — not influencer advice",
                "PCOS, NAFLD & prediabetes deep-dives",
              ].map((b) => (
                <li key={b} className="flex items-center gap-3 text-foreground/75">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-forest-500" />
                  <span className="text-base">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-forest-600 hover:bg-forest-700 text-white px-8 h-14 text-base rounded-xl shadow-lg shadow-forest-600/20 transition-all hover:shadow-forest-600/30 hover:-translate-y-0.5"
                asChild
              >
                <Link href="/quiz">
                  Take the Free Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 text-base rounded-xl border-2 hover:-translate-y-0.5 transition-transform"
                asChild
              >
                <Link href="/learn">Explore Articles</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No sign-up required · Educational content only · Not medical advice
            </p>
          </motion.div>

          {/* Right: Product screenshot mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[460px]">

              {/* Browser / app frame */}
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/8">

                {/* Browser chrome bar */}
                <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-full h-6 mx-3 flex items-center px-3">
                    <span className="text-gray-400 text-[11px] font-mono truncate">
                      insuliniq.com/profile
                    </span>
                  </div>
                </div>

                {/* Photo area — lifestyle shot */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
                    fill
                    priority
                    sizes="460px"
                    alt="Colorful healthy food — visual header for the InsulinIQ metabolic profile"
                    className="object-cover"
                  />
                  {/* Gradient fade to dark card below */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-forest-900/95" />

                  {/* Live indicator pill over photo */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-400" />
                      </span>
                      <span className="text-white text-[11px] font-medium">
                        Metabolic Profile Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics panel — dark app content */}
                <div className="bg-forest-900 px-6 pb-6 pt-5">
                  {/* Score header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-white/45 text-[11px] font-semibold uppercase tracking-widest">
                        Your Health Score
                      </p>
                      <p className="text-white text-2xl font-black mt-0.5">
                        76{" "}
                        <span className="text-white/30 text-sm font-normal">/ 100</span>
                      </p>
                    </div>

                    {/* Circular progress */}
                    <div className="relative w-[58px] h-[58px]">
                      <svg viewBox="0 0 58 58" className="w-full h-full -rotate-90">
                        <circle cx="29" cy="29" r="23" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                        <motion.circle
                          cx="29" cy="29" r="23" fill="none" stroke="#72b487" strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 23}`}
                          initial={{ strokeDashoffset: `${2 * Math.PI * 23}` }}
                          animate={{ strokeDashoffset: `${2 * Math.PI * 23 * (1 - 0.76)}` }}
                          transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-base">76</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric bars */}
                  <div className="space-y-4">
                    {metrics.map((m, i) => (
                      <MetricBar key={m.label} {...m} delay={0.6 + i * 0.15} />
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {["#f59e0b", "#10b981", "#6366f1", "#ec4899"].map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-forest-900" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-white/35 text-xs">Sample profile view</span>
                  </div>
                </div>
              </div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
                className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-3 shadow-xl border border-border"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-clay-100 flex items-center justify-center text-xl">📊</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-tight">Metabolic Profile</p>
                    <p className="text-[11px] text-muted-foreground">3 focus areas highlighted</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
                className="absolute -top-5 -right-5 bg-white rounded-2xl p-3 shadow-xl border border-border"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center text-xl">✅</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-tight">Evidence-based</p>
                    <p className="text-[11px] text-muted-foreground">Peer-reviewed sources</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
