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
           <button className={`px-5 py-2.5 rounded-[12px] text-[12px] font-bold border transition-colors ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-[#F2FDF5] text-[#00C48C] border-[#Bbf7D0] hover:bg-green-50'}`}>
              + Toplu Hak Ediş Onayla
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {[{t:'HAVUZDAKİ TOPLAM BAKİYE', v:'1.450.000 ₺', c:'text-[#0066FF]'}, {t:'BU HAFTA ONAYLANAN', v:'345.000 ₺', c:'text-[#00C48C]'}, {t:'ACİL BEKLEYEN ONAY', v:'84 Adet', c:'text-[#FF6B00]'}].map((s, i) => (
          <div key={i} className={`${cardClass} p-6`}>
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{s.t}</p>
            <h2 className={`text-[32px] font-black tracking-tight ${s.c}`}>{s.v}</h2>
          </div>
        ))}
      </div>

      <div className={`${cardClass} overflow-x-auto`}>
        <table className="w-full text-left border-collapse min-w-[800px]">
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
                  <td className="px-6 py-5"><span className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Store {i}</span></td>
                  <td className="px-6 py-5"><span className={`text-[14px] font-black ${isDark ? 'text-green-400' : 'text-[#00C48C]'}`}>{(14500 * i).toLocaleString()} ₺</span></td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{i * 4}</span>
                      <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Teslimat</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10 text-white hover:bg-white/10' : 'bg-[#F3F4F6] border-gray-200 text-[#374151] hover:bg-gray-200'}`}>
                       ONAYLA
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
