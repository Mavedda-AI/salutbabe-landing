"use client";

import React, {useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {ArrowDown01Icon, ArrowUp01Icon, InstagramIcon, NewTwitterIcon, TiktokIcon} from 'hugeicons-react';

export default function CountrySelectorFooter() {
  const { language, setLanguage, t } = useThemeLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  const handleLanguageChange = (lang: 'tr' | 'en' | 'fr' | 'de') => {
    setLanguage(lang);
  };

  const accordions = [
    {
      id: 'sell',
      title: t('widgets.footer_sell'),
      content: t('widgets.footer_sell_desc')
    },
    {
      id: 'faq',
      title: t('widgets.footer_faq'),
      content: t('widgets.footer_faq_desc')
    },
    {
      id: 'shipping',
      title: t('widgets.footer_shipping'),
      content: t('widgets.footer_shipping_desc')
    },
    {
      id: 'terms',
      title: t('widgets.footer_terms'),
      content: t('widgets.footer_terms_desc')
    },
    {
      id: 'privacy',
      title: t('widgets.footer_privacy'),
      content: t('widgets.footer_privacy_desc')
    },
    {
      id: 'about',
      title: t('widgets.footer_about'),
      content: t('widgets.footer_about_desc')
    }
  ];

  return (
    <footer className={styles.accordionFooter}>
      {accordions.map((acc) => (
        <div key={acc.id} className={styles.accordionItem}>
          <button 
            className={styles.accordionHeader} 
            onClick={() => toggleSection(acc.id)}
          >
            {acc.title}
            {openSection === acc.id ? <ArrowUp01Icon size={20} /> : <ArrowDown01Icon size={20} />}
          </button>
          {openSection === acc.id && (
            <div className={styles.accordionContent}>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {acc.content}
              </p>
            </div>
          )}
        </div>
      ))}

      <div className={styles.appDownloadSection}>
        <div className={styles.appDownloadTitle}>{t('widgets.country_app_title')}</div>
        <div className={styles.appDownloadText}>{t('widgets.country_app_desc')}</div>
        <div className={styles.storeButtons}>
          <a href="https://apps.apple.com/us/app/salutbabe/id6759988511" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: 40 }} />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: 40 }} />
          </a>
        </div>
      </div>

      <div className={styles.socialLinks}>
        <a href="https://x.com/salutbabecom" target="_blank" rel="noopener noreferrer">
          <NewTwitterIcon size={24} color="#111" />
        </a>
        <a href="https://instagram.com/salutbabecom" target="_blank" rel="noopener noreferrer">
          <InstagramIcon size={24} color="#111" />
        </a>
        <a href="https://tiktok.com/@salutbabecom" target="_blank" rel="noopener noreferrer">
          <TiktokIcon size={24} color="#111" />
        </a>
      </div>

      <div className={styles.seoSection}>
        <div className={styles.seoTitle}>{t('widgets.country_seo_title')}</div>
        <a href="#" className={styles.seoLink}>{t('widgets.country_seo_link')}</a>
      </div>

      <div className={styles.languageSelector} style={{ marginTop: 24 }}>
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

      <div className={styles.copyright} style={{ color: '#666', marginTop: 24 }}>
        © 2026 salutbabe. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
