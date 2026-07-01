// Profile content constants — shared between matcher.ts (v1) and matcher-v2.ts (v2).
//
// Why this file exists:
//   matcher.ts previously held both the interfaces AND the profile constants.
//   matcher-v2.ts needed those constants but couldn't import from matcher.ts cleanly
//   without a require() call (circular risk: types-v2.ts → matcher.ts → profile-content.ts
//   → matcher.ts would be circular). Moving interfaces + constants here breaks that chain.
//
// Import chain after refactor (no circulars):
//   types.ts           (no imports from this package)
//   types-v2.ts        → profile-content.ts (for MatchResult)
//   profile-content.ts → types.ts (for MetabolicProfile)
//   matcher.ts         → profile-content.ts + types.ts
//   matcher-v2.ts      → profile-content.ts + types-v2.ts

import type { MetabolicProfile } from "./types";

// ── Shared interfaces ─────────────────────────────────────────────────────────
// Defined here so both matchers can import them without circularity.
// matcher.ts re-exports these for backward compatibility.

export interface ArticleRef {
  href: string;
  title: string;
  category: string;
}

export interface FrictionPoint {
  icon: string;
  title: string;
  body: string;
  implication: string;
}

export interface PlanDay {
  day: number;
  title: string;
  content: string;
  locked: boolean;
}

export interface MatchResult {
  profile: MetabolicProfile;
  profileLabel: string;
  profileColor: "forest" | "sage" | "clay" | "honey";
  description: string;
  articles: ArticleRef[];
  planHref: string;
  heroTitle: string;
  heroSubtitle: string;
  frictionPoints: FrictionPoint[];
  whatItMeans: string;
  whatItMeansCitation: string;
  planDays: PlanDay[];
}

// Wider base type used for profiles whose `profile` key is not in MetabolicProfile
// (e.g. weight_loss_friction, future v2-only profiles).
export type ProfileContentBase = Omit<MatchResult, "profile"> & { profile: string };

// ── v1 Profile constants ──────────────────────────────────────────────────────
// Identical to what was previously defined inside matcher.ts.
// Do NOT change any text — medical content requires explicit audit before editing.

