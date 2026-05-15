"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function PayoutManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-[1400px] mx-auto pb-12 overflow-x-hidden md:overflow-visible px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Finans & Hak Ediş (Payout)</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Satıcı komisyonları ve havuzdaki bekleyen ödemeleri yönetin.</p>
         </div>
         <div className="flex gap-4">
           <button onClick={() => setShowApproveModal(true)} className={`px-5 py-2.5 rounded-[12px] text-[12px] font-bold border transition-colors ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-[#F2FDF5] text-[#00C48C] border-[#Bbf7D0] hover:bg-green-50'}`}>
              + Toplu Hak Ediş Onayla
           </button>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6">
        {[{t:'HAVUZDAKİ TOPLAM BAKİYE', v:'1.450.000 ₺', c:'text-[#0066FF]'}, {t:'BU HAFTA ONAYLANAN', v:'345.000 ₺', c:'text-[#00C48C]'}, {t:'ACİL BEKLEYEN ONAY', v:'84 Adet', c:'text-[#FF6B00]'}].map((s, i) => (
          <div key={i} className={`${cardClass} p-4 md:p-6 ${i === 0 ? 'col-span-2 md:col-span-1' : 'col-span-1'}`}>
            <p className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider mb-2 md:mb-3 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{s.t}</p>
            <h2 className={`text-[22px] md:text-[32px] font-black tracking-tight ${s.c}`}>{s.v}</h2>
          </div>
        ))}
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Mağaza</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tutar</th>
                <th className="hidden md:table-cell px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sipariş Sayısı</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? <tr><td colSpan={4} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr> : (
                [1,2,3].map(i => (
                  <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                    <td className="px-4 md:px-6 py-4 md:py-5"><span className={`text-[12px] md:text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Mağaza {i}</span></td>
                    <td className="px-4 md:px-6 py-4 md:py-5"><span className={`text-[12px] md:text-[14px] font-black ${isDark ? 'text-green-400' : 'text-[#00C48C]'}`}>{(14500 * i).toLocaleString()} ₺</span></td>
                    <td className="hidden md:table-cell px-6 py-5">
                      <div className="flex flex-col">
                        <span className={`text-[13px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{i * 4}</span>
                        <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Teslimat</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                      <button onClick={(e) => { e.stopPropagation(); alert(`Mağaza ${i} hak ediş detayları açılıyor...`); }} className={`px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-[10px] md:text-[12px] font-bold uppercase tracking-wider border-2 transition-colors ${isDark ? 'bg-[#1A1D1F] border-blue-500 text-white hover:bg-blue-500/10' : 'bg-[#F3F4F6] border-[#0066FF] text-[#111827] hover:bg-gray-200'}`}>
                        Detay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mock Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl text-center relative ${isDark ? 'bg-[#1A1D1F] border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Toplu Onay İşlemi</h3>
            <p className={`text-[13px] mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Havuzda bekleyen <strong>84 adet</strong> acil hak ediş talebini onaylamak ve tutarları satıcı cüzdanlarına aktarmak istediğinize emin misiniz?</p>
            
            <div className="flex gap-3">
              <button onClick={() => setShowApproveModal(false)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>İptal</button>
              <button onClick={() => { alert('Hak edişler başarıyla onaylandı ve cüzdanlara aktarıldı.'); setShowApproveModal(false); }} className="flex-1 py-3 rounded-xl bg-[#00C48C] hover:bg-[#00A676] text-white font-bold transition-colors">Evet, Onayla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
