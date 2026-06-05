"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

export default function SystemSettingsPage() {
  const { t } = useThemeLanguage();
  const [settings, setSettings] = useState<any>({
    sellerCommissionRate: 0,
    buyerServiceFee: 0,
    minWithdrawalLimit: 0,
    maxListingImages: 0,
    autoApproveProducts: false,
    appVersionAndroid: '',
    appVersionIos: '',
    forceUpdate: false,
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
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/admin/settings"), {
        headers: {
          "Authorization": `Bearer ${token}`
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
        alert(t('dashboard.settings_updated') || "Sistem ayarları güncellendi");
      } else {
        alert(data.request?.resultMessage || "Güncelleme sırasında bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Sunucuyla bağlantı kurulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-20 pt-6 animate-pulse px-4 lg:px-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-[#1A1D27] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" />
            <div className="w-48 h-6 bg-gray-100 dark:bg-gray-800 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-gray-50 dark:bg-[#12141C] rounded-xl" />
            <div className="h-12 bg-gray-50 dark:bg-[#12141C] rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return <LoadingSkeleton />;
  if (!settings) return null;

  const SettingSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-[#1A1D27] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B00]/10 to-[#FF8B30]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-black text-[#1A2332] dark:text-white tracking-tight">{title}</h3>
          <div className="w-8 h-1.5 bg-gradient-to-r from-[#FF6B00] to-[#5FC8C0] rounded-full mt-1.5 opacity-50 group-hover:w-16 transition-all duration-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto flex flex-col gap-6 pb-32 pt-6 px-4 lg:px-8">

      {/* Floating Modern Save Button */}
      <button 
        type="submit"
        disabled={saving}
        className="fixed bottom-8 right-8 lg:bottom-10 lg:right-10 z-[100] h-16 px-8 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8B30] text-white font-black text-[14px] shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 group disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] opacity-80 uppercase tracking-widest mb-1">{t('dashboard.sysop.nav_settings') || 'Ayarlar'}</span>
          <span>{saving ? t('auth.loading')?.toUpperCase() || 'KAYDEDİLİYOR...' : t('dashboard.btn_save')?.toUpperCase() || 'KAYDET'}</span>
        </div>
        {saving ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
      </button>

      {/* Marketplace Fees */}
      <SettingSection title={t('dashboard.settings_marketplace_title') || "Pazaryeri Komisyon ve Ücretler"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4.637 7.123A7.959 7.959 0 0112 4c1.868 0 3.593.639 4.977 1.714" /></svg>}>
        <div className="flex flex-col gap-6 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_seller_comm') || 'Satıcı Komisyon Oranı (%)'}</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="sellerCommissionRate"
                  value={settings.sellerCommissionRate || 0} 
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 pr-10 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#FF6B00]">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_buyer_fee') || 'Alıcı Hizmet Bedeli (Sabit)'}</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="buyerServiceFee"
                  value={settings.buyerServiceFee || 0} 
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 pr-10 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#FF6B00]">₺</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

          {/* Detailed Commissions Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[14px] font-bold text-[#1A2332] dark:text-white">Detaylı Komisyon Yapısı</h3>
              <p className="text-[12px] font-medium text-gray-500 mt-1">Gelişmiş komisyon yapılandırması (JSON / Görsel)</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[12px] font-bold text-gray-700 dark:text-gray-300 transition-colors shrink-0"
            >
              {showRawJson ? 'Görsel Düzenleyici' : 'Raw JSON Düzenle'}
            </button>
          </div>

          {showRawJson ? (
            <textarea
              className="w-full h-96 p-4 rounded-2xl outline-none font-mono text-[13px] leading-relaxed border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-gray-300 focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]"
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
                <div key={idx} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#12141C]/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center font-bold text-[13px] shrink-0">
                        {idx + 1}
                      </div>
                      <input 
                        className="bg-transparent border-none font-bold text-[14px] p-0 focus:ring-0 w-full text-[#1A2332] dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                        value={comm.code}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].code = e.target.value;
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                        placeholder="Komisyon Kodu (Örn: VIRTUAL_POS)"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const updated = settings.systemCommissions.systemCommissions.filter((_: any, i: number) => i !== idx);
                        setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                      }}
                      className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Hedef</label>
                      <select 
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[13px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
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
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Tip</label>
                      <select 
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[13px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
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
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Değer / Oran</label>
                      <input 
                        type="number"
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[13px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
                        value={comm.value}
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].value = parseFloat(e.target.value);
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-center">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Koruma ile Birleştir</label>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input 
                          type="checkbox"
                          checked={comm.mergeWithBuyerProtection}
                          onChange={(e) => {
                            const updated = [...settings.systemCommissions.systemCommissions];
                            updated[idx].mergeWithBuyerProtection = e.target.checked;
                            setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF6B00]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Görünen Ad (TR)</label>
                      <input 
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[13px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
                        value={comm.displayedName?.tr || ''}
                        placeholder="Örn: Alıcı Koruması"
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].displayedName = { ...updated[idx].displayedName, tr: e.target.value };
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Görünen Ad (EN)</label>
                      <input 
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[13px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
                        value={comm.displayedName?.en || ''}
                        placeholder="e.g. Buyer Protection"
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].displayedName = { ...updated[idx].displayedName, en: e.target.value };
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Grup (İsteğe Bağlı)</label>
                      <input 
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] text-[13px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]"
                        value={comm.displayGroup || ''}
                        placeholder="Örn: BUYER_PROTECTION"
                        onChange={(e) => {
                          const updated = [...settings.systemCommissions.systemCommissions];
                          updated[idx].displayGroup = e.target.value || null;
                          setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                        }}
                      />
                    </div>
                  </div>

                  {comm.type === 'tiered_percentage' && (
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1D27] space-y-4 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#1A2332] dark:text-white">Kademeler (Tiers)</span>
                        <button 
                          type="button"
                          onClick={() => {
                            const updated = [...settings.systemCommissions.systemCommissions];
                            updated[idx].tiers = [...(updated[idx].tiers || []), { min: 0, max: null, value: 0 }];
                            setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                          }}
                          className="text-[12px] font-bold text-[#FF6B00] hover:text-[#FF8B30] transition-colors"
                        >
                          + Kademe Ekle
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(comm.tiers || []).map((tier: any, tIdx: number) => (
                          <div key={tIdx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Min</label>
                              <input type="number" className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[12px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]" value={tier.min} onChange={(e) => {
                                const updated = [...settings.systemCommissions.systemCommissions];
                                updated[idx].tiers[tIdx].min = parseFloat(e.target.value);
                                setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                              }}/>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Max</label>
                              <input type="number" className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[12px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]" value={tier.max || ''} onChange={(e) => {
                                const updated = [...settings.systemCommissions.systemCommissions];
                                updated[idx].tiers[tIdx].max = e.target.value === '' ? null : parseFloat(e.target.value);
                                setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                              }}/>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Oran (%)</label>
                              <input type="number" className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[12px] font-semibold text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B00]" value={tier.value} onChange={(e) => {
                                const updated = [...settings.systemCommissions.systemCommissions];
                                updated[idx].tiers[tIdx].value = parseFloat(e.target.value);
                                setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                              }}/>
                            </div>
                            <button type="button" onClick={() => {
                              const updated = [...settings.systemCommissions.systemCommissions];
                              updated[idx].tiers = updated[idx].tiers.filter((_: any, i: number) => i !== tIdx);
                              setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                            }} className="w-9 h-9 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors">
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
                    code: 'YENI_KOMISYON',
                    target: 'customer',
                    type: 'percentage',
                    value: 0,
                    displayGroup: null,
                    mergeWithBuyerProtection: true,
                    displayedName: { tr: '', en: '', fr: '' }
                  };
                  const updated = [...(settings.systemCommissions?.systemCommissions || []), newComm];
                  setSettings({ ...settings, systemCommissions: { ...settings.systemCommissions, systemCommissions: updated } });
                }}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#FF6B00] dark:hover:border-[#FF6B00] text-gray-500 dark:text-gray-400 hover:text-[#FF6B00] text-[13px] font-bold transition-colors"
              >
                + Yeni Komisyon Ekle
              </button>
            </div>
          )}
        </div>
      </SettingSection>

      {/* Limits & Logic */}
      <SettingSection title={t('dashboard.settings_limits_title') || "Limitler ve Otomasyon"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_min_withdraw') || 'Min. Çekim Tutarı'}</label>
          <input type="number" name="minWithdrawalLimit" value={settings.minWithdrawalLimit || 0} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_max_images') || 'Max Ürün Görsel Sayısı'}</label>
          <input type="number" name="maxListingImages" value={settings.maxListingImages || 0} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-5 rounded-2xl bg-[#FF6B00]/5 border border-[#FF6B00]/20">
           <div>
             <h4 className="text-[14px] font-bold text-[#1A2332] dark:text-white">{t('dashboard.settings_auto_approve') || 'Ürünleri Otomatik Onayla'}</h4>
             <p className="text-[12px] font-medium text-gray-500 mt-1">{t('dashboard.settings_auto_approve_desc') || 'Yüklenen ürünler admin onayı olmadan otomatik yayınlanır'}</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input type="checkbox" name="autoApproveProducts" checked={settings.autoApproveProducts || false} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF6B00]"></div>
          </label>
        </div>
      </SettingSection>

      {/* App Versions */}
      <SettingSection title={t('dashboard.settings_app_versions_title') || "Uygulama Versiyon Kontrolü"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_android_ver') || 'Android Sürümü'}</label>
          <input type="text" name="appVersionAndroid" value={settings.appVersionAndroid || ""} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_ios_ver') || 'iOS Sürümü'}</label>
          <input type="text" name="appVersionIos" value={settings.appVersionIos || ""} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
           <div>
             <h4 className="text-[14px] font-bold text-[#1A2332] dark:text-white">{t('dashboard.settings_force_update') || 'Zorunlu Güncelleme'}</h4>
             <p className="text-[12px] font-medium text-gray-500 mt-1">{t('dashboard.settings_force_update_desc') || 'Kullanıcıların uygulamayı güncellemelerini zorunlu kılar'}</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input type="checkbox" name="forceUpdate" checked={settings.forceUpdate || false} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
          </label>
        </div>
      </SettingSection>

      {/* Maintenance & Support */}
      <SettingSection title={t('dashboard.settings_support_title') || "Bakım ve Destek"} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_support_email') || 'Destek E-Posta'}</label>
          <input type="email" name="supportEmail" value={settings.supportEmail || ""} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 ml-1">{t('dashboard.settings_support_phone') || 'Destek Telefonu'}</label>
          <input type="text" name="supportPhone" value={settings.supportPhone || ""} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl outline-none font-bold transition-all border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#12141C] text-[#1A2332] dark:text-white focus:bg-white dark:focus:bg-[#1A1D27] focus:border-[#FF6B00] dark:focus:border-[#FF6B00]" />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-5 rounded-2xl bg-orange-500/5 border border-orange-500/20">
           <div>
             <h4 className="text-[14px] font-bold text-[#1A2332] dark:text-white">{t('dashboard.settings_maintenance') || 'Bakım Modu'}</h4>
             <p className="text-[12px] font-medium text-gray-500 mt-1">{t('dashboard.settings_maintenance_desc') || 'Sistemi bakım moduna alır, normal kullanıcılar giriş yapamaz'}</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode || false} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </SettingSection>
    </form>
  );
}
