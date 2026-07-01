-- Migration: Quiz v2 metadata columns
-- Run in Supabase Dashboard → SQL Editor before using the /quiz-v2 shadow route.
--
-- Adds two columns to quiz_results:
--   quiz_version     — distinguishes v1 from v2 quiz submissions
--   profile_confidence — 'high' | 'moderate' | 'low' (computed by matchProfileV2)
--
-- Both default to backward-compatible values so existing v1 rows are unaffected.
-- The Sprint 5 submitQuizV2 action writes 'v2' and the computed confidence level.
-- The existing submitQuiz action continues writing without these columns (Supabase
-- accepts the insert and uses the defaults; no code change needed in v1 action).

ALTER TABLE public.quiz_results
  ADD COLUMN IF NOT EXISTS quiz_version        TEXT NOT NULL DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS profile_confidence  TEXT;

-- Partial index: quick lookup of all v2 quiz submissions
CREATE INDEX IF NOT EXISTS idx_quiz_results_v2
  ON public.quiz_results (quiz_version)
  WHERE quiz_version = 'v2';

COMMENT ON COLUMN public.quiz_results.quiz_version IS
  'v1 = original 9-step quiz; v2 = 12-step Quick Quiz v2 (shadow route /quiz-v2)';
COMMENT ON COLUMN public.quiz_results.profile_confidence IS
  'Educational profile match confidence: high | moderate | low. Not a clinical certainty.';
