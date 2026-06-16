"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl, API_BASE_URL} from "../../../../lib/api";

interface Order {
  orderID: string;
  totalAmount: number;
  status: string;
  orderDate?: string;
  createdAt: string;
  updatedAt?: string;
  deliveredAt?: string | number;
  shippedAt?: string | number;
  deliveryConfirmedAt?: string | number;
  buyer: {
    userName: string;
    userSurname: string;
    eMail: string;
  };
  seller: {
    userName: string;
    userSurname: string;
    eMail: string;
  };
  shippingPrice?: number;
  shippingCost?: number;
  items?: {
    itemID: string;
    quantity: number;
    priceAtTime: number;
    subtotal: number;
    listing?: {
      title: string;
      images?: { imageURL: string }[];
    };
  }[];
}

const translateStatus = (status: string) => {
  if (!status) return 'BİLİNMİYOR';
  switch (status.toLowerCase()) {
    case 'processing': return 'İşleniyor';
    case 'delivered': return 'Teslim Edildi';
    case 'shipped': return 'Kargoya Verildi';
    case 'completed': return 'Tamamlandı';
    case 'cancelled': return 'İptal Edildi';
    case 'pending_payment': return 'Ödeme Bekleniyor';
    case 'shared_for_payment': return 'Ödeme Paylaşıldı';
    case 'paid': return 'Ödendi';
    case 'refunded': return 'İade Edildi';
    case 'pending': return 'Bekliyor';
    case 'approved': return 'Onaylandı';
    case 'rejected': return 'Reddedildi';
    case 'active': return 'Aktif';
    default: return status;
  }
};

