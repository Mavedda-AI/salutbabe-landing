'use client';
import React from 'react';
import {useRouter} from 'next/navigation';

export default function UserDistributionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#DFE2E4] p-4 md:p-8 font-sans flex items-center justify-center">
      
      {/* MAIN CONTAINER matching Healthix design */}
      <div className="w-full max-w-[1400px] h-[860px] bg-[#F4F5F5] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-white/60">
        
        {/* TOP NAVBAR */}
        <div className="h-24 bg-[#F4F5F5] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.back()}>
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-[8px] flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-[2px] transform rotate-45"></div>
            </div>
            <span className="text-[22px] font-black tracking-tight text-[#1A1A1A]">Healthix</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
            {['Dashboard', 'Interactive map', 'Patients', 'Documents', 'Reports'].map((item, i) => (
              <button key={i} className={`px-6 py-2.5 text-[13px] font-bold rounded-full transition-colors ${item === 'Interactive map' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1A1A]'}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white rounded-full flex items-center gap-2 text-[13px] font-bold text-[#1A1A1A] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1A1A1A] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="relative">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1A1A1A] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR (Filter) */}
          <div className="w-[300px] shrink-0 bg-[#F4F5F5] flex flex-col h-full pl-8 pr-4 py-4">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-[22px] font-bold text-[#1A1A1A]">Filter</h2>
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-7 no-scrollbar pr-2">
                {/* Organ type */}
                <div>
                   <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Organ type</h3>
                   <div className="grid grid-cols-4 gap-2.5 relative">
                      {/* Tooltip for Liver */}
                      <div className="absolute -top-7 left-[38%] bg-[#2A2A2A] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">Liver</div>
                      
                      {/* Icons placeholders */}
                      {[
                        {bg: '#EBEBEB', text: '#9CA3AF'}, {bg: '#1A1A1A', text: '#FFFFFF'}, {bg: '#EBEBEB', text: '#9CA3AF'}, {bg: '#EBEBEB', text: '#9CA3AF'},
                        {bg: '#EBEBEB', text: '#9CA3AF'}, {bg: '#EBEBEB', text: '#9CA3AF'}, {bg: '#EBEBEB', text: '#9CA3AF'}
                      ].map((style, i) => (
                         <div key={i} className="w-[52px] h-[48px] rounded-2xl flex items-center justify-center" style={{backgroundColor: style.bg, color: style.text}}>
                            <svg className="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                         </div>
                      ))}
                      <div className="w-[52px] h-[48px] rounded-2xl bg-[#10B981] flex items-center justify-center text-white font-black text-[20px] shadow-sm cursor-pointer hover:bg-[#059669] transition-colors">+</div>
                   </div>
                </div>

                {/* Urgency stage */}
                <div>
                   <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Urgency stage</h3>
                   <div className="relative pt-2 pb-6 px-1">
                      <div className="h-1 bg-gray-200 rounded-full w-full absolute top-3"></div>
                      <div className="h-1 bg-[#10B981] rounded-full absolute top-3" style={{width: '75%'}}></div>
                      {/* Slider ticks */}
                      <div className="absolute top-2 w-full flex justify-between px-1">
                         <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                         <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                         <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                         <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                         <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="flex justify-between relative z-10 text-[11px] font-bold text-gray-400 mt-5">
                         <span>1st</span><span>2nd</span><span>3rd</span><span className="text-[#1A1A1A]">4th</span><span>5th</span>
                      </div>
                      <div className="w-4 h-4 bg-[#10B981] rounded-full border-2 border-white absolute top-1.5 right-[25%] shadow-sm translate-x-2"></div>
                   </div>
                </div>

                {/* Blood type */}
                <div>
                   <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Blood type</h3>
                   <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                         <button className="w-8 h-8 rounded-full bg-[#10B981] text-white text-[13px] font-bold shadow-sm">A</button>
                         <button className="text-gray-400 text-[13px] font-bold px-1">B</button>
                         <button className="text-gray-400 text-[13px] font-bold px-1">AB</button>
                         <button className="text-gray-400 text-[13px] font-bold px-1">O</button>
                      </div>
                      <span className="text-gray-300 mx-2">|</span>
                      <div className="flex gap-2">
                         <button className="w-8 h-8 rounded-full bg-white text-gray-500 text-[13px] font-bold shadow-sm border border-gray-100">-</button>
                         <button className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-[13px] font-bold shadow-sm">+</button>
                      </div>
                   </div>
                </div>

                {/* HLA alleles */}
                <div>
                   <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-4">HLA alleles</h3>
                   <div className="w-full bg-white border border-gray-100 rounded-[14px] px-5 py-3.5 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer">
                      <span className="text-[14px] font-bold text-gray-500">HLA-A1, HLA-A2</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                </div>

                {/* Age range */}
                <div className="pb-4">
                   <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Age range</h3>
                   <div className="h-10 flex items-end gap-[3px] mb-2 px-1">
                      {[15,20,25,30,40,50,60,80,95,100,90,75,60,45,35,25,20,15,10].map((h, i) => (
                         <div key={i} className={`flex-1 rounded-t-sm transition-colors ${i >= 4 && i <= 12 ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'}`} style={{height: `${h}%`}}></div>
                      ))}
                   </div>
                   <div className="relative pt-1 pb-4">
                      <div className="h-1.5 bg-gray-200 rounded-full w-full absolute top-1"></div>
                      <div className="h-1.5 bg-[#10B981] rounded-full absolute top-1" style={{left: '20%', right: '35%'}}></div>
                      <div className="flex justify-between relative z-10 text-[11px] font-bold text-gray-400 mt-4 px-1">
                         <span>10</span><span className="text-[#1A1A1A]">30</span><span>40</span><span className="text-[#1A1A1A]">50</span><span>100</span>
                      </div>
                      <div className="w-4 h-4 bg-white rounded-full border border-gray-200 absolute top-0 left-[20%] shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                      <div className="w-4 h-4 bg-white rounded-full border border-gray-200 absolute top-0 right-[35%] shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                   </div>
                   <div className="flex gap-4 text-[13px] font-bold text-gray-400 mt-2 px-1">
                      <div className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 shadow-sm"><span className="text-gray-400 mr-1">Min:</span><span className="text-[#1A1A1A]">30</span></div>
                      <div className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 shadow-sm"><span className="text-gray-400 mr-1">Max:</span><span className="text-[#1A1A1A]">50</span></div>
                   </div>
                </div>
             </div>

             {/* Bottom Actions */}
             <div className="pt-4 border-t border-gray-200/50 mt-auto">
                <div className="flex items-center gap-3 mb-6 cursor-pointer">
                   <div className="w-5 h-5 bg-[#10B981] rounded-[6px] flex items-center justify-center text-white shadow-sm shrink-0">
                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <span className="text-[13px] font-bold text-[#1A1A1A]">Require consent verification</span>
                </div>
                <div className="flex gap-3">
                   <button className="w-1/3 py-3.5 bg-white rounded-[16px] text-[14px] font-bold text-[#1A1A1A] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">Clear</button>
                   <button className="w-2/3 py-3.5 bg-[#10B981] rounded-[16px] text-[14px] font-bold text-white shadow-md hover:bg-[#059669] transition-colors">Apply filters</button>
                </div>
             </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div className="flex-1 flex flex-col p-6 pl-4 h-full relative">
             
             {/* TOP CARDS ROW */}
             <div className="grid grid-cols-3 gap-6 mb-8 z-10">
                {/* Average Wait Time */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[150px] flex flex-col justify-between border border-gray-100/50 relative overflow-hidden">
                   <h3 className="text-[14px] font-bold text-[#1A1A1A]">Average wait time</h3>
                   <div className="flex items-end gap-1 relative z-10">
                      <span className="text-[48px] font-black text-[#1A1A1A] leading-none tracking-tighter">36</span>
                      <span className="text-[18px] font-bold text-gray-400 mb-1.5">h</span>
                   </div>
                   {/* Decorative SVG Dial */}
                   <div className="absolute -right-12 -bottom-12 w-48 h-48">
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                         {/* Dial track */}
                         <path d="M 10 50 A 40 40 0 1 1 90 50" fill="none" stroke="#F3F4F6" strokeWidth="12" strokeLinecap="round"/>
                         {/* Tick marks on track */}
                         {[...Array(12)].map((_, i) => (
                           <line key={i} x1="50" y1="10" x2="50" y2="14" stroke="#E5E7EB" strokeWidth="1" transform={`rotate(${-90 + i*15} 50 50)`} />
                         ))}
                         {/* Dial value */}
                         <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#FDBA74" strokeWidth="12" strokeLinecap="round"/>
                         {/* Pointer dot */}
                         <circle cx="10" cy="50" r="3" fill="#1A1A1A" />
                      </svg>
                   </div>
                   <div className="absolute right-5 bottom-5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10 border border-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                </div>

                {/* Transplants Performed */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[150px] flex flex-col justify-between border border-gray-100/50 relative overflow-hidden">
                   <div className="flex justify-between items-start">
                      <h3 className="text-[14px] font-bold text-[#1A1A1A]">Transplants performed</h3>
                      <div className="text-right">
                         <p className="text-[11px] font-bold text-gray-500 flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> 42 successful</p>
                         <p className="text-[11px] font-bold text-gray-500 flex items-center justify-end gap-1 mt-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 18 failed</p>
                      </div>
                   </div>
                   <div className="flex items-end gap-1">
                      <span className="text-[48px] font-black text-[#1A1A1A] leading-none tracking-tighter">70</span>
                      <span className="text-[18px] font-bold text-gray-400 mb-1.5">%</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mt-2 mb-1">
                      <span>60</span><span>86</span>
                   </div>
                   <div className="flex gap-[2px] w-full">
                      {[...Array(45)].map((_, i) => (
                         <div key={i} className={`h-4 flex-1 rounded-sm ${i < 32 ? 'bg-[#FDBA74]' : 'bg-gray-200'}`}></div>
                      ))}
                   </div>
                </div>

                {/* Transplant trends */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[150px] flex flex-col justify-between border border-gray-100/50">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[14px] font-bold text-[#1A1A1A]">Transplant trends</h3>
                      <div className="flex gap-3">
                         <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74]"></span> Completed</span>
                         <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Expected</span>
                      </div>
                   </div>
                   {/* SVG Chart */}
                   <div className="flex-1 relative mt-2 w-full h-full">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 240 50" preserveAspectRatio="none">
                         {/* Dashed line (Expected) */}
                         <path d="M0,35 Q30,20 60,35 T120,25 T180,30 T240,15" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                         {/* Solid line (Completed) */}
                         <path d="M0,25 Q30,10 60,25 T120,10 T180,40 T240,20" fill="none" stroke="#FDBA74" strokeWidth="2" />
                         {/* Active Data Point */}
                         <circle cx="105" cy="17" r="4" fill="#10B981" />
                      </svg>
                      {/* Dark Tooltip */}
                      <div className="absolute top-[-5px] left-[92px] bg-[#2A2A2A] rounded-md px-2 py-1.5 flex flex-col items-center shadow-lg">
                         <span className="text-[10px] text-white font-bold leading-tight flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74]"></span> 16</span>
                         <span className="text-[10px] text-white font-bold leading-tight flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> 14</span>
                      </div>
                   </div>
                   <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-1">
                      <span>18 Jun</span><span>19 Jun</span><span>20 Jun</span><span>21 Jun</span><span>22 Jun</span><span>23 Jun</span><span>24 Jun</span>
                   </div>
                </div>
             </div>

             {/* MAP AREA */}
             <div className="flex-1 relative bg-[#F4F5F5] rounded-[24px]">
                {/* Map Controls */}
                <div className="absolute top-2 left-2 flex items-center gap-6 z-20">
                   <div className="bg-white rounded-full p-1.5 flex shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
                      <button className="px-6 py-2 bg-[#1A1A1A] text-white text-[13px] font-bold rounded-full shadow-sm">Donors</button>
                      <button className="px-6 py-2 text-gray-600 hover:text-gray-900 text-[13px] font-bold rounded-full transition-colors">Recipients</button>
                   </div>
                   <div className="flex items-center gap-2 text-[12px] font-bold text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Last synced: 2 min ago
                   </div>
                </div>

                {/* SVG MAP (Using Turkey Data but styled generic grey) */}
                <div className="absolute inset-0 z-10 pt-16 flex items-center justify-center opacity-90">
                   <svg width="100%" height="100%" viewBox="0 0 1050 480" className="w-[95%] h-[95%] object-contain" style={{ pointerEvents: 'auto' }}>
                      {/* Map Paths */}
                      <g>
                        {require('../../../../components/TurkeyMapData').default.map((city: any, i: number) => (
                          <path key={i} d={city.draw} fill="#D1D5DB" stroke="#F4F5F5" strokeWidth="1.5" />
                        ))}
                      </g>
                      
                      {/* Connection Lines from Black Marker to Popup Area */}
                      <g opacity="0.6">
                        <path d="M450,220 Q650,200 850,150" fill="none" stroke="white" strokeWidth="2" />
                        <path d="M450,220 Q650,220 850,250" fill="none" stroke="white" strokeWidth="2" />
                        <path d="M450,220 Q650,240 850,200" fill="none" stroke="white" strokeWidth="2" />
                        <path d="M450,220 Q650,260 850,300" fill="none" stroke="white" strokeWidth="2" />
                      </g>

                      {/* Map Markers */}
                      
                      {/* Dark Marker */}
                      <g transform="translate(450, 220)">
                         <circle r="36" fill="#1A1A1A" />
                         <text y="7" textAnchor="middle" fill="white" className="text-[24px] font-bold">5</text>
                      </g>

                      {/* Orange Markers */}
                      <g transform="translate(250, 160)">
                         <circle r="28" fill="#FDBA74" />
                         <text y="6" textAnchor="middle" fill="#1A1A1A" className="text-[18px] font-bold">18</text>
                         {/* Mini tooltip for Best Matches */}
                         <rect x="-35" y="-55" width="70" height="24" rx="4" fill="#2A2A2A" />
                         <text y="-39" textAnchor="middle" fill="white" className="text-[10px] font-bold">Best matches</text>
                         {/* Tiny connected avatars near orange marker */}
                         <image href="https://i.pravatar.cc/150?u=a1" x="-45" y="-30" width="20" height="20" clipPath="circle()" className="rounded-full border-2 border-white"/>
                         <image href="https://i.pravatar.cc/150?u=b2" x="-20" y="-80" width="20" height="20" clipPath="circle()" className="rounded-full border-2 border-white"/>
                      </g>

                      <g transform="translate(320, 360)">
                         <circle r="22" fill="#FDBA74" />
                         <text y="5" textAnchor="middle" fill="#1A1A1A" className="text-[14px] font-bold">4</text>
                      </g>

                      <g transform="translate(680, 280)">
                         <circle r="28" fill="#FDBA74" />
                         <text y="6" textAnchor="middle" fill="#1A1A1A" className="text-[18px] font-bold">2</text>
                      </g>
                   </svg>
                </div>

                {/* Popups & Elements Overlay */}

                {/* MATCHED DONORS POPUP (Right side, connected via SVG lines) */}
                <div className="absolute right-0 top-1/2 -translate-y-[40%] w-[330px] bg-[#222222] rounded-[24px] shadow-[0_24px_48px_rgba(0,0,0,0.3)] pt-5 pb-3 px-3 z-30 font-sans border border-white/5">
                   <div className="flex items-start justify-between mb-5 px-3">
                     <div>
                       <h3 className="text-white text-[16px] font-bold tracking-wide mb-1.5">Matched donors</h3>
                       <div className="flex items-center gap-2">
                         <div className="w-[18px] h-[14px] bg-blue-700 rounded-[2px] flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/></svg>
                           </div>
                         </div>
                         <span className="text-[#9CA3AF] text-[13px] font-medium">European Union</span>
                       </div>
                     </div>
                     <button className="w-[34px] h-[34px] rounded-full bg-[#10B981] flex items-center justify-center text-white hover:bg-[#059669] transition-colors shadow-lg group">
                       <svg className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                     </button>
                   </div>

                   <div className="space-y-1">
                      {[
                        {name: 'Liam Thompson', desc: 'Male, 32 years', score: '94%', active: false, img: 'https://i.pravatar.cc/150?u=liam'},
                        {name: 'Mai Johnson', desc: 'Female, 41 years', score: '88%', active: true, img: 'https://i.pravatar.cc/150?u=mai'},
                        {name: 'Mia Hariz', desc: 'Female, 38 years', score: '79%', active: false, img: 'https://i.pravatar.cc/150?u=mia'},
                        {name: 'Lily Al Mamoos', desc: 'Female, 36 years', score: '74%', active: false, img: 'https://i.pravatar.cc/150?u=lily'},
                        {name: 'Noah Anderson', desc: 'Male, 32 years', score: '72%', active: false, img: 'https://i.pravatar.cc/150?u=noah'}
                      ].map((item, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group ${item.active ? 'bg-[#3A3A3A]' : 'hover:bg-[#3A3A3A]'}`}>
                          <div className="flex items-center gap-3.5">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                                 <img src={item.img} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-[2.5px] border-[#222222] group-hover:border-[#3A3A3A] transition-colors ${idx % 2 === 0 ? 'bg-red-500' : 'bg-[#10B981]'}`}></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white text-[14px] font-medium tracking-wide mb-0.5">{item.name}</span>
                              <span className="text-[#9CA3AF] text-[12px]">{item.desc}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-end w-12">
                             <span className={`text-white text-[15px] font-medium ${item.active ? 'hidden' : 'group-hover:hidden'}`}>{item.score}</span>
                             <button className={`w-8 h-8 rounded-full bg-white text-[#222222] items-center justify-center shadow-sm hover:scale-105 transition-transform ${item.active ? 'flex' : 'hidden group-hover:flex'}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                             </button>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* BOTTOM FLOATING TOAST (New data available) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#2A2A2A] rounded-[20px] pl-5 pr-3 py-3 flex items-center gap-6 shadow-2xl z-30 font-sans border border-white/5">
                   <div className="w-[34px] h-[34px] rounded-lg bg-[#3F3F46] flex items-center justify-center shrink-0">
                      <div className="w-5 h-5 rounded-full bg-[#FDBA74] flex items-center justify-center text-[#2A2A2A] font-black text-[12px]">!</div>
                   </div>
                   <div className="flex flex-col pr-8">
                      <span className="text-white text-[15px] font-bold tracking-wide mb-0.5">New data available</span>
                      <span className="text-[#9CA3AF] text-[13px] font-medium">Donor statuses have changed</span>
                   </div>
                   <button className="w-11 h-11 rounded-full bg-[#10B981] flex items-center justify-center text-white hover:bg-[#059669] transition-colors shadow-lg shrink-0 group">
                      <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   </button>
                </div>

             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
