-- ============================================================
-- SCHEMA UPGRADES: PORTFOLIO CMS & SEO
-- Purpose : Upgrades the database schema for SEO settings and File Manager uploads.
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Add Biography fields to Profile table if they don't exist
ALTER TABLE profile ADD COLUMN IF NOT EXISTS bio_narrative_1 TEXT DEFAULT 'Muhammad Asif is a Full Stack Developer specializing in both web and mobile application development, skilled in building end-to-end solutions — from responsive frontend interfaces to scalable backend systems and databases.';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS bio_narrative_2 TEXT DEFAULT 'With a passion for clean code and performance, I design, code, and deploy solutions that solve real-world problems. Whether building responsive dashboards using React + Tailwind CSS, robust microservices in Node.js, or portable mobile clients using React Native and Flutter, my goal is always to deliver modern, stable, and user-centric systems.';

-- ============================================================
-- TABLE 1: seo_settings
-- Purpose : Stores global metadata variables dynamically parsed into the head tag
-- Writer  : Admin (authenticated)
-- Reader  : Public (anon)
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id                UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  meta_title        TEXT          NOT NULL DEFAULT 'Muhammad Asif | Full Stack Developer',
  meta_description  TEXT          NOT NULL DEFAULT 'Professional portfolio of Muhammad Asif, Full Stack Web & Mobile App Developer.',
  meta_keywords     TEXT          NOT NULL DEFAULT 'Muhammad Asif, Full Stack Developer, React, Node.js',
  og_image_url      TEXT          DEFAULT '',
  author            TEXT          NOT NULL DEFAULT 'Muhammad Asif',
  robots            TEXT          NOT NULL DEFAULT 'index, follow',
  updated_at        TIMESTAMPTZ   DEFAULT NOW()
);

-- Seed initial SEO row if none exists
INSERT INTO seo_settings (id, meta_title, meta_description, meta_keywords) 
VALUES (
  'c0a80101-0000-0000-0000-000000000001', 
  'Muhammad Asif | Full Stack Web & Mobile App Developer', 
  'Professional portfolio of Muhammad Asif, Full Stack Web & Mobile App Developer. Discover projects, technical skills, and contact details.', 
  'Muhammad Asif, Full Stack Developer, React, Node.js, Express, MongoDB, React Native, Cross Platform Mobile Apps'
)
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) configuration
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read SEO tags
CREATE POLICY "seo_public_select"
  ON seo_settings
  FOR SELECT
  TO anon
  USING (true);

-- Only authenticated admin can write/modify SEO tags
CREATE POLICY "seo_admin_all"
  ON seo_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLE 2: portfolio_files
-- Purpose : Stores paths and names of uploaded portfolio resource files (shown in Sidebar)
-- Writer  : Admin (authenticated)
-- Reader  : Public (anon)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_files (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT          NOT NULL,
  url           TEXT          NOT NULL,
  file_type     TEXT,
  size          INTEGER,
  display_order INTEGER       DEFAULT 0,
  is_visible    BOOLEAN       DEFAULT TRUE,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- Index for ordering files in the Sidebar
CREATE INDEX IF NOT EXISTS idx_files_display_order
  ON portfolio_files (display_order ASC);

-- Row Level Security (RLS) configuration
ALTER TABLE portfolio_files ENABLE ROW LEVEL SECURITY;

-- Anyone can read active files
CREATE POLICY "files_public_select"
  ON portfolio_files
  FOR SELECT
  TO anon
  USING (is_visible = TRUE);

-- Only authenticated admin can manage files
CREATE POLICY "files_admin_all"
  ON portfolio_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- STORAGE BUCKET: portfolio-resources
-- Purpose : Supabase storage bucket for downloadable files (PDFs, docs, certificates)
-- NOTE    : Requires active supabase storage schemas. If errors occur due to permissions,
--           the bucket can also be created manually via Supabase Dashboard → Storage tab.
-- ============================================================

-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-resources', 'portfolio-resources', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public downloads
CREATE POLICY "Public Resource Download"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-resources');

-- Policies for admin control
CREATE POLICY "Admin Resource Upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-resources');

CREATE POLICY "Admin Resource Delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-resources');

CREATE POLICY "Admin Resource Update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-resources');