export const PCOS_RESULT: MatchResult = {
  profile: "pcos",
  profileLabel: "PCOS Metabolic Support",
  profileColor: "sage",
  heroTitle: "Your PCOS Metabolic Pattern Is Clearer Than You Think",
  heroSubtitle:
    "Your answers point to patterns associated with hormonal and metabolic imbalances common in PCOS. Here's what that means for your plate — without a diagnosis.",
  description:
    "Your answers suggest patterns associated with hormonal and metabolic imbalances common in PCOS. The resources below focus on the insulin-driven androgen cycle that underlies many PCOS symptoms — and what you can do about it at your next meal.",
  frictionPoints: [
    {
      icon: "🔄",
      title: "Insulin-Driven Cravings",
      body: "Your answers suggest cravings that feel hard to override — particularly for sweet or starchy foods in the afternoon or evening. Research links this pattern to post-meal glucose fluctuations that are more pronounced when insulin sensitivity is reduced (Crofts et al., 2015).",
      implication:
        "These aren't willpower failures. Structuring meals around protein and fibre first may help flatten this curve and reduce cravings without restriction.",
    },
    {
      icon: "⚖️",
      title: "Weight That Resists Standard Approaches",
      body: "People with insulin-driven PCOS often find that calorie restriction alone doesn't move the needle — particularly around the abdomen. Elevated insulin promotes fat storage and inhibits fat mobilisation even at moderate calorie intakes (Sam, 2007).",
      implication:
        "The composition of your meals matters more than the count alone. A protein-first, lower glycaemic-load approach is better supported by evidence for this specific pattern.",
    },
    {
      icon: "🌙",
      title: "Energy That Peaks and Crashes",
      body: "Afternoon fatigue, difficulty waking, and post-meal energy crashes are consistent with the glucose dysregulation pattern common in insulin-resistant PCOS — not a sleep problem or character flaw.",
      implication:
        "A protein-anchored breakfast is one of the single highest-impact changes for this pattern. The evidence in PCOS specifically is stronger than for most other dietary interventions.",
    },
  ],
  whatItMeans:
    "Insulin resistance doesn't cause every PCOS symptom — but research suggests it's a contributing factor in a significant proportion of people with PCOS, particularly those experiencing weight gain, cravings, cycle irregularity, and elevated androgens. The mechanism: when cells become less responsive to insulin, the pancreas produces more of it. Elevated insulin then signals the ovaries to produce more androgens. These elevated androgens can contribute to irregular cycles, acne, and unwanted hair growth. Nutrition approaches that reduce insulin demand — higher protein, more fibre, lower glycaemic load, structured meal timing — have been studied specifically for PCOS symptom management. This educational explanation does not apply to everyone with PCOS, which has multiple subtypes. A GP or endocrinologist can help you understand your specific case.",
  whatItMeansCitation:
    "Teede et al., 2023 — International Evidence-Based PCOS Guidelines",
  planDays: [
    { day: 1, title: "The Protein Anchor", content: "Build your breakfast around 25–30g of protein: eggs, Greek yoghurt, cottage cheese, or smoked salmon. This single change has more evidence behind it for PCOS metabolic support than almost any other dietary intervention (Douglas et al., 2022). Your morning: 2 eggs scrambled + 100g cottage cheese + spinach. Ready in 8 minutes.", locked: false },
    { day: 2, title: "Vegetables Before Carbohydrates", content: "At every meal today, eat your non-starchy vegetables before your carbohydrates — not instead of, before. Research by Shukla et al. (2017) found this single ordering change reduced peak blood glucose by up to 37% with the exact same foods.", locked: false },
    { day: 3, title: "The 10-Minute Post-Meal Walk", content: "After your largest meal of the day, walk for 10 minutes. Even 2–3 minutes of post-meal movement measurably reduces glucose peaks (Buffey et al., 2022). Your muscles absorb glucose directly during movement — bypassing the need for extra insulin.", locked: false },
    { day: 4, title: "Managing Cravings Without Willpower", content: "Understanding the biochemical trigger behind afternoon cravings — and the meal structure that interrupts the cycle at the source.", locked: true },
    { day: 5, title: "Your PCOS Shopping List", content: "Store-adapted list for your country, filtered for your dietary needs and allergens.", locked: true },
    { day: 6, title: "Your First PCOS-Adapted Recipe", content: "A 25-minute dinner built around the metabolic principles from days 1–3.", locked: true },
    { day: 7, title: "Week 1 Review + Adjustments", content: "A self-check framework to assess what worked, what to tweak, and what to track going into week 2.", locked: true },
  ],
  articles: [
    { href: "/pcos", title: "PCOS and Insulin Resistance", category: "PCOS" },
    { href: "/learn/nutrition", title: "Eating for Metabolic Health", category: "Nutrition" },
    { href: "/learn/what-is-insulin-resistance", title: "What Is Insulin Resistance?", category: "Insulin Resistance" },
  ],
  planHref: "/pricing",
};

