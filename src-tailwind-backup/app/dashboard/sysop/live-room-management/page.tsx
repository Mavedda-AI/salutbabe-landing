'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {HugeiconsIcon} from '@hugeicons/react';
import {
    BarChartIcon,
    Calendar01Icon,
    MoneyBag01Icon,
    RecordIcon,
    Timer02Icon,
    UserMultipleIcon
} from '@hugeicons/core-free-icons';

import {PageHeader} from '../../components/ui/PageHeader';
import {KPIGrid, KPIItem} from '../../components/ui/KPIGrid';
import {FilterTabs, SearchInput} from '../../components/ui/FilterBar';
import {Column, DataTable} from '../../components/ui/DataTable';
import {StatusBadge} from '../../components/ui/StatusBadge';

export default function LiveRoomManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  
  const [liveRooms, setLiveRooms] = useState<any[]>([]);
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [kpis, setKpis] = useState<KPIItem[]>([]);
  const [statsKpis, setStatsKpis] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || token === 'mock_token') {
      setLiveRooms([]);
      setScheduled([]);
      setKpis([]);
      setStatsKpis([]);
      setLoading(false);
      return;
    }
    
    // API Call goes here
    setLiveRooms([]);
    setScheduled([]);
    setKpis([]);
    setStatsKpis([]);
    setLoading(false);
  }, []);

  const liveColumns: Column<any>[] = [
    {
      header: 'Satıcı / Oda',
      accessor: (item) => (
        <div>
          <div className="flex items-center gap-2">
            <StatusBadge status="CANLI" type="danger" />
            <span className="text-[14px] font-bold text-[#111827]">{item.host}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{item.category}</span>
          </div>
          <p className="text-[12px] font-medium text-gray-600 mt-1">{item.title}</p>
        </div>
      )
    },
    {
      header: 'Dinleyici',
      accessor: (item) => <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-700"><HugeiconsIcon icon={UserMultipleIcon} size={16} /> {item.listeners}</div>
    },
    {
      header: 'Süre',
      accessor: (item) => <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-700"><HugeiconsIcon icon={Timer02Icon} size={16} /> {item.duration}</div>
    },
    {
      header: 'Satış',
      accessor: (item) => <div className="flex items-center gap-1.5 text-[13px] font-black text-green-600"><HugeiconsIcon icon={MoneyBag01Icon} size={16} /> {item.sales}</div>
    },
    {
      header: 'İşlem',
      accessor: () => <button className="text-[11px] font-black px-4 py-2 bg-[#111827] text-white rounded-xl hover:bg-gray-800 transition-colors">İZLE</button>
    }
  ];

  const scheduledColumns: Column<any>[] = [
    {
      header: 'Satıcı',
      accessor: (item) => <span className="text-[14px] font-bold text-[#111827]">{item.host}</span>
    },
    {
      header: 'Başlık',
      accessor: (item) => <span className="text-[13px] text-gray-600">{item.title}</span>
    },
    {
      header: 'Zaman',
      accessor: (item) => <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#007AFF]"><HugeiconsIcon icon={Calendar01Icon} size={16} /> {item.time}</div>
    },
    {
      header: 'Beklenen',
      accessor: (item) => <span className="text-[13px] font-bold text-gray-500">{item.expected}</span>
    },
    {
      header: 'İşlem',
      accessor: () => <button className="text-[11px] font-black px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">HATIRLATICI</button>
    }
  ];

  const filteredLiveRooms = liveRooms.filter(r => 
    (categoryFilter === 'Tümü' || r.category === categoryFilter) && 
    (r.host.toLowerCase().includes(searchQuery.toLowerCase()) || r.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <PageHeader 
        title="Sesli Oda Yönetimi"
        description="Canlı Yayınlar & İstatistikler"
        actions={
          <div className="flex items-center gap-1.5 bg-[#FFF0F0] text-[#FF4444] px-4 py-2 rounded-full text-[12px] font-bold">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4444] animate-pulse" /> {liveRooms.length} CANLI
          </div>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5 pb-20">
        {kpis.length > 0 && <KPIGrid items={kpis} />}

        <FilterTabs 
          tabs={[
            { id: 'live', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={RecordIcon} size={18} /> Canlı Odalar</div> },
            { id: 'scheduled', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={Calendar01Icon} size={18} /> Planlanan</div> },
            { id: 'stats', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={BarChartIcon} size={18} /> İstatistik</div> }
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id)}
        />

        {activeTab === 'live' && (
          <div className="space-y-4">
            <div className="bg-white rounded-[20px] border border-gray-100 p-4 space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <SearchInput 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                  placeholder="Satıcı adı veya oda başlığı ile ara..." 
                />
              </div>
              <div className="w-full overflow-x-auto no-scrollbar pb-1">
                <div className="flex items-center gap-1.5 min-w-max">
                  {['Tümü', 'Kadın Giyim', 'Erkek Giyim', 'Aksesuar', 'Çocuk'].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setCategoryFilter(f)} 
                      className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all whitespace-nowrap ${categoryFilter === f ? 'bg-[#111827] text-white shadow-md' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-900'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <DataTable 
              columns={liveColumns}
              data={filteredLiveRooms}
              keyExtractor={(r: any) => r.id || r.host || Math.random().toString()}
              loading={loading}
              emptyMessage="Aktif yayın bulunamadı."
            />
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-3">
            <DataTable 
              columns={scheduledColumns}
              data={scheduled}
              keyExtractor={(r: any) => r.id || r.host || Math.random().toString()}
              loading={loading}
              emptyMessage="Planlanan yayın bulunamadı."
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            {statsKpis.length > 0 ? (
              <KPIGrid items={statsKpis} />
            ) : (
              <div className="p-12 text-center text-[13px] font-bold text-gray-400 bg-white rounded-[20px] border border-gray-100">
                İstatistik bulunamadı.
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[20px] border border-purple-100 p-5 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h2 className="text-[13px] font-black text-purple-700">AI Aksiyonlar</h2>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-[12px] text-gray-500">Yükleniyor...</p>
            ) : (
              <p className="text-[12px] text-gray-500">Şu anda önerilen AI aksiyonu bulunmuyor.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
