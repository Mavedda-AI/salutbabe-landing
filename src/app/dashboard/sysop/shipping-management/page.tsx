'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Alert02Icon, BarChartIcon, Package01Icon, Tick01Icon, Timer02Icon, TruckIcon} from '@hugeicons/core-free-icons';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ShippingManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'delayed' | 'providers'>('overview');
  const [delayFilter, setDelayFilter] = useState('Tümü');
  const [selectedDelayed, setSelectedDelayed] = useState<string[]>([]);
  const [providerComplaint, setProviderComplaint] = useState<string | null>(null);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [trendFilter, setTrendFilter] = useState<'Günlük' | 'Haftalık' | 'Aylık' | 'Yıllık'>('Günlük');

  const kpis = [
    { label: 'Toplam Kargo', value: '12,480', sub: 'Son 30 gün', color: 'text-[#111827]', bg: 'bg-white', icon: <HugeiconsIcon icon={Package01Icon} size={32} className="text-[#111827] drop-shadow-sm" /> },
    { label: 'Zamanında Teslim', value: '%91.2', sub: '↗ %2.4 iyileşme', color: 'text-green-600', bg: 'bg-[#F4FFF8]', icon: <HugeiconsIcon icon={Tick01Icon} size={32} className="text-green-600 drop-shadow-sm" /> },
    { label: 'Geciken Kargo', value: '1,098', sub: '%8.8 gecikme oranı', color: 'text-[#FF8D28]', bg: 'bg-[#FFF9F2]', icon: <HugeiconsIcon icon={Alert02Icon} size={32} className="text-[#FF8D28] drop-shadow-sm" /> },
    { label: 'Ort. Teslim Süresi', value: '2.4 gün', sub: '↘ 0.3 gün düşüş', color: 'text-[#007AFF]', bg: 'bg-[#F4F9FF]', icon: <HugeiconsIcon icon={Timer02Icon} size={32} className="text-[#007AFF] drop-shadow-sm" /> },
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

  const filteredDelayed = delayedShipments.filter(s => {
    if (delayFilter === 'Tümü') return true;
    if (delayFilter === '1-2') return s.days <= 2;
    if (delayFilter === '3-4') return s.days >= 3 && s.days <= 4;
    if (delayFilter === '5+') return s.days >= 5;
    return true;
  });

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
            <div key={i} className={`${k.bg} border border-gray-100 rounded-[32px] py-8 px-4 flex flex-col items-center justify-center text-center shadow-sm`}>
              <div className="flex justify-center text-[28px] mb-2">{k.icon}</div>
              <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mt-2 mb-1">{k.label}</p>
              <p className={`text-[36px] tracking-tight font-black ${k.color}`}>{k.value}</p>
              <p className="text-[13px] font-bold text-green-500 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`${cardClass} p-2 flex gap-1`}>
          {[{id:'overview',label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={BarChartIcon} size={16} /> Genel Bakış</div>},{id:'delayed',label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Alert02Icon} size={16} /> Gecikenler</div>},{id:'providers',label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={TruckIcon} size={16} /> Firmalar</div>}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Daily Trend */}
            <div className={`${cardClass} p-6`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-[15px] font-black text-[#111827] mb-1">Kargo Trendi</h2>
                  <p className="text-[11px] font-medium text-gray-400">Toplam vs geciken kargolar ({trendFilter === 'Günlük' ? 'Son 7 gün' : trendFilter === 'Haftalık' ? 'Son 4 hafta' : trendFilter === 'Aylık' ? 'Son 6 ay' : 'Son 3 yıl'})</p>
                </div>
                <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 -mb-1">
                  <div className="flex items-center bg-[#F8F9FA] rounded-[16px] p-1.5 min-w-max border border-gray-100">
                    {['Günlük', 'Haftalık', 'Aylık', 'Yıllık'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setTrendFilter(filter as any)}
                        className={`px-5 py-2 text-[13px] font-bold rounded-[12px] transition-all whitespace-nowrap ${trendFilter === filter ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative h-48 mb-2">
                {/* Average Line */}
                <div className="absolute top-[30%] left-0 w-full border-t border-dashed border-gray-200 z-0 flex items-center">
                  <span className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ort. Hacim</span>
                </div>
                
                <div className="absolute inset-0 flex items-end justify-between gap-3 z-10">
                  {dailyTrend.map((d, i) => {
                    const isActive = hoveredDay === i;
                    // For inactive bars, use a repeating linear gradient pattern to match the screenshot
                    const inactivePattern = { backgroundImage: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 4px, #f3f4f6 4px, #f3f4f6 8px)' };
                    
                    return (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center gap-3 relative group cursor-pointer h-full justify-end"
                        onMouseEnter={() => setHoveredDay(i)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {/* Tooltip */}
                        {isActive && (
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-[#1E1E1E] text-white rounded-[20px] p-4 shadow-2xl z-30 pointer-events-none transform transition-all duration-200 animate-fade-in-up">
                            <div className="bg-white text-[#1E1E1E] text-[10px] font-black px-3 py-1 rounded-full inline-block mb-3">
                              {d.day} Günü
                            </div>
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                  <span className="text-[11px] text-gray-400 font-bold">Toplam</span>
                                </div>
                                <span className="text-[12px] font-black">{d.total}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#C6F432]" />
                                  <span className="text-[11px] text-gray-400 font-bold">Geciken</span>
                                </div>
                                <span className="text-[12px] font-black">{d.delayed}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bar Container */}
                        <div className="w-full relative flex flex-col items-center justify-end h-full">
                          {isActive && (
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-4 border-blue-500 rounded-full z-20 shadow-sm" />
                          )}
                          <div className="w-full flex flex-col items-center justify-end">
                            <div 
                              className={`w-full rounded-t-xl transition-all duration-300 ${isActive ? 'bg-blue-500' : ''}`} 
                              style={isActive ? { height: `${(d.total / maxTotal) * 120}px` } : { height: `${(d.total / maxTotal) * 120}px`, ...inactivePattern }} 
                            />
                            <div 
                              className={`w-full rounded-b-xl transition-all duration-300 ${isActive ? 'bg-[#C6F432]' : 'bg-gray-100'}`} 
                              style={{ height: `${(d.delayed / maxTotal) * 120}px` }} 
                            />
                          </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[#111827]' : 'text-gray-400'}`}>{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-5 mt-6 justify-center">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-[10px] font-bold text-gray-500">Toplam</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#C6F432]" /><span className="text-[10px] font-bold text-gray-500">Geciken</span></div>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF8D28] animate-ping" />
                <h2 className="text-[13px] font-black text-[#FF8D28]">Geciken Kargolar ({filteredDelayed.length})</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 -mb-1">
                  <div className="flex items-center bg-[#F8F9FA] rounded-[16px] p-1.5 min-w-max border border-gray-100">
                    {[
                      { id: 'Tümü', label: 'Tümü' },
                      { id: '1-2', label: '1-2 Gün' },
                      { id: '3-4', label: '3-4 Gün' },
                      { id: '5+', label: '5+ Gün' }
                    ].map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => { setDelayFilter(filter.id); setSelectedDelayed([]); }}
                        className={`px-5 py-2 text-[13px] font-bold rounded-[12px] transition-all whitespace-nowrap ${delayFilter === filter.id ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedDelayed.length > 0 && (
                  <button 
                    onClick={() => {
                      setNudgeMessage(`${selectedDelayed.length} sipariş için toplu dürtme gönderildi!`);
                      setTimeout(() => { setNudgeMessage(null); setSelectedDelayed([]); }, 3000);
                    }}
                    className="text-[10px] font-black px-3 py-1.5 bg-[#FF8D28] text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    TOPLU DÜRT ({selectedDelayed.length})
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3 px-3">
              <input 
                type="checkbox" 
                checked={selectedDelayed.length === filteredDelayed.length && filteredDelayed.length > 0}
                onChange={(e) => {
                  if (e.target.checked) setSelectedDelayed(filteredDelayed.map(s => s.id));
                  else setSelectedDelayed([]);
                }}
                className="w-3 h-3 rounded border-gray-300 text-[#FF8D28] focus:ring-[#FF8D28]"
              />
              <span className="text-[10px] font-bold text-gray-500">Tümünü Seç</span>
            </div>

            <div className="space-y-3">
              {filteredDelayed.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedDelayed.includes(s.id) ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100 hover:border-orange-100'}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedDelayed.includes(s.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedDelayed([...selectedDelayed, s.id]);
                      else setSelectedDelayed(selectedDelayed.filter(id => id !== s.id));
                    }}
                    className="w-3 h-3 rounded border-gray-300 text-[#FF8D28] focus:ring-[#FF8D28]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#111827]">{s.buyer}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${s.days >= 4 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{s.days} gün gecikme</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.id} · {s.provider} · {s.city}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-black text-[#111827]">{s.amount}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setNudgeMessage(`${s.id} için dürtme gönderildi!`);
                      setTimeout(() => setNudgeMessage(null), 3000);
                    }}
                    className="text-[9px] font-black px-3 py-2 bg-[#FF8D28] text-white rounded-lg shrink-0 hover:bg-orange-600 transition-colors"
                  >
                    DÜRT
                  </button>
                </div>
              ))}
              {filteredDelayed.length === 0 && (
                <div className="text-center py-8 text-[12px] font-bold text-gray-400">Bu kritere uygun geciken kargo bulunamadı.</div>
              )}
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
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full ${p.onTime > 92 ? 'bg-green-500' : p.onTime > 88 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${p.onTime}%` }} />
                </div>
                <div className="flex justify-end border-t border-gray-100 pt-3">
                  <button 
                    onClick={() => setProviderComplaint(p.name)}
                    className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <HugeiconsIcon icon={Alert02Icon} size={14} /> Firmaya Şikayet Oluştur
                  </button>
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

      {/* Toast Notification */}
      {nudgeMessage && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Tick01Icon} size={18} className="text-green-400" />
            {nudgeMessage}
          </div>
        </div>
      )}

      {/* Provider Complaint Modal */}
      {providerComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setProviderComplaint(null)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[18px] font-black text-[#111827]">Firma Şikayeti</h2>
                <button onClick={() => setProviderComplaint(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-[12px] text-gray-500 font-medium"><strong className="text-[#111827]">{providerComplaint}</strong> için resmi uyarı / şikayet kaydı oluşturulacaktır.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5">Şikayet Tipi</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:ring-2 focus:ring-red-500 outline-none">
                  <option>Gecikmeli Teslimat Raporu</option>
                  <option>Kayıp/Hasarlı Ürün</option>
                  <option>Müşteri Memnuniyetsizliği</option>
                  <option>SLA (Hizmet Seviyesi) İhlali</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5">Detaylı Açıklama</label>
                <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Şikayet detaylarını buraya girin..." />
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex gap-2">
              <button onClick={() => setProviderComplaint(null)} className="flex-1 py-3 rounded-xl bg-white border border-gray-200 text-[#111827] font-bold text-[13px] hover:bg-gray-50 transition-colors">İptal</button>
              <button 
                onClick={() => {
                  setNudgeMessage(`${providerComplaint} için şikayet kaydı başarıyla oluşturuldu.`);
                  setProviderComplaint(null);
                  setTimeout(() => setNudgeMessage(null), 3000);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] transition-colors shadow-lg shadow-red-500/20"
              >
                Şikayet Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