export const NAFLD_RESULT: MatchResult = {
  profile: "nafld",
  profileLabel: "Liver Metabolic Focus",
  profileColor: "honey",
  heroTitle: "Your Liver Metabolic Pattern Has a Clear Starting Point",
  heroSubtitle:
    "Your answers suggest patterns associated with metabolic liver health. Dietary change is one of the most well-studied interventions here — and the starting point is simpler than most people expect.",
  description:
    "Your answers suggest patterns associated with metabolic liver health concerns. The resources below are chosen to address the dietary drivers of liver fat accumulation — particularly the insulin resistance connection most standard advice misses.",
  frictionPoints: [
    {
      icon: "🫀",
      title: "Liver Fat Built From the Inside Out",
      body: "Fatty liver in the context of insulin resistance often isn't about dietary fat — it's about excess glucose and fructose the liver converts to fat when insulin signals are disrupted (Targher et al., 2010). Many people are surprised by this.",
      implication: "Reducing sugar-sweetened drinks and refined carbohydrates has more evidence than reducing dietary fat for this specific pattern.",
    },
    {
      icon: "🌀",
      title: "Post-Meal Fatigue and Brain Fog",
      body: "The liver plays a key role in regulating glucose output between meals. When liver function is compromised by fat accumulation, glucose regulation becomes less stable — contributing to post-meal fatigue and afternoon brain fog that can feel unrelated to food.",
      implication: "Protein at every meal supports more stable between-meal glucose and reduces the demand on a stressed liver.",
    },
    {
      icon: "📊",
      title: "Abdominal Fat That Resists Change",
      body: "Visceral fat — the fat surrounding internal organs — has a close relationship with liver fat accumulation and insulin resistance. The two reinforce each other (Browning & Horton, 2004). Standard weight loss advice often doesn't address this connection.",
      implication: "Gradual weight loss (0.5–1kg/week) has the most evidence for liver fat reduction. Rapid loss can paradoxically worsen liver health short-term.",
    },
  ],
  whatItMeans:
    "Fatty liver disease in a metabolic context — NAFLD or MASLD — is often described as a liver problem. It is more accurately described as a metabolic problem that shows up in the liver. When insulin resistance develops, the liver receives conflicting signals: it continues to produce glucose even when blood glucose is already elevated, and it accumulates fat from excess dietary carbohydrates and fructose. The most well-supported dietary interventions focus on reducing sugar-sweetened beverages and alcohol, increasing fibre and protein, and supporting a moderate calorie deficit if appropriate. Weight loss of 7–10% of body weight has been shown to significantly reduce liver fat in clinical studies. This educational profile does not replace assessment by a hepatologist or gastroenterologist.",
  whatItMeansCitation: "Vilar-Gomez et al., 2015 — Clinical Gastroenterology and Hepatology",
  planDays: [
    { day: 1, title: "Remove the #1 Liver Fat Driver", content: "Today, replace any sugar-sweetened drinks with water, sparkling water, or unsweetened alternatives. This single swap is supported by NHS, ADA, and EASL guidelines as the highest-priority dietary change for metabolic liver health. Fruit juice counts as a sugar-sweetened drink.", locked: false },
    { day: 2, title: "Protein at Every Meal", content: "Every meal today should include a palm-sized portion of protein: eggs, fish, chicken, legumes, or cottage cheese. Protein at every meal reduces the glucose burden on the liver and supports muscle mass — which improves whole-body insulin sensitivity.", locked: false },
    { day: 3, title: "The 10-Minute Post-Meal Walk", content: "After your largest meal, walk for 10 minutes. Post-meal walking reduces the glucose load sent to the liver for processing. Buffey et al. (2022) found this measurably reduces post-meal glucose peaks — a direct benefit for liver fat metabolism.", locked: false },
    { day: 4, title: "The Fibre Framework for Liver Health", content: "Which fibres have the most evidence — and how to add them without overhauling your whole diet.", locked: true },
    { day: 5, title: "Your NAFLD Shopping List", content: "Store-adapted list for your country, filtered for your allergens and local availability.", locked: true },
    { day: 6, title: "Mediterranean-Adapted Dinner Recipe", content: "The Mediterranean dietary pattern has the strongest evidence base for NAFLD. Your first adapted recipe.", locked: true },
    { day: 7, title: "Week 1 Review: What Changed?", content: "A self-check framework to see what improved and where to adjust going into week 2.", locked: true },
  ],
  articles: [
    { href: "/nafld", title: "Fatty Liver Disease and Insulin Resistance", category: "NAFLD / MASLD" },
    { href: "/learn/nutrition", title: "Eating for Metabolic Health", category: "Nutrition" },
    { href: "/learn/metabolic-syndrome", title: "Metabolic Syndrome Explained", category: "Metabolic Syndrome" },
  ],
  planHref: "/pricing",
};

