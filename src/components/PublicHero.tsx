"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import styles from './PublicHero.module.css';
import {Shield01Icon, SparklesIcon, TShirtIcon} from 'hugeicons-react';

export default function PublicHero() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'live' | 'story'>('buy');

  const isBuy = activeTab === 'buy';
  const isSell = activeTab === 'sell';
  const isLive = activeTab === 'live';
  const isStory = activeTab === 'story';

  // Determine background based on state
  let bgClass = styles.bgBuy;
  if (isSell) bgClass = styles.bgSell;
  else if (isLive) bgClass = styles.bgLive;
  else if (isStory) bgClass = styles.bgStory;

  return (
    <section className={`${styles.heroWrapper} ${bgClass}`}>
      <div className={styles.heroContainer}>
        
        {/* Top Text Section */}
        <div className={styles.textSection} key={`text-${activeTab}`}>
          <div className={styles.toggleContainer}>
            <div className={styles.togglePill}>
              <button 
                className={`${styles.toggleButton} ${isBuy ? styles.activeToggleBuy : ''}`}
                onClick={() => setActiveTab('buy')}
              >
                Al
              </button>
              <button 
                className={`${styles.toggleButton} ${isSell ? styles.activeToggleSell : ''}`}
                onClick={() => setActiveTab('sell')}
              >
                Sat
              </button>
              <button 
                className={`${styles.toggleButton} ${isLive ? styles.activeToggleLive : ''}`}
                onClick={() => setActiveTab('live')}
              >
                Canlı Odalar
              </button>
              <button 
                className={`${styles.toggleButton} ${isStory ? styles.activeToggleStory : ''}`}
                onClick={() => setActiveTab('story')}
              >
                Hikayemiz
              </button>
            </div>
          </div>
          
          <h1 className={styles.headline}>
            {isBuy && <>İkinci el al.<br />Kendi tarzını yarat.</>}
            {isSell && <>Dolabını nakite çevir.<br />Hemen kazanmaya başla.</>}
            {isLive && <>Gerçek zamanlı sohbet.<br />Odalarımıza katıl.</>}
            {isStory && <>Bizim hikayemiz.<br />Anneden anneye.</>}
          </h1>
          <p className={styles.subhead}>Birlikte, anne-çocuk modasını döngüsel tutuyoruz.</p>
          
          <Link href="/login" className={styles.primaryButton}>
            {isBuy && "Hemen Keşfet"}
            {isSell && "Hemen Sat"}
            {isLive && "Odalara Katıl"}
            {isStory && "Hikayemizi Oku"}
          </Link>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresRow} key={`features-${activeTab}`}>
          <div className={`${styles.featureCard} ${!isBuy ? styles.featureCardSell : ''}`}>
            <Shield01Icon size={24} color="#414141" strokeWidth={1.5} className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>{isBuy ? "Güvenle Al" : "Güvenle Sat"}</h3>
            <p className={styles.featureDesc}>Salutbabe Koruması</p>
          </div>
          <div className={`${styles.featureCard} ${!isBuy ? styles.featureCardSell : ''}`}>
            {isBuy ? (
              <TShirtIcon size={24} color="#414141" strokeWidth={1.5} className={styles.featureIcon} />
            ) : (
              <SparklesIcon size={24} color="#414141" strokeWidth={1.5} className={styles.featureIcon} />
            )}
            <h3 className={styles.featureTitle}>{isBuy ? "2M+" : "Hızlıca İlan Ver"}</h3>
            <p className={styles.featureDesc}>{isBuy ? "Satıştaki ürün" : "Yapay zeka destekli"}</p>
          </div>
          <div className={`${styles.featureCard} ${!isBuy ? styles.featureCardSell : ''}`}>
            {isBuy ? (
              <SparklesIcon size={24} color="#414141" strokeWidth={1.5} className={styles.featureIcon} />
            ) : (
              <SparklesIcon size={24} color="#414141" strokeWidth={1.5} className={styles.featureIcon} />
            )}
            <h3 className={styles.featureTitle}>{isBuy ? "10K+" : "Kolayca Kargola"}</h3>
            <p className={styles.featureDesc}>{isBuy ? "Her gün yeni ilan" : "Yazıcıya gerek yok"}</p>
          </div>
        </div>

        {/* Overlapping Images Gallery */}
        <div className={styles.imagesGallery}>
          <div className={`${styles.galleryImageWrapper} ${styles.imageLeft}`}>
            <img 
              src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600" 
              alt="Baby Fashion 1" 
              className={styles.galleryImg}
            />
          </div>
          <div className={`${styles.galleryImageWrapper} ${styles.imageCenter}`}>
            <img 
              src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600" 
              alt="Baby Fashion 2" 
              className={styles.galleryImg}
            />
          </div>
          <div className={`${styles.galleryImageWrapper} ${styles.imageRight}`}>
            <img 
              src="https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600" 
              alt="Baby Fashion 3" 
              className={styles.galleryImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
