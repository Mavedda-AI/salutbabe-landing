"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import {Cancel01Icon, Menu01Icon, Search01Icon} from 'hugeicons-react';
import styles from './Header.module.css';

const CustomBagIcon = ({ size = 24, strokeWidth = 2.5, color = "currentColor", className = "" }) => (
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
    {/* Trapezoid bag outline with rounded corners */}
    <path d="M8 4h8c1.5 0 2.5.5 3 2l1.5 11c.5 2.5-1 4-4 4H7.5c-3 0-4.5-1.5-4-4L5 6c.5-1.5 1.5-2 3-2z" />
    {/* Handle inside the bag */}
    <path d="M9.5 4v1.5a2.5 2.5 0 0 0 5 0V4" />
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
        {/* Left Side: Hamburger & Logo */}
        <div className={styles.headerLeft}>
          <button className={styles.hamburgerButton}>
            <Menu01Icon size={30} color="currentColor" strokeWidth={2.5} />
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
            <CustomBagIcon size={26} color="currentColor" strokeWidth={2.5} />
          </button>
          <button className={styles.panelButton}>PANEL</button>
          <Link href="/register" className={styles.signupButton}>Kaydol</Link>
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