export const METABOLIC_SYNDROME_RESULT: MatchResult = {
  profile: "metabolic_syndrome",
  profileLabel: "Metabolic Syndrome Focus",
  profileColor: "forest",
  heroTitle: "Your Metabolic Pattern Involves Multiple Systems — Here's Where to Start",
  heroSubtitle:
    "Your answers suggest signals across blood sugar, blood pressure, and lipids. Insulin resistance is often the common thread — and the same dietary approach can move multiple markers at once.",
  description:
    "Your answers suggest patterns across multiple metabolic systems — blood sugar, blood pressure, and lipids. The resources below address the root mechanism: insulin resistance driving the full cluster simultaneously.",
  frictionPoints: [
    {
      icon: "🔗",
      title: "Multiple Markers Moving Together",
      body: "Metabolic syndrome is defined by a cluster of markers — elevated waist circumference, high triglycerides, low HDL, raised fasting glucose, elevated blood pressure — that rarely appear in isolation. Research has established insulin resistance as a likely driver of much of this cluster (Grundy, 2016).",
      implication: "Interventions that improve insulin sensitivity tend to move multiple markers simultaneously — which is why one dietary approach can help blood pressure, lipids, and blood sugar at once.",
    },
    {
      icon: "🏙️",
      title: "Visceral Fat That Standard Diets Don't Touch",
      body: "The fat most closely linked to metabolic syndrome is visceral fat — the fat inside the abdomen, around the organs. It's metabolically active, drives inflammation, and directly impairs insulin signalling. It behaves differently from subcutaneous fat.",
      implication: "Visceral fat responds well to a consistent moderate calorie deficit combined with movement — particularly resistance training and walking. It does not require extreme dieting.",
    },
    {
      icon: "🎯",
      title: "Fatigue That Makes Change Feel Impossible",
      body: "Chronic fatigue in metabolic syndrome is a combination of poor glucose regulation, low-grade inflammation, disrupted sleep, and hormonal imbalance. It's metabolic, not motivational.",
      implication: "The most commonly reported early win from metabolic health interventions is improved afternoon energy — typically appearing within 2–4 weeks of consistent change.",
    },
  ],
  whatItMeans:
    "Metabolic syndrome is not one disease — it's a cluster of signals showing that metabolism is under pressure across multiple systems simultaneously. Insulin resistance is one important mechanism connecting blood sugar, blood pressure, liver fat, and lipid abnormalities. The good news: because these systems are connected, improving insulin sensitivity tends to move multiple markers at once. The Mediterranean dietary pattern has the strongest evidence base for metabolic syndrome. A 2013 landmark trial (PREDIMED) found significant cardiovascular risk reduction with Mediterranean eating in high-risk individuals. Key principles: olive oil and unsaturated fats, fish twice weekly, legumes, vegetables at every meal, reduced ultra-processed food and sugar-sweetened drinks. This educational profile does not replace assessment by your GP or cardiologist.",
  whatItMeansCitation: "Estruch et al., 2013 — PREDIMED Trial, New England Journal of Medicine",
  planDays: [
    { day: 1, title: "The Protein Anchor", content: "Every meal today starts with a protein source — 25–30g per meal. This stabilises blood sugar, supports muscle mass (your largest glucose disposal organ), and reduces the insulin demand at each meal. Muscle mass is closely linked to insulin sensitivity.", locked: false },
    { day: 2, title: "Add One More Vegetable at Every Meal", content: "At each meal today, add one more serving of non-starchy vegetables — not instead of other food, in addition to it. Fibre from vegetables feeds a more metabolically favourable gut microbiome and slows glucose absorption from the meal.", locked: false },
    { day: 3, title: "The 10-Minute Post-Meal Walk", content: "Walk for 10 minutes after each of your two main meals. Post-meal movement is one of the most studied and underused metabolic interventions — it directly reduces the glucose and triglyceride peaks after eating (Buffey et al., 2022).", locked: false },
    { day: 4, title: "Mediterranean Eating — Starter Framework", content: "The evidence-based dietary pattern with the best data for metabolic syndrome — structured as practical daily swaps.", locked: true },
    { day: 5, title: "Your Metabolic Syndrome Shopping List", content: "Store-adapted list for your country, filtered for your allergens and local availability.", locked: true },
    { day: 6, title: "Lab Markers to Monitor", content: "Which values to track, what ranges to aim for, and what to discuss with your doctor.", locked: true },
    { day: 7, title: "Week 1 Review + Next Steps", content: "Self-check framework for metabolic syndrome: what changed, what to adjust, what to watch.", locked: true },
  ],
  articles: [
    { href: "/learn/metabolic-syndrome", title: "Metabolic Syndrome Explained", category: "Metabolic Syndrome" },
    { href: "/learn/nutrition", title: "Eating for Metabolic Health", category: "Nutrition" },
    { href: "/learn/microbiome", title: "Your Gut Microbiome and Metabolic Health", category: "Gut Microbiome" },
  ],
  planHref: "/pricing",
};

