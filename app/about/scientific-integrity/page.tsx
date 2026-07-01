import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, BarChart2, ShieldCheck, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Scientific Integrity Standard | InsulinIQ",
  description:
    "How InsulinIQ sources, evaluates, and presents peer-reviewed metabolic health research — our evidence grading system, editorial process, and non-clinical boundary.",
};

const grades = [
  {
    grade: "Grade A",
    color: "bg-forest-100 text-forest-700 border-forest-200",
    dot: "bg-forest-500",
    description:
      "Supported by multiple randomised controlled trials or a robust systematic review. The science here is well-established.",
  },
  {
    grade: "Grade B",
    color: "bg-honey-100 text-honey-700 border-honey-200",
    dot: "bg-honey-500",
    description:
      "Supported by observational studies, smaller controlled trials, or consistent cohort data. Reasonable confidence; stronger confirmation is ongoing.",
  },
  {
    grade: "Grade C",
    color: "bg-clay-100 text-clay-700 border-clay-200",
    dot: "bg-clay-500",
    description:
      "Emerging or preliminary research: single small studies, animal models, or early mechanistic findings. Interesting and worth knowing, but not yet established.",
  },
];

const principles = [
  {
    icon: BookOpen,
    title: "Primary Source Reliance",
    body: "Every physiological claim, metabolic pathway explanation, and dietary correlation published on our platform is sourced directly from peer-reviewed scientific literature — randomised controlled trials (RCTs), systematic reviews, and meta-analyses. We do not rely on secondary lifestyle blogs or unverified anecdotes. We cite in-text (author name and year) so you can verify anything we write.",
  },
  {
    icon: BarChart2,
    title: "Evidence Grading Transparency",
    body: "Not all research is equal, and we think you deserve to know the difference. We use a three-tier grading system on all educational content so you always know how strong the research behind a claim actually is.",
  },
  {
    icon: ShieldCheck,
    title: "Non-Clinical Boundary",
    body: "InsulinIQ is not a medical service. We do not provide clinical assessments, interpret your personal lab results, or tell you what medication to take or avoid. The Metabolic Profile Quiz is an educational orientation tool, not a diagnostic instrument. Everything we publish is intended to help you understand metabolic health more clearly and to support more informed conversations with your own healthcare provider.",
  },
  {
    icon: RefreshCw,
    title: "Review & Update Process",
    body: "Before publication, each educational article goes through two checks: a factual accuracy pass against the cited sources, and a plain-language review to ensure a motivated non-specialist can read it and come away with an accurate understanding. When significant new evidence changes the picture on a topic we cover, we revise the content and note the update date.",
  },
];

export default function ScientificIntegrityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-20">

      {/* Header */}
      <div className="mb-12">
        <p className="text-forest-600 font-semibold uppercase tracking-widest text-xs mb-3">
          About InsulinIQ
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
          Scientific Integrity Standard
        </h1>
        <p className="mt-5 text-xl text-muted-foreground leading-relaxed max-w-2xl">
          We are an educational platform. That means the standards we hold our content
          to are not the standards of a wellness blog — they are the standards of
          responsible science communication.
        </p>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          This page explains exactly how we source, evaluate, and present the research
          behind everything you read here.
        </p>
      </div>

      {/* Four principles */}
      <div className="space-y-10 mb-14">
        {principles.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="flex gap-5">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                <Icon className="h-5 w-5 text-forest-600" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                {i + 1}. {title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence grading table */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">Evidence Grading Protocol</h2>
        <div className="space-y-4">
          {grades.map(({ grade, color, dot, description }) => (
            <div
              key={grade}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className={`mt-0.5 w-3 h-3 rounded-full flex-shrink-0 ${dot}`} />
              <div>
                <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-2 ${color}`}>
                  {grade}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          We include Grade C findings only when they illuminate an important mechanism —
          and we say plainly that the research is early. Grade A and B claims are the
          backbone of every educational guide we publish.
        </p>
      </div>

      {/* Why it matters */}
      <div className="rounded-2xl bg-forest-50 border border-forest-100 p-8 mb-14">
        <h2 className="text-xl font-bold text-foreground mb-3">Why This Matters to Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          The people who come to InsulinIQ are often dealing with conditions — insulin
          resistance, PCOS, NAFLD, prediabetes — that are under-explained and frequently
          misunderstood. They deserve accurate information, stated with appropriate
          confidence and honest about its limits. Getting the science right is not a
          differentiator for us. It is the minimum standard.
        </p>
      </div>

      {/* Global disclaimer */}
      <div className="rounded-2xl border border-border bg-secondary/40 p-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          <strong className="text-foreground/70">Non-Clinical Boundary Statement:</strong>{" "}
          InsulinIQ is strictly an educational resource. We do not provide medical
          diagnoses, treatment paths, or personalised medical nutrition therapy. Our
          content is designed to inform lifestyle discussions between users and their
          primary healthcare providers. Nothing on this platform constitutes medical
          advice, diagnosis, or treatment. Always consult a qualified healthcare
          professional for personal medical guidance.
        </p>
      </div>

      {/* Footer nav */}
      <p className="mt-10 text-sm text-muted-foreground text-center">
        Questions about our editorial process?{" "}
        <a href="mailto:editorial@insuliniq.com" className="text-forest-600 hover:underline font-medium">
          editorial@insuliniq.com
        </a>
        {" "}·{" "}
        <Link href="/about/sources" className="text-forest-600 hover:underline font-medium">
          View all research sources →
        </Link>
        {" "}·{" "}
        <Link href="/learn" className="text-forest-600 hover:underline font-medium">
          Browse articles →
        </Link>
      </p>

    </div>
  );
}
