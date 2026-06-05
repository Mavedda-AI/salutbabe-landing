"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../lib/api";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function AdminListings() {
  const { t, theme } = useThemeLanguage();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/admin/listings"), {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.payload?.listings) setListings(data.payload.listings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/admin/listings/${id}/status`), {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Device-Type": "web"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchListings();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-12 text-center text-[14px] font-black tracking-widest uppercase text-text-secondary animate-pulse">{t('dashboard.sysop.loading_data')}</div>;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight px-2">{t('dashboard.sysop.manage_listings')}</h1>
      
      <div className={`rounded-[2.5rem] border overflow-x-auto bg-white border-border-color shadow-sm dark:bg-[#12141C] dark:border-white/5 dark:shadow-2xl`}>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className={theme === 'light' ? 'bg-gray-50/50 border-b border-border-color' : 'bg-white/5 border-b border-white/5'}>
              <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.table_listing')}</th>
              <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.table_seller')}</th>
              <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.table_price')}</th>
              <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.table_status')}</th>
              <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right">{t('dashboard.sysop.cat_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color dark:divide-white/5">
            {listings.map(listing => (
              <tr key={listing.listingID} className={`transition-colors hover:bg-gray-50 dark:hover:bg-white/5`}>
                <td className="p-6 font-black text-text-primary text-[14px]">
                  {listing.title}
                </td>
                <td className="p-6 text-[13px] font-bold text-text-secondary">
                  {listing.seller?.userName} {listing.seller?.userSurname}
                </td>
                <td className="p-6 text-[14px] font-black text-text-primary">
                  ₺{listing.price}
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                    ${listing.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 
                      listing.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      'bg-gray-100 text-text-secondary border-transparent dark:bg-white/10 dark:text-white'}`}>
                    {listing.status === 'ACTIVE' ? t('dashboard.sysop.status_active') : listing.status === 'PENDING' ? t('dashboard.sysop.status_pending') : listing.status === 'REJECTED' ? t('dashboard.sysop.status_rejected') : t('dashboard.sysop.status_passive')}
                  </span>
                </td>
                <td className="p-6 flex justify-end gap-3">
                  {listing.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(listing.listingID, 'ACTIVE')} className="text-[12px] font-black text-success hover:underline uppercase tracking-widest">{t('dashboard.sysop.btn_approve')}</button>
                      <button onClick={() => updateStatus(listing.listingID, 'REJECTED')} className="text-[12px] font-black text-red-500 hover:underline uppercase tracking-widest">{t('dashboard.sysop.btn_reject')}</button>
                    </>
                  )}
                  {listing.status === 'ACTIVE' && (
                    <button onClick={() => updateStatus(listing.listingID, 'PASSIVE')} className="text-[12px] font-black text-text-secondary hover:text-text-primary hover:underline uppercase tracking-widest">{t('dashboard.sysop.btn_deactivate')}</button>
                  )}
                  <button onClick={() => setSelectedListing(listing)} className="text-[12px] font-black text-primary hover:underline uppercase tracking-widest">{t('dashboard.sysop.btn_view_details')}</button>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-[13px] font-bold text-text-secondary">
                  {t('dashboard.sysop.no_listings_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedListing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedListing(null)}></div>
          <div className={`relative rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border bg-white border-border-color dark:bg-[#18181B] dark:border-white/5`}>
            <div className={`p-6 md:p-8 flex items-center justify-between border-b border-border-color dark:border-white/5`}>
              <h3 className="text-2xl font-black text-text-primary tracking-tight">{t('dashboard.sysop.listing_details')}</h3>
              <button onClick={() => setSelectedListing(null)} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all bg-gray-100 text-text-secondary hover:bg-gray-200 dark:bg-white/5 dark:text-text-secondary dark:hover:bg-white/10`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_title')}</h4>
                     <p className="font-black text-[15px] text-text-primary">{selectedListing.title || '-'}</p>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_description')}</h4>
                     <p className="text-[13px] font-medium text-text-secondary leading-relaxed">{selectedListing.description || '-'}</p>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_price')}</h4>
                     <p className="font-black text-primary text-2xl">₺{selectedListing.price}</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_seller')}</h4>
                     <p className="font-black text-[15px] text-text-primary">{selectedListing.seller?.userName} {selectedListing.seller?.userSurname}</p>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_status')}</h4>
                     <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border
                       ${selectedListing.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 
                         selectedListing.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                         'bg-gray-100 text-text-secondary border-transparent dark:bg-white/10 dark:text-white'}`}>
                        {selectedListing.status === 'ACTIVE' ? t('dashboard.sysop.status_active') : selectedListing.status === 'PENDING' ? t('dashboard.sysop.status_pending') : selectedListing.status === 'REJECTED' ? t('dashboard.sysop.status_rejected') : t('dashboard.sysop.status_passive')}
                     </span>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_category_brand')}</h4>
                     <p className="text-[13px] font-bold text-text-secondary">
                        {selectedListing.category?.name || selectedListing.categoryID || t('dashboard.sysop.unknown_category')} - {selectedListing.brand?.name || selectedListing.brand || t('dashboard.sysop.no_brand')}
                     </p>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_condition')}</h4>
                     <p className="text-[13px] font-bold text-text-secondary">{selectedListing.condition || '-'}</p>
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-2">{t('dashboard.sysop.detail_commissions')}</h4>
                     <div className={`text-[12px] text-text-secondary p-4 rounded-2xl border max-h-32 overflow-y-auto bg-gray-50 border-border-color dark:bg-white/5 dark:border-white/5`}>
                       {selectedListing.appliedCommissions && selectedListing.appliedCommissions.length > 0 ? (
                         selectedListing.appliedCommissions.map((group: any, idx: number) => (
                            <div key={idx} className="mb-3 last:mb-0">
                               <div className="font-black text-text-primary mb-1">{group.groupName} ({group.target === 'buyer' ? t('dashboard.sysop.buyer') : t('dashboard.sysop.seller')})</div>
                               {group.items?.map((rule: any, ruleIdx: number) => (
                                  <div key={ruleIdx} className="font-medium flex justify-between ml-2 py-0.5">
                                     <span className="opacity-80">{rule.name}</span>
                                     <span className="font-bold">{rule.type === 'percentage' ? `%${rule.value}` : rule.type === 'fixed' ? `₺${rule.value}` : 'Kademeli'}</span>
                                  </div>
                               ))}
                            </div>
                         ))
                       ) : (
                         <span className="italic opacity-60 font-medium">{t('dashboard.sysop.current_system_commissions')}</span>
                       )}
                     </div>
                   </div>
                </div>
              </div>

              {selectedListing.photos && selectedListing.photos.length > 0 && (
                <div className="pt-4 border-t border-border-color dark:border-white/5">
                  <h4 className="text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-4">{t('dashboard.sysop.detail_photos')}</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {selectedListing.photos.map((photo: any, idx: number) => (
                      <div key={idx} className={`w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-border-color bg-gray-50 dark:border-white/5 dark:bg-white/5`}>
                        <img src={typeof photo === 'string' ? photo : photo.url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`p-6 border-t flex items-center justify-end gap-3 bg-gray-50 border-border-color dark:bg-white/5 dark:border-white/5`}>
               {selectedListing.status === 'PENDING' && (
                 <>
                   <button 
                    onClick={() => { updateStatus(selectedListing.listingID, 'REJECTED'); setSelectedListing({...selectedListing, status: 'REJECTED'}); }} 
                    className={`px-8 h-12 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all text-red-600 bg-red-100 hover:bg-red-200 dark:text-red-500 dark:bg-red-500/10 dark:hover:bg-red-500/20`}
                   >
                     {t('dashboard.sysop.btn_reject')}
                   </button>
                   <button 
                    onClick={() => { updateStatus(selectedListing.listingID, 'ACTIVE'); setSelectedListing({...selectedListing, status: 'ACTIVE'}); }} 
                    className="px-8 h-12 rounded-2xl font-black text-[13px] uppercase tracking-widest text-white bg-green-500 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                   >
                     {t('dashboard.sysop.btn_approve')}
                   </button>
                 </>
               )}
               {selectedListing.status === 'ACTIVE' && (
                 <button 
                  onClick={() => { updateStatus(selectedListing.listingID, 'PASSIVE'); setSelectedListing({...selectedListing, status: 'PASSIVE'}); }} 
                  className={`px-8 h-12 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all text-text-secondary bg-gray-200 hover:bg-gray-300 dark:text-text-primary dark:bg-white/10 dark:hover:bg-white/20`}
                 >
                   {t('dashboard.sysop.btn_deactivate')}
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
