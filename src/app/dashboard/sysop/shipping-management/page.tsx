'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ShippingManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'delayed' | 'providers'>('overview');

  const kpis = [
    { label: 'Toplam Kargo', value: '12,480', sub: 'Son 30 gün', color: 'text-[#111827]', bg: 'bg-gray-50', icon: '📦' },
    { label: 'Zamanında Teslim', value: '%91.2', sub: '↗ %2.4 iyileşme', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { label: 'Geciken Kargo', value: '1,098', sub: '%8.8 gecikme oranı', color: 'text-[#FF8D28]', bg: 'bg-orange-50', icon: '⚠️' },
    { label: 'Ort. Teslim Süresi', value: '2.4 gün', sub: '↘ 0.3 gün düşüş', color: 'text-[#007AFF]', bg: 'bg-blue-50', icon: '⏱️' },
  ];

  const providers = [
    { name: 'Yurtiçi Kargo', shipments: 4820, onTime: 94.2, avgDays: 1.8, cost: '₺28.50', trend: '↗' },
    { name: 'Aras Kargo', shipments: 3640, onTime: 92.1, avgDays: 2.1, cost: '₺26.80', trend: '→' },
    { name: 'MNG Kargo', shipments: 2180, onTime: 89.5, avgDays: 2.6, cost: '₺24.20', trend: '↘' },
    { name: 'PTT Kargo', shipments: 1840, onTime: 82.4, avgDays: 3.8, cost: '₺18.50', trend: '↘' },
  ];

  const delayedShipments = [
    { id: 'SHP-4821', buyer: 'Büşra Kaya', provider: 'PTT', days: 4, city: 'İstanbul', amount: '₺680' },
    { id: 'SHP-4799', buyer: 'Ahmet Yılmaz', provider: 'PTT', days: 3, city: 'Ankara', amount: '₺420' },
    { id: 'SHP-4812', buyer: 'Cansu Demir', provider: 'MNG', days: 2, city: 'İzmir', amount: '₺890' },
    { id: 'SHP-4835', buyer: 'Merve Çelik', provider: 'PTT', days: 5, city: 'Bursa', amount: '₺345' },
    { id: 'SHP-4841', buyer: 'Elif Şahin', provider: 'Aras', days: 2, city: 'Antalya', amount: '₺560' },
    { id: 'SHP-4856', buyer: 'Zeynep Koç', provider: 'PTT', days: 3, city: 'Konya', amount: '₺720' },
  ];

  const dailyTrend = [
    { day: 'Pzt', total: 420, delayed: 38 },
    { day: 'Sal', total: 480, delayed: 42 },
    { day: 'Çar', total: 510, delayed: 35 },
    { day: 'Per', total: 390, delayed: 52 },
    { day: 'Cum', total: 560, delayed: 28 },
    { day: 'Cmt', total: 340, delayed: 18 },
    { day: 'Paz', total: 180, delayed: 12 },
  ];
  const maxTotal = Math.max(...dailyTrend.map(d => d.total));

  const cityPerformance = [
    { city: 'İstanbul', shipments: 4280, onTime: '%93.1', avgDays: '2.1 gün' },
    { city: 'Ankara', shipments: 2140, onTime: '%90.4', avgDays: '2.6 gün' },
    { city: 'İzmir', shipments: 1860, onTime: '%91.8', avgDays: '2.3 gün' },
    { city: 'Bursa', shipments: 980, onTime: '%88.2', avgDays: '2.9 gün' },
    { city: 'Antalya', shipments: 820, onTime: '%86.5', avgDays: '3.2 gün' },
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
            <h1 className="text-[18px] font-black text-[#111827]">Kargo Performansı</h1>
            <p className="text-[11px] font-medium text-gray-400">Son 30 Gün · Tüm Firmalar</p>
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
          {[{id:'overview',label:'📊 Genel Bakış'},{id:'delayed',label:'⚠️ Gecikenler'},{id:'providers',label:'🚚 Firmalar'}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Daily Trend */}
            <div className={`${cardClass} p-5`}>
              <h2 className="text-[13px] font-black text-[#111827] mb-1">Günlük Kargo Trendi</h2>
              <p className="text-[10px] font-medium text-gray-400 mb-5">Toplam vs geciken kargolar</p>
              <div className="flex items-end justify-between gap-2 h-32">
                {dailyTrend.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-black text-gray-600">{d.total}</span>
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-t-md bg-blue-400" style={{ height: `${(d.total / maxTotal) * 90}px` }} />
                      <div className="w-full rounded-b-md bg-orange-400" style={{ height: `${(d.delayed / maxTotal) * 90}px` }} />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-400" /><span className="text-[9px] font-bold text-gray-500">Toplam</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-400" /><span className="text-[9px] font-bold text-gray-500">Geciken</span></div>
              </div>
            </div>

            {/* City Performance */}
            <div className={`${cardClass} p-5`}>
              <h2 className="text-[13px] font-black text-[#111827] mb-4">Şehir Bazlı Performans</h2>
              <table className="w-full text-left">
                <thead><tr className="border-b border-gray-100">
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2">Şehir</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2">Kargo</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2">Zamanında</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2">Ort. Süre</th>
                </tr></thead>
                <tbody>
                  {cityPerformance.map((c, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-b-0">
                      <td className="py-3 text-[12px] font-bold text-[#111827]">{c.city}</td>
                      <td className="py-3 text-[12px] font-black text-[#111827]">{c.shipments.toLocaleString()}</td>
                      <td className="py-3"><span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${parseFloat(c.onTime.replace('%','')) > 90 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{c.onTime}</span></td>
                      <td className="py-3 text-[12px] font-bold text-gray-600">{c.avgDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'delayed' && (
          <div className={`${cardClass} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF8D28] animate-ping" />
              <h2 className="text-[13px] font-black text-[#FF8D28]">Geciken Kargolar ({delayedShipments.length})</h2>
            </div>
            <div className="space-y-3">
              {delayedShipments.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#111827]">{s.buyer}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${s.days >= 4 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{s.days} gün</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.id} · {s.provider} · {s.city}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-black text-[#111827]">{s.amount}</p>
                  </div>
                  <button className="text-[9px] font-black px-3 py-2 bg-[#FF8D28] text-white rounded-lg shrink-0">DÜRT</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="space-y-3">
            {providers.map((p, i) => (
              <div key={i} className={`${cardClass} p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-black text-[#111827]">{p.name}</h3>
                  <span className={`text-[14px] font-black ${p.trend === '↗' ? 'text-green-500' : p.trend === '↘' ? 'text-red-500' : 'text-gray-400'}`}>{p.trend}</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div><p className="text-[9px] font-bold text-gray-400 uppercase">Kargo</p><p className="text-[16px] font-black text-[#111827]">{p.shipments.toLocaleString()}</p></div>
                  <div><p className="text-[9px] font-bold text-gray-400 uppercase">Zamanında</p><p className={`text-[16px] font-black ${p.onTime > 90 ? 'text-green-600' : 'text-orange-500'}`}>%{p.onTime}</p></div>
                  <div><p className="text-[9px] font-bold text-gray-400 uppercase">Ort. Süre</p><p className="text-[16px] font-black text-[#007AFF]">{p.avgDays} gün</p></div>
                  <div><p className="text-[9px] font-bold text-gray-400 uppercase">Birim Maliyet</p><p className="text-[16px] font-black text-[#111827]">{p.cost}</p></div>
                </div>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.onTime > 92 ? 'bg-green-500' : p.onTime > 88 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${p.onTime}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[20px] border border-orange-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-orange-700">AI Aksiyonlar</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: 'PTT Kargo anlaşmasını gözden geçir', desc: '%82.4 zamanında teslim oranı kabul edilemez. Alternatif olarak Sürat Kargo ile pilot başlat.', impact: 'Kritik' },
              { title: 'Antalya bölgesine ek dağıtım noktası', desc: 'Antalya gecikme oranı %13.5 ile en yüksek. Yerel depo/fulfillment merkezi maliyeti aylık ₺12K.', impact: '+₺22K/ay' },
              { title: 'Cuma günü kargo yoğunluğunu dağıt', desc: 'Cuma 560 kargo ile zirve yapıyor. Perşembe kampanyaları Cuma yükünü %15 azaltabilir.', impact: '+₺8K/ay' },
            ].map((a, i) => (
              <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-orange-100/50">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-[12px] font-bold text-[#111827]">{a.title}</p><p className="text-[10px] text-gray-500 mt-1">{a.desc}</p></div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full shrink-0 ${a.impact === 'Kritik' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{a.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
