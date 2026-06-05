"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';

import tr from '../locales/tr.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';

export const dictionaries = {
  tr,
  en,
  fr,
  de
};

type Language = 'tr' | 'en' | 'fr' | 'de';
type Theme = 'light' | 'dark';

interface ThemeLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (keyPath: string) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('tr');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // 1. Initial Defaults
    let initialLang: Language = 'tr';
    let initialTheme: Theme = 'light';

    // 2. Check LocalStorage
    const savedLang = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;

    // 3. Check User Preferences (High Priority if logged in)
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Backend stores preferences directly or in userPreferences object (mobile parity)
        const langSource = user.defaultLanguage || user.userPreferences?.defaultLanguage || user.language;
        if (langSource) {
          const lang = String(langSource).toUpperCase();
          if (lang === 'TURKISH' || lang === 'TR') initialLang = 'tr';
          else if (lang === 'ENGLISH' || lang === 'EN') initialLang = 'en';
          else if (lang === 'FRENCH' || lang === 'FR') initialLang = 'fr';
          else if (lang === 'GERMAN' || lang === 'DE') initialLang = 'de';
        }
        
        const themeSource = user.defaultTheme || user.userPreferences?.defaultTheme || user.theme;
        if (themeSource) {
          const themePref = String(themeSource).toUpperCase();
          if (themePref === 'DARK') initialTheme = 'dark';
          else if (themePref === 'LIGHT') initialTheme = 'light';
        }
      } catch (e) {}
    } else {
      // If not logged in, use local storage or browser defaults
      if (savedLang) initialLang = savedLang;
      if (savedTheme) initialTheme = savedTheme;
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // initialTheme = 'dark'; // Commented out to strictly follow "default light" request
      }
    }

    setLanguage(initialLang);
    setTheme(initialTheme);
    document.documentElement.lang = initialLang;
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const t = (keyPath: string) => {
    const keys = keyPath.split('.');
    let translation: any = dictionaries[language];
    
    for (const key of keys) {
      if (translation && translation[key]) {
        translation = translation[key];
      } else {
        // Fallback to English
        let fallback: any = dictionaries['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey]) {
            fallback = fallback[fKey];
          } else {
            return keyPath;
          }
        }
        return fallback;
      }
    }
    
    return typeof translation === 'string' ? translation : keyPath;
  };

  return (
    <ThemeLanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, theme, toggleTheme, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
