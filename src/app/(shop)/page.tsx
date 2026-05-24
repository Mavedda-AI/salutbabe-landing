"use client";

import React, {useEffect, useState} from 'react';
import ProductCard from '@/components/ProductCard';
import PublicHero from '@/components/PublicHero';
import {ArrowDown01Icon} from 'hugeicons-react';
import {apiUrl} from '@/lib/api';
import styles from './page.module.css';

export default function HomeFeed() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(apiUrl('/listings/products?limit=20')),
          fetch(apiUrl('/listings/get-all-categories'))
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        if (productsData.data?.listings) {
          setProducts(productsData.data.listings);
        } else if (Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        }

        if (categoriesData.data) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error("Error fetching feed data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <PublicHero />
      
      <div className={styles.feedContainer}>
        {/* Category Filter Tabs */}
        <div className={styles.categoryFiltersWrapper}>
          <h2 className={styles.sectionTitle}>Kategorine göre keşfet</h2>
          <div className={styles.categoryFilters}>
            <span className={`${styles.filterItem} ${styles.filterItemActive}`}>Tümü</span>
            <span className={styles.filterItem}>Sana Özel</span>
            
            {categories.map((cat, index) => (
              <span key={index} className={styles.filterItem}>
                {cat.name?.tr || cat.name || 'Kategori'}
              </span>
            ))}
            
            <span className={styles.filterItemDropdown}>
              Beden 
              <ArrowDown01Icon size={14} color="currentColor" strokeWidth={2} />
            </span>
            <span className={styles.filterItemDropdown}>
              Marka
              <ArrowDown01Icon size={14} color="currentColor" strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {loading ? (
              // Loading skeletons or empty state could go here, for now just a text
              <p style={{ padding: 16 }}>Ürünler yükleniyor...</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.listingID || product.id}
                  brand={product.brand?.name || product.title || 'Marka Yok'}
                  price={product.price || '0'}
                  sellerName={product.user?.firstName || 'Satıcı'}
                  image={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=500'}
                  statsText={product.statsText || ''}
                  statsIcon={product.statsIcon}
                  isFavorite={product.isFavorite || false}
                />
              ))
            ) : (
              <p style={{ padding: 16, color: '#666' }}>Henüz ürün bulunmuyor.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
