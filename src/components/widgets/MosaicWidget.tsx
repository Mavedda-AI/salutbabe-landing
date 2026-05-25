"use client";

import React, {useEffect, useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useToast} from '@/context/ToastContext';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

const CURATED_IMAGES = [
  "https://images.unsplash.com/photo-1502451885777-16c98b07834a?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1542901689-f103b03b9e97?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1604303768345-038b79a8c47a?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1604482858862-1db908a653e4?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1616666428759-679a7d578307?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1638366834146-4222376925c6?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1670014543471-3b5412baa677?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1673340978515-3aefbb36bf66?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1673340978519-9a776125c387?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1673340978611-8c1f279fdaea?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1673340979021-bb987b79bb84?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1673340979028-ad1ff526933c?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1673340979193-481dd0eb49c8?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1673340979296-7db91c9ec4e3?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1675183689638-a68fe7048da9?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1675183690347-662b2f9f3cf7?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1675183690609-1672ce07849f?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1676031861141-fd1b9a2b812e?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1676031940533-8f1ac6a07268?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1686593675650-c7454df8a63d?w=500&h=500&fit=crop"
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
