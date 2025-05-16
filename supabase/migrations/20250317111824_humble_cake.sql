/*
  # Organizations Schema

  1. New Tables
    - organizations
      - Basic information about Gurukuls and Vedic institutions
      - Contact details and address
      - Courses and facilities
      - Capacity and management info

  2. Security
    - Enable RLS
    - Admin-only write access
    - Public read access
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('gurukul', 'vedic_institution', 'ashram')),
  description text NOT NULL,
  established_year integer NOT NULL,
  contact jsonb NOT NULL,
  address jsonb NOT NULL,
  head_teacher text NOT NULL,
  student_capacity integer NOT NULL,
  courses_offered text[] NOT NULL,
  facilities text[] NOT NULL,
  is_active boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage organizations"
  ON organizations
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Insert some sample data
INSERT INTO organizations (
  name,
  type,
  description,
  established_year,
  contact,
  address,
  head_teacher,
  student_capacity,
  courses_offered,
  facilities,
  image_url
) VALUES
(
  'Vedic Heritage Gurukul',
  'gurukul',
  'A traditional Gurukul focusing on Vedic education and Sanskrit studies',
  1995,
  '{"email": "contact@vedicgurukul.org", "phone": "+91-9876543210", "website": "https://vedicgurukul.org"}',
  '{"street": "123 Ashram Road", "city": "Rishikesh", "state": "Uttarakhand", "country": "India", "postal_code": "249201"}',
  'Acharya Ramesh Kumar',
  150,
  ARRAY['Vedic Mathematics', 'Sanskrit', 'Yoga', 'Vedic Rituals', 'Ayurveda'],
  ARRAY['Library', 'Meditation Hall', 'Yoga Center', 'Organic Farm'],
  'https://images.unsplash.com/photo-1609855245578-c862d820f35c'
),
(
  'Bharatiya Vidya Bhavan',
  'vedic_institution',
  'Modern institution preserving and promoting Vedic knowledge and culture',
  1980,
  '{"email": "info@bharatiyavidya.edu", "phone": "+91-9876543211", "website": "https://bharatiyavidya.edu"}',
  '{"street": "45 Knowledge Park", "city": "Varanasi", "state": "Uttar Pradesh", "country": "India", "postal_code": "221005"}',
  'Dr. Suresh Sharma',
  300,
  ARRAY['Vedanta', 'Sanskrit Literature', 'Classical Music', 'Vedic Astronomy'],
  ARRAY['Digital Library', 'Auditorium', 'Research Center', 'Hostel'],
  'https://images.unsplash.com/photo-1585951237318-9ea5e175b891'
);