export const PREDIABETES_RESULT: MatchResult = {
  profile: "prediabetes",
  profileLabel: "Blood Sugar Stabiliser",
  profileColor: "clay",
  heroTitle: "Your Blood Sugar Pattern Has a Concrete Starting Point",
  heroSubtitle:
    "Your answers suggest patterns associated with blood sugar regulation challenges. The evidence on what actually helps here is clearer than for almost any other metabolic condition.",
  description:
    "Your answers suggest patterns associated with blood sugar regulation challenges. The resources below are chosen to support a lower glycaemic load, better insulin sensitivity, and more stable energy — starting at your next meal.",
  frictionPoints: [
    {
      icon: "📈",
      title: "Blood Sugar That Spikes and Drops",
      body: "When insulin sensitivity is reduced, the blood sugar curve after meals tends to be higher and last longer — and the drop that follows can be sharp. This produces the familiar cycle of energy, then crash, then craving (and the cycle repeats).",
      implication: "Macronutrient sequencing — vegetables and protein before carbohydrates — can reduce peak glucose by up to 37% without changing what you eat (Shukla et al., 2017).",
    },
    {
      icon: "🍞",
      title: "Carbohydrate Reactions That Don't Match Others'",
      body: "People with reduced insulin sensitivity often find that meals which seem fine for others — a sandwich, a bowl of pasta, a glass of juice — produce noticeably worse energy drops. This is a genuine metabolic difference, not imagination.",
      implication: "The goal isn't to eliminate carbohydrates but to pair them with protein, fibre, and fat to slow absorption and reduce the insulin demand at each meal.",
    },
    {
      icon: "⏰",
      title: "HbA1c or Fasting Glucose That's Crept Up",
      body: "Most standard blood panels measure fasting glucose but miss fasting insulin — the earlier, more sensitive marker for insulin resistance. Many people with prediabetes have had elevated insulin for years before glucose rises into the detectable range.",
      implication: "Knowing which lab values to request and what ranges to aim for is one of the most empowering things you can do before your next appointment.",
    },
  ],
  whatItMeans:
    "Prediabetes represents a point on the insulin resistance spectrum where blood glucose has risen enough to be measurable, but hasn't yet reached the threshold for type 2 diabetes diagnosis. Research consistently shows this is a highly reversible state with appropriate lifestyle changes — the Diabetes Prevention Program found that structured lifestyle intervention reduced progression to type 2 diabetes by 58%. The most evidence-supported interventions are: structured weight loss of 5–7% of body weight if indicated, increased dietary fibre, reduced refined carbohydrate load, regular moderate movement, and post-meal walks. This educational profile does not replace assessment by your GP or endocrinologist, and does not constitute medical advice about your specific blood glucose values.",
  whatItMeansCitation: "Knowler et al., 2002 — New England Journal of Medicine (Diabetes Prevention Program)",
  planDays: [
    { day: 1, title: "The Protein Anchor Breakfast", content: "Replace any high-carbohydrate breakfast with one built around 25–30g protein. The first meal sets your blood sugar pattern for the whole day — the 'second meal effect' (Wolever et al., 1988). Eggs, Greek yoghurt, cottage cheese, or smoked salmon are your starting point.", locked: false },
    { day: 2, title: "Sequence Your Meals", content: "Today, eat your vegetables first, then your protein, then your carbohydrates — in that order. The same food in a different sequence produces a meaningfully different blood sugar response. Shukla et al. (2017): up to 37% lower peak glucose with sequencing alone.", locked: false },
    { day: 3, title: "The 10-Minute Post-Meal Walk", content: "Walk for 10 minutes after your two largest meals today. Your muscles become glucose sponges during movement — absorbing glucose directly without needing insulin. One of the most effective, underutilised blood sugar interventions available.", locked: false },
    { day: 4, title: "The Blood Sugar-Friendly Plate Framework", content: "How to build every meal to minimise your glucose curve — without calorie counting or complex rules.", locked: true },
    { day: 5, title: "Your Blood Sugar Shopping List", content: "Store-adapted list for your country, filtered for your dietary needs and allergens.", locked: true },
    { day: 6, title: "Lab Values to Discuss with Your Doctor", content: "Fasting insulin, HOMA-IR, HbA1c, triglycerides — what to request and what the numbers mean.", locked: true },
    { day: 7, title: "Week 1 Review + Adjustments", content: "Self-assessment framework for week 1: what to keep, what to change, what to notice going into week 2.", locked: true },
  ],
  articles: [
    { href: "/prediabetes", title: "What Is Prediabetes?", category: "Prediabetes" },
    { href: "/learn/nutrition", title: "Eating for Metabolic Health", category: "Nutrition" },
    { href: "/learn/what-is-insulin-resistance", title: "What Is Insulin Resistance?", category: "Insulin Resistance" },
  ],
  planHref: "/pricing",
};

