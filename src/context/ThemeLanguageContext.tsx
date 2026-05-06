"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';

export const dictionaries = {
  tr: {
    header: {
      shop: "Mağaza",
      new_arrivals: "Yeni Gelenler",
      brands: "Markalar",
      sell: "Satış Yap",
      search: "Ara",
      login: "Giriş Yap",
      categories: "Kategoriler"
    },
    home: {
      new_arrivals: "Yeni Gelenler",
      best_sellers: "En Çok Satanlar",
      new_arrivals_desc: "Özenle seçilmiş en yeni ürünlerimizle ilk siz tanışın.",
      best_sellers_desc: "Topluluğumuzun en sevdiği temel bebek ihtiyaçları.",
      explore_all: "TÜMÜNÜ KEŞFET",
      ready_to_join: "Hazırsan salutbabe ailesine katıl.",
      create_account: "ÜCRETSİZ HESAP OLUŞTUR",
      download_app: "UYGULAMAYI İNDİR",
      no_products: "Henüz bu kategoride ürün bulunmuyor.",
      loading: "Yükleniyor..."
    },
    stats: {
      secure_payments: "GÜVENLİ ÖDEME",
      active_members: "AKTİF ÜYE",
      curated_brands: "ÖZEL MARKA",
      support_line: "DESTEK HATTI"
    }
  },
  en: {
    header: {
      shop: "Shop",
      new_arrivals: "New Arrivals",
      brands: "Brands",
      sell: "Sell",
      search: "Search",
      login: "Log in",
      categories: "Categories"
    },
    home: {
      new_arrivals: "New Arrivals",
      best_sellers: "Best Sellers",
      new_arrivals_desc: "Be the first to get our latest handpicked items.",
      best_sellers_desc: "Our community's most-loved essentials.",
      explore_all: "EXPLORE ALL",
      ready_to_join: "Ready to join the salutbabe family?",
      create_account: "CREATE FREE ACCOUNT",
      download_app: "DOWNLOAD OUR APP",
      no_products: "No products found in this category.",
      loading: "Loading..."
    },
    stats: {
      secure_payments: "SECURE PAYMENTS",
      active_members: "ACTIVE MEMBERS",
      curated_brands: "CURATED BRANDS",
      support_line: "SUPPORT LINE"
    }
  }
};

type Language = 'tr' | 'en';
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
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
      document.documentElement.lang = savedLang;
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
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
