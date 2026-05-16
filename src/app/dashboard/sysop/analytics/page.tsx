"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("Bugün");

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 text-gray-900 font-sans">
       {/* HEADER */}
       <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="text-[18px] font-black tracking-tight leading-tight">İleri Analitik</h1>
              <p className="text-[11px] font-bold text-gray-500">Dönüşüm Hunisi & Optimizasyon</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['Bugün', '7 Gün', '30 Gün'].map(t => (
               <button key={t} onClick={() => setTimeRange(t)} className={`px-3 py-1.5 text-[10px] transition-all ${timeRange === t ? 'text-[#111827] font-black' : 'text-gray-500 font-bold hover:text-[#111827]'}`}>
                 {t}
               </button>
            ))}
          </div>
       </div>

       <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 mt-2">
          
          {/* THE FUNNEL VISUALIZATION */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-[15px] font-black flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]"></div>
                 Checkout Hunisi (Checkout Funnel)
               </h2>
               <span className="px-3 py-1 bg-[#FF383C]/10 text-[#FF383C] rounded-full text-[10px] font-black tracking-wider animate-pulse">KRİTİK DÜŞÜŞ: %12</span>
             </div>

             <div className="flex flex-col gap-2 relative">
                {/* Step 1 */}
                <div className="relative h-16 w-full bg-[#007AFF]/5 rounded-[20px] flex items-center px-6 transition-all duration-500 overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 bg-[#007AFF] rounded-[20px] opacity-10" style={{ width: '100%' }}></div>
                   <div className="z-10 flex justify-between w-full items-center">
                     <div>
                       <span className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest block mb-0.5">ADIM 1</span>
                       <span className="text-[14px] font-bold text-gray-900">Ürün Ziyareti</span>
                     </div>
                     <span className="text-[18px] font-black text-gray-900">12,450</span>
                   </div>
                </div>

                {/* Step 2 */}
                <div className="relative h-16 w-[85%] mx-auto bg-blue-50/50 rounded-[20px] flex items-center px-6 transition-all duration-500 mt-1 border border-blue-100/30 overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 bg-[#007AFF] rounded-[20px] opacity-10" style={{ width: '80%' }}></div>
                   <div className="z-10 flex justify-between w-full items-center">
                     <div>
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-0.5">ADIM 2</span>
                       <span className="text-[14px] font-bold text-gray-900">Sepete Ekleme</span>
                     </div>
                     <span className="text-[18px] font-black text-gray-900">4,520</span>
                   </div>
                </div>

                {/* Step 3 */}
                <div className="relative h-16 w-[70%] mx-auto bg-[#FF8D28]/5 rounded-[20px] flex items-center px-6 transition-all duration-500 mt-1 border border-[#FF8D28]/10 overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 bg-[#FF8D28] rounded-[20px] opacity-10" style={{ width: '60%' }}></div>
                   <div className="z-10 flex justify-between w-full items-center">
                     <div>
                       <span className="text-[10px] font-black text-[#FF8D28] uppercase tracking-widest block mb-0.5">ADIM 3</span>
                       <span className="text-[14px] font-bold text-gray-900">Ödeme Adımı</span>
                     </div>
                     <span className="text-[18px] font-black text-gray-900">1,840</span>
                   </div>
                </div>

                {/* Step 4 */}
                <div className="relative h-16 w-[55%] mx-auto bg-[#FF383C]/5 rounded-[20px] flex items-center px-6 transition-all duration-500 mt-1 border border-[#FF383C]/10 overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 bg-[#FF383C] rounded-[20px] opacity-10" style={{ width: '45%' }}></div>
                   <div className="z-10 flex justify-between w-full items-center">
                     <div>
                       <span className="text-[10px] font-black text-[#FF383C] uppercase tracking-widest block mb-0.5">ADIM 4</span>
                       <span className="text-[14px] font-bold text-gray-900">Sipariş Tamamlama</span>
                     </div>
                     <div className="flex flex-col items-end">
                       <span className="text-[18px] font-black text-gray-900">1,619</span>
                       <span className="text-[10px] font-black text-[#FF383C] bg-white px-1.5 py-0.5 rounded-md shadow-sm mt-0.5">-%12 DÜŞÜŞ</span>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* ANALYSIS & AI RECOMMENDATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Loss Reasons */}
             <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-[13px] font-black tracking-widest uppercase text-gray-500 mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Kayıp Nedenleri
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-[13px] font-bold text-gray-700 flex items-center gap-2"><div className="w-2 h-2 bg-[#FF383C] rounded-full"></div> Kargo Ücreti Yüksek</span>
                     <span className="text-[13px] font-black text-gray-900">%45</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[13px] font-bold text-gray-700 flex items-center gap-2"><div className="w-2 h-2 bg-[#FF8D28] rounded-full"></div> Ödeme / 3D Secure Hatası</span>
                     <span className="text-[13px] font-black text-gray-900">%32</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[13px] font-bold text-gray-700 flex items-center gap-2"><div className="w-2 h-2 bg-gray-300 rounded-full"></div> Sepeti Terk (Kararsızlık)</span>
                     <span className="text-[13px] font-black text-gray-900">%23</span>
                   </div>
                </div>
             </div>

             {/* AI Actions */}
             <div className="bg-[#111827] rounded-[24px] p-6 shadow-[0_8px_30px_rgba(17,24,39,0.15)] relative overflow-hidden">
                {/* Glow effects inside the dark card */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#007AFF] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#FF8D28] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
                
                <h3 className="text-[13px] font-black tracking-widest uppercase text-white/70 mb-5 flex items-center gap-2 relative z-10">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  AI Optimizasyon Önerileri
                </h3>
                
                <div className="space-y-3 relative z-10">
                   <button className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                     <span className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest block mb-1">AKSİYON 1</span>
                     <span className="text-[13px] font-bold text-white block mb-2 leading-snug">Sepette kalan 1,840 kişiye %5 indirim SMS&apos;i veya Push Notification gönder.</span>
                     <span className="text-[11px] font-bold text-white/50 flex items-center gap-1 group-hover:text-white transition-colors uppercase tracking-wider">Kampanya Başlat <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span>
                   </button>
                   
                   <button className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                     <span className="text-[10px] font-black text-[#FF8D28] uppercase tracking-widest block mb-1">AKSİYON 2</span>
                     <span className="text-[13px] font-bold text-white block mb-2 leading-snug">Sepet tutarı 1000₺ üzerine "Bugüne Özel Bedava Kargo" bannerı aç.</span>
                     <span className="text-[11px] font-bold text-white/50 flex items-center gap-1 group-hover:text-white transition-colors uppercase tracking-wider">Otomasyonu Kur <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span>
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
