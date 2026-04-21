import { createClient } from '@supabase/supabase-js';

const url = 'https://eoesdfgqdsvaefyujdxe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

const client = createClient(url, key);

async function checkBuckets() {
  console.log("Listing all buckets...");
  const { data, error } = await client.storage.listBuckets();
  
  if (error) {
    console.error("Error listing buckets:", error.message);
    return;
  }
  
  console.log("Found buckets:", data.map(b => b.name));
  const exists = data.some(b => b.id === 'service-documents');
  console.log(`'service-documents' exists: ${exists}`);
}

checkBuckets();
