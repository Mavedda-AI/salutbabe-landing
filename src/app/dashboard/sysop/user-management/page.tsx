"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../lib/api";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";

export default function AdminUsersPage() {
  const { t, theme, language } = useThemeLanguage();
  const { showToast } = useToast();
  
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : language === 'fr' ? 'fr-FR' : 'en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [balanceInput, setBalanceInput] = useState("");
  const [pendingBalanceInput, setPendingBalanceInput] = useState("");
  const [editingRoleUser, setEditingRoleUser] = useState<any>(null);
  const [roleInput, setRoleInput] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showAllDetails, setShowAllDetails] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  // Sort State
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/admin/users?limit=5000`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Device-Type": "web",
        },
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setAllUsers(data.payload?.users || []);
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

  const sortedUsers = React.useMemo(() => {
    const sorted = [...allUsers];
    if (sortBy === 'name') {
      sorted.sort((a, b) => {
        const nameA = (a.userName || '').toLowerCase();
        const nameB = (b.userName || '').toLowerCase();
        if (sortOrder === 'ASC') return nameA.localeCompare(nameB);
        return nameB.localeCompare(nameA);
      });
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const dateA = a.registrationDate || a.createdAt || 0;
        const dateB = b.registrationDate || b.createdAt || 0;
        if (sortOrder === 'ASC') return dateA - dateB;
        return dateB - dateA;
      });
    }
    return sorted;
  }, [allUsers, sortBy, sortOrder]);

  const totalUsers = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / limit));
  const users = sortedUsers.slice((page - 1) * limit, page * limit);

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
        showToast(t('dashboard.success'), "success");
        setEditingUser(null);
        fetchUsers();
      } else {
        showToast(t('dashboard.error'), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t('dashboard.error'), "error");
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
        showToast(t('dashboard.success'), "success");
        setEditingRoleUser(null);
        fetchUsers();
      } else {
        showToast(t('dashboard.error'), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t('dashboard.error'), "error");
    }
  };

  const toggleRole = (role: string) => {
    if (roleInput.includes(role)) {
      setRoleInput(roleInput.filter(r => r !== role));
    } else {
      setRoleInput([...roleInput, role]);
    }
  };

  const LoadingSkeleton = () => (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Search & Filters Bar Skeleton */}
      <div className={`p-4 rounded-[2rem] border flex flex-wrap md:flex-nowrap items-center gap-4
        bg-white border-border-color shadow-sm dark:bg-[#12141C]/60 dark:border-white/5`}>
        <div className={`w-full md:flex-1 h-12 rounded-2xl bg-gray-100 dark:bg-white/5`} />
        <div className="flex flex-wrap items-center gap-2">
           {[1, 2, 3].map(i => <div key={i} className={`w-20 h-10 rounded-xl bg-gray-100 dark:bg-white/5`} />)}
        </div>
        <div className={`hidden md:block w-[1px] h-8 bg-gray-100 dark:bg-white/5`} />
        <div className="flex items-center gap-2 ml-auto">
           <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5`} />
           <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5`} />
        </div>
      </div>

      {/* User Cards Skeleton */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`p-8 rounded-[2.5rem] border flex items-center gap-8
          bg-white border-border-color shadow-sm dark:bg-[#12141C]/60 dark:border-white/5`}>
          <div className={`w-20 h-20 rounded-[2rem] bg-gray-100 dark:bg-white/5`} />
          <div className="flex-1 space-y-2">
            <div className={`w-48 h-5 rounded-full bg-gray-100 dark:bg-white/5`} />
            <div className={`w-32 h-3 rounded-full bg-gray-50 dark:bg-white/[0.02]`} />
          </div>
          <div className="hidden lg:flex flex-col gap-2 w-48">
            <div className={`w-full h-4 rounded-full bg-gray-100 dark:bg-white/5`} />
            <div className={`w-full h-4 rounded-full bg-gray-100 dark:bg-white/5`} />
          </div>
          <div className={`w-32 h-10 rounded-2xl bg-gray-100 dark:bg-white/5`} />
        </div>
      ))}
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters Bar */}
      <div className={`p-4 rounded-[2rem] border flex flex-col lg:flex-row items-center gap-4 transition-all duration-300
        bg-white border-border-color shadow-sm dark:bg-[#12141C]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-2xl`}>
        <div className="w-full lg:flex-1 relative group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={t('dashboard.search_placeholder')}
            className={`w-full h-12 pl-12 pr-4 rounded-2xl outline-none text-[13px] font-bold transition-all
              bg-gray-50 focus:bg-white border border-transparent focus:border-primary/20 dark:bg-white/5 dark:focus:bg-white/10 dark:border dark:border-transparent dark:focus:border-white/10`}
          />
        </div>
        
        <div className="w-full lg:w-auto flex flex-wrap items-center justify-between lg:justify-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {['ADMIN', 'SELLER', 'USER'].map(filter => (
              <button key={filter} className={`px-4 h-10 rounded-xl text-[11px] font-black tracking-wider transition-all
                bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary dark:bg-white/5 dark:text-text-secondary dark:hover:bg-white/10 dark:hover:text-white`}>
                {t('dashboard.role_' + filter.toLowerCase())}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-[1px] h-8 bg-border-color/50 dark:bg-white/5 mx-2" />

          <div className="flex items-center gap-2">
           <select 
             value={`${sortBy}-${sortOrder}`}
             onChange={(e) => {
               const [by, order] = e.target.value.split('-');
               setSortBy(by);
               setSortOrder(order);
               setPage(1);
             }}
             className={`px-3 sm:px-4 h-10 rounded-xl text-[10px] sm:text-[11px] font-black tracking-wider transition-all shadow-sm outline-none bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary focus:bg-white focus:border focus:border-primary/20 dark:bg-white/5 dark:text-text-secondary dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10`}
           >
             <option value="date-DESC">YENİDEN ESKİYE</option>
             <option value="date-ASC">ESKİDEN YENİYE</option>
             <option value="name-ASC">A'DAN Z'YE</option>
           </select>
           
           <button 
             onClick={() => setShowAllDetails(!showAllDetails)}
             className={`px-3 sm:px-4 h-10 rounded-xl text-[10px] sm:text-[11px] font-black tracking-wider transition-all shadow-sm ${showAllDetails ? 'bg-[#101516] dark:bg-white text-[#101516] shadow-[#54E6D4]/20' : 'bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary dark:bg-white/5 dark:text-text-secondary dark:hover:bg-white/10 dark:hover:text-white'}`}>
             {showAllDetails ? 'DETAYLARI GİZLE' : 'TÜM DETAYLARI GÖSTER'}
           </button>
           <div className="hidden lg:block w-[1px] h-6 bg-border-color/50 dark:bg-white/5 mx-1" />
           <button 
             onClick={() => setViewMode('list')}
             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all 
               ${viewMode === 'list' 
                 ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                 : 'bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary dark:bg-white/5 dark:text-text-secondary dark:hover:bg-white/10 dark:hover:text-white'}`}>
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
           <button 
             onClick={() => setViewMode('grid')}
             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all 
               ${viewMode === 'grid' 
                 ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                 : 'bg-gray-50 text-text-secondary hover:bg-primary/10 hover:text-primary dark:bg-white/5 dark:text-text-secondary dark:hover:bg-white/10 dark:hover:text-white'}`}>
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
           </button>
         </div>
        </div>
      </div>

      {/* Users Rendering */}
      {viewMode === 'list' && users.length > 0 && (
        <div className="bg-white dark:bg-[#12141C]/60 dark:backdrop-blur-xl border border-border-color dark:border-white/5 shadow-sm rounded-3xl overflow-hidden overflow-x-auto w-full transition-all duration-300">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider w-16 text-center">#</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">İletişim</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Bakiye</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.map((user, idx) => {
                const customerNo = sortBy === 'date' && sortOrder === 'DESC'
                  ? totalUsers - ((page - 1) * limit + idx)
                  : sortBy === 'date' && sortOrder === 'ASC'
                    ? (page - 1) * limit + idx + 1
                    : "?";

                return (
                <React.Fragment key={user.userID}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-center font-black text-text-secondary/40 text-[11px]">
                      {customerNo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:border-primary/20">
                            {user.userName?.[0] || user.eMail[0].toUpperCase()}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#12141C] ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div>
                          <div className="font-bold text-text-primary text-[13px]">{user.userName} {user.userSurname}</div>
                          <div className="text-[11px] text-text-secondary/60">@{user.userNickname || t('dashboard.anonymous')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-text-primary text-[12px]">{user.eMail}</div>
                        <div className="text-[11px] text-text-secondary/60">{user.phoneNumber || t('dashboard.no_phone')}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {(Array.isArray(user.userType) ? user.userType : [user.userType]).map((role: string, rIdx: number) => (
                          <span key={rIdx} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${role === 'SYSOP' ? 'bg-primary/10 text-primary' : role === 'ADMIN' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60'}`}>
                            {t('dashboard.role_' + role.toLowerCase())}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-black text-text-primary text-[14px]">{formatBalance(user.balance || 0)} ₺</div>
                      <div className="text-[10px] text-text-secondary/60 font-bold opacity-80">{formatBalance(user.pendingBalance || 0)} ₺ Bekleyen</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setExpandedUser(expandedUser === user.userID ? null : user.userID)} className={`p-2 rounded-lg transition-colors ${expandedUser === user.userID || showAllDetails ? 'bg-primary text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-text-secondary'}`}>
                          <svg className={`w-4 h-4 transform transition-transform ${expandedUser === user.userID || showAllDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <button onClick={() => { setEditingUser(user); setBalanceInput(user.balance?.toString() || "0"); setPendingBalanceInput(user.pendingBalance?.toString() || "0"); }} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-text-secondary transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" /></svg>
                        </button>
                        <button onClick={() => { setEditingRoleUser(user); setRoleInput(Array.isArray(user.userType) ? user.userType : [user.userType]); }} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-blue-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </button>
                        <button onClick={() => handleBlockUser(user.userID, !user.isActive)} className={`p-2 rounded-lg transition-colors ${!user.isActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            {user.isActive ? <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {(expandedUser === user.userID || showAllDetails) && (
                    <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                      <td colSpan={6} className="px-6 py-6 border-t border-gray-100 dark:border-white/5">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-left">
                           <div>
                             <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Kayıt Tarihi</p>
                             <p className="text-[12px] font-bold text-text-primary">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Son Görülme</p>
                             <p className="text-[12px] font-bold text-text-primary">{user.lastSeenAt ? new Date(Number(user.lastSeenAt)).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">TC Kimlik / VKN</p>
                             <p className="text-[12px] font-bold text-text-primary">{user.tc || user.tcNo || user.vkn || 'Belirtilmemiş'}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Doğum Tarihi</p>
                             <p className="text-[12px] font-bold text-text-primary">{user.birthDate || user.dob ? new Date(user.birthDate || user.dob).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Cinsiyet</p>
                             <p className="text-[12px] font-bold text-text-primary">{user.gender === 'MALE' ? 'Erkek' : user.gender === 'FEMALE' ? 'Kadın' : user.gender || 'Belirtilmemiş'}</p>
                           </div>
                           <div className="lg:col-span-2">
                             <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Adres</p>
                             <p className="text-[12px] font-bold text-text-primary truncate" title={user.address || user.fullAddress}>{user.address || user.fullAddress || 'Adres bilgisi bulunamadı.'}</p>
                           </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ); })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'grid' && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.userID} className={`p-8 rounded-[3rem] border transition-all duration-500 group hover:scale-[1.02] flex flex-col items-center text-center
              bg-white border-border-color shadow-sm hover:shadow-2xl hover:border-primary/20 dark:bg-[#12141C]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-2xl dark:hover:bg-[#121214] dark:hover:border-white/10`}>
              
              {/* Profile Header */}
              <div className="relative mb-6">
                <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center font-black text-3xl transition-all duration-500 group-hover:rotate-6
                  bg-primary/10 text-primary border-4 border-white shadow-xl dark:bg-primary/20 dark:text-primary dark:border-4 dark:border-[#121214] dark:shadow-2xl dark:shadow-primary/10`}>
                  {user.userName?.[0] || user.eMail[0].toUpperCase()}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 flex items-center justify-center
                  bg-white border-white dark:bg-[#12141C] dark:border-[#121214]`}>
                  <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'}`} />
                </div>
              </div>

              {/* User Identity */}
              <div className="mb-6">
                <h4 className="text-[19px] font-black text-text-primary tracking-tight mb-1">{user.userName} {user.userSurname}</h4>
                <p className="text-[12px] font-bold text-text-secondary/60 lowercase tracking-[0.2em] mb-4">@{user.userNickname || t('dashboard.anonymous')}</p>
                <div className="flex gap-2 justify-center flex-wrap">
                   {(Array.isArray(user.userType) ? user.userType : [user.userType]).map((role: string, idx: number) => (
                     <span key={idx} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border
                       ${role === 'SYSOP' ? 'bg-primary/10 text-primary border-primary/20' : 
                         role === 'ADMIN' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                         'bg-text-secondary/10 text-text-secondary border-transparent'}`}>
                       {t('dashboard.role_' + role.toLowerCase())}
                     </span>
                   ))}
                </div>
              </div>

              {/* Stats / Balance */}
              <div className={`w-full p-6 rounded-[2rem] mb-8 flex justify-center items-center gap-6
                bg-gray-50 dark:bg-white/5`}>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">{t('dashboard.table_balance')}</p>
                    <div className="flex items-center gap-1 justify-center">
                       <span className="text-[20px] font-black text-text-primary">{formatBalance(user.balance || 0)}</span>
                       <span className="text-[12px] font-black text-primary">₺</span>
                    </div>
                 </div>
                 <div className="w-[1px] h-8 bg-text-secondary/10" />
                 <div className="text-center">
                    <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">{t('dashboard.label_pending')}</p>
                    <div className="flex items-center gap-1 justify-center text-[#101516] dark:text-white">
                       <span className="text-[20px] font-black">{formatBalance(user.pendingBalance || 0)}</span>
                       <span className="text-[12px] font-black">₺</span>
                    </div>
                 </div>
              </div>

              {/* Contact Mini */}
              <p className="text-[13px] font-bold text-text-primary/80 mb-8 truncate w-full px-2">{user.eMail}</p>

              {/* Actions Grid */}
              <div className="w-full grid grid-cols-4 gap-2">
                 <button 
                   onClick={() => setExpandedUser(expandedUser === user.userID ? null : user.userID)}
                   className={`h-12 rounded-2xl flex items-center justify-center transition-all ${expandedUser === user.userID || showAllDetails ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-white/50'}`}>
                   <svg className={`w-5 h-5 transform transition-transform ${expandedUser === user.userID || showAllDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                 </button>
                 <button 
                   onClick={() => {
                     setEditingUser(user);
                     setBalanceInput(user.balance?.toString() || "0");
                     setPendingBalanceInput(user.pendingBalance?.toString() || "0");
                   }}
                   className={`h-12 rounded-2xl flex items-center justify-center transition-all
                     bg-primary text-white shadow-lg dark:bg-primary dark:text-white dark:shadow-lg`}>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" /></svg>
                 </button>
                 <button 
                   onClick={() => {
                     setEditingRoleUser(user);
                     setRoleInput(Array.isArray(user.userType) ? user.userType : [user.userType]);
                   }}
                   className={`h-12 rounded-2xl flex items-center justify-center transition-all
                     bg-gray-100 text-blue-500 dark:bg-white/5 dark:text-blue-500`}>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 </button>
                 <button 
                   onClick={() => handleBlockUser(user.userID, !user.isActive)}
                   className={`h-12 rounded-2xl flex items-center justify-center transition-all
                     ${!user.isActive ? 'bg-green-500 text-white shadow-lg' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                     {user.isActive ? <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                   </svg>
                 </button>
              </div>

              {/* Expanded Details Section */}
              <div className={`w-full overflow-hidden transition-all duration-300 text-left ${expandedUser === user.userID || showAllDetails ? 'max-h-[800px] opacity-100 mt-6 pt-6 border-t border-gray-100 dark:border-white/5' : 'max-h-0 opacity-0 mt-0 pt-0 border-transparent'}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Kayıt Tarihi</p>
                      <p className="text-[11px] font-bold text-text-primary">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Son Görülme</p>
                      <p className="text-[11px] font-bold text-text-primary">{user.lastSeenAt ? new Date(Number(user.lastSeenAt)).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">TC Kimlik</p>
                      <p className="text-[11px] font-bold text-text-primary">{user.tc || user.tcNo || user.vkn || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Doğum Tarihi</p>
                      <p className="text-[11px] font-bold text-text-primary">{user.birthDate || user.dob ? new Date(user.birthDate || user.dob).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Kullanıcı ID</p>
                      <p className="text-[11px] font-bold text-text-primary truncate">{user.userID}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Adres</p>
                      <p className="text-[11px] font-bold text-text-primary truncate">{user.address || user.fullAddress || 'Adres bilgisi bulunamadı.'}</p>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {users.length === 0 && (
        <div className={`p-20 text-center rounded-[3rem] border-2 border-dashed
          bg-gray-50 border-border-color dark:bg-white/5 dark:border-white/5`}>
          <div className="w-16 h-16 rounded-full bg-text-secondary/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-secondary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <p className="text-[13px] font-bold text-text-secondary">{t('dashboard.empty_users')}</p>
        </div>
      )}

      {/* Pagination Bar */}
      <div className={`p-4 rounded-[2rem] border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300
        bg-white border-border-color shadow-sm dark:bg-[#12141C]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-2xl`}>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wider
             bg-gray-50 text-text-secondary dark:bg-white/5 dark:text-text-secondary`}>
             {t('dashboard.admin_users_total').replace('{count}', totalUsers.toString())}
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={() => setPage(p => Math.max(1, p - 1))} 
             disabled={page === 1} 
             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${page === 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 text-text-secondary dark:bg-white/5 dark:text-text-secondary/50' : 'bg-gray-50 text-text-secondary hover:bg-primary hover:text-white dark:bg-white/5 dark:text-text-secondary dark:hover:bg-primary dark:hover:text-white'}`}>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black bg-primary text-white shadow-lg shadow-primary/20`}>{page}</div>
           <button 
             onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
             disabled={page >= totalPages} 
             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${page >= totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50 text-text-secondary dark:bg-white/5 dark:text-text-secondary/50' : 'bg-gray-50 text-text-secondary hover:bg-primary hover:text-white dark:bg-white/5 dark:text-text-secondary dark:hover:bg-primary dark:hover:text-white'}`}>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>

        <div className="flex items-center gap-3">
           <span className="text-[11px] font-black text-text-secondary/40 uppercase tracking-widest">{t('dashboard.show_label')}:</span>
           <select 
             value={limit} 
             onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} 
             className={`px-4 h-10 rounded-xl text-[11px] font-black outline-none transition-all
             bg-gray-50 text-text-primary focus:bg-white border border-transparent focus:border-primary/20 dark:bg-white/5 dark:text-text-primary dark:focus:bg-white/10 dark:border dark:border-transparent dark:focus:border-white/10`}>
             <option value={10}>10</option>
             <option value={20}>20</option>
             <option value={50}>50</option>
             <option value={100}>100</option>
           </select>
        </div>
      </div>

      {/* Modals remain the same but styled consistently */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className={`rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-scale-in border
            bg-white border-border-color dark:bg-[#18181B] dark:border-white/5`}>
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
                      bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 shadow-inner dark:bg-white/5 dark:border-transparent dark:focus:bg-white/10 dark:focus:border-white/20`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary text-[15px]">₺</span>
                </div>
              </div>
              <div className="group">
                <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-[#101516] dark:text-white transition-colors">{t('dashboard.pending_balance')}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={pendingBalanceInput} 
                    onChange={(e) => setPendingBalanceInput(e.target.value)}
                    className={`w-full h-14 pl-6 pr-12 rounded-2xl outline-none text-[16px] font-black transition-all border
                      bg-gray-50 border-transparent focus:bg-white focus:border-black dark:border-white/ shadow-inner dark:bg-white/5 dark:border-transparent dark:focus:bg-white/10 dark:focus:border-white/20`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[#101516] dark:text-white text-[15px]">₺</span>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setEditingUser(null)}
                  className={`flex-1 h-14 rounded-2xl font-black text-[14px] transition-all
                    bg-gray-100 text-text-primary hover:bg-gray-200 dark:bg-white/5 dark:text-text-primary dark:hover:bg-white/10`}
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
            bg-white border-border-color dark:bg-[#18181B] dark:border-white/5`}>
            <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">{t('dashboard.modal_update_role')}</h3>
            <p className="text-[13px] font-bold text-text-secondary/60 mb-8">{t('dashboard.modal_update_role_desc').replace('{name}', editingRoleUser.userName)}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {['USER', 'SELLER', 'ADMIN', 'SYSOP'].map(role => (
                <label key={role} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all group
                  ${roleInput.includes(role) 
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(95,200,192,0.1)]' 
                    : 'bg-gray-50 border-transparent hover:border-primary/20 dark:bg-white/5 dark:border-transparent dark:hover:border-white/10'}`}>
                  <span className={`text-[14px] font-black transition-colors ${roleInput.includes(role) ? 'text-primary' : 'text-text-primary'}`}>{t('dashboard.role_' + role.toLowerCase())}</span>
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
                    bg-gray-100 text-text-primary hover:bg-gray-200 dark:bg-white/5 dark:text-text-primary dark:hover:bg-white/10`}
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
