"use client";

import React from 'react';
import Link from 'next/link';
import {useAuthStore} from '@/store/useAuthStore';
import {Shield01Icon, SparklesIcon, TShirtIcon} from 'hugeicons-react';
import styles from './PublicHero.module.css';

export default function PublicHero() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        
        {/* Top Text Section */}
        <div className={styles.textSection}>
          <h1 className={styles.headline}>İkinci el al. Kendi tarzını yarat.</h1>
          <p className={styles.subhead}>Birlikte, anne-çocuk modasını döngüsel tutuyoruz.</p>
          
          <Link href="/login" className={styles.primaryButton}>
            Hemen Keşfet
          </Link>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresRow}>
          <div className={styles.featureCard}>
            <Shield01Icon size={24} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Güvenle Al</h3>
            <p className={styles.featureDesc}>Salutbabe Koruması</p>
          </div>
          <div className={styles.featureCard}>
            <TShirtIcon size={24} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>2M+</h3>
            <p className={styles.featureDesc}>Satıştaki ürün</p>
          </div>
          <div className={styles.featureCard}>
            <SparklesIcon size={24} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>10K+</h3>
            <p className={styles.featureDesc}>Her gün yeni ilan</p>
          </div>
        </div>

        {/* Overlapping Images Gallery */}
        <div className={styles.imagesGallery}>
          <div className={`${styles.galleryImageWrapper} ${styles.imageLeft}`}>
            <img 
              src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600" 
              alt="Baby clothes" 
              className={styles.galleryImg}
            />
          </div>
          
          <div className={`${styles.galleryImageWrapper} ${styles.imageCenter}`}>
            <img 
              src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600" 
              alt="Mother and child" 
              className={styles.galleryImg}
            />
          </div>
          
          <div className={`${styles.galleryImageWrapper} ${styles.imageRight}`}>
            <img 
              src="https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600" 
              alt="Kids fashion" 
              className={styles.galleryImg}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
