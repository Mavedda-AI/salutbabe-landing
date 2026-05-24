import React from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const MOCK_PRODUCTS = [
  {
    id: '1',
    brand: 'Bebek/Çocuk Ürünü Bulunama...',
    price: '1000',
    sellerName: 'Mustafa',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500', // Using a nature image similar to the mockup
    statsText: '',
    isFavorite: false,
  },
  {
    id: '2',
    brand: 'Elinde Hasır Oyuncak Saklama S...',
    price: '250',
    sellerName: 'Mustafa',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500', // Basket image
    statsText: '1 kişi favoriledi',
    statsIcon: 'heart' as const,
    isFavorite: false,
  },
  {
    id: '3',
    brand: 'döcleşxşdşdşdşdğdğ',
    price: '500',
    sellerName: 'DS',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500', // Close up texture
    statsText: '24 saatte 1 kişi inceledi',
    statsIcon: 'eye' as const,
    isFavorite: true,
  },
  {
    id: '4',
    brand: 'isidjdj',
    price: '5280',
    sellerName: 'Mustafa',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500', // Baby cloth
    statsText: '',
    isFavorite: false,
  },
];

export default function HomeFeed() {
  return (
    <div className={styles.feedContainer}>
      
      {/* 1. Feed Header (Search, Tabs, Icons) */}
      <div className={styles.feedHeader}>
        <button className={styles.iconButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        
        <div className={styles.headerTabs}>
          <span className={styles.headerTab}>ODALAR</span>
          <span className={styles.headerTab}>TAKİP ETTİKLERİN</span>
          <span className={`${styles.headerTab} ${styles.headerTabActive}`}>İLANLAR</span>
        </div>

        <div className={styles.headerIcons}>
          <button className={styles.iconButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </button>
          <button className={styles.iconButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
          <button className={styles.iconButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Green Banner (Salut Organik) */}
      <div className={styles.bannerContainer}>
        <div className={styles.greenBanner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerIconWrapper}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
            <span className={styles.bannerTitle}>Salut Organik</span>
            <span className={styles.bannerText}>Yerel çiftçiden, doğal ürünler</span>
          </div>
          <button className={styles.bannerCloseButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className={styles.categoryFiltersWrapper}>
        <div className={styles.categoryFilters}>
          <span className={`${styles.filterItem} ${styles.filterItemActive}`}>Tümü</span>
          <span className={styles.filterItem}>Sana Özel</span>
          <span className={styles.filterItem}>Anne</span>
          <span className={styles.filterItem}>Bebek</span>
          <span className={styles.filterItem}>Çocuk</span>
          <span className={styles.filterItem}>Diğer</span>
          <span className={styles.filterItemDropdown}>Beden 
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
          <span className={styles.filterItemDropdown}>Marka
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </div>
      </div>

      {/* 4. Stories Section */}
      <section className={styles.storiesSection}>
        <div className={styles.storiesScroll}>
          {/* Main User Story with Add Badge */}
          <div className={styles.storyItem}>
            <div className={styles.storyRingContainer}>
              {/* Using ui-avatars for a random profile picture simulating the user */}
              <img src="https://ui-avatars.com/api/?name=Mustafa&background=random&color=fff&rounded=true" alt="Hikayen" className={styles.storyImage} />
              <div className={styles.storyAddBadgeBlack}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
            </div>
            <span className={styles.storyName}>Hikayen</span>
          </div>
        </div>
      </section>

      {/* 5. Products Grid */}
      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              brand={product.brand}
              price={product.price}
              sellerName={product.sellerName}
              image={product.image}
              statsText={product.statsText}
              statsIcon={product.statsIcon}
              isFavorite={product.isFavorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
