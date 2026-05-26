"use client";

import React, {useEffect, useRef, useState} from 'react';
import {Clock01Icon, Search01Icon} from 'hugeicons-react';
import styles from './SearchDrawer.module.css';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const { t } = useThemeLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mock data for Depop style search experience
  const trendingSearches = ["Y2K", "Vintage Leather Jacket", "Baggy Jeans", "Gorpcore", "Baby Tee", "Cargo Pants"];
  const recentSearches = ["Nike Dunk Low", "Carhartt Detroit", "Diesel Watch"];

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto focus input when opened
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
    onClose();
    // To do: router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm.trim());
    }
  };

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
        <form className={styles.searchHeader} onSubmit={onSubmit}>
          <div className={styles.searchInputWrapper}>
            <Search01Icon size={20} color="var(--text-secondary)" strokeWidth={2} />
            <input 
              ref={inputRef}
              type="text" 
              placeholder={t("widgets.header_search_placeholder") || "Arama yap..."}
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            İptal
          </button>
        </form>

        {!searchTerm && (
          <>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Trend Aramalar</h3>
              <div className={styles.pillContainer}>
                {trendingSearches.map((term, i) => (
                  <button 
                    key={i} 
                    type="button"
                    className={styles.pill}
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Son Arananlar</h3>
              <div>
                {recentSearches.map((term, i) => (
                  <div 
                    key={i} 
                    className={styles.recentItem}
                    onClick={() => handleSearch(term)}
                  >
                    <Clock01Icon size={20} className={styles.recentIcon} />
                    <span className={styles.recentText}>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
