"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useThemeLanguage} from "../context/ThemeLanguageContext";

export default function MobileAppBanner() {
  const { t } = useThemeLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile based on user agent and screen size
    const checkMobile = () => {
      const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
      const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)) || window.innerWidth < 768;
      setIsMobile(mobile);
      
      const dismissed = localStorage.getItem("app_banner_dismissed");
      if (mobile && !dismissed) {
        setIsVisible(true);
      }
    };
    
    checkMobile();
    
    // Listen for resize to hide banner on desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsVisible(false);
      } else {
        const dismissed = localStorage.getItem("app_banner_dismissed");
        if (!dismissed) setIsVisible(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("app_banner_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          header { top: 64px !important; }
          .relative.pt-32 { padding-top: 192px !important; }
        }
      `}} />
      <div className="fixed top-0 left-0 right-0 z-[100] h-[64px] bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 flex items-center justify-between shadow-lg md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shrink-0 overflow-hidden">
            <img src="/logo-favicon.png" alt="SalutBabe App" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[13px] leading-tight">{t("banner.app_title")}</span>
            <span className="text-[10px] font-medium text-pink-100">{t("banner.app_subtitle")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/download" onClick={() => setIsVisible(false)} className="bg-white text-pink-600 text-[11px] font-black uppercase px-4 py-2 rounded-full shadow-sm active:scale-95 transition-transform tracking-wider">
            {t("banner.open_btn")}
          </Link>
          <button onClick={handleClose} className="text-white/80 hover:text-white p-2 -mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
