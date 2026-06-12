import React from 'react';
import useSWR from 'swr';
import {ArrowRight01Icon, CustomerSupportIcon, DeliveryBox01Icon} from 'hugeicons-react';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

export default function DisputesBox() {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useSWR(
    token ? [apiUrl('/admin/orders/disputes'), token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const disputes = data?.payload?.disputes || [];

  if (isLoading) {
    return (
      <div className="mb-10">
        <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em] mb-4 px-2">Anlaşmazlıklar & İadeler</h3>
        <div className="h-32 bg-gray-100 dark:bg-white/5 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="mb-10 mt-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <CustomerSupportIcon size={16} />
          </div>
          <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em]">Anlaşmazlıklar & İadeler</h3>
        </div>
        <div className="flex-1 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
            <DeliveryBox01Icon size={24} className="text-gray-400" />
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white mb-1">Sorunsuz İşleyiş</span>
          <span className="text-xs text-gray-500 dark:text-white/50">Şu anda çözüm bekleyen herhangi bir anlaşmazlık veya iade talebi bulunmuyor.</span>
        </div>
      </div>
    );
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case 'return_requested': return 'İade Talebi';
      case 'return_rejected': return 'Reddedildi';
      case 'disputed': return 'Anlaşmazlık (Dispute)';
      default: return status;
    }
  };

  return (
    <div className="mb-10 mt-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
          <CustomerSupportIcon size={16} />
        </div>
        <h3 className="text-xs font-black text-gray-900/40 dark:text-white/40 uppercase tracking-[0.2em]">Anlaşmazlıklar & İadeler</h3>
        <span className="ml-auto bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-blue-500/30">
          {disputes.length} BEKLEYEN
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 pb-4 custom-scrollbar">
        {disputes.map((item: any) => {
          const order = item.order;
          const listing = item.listing;
          const buyer = order?.buyer;
          const seller = item.seller;
          const image = listing?.images?.[0]?.photoUrl || 'https://via.placeholder.com/150';

          return (
            <div key={item.orderItemID} className="bg-white dark:bg-[#121214] border border-gray-100 dark:border-white/5 rounded-2xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              
              {/* Product Image */}
              <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden shrink-0 relative">
                <img 
                  src={image} 
                  alt={listing?.title || 'Ürün görseli'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                  <span className="text-[9px] font-bold text-white truncate w-full" title={listing?.title}>
                    {listing?.title || 'Silinmiş Ürün'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                    item.status === 'disputed' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                    'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                  } uppercase tracking-wider line-clamp-1`}>
                    {translateStatus(item.status)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">
                    Sipariş #{order?.orderID?.split('-')[0] || '?'}
                  </span>
                </div>
                
                <span className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                  Sebep: {item.returnReason || 'Belirtilmedi'}
                </span>
                
                {item.status === 'return_rejected' && item.rejectReason && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 italic mb-1">
                    Satıcı: {item.rejectReason}
                  </span>
                )}

                {/* Parties Info */}
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50 dark:border-white/5">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                      <span className="font-medium text-gray-900 dark:text-white">{buyer?.userName}</span> (Alıcı)
                    </span>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                      <span className="font-medium text-gray-900 dark:text-white">{seller?.userName}</span> (Satıcı)
                    </span>
                  </div>
                  <button className="w-6 h-6 rounded-md bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" title="Çözüme Ulaştır">
                    <ArrowRight01Icon size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
