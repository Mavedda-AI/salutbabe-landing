"use client";
import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
import VisitorAnalyticsModal from "../../../components/VisitorAnalyticsModal";

export default function SysopDashboard() {
  const router = useRouter();
  const { theme } = useThemeLanguage();
  const [userRole, setUserRole] = useState<'founder' | 'partner'>('founder');

  // Filter States
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filterProduct, setFilterProduct] = useState("Tüm Ürünler");
  const [filterCategory, setFilterCategory] = useState("Tüm Kategoriler");
  const [filterTop3, setFilterTop3] = useState("Günlük");
  const [filterVisitor, setFilterVisitor] = useState("Günlük");
  const [filterYear, setFilterYear] = useState("2026");
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);

  // --- INTELLIGENCE LAYER STATES ---
  const [showFunnel, setShowFunnel] = useState(false);
  const [channelTab, setChannelTab] = useState<'sales' | 'attribution'>('sales');
  const [showLiquidity, setShowLiquidity] = useState(false);
  const [activityTab, setActivityTab] = useState<'all' | 'realtime'>('all');
  const [showSupplyDemand, setShowSupplyDemand] = useState(false);

  // Role check simulation for Founder specific views
  const isFounder = true; // In real app, check from user roles

  const alerts = [
    { type: 'CRITICAL', text: 'Kargo gecikme oranlarında ani artış (>15%)', action: 'Kargoları İncele', link: '/dashboard/sysop/shipping-management?alert=cargo_delay&carrier=mng' },
    { type: 'WARNING', text: 'Top satıcılardan 2 kişi 7 gündür inaktif', action: 'Satıcılarla İletişime Geç', link: '/dashboard/sysop/user-management?role=seller&status=inactive_7d' },
    { type: 'INFO', text: 'Dönüşüm hunisinde Checkout aşamasında %12 düşüş', action: 'Funnel Detay', customAction: () => setShowFunnel(true) }
  ];

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        const types = u?.userType || [];
        setUserRole((Array.isArray(types) ? types : [types]).some((t: string) => t === 'FOUNDER' || t === 'SYSOP') ? 'founder' : 'partner');
      }
    } catch {}
  }, []);

  const isDark = theme === 'dark';
  
  // Nexadash specific design tokens
  const cardClass = `rounded-[24px] border bg-white dark:bg-[#111827] ${isDark ? 'border-white/5 shadow-2xl' : 'border-[#F3F4F6] shadow-[0_4px_24px_rgba(0,0,0,0.04)]'}`;
  const textTitle = `text-[10px] md:text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`;
  const textValue = `text-[24px] md:text-[32px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`;
  const iconRight = `hidden md:block w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-300'} ml-auto transition-colors`;
  const badgeGreen = `flex items-center gap-1 bg-[#F0FDF4] text-[#16A34A] dark:bg-[#16A34A]/10 dark:text-[#4ADE80] px-2 py-0.5 rounded text-[11px] font-bold`;
  const badgeRed = `flex items-center gap-1 bg-[#FEF2F2] text-[#DC2626] dark:bg-[#DC2626]/10 dark:text-[#F87171] px-2 py-0.5 rounded text-[11px] font-bold`;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in pb-12 font-sans">
      
      {/* Role Switcher */}
      <div className="flex items-center justify-end gap-2 mb-4">
         <span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Görünüm:</span>
         <button onClick={() => setUserRole('founder')} className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${userRole === 'founder' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-500'}`}>Kurucu</button>
         <button onClick={() => setUserRole('partner')} className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${userRole === 'partner' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-500'}`}>Operasyon</button>
      </div>

      {userRole === 'founder' ? (
        // ==========================================
        // FOUNDER L0 DASHBOARD (MUSTAFA) - NEXADASH CLONE
        // ==========================================
        <div className="space-y-6">

          {/* 11. GLOBAL ALERT SYSTEM */}
          <div className="flex flex-col gap-2 mb-6">
            {alerts.map((alert, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border ${
                alert.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' :
                alert.type === 'WARNING' ? 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400' :
                'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
              }`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                   <div className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider text-white ${
                     alert.type === 'CRITICAL' ? 'bg-red-500' : alert.type === 'WARNING' ? 'bg-orange-500' : 'bg-blue-500'
                   }`}>{alert.type}</div>
                   <span className="text-[12px] font-bold">{alert.text}</span>
                </div>
                <button onClick={() => alert.link ? router.push(alert.link) : alert.customAction?.()} className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-colors ${
                  alert.type === 'CRITICAL' ? 'border-red-500/30 hover:bg-red-500/10' :
                  alert.type === 'WARNING' ? 'border-orange-500/30 hover:bg-orange-500/10' :
                  'border-blue-500/30 hover:bg-blue-500/10'
                }`}>{alert.action}</button>
              </div>
            ))}
          </div>
          
          {/* ROW 1: 4 STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
            <div onClick={() => router.push('/dashboard/sysop/payout-management')} className={`${cardClass} p-4 md:p-5 relative overflow-hidden group`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  NET GELİR (TAKE RATE)
                </h3>
                <svg onClick={() => router.push('/dashboard/sysop/payout-management')} className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>$1,256.940</h2>
                <span className="text-[12px] font-bold text-green-500">+$456</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>↗ 12%</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>vs geçen ay</span>
              </div>
            </div>

            <div className={`${cardClass} flex flex-col p-4 md:p-5 relative`}>
              <div onClick={() => router.push('/dashboard/sysop/order-management')} className="flex items-center mb-4 cursor-pointer">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  TOPLAM SİPARİŞ
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                 <div className="flex items-baseline gap-2">
                   <h2 className={textValue}>6,432</h2>
                   <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sipariş</span>
                 </div>
                 {isFounder && (
                   <button onClick={(e) => { e.stopPropagation(); setShowFunnel(!showFunnel); }} className={`px-2 py-1 rounded border text-[10px] font-black transition-colors ${showFunnel ? 'bg-primary text-white border-primary' : isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                     FUNNEL {showFunnel ? 'GİZLE' : 'GÖR'}
                   </button>
                 )}
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeRed}>↘ 1.8%</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Ürün satışı</span>
              </div>
              
              {/* CONVERSION FUNNEL (Collapsible Layer) */}
              {isFounder && showFunnel && (
                <div className={`mt-4 pt-4 border-t animate-fade-in ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                   <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3">Dönüşüm Hunisi</p>
                   <div className="flex flex-col gap-2 relative">
                      {/* Vertical line connector */}
                      <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
                      
                      {[{step: 'Görüntüleme', val: '45.2K', drop: null}, {step: 'Sepete Ekleme', val: '12.8K', drop: '-71%'}, {step: 'Ödeme Adımı', val: '8.4K', drop: '-34%'}, {step: 'Satın Alma', val: '6.4K', drop: '-23%'}].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 relative z-10">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${isDark ? 'bg-[#121214] border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                             {i+1}
                           </div>
                           <div className="flex-1 flex justify-between items-center bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-transparent dark:border-white/5">
                             <span className="text-[11px] font-bold">{item.step}</span>
                             <div className="flex items-center gap-2">
                               {item.drop && <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-1 rounded">{item.drop}</span>}
                               <span className="text-[11px] font-black">{item.val}</span>
                             </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            <div onClick={() => router.push('/dashboard/sysop/user-management')} className={`${cardClass} p-4 md:p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  TOPLAM KULLANICI
                </h3>
                <svg onClick={() => router.push('/dashboard/sysop/user-management')} className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>173,247</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kişi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>↗ 1.8%</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Yeni kullanıcı</span>
              </div>
            </div>

            <div onClick={() => router.push('/dashboard/sysop/live-room-management')} className={`${cardClass} p-4 md:p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  SESLİ ODA ETKİLEŞİMİ
                </h3>
                <svg onClick={() => router.push('/dashboard/sysop/live-room-management')} className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>3,247</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeRed}>↘ 2.8%</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>vs geçen ay</span>
              </div>
            </div>
          </div>

          {/* ROW 1.5: INTELLIGENCE CARDS (FOUNDER ONLY) */}
          {isFounder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              
              {/* UNIT ECONOMICS */}
              <div className={`${cardClass} p-4 md:p-5 flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={textTitle}>
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    BİRİM EKONOMİSİ
                  </h3>
                  <div className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-black tracking-wider">FOUNDER ONLY</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                   <div>
                     <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Sipariş Başı Net Kâr</p>
                     <p className={`text-[20px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₺124.50</p>
                     <p className="text-[10px] font-bold text-green-500 mt-1">Hedefin %14 üzerinde</p>
                   </div>
                   <div>
                     <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Sepet Ortalaması (AOV)</p>
                     <p className={`text-[20px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₺485.00</p>
                   </div>
                   <div>
                     <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Ort. Komisyon</p>
                     <p className={`text-[16px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₺168.00 <span className="text-[10px] font-bold text-gray-500 font-normal">/ sp.</span></p>
                   </div>
                   <div>
                     <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Ort. Kargo Maliyeti</p>
                     <p className={`text-[16px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₺43.50 <span className="text-[10px] font-bold text-gray-500 font-normal">/ sp.</span></p>
                   </div>
                </div>
                
                <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                  <svg className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400">Kargo baremi stratejisi kazandırıyor.</p>
                    <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70 mt-0.5">Sepet ortalaması yüksek olduğu için kargo maliyeti komisyon gelirini tolere ediyor.</p>
                  </div>
                </div>
              </div>

              {/* SELLER HEALTH */}
              <div className={`${cardClass} p-4 md:p-5 flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={textTitle}>
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    SATICI SAĞLIĞI
                  </h3>
                  <button className="text-[10px] font-black px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">TÜMÜ</button>
                </div>
                
                <div className="flex items-end justify-between mb-6">
                  <div className="flex gap-4">
                     <div>
                       <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Aktif Satıcı</p>
                       <p className={`text-[20px] font-black text-green-500`}>1,245</p>
                     </div>
                     <div>
                       <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>İnaktif (&gt;7 Gün)</p>
                       <p className={`text-[20px] font-black text-orange-500`}>84</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Top Satıcı (&gt;15K ₺)</p>
                     <p className={`text-[20px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>32</p>
                  </div>
                </div>

                <div className={`mt-auto p-3 rounded-lg flex items-start justify-between gap-2 ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'} border border-orange-500/20`}>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 animate-ping"></div>
                    <div>
                      <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400">Risk: İnaktif Top Satıcı</p>
                      <p className="text-[10px] text-orange-600/70 dark:text-orange-400/70 mt-0.5">Aylık GMV'si &gt;15K ₺ olan 2 satıcı son 7 gündür sisteme girmedi.</p>
                    </div>
                  </div>
                  <button onClick={() => router.push('/dashboard/sysop/user-management?role=seller&status=inactive_7d')} className="text-[9px] font-black px-2 py-1 bg-orange-500 text-white rounded mt-1 shrink-0 hover:bg-orange-600 transition-colors">AKSİYON</button>
                </div>
              </div>

            </div>
          )}

          {/* ROW 2: CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CHANNEL PERFORMANCE (1/3) */}
            <div onClick={() => router.push('/dashboard/sysop/store-management')} className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                  KANAL PERFORMANSI
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setChannelTab('sales'); }} className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${channelTab === 'sales' ? 'bg-[#111827] dark:bg-white text-white dark:text-black' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>SATIŞ</button>
                  <button onClick={(e) => { e.stopPropagation(); setChannelTab('attribution'); }} className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${channelTab === 'attribution' ? 'bg-primary text-white' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>ATTRIBUTION</button>
                </div>
              </div>
              
              {channelTab === 'sales' ? (
                <>
                  {/* Half Donut SVG Exact Replica */}
                  <div className="relative w-full flex justify-center items-end mb-8 mt-2 h-[120px]">
                     <svg viewBox="0 0 200 100" className="w-[85%] h-full overflow-visible">
                       <defs>
                         <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                           <stop offset="0%" stopColor="#111827" stopOpacity="1" />
                           <stop offset="100%" stopColor="#4B5563" stopOpacity="1" />
                         </linearGradient>
                         <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                           <stop offset="0%" stopColor="#D1D5DB" stopOpacity="1" />
                           <stop offset="100%" stopColor="#9CA3AF" stopOpacity="1" />
                         </linearGradient>
                       </defs>
                       {/* Background track segmented */}
                       {[...Array(14)].map((_, i) => (
                         <path key={i} d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke={isDark ? '#374151' : '#E5E7EB'} strokeWidth="16" strokeLinecap="round" strokeDasharray="14 300" strokeDashoffset={-i * 15.7} />
                       ))}
                       {/* Active track segmented (left side dark) */}
                       {[...Array(5)].map((_, i) => (
                         <path key={`act-${i}`} d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="url(#grad1)" strokeWidth="16" strokeLinecap="round" strokeDasharray="14 300" strokeDashoffset={-i * 15.7} className="transition-all duration-1000 ease-out" />
                       ))}
                       {/* Middle track (gray) */}
                       {[...Array(6)].map((_, i) => (
                         <path key={`mid-${i}`} d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="url(#grad2)" strokeWidth="16" strokeLinecap="round" strokeDasharray="14 300" strokeDashoffset={-(i+5) * 15.7} className="transition-all duration-1000 ease-out" />
                       ))}
                     </svg>
                    <div className="absolute bottom-0 left-0 w-full text-center flex flex-col items-center">
                      <h2 className="text-[22px] font-black leading-tight text-[#111827] dark:text-white">16,432</h2>
                      <p className={`text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ürün Satışı</p>
                    </div>
                  </div>

                  <div className="space-y-5 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#111827] dark:bg-white"></div>
                        <div>
                          <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Pazaryeri (Standart)</p>
                          <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>5.762 Satış <span className="text-green-500 ml-1">+1.8%</span></p>
                        </div>
                      </div>
                      <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>$1,378.975</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <div>
                          <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Sesli Odalar</p>
                          <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>6.843 Satış <span className="text-red-500 ml-1">-2.8%</span></p>
                        </div>
                      </div>
                      <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>$778,975</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                          <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Keşfet</p>
                          <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>2.123 Satış <span className="text-red-500 ml-1">-2.8%</span></p>
                        </div>
                      </div>
                      <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>$778,975</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col animate-fade-in pt-4">
                   <p className={`text-[11px] font-bold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Zamana bağlı (Time-Decay) ciro katkı modeli</p>
                   
                   <div className="space-y-4 flex-1 flex flex-col justify-center">
                      {[
                        {n: 'Keşfet (Community)', p: '42%', t: '↗ 8%', color: 'bg-primary'},
                        {n: 'Arama (Search)', p: '28%', t: '↘ 2%', color: 'bg-blue-500'},
                        {n: 'Canlı Odalar', p: '20%', t: '↗ 15%', color: 'bg-green-500'},
                        {n: 'Favoriler', p: '10%', t: '↘ 4%', color: 'bg-orange-500'}
                      ].map((ch, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                           <div className="flex items-center justify-between">
                              <span className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{ch.n}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-500">{ch.t}</span>
                                <span className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{ch.p}</span>
                              </div>
                           </div>
                           <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${ch.color} rounded-full`} style={{width: ch.p}}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   <button className="w-full py-2.5 mt-6 rounded-lg bg-gray-50 dark:bg-white/5 text-[10px] font-black border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                      DETAYLI RAPOR
                   </button>
                </div>
              )}
            </div>

            {/* AVERAGE SALES (2/3) */}
            <div onClick={() => router.push('/dashboard/sysop/payout-management')} className={`lg:col-span-2 ${cardClass} p-6 flex flex-col`}>
              {/* Top Header: Title (Left) and Filters (Right) */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  ORTALAMA SATIŞLAR
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 relative">
                  {/* Product Filter */}
                  <div className="relative flex-1 min-w-[120px] sm:flex-none">
                    <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'product' ? null : 'product'); }} className={`w-full px-3 py-2 sm:py-1.5 rounded-lg border text-[11px] font-bold flex justify-between items-center gap-2 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/5' : 'border-gray-200 text-[#374151] bg-white hover:bg-gray-50'}`}>
                      <span className="truncate">{filterProduct}</span> <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {activeDropdown === 'product' && (
                      <div className={`absolute top-full mt-1 left-0 w-full min-w-[140px] sm:right-0 sm:left-auto rounded-lg shadow-xl z-50 overflow-hidden border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`}>
                        {['Tüm Ürünler', 'Bebek Ayakkabısı', 'Ceketler', 'Oyuncaklar'].map(opt => (
                          <div key={opt} onClick={(e) => { e.stopPropagation(); setFilterProduct(opt); setActiveDropdown(null); }} className={`px-3 py-2.5 text-[11px] font-bold cursor-pointer transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-50 text-[#374151]'}`}>{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Category Filter */}
                  <div className="relative flex-1 min-w-[120px] sm:flex-none">
                    <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'category' ? null : 'category'); }} className={`w-full px-3 py-2 sm:py-1.5 rounded-lg border text-[11px] font-bold flex justify-between items-center gap-2 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/5' : 'border-gray-200 text-[#374151] bg-white hover:bg-gray-50'}`}>
                      <span className="truncate">{filterCategory}</span> <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {activeDropdown === 'category' && (
                      <div className={`absolute top-full mt-1 left-0 w-full min-w-[140px] sm:right-0 sm:left-auto rounded-lg shadow-xl z-50 overflow-hidden border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`}>
                        {['Tüm Kategoriler', 'Erkek Giyim', 'Kız Giyim', 'Aksesuarlar'].map(opt => (
                          <div key={opt} onClick={(e) => { e.stopPropagation(); setFilterCategory(opt); setActiveDropdown(null); }} className={`px-3 py-2.5 text-[11px] font-bold cursor-pointer transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-50 text-[#374151]'}`}>{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Year Filter */}
                  <div className="relative min-w-[80px] sm:flex-none">
                    <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'year' ? null : 'year'); }} className={`w-full px-3 py-2 sm:py-1.5 rounded-lg border text-[11px] font-bold flex justify-between items-center gap-2 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/5' : 'border-gray-200 text-[#374151] bg-white hover:bg-gray-50'}`}>
                      <span className="truncate">{filterYear}</span> <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {activeDropdown === 'year' && (
                      <div className={`absolute top-full mt-1 right-0 w-full min-w-[100px] rounded-lg shadow-xl z-50 overflow-hidden border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`}>
                        {['2026', '2025', '2024'].map(opt => (
                          <div key={opt} onClick={(e) => { e.stopPropagation(); setFilterYear(opt); setActiveDropdown(null); }} className={`px-3 py-2.5 text-[11px] font-bold cursor-pointer transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-50 text-[#374151]'}`}>{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={(e) => { e.stopPropagation(); router.push('/dashboard/sysop/payout-management'); }} className={`p-2 sm:p-1.5 rounded-lg border flex items-center justify-center transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/5' : 'border-gray-200 text-[#374151] bg-white hover:bg-gray-50'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></button>
                </div>
              </div>
              
              {/* Middle: Value & Liquidity Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-4">
                 <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3">
                     <h2 className={`text-[36px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>$1,389.652</h2>
                     <span className="flex items-center gap-1 bg-[#F0FDF4] text-[#16A34A] px-2.5 py-1 rounded text-[12px] font-bold">↗ 1.8%</span>
                   </div>
                   
                   {/* Legend (Moved up) */}
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div><span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</span></div>
                     <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]"></div><span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Target</span></div>
                   </div>
                 </div>

                 <div className="flex flex-col items-end gap-3">
                   {isFounder && (
                     <button onClick={(e) => { e.stopPropagation(); setShowLiquidity(!showLiquidity); }} className={`px-3 py-1.5 rounded border text-[10px] font-black transition-colors ${showLiquidity ? 'bg-[#111827] dark:bg-white text-white dark:text-black border-transparent' : isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                       LİKİDİTE METRİKLERİ {showLiquidity ? 'GİZLE' : 'GÖR'}
                     </button>
                   )}
                   <div className={`text-[11px] font-bold flex flex-col sm:flex-row items-end sm:items-center sm:gap-1 mt-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Net Sales : <span className="text-[#16A34A] font-black sm:ml-1 flex items-center gap-1">$800.67 <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full"></div></span></div>
                 </div>
              </div>
              
              {isFounder && showLiquidity && (
                <div className={`mb-6 p-4 rounded-xl border animate-fade-in ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                   <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-4">Ürün Likidite ve Hız Analizi</p>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>İlk Etkileşim Süresi</p>
                        <div className="flex items-end gap-2">
                          <p className={`text-[18px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>14 Saat</p>
                          <p className="text-[10px] font-bold text-[#16A34A] mb-1">Hedef: {'<'}24s</p>
                        </div>
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Satışa Dönüşme Süresi</p>
                        <div className="flex items-end gap-2">
                          <p className={`text-[18px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>4.2 Gün</p>
                          <p className="text-[10px] font-bold text-[#16A34A] mb-1">Hedef: 3-14g</p>
                        </div>
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase mb-1`}>Listeleme-Satış Oranı</p>
                        <div className="flex items-end gap-2">
                          <p className={`text-[18px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>%22.4</p>
                          <p className="text-[10px] font-bold text-[#16A34A] mb-1">Sağlıklı ({'>'}%18)</p>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Exact Line Chart SVG Implementation (Thin style) */}
              <div className="flex-1 min-h-[220px] w-full relative mt-4">
                 {/* Background Grid Lines (Horizontal) */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                    {['$25k', '$20k', '$15k', '$10k'].map((label, i) => (
                      <div key={i} className={`w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}>
                        <span className={`-mt-2.5 pr-2 text-[10px] font-bold ${isDark ? 'bg-[#121214] text-gray-500' : 'bg-white text-gray-400'}`}>{label}</span>
                      </div>
                    ))}
                 </div>

                 {/* Vertical Grid Lines */}
                 <div className="absolute inset-0 flex justify-between px-10 pointer-events-none pb-6">
                   {[...Array(7)].map((_, i) => (
                     <div key={i} className={`h-full border-l border-dashed ${isDark ? 'border-white/5' : 'border-gray-200'} w-px`}></div>
                   ))}
                 </div>

                 {/* Blue Bar Highlight (April) */}
                 <div className="absolute left-[54.5%] bottom-[15%] w-8 h-[60%] bg-gradient-to-t from-blue-500/0 to-blue-500/20 dark:from-blue-500/0 dark:to-blue-500/30 rounded-t-lg"></div>

                 {/* Charts */}
                 <svg className="absolute inset-0 w-full h-[85%] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <defs>
                     <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                       <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.2" />
                     </filter>
                   </defs>
                   {/* Target Line (Gray) */}
                   <polyline points="5,40 20,35 35,38 50,30 65,35 80,30 95,25" fill="none" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   {/* Revenue Line (Blue) */}
                   <path d="M 5,60 L 20,80 L 35,70 L 50,40 L 65,45 L 80,50 L 95,85" fill="none" stroke="#3B82F6" strokeWidth="2" filter="url(#glow)" />
                   
                   {/* Data Points Target */}
                   <circle cx="5" cy="40" r="1.5" fill="#FFF" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   <circle cx="20" cy="35" r="1.5" fill="#FFF" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   <circle cx="35" cy="38" r="1.5" fill="#FFF" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   <circle cx="50" cy="30" r="1.5" fill="#FFF" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   <circle cx="65" cy="35" r="1.5" fill="#FFF" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   <circle cx="80" cy="30" r="1.5" fill="#FFF" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   <circle cx="95" cy="25" r="1.5" fill="#FFF" stroke={isDark ? "#374151" : "#D1D5DB"} strokeWidth="1.5" />
                   
                   {/* Data Points Revenue */}
                   <circle cx="5" cy="60" r="1.5" fill="#FFF" stroke="#3B82F6" strokeWidth="1.5" />
                   <circle cx="20" cy="80" r="1.5" fill="#FFF" stroke="#3B82F6" strokeWidth="1.5" />
                   <circle cx="35" cy="70" r="1.5" fill="#FFF" stroke="#3B82F6" strokeWidth="1.5" />
                   <circle cx="50" cy="40" r="2" fill="#3B82F6" stroke="#FFF" strokeWidth="1.5" /> {/* Highlight point */}
                   <circle cx="65" cy="45" r="1.5" fill="#FFF" stroke="#3B82F6" strokeWidth="1.5" />
                   <circle cx="80" cy="50" r="1.5" fill="#FFF" stroke="#3B82F6" strokeWidth="1.5" />
                   <circle cx="95" cy="85" r="1.5" fill="#FFF" stroke="#3B82F6" strokeWidth="1.5" />
                 </svg>
                 
                 {/* Dark Tooltip */}
                 <div className="absolute left-[56%] top-[25%] bg-[#1A1D1F] text-white p-3.5 rounded-[12px] shadow-2xl z-10 min-w-[140px]">
                   <p className="text-[11px] font-bold text-gray-300 mb-2">Nisan 2026</p>
                   <div className="flex justify-between items-center mb-1 text-[11px]">
                     <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>Hedef</span>
                     <span className="font-black">$22,000</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px]">
                     <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>Gelir</span>
                     <span className="font-black text-white">$20,000</span>
                   </div>
                 </div>

                 {/* X Axis */}
                 <div className={`absolute bottom-0 w-full flex justify-between px-2 sm:px-6 text-[10px] sm:text-[11px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                   <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span>
                 </div>
              </div>
            </div>
          </div>

          {/* ROW 3: LISTS & STRATEGY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* RECENT ACTIVITY */}
            <div onClick={() => router.push('/dashboard/sysop/product-management')} className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  SON AKTİVİTELER
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center p-0.5 rounded-lg border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                    <button onClick={(e) => { e.stopPropagation(); setActivityTab('all'); }} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activityTab === 'all' ? (isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-800 shadow-sm') : 'text-gray-500'}`}>Tümü</button>
                    <button onClick={(e) => { e.stopPropagation(); setActivityTab('realtime'); }} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${activityTab === 'realtime' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500'}`}><div className={`w-1.5 h-1.5 rounded-full ${activityTab === 'realtime' ? 'bg-white' : 'bg-red-500'} animate-pulse`}></div> Canlı</button>
                  </div>
                  <button onClick={() => router.push('/dashboard/sysop/product-management')} className={`p-1.5 rounded-lg border flex items-center gap-2 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/10' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></button>
                </div>
              </div>
              
              <div className="space-y-6">
                {activityTab === 'all' ? (
                  <>
                    <div>
                       <p className={`text-[12px] font-bold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Çıkan Ürünler</p>
                       <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-xl">🧥</div>
                             <div>
                                <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Kırmızı Ceket</p>
                                <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Adet: 2 <span className="text-red-500 ml-1">5 dakika önce</span></p>
                             </div>
                          </div>
                          <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>$1,500</span>
                       </div>
                    </div>

                    <div>
                       <p className={`text-[12px] font-bold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Giren Ürünler</p>
                       <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xl">🧥</div>
                             <div>
                                <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Siyah Ceket</p>
                                <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Adet: 2 <span className="text-red-500 ml-1">5 dakika önce</span></p>
                             </div>
                          </div>
                          <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>$1,500</span>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0 animate-ping"></div>
                      <div className="flex-1">
                        <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Yeni Satış Gerçekleşti</p>
                        <p className={`text-[10px] font-medium text-gray-500`}>"Deri Çanta" ₺2,450 tutarında satıldı.</p>
                      </div>
                      <span className="text-[9px] font-black text-gray-400">1 dk önce</span>
                    </div>
                    
                    <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-ping"></div>
                      <div className="flex-1">
                        <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Başarısız Ödeme</p>
                        <p className={`text-[10px] font-medium text-gray-500`}>Kullanıcı X ödeme adımında hata aldı. (Yetersiz bakiye)</p>
                      </div>
                      <span className="text-[9px] font-black text-gray-400">3 dk önce</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 animate-ping"></div>
                      <div className="flex-1">
                        <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Yeni Kullanıcı</p>
                        <p className={`text-[10px] font-medium text-gray-500`}>Zeynep Y. sisteme kayıt oldu.</p>
                      </div>
                      <span className="text-[9px] font-black text-gray-400">5 dk önce</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TOP PRODUCTS & SUPPLY/DEMAND */}
            <div onClick={() => router.push('/dashboard/sysop/shipping-management')} className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  TOP ÜRÜNLER & BÖLGE
                </h3>
                <div className="flex items-center gap-2 relative">
                  {isFounder && (
                    <button onClick={(e) => { e.stopPropagation(); setShowSupplyDemand(!showSupplyDemand); }} className={`px-2 py-1 rounded text-[9px] font-black transition-colors ${showSupplyDemand ? 'bg-[#111827] dark:bg-white text-white dark:text-black' : isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {showSupplyDemand ? 'BÖLGELER' : 'ZEKA L1'}
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); router.push('/dashboard/sysop/shipping-management'); }} className={`p-1.5 rounded-lg border flex items-center gap-1 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/10' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
                </div>
              </div>

              {!showSupplyDemand ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                     <span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bugünün Toplam Satışı :</span>
                     <span className="text-[11px] font-black text-green-500 flex items-center gap-1">318 adet <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div></span>
                  </div>

              <div className="flex-1 flex items-end justify-between pb-6 pt-4 relative min-h-[160px]">
                 {/* Y Axis */}
                 <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold pb-6">
                    <span>200</span><span>160</span><span>120</span><span>80</span><span>40</span><span>0</span>
                 </div>
                 
                 {/* Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pl-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>
                    ))}
                 </div>
                 
                 <div className="w-full h-full flex justify-around items-end pl-8 z-10 gap-2">
                   {/* Bar 1: Black striped */}
                   <div className="w-full max-w-[60px] h-[90%] relative flex flex-col justify-end group">
                      <div className="absolute inset-0 bg-[#2E2E3A] dark:bg-white rounded-t-lg overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)' }}></div>
                      <span className="relative z-10 text-[11px] font-black text-white dark:text-black mb-2 ml-2">180</span>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kadıköy</span>
                   </div>
                   {/* Bar 2: Gray striped */}
                   <div className="w-full max-w-[60px] h-[50%] relative flex flex-col justify-end">
                      <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded-t-lg overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)' }}></div>
                      <span className="relative z-10 text-[11px] font-black text-[#111827] dark:text-white mb-2 ml-2">87</span>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Şişli</span>
                   </div>
                   {/* Bar 3: Light gray striped */}
                   <div className="w-full max-w-[60px] h-[30%] relative flex flex-col justify-end">
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-t-lg overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)' }}></div>
                      <span className="relative z-10 text-[11px] font-black text-[#111827] dark:text-white mb-2 ml-2">56</span>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Beşiktaş</span>
                   </div>
                  </div>
               </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col gap-4 animate-fade-in">
                  {/* SUPPLY / DEMAND INSIGHTS */}
                  <div onClick={() => router.push('/dashboard/sysop/product-management?category=deri-ceket')} className={`p-3 rounded-xl border cursor-pointer hover:scale-[1.02] transition-transform ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-gray-50 border-gray-100 hover:border-blue-500/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Deri Ceketler</p>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black">Yüksek Talep / Düşük Arz</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                      <span>Aranma Hacmi: <strong className={isDark ? 'text-gray-300' : 'text-gray-700'}>4,500/hft</strong></span>
                      <span>Listeleme: <strong className="text-orange-500">Sadece 4 adet</strong></span>
                    </div>
                    <p className="text-[9px] mt-2 text-blue-500 font-bold flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Fırsat: Tıkla, satıcılara push bildirimi gönder.</p>
                  </div>

                  {/* PRICING INTELLIGENCE */}
                  <div onClick={() => router.push('/dashboard/sysop/product-management?search=vintage-gozluk')} className={`p-3 rounded-xl border cursor-pointer hover:scale-[1.02] transition-transform ${isDark ? 'bg-white/5 border-white/10 hover:border-orange-500/50' : 'bg-gray-50 border-gray-100 hover:border-orange-500/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Vintage Gözlük #402</p>
                      <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[9px] font-black">Fiyat Şişkinliği (&gt;130%)</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                      <span>Ort. Satılan Fiyat: <strong className={isDark ? 'text-gray-300' : 'text-gray-700'}>₺450</strong></span>
                      <span>Mevcut Listeleme: <strong className="text-orange-500">₺620</strong></span>
                    </div>
                    <p className="text-[9px] mt-2 text-orange-500 font-bold flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Uyarı: Likidite düşüşü öngörülüyor. İncelemek için tıkla.</p>
                  </div>
                </div>
              )}
            </div>

            {/* TOTAL VISITOR HEATMAP */}
            <div onClick={() => setIsVisitorModalOpen(true)} className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  TOPLAM ZİYARETÇİ
                </h3>
                <div className="flex items-center gap-2 relative">
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'visitor' ? null : 'visitor'); }} className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/10' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}>
                      {filterVisitor} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {activeDropdown === 'visitor' && (
                      <div className={`absolute top-full mt-1 right-0 w-24 rounded-lg shadow-xl z-50 overflow-hidden border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`}>
                        {['Günlük', 'Haftalık', 'Aylık'].map(opt => (
                          <div key={opt} onClick={(e) => { e.stopPropagation(); setFilterVisitor(opt); setActiveDropdown(null); }} className={`px-3 py-2 text-[10px] font-bold cursor-pointer transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-50 text-[#374151]'}`}>{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsVisitorModalOpen(true); }} className={`p-1.5 rounded-lg border flex items-center gap-1 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/10' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <h2 className={textValue}>3,247</h2>
                <span className={badgeGreen}>↗ 1.8%</span>
                <span className={`text-[12px] font-bold ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ziyaretçi</span>
              </div>

              <div className="space-y-2 mb-6">
                {[{t:'Pazaryeri:', v:'300 Kişi', c:'bg-red-500'}, {t:'Web Sitesi:', v:'250 Kişi', c:'bg-green-500'}, {t:'Canlı Odalar:', v:'400 Kişi', c:'bg-green-500'}].map((s,i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.t}</span>
                    <span className={`font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{s.v} <div className={`w-1.5 h-1.5 rounded-full ${s.c}`}></div></span>
                  </div>
                ))}
              </div>

              {/* Heatmap Layout Exact Replica */}
              <div className="flex mt-auto">
                 <div className="flex flex-col gap-2 justify-end pr-4 text-[9px] font-bold text-gray-400 pb-1">
                    <span>09.00 - 12.00</span>
                    <span>12.00 - 15.00</span>
                    <span>15.00 - 18.00</span>
                 </div>
                 <div className="flex-1 flex flex-col gap-2 relative">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                      <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span>
                    </div>
                    {/* Rows */}
                    <div className="flex justify-between gap-1">
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10 relative">
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-[#111827] text-white text-[9px] rounded font-bold whitespace-nowrap z-10 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> 82</div>
                       </div>
                       <div className="w-full aspect-square rounded-sm bg-gray-300 dark:bg-white/20"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                       <div className="w-full aspect-square rounded-sm bg-[#111827] dark:bg-white"></div>
                    </div>
                    <div className="flex justify-between gap-1">
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10"></div>
                       <div className="w-full aspect-square rounded-sm bg-[#111827] dark:bg-white"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                       <div className="w-full aspect-square rounded-sm bg-[#111827] dark:bg-white"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10"></div>
                    </div>
                    <div className="flex justify-between gap-1">
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                       <div className="w-full aspect-square rounded-sm bg-[#111827] dark:bg-white"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-300 dark:bg-white/20"></div>
                       <div className="w-full aspect-square rounded-sm bg-[#111827] dark:bg-white"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5 relative">
                         <div className="absolute right-0 bottom-0 px-1 py-0.5 bg-white border border-gray-200 text-[#111827] text-[9px] rounded font-bold whitespace-nowrap z-10 shadow-sm flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#111827]"></div> 10</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

          </div>

          {/* ROW 4: OPERATIONS & SUPPORT (FOUNDER ONLY) */}
          {isFounder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              
              {/* CARGO PERFORMANCE */}
              <div className={`${cardClass} p-4 md:p-5 flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={textTitle}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    KARGO PERFORMANSI
                  </h3>
                  <button onClick={() => router.push('/dashboard/sysop/shipping-management')} className="text-[10px] font-black px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">DETAY</button>
                </div>
                
                <div className="space-y-4 flex-1">
                  {[
                    { n: 'Yurtiçi Kargo', d: '4%', s: 'bg-green-500' },
                    { n: 'Aras Kargo', d: '8%', s: 'bg-green-500' },
                    { n: 'MNG Kargo', d: '16%', s: 'bg-red-500', alert: true },
                    { n: 'PTT Kargo', d: '12%', s: 'bg-orange-500' }
                  ].map((c, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                       <div className="flex items-center justify-between">
                          <span className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{c.n}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black ${c.alert ? 'text-red-500' : 'text-gray-500'}`}>Gecikme: {c.d}</span>
                          </div>
                       </div>
                       <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${c.s} rounded-full`} style={{width: c.d}}></div>
                       </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] mt-4 text-red-500 font-bold bg-red-500/10 p-2 rounded-lg flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  MNG Kargo gecikme oranı &gt;%15 risk seviyesinde. Dispute (Anlaşmazlık) riski yüksek.
                </p>
              </div>

              {/* WHATSAPP SUPPORT INSIGHTS */}
              <div className={`${cardClass} p-4 md:p-5 flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={textTitle}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    DESTEK (WHATSAPP)
                  </h3>
                  <button onClick={() => router.push('/dashboard/sysop/complaint-management')} className="text-[10px] font-black px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">TÜM MESAJLAR</button>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <h2 className={`text-[36px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>1,284</h2>
                  <span className={`text-[12px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mesaj Hacmi (Haftalık)</span>
                </div>

                <div className="space-y-3 flex-1">
                   <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Sorun Dağılımı</p>
                   <div className="grid grid-cols-2 gap-3">
                     <div className={`p-2 rounded border ${isDark ? 'border-red-500/20 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                       <span className="text-[10px] font-bold text-red-600 dark:text-red-400">Kargo / Teslimat</span>
                       <p className="text-[14px] font-black text-red-600 dark:text-red-400">%42</p>
                     </div>
                     <div className={`p-2 rounded border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                       <span className={`text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ödeme İşlemleri</span>
                       <p className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>%28</p>
                     </div>
                     <div className={`p-2 rounded border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                       <span className={`text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Listeleme Hataları</span>
                       <p className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>%18</p>
                     </div>
                     <div className={`p-2 rounded border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                       <span className={`text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dispute (İade)</span>
                       <p className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>%12</p>
                     </div>
                   </div>
                </div>

                <p className="text-[9px] mt-4 text-red-500 font-bold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Kargo şikayetleri &gt;%40 eşiğini aştı. Sistem alarmı devrede.
                </p>
              </div>
            </div>
          )}

        </div>
      ) : (
        // ==========================================
        // PARTNER L0 DASHBOARD (AYŞE) - NEXADASH CLONE
        // ==========================================
        <div className="space-y-6">
          
          {/* ROW 1: 4 STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
            <div onClick={() => router.push('/dashboard/sysop/order-management')} className={`${cardClass} p-4 md:p-5 relative overflow-hidden group`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  AÇIK İHTİLAFLAR
                </h3>
                <svg onClick={() => router.push('/dashboard/sysop/order-management')} className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>14</h2>
                <span className="text-[12px] font-bold text-red-500">Acil</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeRed}>↗ 4 Kayıt</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Bugün eklenen</span>
              </div>
            </div>

            <div onClick={() => router.push('/dashboard/sysop/shipping-management')} className={`${cardClass} p-4 md:p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  GECİKEN KARGOLAR
                </h3>
                <svg onClick={() => router.push('/dashboard/sysop/shipping-management')} className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>28</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Adet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeRed}>↘ 2.1%</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Teslimat sorunu</span>
              </div>
            </div>

            <div onClick={() => router.push('/dashboard/sysop/store-management')} className={`${cardClass} p-4 md:p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  MAĞAZA ONAY
                </h3>
                <svg onClick={() => router.push('/dashboard/sysop/store-management')} className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>8</h2>
                <span className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mağaza</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>↗ Bekleyen</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Pro başvuru</span>
              </div>
            </div>

            <div className={`${cardClass} p-4 md:p-5`}>
              <div className="flex items-center mb-4">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  GÜNLÜK GÖREV
                </h3>
                <svg className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className={textValue}>84%</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={badgeGreen}>Tamamlandı</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Bugün</span>
              </div>
            </div>
          </div>

          {/* ROW 2: CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COMPLAINT DISTRIBUTION (1/3) */}
            <div onClick={() => router.push('/dashboard/sysop/complaint-management')} className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                  ŞİKAYET DAĞILIMI
                </h3>
                <svg onClick={() => router.push('/dashboard/sysop/complaint-management')} className={iconRight} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </div>
              
              {/* Half Donut SVG Exact Replica */}
              <div className="relative w-full flex justify-center items-end mb-8 mt-2 h-[120px]">
                 <svg viewBox="0 0 200 100" className="w-[85%] h-full overflow-visible">
                   <defs>
                     <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
                       <stop offset="100%" stopColor="#991B1B" stopOpacity="1" />
                     </linearGradient>
                     <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#F97316" stopOpacity="1" />
                       <stop offset="100%" stopColor="#C2410C" stopOpacity="1" />
                     </linearGradient>
                   </defs>
                   {/* Background track segmented */}
                   {[...Array(14)].map((_, i) => (
                     <path key={i} d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke={isDark ? '#374151' : '#E5E7EB'} strokeWidth="16" strokeLinecap="round" strokeDasharray="14 300" strokeDashoffset={-i * 15.7} />
                   ))}
                   {/* Active track (Red) */}
                   {[...Array(6)].map((_, i) => (
                     <path key={`act-${i}`} d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="url(#gradRed)" strokeWidth="16" strokeLinecap="round" strokeDasharray="14 300" strokeDashoffset={-i * 15.7} className="transition-all duration-1000 ease-out" />
                   ))}
                   {/* Middle track (Orange) */}
                   {[...Array(4)].map((_, i) => (
                     <path key={`mid-${i}`} d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="url(#gradOrange)" strokeWidth="16" strokeLinecap="round" strokeDasharray="14 300" strokeDashoffset={-(i+6) * 15.7} className="transition-all duration-1000 ease-out" />
                   ))}
                 </svg>
                <div className="absolute bottom-0 left-0 w-full text-center flex flex-col items-center">
                  <h2 className="text-[22px] font-black leading-tight text-[#111827] dark:text-white">124</h2>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Toplam İhtilaf</p>
                </div>
              </div>

              <div className="space-y-5 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div>
                      <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Ürün Kusuru</p>
                      <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Kargo/Defo <span className="text-red-500 ml-1">+12%</span></p>
                    </div>
                  </div>
                  <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>84 Adet</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div>
                      <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Sahte/Kopya</p>
                      <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Marka İhlali <span className="text-green-500 ml-1">-5%</span></p>
                    </div>
                  </div>
                  <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>26 Adet</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <div>
                      <p className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Diğer</p>
                      <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Satıcı İletişimi</p>
                    </div>
                  </div>
                  <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>14 Adet</span>
                </div>
              </div>
            </div>

            {/* TASK COMPLETION (2/3) */}
            <div className={`lg:col-span-2 ${cardClass} p-6 flex flex-col`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className={textTitle}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    HAFTALIK GÖREV TAMAMLAMA
                  </h3>
                  <div className="flex items-center gap-3 mt-3">
                    <h2 className={textValue}>384 Adet</h2>
                    <span className={badgeGreen}>↗ 5.2%</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-2 ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F]' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}>Tüm Kategoriler <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
                  <button className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-2 ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F]' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}>Bu Ay <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Çözülen</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div><span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gelen</span></div>
                </div>
                <div className="text-[11px] font-bold text-gray-500">Net Başarı : <span className="text-green-500 font-black">82%</span></div>
              </div>

              {/* Exact Line Chart SVG Implementation */}
              <div className="flex-1 min-h-[220px] w-full relative mt-4">
                 {/* Background Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                    {['150', '100', '50', '0'].map((label, i) => (
                      <div key={i} className={`w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-start`}>
                        <span className={`-mt-2.5 pr-2 text-[10px] font-bold ${isDark ? 'bg-[#121214] text-gray-500' : 'bg-white text-gray-400'}`}>{label}</span>
                      </div>
                    ))}
                 </div>

                 {/* Vertical Grid Lines */}
                 <div className="absolute inset-0 flex justify-between px-10 pointer-events-none pb-6">
                   {[...Array(7)].map((_, i) => (
                     <div key={i} className={`h-full border-l border-dashed ${isDark ? 'border-white/5' : 'border-gray-100'} w-px`}></div>
                   ))}
                 </div>

                 {/* Blue Bar Highlight (Thursday) */}
                 <div className="absolute left-[54.5%] bottom-[15%] w-8 h-[60%] bg-gradient-to-t from-blue-500/0 to-blue-500/20 dark:from-blue-500/0 dark:to-blue-500/30 rounded-t-lg"></div>

                 {/* Charts */}
                 <svg className="absolute inset-0 w-full h-[85%] preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                   {/* Target Line (Gray) */}
                   <polyline points="5,50 20,40 35,60 50,30 65,55 80,45 95,35" fill="none" stroke={isDark ? "#374151" : "#E5E7EB"} strokeWidth="1.5" />
                   {/* Completed Line (Blue) */}
                   <path d="M 5,70 L 20,80 L 35,50 L 50,20 L 65,45 L 80,60 L 95,85" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                   
                   {/* Data Points */}
                   <circle cx="50" cy="20" r="2.5" fill="#3B82F6" stroke="#FFF" strokeWidth="1.5" /> {/* Highlight point */}
                 </svg>
                 
                 {/* Dark Tooltip */}
                 <div className="absolute left-[58%] top-[10%] bg-[#1A1D1F] text-white p-3.5 rounded-[12px] shadow-2xl z-10 min-w-[150px]">
                   <p className="text-[11px] font-bold text-gray-300 mb-2">Perşembe</p>
                   <div className="flex justify-between items-center mb-1 text-[11px]">
                     <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>Gelen</span>
                     <span className="font-black">84 Adet</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px]">
                     <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>Çözülen</span>
                     <span className="font-black text-blue-400">112 Adet</span>
                   </div>
                 </div>

                 {/* X Axis */}
                 <div className={`absolute bottom-0 w-full flex justify-between px-6 text-[11px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                   <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
                 </div>
              </div>
            </div>
          </div>

          {/* ROW 3: LISTS & STRATEGY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* RECENT ACTIVITY */}
            <div onClick={() => router.push('/dashboard/sysop/order-management')} className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ACİL İŞLER
                </h3>
                <button onClick={() => router.push('/dashboard/sysop/order-management')} className={`p-1.5 ml-auto rounded-lg border flex items-center gap-2 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/10' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></button>
              </div>
              
              <div className="space-y-6">
                <div>
                   <p className={`text-[12px] font-bold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Siparişi İptal Edilenler</p>
                   <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-xl text-red-600 font-black">!</div>
                         <div>
                            <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>ORD-9912</p>
                            <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>İade bekleniyor <span className="text-red-500 ml-1">2 saat geçti</span></p>
                         </div>
                      </div>
                      <button className="bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm">Müdahale Et</button>
                   </div>
                </div>

                <div>
                   <p className={`text-[12px] font-bold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mağaza Şikayeti</p>
                   <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl text-orange-600">⚠</div>
                         <div>
                            <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>"Kids Store"</p>
                            <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Küfürlü iletişim <span className="text-red-500 ml-1">3 ihbar</span></p>
                         </div>
                      </div>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm">Askıya Al</button>
                   </div>
                </div>
              </div>
            </div>

            {/* TOP 3 PRODUCT */}
            <div onClick={() => router.push('/dashboard/sysop/shipping-management')} className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  KARGO FİRMASI HATALARI
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => router.push('/dashboard/sysop/shipping-management')} className={`p-1.5 rounded-lg border flex items-center gap-1 transition-colors ${isDark ? 'border-white/10 text-gray-300 bg-[#1A1D1F] hover:bg-white/10' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                 <span className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Toplam Gecikme Bildirimi :</span>
                 <span className="text-[11px] font-black text-red-500 flex items-center gap-1">140 adet <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div></span>
              </div>

              <div className="flex-1 flex items-end justify-between pb-6 pt-4 relative min-h-[160px]">
                 {/* Y Axis */}
                 <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold pb-6">
                    <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
                 </div>
                 
                 {/* Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pl-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-full border-t border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>
                    ))}
                 </div>
                 
                 <div className="w-full h-full flex justify-around items-end pl-8 z-10 gap-2">
                   {/* Bar 1: Black striped */}
                   <div className="w-full max-w-[60px] h-[90%] relative flex flex-col justify-end group">
                      <div className="absolute inset-0 bg-red-500 dark:bg-red-600 rounded-t-lg overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)' }}></div>
                      <span className="relative z-10 text-[11px] font-black text-white dark:text-white mb-2 ml-2">82</span>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>PTT</span>
                   </div>
                   {/* Bar 2: Gray striped */}
                   <div className="w-full max-w-[60px] h-[40%] relative flex flex-col justify-end">
                      <div className="absolute inset-0 bg-orange-400 dark:bg-orange-500 rounded-t-lg overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)' }}></div>
                      <span className="relative z-10 text-[11px] font-black text-white dark:text-white mb-2 ml-2">41</span>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>MNG</span>
                   </div>
                   {/* Bar 3: Light gray striped */}
                   <div className="w-full max-w-[60px] h-[15%] relative flex flex-col justify-end">
                      <div className="absolute inset-0 bg-yellow-400 dark:bg-yellow-500 rounded-t-lg overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)' }}></div>
                      <span className="relative z-10 text-[11px] font-black text-[#111827] dark:text-black mb-2 ml-2">17</span>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Yurtiçi</span>
                   </div>
                 </div>
              </div>
            </div>

            {/* TOTAL VISITOR HEATMAP */}
            <div className={`${cardClass} p-6 flex flex-col`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={textTitle}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  OPERASYON YOĞUNLUĞU
                </h3>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <h2 className={textValue}>Salı</h2>
                <span className={badgeRed}>En yoğun gün</span>
              </div>

              <div className="space-y-2 mb-6">
                {[{t:'Sabah (09-12):', v:'120 İşlem', c:'bg-red-500'}, {t:'Öğle (12-15):', v:'85 İşlem', c:'bg-orange-500'}, {t:'Akşam (15-18):', v:'42 İşlem', c:'bg-green-500'}].map((s,i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.t}</span>
                    <span className={`font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{s.v} <div className={`w-1.5 h-1.5 rounded-full ${s.c}`}></div></span>
                  </div>
                ))}
              </div>

              {/* Heatmap Layout Exact Replica (Colored for Ops) */}
              <div className="flex mt-auto">
                 <div className="flex flex-col gap-2 justify-end pr-4 text-[9px] font-bold text-gray-400 pb-1">
                    <span>09.00 - 12.00</span>
                    <span>12.00 - 15.00</span>
                    <span>15.00 - 18.00</span>
                 </div>
                 <div className="flex-1 flex flex-col gap-2 relative">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                      <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span>
                    </div>
                    {/* Rows */}
                    <div className="flex justify-between gap-1">
                       <div className="w-full aspect-square rounded-sm bg-orange-200 dark:bg-orange-900/50"></div>
                       <div className="w-full aspect-square rounded-sm bg-red-500 dark:bg-red-600 relative">
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-[#111827] text-white text-[9px] rounded font-bold whitespace-nowrap z-10 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> 120</div>
                       </div>
                       <div className="w-full aspect-square rounded-sm bg-orange-300 dark:bg-orange-800"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10"></div>
                    </div>
                    <div className="flex justify-between gap-1">
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10"></div>
                       <div className="w-full aspect-square rounded-sm bg-orange-400 dark:bg-orange-600"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                    </div>
                    <div className="flex justify-between gap-1">
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-300 dark:bg-white/20"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-200 dark:bg-white/10"></div>
                       <div className="w-full aspect-square rounded-sm bg-gray-100 dark:bg-white/5"></div>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Visitor Analytics Modal */}
      <VisitorAnalyticsModal 
        isOpen={isVisitorModalOpen} 
        onClose={() => setIsVisitorModalOpen(false)} 
      />
    </div>
  );
}
