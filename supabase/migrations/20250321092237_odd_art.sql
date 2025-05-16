-- Create emergency_messages table
CREATE TABLE IF NOT EXISTS emergency_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  target_groups text[] NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'resolved', 'archived')) DEFAULT 'active',
  sent_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  sent_by uuid REFERENCES auth.users(id),
  acknowledgments uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE emergency_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view emergency messages"
  ON emergency_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create emergency messages"
  ON emergency_messages
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND (
      SELECT is_admin FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update emergency messages"
  ON emergency_messages
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND (
      SELECT is_admin FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete emergency messages"
  ON emergency_messages
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND (
      SELECT is_admin FROM auth.users WHERE id = auth.uid()
    )
  );

-- Function to update emergency message timestamps
CREATE OR REPLACE FUNCTION update_emergency_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating emergency message timestamps
CREATE TRIGGER update_emergency_message_timestamp
BEFORE UPDATE ON emergency_messages
FOR EACH ROW
EXECUTE FUNCTION update_emergency_message_timestamp();