export const INSULIN_RESISTANCE_RESULT: MatchResult = {
  profile: "insulin_resistance",
  profileLabel: "Metabolic Health Foundations",
  profileColor: "forest",
  heroTitle: "Your Metabolic Health Has a Clear Starting Point",
  heroSubtitle:
    "Your answers suggest patterns associated with insulin resistance and blood sugar regulation. Here's what the evidence says — and where to start at your next meal.",
  description:
    "Your answers suggest you're building awareness of how insulin resistance affects energy, weight, and long-term health. The resources below are your best starting point for understanding and improving your metabolic health.",
  frictionPoints: [
    {
      icon: "⚡",
      title: "Energy That Doesn't Match Your Effort",
      body: "Afternoon energy crashes, difficulty waking, and inconsistent energy throughout the day are among the most commonly reported early patterns of insulin resistance — and among the first to improve with dietary change.",
      implication: "The breakfast you eat sets your blood sugar pattern for the rest of the day. Protein-first mornings consistently produce more stable afternoon energy than carbohydrate-led breakfasts.",
    },
    {
      icon: "🍫",
      title: "Cravings That Feel Biological",
      body: "Cravings for sweet or starchy foods — particularly in the afternoon or after meals — are often driven by post-meal glucose fluctuations rather than genuine hunger. When blood sugar drops rapidly after a high-glycaemic meal, the body signals urgently for fast fuel.",
      implication: "Reducing the height and speed of your post-meal glucose curve is the most direct intervention for these cravings — and it starts with how you build your plate.",
    },
    {
      icon: "📉",
      title: "Weight That Resists Conventional Approaches",
      body: "When insulin is chronically elevated, the body's fat-release mechanism is partially suppressed — making fat-burning harder even in a calorie deficit. This isn't a personal failing; it's a metabolic state that responds to specific dietary approaches.",
      implication: "Higher protein intake, reduced refined carbohydrates, and post-meal movement are the three best-supported interventions for improving insulin sensitivity.",
    },
  ],
  whatItMeans:
    "Insulin resistance describes a state where the body's cells have become less responsive to insulin, requiring the pancreas to produce more of it to maintain blood sugar control. Over time, chronically elevated insulin affects energy regulation, fat storage, appetite signalling, and long-term metabolic health. The four best-supported lifestyle interventions are: protein at every meal (reduces insulin demand and improves satiety), dietary fibre from whole foods (slows glucose absorption), regular movement — especially post-meal walking (improves insulin sensitivity directly), and reduced refined carbohydrate and added sugar intake. Research suggests consistent application of even two or three of these principles produces measurable metabolic improvement within 4–8 weeks.",
  whatItMeansCitation: "Esposito et al., 2004 — JAMA; Estruch et al., 2013 — New England Journal of Medicine",
  planDays: [
    { day: 1, title: "The Protein Anchor Breakfast", content: "Build your breakfast around 25–30g of protein. The first meal sets your blood sugar pattern for the whole day — a phenomenon called the 'second meal effect' (Wolever et al., 1988). Eggs, Greek yoghurt, cottage cheese, or smoked salmon. Ready in under 10 minutes.", locked: false },
    { day: 2, title: "Vegetables Before Carbohydrates", content: "At every meal today, eat your non-starchy vegetables before your carbohydrates — not instead of, before. Research by Shukla et al. (2017) found this single ordering change reduced peak blood glucose by up to 37% with the exact same foods.", locked: false },
    { day: 3, title: "The 10-Minute Post-Meal Walk", content: "After your largest meal of the day, walk for 10 minutes. Even 2–3 minutes of post-meal movement measurably reduces glucose peaks (Buffey et al., 2022). Your muscles absorb glucose directly during movement — bypassing the need for extra insulin.", locked: false },
    { day: 4, title: "Building Your Blood Sugar-Friendly Plate", content: "The framework for every meal — without calorie counting or complex rules.", locked: true },
    { day: 5, title: "Your Metabolic Health Shopping List", content: "Store-adapted list for your country, filtered for your allergens and local supermarkets.", locked: true },
    { day: 6, title: "Your First Metabolic-Health Recipe", content: "A 25-minute dinner built around the principles from days 1–3.", locked: true },
    { day: 7, title: "Week 1 Review + What to Adjust", content: "Self-check framework for your first week: what to keep, what to change, and what to notice.", locked: true },
  ],
  articles: [
    { href: "/learn/what-is-insulin-resistance", title: "What Is Insulin Resistance?", category: "Insulin Resistance" },
    { href: "/learn/nutrition", title: "Eating for Metabolic Health", category: "Nutrition" },
    { href: "/learn/microbiome", title: "Your Gut Microbiome and Metabolic Health", category: "Gut Microbiome" },
  ],
  planHref: "/pricing",
};

// ── Weight-loss friction (v2 only) ─────────────────────────────────────────────
// Profile key "weight_loss_friction" is not in MetabolicProfile (v1 union), so this
// constant uses ProfileContentBase (wider type) instead of MatchResult.
// The whatItMeansCitation is marked SOURCE_REQUIRED_BEFORE_PUBLICATION and is not
// shown as a verified citation in the results page copy.

