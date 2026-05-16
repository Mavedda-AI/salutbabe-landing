'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AdvancedAnalyticsPage() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<'Bugün' | '7 Gün' | '30 Gün'>('Bugün');

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      
      {/* HEADER */}
      <div className="bg-white px-5 py-4 flex flex-col gap-4 sticky top-0 z-40 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-[18px] md:text-[20px] font-black text-[#111827] leading-tight tracking-tight">İleri Analitik</h1>
              <p className="text-[12px] font-bold text-gray-500">Dönüşüm Hunisi & Optimizasyon</p>
            </div>
          </div>
          
          <div className="hidden sm:flex bg-gray-50 p-1 rounded-xl">
            {['Bugün', '7 Gün', '30 Gün'].map(t => (
              <button 
                key={t}
                onClick={() => setTimeFilter(t as any)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${timeFilter === t ? 'bg-[#111827] text-white shadow-sm' : 'text-gray-500 hover:text-[#111827]'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="flex sm:hidden bg-gray-50 p-1 rounded-xl w-full">
          {['Bugün', '7 Gün', '30 Gün'].map(t => (
            <button 
              key={t}
              onClick={() => setTimeFilter(t as any)}
              className={`flex-1 py-2 rounded-lg text-[12px] font-bold transition-all ${timeFilter === t ? 'bg-[#111827] text-white shadow-sm' : 'text-gray-500 hover:text-[#111827]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[800px] mx-auto p-4 md:p-6 space-y-6">
        
        {/* FUNNEL CARD */}
        <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] mt-1.5 shrink-0"></div>
              <h2 className="text-[16px] md:text-[18px] font-black text-[#111827] max-w-[200px] leading-tight">
                Checkout Hunisi (Checkout Funnel)
              </h2>
            </div>
            <div className="bg-[#FFF0F0] text-[#FF3B30] px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shrink-0">
              Kritik Düşüş:<br/>%12
            </div>
          </div>

          <div className="space-y-3 flex flex-col items-start w-full">
            
            {/* Step 1 */}
            <div className="w-full relative rounded-2xl bg-[#E8F0FE] overflow-hidden flex items-center justify-between p-4 pl-5">
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest mb-0.5">ADIM 1</span>
                <span className="text-[14px] font-black text-[#111827]">Ürün Ziyareti</span>
              </div>
              <span className="text-[20px] font-black text-[#111827] relative z-10">12,450</span>
            </div>

            {/* Step 2 */}
            <div className="w-[85%] ml-[7.5%] relative rounded-2xl bg-[#F0F5FF] overflow-hidden flex items-center justify-between p-4 pl-5">
              <div className="absolute left-0 top-0 bottom-0 w-[80%] bg-[#E8F0FE]/50 rounded-r-3xl"></div>
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest mb-0.5">ADIM 2</span>
                <span className="text-[14px] font-black text-[#111827]">Sepete Ekleme</span>
              </div>
              <span className="text-[20px] font-black text-[#111827] relative z-10">4,520</span>
            </div>

            {/* Step 3 */}
            <div className="w-[70%] ml-[15%] relative rounded-2xl bg-[#FFF5E6] overflow-hidden flex items-center justify-between p-4 pl-5">
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] font-black text-[#FF9500] uppercase tracking-widest mb-0.5">ADIM 3</span>
                <span className="text-[14px] font-black text-[#111827]">Ödeme Adımı</span>
              </div>
              <span className="text-[20px] font-black text-[#111827] relative z-10">1,840</span>
            </div>

            {/* Step 4 */}
            <div className="w-[55%] ml-[22.5%] relative rounded-2xl bg-[#FFE5E5] overflow-hidden flex items-center justify-between p-4 pl-5">
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] font-black text-[#FF3B30] uppercase tracking-widest mb-0.5">ADIM 4</span>
                <span className="text-[14px] font-black text-[#111827]">Sipariş<br/>Tamamlama</span>
              </div>
              <div className="flex flex-col items-end relative z-10">
                <span className="text-[20px] font-black text-[#111827]">1,619</span>
                <div className="bg-white rounded-lg px-2 py-1 flex flex-col items-center shadow-sm mt-1 border border-white/50">
                  <span className="text-[10px] font-black text-[#FF3B30] leading-none">-%12</span>
                  <span className="text-[9px] font-black text-[#FF3B30] leading-none mt-0.5">DÜŞÜŞ</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LOSS REASONS CARD */}
        <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Kayıp Nedenleri</h3>
          </div>

          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]"></div>
                <span className="text-[14px] font-bold text-[#111827]">Kargo Ücreti Yüksek</span>
              </div>
              <span className="text-[14px] font-black text-[#111827]">%45</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF9500]"></div>
                <span className="text-[14px] font-bold text-[#111827]">Ödeme / 3D Secure Hatası</span>
              </div>
              <span className="text-[14px] font-black text-[#111827]">%32</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D1D1D6]"></div>
                <span className="text-[14px] font-bold text-[#111827]">Sepeti Terk (Kararsızlık)</span>
              </div>
              <span className="text-[14px] font-black text-[#111827]">%23</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
