// ── InsulinIQ — Profile-Aware Nurture Email Framework ────────────────────────
//
// This file defines the STRUCTURE and CONTENT BRIEF for the 21-day educational
// email funnel, segmented by metabolic profile.
//
// What this file IS:
//   • A content brief and evidence registry for all 21 email slots per profile
//   • The single source of truth for subject lines, educational angles, CTAs
//   • The safety segmentation rules for sensitive subscriber groups
//
// What this file is NOT:
//   • The actual HTML email templates (those live in lib/resend/emails.ts)
//   • The email-sending logic (that lives in app/api/cron/nurture/route.ts)
//
// Sprint 4 TODO: Update the cron to read subscriber.metabolic_profile and select
// a profile-specific template from this framework instead of the generic sequence.
//
// COMPLIANCE RULES (enforced in all email copy based on this framework):
//   • Never use: cure, reverse, treat, heal, diagnose, guaranteed weight loss,
//     fix hormones, eliminate insulin resistance, eliminate cravings
//   • Always use: may support, educational, evidence-informed, not medical advice,
//     not a diagnosis, discuss with your healthcare provider
//   • Every email must include an unsubscribe link
//   • Every email must include the educational disclaimer in the footer
//   • Emails on Days 7, 14, 21 contain commercial CTAs — all others are purely educational
//
// ─────────────────────────────────────────────────────────────────────────────

export type NurtureProfileKey =
  | "pcos"
  | "nafld"
  | "prediabetes"
  | "insulin_resistance"
  | "metabolic_syndrome"
  | "general_wellness";

// Evidence level following CLAUDE.md §6 standards
export type EvidenceLevel = "strong" | "moderate" | "emerging" | "SOURCE_REQUIRED_BEFORE_PUBLICATION";

export interface EvidenceNote {
  claim: string;
  source: string;           // citation or "SOURCE_REQUIRED_BEFORE_PUBLICATION"
  level: EvidenceLevel;
}

export interface NurtureDay {
  day: number;
  subject: string;
  topic: string;
  educationalAngle: string;
  ctaText: string;
  ctaHref: string;
  commercial: boolean;       // true = contains paid-plan CTA; max 3 in 21 days (7, 14, 21)
  evidenceNotes: EvidenceNote[];
  safetySegmentation?: {    // override copy for flagged subscribers
    hasSafetyFlags: string; // what to change if has_safety_flags = true
  };
}

export interface NurtureProfileDefinition {
  profileKey: NurtureProfileKey;
  profileLabel: string;
  emailIntro: string;        // 1-sentence personalisation opener for Day 0
  primaryConditionContext: string; // used in subject lines / preheader
  days: NurtureDay[];
}

// ── Safety segmentation rules ─────────────────────────────────────────────────
// Applies to ALL profiles when has_safety_flags = true.
// Sprint 4: implement as conditional blocks inside HTML templates.

export const SAFETY_EMAIL_RULES = {
  // Do NOT include:
  avoid: [
    "Specific calorie targets or deficit recommendations",
    "Suggestions to reduce carbohydrates without medical supervision",
    "Weight loss predictions or timelines",
    "Fasting or extended meal-gap recommendations",
    "High-intensity exercise recommendations",
    "Supplement dosage recommendations",
    "Language implying certain foods 'must' be eliminated",
    "Any comparison of body weight or BMI to health status",
  ],
  // Always include:
  require: [
    "Stronger healthcare provider consultation language before any meal change",
    "Acknowledgement that individual medical conditions require individualised advice",
    "Reference to CLAUDE.md §16 safety notice if appropriate to the day's topic",
  ],
  // Flag-specific notes:
  flagSpecific: {
    type1_diabetes: "Avoid all carb-reduction without supervision language; always mention diabetes care team",
    takes_insulin: "Same as type1_diabetes; mention hypoglycaemia risk explicitly",
    hypoglycemia_risk_medication: "Note medication-diet interactions; recommend pharmacist consultation",
    pregnant: "Do not include weight management content; note caloric needs increase in pregnancy",
    breastfeeding: "Do not include caloric restriction; note breastfeeding nutritional demands",
    advanced_liver_disease: "Protein advice must note that cirrhosis has different protein requirements",
    kidney_disease: "Do not recommend high protein intake without renal dietitian involvement",
    eating_disorder_history: "Remove all calorie, portion, and restriction language; focus on food quality only",
    under_18: "Add parental guidance note; all advice should be discussed with paediatric HCP",
  },
} as const;

// ── 21-day generic skeleton ───────────────────────────────────────────────────
// Day numbers and topics are universal.
// Each profile below overrides subject + educationalAngle for its context.

export const GENERIC_DAY_TOPICS: Record<number, string> = {
  0:  "Quiz result recap",
  1:  "Why this metabolic profile matters",
  2:  "Insulin basics — what it actually does",
  3:  "Protein-first breakfast framework",
  4:  "Meal sequencing — food order and glucose response",
  5:  "Fibre, satiety and gut health",
  6:  "Hidden sugars and ultra-processed foods",
  7:  "First weekly check-in + honest plan overview (commercial)",
  8:  "Lab values to discuss with your doctor",
  9:  "Practical recipe and meal example",
  10: "Evidence vs myth — two ideas to reconsider",
  11: "Post-meal movement — the most underrated lever",
  12: "Region-specific food swaps (US / UK / AU)",
  13: "Sleep, stress and metabolic habits",
  14: "What realistic progress looks like — weeks 1–8 (commercial)",
  15: "Paid plan explanation — what's inside and why it's structured this way",
  16: "Condition-specific deep dive",
  17: "Grocery planning and batch prep",
  18: "User reflection and self-assessment prompt",
  19: "Common mistakes and how to reframe them",
  20: "How to discuss metabolic health with your doctor",
  21: "Summary, next steps, and long-term path (commercial)",
};

