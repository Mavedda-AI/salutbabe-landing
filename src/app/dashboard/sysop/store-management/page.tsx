"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";

interface Store {
  storeID: string;
  storeName: string;
  storePhotoUrl: string;
  isActive: boolean;
  owner: {
    userID: string;
    userName: string;
    userSurname: string;
    userEmail: string;
  };
  addressMappings: any[];
}

export default function StoreManagementPage() {
  const { theme, t } = useThemeLanguage();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/admin/stores"), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.payload) {
        setStores(data.payload);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const toggleStatus = async (storeID: string, currentStatus: boolean) => {
    setSaving(storeID);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/admin/stores/${storeID}`), {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setStores(stores.map(s => s.storeID === storeID ? { ...s, isActive: !currentStatus } : s));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="p-8 text-center">{t('dashboard.sysop.loading_data')}</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-text-primary">{t('dashboard.stores.title')}</h2>
        <p className="text-sm font-bold text-text-secondary opacity-60 uppercase tracking-widest mt-1">{t('dashboard.stores.subtitle')}</p>
      </div>

      <div className={`rounded-[2.5rem] border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-100 shadow-xl shadow-gray-200/50' : 'bg-surface border-white/5 shadow-2xl'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={theme === 'light' ? 'bg-gray-50/50' : 'bg-white/5'}>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.stores.table_store')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.stores.table_owner')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.stores.table_status')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right">{t('dashboard.stores.table_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {stores.map((store) => (
              <tr key={store.storeID} className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-border-color shrink-0">
                      {store.storePhotoUrl ? (
                        <img src={`${API_BASE_URL}/uploads/stores/${store.storePhotoUrl}`} alt={store.storeName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">{store.storeName.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-text-primary">{store.storeName}</span>
                      <span className="text-[11px] font-bold text-text-secondary opacity-60">ID: {store.storeID.split('-')[0]}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-text-primary">{store.owner?.userName} {store.owner?.userSurname}</span>
                    <span className="text-[11px] font-medium text-text-secondary opacity-60">{store.owner?.userEmail}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${store.isActive ? 'bg-success shadow-[0_0_10px_rgba(52,199,89,0.5)]' : 'bg-gray-300'}`}></div>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">{store.isActive ? t('dashboard.stores.active') : t('dashboard.stores.passive')}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                   <button 
                    onClick={() => toggleStatus(store.storeID, store.isActive)}
                    disabled={saving === store.storeID}
                    className={`h-10 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all
                      ${store.isActive 
                        ? 'bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-success/5 text-success hover:bg-success hover:text-white'
                      } disabled:opacity-50`}
                   >
                     {saving === store.storeID ? t('auth.loading') : (store.isActive ? t('dashboard.btn_block') : t('dashboard.btn_unblock'))}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
