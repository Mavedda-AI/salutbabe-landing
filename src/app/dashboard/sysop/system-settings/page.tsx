"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

export default function SystemSettingsPage() {
  const { t, theme } = useThemeLanguage();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [settings, setSettings] = useState<any>({
    minWithdrawalLimit: 0,
    maxListingImages: 0,
    autoApproveProducts: false,
    appVersionAndroid: '',
    appVersionIos: '',
    forceUpdate: false,
    maintenanceMode: false,
    supportEmail: '',
    supportPhone: '',
    systemCommissions: []
  });
  const [showRawJson, setShowRawJson] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialSettings, setInitialSettings] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialSettings && settings) {
      setIsDirty(JSON.stringify(initialSettings) !== JSON.stringify(settings));
    }
  }, [settings, initialSettings]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/admin/settings"), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        const payload = data.payload || {};
        if (payload.systemCommissions && !Array.isArray(payload.systemCommissions)) {
          payload.systemCommissions = payload.systemCommissions.systemCommissions || [];
        }
        setSettings(payload);
        setInitialSettings(payload);
      } else {
        setSettings({});
        setInitialSettings({});
      }
    } catch (err) {
      console.error(err);
      setSettings({});
      setInitialSettings({});
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
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/admin/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        // Optional: show a nice toast instead of alert if a toast system exists
        alert(t('dashboard.settings_updated') || "Sistem ayarları başarıyla güncellendi.");
        setInitialSettings(settings);
      } else {
        alert(data.request?.resultMessage || "Güncelleme sırasında bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Ayarlar güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "marketplace", label: "Pazaryeri & Komisyon", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, desc: "Komisyon oranları ve gelişmiş kural yapılandırmaları" },
    { id: "limits", label: "Limitler & Otomasyon", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>, desc: "Para çekme limitleri ve otomatik ürün onayı" },
    { id: "mobile", label: "Mobil Uygulama", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, desc: "Uygulama versiyonları ve zorunlu güncellemeler" },
    { id: "support", label: "Bakım & Destek", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, desc: "İletişim kanalları ve bakım modu yönetimi" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8 flex gap-8 animate-pulse">
        <div className="w-1/4 hidden lg:block space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
          <div className="h-12 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-full" />
          <div className="h-12 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-full" />
        </div>
        <div className="w-full lg:w-3/4 space-y-8">
          <div className="h-40 bg-gray-100 dark:bg-[#1A1D27] rounded-[2rem] w-full" />
          <div className="h-64 bg-gray-100 dark:bg-[#1A1D27] rounded-[2rem] w-full" />
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 pb-32">


      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-start p-4 rounded-2xl transition-all duration-300 text-left border ${
                  isActive 
                    ? "bg-white dark:bg-[#1A1D27] border-[#FF6B00]/30 shadow-[0_10px_30px_rgba(255,107,0,0.1)] translate-x-2" 
                    : "border-transparent hover:bg-white/50 dark:hover:bg-white/5 text-gray-500 hover:text-[#1A2332] dark:hover:text-white"
                }`}
              >
                <div className={`flex items-center gap-3 font-bold text-[14px] ${isActive ? "text-[#FF6B00]" : ""}`}>
                  <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-[#FF6B00]/10 text-[#FF6B00]" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </div>
                {isActive && (
                  <p className="text-[12px] font-medium text-gray-500 mt-3 leading-relaxed ml-1 animate-fade-in-up">
                    {tab.desc}
                  </p>
                )}
              </button>
            );
          })}
          
          {isDirty && (
            <div className="mt-4 animate-fade-in-up">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-2xl font-black text-[14px] shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,107,0,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Değişiklikleri Kaydet</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="w-full flex-1 min-w-0 transition-all duration-500">
          
          {/* PAZARYERI TAB */}
          <div className={`${activeTab === 'marketplace' ? 'block animate-fade-in' : 'hidden'}`}>
            <div className="space-y-8">


              {/* Detailed Commissions Card */}
              <div className="bg-white dark:bg-[#1A1D27] rounded-[2rem] p-6 lg:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#5FC8C0] to-[#3B82F6] opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A2332] dark:text-white">Gelişmiş Komisyon Yapısı</h3>
                    <p className="text-[13px] font-medium text-gray-500 mt-1">VPOS, Özel Kategori veya Kademeli oranlar (Tiered) yapılandırın.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#12141C] dark:hover:bg-white/5 border border-gray-200 dark:border-gray-800 text-[12px] font-bold text-gray-700 dark:text-gray-300 transition-all shrink-0"
                  >
                    {showRawJson ? 'Görsel Arayüze Dön' : 'JSON Olarak Düzenle'}
                  </button>
                </div>

                {showRawJson ? (
                  <div className="relative group/textarea">
                    <textarea
                      className="w-full h-96 p-6 rounded-2xl outline-none font-mono text-[13px] leading-relaxed border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-gray-300 focus:bg-white dark:focus:bg-[#161821] focus:ring-4 focus:ring-[#FF6B00]/10 focus:border-[#FF6B00] transition-all resize-y"
                      value={JSON.stringify(settings.systemCommissions || [], null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setSettings({ ...settings, systemCommissions: parsed });
                        } catch (err) {}
                      }}
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 font-mono pointer-events-none">Format: JSON Array</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(settings.systemCommissions || []).map((group: any, gIdx: number) => (
                      <div key={gIdx} className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1D27] space-y-6">
                        {/* Group Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-4">
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white flex items-center justify-center font-black text-[14px] shadow-sm shrink-0">
                              {gIdx + 1}
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">Türkçe İsim</label>
                                  <input 
                                    className="w-full bg-gray-50 dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 font-bold text-[14px] text-[#1A2332] dark:text-white outline-none focus:border-[#3B82F6]"
                                    value={group.groupName?.tr || ''}
                                    onChange={(e) => {
                                      const updated = [...settings.systemCommissions];
                                      updated[gIdx].groupName = { ...updated[gIdx].groupName, tr: e.target.value };
                                      setSettings({ ...settings, systemCommissions: updated });
                                    }}
                                    placeholder="Örn: Alıcı Koruması"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">İngilizce İsim</label>
                                  <input 
                                    className="w-full bg-gray-50 dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 font-bold text-[14px] text-[#1A2332] dark:text-white outline-none focus:border-[#3B82F6]"
                                    value={group.groupName?.en || ''}
                                    onChange={(e) => {
                                      const updated = [...settings.systemCommissions];
                                      updated[gIdx].groupName = { ...updated[gIdx].groupName, en: e.target.value };
                                      setSettings({ ...settings, systemCommissions: updated });
                                    }}
                                    placeholder="Örn: Buyer Protection"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">Fransızca İsim</label>
                                  <input 
                                    className="w-full bg-gray-50 dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 font-bold text-[14px] text-[#1A2332] dark:text-white outline-none focus:border-[#3B82F6]"
                                    value={group.groupName?.fr || ''}
                                    onChange={(e) => {
                                      const updated = [...settings.systemCommissions];
                                      updated[gIdx].groupName = { ...updated[gIdx].groupName, fr: e.target.value };
                                      setSettings({ ...settings, systemCommissions: updated });
                                    }}
                                    placeholder="Örn: Protection Acheteur"
                                  />
                                </div>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const updated = settings.systemCommissions.filter((_: any, i: number) => i !== gIdx);
                              setSettings({ ...settings, systemCommissions: updated });
                            }}
                            className="ml-4 w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shrink-0"
                            title="Grubu Sil"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        {/* Rules inside Group */}
                        <div className="pl-6 md:pl-10 space-y-4 border-l-2 border-gray-100 dark:border-gray-800/80">
                          <h4 className="text-[13px] font-bold text-[#1A2332] dark:text-white mb-2">Grup İçindeki Kurallar</h4>
                          
                          {(group.items || []).map((rule: any, rIdx: number) => (
                            <div key={rIdx} className="relative p-4 pt-8 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C]/50 space-y-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                              <button 
                                type="button"
                                onClick={() => {
                                  const updated = [...settings.systemCommissions];
                                  updated[gIdx].items = updated[gIdx].items.filter((_: any, i: number) => i !== rIdx);
                                  setSettings({ ...settings, systemCommissions: updated });
                                }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shrink-0"
                                title="Kuralı Sil"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-gray-500">Hedef (Kimden?)</label>
                                  <select 
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[12px] font-bold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
                                    value={rule.target || 'customer'}
                                    onChange={(e) => {
                                      const updated = [...settings.systemCommissions];
                                      updated[gIdx].items[rIdx].target = e.target.value;
                                      setSettings({ ...settings, systemCommissions: updated });
                                    }}
                                  >
                                    <option value="customer">Alıcı</option>
                                    <option value="seller">Satıcı</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-gray-500">Hesaplama Tipi</label>
                                  <select 
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[12px] font-bold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
                                    value={rule.type}
                                    onChange={(e) => {
                                      const updated = [...settings.systemCommissions];
                                      updated[gIdx].items[rIdx].type = e.target.value;
                                      setSettings({ ...settings, systemCommissions: updated });
                                    }}
                                  >
                                    <option value="percentage">Yüzde (%)</option>
                                    <option value="fixed">Sabit Miktar (TL)</option>
                                    <option value="tiered_percentage">Kademeli Yüzde (Tiered)</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-gray-500">Temel Oran / Değer</label>
                                  <input 
                                    type="number"
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[12px] font-bold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
                                    value={rule.value}
                                    onChange={(e) => {
                                      const updated = [...settings.systemCommissions];
                                      updated[gIdx].items[rIdx].value = parseFloat(e.target.value) || 0;
                                      setSettings({ ...settings, systemCommissions: updated });
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {/* Tiers for rule */}
                              {rule.type === 'tiered_percentage' && (
                                <div className="mt-4 p-4 rounded-xl border border-dashed border-[#FF6B00]/30 bg-[#FF6B00]/5 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-black text-[#FF6B00]">Kademeli Oranlar (Tiers)</span>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const updated = [...settings.systemCommissions];
                                        updated[gIdx].items[rIdx].tiers = [...(updated[gIdx].items[rIdx].tiers || []), { min: 0, max: null, value: 0 }];
                                        setSettings({ ...settings, systemCommissions: updated });
                                      }}
                                      className="text-[11px] font-bold px-3 py-1.5 bg-white dark:bg-[#1A1D27] text-[#FF6B00] rounded-md shadow-sm hover:scale-105 transition-transform"
                                    >
                                      + Kademe
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    {(rule.tiers || []).map((tier: any, tIdx: number) => (
                                      <div key={tIdx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end bg-white dark:bg-[#1A1D27] p-3 rounded-lg border border-gray-100 dark:border-gray-800/80">
                                        <div>
                                          <input type="number" placeholder="Min" className="w-full h-8 px-2 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[12px] outline-none" value={tier.min} onChange={(e) => {
                                            const updated = [...settings.systemCommissions];
                                            updated[gIdx].items[rIdx].tiers[tIdx].min = parseFloat(e.target.value) || 0;
                                            setSettings({ ...settings, systemCommissions: updated });
                                          }}/>
                                        </div>
                                        <div>
                                          <input type="number" placeholder="Max" className="w-full h-8 px-2 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[12px] outline-none" value={tier.max || ''} onChange={(e) => {
                                            const updated = [...settings.systemCommissions];
                                            updated[gIdx].items[rIdx].tiers[tIdx].max = e.target.value === '' ? null : parseFloat(e.target.value);
                                            setSettings({ ...settings, systemCommissions: updated });
                                          }}/>
                                        </div>
                                        <div>
                                          <input type="number" placeholder="%" className="w-full h-8 px-2 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[12px] outline-none" value={tier.value} onChange={(e) => {
                                            const updated = [...settings.systemCommissions];
                                            updated[gIdx].items[rIdx].tiers[tIdx].value = parseFloat(e.target.value) || 0;
                                            setSettings({ ...settings, systemCommissions: updated });
                                          }}/>
                                        </div>
                                        <button type="button" onClick={() => {
                                          const updated = [...settings.systemCommissions];
                                          updated[gIdx].items[rIdx].tiers = updated[gIdx].items[rIdx].tiers.filter((_: any, i: number) => i !== tIdx);
                                          setSettings({ ...settings, systemCommissions: updated });
                                        }} className="w-8 h-8 text-red-500 bg-red-50 dark:bg-red-500/10 rounded flex items-center justify-center">
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
                              const newRule = {
                                code: 'YENI_KURAL',
                                target: 'customer',
                                type: 'percentage',
                                value: 0
                              };
                              const updated = [...settings.systemCommissions];
                              updated[gIdx].items = [...(updated[gIdx].items || []), newRule];
                              setSettings({ ...settings, systemCommissions: updated });
                            }}
                            className="w-full py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-transparent text-gray-500 hover:text-[#FF6B00] hover:border-[#FF6B00] text-[13px] font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Bu Gruba Yeni Kural Ekle
                          </button>
                        </div>
                      </div>
                    ))}

                    <button 
                      type="button"
                      onClick={() => {
                        const newGroup = {
                          groupId: 'YENI_GRUP',
                          groupName: { tr: '', en: '' },
                          items: []
                        };
                        const updated = [...(settings.systemCommissions || []), newGroup];
                        setSettings({ ...settings, systemCommissions: updated });
                      }}
                      className="w-full py-5 rounded-2xl border-2 border-dashed border-[#3B82F6]/30 bg-[#3B82F6]/5 text-[#3B82F6] hover:bg-[#3B82F6]/10 text-[14px] font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Yeni Komisyon Grubu Oluştur
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LIMITS TAB */}
          <div className={`${activeTab === 'limits' ? 'block animate-fade-in' : 'hidden'}`}>
            <div className="bg-white dark:bg-[#1A1D27] rounded-[2rem] p-6 lg:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-bold text-[#1A2332] dark:text-white mb-6">Operasyonel Limitler</h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-400">Min. Çekim Tutarı</label>
                    <div className="relative group/input">
                      <input 
                        type="number" 
                        name="minWithdrawalLimit"
                        value={settings.minWithdrawalLimit || 0} 
                        onChange={handleInputChange}
                        className="w-full h-14 pl-5 pr-12 rounded-2xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#161821] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500" 
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-400 group-focus-within/input:text-purple-500 transition-colors">₺</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Satıcıların bakiyelerinden bankaya çekebilecekleri minimum tutar.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-400">Max Ürün Görsel Sayısı</label>
                    <div className="relative group/input">
                      <input 
                        type="number" 
                        name="maxListingImages"
                        value={settings.maxListingImages || 0} 
                        onChange={handleInputChange}
                        className="w-full h-14 px-5 rounded-2xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#161821] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500" 
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">İlan oluşturulurken eklenebilecek maksimum fotoğraf adedi.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1A2332] dark:text-white">Otomatik Ürün Onayı</h4>
                    <p className="text-[13px] font-medium text-gray-500 mt-1">Yüklenen ürünler yöneticiler onaylamadan direkt olarak canlıya alınır. Güvenilir mağazalar için önerilir.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input type="checkbox" name="autoApproveProducts" checked={settings.autoApproveProducts || false} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE TAB */}
          <div className={`${activeTab === 'mobile' ? 'block animate-fade-in' : 'hidden'}`}>
            <div className="bg-white dark:bg-[#1A1D27] rounded-[2rem] p-6 lg:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-bold text-[#1A2332] dark:text-white mb-6">Sürüm & Güvenlik</h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-400">Android Versiyonu</label>
                    <div className="relative group/input">
                      <input 
                        type="text" 
                        name="appVersionAndroid"
                        value={settings.appVersionAndroid || ""} 
                        onChange={handleInputChange}
                        placeholder="1.0.0"
                        className="w-full h-14 pl-12 pr-5 rounded-2xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#161821] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500" 
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414Z" /><path d="M15.4299 8.24354L17.2625 5.06821C17.4338 4.77154 17.3319 4.39162 17.0353 4.22031C16.7386 4.04899 16.3587 4.15093 16.1874 4.4476L14.3079 7.70347C12.8711 7.04279 11.2384 7.04279 9.80164 7.70347L7.92215 4.4476C7.75084 4.15093 7.37092 4.04899 7.07425 4.22031C6.77758 4.39162 6.67565 4.77154 6.84696 5.06821L8.67957 8.24354C4.19504 10.7412 1.4878 15.3484 1.2583 20.4725H22.8512C22.6217 15.3484 19.9145 10.7412 15.4299 8.24354ZM6.64367 16.5369C5.87784 16.5369 5.25708 15.9161 5.25708 15.1503C5.25708 14.3844 5.87784 13.7637 6.64367 13.7637C7.40951 13.7637 8.03027 14.3844 8.03027 15.1503C8.03027 15.9161 7.40951 16.5369 6.64367 16.5369ZM17.4658 16.5369C16.6999 16.5369 16.0792 15.9161 16.0792 15.1503C16.0792 14.3844 16.6999 13.7637 17.4658 13.7637C18.2316 13.7637 18.8524 14.3844 18.8524 15.1503C18.8524 15.9161 18.2316 16.5369 17.4658 16.5369Z"/></svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-400">iOS Versiyonu</label>
                    <div className="relative group/input">
                      <input 
                        type="text" 
                        name="appVersionIos"
                        value={settings.appVersionIos || ""} 
                        onChange={handleInputChange}
                        placeholder="1.0.0"
                        className="w-full h-14 pl-12 pr-5 rounded-2xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#161821] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500" 
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5746 12.0298C16.5541 9.07639 18.9868 7.64016 19.0988 7.57018C17.7288 5.56901 15.5413 5.25143 14.8194 5.20173C13.2386 5.04277 11.6881 6.13682 10.875 6.13682C10.0514 6.13682 8.7844 5.21208 7.46654 5.23253C5.74836 5.26305 4.1524 6.23259 3.26629 7.7816C1.45524 10.9254 2.8028 15.5714 4.56272 18.1139C5.4208 19.3444 6.4221 20.7341 7.74012 20.6833C8.99684 20.6324 9.48398 19.8631 11.0028 19.8631C12.5113 19.8631 12.9568 20.6833 14.2855 20.6528C15.6548 20.6528 16.5132 19.4261 17.3609 18.1749C18.3512 16.7302 18.7567 15.3161 18.7874 15.245C18.7567 15.2244 16.5951 14.4042 16.5746 12.0298ZM13.8869 3.52841C14.5866 2.68725 15.063 1.50813 14.9304 0.339233C13.9264 0.379815 12.6588 1.00511 11.9383 1.84627C11.3001 2.58557 10.7416 3.79555 10.9038 4.9442C12.0203 5.0357 13.1873 4.36971 13.8869 3.52841Z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1A2332] dark:text-white">Zorunlu Güncelleme Dayatması</h4>
                    <p className="text-[13px] font-medium text-gray-500 mt-1">Eğer aktif edilirse, kullanıcılar uygulamayı en güncel sürüme yükseltmeden giriş yapamazlar.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input type="checkbox" name="forceUpdate" checked={settings.forceUpdate || false} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SUPPORT TAB */}
          <div className={`${activeTab === 'support' ? 'block animate-fade-in' : 'hidden'}`}>
            <div className="bg-white dark:bg-[#1A1D27] rounded-[2rem] p-6 lg:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-bold text-[#1A2332] dark:text-white mb-6">Bakım & Destek Masası</h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-400">Destek E-Posta Adresi</label>
                    <div className="relative group/input">
                      <input 
                        type="email" 
                        name="supportEmail"
                        value={settings.supportEmail || ""} 
                        onChange={handleInputChange}
                        placeholder="destek@salutbabe.com"
                        className="w-full h-14 pl-12 pr-5 rounded-2xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#161821] focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500" 
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-400">Destek Telefon Numarası</label>
                    <div className="relative group/input">
                      <input 
                        type="text" 
                        name="supportPhone"
                        value={settings.supportPhone || ""} 
                        onChange={handleInputChange}
                        placeholder="+90 850 123 45 67"
                        className="w-full h-14 pl-12 pr-5 rounded-2xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#161821] focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500" 
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                  </div>
                </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-red-500/5 border border-red-500/20 gap-4">
                    <div>
                      <h4 className="text-[15px] font-bold text-red-500 dark:text-red-400">🔥 Bakım Modunu Etkinleştir</h4>
                      <p className="text-[13px] font-medium text-gray-500 mt-1 max-w-lg">Sistem bakıma alınır. Uygulama ve web üzerinden erişim kesilir ve kullanıcılara "Bakım Çalışması" ekranı gösterilir.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode || false} onChange={handleInputChange} className="sr-only peer" />
                      <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </form>
    </div>
  );
}
