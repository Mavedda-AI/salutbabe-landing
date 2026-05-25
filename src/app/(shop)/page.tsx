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
    image: "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1568043625493-2b0633c7c491?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1596066190600-3af9aadaaea1?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1560506840-ec148e82a604?auto=format&fit=crop&q=80&w=1200",
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
    image: "/baby_brands.png",
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
          <h2 className={styles.sectionTitle} style={{ margin: '0 16px 12px 16px' }}>Stiline göre keşfet</h2>
          <div className={styles.styleGrid}>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_jacket.png" alt="Hafif Katmanlar" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Hafif katmanlar</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_yellow.png" alt="Soft Renkler" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Soft renkler</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_shoes.png" alt="Minik Adımlar" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Minik Adımlar</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_organic.png" alt="Organik Pamuk" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Organik Pamuk</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_knit.png" alt="Örgü & Triko" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Örgü & Triko</span>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleImageWrapper}>
                <img src="/style_denim.png" alt="Denim Tutkusu" className={styles.styleImage} />
              </div>
              <span className={styles.styleTitle}>Denim Tutkusu</span>
            </div>
          </div>
        </div>

        {/* Popular brands */}
        <div className={styles.brandSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 12px 0' }}>Popüler markalar</h2>
          <div className={styles.brandCard}>
            <div className={styles.brandImagesGrid}>
              <img src="https://images.unsplash.com/photo-1611911813383-67769b37a149?w=300" alt="Brand 1" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=300" alt="Brand 2" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300" alt="Brand 3" className={styles.brandImage} />
              <img src="https://images.unsplash.com/photo-1560506840-ec148e82a604?w=300" alt="Brand 4" className={styles.brandImage} />
            </div>
            <div className={styles.brandFooter}>
              <span className={styles.brandName}>Zara Baby</span>
              <button className={styles.brandShopBtn}>Keşfet</button>
            </div>
          </div>
        </div>

        {/* Popular this week */}
        <div className={styles.popularWeekSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 16px 0' }}>Bu hafta popüler</h2>
          <div className={styles.popularGrid}>
            <div className={styles.popularCard}>
              <img src="https://images.unsplash.com/photo-1594150878496-a921e5af8907?w=500" alt="Bebek Ayakkabısı" className={styles.popularImage} />
              <span className={styles.popularTitle}>Bebek Ayakkabısı</span>
              <span className={styles.popularSub}>+1.3k arama</span>
            </div>
            <div className={styles.popularCard}>
              <img src="https://images.unsplash.com/photo-1632337949070-1fdb69fe2159?w=500" alt="Bebek Tulumu" className={styles.popularImage} />
              <span className={styles.popularTitle}>Bebek Tulumu</span>
              <span className={styles.popularSub}>+1.9k arama</span>
            </div>
          </div>
        </div>

        {/* Shop by price */}
        <div className={styles.priceSection}>
          <h2 className={styles.sectionTitle} style={{ margin: '0 0 16px 0' }}>Fiyata göre alışveriş</h2>
          <div className={styles.priceGrid}>
            <button className={styles.priceBtn}><span>100 TL</span> Altı</button>
            <button className={styles.priceBtn}><span>250 TL</span> Altı</button>
            <button className={styles.priceBtn}><span>500 TL</span> Altı</button>
            <button className={styles.priceBtn}><span>1000 TL</span> Altı</button>
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

      {/* Footer (Matches Depop Screenshot) */}
      <footer className={styles.footer}>
        <div className={styles.footerMenu}>
          <div className={styles.footerMenuItem}>
            Salutbabe
            <ArrowDown01Icon size={18} color="currentColor" />
          </div>
        </div>
        <div className={styles.footerMenu}>
          <div className={styles.footerMenuItem}>
            Satış Yap
            <ArrowDown01Icon size={18} color="currentColor" />
          </div>
        </div>
        <div className={styles.footerMenu}>
          <div className={styles.footerMenuItem}>
            Yardım
            <ArrowDown01Icon size={18} color="currentColor" />
          </div>
        </div>
        <div className={styles.footerMenu}>
          <div className={styles.footerMenuItem}>
            Site Bilgileri
            <ArrowDown01Icon size={18} color="currentColor" />
          </div>
        </div>

        <div className={styles.footerAppSection}>
          <h4 className={styles.footerAppTitle}>Salutbabe uygulamasını indir</h4>
          <p className={styles.footerAppDesc}>Daha hızlı ilan ver, siparişlerini takip et ve hiçbir fırsatı kaçırma.</p>
          <div className={styles.footerAppBadges}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className={styles.footerBadge} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className={styles.footerBadge} />
          </div>
          <div className={styles.footerSocials}>
            {/* Simple SVGs for X, IG, TikTok matching Depop style */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="4" x2="20" y2="20"></line><line x1="20" y1="4" x2="4" y2="20"></line></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
          </div>
        </div>
        
        <div className={styles.footerRegion}>
          Türkiye
          <ArrowDown01Icon size={18} color="currentColor" />
        </div>
      </footer>
    </>
  );
}
