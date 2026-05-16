'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BrandManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'blocked'>('all');

  const brands = [
    { name: 'Zara', products: 1240, sellers: 12, status: 'Onaylı', gmv: '₺842K' },
    { name: 'H&M', products: 980, sellers: 8, status: 'Onaylı', gmv: '₺620K' },
    { name: 'Mango', products: 560, sellers: 5, status: 'Onaylı', gmv: '₺380K' },
    { name: 'Nike', products: 420, sellers: 15, status: 'Onaylı', gmv: '₺1.2M' },
    { name: 'NoName TR', products: 24, sellers: 1, status: 'Beklemede', gmv: '₺8K' },
    { name: 'FakeGucci', products: 0, sellers: 1, status: 'Engelli', gmv: '₺0' },
  ];

  const filtered = brands.filter(b => activeTab === 'all' ? true : activeTab === 'pending' ? b.status === 'Beklemede' : b.status === 'Engelli');
  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Marka Yönetimi</h1><p className="text-[11px] font-medium text-gray-400">{brands.length} marka · Doğrulama & Listeleme</p></div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="grid grid-cols-3 gap-3">
          {[{label:'Onaylı Marka',value:'48',icon:'✅'},{label:'Beklemede',value:'3',icon:'⏳'},{label:'Engelli',value:'2',icon:'🚫'}].map((k,i)=>(<div key={i} className={`${cardClass} p-4 text-center`}><span className="text-[20px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className="text-[22px] font-black text-[#111827]">{k.value}</p></div>))}
        </div>
        <div className={`${cardClass} p-2 flex gap-1`}>
          {[{id:'all',label:'Tümü'},{id:'pending',label:'⏳ Bekleyen'},{id:'blocked',label:'🚫 Engelli'}].map(t=>(<button key={t.id} onClick={()=>setActiveTab(t.id as any)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab===t.id?'bg-[#111827] text-white':'text-gray-500 hover:bg-gray-50'}`}>{t.label}</button>))}
        </div>
        <div className="space-y-3">
          {filtered.map((b, i) => (
            <div key={i} className={`${cardClass} p-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2"><span className="text-[14px] font-black text-[#111827]">{b.name}</span><span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${b.status==='Onaylı'?'bg-green-50 text-green-600':b.status==='Beklemede'?'bg-orange-50 text-orange-600':'bg-red-50 text-red-600'}`}>{b.status}</span></div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{b.products} ürün · {b.sellers} satıcı · GMV: {b.gmv}</p>
                </div>
                <button className="text-[9px] font-black px-3 py-2 bg-[#111827] text-white rounded-lg shrink-0">DÜZENLE</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
