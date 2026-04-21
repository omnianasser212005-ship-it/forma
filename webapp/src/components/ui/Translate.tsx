import React, { useState, useEffect } from 'react';

export const Translate: React.FC<{ ar: React.ReactNode; en: React.ReactNode }> = ({ ar, en }) => {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('forma-lang') as 'ar' | 'en') || 'ar';
  });

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<'ar' | 'en'>;
      setLang(customEvent.detail);
    };

    window.addEventListener('forma-lang-change', handleLangChange);
    return () => window.removeEventListener('forma-lang-change', handleLangChange);
  }, []);

  return <>{lang === 'ar' ? ar : en}</>;
};
