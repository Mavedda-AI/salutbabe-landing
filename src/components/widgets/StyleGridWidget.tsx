"use client";

import React from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

export default function StyleGridWidget() {
  const { t } = useThemeLanguage();

  return (
    <div className={styles.styleSection}>
      <h2 className={styles.sectionTitle} style={{ margin: '0 16px 12px 16px' }}>{t('home.style_explore')}</h2>
      <div className={styles.styleGrid}>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="/style_jacket.png" alt="Hafif Katmanlar" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Hafif katmanlar</span>
        </div>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="/style_yellow.png" alt="Soft Renkler" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Soft renkler</span>
        </div>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="/style_shoes.png" alt="Minik Adımlar" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Minik Adımlar</span>
        </div>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="/style_organic.png" alt="Organik Pamuk" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Organik Pamuk</span>
        </div>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="/style_knit.png" alt="Örgü & Triko" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Örgü & Triko</span>
        </div>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="/style_denim.png" alt="Denim Tutkusu" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Denim Tutkusu</span>
        </div>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=500" alt="Sokak Stili" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Sokak Stili</span>
        </div>
        <div className={styles.styleCard}>
          <div className={styles.styleImageWrapper}>
            <img src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500" alt="Elbiseler" className={styles.styleImage} />
          </div>
          <span className={styles.styleTitle}>Elbiseler</span>
        </div>
      </div>
    </div>
  );
}
