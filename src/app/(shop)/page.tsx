import React from 'react';
import ProductCard from '@/components/ProductCard';
import PublicHero from '@/components/PublicHero';
import {Add01Icon, ArrowDown01Icon} from 'hugeicons-react';
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

      {/* 4. Stories Section */}
      <section className={styles.storiesSection}>
        <div className={styles.storiesScroll}>
          {/* Main User Story with Add Badge */}
          <div className={styles.storyItem}>
            <div className={styles.storyRingContainer}>
              {/* Using ui-avatars for a random profile picture simulating the user */}
              <img src="https://ui-avatars.com/api/?name=Mustafa&background=random&color=fff&rounded=true" alt="Hikayen" className={styles.storyImage} />
              <div className={styles.storyAddBadgeBlack}>
                <Add01Icon size={12} color="white" strokeWidth={3} />
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
    </>
  );
}
