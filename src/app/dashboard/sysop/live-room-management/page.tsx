'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function LiveRoomManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'live' | 'scheduled' | 'stats'>('live');

  const kpis = [
    { label: 'Aktif Oda', value: '142', sub: '3,105 anlık dinleyici', color: 'text-[#FF383C]', bg: 'bg-red-50', icon: '🔴' },
    { label: 'Bugün Toplam', value: '384', sub: '↗ %8 vs dün', color: 'text-[#111827]', bg: 'bg-gray-50', icon: '🎙️' },
    { label: 'Ort. Süre', value: '42 dk', sub: '↗ %5.2 artış', color: 'text-purple-600', bg: 'bg-purple-50', icon: '⏱️' },
    { label: 'Oda Başı Satış', value: '₺2,840', sub: 'Son 7 gün ort.', color: 'text-green-600', bg: 'bg-green-50', icon: '💰' },
  ];

  const liveRooms = [
    { host: 'Elif Boutique', title: 'Yaz Koleksiyonu Tanıtım', listeners: 482, duration: '1s 24dk', sales: '₺12,400', category: 'Kadın Giyim' },
    { host: 'Maison de Mode', title: 'Çanta & Aksesuar Canlı', listeners: 318, duration: '48dk', sales: '₺8,200', category: 'Aksesuar' },
    { host: 'Urban Style TR', title: 'Erkek Streetwear Live', listeners: 245, duration: '32dk', sales: '₺5,600', category: 'Erkek Giyim' },
    { host: 'Trendy Kids', title: 'Okul Dönemi Hazırlık', listeners: 189, duration: '1s 12dk', sales: '₺4,100', category: 'Çocuk' },
  ];

  const scheduled = [
    { host: 'Chic Corner', title: 'Abiye Koleksiyonu', time: 'Bugün 14:00', expected: '500+' },
    { host: 'Bella Moda', title: 'İndirimli Ürünler', time: 'Bugün 16:30', expected: '300+' },
    { host: 'Elif Boutique', title: 'Yeni Sezon Preview', time: 'Yarın 11:00', expected: '800+' },
  ];

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-[18px] font-black text-[#111827]">Sesli Oda Yönetimi</h1>
            <p className="text-[11px] font-medium text-gray-400">Canlı Yayınlar & İstatistikler</p>
          </div>
          <div className="ml-auto flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500" /> 142 CANLI
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((k, i) => (
            <div key={i} className={`${k.bg} border border-gray-100 rounded-[20px] p-4 text-center`}>
              <span className="text-[22px]">{k.icon}</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p>
              <p className={`text-[24px] font-black ${k.color}`}>{k.value}</p>
              <p className="text-[10px] font-bold text-green-500 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className={`${cardClass} p-2 flex gap-1`}>
          {[{id:'live',label:'🔴 Canlı Odalar'},{id:'scheduled',label:'📅 Planlanan'},{id:'stats',label:'📊 İstatistik'}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'live' && (
          <div className="space-y-3">
            {liveRooms.map((r, i) => (
              <div key={i} className={`${cardClass} p-4 border-l-4 border-l-red-400`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[12px] font-bold text-[#111827]">{r.host}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600">{r.category}</span>
                    </div>
                    <p className="text-[12px] font-medium text-gray-600 mt-1">{r.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-gray-500">👥 {r.listeners}</span>
                      <span className="text-[10px] font-bold text-gray-500">⏱ {r.duration}</span>
                      <span className="text-[10px] font-black text-green-600">💰 {r.sales}</span>
                    </div>
                  </div>
                  <button className="text-[9px] font-black px-3 py-2 bg-[#111827] text-white rounded-lg shrink-0">İZLE</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-3">
            {scheduled.map((s, i) => (
              <div key={i} className={`${cardClass} p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[12px] font-bold text-[#111827]">{s.host}</span>
                    <p className="text-[11px] text-gray-600 mt-0.5">{s.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-[#007AFF]">📅 {s.time}</span>
                      <span className="text-[10px] font-bold text-gray-400">Beklenen: {s.expected}</span>
                    </div>
                  </div>
                  <button className="text-[9px] font-black px-3 py-2 bg-gray-100 text-gray-700 rounded-lg shrink-0">HATIRLATICI</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Toplam Yayın (30g)', value: '2,840', icon: '🎙️' },
              { label: 'Toplam Satış', value: '₺4.2M', icon: '💰' },
              { label: 'Ort. Dinleyici', value: '218', icon: '👥' },
              { label: 'Tekrar İzleme', value: '%34', icon: '🔁' },
              { label: 'En Uzun Yayın', value: '3s 42dk', icon: '⏱️' },
              { label: 'Top Host', value: 'Elif Boutique', icon: '👑' },
            ].map((s, i) => (
              <div key={i} className={`${cardClass} p-4 text-center`}>
                <span className="text-[20px]">{s.icon}</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{s.label}</p>
                <p className="text-[18px] font-black text-[#111827]">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[20px] border border-purple-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-purple-700">AI Aksiyonlar</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Elif Boutique\'e "Öne Çıkan" rozeti ver', desc: 'En yüksek satış ve dinleyici ortalamasına sahip. Rozet ile daha fazla keşfedilebilirlik sağla.', impact: '+₺18K/ay' },
              { title: 'Akşam 20:00-22:00 yayın teşviki', desc: 'Bu saatlerde dinleyici sayısı %62 daha yüksek ama yayın sayısı düşük. Satıcılara bildirim gönder.', impact: '+₺42K/ay' },
            ].map((a, i) => (
              <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-100/50">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-[12px] font-bold text-[#111827]">{a.title}</p><p className="text-[10px] text-gray-500 mt-1">{a.desc}</p></div>
                  <span className="text-[10px] font-black px-2 py-1 rounded-full shrink-0 bg-green-50 text-green-600">{a.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
