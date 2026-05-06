"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

export default function SystemSettingsPage() {
  const { t, theme } = useThemeLanguage();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
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
      const token = localStorage.getItem("auth_token");
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
      {/* Dynamic Page Header */}
      <div className="flex flex-col gap-2 mb-6 ml-6">
          <h1 className="text-[32px] font-black text-text-primary tracking-tight uppercase">{t('dashboard.sysop.nav_settings')}</h1>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <p className="text-[13px] font-bold text-text-secondary/60 uppercase tracking-[0.2em]">{t('dashboard.nav_admin_settings_desc')}</p>
          </div>
      </div>

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
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_seller_comm')}</label>
          <div className="relative">
            <input type="number" name="sellerCommissionRate" value={settings.sellerCommissionRate || 0} onChange={handleInputChange} className={`w-full h-14 px-6 pr-12 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.settings_buyer_fee')}</label>
          <div className="relative">
            <input type="number" name="buyerServiceFee" value={settings.buyerServiceFee || 0} onChange={handleInputChange} className={`w-full h-14 px-6 pr-12 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary">₺</span>
          </div>
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
