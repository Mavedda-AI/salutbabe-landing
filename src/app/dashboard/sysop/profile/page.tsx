"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

export default function ProfilePage() {
  const { t, theme, toggleTheme, language, setLanguage } = useThemeLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'preferences' | 'security'>('overview');

  // Form states
  const [formData, setFormData] = useState({
    userName: "",
    userSurname: "",
    userNickname: "",
    eMail: "",
    phoneNumber: ""
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      setFormData({
        userName: parsedUser.userName || "",
        userSurname: parsedUser.userSurname || "",
        userNickname: parsedUser.userNickname || "",
        eMail: parsedUser.eMail || "",
        phoneNumber: parsedUser.phoneNumber || ""
      });
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/auth/profile/update"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
        setUser({ ...user, ...formData });
        alert(t('dashboard.profile_updated') || "Profil güncellendi");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black opacity-20 animate-pulse">{t('dashboard.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-20">
      {/* Header Profile Card */}
      <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden relative
        ${theme === 'light' 
          ? 'bg-white border-border-color shadow-sm' 
          : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className={`w-28 h-28 rounded-[2.2rem] flex items-center justify-center font-black text-3xl transition-all duration-500 group-hover:scale-105 border-4
              ${theme === 'light' ? 'bg-primary/10 text-primary border-white shadow-xl' : 'bg-primary/20 text-primary border-[#121214] shadow-2xl shadow-primary/10'}`}>
              {formData.userName?.[0] || formData.eMail?.[0]?.toUpperCase() || "?"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-text-primary tracking-tighter mb-2">{formData.userName} {formData.userSurname}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {(Array.isArray(user?.userType) ? user.userType : [user?.userType]).map((role: any, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                        {t('dashboard.role_' + (role?.toLowerCase() || 'user'))}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="relative flex items-center gap-1 mt-10 p-1 rounded-2xl bg-black/5 dark:bg-white/5 max-w-fit">
          {[
            { id: 'overview', label: t('dashboard.tab_overview'), icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
            { id: 'preferences', label: t('dashboard.tab_preferences'), icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
            { id: 'security', label: t('dashboard.tab_security'), icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 h-11 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-10 rounded-[3rem] border transition-all duration-500
              ${theme === 'light' 
                ? 'bg-white border-border-color shadow-sm' 
                : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_first_name')}</label>
                    <input type="text" name="userName" value={formData.userName} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_last_name')}</label>
                    <input type="text" name="userSurname" value={formData.userSurname} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_nickname')}</label>
                    <input type="text" name="userNickname" value={formData.userNickname} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_phone')}</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`} />
                  </div>
                  <div className="md:col-span-2 space-y-2 opacity-60">
                    <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_email')}</label>
                    <input type="email" name="eMail" value={formData.eMail} disabled className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black border cursor-not-allowed ${theme === 'light' ? 'bg-gray-100 border-transparent' : 'bg-white/5 border-transparent'}`} />
                    <p className="text-[10px] font-bold text-text-secondary ml-1 italic">{t('dashboard.email_not_editable')}</p>
                  </div>
                </div>

                <button type="submit" disabled={saving} className={`w-full h-16 rounded-[1.5rem] bg-primary text-white font-black text-[15px] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${saving ? 'opacity-70 cursor-wait' : ''}`}>
                  {saving ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{t('dashboard.btn_save_profile')}</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col gap-8
              ${theme === 'light' 
                ? 'bg-white border-border-color shadow-sm' 
                : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
               
               <div className="flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <div>
                    <h4 className="text-[14px] font-black text-text-primary uppercase tracking-tight">{t('dashboard.pref_theme')}</h4>
                    <p className="text-[11px] font-bold text-text-secondary opacity-60 uppercase tracking-widest">{theme === 'light' ? t('dashboard.theme_light') : t('dashboard.theme_dark')}</p>
                  </div>
                  <button onClick={toggleTheme} className={`w-14 h-8 rounded-full relative transition-all duration-300 ${theme === 'light' ? 'bg-gray-200' : 'bg-primary'}`}>
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-md flex items-center justify-center
                      ${theme === 'light' ? 'left-1' : 'left-7'}`}>
                      {theme === 'light' 
                        ? <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" /></svg>
                        : <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                    </div>
                  </button>
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.pref_language')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'tr', label: 'TÜRKÇE', flag: '🇹🇷' },
                      { id: 'en', label: 'ENGLISH', flag: '🇺🇸' },
                      { id: 'fr', label: 'FRANÇAIS', flag: '🇫🇷' }
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id as any)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group
                          ${language === lang.id 
                            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' 
                            : 'bg-transparent border-border-color hover:border-primary/20 hover:bg-primary/5'}`}
                      >
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{lang.flag}</span>
                        <span className={`text-[11px] font-black tracking-widest ${language === lang.id ? 'text-primary' : 'text-text-secondary'}`}>{lang.label}</span>
                      </button>
                    ))}
                  </div>
               </div>
             </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-10 rounded-[3rem] border transition-all duration-500
              ${theme === 'light' 
                ? 'bg-white border-border-color shadow-sm' 
                : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
              
              <div className="flex items-center justify-between mb-10">
                 <div>
                   <h3 className="text-2xl font-black text-text-primary tracking-tight mb-2 uppercase">{t('dashboard.security_settings')}</h3>
                   <p className="text-[13px] font-bold text-text-secondary/60 italic">{t('dashboard.security_desc')}</p>
                 </div>
                 <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${theme === 'light' ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-500/20 text-orange-500 border border-orange-500/20 shadow-xl'}`}>
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                <button className={`w-full h-16 rounded-[1.2rem] font-black text-[14px] border transition-all flex items-center justify-center gap-3 group
                  ${theme === 'light' ? 'bg-gray-50 border-gray-100 text-text-primary hover:bg-gray-100 hover:border-gray-200' : 'bg-white/5 border-white/5 text-text-primary hover:bg-white/10 hover:border-white/10 shadow-lg'}`}>
                   <svg className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                   {t('dashboard.btn_change_password')}
                </button>
                <div className={`p-6 rounded-2xl border ${theme === 'light' ? 'bg-red-500/5 border-red-500/10' : 'bg-red-500/10 border-red-500/10'} mt-4`}>
                   <h4 className="text-[13px] font-black text-red-500 uppercase tracking-widest mb-1">{t('dashboard.delete_account')}</h4>
                   <p className="text-[11px] font-bold text-text-secondary opacity-60 uppercase tracking-widest mb-4">{t('dashboard.delete_account_desc')}</p>
                   <button className="text-[11px] font-black text-white bg-red-500 px-6 py-2 rounded-lg hover:bg-red-600 transition-all uppercase tracking-widest shadow-lg shadow-red-500/20">{t('dashboard.btn_close_account')}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