export const WEIGHT_LOSS_FRICTION_RESULT: ProfileContentBase = {
  profile: "weight_loss_friction",
  profileLabel: "Weight-Loss Friction Pattern",
  profileColor: "clay",
  heroTitle: "Your Weight-Loss Pattern May Have a Metabolic Component",
  heroSubtitle:
    "Your answers suggest that difficulties with weight management may involve metabolic factors — not just willpower. Here's what that may mean for your approach.",
  description:
    "Your answers suggest patterns associated with metabolic friction around weight management. The educational focus here is on understanding why hunger, cravings, and energy patterns can make change feel harder — and what the evidence suggests about meal structure.",
  frictionPoints: [
    {
      icon: "🔄",
      title: "Hunger That May Return Too Quickly",
      body: "If you feel hungry again within 2 hours of eating, this may suggest that your current meal structure isn't triggering adequate satiety signalling. Protein and fibre content at meals are the primary drivers of post-meal satiety hormones in well-controlled studies.",
      implication:
        "Building meals around 25–30g protein per sitting, paired with fibre-rich vegetables, is the most evidence-supported approach for extending satiety between meals.",
    },
    {
      icon: "🍫",
      title: "Cravings That May Feel Biological",
      body: "Strong cravings for sweet or starchy foods — especially in the afternoon — are often associated with blood glucose patterns after previous meals. When blood sugar drops rapidly, the body may signal urgently for fast fuel.",
      implication:
        "Reducing the height and speed of the post-meal glucose curve is the most direct educational intervention. This starts with how meals are built, not with restriction.",
    },
    {
      icon: "📉",
      title: "Previous Approaches That May Have Stopped Working",
      body: "Standard calorie-restriction approaches may not address the metabolic environment — including meal structure and satiety signalling — that influences how difficult weight management feels. This is an educational observation, not a clinical assessment.",
      implication:
        "Evidence-based metabolic health education focuses on improving meal quality and structure — not on extreme restriction or elimination.",
    },
  ],
  whatItMeans:
    "Weight-management difficulty is increasingly discussed in metabolic health research in the context of meal structure, satiety hormones, and blood sugar patterns. The educational approach here focuses on protein-rich meals, fibre, consistent meal timing, and post-meal movement — all of which have evidence in the context of satiety and blood sugar stability. This is educational content that may be relevant for people reporting repeated difficulty with weight management. It does not constitute a clinical assessment of your metabolism, and does not diagnose any condition. If you are concerned about your weight or metabolic health, speak with a qualified healthcare provider.",
  whatItMeansCitation:
    "Evidence-informed educational framework. Source verification in progress — see quiz-v2-evidence-review.md. Not a clinical guideline citation.",
  planDays: [
    { day: 1, title: "The Protein Anchor", content: "Build your breakfast around 25–30g of protein. Protein is the single most effective macronutrient for extending the time until you feel hungry again. Your morning: 3 eggs scrambled + 100g cottage cheese + spinach. Ready in 8 minutes.", locked: false },
    { day: 2, title: "Eat Your Vegetables First", content: "At every meal today, eat non-starchy vegetables before carbohydrates — not instead of, before. Research by Shukla et al. (2017) found this ordering change reduced peak blood glucose by up to 37% with the exact same foods.", locked: false },
    { day: 3, title: "The 10-Minute Post-Meal Walk", content: "Walk for 10 minutes after your largest meal today. Post-meal movement directly reduces the glucose and insulin peak after eating, which may support more stable energy for the rest of the day (Buffey et al., 2022).", locked: false },
    { day: 4, title: "Understanding Your Hunger Pattern", content: "The timing and triggers of hunger and cravings tell us which meal earlier in the day may need adjusting.", locked: true },
    { day: 5, title: "Your Shopping List — Budget Adapted", content: "High-protein, high-fibre staples adapted for your country and budget.", locked: true },
    { day: 6, title: "Your First Metabolic-Reset Recipe", content: "A 25-minute dinner designed to support satiety until your next meal.", locked: true },
    { day: 7, title: "Week 1 Review + Adjustments", content: "Self-check: what changed? What to keep, what to adjust for week 2.", locked: true },
  ],
  articles: [
    { href: "/learn/what-is-insulin-resistance", title: "What Is Insulin Resistance?", category: "Insulin Resistance" },
    { href: "/learn/nutrition", title: "Eating for Metabolic Health", category: "Nutrition" },
    { href: "/obesity", title: "Obesity and Metabolic Health", category: "Weight Management" },
  ],
  planHref: "/pricing?recommended=core&profile=insulin_resistance",
};

// ── General Wellness (v2 addition) ────────────────────────────────────────────
// In v1, matchProfile() returns INSULIN_RESISTANCE_RESULT as the catch-all.
// For v2, general_wellness is a distinct profile for users with minimal signals.

