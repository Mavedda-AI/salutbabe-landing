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
      id: 'sell',
      title: 'Nasıl Satış Yaparım?',
      content: 'Salutbabe\'de satış yapmak çok kolay! Ürün fotoğrafını çek, açıklamanı yaz ve ücretsiz olarak listele. Alıcı bulunduğunda güvenli kargo ile gönderim yap.'
    },
    {
      id: 'faq',
      title: 'Sıkça Sorulan Sorular',
      content: 'Ödemeler, kargo süreçleri ve iade koşulları hakkında en çok merak edilen soruların yanıtlarına canlı destek merkezimizden ulaşabilirsiniz.'
    },
    {
      id: 'shipping',
      title: 'Kargo ve Teslimat',
      content: 'Siparişleriniz anlaşmalı kargo firmalarımız ile 1-3 iş günü içerisinde güvenle adresinize teslim edilir. Kargo takibini hesabınızdan yapabilirsiniz.'
    },
    {
      id: 'terms',
      title: 'Kullanıcı Sözleşmesi',
      content: 'Platformumuzu kullanırken hem alıcıları hem de satıcıları koruyan güncel kurallarımız ve yasal yükümlülükler bu sözleşme çatısı altında yer almaktadır.'
    },
    {
      id: 'privacy',
      title: 'Gizlilik Politikası',
      content: 'Kişisel verileriniz üst düzey güvenlik önlemleriyle korunmakta olup, üçüncü şahıslarla asla paylaşılmamaktadır. Detaylar için KVKK metnini inceleyebilirsiniz.'
    },
    {
      id: 'about',
      title: 'Hakkımızda',
      content: 'Salutbabe, annelerin bebek ve çocuk kıyafetlerini güvenle alıp satabileceği, sürdürülebilir modaya katkı sağlayan Türkiye\'nin en güvenilir ikinci el alışveriş topluluğudur.'
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
        <div className={styles.appDownloadTitle}>Salutbabe uygulamasını indirin</div>
        <div className={styles.appDownloadText}>Daha hızlı listeleyin, siparişlerinizi takip edin ve hiçbir yeniliği kaçırmayın.</div>
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
