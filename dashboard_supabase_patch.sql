-- ==========================================
-- FORMA DASHBOARD FIX (TEMPORARY FOR LOCAL DEV)
-- ==========================================
-- Since we are using "admin123" dummy password locally instead of real Supabase Auth,
-- our connection to Supabase uses the "anon" (anonymous) key.
-- Previously we set RLS policies that ONLY allowed "authenticated" users to view requests.
--
-- This script updates the policies so your dashboard can read and update data 
-- using the anon key.

-- 1. Remove the old strict policies for service requests
DROP POLICY IF EXISTS "Allow authenticated view" ON service_requests;
DROP POLICY IF EXISTS "Allow public insert" ON service_requests;

-- 2. Create new policies that allow anon to select, insert, and update 
CREATE POLICY "Allow public select" ON service_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON service_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON service_requests
  FOR UPDATE USING (true);

-- 3. Also allow viewing profiles from the dashboard
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Allow public select profiles" ON profiles
  FOR SELECT USING (true);
