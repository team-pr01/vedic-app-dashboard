/*
  # Veda Text Management System

  1. New Tables
    - veda_texts
      - Stores both PDF and text-based Vedic content
      - Supports multiple formats and translations
    - veda_translations
      - Stores translations for text-based mantras
      - Tracks translation sources and versions
    - veda_categories
      - Hierarchical organization of Vedic texts
      - Supports different types of texts

  2. Security
    - Enable RLS on all tables
    - Policies for admin and user access
    - Version control for translations
*/

-- Create enum for veda types
CREATE TYPE veda_type AS ENUM (
  'rigveda',
  'samaveda',
  'yajurveda',
  'atharvaveda'
);

-- Create enum for content types
CREATE TYPE content_type AS ENUM (
  'pdf',
  'text'
);

-- Create veda_categories table
CREATE TABLE IF NOT EXISTS veda_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veda veda_type NOT NULL,
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES veda_categories(id),
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create veda_texts table
CREATE TABLE IF NOT EXISTS veda_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES veda_categories(id),
  title text NOT NULL,
  content_type content_type NOT NULL,
  content text,
  file_url text,
  mandala integer,
  sukta integer,
  verse integer,
  tags text[],
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_content CHECK (
    (content_type = 'pdf' AND file_url IS NOT NULL) OR
    (content_type = 'text' AND content IS NOT NULL)
  )
);

-- Create veda_translations table
CREATE TABLE IF NOT EXISTS veda_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text_id uuid REFERENCES veda_texts(id) ON DELETE CASCADE,
  language text NOT NULL,
  translation text NOT NULL,
  translator text,
  notes text,
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE veda_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE veda_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE veda_translations ENABLE ROW LEVEL SECURITY;

-- Policies for veda_categories
CREATE POLICY "Public can view categories"
  ON veda_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON veda_categories
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Policies for veda_texts
CREATE POLICY "Public can view published texts"
  ON veda_texts
  FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage texts"
  ON veda_texts
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Policies for veda_translations
CREATE POLICY "Public can view translations"
  ON veda_translations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage translations"
  ON veda_translations
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Insert default categories
INSERT INTO veda_categories (veda, name, description, order_index) VALUES
  ('rigveda', 'Rigveda', 'The oldest of the four Vedas', 1),
  ('samaveda', 'Samaveda', 'The Veda of melodies and chants', 2),
  ('yajurveda', 'Yajurveda', 'The Veda of liturgy and rituals', 3),
  ('atharvaveda', 'Atharvaveda', 'The Veda of everyday life', 4)
ON CONFLICT DO NOTHING;

-- Function to update text timestamps
CREATE OR REPLACE FUNCTION update_veda_text_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating text timestamps
CREATE TRIGGER update_veda_text_timestamp
BEFORE UPDATE ON veda_texts
FOR EACH ROW
EXECUTE FUNCTION update_veda_text_timestamp();

-- Function to update translation timestamps
CREATE OR REPLACE FUNCTION update_veda_translation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating translation timestamps
CREATE TRIGGER update_veda_translation_timestamp
BEFORE UPDATE ON veda_translations
FOR EACH ROW
EXECUTE FUNCTION update_veda_translation_timestamp();