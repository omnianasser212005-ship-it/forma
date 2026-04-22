import { createClient } from '@supabase/supabase-js';

const url = 'https://eoesdfgqdsvaefyujdxe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

const client = createClient(url, key);

async function checkTable() {
  console.log("Checking 'service_requests' table columns...");
  const { data, error } = await client.from('service_requests').select('*').limit(1);
  
  if (error) {
    if (error.message.includes("does not exist")) {
      console.log("ERROR: Table 'service_requests' DOES NOT EXIST.");
    } else {
      console.error("Error checking table:", error.message);
    }
    return;
  }
  
  if (data.length > 0) {
    console.log("Table exists. Columns available:", Object.keys(data[0]));
  } else {
    console.log("Table exists but it is empty.");
  }
}

checkTable();
