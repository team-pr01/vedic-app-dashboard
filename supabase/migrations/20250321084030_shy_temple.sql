/*
  # Project Management System

  1. New Tables
    - projects
      - Basic project information
      - Status tracking
      - Team members and visibility
      - Budget and timeline management

  2. Security
    - Enable RLS
    - Team member access control
    - Public/private visibility
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'completed', 'on_hold')),
  is_public boolean DEFAULT false,
  start_date date NOT NULL,
  end_date date,
  budget decimal(10,2) NOT NULL DEFAULT 0,
  team_members text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Team members can view their projects"
  ON projects
  FOR SELECT
  USING (
    auth.email() = ANY(team_members) OR
    is_public = true
  );

CREATE POLICY "Team members can edit their projects"
  ON projects
  FOR UPDATE
  USING (auth.email() = ANY(team_members))
  WITH CHECK (auth.email() = ANY(team_members));

CREATE POLICY "Team members can delete their projects"
  ON projects
  FOR DELETE
  USING (auth.email() = ANY(team_members));

CREATE POLICY "Authenticated users can create projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Function to update project timestamps
CREATE OR REPLACE FUNCTION update_project_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating project timestamps
CREATE TRIGGER update_project_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_project_timestamp();