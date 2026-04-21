import { createClient } from '@supabase/supabase-js';

const url = 'https://eoesdfgqdsvaefyujdxe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

const client = createClient(url, key);

async function signUpAdmin() {
  console.log("Creating admin user...");
  const { data, error } = await client.auth.signUp({
    email: 'admin@gmail.com',
    password: 'AdminPassword123!'
  });
  
  if (error) {
    console.log("Failed to create admin:", error.message);
  } else {
    console.log("Successfully created admin account!");
    console.log("User Data:", data.user?.email);
  }
}

signUpAdmin();
