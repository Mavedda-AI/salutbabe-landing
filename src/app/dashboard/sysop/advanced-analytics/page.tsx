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
        <div className="bg-white rounded-[24px] p-5 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-100/50">
          <div className="flex items-start justify-between mb-10">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-[#007AFF] mt-1.5 shrink-0"></div>
              <h2 className="text-[18px] md:text-[20px] font-black text-[#111827] max-w-[240px] leading-tight">
                Checkout Hunisi (Checkout Funnel)
              </h2>
            </div>
            <div className="bg-[#FFF0F0] text-[#FF3B30] px-4 py-2 rounded-full text-[10px] md:text-[11px] font-black tracking-widest uppercase shrink-0">
              Kritik Düşüş:<br/>%12
            </div>
          </div>

          <div className="flex flex-col items-center w-full gap-3">
            
            {/* Step 1 */}
            <div className="w-full rounded-[20px] bg-[#E5EFFF] flex items-center justify-between p-4 md:p-5 px-6">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-[11px] font-black text-[#007AFF] uppercase tracking-widest mb-1">ADIM 1</span>
                <span className="text-[15px] md:text-[16px] font-bold text-[#111827]">Ürün Ziyareti</span>
              </div>
              <span className="text-[22px] md:text-[26px] font-black text-[#111827]">12,450</span>
            </div>

            {/* Step 2 */}
            <div className="w-[90%] md:w-[85%] rounded-[20px] bg-[#F8FAFC] border border-gray-100/80 overflow-hidden flex items-center justify-between p-4 md:p-5 px-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-[65%] bg-[#E5EFFF] rounded-r-[20px]"></div>
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] md:text-[11px] font-black text-[#007AFF] uppercase tracking-widest mb-1">ADIM 2</span>
                <span className="text-[15px] md:text-[16px] font-bold text-[#111827]">Sepete Ekleme</span>
              </div>
              <span className="text-[22px] md:text-[26px] font-black text-[#111827] relative z-10">4,520</span>
            </div>

            {/* Step 3 */}
            <div className="w-[80%] md:w-[70%] rounded-[20px] bg-[#FCFDFE] border border-[#FF9500]/10 overflow-hidden flex items-center justify-between p-4 md:p-5 px-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-[55%] bg-[#FFF3E0] rounded-r-[20px]"></div>
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] md:text-[11px] font-black text-[#FF9500] uppercase tracking-widest mb-1">ADIM 3</span>
                <span className="text-[15px] md:text-[16px] font-bold text-[#111827]">Ödeme Adımı</span>
              </div>
              <span className="text-[22px] md:text-[26px] font-black text-[#111827] relative z-10">1,840</span>
            </div>

            {/* Step 4 */}
            <div className="w-[70%] md:w-[55%] rounded-[20px] bg-[#FCFDFE] border border-[#FF3B30]/10 overflow-hidden flex items-center justify-between p-4 md:p-5 px-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-[45%] bg-[#FFEBEB] rounded-r-[20px]"></div>
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] md:text-[11px] font-black text-[#FF3B30] uppercase tracking-widest mb-1">ADIM 4</span>
                <span className="text-[15px] md:text-[16px] font-bold text-[#111827]">Sipariş<br className="md:hidden"/> Tamamlama</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <span className="text-[22px] md:text-[26px] font-black text-[#111827] leading-none mb-1">1,619</span>
                <div className="bg-white rounded-lg px-2.5 py-1.5 flex flex-col items-center shadow-sm border border-gray-100 absolute top-full mt-2 right-0 md:static md:mt-1">
                  <span className="text-[11px] font-black text-[#FF3B30] leading-none">-%12</span>
                  <span className="text-[9px] font-black text-[#FF3B30] leading-none mt-1">DÜŞÜŞ</span>
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
