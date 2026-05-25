"use client";

import React from 'react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

import styles from '@/app/(shop)/page.module.css';

export default function BrandGridWidget() {
  const { t } = useThemeLanguage();
  return (
    <div className={styles.brandSection}>
      <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t("widgets.brands_title")}</h2>
      <div className={styles.brandGrid}>
        <div className={styles.brandCard}>
          <div className={styles.brandImagesGrid}>
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300" alt="Brand 1" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1542355581-caf7454785ca?w=300" alt="Brand 2" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1543346242-2b8e41fb91ca?w=300" alt="Brand 3" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=300" alt="Brand 4" className={styles.brandImage} />
          </div>
          <div className={styles.brandFooter}>
            <span className={styles.brandName}>Zara Baby</span>
            <button className={styles.brandShopBtn}>{t("widgets.discover")}</button>
          </div>
        </div>
        
        <div className={styles.brandCard}>
          <div className={styles.brandImagesGrid}>
            <img src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300" alt="Brand 1" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1569974641446-22542de88536?w=300" alt="Brand 2" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1616666428759-679a7d578307?w=300" alt="Brand 3" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=300" alt="Brand 4" className={styles.brandImage} />
          </div>
          <div className={styles.brandFooter}>
            <span className={styles.brandName}>H&M Kids</span>
            <button className={styles.brandShopBtn}>{t("widgets.discover")}</button>
          </div>
        </div>

        <div className={styles.brandCard}>
          <div className={styles.brandImagesGrid}>
            <img src="https://images.unsplash.com/photo-1622290291720-ac961c43ee30?w=300" alt="Brand 1" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=300" alt="Brand 2" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1684244160171-97f5dac39204?w=300" alt="Brand 3" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300" alt="Brand 4" className={styles.brandImage} />
          </div>
          <div className={styles.brandFooter}>
            <span className={styles.brandName}>Mango Kids</span>
            <button className={styles.brandShopBtn}>{t("widgets.discover")}</button>
          </div>
        </div>

        <div className={styles.brandCard}>
          <div className={styles.brandImagesGrid}>
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300" alt="Brand 1" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=300" alt="Brand 2" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1611911813383-67769b37a149?w=300" alt="Brand 3" className={styles.brandImage} />
            <img src="https://images.unsplash.com/photo-1560506840-ec148e82a604?w=300" alt="Brand 4" className={styles.brandImage} />
          </div>
          <div className={styles.brandFooter}>
            <span className={styles.brandName}>LC Waikiki</span>
            <button className={styles.brandShopBtn}>{t("widgets.discover")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
