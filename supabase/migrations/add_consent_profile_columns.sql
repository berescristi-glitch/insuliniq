-- Migration: Sprint 3 — email consent, profile segmentation, unsubscribe safety
-- Run in Supabase Dashboard → SQL Editor BEFORE deploying the Sprint 3 code.
--
-- IMPORTANT — context:
--   newsletter_subscribers previously had no marketing consent flag.
--   Under GDPR (UK/EU), PECR, the Australian Spam Act 2003, and CAN-SPAM,
--   marketing email requires explicit prior consent. This migration adds:
--     • marketing_consent     — explicit opt-in checkbox at quiz Step 9
--     • consent_timestamp     — when consent was given (audit trail)
--     • consent_source        — e.g. 'quiz_step9' (for auditability)
--     • metabolic_profile     — enables profile-segmented nurture emails
--     • quiz_goal             — supplements profile for email personalisation
--     • region                — US / UK / AU (food examples, units)
--     • locale                — BCP47 locale string for future i18n
--     • unsubscribed_at       — soft-delete; do NOT hard-delete subscriber rows
--                               (hard-delete removes the proof of unsubscription)
--     • has_safety_flags      — indicates safety screening flags were checked;
--                               email templates must apply stronger disclaimers
--     • updated_at            — tracks last change for audit
--
-- The unsubscribe route is updated to SET unsubscribed_at = NOW() rather than
-- DELETE, preserving the audit trail required by GDPR Article 5(2) accountability.
--
-- Existing rows get marketing_consent = FALSE (safe default — never retroactively
-- consent subscribers who never saw a consent checkbox).

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS marketing_consent   BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_timestamp   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_source      TEXT,
  ADD COLUMN IF NOT EXISTS metabolic_profile   TEXT,
  ADD COLUMN IF NOT EXISTS quiz_goal           TEXT,
  ADD COLUMN IF NOT EXISTS region              TEXT,
  ADD COLUMN IF NOT EXISTS locale              TEXT,
  ADD COLUMN IF NOT EXISTS unsubscribed_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS has_safety_flags    BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW();

-- Index: cron reads only active, consented, unconfirmed-complete subscribers.
-- marketing_consent added as a leading filter column because the cron now
-- requires it before checking nurture status.
CREATE INDEX IF NOT EXISTS idx_nurture_consent_pending
  ON public.newsletter_subscribers (marketing_consent, nurture_started_at, nurture_completed)
  WHERE confirmed = TRUE
    AND marketing_consent = TRUE
    AND nurture_completed = FALSE
    AND unsubscribed_at IS NULL;

-- Index: profile-segmented lookup (for future profile-specific batch sends)
CREATE INDEX IF NOT EXISTS idx_subscriber_profile
  ON public.newsletter_subscribers (metabolic_profile)
  WHERE marketing_consent = TRUE
    AND unsubscribed_at IS NULL;

-- Comment: unsubscribed_at is NULL for active subscribers, set for unsubscribed.
-- The confirm-email route and all email-sending code must exclude unsubscribed_at IS NOT NULL.
COMMENT ON COLUMN public.newsletter_subscribers.marketing_consent IS
  'Explicit opt-in to marketing/nurture emails. Must be TRUE for any non-transactional email.';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribed_at IS
  'Soft-delete timestamp. NEVER hard-delete rows — this timestamp is the audit trail required by GDPR Art. 5(2).';
