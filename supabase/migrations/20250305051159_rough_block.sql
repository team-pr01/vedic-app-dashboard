/*
  # Consultancy Service Database Schema

  1. New Tables
    - doctors
      - Basic information about doctors
      - Specializations and ratings
      - Availability schedule
    
    - consultancy_categories
      - Different types of consultancy (Mind, Body, Family, etc.)
      - Category-specific attributes
    
    - appointments
      - Consultation bookings
      - Status tracking
      - Payment information
    
    - symptoms
      - User-reported symptoms
      - Category association
      - Severity tracking
    
    - doctor_availability
      - Doctor's schedule
      - Time slots
      - Booking status

  2. Security
    - Enable RLS on all tables
    - Policies for user access control
    - Doctor-specific access policies
*/

-- Create enum for appointment status
CREATE TYPE appointment_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

-- Create enum for consultation categories
CREATE TYPE consultation_category AS ENUM (
  'mind',
  'body',
  'family',
  'relationship',
  'social',
  'financial'
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  profile_image text,
  specialization text[] NOT NULL,
  qualification text[] NOT NULL,
  experience_years integer NOT NULL,
  rating decimal(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  consultation_fee decimal(10,2) NOT NULL,
  about text,
  languages text[],
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultancy categories table
CREATE TABLE IF NOT EXISTS consultancy_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name consultation_category NOT NULL,
  icon text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (doctor_id, day_of_week, start_time)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id),
  doctor_id uuid REFERENCES doctors(id),
  category_id uuid REFERENCES consultancy_categories(id),
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status appointment_status DEFAULT 'pending',
  symptoms text[],
  notes text,
  payment_status boolean DEFAULT false,
  payment_amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES consultancy_categories(id),
  symptom_text text NOT NULL,
  severity integer CHECK (severity BETWEEN 1 AND 5),
  date_reported date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id),
  patient_id uuid REFERENCES auth.users(id),
  doctor_id uuid REFERENCES doctors(id),
  rating integer CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (appointment_id, patient_id)
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultancy_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for doctors table
CREATE POLICY "Doctors can view their own profiles"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active doctors"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Policies for consultancy_categories table
CREATE POLICY "Categories are publicly viewable"
  ON consultancy_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for doctor_availability table
CREATE POLICY "Public can view available slots"
  ON doctor_availability
  FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Doctors can manage their availability"
  ON doctor_availability
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM doctors WHERE id = doctor_availability.doctor_id
  ));

-- Policies for appointments table
CREATE POLICY "Patients can view their appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM doctors WHERE id = appointments.doctor_id
  ));

CREATE POLICY "Patients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Policies for symptoms table
CREATE POLICY "Users can manage their symptoms"
  ON symptoms
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for reviews table
CREATE POLICY "Public can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Patients can create reviews for their appointments"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = patient_id AND
    auth.uid() IN (
      SELECT patient_id FROM appointments WHERE id = reviews.appointment_id
    )
  );

-- Insert default categories
INSERT INTO consultancy_categories (name, icon, description) VALUES
  ('mind', 'brain', 'Mental health and psychological well-being'),
  ('body', 'body', 'Physical health and medical concerns'),
  ('family', 'family', 'Family relationships and parenting'),
  ('relationship', 'heart', 'Personal relationships and couples counseling'),
  ('social', 'users', 'Social interactions and community'),
  ('financial', 'dollar-sign', 'Financial planning and advice')
ON CONFLICT DO NOTHING;

-- Function to update doctor ratings
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors
  SET 
    rating = (
      SELECT AVG(rating)::decimal(3,2)
      FROM reviews
      WHERE doctor_id = NEW.doctor_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE doctor_id = NEW.doctor_id
    )
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating doctor ratings
CREATE TRIGGER update_doctor_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_doctor_rating();