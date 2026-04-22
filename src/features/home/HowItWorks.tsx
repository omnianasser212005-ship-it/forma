import React from 'react';
import { Translate } from '@/components/ui/Translate';

export const HowItWorks = () => {
  return (
    <>
      <div className="divider"></div>
      <section className="how-it-works" id="how">
        <div className="services-header reveal">
          <div className="section-label"><Translate ar="العملية" en="Process" /></div>
          <h2 className="section-title"><Translate ar="ثلاث خطوات فقط" en="Just Three Steps" /></h2>
          <p className="section-sub"><Translate ar="نجعل الأمر بسيطاً قدر المستطاع" en="We make it as simple as possible" /></p>
        </div>
        <div className="how-grid reveal">
          <div className="how-card">
            <div className="how-num">01</div><div className="how-icon">📝</div>
            <div className="how-title"><Translate ar="اختر خدمتك" en="Choose Your Service" /></div>
            <div className="how-desc"><Translate ar="اختر الخدمة المناسبة واملأ النموذج الذكي ببياناتك بدون عناء." en="Choose the right service and fill the smart form with your details effortlessly." /></div>
          </div>
          <div className="how-card">
            <div className="how-num">02</div><div className="how-icon">📎</div>
            <div className="how-title"><Translate ar="ارفع المستندات" en="Upload Documents" /></div>
            <div className="how-desc"><Translate ar="ارفع مستنداتك بأمان — صور أو PDF — ونحفظها في مكان محمي." en="Upload your documents securely — photos or PDFs — and we store them safely." /></div>
          </div>
          <div className="how-card">
            <div className="how-num">03</div><div className="how-icon">✅</div>
            <div className="how-title"><Translate ar="نُنجز لك" en="We Deliver" /></div>
            <div className="how-desc"><Translate ar="يتولى فريقنا القانوني إتمام الإجراءات ونبلغك فور الانتهاء." en="Our legal team handles the procedures and notifies you upon completion." /></div>
          </div>
        </div>
      </section>
    </>
  );
};
