"use client";

import React, {useEffect, useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useToast} from '@/context/ToastContext';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

const ALL_MOSAIC_IMAGES = [
  "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1568043625493-2b0633c7c491?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1596066190600-3af9aadaaea1?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1602773974733-b56200c8653f?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560506840-ec148e82a604?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=500&fit=crop"
];

function MosaicItem({ index }: { index: number }) {
  const { showToast } = useToast();
  const { t } = useThemeLanguage();
  const [img, setImg] = useState(ALL_MOSAIC_IMAGES[index % ALL_MOSAIC_IMAGES.length]);
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
            newImg = ALL_MOSAIC_IMAGES[Math.floor(Math.random() * ALL_MOSAIC_IMAGES.length)];
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
