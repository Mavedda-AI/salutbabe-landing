"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function CategoryManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Kategori & Taksonomi Yönetimi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pazaryerindeki ana ve alt kategorileri düzenleyin.</p>
         </div>
         <button className={`px-4 py-2 rounded-xl text-[12px] font-bold border ${isDark ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
            + Yeni Kategori
         </button>
      </div>

      <div className={`${cardClass} p-8 text-center text-gray-500`}>
         {loading ? 'Yükleniyor...' : 'Tüm kategoriler ağaç (tree) yapısında listelenecektir.'}
      </div>
    </div>
  );
}
