'use client';
import React from 'react';
import {useRouter} from 'next/navigation';

export default function UserDistributionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#E5E5E5] p-4 md:p-8 font-sans flex items-center justify-center overflow-x-auto">
      
      {/* MAIN CONTAINER matching Healthix design */}
      <div className="min-w-[1280px] max-w-[1400px] w-full h-[840px] bg-[#F5F6F6] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden border border-white">
        
        {/* CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR (Filter) */}
          <div className="w-[260px] shrink-0 bg-[#F5F6F6] flex flex-col h-full pl-8 pr-4 py-2 relative z-20">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-bold text-[#1A1A1A]">Filtreler</h2>
                <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pr-2 pb-4">
                {/* Kullanıcı Rolü */}
                <div>
                   <h3 className="text-[12.5px] font-semibold text-[#1A1A1A] mb-3">Kullanıcı Rolü</h3>
                   <div className="grid grid-cols-4 gap-2 relative">
                      <div className="absolute -top-7 left-[38%] bg-[#2A2A2A] text-white text-[10px] font-semibold px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">Satıcı</div>
                      {[
                        {bg: '#EBEBEB', text: '#9CA3AF', icon: <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>},
                        {bg: '#1A1A1A', text: '#FFFFFF', icon: <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>},
                        {bg: '#EBEBEB', text: '#9CA3AF', icon: <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>},
                        {bg: '#EBEBEB', text: '#9CA3AF', icon: <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                      ].map((item, i) => (
                         <div key={i} className="w-[42px] h-[42px] rounded-xl flex items-center justify-center" style={{backgroundColor: item.bg, color: item.text}}>
                            {item.icon}
                         </div>
                      ))}
                      <div className="w-[42px] h-[42px] rounded-xl bg-[#10B981] flex items-center justify-center text-white font-bold text-[18px] shadow-sm cursor-pointer hover:bg-[#059669] transition-colors">+</div>
                   </div>
                </div>

                {/* Aktivite Seviyesi */}
                <div>
                   <h3 className="text-[12.5px] font-semibold text-[#1A1A1A] mb-3">Aktivite Seviyesi</h3>
                   <div className="relative pt-2 pb-5 px-1">
                      <div className="h-1 bg-gray-200 rounded-full w-full absolute top-2.5"></div>
                      <div className="h-1 bg-[#10B981] rounded-full absolute top-2.5" style={{width: '75%'}}></div>
                      <div className="absolute top-1.5 w-full flex justify-between px-1">
                         {[...Array(5)].map((_, i) => <div key={i} className="w-[3px] h-[10px] bg-gray-300 rounded-full"></div>)}
                      </div>
                      <div className="flex justify-between relative z-10 text-[9px] font-semibold text-gray-400 mt-4">
                         <span>Pasif</span><span>Düşük</span><span>Orta</span><span className="text-[#1A1A1A]">Yüksek</span><span>Çok Y.</span>
                      </div>
                      <div className="w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-white absolute top-1 right-[25%] shadow-sm translate-x-2"></div>
                   </div>
                </div>

                {/* Cihaz Tipi */}
                <div>
                   <h3 className="text-[12.5px] font-semibold text-[#1A1A1A] mb-3">Cihaz Tipi</h3>
                   <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                         <button className="w-7 h-7 rounded-full bg-[#10B981] text-white text-[11px] font-bold shadow-sm">İ</button>
                         <button className="w-7 h-7 flex items-center justify-center text-gray-400 text-[11px] font-bold">A</button>
                         <button className="w-7 h-7 flex items-center justify-center text-gray-400 text-[11px] font-bold">W</button>
                      </div>
                   </div>
                </div>

                {/* Kayıt Tarihi */}
                <div>
                   <h3 className="text-[12.5px] font-semibold text-[#1A1A1A] mb-3">Kayıt Tarihi</h3>
                   <div className="w-full bg-white border border-gray-100 rounded-[12px] px-4 py-2.5 flex items-center justify-between shadow-sm cursor-pointer">
                      <span className="text-[12.5px] font-semibold text-gray-500">Son 30 Gün</span>
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                </div>

                {/* Kullanıcı Yaşı */}
                <div className="pb-2">
                   <h3 className="text-[12.5px] font-semibold text-[#1A1A1A] mb-3">Kullanıcı Yaşı</h3>
                   <div className="h-8 flex items-end gap-[2px] mb-2 px-1">
                      {[15,20,25,30,40,50,60,80,95,100,90,75,60,45,35,25,20,15,10].map((h, i) => (
                         <div key={i} className={`flex-1 rounded-t-[2px] transition-colors ${i >= 4 && i <= 12 ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'}`} style={{height: `${h}%`}}></div>
                      ))}
                   </div>
                   <div className="relative pt-1 pb-4">
                      <div className="h-1 bg-gray-200 rounded-full w-full absolute top-1"></div>
                      <div className="h-1 bg-[#10B981] rounded-full absolute top-1" style={{left: '20%', right: '35%'}}></div>
                      <div className="flex justify-between relative z-10 text-[10px] font-semibold text-gray-400 mt-3 px-1">
                         <span>18</span><span className="text-[#1A1A1A]">24</span><span>30</span><span className="text-[#1A1A1A]">45</span><span>60</span>
                      </div>
                      <div className="w-3.5 h-3.5 bg-white rounded-full border border-gray-200 absolute -top-0.5 left-[20%] shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                      <div className="w-3.5 h-3.5 bg-white rounded-full border border-gray-200 absolute -top-0.5 right-[35%] shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                   </div>
                   <div className="flex gap-3 text-[12px] font-semibold text-gray-400 mt-1 px-1">
                      <div className="bg-white border border-gray-100 rounded-[8px] px-2.5 py-1 shadow-sm"><span className="text-gray-400 mr-1">Min:</span><span className="text-[#1A1A1A]">24</span></div>
                      <div className="bg-white border border-gray-100 rounded-[8px] px-2.5 py-1 shadow-sm"><span className="text-gray-400 mr-1">Max:</span><span className="text-[#1A1A1A]">45</span></div>
                   </div>
                </div>
             </div>

             {/* Bottom Actions */}
             <div className="pt-3 border-t border-gray-200/50 mt-auto">
                <div className="flex items-center gap-2.5 mb-5 cursor-pointer">
                   <div className="w-4 h-4 bg-[#10B981] rounded-[4px] flex items-center justify-center text-white shadow-sm shrink-0">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="text-[12px] font-semibold text-[#1A1A1A]">KVKK Onaylı Kullanıcılar</span>
                </div>
                <div className="flex gap-2.5">
                   <button className="w-1/3 py-2.5 bg-white rounded-[12px] text-[12.5px] font-semibold text-[#1A1A1A] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">Temizle</button>
                   <button className="w-2/3 py-2.5 bg-[#10B981] rounded-[12px] text-[12.5px] font-semibold text-white shadow-md hover:bg-[#059669] transition-colors">Filtrele</button>
                </div>
             </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div className="flex-1 flex flex-col p-6 pl-4 h-full relative min-w-0">
             
             {/* TOP CARDS ROW */}
             <div className="grid grid-cols-3 gap-5 mb-6 z-10">
                {/* Ortalama Oturum */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm h-[130px] flex flex-col justify-between border border-gray-100/50 relative overflow-hidden">
                   <h3 className="text-[13px] font-semibold text-[#1A1A1A]">Ortalama Oturum</h3>
                   <div className="flex items-end gap-1 relative z-10 mb-1">
                      <span className="text-[42px] font-bold text-[#1A1A1A] leading-none tracking-tight">14</span>
                      <span className="text-[16px] font-semibold text-gray-400 mb-1">dk</span>
                   </div>
                   {/* Decorative SVG Dial */}
                   <div className="absolute -right-6 -bottom-6 w-36 h-36">
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                         <path d="M 15 50 A 35 35 0 1 1 85 50" fill="none" stroke="#F3F4F6" strokeWidth="8" strokeLinecap="round"/>
                         {[...Array(12)].map((_, i) => (
                           <line key={i} x1="50" y1="15" x2="50" y2="18" stroke="#E5E7EB" strokeWidth="1.5" transform={`rotate(${-90 + i*15} 50 50)`} />
                         ))}
                         <path d="M 15 50 A 35 35 0 0 1 50 15" fill="none" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round"/>
                         <circle cx="15" cy="50" r="3.5" fill="#1A1A1A" />
                      </svg>
                   </div>
                   <div className="absolute right-4 bottom-4 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center z-10 border border-gray-50">
                      <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                </div>

                {/* Aktiflik Oranı */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm h-[130px] flex flex-col justify-between border border-gray-100/50 relative overflow-hidden">
                   <div className="flex justify-between items-start">
                      <h3 className="text-[13px] font-semibold text-[#1A1A1A] leading-tight">Aktiflik<br/>Oranı</h3>
                      <div className="text-right">
                         <p className="text-[10px] font-semibold text-gray-500 flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> 4.2B Satıcı</p>
                         <p className="text-[10px] font-semibold text-gray-500 flex items-center justify-end gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 1.8B Alıcı</p>
                      </div>
                   </div>
                   <div className="flex items-end gap-1">
                      <span className="text-[42px] font-bold text-[#1A1A1A] leading-none tracking-tight">85</span>
                      <span className="text-[16px] font-semibold text-gray-400 mb-1">%</span>
                   </div>
                   <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mt-1 mb-1">
                      <span>40</span><span>100</span>
                   </div>
                   <div className="flex gap-[1px] w-full">
                      {[...Array(50)].map((_, i) => (
                         <div key={i} className={`h-3 flex-1 rounded-[1px] ${i < 42 ? 'bg-[#FDBA74]' : 'bg-gray-100'}`}></div>
                      ))}
                   </div>
                </div>

                {/* Kayıt Trendleri */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm h-[130px] flex flex-col justify-between border border-gray-100/50">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[13px] font-semibold text-[#1A1A1A] leading-tight">Kayıt<br/>Trendleri</h3>
                      <div className="flex gap-2">
                         <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74]"></span> Yeni Kayıt</span>
                         <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> İptal</span>
                      </div>
                   </div>
                   <div className="flex-1 relative mt-1 w-full h-full">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 240 40" preserveAspectRatio="none">
                         <path d="M0,25 Q30,10 60,25 T120,15 T180,20 T240,5" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                         <path d="M0,15 Q30,0 60,15 T120,0 T180,30 T240,10" fill="none" stroke="#FDBA74" strokeWidth="1.5" />
                         <circle cx="105" cy="12" r="3.5" fill="#10B981" />
                      </svg>
                      <div className="absolute top-[-8px] left-[85px] bg-[#2A2A2A] rounded px-1.5 py-1 flex flex-col items-center shadow-md">
                         <span className="text-[9px] text-white font-semibold leading-tight flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74]"></span> 124</span>
                         <span className="text-[9px] text-white font-semibold leading-tight flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> 12</span>
                      </div>
                   </div>
                   <div className="flex justify-between text-[9px] font-semibold text-gray-400 mt-2">
                      <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
                   </div>
                </div>
             </div>

             {/* MAP AREA */}
             <div className="flex-1 relative bg-[#F5F6F6] rounded-[24px]">
                {/* Map Controls */}
                <div className="absolute top-2 left-2 flex items-center gap-5 z-20">
                   <div className="bg-white rounded-full p-1 flex shadow-sm border border-gray-100">
                      <button className="px-5 py-1.5 bg-[#1A1A1A] text-white text-[12.5px] font-semibold rounded-full shadow-sm">Satıcılar</button>
                      <button className="px-5 py-1.5 text-gray-500 hover:text-gray-900 text-[12.5px] font-semibold rounded-full transition-colors">Alıcılar</button>
                   </div>
                   <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Son güncellenme: 2 dk önce
                   </div>
                </div>

                {/* Abstract Global Map */}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-80 pointer-events-none pb-8">
                   <svg width="100%" height="100%" viewBox="0 0 1000 500" className="w-[110%] h-[110%] object-cover" style={{ pointerEvents: 'auto' }}>
                      {/* Simplified stylized world map paths to exactly match the aesthetic */}
                      <g fill="#D1D5DB" stroke="#F5F6F6" strokeWidth="1.5">
                         {/* NA */}
                         <path d="M150,180 Q250,150 300,200 T200,300 Q150,250 150,180 Z" />
                         {/* SA */}
                         <path d="M220,320 Q280,300 320,400 T260,480 Q220,400 220,320 Z" />
                         {/* EU */}
                         <path d="M450,150 Q520,120 580,180 T480,250 Q430,200 450,150 Z" fill="#9CA3AF" />
                         {/* AF */}
                         <path d="M460,260 Q550,240 600,350 T500,450 Q450,350 460,260 Z" />
                         {/* ASIA */}
                         <path d="M580,150 Q750,100 850,200 T750,350 Q650,250 580,150 Z" />
                         {/* AUS */}
                         <path d="M780,380 Q850,360 880,420 T800,480 Q750,420 780,380 Z" fill="#6B7280" />
                      </g>
                      
                      {/* Connection Lines from EU Marker to Popup Area */}
                      <g opacity="0.6">
                        <path d="M520,200 L950,180" fill="none" stroke="white" strokeWidth="1.5" />
                        <path d="M520,200 L950,220" fill="none" stroke="white" strokeWidth="1.5" />
                        <path d="M520,200 L950,260" fill="none" stroke="white" strokeWidth="1.5" />
                        <path d="M520,200 L950,300" fill="none" stroke="white" strokeWidth="1.5" />
                        <path d="M520,200 L950,340" fill="none" stroke="white" strokeWidth="1.5" />
                      </g>

                      {/* Map Markers */}
                      {/* Dark Marker EU */}
                      <g transform="translate(520, 200)">
                         <circle r="28" fill="#1A1A1A" shadow="0 4px 10px rgba(0,0,0,0.5)" />
                         <text y="6" textAnchor="middle" fill="white" className="text-[20px] font-bold">12</text>
                      </g>

                      {/* Orange Markers */}
                      <g transform="translate(250, 220)">
                         <circle r="24" fill="#FDBA74" />
                         <text y="5" textAnchor="middle" fill="#1A1A1A" className="text-[16px] font-bold">48</text>
                         {/* Mini tooltip for Best Matches */}
                         <rect x="-35" y="-45" width="70" height="20" rx="4" fill="#2A2A2A" />
                         <text y="-31" textAnchor="middle" fill="white" className="text-[9px] font-semibold">En Yüksek</text>
                         <image href="https://i.pravatar.cc/150?u=a1" x="-45" y="-25" width="18" height="18" clipPath="circle()" className="rounded-full border-2 border-white"/>
                         <image href="https://i.pravatar.cc/150?u=b2" x="-20" y="-65" width="18" height="18" clipPath="circle()" className="rounded-full border-2 border-white"/>
                      </g>

                      <g transform="translate(300, 360)">
                         <circle r="18" fill="#FDBA74" />
                         <text y="4" textAnchor="middle" fill="#1A1A1A" className="text-[13px] font-bold">4</text>
                      </g>

                      <g transform="translate(580, 320)">
                         <circle r="22" fill="#FDBA74" />
                         <text y="5" textAnchor="middle" fill="#1A1A1A" className="text-[15px] font-bold">2</text>
                      </g>
                      
                      <g transform="translate(820, 420)">
                         <circle r="20" fill="#F97316" />
                         <text y="4" textAnchor="middle" fill="white" className="text-[14px] font-bold">9</text>
                      </g>
                   </svg>
                </div>

                {/* Popups & Elements Overlay */}

                {/* MATCHED DONORS POPUP -> Popüler Kullanıcılar */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[310px] bg-[#222222] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.2)] pt-5 pb-3 px-3 z-30 font-sans">
                   <div className="flex items-start justify-between mb-4 px-3">
                     <div>
                       <h3 className="text-white text-[15px] font-semibold tracking-wide mb-1">Popüler Kullanıcılar</h3>
                       <div className="flex items-center gap-2">
                         <div className="w-[16px] h-[12px] bg-red-600 rounded-[2px] flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                           </div>
                         </div>
                         <span className="text-[#9CA3AF] text-[12px] font-medium">Türkiye Geneli</span>
                       </div>
                     </div>
                     <button className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white hover:bg-[#059669] transition-colors shadow-lg group">
                       <svg className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                     </button>
                   </div>

                   <div className="space-y-0.5">
                      {[
                        {name: 'Ayşe Yılmaz', desc: 'Satıcı, İstanbul', score: '98%', active: false, img: 'https://i.pravatar.cc/150?u=ayse'},
                        {name: 'Merve Demir', desc: 'Alıcı, İzmir', score: '92%', active: true, img: 'https://i.pravatar.cc/150?u=merve'},
                        {name: 'Zeynep Kaya', desc: 'Premium, Ankara', score: '85%', active: false, img: 'https://i.pravatar.cc/150?u=zeynep'},
                        {name: 'Elif Şahin', desc: 'Satıcı, Bursa', score: '81%', active: false, img: 'https://i.pravatar.cc/150?u=elif'},
                        {name: 'Fatma Çelik', desc: 'Alıcı, Antalya', score: '76%', active: false, img: 'https://i.pravatar.cc/150?u=fatma'}
                      ].map((item, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2.5 rounded-[14px] cursor-pointer transition-colors group ${item.active ? 'bg-[#3A3A3A]' : 'hover:bg-[#3A3A3A]'}`}>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                                 <img src={item.img} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2px] border-[#222222] group-hover:border-[#3A3A3A] transition-colors ${idx % 2 === 0 ? 'bg-red-500' : 'bg-[#10B981]'}`}></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white text-[12.5px] font-medium tracking-wide mb-0.5">{item.name}</span>
                              <span className="text-[#9CA3AF] text-[11px]">{item.desc}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-end w-10">
                             <span className={`text-white text-[13px] font-medium ${item.active ? 'hidden' : 'group-hover:hidden'}`}>{item.score}</span>
                             <button className={`w-7 h-7 rounded-full bg-white text-[#222222] items-center justify-center shadow-sm hover:scale-105 transition-transform ${item.active ? 'flex' : 'hidden group-hover:flex'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                             </button>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* BOTTOM FLOATING TOAST */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#2A2A2A] rounded-[16px] pl-4 pr-2.5 py-2.5 flex items-center gap-5 shadow-xl z-30 font-sans">
                   <div className="w-8 h-8 rounded-[6px] bg-[#3F3F46] flex items-center justify-center shrink-0">
                      <div className="w-4 h-4 rounded-full bg-[#FDBA74] flex items-center justify-center text-[#2A2A2A] font-black text-[10px]">!</div>
                   </div>
                   <div className="flex flex-col pr-6">
                      <span className="text-white text-[13px] font-bold tracking-wide mb-0.5">Yeni veri mevcut</span>
                      <span className="text-[#9CA3AF] text-[11px] font-medium">Kullanıcı dağılımı güncellendi</span>
                   </div>
                   <button className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white hover:bg-[#059669] transition-colors shadow-sm shrink-0 group">
                      <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   </button>
                </div>

             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
