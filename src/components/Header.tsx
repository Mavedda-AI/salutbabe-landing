"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Cancel01Icon, GlobalIcon, Menu01Icon, Moon02Icon, Search01Icon} from 'hugeicons-react';
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
              <Cancel01Icon size={20} color="currentColor" strokeWidth={2} />
            </button>
          </div>
          {/* Subtle gradient line at the bottom of the banner */}
          <div className={styles.bannerBottomLine}></div>
        </div>
      )}

      {/* 2. Main Header (Logo, Menu, Actions) */}
      <div className={styles.mainHeader}>
        {/* Left Side: Hamburger & Logo */}
        <div className={styles.headerLeft}>
          <button className={styles.hamburgerButton}>
            <Menu01Icon size={28} color="currentColor" strokeWidth={2} />
          </button>

          <Link href="/" className={styles.mainLogo}>
            <div className={styles.mainLogoTexts}>
              <Image 
                src="/assets/images/logo/logo_salutbabe.png" 
                alt="SalutBabe Logo" 
                width={130} 
                height={30} 
                className={styles.mainLogoImage} 
              />
              <span className={styles.mainLogoSubtitle}>Anneden Anneye</span>
            </div>
          </Link>
        </div>

        {/* Right: Actions (Panel, Moon, Lang) */}
        <div className={styles.headerActions}>
          <button className={styles.panelButton}>PANEL</button>
          <button className={styles.actionIcon}>
            <Moon02Icon size={24} color="currentColor" strokeWidth={2} />
          </button>
          <button className={styles.actionIconLang}>
            <GlobalIcon size={20} color="currentColor" strokeWidth={2} />
            <span className={styles.langText}>TR</span>
          </button>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Search01Icon className={styles.searchIcon} size={20} color="currentColor" strokeWidth={2} />
          <input type="text" placeholder="Ara..." className={styles.searchInput} />
        </div>
      </div>
    </header>
  );
}
