"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import {Cancel01Icon, Search01Icon, ShoppingBasket02Icon} from 'hugeicons-react';
import styles from './Header.module.css';

const CustomHamburgerIcon = ({ size = 26, strokeWidth = 2.5, color = "currentColor", className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

export default function Header() {
  const [showBanner, setShowBanner] = useState(true);

  const handleOpenApp = () => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // iOS detection
      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        window.location.href = 'https://apps.apple.com/us/app/salutbabe/id6759988511';
        return;
      }
      
      // Android detection
      if (/android/i.test(userAgent)) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr';
        return;
      }
      
      // Default fallback for desktop/other
      window.location.href = 'https://apps.apple.com/us/app/salutbabe/id6759988511';
    }
  };

  return (
    <header className={styles.headerWrapper}>
      {/* 1. App Banner (Black Bar) */}
      {showBanner && (
        <div className={styles.appBanner}>
          <div className={styles.bannerLeft}>
            <div className={styles.bannerLogo}>
              <img 
                src="/assets/images/logo/logo_salutbabe.png" 
                alt="SalutBabe App" 
                className={styles.bannerLogoImg} 
              />
            </div>
            <div className={styles.bannerTexts}>
              <span className={styles.bannerTitle}>SalutBabe Uygulaması</span>
              <span className={styles.bannerSubtitle}>Daha hızlı alışveriş deneyimi</span>
            </div>
          </div>
          <div className={styles.bannerRight}>
            <button className={styles.openAppButton} onClick={handleOpenApp}>AÇ</button>
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
        {/* Left: Hamburger + Logo */}
        <div className={styles.headerLeft}>
          <button className={styles.hamburgerButton}>
            <CustomHamburgerIcon size={28} color="#111" strokeWidth={2.5} />
          </button>

          <Link href="/" className={styles.mainLogo}>
            <div className={styles.mainLogoTexts}>
              <img 
                src="/assets/images/logo/logo_salutbabe.png" 
                alt="SalutBabe Logo" 
                className={styles.mainLogoImage} 
              />
            </div>
          </Link>
        </div>

        {/* Right: Actions (Cart, Panel, Sign Up) */}
        <div className={styles.headerActions}>
          <button className={styles.actionIcon}>
            <ShoppingBasket02Icon size={26} color="currentColor" strokeWidth={2} />
          </button>
          <button className={styles.panelButton}>PANEL</button>
          <Link href="/register" className={styles.signupButton}>Kaydol</Link>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Search01Icon size={18} color="#666" strokeWidth={2} />
          <input type="text" placeholder="İstediğini ara" className={styles.searchInput} />
        </div>
      </div>
    </header>
  );
}
