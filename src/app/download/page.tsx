"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";

export default function DownloadPage() {
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop" | "loading">("loading");
  const { t, language } = useThemeLanguage();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    if (/android/i.test(userAgent)) {
      setDeviceType("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setDeviceType("ios");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  const appStoreLink = "https://apps.apple.com/tr/app/salutbabe/id6759988511";
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.salutbabe&pli=1";

  const renderButtons = () => {
    if (deviceType === "loading") return null;

    const AppStoreButton = () => (
      <a 
        href={appStoreLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-4 px-8 py-4 bg-neutral-900 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
      >
        <svg viewBox="0 0 384 512" className="w-8 h-8 fill-current group-hover:text-[#FF9EBE] transition-colors">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
        </svg>
        <div className="flex flex-col items-start">
          <span className="text-xs text-neutral-300 font-medium">{t("download.app_store_top")}</span>
          <span className="text-xl font-bold">{t("download.app_store_bottom")}</span>
        </div>
      </a>
    );

    const PlayStoreButton = () => (
      <a 
        href={playStoreLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-4 px-8 py-4 bg-neutral-900 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
      >
        <svg viewBox="0 0 512 512" className="w-8 h-8 fill-current group-hover:text-[#5FC8C0] transition-colors">
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
        </svg>
        <div className="flex flex-col items-start">
          <span className="text-xs text-neutral-300 font-medium">{t("download.play_store_top")}</span>
          <span className="text-xl font-bold">{t("download.play_store_bottom")}</span>
        </div>
      </a>
    );

    if (deviceType === "ios") {
      return <AppStoreButton />;
    }

    if (deviceType === "android") {
      return <PlayStoreButton />;
    }

    // desktop or other
    return (
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <AppStoreButton />
        <PlayStoreButton />
      </div>
    );
  };

  return (
    <main className="min-h-screen relative pt-32 pb-20 overflow-hidden bg-background flex items-center justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] bg-secondary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center w-full z-10">
        
        {/* Logo / App Icon placeholder */}
        <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-8 animate-fade-in-up border border-border-color overflow-hidden">
          <Image 
             src="/logo-salutbabe.png" 
             alt="salutbabe Icon" 
             width={100} 
             height={100}
             className="object-contain"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-text-primary mb-6 tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {language === 'tr' ? (
            <>
              <span className="sell-gradient-text">salutbabe&apos;i</span> {t("download.title_sub")}
            </>
          ) : (
            <>
              {t("download.title_main")} <span className="sell-gradient-text">salutbabe</span>
            </>
          )}
        </h1>

        <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl leading-relaxed animate-fade-in-up font-medium" style={{ animationDelay: '0.2s' }}>
          {t("download.description")}
        </p>

        <div className="animate-fade-in-up w-full" style={{ animationDelay: '0.3s' }}>
          <div className="bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-border-color relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur opacity-10 -z-10"></div>
            
            <div className="flex flex-col items-center gap-6">
              <p className="text-text-secondary font-black text-xs uppercase tracking-widest mb-2">
                {deviceType === "loading" ? t("download.detecting") : 
                 deviceType === "ios" ? t("download.ios_msg") : 
                 deviceType === "android" ? t("download.android_msg") : 
                 t("download.desktop_msg")}
              </p>
              {renderButtons()}
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}
