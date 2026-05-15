import React, {useState} from 'react';
import {useThemeLanguage} from "../context/ThemeLanguageContext";

interface VisitorAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitorAnalyticsModal({ isOpen, onClose }: VisitorAnalyticsModalProps) {
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';
  
  const [filterCity, setFilterCity] = useState("Tüm Şehirler");
  const [filterAge, setFilterAge] = useState("Tümü");
  const [filterGender, setFilterGender] = useState("Tümü");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col relative ${isDark ? 'bg-[#121214] border border-white/10' : 'bg-[#F8F9FA] border border-gray-200'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
           <div>
             <h2 className={`text-2xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Gelişmiş Ziyaretçi Analitiği
             </h2>
             <p className={`text-[13px] font-bold mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Toplam Ziyaretçi: 3,247 <span className="text-green-500 ml-2">↗ 1.8%</span></p>
           </div>
           <button onClick={onClose} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="p-6 flex flex-col xl:flex-row gap-6">
          
          {/* Left Column: Filters & Heatmap */}
          <div className="flex-1 flex flex-col gap-6">
             {/* Filters */}
             <div className={`p-5 rounded-2xl border flex flex-wrap gap-4 ${isDark ? 'bg-[#1A1D1F] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex-1 min-w-[140px]">
                  <label className={`block text-[10px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Lokasyon (Şehir/Ülke)</label>
                  <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className={`w-full h-10 px-3 rounded-xl border text-[13px] font-bold outline-none transition-colors ${isDark ? 'bg-[#121214] border-white/10 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-primary/50'}`}>
                     <option>Tüm Şehirler</option>
                     <option>İstanbul</option>
                     <option>Ankara</option>
                     <option>İzmir</option>
                     <option>Yurtdışı (Genel)</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className={`block text-[10px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Yaş Aralığı</label>
                  <select value={filterAge} onChange={(e) => setFilterAge(e.target.value)} className={`w-full h-10 px-3 rounded-xl border text-[13px] font-bold outline-none transition-colors ${isDark ? 'bg-[#121214] border-white/10 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-primary/50'}`}>
                     <option>Tümü</option>
                     <option>18-24</option>
                     <option>25-34</option>
                     <option>35-44</option>
                     <option>45+</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className={`block text-[10px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Cinsiyet</label>
                  <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className={`w-full h-10 px-3 rounded-xl border text-[13px] font-bold outline-none transition-colors ${isDark ? 'bg-[#121214] border-white/10 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-primary/50'}`}>
                     <option>Tümü</option>
                     <option>Kadın</option>
                     <option>Erkek</option>
                     <option>Belirtmek İstemiyor</option>
                  </select>
                </div>
             </div>

             {/* Heatmap Layout Replica from Design */}
             <div className={`p-6 rounded-2xl border flex flex-col ${isDark ? 'bg-[#1A1D1F] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`text-[12px] font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Haftalık Yoğunluk (Isı Haritası)</h3>
                  <div className="flex gap-4">
                     {[{t:'Pazaryeri', c:'bg-red-500'}, {t:'Web Sitesi', c:'bg-green-500'}, {t:'Canlı Odalar', c:'bg-blue-500'}].map((item, i) => (
                       <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold">
                         <div className={`w-2 h-2 rounded-full ${item.c}`}></div>
                         <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item.t}</span>
                       </div>
                     ))}
                  </div>
                </div>

                <div className="flex mt-auto w-full aspect-[2/1] max-h-[250px]">
                   <div className="flex flex-col justify-between pr-6 text-[10px] font-bold text-gray-400 pb-2">
                      <span>09.00 - 12.00</span>
                      <span>12.00 - 15.00</span>
                      <span>15.00 - 18.00</span>
                   </div>
                   <div className="flex-1 flex flex-col justify-between relative">
                      <div className="flex justify-between text-[11px] font-black text-gray-400 px-2 absolute -top-6 left-0 right-0">
                        <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span>
                      </div>
                      {/* Rows (3 rows of 5 squares) */}
                      <div className="flex justify-between gap-2 h-[30%]">
                         <div className="w-[18%] rounded-lg bg-gray-100 dark:bg-white/5"></div>
                         <div className="w-[18%] rounded-lg bg-gray-200 dark:bg-white/10 relative cursor-pointer hover:scale-105 transition-transform group">
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111827] text-white text-[10px] rounded-lg font-black whitespace-nowrap z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-2 h-2 rounded-full bg-white"></div> 82 Ziyaret</div>
                         </div>
                         <div className="w-[18%] rounded-lg bg-gray-300 dark:bg-white/20"></div>
                         <div className="w-[18%] rounded-lg bg-gray-100 dark:bg-white/5"></div>
                         <div className="w-[18%] rounded-lg bg-[#111827] dark:bg-white"></div>
                      </div>
                      <div className="flex justify-between gap-2 h-[30%]">
                         <div className="w-[18%] rounded-lg bg-gray-200 dark:bg-white/10"></div>
                         <div className="w-[18%] rounded-lg bg-[#111827] dark:bg-white"></div>
                         <div className="w-[18%] rounded-lg bg-gray-100 dark:bg-white/5"></div>
                         <div className="w-[18%] rounded-lg bg-[#111827] dark:bg-white"></div>
                         <div className="w-[18%] rounded-lg bg-gray-200 dark:bg-white/10"></div>
                      </div>
                      <div className="flex justify-between gap-2 h-[30%]">
                         <div className="w-[18%] rounded-lg bg-gray-100 dark:bg-white/5"></div>
                         <div className="w-[18%] rounded-lg bg-[#111827] dark:bg-white"></div>
                         <div className="w-[18%] rounded-lg bg-gray-300 dark:bg-white/20"></div>
                         <div className="w-[18%] rounded-lg bg-[#111827] dark:bg-white"></div>
                         <div className="w-[18%] rounded-lg bg-gray-100 dark:bg-white/5 relative cursor-pointer hover:scale-105 transition-transform group">
                           <div className="absolute right-0 bottom-full mb-2 px-2 py-1 bg-white border border-gray-200 text-[#111827] text-[10px] rounded-lg font-black whitespace-nowrap z-10 shadow-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-2 h-2 rounded-full bg-[#111827]"></div> 10 Ziyaret</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: World Map */}
          <div className={`flex-1 p-6 rounded-2xl border flex flex-col ${isDark ? 'bg-[#1A1D1F] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
             <div className="flex items-center justify-between mb-4 z-10 relative">
                <h3 className={`text-xl font-black italic tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>Top Şehirler</h3>
                <button className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>
             </div>
             
             {/* Map Container */}
             <div className="flex-1 relative min-h-[300px] w-full bg-[#F8F9FA] dark:bg-[#121214] rounded-xl overflow-hidden flex items-center justify-center">
                {/* SVG Dotted Map Approximation for Turkey */}
                <div className="absolute inset-4 opacity-40 dark:opacity-20 flex items-center justify-center">
                  <svg viewBox="0 0 1000 500" fill="currentColor" className="w-full h-full text-gray-400">
                    <pattern id="dots-turkey" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="3" cy="3" r="3" fill="currentColor"></circle>
                    </pattern>
                    <rect x="0" y="0" width="1000" height="500" fill="url(#dots-turkey)" mask="url(#turkey-mask)" />
                    <mask id="turkey-mask">
                       <path fill="white" d="M150,200 Q300,150 500,160 T850,200 Q950,250 850,300 Q700,380 400,380 Q150,400 120,300 Q80,250 150,200 Z" />
                    </mask>
                  </svg>
                </div>

                {/* City Pins */}
                {/* Istanbul */}
                <div className="absolute top-[25%] left-[26%] group cursor-pointer">
                  <div className="flex items-center gap-1.5 bg-[#111827] text-white px-3 py-1.5 rounded-full font-black text-[11px] shadow-xl relative animate-bounce-slow z-20">
                    <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[8px]">İST</div>
                    12.4K
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#111827] rotate-45"></div>
                  </div>
                </div>

                {/* Ankara */}
                <div className="absolute top-[45%] left-[52%] group cursor-pointer hover:scale-110 transition-transform">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 text-[#111827] px-3 py-1.5 rounded-full font-black text-[11px] shadow-xl relative z-10">
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px]">ANK</div>
                    8.2K
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45"></div>
                  </div>
                </div>

                {/* Izmir */}
                <div className="absolute top-[60%] left-[12%] group cursor-pointer hover:scale-110 transition-transform">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 text-[#111827] px-3 py-1.5 rounded-full font-black text-[11px] shadow-xl relative z-10">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[8px]">İZM</div>
                    5.1K
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45"></div>
                  </div>
                </div>

                {/* Antalya */}
                <div className="absolute bottom-[10%] left-[32%] group cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white shadow-lg flex items-center justify-center relative text-white text-[9px] font-bold z-10">
                     ANT
                  </div>
                </div>

                {/* Bursa */}
                <div className="absolute top-[42%] left-[28%] group cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white shadow-lg flex items-center justify-center relative text-white text-[8px] font-bold z-10">
                     BRS
                  </div>
                </div>
                
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
