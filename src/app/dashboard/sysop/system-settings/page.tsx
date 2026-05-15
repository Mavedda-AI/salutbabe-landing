"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function SystemSettingsPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Sistem & Komisyon Ayarları</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Genel platform komisyon oranlarını ve kargo limitlerini güncelleyin.</p>
         </div>
         <button className={`px-4 py-2 rounded-xl text-[12px] font-bold border ${isDark ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100'}`}>
            Değişiklikleri Kaydet
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardClass} p-6`}>
           <h3 className={`text-[12px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Standart Komisyon (Take-rate)</h3>
           <input type="text" defaultValue="% 12" className={`w-full p-3 rounded-lg border ${isDark ? 'bg-[#1A1D1F] border-white/10 text-white' : 'bg-gray-50 border-gray-200'} outline-none`} />
        </div>
        <div className={`${cardClass} p-6`}>
           <h3 className={`text-[12px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Canlı Oda Ekstra Komisyon</h3>
           <input type="text" defaultValue="% 2" className={`w-full p-3 rounded-lg border ${isDark ? 'bg-[#1A1D1F] border-white/10 text-white' : 'bg-gray-50 border-gray-200'} outline-none`} />
        </div>
      </div>
    </div>
  );
}
