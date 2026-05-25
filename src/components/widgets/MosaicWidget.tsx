"use client";

import React, {useEffect, useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useToast} from '@/context/ToastContext';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

const CURATED_IMAGES = [
  "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=500&fit=crop", /* kids clothes rack */
  "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500&h=500&fit=crop", /* white baby clothes flatlay */
  "https://images.unsplash.com/photo-1560506840-ec148e82a604?w=500&h=500&fit=crop", /* baby clothes hanging */
  "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop", /* baby clothes flatlay */
  "https://images.unsplash.com/photo-1611911813383-67769b37a149?w=500&h=500&fit=crop", /* baby rompers flatlay */
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=500&fit=crop", /* baby socks */
  "https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=500&h=500&fit=crop", /* baby clothes folded */
  "https://images.unsplash.com/photo-1569974641446-22542de88536?w=500&h=500&fit=crop", /* baby overall */
  "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=500&fit=crop", /* baby dress */
  "https://images.unsplash.com/photo-1594819047050-99defca82545?w=500&h=500&fit=crop", /* pile of baby clothes */
  "https://images.unsplash.com/photo-1542355581-caf7454785ca?w=500&h=500&fit=crop", /* baby shoes */
  "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop"  /* small baby shoes */
];

const getMosaicImage = (index: number) => {
  return CURATED_IMAGES[index % CURATED_IMAGES.length];
};

function MosaicItem({ index }: { index: number }) {
  const { showToast } = useToast();
  const { t } = useThemeLanguage();
  const [img, setImg] = useState(getMosaicImage(index));
  const [price, setPrice] = useState(100 + ((index * 37) % 900));
  const [views, setViews] = useState(12 + ((index * 19) % 300));
  const [isSold, setIsSold] = useState(false);

  useEffect(() => {
    if (index % 5 !== 0) return;

    const initialDelay = 3000 + (index * 1200);
    let swapTimeout: NodeJS.Timeout;
    let isMounted = true;
    
    const startAnimation = () => {
      if (!isMounted) return;
      setIsSold(true);
      
      swapTimeout = setTimeout(() => {
        if (!isMounted) return;
        
        setImg(prevImg => {
          let newImg;
          do {
            newImg = getMosaicImage(Math.floor(Math.random() * 200));
          } while (newImg === prevImg);
          return newImg;
        });
        
        setPrice(Math.floor(Math.random() * 800) + 100);
        setViews(Math.floor(Math.random() * 300) + 10);
        setIsSold(false);
      }, 2000);
    };

    const firstTimeout = setTimeout(() => {
      startAnimation();
      setInterval(startAnimation, 12000);
    }, initialDelay);

    return () => {
      isMounted = false;
      clearTimeout(firstTimeout);
      clearTimeout(swapTimeout);
    };
  }, [index]);

  return (
    <div 
      className={styles.mosaicItem}
      onClick={() => showToast("Satın almak ve incelemek için uygulamasını indirin!", "info")}
    >
      <img src={img} alt={`Seçilen Ürün ${index}`} loading="lazy" />
      <div className={styles.mosaicOverlay}>
        <span>{t('home.view_in_app')}</span>
      </div>
      
      <div className={styles.mosaicPrice}>{price} TL</div>
      <div className={styles.mosaicViews}>👁 {views}</div>
      
      {isSold && (
        <div className={styles.mosaicSoldOverlay}>
          <div className={styles.soldStamp}>
            <div className={styles.soldStampTop}>{t('home.sorry')}</div>
            <div className={styles.soldStampBottom}>{t('home.sold')}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MosaicWidget() {
  const { t } = useThemeLanguage();

  return (
    <div className={styles.mosaicSection}>
      <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t('home.for_you_picks')}</h2>
      <div className={styles.mosaicContainer}>
        {Array.from({ length: 48 }).map((_, i) => (
          <MosaicItem key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
