"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";

export default function ProductApprovalPage() {
  const { t, theme } = useThemeLanguage();
  const { showToast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingListings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/listings/admin/pending?page=1&limit=50"), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setListings(data.payload?.products || data.payload?.rows || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const handleApprove = async (listingID: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/listings/${listingID}/approve`), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setListings(prev => prev.filter(l => l.listingID !== listingID));
        showToast(t('dashboard.sysop.approve_success'), "success");
      } else {
        showToast(t('dashboard.sysop.approve_failed') + " " + (data.request?.requestMessage || t('dashboard.sysop.unknown_error')), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t('dashboard.sysop.error_occurred'), "error");
    }
  };

  const handleReject = async (listingID: string) => {
    const reason = window.prompt(t('dashboard.sysop.prompt_reject_reason'));
    if (reason === null) return; // User cancelled
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl(`/listings/${listingID}/reject`), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setListings(prev => prev.filter(l => l.listingID !== listingID));
        showToast(t('dashboard.sysop.reject_success'), "success");
      } else {
        showToast(t('dashboard.sysop.reject_failed') + " " + (data.request?.requestMessage || t('dashboard.sysop.unknown_error')), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t('dashboard.sysop.error_occurred'), "error");
    }
  };

  const getMediaUrl = (url: string | null) => {
    if (!url) return "/logo-favicon.png";
    if (url.startsWith("http")) return url;
    const cleaned = url.startsWith("/") ? url.substring(1) : url;
    return `${API_BASE_URL}/${cleaned}`;
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className={`p-12 text-center border-2 border-dashed rounded-[2.5rem] transition-all border-border-color bg-gray-50/50 dark:border-white/5 dark:bg-white/[0.02]`}>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary dark:shadow-[0_0_30px_rgba(95,200,192,0.1)]`}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">{t('dashboard.sysop.no_pending_listings')}</h3>
          <p className="text-[14px] text-text-secondary font-bold">{t('dashboard.sysop.no_pending_listings_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map(listing => (
            <div key={listing.listingID} className={`flex flex-col overflow-hidden rounded-[2.5rem] border transition-all duration-300 hover:-translate-y-1 bg-white border-border-color shadow-sm hover:shadow-xl hover:border-primary/20 dark:bg-[#12141C]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-2xl dark:hover:bg-[#121214] dark:hover:border-white/10`}>
              <div className="relative h-48 sm:h-56 w-full bg-gray-100 dark:bg-black/20 shrink-0">
                <img 
                  src={getMediaUrl(listing.images?.[0]?.imageUrl || listing.imagePaths?.[0])} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo-favicon.png'; }}
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[13px] font-black px-4 py-1.5 rounded-full shadow-lg border border-white/10">
                  {listing.price} TL
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Seller Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-black shrink-0 bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary dark:border dark:border-primary/20 dark:shadow-[0_0_15px_rgba(95,200,192,0.1)]`}>
                    {listing.seller?.userName?.[0] || 'U'}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[14px] font-black text-text-primary truncate">
                      {listing.seller?.userName} {listing.seller?.userSurname}
                    </span>
                    <span className="text-[11px] font-bold text-text-secondary/60 uppercase tracking-widest truncate">
                      {listing.seller?.eMail || t('dashboard.sysop.anonymous')}
                    </span>
                  </div>
                </div>

                {/* Brand & Title */}
                <div>
                  <div className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">{listing.brand?.name || t('dashboard.sysop.no_brand')}</div>
                  <h3 className="text-[16px] font-bold text-text-primary line-clamp-1">{listing.title}</h3>
                </div>

                {/* Description */}
                <p className="text-[13px] font-medium text-text-secondary line-clamp-2 leading-relaxed">
                  {listing.description || t('dashboard.sysop.no_desc')}
                </p>

                {/* Details Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-100 text-text-secondary dark:bg-white/5 dark:text-text-secondary`}>{listing.condition || t('dashboard.sysop.condition_new')}</span>
                  {listing.size && <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-100 text-text-secondary dark:bg-white/5 dark:text-text-secondary`}>{listing.size}</span>}
                  {listing.gender && <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-100 text-text-secondary dark:bg-white/5 dark:text-text-secondary`}>{listing.gender}</span>}
                  {listing.category && <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-100 text-text-secondary dark:bg-white/5 dark:text-text-secondary`}>{listing.category?.name || t('dashboard.sysop.category')}</span>}
                </div>

                {/* Shipping Info */}
                <div className={`p-4 rounded-2xl flex flex-col mt-auto mb-2 border bg-blue-50/50 border-blue-100 dark:bg-blue-500/5 dark:border-blue-500/10`}>
                  <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.15em] mb-1.5">{t('dashboard.sysop.shipping_info')}</span>
                  <span className="text-[13px] font-black text-text-primary">
                    {listing.shippingPayer === 'seller' ? t('dashboard.sysop.shipping_seller_pays') : `${t('dashboard.sysop.shipping_buyer_pays')} — ${listing.shippingPrice ? `${listing.shippingPrice} TL` : t('dashboard.sysop.price_unknown')}`}
                  </span>
                  {listing.shippingCompany && (
                    <span className="text-[12px] font-medium text-text-secondary mt-1">
                      {t('dashboard.sysop.shipping_company')} <span className="font-bold text-text-primary">{listing.shippingCompany.name}</span>
                    </span>
                  )}
                  {listing.packageSize && (
                    <span className="text-[11px] font-bold text-text-secondary/60 mt-1">
                      {t('dashboard.sysop.package_size')} {listing.packageSize} {t('dashboard.sysop.desi')}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border-color">
                  <button 
                    onClick={() => handleReject(listing.listingID)}
                    className={`flex-1 h-12 rounded-2xl text-[13px] font-black transition-all uppercase tracking-widest bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20`}
                  >
                    {t('dashboard.sysop.btn_reject')}
                  </button>
                  <button 
                    onClick={() => handleApprove(listing.listingID)}
                    className="flex-1 h-12 rounded-2xl text-[13px] font-black bg-green-500 text-white hover:bg-green-600 active:scale-95 shadow-lg shadow-green-500/20 transition-all uppercase tracking-widest"
                  >
                    {t('dashboard.sysop.btn_approve')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