// ── Universal evidence bank (reused across profiles) ─────────────────────────
// Sources already verified in lib/resend/emails.ts (14-day sequence).

const EVIDENCE: Record<string, EvidenceNote> = {
  meal_sequencing: {
    claim: "Eating vegetables and protein before carbohydrates at the same meal can reduce peak blood glucose by up to 37%",
    source: "Shukla et al. (2017) — Diabetes Care",
    level: "moderate",
  },
  post_meal_walking: {
    claim: "2–3 minutes of light walking after eating measurably reduces post-meal glucose peaks",
    source: "Buffey et al. (2022) — Sports Medicine",
    level: "moderate",
  },
  protein_second_meal_effect: {
    claim: "A protein-anchored breakfast reduces the glucose response to the next meal (second meal effect)",
    source: "Wolever et al. (1988) — American Journal of Clinical Nutrition",
    level: "moderate",
  },
  insulin_resistance_hyperinsulinemia: {
    claim: "Chronically elevated insulin is linked to increased visceral fat storage and disrupted hunger signalling",
    source: "Crofts et al. (2015) — Journal of Insulin Resistance",
    level: "moderate",
  },
  mediterranean_metabolic_syndrome: {
    claim: "Mediterranean dietary pattern significantly reduced cardiovascular risk in high-risk individuals",
    source: "Estruch et al. (2013) — New England Journal of Medicine (PREDIMED Trial)",
    level: "strong",
  },
  lifestyle_insulin_sensitivity: {
    claim: "Mediterranean-style diet improved insulin sensitivity markers in a randomised controlled trial",
    source: "Esposito et al. (2004) — JAMA",
    level: "strong",
  },
  homa_ir: {
    claim: "HOMA-IR (fasting glucose × fasting insulin / 22.5) is a validated surrogate marker of insulin resistance",
    source: "Matthews et al. (1985) — Diabetologia",
    level: "strong",
  },
  pcos_insulin_androgens: {
    claim: "Insulin resistance contributes to elevated androgens in PCOS via ovarian insulin receptor signalling",
    source: "Sam (2007) — Journal of Obesity",
    level: "moderate",
  },
  pcos_guidelines_2023: {
    claim: "Evidence-informed nutritional support for PCOS metabolic management per international guidelines",
    source: "Teede et al. (2023) — International Evidence-Based PCOS Guidelines",
    level: "strong",
  },
  nafld_weight_loss: {
    claim: "Weight loss of 7–10% of body weight significantly reduces liver fat in NAFLD",
    source: "Vilar-Gomez et al. (2015) — Clinical Gastroenterology and Hepatology",
    level: "strong",
  },
  nafld_ir_connection: {
    claim: "Fatty liver disease in metabolic context is driven by excess glucose/fructose conversion under insulin resistance",
    source: "Targher et al. (2010) — Nature Reviews Endocrinology",
    level: "moderate",
  },
  dpp_prediabetes: {
    claim: "Lifestyle intervention reduced progression from prediabetes to type 2 diabetes by 58%",
    source: "Knowler et al. (2002) — New England Journal of Medicine (Diabetes Prevention Program)",
    level: "strong",
  },
  sleep_insulin_sensitivity: {
    claim: "A single night of poor sleep reduces insulin sensitivity by approximately 25%",
    source: "Donga et al. (2010) — Journal of Clinical Endocrinology & Metabolism",
    level: "moderate",
  },
  muscle_glucose_disposal: {
    claim: "Resistance training improves insulin sensitivity independently of weight loss",
    source: "Strasser & Schobersberger (2011) — Journal of Obesity",
    level: "moderate",
  },
  fibre_gut_microbiome: {
    claim: "Dietary fibre diversity is the primary modifiable driver of gut microbiome composition",
    source: "SOURCE_REQUIRED_BEFORE_PUBLICATION",
    level: "SOURCE_REQUIRED_BEFORE_PUBLICATION",
  },
  eating_frequency_myth: {
    claim: "Frequent small meals do not provide a metabolic advantage over fewer larger meals in healthy adults",
    source: "Cameron et al. (2010) — review",
    level: "moderate",
  },
  meal_timing_circadian: {
    claim: "Consistent meal timing supports more predictable insulin secretion and better overnight metabolic recovery",
    source: "Pot et al. (2016) — SOURCE_REQUIRED_BEFORE_PUBLICATION — verify specific paper",
    level: "emerging",
  },
};

// ── PCOS Profile ─────────────────────────────────────────────────────────────

