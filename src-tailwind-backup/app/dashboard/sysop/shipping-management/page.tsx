'use client';

import {HugeiconsIcon} from '@hugeicons/react';
import {Alert02Icon, BarChartIcon, Package01Icon, Tick01Icon, Timer02Icon, TruckIcon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {apiUrl} from '../../../../lib/api';

import {PageHeader} from '../../components/ui/PageHeader';
import {KPIGrid, KPIItem} from '../../components/ui/KPIGrid';
import {FilterTabs, SearchInput} from '../../components/ui/FilterBar';
import {Column, DataTable} from '../../components/ui/DataTable';
import {ActionModal, StatusBadge} from '../../components/ui/StatusBadge';

export default function ShippingManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'delayed' | 'providers'>('overview');
  const [delayFilter, setDelayFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelayed, setSelectedDelayed] = useState<(string | number)[]>([]);
  
  const [providerComplaint, setProviderComplaint] = useState<string | null>(null);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [trendFilter, setTrendFilter] = useState('Günlük');
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [providerShipmentFilter, setProviderShipmentFilter] = useState('Tümü');
  const [providerDateFilter, setProviderDateFilter] = useState('Son 1 Ay');
  const [selectedProviderShipments, setSelectedProviderShipments] = useState<(string | number)[]>([]);

  const [kpis, setKpis] = useState<KPIItem[]>([
    { label: 'Toplam Kargo', value: '0', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={Package01Icon} size={32} /> },
    { label: 'Zamanında Teslim', value: '%0', colorClass: 'text-green-600', icon: <HugeiconsIcon icon={Tick01Icon} size={32} /> },
    { label: 'Geciken Kargo', value: '0', colorClass: 'text-[#FF8D28]', icon: <HugeiconsIcon icon={Alert02Icon} size={32} /> },
    { label: 'Ort. Teslim Süresi', value: '0 gün', colorClass: 'text-[#007AFF]', icon: <HugeiconsIcon icon={Timer02Icon} size={32} /> },
  ]);
  const [dailyTrend, setDailyTrend] = useState<any[]>([]);
  const [cityPerformance, setCityPerformance] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [providerShipmentDetails, setProviderShipmentDetails] = useState<any>({});
  const [delayedShipments, setDelayedShipments] = useState<any[]>([]);
  const [aiActions, setAiActions] = useState<any[]>([]);
  
  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token && token !== 'mock_token') {
      fetch(apiUrl('/admin/shipping'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProviders(data.data.map((c: any) => ({
            id: c.companyID,
            name: c.name,
            trend: '→',
            shipments: 0,
            onTime: 0,
            avgDays: 0,
            cost: '₺0.00'
          })));
        } else {
          setProviders([]);
        }
        setDailyTrend([]);
        setCityPerformance([]);
        setProviderShipmentDetails({});
        setDelayedShipments([]);
        setAiActions([]);
      })
      .catch(console.error);
    } else {
      setKpis([
        { label: 'Toplam Kargo', value: '0', colorClass: 'text-[#111827]', icon: <HugeiconsIcon icon={Package01Icon} size={32} /> },
        { label: 'Zamanında Teslim', value: '%0', colorClass: 'text-green-600', icon: <HugeiconsIcon icon={Tick01Icon} size={32} /> },
        { label: 'Geciken Kargo', value: '0', colorClass: 'text-[#FF8D28]', icon: <HugeiconsIcon icon={Alert02Icon} size={32} /> },
        { label: 'Ort. Teslim Süresi', value: '0 gün', colorClass: 'text-[#007AFF]', icon: <HugeiconsIcon icon={Timer02Icon} size={32} /> },
      ]);
      setDailyTrend([]);
      setCityPerformance([]);
      setProviders([]);
      setProviderShipmentDetails({});
      setDelayedShipments([]);
      setAiActions([]);
    }
  }, []);

  const maxTotal = dailyTrend.length > 0 ? Math.max(...dailyTrend.map(d => d.total)) : 1;

  const filteredDelayed = delayedShipments.filter(s => {
    if (searchQuery && !s.buyer.toLowerCase().includes(searchQuery.toLowerCase()) && !s.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (delayFilter === 'Tümü') return true;
    if (delayFilter === '1-2') return s.days <= 2;
    if (delayFilter === '3-4') return s.days >= 3 && s.days <= 4;
    if (delayFilter === '5+') return s.days >= 5;
    return true;
  });

  const cityColumns: Column<any>[] = [
    { header: 'Şehir', accessor: item => item.city, className: 'text-[12px] font-bold text-[#111827]' },
    { header: 'Kargo', accessor: item => item.shipments.toLocaleString(), className: 'text-[12px] font-black text-[#111827]' },
    { header: 'Zamanında', accessor: item => (
        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${parseFloat(item.onTime.replace('%','')) > 90 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
          {item.onTime}
        </span>
    ) },
    { header: 'Ort. Süre', accessor: item => item.avgDays, className: 'text-[12px] font-bold text-gray-600' }
  ];

  const delayedColumns: Column<any>[] = [
    {
      header: 'Detay',
      accessor: item => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#111827]">{item.buyer}</span>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.days >= 4 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{item.days} gün gecikme</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{item.id} · {item.provider} · {item.city}</p>
        </div>
      )
    },
    {
      header: 'Tutar',
      accessor: item => <p className="text-[12px] font-black text-[#111827]">{item.amount}</p>,
      className: "text-right"
    },
    {
      header: 'İşlem',
      accessor: item => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setNudgeMessage(`${item.id} için dürtme gönderildi!`);
            setTimeout(() => setNudgeMessage(null), 3000);
          }}
          className="text-[9px] font-black px-3 py-2 bg-[#FF8D28] text-white rounded-lg shrink-0 hover:bg-orange-600 transition-colors"
        >
          DÜRT
        </button>
      ),
      className: "text-right w-20"
    }
  ];

  const mainTabs = [
    { id: 'overview', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={BarChartIcon} size={16} /> Genel Bakış</div> },
    { id: 'delayed', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Alert02Icon} size={16} /> Gecikenler</div> },
    { id: 'providers', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={TruckIcon} size={16} /> Firmalar</div> }
  ];

  const providerShipmentColumns: Column<any>[] = [
    {
      header: 'Detay',
      accessor: (item: any) => (
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-bold text-[#111827]">{item.buyer}</span>
            <StatusBadge status={item.status === 'teslim' ? 'Teslim Edildi' : item.status === 'yolda' ? 'Yolda' : item.status === 'gecikme' ? 'Gecikme' : item.status === 'hasar' ? 'Hasarlı' : item.status} type={
              item.status === 'teslim' ? 'success' :
              item.status === 'yolda' ? 'info' :
              item.status === 'gecikme' ? 'danger' :
              item.status === 'hasar' ? 'warning' : 'neutral'
            } />
            {item.status === 'gecikme' && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">{item.days} gün</span>}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{item.id} · {item.city} · {item.date}</p>
        </div>
      )
    },
    {
      header: 'Tutar / Süre',
      accessor: (item: any) => (
        <div className="text-right">
          <p className="text-[12px] font-black text-[#111827]">{item.amount}</p>
          <p className="text-[9px] text-gray-400 mt-0.5">{item.days} gün</p>
        </div>
      ),
      className: "text-right"
    }
  ];

  const delayFilterTabs = [
    { id: 'Tümü', label: 'Tümü' },
    { id: '1-2', label: '1-2 Gün' },
    { id: '3-4', label: '3-4 Gün' },
    { id: '5+', label: '5+ Gün' }
  ];

  const trendFilterTabs = [
    { id: 'Günlük', label: 'Günlük' },
    { id: 'Haftalık', label: 'Haftalık' },
    { id: 'Aylık', label: 'Aylık' },
    { id: 'Yıllık', label: 'Yıllık' }
  ];

  const providerDateTabs = [
    { id: 'Bugün', label: 'Bugün' },
    { id: 'Son 3 Gün', label: 'Son 3 Gün' },
    { id: 'Son 1 Hafta', label: 'Son 1 Hafta' },
    { id: 'Son 1 Ay', label: 'Son 1 Ay' },
    { id: 'Son 3 Ay', label: 'Son 3 Ay' }
  ];

  const providerShipmentTabs = [
    { id: 'Tümü', label: 'Tümü' },
    { id: 'teslim', label: 'Teslim' },
    { id: 'yolda', label: 'Yolda' },
    { id: 'gecikme', label: 'Gecikme' },
    { id: 'hasar', label: 'Hasarlı' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <PageHeader 
        title="Kargo Performansı"
        description="Son 30 Gün · Tüm Firmalar"
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">

        {/* KPIs */}
        <KPIGrid items={kpis} />

        {/* Tabs */}
        <div>
          <FilterTabs tabs={mainTabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Daily Trend */}
            <div className={`${cardClass} p-6`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-[15px] font-black text-[#111827] mb-1">Kargo Trendi</h2>
                  <p className="text-[11px] font-medium text-gray-400">Toplam vs geciken kargolar ({trendFilter === 'Günlük' ? 'Son 7 gün' : trendFilter === 'Haftalık' ? 'Son 4 hafta' : trendFilter === 'Aylık' ? 'Son 6 ay' : 'Son 3 yıl'})</p>
                </div>
                <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 -mb-1">
                  <FilterTabs tabs={trendFilterTabs} activeTab={trendFilter} onChange={setTrendFilter} />
                </div>
              </div>
              
              <div className="relative h-48 mb-2">
                {/* Average Line */}
                <div className="absolute top-[30%] left-0 w-full border-t border-dashed border-gray-200 z-0 flex items-center">
                  <span className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ort. Hacim</span>
                </div>
                
                <div className="absolute inset-0 flex items-end justify-between gap-3 z-10">
                  {dailyTrend.map((d, i) => {
                    const isActive = hoveredDay === i;
                    const inactivePattern = { backgroundImage: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 4px, #f3f4f6 4px, #f3f4f6 8px)' };
                    
                    return (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center gap-3 relative group cursor-pointer h-full justify-end"
                        onMouseEnter={() => setHoveredDay(i)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {/* Tooltip */}
                        {isActive && (
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-[#1E1E1E] text-white rounded-[20px] p-4 shadow-2xl z-30 pointer-events-none transform transition-all duration-200 animate-fade-in-up">
                            <div className="bg-white text-[#1E1E1E] text-[10px] font-black px-3 py-1 rounded-full inline-block mb-3">
                              {d.day} Günü
                            </div>
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                  <span className="text-[11px] text-gray-400 font-bold">Toplam</span>
                                </div>
                                <span className="text-[12px] font-black">{d.total}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#C6F432]" />
                                  <span className="text-[11px] text-gray-400 font-bold">Geciken</span>
                                </div>
                                <span className="text-[12px] font-black">{d.delayed}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bar Container */}
                        <div className="w-full relative flex flex-col items-center justify-end h-full">
                          {isActive && (
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-4 border-blue-500 rounded-full z-20 shadow-sm" />
                          )}
                          <div className="w-full flex flex-col items-center justify-end">
                            <div 
                              className={`w-full rounded-t-xl transition-all duration-300 ${isActive ? 'bg-blue-500' : ''}`} 
                              style={isActive ? { height: `${(d.total / maxTotal) * 120}px` } : { height: `${(d.total / maxTotal) * 120}px`, ...inactivePattern }} 
                            />
                            <div 
                              className={`w-full rounded-b-xl transition-all duration-300 ${isActive ? 'bg-[#C6F432]' : 'bg-gray-100'}`} 
                              style={{ height: `${(d.delayed / maxTotal) * 120}px` }} 
                            />
                          </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[#111827]' : 'text-gray-400'}`}>{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-5 mt-6 justify-center">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-[10px] font-bold text-gray-500">Toplam</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#C6F432]" /><span className="text-[10px] font-bold text-gray-500">Geciken</span></div>
              </div>
            </div>

            {/* City Performance */}
            <div className="space-y-4">
              <h2 className="text-[13px] font-black text-[#111827] px-2">Şehir Bazlı Performans</h2>
              <DataTable 
                data={cityPerformance} 
                columns={cityColumns} 
                keyExtractor={item => item.city} 
                emptyMessage="Veri bulunamadı." 
              />
            </div>
          </>
        )}

        {activeTab === 'delayed' && (
          <div className="space-y-4">
            <div className={`${cardClass} p-5`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF8D28] animate-ping" />
                  <h2 className="text-[13px] font-black text-[#FF8D28]">Geciken Kargolar ({filteredDelayed.length})</h2>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Alıcı veya Kargo no ara..." />
                  <FilterTabs tabs={delayFilterTabs} activeTab={delayFilter} onChange={(id) => { setDelayFilter(id); setSelectedDelayed([]); }} />
                  {selectedDelayed.length > 0 && (
                    <button 
                      onClick={() => {
                        setNudgeMessage(`${selectedDelayed.length} sipariş için toplu dürtme gönderildi!`);
                        setTimeout(() => { setNudgeMessage(null); setSelectedDelayed([]); }, 3000);
                      }}
                      className="text-[10px] font-black px-4 py-2.5 bg-[#FF8D28] text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap"
                    >
                      TOPLU DÜRT ({selectedDelayed.length})
                    </button>
                  )}
                </div>
              </div>
              
              <DataTable
                data={filteredDelayed}
                columns={delayedColumns}
                keyExtractor={s => s.id}
                emptyMessage="Bu kritere uygun geciken kargo bulunamadı."
                selectedIds={selectedDelayed}
                onToggleSelect={(id) => {
                  if (selectedDelayed.includes(id)) {
                    setSelectedDelayed(selectedDelayed.filter(x => x !== id));
                  } else {
                    setSelectedDelayed([...selectedDelayed, id]);
                  }
                }}
                onToggleAll={() => {
                  if (selectedDelayed.length === filteredDelayed.length && filteredDelayed.length > 0) {
                    setSelectedDelayed([]);
                  } else {
                    setSelectedDelayed(filteredDelayed.map(s => s.id));
                  }
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="space-y-4">
            {/* Date Filter */}
            <div className="w-full">
              <FilterTabs tabs={providerDateTabs} activeTab={providerDateFilter} onChange={setProviderDateFilter} />
            </div>

            {providers.map((p, i) => {
              const isExpanded = expandedProvider === p.name;
              const providerKey = p.name.replace('ı', 'i'); 
              const allShipments = providerShipmentDetails[providerKey] || [];
              const filteredShipments = allShipments.filter((s: any) => {
                if (providerShipmentFilter === 'Tümü') return true;
                return s.status === providerShipmentFilter;
              });

              return (
                <div key={i} className={`${cardClass} overflow-hidden transition-all duration-300`}>
                  {/* Provider Header - Clickable Accordion */}
                  <button
                    onClick={() => {
                      setExpandedProvider(isExpanded ? null : p.name);
                      setProviderShipmentFilter('Tümü');
                      setSelectedProviderShipments([]);
                    }}
                    className="w-full p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-black text-[#111827]">{p.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-[14px] font-black ${p.trend === '↗' ? 'text-green-500' : p.trend === '↘' ? 'text-red-500' : 'text-gray-400'}`}>{p.trend}</span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">Kargo</p><p className="text-[16px] font-black text-[#111827]">{p.shipments.toLocaleString()}</p></div>
                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">Zamanında</p><p className={`text-[16px] font-black ${p.onTime > 90 ? 'text-green-600' : 'text-orange-500'}`}>%{p.onTime}</p></div>
                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">Ort. Süre</p><p className="text-[16px] font-black text-[#007AFF]">{p.avgDays} gün</p></div>
                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">Birim Maliyet</p><p className="text-[16px] font-black text-[#111827]">{p.cost}</p></div>
                    </div>
                    <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.onTime > 92 ? 'bg-green-500' : p.onTime > 88 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${p.onTime}%` }} />
                    </div>
                  </button>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-[#FAFBFC]">
                      {/* Filter & Actions Bar */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <FilterTabs tabs={providerShipmentTabs} activeTab={providerShipmentFilter} onChange={(id) => { setProviderShipmentFilter(id); setSelectedProviderShipments([]); }} />
                          <div className="flex items-center gap-2">
                            {selectedProviderShipments.length > 0 && (
                              <button
                                onClick={() => {
                                  setProviderComplaint(p.name);
                                }}
                                className="text-[11px] font-black px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                              >
                                Seçilenleri Şikayet Et ({selectedProviderShipments.length})
                              </button>
                            )}
                            <button
                              onClick={() => setProviderComplaint(p.name)}
                              className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors px-3 py-2 rounded-xl border border-red-200 hover:border-red-300 bg-white"
                            >
                              <HugeiconsIcon icon={Alert02Icon} size={14} /> Firma Şikayeti
                            </button>
                          </div>
                        </div>
                      </div>

                      <DataTable
                        data={filteredShipments}
                        columns={providerShipmentColumns}
                        keyExtractor={(s: any) => s.id}
                        emptyMessage="Bu filtreye uygun kargo bulunamadı."
                        selectedIds={selectedProviderShipments}
                        onToggleSelect={(id) => {
                          if (selectedProviderShipments.includes(id)) setSelectedProviderShipments(selectedProviderShipments.filter(x => x !== id));
                          else setSelectedProviderShipments([...selectedProviderShipments, id]);
                        }}
                        onToggleAll={() => {
                          if (selectedProviderShipments.length === filteredShipments.length && filteredShipments.length > 0) setSelectedProviderShipments([]);
                          else setSelectedProviderShipments(filteredShipments.map((s: any) => s.id));
                        }}
                      />

                      {/* Provider Summary Footer */}
                      <div className="p-4 bg-white border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4">
                        <div className="flex items-center gap-4 text-[10px]">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Teslim: {allShipments.filter((s:any) => s.status === 'teslim').length}</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Yolda: {allShipments.filter((s:any) => s.status === 'yolda').length}</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Gecikme: {allShipments.filter((s:any) => s.status === 'gecikme').length}</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Hasar: {allShipments.filter((s:any) => s.status === 'hasar').length}</span>
                        </div>
                        <button
                          onClick={() => router.push(`/dashboard/sysop/shipping-management/${encodeURIComponent(p.name)}`)}
                          className="text-[11px] font-bold text-[#007AFF] hover:underline"
                        >
                          Tüm {p.shipments.toLocaleString()} kargoyu görüntüle →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* AI */}
        {aiActions.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[20px] border border-orange-100 p-5 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              <h2 className="text-[13px] font-black text-orange-700">AI Aksiyonlar</h2>
            </div>
            <div className="space-y-3">
              {aiActions.map((a, i) => (
                <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-orange-100/50">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-[12px] font-bold text-[#111827]">{a.title}</p><p className="text-[10px] text-gray-500 mt-1">{a.desc}</p></div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full shrink-0 ${a.impact === 'Kritik' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{a.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {nudgeMessage && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Tick01Icon} size={18} className="text-green-400" />
            {nudgeMessage}
          </div>
        </div>
      )}

      {/* Provider Complaint Modal */}
      <ActionModal 
        isOpen={!!providerComplaint} 
        onClose={() => setProviderComplaint(null)} 
        title="Firma Şikayeti" 
        description={`${providerComplaint} için resmi uyarı / şikayet kaydı oluşturulacaktır.`}
      >
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5">Şikayet Tipi</label>
          <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:ring-2 focus:ring-red-500 outline-none">
            <option>Gecikmeli Teslimat Raporu</option>
            <option>Kayıp/Hasarlı Ürün</option>
            <option>Müşteri Memnuniyetsizliği</option>
            <option>SLA (Hizmet Seviyesi) İhlali</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5">Detaylı Açıklama</label>
          <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Şikayet detaylarını buraya girin..." />
        </div>

        <div className="flex gap-2 mt-2">
          <button onClick={() => setProviderComplaint(null)} className="flex-1 py-3 rounded-xl bg-white border border-gray-200 text-[#111827] font-bold text-[13px] hover:bg-gray-50 transition-colors">İptal</button>
          <button 
            onClick={() => {
              setNudgeMessage(`${providerComplaint} için şikayet kaydı başarıyla oluşturuldu.`);
              setProviderComplaint(null);
              setTimeout(() => setNudgeMessage(null), 3000);
            }}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[13px] transition-colors shadow-lg shadow-red-500/20"
          >
            Şikayet Oluştur
          </button>
        </div>
      </ActionModal>
    </div>
  );
}

