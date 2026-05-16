'use client';
import React, {useState} from 'react';

const cities = [
  { name: 'İstanbul', x: 58, y: 22, count: 4820, size: 28 },
  { name: 'Ankara', x: 52, y: 32, count: 1240, size: 22 },
  { name: 'İzmir', x: 34, y: 38, count: 980, size: 20 },
  { name: 'Antalya', x: 44, y: 52, count: 620, size: 18 },
  { name: 'Bursa', x: 46, y: 24, count: 540, size: 16 },
  { name: 'Adana', x: 56, y: 50, count: 380, size: 15 },
  { name: 'Trabzon', x: 68, y: 18, count: 210, size: 14 },
  { name: 'Diyarbakır', x: 72, y: 36, count: 175, size: 13 },
  { name: 'Konya', x: 50, y: 42, count: 310, size: 15 },
  { name: 'Gaziantep', x: 64, y: 46, count: 290, size: 14 },
];

const topUsers = [
  { name: 'Ayşe Yılmaz', role: 'Satıcı', city: 'İstanbul', score: 98, online: true, img: 'https://i.pravatar.cc/150?u=ayse1' },
  { name: 'Merve Demir', role: 'Alıcı', city: 'İzmir', score: 92, online: true, img: 'https://i.pravatar.cc/150?u=merve2' },
  { name: 'Zeynep Kaya', role: 'Premium', city: 'Ankara', score: 85, online: false, img: 'https://i.pravatar.cc/150?u=zeynep3' },
  { name: 'Elif Şahin', role: 'Satıcı', city: 'Bursa', score: 81, online: true, img: 'https://i.pravatar.cc/150?u=elif4' },
  { name: 'Fatma Çelik', role: 'Alıcı', city: 'Antalya', score: 76, online: false, img: 'https://i.pravatar.cc/150?u=fatma5' },
];

