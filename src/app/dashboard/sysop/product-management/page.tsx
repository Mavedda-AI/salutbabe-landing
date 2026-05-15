"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function ProductManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState<string | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  // Mock Products
  const products = [
    { id: "PRD-101", name: "Organik Pamuk Zıbın Seti", store: "Ayşe'nin Dolabı", price: "245₺", status: "Yayında", stock: 12, date: "15.05.2026" },
    { id: "PRD-102", name: "Bebek Arabası Puset", store: "Baby Moda", price: "4,500₺", status: "Onay Bekliyor", stock: 2, date: "14.05.2026" },
    { id: "PRD-103", name: "Ahşap Eğitici Oyuncak", store: "Mini Adımlar", price: "320₺", status: "Yayında", stock: 45, date: "12.05.2026" },
    { id: "PRD-104", name: "Sahte Marka (Replika) Tulum", store: "Şüpheli Satıcı", price: "100₺", status: "Reddedildi", stock: 0, date: "10.05.2026" },
    { id: "PRD-105", name: "Yenidoğan Hastane Çıkışı", store: "Şirin Kids", price: "850₺", status: "Yayında", stock: 8, date: "08.05.2026" },
  ];

  const filteredProducts = products.filter(p => {
    if (activeTab === 'active' && p.status !== 'Yayında') return false;
    if (activeTab === 'pending' && p.status !== 'Onay Bekliyor') return false;
    if (activeTab === 'rejected' && p.status !== 'Reddedildi') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Ürün Kataloğu Yönetimi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Platformdaki tüm ilanları denetleyin, onaylayın veya yayından kaldırın.</p>
         </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: "Toplam Ürün", value: "24,892", icon: "📦", color: isDark ? "text-blue-400" : "text-blue-600" },
          { title: "Onay Bekleyen", value: "156", icon: "⏳", color: isDark ? "text-orange-400" : "text-orange-600" },
          { title: "Bu Ay Eklenen", value: "+3,240", icon: "📈", color: isDark ? "text-green-400" : "text-green-600" },
          { title: "Reddedilen", value: "84", icon: "🛑", color: isDark ? "text-red-400" : "text-red-600" }
        ].map((stat, idx) => (
          <div key={idx} className={`${cardClass} p-6 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</span>
              <span className="text-2xl opacity-80">{stat.icon}</span>
            </div>
            <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Action Bar (Search & Tabs) */}
      <div className={`${cardClass} p-2 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full overflow-hidden`}>
         <div className="flex items-center gap-1 overflow-x-auto w-full no-scrollbar px-2 pb-1 flex-1 min-w-0">
            {[
              { id: 'all', label: 'Tüm İlanlar' },
              { id: 'active', label: '✅ Yayındakiler' },
              { id: 'pending', label: '⏳ Onay Bekleyenler' },
              { id: 'rejected', label: '🛑 Reddedilenler' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? (isDark ? 'bg-[#2E2E3A] text-white' : 'bg-gray-100 text-gray-900') 
                    : (isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}`}
              >
                {tab.label}
              </button>
            ))}
         </div>
         
         <div className="px-2 md:px-4 md:w-80 w-full shrink-0">
            <div className={`relative flex items-center w-full h-10 rounded-xl border transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10 focus-within:border-primary/50' : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 focus-within:bg-white'}`}>
               <svg className={`w-4 h-4 ml-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Ürün, Mağaza veya ID Ara..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-full bg-transparent border-none outline-none px-3 text-[12px] font-medium placeholder:text-gray-400 text-inherit"
               />
            </div>
         </div>
      </div>

      <div className={`${cardClass}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
            <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ürün Bilgisi</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Satıcı (Mağaza)</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Fiyat & Stok</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Durum</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Eklenme</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? <tr><td colSpan={6} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr> : 
             filteredProducts.length === 0 ? (
               <tr><td colSpan={6} className="p-12 text-center text-[13px] text-gray-500 font-medium">Bu kriterlere uygun ürün bulunamadı.</td></tr>
             ) : (
              filteredProducts.map(p => (
                <tr key={p.id} className={`transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name}</span>
                      <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{p.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{p.store}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-black text-primary`}>{p.price}</span>
                      <span className={`text-[10px] mt-0.5 ${p.stock > 5 ? (isDark ? 'text-gray-500' : 'text-gray-400') : 'text-red-500 font-bold'}`}>
                        {p.stock} Adet Kaldı
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border 
                      ${p.status === 'Yayında' ? (isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100') :
                        p.status === 'Onay Bekliyor' ? (isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-100') :
                        (isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100')
                      }
                    `}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{p.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setShowModal(p.id)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'}`}
                    >
                      İncele / Düzenle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={() => setShowModal(null)}>
          <div className={`w-full max-w-lg p-6 rounded-[24px] shadow-2xl border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`} onClick={e => e.stopPropagation()}>
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>İlan Aksiyonları</h3>
            <p className={`text-[13px] mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bu ilan için uygulayacağınız aksiyonu seçin.</p>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowModal(null)} className="w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                İlanı Onayla / Yayına Al
              </button>
              <button onClick={() => setShowModal(null)} className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-colors ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                İlanı Düzenle
              </button>
              <button onClick={() => setShowModal(null)} className="w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                İlanı Reddet / Kaldır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
