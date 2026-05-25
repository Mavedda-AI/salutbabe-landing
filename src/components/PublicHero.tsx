"use client";

import React, {useState} from 'react';
import Link from 'next/link';
import styles from './PublicHero.module.css';
import {DeliveryTruck01Icon, SparklesIcon, TShirtIcon} from 'hugeicons-react';

export default function PublicHero() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'live' | 'story' | 'organic'>('buy');

  const isBuy = activeTab === 'buy';
  const isSell = activeTab === 'sell';
  const isLive = activeTab === 'live';
  const isStory = activeTab === 'story';
  const isOrganic = activeTab === 'organic';

  // Determine background based on state
  let bgClass = styles.bgBuy;
  if (isSell) bgClass = styles.bgSell;
  else if (isLive) bgClass = styles.bgLive;
  else if (isStory) bgClass = styles.bgStory;
  else if (isOrganic) bgClass = styles.bgOrganic;

  return (
    <section className={`${styles.heroWrapper} ${bgClass}`}>
      <div className={styles.heroContainer}>
        
        {/* Left Side (Text & Cards) */}
        <div className={styles.heroLeft}>
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
              <button 
                className={`${styles.toggleButton} ${isOrganic ? styles.activeToggleOrganic : ''}`}
                onClick={() => setActiveTab('organic')}
              >
                Salut Organik
              </button>
            </div>
          </div>
          
          <h1 className={`${styles.headline} ${isOrganic ? styles.textWhite : ''}`}>
            {isBuy && <span>İkinci el al.<br />Kendi tarzını oluştur.</span>}
            {isSell && <span>Dolabını nakite çevir.<br />Hemen kazanmaya başla.</span>}
            {isLive && <span>Sesli odalarda buluş.<br />Deneyimlerini paylaş.</span>}
            {isStory && <span>Her Annenin<br />bir hikayesi vardır.</span>}
            {isOrganic && <span>Çiftçiden ve anneden.<br />Doğadan bebeğinize.</span>}
          </h1>
          <p className={`${styles.subhead} ${isOrganic ? styles.textWhiteLight : ''}`}>
            {isBuy && <span>Sürdürülebilir ve güvenilir ikinci el alışveriş.</span>}
            {isSell && <span>Küçülenleri kolayca sat, aile bütçene anında katkı sağla.</span>}
            {isLive && <span>Sesli odalara katıl, annelerle sohbet et ve ilanları ilk sen keşfet.</span>}
            {isStory && <span>Bu sadece bir alışveriş platformu değil, büyük bir paylaşım kültürü.</span>}
            {isOrganic && <span>Çiftçiler ve üreten annelerin ürünlerini keşfedin.</span>}
          </p>
          
          <Link href="/register" className={styles.primaryButton}>
            {isBuy ? "Hemen Al" : isSell ? "Hemen Sat" : isLive ? "Odalara Katıl" : isStory ? "Hikayeni Oluştur" : "Doğalı Keşfet"}
          </Link>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresRow} key={`features-${activeTab}`}>
          {/* Card 1: Static Shield (Applies to all but Buy) */}
          <div className={`${styles.featureCard} ${!isBuy ? styles.featureCardSell : ''} ${isOrganic ? styles.featureCardOrganic : ''}`}>
            {isBuy ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            )}
            <h3 className={styles.featureTitle}>
              {isBuy ? "Güvenle Al" : isSell ? "Güvenle Sat" : isLive ? "Güvenli Sohbet" : isStory ? "Güvenli Alan" : "Doğal Üretim"}
            </h3>
            <p className={styles.featureDesc}>{isOrganic ? "Katkısız ve saf" : "Salutbabe Koruması"}</p>
          </div>

          {/* Dynamic Cards 2 & 3 */}
          {(() => {
            let card2 = { icon: <></>, title: '', desc: '' };
            let card3 = { icon: <></>, title: '', desc: '' };

            if (isBuy) {
              card2 = { icon: <TShirtIcon size={24} color="#111111" strokeWidth={1.5} className={styles.featureIcon} />, title: "2M+", desc: "Satıştaki ürün" };
              card3 = { icon: <SparklesIcon size={24} color="#111111" strokeWidth={1.5} className={styles.featureIcon} />, title: "10K+", desc: "Her gün yeni ilan" };
            } else if (isSell) {
              card2 = { icon: <SparklesIcon size={24} color="#111111" strokeWidth={1.5} className={styles.featureIcon} />, title: "Hızlıca İlan Ver", desc: "Yapay zeka destekli" };
              card3 = { icon: <DeliveryTruck01Icon size={24} color="#111111" strokeWidth={1.5} className={styles.featureIcon} />, title: "Kolayca Kargola", desc: "Yazıcıya gerek yok" };
            } else if (isLive) {
              card2 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>, title: "Sesli Odalar", desc: "Açık ve özel yayınlar" };
              card3 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>, title: "Keşfet & Öğren", desc: "Bilgi al, ilan paylaş" };
            } else if (isStory) {
              card2 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>, title: "Sürdürülebilir", desc: "İsrafı önleme vizyonu" };
              card3 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>, title: "Anneden Anneye", desc: "Empati ve topluluk" };
            } else if (isOrganic) {
              card2 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><path d="M17 10h-2V8a5 5 0 0 0-10 0v2H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z"></path><path d="M7 10V8a5 5 0 0 1 10 0v2"></path></svg>, title: "Üreten Anneler", desc: "El emeği ürünler" };
              card3 = { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.featureIcon}><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>, title: "Yerel Çiftçiler", desc: "Tarladan direkt size" };
            }

            return (
              <>
                <div className={`${styles.featureCard} ${!isBuy ? styles.featureCardSell : ''} ${isOrganic ? styles.featureCardOrganic : ''}`}>
                  {card2.icon}
                  <h3 className={styles.featureTitle}>{card2.title}</h3>
                  <p className={styles.featureDesc}>{card2.desc}</p>
                </div>
                <div className={`${styles.featureCard} ${!isBuy ? styles.featureCardSell : ''} ${isOrganic ? styles.featureCardOrganic : ''}`}>
                  {card3.icon}
                  <h3 className={styles.featureTitle}>{card3.title}</h3>
                  <p className={styles.featureDesc}>{card3.desc}</p>
                </div>
              </>
            );
          })()}
        </div>
        </div>

        {/* Right Side (Images Gallery) */}
        <div className={styles.imagesGallery} key={`gallery-${activeTab}`}>
          {(() => {
            let img1 = "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600";
            let img2 = "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600"; 
            let img3 = "https://images.unsplash.com/photo-1670014541811-9b0ec280ed60?w=600"; 

            if (isSell) {
              // Messy baby/kids clothes to trigger the "I need to clean my child's closet" feeling
              img1 = "https://images.unsplash.com/photo-1542901689-f103b03b9e97?w=600"; 
              img2 = "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600"; 
              img3 = "https://images.unsplash.com/photo-1560859259-fcf2b952aed8?w=600"; 
            } else if (isLive) {
              // Happy talking women / clubhouse vibe
              img1 = "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600"; 
              img2 = "https://images.unsplash.com/photo-1653762379954-8943c787e78b?w=600"; 
              img3 = "https://images.unsplash.com/photo-1595986630530-969786b19b4d?w=600"; 
            } else if (isStory) {
              // Happy family / mother and baby
              img1 = "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600"; 
              img2 = "https://images.unsplash.com/photo-1560707857-b897819e06fb?w=600"; 
              img3 = "https://images.unsplash.com/photo-1570657891791-e39a9d185540?w=600"; 
            } else if (isOrganic) {
              // Organic foods (jam, vegetables, natural jars)
              img1 = "https://images.unsplash.com/photo-1632848129232-f816b590e5e3?w=600";
              img2 = "https://images.unsplash.com/photo-1659822887922-c1386185cc6b?w=600";
              img3 = "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600";
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
