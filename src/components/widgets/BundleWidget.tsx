"use client";

import React from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

export default function BundleWidget() {
  const { t } = useThemeLanguage();

  const BUNDLES = [
    {
      title: "Yenidoğan Paketi",
      desc: "7 parça - Hiç kullanılmadı",
      price: "800 TL",
      sellerName: "ayse_mom",
      sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      images: [
        "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500",
        "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500",
        "https://images.unsplash.com/photo-1560506840-ec148e82a604?w=500",
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500"
      ]
    },
    {
      title: "Hastane Çıkışı Sepeti",
      desc: "Premium markalar - Etiketli",
      price: "1200 TL",
      sellerName: "zeynep_baby",
      sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      images: [
        "https://images.unsplash.com/photo-1611911813383-67769b37a149?w=500",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500",
        "https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=500"
      ]
    },
    {
      title: "Kışlık Tulum Seti",
      desc: "3 parça - Az kullanıldı",
      price: "950 TL",
      sellerName: "cansu_moda",
      sellerAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100",
      images: [
        "https://images.unsplash.com/photo-1569974641446-22542de88536?w=500",
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500",
        "https://images.unsplash.com/photo-1594819047050-99defca82545?w=500"
      ]
    },
    {
      title: "Yazlık Tatil Bavulu",
      desc: "10 parça - Lekesiz",
      price: "600 TL",
      sellerName: "derin_dolap",
      sellerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
      images: [
        "https://images.unsplash.com/photo-1542355581-caf7454785ca?w=500",
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
        "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500"
      ]
    }
  ];

  return (
    <div className={styles.bundleSection}>
      <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t('home.bundle_title')}</h2>
      <div className={styles.bundleGrid}>
        {BUNDLES.map((bundle, index) => (
          <div key={index} className={styles.bundleCard}>
            <div className={styles.bundleImageWrapper}>
              <div className={styles.bundleImageCarousel}>
                {bundle.images.map((img, i) => (
                  <img key={i} src={img} alt={`Bundle ${index} Image ${i}`} className={styles.bundleImage} loading="lazy" />
                ))}
              </div>
              <div className={styles.swipeHint}>
                {bundle.images.slice(0, 3).map((_, i) => (
                  <div key={i} className={styles.dot}></div>
                ))}
                {bundle.images.length > 3 && <div className={styles.dot}></div>}
              </div>
              <div className={styles.bundlePriceTag}>{bundle.price}</div>
            </div>
            <div className={styles.bundleContent}>
              <h3 className={styles.bundleTitle}>{bundle.title}</h3>
              <p className={styles.bundleDesc}>{bundle.desc}</p>
              <div className={styles.bundleSeller}>
                <img src={bundle.sellerAvatar} alt={bundle.sellerName} className={styles.sellerAvatar} />
                <span className={styles.sellerName}>@{bundle.sellerName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
