"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PublicHero.module.css';
import {Shield01Icon, SparklesIcon, Truck01Icon, TShirtIcon} from 'hugeicons-react';

export default function PublicHero() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const isBuy = activeTab === 'buy';

  return (
    <section className={`${styles.heroWrapper} ${isBuy ? styles.bgBuy : styles.bgSell}`}>
      <div className={styles.heroContainer}>
        
        {/* Top Text Section */}
        <div className={styles.textSection}>
          <div className={styles.toggleContainer}>
            <div className={styles.togglePill}>
              <button 
                className={`${styles.toggleButton} ${isBuy ? styles.activeToggleBuy : ''}`}
                onClick={() => setActiveTab('buy')}
              >
                Al
              </button>
              <button 
                className={`${styles.toggleButton} ${!isBuy ? styles.activeToggleSell : ''}`}
                onClick={() => setActiveTab('sell')}
              >
                Sat
              </button>
            </div>
          </div>
          
          <h1 className={styles.headline}>
            {isBuy ? (
              <>İkinci el al.<br />Kendi tarzını yarat.</>
            ) : (
              <>Dolabını nakite çevir.<br />Hemen kazanmaya başla.</>
            )}
          </h1>
          <p className={styles.subhead}>Birlikte, anne-çocuk modasını döngüsel tutuyoruz.</p>
          
          <Link href="/login" className={styles.primaryButton}>
            {isBuy ? "Hemen Keşfet" : "Hemen Sat"}
          </Link>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresRow}>
          <div className={styles.featureCard}>
            <Shield01Icon size={20} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>{isBuy ? "Güvenle Al" : "Güvenle Sat"}</h3>
            <p className={styles.featureDesc}>Salutbabe Koruması</p>
          </div>
          <div className={styles.featureCard}>
            {isBuy ? (
              <TShirtIcon size={20} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            ) : (
              <SparklesIcon size={20} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            )}
            <h3 className={styles.featureTitle}>{isBuy ? "2M+" : "Hızlıca İlan Ver"}</h3>
            <p className={styles.featureDesc}>{isBuy ? "Satıştaki ürün" : "Yapay zeka destekli"}</p>
          </div>
          <div className={styles.featureCard}>
            {isBuy ? (
              <SparklesIcon size={20} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            ) : (
              <Truck01Icon size={20} color="var(--primary-dark)" strokeWidth={1.5} className={styles.featureIcon} />
            )}
            <h3 className={styles.featureTitle}>{isBuy ? "10K+" : "Kolayca Kargola"}</h3>
            <p className={styles.featureDesc}>{isBuy ? "Her gün yeni ilan" : "Yazıcıya gerek yok"}</p>
          </div>
        </div>

        {/* Overlapping Images Gallery */}
        <div className={styles.imagesGallery}>
          <div className={`${styles.galleryImageWrapper} ${styles.imageLeft}`}>
            <Image 
              src="/assets/images/baby1.jpeg" 
              alt="Baby Fashion 1" 
              fill
              className={styles.galleryImg}
            />
          </div>
          <div className={`${styles.galleryImageWrapper} ${styles.imageCenter}`}>
            <Image 
              src="/assets/images/baby2.jpeg" 
              alt="Baby Fashion 2" 
              fill
              className={styles.galleryImg}
            />
          </div>
          <div className={`${styles.galleryImageWrapper} ${styles.imageRight}`}>
            <Image 
              src="/assets/images/baby3.jpeg" 
              alt="Baby Fashion 3" 
              fill
              className={styles.galleryImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
