"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../lib/api";

export default function SysopDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch Stats
      const statsRes = await fetch(apiUrl("/admin/dashboard"), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const statsData = await statsRes.json();
      if (statsData.request?.requestResult) {
        setStats(statsData.payload);
      }

      // Fetch Recent Orders
      const ordersRes = await fetch(apiUrl("/admin/orders?limit=5"), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.request?.requestResult) {
        setRecentOrders(ordersData.payload || []);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: "Toplam Satış", 
      value: `₺${(stats?.totalRevenue || 0).toLocaleString('tr-TR')}`, 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "from-emerald-500/20 to-emerald-500/5",
      textColor: "text-emerald-500"
    },
    { 
      label: "Aktif Kullanıcılar", 
      value: stats?.totalUsers || 0, 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21V19a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "from-blue-500/20 to-blue-500/5",
      textColor: "text-blue-500"
    },
    { 
      label: "Mağaza Sayısı", 
      value: stats?.totalStores || 0, 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V11h6v10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "from-purple-500/20 to-purple-500/5",
      textColor: "text-purple-500"
    },
    { 
      label: "Bekleyen Onaylar", 
      value: stats?.pendingListings || 0, 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "from-orange-500/20 to-orange-500/5",
      textColor: "text-orange-500"
    }
  ];

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[12px] font-black uppercase tracking-widest text-text-secondary">Veriler Hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Hoş geldin, Yönetici 👋</h1>
          <p className="text-text-secondary font-bold text-[14px] mt-1">Platformun genel durumu ve önemli metrikler aşağıdadır.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="p-3 bg-surface border border-border-color rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div 
            key={i}
            className={`p-6 rounded-[2.5rem] bg-gradient-to-br ${card.color} border border-white/10 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-surface flex items-center justify-center ${card.textColor} shadow-lg shadow-black/5`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-widest text-text-secondary/60 mb-1">{card.label}</p>
                <h3 className="text-2xl font-black text-text-primary">{card.value}</h3>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 dark:bg-black/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-surface rounded-[2.5rem] border border-border-color overflow-hidden shadow-sm">
          <div className="p-8 border-b border-border-color flex items-center justify-between">
            <h3 className="text-[16px] font-black text-text-primary uppercase tracking-wider">Son İşlemler</h3>
            <button className="text-[12px] font-black text-primary hover:underline">Tümünü Gör</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-background/50 text-[10px] font-black text-text-secondary/60 uppercase tracking-widest">
                  <th className="px-8 py-4">ID</th>
                  <th className="px-8 py-4">Müşteri</th>
                  <th className="px-8 py-4">Tutar</th>
                  <th className="px-8 py-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-text-secondary text-[12px] font-bold">İşlem kaydı bulunamadı.</td>
                  </tr>
                ) : (
                  recentOrders.map((order: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 text-[13px] font-black text-text-primary">#{order.shortID || order.id?.slice(-6).toUpperCase()}</td>
                      <td className="px-8 py-5 text-[13px] font-bold text-text-secondary">{order.buyer?.userName || 'Anonim'}</td>
                      <td className="px-8 py-5 text-[13px] font-black text-text-primary">₺{order.totalAmount?.toLocaleString('tr-TR')}</td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-white dark:bg-surface rounded-[2.5rem] border border-border-color shadow-sm flex flex-col">
          <div className="p-8 border-b border-border-color">
            <h3 className="text-[16px] font-black text-text-primary uppercase tracking-wider">Hızlı Erişim</h3>
          </div>
          <div className="p-4 space-y-2">
             <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-black text-text-primary">Yeni Kampanya</p>
                  <p className="text-[11px] text-text-secondary font-bold">Kampanya oluştur</p>
                </div>
             </button>
             <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-black text-text-primary">Sistem Raporu</p>
                  <p className="text-[11px] text-text-secondary font-bold">PDF olarak indir</p>
                </div>
             </button>
             <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-black text-text-primary">Bildirim Gönder</p>
                  <p className="text-[11px] text-text-secondary font-bold">Tüm kullanıcılara</p>
                </div>
             </button>
          </div>
          <div className="mt-auto p-8 border-t border-border-color">
            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
               <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-2">Haftalık Hedef</p>
               <div className="flex items-end gap-2 mb-4">
                  <span className="text-3xl font-black text-text-primary">%84</span>
                  <span className="text-[11px] font-bold text-text-secondary mb-1.5">tamamlandı</span>
               </div>
               <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[84%]" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
