"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";

export default function ProductApprovalPage() {
  const { t, theme } = useThemeLanguage();
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
        // You could use a toast here if you import a toast manager, but local state update is fine.
      } else {
        alert("Onaylama başarısız: " + (data.request?.requestMessage || "Bilinmeyen hata"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (listingID: string) => {
    const reason = window.prompt("Reddetme sebebini girin (isteğe bağlı):");
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
      } else {
        alert("Reddetme başarısız: " + (data.request?.requestMessage || "Bilinmeyen hata"));
      }
    } catch (e) {
      console.error(e);
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
        <div className="p-12 text-center border-2 border-dashed border-border-color rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-black text-text-primary mb-2">Onay Bekleyen İlan Yok</h3>
          <p className="text-[13px] text-text-secondary font-medium">Şu anda onayınızı bekleyen yeni bir ürün ilanı bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map(listing => (
            <div key={listing.listingID} className={`flex flex-col overflow-hidden rounded-2xl border ${theme === 'light' ? 'bg-white border-border-color' : 'bg-surface border-white/5'} shadow-sm hover:shadow-md transition-shadow`}>
              <div className="relative aspect-[4/5] bg-gray-100 dark:bg-black/20">
                <img 
                  src={getMediaUrl(listing.images?.[0]?.imageUrl || listing.imagePaths?.[0])} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo-favicon.png'; }}
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {listing.price} TL
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-1 text-[11px] font-bold text-primary uppercase tracking-wider">{listing.brand?.name || 'Markasız'}</div>
                <h3 className="text-[14px] font-bold text-text-primary mb-1 line-clamp-1">{listing.title}</h3>
                <p className="text-[12px] text-text-secondary line-clamp-2 mb-4 flex-1">
                  {listing.description || 'Açıklama yok'}
                </p>
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => handleReject(listing.listingID)}
                    className="flex-1 py-2 rounded-xl text-[12px] font-bold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Reddet
                  </button>
                  <button 
                    onClick={() => handleApprove(listing.listingID)}
                    className="flex-1 py-2 rounded-xl text-[12px] font-bold bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm"
                  >
                    Onayla
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
