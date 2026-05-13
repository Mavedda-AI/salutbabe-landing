"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

interface Order {
  orderID: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  buyer: { userName: string; userSurname: string; eMail: string; };
  seller: { userName: string; userSurname: string; eMail: string; };
}

export default function OrderManagementPage() {
  const { theme, t, language } = useThemeLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (p = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/admin/orders?page=${p}&limit=20`), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.payload) {
        setOrders(data.payload.orders || []);
        setTotalPages(data.payload.totalPages || 1);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
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
        <h2 className="text-lg font-black text-text-primary uppercase tracking-widest">{t('dashboard.orders.title') || 'Sipariş Yönetimi'}</h2>
        <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'bg-gray-50 text-text-secondary' : 'bg-white/5 text-text-secondary'}`}>
          {orders.length} {t('dashboard.orders.total') || 'Sipariş'}
        </span>
      </div>

      {/* Desktop Table */}
      <div className={`hidden md:block rounded-[2.5rem] border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-100 shadow-xl shadow-gray-200/50' : 'bg-surface border-white/5 shadow-2xl'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={theme === 'light' ? 'bg-gray-50/50' : 'bg-white/5'}>
                <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_order_id')}</th>
                <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_buyer')}</th>
                <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_seller')}</th>
                <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_amount')}</th>
                <th className="px-6 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.orders.table_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {orders.map((order) => (
                <tr key={order.orderID} className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-text-primary text-sm">#{order.orderID.split('-')[0].toUpperCase()}</span>
                      <span className="text-[10px] font-bold text-text-secondary opacity-60">
                        {new Date(order.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-primary text-sm">{order.buyer?.userName} {order.buyer?.userSurname}</span>
                      <span className="text-[11px] font-medium text-text-secondary opacity-60">{order.buyer?.eMail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-primary text-sm">{order.seller?.userName} {order.seller?.userSurname}</span>
                      <span className="text-[11px] font-medium text-text-secondary opacity-60">{order.seller?.eMail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-primary">{parseFloat(order.totalAmount.toString()).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} ₺</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.length === 0 && (
          <div className={`p-12 text-center rounded-[2rem] border-2 border-dashed ${theme === 'light' ? 'bg-gray-50 border-border-color' : 'bg-white/5 border-white/5'}`}>
            <p className="text-[13px] font-bold text-text-secondary">{t('dashboard.sysop.no_records')}</p>
          </div>
        )}
        {orders.map((order) => (
          <div key={order.orderID} className={`p-5 rounded-[2rem] border ${theme === 'light' ? 'bg-white border-border-color shadow-sm' : 'bg-[#121214]/60 border-white/5'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-black text-text-primary">#{order.orderID.split('-')[0].toUpperCase()}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-text-secondary/50 uppercase tracking-wider">{t('dashboard.orders.table_buyer')}</span>
                <span className="font-bold text-text-primary">{order.buyer?.userName} {order.buyer?.userSurname}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-text-secondary/50 uppercase tracking-wider">{t('dashboard.orders.table_seller')}</span>
                <span className="font-bold text-text-primary">{order.seller?.userName} {order.seller?.userSurname}</span>
              </div>
              <div className={`flex items-center justify-between pt-3 border-t ${theme === 'light' ? 'border-border-color' : 'border-white/5'}`}>
                <span className="text-[11px] font-black text-text-secondary/50 uppercase tracking-wider">{t('dashboard.orders.table_amount')}</span>
                <span className="font-black text-primary text-lg">{parseFloat(order.totalAmount.toString()).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} ₺</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="w-12 h-12 rounded-xl border border-border-color flex items-center justify-center text-text-secondary disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-[13px] font-black text-text-primary uppercase tracking-widest">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="w-12 h-12 rounded-xl border border-border-color flex items-center justify-center text-text-secondary disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
