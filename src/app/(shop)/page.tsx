"use client";

import React, {useEffect, useState} from 'react';
import PublicHero from '@/components/PublicHero';
import CategoryFilterWidget from '@/components/widgets/CategoryFilterWidget';
import StyleGridWidget from '@/components/widgets/StyleGridWidget';
import BrandGridWidget from '@/components/widgets/BrandGridWidget';
import PopularGridWidget from '@/components/widgets/PopularGridWidget';
import BundleWidget from '@/components/widgets/BundleWidget';
import MosaicWidget from '@/components/widgets/MosaicWidget';
import RankingWidget from '@/components/widgets/RankingWidget';
import PriceGridWidget from '@/components/widgets/PriceGridWidget';
import CountrySelectorFooter from '@/components/widgets/CountrySelectorFooter';
import styles from './page.module.css';
import {apiUrl} from '@/lib/api';

export default function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep the fetch logic just in case the parent needs it later
    // In a full refactor, this could be pushed into context or SWR
    const fetchData = async () => {
      try {
        await Promise.all([
          fetch(apiUrl('/listings/products?limit=20')).catch(() => null),
          fetch(apiUrl('/listings/get-all-categories')).catch(() => null)
        ]);
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

        {/* 7. Shop by Price */}
        <PriceGridWidget />

        {/* 8. Mosaic Wall (Sizin İçin Seçilenler) */}
        <MosaicWidget />

        {/* 9. Ranking / Leaderboard */}
        <RankingWidget />
      </div>

      {/* 10. Country & Language Selector Footer */}
      <CountrySelectorFooter />
    </>
  );
}