const PCOS_NURTURE: NurtureProfileDefinition = {
  profileKey: "pcos",
  profileLabel: "PCOS Metabolic Support",
  emailIntro: "Your quiz results suggest patterns associated with PCOS and metabolic health. Over the next 21 days, this series covers the insulin-androgen connection, evidence-informed meal structure, and practical food habits — all educational, not a clinical treatment plan.",
  primaryConditionContext: "PCOS metabolic education",
  days: [
    {
      day: 0,
      subject: "Your PCOS metabolic profile — and what comes next",
      topic: GENERIC_DAY_TOPICS[0],
      educationalAngle: "Recap of PCOS profile results. Explain what the educational profile means, emphasise it is not a diagnosis. Preview what the 21 days will cover. Frame it as education-first, action-second.",
      ctaText: "View your full quiz profile",
      ctaHref: "/quiz/results",
      commercial: false,
      evidenceNotes: [EVIDENCE.pcos_guidelines_2023],
      safetySegmentation: {
        hasSafetyFlags: "Add additional note: 'Your quiz answers included health conditions that may require additional care. Please share any dietary changes with your healthcare provider before starting.'",
      },
    },
    {
      day: 1,
      subject: "Why the insulin-androgen connection matters for PCOS",
      topic: GENERIC_DAY_TOPICS[1],
      educationalAngle: "Explain how insulin resistance can drive androgen overproduction in PCOS. Use 'may contribute' and 'research suggests' language. Do not claim to treat or reverse PCOS. Reference the biological mechanism without prescribing.",
      ctaText: "Read: PCOS and Insulin Resistance",
      ctaHref: "/pcos",
      commercial: false,
      evidenceNotes: [EVIDENCE.pcos_insulin_androgens, EVIDENCE.pcos_guidelines_2023],
    },
    {
      day: 2,
      subject: "What insulin actually does — and why it matters for PCOS",
      topic: GENERIC_DAY_TOPICS[2],
      educationalAngle: "Insulin basics (key-lock analogy). Explain hyperinsulinaemia and why elevated insulin specifically affects ovarian androgen production. Keep it accessible. Link to educational article.",
      ctaText: "Learn more: What is insulin resistance?",
      ctaHref: "/learn/what-is-insulin-resistance",
      commercial: false,
      evidenceNotes: [EVIDENCE.insulin_resistance_hyperinsulinemia, EVIDENCE.pcos_insulin_androgens],
    },
    {
      day: 3,
      subject: "A PCOS-supportive breakfast framework (evidence-based)",
      topic: GENERIC_DAY_TOPICS[3],
      educationalAngle: "Protein-first breakfast for PCOS metabolic support. Explain second meal effect. Give 3 practical examples adapted to US/UK/AU. Emphasise this is educational food structure, not a prescription.",
      ctaText: "Read more: Nutrition for Metabolic Health",
      ctaHref: "/learn/nutrition",
      commercial: false,
      evidenceNotes: [EVIDENCE.protein_second_meal_effect, EVIDENCE.pcos_guidelines_2023],
      safetySegmentation: {
        hasSafetyFlags: "Remove any specific calorie or portion targets. Keep examples general.",
      },
    },
    {
      day: 4,
      subject: "Food order and blood sugar — what the research shows for PCOS",
      topic: GENERIC_DAY_TOPICS[4],
      educationalAngle: "Macronutrient sequencing applied to PCOS. Explain how vegetables-first reduces insulin demand. Use exact Shukla et al. 37% finding. Frame as 'same food, different order' — no restriction needed.",
      ctaText: "Continue reading on InsulinIQ",
      ctaHref: "/pcos",
      commercial: false,
      evidenceNotes: [EVIDENCE.meal_sequencing],
    },
    {
      day: 5,
      subject: "Fibre, satiety and the PCOS hunger pattern",
      topic: GENERIC_DAY_TOPICS[5],
      educationalAngle: "Explain how fibre slows glucose absorption and may support more stable post-meal energy in PCOS. Distinguish soluble vs insoluble fibre practically. List 5 accessible fibre sources per market (US/UK/AU).",
      ctaText: "Read more: nutrition fundamentals",
      ctaHref: "/learn/nutrition",
      commercial: false,
      evidenceNotes: [EVIDENCE.fibre_gut_microbiome],
    },
    {
      day: 6,
      subject: "The hidden sugar audit — what matters most for PCOS",
      topic: GENERIC_DAY_TOPICS[6],
      educationalAngle: "Identify top 5 hidden sugar sources relevant to PCOS. Explain fructose-liver-androgen pathway briefly. Give one concrete swap per item. No restriction framing — just informed choice.",
      ctaText: "Read: what is insulin resistance?",
      ctaHref: "/learn/what-is-insulin-resistance",
      commercial: false,
      evidenceNotes: [EVIDENCE.nafld_ir_connection],
    },
    {
      day: 7,
      subject: "One week in — what InsulinIQ membership covers and who it's for",
      topic: GENERIC_DAY_TOPICS[7],
      educationalAngle: "Honest, non-pressured overview of what Core Membership includes. Frame as 'this is what's inside, see if it fits your learning style'. No urgency, no scarcity. Acknowledge that free content continues regardless.",
      ctaText: "See membership options",
      ctaHref: "/pricing?recommended=core&profile=pcos",
      commercial: true,
      evidenceNotes: [],
      safetySegmentation: {
        hasSafetyFlags: "Add: 'If your quiz indicated a medical condition, we recommend discussing any dietary plan with your healthcare team first.'",
      },
    },
    {
      day: 8,
      subject: "Lab values worth discussing with your doctor — a PCOS-focused guide",
      topic: GENERIC_DAY_TOPICS[8],
      educationalAngle: "Fasting insulin, HOMA-IR, testosterone/free androgen index, HbA1c, LH:FSH ratio context. Explain what each measures, what to ask for, and what ranges are commonly discussed. Never diagnose — empower to ask questions.",
      ctaText: "Learn about PCOS markers",
      ctaHref: "/pcos",
      commercial: false,
      evidenceNotes: [EVIDENCE.homa_ir, EVIDENCE.pcos_guidelines_2023],
    },
    {
      day: 9,
      subject: "A PCOS-supportive dinner recipe (ready in 25 minutes)",
      topic: GENERIC_DAY_TOPICS[9],
      educationalAngle: "High-protein, moderate-carb, anti-inflammatory recipe. Adapt ingredients for US/UK/AU. Explain metabolic rationale (protein adequacy, fibre, omega-3 if applicable). Include post-meal walk suggestion from Buffey et al.",
      ctaText: "Browse more recipes",
      ctaHref: "/learn",
      commercial: false,
      evidenceNotes: [EVIDENCE.post_meal_walking, EVIDENCE.protein_second_meal_effect],
      safetySegmentation: {
        hasSafetyFlags: "Remove specific portion sizes if eating disorder flag present.",
      },
    },
    {
      day: 10,
      subject: "Two PCOS nutrition myths the evidence doesn't fully support",
      topic: GENERIC_DAY_TOPICS[10],
      educationalAngle: "Myth 1: 'Cut all carbs for PCOS.' Myth 2: 'All PCOS is the same.' Explain nuance with evidence. Promote informed personalisation over blanket rules. Conclude with 'discuss with your care team.'",
      ctaText: "Read: nutrition for metabolic health",
      ctaHref: "/learn/nutrition",
      commercial: false,
      evidenceNotes: [EVIDENCE.pcos_guidelines_2023],
    },
    {
      day: 11,
      subject: "Post-meal walking and PCOS — what the research shows",
      topic: GENERIC_DAY_TOPICS[11],
      educationalAngle: "10-minute post-meal walk as a PCOS-specific strategy. Explain muscle glucose uptake mechanism. Use Buffey et al. evidence. Frame it as a low-barrier intervention with strong evidence:time ratio.",
      ctaText: "Learn more on InsulinIQ",
      ctaHref: "/pcos",
      commercial: false,
      evidenceNotes: [EVIDENCE.post_meal_walking, EVIDENCE.muscle_glucose_disposal],
    },
    {
      day: 12,
      subject: "PCOS-friendly food swaps — adapted for your location",
      topic: GENERIC_DAY_TOPICS[12],
      educationalAngle: "5 food swaps with US / UK / AU alternatives. Focus on swaps that support lower glycaemic load without restriction. Name specific supermarket products where relevant (Walmart, Tesco, Woolworths etc).",
      ctaText: "Read more on InsulinIQ",
      ctaHref: "/pcos",
      commercial: false,
      evidenceNotes: [EVIDENCE.meal_sequencing],
    },
    {
      day: 13,
      subject: "Sleep, stress and PCOS — the metabolic connection",
      topic: GENERIC_DAY_TOPICS[13],
      educationalAngle: "Sleep deprivation reduces insulin sensitivity (Donga et al.). Cortisol raises blood glucose and may worsen hormonal imbalance. Practical stress management framed as metabolic health (not wellness fluff). Avoid prescriptive interventions.",
      ctaText: "Learn more: microbiome and metabolism",
      ctaHref: "/learn/microbiome",
      commercial: false,
      evidenceNotes: [EVIDENCE.sleep_insulin_sensitivity],
    },
    {
      day: 14,
      subject: "What realistic PCOS metabolic progress looks like at 8 weeks",
      topic: GENERIC_DAY_TOPICS[14],
      educationalAngle: "Evidence-based timeline for PCOS metabolic support outcomes. Frame as 'what research shows commonly improves' — not a promise. Early wins: energy, cravings. Later: lipid markers, fasting insulin. Always 'discuss with your doctor.'",
      ctaText: "Explore Core Membership",
      ctaHref: "/pricing?recommended=core&profile=pcos",
      commercial: true,
      evidenceNotes: [EVIDENCE.pcos_guidelines_2023, EVIDENCE.lifestyle_insulin_sensitivity],
      safetySegmentation: {
        hasSafetyFlags: "Remove all weight-related progress language. Focus on energy and wellbeing only.",
      },
    },
    {
      day: 15,
      subject: "What Core Membership includes — and how it's built for PCOS education",
      topic: GENERIC_DAY_TOPICS[15],
      educationalAngle: "Non-pressured explanation of what the 21-day PCOS educational framework includes. Emphasise it is an educational product, not a medical treatment. List features: allergen filtering, UK/AU/US variants, monthly refresh.",
      ctaText: "View PCOS educational plan",
      ctaHref: "/pricing?recommended=core&profile=pcos",
      commercial: false,
      evidenceNotes: [],
    },
    {
      day: 16,
      subject: "PCOS and fatty liver — the connection most people don't know about",
      topic: GENERIC_DAY_TOPICS[16],
      educationalAngle: "Explain NAFLD-PCOS co-occurrence. Insulin resistance as common driver. ALT/AST as markers to discuss with doctor. Educational connection — not diagnosing.",
      ctaText: "Read: NAFLD and insulin resistance",
      ctaHref: "/nafld",
      commercial: false,
      evidenceNotes: [EVIDENCE.nafld_ir_connection, EVIDENCE.pcos_insulin_androgens],
    },
    {
      day: 17,
      subject: "PCOS grocery planning — a practical weekly framework",
      topic: GENERIC_DAY_TOPICS[17],
      educationalAngle: "Simple weekly grocery structure: protein sources, fibrous vegetables, low-GI carbs, healthy fats. Adapted for US/UK/AU stores. Budget-aware options included. No calorie targets — food quality focus.",
      ctaText: "Read: nutrition fundamentals",
      ctaHref: "/learn/nutrition",
      commercial: false,
      evidenceNotes: [EVIDENCE.pcos_guidelines_2023],
      safetySegmentation: {
        hasSafetyFlags: "Avoid any mention of calorie reduction. Focus on food quality and variety.",
      },
    },
    {
      day: 18,
      subject: "A reflection question — what has been most useful so far?",
      topic: GENERIC_DAY_TOPICS[18],
      educationalAngle: "Reflective email with 3 self-assessment questions. Encourage the reader to notice what changed (energy, cravings, post-meal tiredness) and what didn't. No comparison to others. Invite reply. No sales pressure.",
      ctaText: "Read more on InsulinIQ",
      ctaHref: "/pcos",
      commercial: false,
      evidenceNotes: [],
    },
    {
      day: 19,
      subject: "3 common PCOS eating mistakes — and how to reframe them",
      topic: GENERIC_DAY_TOPICS[19],
      educationalAngle: "Mistake 1: cutting all carbs. Mistake 2: expecting rapid results. Mistake 3: following generic weight-loss advice not adapted for PCOS. Reframe each positively. No shame or blame language.",
      ctaText: "Learn more about PCOS",
      ctaHref: "/pcos",
      commercial: false,
      evidenceNotes: [EVIDENCE.pcos_guidelines_2023],
    },
    {
      day: 20,
      subject: "How to talk to your doctor about PCOS and metabolic health",
      topic: GENERIC_DAY_TOPICS[20],
      educationalAngle: "Practical checklist of questions to bring to a GP or endocrinologist. What tests to request (fasting insulin, HOMA-IR, free androgen index, lipid panel, ALT). How to frame the conversation. 'This content is educational — always discuss with your healthcare provider.'",
      ctaText: "Read: what is insulin resistance?",
      ctaHref: "/learn/what-is-insulin-resistance",
      commercial: false,
      evidenceNotes: [EVIDENCE.homa_ir, EVIDENCE.pcos_guidelines_2023],
    },
    {
      day: 21,
      subject: "Your PCOS education journey — what comes next",
      topic: GENERIC_DAY_TOPICS[21],
      educationalAngle: "Warm summary of what was covered. Acknowledge progress (whatever it looks like for them). Next steps: free articles, condition hub, paid membership if they want ongoing structure. Thank them. Final CTA is gentle.",
      ctaText: "Continue your education on InsulinIQ",
      ctaHref: "/pricing?recommended=core&profile=pcos",
      commercial: true,
      evidenceNotes: [],
    },
  ],
};

