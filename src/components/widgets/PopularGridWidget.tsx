"use client";

import React from 'react';
import styles from '@/app/(shop)/page.module.css';

export default function PopularGridWidget() {
  return (
    <div className={styles.popularWeekSection}>
      <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>Bu hafta popüler</h2>
      <div className={styles.popularGrid}>
        <div className={styles.popularCard}>
          <img src="https://images.unsplash.com/photo-1594150878496-a921e5af8907?w=500" alt="Bebek Ayakkabısı" className={styles.popularImage} />
          <span className={styles.popularTitle}>Bebek Ayakkabısı</span>
          <span className={styles.popularSub}>+1.3k arama</span>
        </div>
        <div className={styles.popularCard}>
          <img src="https://images.unsplash.com/photo-1632337949070-1fdb69fe2159?w=500" alt="Bebek Tulumu" className={styles.popularImage} />
          <span className={styles.popularTitle}>Bebek Tulumu</span>
          <span className={styles.popularSub}>+1.9k arama</span>
        </div>
        <div className={styles.popularCard}>
          <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" alt="Mavi Gömlek" className={styles.popularImage} />
          <span className={styles.popularTitle}>Yazlık Elbise</span>
          <span className={styles.popularSub}>+2.4k arama</span>
        </div>
        <div className={styles.popularCard}>
          <img src="https://images.unsplash.com/photo-1560506840-ec148e82a604?w=500" alt="Kız Çocuk Elbise" className={styles.popularImage} />
          <span className={styles.popularTitle}>Kız Çocuk Elbise</span>
          <span className={styles.popularSub}>+1.1k arama</span>
        </div>
      </div>
    </div>
  );
}
