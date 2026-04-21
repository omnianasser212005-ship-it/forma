import React from 'react';
import { Translate } from '@/components/ui/Translate';

interface ServicesGridProps {
  onOpenService: (serviceNameAr: string, serviceNameEn: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onOpenService }) => {
  return (
    <>
      <div className="divider"></div>
      <section className="services" id="services">
        <div className="services-header reveal">
          <div className="section-label"><Translate ar="خدماتنا" en="Services" /></div>
          <h2 className="section-title"><Translate ar="كل ما تحتاجه في مكان واحد" en="Everything you need in one place" /></h2>
          <p className="section-sub"><Translate ar="خدمات قانونية متكاملة مصممة للأفراد والشركات في مصر" en="Comprehensive legal services designed for individuals and businesses in Egypt" /></p>
        </div>
        
        <div className="services-grid-featured reveal">
          <div className="service-card dark" onClick={() => onOpenService("تأسيس الشركات", "Company Formation")}>
            <div className="service-badge"><Translate ar="الأكثر طلباً" en="Most Popular" /></div>
            <div className="service-tag"><Translate ar="أعمال" en="Business" /></div>
            <div className="service-icon">🏛️</div>
            <div className="service-title"><Translate ar="تأسيس الشركات" en="Company Formation" /></div>
            <div className="service-sub"><Translate ar="تأسيس شركتك بالكامل — من التوثيق حتى السجل التجاري — في أقل من أسبوع." en="Full company incorporation — from documentation to commercial registry — in under a week." /></div>
            <div className="service-footer">
              <span className="service-price"><Translate ar="من 3,500 جنيه" en="From EGP 3,500" /></span>
              <span className="service-arrow">↗</span>
            </div>
          </div>
          
          <div className="service-card dark" onClick={() => onOpenService("البطاقة الضريبية", "Tax Card")}>
            <div className="service-tag"><Translate ar="ضريبي" en="Tax" /></div>
            <div className="service-icon">🪪</div>
            <div className="service-title"><Translate ar="البطاقة الضريبية" en="Tax Card" /></div>
            <div className="service-sub"><Translate ar="استخراج البطاقة الضريبية وتسجيلك في منظومة الضرائب المصرية بشكل سريع وصحيح." en="Obtain your tax card and register in Egypt's tax system quickly and correctly." /></div>
            <div className="service-footer">
              <span className="service-price"><Translate ar="من 1,200 جنيه" en="From EGP 1,200" /></span>
              <span className="service-arrow">↗</span>
            </div>
          </div>

          <div className="service-card dark" onClick={() => onOpenService("عقد تأسيس", "Incorporation Agreement")}>
            <div className="service-tag"><Translate ar="قانوني" en="Legal" /></div>
            <div className="service-icon">📜</div>
            <div className="service-title"><Translate ar="عقد تأسيس" en="Incorporation Agreement" /></div>
            <div className="service-sub"><Translate ar="صياغة عقد التأسيس الرسمي وتوثيقه لدى الجهات المختصة مع مراجعة قانونية كاملة." en="Draft and notarize the official incorporation agreement with complete legal review." /></div>
            <div className="service-footer">
              <span className="service-price"><Translate ar="من 2,000 جنيه" en="From EGP 2,000" /></span>
              <span className="service-arrow">↗</span>
            </div>
          </div>

          <div className="service-card dark" onClick={() => onOpenService("استخراج التوكيلات الذكية", "Smart Power of Attorney")}>
            <div className="service-tag"><Translate ar="توثيق" en="Notary" /></div>
            <div className="service-icon">✍️</div>
            <div className="service-title"><Translate ar="استخراج التوكيلات الذكية" en="Smart Power of Attorney" /></div>
            <div className="service-sub"><Translate ar="استخراج التوكيلات الرسمية بشكل ذكي وسريع مع ضمان صحة الإجراءات." en="Obtain official power of attorney documents intelligently and quickly." /></div>
            <div className="service-footer">
              <span className="service-price"><Translate ar="من 800 جنيه" en="From EGP 800" /></span>
              <span className="service-arrow">↗</span>
            </div>
          </div>
        </div>

        <div className="services-grid-secondary reveal">
          <div className="service-card light" onClick={() => onOpenService("الترخيص التجاري", "Commercial License")}>
            <div className="service-tag"><Translate ar="ترخيص" en="License" /></div>
            <div className="service-icon">🏪</div>
            <div className="service-title"><Translate ar="الترخيص التجاري" en="Commercial License" /></div>
            <div className="service-sub"><Translate ar="الحصول على الترخيص التجاري المناسب لنشاطك." en="Obtain the right commercial license for your business." /></div>
            <div className="service-footer">
              <span className="service-price"><Translate ar="من 1,800 جنيه" en="From EGP 1,800" /></span>
              <span className="service-arrow">↗</span>
            </div>
          </div>

          <div className="service-card light" onClick={() => onOpenService("الفاتورة الإلكترونية", "E-Invoice System")}>
            <div className="service-tag"><Translate ar="ضريبي" en="Tax" /></div>
            <div className="service-icon">🧾</div>
            <div className="service-title"><Translate ar="الفاتورة الإلكترونية" en="E-Invoice System" /></div>
            <div className="service-sub"><Translate ar="تسجيل ودمج منظومة الفاتورة الإلكترونية مع نظامك." en="Register and integrate the e-invoice system with your setup." /></div>
            <div className="service-footer">
              <span className="service-price"><Translate ar="من 2,500 جنيه" en="From EGP 2,500" /></span>
              <span className="service-arrow">↗</span>
            </div>
          </div>

          <div className="service-card light" onClick={() => onOpenService("حماية العلامة التجارية", "Trademark Protection")}>
            <div className="service-tag"><Translate ar="حماية" en="Protection" /></div>
            <div className="service-icon">™️</div>
            <div className="service-title"><Translate ar="حماية العلامة التجارية" en="Trademark Protection" /></div>
            <div className="service-sub"><Translate ar="تسجيل وحماية علامتك التجارية في مصر والخارج." en="Register and protect your trademark in Egypt and abroad." /></div>
            <div className="service-footer">
              <span className="service-price"><Translate ar="من 4,000 جنيه" en="From EGP 4,000" /></span>
              <span className="service-arrow">↗</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
