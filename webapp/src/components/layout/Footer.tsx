import React from 'react';
import { Translate } from '../ui/Translate';

export const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-box">📄</div>
            <span className="footer-logo-name">FORMA</span>
          </div>
          <p className="footer-desc">
            <Translate 
              ar="مسارك القانوني في مصر — بدون تعقيدات. نجعل الإجراءات القانونية بسيطة وسريعة وموثوقة." 
              en="Your legal journey in Egypt — without complications. We make legal procedures simple, fast, and reliable." 
            />
          </p>
        </div>
        <div>
          <div className="footer-col-title"><Translate ar="الخدمات" en="Services" /></div>
          <ul className="footer-links">
            <li><a href="#"><Translate ar="تأسيس الشركات" en="Company Formation" /></a></li>
            <li><a href="#"><Translate ar="البطاقة الضريبية" en="Tax Card" /></a></li>
            <li><a href="#"><Translate ar="عقد التأسيس" en="Incorporation Agreement" /></a></li>
            <li><a href="#"><Translate ar="حماية العلامة" en="Trademark" /></a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title"><Translate ar="الشركة" en="Company" /></div>
          <ul className="footer-links">
            <li><a href="#"><Translate ar="من نحن" en="About Us" /></a></li>
            <li><a href="#"><Translate ar="المدونة" en="Blog" /></a></li>
            <li><a href="#"><Translate ar="الوظائف" en="Careers" /></a></li>
            <li><a href="#"><Translate ar="تواصل معنا" en="Contact" /></a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title"><Translate ar="قانوني" en="Legal" /></div>
          <ul className="footer-links">
            <li><a href="#"><Translate ar="الشروط والأحكام" en="Terms" /></a></li>
            <li><a href="#"><Translate ar="سياسة الخصوصية" en="Privacy Policy" /></a></li>
            <li><a href="#"><Translate ar="الأمان" en="Security" /></a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">
          <Translate ar="© 2024 FORMA. جميع الحقوق محفوظة." en="© 2024 FORMA. All rights reserved." />
        </span>
        <div className="footer-socials">
          <a href="#" className="footer-social-btn">𝕏</a>
          <a href="#" className="footer-social-btn">in</a>
          <a href="#" className="footer-social-btn">f</a>
        </div>
      </div>
    </footer>
  );
};
