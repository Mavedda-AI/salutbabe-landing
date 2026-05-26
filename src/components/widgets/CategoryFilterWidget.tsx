"use client";

import React, {useEffect, useRef, useState} from 'react';
import styles from '@/app/(shop)/page.module.css';
import {ArrowRight01Icon} from 'hugeicons-react';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

const getCategoryBanners = (t: any): Record<string, { image: string; title: string; text: string; buttonText: string; bg: string; color: string; btnBg: string; btnColor: string; dotColorActive: string; dotColorInactive: string }> => ({
  "Tümü": {
    image: "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?auto=format&fit=crop&q=80&w=1200",
    title: "Salutbabe'te Kargo Bedava",
    text: "Seveceğin bir şeyler bul. Sadece Salutbabe'te.",
    buttonText: t("widgets.category_all_button"),
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
    title: t("widgets.category_mom_title"),
    text: t("widgets.category_mom_desc"),
    buttonText: t("widgets.category_mom_button"),
    bg: "#BCA371", /* Warm Sand / Gold */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Bebek": {
    image: "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?auto=format&fit=crop&q=80&w=1200",
    title: t("widgets.category_baby_title"),
    text: "Bebeğiniz için en sevimli ürünler.",
    buttonText: t("widgets.category_baby_button"),
    bg: "#A3AFA2", /* Sage Green */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  },
  "Çocuk": {
    image: "https://images.unsplash.com/photo-1596066190600-3af9aadaaea1?auto=format&fit=crop&q=80&w=1200",
    title: t("widgets.category_child_title"),
    text: "Dayanıklı, rahat ve trend kıyafetler.",
    buttonText: t("widgets.category_child_button"),
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
    title: t("widgets.category_size_title"),
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
    title: t("widgets.category_brand_title"),
    text: "En sevdiğin markaları hemen keşfet.",
    buttonText: t("widgets.category_brand_button"),
    bg: "#BCA371", /* Warm Sand / Gold */
    color: "#FFFFFF",
    btnBg: "#FFFFFF",
    btnColor: "#111111",
    dotColorActive: "rgba(255, 255, 255, 0.9)",
    dotColorInactive: "rgba(255, 255, 255, 0.3)"
  }
});

interface Props {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function CategoryFilterWidget({ activeCategory, setActiveCategory }: Props) {
  const { t } = useThemeLanguage();
  const CATEGORY_BANNERS = getCategoryBanners(t);
  const banners = Object.values(CATEGORY_BANNERS);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollNext = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
        setActiveIndex(index);
      }
    };
    
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={styles.categoryFiltersWrapper}>
      <h2 className={styles.sectionTitle}>{t('home.category_filter_title')}</h2>

      <div style={{ position: 'relative' }}>
        <div className={styles.promoBannerCarousel} ref={scrollRef}>
          {banners.map((banner, index) => (
            <div key={index} className={styles.promoBanner}>
              <img 
                src={banner.image} 
                alt="Promo" 
                className={styles.promoImage} 
                style={{ backgroundColor: banner.bg }}
              />
              <div 
                className={styles.promoContent} 
                style={{ background: banner.bg, color: banner.color }}
              >
                <h3 className={styles.promoTitle}>{banner.title}</h3>
                <p className={styles.promoText}>{banner.text}</p>
                <button 
                  className={styles.promoButton}
                  style={{ backgroundColor: banner.btnBg, color: banner.btnColor }}
                >
                  {banner.buttonText}
                </button>
                <div className={styles.promoDots}>
                  {banners.slice(0, 4).map((_, dotIndex) => (
                    <span 
                      key={dotIndex}
                      className={styles.promoDot} 
                      style={{ 
                        backgroundColor: (index % 4) === dotIndex ? banner.dotColorActive : banner.dotColorInactive 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={scrollNext}
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10
          }}
          aria-label="Next Banner"
        >
          <ArrowRight01Icon size={20} color="#111" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
