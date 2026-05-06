"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useThemeLanguage} from "../context/ThemeLanguageContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("shop"), href: "/shop" },
    { label: t("new_arrivals"), href: "/category/new" },
    { label: t("brands"), href: "/brands" },
    { label: t("sell"), href: "/sell" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border-color/50 shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col w-full">
        
        {/* Top Row: Logo & Mobile Toggle & Switchers */}
        <div className="flex items-center justify-between md:justify-center w-full py-3 relative">
          
          {/* Left: Mobile menu toggle */}
          <div className="md:absolute md:left-0 flex items-center">
            <button className="md:hidden text-text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Center: Logo & Home Icon */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-text-primary hover:text-primary transition-colors hidden md:block" aria-label="Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </Link>
            <Link href="/" className="text-3xl font-black tracking-tighter text-text-primary">
              salutbabe
            </Link>
          </div>

          {/* Right: Switchers & Mobile Cart */}
          <div className="md:absolute md:right-0 flex items-center gap-4 md:gap-6">
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="text-text-secondary hover:text-primary transition-colors" aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
              aria-label="Toggle Language"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span>{language}</span>
            </button>

            {/* Mobile Cart */}
            <Link href="/cart" className="md:hidden relative text-text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom Row: Menus & Buttons (Desktop Only) */}
        <div className="hidden md:flex items-center justify-between w-full py-3">
          {/* Left Nav */}
          <nav className="flex items-center gap-10">
            {navLinks.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                className="text-[13px] font-bold capitalize tracking-widest text-text-secondary hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-8">
            <button className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 text-[13px] font-bold capitalize tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              {t('search')}
            </button>
            
            <Link href="/login" className="text-[13px] font-bold capitalize tracking-widest text-text-secondary hover:text-primary transition-colors">
              {t('login')}
            </Link>

            <Link 
              href="/cart"
              className="relative text-text-secondary hover:text-primary transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
