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
      panel: "Panel",
      back_to_panel: "Panele Dön",
      favorites: "Favoriler",
      cart_label: "Sepet"
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
      continuing: "DEVAM EDİLİYOR...",
      linking_required: "Bu e-posta zaten kayıtlı. Lütfen önce şifrenizle giriş yaparak hesabınızı bağlayın.",
      invalid_response: "Sunucudan geçersiz yanıt geldi.",
      google_failed: "Google ile giriş başarısız oldu.",
      apple_failed: "Apple ile giriş başarısız oldu.",
      signin_google: "Google ile giriş yap",
      signin_apple: "Apple ile giriş yap",
      loading: "Lütfen bekleyin...",
      success: "Başarılı",
      error: "Hata oluştu",
      switch_signup: "Hesabınız yok mu?",
      switch_signin: "Zaten hesabınız var mı?"
    },
    dashboard: {
      menu: "MENÜ",
      need_help: "Yardım mı lazım?",
      contact_us: "Bize Yazın",
      developed_by: "developed by",
      all_rights: ". all rights reserved.",
      seller_account: "Satıcı Hesabı",
      profile_settings: "Profil Ayarları",
      logout: "Çıkış Yap",
      nav_dashboard: "Dashboard",
      nav_dashboard_desc: "Mağaza özetiniz ve istatistikler",
      nav_customers: "Müşteri Yönetimi",
      nav_customers_desc: "Müşterileriniz ve iletişim geçmişi",
      nav_products: "Ürün Yönetimi",
      nav_products_desc: "Ürün ekleme ve stok yönetimi",
      nav_orders: "Sipariş Yönetimi",
      nav_orders_desc: "Siparişler, kargo ve iadeler",
      nav_admin_users: "Kullanıcı Yönetimi",
      nav_admin_users_desc: "Sistem kullanıcıları ve yetkilendirme",
      nav_admin_products: "Ürün Yönetimi",
      nav_admin_products_desc: "Tüm ürünler ve onay süreçleri",
      nav_admin_complaints: "Ürün Şikayetleri",
      nav_admin_complaints_desc: "Şikayet inceleme ve çözümleri",
      nav_admin_reviews: "Yorum Yönetimi",
      nav_admin_reviews_desc: "Müşteri yorumları ve moderasyon",
      nav_admin_questions: "Ürün Soruları",
      nav_admin_questions_desc: "Satıcılara sorulan soruların takibi",
      nav_admin_settings: "Sistem Ayarları",
      nav_admin_settings_desc: "Komisyon oranları ve genel ayarlar",
      admin_users_title: "Sistem Kullanıcıları",
      admin_users_total: "Toplam {count} kullanıcı",
      table_user: "KULLANICI",
      table_contact: "İLETİŞİM",
      table_role: "ROL",
      table_balance: "BAKİYE",
      table_actions: "İŞLEMLER",
      btn_balance: "Bakiye",
      btn_roles: "Roller",
      btn_block: "Engelle",
      btn_unblock: "Kaldır",
      empty_users: "Henüz hiç kullanıcı yok.",
      modal_update_balance: "Bakiye Güncelle",
      modal_update_balance_desc: "{name} kullanıcısının bakiyesini düzenliyorsunuz.",
      active_balance: "AKTİF BAKİYE (₺)",
      pending_balance: "BEKLEYEN BAKİYE (₺)",
      btn_cancel: "İptal",
      btn_save: "Kaydet",
      modal_update_role: "Rol Güncelle",
      modal_update_role_desc: "{name} kullanıcısının rollerini düzenliyorsunuz.",
      no_phone: "Telefon yok",
      anonymous: "anonim",
      loading_users: "Kullanıcılar yükleniyor..."
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
      panel: "Panel",
      back_to_panel: "Back to Panel",
      favorites: "Favorites",
      cart_label: "Cart"
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
      terms_suffix: "and",
      regulations_link: "regulations.",
      signing_in: "SIGNING IN...",
      continuing: "CONTINUING...",
      linking_required: "This email is already registered. Please sign in with your password first to link your account.",
      invalid_response: "Invalid response from server.",
      google_failed: "Google login failed.",
      apple_failed: "Apple login failed.",
      signin_google: "Sign in with Google",
      signin_apple: "Sign in with Apple",
      loading: "Please wait...",
      success: "Success",
      error: "An error occurred",
      switch_signup: "Don't have an account?",
      switch_signin: "Already have an account?"
    },
    dashboard: {
      menu: "MENU",
      need_help: "Need help?",
      contact_us: "Contact Us",
      developed_by: "developed by",
      all_rights: ". all rights reserved.",
      seller_account: "Seller Account",
      profile_settings: "Profile Settings",
      logout: "Log Out",
      nav_dashboard: "Dashboard",
      nav_dashboard_desc: "Your store overview and stats",
      nav_customers: "Customer Management",
      nav_customers_desc: "Your customers and history",
      nav_products: "Product Management",
      nav_products_desc: "Add products and inventory",
      nav_orders: "Order Management",
      nav_orders_desc: "Orders, shipping and returns",
      nav_admin_users: "User Management",
      nav_admin_users_desc: "System users and permissions",
      nav_admin_products: "Product Management",
      nav_admin_products_desc: "All products and approvals",
      nav_admin_complaints: "Product Complaints",
      nav_admin_complaints_desc: "Review complaints and solutions",
      nav_admin_reviews: "Review Management",
      nav_admin_reviews_desc: "Customer reviews and moderation",
      nav_admin_questions: "Product Questions",
      nav_admin_questions_desc: "Track questions to sellers",
      nav_admin_settings: "System Settings",
      nav_admin_settings_desc: "Commission rates and settings",
      admin_users_title: "System Users",
      admin_users_total: "Total {count} users",
      table_user: "USER",
      table_contact: "CONTACT",
      table_role: "ROLE",
      table_balance: "BALANCE",
      table_actions: "ACTIONS",
      btn_balance: "Balance",
      btn_roles: "Roles",
      btn_block: "Block",
      btn_unblock: "Unblock",
      empty_users: "No users found yet.",
      modal_update_balance: "Update Balance",
      modal_update_balance_desc: "You are editing {name}'s balance.",
      active_balance: "ACTIVE BALANCE (₺)",
      pending_balance: "PENDING BALANCE (₺)",
      btn_cancel: "Cancel",
      btn_save: "Save",
      modal_update_role: "Update Role",
      modal_update_role_desc: "You are editing {name}'s roles.",
      no_phone: "No phone",
      anonymous: "anonymous",
      loading_users: "Loading users..."
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
