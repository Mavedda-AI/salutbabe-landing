"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";

export default function SysopDashboard() {
  const { theme } = useThemeLanguage();
  // Simulated role switch for development. In production, this reads from userType.
  const [userRole, setUserRole] = useState<'founder' | 'partner'>('founder');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        const types = u?.userType || [];
        // Defaulting to founder if SYSOP, else partner.
        setUserRole((Array.isArray(types) ? types : [types]).some((t: string) => t === 'FOUNDER' || t === 'SYSOP') ? 'founder' : 'partner');
      }
    } catch {}
  }, []);

  const isDark = theme === 'dark';
  
  // Design Tokens matching the uploaded image exactly
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;
  const textTitle = `text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const textValue = `text-[26px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`;
  const iconRight = `w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-300'} ml-auto cursor-pointer hover:text-gray-600 transition-colors`;
  const buttonClass = `px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-2 transition-all active:scale-95 ${isDark ? 'bg-[#1A1D1F] border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`;
  const badgeGreen = `flex items-center gap-1 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 px-2 py-0.5 rounded-md text-[11px] font-bold`;
  const badgeRed = `flex items-center gap-1 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-2 py-0.5 rounded-md text-[11px] font-bold`;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in pb-12">
      
      {/* Role Switcher (For demo purposes so the user can see both) */}
      <div className="flex items-center justify-end gap-2 mb-4">
         <span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Görünüm:</span>
         <button onClick={() => setUserRole('founder')} className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${userRole === 'founder' ? 'bg-[#2E2E3A] text-white' : 'bg-gray-100 text-gray-500'}`}>Kurucu (Mustafa)</button>
         <button onClick={() => setUserRole('partner')} className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${userRole === 'partner' ? 'bg-[#2E2E3A] text-white' : 'bg-gray-100 text-gray-500'}`}>Operasyon (Ayşe)</button>
      </div>

      {userRole === 'founder' ? (
        // ==========================================
        // FOUNDER L0 DASHBOARD (MUSTAFA)
        // Focus: Financial Pulse + Strategic Signals
        // ==========================================
        <>
          {/* ROW 1: STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. TAKE RATE REVENUE */}
            <div className={`${cardClass} p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  NET TAKE RATE
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>142.500 ₺</h2>
                <span className="text-[13px] font-bold text-green-500">+12k ₺</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  %12
                </span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>vs geçen ay</span>
              </div>
            </div>

            {/* 2. LIVE ROOM CONVERSIONS */}
            <div className={`${cardClass} p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  SESLİ ODA DÖNÜŞÜMÜ
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>6,432</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Satış</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeRed}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
                  %1.8
                </span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Oda → Satın Alma</span>
              </div>
            </div>

            {/* 3. ACTIVE SELLERS (MOTHERS VS PROS) */}
            <div className={`${cardClass} p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  AKTİF SATICILAR
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>8,574</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kişi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  %4.2
                </span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>8.4k Anne / 174 Pro</span>
              </div>
            </div>

            {/* 4. KEŞFET COMMUNITY */}
            <div className={`${cardClass} p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  KEŞFET ETKİLEŞİMİ
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>12,840</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  %8.4
                </span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Mahalle bazlı aktivite</span>
              </div>
            </div>
          </div>

          {/* ROW 2: CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CHANNEL PERFORMANCE (1 Col) */}
            <div className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center mb-8">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  KANAL GELİRLERİ
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              
              {/* Half Donut Mock SVG */}
              <div className="relative w-full flex justify-center items-end mb-8 mt-4">
                 <svg viewBox="0 0 100 60" className="w-[85%] max-w-[250px] h-auto overflow-visible">
                   <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={isDark ? '#1F2937' : '#E5E7EB'} strokeWidth="12" strokeLinecap="round" />
                   <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={isDark ? '#4B5563' : '#2E2E3A'} strokeWidth="12" strokeLinecap="round" strokeDasharray="125.66" strokeDashoffset="45" />
                   <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#FF007A" strokeWidth="12" strokeLinecap="round" strokeDasharray="125.66" strokeDashoffset="90" />
                 </svg>
                <div className="absolute bottom-1 left-0 w-full text-center">
                  <h2 className={textValue}>142.5K ₺</h2>
                  <p className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Toplam Net Gelir</p>
                </div>
              </div>

              <div className="space-y-4 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-gray-400' : 'bg-[#2E2E3A]'}`}></div>
                    <div>
                      <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Pazaryeri (Standart)</p>
                      <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>%65 Hacim <span className="text-green-500 ml-1">+%1.8</span></p>
                    </div>
                  </div>
                  <span className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>92.625 ₺</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF007A]"></div>
                    <div>
                      <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Sesli Odalar (Canlı)</p>
                      <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>%25 Hacim <span className="text-green-500 ml-1">+%4.2</span></p>
                    </div>
                  </div>
                  <span className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>35.625 ₺</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                    <div>
                      <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Keşfet (Topluluk)</p>
                      <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>%10 Hacim <span className="text-red-500 ml-1">-%0.5</span></p>
                    </div>
                  </div>
                  <span className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>14.250 ₺</span>
                </div>
              </div>
            </div>

            {/* TAKE RATE HEALTH (2 Col) */}
            <div className={`lg:col-span-2 ${cardClass} p-6 flex flex-col`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className={textTitle}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    UNIT ECONOMICS (TAKE RATE SAĞLIĞI)
                  </h3>
                  <div className="flex items-center gap-3 mt-3">
                    <h2 className={textValue}>%12.4</h2>
                    <span className={badgeGreen}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                      0.4 Puan Artış
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button className={buttonClass}>
                    Tüm İşlemler <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button className={buttonClass}>
                    2026 <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1A1D1F] dark:bg-white"></div><span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gerçekleşen</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div><span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Hedeflenen</span></div>
                <div className="ml-auto text-[11px] font-bold text-gray-500 hidden sm:block">Aylık Hacim : <span className="font-black text-green-500">1.149.193 ₺</span></div>
              </div>

              <div className="flex-1 min-h-[200px] w-full relative mt-4">
                 {/* Chart Mock Lines */}
                 <div className={`absolute top-0 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400 font-medium`}>%15</span></div>
                 <div className={`absolute top-1/4 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400 font-medium`}>%12</span></div>
                 <div className={`absolute top-2/4 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400 font-medium`}>%9</span></div>
                 <div className={`absolute top-3/4 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400 font-medium`}>%6</span></div>

                 {/* Chart Mock Data */}
                 <svg className="absolute inset-0 w-full h-[80%] top-[10%] preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <polyline points="0,60 15,65 30,60 50,45 70,55 85,45 100,60" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
                   <polyline points="0,50 15,55 30,45 50,30 70,20 85,25 100,40" fill="none" stroke={isDark ? "#FFF" : "#1A1D1F"} strokeWidth="3" />
                   <circle cx="70" cy="20" r="3.5" fill={isDark ? "#FFF" : "#1A1D1F"} stroke={isDark ? "#121214" : "#FFF"} strokeWidth="2" />
                 </svg>
                 
                 {/* Chart Overlay Popup */}
                 <div className="absolute left-[60%] sm:left-[65%] top-[0%] bg-[#1A1D1F] text-white p-3 rounded-xl shadow-xl z-10 min-w-[140px]">
                   <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Mayıs 2026</p>
                   <div className="flex justify-between items-center mb-1 text-[12px]"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white"></div>Gerçekleşen</span> <span className="font-black">%12.4</span></div>
                   <div className="flex justify-between items-center text-[12px] text-gray-400"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>Hedef</span> <span className="font-black">%11.0</span></div>
                 </div>

                 {/* X Axis */}
                 <div className={`absolute bottom-0 w-full flex justify-between px-6 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                   <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span className="text-primary">May</span><span>Haz</span><span>Tem</span>
                 </div>
              </div>
            </div>
          </div>

          {/* ROW 3: LISTS & STRATEGY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CHURN ALERTS / RECENT ACTIVITY */}
            <div className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  SATICI ALARMLARI
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[14px]">⚠️</span>
                  </div>
                  <div>
                    <h4 className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Pro Satıcı "Baby Moda" pasif</h4>
                    <p className={`text-[10px] font-medium mt-1 leading-snug ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Aylık 40k hacmi olan satıcı 7 gündür ürün yüklemedi. İletişime geçilmeli.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[14px]">👩‍👧</span>
                  </div>
                  <div>
                    <h4 className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Anne satıcı döngüsü tamamlandı</h4>
                    <p className={`text-[10px] font-medium mt-1 leading-snug ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>"Ayşe K." 2 ürününü sattı ve platformdan ayrıldı. (Normal döngü, churn değil)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[14px]">🎙️</span>
                  </div>
                  <div>
                    <h4 className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Yeni Sesli Oda Rekoru</h4>
                    <p className={`text-[10px] font-medium mt-1 leading-snug ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Dünkü odada %18 dönüşüm yakalandı. Sunucu "Zeynep" öne çıkarılabilir.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEIGHBORHOOD CLUSTERS */}
            <div className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  AKTİF BÖLGELER (KEŞFET)
                </h3>
                <div className="flex gap-2 ml-auto">
                  <button className={buttonClass}>Tümü</button>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-around pb-6 pt-4 relative min-h-[150px]">
                 {/* Chart Y Axis Mock */}
                 <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold uppercase pb-6">
                    <span>1K+</span><span>750</span><span>500</span><span>250</span><span>0</span>
                 </div>
                 
                 {/* Bars */}
                 <div className="w-[28%] h-full flex flex-col justify-end items-center relative z-10 group">
                    <div className={`w-full h-[90%] ${isDark ? 'bg-white' : 'bg-[#1A1D1F]'} rounded-t-lg flex items-end justify-center pb-2 transition-all group-hover:opacity-90`}>
                       <span className={`text-[10px] font-black ${isDark ? 'text-black' : 'text-white'}`}>1.2K</span>
                    </div>
                    <span className={`text-[11px] mt-3 font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kadıköy</span>
                 </div>
                 <div className="w-[28%] h-full flex flex-col justify-end items-center relative z-10 group">
                    <div className={`w-full h-[65%] ${isDark ? 'bg-white/40' : 'bg-gray-300'} rounded-t-lg flex items-end justify-center pb-2 transition-all group-hover:opacity-90`}>
                       <span className="text-[10px] font-black text-gray-600 dark:text-white">850</span>
                    </div>
                    <span className={`text-[11px] mt-3 font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Beşiktaş</span>
                 </div>
                 <div className="w-[28%] h-full flex flex-col justify-end items-center relative z-10 group">
                    <div className={`w-full h-[45%] ${isDark ? 'bg-white/20' : 'bg-gray-200'} rounded-t-lg flex items-end justify-center pb-2 transition-all group-hover:opacity-90`}>
                       <span className="text-[10px] font-black text-gray-500 dark:text-gray-300">420</span>
                    </div>
                    <span className={`text-[11px] mt-3 font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Şişli</span>
                 </div>
              </div>
            </div>

            {/* STRATEGIC CALENDAR */}
            <div className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                  KARAR TAKVİMİ
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Haftalık Aksiyon (Operasyonel)</h4>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-[12px] font-medium leading-snug ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Kargo gecikme oranları PTT'de %15'i aştı. Ayşe ile görüşüp alternatif rota belirlenmeli.</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Aylık Aksiyon (Stratejik)</h4>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-[12px] font-medium leading-snug ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Take rate %12.4'te stabil. Sesli oda komisyonlarını %1 oranında artırıp testi yapılabilir.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
        // ==========================================
        // PARTNER L0 DASHBOARD (AYŞE)
        // Focus: Task Queue + Pending Actions
        // ==========================================
        <>
          {/* ROW 1: STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. PENDING E-FATURA */}
            <div className={`${cardClass} p-5 border-l-4 border-l-orange-500`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  BEKLEYEN E-FATURA
                </h3>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>142</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Adet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeRed}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Yasal Risk
                </span>
                <span className={`text-[11px] font-medium text-red-500`}>Acil Onay Bekliyor</span>
              </div>
            </div>

            {/* 2. CARGO DELAYS */}
            <div className={`${cardClass} p-5 border-l-4 border-l-red-500`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  KARGO GECİKMELERİ
                </h3>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>84</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Paket</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeRed}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
                  %5 Artış
                </span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Özellikle PTT kaynaklı</span>
              </div>
            </div>

            {/* 3. WHATSAPP ESCALATIONS */}
            <div className={`${cardClass} p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  WP DESTEK TALEBİ
                </h3>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>12</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bilet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  -2
                </span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>vs geçen hafta</span>
              </div>
            </div>

            {/* 4. PENDING PAYOUTS */}
            <div className={`${cardClass} p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  SATICI ÖDEMELERİ
                </h3>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>340</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>İşlem</span>
              </div>
              <div className="flex items-center gap-2">
                <button className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#1A1D1F] text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity`}>
                  Toplu Onayla
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: TASK QUEUE & IMPACT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* DISPUTE QUEUE */}
            <div className={`${cardClass} p-6 flex flex-col`}>
               <div className="flex items-center mb-6">
                 <h3 className={textTitle}>
                   <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   AKTİF UYUŞMAZLIKLAR (DISPUTE)
                 </h3>
               </div>
               
               <div className="space-y-3">
                 {[
                   { id: '#ORD-994', reason: 'Ürün Açıklamadan Farklı', user: 'Zeynep Y.', status: 'Alıcı Bekleniyor', time: '2 saat önce' },
                   { id: '#ORD-812', reason: 'Kargo Hasarlı Ulaştı', user: 'Büşra K.', status: 'Kanıt İstendi', time: '5 saat önce' },
                   { id: '#ORD-733', reason: 'Eksik Parça (Bebek Arabası)', user: 'Merve T.', status: 'Satıcı İtirazı', time: '1 gün önce' },
                 ].map((item, i) => (
                   <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors cursor-pointer`}>
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>{item.id}</span>
                         <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{item.reason}</span>
                       </div>
                       <p className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.user} • <span className="text-orange-500">{item.status}</span></p>
                     </div>
                     <div className="text-right">
                       <span className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.time}</span>
                       <button className="block mt-1 text-[11px] font-bold text-primary hover:underline">İncele →</button>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-white/20 text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                 Tüm Uyuşmazlıkları Gör (14)
               </button>
            </div>

            {/* CARGO IMPACT */}
            <div className={`${cardClass} p-6 flex flex-col`}>
               <div className="flex items-center mb-6">
                 <h3 className={textTitle}>
                   <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                   GECİKMENİN TEKRAR SATIŞA ETKİSİ
                 </h3>
               </div>
               
               <p className={`text-[12px] font-medium leading-snug mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                 3 günden fazla geciken kargolarda, alıcının platformdan tekrar alışveriş yapma oranı <strong className="text-red-500">%42 düşüyor.</strong>
               </p>

               <div className="flex-1 flex items-end justify-around pb-6 pt-4 relative min-h-[150px]">
                 <div className="w-[30%] h-full flex flex-col justify-end items-center relative z-10 group">
                    <div className={`w-full h-[90%] bg-green-500/20 rounded-t-lg flex items-end justify-center pb-2 border-t-2 border-green-500`}>
                       <span className="text-[10px] font-black text-green-500">%68</span>
                    </div>
                    <span className={`text-[10px] mt-3 font-bold text-center leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1-2 Gün<br/>(Normal)</span>
                 </div>
                 <div className="w-[30%] h-full flex flex-col justify-end items-center relative z-10 group">
                    <div className={`w-full h-[60%] bg-orange-500/20 rounded-t-lg flex items-end justify-center pb-2 border-t-2 border-orange-500`}>
                       <span className="text-[10px] font-black text-orange-500">%45</span>
                    </div>
                    <span className={`text-[10px] mt-3 font-bold text-center leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>3-4 Gün<br/>(Riskli)</span>
                 </div>
                 <div className="w-[30%] h-full flex flex-col justify-end items-center relative z-10 group">
                    <div className={`w-full h-[30%] bg-red-500/20 rounded-t-lg flex items-end justify-center pb-2 border-t-2 border-red-500`}>
                       <span className="text-[10px] font-black text-red-500">%26</span>
                    </div>
                    <span className={`text-[10px] mt-3 font-bold text-center leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>5+ Gün<br/>(Kritik)</span>
                 </div>
              </div>
            </div>

          </div>

        </>
      )}
    </div>
  );
}
