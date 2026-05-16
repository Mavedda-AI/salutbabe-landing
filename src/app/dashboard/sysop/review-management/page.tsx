'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ReviewManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'flagged'>('pending');

  const kpis = [
    { label: 'Bekleyen İnceleme', value: '48', color: 'text-[#FF8D28]', bg: 'bg-orange-50', icon: '⏳' },
    { label: 'Onaylanan (30g)', value: '2,840', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { label: 'Ort. Puan', value: '4.6', color: 'text-yellow-500', bg: 'bg-yellow-50', icon: '⭐' },
    { label: 'Bayrak Atılan', value: '12', color: 'text-red-500', bg: 'bg-red-50', icon: '🚩' },
  ];

  const reviews = [
    { user: 'Büşra K.', product: 'Kadın Ceket - Siyah', rating: 5, text: 'Harika kalite, tam bedenim oldu!', date: '2 saat önce', status: 'pending' },
    { user: 'Ahmet Y.', product: 'Erkek Sneaker', rating: 2, text: 'Beden çok küçük geldi, iade ettim.', date: '4 saat önce', status: 'pending' },
    { user: 'Cansu D.', product: 'Çanta - Krem', rating: 1, text: 'Sahte ürün gibi duruyor, kalitesiz.', date: '5 saat önce', status: 'flagged' },
    { user: 'Elif Ş.', product: 'Elbise - Kırmızı', rating: 4, text: 'Çok beğendim, kumaş kaliteli.', date: '8 saat önce', status: 'pending' },
    { user: 'Zeynep K.', product: 'Trençkot', rating: 5, text: 'Mükemmel! Tekrar alırım.', date: '1 gün önce', status: 'approved' },
  ];

  const filtered = reviews.filter(r => activeTab === 'pending' ? r.status === 'pending' : activeTab === 'flagged' ? r.status === 'flagged' : r.status === 'approved');
  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Değerlendirme Yönetimi</h1><p className="text-[11px] font-medium text-gray-400">Ürün yorumları & puanlama</p></div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((k, i) => (<div key={i} className={`${k.bg} border border-gray-100 rounded-[20px] p-4 text-center`}><span className="text-[22px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className={`text-[24px] font-black ${k.color}`}>{k.value}</p></div>))}
        </div>
        <div className={`${cardClass} p-2 flex gap-1`}>
          {[{id:'pending',label:'⏳ Bekleyen'},{id:'approved',label:'✅ Onaylanan'},{id:'flagged',label:'🚩 Bayraklı'}].map(t=>(<button key={t.id} onClick={()=>setActiveTab(t.id as any)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab===t.id?'bg-[#111827] text-white':'text-gray-500 hover:bg-gray-50'}`}>{t.label}</button>))}
        </div>
        <div className="space-y-3">
          {filtered.length === 0 ? <div className={`${cardClass} p-8 text-center text-gray-400 text-[13px]`}>Bu kategoride yorum yok.</div> : filtered.map((r, i) => (
            <div key={i} className={`${cardClass} p-4 ${r.status === 'flagged' ? 'border-l-4 border-l-red-400' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-[#111827]">{r.user}</span><span className="text-yellow-400 text-[12px]">{'⭐'.repeat(r.rating)}</span></div>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">{r.product}</p>
                  <p className="text-[12px] text-gray-700 mt-1">{r.text}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">{r.date}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  {r.status === 'pending' && <button className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg">ONAYLA</button>}
                  {r.status !== 'flagged' && <button className="text-[9px] font-black px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100">SİL</button>}
                  {r.status === 'flagged' && <button className="text-[9px] font-black px-3 py-2 bg-[#111827] text-white rounded-lg">İNCELE</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
