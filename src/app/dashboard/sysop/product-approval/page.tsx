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
        showToast("İlan başarıyla onaylandı.", "success");
      } else {
        showToast("Onaylama başarısız: " + (data.request?.requestMessage || "Bilinmeyen hata"), "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Bir hata oluştu", "error");
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
        showToast("İlan başarıyla reddedildi.", "success");
      } else {
        showToast("Reddetme başarısız: " + (data.request?.requestMessage || "Bilinmeyen hata"), "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Bir hata oluştu", "error");
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
              <div className="relative aspect-[4/3] bg-gray-100 dark:bg-black/20">
                <img 
                  src={getMediaUrl(listing.images?.[0]?.imageUrl || listing.imagePaths?.[0])} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo-favicon.png'; }}
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[12px] font-black px-3 py-1 rounded-full shadow-lg border border-white/10">
                  {listing.price} TL
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                {/* Seller Info */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[12px] font-black text-primary border border-primary/20 shrink-0">
                    {listing.seller?.userName?.[0] || 'U'}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[13px] font-black text-text-primary truncate">
                      {listing.seller?.userName} {listing.seller?.userSurname}
                    </span>
                    <span className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest truncate">
                      {listing.seller?.eMail || 'Kullanıcı'}
                    </span>
                  </div>
                </div>

                {/* Brand & Title */}
                <div>
                  <div className="text-[11px] font-black text-primary uppercase tracking-widest mb-0.5">{listing.brand?.name || 'Markasız'}</div>
                  <h3 className="text-[15px] font-bold text-text-primary line-clamp-1">{listing.title}</h3>
                </div>

                {/* Description */}
                <p className="text-[12px] text-text-secondary line-clamp-2 leading-relaxed">
                  {listing.description || 'İlan açıklaması girilmemiş.'}
                </p>

                {/* Details Badges */}
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-black text-text-secondary uppercase tracking-wider">{listing.condition || 'YENİ'}</span>
                  {listing.size && <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-black text-text-secondary uppercase tracking-wider">{listing.size}</span>}
                  {listing.gender && <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-black text-text-secondary uppercase tracking-wider">{listing.gender}</span>}
                  {listing.category && <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-black text-text-secondary uppercase tracking-wider">{listing.category?.name || 'Kategori'}</span>}
                </div>

                {/* Shipping Info */}
                <div className="p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl flex flex-col mt-auto mb-2 border border-blue-100 dark:border-blue-500/10">
                  <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.15em] mb-1">Kargo Teslimat Bilgisi</span>
                  <span className="text-[12px] font-bold text-text-primary">
                    {listing.shippingPayer === 'seller' ? 'Satıcı Öder (Ücretsiz Kargo)' : `Alıcı Öder — ${listing.shippingPrice ? `${listing.shippingPrice} TL` : 'Fiyat Belirsiz'}`}
                  </span>
                  {listing.shippingCompany && (
                    <span className="text-[11px] font-medium text-text-secondary mt-1">
                      Kargo Firması: <span className="font-bold text-text-primary">{listing.shippingCompany.name}</span>
                    </span>
                  )}
                  {listing.packageSize && (
                    <span className="text-[10px] text-text-secondary/60 mt-0.5">
                      Paket Boyutu: {listing.packageSize} Desi
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-2 border-t border-border-color">
                  <button 
                    onClick={() => handleReject(listing.listingID)}
                    className="flex-1 py-3 rounded-xl text-[13px] font-black border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all uppercase tracking-widest"
                  >
                    Reddet
                  </button>
                  <button 
                    onClick={() => handleApprove(listing.listingID)}
                    className="flex-1 py-3 rounded-xl text-[13px] font-black bg-green-500 text-white hover:bg-green-600 active:scale-95 shadow-lg shadow-green-500/20 transition-all uppercase tracking-widest"
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
