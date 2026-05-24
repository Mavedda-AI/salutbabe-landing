"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className={styles.headerWrapper}>
      {/* 1. App Banner (Black Bar) */}
      {showBanner && (
        <div className={styles.appBanner}>
          <div className={styles.bannerLeft}>
            <div className={styles.bannerLogo}>
              {/* Fallback to simple text logo if image not available */}
              <span className={styles.bannerLogoText}>salutbabe</span>
            </div>
            <div className={styles.bannerTexts}>
              <span className={styles.bannerTitle}>SalutBabe Uygulaması</span>
              <span className={styles.bannerSubtitle}>Daha hızlı alışveriş deneyimi</span>
            </div>
          </div>
          <div className={styles.bannerRight}>
            <button className={styles.openAppButton}>AÇ</button>
            <button className={styles.closeBannerButton} onClick={() => setShowBanner(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {/* Subtle gradient line at the bottom of the banner */}
          <div className={styles.bannerBottomLine}></div>
        </div>
      )}

      {/* 2. Main Header (Logo, Menu, Actions) */}
      <div className={styles.mainHeader}>
        {/* Left: Hamburger */}
        <button className={styles.hamburgerButton}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Center: Logo */}
        <Link href="/" className={styles.centerLogo}>
          <div className={styles.mainLogoIcon}>
            <span className={styles.mainLogoText}>salutbabe</span>
          </div>
          <div className={styles.mainLogoTexts}>
            <span className={styles.mainLogoTitle}>SalutBabe</span>
            <span className={styles.mainLogoSubtitle}>Anneden Anneye</span>
          </div>
        </Link>

        {/* Right: Actions (Panel, Moon, Lang) */}
        <div className={styles.headerActions}>
          <button className={styles.panelButton}>PANEL</button>
          <button className={styles.actionIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button className={styles.actionIconLang}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span className={styles.langText}>TR</span>
          </button>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Ara..." className={styles.searchInput} />
        </div>
      </div>
    </header>
  );
}
