"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import {Search01Icon, ShoppingBasket02Icon} from 'hugeicons-react';
import MobileDrawer from './MobileDrawer';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      {/* 2. Main Header (Logo, Menu, Actions) */}
      <div className={styles.mainHeader}>
        {/* Left: Hamburger + Logo */}
        <div className={styles.headerLeft}>
          <button className={styles.hamburgerButton} onClick={() => setIsDrawerOpen(true)}>
            <CustomHamburgerIcon size={24} color="#111" strokeWidth={2} />
          </button>

          <Link href="/" className={styles.mainLogo}>
            <img 
              src="/assets/images/logo/logo_salutbabe.png" 
              alt="SalutBabe" 
              className={styles.mainLogoImage} 
            />
          </Link>
        </div>

        {/* Right: Actions (Cart, Panel, Sign Up) */}
        <div className={styles.headerActions}>
          <button className={styles.actionIcon}>
            <ShoppingBasket02Icon size={24} color="#111" strokeWidth={1.5} />
          </button>
          <button className={styles.panelButton}>PANEL</button>
          <Link href="/register" className={styles.signupButton}>Kaydol</Link>
        </div>
      </div>

      {/* Side Menu (Mobile Drawer) */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

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