// ── NAFLD Profile ─────────────────────────────────────────────────────────────

const NAFLD_NURTURE: NurtureProfileDefinition = {
  profileKey: "nafld",
  profileLabel: "Liver Metabolic Focus",
  emailIntro: "Your quiz results suggest patterns associated with metabolic liver health. Over the next 21 days, this series covers the evidence-informed connection between insulin resistance and liver fat — education only, not a clinical liver disease treatment plan.",
  primaryConditionContext: "metabolic liver health education",
  days: GENERIC_DAY_TOPICS
    ? ([
        { day: 0, subject: "Your liver metabolic profile — what comes next", topic: GENERIC_DAY_TOPICS[0], educationalAngle: "Recap NAFLD/MASLD profile. Explain NAFLD vs MASLD terminology. Reassure it is educational, not diagnostic. Preview series.", ctaText: "View your profile", ctaHref: "/quiz/results", commercial: false, evidenceNotes: [EVIDENCE.nafld_ir_connection] },
        { day: 1, subject: "Why fatty liver is a metabolic problem, not just a liver problem", topic: GENERIC_DAY_TOPICS[1], educationalAngle: "Explain the NAFLD-insulin resistance connection. Liver fat accumulation from excess glucose/fructose under IR. Educational mechanism only — not treatment guidance.", ctaText: "Read: NAFLD and insulin resistance", ctaHref: "/nafld", commercial: false, evidenceNotes: [EVIDENCE.nafld_ir_connection, EVIDENCE.nafld_weight_loss] },
        { day: 2, subject: "What insulin does to your liver — the basics", topic: GENERIC_DAY_TOPICS[2], educationalAngle: "Insulin basics with liver focus. Explain hepatic glucose production, fructose metabolism. Educational mechanism — not treatment.", ctaText: "Read: what is insulin resistance?", ctaHref: "/learn/what-is-insulin-resistance", commercial: false, evidenceNotes: [EVIDENCE.insulin_resistance_hyperinsulinemia, EVIDENCE.nafld_ir_connection] },
        { day: 3, subject: "A liver-supportive breakfast framework", topic: GENERIC_DAY_TOPICS[3], educationalAngle: "Protein-first breakfast to reduce glucose load on liver. Second meal effect. Practical examples US/UK/AU. Savoury vs sweet breakfast comparison.", ctaText: "Read: nutrition principles", ctaHref: "/learn/nutrition", commercial: false, evidenceNotes: [EVIDENCE.protein_second_meal_effect], safetySegmentation: { hasSafetyFlags: "Add: 'If you have advanced liver disease, protein requirements may differ. Please consult your hepatologist before changing your diet.'" } },
        { day: 4, subject: "Meal sequencing and your liver — what studies show", topic: GENERIC_DAY_TOPICS[4], educationalAngle: "Vegetables-protein before carbs. Reduces post-meal glucose load to liver. Shukla et al. 37% finding applied to NAFLD context.", ctaText: "Read more on InsulinIQ", ctaHref: "/nafld", commercial: false, evidenceNotes: [EVIDENCE.meal_sequencing] },
        { day: 5, subject: "Fibre and liver health — what the evidence suggests", topic: GENERIC_DAY_TOPICS[5], educationalAngle: "Soluble fibre slows glucose absorption, reduces hepatic glucose load. Diverse fibre sources. Mediterranean dietary pattern context.", ctaText: "Read: nutrition for metabolic health", ctaHref: "/learn/nutrition", commercial: false, evidenceNotes: [EVIDENCE.mediterranean_metabolic_syndrome, EVIDENCE.fibre_gut_microbiome] },
        { day: 6, subject: "Sugar-sweetened drinks and liver fat — what the research says", topic: GENERIC_DAY_TOPICS[6], educationalAngle: "Fructose as primary liver fat driver. Sugar-sweetened drinks as top dietary source. Practical swaps. Alcohol in NAFLD context (educational only — not clinical advice).", ctaText: "Read: NAFLD education", ctaHref: "/nafld", commercial: false, evidenceNotes: [EVIDENCE.nafld_ir_connection] },
        { day: 7, subject: "Week 1 — what InsulinIQ membership includes for liver health education", topic: GENERIC_DAY_TOPICS[7], educationalAngle: "Honest overview. No pressure. Include disclaimer that this is educational, not liver disease management.", ctaText: "See membership options", ctaHref: "/pricing?recommended=core&profile=nafld", commercial: true, evidenceNotes: [] },
        { day: 8, subject: "Lab values to discuss with your doctor — liver health focus", topic: GENERIC_DAY_TOPICS[8], educationalAngle: "ALT, AST, GGT, ultrasound context. What to request. What ranges suggest follow-up. Always frame as 'discuss with your hepatologist or GP', not self-diagnosis.", ctaText: "Learn more about NAFLD", ctaHref: "/nafld", commercial: false, evidenceNotes: [EVIDENCE.homa_ir] },
        { day: 9, subject: "A Mediterranean-adapted dinner for liver metabolic support", topic: GENERIC_DAY_TOPICS[9], educationalAngle: "Recipe with olive oil, fish/legumes, non-starchy vegetables. Mediterranean pattern rationale. Post-meal walk suggestion.", ctaText: "Browse more recipes", ctaHref: "/learn", commercial: false, evidenceNotes: [EVIDENCE.post_meal_walking, EVIDENCE.mediterranean_metabolic_syndrome] },
        { day: 10, subject: "Two liver health myths the evidence doesn't support", topic: GENERIC_DAY_TOPICS[10], educationalAngle: "Myth 1: 'Fatty liver only comes from alcohol.' Myth 2: 'You can't improve liver health without medication.' Evidence-based correction. Not treatment claims.", ctaText: "Read more on InsulinIQ", ctaHref: "/nafld", commercial: false, evidenceNotes: [EVIDENCE.nafld_weight_loss, EVIDENCE.nafld_ir_connection] },
        { day: 11, subject: "Post-meal walking and liver health", topic: GENERIC_DAY_TOPICS[11], educationalAngle: "Post-meal walking reduces hepatic glucose load. Muscle glucose uptake explanation. Buffey et al. evidence.", ctaText: "Read: nutrition for metabolic health", ctaHref: "/learn/nutrition", commercial: false, evidenceNotes: [EVIDENCE.post_meal_walking, EVIDENCE.muscle_glucose_disposal] },
        { day: 12, subject: "Liver-supportive food swaps — adapted for US, UK, and Australia", topic: GENERIC_DAY_TOPICS[12], educationalAngle: "Replace sugar-sweetened drinks, white bread, ultra-processed snacks with liver-supportive options. Store-specific examples.", ctaText: "Read more on InsulinIQ", ctaHref: "/nafld", commercial: false, evidenceNotes: [EVIDENCE.nafld_ir_connection] },
        { day: 13, subject: "Sleep, stress and liver metabolic health", topic: GENERIC_DAY_TOPICS[13], educationalAngle: "Sleep deprivation raises cortisol and blood glucose, increasing hepatic load. Stress management as metabolic intervention. Evidence-informed, not prescriptive.", ctaText: "Read: microbiome and metabolism", ctaHref: "/learn/microbiome", commercial: false, evidenceNotes: [EVIDENCE.sleep_insulin_sensitivity] },
        { day: 14, subject: "What realistic liver metabolic progress looks like at 8 weeks", topic: GENERIC_DAY_TOPICS[14], educationalAngle: "Evidence on liver fat reduction timeline. 7–10% weight loss evidence (Vilar-Gomez et al.). Frame as 'what research shows is possible' — not a personal guarantee.", ctaText: "Explore Core Membership", ctaHref: "/pricing?recommended=core&profile=nafld", commercial: true, evidenceNotes: [EVIDENCE.nafld_weight_loss], safetySegmentation: { hasSafetyFlags: "Remove any weight loss framing. Focus on lab marker changes and energy improvement only." } },
        { day: 15, subject: "What Core Membership includes for liver metabolic education", topic: GENERIC_DAY_TOPICS[15], educationalAngle: "Features list for NAFLD profile. 21-day meal framework, Mediterranean-adapted recipes, grocery lists, lab values companion. Educational framing throughout.", ctaText: "View membership options", ctaHref: "/pricing?recommended=core&profile=nafld", commercial: false, evidenceNotes: [] },
        { day: 16, subject: "Visceral fat and liver health — the connection explained", topic: GENERIC_DAY_TOPICS[16], educationalAngle: "Visceral fat as metabolically active tissue linked to liver fat. Not subcutaneous fat. Educational mechanism. Do not equate to personal diagnosis.", ctaText: "Read: metabolic syndrome explained", ctaHref: "/learn/metabolic-syndrome", commercial: false, evidenceNotes: [EVIDENCE.nafld_ir_connection, EVIDENCE.nafld_weight_loss] },
        { day: 17, subject: "Grocery planning for liver metabolic support — a weekly framework", topic: GENERIC_DAY_TOPICS[17], educationalAngle: "Practical shopping list structure: olive oil, fish, legumes, non-starchy veg, low-sugar fruits. Store-adapted for US/UK/AU.", ctaText: "Read: nutrition principles", ctaHref: "/learn/nutrition", commercial: false, evidenceNotes: [EVIDENCE.mediterranean_metabolic_syndrome] },
        { day: 18, subject: "A reflection — what has changed in 18 days?", topic: GENERIC_DAY_TOPICS[18], educationalAngle: "Self-reflection prompt. 3 questions about energy, post-meal tiredness, food awareness. No comparison. Invite reply.", ctaText: "Read more on InsulinIQ", ctaHref: "/nafld", commercial: false, evidenceNotes: [] },
        { day: 19, subject: "Common mistakes in NAFLD dietary management", topic: GENERIC_DAY_TOPICS[19], educationalAngle: "Mistake 1: focusing only on fat intake. Mistake 2: crash dieting (worsens liver health short-term). Mistake 3: ignoring fructose sources. Reframe positively.", ctaText: "Read: NAFLD education", ctaHref: "/nafld", commercial: false, evidenceNotes: [EVIDENCE.nafld_weight_loss] },
        { day: 20, subject: "How to talk to your doctor about fatty liver and metabolic health", topic: GENERIC_DAY_TOPICS[20], educationalAngle: "Checklist of questions for GP/hepatologist/gastroenterologist. Tests to request. How to describe symptoms. 'Educational only — discuss with your healthcare provider.'", ctaText: "Learn more: what is insulin resistance?", ctaHref: "/learn/what-is-insulin-resistance", commercial: false, evidenceNotes: [EVIDENCE.homa_ir, EVIDENCE.nafld_ir_connection] },
        { day: 21, subject: "Your liver metabolic education journey — what comes next", topic: GENERIC_DAY_TOPICS[21], educationalAngle: "Warm summary. Acknowledge effort. Next steps: free content, paid membership for ongoing structure. Gentle final CTA.", ctaText: "Continue learning on InsulinIQ", ctaHref: "/pricing?recommended=core&profile=nafld", commercial: true, evidenceNotes: [] },
      ] as NurtureDay[])
    : [],
};

