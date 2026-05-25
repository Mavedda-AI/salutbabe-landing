"use client";

import React, {useEffect, useState} from 'react';
import ProductCard from '@/components/ProductCard';
import PublicHero from '@/components/PublicHero';
import {ArrowDown01Icon} from 'hugeicons-react';
import {apiUrl} from '@/lib/api';
import styles from './page.module.css';

const FILTER_TABS = ["Tümü", "Sana Özel", "Anne", "Bebek", "Çocuk", "Diğer"];
const DROPDOWN_TABS = ["Beden", "Marka"];

const CATEGORY_BANNERS: Record<string, { image: string; title: string; text: string; buttonText: string }> = {
  "Tümü": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200",
    title: "Salutbabe'te Kargo Bedava",
    text: "Seveceğin bir şeyler bul. Sadece Salutbabe'te.",
    buttonText: "Alışverişe Başla"
  },
  "Sana Özel": {
    image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=1200",
    title: "Sana Özel Algoritmalar",
    text: "Zevkine ve tarzına en uygun ürünleri senin için seçtik.",
    buttonText: "Sana Özel Ürünleri Gör"
  },
  "Anne": {
    image: "https://images.unsplash.com/photo-1550987303-3ea76b91c107?auto=format&fit=crop&q=80&w=1200",
    title: "Annelerin İhtiyaçları",
    text: "Hamilelikten lohusalığa, annelerin tüm ihtiyaçları ve şık giyim seçenekleri.",
    buttonText: "Anne Ürünlerini Keşfet"
  },
  "Bebek": {
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200",
    title: "Bebek Dünyasına Hoşgeldiniz",
    text: "Yenidoğandan itibaren bebeğinizin ihtiyaç duyacağı en sevimli ürünler.",
    buttonText: "Bebek Ürünleri"
  },
  "Çocuk": {
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=1200",
    title: "Çocuklar İçin Tarzlar",
    text: "Büyüyen çocuklarınız için dayanıklı, rahat ve en trend kıyafetler.",
    buttonText: "Çocuk Giyimi Keşfet"
  },
  "Diğer": {
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1200",
    title: "El İşçiliği Ürünler",
    text: "Özenle hazırlanmış el emeği ürünler, oyuncaklar ve benzersiz tasarımlar.",
    buttonText: "Özel Tasarımları İncele"
  },
  "Beden": {
    image: "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?auto=format&fit=crop&q=80&w=1200",
    title: "Bedene Göre Seçim",
    text: "Sana ve çocuğuna en uygun bedenleri filtrele, tam oturan ürünleri bul.",
    buttonText: "Beden Filtrele"
  },
  "Marka": {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200",
    title: "Markaya Göre Seçim",
    text: "En sevdiğin markaların ikinci el ve sıfır ürünlerini keşfet.",
    buttonText: "Markaları Gör"
  }
};

export default function HomeFeed() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");

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
            {FILTER_TABS.map((tab) => (
              <span 
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`${styles.filterPill} ${activeCategory === tab ? styles.filterPillActive : ''}`}
              >
                {tab}
              </span>
            ))}
            
            {DROPDOWN_TABS.map((tab) => (
              <span 
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`${styles.filterPillDropdown} ${activeCategory === tab ? styles.filterPillActive : ''}`}
              >
                {tab}
                <ArrowDown01Icon size={18} color="currentColor" strokeWidth={2.5} />
              </span>
            ))}
          </div>

          {/* Promotional Banner (Matches Depop Banner) */}
          <div className={styles.promoBanner}>
            <img 
              src={CATEGORY_BANNERS[activeCategory]?.image} 
              alt="Promo" 
              className={styles.promoImage} 
            />
            <div className={styles.promoContent}>
              <h3 className={styles.promoTitle}>{CATEGORY_BANNERS[activeCategory]?.title}</h3>
              <p className={styles.promoText}>{CATEGORY_BANNERS[activeCategory]?.text}</p>
              <button className={styles.promoButton}>{CATEGORY_BANNERS[activeCategory]?.buttonText}</button>
              <div className={styles.promoDots}>
                <span className={`${styles.promoDot} ${styles.promoDotActive}`}></span>
                <span className={styles.promoDot}></span>
                <span className={styles.promoDot}></span>
              </div>
            </div>
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
