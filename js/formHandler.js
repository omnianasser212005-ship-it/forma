// formHandler.js (Handles Signup Validation, Service Multiple Steps, and Drag/Drop)
let currentServiceName = '';
let currentStep = 1;
let uploadedFiles = [];

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidEgyptPhone(v) { return /^01[0125][0-9]{8}$/.test(v.replace(/\s/g,'')); }

function validateSignupField(input) {
  const id = input.id;
  let valid = true;
  if (id === 'signup-name') valid = input.value.trim().length >= 2;
  if (id === 'signup-phone') valid = isValidEgyptPhone(input.value);
  if (id === 'signup-email') valid = isValidEmail(input.value);
  if (id === 'signup-company') valid = input.value.trim().length >= 2;
  if (id === 'signup-age') { const v = parseInt(input.value); valid = v >= 18 && v <= 99; }

  input.classList.toggle('error', !valid && input.value.length > 0);
  checkSignupReady();
}

function checkSignupReady() {
  const name = document.getElementById('signup-name')?.value.trim() || '';
  const phone = document.getElementById('signup-phone')?.value || '';
  const email = document.getElementById('signup-email')?.value || '';
  const company = document.getElementById('signup-company')?.value.trim() || '';
  const age = parseInt(document.getElementById('signup-age')?.value) || 0;

  const ready = name.length >= 2 && isValidEgyptPhone(phone) &&
    isValidEmail(email) && company.length >= 2 && age >= 18 && age <= 99;
  
  const btn = document.getElementById('btn-signup-submit');
  if(btn) btn.disabled = !ready;
}

function openServiceForm(nameAr, nameEn) {
  currentServiceName = currentLang === 'ar' ? nameAr : nameEn;
  const title = document.getElementById('service-modal-title');
  if(title) title.textContent = currentServiceName;
  currentStep = 1;
  uploadedFiles = [];
  updateStepUI();
  clearServiceForm();
  if(typeof openModal === 'function') openModal('service-modal-overlay');
}

function clearServiceForm() {
  ['sf-name','sf-age','sf-phone','sf-email','sf-company','sf-activity','sf-capital'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const typeSelect = document.getElementById('sf-company-type');
  if(typeSelect) typeSelect.selectedIndex = 0;
  
  const flist = document.getElementById('file-list');
  if(flist) flist.innerHTML = '';
  
  const msg = document.getElementById('service-message');
  if(msg) msg.className = 'form-message';
}

function goStep(step) {
  if (step > currentStep) {
    if (currentStep === 1) {
      const name = document.getElementById('sf-name').value.trim();
      const phone = document.getElementById('sf-phone').value.trim();
      const email = document.getElementById('sf-email').value.trim();
      if (!name || !phone || !email) return showToast(currentLang === 'ar' ? '⚠️ يرجى ملء المطلوب' : '⚠️ Fill fields', 'error');
      if (!isValidEgyptPhone(phone)) return showToast(currentLang === 'ar' ? '⚠️ هاتف غير صالح' : '⚠️ Invalid phone', 'error');
      if (!isValidEmail(email)) return showToast(currentLang === 'ar' ? '⚠️ بريد غير صالح' : '⚠️ Invalid email', 'error');
    }
    if (currentStep === 2) {
      const company = document.getElementById('sf-company').value.trim();
      const type = document.getElementById('sf-company-type').value;
      if (!company || !type) return showToast(currentLang === 'ar' ? '⚠️ يرجى ملء المطلوب' : '⚠️ Fill fields', 'error');
    }
  }

  const prevDot = document.getElementById(`sdot-${currentStep}`);
  if(prevDot) { prevDot.classList.remove('active'); prevDot.classList.add('done'); }

  if (step < currentStep) {
    const dot = document.getElementById(`sdot-${currentStep}`);
    if(dot) dot.classList.remove('done');
  }

  for (let i = 1; i <= 2; i++) {
    document.getElementById(`sline-${i}`)?.classList.toggle('done', i < step);
  }

  document.getElementById(`step-${currentStep}`)?.classList.remove('active');
  currentStep = step;
  document.getElementById(`step-${step}`)?.classList.add('active');

  const newDot = document.getElementById(`sdot-${step}`);
  if(newDot) { newDot.classList.remove('done'); newDot.classList.add('active'); }
}

function updateStepUI() {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`sdot-${i}`);
    const panel = document.getElementById(`step-${i}`);
    if(dot) dot.className = 'step-dot' + (i === 1 ? ' active' : '');
    if(panel) panel.className = 'step-panel' + (i === 1 ? ' active' : '');
  }
  for (let i = 1; i <= 2; i++) {
    document.getElementById(`sline-${i}`)?.classList.remove('done');
  }
}

function handleDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('dragover'); }
function handleDragLeave(e) { e.currentTarget.classList.remove('dragover'); }
function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  addFiles(e.dataTransfer.files);
}
function handleFileSelect(e) { addFiles(e.target.files); }

function addFiles(fileList) {
  Array.from(fileList).forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      showToast(currentLang === 'ar' ? `⚠️ ${file.name} أكبر من 10MB` : `⚠️ fails 10MB`, 'error'); return;
    }
    if (uploadedFiles.find(f => f.name === file.name)) return;
    uploadedFiles.push(file);
  });
  renderFileList();
}

function renderFileList() {
  const list = document.getElementById('file-list');
  if(!list) return;
  list.innerHTML = uploadedFiles.map((f, i) => `
    <div class="file-item">
      <span class="file-item-name">📎 ${f.name}</span>
      <div class="file-item-actions">
        <span class="file-item-size">${(f.size/1024).toFixed(0)} KB</span>
        <span class="file-remove" data-index="${i}">✕</span>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => removeFile(e.target.getAttribute('data-index')));
  });
}

function removeFile(i) {
  uploadedFiles.splice(i, 1);
  renderFileList();
}
