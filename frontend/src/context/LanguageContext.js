import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext({ lang: 'en', switchLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('jobmart_lang') || 'en');

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('jobmart_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
