"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function PayoutManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Finans & Hak Ediş (Payout)</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Satıcı komisyonları ve havuzdaki bekleyen ödemeleri yönetin.</p>
         </div>
         <div className="flex gap-4">
           <button className={`px-4 py-2 rounded-xl text-[12px] font-bold border ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100'}`}>
              + Toplu Hak Ediş Onayla
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {[{t:'Havuzdaki Toplam Bakiye', v:'1.450.000 ₺', c:'text-blue-500'}, {t:'Bu Hafta Onaylanan', v:'345.000 ₺', c:'text-green-500'}, {t:'Acil Bekleyen Onay', v:'84 Adet', c:'text-orange-500'}].map((s, i) => (
          <div key={i} className={`${cardClass} p-5`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.t}</p>
            <h2 className={`text-2xl font-black ${s.c}`}>{s.v}</h2>
          </div>
        ))}
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Mağaza</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tutar (Komisyon Kesilmiş)</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sipariş Sayısı</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr> : (
              [1,2,3].map(i => (
                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-4"><span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Store {i}</span></td>
                  <td className="px-6 py-4"><span className="text-[13px] font-black text-primary">{(14500 * i).toLocaleString()} ₺</span></td>
                  <td className="px-6 py-4"><span className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{i * 4} Teslimat</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-[#1A1D1F] border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'}`}>
                       Onayla
                    </button>
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
