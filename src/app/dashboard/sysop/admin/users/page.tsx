"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../../lib/api";
import {useThemeLanguage} from "../../../../../context/ThemeLanguageContext";

export default function AdminUsersPage() {
  const { t, theme } = useThemeLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [balanceInput, setBalanceInput] = useState("");
  const [pendingBalanceInput, setPendingBalanceInput] = useState("");
  const [editingRoleUser, setEditingRoleUser] = useState<any>(null);
  const [roleInput, setRoleInput] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/admin/users"), {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Device-Type": "web",
        },
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setUsers(data.payload?.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateBalance = async () => {
    if (!editingUser) return;
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/admin/users/${editingUser.userID}/balance`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Device-Type": "web",
        },
        body: JSON.stringify({
          balance: parseFloat(balanceInput),
          pendingBalance: parseFloat(pendingBalanceInput)
        }),
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        alert(t('dashboard.success') || "Başarılı");
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(t('dashboard.error') || "Hata oluştu");
      }
    } catch (e) {
      console.error(e);
      alert(t('dashboard.error') || "Hata oluştu");
    }
  };

  const handleBlockUser = async (userID: string, isBlocked: boolean) => {
    try {
      const token = localStorage.getItem("auth_token");
      const endpoint = isBlocked ? 'unblock' : 'block';
      const res = await fetch(apiUrl(`/admin/users/${userID}/${endpoint}`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Device-Type": "web",
        },
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRoleUser) return;
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/admin/users/${editingRoleUser.userID}/role`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Device-Type": "web",
        },
        body: JSON.stringify({ roles: roleInput }),
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        alert(t('dashboard.success') || "Başarılı");
        setEditingRoleUser(null);
        fetchUsers();
      } else {
        alert(t('dashboard.error') || "Hata oluştu");
      }
    } catch (e) {
      console.error(e);
      alert(t('dashboard.error') || "Hata oluştu");
    }
  };

  const toggleRole = (role: string) => {
    if (roleInput.includes(role)) {
      setRoleInput(roleInput.filter(r => r !== role));
    } else {
      setRoleInput([...roleInput, role]);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-secondary font-bold">{t('dashboard.loading_users')}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters Bar */}
      <div className={`p-4 rounded-[2rem] border flex items-center gap-4 transition-all duration-300
        ${theme === 'light' ? 'bg-white border-border-color shadow-sm' : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
        <div className="flex-1 relative group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={t('dashboard.search_placeholder') || "Kullanıcı ara..."}
            className={`w-full h-12 pl-12 pr-4 rounded-2xl outline-none text-[13px] font-bold transition-all
              ${theme === 'light' ? 'bg-gray-50 focus:bg-white border border-transparent focus:border-primary/20' : 'bg-white/5 focus:bg-white/10 border border-transparent focus:border-white/10'}`}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {['ADMIN', 'SELLER', 'USER'].map(filter => (
            <button key={filter} className={`px-4 h-10 rounded-xl text-[11px] font-black tracking-wider transition-all
              ${theme === 'light' ? 'bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary' : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="w-[1px] h-8 bg-border-color/50 dark:bg-white/5 mx-2" />

        <div className="flex items-center gap-2">
           <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary' : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'}`}>
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
           <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
           </button>
        </div>
      </div>

      {/* Users List Cards */}
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.userID} className={`p-8 rounded-[2.5rem] border transition-all duration-500 group hover:scale-[1.01]
            ${theme === 'light' 
              ? 'bg-white border-border-color shadow-sm hover:shadow-xl hover:border-primary/20' 
              : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl hover:bg-[#121214] hover:border-white/10'}`}>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* User Info Section */}
              <div className="lg:col-span-3 flex items-center gap-6">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-2xl transition-all duration-500 group-hover:rotate-6
                    ${theme === 'light' ? 'bg-primary/10 text-primary border-2 border-primary/20' : 'bg-primary/20 text-primary border-2 border-primary/20 shadow-[0_0_30px_rgba(95,200,192,0.1)]'}`}>
                    {user.userName?.[0] || user.eMail[0].toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 flex items-center justify-center
                    ${theme === 'light' ? 'bg-white border-white' : 'bg-[#121214] border-[#121214]'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                  </div>
                </div>
                <div>
                  <h4 className="text-[17px] font-black text-text-primary tracking-tight mb-1">{user.userName} {user.userSurname}</h4>
                  <p className="text-[12px] font-bold text-text-secondary/60 uppercase tracking-widest">@{user.userNickname || t('dashboard.anonymous')}</p>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="lg:col-span-3">
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3">
                     <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     <span className="text-[13px] font-bold text-text-primary tracking-tight">{user.eMail}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <svg className="w-4 h-4 text-text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                     <span className="text-[12px] font-bold text-text-secondary/60">{user.phoneNumber || t('dashboard.no_phone')}</span>
                   </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="lg:col-span-2">
                <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                   {(Array.isArray(user.userType) ? user.userType : [user.userType]).map((role: string, idx: number) => (
                     <span key={idx} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300
                       ${role === 'SYSOP' ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(95,200,192,0.1)]' : 
                         role === 'ADMIN' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                         'bg-text-secondary/10 text-text-secondary border-transparent'}`}>
                       {role}
                     </span>
                   ))}
                </div>
              </div>

              {/* Balance Section */}
              <div className="lg:col-span-2 text-right lg:text-center">
                 <div className="inline-block text-left">
                   <p className="text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-1">{t('dashboard.table_balance')}</p>
                   <div className="flex items-baseline gap-1">
                     <span className="text-[22px] font-black text-text-primary tracking-tight">{user.balance?.toLocaleString('tr-TR') || 0}</span>
                     <span className="text-[13px] font-black text-primary">₺</span>
                   </div>
                   <div className="mt-1 flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                     <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter opacity-80">{t('dashboard.pending_balance')}: {user.pendingBalance || 0} ₺</span>
                   </div>
                 </div>
              </div>

              {/* Actions Section */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      setEditingUser(user);
                      setBalanceInput(user.balance?.toString() || "0");
                      setPendingBalanceInput(user.pendingBalance?.toString() || "0");
                    }}
                    className={`flex items-center justify-between px-5 py-3 rounded-2xl text-[12px] font-black transition-all group/btn
                      ${theme === 'light' ? 'bg-gray-50 text-text-primary hover:bg-primary hover:text-white' : 'bg-white/5 text-text-primary hover:bg-primary hover:text-white shadow-lg'}`}
                  >
                    <span>{t('dashboard.btn_balance')}</span>
                    <svg className="w-4 h-4 opacity-40 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setEditingRoleUser(user);
                        setRoleInput(Array.isArray(user.userType) ? user.userType : [user.userType]);
                      }}
                      className={`flex items-center justify-center p-3 rounded-2xl transition-all
                        ${theme === 'light' ? 'bg-gray-50 text-blue-500 hover:bg-blue-500 hover:text-white' : 'bg-white/5 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </button>
                    <button 
                      onClick={() => handleBlockUser(user.userID, !user.isActive)}
                      className={`flex items-center justify-center p-3 rounded-2xl transition-all
                        ${!user.isActive 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' 
                          : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        {user.isActive ? <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className={`p-20 text-center rounded-[3rem] border-2 border-dashed
            ${theme === 'light' ? 'bg-gray-50 border-border-color' : 'bg-white/5 border-white/5'}`}>
            <div className="w-16 h-16 rounded-full bg-text-secondary/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-secondary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="text-[13px] font-bold text-text-secondary">{t('dashboard.empty_users')}</p>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      <div className={`p-4 rounded-[2rem] border flex items-center justify-between transition-all duration-300
        ${theme === 'light' ? 'bg-white border-border-color shadow-sm' : 'bg-[#121214]/60 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wider
             ${theme === 'light' ? 'bg-gray-50 text-text-secondary' : 'bg-white/5 text-text-secondary'}`}>
             {t('dashboard.admin_users_total').replace('{count}', users.length.toString())}
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-gray-50 text-text-secondary hover:bg-primary hover:text-white' : 'bg-white/5 text-text-secondary hover:bg-primary hover:text-white'}`}>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black bg-primary text-white shadow-lg shadow-primary/20`}>1</div>
           <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-gray-50 text-text-secondary hover:bg-primary hover:text-white' : 'bg-white/5 text-text-secondary hover:bg-primary hover:text-white'}`}>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>

        <div className="flex items-center gap-3">
           <span className="text-[11px] font-black text-text-secondary/40 uppercase tracking-widest">{t('dashboard.show_label') || "GÖSTER"}:</span>
           <select className={`px-4 h-10 rounded-xl text-[11px] font-black outline-none transition-all
             ${theme === 'light' ? 'bg-gray-50 text-text-primary focus:bg-white border border-transparent focus:border-primary/20' : 'bg-white/5 text-text-primary focus:bg-white/10 border border-transparent focus:border-white/10'}`}>
             <option>10</option>
             <option>20</option>
             <option>50</option>
           </select>
        </div>
      </div>

      {/* Modals remain the same but styled consistently */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className={`rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-scale-in border
            ${theme === 'light' ? 'bg-white border-border-color' : 'bg-[#18181B] border-white/5'}`}>
            <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">{t('dashboard.modal_update_balance')}</h3>
            <p className="text-[13px] font-bold text-text-secondary/60 mb-8">{t('dashboard.modal_update_balance_desc').replace('{name}', editingUser.userName)}</p>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary transition-colors">{t('dashboard.active_balance')}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={balanceInput} 
                    onChange={(e) => setBalanceInput(e.target.value)}
                    className={`w-full h-14 pl-6 pr-12 rounded-2xl outline-none text-[16px] font-black transition-all border
                      ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 shadow-inner' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary text-[15px]">₺</span>
                </div>
              </div>
              <div className="group">
                <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-orange-400 transition-colors">{t('dashboard.pending_balance')}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={pendingBalanceInput} 
                    onChange={(e) => setPendingBalanceInput(e.target.value)}
                    className={`w-full h-14 pl-6 pr-12 rounded-2xl outline-none text-[16px] font-black transition-all border
                      ${theme === 'light' ? 'bg-gray-50 border-transparent focus:bg-white focus:border-orange-400/30 shadow-inner' : 'bg-white/5 border-transparent focus:bg-white/10 focus:border-white/20'}`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-orange-400 text-[15px]">₺</span>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setEditingUser(null)}
                  className={`flex-1 h-14 rounded-2xl font-black text-[14px] transition-all
                    ${theme === 'light' ? 'bg-gray-100 text-text-primary hover:bg-gray-200' : 'bg-white/5 text-text-primary hover:bg-white/10'}`}
                >
                  {t('dashboard.btn_cancel')}
                </button>
                <button 
                  onClick={handleUpdateBalance}
                  className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-[14px] shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all"
                >
                  {t('dashboard.btn_save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingRoleUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className={`rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-scale-in border
            ${theme === 'light' ? 'bg-white border-border-color' : 'bg-[#18181B] border-white/5'}`}>
            <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">{t('dashboard.modal_update_role')}</h3>
            <p className="text-[13px] font-bold text-text-secondary/60 mb-8">{t('dashboard.modal_update_role_desc').replace('{name}', editingRoleUser.userName)}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {['USER', 'SELLER', 'ADMIN', 'SYSOP'].map(role => (
                <label key={role} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all group
                  ${roleInput.includes(role) 
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(95,200,192,0.1)]' 
                    : theme === 'light' ? 'bg-gray-50 border-transparent hover:border-primary/20' : 'bg-white/5 border-transparent hover:border-white/10'}`}>
                  <span className={`text-[14px] font-black transition-colors ${roleInput.includes(role) ? 'text-primary' : 'text-text-primary'}`}>{role}</span>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${roleInput.includes(role) ? 'bg-primary border-primary' : 'border-text-secondary/20 group-hover:border-primary/50'}`}>
                    {roleInput.includes(role) && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={roleInput.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                </label>
              ))}
              
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setEditingRoleUser(null)}
                  className={`flex-1 h-14 rounded-2xl font-black text-[14px] transition-all
                    ${theme === 'light' ? 'bg-gray-100 text-text-primary hover:bg-gray-200' : 'bg-white/5 text-text-primary hover:bg-white/10'}`}
                >
                  {t('dashboard.btn_cancel')}
                </button>
                <button 
                  onClick={handleUpdateRole}
                  className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-[14px] shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all"
                >
                  {t('dashboard.btn_save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
