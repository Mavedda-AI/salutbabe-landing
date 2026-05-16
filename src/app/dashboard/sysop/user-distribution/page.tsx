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
  const [toastVisible, setToastVisible] = useState(true);

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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Role */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kullanıcı Rolü</h3>
        <div className="flex flex-wrap gap-2">
          {['Tümü', 'Satıcı', 'Alıcı', 'Premium'].map(t => (
            <button key={t} onClick={() => updateFilter('role', t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${filters.role === t ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {/* Status */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Durum</h3>
        <div className="flex flex-wrap gap-2">
          {['Tümü', 'Aktif', 'Pasif', 'Askıda'].map(t => (
            <button key={t} onClick={() => updateFilter('status', t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${filters.status === t ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {/* Device */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cihaz Tipi</h3>
        <div className="flex flex-wrap gap-2">
          {['Tümü', 'iOS', 'Android', 'Web'].map(t => (
            <button key={t} onClick={() => updateFilter('device', t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${filters.device === t ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {/* Date */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kayıt Tarihi</h3>
        <div className="flex flex-wrap gap-2">
          {['Bugün', 'Son 7 Gün', 'Son 30 Gün', 'Tümü'].map(t => (
            <button key={t} onClick={() => updateFilter('date', t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${filters.date === t ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-none">Kullanıcı Dağılımı</h1>
          <p className="text-xs text-slate-500 mt-1">Türkiye Geneli İstatistikler</p>
        </div>
        <button onClick={() => setShowMobileFilter(true)} className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 active:scale-90 transition-transform">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-[320px] bg-white border-r border-slate-200 flex-col h-screen shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Filtreler</h2>
          <p className="text-sm text-slate-500 mt-1">Görünümü özelleştirin</p>
        </div>
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
          <FilterContent />
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95">
            Sonuçları Uygula
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative">
        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full pb-32 lg:pb-8">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {[
              { label: 'Toplam Kullanıcı', value: '9.6B', trend: '+12%', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Aktif Satıcılar', value: '4.2B', trend: '+8%', color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Aktif Alıcılar', value: '5.1B', trend: '+15%', color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Ort. Oturum', value: '14dk', trend: '+2dk', color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${stat.color} ${stat.bg}`}>
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
            
            {/* MAP SECTION */}
            <div className="flex-[2] bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-slate-100 p-1 rounded-2xl flex">
                  {(['sellers', 'buyers'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      {tab === 'sellers' ? 'Satıcılar' : 'Alıcılar'}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Canlı Veri
                </div>
              </div>

              <div className="relative w-full aspect-[1024/500] bg-slate-900 rounded-2xl overflow-hidden border border-slate-100">
                {/* Map Background */}
                <div className="absolute inset-0 m-2 sm:m-6 opacity-80 bg-center bg-no-repeat bg-contain mix-blend-screen" style={{backgroundImage: "url('/turkey-map.png')"}}></div>
                
                {/* Map Markers */}
                <div className="absolute inset-0 m-2 sm:m-6">
                  {cities.map((city) => (
                    <div key={city.name} onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)} className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2" style={{left: city.x, top: city.y, zIndex: selectedCity === city.name ? 20 : 10}}>
                      <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${selectedCity === city.name ? 'bg-slate-900 scale-125 z-20 shadow-xl' : 'bg-emerald-500 hover:scale-110 hover:bg-emerald-400 shadow-md'}`} style={{width: city.size, height: city.size}}>
                        <span className={`text-[9px] font-bold ${selectedCity === city.name ? 'text-white' : 'text-emerald-50'}`}>
                          {city.count > 999 ? `${(city.count/1000).toFixed(1)}B` : city.count}
                        </span>
                        {/* Pulse effect */}
                        {city.count > 2000 && selectedCity !== city.name && (
                          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30"></div>
                        )}
                      </div>
                      
                      {/* Tooltip */}
                      {selectedCity === city.name && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl whitespace-nowrap z-30 min-w-[120px] flex flex-col gap-1">
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                          <span className="text-sm font-bold">{city.name}</span>
                          <div className="flex justify-between items-center text-[10px] text-slate-300">
                            <span>Kullanıcı</span>
                            <span className="font-bold text-emerald-400">{city.count.toLocaleString('tr-TR')}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-300">
                            <span>Trend</span>
                            <span className="font-bold text-emerald-400">{city.trend}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDE PANELS */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-[300px]">
              {/* TOP USERS */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex-1">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-slate-900">En Aktif Profiller</h3>
                  <button className="text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Tümü →</button>
                </div>
                <div className="space-y-3">
                  {topUsers.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                            <img src={user.img} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs font-medium text-slate-500">{user.role} · {user.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-500">{user.score}%</p>
                        <p className="text-[10px] font-semibold text-slate-400">{user.sales} Satış</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CITY LIST */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-5">Şehir Dağılımı</h3>
                <div className="space-y-4">
                  {cities.slice(0, 4).map((city, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-700">{city.name}</span>
                        <span className="text-xs font-bold text-slate-400">{city.count.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{width: `${(city.count / 4820) * 100}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)}></div>
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col relative z-10 animate-in slide-in-from-bottom shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Filtreler</h2>
              <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto no-scrollbar">
              <FilterContent />
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 safe-area-pb">
              <button onClick={() => setFilters({role:'Tümü',status:'Tümü',device:'Tümü',date:'Son 30 Gün'})} className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm active:scale-95">Sıfırla</button>
              <button onClick={() => setShowMobileFilter(false)} className="flex-[2] py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95">Uygula</button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-slate-900 rounded-full px-5 py-3 flex items-center gap-4 shadow-2xl shadow-slate-900/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-sm font-semibold text-white">Harita verileri güncellendi</p>
            <button onClick={() => setToastVisible(false)} className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
