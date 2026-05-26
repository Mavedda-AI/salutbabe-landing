'use client';

import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {PageHeader} from "@/app/dashboard/components/ui/PageHeader";
import {FilterTabs} from "@/app/dashboard/components/ui/FilterBar";
import {HugeiconsIcon} from "@hugeicons/react";
import {AiBrain01Icon, Alert01Icon, Calendar01Icon, Calendar02Icon, Calendar03Icon} from "@hugeicons/core-free-icons";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Bugün");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = Cookies.get("admin_token") || null;
    setToken(t);
  }, []);

  const isValidToken = token && token !== "mock_token";

  const funnelSteps = isValidToken ? [
    { step: 1, label: "Ürün Ziyareti", count: "12,450", colorClass: "text-[#007AFF]", bgClass: "bg-[#007AFF]/5", colorHex: "#007AFF", width: "100%", fillWidth: "100%", dropPercent: null },
    { step: 2, label: "Sepete Ekleme", count: "4,520", colorClass: "text-blue-500", bgClass: "bg-blue-50/50 border border-blue-100/30", colorHex: "#007AFF", width: "85%", fillWidth: "80%", dropPercent: null },
    { step: 3, label: "Ödeme Adımı", count: "1,840", colorClass: "text-[#FF8D28]", bgClass: "bg-[#FF8D28]/5 border border-[#FF8D28]/10", colorHex: "#FF8D28", width: "70%", fillWidth: "60%", dropPercent: null },
    { step: 4, label: "Sipariş Tamamlama", count: "1,619", colorClass: "text-[#FF383C]", bgClass: "bg-[#FF383C]/5 border border-[#FF383C]/10", colorHex: "#FF383C", width: "55%", fillWidth: "45%", dropPercent: "-%12 DÜŞÜŞ" }
  ] : [];

  const lossReasons = isValidToken ? [
    { id: 1, label: "Kargo Ücreti Yüksek", percent: "%45", dotClass: "bg-[#FF383C]" },
    { id: 2, label: "Ödeme / 3D Secure Hatası", percent: "%32", dotClass: "bg-[#FF8D28]" },
    { id: 3, label: "Sepeti Terk (Kararsızlık)", percent: "%23", dotClass: "bg-gray-300" },
  ] : [];

  const aiActions = isValidToken ? [
    { id: 1, title: "AKSİYON 1", titleClass: "text-[#007AFF]", desc: "Sepette kalan 1,840 kişiye %5 indirim SMS'i veya Push Notification gönder.", btn: "Kampanya Başlat" },
    { id: 2, title: "AKSİYON 2", titleClass: "text-[#FF8D28]", desc: "Sepet tutarı 1000₺ üzerine \"Bugüne Özel Bedava Kargo\" bannerı aç.", btn: "Otomasyonu Kur" }
  ] : [];

  const tabs = [
    { id: 'Bugün', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={Calendar01Icon} size={14} /> Bugün</div> },
    { id: '7 Gün', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={Calendar02Icon} size={14} /> 7 Gün</div> },
    { id: '30 Gün', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={Calendar03Icon} size={14} /> 30 Gün</div> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 text-gray-900 font-sans">
       <PageHeader 
         title="İleri Analitik" 
         description="Dönüşüm Hunisi & Optimizasyon" 
         actions={
           <div className="w-full sm:w-auto">
             <FilterTabs
               tabs={tabs}
               activeTab={timeRange}
               onChange={setTimeRange}
             />
           </div>
         }
       />

       <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 mt-2">
          
          {/* THE FUNNEL VISUALIZATION */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-[15px] font-black flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]"></div>
                 Checkout Hunisi (Checkout Funnel)
               </h2>
               {isValidToken && (
                 <span className="px-3 py-1 bg-[#FF383C]/10 text-[#FF383C] rounded-full text-[10px] font-black tracking-wider animate-pulse">
                   KRİTİK DÜŞÜŞ: %12
                 </span>
               )}
             </div>

             <div className="flex flex-col gap-2 relative">
                {funnelSteps.length > 0 ? funnelSteps.map((step, idx) => (
                   <div key={idx} className={`relative h-16 mx-auto rounded-[20px] flex items-center px-6 transition-all duration-500 mt-1 overflow-hidden ${step.bgClass}`} style={{ width: step.width }}>
                      <div className="absolute left-0 top-0 bottom-0 rounded-[20px] opacity-10" style={{ width: step.fillWidth, backgroundColor: step.colorHex }}></div>
                      <div className="z-10 flex justify-between w-full items-center">
                        <div>
                          <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${step.colorClass}`}>ADIM {step.step}</span>
                          <span className="text-[14px] font-bold text-gray-900">{step.label}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[18px] font-black text-gray-900">{step.count}</span>
                          {step.dropPercent && (
                             <span className="text-[10px] font-black text-[#FF383C] bg-white px-1.5 py-0.5 rounded-md shadow-sm mt-0.5">{step.dropPercent}</span>
                          )}
                        </div>
                      </div>
                   </div>
                )) : (
                   <div className="py-8 text-center text-gray-500 text-sm font-medium">
                     Görüntülenecek huni verisi bulunamadı.
                   </div>
                )}
             </div>
          </div>

          {/* ANALYSIS & AI RECOMMENDATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Loss Reasons */}
             <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-[13px] font-black tracking-widest uppercase text-gray-500 mb-5 flex items-center gap-2">
                  <HugeiconsIcon icon={Alert01Icon} size={16} />
                  Kayıp Nedenleri
                </h3>
                <div className="space-y-4">
                   {lossReasons.length > 0 ? lossReasons.map((reason) => (
                      <div key={reason.id} className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${reason.dotClass}`}></div> {reason.label}
                        </span>
                        <span className="text-[13px] font-black text-gray-900">{reason.percent}</span>
                      </div>
                   )) : (
                      <div className="py-4 text-center text-gray-500 text-sm font-medium">
                        Kayıp verisi bulunamadı.
                      </div>
                   )}
                </div>
             </div>

             {/* AI Actions */}
             <div className="bg-[#111827] rounded-[24px] p-6 shadow-[0_8px_30px_rgba(17,24,39,0.15)] relative overflow-hidden">
                {/* Glow effects inside the dark card */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#007AFF] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#FF8D28] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
                
                <h3 className="text-[13px] font-black tracking-widest uppercase text-white/70 mb-5 flex items-center gap-2 relative z-10">
                  <HugeiconsIcon icon={AiBrain01Icon} size={16} />
                  AI Optimizasyon Önerileri
                </h3>
                
                <div className="space-y-3 relative z-10">
                   {aiActions.length > 0 ? aiActions.map((action) => (
                      <button key={action.id} className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                        <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${action.titleClass}`}>{action.title}</span>
                        <span className="text-[13px] font-bold text-white block mb-2 leading-snug">{action.desc}</span>
                        <span className="text-[11px] font-bold text-white/50 flex items-center gap-1 group-hover:text-white transition-colors uppercase tracking-wider">
                           {action.btn} <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </button>
                   )) : (
                      <div className="py-4 text-center text-white/50 text-sm font-medium">
                        AI önerisi bulunamadı.
                      </div>
                   )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
