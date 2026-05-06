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
      categories: "Kategoriler",
      panel: "Panel"
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
    },
    download: {
      title_main: "salutbabe'i",
      title_sub: "İndir",
      description: "Anneler için tasarlanmış ikinci el giyim platformuna katılın. Bebeğinizin kıyafetlerini satın, yeni ürünler keşfedin ve topluluğumuzun bir parçası olun.",
      detecting: "Cihazınız tespit ediliyor...",
      ios_msg: "Uygulamayı App Store'dan indirebilirsiniz",
      android_msg: "Uygulamayı Google Play'den indirebilirsiniz",
      desktop_msg: "Uygulamamızı mağazalardan indirebilirsiniz",
      app_store_top: "App Store'dan",
      app_store_bottom: "İndirin",
      play_store_top: "Google Play'den",
      play_store_bottom: "Alın"
    },
    leaderboard: {
      title: "En İyiler.",
      subtitle_main: "salutbabe",
      subtitle_sub: "Yıldızları.",
      metric_earnings: "KAZANÇ",
      metric_sales: "SATIŞ",
      tf_daily: "GÜNLÜK",
      tf_weekly: "HAFTALIK",
      tf_monthly: "AYLIK",
      sales_unit: "Satış",
      status_active: "AKTİF",
      loading: "Yükleniyor...",
      no_data: "Henüz bu dönemde veri bulunmuyor."
    },
    auth: {
      welcome: "salutbabe'e Hoş Geldin.",
      signin_desc: "Hesabına giriş yap.",
      join: "salutbabe'e Katıl.",
      signup_desc: "Başlamak için hesap oluştur.",
      email: "E-posta Adresi",
      password: "Şifre",
      signin_btn: "GİRİŞ YAP",
      signup_btn: "KAYIT OL",
      google_signin: "Google ile devam et",
      apple_signin: "Apple ile devam et",
      google_signup: "Google ile kayıt ol",
      apple_signup: "Apple ile kayıt ol",
      or_email: "veya e-posta kullan",
      no_account: "Hesabın yok mu?",
      have_account: "Zaten hesabın var mı?",
      signup_link: "Kayıt ol",
      signin_link: "Giriş yap",
      terms_prefix: "Devam ederek",
      terms_link: "kullanım şartlarımızı",
      terms_suffix: "kabul etmiş sayılırsınız.",
      signing_in: "GİRİŞ YAPILIYOR...",
      continuing: "DEVAM EDİLİYOR..."
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
      categories: "Categories",
      panel: "Panel"
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
    },
    download: {
      title_main: "Download",
      title_sub: "salutbabe",
      description: "Join the pre-loved clothing platform designed for mothers. Sell your baby's clothes, discover new items, and become part of our community.",
      detecting: "Detecting your device...",
      ios_msg: "You can download the app from the App Store",
      android_msg: "You can download the app from Google Play",
      desktop_msg: "You can download our app from the stores",
      app_store_top: "Download on the",
      app_store_bottom: "App Store",
      play_store_top: "Get it on",
      play_store_bottom: "Google Play"
    },
    leaderboard: {
      title: "The Best.",
      subtitle_main: "salutbabe",
      subtitle_sub: "Stars.",
      metric_earnings: "EARNINGS",
      metric_sales: "SALES",
      tf_daily: "DAILY",
      tf_weekly: "WEEKLY",
      tf_monthly: "MONTHLY",
      sales_unit: "Sales",
      status_active: "ACTIVE",
      loading: "Loading...",
      no_data: "No data available for this period."
    },
    auth: {
      welcome: "Welcome to salutbabe.",
      signin_desc: "Sign in to your account.",
      join: "Join salutbabe.",
      signup_desc: "Create an account to get started.",
      email: "Email Address",
      password: "Password",
      signin_btn: "SIGN IN",
      signup_btn: "SIGN UP",
      google_signin: "Continue with Google",
      apple_signin: "Continue with Apple",
      google_signup: "Sign up with Google",
      apple_signup: "Sign up with Apple",
      or_email: "or use email",
      no_account: "Don't have an account?",
      have_account: "Already have an account?",
      signup_link: "Sign up",
      signin_link: "Sign in",
      terms_prefix: "By continuing, you agree to our",
      terms_link: "terms of use",
      terms_suffix: "and conditions.",
      signing_in: "SIGNING IN...",
      continuing: "CONTINUING..."
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
