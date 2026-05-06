"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../../lib/api";

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
        setSettings(data.payload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  if (loading) return <div className="p-20 text-center font-black opacity-20 animate-pulse tracking-widest text-2xl">LOADING SYSTEM CONFIG...</div>;

  const SettingSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col gap-8
      ${theme === 'light' 
        ? 'bg-white border-border-color shadow-sm' 
        : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-text-primary tracking-tight uppercase">{title}</h3>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'light' ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-primary border border-primary/20'}`}>
          {icon}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {children}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
      {/* Save Floating Bar */}
      <div className={`sticky top-6 z-[100] p-4 rounded-[2.5rem] border flex items-center justify-between backdrop-blur-2xl transition-all duration-300
        ${theme === 'light' ? 'bg-white/80 border-border-color shadow-xl' : 'bg-[#121214]/80 border-white/5 shadow-2xl shadow-black'}`}>
        <div className="flex items-center gap-4 ml-4">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           </div>
           <div>
             <h2 className="text-[14px] font-black text-text-primary tracking-tight">{t('dashboard.sysop.nav_settings')}</h2>
             <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('dashboard.nav_admin_settings_desc')}</p>
           </div>
        </div>
        <button 
          type="submit"
          disabled={saving}
          className="h-12 px-10 rounded-2xl bg-primary text-white font-black text-[13px] shadow-lg shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          {t('dashboard.btn_save').toUpperCase()}
        </button>
      </div>

      {/* Marketplace Fees */}
      <SettingSection title="Pazaryeri Komisyon ve Ücretler" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4.637 7.123A7.959 7.959 0 0112 4c1.868 0 3.593.639 4.977 1.714" /></svg>}>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">Satıcı Komisyon Oranı (%)</label>
          <div className="relative">
            <input type="number" name="sellerCommissionRate" value={settings.sellerCommissionRate} onChange={handleInputChange} className={`w-full h-14 px-6 pr-12 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">Alıcı Hizmet Bedeli (Sabit)</label>
          <div className="relative">
            <input type="number" name="buyerServiceFee" value={settings.buyerServiceFee} onChange={handleInputChange} className={`w-full h-14 px-6 pr-12 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary">₺</span>
          </div>
        </div>
      </SettingSection>

      {/* Limits & Logic */}
      <SettingSection title="Limitler ve Otomasyon" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">Minimum Çekim Limiti (₺)</label>
          <input type="number" name="minWithdrawalLimit" value={settings.minWithdrawalLimit} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">İlan Başına Max Resim</label>
          <input type="number" name="maxListingImages" value={settings.maxListingImages} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/10">
           <div>
             <h4 className="text-[14px] font-black text-text-primary">İlanları Otomatik Onayla</h4>
             <p className="text-[11px] font-bold text-text-secondary opacity-60">Aktif edilirse yeni ilanlar kontrol edilmeden yayına alınır.</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="autoApproveProducts" checked={settings.autoApproveProducts} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </SettingSection>

      {/* App Versions */}
      <SettingSection title="Uygulama Versiyon Kontrolü" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">Android Versiyon</label>
          <input type="text" name="appVersionAndroid" value={settings.appVersionAndroid} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">iOS Versiyon</label>
          <input type="text" name="appVersionIos" value={settings.appVersionIos} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
           <div>
             <h4 className="text-[14px] font-black text-text-primary">Zorunlu Güncelleme (Force Update)</h4>
             <p className="text-[11px] font-bold text-text-secondary opacity-60">Aktif edilirse kullanıcılar uygulamayı güncellemeden devam edemez.</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="forceUpdate" checked={settings.forceUpdate} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </SettingSection>

      {/* Maintenance & Support */}
      <SettingSection title="Bakım ve Destek" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">Destek E-Posta</label>
          <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">Destek Telefon</label>
          <input type="text" name="supportPhone" value={settings.supportPhone} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
           <div>
             <h4 className="text-[14px] font-black text-text-primary">Bakım Modu (Maintenance Mode)</h4>
             <p className="text-[11px] font-bold text-text-secondary opacity-60">Aktif edilirse tüm uygulama "Bakımdayız" moduna geçer.</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleInputChange} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>
      </SettingSection>
    </form>
  );
}
