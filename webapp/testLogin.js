import { createClient } from '@supabase/supabase-js';

const url = 'https://eoesdfgqdsvaefyujdxe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

const client = createClient(url, key);

async function testLogin() {
  console.log("Trying to login as admin@gmail.com...");
  const { data, error } = await client.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: 'AdminPassword123!'
  });
  
  if (error) {
    console.log("Login failed:", error.message);
  } else {
    console.log("Login success! User exists.");
  }
}

testLogin();
