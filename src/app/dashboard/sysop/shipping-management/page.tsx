"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

interface CargoShipment {
  id: string;
  orderID: string;
  provider: 'PTT' | 'Yurtiçi' | 'MNG' | 'Aras';
  trackingNumber: string;
  status: 'Yolda' | 'Teslim Edildi' | 'Gecikmede' | 'İade';
  delayDays?: number;
  buyerName: string;
}

export default function ShippingManagementPage() {
  const { theme } = useThemeLanguage();
  const [shipments, setShipments] = useState<CargoShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'delayed' | 'in_transit' | 'returns'>('all');

  const isDark = theme === 'dark';

  useEffect(() => {
    // MOCK DATA for shipping/cargo delays
    setTimeout(() => {
      setShipments([
        { id: "SHP-1", orderID: "ORD-94A1", provider: "PTT", trackingNumber: "KP0299491823", status: "Gecikmede", delayDays: 4, buyerName: "Büşra Kaya" },
        { id: "SHP-2", orderID: "ORD-82B3", provider: "Yurtiçi", trackingNumber: "10928374921", status: "Yolda", buyerName: "Ahmet Yılmaz" },
        { id: "SHP-3", orderID: "ORD-71C5", provider: "MNG", trackingNumber: "MX992831", status: "Gecikmede", delayDays: 2, buyerName: "Cansu Demir" },
        { id: "SHP-4", orderID: "ORD-60D7", provider: "PTT", trackingNumber: "KP0299491899", status: "İade", buyerName: "Merve Çelik" },
        { id: "SHP-5", orderID: "ORD-55E8", provider: "Aras", trackingNumber: "AR88239102", status: "Teslim Edildi", buyerName: "Canan Öz" },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  const filteredShipments = shipments.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'delayed') return s.status === 'Gecikmede';
    if (activeTab === 'in_transit') return s.status === 'Yolda';
    if (activeTab === 'returns') return s.status === 'İade';
    return true;
  });

  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>
              Kargo & Lojistik Merkezi
           </h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Teslimat sürelerini ve gecikmeleri (özellikle PTT) anlık takip edin.</p>
         </div>

         <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-orange-50 border-orange-100'}`}>
               <span className="text-xl">⚠️</span>
               <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-orange-600/70'}`}>Kritik Gecikme</p>
                  <p className={`text-[16px] font-black ${isDark ? 'text-white' : 'text-orange-700'}`}>84 Paket</p>
               </div>
            </div>
         </div>
      </div>

      {/* Action Bar (Search & Tabs) */}
      <div className={`${cardClass} p-2 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full overflow-hidden`}>
         <div className="flex items-center gap-1 overflow-x-auto w-full no-scrollbar px-2 pb-1 flex-1 min-w-0">
            {[
              { id: 'all', label: 'Tüm Kargolar' },
              { id: 'delayed', label: '⚠️ Gecikenler' },
              { id: 'in_transit', label: '🚚 Yolda Olanlar' },
              { id: 'returns', label: '🔄 İadeler' }
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
      </div>

      {/* Table Section */}
      <div className={`${cardClass}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Takip Kodu / Firma</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sipariş / Alıcı</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Durum</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Müdahale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr>
              ) : filteredShipments.length === 0 ? (
                <tr><td colSpan={4} className="p-12 text-center text-gray-500">Sonuç bulunamadı.</td></tr>
              ) : filteredShipments.map((ship) => (
                <tr key={ship.id} className={`transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'} ${ship.status === 'Gecikmede' ? (isDark ? 'bg-orange-500/5' : 'bg-orange-50/30') : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {ship.trackingNumber}
                      </span>
                      <span className={`text-[11px] font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {ship.provider}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{ship.orderID}</span>
                      <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{ship.buyerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {ship.status === 'Gecikmede' ? (
                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                         ⚠️ Gecikme ({ship.delayDays} Gün)
                       </span>
                     ) : (
                       <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${isDark ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                         {ship.status}
                       </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     {ship.status === 'Gecikmede' ? (
                      <button className={`h-8 px-4 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all border ${isDark ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-500 text-white border-orange-600'}`}>
                        Firmayı Dürt
                      </button>
                    ) : (
                      <button className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                         Detay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
