"use client";

import React, {useEffect, useState} from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalListings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/admin/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.payload) {
          setStats(data.payload);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-slate-500 font-bold">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Users</div>
          <div className="text-4xl font-black text-slate-900">{stats.totalUsers}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Orders</div>
          <div className="text-4xl font-black text-slate-900">{stats.totalOrders}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Listings</div>
          <div className="text-4xl font-black text-slate-900">{stats.totalListings}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</div>
          <div className="text-4xl font-black text-slate-900">₺{stats.totalRevenue?.toLocaleString() || 0}</div>
        </div>
      </div>
    </div>
  );
}
