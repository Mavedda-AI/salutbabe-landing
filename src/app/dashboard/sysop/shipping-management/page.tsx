"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

interface ShippingRate {
  rateID?: string;
  desiMin: number;
  desiMax: number;
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
    if (!confirm(t('dashboard.shipping.delete_confirm'))) return;
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
    rates.push({ desiMin: 0, desiMax: 0, price: 0 });
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
    setCurrentCompany({ ...currentCompany, rates });
  };

  if (loading) return <div className="p-8 text-center">{t('dashboard.sysop.loading_data')}</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-end">
        <button 
          onClick={handleAdd}
          className="h-12 px-8 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          {t('dashboard.shipping.add_company')}
        </button>
      </div>

      <div className={`rounded-[2.5rem] border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-100 shadow-xl shadow-gray-200/50' : 'bg-surface border-white/5 shadow-2xl'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={theme === 'light' ? 'bg-gray-50/50' : 'bg-white/5'}>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.shipping.logo')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.shipping.company_name')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.shipping.source')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.shipping.status')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right">{t('dashboard.sysop.table_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-text-secondary font-bold opacity-60 uppercase tracking-widest">{t('dashboard.shipping.no_companies')}</td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.companyID} className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                  <td className="px-8 py-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-border-color">
                      {company.logo ? (
                        <img src={company.logo.startsWith('http') ? company.logo : apiUrl(`/uploads/shipping/${company.logo}`)} alt={company.name} className="w-full h-full object-contain" />
                      ) : (
                        <svg className="w-6 h-6 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-text-primary">{company.name}</span>
                      <span className="text-[11px] font-bold text-text-secondary opacity-60 truncate max-w-[200px]">{company.website || '-'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${company.source === 'SYSTEM' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                      {company.source === 'SYSTEM' ? t('dashboard.shipping.source_system') : t('dashboard.shipping.source_seller')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${company.isActive ? 'bg-success shadow-[0_0_10px_rgba(52,199,89,0.5)]' : 'bg-gray-300'}`}></div>
                      <span className="text-[11px] font-black uppercase tracking-widest opacity-60">{company.isActive ? t('dashboard.shipping.active') : t('dashboard.shipping.passive')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(company)} className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-text-secondary hover:text-primary transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(company.companyID)} className="p-2.5 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all">
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

      {/* Modal */}
      {isModalOpen && currentCompany && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-[2.5rem] border animate-zoom-in ${theme === 'light' ? 'bg-white border-gray-100 shadow-2xl' : 'bg-surface border-white/5 shadow-2xl'}`}>
            <div className="p-8 border-b border-border-color flex items-center justify-between shrink-0">
              <h3 className="text-xl font-black text-text-primary">{currentCompany.companyID ? t('dashboard.shipping.edit_company') : t('dashboard.shipping.add_company')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.shipping.company_name')}</label>
                  <input 
                    type="text" 
                    value={currentCompany.name}
                    onChange={e => setCurrentCompany({...currentCompany, name: e.target.value})}
                    className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.shipping.website')}</label>
                  <input 
                    type="text" 
                    value={currentCompany.website}
                    onChange={e => setCurrentCompany({...currentCompany, website: e.target.value})}
                    className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.shipping.source')}</label>
                  <select 
                    value={currentCompany.source}
                    onChange={e => setCurrentCompany({...currentCompany, source: e.target.value as any})}
                    className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border appearance-none ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
                  >
                    <option value="SYSTEM">{t('dashboard.shipping.source_system')}</option>
                    <option value="USER_BASED">{t('dashboard.shipping.source_seller')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.shipping.status')}</label>
                  <div className="flex items-center gap-4 h-14">
                    <button 
                      onClick={() => setCurrentCompany({...currentCompany, isActive: true})}
                      className={`flex-1 h-full rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all ${currentCompany.isActive ? 'bg-success/10 border-success text-success' : 'border-border-color text-text-secondary'}`}
                    >
                      {t('dashboard.shipping.active')}
                    </button>
                    <button 
                      onClick={() => setCurrentCompany({...currentCompany, isActive: false})}
                      className={`flex-1 h-full rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all ${!currentCompany.isActive ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border-color text-text-secondary'}`}
                    >
                      {t('dashboard.shipping.passive')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Logo Area */}
              {currentCompany.companyID && (
                <div className="space-y-4 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-border-color">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em]">{t('dashboard.shipping.logo')}</h4>
                    <label className="cursor-pointer text-[11px] font-black text-primary hover:underline uppercase tracking-widest">
                      {t('dashboard.shipping.upload_logo')}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, currentCompany.companyID)} />
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-background border border-border-color flex items-center justify-center overflow-hidden">
                       {currentCompany.logo ? (
                         <img src={currentCompany.logo.startsWith('http') ? currentCompany.logo : apiUrl(`/uploads/shipping/${currentCompany.logo}`)} className="w-full h-full object-contain" />
                       ) : (
                         <span className="text-[10px] opacity-20 uppercase font-black tracking-widest">NO LOGO</span>
                       )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] text-text-secondary font-bold opacity-60 leading-relaxed">Şirket logosu faturalarda ve kargo takip ekranlarında görünür. En iyi sonuç için şeffaf PNG kullanın.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rates Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em]">{t('dashboard.shipping.rates_title')}</h4>
                  <button onClick={addRate} className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest">{t('dashboard.shipping.add_rate')}</button>
                </div>

                <div className="space-y-3">
                  {currentCompany.rates?.map((rate, idx) => (
                    <div key={idx} className="flex items-center gap-4 animate-in slide-in-from-left-2 duration-200">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div className="relative">
                          <input 
                            type="number" 
                            placeholder={t('dashboard.shipping.min_desi')}
                            value={rate.desiMin}
                            onChange={e => updateRate(idx, 'desiMin', parseFloat(e.target.value))}
                            className={`w-full h-12 px-5 rounded-xl outline-none font-black text-[13px] border ${theme === 'light' ? 'bg-gray-50 border-transparent' : 'bg-white/5 border-transparent'}`} 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 uppercase tracking-widest">MIN</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="number" 
                            placeholder={t('dashboard.shipping.max_desi')}
                            value={rate.desiMax}
                            onChange={e => updateRate(idx, 'desiMax', parseFloat(e.target.value))}
                            className={`w-full h-12 px-5 rounded-xl outline-none font-black text-[13px] border ${theme === 'light' ? 'bg-gray-50 border-transparent' : 'bg-white/5 border-transparent'}`} 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 uppercase tracking-widest">MAX</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="number" 
                            placeholder={t('dashboard.shipping.price')}
                            value={rate.price}
                            onChange={e => updateRate(idx, 'price', parseFloat(e.target.value))}
                            className={`w-full h-12 px-5 rounded-xl outline-none font-black text-[13px] border ${theme === 'light' ? 'bg-gray-50 border-transparent' : 'bg-white/5 border-transparent'}`} 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary">₺</span>
                        </div>
                      </div>
                      <button onClick={() => removeRate(idx)} className="w-12 h-12 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-border-color bg-gray-50/50 dark:bg-white/5 flex items-center justify-end gap-4 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-12 px-8 rounded-2xl font-black text-[13px] text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-all uppercase tracking-widest"
              >
                {t('dashboard.btn_cancel')}
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="h-12 px-10 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all uppercase tracking-widest"
              >
                {saving ? t('auth.loading') : t('dashboard.btn_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
