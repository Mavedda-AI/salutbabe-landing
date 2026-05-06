"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useThemeLanguage} from "../context/ThemeLanguageContext";
import SearchBar from "./SearchBar";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  
  // Placeholder for login status - in a real app, this would come from a context/auth hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border-color/50 shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 flex items-center justify-between gap-8">
        
        {/* Left: Home & Core Nav */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="text-text-primary hover:text-primary transition-colors" aria-label="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/category/new" 
              className="text-[13px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
            >
              {t("new_arrivals") || "Yeni Gelenler"}
            </Link>
            <Link 
              href="/categories" 
              className="text-[13px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
            >
              {t("categories") || "Kategoriler"}
            </Link>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <SearchBar />

        {/* Right: Actions */}
        <div className="flex items-center gap-6 shrink-0">
          
          {!isLoggedIn && (
            <Link 
              href="/login" 
              className="text-[13px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors hidden sm:block"
            >
              {t("login") || "Giriş Yap"}
            </Link>
          )}

          {!isLoggedIn && (
            <Link 
              href="/sell" 
              className="text-[13px] font-black uppercase tracking-widest sell-gradient-text hover:opacity-80 transition-opacity hidden md:block"
            >
              {t("sell") || "Satış Yap"}
            </Link>
          )}

          {/* Theme & Language Switchers (Compact) */}
          <div className="flex items-center gap-4 border-l border-border-color pl-6 ml-2 hidden lg:flex">
             <button onClick={toggleTheme} className="text-text-secondary hover:text-primary transition-colors">
               {theme === 'dark' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                 </svg>
               )}
             </button>
          </div>

          {/* Cart Icon */}
          <Link 
            href="/cart"
            className="relative text-text-primary hover:text-primary transition-colors flex items-center p-2 bg-surface/50 rounded-full border border-border-color/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-background">
              0
            </span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-text-primary p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;
