import React from 'react';
import ProductCard from '@/components/ProductCard';
import PublicHero from '@/components/PublicHero';
import {ArrowDown01Icon} from 'hugeicons-react';
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
    <>
      {/* Vinted/Depop Style Public Landing Banner */}
      <PublicHero />
      
      <div className={styles.feedContainer}>
        


      {/* 3. Category Filter Tabs */}
      <div className={styles.categoryFiltersWrapper}>
        <h2 className={styles.sectionTitle}>Kategorine göre keşfet</h2>
        <div className={styles.categoryFilters}>
          <span className={`${styles.filterItem} ${styles.filterItemActive}`}>Tümü</span>
          <span className={styles.filterItem}>Sana Özel</span>
          <span className={styles.filterItem}>Anne</span>
          <span className={styles.filterItem}>Bebek</span>
          <span className={styles.filterItem}>Çocuk</span>
          <span className={styles.filterItem}>Diğer</span>
          <span className={styles.filterItemDropdown}>Beden 
             <ArrowDown01Icon size={14} color="currentColor" strokeWidth={2} />
          </span>
          <span className={styles.filterItemDropdown}>Marka
             <ArrowDown01Icon size={14} color="currentColor" strokeWidth={2} />
          </span>
        </div>
      </div>

      {/* 4. Category Banner */}
      <div className={styles.categoryBannerContainer}>
        <img 
          src="https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800&h=480" 
          alt="Anne ve Bebek" 
          className={styles.categoryBannerImage} 
        />
        <div className={styles.categoryBannerContent}>
          <h3 className={styles.categoryBannerTitle}>Anne ve Bebek Kategorisinde Neler Var?</h3>
          <p className={styles.categoryBannerSubtitle}>Hem senin hem de bebeğin için en seçkin ürünleri keşfet.</p>
          <button className={styles.categoryBannerButton}>Hemen İncele</button>
          <div className={styles.categoryBannerDots}>
            <span className={`${styles.categoryBannerDot} ${styles.categoryBannerDotActive}`}></span>
            <span className={styles.categoryBannerDot}></span>
            <span className={styles.categoryBannerDot}></span>
          </div>
        </div>
      </div>

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
    </>
  );
}
