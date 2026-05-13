"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../lib/api";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function AdminListings() {
  const { theme, t } = useThemeLanguage();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'PASSIVE' | 'REJECTED'>('ALL');

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/admin/listings"), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.payload?.listings) setListings(data.payload.listings);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setSaving(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/admin/listings/${id}/status`), {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "X-Device-Type": "web" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchListings();
    } catch (e) { console.error(e); }
    finally { setSaving(null); }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'PENDING': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filtered = filter === 'ALL' ? listings : listings.filter(l => l.status === filter);
  const pendingCount = listings.filter(l => l.status === 'PENDING').length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[12px] font-black uppercase tracking-widest text-text-secondary">{t('dashboard.sysop.loading_data')}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-text-primary uppercase tracking-widest">{t('dashboard.listings.title') || 'Ürün Yönetimi'}</h2>
          {pendingCount > 0 && (
            <p className="text-[12px] font-bold text-orange-500 mt-1">⚠ {pendingCount} onay bekliyor</p>
          )}
        </div>
        <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'bg-gray-50 text-text-secondary' : 'bg-white/5 text-text-secondary'}`}>
          {listings.length} {t('dashboard.listings.total') || 'Ürün'}
        </span>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['ALL', 'PENDING', 'ACTIVE', 'PASSIVE', 'REJECTED'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all
              ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : (theme === 'light' ? 'bg-gray-50 text-text-secondary hover:bg-gray-100' : 'bg-white/5 text-text-secondary hover:bg-white/10')}`}>
            {f === 'ALL' ? (t('dashboard.filter_all') || 'Tümü') : f}
            {f === 'PENDING' && pendingCount > 0 && <span className="ml-2 bg-orange-500 text-white rounded-full px-1.5 py-0.5 text-[9px]">{pendingCount}</span>}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className={`hidden md:block rounded-[2.5rem] border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-100 shadow-xl shadow-gray-200/50' : 'bg-surface border-white/5 shadow-2xl'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={theme === 'light' ? 'bg-gray-50/50' : 'bg-white/5'}>
              <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">Ürün</th>
              <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">Satıcı</th>
              <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">Fiyat</th>
              <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">Durum</th>
              <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filtered.map(listing => (
              <tr key={listing.listingID} className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {listing.images?.[0]?.imageUrl && (
                      <img src={listing.images[0].imageUrl} alt={listing.title} className="w-10 h-10 rounded-xl object-cover border border-border-color shrink-0" />
                    )}
                    <span className="font-bold text-text-primary text-sm line-clamp-2 max-w-[200px]">{listing.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-text-secondary">{listing.seller?.userName} {listing.seller?.userSurname}</td>
                <td className="px-6 py-4 font-black text-primary">₺{listing.price?.toLocaleString('tr-TR')}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(listing.status)}`}>{listing.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {listing.status === 'PENDING' && (<>
                      <button onClick={() => updateStatus(listing.listingID, 'ACTIVE')} disabled={saving === listing.listingID}
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white text-[11px] font-black uppercase transition-all disabled:opacity-50">Onayla</button>
                      <button onClick={() => updateStatus(listing.listingID, 'REJECTED')} disabled={saving === listing.listingID}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[11px] font-black uppercase transition-all disabled:opacity-50">Reddet</button>
                    </>)}
                    {listing.status === 'ACTIVE' && (
                      <button onClick={() => updateStatus(listing.listingID, 'PASSIVE')} disabled={saving === listing.listingID}
                        className="px-4 py-2 rounded-xl bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white text-[11px] font-black uppercase transition-all disabled:opacity-50">Pasife Al</button>
                    )}
                    {listing.status === 'PASSIVE' && (
                      <button onClick={() => updateStatus(listing.listingID, 'ACTIVE')} disabled={saving === listing.listingID}
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white text-[11px] font-black uppercase transition-all disabled:opacity-50">Aktife Al</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-8 py-12 text-center text-[13px] font-bold text-text-secondary">{t('dashboard.sysop.no_records')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.length === 0 && (
          <div className={`p-12 text-center rounded-[2rem] border-2 border-dashed ${theme === 'light' ? 'bg-gray-50 border-border-color' : 'bg-white/5 border-white/5'}`}>
            <p className="text-[13px] font-bold text-text-secondary">{t('dashboard.sysop.no_records')}</p>
          </div>
        )}
        {filtered.map(listing => (
          <div key={listing.listingID} className={`p-5 rounded-[2rem] border ${theme === 'light' ? 'bg-white border-border-color shadow-sm' : 'bg-[#121214]/60 border-white/5'}`}>
            <div className="flex items-start gap-4 mb-4">
              {listing.images?.[0]?.imageUrl && (
                <img src={listing.images[0].imageUrl} alt={listing.title} className="w-16 h-16 rounded-2xl object-cover border border-border-color shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-bold text-text-primary leading-tight mb-1">{listing.title}</p>
                <p className="text-[12px] text-text-secondary">{listing.seller?.userName} {listing.seller?.userSurname}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-black text-primary">₺{listing.price?.toLocaleString('tr-TR')}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(listing.status)}`}>{listing.status}</span>
                </div>
              </div>
            </div>
            {(listing.status === 'PENDING' || listing.status === 'ACTIVE' || listing.status === 'PASSIVE') && (
              <div className="flex gap-2">
                {listing.status === 'PENDING' && (<>
                  <button onClick={() => updateStatus(listing.listingID, 'ACTIVE')} disabled={saving === listing.listingID}
                    className="flex-1 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 active:bg-emerald-500 active:text-white text-[12px] font-black uppercase transition-all disabled:opacity-50">Onayla</button>
                  <button onClick={() => updateStatus(listing.listingID, 'REJECTED')} disabled={saving === listing.listingID}
                    className="flex-1 h-12 rounded-2xl bg-red-500/10 text-red-500 active:bg-red-500 active:text-white text-[12px] font-black uppercase transition-all disabled:opacity-50">Reddet</button>
                </>)}
                {listing.status === 'ACTIVE' && (
                  <button onClick={() => updateStatus(listing.listingID, 'PASSIVE')} disabled={saving === listing.listingID}
                    className="flex-1 h-12 rounded-2xl bg-gray-500/10 text-gray-500 active:bg-gray-500 active:text-white text-[12px] font-black uppercase transition-all disabled:opacity-50">Pasife Al</button>
                )}
                {listing.status === 'PASSIVE' && (
                  <button onClick={() => updateStatus(listing.listingID, 'ACTIVE')} disabled={saving === listing.listingID}
                    className="flex-1 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 active:bg-emerald-500 active:text-white text-[12px] font-black uppercase transition-all disabled:opacity-50">Aktife Al</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
