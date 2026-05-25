"use client";

import React from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

export default function CountrySelectorFooter() {
  const { t, language, setLanguage } = useThemeLanguage();

  const handleLanguageChange = (lang: 'tr' | 'en' | 'fr' | 'de') => {
    setLanguage(lang);
  };

  return (
    <footer className={styles.countryFooter}>
      <div className={styles.footerLinks}>
        <a href="#">{t('footer.download_app')}</a>
        <a href="#">{t('footer.contact_us')}</a>
        <a href="#">{t('footer.secure_payment')}</a>
        <a href="#">{t('footer.return_policy')}</a>
      </div>
      
      <div className={styles.languageSelector}>
        <button 
          className={`${styles.langBtn} ${language === 'tr' ? styles.langActive : ''}`} 
          onClick={() => handleLanguageChange('tr')}
        >
          🇹🇷 Türkiye
        </button>
        <button 
          className={`${styles.langBtn} ${language === 'en' ? styles.langActive : ''}`} 
          onClick={() => handleLanguageChange('en')}
        >
          🇬🇧 UK
        </button>
        <button 
          className={`${styles.langBtn} ${language === 'de' ? styles.langActive : ''}`} 
          onClick={() => handleLanguageChange('de')}
        >
          🇩🇪 Deutschland
        </button>
        <button 
          className={`${styles.langBtn} ${language === 'fr' ? styles.langActive : ''}`} 
          onClick={() => handleLanguageChange('fr')}
        >
          🇲🇦 Morocco
        </button>
      </div>

      <div className={styles.copyright}>
        © 2026 salutbabe. {t('footer.all_rights_reserved')}
      </div>
    </footer>
  );
}
