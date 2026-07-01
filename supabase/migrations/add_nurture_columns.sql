-- Migration: add nurture sequence columns to newsletter_subscribers
-- Run in Supabase Dashboard → SQL Editor before deploying the nurture cron.
--
-- These columns track where each subscriber is in the 14-day email sequence.
-- nurture_started_at: set when a quiz result with an email is saved (Server Action
--   or quiz results page). Null = subscriber has not entered the nurture sequence.
-- nurture_completed: set to TRUE by the cron after day 14 email is sent successfully.
--   Prevents re-sending once the sequence is finished.

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS nurture_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS nurture_completed  BOOLEAN NOT NULL DEFAULT FALSE;

-- Partial index: only index rows the cron actually needs to read.
-- Skips rows that are unconfirmed or already completed — keeps the daily
-- cron query fast even as the subscribers table grows.
CREATE INDEX IF NOT EXISTS idx_nurture_pending
  ON public.newsletter_subscribers (nurture_started_at, nurture_completed)
  WHERE confirmed = TRUE AND nurture_completed = FALSE;
