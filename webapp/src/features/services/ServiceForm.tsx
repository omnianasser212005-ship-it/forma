import React, { useState } from 'react';
import { Translate } from '@/components/ui/Translate';
import { submitServiceRequest } from '@/services/serviceApi';

export const ServiceForm: React.FC<{ defaultService?: string; onSuccess?: () => void }> = ({ defaultService = 'تأسيس الشركات', onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    company: '',
    company_type: '',
    activity: '',
    capital: '',
    service: defaultService
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.age || !formData.phone || !formData.email) {
      setMessage({ text: 'يرجى إكمال جميع الحقول المطلوبة', type: 'error' });
      return false;
    }
    setMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.company || !formData.company_type || !formData.activity || !formData.capital) {
      setMessage({ text: 'يرجى إكمال جميع الحقول المطلوبة', type: 'error' });
      return false;
    }
    setMessage(null);
    return true;
  };

  const validateStep3 = () => {
    if (!files.id_front || !files.id_back) {
      setMessage({ text: 'يرجى إرفاق صور البطاقة (الأمامية والخلفية)', type: 'error' });
      return false;
    }
    setMessage(null);
    return true;
  };

  const validateStep4 = () => {
    if (!files.poa) {
      setMessage({ text: 'يرجى إرفاق التوكيل الرسمي', type: 'error' });
      return false;
    }
    setMessage(null);
    return true;
  };

  const validateStep5 = () => {
    if (!files.rent) {
      setMessage({ text: 'يرجى إرفاق عقد الإيجار', type: 'error' });
      return false;
    }
    setMessage(null);
    return true;
  };

  const validateStep6 = () => {
    if (!files.electricity || !files.water) {
      setMessage({ text: 'يرجى إرفاق فواتير المرافق (الكهرباء والمياه)', type: 'error' });
      return false;
    }
    setMessage(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
    else if (currentStep === 4 && validateStep4()) setCurrentStep(5);
    else if (currentStep === 5 && validateStep5()) setCurrentStep(6);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep6()) return;

    setIsLoading(true);
    setMessage(null);
    
    // Fallback assignment to ensure correct service name gets submitted if changed randomly
    const finalData = { ...formData, service: defaultService };

    const response = await submitServiceRequest(finalData, files);
    
    setIsLoading(false);
    if (response.success) {
      setMessage({ text: "تم إرسال الطلب بنجاح سنقوم بالتواصل معك قريباً ✓", type: 'success' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 3000);
    } else {
      setMessage({ text: "حدث خطأ: " + response.message, type: 'error' });
    }
  };

  const docsMapping = [
    { key: 'id_front', ar: 'صورة البطاقة الأمامية', en: 'Front ID Photo', desc_ar: 'الوجه الأمامي لبطاقة الرقم القومي السارية', desc_en: 'Front side of valid National ID' },
    { key: 'id_back', ar: 'صورة البطاقة الخلفية', en: 'Back ID Photo', desc_ar: 'الوجه الخلفي لبطاقة الرقم القومي', desc_en: 'Back side of National ID' },
    { key: 'poa', ar: 'توكيل رسمي', en: 'Power of Attorney', desc_ar: 'توكيل عام للمحامي لتأسيس الشركة', desc_en: 'Official POA for company formation' },
    { key: 'electricity', ar: 'إيصال كهرباء', en: 'Electricity Bill', desc_ar: 'إيصال حديث لمقر الشركة', desc_en: 'Recent electricity bill for HQ' },
    { key: 'water', ar: 'إيصال مياه', en: 'Water Bill', desc_ar: 'إيصال حديث يثبت العنوان', desc_en: 'Recent water bill proving address' },
    { key: 'rent', ar: 'عقد إيجار', en: 'Rent Contract', desc_ar: 'عقد إيجار موثق في الشهر العقاري', desc_en: 'Registered rent contract' },
  ];

  const renderDocs = (keys: string[]) => {
    return (
      <div className="flex flex-col gap-5 mt-6 mb-8 w-full">
        {docsMapping.filter(d => keys.includes(d.key)).map((doc) => {
          const isUploaded = !!files[doc.key];
          return (
            <label key={doc.key} className={`flex items-center justify-between p-5 rounded-[24px] border transition-all duration-300 cursor-pointer ${
              isUploaded 
                ? 'bg-[#c8a45d]/5 border-[#c8a45d]/30 shadow-[0_4px_20px_rgba(200,164,93,0.08)] -translate-y-1' 
                : 'bg-[#161616] border-white/5 hover:border-white/10 hover:bg-[#1a1a1a] shadow-lg'
            }`}>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                     const file = e.target.files[0];
                     setFiles(prev => ({ ...prev, [doc.key]: file }));
                  }
                }} 
              />
              
              <div className="flex items-center gap-5 w-full overflow-hidden shrink pr-4">
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-colors ${
                  isUploaded ? 'bg-[#c8a45d]/20 text-[#c8a45d]' : 'bg-white/5 text-white/40'
                }`}>
                  {isUploaded ? '✓' : '📄'}
                </div>
                <div className="flex flex-col text-start overflow-hidden w-full gap-1">
                  <span className={`font-bold text-[15px] truncate ${isUploaded ? 'text-[#c8a45d]' : 'text-white'}`}>
                    <Translate ar={doc.ar} en={doc.en} />
                  </span>
                  {isUploaded ? (
                    <span className="text-xs text-white/70 truncate w-full" dir="ltr">{files[doc.key]?.name}</span>
                  ) : (
                    <span className="text-xs text-white/40 truncate w-full">
                       <Translate ar={doc.desc_ar} en={doc.desc_en} />
                    </span>
                  )}
                </div>
              </div>

              <div className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isUploaded 
                  ? 'bg-[#c8a45d] text-black shadow-[0_0_15px_rgba(200,164,93,0.4)]' 
                  : 'bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white'
              }`}>
                {isUploaded ? <Translate ar="تم الرفع" en="Uploaded" /> : <Translate ar="اختر الملف" en="Upload" />}
              </div>
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* Steps Progress */}
      <div className="steps-progress" style={{ gridTemplateColumns: 'repeat(6, min-content 1fr) min-content' }}>
        <div><div className={`step-dot ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'done' : ''}`}>1</div></div>
        <div className={`step-line ${currentStep > 1 ? 'done' : ''}`}></div>
        <div><div className={`step-dot ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'done' : ''}`}>2</div></div>
        <div className={`step-line ${currentStep > 2 ? 'done' : ''}`}></div>
        <div><div className={`step-dot ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'done' : ''}`}>3</div></div>
        <div className={`step-line ${currentStep > 3 ? 'done' : ''}`}></div>
        <div><div className={`step-dot ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'done' : ''}`}>4</div></div>
        <div className={`step-line ${currentStep > 4 ? 'done' : ''}`}></div>
        <div><div className={`step-dot ${currentStep >= 5 ? 'active' : ''} ${currentStep > 5 ? 'done' : ''}`}>5</div></div>
        <div className={`step-line ${currentStep > 5 ? 'done' : ''}`}></div>
        <div><div className={`step-dot ${currentStep >= 6 ? 'active' : ''}`}>6</div></div>
      </div>

      {message && (
        <div className={`form-message visible ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Step 1: Personal Info */}
      <div className={`step-panel ${currentStep === 1 ? 'active' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-6"><Translate ar="بياناتك الشخصية" en="Personal Information" /></h3>
        <div className="field-row">
          <div className="field-group">
            <label className="field-label"><Translate ar="الاسم الكامل *" en="Full Name *" /></label>
            <input type="text" className="field-input" name="name" value={formData.name} onChange={handleChange} placeholder="محمد أحمد" />
          </div>
          <div className="field-group">
            <label className="field-label"><Translate ar="العمر *" en="Age *" /></label>
            <input type="number" className="field-input" name="age" value={formData.age} onChange={handleChange} placeholder="25" min="18" />
          </div>
        </div>
        <div className="field-group">
          <label className="field-label"><Translate ar="رقم الهاتف *" en="Phone Number *" /></label>
          <input type="tel" className="field-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
        </div>
        <div className="field-group">
          <label className="field-label"><Translate ar="البريد الإلكتروني *" en="Email *" /></label>
          <input type="email" className="field-input" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
        </div>
        <div className="step-nav">
          <div></div>
          <button className="btn-next" onClick={handleNext}>
            <span><Translate ar="التالي ←" en="Next →" /></span>
          </button>
        </div>
      </div>

      {/* Step 2: Company Info */}
      <div className={`step-panel ${currentStep === 2 ? 'active' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-6"><Translate ar="بيانات الشركة" en="Company Information" /></h3>
        <div className="field-group">
          <label className="field-label"><Translate ar="اسم الشركة *" en="Company Name *" /></label>
          <input type="text" className="field-input" name="company" value={formData.company} onChange={handleChange} placeholder="شركة X للتجارة والتوزيع" />
        </div>
        <div className="field-group">
          <label className="field-label"><Translate ar="نوع الشركة *" en="Company Type *" /></label>
          <select className="field-select" name="company_type" value={formData.company_type} onChange={handleChange}>
            <option value=""><Translate ar="اختر نوع الشركة..." en="Select company type..." /></option>
            <option value="llc"><Translate ar="شركة ذات مسؤولية محدودة" en="LLC" /></option>
            <option value="jsc"><Translate ar="شركة مساهمة" en="Joint Stock Company" /></option>
            <option value="sole"><Translate ar="مؤسسة فردية" en="Sole Proprietorship" /></option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label"><Translate ar="نشاط الشركة *" en="Business Activity *" /></label>
          <input type="text" className="field-input" name="activity" value={formData.activity} onChange={handleChange} placeholder="تجارة الجملة والتجزئة" />
        </div>
        <div className="field-group">
          <label className="field-label"><Translate ar="رأس المال المبدئي *" en="Initial Capital *" /></label>
          <input type="number" className="field-input" name="capital" value={formData.capital} onChange={handleChange} placeholder="50000" />
        </div>
        <div className="step-nav">
          <button className="btn-back" onClick={handleBack}>
            <Translate ar="→ رجوع" en="← Back" />
          </button>
          <button className="btn-next" onClick={handleNext}>
            <Translate ar="التالي ←" en="Next →" />
          </button>
        </div>
      </div>

      {/* Step 3: IDs */}
      <div className={`step-panel ${currentStep === 3 ? 'active' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-2"><Translate ar="أولاً: إثبات الهوية" en="First: Proof of Identity" /></h3>
        <p className="step-docs-hint">
          <Translate ar="يُرجى إرفاق صور البطاقة الشخصية الخاصة بك." en="Please upload photos of your national ID." />
        </p>

        {renderDocs(['id_front', 'id_back'])}

        <div className="step-nav">
          <button className="btn-back" onClick={handleBack} disabled={isLoading}>
            <Translate ar="→ رجوع" en="← Back" />
          </button>
          <button className="btn-next" onClick={handleNext} disabled={isLoading}>
            <span><Translate ar="التالي ←" en="Next →" /></span>
          </button>
        </div>
      </div>

      {/* Step 4: POA */}
      <div className={`step-panel ${currentStep === 4 ? 'active' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-2"><Translate ar="ثانياً: التوكيل" en="Second: Power of Attorney" /></h3>
        <p className="step-docs-hint">
          <Translate ar="يُرجى إرفاق التوكيل الرسمي الخاص بالمحامي." en="Please upload the official Power of Attorney." />
        </p>

        {renderDocs(['poa'])}

        <div className="step-nav">
          <button className="btn-back" onClick={handleBack} disabled={isLoading}>
            <Translate ar="→ رجوع" en="← Back" />
          </button>
          <button className="btn-next" onClick={handleNext} disabled={isLoading}>
            <span><Translate ar="التالي ←" en="Next →" /></span>
          </button>
        </div>
      </div>

      {/* Step 5: Rent Contract */}
      <div className={`step-panel ${currentStep === 5 ? 'active' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-2"><Translate ar="ثالثاً: مقر الشركة" en="Third: Company Headquarters" /></h3>
        <p className="step-docs-hint">
          <Translate ar="يُرجى إرفاق عقد إيجار المقر الموثق." en="Please upload the registered rent contract." />
        </p>

        {renderDocs(['rent'])}

        <div className="step-nav">
          <button className="btn-back" onClick={handleBack} disabled={isLoading}>
            <Translate ar="→ رجوع" en="← Back" />
          </button>
          <button className="btn-next" onClick={handleNext} disabled={isLoading}>
            <span><Translate ar="التالي ←" en="Next →" /></span>
          </button>
        </div>
      </div>

      {/* Step 6: Utilities and Submit */}
      <div className={`step-panel ${currentStep === 6 ? 'active' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-2"><Translate ar="رابعاً: فواتير المرافق" en="Fourth: Utility Bills" /></h3>
        <p className="step-docs-hint">
          <Translate ar="يُرجى إرفاق إيصالات المرافق الخاصة بمقر الشركة لإتمام الطلب." en="Please upload the utility bills for the headquarters to complete your request." />
        </p>

        {renderDocs(['electricity', 'water'])}

        <div className="step-nav">
          <button className="btn-back" onClick={handleBack} disabled={isLoading}>
            <Translate ar="→ رجوع" en="← Back" />
          </button>
          <button className="btn-submit btn-submit-auto" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <span><Translate ar="إرسال الطلب النهائي ✓" en="Submit Final Request ✓" /></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
