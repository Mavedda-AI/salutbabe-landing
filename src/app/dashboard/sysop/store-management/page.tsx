"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";

interface Store {
  storeID: string;
  storeName: string;
  storePhotoUrl: string;
  isActive: boolean;
  owner: { userID: string; userName: string; userSurname: string; eMail: string; };
  addressMappings: any[];
}

export default function StoreManagementPage() {
  const { theme, t } = useThemeLanguage();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/admin/stores"), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.payload) setStores(data.payload);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStores(); }, []);

  const toggleStatus = async (storeID: string, currentStatus: boolean) => {
    setSaving(storeID);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/admin/stores/${storeID}`), {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "X-Device-Type": "web" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setStores(stores.map(s => s.storeID === storeID ? { ...s, isActive: !currentStatus } : s));
      }
    } catch (e) { console.error(e); }
    finally { setSaving(null); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[12px] font-black uppercase tracking-widest text-text-secondary">{t('dashboard.sysop.loading_data')}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-text-primary uppercase tracking-widest">{t('dashboard.stores.title') || 'Mağaza Yönetimi'}</h2>
        <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'bg-gray-50 text-text-secondary' : 'bg-white/5 text-text-secondary'}`}>
          {stores.length} {t('dashboard.stores.total') || 'Mağaza'}
        </span>
      </div>

      {/* Desktop Table */}
      <div className={`hidden md:block rounded-[2.5rem] border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-100 shadow-xl shadow-gray-200/50' : 'bg-surface border-white/5 shadow-2xl'}`}>
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
                        <span className="text-[14px] font-black opacity-30 uppercase">{store.storeName.charAt(0)}</span>
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
                    <span className="text-[11px] font-medium text-text-secondary opacity-60">{store.owner?.eMail}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${store.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(52,199,89,0.5)]' : 'bg-gray-300'}`}></div>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">{store.isActive ? t('dashboard.stores.active') : t('dashboard.stores.passive')}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => toggleStatus(store.storeID, store.isActive)} disabled={saving === store.storeID}
                    className={`h-10 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all
                      ${store.isActive ? 'bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white'} 
                      disabled:opacity-50`}>
                    {saving === store.storeID ? t('auth.loading') : (store.isActive ? t('dashboard.btn_block') : t('dashboard.btn_unblock'))}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-4">
        {stores.length === 0 && (
          <div className={`p-12 text-center rounded-[2rem] border-2 border-dashed ${theme === 'light' ? 'bg-gray-50 border-border-color' : 'bg-white/5 border-white/5'}`}>
            <p className="text-[13px] font-bold text-text-secondary">{t('dashboard.sysop.no_records')}</p>
          </div>
        )}
        {stores.map((store) => (
          <div key={store.storeID} className={`p-5 rounded-[2rem] border ${theme === 'light' ? 'bg-white border-border-color shadow-sm' : 'bg-[#121214]/60 border-white/5'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-border-color shrink-0">
                {store.storePhotoUrl ? (
                  <img src={`${API_BASE_URL}/uploads/stores/${store.storePhotoUrl}`} alt={store.storeName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black opacity-30 uppercase">{store.storeName.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-black text-text-primary">{store.storeName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${store.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary">{store.isActive ? t('dashboard.stores.active') : t('dashboard.stores.passive')}</span>
                </div>
              </div>
            </div>
            <div className={`space-y-2 mb-4 pb-4 border-b ${theme === 'light' ? 'border-border-color' : 'border-white/5'}`}>
              <p className="text-[11px] font-black text-text-secondary/50 uppercase tracking-wider">{t('dashboard.stores.table_owner')}</p>
              <p className="font-bold text-text-primary">{store.owner?.userName} {store.owner?.userSurname}</p>
              <p className="text-[12px] text-text-secondary">{store.owner?.eMail}</p>
            </div>
            <button onClick={() => toggleStatus(store.storeID, store.isActive)} disabled={saving === store.storeID}
              className={`w-full h-12 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all
                ${store.isActive ? 'bg-red-500/10 text-red-500 active:bg-red-500 active:text-white' : 'bg-emerald-500/10 text-emerald-500 active:bg-emerald-500 active:text-white'}
                disabled:opacity-50`}>
              {saving === store.storeID ? t('auth.loading') : (store.isActive ? t('dashboard.btn_block') : t('dashboard.btn_unblock'))}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
