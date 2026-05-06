"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useThemeLanguage} from "../context/ThemeLanguageContext";
import SearchBar from "./SearchBar";
import Leaderboard from "./Leaderboard";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    setIsLoggedIn(!!token);

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const ut = user.userType;
        const adminCheck = Array.isArray(ut) ? (ut.includes("ADMIN") || ut.includes("SYSOP")) : (ut === "ADMIN" || ut === "SYSOP");
        setIsAdmin(adminCheck);
      } catch(e) {}
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const handleOpenLeaderboard = () => {
      setIsLeaderboardOpen(true);
    };
    window.addEventListener('open-leaderboard-modal', handleOpenLeaderboard);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('open-leaderboard-modal', handleOpenLeaderboard);
    };
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isLeaderboardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLeaderboardOpen]);

  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return null;
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border-color/50 shadow-sm py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col w-full">
          
          {/* Top Row: Logo (Center) & Switchers (Right) */}
          <div className="flex items-center justify-between md:justify-center w-full py-2 relative">
            <div className="md:absolute md:left-0 flex items-center">
               <button className="md:hidden text-text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                 </svg>
               </button>
            </div>

            <Link href="/" className="text-3xl font-black tracking-tighter text-text-primary">
              salutbabe
            </Link>

            <div className="md:absolute md:right-0 flex items-center gap-4 md:gap-6">
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

              <button 
                onClick={() => {
                  const langs: ('tr' | 'en' | 'fr')[] = ['tr', 'en', 'fr'];
                  const nextIdx = (langs.indexOf(language) + 1) % langs.length;
                  setLanguage(langs[nextIdx]);
                }}
                className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
                aria-label="Toggle Language"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <span>{language}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Navigation & Search Bar */}
          <div className="hidden md:flex items-center justify-between w-full py-3 gap-8 border-t border-border-color/20 mt-1">
            <div className="flex items-center gap-10">
              <Link href="/" className="text-text-secondary hover:text-primary transition-colors" aria-label="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </Link>
              
              <Link 
                href="/category/new" 
                className="text-[13px] font-bold uppercase tracking-[0.1em] text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
              >
                {t("header.new_arrivals")}
              </Link>
              
              <Link 
                href="/categories" 
                className="text-[13px] font-bold uppercase tracking-[0.1em] text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
              >
                {t("header.categories")}
              </Link>
            </div>

            <SearchBar />

            <div className="flex items-center gap-6 shrink-0">
              {/* Crown Icon (Leaderboard) in Gold */}
              <button 
                onClick={() => setIsLeaderboardOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#FFD700] hover:scale-110 active:scale-95 transition-all drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                aria-label="Leaderboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                </svg>
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-6">
                  {/* Favorites */}
                  <Link 
                    href="/favorites" 
                    className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-text-secondary hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </Link>

                  {/* Cart Label & Icon */}
                  <Link 
                    href="/cart"
                    className="relative text-text-primary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-background">
                      0
                    </span>
                  </Link>

                  <Link 
                    href={isAdmin ? "/dashboard/sysop/admin" : "/dashboard/sysop"} 
                    className="text-[11px] font-black uppercase tracking-widest bg-surface border border-border-color px-5 py-2.5 rounded-xl hover:bg-text-primary hover:text-background transition-all whitespace-nowrap shadow-sm"
                  >
                    {t("header.back_to_panel")}
                  </Link>
                </div>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-[13px] font-bold uppercase tracking-[0.1em] text-text-secondary hover:text-primary transition-colors"
                  >
                    {t("header.login")}
                  </Link>

                  <Link 
                    href="/register" 
                    className="text-[13px] font-black uppercase tracking-[0.1em] sell-gradient-text hover:opacity-80 transition-opacity"
                  >
                    {t("header.sell")}
                  </Link>

                  <Link 
                    href="/cart"
                    className="relative text-text-primary hover:text-primary transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-background">
                      0
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8" onClick={() => setIsLeaderboardOpen(false)}>
          <div 
            className="bg-background border border-border-color rounded-[3.5rem] w-full max-w-5xl h-full max-h-[85vh] overflow-hidden relative shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Close Area */}
            <div className="absolute top-8 right-8 z-[210]">
              <button 
                onClick={() => setIsLeaderboardOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors bg-surface/80 rounded-full p-2.5 backdrop-blur-md border border-border-color/50 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-2">
              <Leaderboard />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
