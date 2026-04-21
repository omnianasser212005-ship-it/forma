import React from 'react';
import { Translate } from '@/components/ui/Translate';

export const Pricing = () => {
  return (
    <>
      <div className="divider"></div>
      <section className="pricing" id="pricing">
        <div className="pricing-header reveal">
          <div className="section-label"><Translate ar="الأسعار" en="Pricing" /></div>
          <h2 className="section-title"><Translate ar="اختر الخطة المناسبة" en="Choose Your Plan" /></h2>
          <p className="section-sub"><Translate ar="أسعار شفافة بدون رسوم مخفية" en="Transparent pricing with no hidden fees" /></p>
        </div>
        <div className="pricing-grid reveal">
          {/* Starter */}
          <div className="price-card">
            <div className="price-plan"><Translate ar="أساسي" en="Starter" /></div>
            <div className="price-amount">2,500<span><Translate ar=" جنيه" en=" EGP" /></span></div>
            <div className="price-desc"><Translate ar="للأفراد والمشاريع الصغيرة" en="For individuals and small ventures" /></div>
            <ul className="price-features">
              <li><Translate ar="خدمة واحدة" en="Single service" /></li>
              <li><Translate ar="دعم بالبريد الإلكتروني" en="Email support" /></li>
              <li><Translate ar="تتبع الطلب" en="Request tracking" /></li>
              <li><Translate ar="تسليم خلال 7 أيام" en="7-day delivery" /></li>
            </ul>
            <button className="btn-plan open-auth-btn"><Translate ar="ابدأ الآن" en="Get Started" /></button>
          </div>

          {/* Pro */}
          <div className="price-card featured">
            <div className="price-popular"><Translate ar="الأكثر شيوعاً" en="Most Popular" /></div>
            <div className="price-plan"><Translate ar="احترافي" en="Professional" /></div>
            <div className="price-amount">6,800<span><Translate ar=" جنيه" en=" EGP" /></span></div>
            <div className="price-desc"><Translate ar="للشركات الناشئة والمتوسطة" en="For startups and medium businesses" /></div>
            <ul className="price-features">
              <li><Translate ar="حتى 3 خدمات" en="Up to 3 services" /></li>
              <li><Translate ar="دعم على مدار الساعة" en="24/7 support" /></li>
              <li><Translate ar="مستشار قانوني مخصص" en="Dedicated legal advisor" /></li>
              <li><Translate ar="تسليم خلال 3 أيام" en="3-day delivery" /></li>
              <li><Translate ar="مراجعة العقود" en="Contract review" /></li>
            </ul>
            <button className="btn-plan open-auth-btn"><Translate ar="ابدأ الآن" en="Get Started" /></button>
          </div>

          {/* Enterprise */}
          <div className="price-card">
            <div className="price-plan"><Translate ar="مؤسسي" en="Enterprise" /></div>
            <div className="price-amount"><Translate ar="تواصل معنا" en="Contact Us" /></div>
            <div className="price-desc"><Translate ar="لمعرفه كيف تبدأ اجراءات القانونية الخاصه بشركتك" en="To know how to start the legal procedures for your company" /></div>
            <ul className="price-features">
              <li><Translate ar="خدمات غير محدودة" en="Unlimited services" /></li>
              <li><Translate ar="فريق قانوني متكامل" en="Full legal team" /></li>
              <li><Translate ar="SLA مضمون" en="Guaranteed SLA" /></li>
              <li><Translate ar="تقارير شهرية" en="Monthly reports" /></li>
              <li><Translate ar="عقد سنوي" en="Annual contract" /></li>
            </ul>
            <button className="btn-plan open-auth-btn"><Translate ar="اتصل بنا" en="Contact Us" /></button>
          </div>
        </div>
      </section>
    </>
  );
};
