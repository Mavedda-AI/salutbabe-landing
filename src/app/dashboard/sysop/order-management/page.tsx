"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../../lib/api";

interface DisputeOrder {
  orderID: string;
  totalAmount: number;
  status: string;
  disputeReason?: string;
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
  const [orders, setOrders] = useState<DisputeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'disputes' | 'pending_shipping' | 'completed' | 'all'>('disputes');
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (token === "mock_token" || !token) {
        setTimeout(() => {
          setOrders([
            { orderID: "ORD-94A1XYZ", buyer: { userName: "Ayşe", userSurname: "Yılmaz", eMail: "ayse@example.com" }, seller: { userName: "Boutique", userSurname: "Kids", eMail: "boutique@example.com" }, totalAmount: 1450, status: "Uyuşmazlık", disputeReason: "Ürün Açıklamadan Farklı", createdAt: new Date().toISOString() },
            { orderID: "ORD-82B3ABC", buyer: { userName: "Mehmet", userSurname: "Demir", eMail: "mehmet@example.com" }, seller: { userName: "Moda", userSurname: "Bebek", eMail: "moda@example.com" }, totalAmount: 3200.75, status: "Uyuşmazlık", disputeReason: "Kargo Hasarlı", createdAt: new Date(Date.now() - 86400000).toISOString() },
            { orderID: "ORD-71C5DEF", buyer: { userName: "Zeynep", userSurname: "Kaya", eMail: "zeynep@example.com" }, seller: { userName: "Şirin", userSurname: "Oyuncak", eMail: "sirin@example.com" }, totalAmount: 850, status: "Bekliyor", createdAt: new Date(Date.now() - 172800000).toISOString() },
            { orderID: "ORD-60D7GHI", buyer: { userName: "Canan", userSurname: "Öz", eMail: "canan@example.com" }, seller: { userName: "Mini", userSurname: "Aya", eMail: "mini@example.com" }, totalAmount: 5400, status: "Tamamlandı", createdAt: new Date(Date.now() - 259200000).toISOString() },
            { orderID: "ORD-55E8JKL", buyer: { userName: "Ali", userSurname: "Veli", eMail: "ali@example.com" }, seller: { userName: "Bebek", userSurname: "Dostu", eMail: "dostu@example.com" }, totalAmount: 120, status: "İptal Edildi", createdAt: new Date(Date.now() - 345600000).toISOString() },
            { orderID: "ORD-44F9MNO", buyer: { userName: "Esra", userSurname: "Gül", eMail: "esra@example.com" }, seller: { userName: "Kids", userSurname: "World", eMail: "world@example.com" }, totalAmount: 2100, status: "Kargoda", createdAt: new Date(Date.now() - 432000000).toISOString() },
            { orderID: "ORD-11A9ZZZ", buyer: { userName: "Büşra", userSurname: "Kaya", eMail: "busra@example.com" }, seller: { userName: "Anne", userSurname: "Eli", eMail: "anne@example.com" }, totalAmount: 650, status: "Uyuşmazlık", disputeReason: "Eksik Parça", createdAt: new Date().toISOString() },
          ]);
          setLoading(false);
        }, 400);
        return;
      }

      // Live fetch if available
      const res = await fetch(apiUrl(`/admin/orders?page=1&limit=50`), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.payload) {
        setOrders(data.payload.orders.map((o: any) => ({
          ...o,
          disputeReason: o.status === 'Disputed' ? 'Alıcı İtirazı' : undefined,
          status: o.status === 'Disputed' ? 'Uyuşmazlık' : o.status
        })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'disputes' ? order.status === 'Uyuşmazlık' 
      : activeTab === 'pending_shipping' ? ['Bekliyor', 'Kargoda'].includes(order.status)
      : ['Tamamlandı', 'İptal Edildi'].includes(order.status);
      
    const matchesSearch = order.orderID.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.buyer.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.seller.userName.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'tamamlandı': return isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100';
      case 'kargoda': return isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100';
      case 'bekliyor': return isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-100';
      case 'iptal edildi': return isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-100';
      case 'uyuşmazlık': return isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100';
      default: return isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>
              İşlem & Uyuşmazlık Merkezi
              {orders.filter(o => o.status === 'Uyuşmazlık').length > 0 && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-[12px] font-black animate-pulse shadow-lg shadow-red-500/30">
                  {orders.filter(o => o.status === 'Uyuşmazlık').length}
                </span>
              )}
           </h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Siparişleri yönetin ve alıcı-satıcı anlaşmazlıklarına müdahale edin.</p>
         </div>

         <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-red-50 border-red-100'}`}>
               <span className="text-xl">🚨</span>
               <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-red-600/70'}`}>Açık Dispute</p>
                  <p className={`text-[16px] font-black ${isDark ? 'text-white' : 'text-red-700'}`}>3 Adet</p>
               </div>
            </div>
         </div>
      </div>

      {/* Action Bar (Search & Tabs) */}
      <div className={`${cardClass} p-2 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
         <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
            {[
              { id: 'disputes', label: '🚨 Uyuşmazlıklar (Dispute)' },
              { id: 'pending_shipping', label: '📦 Kargo & Bekleyen' },
              { id: 'completed', label: '✅ Tamamlanan / İptal' },
              { id: 'all', label: 'Tüm Siparişler' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? (isDark ? 'bg-[#2E2E3A] text-white' : 'bg-gray-100 text-gray-900') 
                    : (isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}`}
              >
                {tab.label}
              </button>
            ))}
         </div>
         
         <div className="px-2 md:px-4 md:w-80">
            <div className={`relative flex items-center w-full h-10 rounded-xl border transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10 focus-within:border-primary/50' : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 focus-within:bg-white'}`}>
               <svg className={`w-4 h-4 ml-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Sipariş No, Alıcı veya Satıcı..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-full bg-transparent border-none outline-none px-3 text-[12px] font-medium placeholder:text-gray-400 text-inherit"
               />
            </div>
         </div>
      </div>

      {/* Table Section */}
      <div className={`rounded-[20px] border overflow-x-auto ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={isDark ? 'bg-[#1A1D1F]' : 'bg-gray-50/80'}>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sipariş / Tarih</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Alıcı Bilgisi</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Satıcı Bilgisi</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tutar</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Durum</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-[12px] text-gray-500">Yükleniyor...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3">✅</span>
                    <h3 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Açık Görev Yok</h3>
                    <p className={`text-[12px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Bu sekmede listelenecek bir sipariş bulunmuyor.</p>
                  </div>
                </td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.orderID} className={`transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'} ${order.status === 'Uyuşmazlık' ? (isDark ? 'bg-red-500/5' : 'bg-red-50/30') : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        #{order.orderID.split('-')[0].toUpperCase()}
                      </span>
                      <span className={`text-[11px] font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(order.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{order.buyer.userName} {order.buyer.userSurname}</span>
                      <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{order.buyer.eMail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{order.seller.userName} {order.seller.userSurname}</span>
                      <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{order.seller.eMail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[13px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {order.totalAmount.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} ₺
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.disputeReason && (
                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                          ↳ {order.disputeReason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'Uyuşmazlık' ? (
                      <button className={`h-8 px-4 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all border
                        ${isDark ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-red-500 text-white border-red-600 hover:bg-red-600'}`}>
                        Müdahale Et
                      </button>
                    ) : (
                      <button className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`} title="Sipariş Detayı">
                         İncele →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
