-- ==========================================
-- FORMA SUPABASE COMPLETE SETUP SCRIPT
-- ==========================================
-- This script sets up the database schema, security rules, 
-- and automation triggers for the FORMA platform.
-- Copy and Paste this entire block into the Supabase SQL Editor.

-- 1. CLEANUP (Optional - Uncomment if you want to start fresh)
-- DROP TABLE IF EXISTS service_requests;
-- DROP TABLE IF EXISTS profiles;

-- ==========================================
-- 2. SERVICE REQUESTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id text UNIQUE NOT NULL,
  service_name text NOT NULL,
  phone text,
  email text,
  age int4,
  company text,
  company_type text,
  activity text,
  capital numeric,
  file_urls text[] DEFAULT '{}',
  files_count int4 DEFAULT 0,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for service_requests
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (Contact Form)
CREATE POLICY "Allow public insert" ON service_requests
  FOR INSERT WITH CHECK (true);

-- Policy: Allow managers (authenticated) to view all requests
CREATE POLICY "Allow authenticated view" ON service_requests
  FOR SELECT TO authenticated USING (true);


-- ==========================================
-- 3. USER PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  age int4,
  phone text,
  email text,
  company_name text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see only their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update only their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);


-- ==========================================
-- 4. AUTH TRIGGER (Auto-create Profile)
-- ==========================================
-- This function runs every time a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger logic
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- DONE! 🚀
-- ==========================================
