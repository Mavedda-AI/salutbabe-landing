'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {
    Alert01Icon,
    BarChartIcon,
    FlashIcon,
    Mail01Icon,
    RecordIcon,
    StarIcon,
    Tick01Icon,
    Timer02Icon
} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, SearchInput} from '@/app/dashboard/components/ui/FilterBar';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';

export default function ComplaintManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'open' | 'resolved' | 'stats'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Tümü');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [openTickets, setOpenTickets] = useState<any[]>([]);
  const [resolvedTickets, setResolvedTickets] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  
  const [kpis, setKpis] = useState<KPIItem[]>([]);
  const [statsKpis, setStatsKpis] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    setLoading(true);
    setTimeout(() => {
      setOpenTickets([]);
      setResolvedTickets([]);
      setCategoryStats([]);
      setAiSuggestions([]);
      
      setKpis([
        { label: 'Açık Destek', value: '0', colorClass: 'text-[#FF383C]', icon: <HugeiconsIcon icon={RecordIcon} size={24} /> },
        { label: 'Çözülme Oranı', value: '%0', colorClass: 'text-green-600', icon: <HugeiconsIcon icon={Tick01Icon} size={24} /> },
        { label: 'Ort. Çözüm Süresi', value: '0 saat', colorClass: 'text-[#007AFF]', icon: <HugeiconsIcon icon={Timer02Icon} size={24} /> },
        { label: 'CSAT Skoru', value: '0/5', colorClass: 'text-purple-600', icon: <HugeiconsIcon icon={StarIcon} size={24} /> },
      ]);
      
      setStatsKpis([
        { label: 'Bugün Açılan', value: '0', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={Mail01Icon} size={24} /> },
        { label: 'Bugün Çözülen', value: '0', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={Tick01Icon} size={24} /> },
        { label: 'Eskalasyon', value: '0', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={Alert01Icon} size={24} /> },
        { label: 'İlk Yanıt Süresi', value: '0 dk', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={FlashIcon} size={24} /> },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const openColumns: Column<any>[] = [
    {
      header: 'KULLANICI & KONU',
      accessor: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-gray-900">{row.user}</span>
            <StatusBadge 
              status={row.priority} 
              type={row.priority === 'Acil' ? 'danger' : row.priority === 'Yüksek' ? 'warning' : 'neutral'} 
            />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{row.category}</span>
          </div>
          <p className="text-[12px] font-medium text-gray-700">{row.subject}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-gray-400 font-medium">{row.id}</span>
            <span className="text-[11px] text-gray-400 font-medium">{row.time}</span>
          </div>
        </div>
      )
    },
    {
      header: 'DURUM',
      accessor: (row) => (
        <StatusBadge 
          status={row.status} 
          type={row.status === 'Eskalasyon' ? 'danger' : row.status === 'İnceleniyor' ? 'info' : 'warning'} 
        />
      )
    },
    {
      header: 'İŞLEM',
      accessor: (row) => (
        <button 
          onClick={() => { setSelectedTicket(row); setIsModalOpen(true); }} 
          className="text-[11px] font-black px-4 py-2 bg-[#111827] text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          YANITLA
        </button>
      )
    }
  ];

  const resolvedColumns: Column<any>[] = [
    {
      header: 'KULLANICI & KONU',
      accessor: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-gray-900">{row.user}</span>
            <span className="text-[11px] text-gray-400 font-medium">{row.id}</span>
          </div>
          <p className="text-[12px] font-medium text-gray-700">{row.subject}</p>
        </div>
      )
    },
    {
      header: 'ÇÖZÜM',
      accessor: (row) => (
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-bold text-green-600 flex items-center gap-1.5">
            <HugeiconsIcon icon={Tick01Icon} size={16} /> {row.resolution}
          </span>
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
            <HugeiconsIcon icon={Timer02Icon} size={14} /> {row.time}
          </span>
        </div>
      )
    },
    {
      header: 'MEMNUNİYET',
      accessor: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5">
            {Array.from({length: 5}).map((_, i) => (
              <HugeiconsIcon 
                key={'star-'+i} 
                icon={StarIcon} 
                size={16} 
                className={i < row.satisfaction ? 'text-yellow-400' : 'text-gray-200'} 
              />
            ))}
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-1">{row.satisfaction}/5 Skor</p>
        </div>
      )
    }
  ];

  const filteredOpenTickets = openTickets.filter(t => 
    (priorityFilter === 'Tümü' || t.priority === priorityFilter) && 
    (t.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredResolvedTickets = resolvedTickets.filter(t => 
    t.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <PageHeader 
        title="Destek & Şikayet Merkezi" 
        description="Canlı Veriler · Tüm Talepler" 
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        
        {kpis.length > 0 && <KPIGrid items={kpis} />}

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <FilterTabs 
            activeTab={activeTab} 
            onChange={(id) => setActiveTab(id as 'open' | 'resolved' | 'stats')} 
            tabs={[
              {id:'open', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={RecordIcon} size={16} /> Açık Talepler</div>},
              {id:'resolved', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={Tick01Icon} size={16} /> Çözülenler</div>},
              {id:'stats', label: <div className="flex items-center gap-2"><HugeiconsIcon icon={BarChartIcon} size={16} /> İstatistik</div>}
            ]} 
          />
          {activeTab !== 'stats' && (
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Kullanıcı adı, konu veya kod ile ara..." 
            />
          )}
        </div>

        {activeTab === 'open' && (
           <div className="space-y-4">
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['Tümü', 'Acil', 'Yüksek', 'Normal'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setPriorityFilter(f)} 
                    className={`px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap border ${priorityFilter === f ? 'bg-[#111827] text-white border-[#111827] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    {f}
                  </button>
                ))}
             </div>
             
             <DataTable 
               columns={openColumns} 
               data={filteredOpenTickets} 
               keyExtractor={(r) => r.id} 
               loading={loading} 
             />
           </div>
        )}

        {activeTab === 'resolved' && (
          <div className="space-y-4">
             <DataTable 
               columns={resolvedColumns} 
               data={filteredResolvedTickets} 
               keyExtractor={(r) => r.id} 
               loading={loading} 
             />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
              <h2 className="text-[15px] font-black text-[#111827] mb-1">Kategori Dağılımı</h2>
              <p className="text-[12px] font-medium text-gray-400 mb-6">Açık talep türleri</p>
              <div className="space-y-4">
                {categoryStats.length > 0 ? categoryStats.map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-[12px] font-bold text-gray-500 w-32 shrink-0">{c.category}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="text-[13px] font-black text-gray-700 w-10 text-right">{c.count}</span>
                    <span className="text-[11px] font-bold text-gray-400 w-10 text-right">{c.pct}%</span>
                  </div>
                )) : (
                  <div className="text-center py-8 text-[13px] font-bold text-gray-400">Veri bulunamadı</div>
                )}
              </div>
            </div>

            {statsKpis.length > 0 && <KPIGrid items={statsKpis} />}
          </div>
        )}

        {/* AI Actions */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-[24px] border border-red-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h2 className="text-[16px] font-black text-red-700">AI Aksiyon Önerileri</h2>
          </div>
          <div className="space-y-3">
             {aiSuggestions.length > 0 ? aiSuggestions.map((a, i) => (
               <div key={i} className="bg-white/80 backdrop-blur rounded-[16px] p-5 border border-red-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <p className="text-[14px] font-bold text-[#111827]">{a.title}</p>
                   <p className="text-[12px] text-gray-500 mt-1.5">{a.desc}</p>
                 </div>
                 <StatusBadge status={a.impact} type={a.impact === 'Acil' ? 'danger' : 'success'} />
               </div>
             )) : (
               <div className="text-center py-6 text-[13px] font-bold text-gray-400">Yeni AI önerisi bulunmuyor.</div>
             )}
          </div>
        </div>
      </div>
      
      <ActionModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedTicket(null); }} 
        title="Talebi Yanıtla"
        description={selectedTicket ? `Talep No: ${selectedTicket.id}` : undefined}
      >
        <div className="space-y-4">
          <textarea 
            className="w-full h-32 p-4 rounded-xl border border-gray-200 text-[13px] font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#111827]"
            placeholder="Yanıtınızı buraya yazın..."
          ></textarea>
          <button 
            className="w-full py-3 bg-[#111827] text-white rounded-xl text-[13px] font-black hover:bg-gray-800 transition-colors"
            onClick={() => { setIsModalOpen(false); setSelectedTicket(null); }}
          >
            YANIT GÖNDER
          </button>
        </div>
      </ActionModal>
    </div>
  );
}
