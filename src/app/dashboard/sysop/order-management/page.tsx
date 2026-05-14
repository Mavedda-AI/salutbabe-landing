"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

interface Order {
  orderID: string;
  totalAmount: number;
  status: string;
  createdAt: string;
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

      if (token === "mock_token" || !token) {
        setTimeout(() => {
          setOrders([
            { orderID: "ORD-94A1XYZ", buyer: { userName: "Ayşe", userSurname: "Yılmaz", eMail: "ayse@example.com" }, seller: { userName: "Boutique", userSurname: "Kids", eMail: "boutique@example.com" }, totalAmount: 1450, status: "Tamamlandı", createdAt: new Date().toISOString() },
            { orderID: "ORD-82B3ABC", buyer: { userName: "Mehmet", userSurname: "Demir", eMail: "mehmet@example.com" }, seller: { userName: "Moda", userSurname: "Bebek", eMail: "moda@example.com" }, totalAmount: 3200.75, status: "Kargoda", createdAt: new Date(Date.now() - 86400000).toISOString() },
            { orderID: "ORD-71C5DEF", buyer: { userName: "Zeynep", userSurname: "Kaya", eMail: "zeynep@example.com" }, seller: { userName: "Şirin", userSurname: "Oyuncak", eMail: "sirin@example.com" }, totalAmount: 850, status: "Bekliyor", createdAt: new Date(Date.now() - 172800000).toISOString() },
            { orderID: "ORD-60D7GHI", buyer: { userName: "Canan", userSurname: "Öz", eMail: "canan@example.com" }, seller: { userName: "Mini", userSurname: "Aya", eMail: "mini@example.com" }, totalAmount: 5400, status: "Tamamlandı", createdAt: new Date(Date.now() - 259200000).toISOString() },
            { orderID: "ORD-55E8JKL", buyer: { userName: "Ali", userSurname: "Veli", eMail: "ali@example.com" }, seller: { userName: "Bebek", userSurname: "Dostu", eMail: "dostu@example.com" }, totalAmount: 120, status: "İptal Edildi", createdAt: new Date(Date.now() - 345600000).toISOString() },
            { orderID: "ORD-44F9MNO", buyer: { userName: "Esra", userSurname: "Gül", eMail: "esra@example.com" }, seller: { userName: "Kids", userSurname: "World", eMail: "world@example.com" }, totalAmount: 2100, status: "Kargoda", createdAt: new Date(Date.now() - 432000000).toISOString() },
          ]);
          setTotalPages(1);
          setLoading(false);
        }, 400);
        return;
      }

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
      case 'paid':
      case 'tamamlandı': return 'bg-success/10 text-success border-success/20';
      case 'shipped':
      case 'kargoda': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled':
      case 'i̇ptal edildi':
      case 'iptal edildi': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'bekliyor': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) return <div className="p-8 text-center">{t('dashboard.sysop.loading_data')}</div>;

  return (
    <div className="space-y-8 animate-fade-in">

      <div className={`rounded-[1.5rem] md:rounded-[2.5rem] border overflow-hidden ${theme === 'light' ? 'bg-white border-gray-100 shadow-xl shadow-gray-200/50' : 'bg-surface border-white/5 shadow-2xl'}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={theme === 'light' ? 'bg-gray-50/50' : 'bg-white/5'}>
                <th className="px-6 md:px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] whitespace-nowrap">{t('dashboard.orders.table_order_id')}</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] whitespace-nowrap">{t('dashboard.orders.table_buyer')}</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] whitespace-nowrap">{t('dashboard.orders.table_seller')}</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] whitespace-nowrap">{t('dashboard.orders.table_amount')}</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] whitespace-nowrap">{t('dashboard.orders.table_status')}</th>
                <th className="px-6 md:px-8 py-5 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right whitespace-nowrap">{t('dashboard.sysop.table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {orders.map((order) => (
              <tr key={order.orderID} className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-black text-text-primary">#{order.orderID.split('-')[0].toUpperCase()}</span>
                    <span className="text-[10px] font-bold text-text-secondary opacity-60">
                      {new Date(order.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex flex-col">
                    <span className="font-bold text-text-primary">{order.buyer?.userName} {order.buyer?.userSurname}</span>
                    <span className="text-[11px] font-medium text-text-secondary opacity-60">{order.buyer?.eMail}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex flex-col">
                    <span className="font-bold text-text-primary">{order.seller?.userName} {order.seller?.userSurname}</span>
                    <span className="text-[11px] font-medium text-text-secondary opacity-60">{order.seller?.eMail}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="font-black text-primary">{parseFloat(order.totalAmount.toString()).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} ₺</span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                   <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-text-secondary hover:text-primary transition-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
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
