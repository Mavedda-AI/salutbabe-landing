'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {HugeiconsIcon} from '@hugeicons/react';
import {
  BarChartIcon,
  Calendar01Icon,
  CameraMicrophoneIcon,
  CrownIcon,
  MoneyBag01Icon,
  RecordIcon,
  Refresh01Icon,
  Timer02Icon,
  UserMultipleIcon
} from '@hugeicons/core-free-icons';

export default function LiveRoomManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'live' | 'scheduled' | 'stats'>('live');

  const kpis = [
    { label: 'AKTİF ODA', value: '142', sub: '3,105 anlık dinleyici', color: 'text-[#FF383C]', bg: 'bg-[#FFF5F5]', icon: <HugeiconsIcon icon={RecordIcon} size={32} className="text-[#FF383C]" />, subColor: 'text-green-500' },
    { label: 'BUGÜN TOPLAM', value: '384', sub: '↗ %8 vs dün', color: 'text-[#111827]', bg: 'bg-white', icon: <HugeiconsIcon icon={CameraMicrophoneIcon} size={32} className="text-gray-600" />, subColor: 'text-green-500' },
    { label: 'ORT. SÜRE', value: '42 dk', sub: '↗ %5.2 artış', color: 'text-[#9747FF]', bg: 'bg-[#FCF9FF]', icon: <HugeiconsIcon icon={Timer02Icon} size={32} className="text-[#9747FF]" />, subColor: 'text-green-500' },
    { label: 'ODA BAŞI SATIŞ', value: '₺2,840', sub: 'Son 7 gün ort.', color: 'text-[#00B050]', bg: 'bg-[#F2FFF7]', icon: <HugeiconsIcon icon={MoneyBag01Icon} size={32} className="text-[#00B050]" />, subColor: 'text-[#00B050]' },
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

  const cardClass = 'bg-white rounded-[32px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-5 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0">
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[20px] font-black text-[#111827]">Sesli Oda Yönetimi</h1>
            <p className="text-[13px] font-medium text-gray-400 mt-0.5">Canlı Yayınlar & İstatistikler</p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFF0F0] text-[#FF4444] px-4 py-2 rounded-full text-[12px] font-bold">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4444] animate-pulse" /> 142 CANLI
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className={`${k.bg} border border-gray-100 rounded-[32px] py-8 px-4 flex flex-col items-center justify-center text-center shadow-sm`}>
              <span className="text-[28px] drop-shadow-sm mb-3">{k.icon}</span>
              <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{k.label}</p>
              <p className={`text-[36px] tracking-tight font-black ${k.color}`}>{k.value}</p>
              <p className={`text-[13px] font-bold ${k.subColor} mt-2`}>{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-full border border-gray-100 shadow-sm p-2 flex items-center justify-between">
          {[
            {id: 'live', text: 'Canlı Odalar', icon: <HugeiconsIcon icon={RecordIcon} size={20} className={activeTab === 'live' ? "text-red-500" : ""} />},
            {id: 'scheduled', text: 'Planlanan', icon: <HugeiconsIcon icon={Calendar01Icon} size={20} />},
            {id: 'stats', text: 'İstatistik', icon: <HugeiconsIcon icon={BarChartIcon} size={20} />}
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 px-6 py-3.5 rounded-full text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-[#0B1221] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.icon} {tab.text}
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
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5"><HugeiconsIcon icon={UserMultipleIcon} size={14} /> {r.listeners}</span>
                      <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5"><HugeiconsIcon icon={Timer02Icon} size={14} /> {r.duration}</span>
                      <span className="text-[11px] font-black text-green-600 flex items-center gap-1.5"><HugeiconsIcon icon={MoneyBag01Icon} size={14} /> {r.sales}</span>
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
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[11px] font-bold text-[#007AFF] flex items-center gap-1.5"><HugeiconsIcon icon={Calendar01Icon} size={14} /> {s.time}</span>
                      <span className="text-[11px] font-bold text-gray-400">Beklenen: {s.expected}</span>
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
              { label: 'Toplam Yayın (30g)', value: '2,840', icon: <HugeiconsIcon icon={CameraMicrophoneIcon} size={24} className="text-gray-600" /> },
              { label: 'Toplam Satış', value: '₺4.2M', icon: <HugeiconsIcon icon={MoneyBag01Icon} size={24} className="text-green-500" /> },
              { label: 'Ort. Dinleyici', value: '218', icon: <HugeiconsIcon icon={UserMultipleIcon} size={24} className="text-blue-500" /> },
              { label: 'Tekrar İzleme', value: '%34', icon: <HugeiconsIcon icon={Refresh01Icon} size={24} className="text-orange-500" /> },
              { label: 'En Uzun Yayın', value: '3s 42dk', icon: <HugeiconsIcon icon={Timer02Icon} size={24} className="text-purple-500" /> },
              { label: 'Top Host', value: 'Elif Boutique', icon: <HugeiconsIcon icon={CrownIcon} size={24} className="text-yellow-500" /> },
            ].map((s, i) => (
              <div key={i} className={`${cardClass} p-4 text-center flex flex-col items-center justify-center`}>
                <span className="mb-2">{s.icon}</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{s.label}</p>
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
