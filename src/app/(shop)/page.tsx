"use client";

import React, {useEffect, useState} from 'react';
import ProductCard from '@/components/ProductCard';
import PublicHero from '@/components/PublicHero';
import {ArrowDown01Icon} from 'hugeicons-react';
import {apiUrl} from '@/lib/api';
import styles from './page.module.css';

const FILTER_TABS = ["Tümü", "Sana Özel", "Anne", "Bebek", "Çocuk", "Diğer"];
const DROPDOWN_TABS = ["Beden", "Marka"];

const CATEGORY_BANNERS: Record<string, { image: string; title: string; text: string; buttonText: string; bg: string; color: string; btnBg: string; btnColor: string }> = {
  "Tümü": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200",
    title: "Salutbabe'te Kargo Bedava",
    text: "Seveceğin bir şeyler bul. Sadece Salutbabe'te.",
    buttonText: "Alışverişe Başla",
    bg: "linear-gradient(180deg, #F9F7F5 0%, #E8F4F8 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
  },
  "Sana Özel": {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200",
    title: "Sana Özel Seçimler",
    text: "Zevkine ve tarzına en uygun ürünler.",
    buttonText: "Sana Özel Ürünleri Gör",
    bg: "linear-gradient(180deg, #FDF4FF 0%, #F3E8FF 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
  },
  "Anne": {
    image: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=1200",
    title: "Annelerin İhtiyaçları",
    text: "Hamilelikten lohusalığa tüm ihtiyaçların.",
    buttonText: "Anne Ürünlerini Keşfet",
    bg: "linear-gradient(180deg, #FAF0F2 0%, #F5E6E8 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
  },
  "Bebek": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200",
    title: "Bebek Dünyası",
    text: "Bebeğiniz için en sevimli ürünler.",
    buttonText: "Bebek Ürünleri",
    bg: "linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
  },
  "Çocuk": {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200",
    title: "Çocuk Modası",
    text: "Dayanıklı, rahat ve trend kıyafetler.",
    buttonText: "Çocuk Giyimi Keşfet",
    bg: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
  },
  "Diğer": {
    image: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=1200",
    title: "El İşçiliği Ürünler",
    text: "Özenle hazırlanmış el emeği ürünler.",
    buttonText: "Özel Tasarımları İncele",
    bg: "linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
  },
  "Beden": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200",
    title: "Bedene Göre Seçim",
    text: "Sana en uygun bedenleri hemen bul.",
    buttonText: "Beden Filtrele",
    bg: "linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
  },
  "Marka": {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200",
    title: "Markaya Göre Seçim",
    text: "En sevdiğin markaları hemen keşfet.",
    buttonText: "Markaları Gör",
    bg: "linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)",
    color: "#111111",
    btnBg: "#111111",
    btnColor: "#FFFFFF"
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
            <div 
              className={styles.promoContent} 
              style={{ 
                background: CATEGORY_BANNERS[activeCategory]?.bg, 
                color: CATEGORY_BANNERS[activeCategory]?.color 
              }}
            >
              <h3 className={styles.promoTitle}>{CATEGORY_BANNERS[activeCategory]?.title}</h3>
              <p className={styles.promoText}>{CATEGORY_BANNERS[activeCategory]?.text}</p>
              <button 
                className={styles.promoButton}
                style={{ 
                  backgroundColor: CATEGORY_BANNERS[activeCategory]?.btnBg, 
                  color: CATEGORY_BANNERS[activeCategory]?.btnColor 
                }}
              >
                {CATEGORY_BANNERS[activeCategory]?.buttonText}
              </button>
              <div className={styles.promoDots}>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: 'rgba(17, 17, 17, 0.8)' }}
                ></span>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: 'rgba(17, 17, 17, 0.2)' }}
                ></span>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: 'rgba(17, 17, 17, 0.2)' }}
                ></span>
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
