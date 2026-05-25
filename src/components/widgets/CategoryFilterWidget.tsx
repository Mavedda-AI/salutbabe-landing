"use client";

import React from 'react';
import styles from '@/app/(shop)/page.module.css';
import {ArrowDown01Icon} from 'hugeicons-react';
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

  const FILTER_TABS = [
    { key: "Tümü", label: t('home.tab_all') },
    { key: "Sana Özel", label: t('home.tab_foryou') },
    { key: "Anne", label: t('home.tab_mom') },
    { key: "Bebek", label: t('home.tab_baby') },
    { key: "Çocuk", label: t('home.tab_child') },
    { key: "Diğer", label: t('home.tab_other') }
  ];
  
  const DROPDOWN_TABS = [
    { key: "Beden", label: t('home.tab_size') },
    { key: "Marka", label: t('home.tab_brand') }
  ];

  return (
    <div className={styles.categoryFiltersWrapper}>
      <h2 className={styles.sectionTitle}>{t('home.category_filter_title')}</h2>
      <div className={styles.categoryFilters}>
        {FILTER_TABS.map((tab) => (
          <span 
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`${styles.filterPill} ${activeCategory === tab.key ? styles.filterPillActive : ''}`}
          >
            {tab.label}
          </span>
        ))}
        {DROPDOWN_TABS.map((tab) => (
          <span 
            key={tab.key}
            className={`${styles.filterPillDropdown} ${activeCategory === tab.key ? styles.filterPillActive : ''}`}
            onClick={() => setActiveCategory(tab.key)}
          >
            {tab.label} <ArrowDown01Icon size={18} color="currentColor" strokeWidth={2.5} />
          </span>
        ))}
      </div>

      {/* Promotional Banner */}
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
            <span 
              className={styles.promoDot} 
              style={{ backgroundColor: CATEGORY_BANNERS[activeCategory]?.dotColorInactive }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}
