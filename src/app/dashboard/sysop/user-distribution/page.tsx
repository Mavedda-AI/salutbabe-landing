'use client';
import React, {useEffect, useState} from 'react';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, SearchInput} from '@/app/dashboard/components/ui/FilterBar';
import {DataTable} from '@/app/dashboard/components/ui/DataTable';
import {StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';
import {
    ShoppingBag01Icon as ShoppingBagIcon,
    ShoppingCart01Icon as ShoppingCartIcon,
    Time01Icon as ClockIcon,
    UserMultipleIcon as UserGroupIcon
} from 'hugeicons-react';

export default function UserDistributionPage() {
  const [activeTab, setActiveTab] = useState('sellers');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expandedCityListIdx, setExpandedCityListIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [cities, setCities] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || token === 'mock_token') {
      setCities([]);
      setTopUsers([]);
      setLoading(false);
      return;
    }
    
    // Simulate empty data when token is missing/mocked
    setCities([]);
    setTopUsers([]);
    setLoading(false);
  }, []);

  const kpiItems = [
    { label: 'TOPLAM KULLANICI', value: '0', icon: <UserGroupIcon size={24} />, colorClass: 'text-blue-500' },
    { label: 'AKTİF SATICILAR', value: '0', icon: <ShoppingBagIcon size={24} />, colorClass: 'text-green-500' },
    { label: 'AKTİF ALICILAR', value: '0', icon: <ShoppingCartIcon size={24} />, colorClass: 'text-purple-500' },
    { label: 'ORT. OTURUM SÜRESİ', value: '0dk', icon: <ClockIcon size={24} />, colorClass: 'text-orange-500' },
  ];

  const mapTabs = [
    { id: 'sellers', label: 'Satıcılar' },
    { id: 'buyers', label: 'Alıcılar' }
  ];

  const topUsersColumns = [
    {
      header: 'Kullanıcı',
      accessor: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden shadow-sm">
              {u.img && <img src={u.img} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${u.online ? 'bg-[#16A34A]' : 'bg-gray-300'}`}></div>
          </div>
          <div>
            <p className="text-[12px] font-black text-[#111827]">{u.name}</p>
            <p className="text-[10px] font-bold text-gray-500">{u.city}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Rol',
      accessor: (u: any) => <StatusBadge status={u.role} type="neutral" />
    },
    {
      header: 'Satış',
      accessor: (u: any) => <span className="text-[12px] font-bold text-gray-500">{u.sales} Satış</span>
    },
    {
      header: 'Skor',
      accessor: (u: any) => <span className="text-[13px] font-black text-[#16A34A]">{u.score}%</span>
    }
  ];

  const cardClass = `rounded-[16px] border bg-white border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]`;
  const textTitle = `text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-gray-500`;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in pb-12 font-sans px-4 sm:px-6">
      
      <PageHeader 
        title="Kullanıcı Dağılımı" 
        description="Türkiye Geneli Canlı Analiz ve Kohort Takibi"
        actions={
          <div className="w-full md:w-64">
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Şehir veya kullanıcı ara..." 
            />
          </div>
        }
      />

      <KPIGrid items={kpiItems} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* MAP SECTION (col-span-2) */}
        <div className={`${cardClass} p-4 md:p-6 lg:col-span-2 flex flex-col`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className={textTitle}>
              <svg className="w-4 h-4 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              TÜRKİYE AKTİVİTE HARİTASI
            </h3>
            
            <div className="flex items-center gap-3">
              <FilterTabs tabs={mapTabs} activeTab={activeTab} onChange={setActiveTab} />
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
              {cities.map((city: any) => (
                <div key={city.name} onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)} className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2" style={{left: city.x, top: city.y, zIndex: selectedCity === city.name ? 20 : 10}}>
                  <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${selectedCity === city.name ? 'bg-white scale-125 z-20 shadow-xl' : 'bg-[#16A34A] hover:scale-110 hover:bg-[#22c55e] shadow-md'}`} style={{width: city.size, height: city.size}}>
                    <span className={`text-[9px] font-bold ${selectedCity === city.name ? 'text-[#111827]' : 'text-white'}`}>
                      {city.count > 999 ? `${(city.count/1000).toFixed(1)}B` : city.count}
                    </span>
                    {city.count > 2000 && selectedCity !== city.name && (
                      <div className="absolute inset-0 rounded-full bg-[#16A34A] animate-ping opacity-30"></div>
                    )}
                  </div>
                  
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
          <div className={`${cardClass} p-4 md:p-6 flex-1`}>
            <h3 className={`${textTitle} mb-5`}>ŞEHİR DAĞILIMI & TAKİP</h3>
            <div className="space-y-3">
              {cities.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">Veri bulunamadı.</div>
              ) : (
                cities.slice(0, 4).map((city: any, i: number) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TOP PROFILES - MOVED OUTSIDE SIDEBAR FOR BETTER DATATABLE WIDTH */}
      <div className={`${cardClass} p-4 md:p-6 mt-6`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={textTitle}>AKTİF PROFİLLER</h3>
          <button className="text-[10px] font-black text-[#111827] hover:underline">TÜMÜ →</button>
        </div>
        <DataTable
          data={topUsers}
          columns={topUsersColumns}
          keyExtractor={(item) => item.name}
          loading={loading}
          emptyMessage="Aktif profil bulunamadı."
        />
      </div>

    </div>
  );
}