export default function UserDistributionPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'sellers'|'buyers'>('sellers');
  const [selectedCity, setSelectedCity] = useState<string|null>(null);
  const [userType, setUserType] = useState('Tümü');
  const [status, setStatus] = useState('Tümü');
  const [device, setDevice] = useState('Tümü');
  const [regDate, setRegDate] = useState('Son 30 Gün');
  const [expandedUser, setExpandedUser] = useState<number|null>(null);
  const [toastVisible, setToastVisible] = useState(true);
  const [expandedCityIdx, setExpandedCityIdx] = useState<number|null>(null);
  const [activeStatCard, setActiveStatCard] = useState<number|null>(null);

  const toggle = (val: string, current: string) => val === current ? 'Tümü' : val;

  return (
    <div className="min-h-screen bg-[#F5F6F6] font-sans pb-24">

      {/* TOP BAR */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-[16px] font-bold text-[#1A1A1A]">Kullanıcı Dağılımı</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${showFilters ? 'bg-[#10B981] text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
          <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center relative active:scale-90 transition-transform">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          </button>
        </div>
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-4 py-4 space-y-4">
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Kullanıcı Tipi</h3>
            <div className="flex gap-2 flex-wrap">
              {['Tümü','Satıcı','Alıcı','Premium'].map(t=>(
                <button key={t} onClick={()=>setUserType(toggle(t,userType))} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all active:scale-95 ${userType===t?'bg-[#1A1A1A] text-white shadow-sm':'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Durum</h3>
            <div className="flex gap-2 flex-wrap">
              {['Tümü','Aktif','Pasif','Askıda'].map(t=>(
                <button key={t} onClick={()=>setStatus(toggle(t,status))} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all active:scale-95 ${status===t?'bg-[#10B981] text-white shadow-sm':'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Cihaz</h3>
            <div className="flex gap-2 flex-wrap">
              {['Tümü','iOS','Android','Web'].map(t=>(
                <button key={t} onClick={()=>setDevice(toggle(t,device))} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all active:scale-95 ${device===t?'bg-[#1A1A1A] text-white shadow-sm':'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Kayıt Tarihi</h3>
            <div className="flex gap-2 flex-wrap">
              {['Son 7 Gün','Son 30 Gün','Son 90 Gün','Tümü'].map(t=>(
                <button key={t} onClick={()=>setRegDate(t)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${regDate===t?'bg-[#10B981] text-white shadow-sm':'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 pt-1">
            <button onClick={()=>{setUserType('Tümü');setStatus('Tümü');setDevice('Tümü');setRegDate('Son 30 Gün');}} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-[12.5px] font-semibold text-[#1A1A1A] active:scale-95 transition-transform">Temizle</button>
            <button onClick={()=>setShowFilters(false)} className="flex-[2] py-2.5 bg-[#10B981] rounded-xl text-[12.5px] font-semibold text-white shadow-md active:scale-95 transition-transform">Filtrele</button>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="px-4 py-4 flex gap-3 overflow-x-auto no-scrollbar">
        {[
          {label:'Toplam Kullanıcı',val:'9.6B',sub:'↑ %12 bu ay',subColor:'text-[#10B981]'},
          {label:'Aktif Kullanıcı',val:'85%',sub:'8.2B aktif',subColor:'text-[#FDBA74]'},
          {label:'Ort. Oturum',val:'14dk',sub:'↑ %5 artış',subColor:'text-[#10B981]'},
          {label:'Yeni Kayıt',val:'124',sub:'Bu hafta',subColor:'text-gray-400'},
        ].map((card,i)=>(
          <button key={i} onClick={()=>setActiveStatCard(activeStatCard===i?null:i)} className={`min-w-[140px] bg-white rounded-2xl p-4 shadow-sm border shrink-0 text-left transition-all active:scale-95 ${activeStatCard===i?'border-[#10B981] ring-2 ring-[#10B981]/20':'border-gray-100/50'}`}>
            <p className="text-[11px] font-semibold text-gray-400 mb-1">{card.label}</p>
            <p className="text-[26px] font-bold text-[#1A1A1A] leading-none">{card.val}</p>
            <p className={`text-[10px] font-semibold ${card.subColor} mt-1`}>{card.sub}</p>
          </button>
        ))}
      </div>

      {/* TOGGLE */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="bg-white rounded-full p-1 flex shadow-sm border border-gray-100">
          {(['sellers','buyers'] as const).map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`px-4 py-1.5 text-[12px] font-semibold rounded-full transition-all active:scale-95 ${activeTab===tab?'bg-[#1A1A1A] text-white shadow-sm':'text-gray-500'}`}>{tab==='sellers'?'Satıcılar':'Alıcılar'}</button>
          ))}
        </div>
        <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          2 dk önce
        </span>
      </div>

      {/* MAP */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-3 relative overflow-hidden" style={{aspectRatio:'4/3'}}>
          <div className="absolute inset-0 m-4 bg-center bg-no-repeat bg-contain opacity-70" style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/77/Turkey_adm_location_map.svg')"}}></div>
          
          <div className="absolute inset-0">
            {[
              { name: 'İstanbul', x: '26%', y: '18%', count: 4820, size: 28 },
              { name: 'Ankara', x: '45%', y: '35%', count: 1240, size: 22 },
              { name: 'İzmir', x: '14%', y: '50%', count: 980, size: 20 },
              { name: 'Antalya', x: '36%', y: '73%', count: 620, size: 18 },
              { name: 'Bursa', x: '26%', y: '28%', count: 540, size: 16 },
              { name: 'Adana', x: '63%', y: '73%', count: 380, size: 15 },
              { name: 'Trabzon', x: '82%', y: '16%', count: 210, size: 14 },
              { name: 'Diyarbakır', x: '83%', y: '60%', count: 175, size: 13 },
              { name: 'Konya', x: '46%', y: '58%', count: 310, size: 15 },
              { name: 'Gaziantep', x: '68%', y: '71%', count: 290, size: 14 },
            ].map(city=>(
              <div key={city.name} onClick={()=>setSelectedCity(selectedCity===city.name?null:city.name)} className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2" style={{left: city.x, top: city.y, zIndex: selectedCity===city.name?20:10}}>
                <div className={`rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${selectedCity===city.name ? 'bg-[#1A1A1A] scale-125' : 'bg-[#FDBA74] hover:scale-110'}`} style={{width: selectedCity===city.name?city.size:city.size*0.8, height: selectedCity===city.name?city.size:city.size*0.8}}>
                   <span className={`font-bold select-none text-[8px] ${selectedCity===city.name ? 'text-white' : 'text-[#1A1A1A]'}`}>
                     {city.count>999?`${(city.count/1000).toFixed(1)}B`:city.count}
                   </span>
                </div>
                {selectedCity===city.name&&(
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-[#2A2A2A] text-white text-[10px] font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                    {city.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CITY LIST */}
      <div className="px-4 pb-3">
        <h3 className="text-[13px] font-bold text-[#1A1A1A] mb-3">Şehir Bazlı Dağılım</h3>
        <div className="space-y-2">
          {cities.slice(0,5).map((city,i)=>(
            <button key={i} onClick={()=>{setExpandedCityIdx(expandedCityIdx===i?null:i);setSelectedCity(city.name);}} className={`w-full bg-white rounded-xl p-3 text-left transition-all active:scale-[0.98] border ${expandedCityIdx===i?'border-[#10B981] shadow-md':'border-gray-100/50 shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold transition-colors ${expandedCityIdx===i?'bg-[#10B981] text-white':'bg-gray-100 text-[#1A1A1A]'}`}>{i+1}</div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#1A1A1A]">{city.name}</p>
                    <p className="text-[10px] text-gray-400">{city.count.toLocaleString('tr-TR')} kullanıcı</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full transition-all" style={{width:`${(city.count/4820)*100}%`}}></div>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 w-8 text-right">{((city.count/9600)*100).toFixed(0)}%</span>
                </div>
              </div>
              {expandedCityIdx===i&&(
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-400">Satıcı</p>
                    <p className="text-[13px] font-bold text-[#1A1A1A]">{Math.round(city.count*0.4)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-400">Alıcı</p>
                    <p className="text-[13px] font-bold text-[#1A1A1A]">{Math.round(city.count*0.55)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-400">Premium</p>
                    <p className="text-[13px] font-bold text-[#10B981]">{Math.round(city.count*0.05)}</p>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TOP USERS */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-[#1A1A1A]">En Aktif Kullanıcılar</h3>
          <button className="text-[11px] font-semibold text-[#10B981] active:opacity-60 transition-opacity">Tümünü Gör →</button>
        </div>
        <div className="bg-[#222222] rounded-2xl p-3 space-y-0.5">
          {topUsers.map((user,idx)=>(
            <button key={idx} onClick={()=>setExpandedUser(expandedUser===idx?null:idx)} className={`w-full text-left p-2.5 rounded-xl transition-all active:scale-[0.98] ${expandedUser===idx?'bg-[#3A3A3A]':'hover:bg-[#3A3A3A]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden">
                      <img src={user.img} alt="" className="w-full h-full object-cover"/>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#222222] ${user.online?'bg-[#10B981]':'bg-gray-500'}`}></div>
                  </div>
                  <div>
                    <p className="text-white text-[12px] font-medium">{user.name}</p>
                    <p className="text-[#9CA3AF] text-[10px]">{user.role} · {user.city}</p>
                  </div>
                </div>
                <span className="text-white text-[12px] font-semibold">{user.score}%</span>
              </div>
              {expandedUser===idx&&(
                <div className="mt-3 pt-3 border-t border-[#444] flex gap-2">
                  <button className="flex-1 py-2 bg-[#10B981] rounded-lg text-[11px] font-semibold text-white active:scale-95 transition-transform">Profili Gör</button>
                  <button className="flex-1 py-2 bg-[#444] rounded-lg text-[11px] font-semibold text-white active:scale-95 transition-transform">Mesaj Gönder</button>
                  <button className="py-2 px-3 bg-[#444] rounded-lg text-[11px] font-semibold text-red-400 active:scale-95 transition-transform">Askıya Al</button>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TOAST */}
      {toastVisible&&(
        <div className="fixed bottom-6 left-4 right-4 z-50">
          <div className="bg-[#2A2A2A] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
            <div className="w-8 h-8 rounded-lg bg-[#3F3F46] flex items-center justify-center shrink-0">
              <div className="w-4 h-4 rounded-full bg-[#FDBA74] flex items-center justify-center text-[#2A2A2A] font-black text-[9px]">!</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-bold">Yeni veri mevcut</p>
              <p className="text-[#9CA3AF] text-[10px]">Kullanıcı dağılımı güncellendi</p>
            </div>
            <button onClick={()=>setToastVisible(false)} className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
