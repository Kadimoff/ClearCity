'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, dictionary } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'az',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('az');

  useEffect(() => {
    const saved = localStorage.getItem('clearcity_lang') as Language;
    if (saved && (saved === 'az' || saved === 'en' || saved === 'ru')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('clearcity_lang', newLang);
  };

  const t = (key: string): string => {
    return dictionary[lang]?.[key] || dictionary['az']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
