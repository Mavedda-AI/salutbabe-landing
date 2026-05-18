'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Alert02Icon, Cancel01Icon, Search01Icon, ShoppingBag01Icon, Tick01Icon} from '@hugeicons/core-free-icons';
import React, {useState} from "react";

export function ModerationView() {
  const [activeTab, setActiveTab] = useState<'pending' | 'flagged' | 'rejected'>('pending');

  const cardClass = `rounded-[16px] border bg-white border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-5`;
  const textTitle = `text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-gray-500`;

  // Placeholder mock data
  const pendingProducts = [
    { id: 'PRD-9921', name: 'Ev Yapımı Köy Salçası (1kg)', category: 'Organik & Doğal Gıda', seller: 'Ayşe Teyze', price: '₺250', date: '10 dk önce', risk: 'High' },
    { id: 'PRD-9922', name: 'Amigurumi Uyku Arkadaşı', category: 'El Emeği & Kişiye Özel', seller: 'Zeynep H.', price: '₺450', date: '25 dk önce', risk: 'Low' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-[20px] font-black text-[#111827]">İlan Onay & Moderasyon</h2>
          <p className="text-[12px] font-medium text-gray-500 mt-1">Özellikle organik gıda ve el emeği ürünleri için güvenlik kontrol merkezi.</p>
        </div>
        <div className="flex bg-white rounded-xl border border-gray-200 p-1">
           <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-[#111827] text-white' : 'text-gray-500 hover:text-gray-900'}`}>Onay Bekleyenler (24)</button>
           <button onClick={() => setActiveTab('flagged')} className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-colors ${activeTab === 'flagged' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-900'}`}>Şüpheli İlanlar (5)</button>
           <button onClick={() => setActiveTab('rejected')} className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-colors ${activeTab === 'rejected' ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-gray-900'}`}>Reddedilenler (12)</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={textTitle}>
            <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
            {activeTab === 'pending' ? 'ONAY BEKLEYEN İLANLAR' : activeTab === 'flagged' ? 'SİSTEM TARAFINDAN İŞARETLENENLER' : 'REDDEDİLEN İLANLAR'}
          </h3>
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="İlan ID veya Satıcı Ara..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-900 focus:outline-none focus:border-gray-400 w-[250px]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">İlan Bilgisi</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Kategori</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Satıcı</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Fiyat</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Risk / Not</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-[#111827]">{product.name}</span>
                      <span className="text-[10px] font-bold text-gray-400">{product.id} • {product.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{product.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] font-bold text-gray-700">{product.seller}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] font-black text-[#111827]">{product.price}</span>
                  </td>
                  <td className="py-3 px-4">
                    {product.risk === 'High' ? (
                      <span className="flex items-center gap-1 text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-max">
                        <HugeiconsIcon icon={Alert02Icon} size={12} /> Gıda / Sertifika Gerekli
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-max">
                        Standart Kontrol
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reddet">
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Onayla">
                        <HugeiconsIcon icon={Tick01Icon} size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty state or load more could go here */}
          <div className="mt-6 flex justify-center">
            <p className="text-[11px] font-bold text-gray-400">Bu alanın tasarımını tamamlamak size ait! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <ModerationView />;
}