export default function OrderManagementPage() {
  const { theme, t, language } = useThemeLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async (p = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/admin/orders?page=${p}&limit=20`), {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.payload) {
        setOrders(data.payload.orders);
        setTotalPages(data.payload.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-success/10 text-success border-success/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'shared_for_payment': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) return <div className="p-8 text-center">{t('dashboard.sysop.loading_data')}</div>;

  return (
    <div className="space-y-8 animate-fade-in">

      <div className={`rounded-[2.5rem] border overflow-x-auto bg-white border-gray-100 shadow-xl shadow-gray-200/50 dark:bg-[#12141C] dark:border-white/5 dark:shadow-2xl`}>
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className='bg-gray-50/50 dark:bg-white/5'>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_order_id')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_buyer')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_seller')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_amount')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_status')}</th>
              <th className="px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right">{t('dashboard.sysop.table_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.orderID;
              const productTotal = order.items?.reduce((acc, item) => acc + (Number(item.subtotal) || (Number(item.priceAtTime) * Number(item.quantity))), 0) || 0;
              const shippingFee = Number(order.shippingPrice || order.shippingCost) || Math.max(0, Number(order.totalAmount) - productTotal);
              const commission = productTotal * 0.15;
              const sellerNet = productTotal - commission;
              const displayDate = order.deliveredAt || order.shippedAt || order.updatedAt || order.createdAt || (order as any).orderDate || Date.now();

              return (
              <React.Fragment key={order.orderID}>
                <tr 
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.orderID)}
                  className={`transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 ${isExpanded ? 'bg-gray-50 dark:bg-white/5' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-text-primary whitespace-nowrap">#{order.orderID.split('-')[0].toUpperCase()}</span>
                      <div className="flex flex-col gap-0.5 mt-0.5 text-[10px] font-bold">
                        <span className="text-text-secondary opacity-60 whitespace-nowrap">
                          Sipariş: {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')} {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {(order.deliveredAt || order.shippedAt || (order.updatedAt && Math.abs(new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime()) > 60000)) && (
                        <span className={`whitespace-nowrap ${order.status?.toLowerCase() === 'delivered' ? "text-emerald-500 opacity-80" : "text-blue-500 opacity-80"}`}>
                          {order.status?.toLowerCase() === 'delivered' ? 'Teslim:' : 'Güncel:'} {new Date(order.deliveredAt || order.shippedAt || order.updatedAt || Date.now()).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')} {new Date(order.deliveredAt || order.shippedAt || order.updatedAt || Date.now()).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        )}
                        {order.deliveryConfirmedAt ? (
                        <span className="text-gray-900 dark:text-white opacity-80 whitespace-nowrap">
                          Alıcı Onay: {new Date(Number(order.deliveryConfirmedAt)).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')} {new Date(Number(order.deliveryConfirmedAt)).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        ) : order.status?.toLowerCase() === 'completed' ? (
                        <span className="text-gray-900 dark:text-white opacity-80">
                          Alıcı Onay: <span className="opacity-60 italic">Otomatik / Sistem</span>
                        </span>
                        ) : order.status?.toLowerCase() === 'delivered' ? (
                        <span className="text-gray-900 dark:text-white opacity-80">
                          Alıcı Onay: <span className="opacity-60 italic">Bekleniyor</span>
                        </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                      <span className="font-bold text-text-primary whitespace-nowrap">{order.buyer?.userName} {order.buyer?.userSurname}</span>
                      <span className="text-[11px] font-medium text-text-secondary opacity-60 whitespace-nowrap">{order.buyer?.eMail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                      <span className="font-bold text-text-primary whitespace-nowrap">{order.seller?.userName} {order.seller?.userSurname}</span>
                      <span className="text-[11px] font-medium text-text-secondary opacity-60 whitespace-nowrap">{order.seller?.eMail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-primary whitespace-nowrap">{parseFloat(order.totalAmount.toString()).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} ₺</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${getStatusColor(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className={`p-2.5 rounded-xl transition-all ${isExpanded ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 dark:bg-white/5 text-text-secondary hover:text-primary hover:bg-primary/10'}`}>
                        {isExpanded ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                     </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-gray-50/50 dark:bg-white-[0.02] border-b border-gray-200 dark:border-white/10">
                    <td colSpan={6} className="px-8 py-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Sol Kısım: Ürünler */}
                        <div className="lg:col-span-2 space-y-4">
                          <h4 className="text-[11px] font-black text-text-secondary/60 uppercase tracking-[0.2em] mb-4">Siparişteki Ürünler</h4>
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={item.itemID || idx} className="flex items-center gap-4 bg-white dark:bg-[#12141C] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                  {item.listing?.images?.[0]?.imageURL ? (
                                    <img 
                                      src={item.listing.images[0].imageURL.startsWith('http') ? item.listing.images[0].imageURL : `${API_BASE_URL}/uploads/listings/${item.listing.images[0].imageURL.split('/').pop()}`} 
                                      alt="Product" 
                                      className="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10" 
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (target.src !== '/logo-favicon.png') {
                                          target.src = '/logo-favicon.png';
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-text-secondary/40 border border-gray-200 dark:border-white/10">
                                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h5 className="font-bold text-text-primary text-[14px] line-clamp-1">{item.listing?.title || 'Bilinmeyen Ürün'}</h5>
                                    <p className="text-[12px] text-text-secondary/70 mt-1">{item.quantity} Adet x {item.priceAtTime} ₺</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-black text-primary text-lg">{item.subtotal || (item.priceAtTime * item.quantity)} ₺</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-white dark:bg-[#12141C] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <div>
                                  <h5 className="font-bold text-text-primary">Fiziksel Ürün veya Gizli İlan</h5>
                                  <p className="text-[11px] text-text-secondary/70">Bu siparişteki ilan detayı API tarafından kısıtlanmış olabilir.</p>
                                </div>
                              </div>
                              <span className="font-black text-primary text-xl">{productTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                          )}
                        </div>

                        {/* Sağ Kısım: Finansal Dağılım */}
                        <div>
                          <h4 className="text-[11px] font-black text-text-secondary/60 uppercase tracking-[0.2em] mb-4">Finansal Dağılım</h4>
                          <div className="bg-white dark:bg-[#12141C] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                            
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-bold text-text-secondary">Ürünler Toplamı</span>
                              <span className="text-[13px] font-black text-text-primary">{productTotal.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-bold text-text-secondary">Kargo Ücreti</span>
                              <span className="text-[13px] font-black text-text-primary">{shippingFee.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                            </div>

                            <div className="w-full h-px bg-gray-100 dark:bg-white/10" />

                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-bold text-primary">Alıcıdan Tahsil Edilen</span>
                              <span className="text-[15px] font-black text-primary">{Number(order.totalAmount).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                            </div>

                            <div className="w-full h-px bg-gray-100 dark:bg-white/10" />

                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-bold text-red-500">Platform Komisyonu (%15)</span>
                              <span className="text-[13px] font-black text-red-500">-{commission.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                            </div>

                            <div className="flex justify-between items-center bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                              <span className="text-[12px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider">Satıcıya Aktarılacak</span>
                              <span className="text-[16px] font-black text-green-600 dark:text-green-400">{sellerNet.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                            </div>

                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="w-12 h-12 rounded-xl border border-border-color flex items-center justify-center text-text-secondary disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-[13px] font-black text-text-primary uppercase tracking-widest">{page} / {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="w-12 h-12 rounded-xl border border-border-color flex items-center justify-center text-text-secondary disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
