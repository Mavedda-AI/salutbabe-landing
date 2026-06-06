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
  rates: ShippingRate[];
}

export default function ShippingManagementPage() {
  const { theme, t } = useThemeLanguage();
  const [companies, setCompanies] = useState<ShippingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<ShippingCompany> | null>(null);
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
        setCompanies(data.payload);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (company: ShippingCompany) => {
    setCurrentCompany(JSON.parse(JSON.stringify(company)));
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentCompany({
      name: '',
      website: '',
      source: 'SYSTEM',
      isActive: true,
      rates: []
    });
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

  if (loading) return <div className="p-8 text-center">{t('dashboard.sysop.loading_data') || 'Yükleniyor...'}</div>;

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
           <h2 className="text-3xl font-black text-[#1A2332] dark:text-white tracking-tight">Kargo Yönetimi</h2>
           <p className="text-[13px] font-bold text-gray-500 mt-2">Sistemdeki tüm kargo sağlayıcılarını ve fiyatlandırma baremlerini (desi) gelişmiş olarak yönetin.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="h-14 px-8 bg-gradient-to-r from-[#FF6B00] to-[#FF8B30] text-white font-black rounded-2xl shadow-lg shadow-[#FF6B00]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </div>
          {t('dashboard.shipping.add_company') || 'Yeni Şirket Ekle'}
        </button>
      </div>

      {/* Main Table Container (Glassmorphism) */}
      <div className="rounded-[2.5rem] border overflow-x-auto bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-2xl relative z-10">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className='bg-gray-50/50 dark:bg-white/5'>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] rounded-tl-[2.5rem]">LOGO</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">ŞİRKET DETAYLARI</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">BAREMLER</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">DURUM</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right rounded-tr-[2.5rem]">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold opacity-60 uppercase tracking-widest">Henüz kargo şirketi eklenmemiş.</td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.companyID} className={`transition-all hover:bg-gray-50/50 dark:hover:bg-white/5 group`}>
                  <td className="px-8 py-6">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-white dark:bg-[#0B0C10] shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                      {company.logo ? (
                        <img src={company.logo.startsWith('http') ? company.logo : apiUrl(`/uploads/shipping/${company.logo}`)} alt={company.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[16px] font-black text-[#1A2332] dark:text-white leading-tight">{company.name}</span>
                      <span className="text-[12px] font-bold text-gray-400 truncate max-w-[250px]">{company.website || 'Web sitesi yok'}</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${company.source === 'SYSTEM' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'}`}>
                          {company.source === 'SYSTEM' ? 'SİSTEM (GLOBAL)' : 'SATICI ÖZEL'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center font-black text-[13px] text-gray-600 dark:text-gray-300">
                           {company.rates?.length || 0}
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kayıtlı<br/>Barem</span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${company.isActive ? 'bg-[#34C759] shadow-[0_0_12px_rgba(52,199,89,0.6)]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className={`text-[12px] font-black uppercase tracking-widest ${company.isActive ? 'text-[#34C759]' : 'text-gray-400'}`}>
                        {company.isActive ? 'AKTİF KULLANIMDA' : 'PASİF'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => handleEdit(company)} className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 dark:hover:bg-[#FF6B00]/20 border border-gray-100 dark:border-white/10 transition-all flex items-center justify-center" title="Düzenle">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(company.companyID)} className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white border border-gray-100 dark:border-white/10 hover:border-red-500 transition-all flex items-center justify-center shadow-sm" title="Sil">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Advanced Senior-Level Modal */}
      {isModalOpen && currentCompany && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans">
          <div className="fixed inset-0 bg-[#0B0C10]/80 backdrop-blur-xl animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-[2.5rem] border animate-zoom-in bg-white dark:bg-[#12141C] border-gray-200 dark:border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF9EBE] to-[#5FC8C0]"></div>
              <div>
                 <h3 className="text-2xl font-black text-[#1A2332] dark:text-white tracking-tight">
                   {currentCompany.companyID ? 'Kargo Şirketini Düzenle' : 'Yeni Kargo Şirketi Ekle'}
                 </h3>
                 <p className="text-[12px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
                   {currentCompany.companyID ? `ID: ${currentCompany.companyID.split('-')[0]}...` : 'Tüm Alanları Doldurun'}
                 </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-[#FF6B00] transition-colors hover:scale-105 active:scale-95 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar relative">
              
              {/* Section 1: Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                     <span className="font-black text-[14px]">1</span>
                   </div>
                   <h4 className="text-[16px] font-black text-[#1A2332] dark:text-white uppercase tracking-widest">Temel Bilgiler</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.02]">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Şirket Adı</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Yurtiçi Kargo"
                      value={currentCompany.name}
                      onChange={e => setCurrentCompany({...currentCompany, name: e.target.value})}
                      className="w-full h-14 px-6 rounded-2xl outline-none font-black text-[15px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] dark:focus:border-[#FF6B00] shadow-sm" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Web Sitesi</label>
                    <input 
                      type="text" 
                      placeholder="Örn: https://www.yurticikargo.com"
                      value={currentCompany.website}
                      onChange={e => setCurrentCompany({...currentCompany, website: e.target.value})}
                      className="w-full h-14 px-6 rounded-2xl outline-none font-black text-[15px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] dark:focus:border-[#FF6B00] shadow-sm" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Tedarikçi Tipi (Kaynak)</label>
                    <div className="relative">
                      <select 
                        value={currentCompany.source}
                        onChange={e => setCurrentCompany({...currentCompany, source: e.target.value as any})}
                        className="w-full h-14 px-6 rounded-2xl outline-none font-black text-[15px] transition-all border appearance-none bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] dark:focus:border-[#FF6B00] shadow-sm cursor-pointer"
                      >
                        <option value="SYSTEM">SİSTEM (Tüm satıcılar kullanabilir)</option>
                        <option value="USER_BASED">KULLANICI (Sadece satıcıya özel)</option>
                      </select>
                      <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Sistem Durumu</label>
                    <div className="flex items-center gap-4 h-14 bg-white dark:bg-[#0B0C10] p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                      <button 
                        onClick={() => setCurrentCompany({...currentCompany, isActive: true})}
                        className={`flex-1 h-full rounded-xl font-black text-[12px] uppercase tracking-widest transition-all ${currentCompany.isActive ? 'bg-[#34C759] text-white shadow-[0_4px_10px_rgba(52,199,89,0.3)]' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        AKTİF
                      </button>
                      <button 
                        onClick={() => setCurrentCompany({...currentCompany, isActive: false})}
                        className={`flex-1 h-full rounded-xl font-black text-[12px] uppercase tracking-widest transition-all ${!currentCompany.isActive ? 'bg-[#FF3B30] text-white shadow-[0_4px_10px_rgba(255,59,48,0.3)]' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        PASİF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Area */}
              {currentCompany.companyID && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#5FC8C0]/10 text-[#5FC8C0] flex items-center justify-center">
                       <span className="font-black text-[14px]">2</span>
                     </div>
                     <h4 className="text-[16px] font-black text-[#1A2332] dark:text-white uppercase tracking-widest">Marka Logosu</h4>
                  </div>
                  
                  <div className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.02] flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-[1.5rem] bg-white dark:bg-[#0B0C10] border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm relative group">
                         {currentCompany.logo ? (
                           <img src={currentCompany.logo.startsWith('http') ? currentCompany.logo : apiUrl(`/uploads/shipping/${currentCompany.logo}`)} className="w-full h-full object-contain p-2" />
                         ) : (
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest text-center px-2">Görsel Yok</span>
                         )}
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <label className="cursor-pointer p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                             <input type="file" className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, currentCompany.companyID)} />
                           </label>
                         </div>
                      </div>
                      <div className="max-w-md">
                        <h5 className="text-[14px] font-black text-[#1A2332] dark:text-white mb-1">Logo Yükle</h5>
                        <p className="text-[12px] text-gray-500 font-bold leading-relaxed">Önerilen boyut 400x400px. PNG veya JPEG formatında, şeffaf arka planlı bir marka logosu yükleyin. Sistem arayüzlerinde kullanılacaktır.</p>
                      </div>
                    </div>
                    
                    <label className="shrink-0 cursor-pointer h-12 px-6 rounded-xl border-2 border-[#FF6B00] text-[#FF6B00] font-black text-[12px] uppercase tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                       Gözat
                       <input type="file" className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, currentCompany.companyID)} />
                    </label>
                  </div>
                </div>
              )}

              {/* Section 3: Advanced Rates */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#FF9EBE]/20 text-[#FF9EBE] flex items-center justify-center">
                       <span className="font-black text-[14px]">3</span>
                     </div>
                     <h4 className="text-[16px] font-black text-[#1A2332] dark:text-white uppercase tracking-widest">Fiyatlandırma (Desi Baremleri)</h4>
                   </div>
                   <button 
                     onClick={addRate} 
                     className="h-10 px-5 rounded-xl bg-gray-100 dark:bg-white/5 text-[#1A2332] dark:text-white font-black text-[11px] uppercase tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all flex items-center gap-2 shadow-sm"
                   >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                     Yeni Barem Ekle
                   </button>
                </div>

                <div className="space-y-4">
                  {currentCompany.rates?.map((rate, idx) => (
                    <div key={idx} className="relative p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0C10] shadow-sm animate-in slide-in-from-left-4 duration-300">
                      
                      <button 
                         onClick={() => removeRate(idx)} 
                         className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 hover:shadow-lg transition-transform z-10"
                         title="Baremi Sil"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        
                        {/* Desi Inputs */}
                        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                           <div className="space-y-2 relative group">
                             <label className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">MİN DESİ</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.desiMin}
                                 onChange={e => updateRate(idx, 'desiMin', parseFloat(e.target.value))}
                                 className="w-full h-12 px-4 rounded-xl outline-none font-black text-[16px] transition-all border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#FF6B00] shadow-inner" 
                               />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">DS</span>
                             </div>
                           </div>
                           <div className="space-y-2 relative group">
                             <label className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">MAKS DESİ</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.desiMax}
                                 onChange={e => updateRate(idx, 'desiMax', parseFloat(e.target.value))}
                                 className="w-full h-12 px-4 rounded-xl outline-none font-black text-[16px] transition-all border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#FF6B00] shadow-inner" 
                               />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">DS</span>
                             </div>
                           </div>
                        </div>

                        {/* Pricing Inputs */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <div className="space-y-2 relative">
                             <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">HAM FİYAT</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.originalPrice || 0}
                                 onChange={e => updateRate(idx, 'originalPrice', parseFloat(e.target.value))}
                                 className="w-full h-12 px-4 rounded-xl outline-none font-black text-[16px] transition-all border bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20 focus:border-blue-500 text-blue-700 dark:text-blue-400 shadow-inner" 
                               />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-blue-400">₺</span>
                             </div>
                           </div>
                           <div className="space-y-2 relative">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">KDV ORANI <span className="text-[9px] bg-gray-200 dark:bg-gray-800 px-1 rounded text-gray-600">%</span></label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.vatRate !== undefined ? rate.vatRate : 20}
                                 onChange={e => updateRate(idx, 'vatRate', parseFloat(e.target.value))}
                                 className="w-full h-12 px-4 rounded-xl outline-none font-black text-[14px] transition-all border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-gray-400 shadow-inner" 
                               />
                               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 text-right leading-tight border-l border-gray-200 dark:border-gray-700 pl-2">
                                  +{rate.vat || 0} ₺<br/>(Tutar)
                               </div>
                             </div>
                           </div>
                           <div className="space-y-2 relative">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">EPH ORANI <span className="text-[9px] bg-gray-200 dark:bg-gray-800 px-1 rounded text-gray-600">%</span></label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={rate.ephRate !== undefined ? rate.ephRate : 2.35}
                                 onChange={e => updateRate(idx, 'ephRate', parseFloat(e.target.value))}
                                 className="w-full h-12 px-4 rounded-xl outline-none font-black text-[14px] transition-all border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-gray-400 shadow-inner" 
                               />
                               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 text-right leading-tight border-l border-gray-200 dark:border-gray-700 pl-2">
                                  +{rate.ephAmount || 0} ₺<br/>(Tutar)
                               </div>
                             </div>
                           </div>
                        </div>

                      </div>

                      {/* Summary Banner for the Rate */}
                      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-2xl">
                         <div>
                            <p className="text-[11px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest">OTOMATİK HESAPLANAN TOPLAM FİYAT</p>
                            <p className="text-[10px] font-bold text-green-700/60 dark:text-green-400/60 mt-0.5">Ham Fiyat + KDV ({rate.vat}₺) + EPH ({rate.ephAmount}₺)</p>
                         </div>
                         <div className="text-right flex items-end gap-1 text-green-600 dark:text-green-400">
                            <span className="text-3xl font-black leading-none">{rate.totalPrice || 0}</span>
                            <span className="text-lg font-black mb-0.5">₺</span>
                         </div>
                      </div>

                    </div>
                  ))}
                  
                  {(!currentCompany.rates || currentCompany.rates.length === 0) && (
                    <div className="p-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-center opacity-70">
                       <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                       <p className="text-[13px] font-black text-gray-500 uppercase tracking-widest">Hiç barem eklenmemiş.</p>
                       <p className="text-[12px] font-bold text-gray-400 mt-1 max-w-sm">Gönderim sağlanabilmesi için ağırlık (desi) sınırlarını ve fiyatlarını belirlemelisiniz.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#12141C] flex items-center justify-end gap-4 shrink-0 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-14 px-8 rounded-2xl font-black text-[13px] text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all uppercase tracking-widest"
              >
                İptal Et
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="h-14 px-12 bg-[#1A2332] dark:bg-white text-white dark:text-[#1A2332] font-black rounded-2xl shadow-xl shadow-black/10 dark:shadow-white/10 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all uppercase tracking-widest flex items-center gap-2"
              >
                {saving ? (
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                )}
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
