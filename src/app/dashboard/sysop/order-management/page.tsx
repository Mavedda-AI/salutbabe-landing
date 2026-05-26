'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Alert01Icon, Package01Icon, Tick01Icon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useThemeLanguage} from "@/context/ThemeLanguageContext";
import {apiUrl} from "@/lib/api";
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, SearchInput, TabItem} from '@/app/dashboard/components/ui/FilterBar';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';

interface DisputeOrder {
  orderID: string;
  totalAmount: number;
  status: string;
  originalStatus: string;
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
  const { theme, language } = useThemeLanguage();
  const [orders, setOrders] = useState<DisputeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('disputes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DisputeOrder | null>(null);

  const isDark = theme === 'dark';

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("admin_token") || localStorage.getItem("token");
      if (!token || token === "mock_token") {
        setOrders([]);
        return;
      }

      const res = await fetch(apiUrl(`/admin/orders?page=1&limit=50`), {
        headers: { "Authorization": `Bearer ${token}`, "X-Device-Type": "web" }
      });
      const data = await res.json();
      if (data.payload && data.payload.orders) {
        setOrders(data.payload.orders.map((o: any) => {
          let translatedStatus = o.status;
          const s = String(o.status).toLowerCase();
          if (s === 'disputed') translatedStatus = 'Uyuşmazlık';
          else if (s === 'completed') translatedStatus = 'Tamamlandı';
          else if (s === 'cancelled') translatedStatus = 'İptal Edildi';
          else if (s === 'pending') translatedStatus = 'Bekliyor';
          else if (s === 'shipped') translatedStatus = 'Kargoda';
          
          return {
            ...o,
            orderID: o.orderID || o._id,
            createdAt: o.orderDate || o.createdAt,
            originalStatus: o.status,
            disputeReason: s === 'disputed' ? 'Alıcı İtirazı' : undefined,
            status: translatedStatus
          };
        }));
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

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = Cookies.get('admin_token') || localStorage.getItem('token');
      await fetch(apiUrl(`/admin/orders/${orderId}/status`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      fetchOrders();
      setSelectedOrder(null);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'disputes' ? order.status === 'Uyuşmazlık' 
      : activeTab === 'pending_shipping' ? ['Bekliyor', 'Kargoda'].includes(order.status)
      : ['Tamamlandı', 'İptal Edildi'].includes(order.status);
      
    const matchesSearch = order.orderID.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (order.buyer?.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (order.seller?.userName || '').toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const getStatusType = (status: string) => {
    switch (status.toLowerCase()) {
      case 'tamamlandı': return 'success';
      case 'kargoda': return 'info';
      case 'bekliyor': return 'warning';
      case 'iptal edildi': return 'neutral';
      case 'uyuşmazlık': return 'danger';
      default: return 'neutral';
    }
  };

  const kpis: KPIItem[] = [
    { label: 'AÇIK DISPUTE', value: orders.filter(o => o.status === 'Uyuşmazlık').length, icon: <HugeiconsIcon icon={Alert01Icon} size={32} className="text-red-500" />, colorClass: 'text-red-500' },
    { label: 'BEKLEYEN', value: orders.filter(o => o.status === 'Bekliyor').length, icon: <HugeiconsIcon icon={Package01Icon} size={32} className="text-orange-500" />, colorClass: 'text-orange-500' },
    { label: 'KARGODA', value: orders.filter(o => o.status === 'Kargoda').length, icon: <HugeiconsIcon icon={Package01Icon} size={32} className="text-blue-500" />, colorClass: 'text-blue-500' },
    { label: 'TAMAMLANDI', value: orders.filter(o => o.status === 'Tamamlandı').length, icon: <HugeiconsIcon icon={Tick01Icon} size={32} className="text-green-500" />, colorClass: 'text-green-500' },
  ];

  const tabs: TabItem[] = [
    { id: 'disputes', label: <span className="flex items-center gap-1.5"><HugeiconsIcon icon={Alert01Icon} size={16} /> Uyuşmazlıklar (Dispute)</span> },
    { id: 'pending_shipping', label: <span className="flex items-center gap-1.5"><HugeiconsIcon icon={Package01Icon} size={16} /> Kargo & Bekleyen</span> },
    { id: 'completed', label: <span className="flex items-center gap-1.5"><HugeiconsIcon icon={Tick01Icon} size={16} /> Tamamlanan / İptal</span> },
    { id: 'all', label: 'Tüm Siparişler' }
  ];

  const columns: Column<DisputeOrder>[] = [
    {
      header: 'Sipariş / Tarih',
      accessor: (o) => (
        <div className="flex flex-col">
          <span className={`text-[12px] md:text-[13px] font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            #{o.orderID.split('-')[0].toUpperCase()}
          </span>
          <span className={`text-[10px] md:text-[11px] font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {o.createdAt ? new Date(o.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US') : ''}
          </span>
        </div>
      )
    },
    {
      header: 'Alıcı Bilgisi',
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
      accessor: (o) => (
        <div className="flex flex-col">
          <span className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{o.buyer?.userName} {o.buyer?.userSurname}</span>
          <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{o.buyer?.eMail}</span>
        </div>
      )
    },
    {
      header: 'Satıcı Bilgisi',
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
      accessor: (o) => (
        <div className="flex flex-col">
          <span className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{o.seller?.userName} {o.seller?.userSurname}</span>
          <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{o.seller?.eMail}</span>
        </div>
      )
    },
    {
      header: 'Tutar',
      accessor: (o) => (
        <span className={`text-[11px] md:text-[13px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {Number(o.totalAmount).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} ₺
        </span>
      )
    },
    {
      header: 'Durum',
      accessor: (o) => (
        <div className="flex flex-col gap-1 items-start">
          <StatusBadge status={o.status} type={getStatusType(o.status)} />
          {o.disputeReason && (
            <span className="text-[9px] md:text-[10px] font-bold text-red-500 flex items-center gap-1 max-w-[80px] md:max-w-none truncate">
              ↳ {o.disputeReason}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'İşlem',
      className: 'text-right',
      accessor: (o) => (
        o.status === 'Uyuşmazlık' ? (
          <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }} className={`h-8 px-2 md:px-4 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-wider transition-all border ${isDark ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'}`}>
            Müdahale
          </button>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }} className={`p-1.5 md:p-2 rounded-lg border text-[10px] md:text-[12px] transition-colors ${isDark ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`} title="Sipariş Detayı">
             İncele →
          </button>
        )
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0C0E] font-sans">
      <PageHeader 
        title="İşlem & Uyuşmazlık Merkezi" 
        description="Siparişleri yönetin ve alıcı-satıcı anlaşmazlıklarına müdahale edin." 
        actions={
          <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
            <span className="text-xl"><HugeiconsIcon icon={Alert01Icon} size={16} className="inline-block mr-1 text-red-500" /></span>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-red-400' : 'text-red-600/70'}`}>Açık Dispute</p>
              <p className={`text-[16px] font-black ${isDark ? 'text-red-400' : 'text-red-700'}`}>{orders.filter(o => o.status === 'Uyuşmazlık').length} Adet</p>
            </div>
          </div>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5 pb-20">
        <KPIGrid items={kpis} />

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <FilterTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Sipariş No, Alıcı veya Satıcı..." />
        </div>

        <DataTable 
          data={filteredOrders} 
          columns={columns} 
          keyExtractor={o => o.orderID}
          loading={loading}
          emptyMessage="Bu sekmede listelenecek bir sipariş bulunmuyor."
        />
      </div>

      <ActionModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title="Sipariş Detayı"
        description={selectedOrder ? `#${selectedOrder.orderID.split('-')[0].toUpperCase()}` : undefined}
      >
        {selectedOrder && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-[#121214]' : 'bg-gray-50'}`}>
                <p className={`text-[10px] font-black tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ALICI</p>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.buyer?.userName} {selectedOrder.buyer?.userSurname}</p>
                <p className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedOrder.buyer?.eMail}</p>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-[#121214]' : 'bg-gray-50'}`}>
                <p className={`text-[10px] font-black tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>SATICI</p>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.seller?.userName} {selectedOrder.seller?.userSurname}</p>
                <p className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedOrder.seller?.eMail}</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-4 flex justify-between items-center ${isDark ? 'bg-[#121214]' : 'bg-gray-50'}`}>
              <div>
                <p className={`text-[10px] font-black tracking-widest mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>TUTAR</p>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{Number(selectedOrder.totalAmount).toLocaleString()} ₺</p>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-black tracking-widest mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>DURUM</p>
                <StatusBadge status={selectedOrder.status} type={getStatusType(selectedOrder.status)} />
              </div>
            </div>

            {selectedOrder.status === 'Uyuşmazlık' && (
              <div className={`p-4 rounded-xl mb-4 border ${isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                <p className="text-[12px] font-black text-red-500 mb-1">DİKKAT: UYUŞMAZLIK BİLDİRİMİ</p>
                <p className={`text-[13px] font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>{selectedOrder.disputeReason}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setSelectedOrder(null)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>Kapat</button>
              {selectedOrder.status === 'Uyuşmazlık' && (
                <button onClick={() => handleUpdateStatus(selectedOrder.orderID, 'Cancelled')} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">Alıcıya İade Et</button>
              )}
            </div>
          </>
        )}
      </ActionModal>
    </div>
  );
}
