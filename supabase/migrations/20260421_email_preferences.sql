-- Add email preference fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_notifications_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS marketing_consent           boolean NOT NULL DEFAULT false;

-- Index for bulk marketing queries
CREATE INDEX IF NOT EXISTS idx_profiles_marketing_consent
  ON profiles (marketing_consent, email_notifications_enabled)
  WHERE marketing_consent = true AND email_notifications_enabled = true;
