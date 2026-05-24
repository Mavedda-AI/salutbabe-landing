"use client";

import {useState} from 'react';
import styles from './page.module.css';
import ProductCard from '@/components/ProductCard';

const CATEGORY_DATA = [
  { name: 'Tümü', subcategories: [] },
  { name: 'Kız Bebek', subcategories: ['Tişört', 'Elbise', 'Tulum', 'Ayakkabı', 'Mont'] },
  { name: 'Erkek Bebek', subcategories: ['Tişört', 'Pantolon', 'Tulum', 'Ayakkabı', 'Sweatshirt'] },
  { name: 'Yenidoğan', subcategories: ['Zıbın', 'Hastane Çıkışı', 'Battaniye', 'Biberon'] },
  { name: 'Oyuncak', subcategories: ['Eğitici Oyuncak', 'Peluş', 'Kitap', 'Aktivite Halısı'] },
  { name: 'Hamile & Anne', subcategories: ['Hamile Giyim', 'Emzirme', 'Bakım Çantası'] },
  { name: 'Araç & Gereç', subcategories: ['Bebek Arabası', 'Oto Koltuğu', 'Ana Kucağı', 'Park Yatak'] }
];

const MOCK_PRODUCTS = [
  { id: 1, brand: 'Zara Kids', price: '450', seller: 'Ayşe M.', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400' },
  { id: 2, brand: 'H&M', price: '250', seller: 'Zeynep Y.', img: 'https://images.unsplash.com/photo-1522771730849-47b40d1396a8?auto=format&fit=crop&q=80&w=400' },
  { id: 3, brand: 'Mango Kids', price: '320', seller: 'Elif K.', img: 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?auto=format&fit=crop&q=80&w=400' },
  { id: 4, brand: 'Benetton', price: '180', seller: 'Merve S.', img: 'https://images.unsplash.com/photo-1560506840-0ca207865cbb?auto=format&fit=crop&q=80&w=400' },
  { id: 5, brand: 'GAP', price: '550', seller: 'Fatma B.', img: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&q=80&w=400' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_DATA[0].name);

  const activeCategoryData = CATEGORY_DATA.find(c => c.name === activeCategory);

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Kullanmadıklarını sat, yenilerini keşfet</h1>
        <p className={styles.heroSubtitle}>Bebek ve çocuk modasında ikinci elin güvenilir adresi. Dolabını boşalt ve aile bütçesine katkı sağla.</p>
        <button className={styles.heroButton}>Hemen Satış Yap</button>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Öne Çıkan Kategoriler</h2>
        <div className={styles.categoriesWrapper}>
          {CATEGORY_DATA.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => setActiveCategory(cat.name)}
              className={`${styles.categoryBtn} ${activeCategory === cat.name ? styles.categoryBtnActive : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {activeCategoryData && activeCategoryData.subcategories.length > 0 && (
          <div className={styles.subcategoriesWrapper}>
            {activeCategoryData.subcategories.map(sub => (
              <button key={sub} className={styles.subcategoryBtn}>
                {sub}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizin İçin Seçilenler</h2>
        <div className={styles.productGrid}>
          {MOCK_PRODUCTS.map(product => (
            <ProductCard 
              key={product.id}
              brand={product.brand}
              price={product.price}
              sellerName={product.seller}
              image={product.img}
            />
          ))}
          {/* Repeating for grid fill */}
          {MOCK_PRODUCTS.map(product => (
            <ProductCard 
              key={`rep-${product.id}`}
              brand={product.brand}
              price={product.price}
              sellerName={product.seller}
              image={product.img}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
