"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

interface ShippingRate {
  rateID?: string;
  desiMin: number;
  desiMax: number;
  originalPrice: number;
  vatRate: number;
  vat: number;
  ephRate: number;
  ephAmount: number;
  totalPrice: number;
  price: number;
}

interface ShippingCompany {
  companyID: string;
  name: string;
  website: string;
  logo: string;
  isActive: boolean;
  source: 'SYSTEM' | 'USER_BASED';
  apiCredentials?: any;
  trackingUrl?: string;
  rates: ShippingRate[];
}

export default function ShippingManagementPage() {
  const { theme, t } = useThemeLanguage();
  const [companies, setCompanies] = useState<ShippingCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterSource, setFilterSource] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('LATEST');
  const [viewMode, setViewMode] = useState('LIST');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<ShippingCompany> | null>(null);
  const [activeTab, setActiveTab] = useState<'BASIC' | 'API' | 'RATES'>('BASIC');
  const [saving, setSaving] = useState(false);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/admin/shipping"), {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.payload) {
        const sortedPayload = data.payload.map((c: ShippingCompany) => {
          if (c.rates) {
             c.rates.sort((a, b) => a.desiMin - b.desiMin);
          }
          return c;
        });
        setCompanies(sortedPayload);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (company: ShippingCompany) => {
    const copy = JSON.parse(JSON.stringify(company));
    if (copy.rates) {
      copy.rates.sort((a: any, b: any) => a.desiMin - b.desiMin);
    }
    if (!copy.apiCredentials) {
      copy.apiCredentials = { activeEnvironment: 'dev', dev: {}, prod: {} };
    }
    setCurrentCompany(copy);
    setActiveTab('BASIC');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentCompany({
      name: '',
      website: '',
      source: 'SYSTEM',
      isActive: true,
      apiCredentials: { activeEnvironment: 'dev', dev: {}, prod: {} },
      trackingUrl: '',
      rates: []
    });
    setActiveTab('BASIC');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentCompany?.name) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const method = currentCompany.companyID ? "PUT" : "POST";
      const url = currentCompany.companyID 
        ? apiUrl(`/admin/shipping/${currentCompany.companyID}`) 
        : apiUrl("/admin/shipping");

      const res = await fetch(url, {
        method,
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Device-Type": "web"
        },
        body: JSON.stringify(currentCompany)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchCompanies();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('dashboard.shipping.delete_confirm') || 'Are you sure you want to delete this company?')) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(apiUrl(`/admin/shipping/${id}`), {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      fetchCompanies();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, companyId?: string) => {
    if (!e.target.files?.[0] || !companyId) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/admin/shipping/${companyId}/logo`), {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        },
        body: formData
      });
      const data = await res.json();
      if (data.payload?.signedUrl) {
        fetchCompanies();
        if (currentCompany) {
           setCurrentCompany({ ...currentCompany, logo: data.payload.signedUrl });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addRate = () => {
    if (!currentCompany) return;
    const rates = [...(currentCompany.rates || [])];
    rates.push({ 
      desiMin: 0, 
      desiMax: 0, 
      originalPrice: 0, 
      vatRate: 20, 
      vat: 0, 
      ephRate: 2.35, 
      ephAmount: 0, 
      totalPrice: 0, 
      price: 0 
    });
    setCurrentCompany({ ...currentCompany, rates });
  };

  const removeRate = (index: number) => {
    if (!currentCompany) return;
    const rates = [...(currentCompany.rates || [])];
    rates.splice(index, 1);
    setCurrentCompany({ ...currentCompany, rates });
  };

  const updateRate = (index: number, field: keyof ShippingRate, value: any) => {
    if (!currentCompany) return;
    const rates = [...(currentCompany.rates || [])];
    
    rates[index] = { ...rates[index], [field]: value };
    
    // Auto Calculate Pricing if relevant fields change
    if (['originalPrice', 'vatRate', 'ephRate'].includes(field)) {
       const originalPrice = Number(rates[index].originalPrice) || 0;
       const vatRate = Number(rates[index].vatRate) || 0;
       const ephRate = Number(rates[index].ephRate) || 0;
       
       const vat = (originalPrice * vatRate) / 100;
       const ephAmount = (originalPrice * ephRate) / 100;
       const totalPrice = originalPrice + vat + ephAmount;
       
       rates[index].vat = Number(vat.toFixed(2));
       rates[index].ephAmount = Number(ephAmount.toFixed(2));
       rates[index].totalPrice = Number(totalPrice.toFixed(2));
       rates[index].price = Number(totalPrice.toFixed(2)); // Sync legacy field
    }
    
    setCurrentCompany({ ...currentCompany, rates });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-fade-in">
      <div className="relative flex items-center justify-center">
         <div className="absolute inset-0 w-16 h-16 border-4 border-gray-100 dark:border-white/5 rounded-full"></div>
         <div className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
         <div className="absolute w-6 h-6 bg-[#FF6B00]/20 rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col items-center gap-1">
         <span className="text-[14px] font-black tracking-[0.2em] uppercase text-[#1A2332] dark:text-white">{t('dashboard.sysop.loading_data') || 'Yükleniyor'}</span>
         <span className="text-[11px] font-bold text-gray-400">Kargo verileri hazırlanıyor...</span>
      </div>
    </div>
  );

  const filteredCompanies = companies.filter(company => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ? true : (
      company.name.toLowerCase().includes(q) ||
      (company.website && company.website.toLowerCase().includes(q)) ||
      company.source.toLowerCase().includes(q)
    );

    const matchesStatus = filterStatus === 'ALL' ? true : (filterStatus === 'ACTIVE' ? company.isActive : !company.isActive);
    const matchesSource = filterSource === 'ALL' ? true : company.source === filterSource;

    return matchesSearch && matchesStatus && matchesSource;
  }).sort((a, b) => {
     if (sortOrder === 'LATEST') return a.name.localeCompare(b.name);
     return b.name.localeCompare(a.name);
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0C10] text-[#1A2332] dark:text-white p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {!isModalOpen ? (
          <div className="space-y-6 animate-fade-in">
            {/* Advanced Filter Bar (Image 2 Match) */}
        <div className="w-full flex flex-wrap xl:flex-nowrap items-center gap-3 p-2 mb-6 bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/5 rounded-3xl shadow-sm">
          
          {/* Search */}
          <div className="flex-1 min-w-[280px] flex items-center h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-transparent">
             <svg className="w-5 h-5 text-gray-400 dark:text-[#64748B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             <input 
               type="text" 
               placeholder="Şirket ara..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-full bg-transparent border-none outline-none pl-3 text-[14px] text-gray-700 dark:text-gray-200 font-medium placeholder-gray-400 dark:placeholder-[#64748B]"
             />
          </div>

          <div className="hidden xl:block w-[1px] h-8 bg-gray-200 dark:bg-white/10 shrink-0"></div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 px-2 xl:px-0">
             {/* Status Dropdown */}
             <div className="flex flex-col justify-center h-12 px-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 min-w-[120px] relative group cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Durum</span>
                <select 
                   value={filterStatus}
                   onChange={e => setFilterStatus(e.target.value)}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                   <option value="ALL">Tümü</option>
                   <option value="ACTIVE">Aktif</option>
                   <option value="PASSIVE">Pasif</option>
                </select>
                <div className="flex items-center justify-between pointer-events-none">
                  <span className="text-[13px] font-bold text-gray-700 dark:text-white">{filterStatus === 'ALL' ? 'Tümü' : filterStatus === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
                </div>
             </div>

             {/* Source Dropdown */}
             <div className="flex flex-col justify-center h-12 px-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 min-w-[130px] relative group cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Tedarikçi</span>
                <select 
                   value={filterSource}
                   onChange={e => setFilterSource(e.target.value as any)}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                   <option value="ALL">Tümü</option>
                   <option value="SYSTEM">Sistem</option>
                   <option value="USER_BASED">Satıcı Özel</option>
                </select>
                <div className="flex items-center justify-between pointer-events-none">
                  <span className="text-[13px] font-bold text-gray-700 dark:text-white">{filterSource === 'ALL' ? 'Tümü' : filterSource === 'SYSTEM' ? 'Sistem' : 'Satıcı Özel'}</span>
                </div>
             </div>

             <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10 mx-2 shrink-0"></div>

             {/* Sort Segmented */}
             <div className="flex items-center p-1 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 shrink-0">
               <button 
                 onClick={() => setSortOrder('LATEST')}
                 className={`px-4 h-10 rounded-xl text-[13px] font-bold transition-all ${sortOrder === 'LATEST' ? 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 A-Z
               </button>
               <button 
                 onClick={() => setSortOrder('OLDEST')}
                 className={`px-4 h-10 rounded-xl text-[13px] font-bold transition-all ${sortOrder === 'OLDEST' ? 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 Z-A
               </button>
             </div>

             <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10 mx-2 shrink-0"></div>

             {/* View Segmented */}
             <div className="flex items-center p-1 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 shrink-0">
               <button 
                 onClick={() => setViewMode('LIST')}
                 className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'LIST' ? 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
               </button>
               <button 
                 onClick={() => setViewMode('GRID')}
                 className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'GRID' ? 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
               </button>
             </div>

             <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10 mx-2 shrink-0"></div>

             {/* Clear */}
             <button 
                onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); setFilterSource('ALL'); setSortOrder('LATEST'); }}
                className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-gray-400 dark:text-[#64748B] hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                title="Filtreleri Temizle"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

             {/* Create Button */}
             <button 
                onClick={handleAdd}
                className="h-12 px-6 shrink-0 rounded-2xl bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(255,107,0,0.3)] flex items-center justify-center transition-all ml-1"
             >
                Yeni Ekle
             </button>

             {/* Refresh Button */}
             <button 
                onClick={fetchCompanies}
                className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-gray-400 dark:text-[#64748B] hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                title="Yenile"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
          </div>
        </div>

      {/* Main Table Container (Glassmorphism) */}
      <div className="rounded-3xl border overflow-x-auto bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm relative z-10">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className='bg-gray-50/50 dark:bg-white/5'>
              <th className="px-6 py-4 text-[12px] font-medium text-gray-500 rounded-tl-3xl">LOGO</th>
              <th className="px-6 py-4 text-[12px] font-medium text-gray-500">ŞİRKET DETAYLARI</th>
              <th className="px-6 py-4 text-[12px] font-medium text-gray-500">BAREMLER</th>
              <th className="px-6 py-4 text-[12px] font-medium text-gray-500">DURUM</th>
              <th className="px-6 py-4 text-[12px] font-medium text-gray-500 text-right rounded-tr-3xl">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-32 text-center relative overflow-hidden">
                   <div className="py-24 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-black text-[#1A2332] dark:text-white mb-2">Kargo Şirketi Bulunamadı</h3>
                    <p className="text-sm font-medium text-gray-500 max-w-[300px] mb-6">Arama kriterlerinize uyan veya sistemde kayıtlı kargo şirketi bulunamadı.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr key={company.companyID} className={`transition-all hover:bg-gray-50/50 dark:hover:bg-white/5 group`}>
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-[#0B0C10] shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300">
                      {company.logo ? (
                        <img src={company.logo.startsWith('http') ? company.logo : apiUrl(`/uploads/shipping/${company.logo}`)} alt={company.name} className="w-full h-full object-contain p-1.5" />
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Yok</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-semibold text-[#1A2332] dark:text-white leading-tight">{company.name}</span>
                      <span className="text-[12px] font-medium text-gray-500 truncate max-w-[250px]">{company.website || 'Web sitesi yok'}</span>
                      <div className="mt-0.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border ${company.source === 'SYSTEM' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'}`}>
                          {company.source === 'SYSTEM' ? 'Sistem' : 'Satıcı Özel'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center font-semibold text-[12px] text-gray-600 dark:text-gray-300">
                           {company.rates?.length || 0}
                        </div>
                        <span className="text-[11px] font-medium text-gray-500">Kayıtlı Barem</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-2.5 h-2.5">
                         <div className={`absolute inset-0 rounded-full ${company.isActive ? 'bg-[#34C759] animate-ping opacity-30' : 'hidden'}`}></div>
                         <div className={`relative w-2 h-2 rounded-full ${company.isActive ? 'bg-[#34C759]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      </div>
                      <span className={`text-[12px] font-medium ${company.isActive ? 'text-[#34C759]' : 'text-gray-400'}`}>
                        {company.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => handleEdit(company)} className="w-9 h-9 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 dark:hover:bg-[#FF6B00]/20 border border-transparent hover:border-[#FF6B00]/20 transition-all flex items-center justify-center shadow-sm" title="Düzenle">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(company.companyID)} className="w-9 h-9 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all flex items-center justify-center shadow-sm" title="Sil">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
      ) : (
        /* Inline Detail View (Formerly Modal) */
        currentCompany && (
          <div className="w-full flex flex-col rounded-[2rem] border animate-zoom-in bg-white dark:bg-[#12141C] border-gray-200 dark:border-white/10 shadow-sm overflow-hidden mb-8">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#12141C] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF9EBE] to-[#5FC8C0]"></div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-2 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-white dark:hover:bg-white/10 hover:border-[#FF6B00]/30 transition-all shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Geri Dön
                 </button>
                 <div>
                   <h3 className="text-xl font-bold text-[#1A2332] dark:text-white tracking-tight">
                     {currentCompany.companyID ? 'Kargo Şirketini Düzenle' : 'Yeni Kargo Şirketi Ekle'}
                   </h3>
                   <p className="text-[13px] font-medium text-gray-500 mt-0.5">
                     {currentCompany.companyID ? `ID: ${currentCompany.companyID.split('-')[0]}...` : 'Tüm alanları doldurun'}
                   </p>
                 </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-6 pt-4 gap-2 bg-white dark:bg-[#12141C] border-b border-gray-100 dark:border-white/10">
               <button 
                  onClick={() => setActiveTab('BASIC')}
                  className={`h-11 px-5 border-b-2 font-bold text-[13px] transition-all ${activeTab === 'BASIC' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                  Temel Bilgiler & Logo
               </button>
               <button 
                  onClick={() => setActiveTab('API')}
                  className={`h-11 px-5 border-b-2 font-bold text-[13px] transition-all ${activeTab === 'API' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                  API Bilgileri
               </button>
               <button 
                  onClick={() => setActiveTab('RATES')}
                  className={`h-11 px-5 border-b-2 font-bold text-[13px] transition-all ${activeTab === 'RATES' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                  Fiyat Baremleri
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar relative">
              
              {/* Section 1: Basic Information */}
              {activeTab === 'BASIC' && (
              <div className="space-y-6 animate-fade-in">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8 border-b border-gray-100 dark:border-white/10">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Şirket Adı</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Yurtiçi Kargo"
                      value={currentCompany.name}
                      onChange={e => setCurrentCompany({...currentCompany, name: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 shadow-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Web Sitesi</label>
                    <input 
                      type="url" 
                      placeholder="Örn: https://www.yurticikargo.com"
                      value={currentCompany.website || ''}
                      onChange={e => setCurrentCompany({...currentCompany, website: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 shadow-sm" 
                    />
                  </div>

                  <div className="space-y-1.5 lg:col-span-2">
                    <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Kargo Takip URL</label>
                    <input 
                      type="url" 
                      placeholder="Örn: https://gonderitakip.ptt.gov.tr/Track/Verify?q={kargoNo}"
                      value={currentCompany.trackingUrl || ''}
                      onChange={e => setCurrentCompany({...currentCompany, trackingUrl: e.target.value})}
                      className="w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 shadow-sm" 
                    />
                    <p className="text-[11px] font-medium text-gray-400 ml-1">Takip numarasının geleceği yere <span className="text-[#FF6B00]">{"{kargoNo}"}</span> yazabilirsiniz.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Tedarikçi Tipi (Kaynak)</label>
                    <div className="flex items-center gap-1 p-1 h-11 bg-gray-50/50 dark:bg-[#0B0C10] rounded-xl border border-gray-200 dark:border-white/10 relative z-0">
                      <button 
                        onClick={() => setCurrentCompany({...currentCompany, source: 'SYSTEM'})}
                        className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${currentCompany.source === 'SYSTEM' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        Sistem
                      </button>
                      <button 
                        onClick={() => setCurrentCompany({...currentCompany, source: 'USER_BASED'})}
                        className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${currentCompany.source === 'USER_BASED' ? 'bg-white dark:bg-white/10 shadow-sm text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        Özel
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Sistem Durumu</label>
                    <div className="flex items-center gap-1 p-1 h-11 bg-gray-50/50 dark:bg-[#0B0C10] rounded-xl border border-gray-200 dark:border-white/10 relative z-0">
                      <button 
                        onClick={() => setCurrentCompany({...currentCompany, isActive: true})}
                        className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${currentCompany.isActive ? 'bg-white dark:bg-white/10 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        Aktif
                      </button>
                      <button 
                        onClick={() => setCurrentCompany({...currentCompany, isActive: false})}
                        className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${!currentCompany.isActive ? 'bg-white dark:bg-white/10 shadow-sm text-red-600 dark:text-red-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        Pasif
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Logo Area */}
              {currentCompany.companyID && activeTab === 'BASIC' && (
                <div className="space-y-6 pb-8 border-b border-gray-100 dark:border-white/10 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                     <h4 className="text-[15px] font-bold text-[#1A2332] dark:text-white">Marka Logosu</h4>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0B0C10] border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm relative group shrink-0">
                       {currentCompany.logo ? (
                         <img src={currentCompany.logo.startsWith('http') ? currentCompany.logo : apiUrl(`/uploads/shipping/${currentCompany.logo}`)} className="w-full h-full object-contain p-2" />
                       ) : (
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest text-center px-1">Görsel Yok</span>
                       )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium text-[13px] transition-all">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                         Gözat
                         <input type="file" className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, currentCompany.companyID!)} />
                      </label>
                      <p className="text-[12px] text-gray-500 mt-2">Önerilen boyut 400x400px, şeffaf PNG veya JPEG.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'API' && (
                <div className="space-y-6 pb-8 border-gray-100 dark:border-white/10 animate-fade-in">

                  <div className="space-y-5">
                    <div className="flex items-center gap-1 p-1 bg-gray-50/50 dark:bg-[#0B0C10] rounded-xl border border-gray-200 dark:border-white/10 w-max relative z-0">
                      <button 
                        onClick={() => {
                          const creds = currentCompany.apiCredentials || { dev: {}, prod: {} };
                          setCurrentCompany({...currentCompany, apiCredentials: { ...creds, activeEnvironment: 'dev' }});
                        }}
                        className={`px-4 h-9 rounded-lg font-semibold text-[13px] transition-all duration-300 ${currentCompany.apiCredentials?.activeEnvironment === 'dev' ? 'bg-white dark:bg-white/10 shadow-sm text-orange-600 dark:text-orange-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        TEST (DEV)
                      </button>
                      <button 
                        onClick={() => {
                          const creds = currentCompany.apiCredentials || { dev: {}, prod: {} };
                          setCurrentCompany({...currentCompany, apiCredentials: { ...creds, activeEnvironment: 'prod' }});
                        }}
                        className={`px-4 h-9 rounded-lg font-semibold text-[13px] transition-all duration-300 ${currentCompany.apiCredentials?.activeEnvironment === 'prod' ? 'bg-white dark:bg-white/10 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        CANLI (PROD)
                      </button>
                    </div>

                    <div className="pt-2">
                      {currentCompany.name?.toLowerCase().includes('ptt') ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['PTT_KULLANICI', 'PTT_MUSTERI_ID', 'PTT_SIFRE'].map(key => (
                            <div key={key} className="space-y-1.5">
                              <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">{key.replace(/_/g, ' ')}</label>
                              <input 
                                type="text" 
                                value={currentCompany.apiCredentials?.[currentCompany.apiCredentials?.activeEnvironment || 'dev']?.[key] || ''}
                                onChange={e => {
                                  const env = currentCompany.apiCredentials?.activeEnvironment || 'dev';
                                  const creds = currentCompany.apiCredentials || { dev: {}, prod: {} };
                                  setCurrentCompany({
                                    ...currentCompany, 
                                    apiCredentials: {
                                      ...creds,
                                      [env]: { ...creds[env], [key]: e.target.value }
                                    }
                                  });
                                }}
                                className="w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 shadow-sm" 
                              />
                            </div>
                          ))}
                        </div>
                      ) : currentCompany.name?.toLowerCase().includes('dhl') ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['DHL_ACCOUNT_NUMBER', 'DHL_API_KEY', 'DHL_API_PASSWORD', 'DHL_API_SECRET'].map(key => (
                            <div key={key} className="space-y-1.5">
                              <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">{key.replace(/_/g, ' ')}</label>
                              <input 
                                type="text" 
                                value={currentCompany.apiCredentials?.[currentCompany.apiCredentials?.activeEnvironment || 'dev']?.[key] || ''}
                                onChange={e => {
                                  const env = currentCompany.apiCredentials?.activeEnvironment || 'dev';
                                  const creds = currentCompany.apiCredentials || { dev: {}, prod: {} };
                                  setCurrentCompany({
                                    ...currentCompany, 
                                    apiCredentials: {
                                      ...creds,
                                      [env]: { ...creds[env], [key]: e.target.value }
                                    }
                                  });
                                }}
                                className="w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 shadow-sm" 
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">JSON Konfigürasyonu ({currentCompany.apiCredentials?.activeEnvironment?.toUpperCase() || 'DEV'})</label>
                          <textarea 
                            value={JSON.stringify(currentCompany.apiCredentials?.[currentCompany.apiCredentials?.activeEnvironment || 'dev'] || {}, null, 2)}
                            onChange={e => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                const env = currentCompany.apiCredentials?.activeEnvironment || 'dev';
                                const creds = currentCompany.apiCredentials || { dev: {}, prod: {} };
                                setCurrentCompany({
                                  ...currentCompany, 
                                  apiCredentials: {
                                    ...creds,
                                    [env]: parsed
                                  }
                                });
                              } catch(err) {
                                // Ignore invalid JSON while typing
                              }
                            }}
                            className="w-full h-32 p-4 rounded-xl outline-none font-mono text-[13px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 shadow-sm"
                            placeholder='{"API_KEY": "value"}'
                          ></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Advanced Rates */}
              {activeTab === 'RATES' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     <h4 className="text-[15px] font-bold text-[#1A2332] dark:text-white">4. Fiyatlandırma (Desi Baremleri)</h4>
                   </div>
                   <button 
                     onClick={addRate} 
                     className="h-9 px-4 rounded-lg bg-gray-100 dark:bg-white/5 text-[#1A2332] dark:text-white font-semibold text-[13px] hover:bg-[#FF6B00] hover:text-white transition-all flex items-center gap-2 shadow-sm"
                   >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                     Yeni Barem Ekle
                   </button>
                </div>

                <div className="space-y-4">
                  {currentCompany.rates?.map((rate, idx) => (
                    <div key={idx} className="relative p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0C10] shadow-sm animate-in slide-in-from-left-4 duration-300">
                      
                      <button 
                         onClick={() => removeRate(idx)} 
                         className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white dark:bg-[#12141C] border border-gray-200 dark:border-white/10 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all z-10 shadow-sm"
                         title="Baremi Sil"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                        
                        {/* Desi Inputs */}
                        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                           <div className="space-y-1.5 relative group">
                             <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 ml-1">MİN DESİ</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.desiMin}
                                 onChange={e => updateRate(idx, 'desiMin', parseFloat(e.target.value))}
                                 className="w-full h-10 px-3 rounded-xl outline-none font-medium text-[14px] transition-all border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20" 
                               />
                               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">DS</span>
                             </div>
                           </div>
                           <div className="space-y-1.5 relative group">
                             <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 ml-1">MAKS DESİ</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.desiMax}
                                 onChange={e => updateRate(idx, 'desiMax', parseFloat(e.target.value))}
                                 className="w-full h-10 px-3 rounded-xl outline-none font-medium text-[14px] transition-all border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20" 
                               />
                               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">DS</span>
                             </div>
                           </div>
                        </div>

                        {/* Pricing Inputs */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                           <div className="space-y-1.5 relative">
                             <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 ml-1">HAM FİYAT</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.originalPrice || 0}
                                 onChange={e => updateRate(idx, 'originalPrice', parseFloat(e.target.value))}
                                 className="w-full h-10 px-3 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20" 
                               />
                               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-gray-400">₺</span>
                             </div>
                           </div>
                           <div className="space-y-1.5 relative">
                             <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 ml-1">KDV ORANI</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.vatRate !== undefined ? rate.vatRate : 20}
                                 onChange={e => updateRate(idx, 'vatRate', parseFloat(e.target.value))}
                                 className="w-full h-10 px-3 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20" 
                               />
                               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400 text-right">
                                  % (+{rate.vat || 0}₺)
                               </div>
                             </div>
                           </div>
                           <div className="space-y-1.5 relative">
                             <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 ml-1">EPH ORANI</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.ephRate !== undefined ? rate.ephRate : 2.35}
                                 onChange={e => updateRate(idx, 'ephRate', parseFloat(e.target.value))}
                                 className="w-full h-10 px-3 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20" 
                               />
                               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400 text-right">
                                  % (+{rate.ephAmount || 0}₺)
                               </div>
                             </div>
                           </div>
                        </div>

                      </div>

                      {/* Summary Banner for the Rate */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                         <div>
                            <p className="text-[12px] font-medium text-gray-500">Ham Fiyat + KDV ({rate.vat}₺) + EPH ({rate.ephAmount}₺)</p>
                         </div>
                         <div className="text-right flex items-baseline gap-1 text-[#1A2332] dark:text-white">
                            <span className="text-xl font-bold leading-none">{rate.totalPrice || 0}</span>
                            <span className="text-sm font-medium">₺</span>
                         </div>
                      </div>

                    </div>
                  ))}
                  
                  {(!currentCompany.rates || currentCompany.rates.length === 0) && (
                    <div className="py-6 border border-dashed border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center">
                       <p className="text-[13px] text-gray-400">Baremler boş</p>
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#12141C] flex items-center justify-end gap-3 shrink-0 relative z-20">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-11 px-6 rounded-xl font-semibold text-[13px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              >
                İptal
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="h-11 px-8 rounded-xl bg-[#FF6B00] text-white font-bold text-[13px] hover:bg-[#E66000] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center min-w-[140px] shadow-[0_4px_12px_rgba(255,107,0,0.3)]"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Kaydet
                  </span>
                )}
              </button>
            </div>

          </div>
        )
      )}
      </div>
    </div>
  );
}
