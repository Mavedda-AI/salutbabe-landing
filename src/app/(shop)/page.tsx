"use client";

import React, {useEffect, useState} from 'react';
import ProductCard from '@/components/ProductCard';
import PublicHero from '@/components/PublicHero';
import {ArrowDown01Icon} from 'hugeicons-react';
import {apiUrl} from '@/lib/api';
import styles from './page.module.css';

const FILTER_TABS = ["Tümü", "Sana Özel", "Anne", "Bebek", "Çocuk", "Diğer"];
const DROPDOWN_TABS = ["Beden", "Marka"];

const CATEGORY_BANNERS: Record<string, { image: string; title: string; text: string; buttonText: string; bg: string; color: string; btnBg: string; btnColor: string; dotColorActive: string; dotColorInactive: string }> = {
  "Tümü": {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200",
    title: "Salutbabe'te Kargo Bedava",
    text: "Seveceğin bir şeyler bul. Sadece Salutbabe'te.",
    buttonText: "Alışverişe Başla",
    bg: "#14342B", /* Deep Forest Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Sana Özel": {
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200",
    title: "Sana Özel Seçimler",
    text: "Zevkine ve tarzına en uygun ürünler.",
    buttonText: "Sana Özel Ürünleri Gör",
    bg: "#82857C", /* RAL 7023 Concrete Grey */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Anne": {
    image: "https://images.unsplash.com/photo-1560707854-fb9a10eeaace?auto=format&fit=crop&q=80&w=1200",
    title: "Annelerin İhtiyaçları",
    text: "Hamilelikten lohusalığa tüm ihtiyaçların.",
    buttonText: "Anne Ürünlerini Keşfet",
    bg: "#BCA371", /* Warm Sand / Gold */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Bebek": {
    image: "https://images.unsplash.com/photo-1608365151231-7dbed3034787?auto=format&fit=crop&q=80&w=1200",
    title: "Bebek Dünyası",
    text: "Bebeğiniz için en sevimli ürünler.",
    buttonText: "Bebek Ürünleri",
    bg: "#A3AFA2", /* Sage Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Çocuk": {
    image: "https://images.unsplash.com/photo-1618570624585-43156608a47c?auto=format&fit=crop&q=80&w=1200",
    title: "Çocuk Modası",
    text: "Dayanıklı, rahat ve trend kıyafetler.",
    buttonText: "Çocuk Giyimi Keşfet",
    bg: "#55644D", /* Olive Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Diğer": {
    image: "https://images.unsplash.com/photo-1602773974733-b56200c8653f?auto=format&fit=crop&q=80&w=1200",
    title: "El İşçiliği Ürünler",
    text: "Özenle hazırlanmış el emeği ürünler.",
    buttonText: "Özel Tasarımları İncele",
    bg: "#14342B", /* Deep Forest Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Beden": {
    image: "https://images.unsplash.com/photo-1596484552993-aec4311d3381?auto=format&fit=crop&q=80&w=1200",
    title: "Bedene Göre Seçim",
    text: "Sana en uygun bedenleri hemen bul.",
    buttonText: "Beden Filtrele",
    bg: "#82857C", /* RAL 7023 Concrete Grey */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Marka": {
    image: "https://images.unsplash.com/photo-1641440616490-723c8cc161b8?auto=format&fit=crop&q=80&w=1200",
    title: "Markaya Göre Seçim",
    text: "En sevdiğin markaları hemen keşfet.",
    buttonText: "Markaları Gör",
    bg: "#BCA371", /* Warm Sand / Gold */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
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
              style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.bg }}
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
                  style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.dotColorActive }}
                ></span>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.dotColorInactive }}
                ></span>
                <span 
                  className={styles.promoDot} 
                  style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.dotColorInactive }}
                ></span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop by style */}
        <div className={styles.styleSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 16px 0' }}>Stiline göre keşfet</h2>
          <div className={styles.styleGrid}>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="https://images.unsplash.com/photo-1550639524-a6f58345a278?w=500" alt="Hafif Katmanlar" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Hafif katmanlar</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500" alt="Soft Renkler" className={styles.styleImage} style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.styleTitle}>Soft renkler</span>
            </div>
          </div>
        </div>

        {/* Popular brands */}
        <div className={styles.brandSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 16px 0' }}>Popüler markalar</h2>
          <div className={styles.brandCard}>
            <div className={styles.brandImagesGrid}>
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" alt="Nike Shoe" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=300" alt="Nike Top" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=300" alt="Nike Hoodie" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300" alt="Nike Jacket" className={styles.brandImage} />
            </div>
            <div className={styles.brandFooter}>
              <span className={styles.brandName}>Nike</span>
              <button className={styles.brandShopBtn}>Alışverişe Başla</button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {loading && (
              <div key="loading" style={{ padding: 16 }}>Ürünler yükleniyor...</div>
            )}
            
            {!loading && products.length > 0 && products.map((product) => (
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
            ))}
            
            {!loading && products.length === 0 && (
              <div key="empty" style={{ padding: 16, color: '#666' }}>Henüz ürün bulunmuyor.</div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
