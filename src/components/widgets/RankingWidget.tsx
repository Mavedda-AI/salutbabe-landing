"use client";

import React from 'react';
import styles from '@/app/(shop)/page.module.css';
import {FavouriteIcon} from 'hugeicons-react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

export default function RankingWidget() {
  const { t } = useThemeLanguage();

  return (
    <div className={styles.rankingSection}>
      <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t('home.ranking_title')}</h2>
      <div className={styles.rankingGrid}>
        {Array.from({ length: 50 }).map((_, i) => {
          const avatars = [
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
          ];
          const names = ["ayse_mom", "derin_dolap", "zeynep_baby", "cansu_moda", "pelin_bebek"];
          const avatar = avatars[i % avatars.length];
          const name = names[i % names.length] + Math.floor(Math.random() * 100);
          const likes = Math.floor(Math.random() * 500) + 50;

          return (
            <div key={i} className={styles.rankingCard}>
              <div className={styles.rankingBadge}>#{i + 1}</div>
              <img src={avatar} alt={`User ${i}`} className={styles.rankingAvatar} loading="lazy" />
              <div className={styles.rankingInfo}>
                <span className={styles.rankingName}>@{name}</span>
                <span className={styles.rankingLikes}><FavouriteIcon size={14} color="#111" variant="solid" /> {likes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
