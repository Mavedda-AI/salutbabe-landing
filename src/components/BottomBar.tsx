"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styles from './BottomBar.module.css';

export default function BottomBar() {
  const pathname = usePathname();
  const [isCenterPressed, setIsCenterPressed] = useState(false);

  // Tab 2 Badge (Mock)
  const hasInboxBadge = true;

  // Function to determine active state
  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.bottomBarContainer}>
      <div className={styles.bottomBar}>
        {/* Tab 1: Home */}
        <Link href="/" className={styles.navItem}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke={isActive('/') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className={`${styles.label} ${isActive('/') ? styles.labelActive : ''}`}>Ana Sayfa</span>
        </Link>

        {/* Tab 2: Inbox */}
        <Link href="/inbox" className={styles.navItem}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke={isActive('/inbox') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {hasInboxBadge && <div className={styles.navBadge} />}
          </div>
          <span className={`${styles.label} ${isActive('/inbox') ? styles.labelActive : ''}`}>Mesajlar</span>
        </Link>

        {/* Tab 3: Center Sell Button */}
        <Link 
          href="/create" 
          className={styles.centerNavItem}
          onMouseDown={() => setIsCenterPressed(true)}
          onMouseUp={() => setIsCenterPressed(false)}
          onMouseLeave={() => setIsCenterPressed(false)}
          onTouchStart={() => setIsCenterPressed(true)}
          onTouchEnd={() => setIsCenterPressed(false)}
        >
          <div className={`${styles.centerIconWrapper} ${isCenterPressed ? styles.centerPressed : ''}`}>
             <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={isActive('/create') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
             </svg>
          </div>
          <span className={`${styles.label} ${isActive('/create') ? styles.labelActive : ''}`}>Satış Yap</span>
        </Link>

        {/* Tab 4: Our Story */}
        <Link href="/our-story" className={styles.navItem}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke={isActive('/our-story') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            {isActive('/our-story') && (
              <div className={styles.bookFillIcon}></div>
            )}
          </div>
          <span className={`${styles.label} ${isActive('/our-story') ? styles.labelActive : ''}`}>Hikayemiz</span>
        </Link>

        {/* Tab 5: Profile / Login */}
        <Link href="/login" className={styles.navItem}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke={isActive('/login') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className={`${styles.label} ${isActive('/login') ? styles.labelActive : ''}`}>Profil</span>
        </Link>
      </div>
    </nav>
  );
}
