"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BookOpen01Icon, Camera01Icon, Home01Icon, Message01Icon, UserIcon} from 'hugeicons-react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';
import styles from './BottomBar.module.css';

export default function BottomBar() {
  const pathname = usePathname();
  const [isCenterPressed, setIsCenterPressed] = useState(false);
  const { t } = useThemeLanguage();

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
            <Home01Icon className={styles.icon} color={isActive('/') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth={isActive('/') ? 2.5 : 2} />
          </div>
          <span className={`${styles.label} ${isActive('/') ? styles.labelActive : ''}`}>{t('nav.home')}</span>
        </Link>

        {/* Tab 2: Inbox */}
        <Link href="/inbox" className={styles.navItem}>
          <div className={styles.iconWrapper}>
            <Message01Icon className={styles.icon} color={isActive('/inbox') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth={isActive('/inbox') ? 2.5 : 2} />
            {hasInboxBadge && <div className={styles.navBadge} />}
          </div>
          <span className={`${styles.label} ${isActive('/inbox') ? styles.labelActive : ''}`}>{t('nav.messages')}</span>
        </Link>

        {/* Tab 3: Center Sell Button */}
        <Link 
          href="/create" 
          className={`${styles.centerNavItem} ${isCenterPressed ? styles.centerPressed : ''}`}
          onMouseDown={() => setIsCenterPressed(true)}
          onMouseUp={() => setIsCenterPressed(false)}
          onMouseLeave={() => setIsCenterPressed(false)}
          onTouchStart={() => setIsCenterPressed(true)}
          onTouchEnd={() => setIsCenterPressed(false)}
        >
          <div className={styles.centerIconWrapper}>
             <Camera01Icon size={24} strokeWidth={2.5} />
          </div>
          <span className={`${styles.label} ${isActive('/create') ? styles.labelActive : ''}`}>{t('nav.sell')}</span>
        </Link>

        {/* Tab 4: Our Story */}
        <Link href="/our-story" className={styles.navItem}>
          <div className={styles.iconWrapper}>
            <BookOpen01Icon className={styles.icon} color={isActive('/our-story') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth={isActive('/our-story') ? 2.5 : 2} />
            {isActive('/our-story') && (
              <div className={styles.bookFillIcon}></div>
            )}
          </div>
          <span className={`${styles.label} ${isActive('/our-story') ? styles.labelActive : ''}`}>{t('nav.our_story')}</span>
        </Link>

        {/* Tab 5: Profile / Login */}
        <Link href="/login" className={styles.navItem}>
          <div className={styles.iconWrapper}>
            <UserIcon className={styles.icon} color={isActive('/login') ? 'var(--text-primary)' : 'rgba(0,0,0,0.4)'} strokeWidth={isActive('/login') ? 2.5 : 2} />
          </div>
          <span className={`${styles.label} ${isActive('/login') ? styles.labelActive : ''}`}>{t('nav.profile')}</span>
        </Link>
      </div>
    </nav>
  );
}
