"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../lib/api";

export default function ProfilePage() {
  const { t, theme, language } = useThemeLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  if (loading) return <div className="p-20 text-center font-black opacity-20 animate-pulse">LOADING...</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
      {/* Header Profile Card */}
      <div className={`p-10 rounded-[3rem] border transition-all duration-500 overflow-hidden relative
        ${theme === 'light' 
          ? 'bg-white border-border-color shadow-sm' 
          : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center font-black text-4xl transition-all duration-500 group-hover:scale-105 border-4
              ${theme === 'light' ? 'bg-primary/10 text-primary border-white shadow-xl' : 'bg-primary/20 text-primary border-[#121214] shadow-2xl shadow-primary/10'}`}>
              {formData.userName?.[0] || formData.eMail?.[0]?.toUpperCase() || "?"}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-text-primary tracking-tighter mb-2">{formData.userName} {formData.userSurname}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
               {(Array.isArray(user?.userType) ? user.userType : [user?.userType]).map((role: any, i: number) => (
                 <span key={i} className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                   {role}
                 </span>
               ))}
               <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                 ${theme === 'light' ? 'bg-gray-100 text-text-secondary border-gray-200' : 'bg-white/5 text-text-secondary border-white/5'}`}>
                 {language?.toUpperCase()}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className={`p-10 rounded-[3rem] border transition-all duration-500
        ${theme === 'light' 
          ? 'bg-white border-border-color shadow-sm' 
          : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_first_name') || "AD"}</label>
              <input 
                type="text" 
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border
                  ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_last_name') || "SOYAD"}</label>
              <input 
                type="text" 
                name="userSurname"
                value={formData.userSurname}
                onChange={handleInputChange}
                className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border
                  ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_nickname') || "KULLANICI ADI"}</label>
              <input 
                type="text" 
                name="userNickname"
                value={formData.userNickname}
                onChange={handleInputChange}
                className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border
                  ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_phone') || "TELEFON"}</label>
              <input 
                type="text" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black transition-all border
                  ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
              />
            </div>
            <div className="md:col-span-2 space-y-2 opacity-60">
              <label className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] ml-1">{t('dashboard.profile_email') || "E-POSTA"}</label>
              <input 
                type="email" 
                name="eMail"
                value={formData.eMail}
                disabled
                className={`w-full h-14 px-6 rounded-2xl outline-none text-[15px] font-black border cursor-not-allowed
                  ${theme === 'light' ? 'bg-gray-100 border-transparent' : 'bg-white/5 border-transparent'}`}
              />
              <p className="text-[10px] font-bold text-text-secondary ml-1 italic">{t('dashboard.email_not_editable') || "E-posta adresi değiştirilemez."}</p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className={`w-full h-16 rounded-[1.5rem] bg-primary text-white font-black text-[15px] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3
              ${saving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {saving ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {t('dashboard.btn_save_profile') || "PROFILI KAYDET"}
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Security Card */}
      <div className={`p-10 rounded-[3rem] border transition-all duration-500
        ${theme === 'light' 
          ? 'bg-white border-border-color shadow-sm' 
          : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
        
        <div className="flex items-center justify-between mb-8">
           <div>
             <h3 className="text-xl font-black text-text-primary tracking-tight">{t('dashboard.security_settings') || "GÜVENLIK AYARLARI"}</h3>
             <p className="text-[12px] font-bold text-text-secondary/60">{t('dashboard.security_desc') || "Şifrenizi ve hesap güvenliğinizi yönetin."}</p>
           </div>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'light' ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-500/20 text-orange-500 border border-orange-500/20'}`}>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
           </div>
        </div>

        <button className={`w-full h-14 rounded-2xl font-black text-[13px] border transition-all flex items-center justify-center gap-3
          ${theme === 'light' ? 'bg-gray-50 border-gray-100 text-text-primary hover:bg-gray-100' : 'bg-white/5 border-white/5 text-text-primary hover:bg-white/10'}`}>
           {t('dashboard.btn_change_password') || "ŞIFREYI DEĞIŞTIR"}
        </button>
      </div>
    </div>
  );
}
