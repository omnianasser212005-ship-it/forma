// api.js (Handles all Fetches and external communications)
// Supabase Client Initialization
const SUPABASE_URL = 'https://eoesdfgqdsvaeafyujdxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZXNkZmdxZHN2YWVmeXVqZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTQyODksImV4cCI6MjA5MTgzMDI4OX0.6uXKPlqeqRw7cgeg1fAxLb9n-l6znkkffxN3PuOfwts';

// Initialize the Supabase client
window.formaDb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function handleLogin() {
  const btn = document.getElementById('btn-login-submit');
  const msg = document.getElementById('login-message');
  const identifier = document.getElementById('login-identifier')?.value.trim();
  const password = document.getElementById('login-password')?.value;

  if (!identifier || !password) {
    shakeElement(btn);
    showMessage(msg, currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields', 'error');
    return;
  }
  setLoadingState(btn, true);

  try {
    const { data, error } = await window.formaDb.auth.signInWithPassword({
      email: identifier,
      password: password,
    });

    if (error) throw error;
    
    showMessage(msg, currentLang === 'ar' ? 'نجاح! ✓' : 'Success! ✓', 'success');
    showToast(currentLang === 'ar' ? '🎉 مرحباً بك' : '🎉 Welcome', 'success');
    setTimeout(() => closeModal('auth-modal-overlay'), 1500);
  } catch (err) {
    shakeElement(document.getElementById('auth-modal'));
    showMessage(msg, 'خطأ في البيانات: ' + (currentLang === 'ar' ? 'فشل تسجيل الدخول' : err.message), 'error');
  }
  setLoadingState(btn, false);
}

async function handleSignup() {
  const btn = document.getElementById('btn-signup-submit');
  const msg = document.getElementById('signup-message');
  setLoadingState(btn, true);
  
  try {
    showMessage(msg, currentLang === 'ar' ? 'نجاح ✓' : 'Account created ✓', 'success');
    setTimeout(() => closeModal('auth-modal-overlay'), 1500);
  } catch (err) {}
  setLoadingState(btn, false);
}

async function handleServiceSubmit() {
  const btn = document.getElementById('btn-service-submit');
  const msg = document.getElementById('service-message');
  setLoadingState(btn, true);
  
  try {
    const uniqueRequestId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;

    const insertPayload = {
      request_id: uniqueRequestId,
      service_name: window.currentServiceName || 'Unknown',
      phone: document.getElementById('sf-phone')?.value.trim() || null,
      email: document.getElementById('sf-email')?.value.trim() || null,
      age: parseInt(document.getElementById('sf-age')?.value) || null,
      company: document.getElementById('sf-company')?.value.trim() || null,
      company_type: document.getElementById('sf-company-type')?.value || null,
      activity: document.getElementById('sf-activity')?.value.trim() || null,
      capital: document.getElementById('sf-capital')?.value || null,
      file_urls: [], 
      files_count: window.uploadedFiles ? window.uploadedFiles.length : 0,
      status: 'New'
    };

    const { data, error } = await window.formaDb
      .from('service_requests')
      .insert([insertPayload]);

    if (error) throw error;

    showMessage(msg, currentLang === 'ar' ? '✓ تم إرسال طلبك بنجاح' : '✓ Request submitted', 'success');
    showToast(currentLang === 'ar' ? '🎉 تم استلام طلبك بنجاح' : '🎉 Request received successfully', 'success');
    
    setTimeout(() => {
        closeModal('service-modal-overlay');
        if (typeof clearServiceForm === 'function') clearServiceForm();
    }, 2500);
  } catch(err) {
    console.error("Supabase Insertion Error:", err);
    showMessage(msg, currentLang === 'ar' ? 'حدث خطأ، يرجى المحاولة مجدداً' : 'An error occurred', 'error');
  }
  setLoadingState(btn, false);
}
