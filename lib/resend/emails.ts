import { resend, FROM_EMAIL } from "./client";
import { generateEmailToken } from "@/lib/utils/email-tokens";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://insuliniq.com";

function unsubscribeUrl(email: string): string {
  const token = generateEmailToken(email);
  return `${APP_URL}/api/unsubscribe?e=${encodeURIComponent(email)}&t=${token}`;
}

function confirmUrl(email: string): string {
  const token = generateEmailToken(email);
  return `${APP_URL}/api/confirm-email?e=${encodeURIComponent(email)}&t=${token}`;
}

export async function sendConfirmationEmail(email: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Confirm your InsulinIQ subscription",
    html: confirmationEmailHtml(email),
  });
}

export async function sendWelcomeEmail(email: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to InsulinIQ — your free resources are inside",
    html: welcomeEmailHtml(email),
  });
}

export async function sendPurchaseConfirmationEmail(
  email: string,
  planName: string
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your InsulinIQ ${planName} is ready`,
    html: purchaseConfirmationHtml(email, planName),
  });
}

export async function sendWeeklyTipsEmail(email: string, tipHtml: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "This week's metabolic health insight",
    html: weeklyTipsHtml(email, tipHtml),
  });
}

// ── Email templates ───────────────────────────────────────────────────

function baseLayout(content: string, email: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>InsulinIQ</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="background:#065f46;padding:24px 40px;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">InsulinIQ</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
                This content is for educational purposes only and does not constitute medical advice.
                Always consult a qualified healthcare provider.<br/><br/>
                InsulinIQ · <a href="${unsubscribeUrl(email)}" style="color:#9ca3af;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function confirmationEmailHtml(email: string) {
  return baseLayout(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Confirm your subscription</h1>
    <p style="color:#374151;line-height:1.6;">
      Click the button below to confirm your email and receive weekly metabolic health tips from InsulinIQ.
    </p>
    <a href="${confirmUrl(email)}"
       style="display:inline-block;margin-top:24px;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
      Confirm My Subscription
    </a>
    <p style="margin-top:24px;color:#6b7280;font-size:13px;">
      If you didn't sign up for InsulinIQ, you can safely ignore this email.
    </p>
  `, email);
}

function welcomeEmailHtml(email: string) {
  return baseLayout(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Welcome to InsulinIQ!</h1>
    <p style="color:#374151;line-height:1.6;">
      You've taken the first step toward understanding your metabolic health.
      Here's what you can explore right now:
    </p>
    <ul style="color:#374151;line-height:2;padding-left:20px;">
      <li><strong>Take the free quiz</strong> — get your personalized metabolic profile</li>
      <li><strong>Explore condition hubs</strong> — PCOS, prediabetes, NAFLD &amp; more</li>
      <li><strong>Browse low-glycemic recipes</strong> — practical meal ideas</li>
    </ul>
    <a href="${APP_URL}/quiz"
       style="display:inline-block;margin-top:24px;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
      Take the Free Quiz
    </a>
    <p style="margin-top:32px;color:#6b7280;font-size:13px;">
      Questions? Reply to this email — we read everything.
    </p>
  `, email);
}

function purchaseConfirmationHtml(email: string, planName: string) {
  return baseLayout(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">You're in — ${planName} activated</h1>
    <p style="color:#374151;line-height:1.6;">
      Your plan is now active. Head to your dashboard to access all your content,
      personalized meal plans, and educational content.
    </p>
    <a href="${APP_URL}/dashboard"
       style="display:inline-block;margin-top:24px;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
      Go to Dashboard
    </a>
  `, email);
}

