"use client";

import React, {useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {ArrowDown01Icon, ArrowUp01Icon, InstagramIcon, NewTwitterIcon, TiktokIcon} from 'hugeicons-react';

export default function CountrySelectorFooter() {
  const { language, setLanguage } = useThemeLanguage();
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
      id: 'salutbabe',
      title: 'Salutbabe',
      links: ['Hakkımızda', 'Kariyer', 'Basın', 'Sürdürülebilirlik', 'Haberler']
    },
    {
      id: 'sell',
      title: 'Satış',
      links: ['Nasıl Satış Yaparım?', 'Satış Rehberi', 'Güvenli Ödeme', 'Satıcı Kuralları']
    },
    {
      id: 'help',
      title: 'Yardım',
      links: ['Sıkça Sorulan Sorular', 'Bize Ulaşın', 'Kargo ve Teslimat', 'İade Şartları', 'Güvenlik Merkezi']
    },
    {
      id: 'site_info',
      title: 'Site Bilgileri',
      links: ['Gizlilik Politikası', 'Kullanıcı Sözleşmesi', 'Çerez Politikası']
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
              {acc.links.map((link, idx) => (
                <a key={idx} href="#">{link}</a>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className={styles.appDownloadSection}>
        <div className={styles.appDownloadTitle}>Salutbabe uygulamasını indirin</div>
        <div className={styles.appDownloadText}>Daha hızlı listeleyin, siparişlerinizi takip edin ve hiçbir yeniliği kaçırmayın.</div>
        <div className={styles.storeButtons}>
          <a href="https://apps.apple.com/us/app/salutbabe/id6759988511" target="_blank" rel="noopener noreferrer" className={styles.storeBtn}>
            App Store
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" target="_blank" rel="noopener noreferrer" className={styles.storeBtn}>
            Google Play
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
        <div className={styles.seoTitle}>Şunlar da İlginizi Çekebilir</div>
        <a href="#" className={styles.seoLink}>Vintage Bebek Elbiseleri</a>
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
