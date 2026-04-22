import React, { useEffect, useState } from 'react';
import { Translate } from '../ui/Translate';
import { useTranslation } from '@/hooks/useTranslation';

export const Navbar = () => {
  const { lang, changeLanguage } = useTranslation();
  const [navShadow, setNavShadow] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavShadow(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <nav className="navbar" style={{ boxShadow: navShadow ? 'var(--shadow)' : 'none' }}>
        <div className="navbar-inner">
          <div className="logo">
            <div className="logo-icon">📄</div>
            <div className="logo-text-wrap">
              <span className="logo-name">FORMA</span>
              <span className="logo-sub">
                <Translate ar="مسارك القانوني بكل بساطة" en="Your Legal Journey, Simplified" />
              </span>
            </div>
          </div>
          <ul className="nav-links">
            <li><a href="#services"><Translate ar="الخدمات" en="Services" /></a></li>
            <li><a href="#pricing"><Translate ar="الأسعار" en="Pricing" /></a></li>
            <li><a href="#how"><Translate ar="كيف يعمل" en="How It Works" /></a></li>
          </ul>
          <div className="nav-actions">
            <div className="lang-toggle">
              <button 
                className={`lang-btn ${lang === 'ar' ? 'active' : ''}`}
                onClick={() => changeLanguage('ar')}
              >
                AR
              </button>
              <button 
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">🌙</button>
            <button className="btn-login open-auth-btn">
              <Translate ar="تسجيل الدخول" en="Login" />
            </button>
          </div>
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobile-nav">
        <a href="#services" onClick={closeMenu} className="mobile-nav-link"><Translate ar="الخدمات" en="Services" /></a>
        <a href="#pricing" onClick={closeMenu} className="mobile-nav-link"><Translate ar="الأسعار" en="Pricing" /></a>
        <a href="#how" onClick={closeMenu} className="mobile-nav-link"><Translate ar="كيف يعمل" en="How It Works" /></a>
        <a href="#" className="mobile-nav-link open-auth-btn"><Translate ar="تسجيل الدخول" en="Login" /></a>
      </div>
    </>
  );
};
