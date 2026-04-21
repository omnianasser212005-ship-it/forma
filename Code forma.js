/* ============================================================
   SUPABASE INITIALIZATION
   ============================================================ */
const supabaseUrl = "https://dvlizlegwfcnlslfstey.supabase.co";
const supabaseKey = "sb_publishable_cbYESTUGC_nt4oWuUPpx_Q_ApeVydP-";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let uploadedFiles = []; // لتخزين الملفات المختارة
let currentLang = localStorage.getItem('forma-lang') || 'ar';

/* ============================================================
   MAIN SUBMIT FUNCTION
   ============================================================ */
async function handleServiceSubmit() {
    const btn = document.getElementById('btn-service-submit');
    btn.disabled = true;
    btn.innerText = currentLang === 'ar' ? 'جاري الحفظ...' : 'Saving...';

    try {
        // 1. الحصول على بيانات المستخدم الحالي (ضروري لأن الـ SQL يتطلب user_id)
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        
        if (authError || !user) {
            throw new Error(currentLang === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
        }

        // 2. تجميع بيانات الـ Business Setup (تطابق أسماء أعمدة الـ SQL)
        const setupData = {
            user_id: user.id,
            responsible_manager: document.getElementById('sf-name').value,
            company_system: document.getElementById('sf-company-type').value,
            capital: parseFloat(document.getElementById('sf-capital').value) || 0,
            location_coordinates: document.getElementById('sf-location')?.value || '',
            status: 'Pending'
        };

        // 3. إدخال البيانات في جدول business_setups
        const { data: setupResult, error: setupError } = await supabaseClient.from('business_setups')
            .insert([setupData])
            .select()
            .single(); // نأخذ السجل الذي تم إنشاؤه للحصول على الـ ID

        if (setupError) throw setupError;

        const setupId = setupResult.id;

        // 4. رفع الملفات وتسجيلها في جدول attachments
        if (uploadedFiles.length > 0) {
            await uploadAndRegisterAttachments(setupId);
        }

        showToast(currentLang === 'ar' ? 'تم تقديم طلبك بنجاح' : 'Setup submitted successfully!', 'success');
        closeModal('service-modal-overlay');
        
        // إعادة تعيين الواجهة
        uploadedFiles = [];
        renderFileList();

    } catch (err) {
        console.error('Operation Failed:', err);
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = currentLang === 'ar' ? 'إرسال الطلب ✓' : 'Submit Request ✓';
    }
}

/* ============================================================
   STORAGE & ATTACHMENTS LOGIC
   ============================================================ */
async function uploadAndRegisterAttachments(setupId) {
    for (const file of uploadedFiles) {
        // إنشاء اسم فريد للملف
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `setups/${setupId}/${fileName}`;

        // أ. الرفع إلى Storage (Bucket: legal-documents)
        const { error: uploadError } = await supabaseClient.storage
            .from('legal-documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // ب. تسجيل بيانات الملف في جدول attachments (تطابق SQL)
        const { error: attachError } = await supabaseClient
            .from('attachments')
            .insert([{
                setup_id: setupId,
                file_type: determineFileType(file.name), // دالة لتحديد النوع
                file_url: filePath
            }]);

        if (attachError) throw attachError;
    }
}

// دالة مساعدة لتحديد نوع الملف بناءً على الاسم أو حقل الاختيار
function determineFileType(fileName) {
    // يمكنك تطوير المنطق هنا، حالياً سيعتبره 'PoA' كافتراضي
    return 'PoA'; 
}

/* ============================================================
   FILE MANAGEMENT HELPERS
   ============================================================ */
// 1. لما تسحب الملف فوق المربع (بيغير اللون)
function handleDragOver(event) {
    event.preventDefault();
    const zone = document.getElementById('file-drop-zone');
    zone.style.borderColor = 'var(--accent)';
    zone.style.background = 'rgba(200,164,93,0.05)';
}

// 2. لما تبعد الملف عن المربع (بيرجع اللون الطبيعي)
function handleDragLeave(event) {
    const zone = document.getElementById('file-drop-zone');
    zone.style.borderColor = 'var(--border)';
    zone.style.background = 'var(--bg)';
}

// 3. لما تسيب الملف جوه المربع (بيضيف الملفات للقائمة)
function handleDrop(event) {
    event.preventDefault();
    handleDragLeave(event); // عشان يرجع اللون الطبيعي
    const files = Array.from(event.dataTransfer.files);
    uploadedFiles.push(...files);
    renderFileList(); // الدالة دي موجودة عندك فعلاً عشان تعرض الأسماء
}