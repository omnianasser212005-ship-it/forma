import { useState, useEffect, useCallback } from 'react';
import arTranslations from '../i18n/ar.json';
import enTranslations from '../i18n/en.json';

type Language = 'ar' | 'en';

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('forma-lang') as Language) || 'ar';
  });

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      setLang(customEvent.detail);
    };

    window.addEventListener('forma-lang-change', handleLangChange);
    return () => window.removeEventListener('forma-lang-change', handleLangChange);
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('forma-lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    
    // Dispatch global event to sync all useTranslation hooks across components
    window.dispatchEvent(new CustomEvent('forma-lang-change', { detail: newLang }));
  }, []);

  const t = useCallback((key: string): string => {
    const translations: Record<string, string> = lang === 'ar' ? arTranslations : enTranslations;
    return (translations as any)[key] || key;
  }, [lang]);

  return { t, lang, changeLanguage };
};
