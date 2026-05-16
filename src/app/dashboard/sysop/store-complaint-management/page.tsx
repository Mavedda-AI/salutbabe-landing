'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function StoreComplaintManagementPage() {
  const router = useRouter();
  const complaints = [
    { store: 'Fashion Palace', subject: 'Sahte ürün satışı ihbarı', reporter: 'Büşra K.', date: '2 saat önce', priority: 'Acil', count: 3 },
    { store: 'Style Hub', subject: 'Sipariş karşılanmıyor', reporter: 'Ahmet Y.', date: '5 saat önce', priority: 'Yüksek', count: 5 },
    { store: 'Quick Fashion', subject: 'Yanıltıcı ürün açıklaması', reporter: 'Cansu D.', date: '1 gün önce', priority: 'Normal', count: 2 },
    { store: 'Bella Moda', subject: 'İade reddi - haklı talep', reporter: 'Elif Ş.', date: '1 gün önce', priority: 'Yüksek', count: 4 },
  ];
  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Mağaza Şikayetleri</h1><p className="text-[11px] font-medium text-gray-400">{complaints.length} açık şikayet</p></div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4 pb-20">
        <div className="grid grid-cols-3 gap-3">
          {[{label:'Açık',value:'14',icon:'🔴'},{label:'İncelenen',value:'8',icon:'🔍'},{label:'Çözülen (30g)',value:'42',icon:'✅'}].map((k,i)=>(<div key={i} className={`${cardClass} p-4 text-center`}><span className="text-[20px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className="text-[22px] font-black text-[#111827]">{k.value}</p></div>))}
        </div>
        {complaints.map((c, i) => (
          <div key={i} className={`${cardClass} p-4 border-l-4 ${c.priority==='Acil'?'border-l-red-400':c.priority==='Yüksek'?'border-l-orange-400':'border-l-gray-300'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#111827]">{c.store}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${c.priority==='Acil'?'bg-red-100 text-red-600':c.priority==='Yüksek'?'bg-orange-100 text-orange-600':'bg-gray-100 text-gray-600'}`}>{c.priority}</span>
                  <span className="text-[9px] font-bold text-gray-400">{c.count} şikayet</span>
                </div>
                <p className="text-[12px] text-gray-700 mt-1">{c.subject}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">İhbar: {c.reporter} · {c.date}</p>
              </div>
              <button className="text-[9px] font-black px-3 py-2 bg-[#111827] text-white rounded-lg shrink-0">İNCELE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
