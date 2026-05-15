"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function LiveRoomManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>
             <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span> Canlı Odalar Moderasyonu
           </h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Aktif sesli odaları denetleyin ve moderasyon yetkilerinizi kullanın.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[{t:'Aktif Odalar', v:'12', c:'text-red-500'}, {t:'Anlık Dinleyici', v:'1,240', c:'text-blue-500'}, {t:'Şikayet Edilenler', v:'2', c:'text-orange-500'}, {t:'Tahmini Dönüşüm', v:'%4.2', c:'text-green-500'}].map((s, i) => (
          <div key={i} className={`${cardClass} p-5`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.t}</p>
            <h2 className={`text-2xl font-black ${s.c}`}>{s.v}</h2>
          </div>
        ))}
      </div>

      <div className={`${cardClass}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
            <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Oda & Sunucu</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Dinleyici / Süre</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Durum</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Moderasyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr> : (
              [1,2].map(i => (
                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bebek Arabası İncelemesi {i}</span>
                      <span className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Sunucu: Ayşe T.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-[13px] font-black text-primary">{i * 120} Dinleyici</span><br/><span className="text-[10px] text-gray-500">45dk</span></td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-[10px] font-black uppercase">Canlı</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}>
                       Odayı Kapat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
