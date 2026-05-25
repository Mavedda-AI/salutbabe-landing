"use client";

import React from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

export default function PriceGridWidget() {
  const { t } = useThemeLanguage();

  return (
    <div className={styles.priceSection}>
      <h2 className={styles.sectionTitle} style={{ margin: '0 16px 12px 16px' }}>{t('home.price_shopping')}</h2>
      <div className={styles.priceGrid}>
        <button className={styles.priceBtn}>
          <strong>100 TL</strong>&nbsp;Altı
        </button>
        <button className={styles.priceBtn}>
          <strong>200 TL</strong>&nbsp;Altı
        </button>
        <button className={styles.priceBtn}>
          <strong>500 TL</strong>&nbsp;Altı
        </button>
        <button className={styles.priceBtn}>
          <strong>1000 TL</strong>&nbsp;Altı
        </button>
      </div>
    </div>
  );
}
