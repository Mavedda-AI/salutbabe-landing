"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";
import {useAdminStore} from "../../../../store/useAdminStore";

export default function ProductApprovalPage() {
  const { t, theme } = useThemeLanguage();
  const { showToast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<{ id: string, direction: 'left' | 'right' } | null>(null);

  const setPendingListingCount = useAdminStore(state => state.setPendingListingCount);
  const layoutMode = useAdminStore(state => state.layoutMode);

  useEffect(() => {
    setPendingListingCount(listings.length);
  }, [listings, setPendingListingCount]);

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
    if (actionState) return; // Prevent multi-clicks
    setActionState({ id: listingID, direction: 'right' });
    
    setTimeout(async () => {
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
      } finally {
        setActionState(null);
      }
    }, 350); // wait for CSS slide animation
  };

  const handleReject = async (listingID: string) => {
    if (actionState) return;
    const reason = window.prompt(t('dashboard.sysop.prompt_reject_reason'));
    if (reason === null) return;
    
    setActionState({ id: listingID, direction: 'left' });
    
    setTimeout(async () => {
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
      } finally {
        setActionState(null);
      }
    }, 350);
  };

  const getMediaUrl = (url: string | null) => {
    if (!url) return "/logo-favicon.png";
    if (url.startsWith("http")) return url;
    const cleaned = url.startsWith("/") ? url.substring(1) : url;
    return `${API_BASE_URL}/${cleaned}`;
  };

  const renderCardInner = (listing: any, index: number, isGrid: boolean) => (
    <>
      {/* Index Badge */}
      <div className="absolute top-0 right-0 bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] font-black px-3 py-1 rounded-bl-2xl z-10 shadow-sm border-b border-l border-gray-900 dark:border-white">
        {listings.length} İlandan #{index + 1}
      </div>

      {/* Image Section */}
      <div className={`relative ${isGrid ? 'h-56 w-full' : 'h-64 sm:h-auto sm:w-64'} shrink-0 p-3 bg-gray-50 dark:bg-black/20`}>
        <div className="w-full h-full relative rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-100/50 dark:bg-[#0B0C10]">
          <img 
            src={getMediaUrl(listing.images?.[0]?.imageUrl || listing.imagePaths?.[0])} 
            alt={listing.title} 
            className="absolute inset-0 w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo-favicon.png'; }}
          />
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-[12px] font-black px-3 py-1.5 rounded-xl">
            {listing.price} TL
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header: User & Brand */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[13px] font-black text-gray-900 dark:text-white">
              {listing.seller?.userName?.[0] || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-gray-900 dark:text-white leading-tight">
                {listing.seller?.userName} {listing.seller?.userSurname}
              </span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                {listing.seller?.eMail || t('dashboard.sysop.anonymous')}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-white/10 px-2 py-1 rounded-lg">
            {listing.brand?.name || t('dashboard.sysop.no_brand')}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{listing.title}</h3>
        <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {listing.description || t('dashboard.sysop.no_desc')}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">{listing.condition || t('dashboard.sysop.condition_new')}</span>
          {listing.size && <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">{listing.size}</span>}
          {listing.gender && <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">{listing.gender}</span>}
          {listing.category && <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">{listing.category?.name || t('dashboard.sysop.category')}</span>}
        </div>

        <div className="mt-auto flex gap-3">
          <button 
            onClick={() => handleReject(listing.listingID)}
            className="flex-1 h-11 rounded-xl text-[12px] font-black transition-all uppercase tracking-widest border-2 border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:border-gray-800 dark:text-gray-400 dark:hover:border-red-500 dark:hover:text-red-400 dark:hover:bg-red-500/10"
          >
            {t('dashboard.sysop.btn_reject')}
          </button>
          <button 
            onClick={() => handleApprove(listing.listingID)}
            className="flex-1 h-11 rounded-xl text-[12px] font-black transition-all uppercase tracking-widest bg-gray-900 text-white hover:bg-black hover:scale-[1.02] shadow-md dark:bg-white dark:text-black dark:hover:bg-gray-100"
          >
            {t('dashboard.sysop.btn_approve')}
          </button>
        </div>
      </div>
    </>
  );

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
      ) : layoutMode === 'single' ? (
        <div className="relative w-full max-w-4xl mx-auto h-[650px] sm:h-[500px] flex items-center justify-center perspective-[2000px] mt-8 mb-12">
          {listings.slice(0, 3).reverse().map((listing) => {
            const actualIndex = listings.findIndex(l => l.listingID === listing.listingID);
            const isAnimatingOut = actionState?.id === listing.listingID;
            
            let transform = 'translateY(0) scale(1)';
            let zIndex = 50 - actualIndex;
            let opacity = 1;
            
            if (actualIndex === 1) {
               transform = 'translateY(32px) scale(0.95)';
               opacity = 0.9;
            } else if (actualIndex === 2) {
               transform = 'translateY(64px) scale(0.90)';
               opacity = 0.5;
            }

            if (isAnimatingOut) {
               const dir = actionState.direction === 'right' ? 1 : -1;
               transform = `translateX(${dir * 120}%) rotate(${dir * 10}deg)`;
               opacity = 0;
            }

            return (
              <div 
                key={listing.listingID}
                className="absolute w-full max-w-3xl transition-all duration-300 ease-out"
                style={{ transform, zIndex, opacity }}
              >
                <div className="relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12141C] shadow-2xl">
                  {renderCardInner(listing, actualIndex, false)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`grid gap-6 ${layoutMode === 'double' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {listings.map((listing, index) => {
            const isAnimatingOut = actionState?.id === listing.listingID;
            const opacity = isAnimatingOut ? 0 : 1;
            const scale = isAnimatingOut ? 0.95 : 1;
            const isGrid = layoutMode === 'grid';
            
            return (
              <div 
                key={listing.listingID} 
                className={`relative flex ${isGrid ? 'flex-col' : 'flex-col sm:flex-row'} overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12141C] shadow-sm hover:shadow-lg transition-all duration-300`}
                style={{ opacity, transform: `scale(${scale})` }}
              >
                {renderCardInner(listing, index, isGrid)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
