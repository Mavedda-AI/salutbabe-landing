'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ComplaintManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'open' | 'resolved' | 'stats'>('open');

  const kpis = [
    { label: 'Açık Destek', value: '142', sub: '32 acil öncelikli', color: 'text-[#FF383C]', bg: 'bg-red-50', icon: '🔴' },
    { label: 'Çözülme Oranı', value: '%94.8', sub: '↗ %1.2 iyileşme', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { label: 'Ort. Çözüm Süresi', value: '4.2 saat', sub: '↘ 1.1 saat düşüş', color: 'text-[#007AFF]', bg: 'bg-blue-50', icon: '⏱️' },
    { label: 'CSAT Skoru', value: '4.6/5', sub: 'Son 30 gün ort.', color: 'text-purple-600', bg: 'bg-purple-50', icon: '⭐' },
  ];

  const openTickets = [
    { id: 'TKT-8421', user: 'Büşra Kaya', subject: 'Kargo 5 gündür teslim edilmedi', category: 'Kargo', priority: 'Acil', time: '2 saat önce', status: 'Yanıt Bekliyor' },
    { id: 'TKT-8419', user: 'Ahmet Yılmaz', subject: 'Sahte ürün şüphesi - replika çanta', category: 'Sahte Ürün', priority: 'Acil', time: '3 saat önce', status: 'İnceleniyor' },
    { id: 'TKT-8415', user: 'Cansu Demir', subject: 'İade onaylandı ama para iade edilmedi', category: 'İade/Ödeme', priority: 'Yüksek', time: '5 saat önce', status: 'Yanıt Bekliyor' },
    { id: 'TKT-8412', user: 'Merve Çelik', subject: 'Yanlış beden gönderilmiş', category: 'Ürün', priority: 'Normal', time: '8 saat önce', status: 'İnceleniyor' },
    { id: 'TKT-8408', user: 'Zeynep Koç', subject: 'Ödeme çekildi ama sipariş oluşmadı', category: 'İade/Ödeme', priority: 'Acil', time: '12 saat önce', status: 'Eskalasyon' },
    { id: 'TKT-8405', user: 'Elif Şahin', subject: 'Satıcı mesajlara cevap vermiyor', category: 'Satıcı', priority: 'Normal', time: '1 gün önce', status: 'Yanıt Bekliyor' },
  ];

  const resolvedRecent = [
    { id: 'TKT-8400', user: 'Canan Öz', subject: 'Kupon kodu çalışmıyor', resolution: 'Kupon yeniden tanımlandı', time: '2 saat', satisfaction: 5 },
    { id: 'TKT-8395', user: 'Selin Ak', subject: 'Hesap erişim sorunu', resolution: 'Şifre sıfırlandı', time: '45 dk', satisfaction: 5 },
    { id: 'TKT-8390', user: 'Murat Demir', subject: 'Eksik ürün geldi', resolution: 'Eksik ürün tekrar gönderildi', time: '6 saat', satisfaction: 4 },
    { id: 'TKT-8385', user: 'Ayşe Yıldız', subject: 'Fatura düzenlenmedi', resolution: 'E-fatura gönderildi', time: '1 saat', satisfaction: 5 },
  ];

  const categoryStats = [
    { category: 'Kargo Gecikme', count: 48, pct: 33.8, color: 'bg-orange-400' },
    { category: 'İade / Ödeme', count: 32, pct: 22.5, color: 'bg-blue-400' },
    { category: 'Sahte Ürün İhbarı', count: 24, pct: 16.9, color: 'bg-red-400' },
    { category: 'Ürün Sorunu', count: 18, pct: 12.7, color: 'bg-purple-400' },
    { category: 'Satıcı Şikayeti', count: 12, pct: 8.5, color: 'bg-yellow-400' },
    { category: 'Diğer', count: 8, pct: 5.6, color: 'bg-gray-400' },
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
            <h1 className="text-[18px] font-black text-[#111827]">Destek & Şikayet Merkezi</h1>
            <p className="text-[11px] font-medium text-gray-400">Canlı Veriler · Tüm Talepler</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">

        {/* KPIs */}
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

        {/* Tabs */}
        <div className={`${cardClass} p-2 flex gap-1`}>
          {[{id:'open',label:'🔴 Açık Talepler'},{id:'resolved',label:'✅ Çözülenler'},{id:'stats',label:'📊 İstatistik'}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'open' && (
          <div className="space-y-3">
            {openTickets.map((t, i) => (
              <div key={i} className={`${cardClass} p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-bold text-[#111827]">{t.user}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${t.priority === 'Acil' ? 'bg-red-100 text-red-600' : t.priority === 'Yüksek' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>{t.priority}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">{t.category}</span>
                    </div>
                    <p className="text-[12px] font-medium text-gray-700 mt-1">{t.subject}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-gray-400">{t.id}</span>
                      <span className="text-[10px] text-gray-400">{t.time}</span>
                      <span className={`text-[9px] font-black ${t.status === 'Eskalasyon' ? 'text-red-500' : t.status === 'İnceleniyor' ? 'text-blue-500' : 'text-orange-500'}`}>{t.status}</span>
                    </div>
                  </div>
                  <button className="text-[9px] font-black px-3 py-2 bg-[#111827] text-white rounded-lg shrink-0">YANITLA</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resolved' && (
          <div className="space-y-3">
            {resolvedRecent.map((t, i) => (
              <div key={i} className={`${cardClass} p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#111827]">{t.user}</span>
                      <span className="text-[10px] text-gray-400">{t.id}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">{t.subject}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-green-600">✅ {t.resolution}</span>
                      <span className="text-[10px] text-gray-400">⏱ {t.time}</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-[18px] font-black text-yellow-500">{'⭐'.repeat(t.satisfaction)}</p>
                    <p className="text-[9px] font-bold text-gray-400">{t.satisfaction}/5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <>
            <div className={`${cardClass} p-5`}>
              <h2 className="text-[13px] font-black text-[#111827] mb-1">Kategori Dağılımı</h2>
              <p className="text-[10px] font-medium text-gray-400 mb-4">Açık talep türleri</p>
              <div className="space-y-3">
                {categoryStats.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-500 w-28 shrink-0">{c.category}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="text-[11px] font-black text-gray-700 w-8 text-right">{c.count}</span>
                    <span className="text-[9px] font-bold text-gray-400 w-10 text-right">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Bugün Açılan', value: '18', icon: '📩' },
                { label: 'Bugün Çözülen', value: '24', icon: '✅' },
                { label: 'Eskalasyon', value: '3', icon: '🚨' },
                { label: 'İlk Yanıt Süresi', value: '12 dk', icon: '⚡' },
              ].map((s, i) => (
                <div key={i} className={`${cardClass} p-4 text-center`}>
                  <span className="text-[20px]">{s.icon}</span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{s.label}</p>
                  <p className="text-[20px] font-black text-[#111827]">{s.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* AI */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-[20px] border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-red-700">AI Aksiyonlar</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Kargo gecikmesi otomatik yanıtı aktifleştir', desc: '%33.8 talep kargo kaynaklı. Otomatik tracking bilgisi + tahmini teslim tarihi gönderimi talep sayısını %40 azaltabilir.', impact: '-57 talep/ay' },
              { title: 'Sahte ürün ihbar sürecini hızlandır', desc: '24 sahte ürün ihbarı bekliyor. Ortalama çözüm süresi 18 saat. Otomatik ürün kaldırma eşiği koy (3+ ihbar).', impact: 'Acil' },
              { title: 'Chatbot entegrasyonu', desc: 'İlk yanıt süresi 12 dk. Sık sorulan sorular için chatbot %60 talep azaltımı sağlayabilir.', impact: '-85 talep/ay' },
            ].map((a, i) => (
              <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-red-100/50">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-[12px] font-bold text-[#111827]">{a.title}</p><p className="text-[10px] text-gray-500 mt-1">{a.desc}</p></div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full shrink-0 ${a.impact === 'Acil' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{a.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
