import { Translate } from '@/components/ui/Translate';
import { ChatBot } from '../chat/ChatBot';

export const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>
        <div className="hero-grid"></div>
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span>
            <Translate ar="منصة موثوقة من آلاف الشركات في مصر" en="Trusted by thousands of businesses in Egypt" />
          </span>
        </div>
        <h1 className="hero-title">
          <span><Translate ar="مسارك القانوني في مصر،" en="Your legal journey in Egypt," /></span><br />
          <span className="accent-line"><Translate ar="بدون تعقيدات" en="without complications" /></span>
        </h1>
        <p className="hero-sub">
          <Translate
            ar="منصة قانونية ذكية تساعد الأفراد والشركات على إنهاء إجراءاتهم القانونية بسرعة وسهولة — من تأسيس الشركات إلى حماية علامتك التجارية."
            en="A smart legal platform helping individuals and businesses complete their legal procedures quickly and easily — from company formation to brand protection."
          />
        </p>
        <div className="hero-cta-row">
          <button className="btn-primary" onClick={() => document.getElementById('services')?.scrollIntoView()}>
            <span><Translate ar="ابدأ الآن" en="Get Started" /></span>
            <span><Translate ar="←" en="→" /></span>
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('how')?.scrollIntoView()}>
            <span><Translate ar="كيف يعمل؟" en="How it works?" /></span>
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item"><div className="stat-num">+3,200</div><div className="stat-label"><Translate ar="شركة تأسست" en="Companies Formed" /></div></div>
          <div className="stat-item"><div className="stat-num">98%</div><div className="stat-label"><Translate ar="نسبة رضا العملاء" en="Client Satisfaction" /></div></div>
          <div className="stat-item"><div className="stat-num">72hrs</div><div className="stat-label"><Translate ar="متوسط وقت الإنجاز" en="Average Completion" /></div></div>
          <div className="stat-item"><div className="stat-num">100%</div><div className="stat-label"><Translate ar="حفظ وأمان" en="Secure & Safe" /></div></div>
        </div>
      </div>
      <ChatBot />
    </section>
  );
};
