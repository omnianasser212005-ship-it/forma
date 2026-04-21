// ui.js (Handles UI toggles, Modals, Theme, Lang, and Notifications)
let currentLang = localStorage.getItem('forma-lang') || 'ar';
let currentTheme = localStorage.getItem('forma-theme') || 'light';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('forma-lang', lang);
  applyLang(lang);
}

function applyLang(lang, animate = true) {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });

  document.querySelectorAll('option[data-ar][data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });

  document.getElementById('btn-ar')?.classList.toggle('active', lang === 'ar');
  document.getElementById('btn-en')?.classList.toggle('active', lang === 'en');

  document.querySelectorAll('.btn-primary span:last-child').forEach(el => {
    if (el.textContent === '←' || el.textContent === '→') {
      el.textContent = lang === 'ar' ? '←' : '→';
    }
  });
}

function toggleTheme() {
  const t = currentTheme === 'light' ? 'dark' : 'light';
  currentTheme = t;
  localStorage.setItem('forma-theme', t);
  applyTheme(t);
}

function applyTheme(theme, animate = true) {
  document.body.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-btn');
  if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleMobileNav() {
  document.getElementById('mobile-nav')?.classList.toggle('open');
}

function initScrollNav() {
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 40) {
      navbar.style.boxShadow = 'var(--shadow)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function openAuthModal() {
  openModal('auth-modal-overlay');
}

function openModal(id) {
  const overlay = document.getElementById(id);
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('mobile-nav')?.classList.remove('open');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  overlay?.classList.remove('active');
  if (!document.querySelector('.modal-overlay.active')) {
    document.body.style.overflow = '';
  }
}

function switchAuthTab(tab) {
  const tabs = { login: 'auth-login-form', signup: 'auth-signup-form' };
  Object.entries(tabs).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if(el) {
      if (key === tab) {
        el.classList.remove('hidden-block');
      } else {
        el.classList.add('hidden-block');
      }
    }
    document.getElementById(`tab-${key}`)?.classList.toggle('active', key === tab);
  });
}

function showMessage(el, text, type) {
  if(!el) return;
  el.textContent = text;
  el.className = `form-message ${type} visible`;
  setTimeout(() => el.classList.remove('visible'), 5000);
}

function shakeElement(el) {
  if(!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

function showToast(text, type = 'default') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = text;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function setLoadingState(btn, loading) {
  if(!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.classList.add('btn-loading');
    btn.innerHTML = `<div class="spinner"></div>`;
  } else {
    btn.classList.remove('btn-loading');
    const id = btn.id;
    const texts = {
      'btn-login-submit': { ar: 'تسجيل الدخول', en: 'Login' },
      'btn-signup-submit': { ar: 'إنشاء الحساب', en: 'Create Account' },
      'btn-service-submit': { ar: 'إرسال الطلب ✓', en: 'Submit Request ✓' }
    };
    if (texts[id]) {
      btn.innerHTML = `<span>${texts[id][currentLang]}</span>`;
    }
    if (id === 'btn-signup-submit' && typeof checkSignupReady === 'function') checkSignupReady();
  }
}
