# InsulinIQ Execution Roadmap — Quiz Results & Monetization Overhaul

**Source:** `raport extins.txt` (full strategic report — CRO audit, competitor analysis, pricing model, compliance risks, sprint plan).
**Purpose:** This file is the single source of truth for executing that report. Every checkbox here must be kept in sync with the actual codebase — not with intentions.

**Status legend:** ✅ Done &nbsp;·&nbsp; 🔶 Partial &nbsp;·&nbsp; ⬜ Not started &nbsp;·&nbsp; 🚫 Blocked

**Last audited against live code:** 2026-06-30, by direct file inspection (not assumption). Re-audit and update this file every time a task is picked up or completed — do not let it drift.

**Owner agents** (invoke via the Agent tool by name): `frontend` · `backend` · `copywriter` · `compliance` · `legal` · `strategist` · `analyst`

---

## 0. REALITY CHECK — what the report assumed vs. what's actually live

The report (`raport extins.txt`) was written against an earlier version of the codebase. A prior session already implemented most of Sprint 1. Do not re-do this work — verify it, close remaining gaps, and move to Sprint 2+.

Confirmed live as of this audit:
- `components/quiz/ResultsDisplay.tsx` — single shared 9-section results component used by **both** `app/quiz/results/page.tsx` (DB path) and `components/quiz/ResultsSkipShell.tsx` (skip path). The old `$19` vs `$27` price-fork no longer exists — both paths render the same component, same price, same copy.
- `lib/quiz/scorer.ts` — `computeEducationalScore()` powers the S2 Metabolic Snapshot bars.
- `components/quiz/LockedContent.tsx` + `StickyResultsCTA.tsx` + `SafetyNotice.tsx` — all built and wired in.
- `lib/quiz/matcher.ts` — `getSafetyNotice()` now returns a **per-flag** message (type1_diabetes/insulin, hypoglycemia meds, pregnant/breastfeeding, advanced liver disease, kidney disease, eating disorder history, under-18, catch-all) — Legal Risk #5 from the report is closed.
- `<MedicalDisclaimer />` correctly sequenced before the pricing CTA in `ResultsDisplay.tsx`.

---

## SPRINT 1 — Results Page Conversion Rebuild — 🔶 ~80% done

