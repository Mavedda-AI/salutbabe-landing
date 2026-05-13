"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../lib/api";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
import Link from "next/link";

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
        let ordersArray = [];
        if (Array.isArray(ordersData.payload)) {
          ordersArray = ordersData.payload;
        } else if (ordersData.payload && typeof ordersData.payload === 'object') {
          ordersArray = ordersData.payload.data || ordersData.payload.results || ordersData.payload.orders || [];
        }
        setRecentOrders(Array.isArray(ordersArray) ? ordersArray : []);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const { t, theme, language } = useThemeLanguage();

  const statCards = [
    {
      label: t('dashboard.sysop.stats_total_sales'),
      value: `${(stats?.totalRevenue || 0).toLocaleString('tr-TR')} ₺`,
      textColor: "text-emerald-500",
      href: "/dashboard/sysop/order-management"
    },
    {
      label: t('dashboard.sysop.stats_active_users'),
      value: stats?.totalUsers || 0,
      textColor: "text-blue-500",
      href: "/dashboard/sysop/user-management"
    },
    {
      label: t('dashboard.sysop.stats_total_stores'),
      value: stats?.totalStores || 0,
      textColor: "text-purple-500",
      href: "/dashboard/sysop/store-management"
    },
    {
      label: t('dashboard.sysop.stats_pending_approvals'),
      value: stats?.pendingListings || 0,
      textColor: "text-orange-500",
      href: "/dashboard/sysop/product-management"
    }
  ];

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[12px] font-black uppercase tracking-widest text-text-secondary">{t('dashboard.sysop.loading_data')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <Link
            href={card.href}
            key={i}
            className={`group p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block cursor-pointer
              ${theme === 'light' 
                ? 'bg-surface border-border-color shadow-sm hover:border-primary/20' 
                : 'bg-[#121214]/80 backdrop-blur-xl border-white/5 shadow-2xl hover:bg-[#121214] hover:border-white/10'}`}
          >
            <div className="flex flex-col h-full">
               <p className={`text-[12px] font-black uppercase tracking-widest mb-3 ${theme === 'light' ? 'text-text-secondary/60' : 'text-text-secondary/80'}`}>{card.label}</p>
              <div className={`w-full h-[1px] mb-5 ${theme === 'light' ? 'bg-border-color' : 'bg-white/5'}`} />
              <div className="mt-auto flex items-center justify-between">
                <h3 className={`text-2xl font-black ${card.textColor}`}>{card.value}</h3>
                <div className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className={`lg:col-span-2 rounded-[2.5rem] border overflow-hidden transition-all duration-300
          ${theme === 'light' 
            ? 'bg-white border-border-color shadow-sm' 
            : 'bg-[#121214]/80 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
          <div className="p-8 border-b border-border-color flex items-center justify-between">
            <h3 className="text-[16px] font-black text-text-primary uppercase tracking-wider">{t('dashboard.sysop.recent_transactions')}</h3>
            <button className="text-[12px] font-black text-primary hover:underline">{t('dashboard.sysop.view_all')}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-background/50 text-[10px] font-black text-text-secondary/60 uppercase tracking-widest">
                  <th className="px-8 py-4">{t('dashboard.sysop.table_id')}</th>
                  <th className="px-8 py-4">{t('dashboard.sysop.table_customer')}</th>
                  <th className="px-8 py-4">{t('dashboard.sysop.table_amount')}</th>
                  <th className="px-8 py-4">{t('dashboard.sysop.table_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {!Array.isArray(recentOrders) || recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-text-secondary text-[12px] font-bold">{t('dashboard.sysop.no_records')}</td>
                  </tr>
                ) : (
                  recentOrders.map((order: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 text-[13px] font-black text-text-primary">#{order.shortID || order.id?.slice(-6).toUpperCase()}</td>
                      <td className="px-8 py-5 text-[13px] font-bold text-text-secondary">{order.buyer?.userName || t('dashboard.sysop.anonymous')}</td>
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
        <div className={`rounded-[2.5rem] border transition-all duration-300 flex flex-col
          ${theme === 'light' 
            ? 'bg-white border-border-color shadow-sm' 
            : 'bg-[#121214]/80 backdrop-blur-xl border-white/5 shadow-2xl'}`}>
          <div className="p-8 border-b border-border-color">
            <h3 className="text-[16px] font-black text-text-primary uppercase tracking-wider">{t('dashboard.sysop.quick_access')}</h3>
          </div>
          <div className="p-4">
            <button className="w-full flex items-center gap-4 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[15px] font-black text-text-primary uppercase tracking-wider">{t('dashboard.sysop.support_title')}</p>
                <p className="text-[12px] text-text-secondary font-bold">{t('dashboard.sysop.support_desc')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
