/*
  # Vedic Text Management System

  1. New Tables
    - vedic_texts
      - Stores mantras and verses from different Vedas
      - Supports multiple translations
      - Includes metadata like mandala, sukta, verse numbers
    - vedic_translations
      - Stores translations in multiple languages
      - Tracks translation metadata and verification status

  2. Security
    - Enable RLS
    - Admin-only write access
    - Public read access for published texts
*/

-- Create enum for Veda types
CREATE TYPE veda_type AS ENUM (
  'rigveda',
  'samaveda',
  'yajurveda',
  'atharvaveda'
);

-- Create vedic_texts table
CREATE TABLE IF NOT EXISTS vedic_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veda_type veda_type NOT NULL,
  mandala_number integer,
  sukta_number integer,
  verse_number integer,
  book_number integer,
  chapter_number integer,
  original_text text NOT NULL,
  devanagari_text text,
  transliteration text,
  meter text,
  tags text[] DEFAULT '{}',
  notes text,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_structure CHECK (
    (veda_type = 'rigveda' AND mandala_number IS NOT NULL AND sukta_number IS NOT NULL AND verse_number IS NOT NULL) OR
    (veda_type != 'rigveda' AND book_number IS NOT NULL AND chapter_number IS NOT NULL AND verse_number IS NOT NULL)
  )
);

-- Create vedic_translations table
CREATE TABLE IF NOT EXISTS vedic_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text_id uuid REFERENCES vedic_texts(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  translation text NOT NULL,
  translator text NOT NULL,
  translation_type text NOT NULL CHECK (translation_type IN ('word_by_word', 'verse', 'commentary')),
  source text,
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES auth.users(id),
  verification_notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vedic_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vedic_translations ENABLE ROW LEVEL SECURITY;

-- Policies for vedic_texts
CREATE POLICY "Public can view published texts"
  ON vedic_texts
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage texts"
  ON vedic_texts
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND (
      SELECT is_admin FROM auth.users WHERE id = auth.uid()
    )
  );

-- Policies for vedic_translations
CREATE POLICY "Public can view translations"
  ON vedic_translations
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage translations"
  ON vedic_translations
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND (
      SELECT is_admin FROM auth.users WHERE id = auth.uid()
    )
  );

-- Function to update text timestamps
CREATE OR REPLACE FUNCTION update_vedic_text_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating text timestamps
CREATE TRIGGER update_vedic_text_timestamp
BEFORE UPDATE ON vedic_texts
FOR EACH ROW
EXECUTE FUNCTION update_vedic_text_timestamp();

-- Function to update translation timestamps
CREATE OR REPLACE FUNCTION update_vedic_translation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating translation timestamps
CREATE TRIGGER update_vedic_translation_timestamp
BEFORE UPDATE ON vedic_translations
FOR EACH ROW
EXECUTE FUNCTION update_vedic_translation_timestamp();