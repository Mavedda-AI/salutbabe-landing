"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../lib/api";

export default function PanelDashboard() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/order/list?role=seller"), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data?.payload && Array.isArray(data.payload)) {
        setOrders(data.payload);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'processing': 
      case 'mark-processing':
        return { label: 'Processing', color: 'text-blue-500 bg-blue-500/10', eventIndex: 1 };
      case 'shipped':
      case 'mark-shipped':
        return { label: 'Shipped', color: 'text-purple-500 bg-purple-500/10', eventIndex: 2 };
      case 'delivered':
      case 'mark-delivered':
        return { label: 'Delivered', color: 'text-indigo-500 bg-indigo-500/10', eventIndex: 3 };
      case 'completed':
      case 'confirmed':
        return { label: 'Completed', color: 'text-green-500 bg-green-500/10', eventIndex: 4 };
      case 'cancelled':
      case 'rejected':
        return { label: 'Cancelled', color: 'text-red-500 bg-red-500/10', eventIndex: 0 };
      default: 
        return { label: status || 'Pending', color: 'text-slate-400 bg-slate-400/10', eventIndex: 0 };
    }
  };

  const tabs = ['All Orders', 'Pending', 'Arrived', 'View'];

  // Extremely defensive filtering to prevent "filter is not a function" errors
  const filteredOrders = (orders && Array.isArray(orders)) ? orders.filter(order => {
    if (!order) return false;
    if (activeTab === 'All Orders') return true;
    if (activeTab === 'Pending') return order.status === 'processing';
    if (activeTab === 'Arrived') return (order.status === 'delivered' || order.status === 'completed');
    return true;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Title & Primary Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-text-primary">Shipment</h1>
          <div className="flex items-center gap-2">
            <button className="p-1 text-text-secondary hover:text-text-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
            <button className="p-1 text-text-secondary hover:text-primary transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg></button>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[13px] flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Shipment
        </button>
      </div>

      {/* Tabs & Table Container */}
      <div className="bg-white dark:bg-surface rounded-3xl border border-border-color overflow-hidden shadow-sm">
        {/* Tab Bar */}
        <div className="flex items-center justify-between px-8 border-b border-border-color">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 font-black text-[13px] relative transition-colors ${activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {tab === 'View' ? <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> View</span> : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-text-secondary text-[12px] font-bold">
            <button className="flex items-center gap-2 hover:text-text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              View Settings
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-6 flex flex-wrap items-center gap-4 bg-[#FAFBFC] dark:bg-background/50 border-b border-border-color">
          <div className="relative flex-1 max-w-[280px]">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white dark:bg-surface border border-border-color outline-none py-2 pl-10 pr-4 rounded-xl text-[13px] font-bold focus:border-primary transition-colors"
            />
          </div>

          <button className="flex items-center gap-3 bg-text-primary text-background px-4 py-2 rounded-xl text-[12px] font-black shadow-sm">
            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            Seçili Tarih
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>

          <button className="flex items-center gap-3 bg-white dark:bg-surface border border-border-color px-4 py-2 rounded-xl text-[12px] font-black text-text-primary">
            All Shipment Status
            <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>

          <div className="flex-1" />

          <button className="flex items-center gap-2 bg-white dark:bg-surface border border-border-color px-4 py-2 rounded-xl text-[12px] font-black text-text-primary shadow-sm hover:border-primary transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            Manage Table
          </button>
        </div>

        {/* Shipment Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-text-secondary">
               <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
               <span className="text-xs font-black uppercase tracking-widest">Veriler Yükleniyor...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center gap-2 text-text-secondary">
               <svg className="w-12 h-12 opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
               <span className="text-sm font-bold">Henüz siparişiniz bulunmuyor.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#FAFBFC] dark:bg-background/30 text-[11px] font-black text-text-secondary/60 uppercase tracking-widest border-b border-border-color">
                  <th className="px-8 py-4 font-black">Shipment ID</th>
                  <th className="px-8 py-4 font-black">Shipment Event</th>
                  <th className="px-8 py-4 font-black">Status</th>
                  <th className="px-8 py-4 font-black">Order Date</th>
                  <th className="px-8 py-4 font-black">Buyer</th>
                  <th className="px-8 py-4 font-black">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredOrders.map((order, i) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={i} className="hover:bg-[#F8F9FB] dark:hover:bg-background/20 transition-colors group">
                      <td className="px-8 py-5 text-[13px] font-black text-text-primary">
                        {order.shortID || (order._id ? order._id.slice(-8).toUpperCase() : `SHP-${1000 + i}`)}
                      </td>
                      <td className="px-8 py-5">
                        {/* Timeline Progress */}
                        <div className="flex items-center gap-0 w-32 relative">
                          {[0, 1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center flex-1 last:flex-none relative">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${step <= statusInfo.eventIndex ? 'bg-black text-white border-black' : 'bg-white dark:bg-surface border-border-color text-text-secondary/40'}`}>
                                {step === 0 && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0L3.53 17.38c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9z"/></svg>}
                                {step === 1 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>}
                                {step === 2 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zM18 16V9l-4-3v10l4-3z"/></svg>}
                                {step === 3 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z"/></svg>}
                                {step === 4 && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>}
                              </div>
                              {step < 4 && <div className={`h-1 flex-1 mx-[-1px] transition-colors ${step < statusInfo.eventIndex ? 'bg-black' : 'bg-border-color'}`} />}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black ${statusInfo.color}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          {statusInfo.label}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[13px] font-bold text-text-primary">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('tr-TR') : '---'}
                      </td>
                      <td className="px-8 py-5 text-[13px] font-black text-text-primary">
                         {order.buyer?.userName || 'Anonim'}
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-black text-text-primary">
                          ₺{(order.totalAmount || 0).toLocaleString('tr-TR')}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