| # | Task | Status | Evidence / Gap | Owner |
|---|---|---|---|---|
| 1 | Fix $19 vs $27 price inconsistency (skip vs DB path) | ✅ Done | Both paths render shared `ResultsDisplay`; no `$19` anywhere in code | — |
| 2 | `computeEducationalScore()` + visual progress bars (S2) | ✅ Done | `lib/quiz/scorer.ts`, rendered in `ResultsDisplay.tsx` S2 | — |
| 3 | Reconstruct results page into 9 sections (S1–S9) | ✅ Done | All 9 sections present in `ResultsDisplay.tsx` (Hero, Snapshot, Friction Points, SafetyNotice, What It Means, First 7 Days, Unlock Plan, Evidence badges, Pricing, FAQ) | — |
| 4 | `<LockedContent>` for days 4–7, blurred preview + lock icon | ✅ Done | `components/quiz/LockedContent.tsx`, used in S5 | — |
| 5 | Personalize 3 friction points + "what this means" per profile | ✅ Done | All 5 profiles (`pcos`, `nafld`, `metabolic_syndrome`, `prediabetes`, `insulin_resistance`) have unique friction points, hero copy, citations in `matcher.ts` | — |
| 6 | Sticky CTA on mobile | ✅ Done | `components/quiz/StickyResultsCTA.tsx` | — |
| 7 | Evidence/editorial trust badges (S7) | ✅ Done | "Science-Cited / International Guidelines / Not Clinical Advice" badges in S7 | — |
| 8 | FAQ section (9 questions) | ✅ Done | `FaqItem` block in S9, 9 questions incl. refund/data/diabetes/medication | — |
| 9 | Personalize `SafetyNotice` per flag type (Legal Risk #5) | ✅ Done | `getSafetyNotice()` in `matcher.ts` returns distinct text per flag cluster | — |
| 10 | **Matcher still ignores 70% of quiz data for profile selection** | 🔶 Open | `matchProfile()` (`lib/quiz/matcher.ts:609-637`) only reads `goal` + `symptoms`. `region`, `dietPattern`, `allergens`, `cookingTime`, `cookingSkill`, `ageRange` are collected but never influence which profile/content is shown. Content depth per profile is now rich, but the *selection logic* is still the CRO #2 gap from the report. | `backend` |
| 11 | Social proof / testimonials on results page (Problem CRO #4/#6) | ⬜ Not started | No testimonial blocks in `ResultsDisplay.tsx` S6. Report requires `"Individual experience. Educational outcomes vary."` disclaimer under each — **do not add testimonials without real, verifiable quotes** (FTC/ASA risk if fabricated). | `copywriter` + `legal` review |
| 12 | Per-profile checkout pre-selection / anchor pricing on results page | ✅ Done (re-scoped) | `CheckoutButton` deep-links straight to checkout with `planId` from S6/S8, not a generic `/pricing` bounce. Pricing itself isn't profile-differentiated (single plan structure), so this resolves the report's intent. | — |

**Sprint 1 remaining work:** items 10 and 11 only.

---

## SPRINT 2 — Pricing + Paywall — ⬜ Not started (1 CRITICAL legal item open)

| # | Task | Status | Evidence / Gap | Owner |
|---|---|---|---|---|
| 1 | **Remove/clarify "Monthly live Q&A with Registered Dietitians"** | 🚨 CRITICAL — not fixed | `app/pricing/page.tsx:21` — `coreFeatures` array still lists this. CLAUDE.md confirms no such feature is built or scheduled. This is unfounded-claim exposure under FTC (US), ASA/CAP (UK), ACCC (AU) — see Legal Risk Register below. | `legal` → `copywriter` |
| 2 | Verify "Interactive Glycemic Response Meal Builder" and "Lab value tracking & HOMA-IR calculators" actually exist | ⬜ Unverified | Also listed in `app/pricing/page.tsx:17-23` `coreFeatures`. Need to confirm these are real, shipped features before they stay on a paid pricing page. | `legal` audit, then `backend`/`frontend` to build or `copywriter` to remove |
| 3 | One clearly recommended plan, anchor pricing | ✅ Done | Pricing page already has "Most popular" badge on Monthly, Annual anchored against monthly-equivalent ($16.58/mo) | — |
| 4 | Jurisdiction-specific statutory rights disclosure | ✅ Done | `app/pricing/page.tsx:209-233` — UK/AU/US refund rights in a `<details>` block | — |
| 5 | Checkout pre-populated with quiz profile | 🔶 Partial | Results page CTA links straight to checkout; pricing page itself is profile-agnostic (same 3 plans for everyone) — acceptable given current single-tier product, but report's idea of a profile-flavored checkout isn't implemented | `frontend` |
| 6 | Confirm 14-day guarantee has an operational refund process | ⬜ Unverified | Page promises "14-day satisfaction guarantee" (`pricing/page.tsx:203`) — **report explicitly warns: do not advertise a guarantee with no working refund process.** Need to confirm support@insuliniq.com refund handling actually exists operationally. | `legal` (flag), founder decision |
| 7 | Region/currency auto-detect or separate regional pricing | ⬜ Not started | Page says "available at checkout" — relies entirely on Lemon Squeezy's checkout-side localization | `backend` (verify LS config) |

---

## SPRINT 3 — Personalized Email Funnel — ⬜ Not started

| # | Task | Status | Evidence / Gap | Owner |
|---|---|---|---|---|
| 1 | Add `metabolic_profile` column to `newsletter_subscribers` | ⬜ Not started | `supabase/schema.sql:231-238` — table has `id, email, confirmed, country, source, created_at` only. No profile column. | `backend` |
| 2 | `enrollInNurture()` accepts and stores profile | ⬜ Not started | `actions/nurture.ts:43` — signature is `enrollInNurture(email: string)`, no profile param | `backend` |
| 3 | Per-profile email templates (PCOS/NAFLD/prediabetes/etc.) | ⬜ Not started | `lib/resend/emails.ts` — 14-day sequence is profile-agnostic today | `copywriter` |
| 4 | Extend funnel 14→21 days per report Section G | ⬜ Not started | Current sequence stops at day 14 (this is intentional per CLAUDE.md §21 — **confirm with user before changing cadence**, do not silently extend it | `copywriter`, needs sign-off |
| 5 | Consent checkbox for marketing emails at quiz Step 9 (Legal Risk #4) | 🚨 CRITICAL — not fixed | No opt-in checkbox found in `components/quiz/QuizStepper.tsx`. Email capture auto-enrolls into nurture with no separate, unticked marketing consent box. GDPR (UK)/CAN-SPAM (US)/Spam Act (AU) exposure. | `frontend` + `legal` |
| 6 | Deliverability + unsubscribe flow test | ⬜ Not started | Unsubscribe route exists (`app/api/unsubscribe/`) per CLAUDE.md — needs an end-to-end test pass | `backend` |

---

## SPRINT 4 — Tracker + Monthly Report — ⬜ Not started

| # | Task | Status | Owner |
|---|---|---|---|
| 1 | Daily self-report tracker (energy, cravings, adherence) in dashboard | ⬜ Not started | `frontend` + `backend` |
| 2 | Streak counter | ⬜ Not started | `frontend` + `backend` |
| 3 | Auto-generated monthly report (PDF or page) | ⬜ Not started | `backend` |
| 4 | Monthly score (0–100) | ⬜ Not started | `backend` |
| 5 | Email notification for monthly report | ⬜ Not started | `backend` + `copywriter` |

*This sprint is a genuine multi-day feature build (new tables, dashboard UI, scoring logic). Do not start without explicit go-ahead — it's a different scope than the copy/compliance fixes above.*

---

## SPRINT 5 — AI Assistant Guardrails — 🚫 Blocked

Blocked on the AI assistant itself being built. `lib/ai/` and `app/ai-assistant/` are empty per CLAUDE.md. Dashboard already correctly labels this "Coming Q3 2026" — do not build guardrails for a feature that doesn't exist yet. Revisit when the assistant is scheduled.

| # | Task | Status | Owner |
|---|---|---|---|
| 1 | System prompt guardrails (no diagnosis, no prescription, no individual lab interpretation) | 🚫 Blocked | `ai-engineer` |
| 2 | Explicit refusal patterns for medication/dosage questions | 🚫 Blocked | `ai-engineer` |
| 3 | Visible "not medical advice" UI disclaimer | 🚫 Blocked | `frontend` |
| 4 | Conversation logging policy (no medical PII without consent) | 🚫 Blocked | `backend` + `legal` |
| 5 | Crisis escalation path (local emergency number) | 🚫 Blocked | `ai-engineer` + `legal` |

---

## SPRINT 6 — Compliance Hardening — 🔶 Partial (2 CRITICAL items open)

| # | Task | Status | Evidence / Gap | Owner |
|---|---|---|---|---|
| 1 | Explicit health-data consent checkbox before quiz starts | 🚨 CRITICAL — not fixed | No pre-quiz consent gate found in quiz flow | `frontend` + `legal` |
| 2 | Marketing email opt-in checkbox at Step 9 | 🚨 CRITICAL — not fixed | Duplicate of Sprint 3 item 5 — tracked once here, fix once | `frontend` + `legal` |
| 3 | Functional delete-account / data-deletion flow | ⬜ Not started | `app/settings/page.tsx` has Profile + Password sections only — no data deletion or export option | `backend` + `frontend` |
| 4 | Written data retention policy, implemented technically | ⬜ Not started | No retention TTL logic found on `quiz_results` or `newsletter_subscribers` | `backend` + `legal` |
| 5 | Personalize `getSafetyNotice()` per flag type | ✅ Done | See Sprint 1 item 9 — already shipped | — |
| 6 | Full claims audit across home/condition hubs/pricing | ⬜ Not started | Pricing page claims (Sprint 2 item 1-2) already found unaudited; home/hub pages not yet checked | `legal` |
| 7 | Testimonial disclaimer requirement | N/A until testimonials exist | No testimonials currently shipped (see Sprint 1 item 11) — when added, every block needs the disclaimer | `copywriter` + `legal` |
| 8 | Cookie consent banner (GDPR/PECR UK, Privacy Act AU) | ⬜ Not started | Not found in `app/layout.tsx` or elsewhere | `frontend` + `legal` |
| 9 | Functional age gate (under-18 → involve adult/doctor) | 🔶 Partial | Quiz safety screening already catches `under_18` as a `SafetyFlag` and shows a tailored message post-quiz (`getSafetyNotice`), but there's no upfront age gate *before* quiz data collection | `frontend` + `legal` |
| 10 | Jurisdiction statutory rights disclosure on pricing | ✅ Done | See Sprint 2 item 4 | — |

---

## LEGAL RISK REGISTER (owned by the `legal` agent — keep this current)

| Risk | Status | Where | Severity |
|---|---|---|---|
| "Monthly live Q&A with Registered Dietitians" — unbuilt feature advertised on paid pricing page | 🚨 OPEN | `app/pricing/page.tsx:21` | CRITICAL — FTC/ASA/ACCC unfounded-claims exposure |
| No separate marketing-email consent checkbox at quiz email gate | 🚨 OPEN | `components/quiz/QuizStepper.tsx` (Step 9) | CRITICAL — GDPR/CAN-SPAM/Australian Spam Act |
| No explicit health-data consent before quiz begins | 🚨 OPEN | Quiz entry flow | CRITICAL — GDPR/UK Data Protection Act, Privacy Act 1988 (AU) |
| No functional delete-account / right-to-erasure flow | 🚨 OPEN | `app/settings/` | HIGH — GDPR Art. 17, Privacy Act 1988 (AU) |
| "14-day satisfaction guarantee" advertised without confirmed operational refund process | ⚠️ UNVERIFIED | `app/pricing/page.tsx:203` | HIGH — false advertising if refunds aren't actually honored |
| "Interactive Glycemic Response Meal Builder" / "Lab value tracking & HOMA-IR calculators" — unverified as shipped | ⚠️ UNVERIFIED | `app/pricing/page.tsx:19-20` | HIGH if not real, same exposure class as the dietitian claim |
| `matchProfile()` ignores region/diet/allergen/cooking-time/age data the quiz collects | 🔶 OPEN (CRO, not legal) | `lib/quiz/matcher.ts:609` | MEDIUM — credibility/trust risk if users notice |
| Cookie consent banner absent | ⬜ OPEN | site-wide | MEDIUM — PECR (UK) / Privacy Act (AU) |
| Data retention policy not implemented technically | ⬜ OPEN | `quiz_results`, `newsletter_subscribers` | MEDIUM |
| Safety notice personalization | ✅ RESOLVED | `lib/quiz/matcher.ts` `getSafetyNotice()` | — |
| Skip-path vs DB-path price inconsistency | ✅ RESOLVED | `ResultsDisplay.tsx` shared by both paths | — |

---

## TOP PRIORITY QUEUE (do these next, in order)

1. **Fix or remove "Monthly live Q&A with Registered Dietitians"** on `app/pricing/page.tsx` — 5 min, CRITICAL legal exposure, zero dependencies. *(`legal` flags exact rewrite, `copywriter` or `frontend` applies it)*
2. **Add marketing-consent checkbox at quiz Step 9** — separate from any existing Terms acceptance, unticked by default. *(`frontend`)*
3. **Add pre-quiz health-data consent gate** — short explicit checkbox before quiz questions begin. *(`frontend` + `legal` for copy)*
4. **Verify the 14-day guarantee and the two unverified pricing features** are real and operational — founder/business decision, `legal` to formally flag in writing if not.
5. **Extend `matchProfile()` to use region/diet/allergens/cooking time/age**, not just goal+symptoms. *(`backend`)*
6. **Add `metabolic_profile` column + personalize nurture emails** (Sprint 3). *(`backend` then `copywriter`)*
7. **Delete-account flow + data retention policy** (Sprint 6). *(`backend` + `legal`)*
8. **Cookie consent banner** (Sprint 6). *(`frontend` + `legal`)*
9. Sprint 4 (tracker/monthly report) — only after 1–8 are closed, given its size.
10. Sprint 5 (AI guardrails) — only when the AI assistant itself is scheduled to be built.

---

## Maintenance rule for this file

Whenever a task above is completed and verified in the live codebase (not just "agent said it's done" — actually re-read the file), flip its status to ✅ and add a one-line evidence pointer (file:line). Whenever a new legal/compliance issue is discovered, add it to the Legal Risk Register immediately, severity-sorted. This file should always answer, truthfully and immediately, "what's left to build?"