function weeklyTipsHtml(email: string, tipHtml: string) {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">This week on InsulinIQ</h2>
    ${tipHtml}
    <a href="${APP_URL}/learn"
       style="display:inline-block;margin-top:24px;color:#059669;text-decoration:none;font-weight:600;">
      Read more articles →
    </a>
  `, email);
}

// ── Nurture sequence (14 days) ────────────────────────────────────────────────
// Called by app/api/cron/nurture/route.ts — one email per subscriber per day.

// Shared CTA button used across paid-offer emails — links to /pricing only, no fake scarcity.
function ctaButton(label: string): string {
  return `<a href="${APP_URL}/pricing"
     style="display:inline-block;margin-top:24px;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">${label}</a>`;
}


const NURTURE_TEMPLATES: Record<
  number,
  { subject: string; html: (email: string) => string }
> = {
  1: {
    subject: "Your Metabolic Profile results are ready",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Your Metabolic Profile results are ready</h1>
      <p style="color:#374151;line-height:1.6;">
        Thank you for completing the InsulinIQ Metabolic Quiz. Based on your answers, we've assembled
        a personalised profile that highlights the areas most relevant to your metabolic health journey.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Over the next two weeks you'll receive a short daily email — each one focused on a single,
        actionable concept drawn from the latest metabolic health research. No noise, no filler.
      </p>
      <p style="color:#374151;line-height:1.6;">
        If you'd like to go deeper right now, our <strong>Starter Kit</strong> gives you a condition-specific
        guide, a low-glycemic recipe collection, and a lab-values companion — everything in one download.
      </p>
      ${ctaButton("Get the Starter Kit — one-time access")}
      <p style="margin-top:24px;color:#6b7280;font-size:13px;">
        Not ready yet? No pressure — keep reading and we'll revisit when the time is right.
      </p>
    `,
        email
      ),
  },

  2: {
    subject: "What insulin actually does (and why it matters to you)",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">What insulin actually does</h1>
      <p style="color:#374151;line-height:1.6;">
        Insulin is often described simply as "the blood-sugar hormone," but that framing misses most of the picture.
        Think of insulin as a key and every cell in your body as a room with a locked door. When you eat carbohydrates,
        glucose enters your bloodstream and your pancreas releases insulin — the key — to unlock those doors so
        glucose can enter cells and be used for energy.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Insulin resistance occurs when the locks start to malfunction. The key is still being produced — often in
        greater quantities than normal — but the doors won't open as easily. Your pancreas compensates by making
        more keys. Over time this overproduction places significant strain on the beta cells responsible for
        insulin manufacture.
      </p>
      <p style="color:#374151;line-height:1.6;">
        <strong>Why this matters:</strong> chronically elevated insulin (hyperinsulinemia) doesn't just affect
        blood sugar. Research links it to increased fat storage — particularly visceral fat — disrupted sex hormone
        balance, and altered hunger signalling (Crofts et al., 2015).
      </p>
      <p style="color:#374151;line-height:1.6;">
        Tomorrow we'll look at the specific reason you might feel exhausted after certain meals — and what
        it tells you about your metabolic state.
      </p>
    `,
        email
      ),
  },

  3: {
    subject: "Why you get tired after eating (the real explanation)",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Why you get tired after eating</h1>
      <p style="color:#374151;line-height:1.6;">
        Post-meal fatigue — sometimes called the "food coma" — is one of the most common complaints among people
        with insulin resistance, yet it's also one of the most misunderstood. It isn't simply about eating too much.
      </p>
      <p style="color:#374151;line-height:1.6;">
        When a meal raises blood glucose rapidly, your pancreas releases a large insulin surge to bring it back down.
        In people with some degree of insulin resistance, this surge can overshoot — driving glucose lower than
        ideal for a short window. The result: brain fog, heaviness, and a strong urge to sleep.
      </p>
      <p style="color:#374151;line-height:1.6;">
        <strong>Macronutrient sequencing</strong> is one of the most well-supported strategies for blunting this
        response. Research by Shukla et al. (2017) found that eating vegetables and protein <em>before</em>
        carbohydrates at the same meal reduced the peak glucose response by up to 37% compared with eating
        carbohydrates first.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Practical starting point: at your next mixed meal, try starting with the leafy or non-starchy vegetables,
        then the protein source, and finishing with any starchy or grain-based components. The total food is
        identical — the order changes the metabolic signal.
      </p>
    `,
        email
      ),
  },

  4: {
    subject: "What the research says happens in the first 60 days",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">What 60 days of consistent change can look like</h1>
      <p style="color:#374151;line-height:1.6;">
        Clinical research on lifestyle interventions for insulin resistance consistently identifies a
        recognisable pattern in the first two months — one that is worth knowing about before you start,
        because the timeline of change is often counterintuitive.
      </p>
      <p style="color:#374151;line-height:1.6;">
        In intervention studies where participants restructure meals around higher protein, add brief
        post-meal movement, and reduce refined carbohydrate load, the most commonly reported early changes
        are: improved afternoon energy stability, reduced cravings between meals, and better sleep quality.
        These typically appear within two to four weeks.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Measurable changes in fasting glucose, fasting insulin, and triglycerides tend to follow at the
        six to twelve week mark — which is why short-term scale results are a poor proxy for whether the
        intervention is working (Esposito et al., 2004; Estruch et al., 2013).
      </p>
      <p style="color:#374151;line-height:1.6;">
        The three changes most consistently associated with early improvement across studies:
      </p>
      <ul style="color:#374151;line-height:2;padding-left:20px;">
        <li>Protein at every meal (minimum 25–30 g per sitting)</li>
        <li>10-minute walk after the two largest meals of the day</li>
        <li>Replacing a high-carbohydrate breakfast with a protein-anchored one</li>
      </ul>
      <p style="color:#374151;line-height:1.6;">
        Tomorrow we cover the specific lab tests worth asking your doctor about — and the one marker
        that most standard panels miss entirely.
      </p>
    `,
        email
      ),
  },

  5: {
    subject: "The hidden sugar audit (free worksheet inside)",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">The hidden sugar audit</h1>
      <p style="color:#374151;line-height:1.6;">
        Most people know that sweets and soft drinks contain sugar. Fewer realise that some of the highest
        glycaemic-load foods in a typical diet wear a health halo — flavoured yoghurts, granola bars, "whole grain"
        cereals, store-bought salad dressings, fruit juices, and flavoured coffees can each contain as much
        sugar as a dessert.
      </p>
      <p style="color:#374151;line-height:1.6;">
        <strong>Common hidden sugar sources to check:</strong>
      </p>
      <ul style="color:#374151;line-height:2;padding-left:20px;">
        <li>Low-fat flavoured yoghurt (often 20–28 g sugar per serving)</li>
        <li>Commercially prepared smoothies (40–60 g sugar)</li>
        <li>Bottled sauces and marinades (4–8 g per tablespoon)</li>
        <li>"Energy" or "protein" bars (14–30 g sugar)</li>
        <li>Flavoured oat milks (7–15 g per cup vs. 0 g unsweetened)</li>
      </ul>
      <p style="color:#374151;line-height:1.6;">
        A useful exercise: go through three days of your usual eating and check each packaged item for
        total sugars per serving. Most people find two or three surprising sources they hadn't considered.
        Once identified, a single swap — plain yoghurt instead of flavoured, unsweetened oat milk instead
        of flavoured — can remove 15–25 g of sugar per day without any other change.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Tomorrow we look at why the scale may not be moving yet — and why that doesn't mean the
        intervention isn't working.
      </p>
    `,
        email
      ),
  },

  6: {
    subject: "Why you might be making progress and not know it yet",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Progress you can't see yet</h1>
      <p style="color:#374151;line-height:1.6;">
        One of the most discouraging things about early metabolic improvement is that the most significant
        changes happen at the cellular and hormonal level — well before the scale moves or energy obviously
        improves.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Within the first two to four weeks of meaningful dietary and movement changes, research shows
        measurable reductions in fasting insulin levels, improvements in post-meal glucose variability,
        and reduced inflammatory markers — none of which are visible in the mirror (Esposito et al., 2004).
      </p>
      <p style="color:#374151;line-height:1.6;">
        Liver glycogen stores begin to normalise. Mitochondrial density in muscle cells starts to increase.
        Gut microbiome composition begins shifting toward more metabolically favourable profiles. These
        are real, measurable improvements happening even when the outer evidence lags.
      </p>
      <p style="color:#374151;line-height:1.6;">
        The practical takeaway: don't evaluate week one or two by how you look. Evaluate it by consistency —
        did you apply the principles more days than not? If yes, the internal work is almost certainly
        already underway.
      </p>
    `,
        email
      ),
  },

  7: {
    subject: "Everything InsulinIQ has to offer — and an honest invitation",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">An honest invitation</h1>
      <p style="color:#374151;line-height:1.6;">
        You're one week into your series. Before we continue with the educational content, we want to be
        direct about what InsulinIQ membership actually includes — and why some people find it useful.
      </p>
      <p style="color:#374151;line-height:1.6;">
        <strong>What InsulinIQ gives you access to:</strong>
      </p>
      <ul style="color:#374151;line-height:2;padding-left:20px;">
        <li>Condition hubs with structured educational content: PCOS, prediabetes, NAFLD, obesity</li>
        <li>Evidence-based articles on insulin resistance, nutrition, metabolic health markers</li>
        <li>The metabolic quiz with a personalised profile and reading recommendations</li>
        <li>Meal plans adapted to the US, UK, and Australian markets</li>
      </ul>
      <p style="color:#374151;line-height:1.6;">
        We don't claim any specific outcome. What the platform provides is well-organised,
        evidence-cited information — the kind that would otherwise take hours of research to find
        and evaluate independently.
      </p>
      ${ctaButton("View membership options")}
      <p style="margin-top:16px;color:#6b7280;font-size:13px;">
        Not the right time? The free content keeps coming regardless. No pressure.
      </p>
    `,
        email
      ),
  },

  8: {
    subject: "The lab values worth asking about at your next appointment",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Lab values worth knowing about</h1>
      <p style="color:#374151;line-height:1.6;">
        Standard blood panels often miss the most informative metabolic markers. Here are four values
        worth discussing with your healthcare provider — they give a far more complete picture of
        metabolic health than glucose alone.
      </p>
      <ul style="color:#374151;line-height:2.2;padding-left:20px;">
        <li>
          <strong>Fasting insulin</strong> — not included in most standard panels. Elevated levels
          (above ~10 µIU/mL in many labs) can indicate insulin resistance years before glucose is affected.
        </li>
        <li>
          <strong>HbA1c</strong> — a 90-day average of blood glucose. Optimal range is generally
          below 5.7%; 5.7–6.4% is considered prediabetic in US guidelines.
        </li>
        <li>
          <strong>Fasting triglycerides</strong> — below 100 mg/dL (1.1 mmol/L) is considered optimal
          by many metabolic health researchers; elevated triglycerides correlate strongly with
          insulin resistance.
        </li>
        <li>
          <strong>HOMA-IR</strong> — calculated from fasting glucose and fasting insulin, this index
          estimates insulin resistance directly. A value below 1.0 is considered optimal; above 1.9
          suggests insulin resistance (Matthews et al., 1985).
        </li>
      </ul>
      <p style="color:#374151;line-height:1.6;">
        Knowing which numbers to request — and what ranges to aim for — is one of the most empowering
        things you can do before your next appointment. Our Lab Values Companion guide covers all four
        in detail, with reference ranges for US, UK, and Australian lab reporting conventions.
      </p>
    `,
        email
      ),
  },

  9: {
    subject: "A dinner that supports stable energy (recipe inside, free)",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Lemon Herb Salmon with Chickpeas</h1>
      <p style="color:#374151;line-height:1.6;">
        This recipe takes about 25 minutes start to finish and combines three elements that consistently
        support stable post-meal glucose: omega-3 fatty acids (from salmon), soluble fibre (from chickpeas),
        and non-starchy vegetables. It's designed to be satiating without a large glycaemic load.
      </p>
      <p style="color:#374151;line-height:1.6;"><strong>Ingredients (serves 2):</strong></p>
      <ul style="color:#374151;line-height:2;padding-left:20px;">
        <li>2 salmon fillets (approx. 150 g / 5 oz each)</li>
        <li>1 can chickpeas (400 g / 15 oz), drained and rinsed</li>
        <li>2 large handfuls baby spinach</li>
        <li>1 lemon — juice and zest</li>
        <li>2 garlic cloves, minced</li>
        <li>2 tbsp olive oil</li>
        <li>1 tsp dried oregano, salt and pepper to taste</li>
      </ul>
      <p style="color:#374151;line-height:1.6;"><strong>Method:</strong></p>
      <ol style="color:#374151;line-height:2;padding-left:20px;">
        <li>Heat 1 tbsp oil in an oven-safe pan at medium-high. Season salmon, cook skin-side up for 3 min.</li>
        <li>Flip salmon. Add garlic to pan, stir 30 seconds.</li>
        <li>Add chickpeas, lemon juice, zest, oregano. Toss to coat and heat through (3–4 min).</li>
        <li>Remove pan from heat, fold in spinach until just wilted.</li>
        <li>Serve salmon over the chickpea base. Drizzle remaining olive oil over top.</li>
      </ol>
      <p style="color:#374151;line-height:1.6;">
        For a short post-meal walk of 10 minutes after this dinner, research suggests a meaningful
        reduction in post-meal glucose compared with remaining seated (Buffey et al., 2022).
      </p>
    `,
        email
      ),
  },

  10: {
    subject: "Two popular nutrition ideas the evidence doesn't fully support",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Two nutrition ideas to reconsider</h1>
      <p style="color:#374151;line-height:1.6;">
        Nutrition information moves fast — and not everything that becomes mainstream practice turns out
        to be well-supported by evidence. Here are two ideas worth examining more carefully.
      </p>
      <p style="color:#374151;line-height:1.6;">
        <strong>1. "Eating every 2–3 hours keeps your metabolism high."</strong><br/>
        This idea was popularised in bodybuilding communities in the 1990s and spread widely. The underlying
        claim — that frequent small meals prevent metabolic slowdown — has not been consistently supported
        in controlled studies. A 2010 review by Cameron et al. found no metabolic advantage to eating
        frequency in healthy adults. For people with insulin resistance specifically, frequent eating
        means more frequent insulin release, which may work against metabolic recovery rather than support it.
      </p>
      <p style="color:#374151;line-height:1.6;">
        <strong>2. "Intermittent fasting works for everyone with metabolic issues."</strong><br/>
        Time-restricted eating has genuine evidence behind it in some populations (Sutton et al., 2018),
        but it is not a universal fit. For people with a history of disordered eating, certain hormonal
        conditions, or blood sugar instability, extended fasting windows can cause more disruption than
        benefit. The research supports exploring time-restricted eating — it does not support assuming
        it is optimal for every metabolic profile.
      </p>
      <p style="color:#374151;line-height:1.6;">
        The principle: treat every nutrition strategy as a hypothesis to test against your own response,
        not a rule to apply without feedback.
      </p>
    `,
        email
      ),
  },

  11: {
    subject: "What a metabolically supportive breakfast actually looks like",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">The protein-anchor breakfast framework</h1>
      <p style="color:#374151;line-height:1.6;">
        Breakfast has an outsized effect on glucose patterns for the rest of the day — a phenomenon
        sometimes called the "second meal effect." A breakfast that causes a large glucose spike sets
        a pattern of reactivity that can persist through lunch and beyond (Wolever et al., 1988).
      </p>
      <p style="color:#374151;line-height:1.6;">
        The protein-anchor framework is simple: build every breakfast around a minimum of 25–30 g of
        protein as the centrepiece, then add fat and fibre around it. Carbohydrates are optional — not
        eliminated, but no longer the foundation.
      </p>
      <p style="color:#374151;line-height:1.6;"><strong>Practical examples:</strong></p>
      <ul style="color:#374151;line-height:2;padding-left:20px;">
        <li>3 eggs scrambled with spinach and feta + half an avocado (approx. 24 g protein)</li>
        <li>Plain Greek yoghurt (200 g) + 2 tbsp hemp seeds + a handful of berries (approx. 22 g protein)</li>
        <li>Smoked salmon (80 g) on 2 rye crackers with cream cheese and cucumber (approx. 20 g protein)</li>
        <li>Cottage cheese (150 g) with sliced tomato, olive oil, and black pepper (approx. 18 g protein)</li>
      </ul>
      <p style="color:#374151;line-height:1.6;">
        Each of these takes under 10 minutes. None of them require precise calorie counting. The goal
        is to raise the protein proportion until it reliably anchors your morning energy without the
        mid-morning crash.
      </p>
    `,
        email
      ),
  },

  12: {
    subject: "What metabolic researchers are focused on right now",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Five research directions in metabolic health</h1>
      <p style="color:#374151;line-height:1.6;">
        The science of metabolic health is moving quickly. Here are five areas where recent research is
        producing findings that will likely change clinical guidance within the next five years.
      </p>
      <ol style="color:#374151;line-height:2.2;padding-left:20px;">
        <li>
          <strong>Post-meal movement:</strong> even 2–3 minutes of light walking after eating measurably
          reduces glucose peaks (Buffey et al., 2022). This is now considered one of the highest
          return-on-time metabolic interventions available.
        </li>
        <li>
          <strong>Sleep and insulin sensitivity:</strong> a single night of poor sleep (under 6 hours)
          reduces insulin sensitivity the following day by approximately 25% (Donga et al., 2010).
          Sleep quality is now treated as a first-order metabolic variable, not a lifestyle footnote.
        </li>
        <li>
          <strong>Gut microbiome composition:</strong> specific bacterial strains — including
          <em>Akkermansia muciniphila</em> — are associated with better glycaemic control in both
          animal models and emerging human research (Plovier et al., 2017; Depommier et al., 2019).
          Dietary fibre diversity is the primary modifiable driver.
        </li>
        <li>
          <strong>Muscle mass as metabolic tissue:</strong> skeletal muscle is the largest glucose-disposal
          organ in the body. Resistance training improves insulin sensitivity independently of weight loss
          (Strasser &amp; Schobersberger, 2011).
        </li>
        <li>
          <strong>Cortisol and glucose:</strong> chronic psychological stress elevates cortisol, which
          directly raises blood glucose and impairs insulin signalling (Hackett &amp; Steptoe, 2017).
          Stress regulation is increasingly viewed as a metabolic intervention, not merely a
          quality-of-life consideration.
        </li>
      </ol>
    `,
        email
      ),
  },

  13: {
    subject: "One concept before tomorrow's final email",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">The most underrated metabolic lever</h1>
      <p style="color:#374151;line-height:1.6;">
        A short note before tomorrow's final email in your series.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Over 13 days we've covered insulin mechanics, meal sequencing, sleep, post-meal movement,
        hidden sugars, lab markers, and breakfast structure. One lever that hasn't had its own email
        yet: <strong>meal timing consistency</strong>.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Research on circadian biology and metabolism shows that eating at consistent times each day —
        regardless of what you eat — supports more predictable insulin secretion patterns and better
        overnight metabolic recovery (Pot et al., 2016). Irregular meal timing is associated with
        higher fasting glucose and greater glycaemic variability independent of diet quality.
      </p>
      <p style="color:#374151;line-height:1.6;">
        This doesn't mean meals must be at exactly the same minute each day. It means avoiding large
        day-to-day shifts — eating lunch at noon on weekdays and at 3pm on weekends, for example,
        creates a circadian mismatch that shows up in metabolic markers.
      </p>
      <p style="color:#374151;line-height:1.6;">
        If you've found this series useful and want to go further, tomorrow's email covers what
        InsulinIQ membership includes and how to get started.
      </p>
    `,
        email
      ),
  },

  14: {
    subject: "Last email in your series — and what happens next",
    html: (email) =>
      baseLayout(
        `
      <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">That's the 14-day series — thank you</h1>
      <p style="color:#374151;line-height:1.6;">
        This is the final email in your InsulinIQ nurture sequence. Over the past two weeks we've
        covered the mechanics of insulin resistance, post-meal glucose management, hidden sugar sources,
        the most informative lab values, a practical recipe, two nutrition myths, the protein-anchor
        breakfast framework, and five active research directions.
      </p>
      <p style="color:#374151;line-height:1.6;">
        If you've found this useful but haven't yet explored membership, this is the last time we'll
        mention it in an automated sequence. Membership gives you structured access to everything
        InsulinIQ has built — condition hubs, recipes, educational guides, and monthly content refreshes.
      </p>
      ${ctaButton("Explore membership options")}
      <p style="color:#374151;line-height:1.6;margin-top:24px;">
        Whether or not membership is right for you, you'll continue to receive our weekly newsletter —
        one short, well-cited piece of metabolic health content each week. No daily emails from here on.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Thank you for your time and trust. The whole point of InsulinIQ is to make the evidence
        accessible — we hope these 14 days have done that.
      </p>
      <p style="color:#374151;line-height:1.6;">— The InsulinIQ Team</p>
    `,
        email
      ),
  },
};

/**
 * Send a single nurture email for the given day (1–14).
 * Called exclusively by the /api/cron/nurture route handler.
 * Throws if day is out of range — the caller should catch and log.
 */
export async function sendNurtureEmail(
  email: string,
  day: number
): Promise<void> {
  const template = NURTURE_TEMPLATES[day];
  if (!template) {
    throw new Error(`sendNurtureEmail: no template for day ${day}`);
  }
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: template.subject,
    html: template.html(email),
  });
}
