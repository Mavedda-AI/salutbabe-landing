"use client";

import React, {useState} from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import {useCart} from '@/context/CartContext';
import Link from 'next/link';
import {Search01Icon, ShoppingBasket02Icon} from 'hugeicons-react';
import CartDrawer from './CartDrawer';
import MobileDrawer from './MobileDrawer';
import SearchDrawer from './SearchDrawer';
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
  const { t } = useThemeLanguage();
  const { isCartOpen, setIsCartOpen, cartCount } = useCart();
  const [showBanner, setShowBanner] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerContent}>
        {/* Left: Hamburger + Logo */}
        <div className={styles.headerLeft}>
          <button className={styles.hamburgerButton} onClick={() => setIsDrawerOpen(true)}>
            <CustomHamburgerIcon size={24} color="#111" strokeWidth={2} />
          </button>
          <Link href="/" className={styles.mainLogo}>
            <img src="/assets/images/logo/logo_salutbabe.png" alt="SalutBabe" className={styles.mainLogoImage} />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className={styles.searchContainer} onClick={() => setIsSearchDrawerOpen(true)} style={{cursor: 'pointer'}}>
          <div className={styles.searchBox}>
            <Search01Icon size={18} color="#666" strokeWidth={2} />
            <div className={styles.searchInput} style={{display: 'flex', alignItems: 'center', color: '#666'}}>
              {t("widgets.header_search_placeholder")}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className={styles.headerActions}>
          <button className={styles.actionIcon} onClick={() => setIsCartOpen(true)} style={{ position: 'relative' }}>
            <ShoppingBasket02Icon size={24} color="#111" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </button>
          <Link href="/login" className={styles.signupButton}>{t("widgets.header_seller_panel")}</Link>
          <Link href="/register" className={styles.loginLink}>{t("widgets.header_register")}</Link>
        </div>
      </div>

      {/* Side Menu (Mobile Drawer) */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Search Drawer */}
      <SearchDrawer isOpen={isSearchDrawerOpen} onClose={() => setIsSearchDrawerOpen(false)} />
    </header>
  );
}