// ── Prediabetes Profile ───────────────────────────────────────────────────────

const PREDIABETES_NURTURE: NurtureProfileDefinition = {
  profileKey: "prediabetes",
  profileLabel: "Blood Sugar Stabiliser",
  emailIntro: "Your quiz results suggest patterns associated with blood sugar management. This 21-day series is educational — covering meal structure, glucose stability, and lab markers — not a diabetes prevention programme or medical nutrition therapy.",
  primaryConditionContext: "blood sugar education",
  days: Array.from({ length: 22 }, (_, i) => i).map((day) => ({
    day,
    subject: [
      "Your blood sugar education profile — what comes next",
      "Why blood sugar patterns matter for your metabolic health",
      "What insulin does to your blood sugar — a clear explanation",
      "The protein-anchor breakfast for more stable blood sugar",
      "Food order and blood sugar — the 37% study explained",
      "Fibre, satiety and blood sugar stability",
      "Hidden sugars — the ones that matter most for blood sugar",
      "Week 1 — what InsulinIQ membership covers for blood sugar education",
      "Lab values to discuss with your doctor — blood sugar focus",
      "A blood sugar-friendly dinner recipe",
      "Two blood sugar myths the evidence doesn't support",
      "Post-meal walking — one of the most effective blood sugar tools",
      "Blood sugar food swaps for US, UK, and Australia",
      "Sleep, stress and blood sugar — what the evidence shows",
      "What realistic blood sugar progress looks like at 8 weeks",
      "What Core Membership includes for blood sugar education",
      "Prediabetes — understanding the progression and evidence for lifestyle change",
      "Grocery planning for blood sugar support",
      "A reflection — what has changed in 18 days?",
      "Common mistakes in blood sugar management",
      "How to talk to your doctor about prediabetes and metabolic health",
      "Your blood sugar education journey — what comes next",
    ][day],
    topic: GENERIC_DAY_TOPICS[day],
    educationalAngle: [
      "Recap profile. Emphasise educational, not diagnostic. Preview the 21 days.",
      "What is prediabetes vs normal glucose vs type 2 diabetes risk. Blood sugar as a spectrum. Not alarmist.",
      "How insulin controls blood sugar. Second meal effect. What hyperinsulinemia means in the context of prediabetes risk.",
      "Protein-first breakfast reduces morning glucose response and sets pattern for the day. Three practical examples per market.",
      "Macronutrient sequencing. Shukla et al. 37% finding. Practical application to lunch and dinner.",
      "Soluble fibre slows glucose absorption. Practical 5-source list per market.",
      "Top 5 hidden sugar sources relevant to blood sugar stability. One practical swap per item.",
      "Honest membership overview. No urgency. Free content continues.",
      "Fasting glucose, fasting insulin, HbA1c, HOMA-IR — what to request and what to discuss. Never diagnose.",
      "Recipe designed for stable post-meal glucose. Protein + fibre + healthy fat combination. Post-meal walk suggestion.",
      "Myth 1: 'Carbs are always bad for blood sugar.' Myth 2: 'If fasting glucose is normal, there's no issue.' Evidence-based corrections.",
      "Post-meal walking as glucose management tool. 10-minute walk evidence. Buffey et al. Easy to apply.",
      "5 swaps for lower glycaemic load eating. US/UK/AU store variants.",
      "Sleep and blood sugar — Donga et al. 25% insulin sensitivity reduction with poor sleep. Cortisol effect. Not prescriptive.",
      "Evidence timeline for prediabetes lifestyle intervention (DPP: 58% progression reduction). Frame as 'what research shows is possible' — not a personal guarantee.",
      "Core Membership PCOS adaptation description. What the blood sugar education framework includes.",
      "Prediabetes education: what the DPP found. Lifestyle intervention evidence. 'This is educational — not a diabetes prevention programme.'",
      "Shopping list structure for blood sugar support. Low-GI staples. US/UK/AU adapted.",
      "Self-reflection prompt. 3 questions about energy, cravings, post-meal tiredness.",
      "Mistake 1: expecting linear blood sugar improvement. Mistake 2: cutting all carbs. Mistake 3: skipping meals. Reframe.",
      "Questions checklist for GP/endocrinologist. What tests to request. 'Educational only.'",
      "Warm summary. Next steps. Gentle final CTA.",
    ][day],
    ctaText: day === 0 ? "View your full profile" : day === 7 ? "See membership options" : day === 14 ? "Explore Core Membership" : day === 21 ? "Continue learning on InsulinIQ" : "Read more on InsulinIQ",
    ctaHref: day === 0 ? "/quiz/results" : [7, 14, 15, 21].includes(day) ? `/pricing?recommended=core&profile=prediabetes` : day === 8 ? "/prediabetes" : day === 9 ? "/learn" : day === 16 ? "/prediabetes" : "/learn/what-is-insulin-resistance",
    commercial: [7, 14, 21].includes(day),
    evidenceNotes: day === 4 ? [EVIDENCE.meal_sequencing] : day === 11 ? [EVIDENCE.post_meal_walking] : day === 14 || day === 16 ? [EVIDENCE.dpp_prediabetes] : day === 8 ? [EVIDENCE.homa_ir] : day === 13 ? [EVIDENCE.sleep_insulin_sensitivity] : day === 3 ? [EVIDENCE.protein_second_meal_effect] : [],
    safetySegmentation: day === 14 ? { hasSafetyFlags: "Remove weight loss references. Focus on energy and lab value improvement only." } : day === 3 ? { hasSafetyFlags: "Remove specific portion sizes. Do not include calorie targets." } : undefined,
  })),
};

