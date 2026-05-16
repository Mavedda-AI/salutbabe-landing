'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PayoutManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'overview'>('overview');
  const [showApproveModal, setShowApproveModal] = useState(false);

  const kpis = [
    { label: 'Havuzdaki Bakiye', value: '₺1,450,000', sub: '84 bekleyen onay', color: 'text-[#007AFF]', bg: 'bg-blue-50', icon: '🏦' },
    { label: 'Bu Hafta Onaylanan', value: '₺345,000', sub: '↗ %12.4 artış', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { label: 'Toplam Komisyon', value: '₺1,080,960', sub: 'Son 30 gün', color: 'text-purple-600', bg: 'bg-purple-50', icon: '💰' },
    { label: 'Ort. Ödeme Süresi', value: '3.2 gün', sub: '↘ 0.5 gün iyileşme', color: 'text-[#111827]', bg: 'bg-gray-50', icon: '⏱️' },
  ];

  const pendingPayouts = [
    { store: 'Elif Boutique', amount: '₺42,800', orders: 142, days: 2, tier: 'Platinum' },
    { store: 'Maison de Mode', amount: '₺28,400', orders: 98, days: 3, tier: 'Gold' },
    { store: 'Urban Style TR', amount: '₺22,100', orders: 76, days: 1, tier: 'Gold' },
    { store: 'Chic Corner', amount: '₺18,600', orders: 64, days: 4, tier: 'Silver' },
    { store: 'Trendy Kids', amount: '₺15,200', orders: 52, days: 2, tier: 'Silver' },
    { store: 'Bella Moda', amount: '₺12,400', orders: 41, days: 5, tier: 'Bronze' },
  ];

  const completedPayouts = [
    { store: 'Elif Boutique', amount: '₺38,200', date: '14 May 2026', method: 'IBAN', status: 'Tamamlandı' },
    { store: 'Urban Style TR', amount: '₺19,800', date: '13 May 2026', method: 'IBAN', status: 'Tamamlandı' },
    { store: 'Chic Corner', amount: '₺14,500', date: '12 May 2026', method: 'IBAN', status: 'Tamamlandı' },
    { store: 'Trendy Kids', amount: '₺11,200', date: '12 May 2026', method: 'IBAN', status: 'Tamamlandı' },
  ];

  const weeklyTrend = [
    { week: 'H1', paid: 280, pending: 120 },
    { week: 'H2', paid: 310, pending: 95 },
    { week: 'H3', paid: 345, pending: 84 },
    { week: 'H4', paid: 290, pending: 110 },
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
            <h1 className="text-[18px] font-black text-[#111827]">Finans & Hak Ediş</h1>
            <p className="text-[11px] font-medium text-gray-400">Satıcı ödemeleri ve komisyon yönetimi</p>
          </div>
          <button onClick={() => setShowApproveModal(true)} className="ml-auto px-4 py-2 rounded-xl bg-green-500 text-white text-[10px] font-black tracking-wider hover:bg-green-600 transition-colors">
            + TOPLU ONAYLA
          </button>
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
          {[{id:'overview',label:'📊 Genel Bakış'},{id:'pending',label:'⏳ Bekleyenler'},{id:'completed',label:'✅ Tamamlanan'}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className={`${cardClass} p-5`}>
              <h2 className="text-[13px] font-black text-[#111827] mb-1">Haftalık Ödeme Trendi</h2>
              <p className="text-[10px] font-medium text-gray-400 mb-5">Ödenen vs Bekleyen (₺K)</p>
              <div className="flex items-end justify-between gap-4 h-32">
                {weeklyTrend.map((w, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-black text-gray-600">₺{w.paid}K</span>
                    <div className="w-full flex flex-col gap-1">
                      <div className="w-full rounded-t-lg bg-green-400" style={{ height: `${(w.paid / 400) * 100}px` }} />
                      <div className="w-full rounded-b-lg bg-orange-300" style={{ height: `${(w.pending / 400) * 60}px` }} />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">{w.week}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400" /><span className="text-[9px] font-bold text-gray-500">Ödenen</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-300" /><span className="text-[9px] font-bold text-gray-500">Bekleyen</span></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Komisyon Oranı', value: '%12.8', color: 'text-purple-600' },
                { label: 'İade Kesintisi', value: '₺32,400', color: 'text-red-500' },
                { label: 'Net Take Rate', value: '%10.4', color: 'text-green-600' },
              ].map((m, i) => (
                <div key={i} className={`${cardClass} p-4 text-center`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{m.label}</p>
                  <p className={`text-[22px] font-black ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-3">
            {pendingPayouts.map((p, i) => (
              <div key={i} className={`${cardClass} p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#111827]">{p.store}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600">{p.tier}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{p.orders} sipariş · {p.days} gündür bekliyor</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-black text-green-600">{p.amount}</p>
                  </div>
                  <button className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg shrink-0 hover:bg-green-600 transition-colors">ONAYLA</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-3">
            {completedPayouts.map((p, i) => (
              <div key={i} className={`${cardClass} p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[12px] font-bold text-[#111827]">{p.store}</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">{p.date} · {p.method}</p>
                  </div>
                  <p className="text-[13px] font-black text-[#111827]">{p.amount}</p>
                  <span className="text-[9px] font-black px-2 py-1 rounded-full bg-green-50 text-green-600">✅ {p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] border border-blue-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-blue-700">AI Aksiyonlar</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Platinum satıcılara T+1 ödeme geçişi', desc: '12 Platinum satıcıya hızlı ödeme sunarak bağlılığı artır. Churn riski %0 a düşer.', impact: 'Önerilen' },
              { title: 'Bella Moda 5 gündür bekliyor', desc: 'Bronze satıcı olmasına rağmen 5 gün bekleme riski taşıyor. Manuel onay gerekebilir.', impact: 'Acil' },
            ].map((a, i) => (
              <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100/50">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-[12px] font-bold text-[#111827]">{a.title}</p><p className="text-[10px] text-gray-500 mt-1">{a.desc}</p></div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full shrink-0 ${a.impact === 'Acil' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{a.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowApproveModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-8 rounded-2xl shadow-2xl text-center bg-white border border-gray-200">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-black mb-2 text-gray-900">Toplu Onay İşlemi</h3>
            <p className="text-[13px] mb-6 text-gray-500">Havuzda bekleyen <strong>84 adet</strong> hak ediş talebini onaylayıp tutarları satıcı cüzdanlarına aktarmak istiyor musunuz?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition-colors">İptal</button>
              <button onClick={() => setShowApproveModal(false)} className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors">Evet, Onayla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
