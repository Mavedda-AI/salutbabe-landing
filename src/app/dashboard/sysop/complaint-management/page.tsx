"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function ComplaintManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>İhbar ve Şikayet Merkezi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sahte ürün ihbarları ve kullanıcı şikayetlerini inceleyin.</p>
         </div>
      </div>

      <div className={`${cardClass} overflow-x-auto`}>
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">İhbar Eden</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Konu / İlan</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? <tr><td colSpan={3} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr> : (
              [1,2].map(i => (
                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-4"><span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Müşteri {i}</span></td>
                  <td className="px-6 py-4"><span className={`text-[12px] text-red-500 font-bold`}>Sahte Ürün Şüphesi (Replika)</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-[#1A1D1F] border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-800'}`}>İncele</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
