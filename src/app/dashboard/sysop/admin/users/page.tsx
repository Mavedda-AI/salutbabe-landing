"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../../lib/api";
import {useThemeLanguage} from "../../../../../context/ThemeLanguageContext";

export default function AdminUsersPage() {
  const { t } = useThemeLanguage();
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
    <div className="bg-white dark:bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border-color flex items-center justify-between">
        <h2 className="text-lg font-black text-text-primary">{t('dashboard.admin_users_title')}</h2>
        <div className="text-[12px] font-bold text-text-secondary">{t('dashboard.admin_users_total').replace('{count}', users.length.toString())}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-color bg-[#F8F9FB] dark:bg-surface/50">
              <th className="py-4 px-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">{t('dashboard.table_user')}</th>
              <th className="py-4 px-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">{t('dashboard.table_contact')}</th>
              <th className="py-4 px-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">{t('dashboard.table_role')}</th>
              <th className="py-4 px-6 text-[11px] font-black text-text-secondary uppercase tracking-widest text-right">{t('dashboard.table_balance')}</th>
              <th className="py-4 px-6 text-[11px] font-black text-text-secondary uppercase tracking-widest text-center">{t('dashboard.table_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userID} className="border-b border-border-color/50 hover:bg-black/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg">
                      {user.userName?.[0] || user.eMail[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-text-primary">{user.userName} {user.userSurname}</div>
                      <div className="text-[11px] font-bold text-text-secondary">@{user.userNickname || t('dashboard.anonymous')}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-[13px] font-bold text-text-primary">{user.eMail}</div>
                  <div className="text-[11px] font-bold text-text-secondary">{user.phoneNumber || t('dashboard.no_phone')}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-1 flex-wrap">
                    {(Array.isArray(user.userType) ? user.userType : [user.userType]).map((role: string, idx: number) => (
                      <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-[10px] font-black">{role}</span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="text-[14px] font-black text-text-primary">{user.balance || 0} ₺</div>
                  <div className="text-[11px] font-bold text-orange-500 text-opacity-80">{t('dashboard.pending_balance')}: {user.pendingBalance || 0} ₺</div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingUser(user);
                        setBalanceInput(user.balance?.toString() || "0");
                        setPendingBalanceInput(user.pendingBalance?.toString() || "0");
                      }}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-[11px] font-black transition-colors"
                    >
                      {t('dashboard.btn_balance')}
                    </button>
                    <button 
                      onClick={() => {
                        setEditingRoleUser(user);
                        setRoleInput(Array.isArray(user.userType) ? user.userType : [user.userType]);
                      }}
                      className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg text-[11px] font-black transition-colors"
                    >
                      {t('dashboard.btn_roles')}
                    </button>
                    <button 
                      onClick={() => handleBlockUser(user.userID, !user.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-colors ${!user.isActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      {!user.isActive ? t('dashboard.btn_unblock') : t('dashboard.btn_block')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-text-secondary font-bold text-[13px]">{t('dashboard.empty_users')}</div>
        )}
      </div>

      {/* Bakiye Düzenleme Modalı */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-xl font-black text-text-primary mb-2">{t('dashboard.modal_update_balance')}</h3>
            <p className="text-[12px] font-bold text-text-secondary mb-6">{t('dashboard.modal_update_balance_desc').replace('{name}', editingUser.userName)}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2">{t('dashboard.active_balance')}</label>
                <input 
                  type="number" 
                  value={balanceInput} 
                  onChange={(e) => setBalanceInput(e.target.value)}
                  className="w-full bg-[#F3F5F9] dark:bg-background border border-transparent focus:border-primary focus:bg-white outline-none px-4 py-3 rounded-xl text-[14px] font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2">{t('dashboard.pending_balance')}</label>
                <input 
                  type="number" 
                  value={pendingBalanceInput} 
                  onChange={(e) => setPendingBalanceInput(e.target.value)}
                  className="w-full bg-[#F3F5F9] dark:bg-background border border-transparent focus:border-primary focus:bg-white outline-none px-4 py-3 rounded-xl text-[14px] font-bold transition-all"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 bg-black/5 hover:bg-black/10 text-text-primary rounded-xl font-black text-[13px] transition-colors"
                >
                  {t('dashboard.btn_cancel')}
                </button>
                <button 
                  onClick={handleUpdateBalance}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[13px] shadow-lg shadow-primary/30 transition-all"
                >
                  {t('dashboard.btn_save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rol Düzenleme Modalı */}
      {editingRoleUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-xl font-black text-text-primary mb-2">{t('dashboard.modal_update_role')}</h3>
            <p className="text-[12px] font-bold text-text-secondary mb-6">{t('dashboard.modal_update_role_desc').replace('{name}', editingRoleUser.userName)}</p>
            
            <div className="space-y-3">
              {['USER', 'SELLER', 'ADMIN', 'SYSOP'].map(role => (
                <label key={role} className="flex items-center gap-3 p-3 rounded-xl border border-border-color hover:bg-black/5 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={roleInput.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-[13px] font-bold text-text-primary">{role}</span>
                </label>
              ))}
              
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setEditingRoleUser(null)}
                  className="flex-1 py-3 bg-black/5 hover:bg-black/10 text-text-primary rounded-xl font-black text-[13px] transition-colors"
                >
                  {t('dashboard.btn_cancel')}
                </button>
                <button 
                  onClick={handleUpdateRole}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[13px] shadow-lg shadow-primary/30 transition-all"
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
