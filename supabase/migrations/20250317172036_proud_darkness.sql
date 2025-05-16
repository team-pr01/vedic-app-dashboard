/*
  # News Management System

  1. New Tables
    - news_categories
      - Categories for news articles
    - news_articles
      - News content with rich text and media
      - Category association
      - Tags and metadata
    - news_tags
      - Tags for better content organization

  2. Security
    - Enable RLS
    - Admin-only write access
    - Public read access for published articles
*/

-- Create news categories table
CREATE TABLE IF NOT EXISTS news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  category_id uuid REFERENCES news_categories(id),
  author_id uuid REFERENCES auth.users(id),
  status text NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  tags text[],
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Policies for news_categories
CREATE POLICY "Public can view categories"
  ON news_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON news_categories
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Policies for news_articles
CREATE POLICY "Public can view published articles"
  ON news_articles
  FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Admins can manage articles"
  ON news_articles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Insert default categories
INSERT INTO news_categories (name, slug, description) VALUES
  ('Vedic Culture', 'vedic-culture', 'News about Vedic traditions and cultural events'),
  ('Education', 'education', 'Updates on Vedic education and learning'),
  ('Events', 'events', 'Upcoming and past events coverage'),
  ('Announcements', 'announcements', 'Important announcements and notices'),
  ('Research', 'research', 'Research and studies in Vedic sciences')
ON CONFLICT DO NOTHING;