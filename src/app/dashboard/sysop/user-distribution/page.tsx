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
  const [activeTab, setActiveTab] = useState<'sellers' | 'buyers'>('sellers');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F6F6] font-sans">

      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-[16px] font-bold text-[#1A1A1A]">Kullanıcı Dağılımı</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${showFilters ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-600'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center relative">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          </div>
        </div>
      </div>

      {/* FILTERS PANEL (slide down) */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-4 py-4 space-y-4 animate-in slide-in-from-top">
          {/* Kullanıcı Tipi */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Kullanıcı Tipi</h3>
            <div className="flex gap-2">
              {['Tümü', 'Satıcı', 'Alıcı', 'Premium'].map((t, i) => (
                <button key={i} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${i === 0 ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          {/* Durum */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Durum</h3>
            <div className="flex gap-2">
              {['Tümü', 'Aktif', 'Pasif', 'Askıda'].map((t, i) => (
                <button key={i} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${i === 0 ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          {/* Cihaz */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Cihaz</h3>
            <div className="flex gap-2">
              {['Tümü', 'iOS', 'Android', 'Web'].map((t, i) => (
                <button key={i} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${i === 0 ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          {/* Yaş Aralığı */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Yaş Aralığı</h3>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#1A1A1A]">18 - 45</div>
              <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                <div className="absolute inset-y-0 left-[15%] right-[40%] bg-[#10B981] rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Kayıt Tarihi */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Kayıt Tarihi</h3>
            <div className="flex gap-2">
              {['Son 7 Gün', 'Son 30 Gün', 'Son 90 Gün', 'Tümü'].map((t, i) => (
                <button key={i} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${i === 1 ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          {/* Alt Butonlar */}
          <div className="flex gap-2.5 pt-1">
            <button className="flex-1 py-2.5 bg-gray-100 rounded-xl text-[12.5px] font-semibold text-[#1A1A1A]">Temizle</button>
            <button onClick={() => setShowFilters(false)} className="flex-[2] py-2.5 bg-[#10B981] rounded-xl text-[12.5px] font-semibold text-white shadow-md">Filtrele</button>
          </div>
        </div>
      )}

      {/* STATS CARDS - horizontal scroll */}
      <div className="px-4 py-4 flex gap-3 overflow-x-auto no-scrollbar">
        {/* Toplam Kullanıcı */}
        <div className="min-w-[150px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 shrink-0">
          <p className="text-[11px] font-semibold text-gray-400 mb-1">Toplam Kullanıcı</p>
          <p className="text-[28px] font-bold text-[#1A1A1A] leading-none">9.6B</p>
          <p className="text-[10px] font-semibold text-[#10B981] mt-1">↑ %12 bu ay</p>
        </div>
        {/* Aktif Kullanıcı */}
        <div className="min-w-[150px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 shrink-0">
          <p className="text-[11px] font-semibold text-gray-400 mb-1">Aktif Kullanıcı</p>
          <p className="text-[28px] font-bold text-[#1A1A1A] leading-none">85<span className="text-[14px] text-gray-400 ml-0.5">%</span></p>
          <div className="flex gap-[1px] mt-2">
            {[...Array(20)].map((_, i) => <div key={i} className={`h-2 flex-1 rounded-sm ${i < 17 ? 'bg-[#FDBA74]' : 'bg-gray-100'}`}></div>)}
          </div>
        </div>
        {/* Ort. Oturum */}
        <div className="min-w-[150px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 shrink-0 relative overflow-hidden">
          <p className="text-[11px] font-semibold text-gray-400 mb-1">Ort. Oturum</p>
          <p className="text-[28px] font-bold text-[#1A1A1A] leading-none">14<span className="text-[14px] text-gray-400 ml-0.5">dk</span></p>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 opacity-20">
            <svg viewBox="0 0 100 100"><path d="M 15 50 A 35 35 0 1 1 85 50" fill="none" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round"/></svg>
          </div>
        </div>
        {/* Yeni Kayıt */}
        <div className="min-w-[150px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 shrink-0">
          <p className="text-[11px] font-semibold text-gray-400 mb-1">Yeni Kayıt (Haftalık)</p>
          <p className="text-[28px] font-bold text-[#1A1A1A] leading-none">124</p>
          <div className="flex items-end gap-[2px] mt-2 h-4">
            {[40,55,45,70,60,85,100].map((h, i) => <div key={i} className="flex-1 bg-[#10B981] rounded-t-sm" style={{height: `${h}%`}}></div>)}
          </div>
        </div>
      </div>

      {/* TOGGLE: Satıcılar / Alıcılar */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="bg-white rounded-full p-1 flex shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab('sellers')} className={`px-4 py-1.5 text-[12px] font-semibold rounded-full transition-colors ${activeTab === 'sellers' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500'}`}>Satıcılar</button>
          <button onClick={() => setActiveTab('buyers')} className={`px-4 py-1.5 text-[12px] font-semibold rounded-full transition-colors ${activeTab === 'buyers' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500'}`}>Alıcılar</button>
        </div>
        <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          2 dk önce
        </span>
      </div>

      {/* TURKEY MAP */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-3 relative" style={{aspectRatio: '4/3'}}>
          <svg viewBox="0 0 100 70" className="w-full h-full">
            {/* Simplified Turkey outline */}
            <path d="M8,28 Q12,20 22,18 Q28,16 35,20 Q38,18 42,18 Q46,16 50,17 Q55,15 60,18 Q65,16 70,18 Q78,17 85,22 Q90,25 92,30 Q90,34 88,36 Q85,38 82,36 Q78,38 75,40 Q70,42 65,44 Q60,46 55,48 Q50,50 45,48 Q40,50 35,48 Q30,50 25,46 Q20,44 15,40 Q12,38 10,34 Q8,32 8,28 Z" fill="#E8ECEF" stroke="#D1D5DB" strokeWidth="0.5"/>
            {/* City markers */}
            {cities.map((city) => (
              <g key={city.name} onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)} className="cursor-pointer">
                <circle cx={city.x} cy={city.y} r={city.size / 6} fill={selectedCity === city.name ? '#1A1A1A' : '#FDBA74'} opacity={0.9} className="transition-all duration-200"/>
                <text x={city.x} y={city.y + 1} textAnchor="middle" fill={selectedCity === city.name ? 'white' : '#1A1A1A'} className="text-[3px] font-bold select-none" style={{pointerEvents: 'none'}}>{city.count > 999 ? `${(city.count/1000).toFixed(1)}B` : city.count}</text>
                {selectedCity === city.name && (
                  <g>
                    <rect x={city.x - 14} y={city.y - 12} width="28" height="7" rx="1.5" fill="#2A2A2A"/>
                    <text x={city.x} y={city.y - 7} textAnchor="middle" fill="white" className="text-[2.5px] font-semibold" style={{pointerEvents: 'none'}}>{city.name}</text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* CITY BREAKDOWN */}
      <div className="px-4 pb-3">
        <h3 className="text-[13px] font-bold text-[#1A1A1A] mb-3">Şehir Bazlı Dağılım</h3>
        <div className="space-y-2">
          {cities.slice(0, 5).map((city, i) => (
            <div key={i} className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[12px] font-bold text-[#1A1A1A]">{i + 1}</div>
                <div>
                  <p className="text-[12.5px] font-semibold text-[#1A1A1A]">{city.name}</p>
                  <p className="text-[10px] text-gray-400">{city.count.toLocaleString('tr-TR')} kullanıcı</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full" style={{width: `${(city.count / 4820) * 100}%`}}></div>
                </div>
                <span className="text-[11px] font-semibold text-gray-500 w-8 text-right">{((city.count / 9600) * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP USERS */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-[#1A1A1A]">En Aktif Kullanıcılar</h3>
          <button className="text-[11px] font-semibold text-[#10B981]">Tümünü Gör →</button>
        </div>
        <div className="bg-[#222222] rounded-2xl p-3 space-y-0.5">
          {topUsers.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#3A3A3A] transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden">
                    <img src={user.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#222222] ${user.online ? 'bg-[#10B981]' : 'bg-gray-500'}`}></div>
                </div>
                <div>
                  <p className="text-white text-[12px] font-medium">{user.name}</p>
                  <p className="text-[#9CA3AF] text-[10px]">{user.role} · {user.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-[12px] font-semibold group-hover:hidden">{user.score}%</span>
                <button className="w-7 h-7 rounded-full bg-white text-[#222222] items-center justify-center shadow-sm hidden group-hover:flex">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING TOAST */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-[#2A2A2A] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
          <div className="w-8 h-8 rounded-lg bg-[#3F3F46] flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-full bg-[#FDBA74] flex items-center justify-center text-[#2A2A2A] font-black text-[9px]">!</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-bold">Yeni veri mevcut</p>
            <p className="text-[#9CA3AF] text-[10px]">Kullanıcı dağılımı güncellendi</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
