// main.js (Binds all decoupled click behaviors and initializes App)
document.addEventListener('DOMContentLoaded', () => {
  // Initialization calls from ui.js
  applyLang(currentLang, false);
  applyTheme(currentTheme, false);
  initScrollReveal();
  initScrollNav();

  // Navigation Links
  document.getElementById('btn-ar')?.addEventListener('click', () => setLang('ar'));
  document.getElementById('btn-en')?.addEventListener('click', () => setLang('en'));
  document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);
  
  const hamburger = document.getElementById('btn-hamburger');
  hamburger?.addEventListener('click', toggleMobileNav);
  
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', toggleMobileNav));
  document.getElementById('btn-scroll-services')?.addEventListener('click', () => document.getElementById('services').scrollIntoView({behavior:'smooth'}));
  document.getElementById('btn-scroll-how')?.addEventListener('click', () => document.getElementById('how').scrollIntoView({behavior:'smooth'}));

  // Authentication Setup
  document.querySelectorAll('.open-auth-btn').forEach(btn => btn.addEventListener('click', openAuthModal));
  document.getElementById('tab-login')?.addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('tab-signup')?.addEventListener('click', () => switchAuthTab('signup'));

  // Modals close events
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function() {
      const overlayId = this.closest('.modal-overlay').id;
      closeModal(overlayId);
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) closeModal(overlay.id);
    });
  });

  // Attach Validation Inputs 
  document.querySelectorAll('.signup-val').forEach(input => {
    input.addEventListener('input', function() { validateSignupField(this); });
  });

  // Services Integration
  document.querySelectorAll('.open-service-form').forEach(card => {
    card.addEventListener('click', function() {
      openServiceForm(this.getAttribute('data-name-ar'), this.getAttribute('data-name-en'));
    });
  });

  // Service View Transitions mapping to formHandler.js
  document.getElementById('btn-go-step-2')?.addEventListener('click', () => goStep(2));
  document.getElementById('btn-go-step-3')?.addEventListener('click', () => goStep(3));
  document.getElementById('btn-back-step-1')?.addEventListener('click', () => goStep(1));
  document.getElementById('btn-back-step-2')?.addEventListener('click', () => goStep(2));

  // Dropzone API logic setup to formHandler.js
  const dropZone = document.getElementById('file-drop-zone');
  const fileInput = document.getElementById('file-input');
  if (dropZone) {
    dropZone.addEventListener('click', () => fileInput?.click());
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
  }
  if (fileInput) fileInput.addEventListener('change', handleFileSelect);

  // Form Submits mappings to api.js
  document.getElementById('btn-login-submit')?.addEventListener('click', handleLogin);
  document.getElementById('btn-signup-submit')?.addEventListener('click', handleSignup);
  document.getElementById('btn-service-submit')?.addEventListener('click', handleServiceSubmit);
});
