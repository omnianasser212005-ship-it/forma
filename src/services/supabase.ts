import { createClient } from '@supabase/supabase-js';

// Accessing environment variables in Vite requires import.meta.env and VITE_ prefix
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://eoesdfgqdsvaefyujdxe.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
