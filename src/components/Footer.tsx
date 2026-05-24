"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>info@salutbabe.com</span>
              </div>
              <div className={styles.contactItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
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
                <li><Link href="/new-arrivals">NEW ARRIVALS</Link></li>
                <li><Link href="/categories">CATEGORIES</Link></li>
                <li><Link href="/leaderboard">LEADERBOARD</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>SUPPORT</h4>
              <ul className={styles.linkList}>
                <li><Link href="/contact">CONTACT</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/legal">LEGAL</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>FOLLOW US</h4>
              <ul className={styles.linkList}>
                <li><a href="https://instagram.com/salutbabe" target="_blank" rel="noopener noreferrer">INSTAGRAM</a></li>
                <li><a href="https://linkedin.com/company/salutbabe" target="_blank" rel="noopener noreferrer">LINKEDIN</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Middle Section: App Download */}
        <div className={styles.middleSection}>
          <a href="#" className={styles.downloadButton}>
            <span className={styles.greenDot}></span>
            Download App
          </a>
        </div>

        {/* Bottom Section: Copyright */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>© 2026 salutbabe. ALL RIGHTS RESERVED.</p>
          <div className={styles.designer}>
            designed by <span className={styles.handIcon}>👋</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
