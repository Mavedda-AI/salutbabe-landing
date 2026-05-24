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
          {(() => {
            let img1 = "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600"; // Stylish toddler girl
            let img2 = "https://images.unsplash.com/photo-1471286174890-9c1122cd79fc?w=600"; // Toddler fashion
            let img3 = "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600"; // Baby clothes rack

            if (isSell) {
              img1 = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600"; // Packing clothes/closet
              img2 = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600"; // Happy mom
              img3 = "https://images.unsplash.com/photo-1489987707023-af815b801a2c?w=600"; // Neat folded clothes
            } else if (isLive) {
              img1 = "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600"; // Phone/Live stream vibe
              img2 = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"; // Community/talking
              img3 = "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600"; // Tech/Chatting
            } else if (isStory) {
              img1 = "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"; // Mother and child vibe
              img2 = "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600"; // Mom hugging baby
              img3 = "https://images.unsplash.com/photo-1504151932400-72d4384f0e6d?w=600"; // Happy family/kids
            }

            return (
              <>
                <div className={`${styles.galleryImageWrapper} ${styles.imageLeft}`}>
                  <img src={img1} alt="Baby Fashion Left" className={styles.galleryImg} />
                </div>
                <div className={`${styles.galleryImageWrapper} ${styles.imageCenter}`}>
                  <img src={img2} alt="Baby Fashion Center" className={styles.galleryImg} />
                </div>
                <div className={`${styles.galleryImageWrapper} ${styles.imageRight}`}>
                  <img src={img3} alt="Baby Fashion Right" className={styles.galleryImg} />
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