// ── Insulin Resistance Profile ────────────────────────────────────────────────

const INSULIN_RESISTANCE_NURTURE: NurtureProfileDefinition = {
  profileKey: "insulin_resistance",
  profileLabel: "Metabolic Health Foundations",
  emailIntro: "Your quiz results suggest patterns associated with insulin resistance. This 21-day series covers the educational fundamentals — insulin mechanics, meal structure, and practical food habits. Educational only, not a treatment plan.",
  primaryConditionContext: "insulin resistance education",
  days: PCOS_NURTURE.days.map((d) => ({
    ...d,
    subject: d.subject.replace(/PCOS/g, "metabolic health").replace(/pcos/g, "insulin_resistance"),
    ctaHref: d.ctaHref.replace("profile=pcos", "profile=insulin_resistance").replace("/pcos", "/learn/what-is-insulin-resistance"),
    educationalAngle: d.educationalAngle.replace(/PCOS/g, "insulin resistance").replace(/androgen/g, "metabolic"),
  })),
};

// ── Metabolic Syndrome Profile ────────────────────────────────────────────────

const METABOLIC_SYNDROME_NURTURE: NurtureProfileDefinition = {
  profileKey: "metabolic_syndrome",
  profileLabel: "Metabolic Syndrome Focus",
  emailIntro: "Your quiz results suggest patterns associated with multiple metabolic markers. This 21-day series covers the evidence for Mediterranean-pattern eating, visceral fat education, and practical food habits — educational only, not a treatment plan.",
  primaryConditionContext: "metabolic syndrome education",
  days: PCOS_NURTURE.days.map((d) => ({
    ...d,
    subject: d.subject.replace(/PCOS/g, "metabolic syndrome").replace(/pcos/g, "metabolic_syndrome"),
    ctaHref: d.ctaHref.replace("profile=pcos", "profile=metabolic_syndrome").replace("/pcos", "/learn/metabolic-syndrome"),
    educationalAngle: d.educationalAngle.replace(/PCOS/g, "metabolic syndrome").replace(/androgen/g, "lipid/blood pressure"),
    evidenceNotes: d.evidenceNotes.map((e) =>
      e.source.includes("PCOS") ? EVIDENCE.mediterranean_metabolic_syndrome : e
    ),
  })),
};

