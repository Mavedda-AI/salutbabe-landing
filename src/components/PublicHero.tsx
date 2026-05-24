"use client";

import React from 'react';
import Link from 'next/link';
import {useAuthStore} from '@/store/useAuthStore';
import styles from './PublicHero.module.css';

export default function PublicHero() {
  const { isAuthenticated } = useAuthStore();

  // If user is logged in, do not show the public hero banner
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        <div className={styles.textContent}>
          <h1 className={styles.headline}>
            Kullanmadıklarını sat, <br />
            yenilerine yer aç.
          </h1>
          <p className={styles.subhead}>
            Türkiye'nin en büyük anne-çocuk ikinci el topluluğuna katıl. 
            Komisyonsuz satış yap, güvenle alışverişin tadını çıkar.
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/login" className={styles.primaryButton}>
              Hemen Satmaya Başla
            </Link>
            <Link href="/our-story" className={styles.secondaryButton}>
              Nasıl Çalışır?
            </Link>
          </div>
        </div>
        <div className={styles.imageContent}>
          {/* Using a beautiful Unsplash placeholder representing mother/child or clothes */}
          <img 
            src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800" 
            alt="Mother and baby clothes" 
            className={styles.heroImage} 
          />
        </div>
      </div>
    </div>
  );
}
