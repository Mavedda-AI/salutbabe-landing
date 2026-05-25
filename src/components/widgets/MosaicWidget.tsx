"use client";

import React, {useEffect, useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {useToast} from '@/context/ToastContext';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

const CURATED_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1505043203398-7e4c111acbfa?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1542355581-caf7454785ca?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1543346242-2b8e41fb91ca?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560506840-ec148e82a604?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560859259-fcf2b952aed8?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1569974641446-22542de88536?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1616666428759-679a7d578307?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1622290291720-ac961c43ee30?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1632337948797-ba161d29532b?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1635874714425-c342060a4c58?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1642379831634-1eb6a4e2788d?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1684244160171-97f5dac39204?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1777465492748-f2eceaef8e55?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1632337948797-ba161d29532b?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1635874714425-c342060a4c58?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560859259-fcf2b952aed8?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1505043203398-7e4c111acbfa?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1642379831634-1eb6a4e2788d?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1605644235751-709c7254e3e3?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1703282581360-a3685b2d52ac?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1636905206149-bc3217e6a198?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1704988935392-09fc355154aa?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1549588974-98aae09c3845?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1624958797025-b119e2fa2b53?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1622777702110-d6eab5657ce5?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1603943542072-358bc0cb67f9?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1617687315565-2e6445e56f7a?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1637184572386-9f3fd24a37eb?w=500&h=500&fit=crop"
];

const getMosaicImage = (index: number) => {
  return CURATED_IMAGES[index % CURATED_IMAGES.length];
};

function MosaicItem({ index, onClick }: { index: number, onClick: () => void }) {
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
      onClick={onClick}
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
  const [showAppModal, setShowAppModal] = useState(false);

  return (
    <>
      <div className={styles.mosaicSection}>
        <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t('home.for_you_picks')}</h2>
        <div className={styles.mosaicContainer}>
          {Array.from({ length: 48 }).map((_, i) => (
            <MosaicItem key={i} index={i} onClick={() => setShowAppModal(true)} />
          ))}
        </div>
      </div>

      {showAppModal && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => setShowAppModal(false)}
        >
          <div 
            style={{
              background: '#fff', borderRadius: '24px', padding: '32px 24px',
              maxWidth: '360px', width: '100%', textAlign: 'center', position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowAppModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.05)',
                border: 'none', width: '32px', height: '32px', borderRadius: '16px',
                fontSize: '16px', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#111' }}>
              {t('widgets.country_app_title')}
            </h3>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px', lineHeight: '1.5' }}>
              {t('widgets.country_app_desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a 
                href="https://apps.apple.com/us/app/salutbabe/id6759988511" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#000', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none'
                }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: 32 }} />
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#000', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none'
                }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: 32 }} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
