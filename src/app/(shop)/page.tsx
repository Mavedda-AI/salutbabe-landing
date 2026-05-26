"use client";

import React, {useState} from 'react';
import PublicHero from '@/components/PublicHero';
import CategoryFilterWidget from '@/components/widgets/CategoryFilterWidget';
import StyleGridWidget from '@/components/widgets/StyleGridWidget';
import BrandGridWidget from '@/components/widgets/BrandGridWidget';
import PopularGridWidget from '@/components/widgets/PopularGridWidget';
import BundleWidget from '@/components/widgets/BundleWidget';
import MosaicWidget from '@/components/widgets/MosaicWidget';
import RankingWidget from '@/components/widgets/RankingWidget';
import PriceGridWidget from '@/components/widgets/PriceGridWidget';
import MannequinWidget from '@/components/widgets/MannequinWidget';
import CountrySelectorFooter from '@/components/widgets/CountrySelectorFooter';
import styles from './page.module.css';

export default function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  return (
    <>
      {/* 1. Hero Banner */}
      <PublicHero />
      
      <div className={styles.feedContainer}>
        {/* 2. Category Tabs & Promotional Banner */}
        <CategoryFilterWidget 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />

        {/* 3. Shop by Style */}
        <StyleGridWidget />

        {/* 4. Popular Brands */}
        <BrandGridWidget />

        {/* 5. Popular This Week */}
        <PopularGridWidget />

        {/* 6. Bundles (Annelerin Sepetleri) */}
        <BundleWidget />

        {/* 8. Mosaic Wall (Sizin İçin Seçilenler) */}
        <MosaicWidget activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* 9. Ranking / Leaderboard */}
        <RankingWidget />

        {/* Mannequin Outfit Builder */}
        <MannequinWidget />

        {/* 7. Shop by Price */}
        <PriceGridWidget />
      </div>

      {/* 10. Country & Language Selector Footer */}
      <CountrySelectorFooter />
    </>
  );
}
