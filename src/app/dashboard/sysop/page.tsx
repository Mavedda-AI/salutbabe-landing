"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";

export default function SysopDashboard() {
  const { theme } = useThemeLanguage();
  const [userRole, setUserRole] = useState<'founder' | 'partner'>('founder');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        const types = u?.userType || [];
        setUserRole((Array.isArray(types) ? types : [types]).some((t: string) => t === 'FOUNDER' || t === 'SYSOP') ? 'founder' : 'partner');
      }
    } catch {}
  }, []);

  const isDark = theme === 'dark';
  const cardClass = `rounded-[1.2rem] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-200 shadow-sm'}`;
  const textTitle = `text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const textValue = `text-[26px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`;
  const textValueSm = `text-[20px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`;
  const iconRight = `w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`;
  const buttonClass = `px-3 py-1.5 rounded-lg border text-[12px] font-bold flex items-center gap-2 transition-all active:scale-95 ${isDark ? 'bg-[#1A1D1F] border-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`;
  const iconButtonClass = `p-1.5 rounded-lg border transition-all active:scale-95 ${isDark ? 'bg-[#1A1D1F] border-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`;
  const labelClass = `text-[12px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const valueSmClass = `text-[14px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`;
  const dividerClass = `h-px w-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`;
  const sectionTitle = `text-[13px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`;

  // --- Funnel Data ---
  const funnelSteps = [
    { label: 'Ürün Görüntüleme', value: 48520, pct: 100, color: isDark ? 'bg-blue-500' : 'bg-blue-500' },
    { label: 'Sepete Ekleme', value: 8733, pct: 18, color: isDark ? 'bg-indigo-500' : 'bg-indigo-500' },
    { label: 'Ödeme Sayfası', value: 4366, pct: 9, color: isDark ? 'bg-purple-500' : 'bg-purple-500' },
    { label: 'Satın Alma', value: 2183, pct: 4.5, color: isDark ? 'bg-green-500' : 'bg-green-500' },
  ];

  // --- Risk Data ---
  const riskItems = [
    { label: 'Şüpheli İşlem', value: 12, level: 'high' as const, icon: '🚨' },
    { label: 'Çoklu Hesap (Aynı Cihaz)', value: 7, level: 'medium' as const, icon: '📱' },
    { label: 'Yeni Satıcı Artışı', value: 23, level: 'low' as const, icon: '📈' },
    { label: 'Geç Kargo Oranı', value: '8.2%', level: 'high' as const, icon: '🚚' },
    { label: 'İptal Oranı', value: '3.1%', level: 'medium' as const, icon: '❌' },
    { label: 'İade Oranı', value: '5.7%', level: 'medium' as const, icon: '🔄' },
  ];

  // --- Seller Data ---
  const topSellers = [
    { name: 'Ayşe Moda', revenue: '45.200 ₺', products: 128, trend: '+12%' },
    { name: 'Bebek Dünyası', revenue: '38.750 ₺', products: 95, trend: '+8%' },
    { name: 'Mini Stil', revenue: '32.100 ₺', products: 76, trend: '+15%' },
    { name: 'Çocuk Köşesi', revenue: '28.900 ₺', products: 64, trend: '-3%' },
    { name: 'Küçük Adımlar', revenue: '24.600 ₺', products: 51, trend: '+6%' },
  ];

  // --- Smart Insights ---
  const insights = [
    { priority: 'high' as const, title: 'Sepet → Ödeme dönüşümü düşük', desc: 'Son 7 günde %50 drop-off — ödeme UX iyileştirmesi önerilir.', action: 'Analiz Et' },
    { priority: 'high' as const, title: '\"Bebek Araba\" aramasında sonuç yok', desc: '342 arama / 0 sonuç — tedarik fırsatı.', action: 'Kategori Aç' },
    { priority: 'medium' as const, title: 'En iyi satıcı 7 gündür inaktif', desc: '\"Ayşe Moda\" son 7 gündür ürün yüklemedi.', action: 'İletişime Geç' },
    { priority: 'low' as const, title: '30 günlük retention %18\'e düştü', desc: 'Push notification stratejisi güncellenmeli.', action: 'Plan Oluştur' },
  ];

  const priorityConfig = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', label: 'YÜKSEK' },
    medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-600', label: 'ORTA' },
    low: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', label: 'DÜŞÜK' },
  };

  const riskLevelConfig = {
    high: { bg: isDark ? 'bg-red-500/10' : 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
    medium: { bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50', text: 'text-yellow-600', dot: 'bg-yellow-500' },
    low: { bg: isDark ? 'bg-green-500/10' : 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' },
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      
      {/* --- ROW 1: STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. TOTAL SALES */}
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              TOPLAM SATIŞ
            </h3>
            <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className={textValue}>1.256.940 ₺</h2>
            <span className="text-[13px] font-bold text-green-500">+456 ₺</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-green-50 text-green-600 dark:bg-green-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              %12
            </span>
            <span className={`text-[12px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>geçen aya göre</span>
          </div>
        </div>

        {/* 2. TOTAL ORDER */}
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              TOPLAM SİPARİŞ
            </h3>
            <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className={textValue}>6.432</h2>
            <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sipariş</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-red-50 text-red-500 dark:bg-red-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
              %1.8
            </span>
            <span className={`text-[12px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Ürün satışı</span>
          </div>
        </div>

        {/* 3. TOTAL CUSTOMER */}
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              TOPLAM MÜŞTERİ
            </h3>
            <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className={textValue}>173.247</h2>
            <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kişi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-green-50 text-green-600 dark:bg-green-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              %1.8
            </span>
            <span className={`text-[12px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Yeni müşteri</span>
          </div>
        </div>

        {/* 4. INTERACTION */}
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              ETKİLEŞİM
            </h3>
            <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className={textValue}>3.247</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-red-50 text-red-500 dark:bg-red-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>
              %2.8
            </span>
            <span className={`text-[12px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>geçen aya göre</span>
          </div>
        </div>

      </div>

      {/* --- ROW 2: CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHANNEL PERFORMANCE (1 Col) */}
        <div className={`${cardClass} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              KANAL PERFORMANSI
            </h3>
            <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
          </div>
          
          {/* Half Donut Mock SVG */}
          <div className="relative w-full flex justify-center items-end mb-8 mt-4">
             <svg viewBox="0 0 100 60" className="w-[85%] max-w-[250px] h-auto overflow-visible">
               <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={isDark ? '#1F2937' : '#E5E7EB'} strokeWidth="12" strokeLinecap="round" />
               <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={isDark ? '#4B5563' : '#2E2E3A'} strokeWidth="12" strokeLinecap="round" strokeDasharray="125.66" strokeDashoffset="45" />
             </svg>
            <div className="absolute bottom-1 left-0 w-full text-center">
              <h2 className={textValue}>16.432</h2>
              <p className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ürün Satışı</p>
            </div>
          </div>

          <div className="space-y-4 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-[#2E2E3A]'}`}></div>
                <div>
                  <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Web Sitesi</p>
                  <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>5.762 Ürün Satıldı <span className="text-green-500 ml-1">+%1.8</span></p>
                </div>
              </div>
              <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>1.378.975 ₺</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div>
                  <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Pazaryeri</p>
                  <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>6.843 Ürün Satıldı <span className="text-red-500 ml-1">-%2.8</span></p>
                </div>
              </div>
              <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>778.975 ₺</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <div>
                  <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Mağaza</p>
                  <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>2.123 Ürün Satıldı <span className="text-red-500 ml-1">-%2.8</span></p>
                </div>
              </div>
              <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>778.975 ₺</span>
            </div>
          </div>
        </div>

        {/* AVERAGE SALES (2 Col) */}
        <div className={`lg:col-span-2 ${cardClass} p-6 flex flex-col`}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <h3 className={textTitle}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                ORTALAMA SATIŞ
              </h3>
              <div className="flex items-center gap-3 mt-3">
                <h2 className={textValue}>1.389.652 ₺</h2>
                <span className="flex items-center gap-1 bg-green-50 text-green-600 dark:bg-green-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                  %1.8
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button className={buttonClass}>
                Tüm Ürünler <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button className={buttonClass}>
                Tüm Kategoriler <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button className={buttonClass}>
                2025 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button className={iconButtonClass}>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className={`text-[12px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gelir</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div><span className={`text-[12px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Hedef</span></div>
            <div className="ml-auto text-[12px] font-medium text-gray-500 hidden sm:block">Net Satış : <span className="font-bold text-green-500">800.67 ₺ <svg className="w-3 h-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></span></div>
          </div>

          <div className="flex-1 min-h-[200px] w-full relative mt-4">
             {/* Chart Mock Lines */}
             <div className={`absolute top-0 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400`}>25k ₺</span></div>
             <div className={`absolute top-1/4 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400`}>20k ₺</span></div>
             <div className={`absolute top-2/4 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400`}>15k ₺</span></div>
             <div className={`absolute top-3/4 w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}><span className={`-mt-2.5 bg-${isDark ? '[#121214]' : 'white'} pr-2 text-[10px] text-gray-400`}>10k ₺</span></div>

             {/* Chart Mock Data */}
             <svg className="absolute inset-0 w-full h-[80%] top-[10%] preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
               <polyline points="0,60 15,80 30,70 50,20 70,60 85,30 100,75" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
               <polyline points="0,50 15,65 30,55 50,40 70,25 85,45 100,80" fill="none" stroke="#3B82F6" strokeWidth="3" />
               <circle cx="70" cy="25" r="3" fill="#3B82F6" stroke="#fff" strokeWidth="1.5" />
             </svg>
             
             {/* Chart Overlay Popup */}
             <div className="absolute left-[60%] sm:left-[65%] top-[10%] bg-[#1A1D1F] text-white p-3 rounded-lg text-[11px] shadow-xl z-10 w-32">
               <p className="font-bold mb-2">Mart 2025</p>
               <div className="flex justify-between items-center mb-1"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>Hedef</span> <span className="font-bold">22.000 ₺</span></div>
               <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>Gelir</span> <span className="font-bold">20.000 ₺</span></div>
             </div>

             {/* X Axis */}
             <div className={`absolute bottom-0 w-full flex justify-between px-6 text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
               <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- ROW 3: LISTS & SMALL CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT ACTIVITY */}
        <div className={`${cardClass} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              SON HAREKETLER
            </h3>
            <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className={`text-[13px] font-bold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Giden Ürünler</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-xl">🧥</div>
                  <div>
                    <h4 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Kırmızı Ceket</h4>
                    <p className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Adet : 2 <span className="text-red-500 ml-2">5 dakika önce</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>1.500 ₺</span>
                </div>
              </div>
            </div>

            <div className={`h-px w-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}></div>

            <div>
              <p className={`text-[13px] font-bold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gelen Ürünler</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">🧥</div>
                  <div>
                    <h4 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Siyah Ceket</h4>
                    <p className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Adet : 1 <span className="text-gray-400 ml-2">10 dakika önce</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>800 ₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP 3 PRODUCT */}
        <div className={`${cardClass} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              EN İYİ 3 ÜRÜN
            </h3>
            <div className="flex gap-2">
              <button className={buttonClass}>
                Günlük <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
             <span className={`text-[12px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bugünkü Toplam Satış :</span>
             <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>318 adet <svg className="w-3 h-3 text-green-500 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></span>
          </div>

          <div className="flex-1 flex items-end justify-around pb-6 pt-4 relative min-h-[150px]">
             {/* Chart Y Axis Mock */}
             <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-medium pb-6">
                <span>200</span><span>160</span><span>120</span><span>80</span><span>40</span><span>0</span>
             </div>
             
             {/* Bars */}
             <div className="w-[28%] h-full flex flex-col justify-end items-center relative z-10 group">
                <div className={`w-full h-[90%] ${isDark ? 'bg-gray-600' : 'bg-[#2E2E3A]'} rounded-t-sm flex items-end justify-center pb-2 transition-all group-hover:opacity-90`}>
                   <span className="text-white text-[11px] font-bold">180</span>
                </div>
                <span className={`text-[11px] mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ayakkabı</span>
             </div>
             <div className="w-[28%] h-full flex flex-col justify-end items-center relative z-10 group">
                <div className={`w-full h-[45%] ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded-t-sm flex items-end justify-center pb-2 transition-all group-hover:opacity-90`}>
                   <span className="text-gray-600 text-[11px] font-bold">87</span>
                </div>
                <span className={`text-[11px] mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ceket</span>
             </div>
             <div className="w-[28%] h-full flex flex-col justify-end items-center relative z-10 group">
                <div className={`w-full h-[30%] ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-t-sm flex items-end justify-center pb-2 transition-all group-hover:opacity-90`}>
                   <span className="text-gray-500 text-[11px] font-bold">56</span>
                </div>
                <span className={`text-[11px] mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>T-şört</span>
             </div>
          </div>
        </div>

        {/* TOTAL VISITOR */}
        <div className={`${cardClass} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={textTitle}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              TOPLAM ZİYARETÇİ
            </h3>
            <div className="flex gap-2">
              <button className={buttonClass}>
                Günlük <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <h2 className={textValue}>3.247</h2>
            <span className="flex items-center gap-1 bg-green-50 text-green-600 dark:bg-green-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              %1.8
            </span>
            <span className={`text-[12px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Ziyaretçi</span>
          </div>

          <div className="space-y-2 mb-6">
             <div className="flex justify-between items-center text-[12px]">
               <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pazaryeri :</span>
               <span className={`font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>300 kişi <div className="w-2 h-2 rounded-full bg-green-500 inline-block ml-1"></div></span>
             </div>
             <div className="flex justify-between items-center text-[12px]">
               <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Web Sitesi :</span>
               <span className={`font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>250 kişi <div className="w-2 h-2 rounded-full bg-green-500 inline-block ml-1"></div></span>
             </div>
             <div className="flex justify-between items-center text-[12px]">
               <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mağaza :</span>
               <span className={`font-bold ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>400 kişi <div className="w-2 h-2 rounded-full bg-green-500 inline-block ml-1"></div></span>
             </div>
          </div>

          {/* Heatmap Mock */}
          <div className="mt-auto">
             <div className="flex justify-end gap-2 mb-1 text-[10px] text-gray-400 font-medium w-full pr-2">
                <span className="w-4 text-center">Pzt</span><span className="w-4 text-center">Sal</span><span className="w-4 text-center">Çar</span><span className="w-4 text-center">Per</span><span className="w-4 text-center">Cum</span>
             </div>
             <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium mb-1">
                <span>09.00 - 12.00</span>
                <div className="flex gap-1.5">
                   <div className="w-4 h-4 rounded bg-gray-200"></div><div className="w-4 h-4 rounded bg-[#2E2E3A]"></div><div className="w-4 h-4 rounded bg-gray-200"></div><div className="w-4 h-4 rounded bg-gray-300"></div><div className="w-4 h-4 rounded bg-gray-200"></div>
                </div>
             </div>
             <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium mb-1">
                <span>12.00 - 15.00</span>
                <div className="flex gap-1.5">
                   <div className="w-4 h-4 rounded bg-[#2E2E3A]"></div><div className="w-4 h-4 rounded bg-gray-100"></div><div className="w-4 h-4 rounded bg-gray-300"></div><div className="w-4 h-4 rounded bg-[#2E2E3A]"></div><div className="w-4 h-4 rounded bg-gray-100"></div>
                </div>
             </div>
             <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                <span>15.00 - 18.00</span>
                <div className="flex gap-1.5">
                   <div className="w-4 h-4 rounded bg-gray-100"></div><div className="w-4 h-4 rounded bg-[#2E2E3A]"></div><div className="w-4 h-4 rounded bg-gray-100"></div><div className="w-4 h-4 rounded bg-[#2E2E3A]"></div><div className="w-4 h-4 rounded bg-gray-200"></div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}


