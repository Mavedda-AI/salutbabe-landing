'use client';
import React, {useState} from 'react';

const cities = [
  { name: 'İstanbul', x: '26%', y: '22%', count: 4820, size: 28, trend: '+12%' },
  { name: 'Ankara', x: '45%', y: '35%', count: 1240, size: 22, trend: '+5%' },
  { name: 'İzmir', x: '14%', y: '48%', count: 980, size: 20, trend: '+8%' },
  { name: 'Antalya', x: '36%', y: '73%', count: 620, size: 18, trend: '+15%' },
  { name: 'Bursa', x: '26%', y: '30%', count: 540, size: 16, trend: '+3%' },
  { name: 'Adana', x: '63%', y: '73%', count: 380, size: 15, trend: '-2%' },
  { name: 'Trabzon', x: '82%', y: '16%', count: 210, size: 14, trend: '+1%' },
  { name: 'Diyarbakır', x: '83%', y: '60%', count: 175, size: 13, trend: '+4%' },
  { name: 'Konya', x: '46%', y: '58%', count: 310, size: 15, trend: '+2%' },
  { name: 'Gaziantep', x: '68%', y: '71%', count: 290, size: 14, trend: '+7%' },
];

const topUsers = [
  { name: 'Ayşe Yılmaz', role: 'Satıcı', city: 'İstanbul', score: 98, online: true, img: 'https://i.pravatar.cc/150?u=ayse1', sales: 142 },
  { name: 'Merve Demir', role: 'Alıcı', city: 'İzmir', score: 92, online: true, img: 'https://i.pravatar.cc/150?u=merve2', sales: 84 },
  { name: 'Zeynep Kaya', role: 'Premium', city: 'Ankara', score: 85, online: false, img: 'https://i.pravatar.cc/150?u=zeynep3', sales: 65 },
  { name: 'Elif Şahin', role: 'Satıcı', city: 'Bursa', score: 81, online: true, img: 'https://i.pravatar.cc/150?u=elif4', sales: 52 },
];

