"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';

import tr from '../locales/tr.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

export const dictionaries = {
  tr,
  en,
  fr
};

type Language = 'tr' | 'en' | 'fr';
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
        // Backend stores preferences in userPreferences object (mobile parity)
        if (user.userPreferences?.language) initialLang = user.userPreferences.language.toLowerCase() as Language;
        if (user.userPreferences?.theme) initialTheme = user.userPreferences.theme.toLowerCase() as Theme;
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