// ── General Wellness Profile ──────────────────────────────────────────────────

const GENERAL_WELLNESS_NURTURE: NurtureProfileDefinition = {
  profileKey: "general_wellness",
  profileLabel: "Metabolic Education Starter",
  emailIntro: "Your quiz results suggest you're building foundational metabolic health knowledge. This 21-day series covers insulin resistance basics, blood sugar education, and practical food habits — for beginners, educational only.",
  primaryConditionContext: "metabolic health education",
  days: INSULIN_RESISTANCE_NURTURE.days.map((d) => ({
    ...d,
    ctaHref: d.ctaHref.replace("profile=insulin_resistance", "profile=general_wellness"),
  })),
};

// ── Profile map (used by cron to look up which profile to use) ────────────────

export const NURTURE_PROFILES: Record<NurtureProfileKey, NurtureProfileDefinition> = {
  pcos:               PCOS_NURTURE,
  nafld:              NAFLD_NURTURE,
  prediabetes:        PREDIABETES_NURTURE,
  insulin_resistance: INSULIN_RESISTANCE_NURTURE,
  metabolic_syndrome: METABOLIC_SYNDROME_NURTURE,
  general_wellness:   GENERAL_WELLNESS_NURTURE,
};

// Helper: resolve a profile key from a DB string (with fallback)
export function resolveNurtureProfile(profile: string | null): NurtureProfileKey {
  if (profile && profile in NURTURE_PROFILES) {
    return profile as NurtureProfileKey;
  }
  return "general_wellness";
}

// Helper: get the Day N definition for a specific profile
export function getNurtureDay(
  profile: NurtureProfileKey,
  day: number
): NurtureDay | null {
  const def = NURTURE_PROFILES[profile];
  return def.days.find((d) => d.day === day) ?? null;
}

// Sprint 4 TODO:
// 1. Update lib/resend/emails.ts to accept a NurtureProfileKey param in sendNurtureEmail
// 2. Build profile-specific HTML templates using this framework as the content brief
// 3. Update the cron to read subscriber.metabolic_profile and call the profile-specific template
// 4. A/B test subject lines between profiles using this framework as the source of truth
