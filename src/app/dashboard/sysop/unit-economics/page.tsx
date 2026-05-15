'use client';

import { useRouter } from 'next/navigation';

export default function UnitEconomicsPage() {
  const router = useRouter();

  const metrics = [
    { label: 'Sipariş Başı Net Kâr', value: '₺124.50', sub: 'Hedefin %14 üzerinde', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Sepet Ortalaması (AOV)', value: '₺485.00', sub: '↗ %8.2 vs geçen ay', color: 'text-[#111827]', bg: 'bg-gray-50' },
    { label: 'Ort. Komisyon', value: '₺168.00', sub: '%34.6 komisyon oranı', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Ort. Kargo Maliyeti', value: '₺43.50', sub: '↘ %3.1 düşüş', color: 'text-[#007AFF]', bg: 'bg-blue-50' },
  ];

  const costBreakdown = [
    { label: 'Komisyon Geliri', value: '₺1,080,960', pct: 100, color: 'bg-purple-500' },
    { label: 'Kargo Maliyeti', value: '-₺279,720', pct: 25.9, color: 'bg-orange-400' },
    { label: 'Ödeme İşlem Ücreti', value: '-₺64,320', pct: 5.9, color: 'bg-red-400' },
    { label: 'Operasyon Giderleri', value: '-₺117,014', pct: 10.8, color: 'bg-gray-400' },
    { label: 'Net Kâr', value: '₺619,906', pct: 57.3, color: 'bg-green-500' },
  ];

  const monthlyTrend = [
    { month: 'Oca', profit: 82, aov: 420 },
    { month: 'Şub', profit: 91, aov: 435 },
    { month: 'Mar', profit: 105, aov: 452 },
    { month: 'Nis', profit: 98, aov: 448 },
    { month: 'May', profit: 112, aov: 468 },
    { month: 'Haz', profit: 124, aov: 485 },
  ];
  const maxProfit = Math.max(...monthlyTrend.map(m => m.profit));

  const categoryPerformance = [
    { name: 'Kadın Giyim', orders: 2840, aov: '₺520', margin: '%38.2', trend: '↗' },
    { name: 'Erkek Giyim', orders: 1620, aov: '₺445', margin: '%32.1', trend: '↗' },
    { name: 'Aksesuar', orders: 980, aov: '₺285', margin: '%45.6', trend: '↗' },
    { name: 'Ayakkabı', orders: 560, aov: '₺680', margin: '%28.4', trend: '↘' },
    { name: 'Çocuk', orders: 432, aov: '₺340', margin: '%36.8', trend: '→' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-[18px] font-black text-[#111827]">Birim Ekonomisi</h1>
            <p className="text-[11px] font-medium text-gray-400">Son 30 Gün · Tüm Kategoriler</p>
          </div>
          <div className="ml-auto px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black tracking-wider">FOUNDER ONLY</div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m, i) => (
            <div key={i} className={`${m.bg} border border-gray-100 rounded-[20px] p-4`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{m.label}</p>
              <p className={`text-[24px] font-black ${m.color}`}>{m.value}</p>
              <p className="text-[10px] font-bold text-green-500 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Profitability Trend */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[13px] font-black text-[#111827]">Kârlılık Trendi</h2>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5">Sipariş başı net kâr (₺)</p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-black">
              ↗ %51.2 büyüme
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {monthlyTrend.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-gray-700">₺{m.profit}</span>
                <div 
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-400 transition-all duration-500 hover:from-purple-600 hover:to-purple-500"
                  style={{ height: `${(m.profit / maxProfit) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-[9px] font-bold text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Waterfall / Cost Breakdown */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[13px] font-black text-[#111827] mb-1">Gelir-Maliyet Dağılımı</h2>
          <p className="text-[10px] font-medium text-gray-400 mb-5">Sipariş başı gelir akışı</p>
          
          <div className="space-y-3">
            {costBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray-500 w-36 shrink-0">{item.label}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                </div>
                <span className={`text-[12px] font-black w-24 text-right ${item.value.startsWith('-') ? 'text-red-500' : 'text-[#111827]'}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Net margin highlight */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase">Net Kâr Marjı</p>
              <p className="text-[28px] font-black text-green-600">%57.3</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Aylık Net Kâr</p>
              <p className="text-[24px] font-black text-[#111827]">₺619,906</p>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[13px] font-black text-[#111827] mb-1">Kategori Bazlı Performans</h2>
          <p className="text-[10px] font-medium text-gray-400 mb-4">Hangi kategori en çok kâr getiriyor?</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2 pr-4">Kategori</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2 pr-4">Sipariş</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2 pr-4">AOV</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2 pr-4">Marj</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {categoryPerformance.map((cat, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-b-0">
                    <td className="py-3 pr-4">
                      <span className="text-[12px] font-bold text-[#111827]">{cat.name}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[12px] font-black text-[#111827]">{cat.orders.toLocaleString()}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[12px] font-bold text-gray-600">{cat.aov}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${parseFloat(cat.margin.replace('%','')) > 35 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{cat.margin}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[14px] font-black ${cat.trend === '↗' ? 'text-green-500' : cat.trend === '↘' ? 'text-red-500' : 'text-gray-400'}`}>{cat.trend}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Ratios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Brüt Marj', value: '%34.6', color: 'text-green-600', icon: '📊' },
            { label: 'Operasyon / Sipariş', value: '₺18.20', color: 'text-[#111827]', icon: '⚙️' },
            { label: 'İade Oranı', value: '%4.2', color: 'text-[#FF8D28]', icon: '↩️' },
            { label: 'LTV / CAC', value: '3.8x', color: 'text-purple-600', icon: '🎯' },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-[20px] border border-gray-100 p-4 shadow-sm text-center">
              <span className="text-[20px]">{r.icon}</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{r.label}</p>
              <p className={`text-[22px] font-black ${r.color}`}>{r.value}</p>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[20px] border border-purple-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-purple-700">AI Aksiyonlar</h2>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Kargo baremi stratejisini koru', desc: 'Sepet ortalaması ₺485 ile kargo maliyetini tolere ediyor. Mevcut 250₺+ ücretsiz kargo eşiğini değiştirme.', impact: '~₺0 risk' },
              { title: 'Aksesuar cross-sell\'i artır', desc: 'Aksesuar kategorisi %45.6 marj ile en kârlı. Sepete ekleme önerilerini güçlendir.', impact: '+₺32K/ay' },
              { title: 'Ayakkabı kargo anlaşmasını revize et', desc: 'Ayakkabı kategorisinde düşük marj (%28.4) kargo hacminden kaynaklanıyor. Volumetrik anlaşma güncelle.', impact: '+₺18K/ay' },
            ].map((action, i) => (
              <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-100/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold text-[#111827]">{action.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{action.desc}</p>
                  </div>
                  <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0 whitespace-nowrap">{action.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
