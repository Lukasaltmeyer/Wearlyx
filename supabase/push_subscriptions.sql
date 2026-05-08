-- Table pour stocker les abonnements push Web Push (VAPID)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own push sub" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);
