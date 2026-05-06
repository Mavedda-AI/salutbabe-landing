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
      value: `${(stats?.totalRevenue || 0).toLocaleString('tr-TR')} ₺`,
      textColor: "text-emerald-500"
    },
    {
      label: "Aktif Kullanıcılar",
      value: stats?.totalUsers || 0,
      textColor: "text-blue-500"
    },
    {
      label: "Mağaza Sayısı",
      value: stats?.totalStores || 0,
      textColor: "text-purple-500"
    },
    {
      label: "Bekleyen Onaylar",
      value: stats?.pendingListings || 0,
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
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-[2rem] bg-surface border border-border-color shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20`}
          >
            <div className="flex flex-col h-full">
              <p className="text-[12px] font-black uppercase tracking-widest text-text-secondary/60 mb-3">{card.label}</p>
              <div className="w-full h-[1px] bg-border-color mb-5" />
              <div className="mt-auto">
                <h3 className={`text-2xl font-black ${card.textColor}`}>{card.value}</h3>
              </div>
            </div>
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
                      <td className="px-8 py-5 text-[13px] font-black text-text-primary">{order.totalAmount?.toLocaleString('tr-TR')} ₺</td>
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
        </div>
      </div>
    </div>
  );
}
