-- CivicFix Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'resident' CHECK (role IN ('resident', 'administrator')),
  neighborhood TEXT DEFAULT '',
  avatar_url TEXT,
  notification_preferences JSONB DEFAULT '{"email_notifications": true, "in_app_notifications": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'pothole', 'streetlight', 'garbage', 'water_leak',
    'damaged_sidewalk', 'traffic_signal', 'public_safety', 'other'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'emergency')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected'
  )),
  address TEXT NOT NULL DEFAULT '',
  neighborhood TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  assigned_department_id UUID REFERENCES departments(id),
  assigned_staff_id UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Report Images table
CREATE TABLE report_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Comments table
CREATE TABLE report_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'internal')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Status History table
CREATE TABLE report_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  old_status TEXT CHECK (old_status IN (
    'submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected'
  )),
  new_status TEXT NOT NULL CHECK (new_status IN (
    'submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected'
  )),
  changed_by UUID NOT NULL REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_neighborhood ON reports(neighborhood);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_report_images_report_id ON report_images(report_id);
CREATE INDEX idx_report_comments_report_id ON report_comments(report_id);
CREATE INDEX idx_report_status_history_report_id ON report_status_history(report_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Auto-generate report numbers
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(report_number FROM 10) AS INTEGER)), 0) + 1
  INTO next_num
  FROM reports;
  
  NEW.report_number := 'CF-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_report_number
  BEFORE INSERT ON reports
  FOR EACH ROW
  WHEN (NEW.report_number IS NULL OR NEW.report_number = '')
  EXECUTE FUNCTION generate_report_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default departments
INSERT INTO departments (name, description, contact_email) VALUES
  ('Public Works', 'Roads, sidewalks, water infrastructure, and general public works', 'publicworks@civicfix.gov'),
  ('Parks & Recreation', 'Parks, green spaces, recreational facilities, and public areas', 'parks@civicfix.gov'),
  ('Sanitation', 'Waste management, garbage collection, and recycling services', 'sanitation@civicfix.gov'),
  ('Transportation', 'Traffic signals, road signs, and transportation infrastructure', 'transportation@civicfix.gov'),
  ('Public Safety', 'Public safety concerns, hazards, and emergency situations', 'safety@civicfix.gov');
