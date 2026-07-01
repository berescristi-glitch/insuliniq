-- Migration: Quiz analytics events
-- Lightweight event log for comparing v1 vs v2 quiz performance.
-- NO personal data, NO health data, NO PII stored here.
-- Never log: email, sex, symptoms, safety flags (specifics), weight, lab values.
-- OK to log: quiz_version, matched_profile, profile_confidence, completion_path, booleans.

CREATE TABLE IF NOT EXISTS public.quiz_analytics_events (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_version        TEXT        NOT NULL,                    -- 'v1' | 'v2'
  event_type          TEXT        NOT NULL,                    -- 'quiz_completed' | 'results_viewed' | 'pricing_clicked'
  matched_profile     TEXT,                                    -- e.g. 'pcos' | 'nafld'
  profile_confidence  TEXT,                                    -- 'high' | 'moderate' | 'low' (v2 only)
  completion_path     TEXT,                                    -- 'email' | 'skip' | 'view_only'
  marketing_consent   BOOLEAN,                                 -- true = opted in; false = opted out; null = not asked
  has_safety_flags    BOOLEAN,                                 -- boolean only — specific flags never logged
  source              TEXT        NOT NULL DEFAULT 'direct',   -- 'direct' | 'internal_test' | 'ab_test'
  session_hash        TEXT,                                    -- optional: SHA-256 of session_id (no raw ID)
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- This table is server-only analytics — no RLS needed for reads (admin only),
-- but restrict inserts to service-role key only.
-- No sensitive data to protect beyond what's already public (aggregate profiles).

CREATE INDEX IF NOT EXISTS idx_analytics_version_event
  ON public.quiz_analytics_events (quiz_version, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_profile
  ON public.quiz_analytics_events (matched_profile, quiz_version)
  WHERE event_type = 'quiz_completed';

COMMENT ON TABLE public.quiz_analytics_events IS
  'Non-PII event log for quiz A/B testing. No personal data stored.';
