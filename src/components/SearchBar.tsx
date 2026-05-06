"use client";

import React from "react";
import {useThemeLanguage} from "../context/ThemeLanguageContext";

const SearchBar = () => {
  const { t } = useThemeLanguage();
  
  return (
    <div className="flex-1 max-w-2xl px-4 hidden lg:block">
      <div className="relative group">
        <input
          type="text"
          placeholder={t('search') + "..."}
          className="w-full h-11 pl-12 pr-4 rounded-full bg-surface/50 border border-border-color/50 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 outline-none text-sm font-medium"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
