import { createClient } from '@supabase/supabase-js';

const url = 'https://eoesdfgqdsvaefyujdxe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

const client = createClient(url, key);

async function test() {
  console.log("Fetching service requests...");
  const { data, error } = await client.from('service_requests').select('*');
  console.log("Error:", error);
  console.log("Data count:", data?.length);
  console.log("Data:", data);
}

test();
