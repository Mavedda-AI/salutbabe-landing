"use client";

import React from 'react';
import Link from 'next/link';
import {Location01Icon, Mail01Icon, WavingHand02Icon} from 'hugeicons-react';
import {handleOpenApp} from '@/utils/appHelpers';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useThemeLanguage();

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.container}>
        
        {/* Top Section */}
        <div className={styles.topSection}>
          
          {/* Left Column: Brand & Contact */}
          <div className={styles.brandColumn}>
            <div className={styles.logoWrapper}>
              {/* Very faint huge text for salutbabe logo */}
              <span className={styles.hugeLogoText}>salutbabe</span>
            </div>
            <p className={styles.slogan}>ANNEDEN ANNEYE GÜVENLİ ALIŞVERİŞ</p>
            
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail01Icon size={18} color="currentColor" strokeWidth={2} />
                <span>info@salutbabe.com</span>
              </div>
              <div className={styles.contactItem}>
                <Location01Icon size={18} color="currentColor" strokeWidth={2} />
                <span>London / United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Right Columns: Links */}
          <div className={styles.linksContainer}>
            
            {/* Column 1 */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>PLATFORM</h4>
              <ul className={styles.linkList}>
                <li><Link href="/new-arrivals">New Arrivals</Link></li>
                <li><Link href="/categories">Categories</Link></li>
                <li><Link href="/leaderboard">Leaderboard</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>SUPPORT</h4>
              <ul className={styles.linkList}>
                <li><Link href="/contact">{t('footer.contact_us')}</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/legal">Legal</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>FOLLOW US</h4>
              <ul className={styles.linkList}>
                <li><a href="https://instagram.com/salutbabe" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://linkedin.com/company/salutbabe" target="_blank" rel="noopener noreferrer">Linkedin</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Middle Section: App Download */}
        <div className={styles.middleSection}>
          <button onClick={handleOpenApp} className={styles.downloadButton}>
            <span className={styles.greenDot}></span>
            {t('footer.download_app')}
          </button>
        </div>

        {/* Bottom Section: Copyright */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>© 2026 Salutbabe. {t('footer.all_rights_reserved')}</p>
          <div className={styles.designer}>
            designed and coded by salutbabe <span className={styles.handIcon}><WavingHand02Icon size={16} color="currentColor" strokeWidth={2} /></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
