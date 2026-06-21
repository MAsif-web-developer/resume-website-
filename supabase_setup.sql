-- ============================================================
-- COMPLETE SUPABASE SQL SCHEMA
-- Portfolio: Muhammad Asif (asif.developer@gmail.com)
-- Project URL: https://snixbwxipbvkyjrrtmmt.supabase.co
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- EXTENSIONS (enable UUID generation)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- TABLE 1: contact_submissions
-- Purpose : Stores messages sent from the Contact form
-- Writer  : Frontend (anon) via Supabase client / Backend API
-- Reader  : Admin (authenticated user only)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message     TEXT        NOT NULL,
  is_read     BOOLEAN     DEFAULT FALSE,         -- track if admin has read this
  ip_address  TEXT,                              -- optional: log submitter IP
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster sorting / admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_contact_created_at
  ON contact_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_is_read
  ON contact_submissions (is_read);

-- Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anon users can INSERT (the contact form)
CREATE POLICY "contact_public_insert"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated admin can SELECT / UPDATE / DELETE
CREATE POLICY "contact_admin_select"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "contact_admin_update"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "contact_admin_delete"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================
-- TABLE 2: projects
-- Purpose : Stores portfolio project entries (shown in Projects section)
-- Writer  : Admin (authenticated) — manage projects from Supabase dashboard
-- Reader  : Public (anon) — frontend fetches and renders them
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  tech_stack    TEXT[]      NOT NULL DEFAULT '{}',  -- e.g. {"React.js","Node.js","MongoDB"}
  demo_url      TEXT,
  github_url    TEXT,
  glow_color    TEXT        DEFAULT 'rgba(99, 102, 241, 0.15)',
  display_order INTEGER     DEFAULT 0,              -- controls sort order on frontend
  is_featured   BOOLEAN     DEFAULT TRUE,            -- show/hide on portfolio
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial projects (mirrors what is hardcoded in Projects.jsx)
INSERT INTO projects (title, description, tech_stack, demo_url, github_url, glow_color, display_order) VALUES
(
  'Smart Hostel Management System',
  'A full stack web/mobile application designed to streamline hostel operations, featuring automated room allocation algorithms, digital student records, graphical fee tracking, and a robust administrator control panel.',
  ARRAY['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB'],
  'https://example.com/hostel-demo',
  'https://github.com',
  'rgba(99, 102, 241, 0.15)',
  1
),
(
  'Grocery Store Management Project',
  'An intuitive full stack enterprise system engineered to optimize retail activities. Integrates real-time inventory adjustments, barcode billing queues, automated stock level alerts, and comprehensive sales reports.',
  ARRAY['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MySQL'],
  'https://example.com/grocery-demo',
  'https://github.com',
  'rgba(6, 182, 212, 0.15)',
  2
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for ordered display
CREATE INDEX IF NOT EXISTS idx_projects_display_order
  ON projects (display_order ASC);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can read projects (public portfolio)
CREATE POLICY "projects_public_select"
  ON projects
  FOR SELECT
  TO anon
  USING (is_featured = TRUE);

-- Only authenticated admin can manage projects
CREATE POLICY "projects_admin_all"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLE 3: skills
-- Purpose : Stores skill categories and individual skills
--           (shown in the Skills section with progress bars)
-- Writer  : Admin (authenticated)
-- Reader  : Public (anon)
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  category       TEXT        NOT NULL,             -- e.g. "Frontend Development"
  name           TEXT        NOT NULL,             -- e.g. "React.js"
  proficiency    INTEGER     NOT NULL              -- percentage 0–100
                 CHECK (proficiency BETWEEN 0 AND 100),
  category_icon  TEXT,                             -- lucide icon name, e.g. "Layout"
  glow_color     TEXT        DEFAULT 'rgba(59, 130, 246, 0.12)',
  display_order  INTEGER     DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data (mirrors Skills.jsx hardcoded data)
INSERT INTO skills (category, name, proficiency, category_icon, glow_color, display_order) VALUES
-- Frontend
('Frontend Development', 'HTML & CSS',     95, 'Layout', 'rgba(59, 130, 246, 0.12)', 1),
('Frontend Development', 'JavaScript',     90, 'Layout', 'rgba(59, 130, 246, 0.12)', 2),
('Frontend Development', 'React.js',       90, 'Layout', 'rgba(59, 130, 246, 0.12)', 3),
('Frontend Development', 'Tailwind CSS',   95, 'Layout', 'rgba(59, 130, 246, 0.12)', 4),
-- Backend
('Backend Development',  'Node.js',        85, 'Server', 'rgba(168, 85, 247, 0.12)', 5),
('Backend Development',  'Express.js',     90, 'Server', 'rgba(168, 85, 247, 0.12)', 6),
('Backend Development',  'REST APIs',      90, 'Server', 'rgba(168, 85, 247, 0.12)', 7),
('Backend Development',  'MongoDB & MySQL',80, 'Server', 'rgba(168, 85, 247, 0.12)', 8),
-- Mobile
('Mobile App Development','React Native',  80, 'Smartphone','rgba(16, 185, 129, 0.12)', 9),
('Mobile App Development','Flutter',       75, 'Smartphone','rgba(16, 185, 129, 0.12)', 10),
-- Tools
('Tools & Utilities',    'Git & GitHub',   90, 'Wrench', 'rgba(245, 158, 11, 0.12)', 11),
('Tools & Utilities',    'Postman',        85, 'Wrench', 'rgba(245, 158, 11, 0.12)', 12),
('Tools & Utilities',    'VS Code',        95, 'Wrench', 'rgba(245, 158, 11, 0.12)', 13);

CREATE INDEX IF NOT EXISTS idx_skills_display_order
  ON skills (display_order ASC);

-- Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skills_public_select"
  ON skills
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "skills_admin_all"
  ON skills
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLE 4: profile
-- Purpose : Stores the owner's personal details (shown in Hero
--           and About sections — name, tagline, socials, etc.)
-- Writer  : Admin only
-- Reader  : Public (anon)
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name     TEXT        NOT NULL DEFAULT 'Muhammad Asif',
  tagline       TEXT        DEFAULT 'Consistency Makes a Man Perfect in Their Skill Set.',
  email         TEXT        DEFAULT 'asif.developer@gmail.com',
  phone         TEXT        DEFAULT '0334-4142777',
  whatsapp_url  TEXT        DEFAULT 'https://wa.me/923344142777',
  location      TEXT        DEFAULT 'Pakistan',
  github_url    TEXT        DEFAULT 'https://github.com',
  linkedin_url  TEXT        DEFAULT 'https://linkedin.com',
  resume_url    TEXT        DEFAULT '/resume.pdf',
  profile_image TEXT        DEFAULT '/profile.jpg',
  years_exp     INTEGER     DEFAULT 3,
  projects_count INTEGER    DEFAULT 2,
  delivery_rate INTEGER     DEFAULT 100,           -- percentage
  roles         TEXT[]      DEFAULT ARRAY[
    'Full Stack Web & Mobile App Developer',
    'MERN Stack Specialist',
    'React Native & Flutter Expert'
  ],
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Only one row (singleton profile)
INSERT INTO profile DEFAULT VALUES;

CREATE TRIGGER profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_public_select"
  ON profile
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "profile_admin_all"
  ON profile
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLE 5: page_views  (optional analytics)
-- Purpose : Lightweight visitor counter — tracks page hits
-- Writer  : Anon (frontend fires on load)
-- Reader  : Admin (authenticated)
-- ============================================================
CREATE TABLE IF NOT EXISTS page_views (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  page       TEXT        NOT NULL DEFAULT 'home',  -- 'home', 'about', etc.
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_page
  ON page_views (page, created_at DESC);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pageviews_public_insert"
  ON page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "pageviews_admin_select"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (true);


-- ============================================================
-- SUMMARY OF TABLES
-- ============================================================
-- contact_submissions  → Contact form messages (anon insert, admin read)
-- projects             → Portfolio project cards (admin manage, public read)
-- skills               → Skill categories + progress bars (admin manage, public read)
-- profile              → Owner bio, links, stats (admin manage, public read)
-- page_views           → Basic analytics (anon insert, admin read)
-- ============================================================