export default function UserDistributionPage() {
  const [activeTab, setActiveTab] = useState<'sellers' | 'buyers'>('sellers');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [expandedCityListIdx, setExpandedCityListIdx] = useState<number | null>(null);

  // Filters State
  const [filters, setFilters] = useState({
    role: 'Tümü',
    status: 'Tümü',
    device: 'Tümü',
    date: 'Son 30 Gün',
  });

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? 'Tümü' : value }));
  };

  // Nexadash design tokens
  const cardClass = `rounded-[16px] border bg-white border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]`;
  const textTitle = `text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-gray-500`;
  const textValue = `text-[24px] md:text-[28px] font-black tracking-tight text-[#111827]`;
  const badgeGreen = `flex items-center gap-1 bg-[#E6F8ED] text-[#16A34A] px-2 py-0.5 rounded text-[10px] font-bold w-fit`;
  const badgeRed = `flex items-center gap-1 bg-[#FEF2F2] text-[#DC2626] px-2 py-0.5 rounded text-[10px] font-bold w-fit`;

  const FilterPills = ({ title, options, filterKey }: { title: string, options: string[], filterKey: keyof typeof filters }) => (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(t => (
          <button 
            key={t} 
            onClick={() => updateFilter(filterKey, t)} 
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filters[filterKey] === t ? 'bg-[#111827] text-white shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in pb-12 font-sans px-4 sm:px-6">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#111827] tracking-tight">Kullanıcı Dağılımı</h1>
          <p className="text-[12px] font-bold text-gray-500 mt-1">Türkiye Geneli Canlı Analiz ve Kohort Takibi</p>
        </div>
        
        {/* Desktop Filter Bar */}
        <div className="hidden lg:flex items-center gap-6 bg-white p-3 rounded-[16px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <FilterPills title="Rol" options={['Tümü', 'Satıcı', 'Alıcı', 'Premium']} filterKey="role" />
            <div className="w-px h-8 bg-gray-200 mx-2"></div>
            <FilterPills title="Cihaz" options={['Tümü', 'iOS', 'Android', 'Web']} filterKey="device" />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-700 shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filtreler
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'TOPLAM KULLANICI', value: '9.6B', trend: '↗ 12%', type: 'up' },
          { label: 'AKTİF SATICILAR', value: '4.2B', trend: '↗ 8%', type: 'up' },
          { label: 'AKTİF ALICILAR', value: '5.1B', trend: '↗ 15%', type: 'up' },
          { label: 'ORT. OTURUM SÜRESİ', value: '14dk', trend: '↘ 2dk', type: 'down' },
        ].map((stat, i) => (
          <div key={i} className={`${cardClass} p-4 md:p-5 flex flex-col hover:border-gray-300 transition-colors cursor-default`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className={textTitle}>{stat.label}</h3>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
              <h2 className={textValue}>{stat.value}</h2>
            </div>
            <span className={stat.type === 'up' ? badgeGreen : badgeRed}>{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* MAP & SIDE PANELS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* MAP SECTION (col-span-2) */}
        <div className={`${cardClass} p-4 md:p-6 lg:col-span-2 flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={textTitle}>
              <svg className="w-4 h-4 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              TÜRKİYE AKTİVİTE HARİTASI
            </h3>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <button onClick={() => setActiveTab('sellers')} className={`px-3 py-1 shadow-sm rounded-md text-[10px] font-bold transition-all ${activeTab === 'sellers' ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Satıcılar</button>
                <button onClick={() => setActiveTab('buyers')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors ${activeTab === 'buyers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Alıcılar</button>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Canlı
              </div>
            </div>
          </div>

          <div className="relative w-full aspect-[1024/500] bg-[#111827] rounded-[12px] overflow-hidden border border-gray-800">
            {/* Map Background */}
            <div className="absolute inset-0 m-2 sm:m-6 opacity-70 bg-center bg-no-repeat bg-contain mix-blend-screen" style={{backgroundImage: "url('/turkey-map.png')"}}></div>
            
            {/* Map Markers */}
            <div className="absolute inset-0 m-2 sm:m-6">
              {cities.map((city) => (
                <div key={city.name} onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)} className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2" style={{left: city.x, top: city.y, zIndex: selectedCity === city.name ? 20 : 10}}>
                  <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${selectedCity === city.name ? 'bg-white scale-125 z-20 shadow-xl' : 'bg-[#16A34A] hover:scale-110 hover:bg-[#22c55e] shadow-md'}`} style={{width: city.size, height: city.size}}>
                    <span className={`text-[9px] font-bold ${selectedCity === city.name ? 'text-[#111827]' : 'text-white'}`}>
                      {city.count > 999 ? `${(city.count/1000).toFixed(1)}B` : city.count}
                    </span>
                    {/* Pulse effect */}
                    {city.count > 2000 && selectedCity !== city.name && (
                      <div className="absolute inset-0 rounded-full bg-[#16A34A] animate-ping opacity-30"></div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  {selectedCity === city.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white text-[#111827] px-4 py-3 rounded-xl shadow-2xl whitespace-nowrap z-30 min-w-[140px] flex flex-col gap-1 border border-gray-100">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45"></div>
                      <span className="text-[13px] font-black">{city.name}</span>
                      <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mt-1">
                        <span>Kullanıcı</span>
                        <span className="text-[#16A34A]">{city.count.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold text-gray-500">
                        <span>Trend</span>
                        <span className="text-[#16A34A]">{city.trend}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDE PANELS (col-span-1) */}
        <div className="flex flex-col gap-4 md:gap-6">
          
          {/* CITY LIST WITH EXPANDABLE TRACKING */}
          <div className={`${cardClass} p-4 md:p-6 flex-1`}>
            <h3 className={`${textTitle} mb-5`}>ŞEHİR DAĞILIMI & TAKİP</h3>
            <div className="space-y-3">
              {cities.slice(0, 4).map((city, i) => (
                <div key={i} className={`rounded-xl border transition-all duration-300 overflow-hidden ${expandedCityListIdx === i ? 'bg-gray-50/50 border-gray-200' : 'bg-white border-transparent hover:border-gray-100'}`}>
                  <div onClick={() => setExpandedCityListIdx(expandedCityListIdx === i ? null : i)} className="p-3 cursor-pointer flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black transition-colors ${expandedCityListIdx === i ? 'bg-[#111827] text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-[#111827] leading-tight">{city.name}</span>
                          <span className="text-[10px] font-bold text-gray-500">{city.count.toLocaleString('tr-TR')} kullanıcı</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-gray-400">{((city.count / 9600) * 100).toFixed(0)}%</span>
                        <svg className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${expandedCityListIdx === i ? 'rotate-180 text-gray-900' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#16A34A] rounded-full transition-all duration-1000" style={{width: `${(city.count / 4820) * 100}%`}}></div>
                    </div>
                  </div>

                  {/* EXPANDED TRACKING METRICS */}
                  <div className={`transition-all duration-500 ease-in-out ${expandedCityListIdx === i ? 'max-h-[500px] opacity-100 p-4 pt-1 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5 pt-3">
                      {/* Yaş Dağılımı */}
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 mb-2 uppercase tracking-widest">YAŞ DAĞILIMI</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-gray-500">18-24</span><span className="text-[10px] font-black text-[#111827]">35%</span></div>
                          <div className="h-1 w-full bg-gray-100 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{width: '35%'}}></div></div>
                          
                          <div className="flex justify-between items-center mt-2"><span className="text-[10px] font-bold text-gray-500">25-34</span><span className="text-[10px] font-black text-[#111827]">45%</span></div>
                          <div className="h-1 w-full bg-gray-100 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{width: '45%'}}></div></div>
                        </div>
                      </div>

                      {/* Rol Dağılımı */}
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 mb-2 uppercase tracking-widest">ROL DAĞILIMI</p>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span><span className="text-[10px] font-bold text-gray-500">Satıcı</span></div>
                            <span className="text-[10px] font-black text-[#16A34A]">60%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span><span className="text-[10px] font-bold text-gray-500">Alıcı</span></div>
                            <span className="text-[10px] font-black text-blue-600">30%</span>
                          </div>
                        </div>
                      </div>

                      {/* Cihaz Dağılımı */}
                      <div className="col-span-2 bg-white rounded-[10px] p-3 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <p className="text-[9px] font-bold text-gray-400 mb-2 uppercase tracking-widest">CİHAZ KULLANIMI</p>
                        <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-2">
                          <div className="bg-[#111827] w-[60%]"></div>
                          <div className="bg-[#16A34A] w-[30%]"></div>
                          <div className="bg-gray-300 w-[10%]"></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-bold">
                          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#111827]"></span><span className="text-gray-500">iOS (%60)</span></div>
                          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span><span className="text-gray-500">Android (%30)</span></div>
                          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span><span className="text-gray-500">Web (%10)</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP PROFILES */}
          <div className={`${cardClass} p-4 md:p-6`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={textTitle}>AKTİF PROFİLLER</h3>
              <button className="text-[10px] font-black text-[#111827] hover:underline">TÜMÜ →</button>
            </div>
            <div className="space-y-3">
              {topUsers.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden shadow-sm">
                        <img src={user.img} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.online ? 'bg-[#16A34A]' : 'bg-gray-300'}`}></div>
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-[#111827]">{user.name}</p>
                      <p className="text-[10px] font-bold text-gray-500">{user.role} · {user.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-black text-[#16A34A]">{user.score}%</p>
                    <p className="text-[9px] font-bold text-gray-400">{user.sales} Satış</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)}></div>
          <div className="bg-white w-full rounded-t-[24px] max-h-[85vh] flex flex-col relative z-10 animate-in slide-in-from-bottom shadow-2xl">
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-[16px] font-black text-[#111827]">Filtreler</h2>
              <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto no-scrollbar space-y-6">
              <FilterPills title="Kullanıcı Rolü" options={['Tümü', 'Satıcı', 'Alıcı', 'Premium']} filterKey="role" />
              <FilterPills title="Durum" options={['Tümü', 'Aktif', 'Pasif', 'Askıda']} filterKey="status" />
              <FilterPills title="Cihaz Tipi" options={['Tümü', 'iOS', 'Android', 'Web']} filterKey="device" />
              <FilterPills title="Kayıt Tarihi" options={['Bugün', 'Son 7 Gün', 'Son 30 Gün', 'Tümü']} filterKey="date" />
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 safe-area-pb">
              <button onClick={() => setFilters({role:'Tümü',status:'Tümü',device:'Tümü',date:'Son 30 Gün'})} className="flex-1 py-3.5 bg-white border border-gray-200 text-[#111827] rounded-[12px] font-black text-[12px] shadow-sm active:scale-95">Sıfırla</button>
              <button onClick={() => setShowMobileFilter(false)} className="flex-[2] py-3.5 bg-[#111827] text-white rounded-[12px] font-black text-[12px] shadow-md active:scale-95">Uygula</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