export const GENERAL_WELLNESS_RESULT: MatchResult = {
  profile: "general_wellness",
  profileLabel: "Metabolic Education Starter",
  profileColor: "forest",
  heroTitle: "Your Metabolic Health Education Starts Here",
  heroSubtitle:
    "Your answers suggest you're in a good position to build foundational metabolic health knowledge. Here's where to start.",
  description:
    "Your answers don't point to a specific metabolic condition — which is a positive sign. The resources below cover the foundations of insulin resistance, blood sugar stability, and evidence-based nutrition habits.",
  frictionPoints: [
    {
      icon: "🌱",
      title: "Building Habits Before They Become Problems",
      body: "Metabolic health is easier to maintain than to restore. People who establish good meal habits early — protein at each meal, plenty of vegetables, consistent timing — tend to have better metabolic markers over time.",
      implication: "Starting with small, sustainable changes is more evidence-supported than dramatic short-term restriction.",
    },
    {
      icon: "📚",
      title: "Understanding the Basics",
      body: "Most people have no clear mental model of how insulin, blood sugar, and metabolism connect. Understanding this framework makes it easier to make food decisions without needing to count calories or follow rigid rules.",
      implication: "Our free educational content covers the foundational mechanisms — without the jargon.",
    },
    {
      icon: "🎯",
      title: "Connecting Food to Energy",
      body: "Many people notice energy patterns (afternoon crashes, post-meal tiredness) without knowing these are often related to meal composition. Understanding the connection is the first step.",
      implication: "The protein-anchor breakfast framework is a simple starting point that has strong evidence for energy stability across the day.",
    },
  ],
  whatItMeans:
    "Your quiz answers don't suggest a specific metabolic condition requiring focused educational attention right now. The educational foundation — understanding how insulin, blood sugar, and meal structure interact — is valuable for everyone, not just people with diagnosed conditions. The resources and plan below introduce the core principles in a practical, evidence-based way. This educational profile does not constitute a health assessment or medical advice.",
  whatItMeansCitation: "Evidence-informed educational content — foundational principles of metabolic health.",
  planDays: [
    { day: 1, title: "The Protein Anchor Breakfast", content: "Build your breakfast around 25–30g of protein. This sets your blood sugar pattern for the whole day — the 'second meal effect' (Wolever et al., 1988).", locked: false },
    { day: 2, title: "Vegetables Before Carbohydrates", content: "At every meal today, eat non-starchy vegetables before carbohydrates. Shukla et al. (2017) found this reduced peak blood glucose by up to 37% with the exact same foods.", locked: false },
    { day: 3, title: "The 10-Minute Post-Meal Walk", content: "Walk for 10 minutes after your largest meal. Post-meal movement directly reduces the glucose peak after eating (Buffey et al., 2022).", locked: false },
    { day: 4, title: "Building Your Blood Sugar-Friendly Plate", content: "The framework for every meal — without calorie counting or complex rules.", locked: true },
    { day: 5, title: "Your Starter Shopping List", content: "High-protein, high-fibre staples adapted for your country.", locked: true },
    { day: 6, title: "Your First Metabolic-Health Recipe", content: "A 25-minute dinner built around the principles from days 1–3.", locked: true },
    { day: 7, title: "Week 1 Review + Next Steps", content: "Self-check: what felt different this week, and what to focus on next.", locked: true },
  ],
  articles: [
    { href: "/learn/what-is-insulin-resistance", title: "What Is Insulin Resistance?", category: "Insulin Resistance" },
    { href: "/learn/nutrition", title: "Eating for Metabolic Health", category: "Nutrition" },
    { href: "/learn/microbiome", title: "Your Gut Microbiome and Metabolic Health", category: "Gut Microbiome" },
  ],
  planHref: "/pricing?recommended=starter&profile=general_wellness",
};

// ── Profile content lookup map ────────────────────────────────────────────────
// Used by matcher-v2.ts to select content by profile key without a switch statement.

export const PROFILE_CONTENT: Record<string, ProfileContentBase> = {
  pcos:                PCOS_RESULT,
  nafld:               NAFLD_RESULT,
  metabolic_syndrome:  METABOLIC_SYNDROME_RESULT,
  prediabetes:         PREDIABETES_RESULT,
  insulin_resistance:  INSULIN_RESISTANCE_RESULT,
  weight_loss_friction: WEIGHT_LOSS_FRICTION_RESULT,
  general_wellness:    GENERAL_WELLNESS_RESULT,
};
