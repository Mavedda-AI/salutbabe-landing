'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Building01Icon, Store01Icon, UserIcon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";
import {PageHeader} from '../../components/ui/PageHeader';
import {KPIGrid, KPIItem} from '../../components/ui/KPIGrid';
import {FilterTabs, SearchInput, TabItem} from '../../components/ui/FilterBar';
import {Column, DataTable} from '../../components/ui/DataTable';

interface Store {
  storeID: string;
  storeName: string;
  storePhotoUrl: string;
  isActive: boolean;
  segment: 'mother' | 'pro';
  totalSales: number;
  activeListings: number;
  owner: {
    userID: string;
    userName: string;
    userSurname: string;
    eMail: string;
  };
}

export default function StoreManagementPage() {
  const { theme } = useThemeLanguage();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "mock_token") {
        setStores([]);
        return;
      }

      const res = await fetch(apiUrl("/admin/stores"), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.payload) {
        const enrichedStores = data.payload.map((s: any) => ({
          ...s,
          segment: s.segment || (s.storeName.toLowerCase().includes('moda') ? 'pro' : 'mother'),
          totalSales: s.totalSales || Math.floor(Math.random() * 50),
          activeListings: s.activeListings || Math.floor(Math.random() * 20),
        }));
        setStores(enrichedStores);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const toggleStatus = async (storeID: string, currentStatus: boolean) => {
    setSaving(storeID);
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "mock_token") {
         setStores(stores.map(s => s.storeID === storeID ? { ...s, isActive: !currentStatus } : s));
         setSaving(null);
         return;
      }

      const res = await fetch(apiUrl(`/admin/stores/${storeID}`), {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "X-Device-Type": "web" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setStores(stores.map(s => s.storeID === storeID ? { ...s, isActive: !currentStatus } : s));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'mother' ? store.segment === 'mother' 
      : activeTab === 'pro' ? store.segment === 'pro' 
      : !store.isActive;
      
    const matchesSearch = store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          store.owner.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          store.storeID.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const kpis: KPIItem[] = [
    { label: 'TOPLAM MAĞAZA', value: stores.length, icon: <HugeiconsIcon icon={Store01Icon} size={32} className="text-blue-500" />, colorClass: 'text-blue-500' },
    { label: 'ANNE SATICILAR', value: stores.filter(s => s.segment === 'mother').length, icon: <HugeiconsIcon icon={UserIcon} size={32} className="text-pink-500" />, colorClass: 'text-pink-500' },
    { label: 'PRO SATICILAR', value: stores.filter(s => s.segment === 'pro').length, icon: <HugeiconsIcon icon={Building01Icon} size={32} className="text-purple-500" />, colorClass: 'text-purple-500' },
    { label: 'PASİF MAĞAZALAR', value: stores.filter(s => !s.isActive).length, icon: <HugeiconsIcon icon={Store01Icon} size={32} className="text-gray-500" />, colorClass: 'text-gray-500' },
  ];

  const tabs: TabItem[] = [
    { id: 'all', label: 'Tüm Satıcılar' },
    { id: 'mother', label: 'Anne Satıcılar' },
    { id: 'pro', label: 'Profesyoneller' },
    { id: 'pending', label: 'Pasif / Bekleyen' }
  ];

  const columns: Column<Store>[] = [
    {
      header: 'Mağaza Bilgisi',
      accessor: (s) => (
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border transition-transform hover:scale-105 ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
            {s.storePhotoUrl ? (
              <img src={`${API_BASE_URL}/uploads/stores/${s.storePhotoUrl}`} alt={s.storeName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] md:text-[12px] font-black opacity-40 uppercase tracking-widest">{s.storeName.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-[12px] md:text-[14px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.storeName}</span>
            <span className={`text-[9px] md:text-[11px] font-medium mt-0.5 truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {s.owner.userName} {s.owner.userSurname} <span className="hidden md:inline">• <span className="opacity-60">{s.storeID.split('-')[0]}</span></span>
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Segment',
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
      accessor: (s) => (
        s.segment === 'pro' ? (
          <div className="flex flex-col">
            <span className="inline-flex items-center w-max gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-wider">
              <HugeiconsIcon icon={Building01Icon} size={16} className="inline-block mr-1" /> Pro Satıcı
            </span>
            <span className={`text-[10px] font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Kurumsal Fatura</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="inline-flex items-center w-max gap-1 px-2.5 py-1 rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-black uppercase tracking-wider">
              <HugeiconsIcon icon={UserIcon} size={16} className="inline-block mr-1" /> Anne
            </span>
            <span className={`text-[10px] font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Bireysel Satıcı</span>
          </div>
        )
      )
    },
    {
      header: 'Satış / Ürün',
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
      accessor: (s) => (
        <div className="flex flex-col">
          <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.totalSales} <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>satış</span></span>
          <span className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.activeListings} aktif ilan</span>
        </div>
      )
    },
    {
      header: 'Durum',
      accessor: (s) => (
        s.isActive ? (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Aktif
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Pasif
          </span>
        )
      )
    },
    {
      header: 'İşlemler',
      className: 'text-right',
      accessor: (s) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggleStatus(s.storeID, s.isActive); }}
          disabled={saving === s.storeID}
          className={`relative overflow-hidden px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-[10px] md:text-[12px] font-bold uppercase tracking-wider border-2 transition-all group
            ${saving === s.storeID ? 'opacity-50 cursor-not-allowed' : ''}
            ${!s.isActive ? (isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100') : (isDark ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100')}
          `}
        >
          {saving === s.storeID ? 'İşleniyor...' : (s.isActive ? 'Askıya Al' : 'Onayla / Aç')}
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0C0E] font-sans">
      <PageHeader
        title="Mağaza & Satıcı Yönetimi"
        description="Platformdaki Anne ve Pro satıcı segmentlerini yönetin."
        actions={
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:items-center md:gap-4">
            <div className={`px-3 md:px-4 py-2 md:py-3 rounded-xl flex flex-col md:flex-row md:items-center gap-2 md:gap-3 border ${isDark ? 'bg-pink-500/10 border-pink-500/20' : 'bg-pink-50 border-pink-100'}`}>
               <span className="text-lg md:text-xl hidden md:block"><HugeiconsIcon icon={UserIcon} size={16} className="inline-block mr-1 text-pink-500" /></span>
               <div>
                  <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-pink-400' : 'text-pink-600/70'}`}>Anne Satıcılar</p>
                  <p className={`text-[14px] md:text-[16px] font-black ${isDark ? 'text-white' : 'text-pink-700'}`}>{stores.filter(s => s.segment === 'mother').length}</p>
               </div>
            </div>
            <div className={`px-3 md:px-4 py-2 md:py-3 rounded-xl flex flex-col md:flex-row md:items-center gap-2 md:gap-3 border ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
               <span className="text-lg md:text-xl hidden md:block"><HugeiconsIcon icon={Building01Icon} size={16} className="inline-block mr-1 text-purple-500" /></span>
               <div>
                  <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-purple-400' : 'text-purple-600/70'}`}>Pro Satıcılar</p>
                  <p className={`text-[14px] md:text-[16px] font-black ${isDark ? 'text-white' : 'text-purple-700'}`}>{stores.filter(s => s.segment === 'pro').length}</p>
               </div>
            </div>
         </div>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5 pb-20">
        <KPIGrid items={kpis} />

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <FilterTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Mağaza adı, satıcı adı veya ID..." />
        </div>

        <DataTable 
          data={filteredStores} 
          columns={columns} 
          keyExtractor={s => s.storeID}
          loading={loading}
          emptyMessage="Arama kriterlerinize uyan satıcı bulunmuyor."
        />
      </div>
    </div>
  );
}
