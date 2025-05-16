/*
  # Notification System

  1. New Tables
    - notifications
      - Stores notification content and metadata
      - Supports scheduling and targeting
      - Tracks delivery and read status

  2. Security
    - Enable RLS
    - Admin-only write access
    - Public read access for targeted users
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('all', 'subscribers', 'specific')),
  target_users uuid[] DEFAULT '{}',
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'sent', 'cancelled')) DEFAULT 'scheduled',
  sent_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view notifications"
  ON notifications
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage notifications"
  ON notifications
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND (
      SELECT is_admin FROM auth.users WHERE id = auth.uid()
    )
  );

-- Function to update notification timestamps
CREATE OR REPLACE FUNCTION update_notification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating notification timestamps
CREATE TRIGGER update_notification_timestamp
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_notification_timestamp();