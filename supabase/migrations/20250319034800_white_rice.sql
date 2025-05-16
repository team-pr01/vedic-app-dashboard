/*
  # Popup Notifications System

  1. New Tables
    - popup_notifications
      - Stores popup content and settings
      - Supports image, text, and CTA button
      - Scheduling and targeting options

  2. Security
    - Enable RLS
    - Admin-only write access
    - Public read access for active popups
*/

-- Create popup_notifications table
CREATE TABLE IF NOT EXISTS popup_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  button_text text,
  button_link text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  display_frequency text NOT NULL CHECK (display_frequency IN ('once', 'every_visit', 'daily', 'weekly')),
  target_audience text[] DEFAULT ARRAY['all'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE popup_notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active popups"
  ON popup_notifications
  FOR SELECT
  USING (
    is_active = true AND
    start_date <= now() AND
    end_date >= now()
  );

CREATE POLICY "Admins can manage popups"
  ON popup_notifications
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND (
      SELECT is_admin FROM auth.users WHERE id = auth.uid()
    )
  );