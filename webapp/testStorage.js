import { createClient } from '@supabase/supabase-js';

const url = 'https://eoesdfgqdsvaefyujdxe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

const client = createClient(url, key);

async function testUpload() {
  console.log("Testing upload to 'service-documents' bucket...");
  
  // Dummy data representing a small PDF
  const dummyContent = "%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj";
  const blob = new Blob([dummyContent], { type: 'application/pdf' });
  const file = new File([blob], "test-check.pdf", { type: 'application/pdf' });

  const { data, error } = await client.storage
    .from('service-documents')
    .upload('test-path/test.pdf', file, { upsert: true });

  if (error) {
    if (error.message === "The resource was not found") {
      console.log("ERROR: Bucket 'service-documents' DOES NOT EXIST yet.");
    } else {
      console.log("Upload failed:", error.message);
    }
  } else {
    console.log("SUCCESS: Upload works! Path:", data.path);
  }
}

testUpload();
