-- CivicFix Row-Level Security Policies
-- Run this after schema.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrator'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ==========================================
-- PROFILES POLICIES
-- ==========================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- REPORTS POLICIES
-- ==========================================

-- Anyone can view reports (public data)
CREATE POLICY "Anyone can view reports"
  ON reports FOR SELECT
  USING (true);

-- Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports (limited fields)
CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can update any report
CREATE POLICY "Admins can update any report"
  ON reports FOR UPDATE
  USING (is_admin());

-- Admins can delete reports
CREATE POLICY "Admins can delete reports"
  ON reports FOR DELETE
  USING (is_admin());

-- ==========================================
-- REPORT IMAGES POLICIES
-- ==========================================

-- Anyone can view report images
CREATE POLICY "Anyone can view report images"
  ON report_images FOR SELECT
  USING (true);

-- Users can add images to their own reports
CREATE POLICY "Users can add images to own reports"
  ON report_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports WHERE id = report_id AND user_id = auth.uid()
    )
  );

-- Admins can add images to any report
CREATE POLICY "Admins can add images to any report"
  ON report_images FOR INSERT
  WITH CHECK (is_admin());

-- Users can delete images from their own reports
CREATE POLICY "Users can delete images from own reports"
  ON report_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM reports WHERE id = report_id AND user_id = auth.uid()
    )
  );

-- Admins can delete any images
CREATE POLICY "Admins can delete any images"
  ON report_images FOR DELETE
  USING (is_admin());

-- ==========================================
-- REPORT COMMENTS POLICIES
-- ==========================================

-- Anyone can view public comments
CREATE POLICY "Anyone can view public comments"
  ON report_comments FOR SELECT
  USING (visibility = 'public');

-- Admins can view all comments including internal
CREATE POLICY "Admins can view all comments"
  ON report_comments FOR SELECT
  USING (is_admin());

-- Users can view comments on their own reports
CREATE POLICY "Users can view comments on own reports"
  ON report_comments FOR SELECT
  USING (
    visibility = 'public' OR
    EXISTS (
      SELECT 1 FROM reports WHERE id = report_id AND user_id = auth.uid()
    )
  );

-- Users can add public comments to any report
CREATE POLICY "Users can add public comments"
  ON report_comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND visibility = 'public'
  );

-- Admins can add any comment
CREATE POLICY "Admins can add any comment"
  ON report_comments FOR INSERT
  WITH CHECK (is_admin());

-- ==========================================
-- REPORT STATUS HISTORY POLICIES
-- ==========================================

-- Anyone can view status history
CREATE POLICY "Anyone can view status history"
  ON report_status_history FOR SELECT
  USING (true);

-- Only admins can insert status history
CREATE POLICY "Admins can insert status history"
  ON report_status_history FOR INSERT
  WITH CHECK (is_admin());

-- ==========================================
-- NOTIFICATIONS POLICIES
-- ==========================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert notifications
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- DEPARTMENTS POLICIES
-- ==========================================

-- Anyone can view departments
CREATE POLICY "Anyone can view departments"
  ON departments FOR SELECT
  USING (true);

-- Only admins can modify departments
CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL
  USING (is_admin());

-- ==========================================
-- STORAGE POLICIES (for Supabase Storage)
-- ==========================================

-- Create a storage bucket for report images
-- Run this in the Supabase Dashboard > Storage > New Bucket
-- Bucket name: report-images
-- Public: Yes

-- Storage policy: Allow authenticated uploads
-- CREATE POLICY "Authenticated users can upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'report-images' AND auth.role() = 'authenticated');

-- Storage policy: Allow public read
-- CREATE POLICY "Anyone can view"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'report-images');

-- Storage policy: Users can delete their own uploads
-- CREATE POLICY "Users can delete own uploads"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);
