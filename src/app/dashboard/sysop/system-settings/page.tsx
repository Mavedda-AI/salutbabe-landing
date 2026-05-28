"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

export default function SystemSettingsPage() {
  const { t, theme } = useThemeLanguage();
  const [settings, setSettings] = useState<any>({
    sellerCommissionRate: 0,
    buyerServiceFee: 0,
    minWithdrawalLimit: 0,
    maintenanceMode: false,
    supportEmail: '',
    supportPhone: '',
    systemCommissions: { systemCommissions: [] }
  });
  const [showRawJson, setShowRawJson] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/admin/settings"), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setSettings(data.payload || {});
      } else {
        setSettings({});
      }
    } catch (err) {
      console.error(err);
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/admin/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        alert(t('dashboard.settings_updated') || "Sistem ayarları güncellendi");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20 animate-pulse">
      {/* Skeleton Bar */}
      {/* Title Skeleton */}
      <div className="flex flex-col gap-4 ml-6 mb-4">
         <div className={`w-64 h-8 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`} />
         <div className={`w-96 h-4 rounded-full ${theme === 'light' ? 'bg-gray-50' : 'bg-white/[0.02]'}`} />
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className={`p-10 rounded-[3rem] border flex flex-col gap-8
          ${theme === 'light' ? 'bg-white border-border-color shadow-sm' : 'bg-[#121214]/60 border-white/5'}`}>
          <div className="flex items-center justify-between">
            <div className={`w-48 h-6 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`} />
            <div className={`w-12 h-12 rounded-2xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`h-24 rounded-2xl ${theme === 'light' ? 'bg-gray-50' : 'bg-white/[0.02]'}`} />
            <div className={`h-24 rounded-2xl ${theme === 'light' ? 'bg-gray-50' : 'bg-white/[0.02]'}`} />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return <LoadingSkeleton />;
  if (!settings) return null;

  const SettingSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className={`p-10 rounded-[3.5rem] border transition-all duration-500 flex flex-col gap-10 group
      ${theme === 'light' 
        ? 'bg-white border-border-color shadow-sm hover:shadow-2xl hover:border-primary/20' 
        : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl hover:bg-[#121214] hover:border-white/10'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110
            ${theme === 'light' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-primary/20 text-primary border border-primary/20 shadow-[0_0_30px_rgba(95,200,192,0.1)]'}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-primary tracking-tight uppercase">{title}</h3>
            <div className="w-12 h-1.5 bg-primary rounded-full mt-2 group-hover:w-24 transition-all duration-500 opacity-20 group-hover:opacity-100" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {children}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto flex flex-col gap-10 pb-32 pt-4">

      {/* Floating Modern Save Button */}
      <button 
        type="submit"
        disabled={saving}
        className={`fixed bottom-10 right-10 z-[100] h-20 px-12 rounded-[2.5rem] bg-primary text-white font-black text-[15px] 
          shadow-[0_20px_50px_rgba(95,200,192,0.4)] hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 group
          disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed
          ${theme === 'light' ? '' : 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}
      >
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] opacity-60 uppercase tracking-widest mb-1">{t('dashboard.sysop.nav_settings')}</span>
          <span>{saving ? t('auth.loading').toUpperCase() : t('dashboard.btn_save').toUpperCase()}</span>
        </div>
        {saving ? (
          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
      </button>

      {/* Marketplace Fees */}
      <SettingSection title={t('dashboard.settings_marketplace_title') || "Pazaryeri Komisyon ve Ücretler"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4.637 7.123A7.959 7.959 0 0112 4c1.868 0 3.593.639 4.977 1.714" /></svg>}>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_seller_comm')}</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="sellerCommissionRate"
                  value={settings.sellerCommissionRate || 0} 
                  onChange={handleInputChange}
                  className={`w-full h-14 px-6 pr-12 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} 
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_buyer_fee')}</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="buyerServiceFee"
                  value={settings.buyerServiceFee || 0} 
                  onChange={handleInputChange}
                  className={`w-full h-14 px-6 pr-12 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} 
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary">₺</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-text-secondary/5 mx-2" />

          {/* Detailed Commissions Header */}
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-sm font-black text-text-primary uppercase tracking-tight">Detaylı Komisyon Yapısı (JSON)</h3>
              <p className="text-[11px] font-bold text-text-secondary/40 uppercase tracking-widest mt-1">Backend CommissionService ile tam uyumlu yapı</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="px-4 py-2 rounded-xl bg-text-secondary/5 hover:bg-text-secondary/10 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              {showRawJson ? 'Görsel Düzenleyici' : 'Raw JSON Düzenle'}
            </button>
          </div>

          {showRawJson ? (
            <textarea
              className={`w-full h-96 p-6 rounded-3xl outline-none font-mono text-[13px] leading-relaxed border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
              value={JSON.stringify(settings.systemCommissions || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setSettings({ ...settings, systemCommissions: parsed });
                } catch (err) {}
              }}
            />
          ) : (
            <div className="space-y-4">
              {(settings.systemCommissions?.systemCommissions || []).map((comm: any, idx: number) => (
                <div key={idx} className={`p-6 rounded-3xl border transition-all space-y-4 ${theme === 'light' ? 'bg-gray-50/50 border-transparent hover:border-primary/20' : 'bg-white/5 border-transparent hover:border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">
                        {idx + 1}
                      </div>
                      <input 
                        className="bg-transparent border-none font-black text-sm p-0 focus:ring-0 w-48 text-text-primary"
                        value={comm.code}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].code = e.target.value;
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                        placeholder="Komisyon Kodu"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const updated = settings.systemCommissions.systemCommissions.filter((_: any, i: number) => i !== idx);
                        setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-text-secondary/40 hover:text-red-500 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest ml-1">Hedef</label>
                      <select 
                        className={`w-full h-10 px-3 rounded-xl border-none text-[12px] font-bold outline-none ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`}
                        value={comm.target}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].target = e.target.value;
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      >
                        <option value="customer">Alıcı (Customer)</option>
                        <option value="seller">Satıcı (Seller)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest ml-1">Tip</label>
                      <select 
                        className={`w-full h-10 px-3 rounded-xl border-none text-[12px] font-bold outline-none ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`}
                        value={comm.type}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].type = e.target.value;
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      >
                        <option value="percentage">Yüzde (%)</option>
                        <option value="fixed">Sabit (TL)</option>
                        <option value="tiered_percentage">Kademeli Yüzde</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest ml-1">Değer / Oran</label>
                      <input 
                        type="number"
                        className={`w-full h-10 px-3 rounded-xl border-none text-[12px] font-bold outline-none ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`}
                        value={comm.value}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].value = parseFloat(e.target.value);
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest ml-1">Koruma ile Birleştir</label>
                      <div className="flex items-center h-10 px-3">
                        <input 
                          type="checkbox"
                          checked={comm.mergeWithBuyerProtection}
                          onChange={(e) => {
                            const updated = [...settings.systemCommissions.systemCommissions];
                            updated[idx].mergeWithBuyerProtection = e.target.checked;
                            setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                          }}
                          className="w-5 h-5 rounded-md text-primary focus:ring-primary/20 border-text-secondary/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest ml-1">Görünen Ad (TR)</label>
                      <input 
                        className={`w-full h-10 px-3 rounded-xl border-none text-[12px] font-bold outline-none ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`}
                        value={comm.displayedName?.tr}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].displayedName = { ...updated[idx].displayedName, tr: e.target.value };
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest ml-1">Görünen Ad (EN)</label>
                      <input 
                        className={`w-full h-10 px-3 rounded-xl border-none text-[12px] font-bold outline-none ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`}
                        value={comm.displayedName?.en}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].displayedName = { ...updated[idx].displayedName, en: e.target.value };
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary/30 uppercase tracking-widest ml-1">Görünen Ad (FR)</label>
                      <input 
                        className={`w-full h-10 px-3 rounded-xl border-none text-[12px] font-bold outline-none ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`}
                        value={comm.displayedName?.fr}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].displayedName = { ...updated[idx].displayedName, fr: e.target.value };
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                  </div>

                  {comm.type === 'tiered_percentage' && (
                    <div className={`p-4 rounded-2xl space-y-3 ${theme === 'light' ? 'bg-white/40' : 'bg-black/20'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Kademeler (Tiers)</span>
                        <button 
                          type="button"
                          onClick={() => {
                            const updated = [...settings.systemCommissions.systemCommissions];
                            updated[idx].tiers = [...(updated[idx].tiers || []), { min: 0, max: null, value: 0 }];
                            setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                          }}
                          className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                        >
                          + Kademe Ekle
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(comm.tiers || []).map((tier: any, tIdx: number) => (
                          <div key={tIdx} className="grid grid-cols-4 gap-3 items-end">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-text-secondary/30 uppercase">Min</label>
                              <input type="number" className={`w-full h-8 px-2 rounded-lg border-none text-[11px] font-bold ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`} value={tier.min} onChange={(e) => {
                                const updated = [...settings.systemCommissions.systemCommissions];
                                updated[idx].tiers[tIdx].min = parseFloat(e.target.value);
                                setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                              }}/>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-text-secondary/30 uppercase">Max</label>
                              <input type="number" className={`w-full h-8 px-2 rounded-lg border-none text-[11px] font-bold ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`} value={tier.max || ''} onChange={(e) => {
                                const updated = [...settings.systemCommissions.systemCommissions];
                                updated[idx].tiers[tIdx].max = e.target.value === '' ? null : parseFloat(e.target.value);
                                setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                              }}/>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-text-secondary/30 uppercase">Oran (%)</label>
                              <input type="number" className={`w-full h-8 px-2 rounded-lg border-none text-[11px] font-bold ${theme === 'light' ? 'bg-white' : 'bg-white/10'}`} value={tier.value} onChange={(e) => {
                                const updated = [...settings.systemCommissions.systemCommissions];
                                updated[idx].tiers[tIdx].value = parseFloat(e.target.value);
                                setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                              }}/>
                            </div>
                            <button type="button" onClick={() => {
                              const updated = [...settings.systemCommissions.systemCommissions];
                              updated[idx].tiers = updated[idx].tiers.filter((_: any, i: number) => i !== tIdx);
                              setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                            }} className="h-8 text-red-500 hover:bg-red-500/10 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button 
                type="button"
                onClick={() => {
                  const newComm = {
                    code: 'NEW_COMMISSION',
                    target: 'customer',
                    type: 'percentage',
                    value: 0,
                    mergeWithBuyerProtection: true,
                    displayedName: { tr: '', en: '', fr: '' }
                  };
                  const updated = [...(settings.systemCommissions?.systemCommissions || []), newComm];
                  setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                }}
                className={`w-full py-4 border-2 border-dashed rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all ${theme === 'light' ? 'border-gray-200 text-gray-400 hover:border-primary/20 hover:text-primary' : 'border-white/5 text-white/20 hover:border-white/20 hover:text-white'}`}
              >
                + Yeni Komisyon Kuralı Ekle
              </button>
            </div>
          )}
        </div>
      </SettingSection>

      {/* Limits & Logic */}
      <SettingSection title={t('dashboard.settings_limits_title') || "Limitler ve Otomasyon"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_min_withdraw')}</label>
          <input type="number" name="minWithdrawalLimit" value={settings.minWithdrawalLimit || 0} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_max_images')}</label>
          <input type="number" name="maxListingImages" value={settings.maxListingImages || 0} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/10">
           <div>
             <h4 className="text-[14px] font-black text-text-primary">{t('dashboard.settings_auto_approve')}</h4>
             <p className="text-[11px] font-bold text-text-secondary opacity-60">{t('dashboard.settings_auto_approve_desc')}</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="autoApproveProducts" checked={settings.autoApproveProducts || false} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </SettingSection>

      {/* App Versions */}
      <SettingSection title={t('dashboard.settings_app_versions_title') || "Uygulama Versiyon Kontrolü"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_android_ver')}</label>
          <input type="text" name="appVersionAndroid" value={settings.appVersionAndroid || ""} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_ios_ver')}</label>
          <input type="text" name="appVersionIos" value={settings.appVersionIos || ""} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
           <div>
             <h4 className="text-[14px] font-black text-text-primary">{t('dashboard.settings_force_update')}</h4>
             <p className="text-[11px] font-bold text-text-secondary opacity-60">{t('dashboard.settings_force_update_desc')}</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="forceUpdate" checked={settings.forceUpdate || false} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </SettingSection>

      {/* Maintenance & Support */}
      <SettingSection title={t('dashboard.settings_support_title') || "Bakım ve Destek"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_support_email')}</label>
          <input type="email" name="supportEmail" value={settings.supportEmail || ""} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_support_phone')}</label>
          <input type="text" name="supportPhone" value={settings.supportPhone || ""} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
           <div>
             <h4 className="text-[14px] font-black text-text-primary">{t('dashboard.settings_maintenance')}</h4>
             <p className="text-[11px] font-bold text-text-secondary opacity-60">{t('dashboard.settings_maintenance_desc')}</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode || false} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>
      </SettingSection>
    </form>
  );
}
