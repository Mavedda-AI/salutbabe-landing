"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";

interface Store {
  storeID: string;
  storeName: string;
  storePhotoUrl: string;
  isActive: boolean;
  segment: 'mother' | 'pro'; // 'mother' for individual, 'pro' for professional
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
  const { theme, t } = useThemeLanguage();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'mother' | 'pro' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // MOCK DATA INJECTION FOR DEMONSTRATION OF NEW UI
      if (!token || token === "mock_token") {
        setTimeout(() => {
          setStores([
            { storeID: "STR-001", storeName: "Ayşe'nin Dolabı", storePhotoUrl: "", isActive: true, segment: 'mother', totalSales: 12, activeListings: 3, owner: { userID: "U-1", userName: "Ayşe", userSurname: "Yılmaz", eMail: "ayse@example.com" } },
            { storeID: "STR-002", storeName: "Baby Moda", storePhotoUrl: "", isActive: true, segment: 'pro', totalSales: 450, activeListings: 120, owner: { userID: "U-2", userName: "Mehmet", userSurname: "Kaya", eMail: "mehmet@babymoda.com" } },
            { storeID: "STR-003", storeName: "Mini Adımlar", storePhotoUrl: "", isActive: false, segment: 'pro', totalSales: 89, activeListings: 45, owner: { userID: "U-3", userName: "Zeynep", userSurname: "Demir", eMail: "zeynep@miniadimlar.com" } },
            { storeID: "STR-004", storeName: "Büyüyen Bebek", storePhotoUrl: "", isActive: true, segment: 'mother', totalSales: 2, activeListings: 1, owner: { userID: "U-4", userName: "Fatma", userSurname: "Çelik", eMail: "fatma@example.com" } },
            { storeID: "STR-005", storeName: "Şirin Kids", storePhotoUrl: "", isActive: true, segment: 'pro', totalSales: 1250, activeListings: 340, owner: { userID: "U-5", userName: "Can", userSurname: "Öztürk", eMail: "can@sirinkids.com" } },
          ]);
          setLoading(false);
        }, 500);
        return;
      }

      const res = await fetch(apiUrl("/admin/stores"), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.payload) {
        // Fallback segment logic if backend doesn't provide it yet
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
      const token = localStorage.getItem("auth_token");
      if (!token) {
        // Mock toggle
        setTimeout(() => {
          setStores(stores.map(s => s.storeID === storeID ? { ...s, isActive: !currentStatus } : s));
          setSaving(null);
        }, 400);
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
      : !store.isActive; // Pending
      
    const matchesSearch = store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          store.owner.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          store.storeID.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in w-full max-w-[1400px] mx-auto pb-12 overflow-x-hidden md:overflow-visible px-0">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Mağaza & Satıcı Yönetimi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Platformdaki Anne ve Pro satıcı segmentlerini yönetin.</p>
         </div>

         <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:items-center md:gap-4">
            <div className={`px-3 md:px-4 py-2 md:py-3 rounded-xl flex flex-col md:flex-row md:items-center gap-2 md:gap-3 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-100'}`}>
               <span className="text-lg md:text-xl hidden md:block">👩‍👧</span>
               <div>
                  <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-blue-600/70'}`}>Anne Satıcılar</p>
                  <p className={`text-[14px] md:text-[16px] font-black ${isDark ? 'text-white' : 'text-blue-700'}`}>8,432</p>
               </div>
            </div>
            <div className={`px-3 md:px-4 py-2 md:py-3 rounded-xl flex flex-col md:flex-row md:items-center gap-2 md:gap-3 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-100'}`}>
               <span className="text-lg md:text-xl hidden md:block">🏢</span>
               <div>
                  <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-purple-600/70'}`}>Pro Satıcılar</p>
                  <p className={`text-[14px] md:text-[16px] font-black ${isDark ? 'text-white' : 'text-purple-700'}`}>174</p>
               </div>
            </div>
         </div>
      </div>

      {/* Action Bar (Search & Tabs) */}
      <div className={`${cardClass} p-2 md:p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 w-full overflow-hidden`}>
         <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar px-2 pb-2 md:pb-0 flex-1 min-w-0">
            {[
              { id: 'all', label: 'Tüm Satıcılar' },
              { id: 'mother', label: 'Anne Satıcılar' },
              { id: 'pro', label: 'Profesyoneller' },
              { id: 'pending', label: 'Pasif / Bekleyen' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-[12px] transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? (isDark ? 'text-white font-black' : 'text-[#111827] font-black') 
                    : (isDark ? 'text-gray-500 font-bold hover:text-white' : 'text-gray-500 font-bold hover:text-[#111827]')}`}
              >
                {tab.label}
              </button>
            ))}
         </div>
         
         <div className="px-2 md:px-4 md:w-80 w-full shrink-0">
            <div className={`relative flex items-center w-full h-10 rounded-xl border transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10 focus-within:border-primary/50' : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 focus-within:bg-white'}`}>
               <svg className={`w-4 h-4 ml-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Mağaza adı, satıcı adı veya ID..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-full bg-transparent border-none outline-none px-3 text-[12px] font-medium placeholder:text-gray-400 text-inherit"
               />
            </div>
         </div>
      </div>

      {/* Table Section */}
      <div className={`${cardClass} overflow-hidden w-full max-w-full`}>
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Mağaza Bilgisi</th>
                <th className="hidden md:table-cell px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Segment</th>
                <th className="hidden md:table-cell px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Satış / Ürün</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Durum</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr>
              ) : filteredStores.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3">🔍</span>
                    <h3 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sonuç Bulunamadı</h3>
                    <p className={`text-[12px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Arama kriterlerinize uyan satıcı bulunmuyor.</p>
                  </div>
                </td></tr>
              ) : filteredStores.map((store) => (
                <tr key={store.storeID} className={`transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border transition-transform group-hover:scale-105 ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                        {store.storePhotoUrl ? (
                          <img src={`${API_BASE_URL}/uploads/stores/${store.storePhotoUrl}`} alt={store.storeName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] md:text-[12px] font-black opacity-40 uppercase tracking-widest">{store.storeName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-[12px] md:text-[14px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{store.storeName}</span>
                        <span className={`text-[9px] md:text-[11px] font-medium mt-0.5 truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {store.owner.userName} {store.owner.userSurname} <span className="hidden md:inline">• <span className="opacity-60">{store.storeID.split('-')[0]}</span></span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    {store.segment === 'pro' ? (
                      <div className="flex flex-col">
                        <span className="inline-flex items-center w-max gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-wider">
                          🏢 Pro Satıcı
                        </span>
                        <span className={`text-[10px] font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Kurumsal Fatura</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="inline-flex items-center w-max gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                          👩‍👧 Anne
                        </span>
                        <span className={`text-[10px] font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Bireysel Satıcı</span>
                      </div>
                    )}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{store.totalSales} <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>satış</span></span>
                      <span className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{store.activeListings} aktif ilan</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    {store.isActive ? (
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Aktif
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Pasif
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleStatus(store.storeID, store.isActive); }}
                       disabled={saving === store.storeID}
                       className={`relative overflow-hidden px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-[10px] md:text-[12px] font-bold uppercase tracking-wider border-2 transition-all group
                         ${saving === store.storeID ? 'opacity-50 cursor-not-allowed' : ''}
                         ${!store.isActive ? (isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100') : (isDark ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100')}
                       `}
                     >
                       {saving === store.storeID ? 'İşleniyor...' : (store.isActive ? 'Askıya Al' : 'Onayla / Aç')}
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
