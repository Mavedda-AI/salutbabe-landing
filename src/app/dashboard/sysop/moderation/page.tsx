'use client';

import React, {useEffect, useState} from "react";
import {HugeiconsIcon} from '@hugeicons/react';
import {
  Camera01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  DocumentAttachmentIcon,
  Message01Icon,
  Money01Icon,
  PencilEdit01Icon,
  RulerIcon,
  Tag01Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';

import {PageHeader} from "@/app/dashboard/components/ui/PageHeader";
import {KPIGrid, KPIItem} from "@/app/dashboard/components/ui/KPIGrid";
import {FilterTabs, SearchInput, TabItem} from "@/app/dashboard/components/ui/FilterBar";
import {Column, DataTable} from "@/app/dashboard/components/ui/DataTable";
import {ActionModal, StatusBadge} from "@/app/dashboard/components/ui/StatusBadge";

type QuickReply = { id: string; label: string; icon: any };
type Product = { 
  id: string; 
  name: string; 
  category: string; 
  seller: string; 
  price: string; 
  image: string; 
  date: string; 
  desc: string; 
  status: 'pending' | 'approved' | 'notified' | 'rejected'; 
  notifications?: string[] 
};

const quickReplies: QuickReply[] = [
  { id: 'photo', label: 'Fotoğrafını iyileştirebilirsin', icon: Camera01Icon },
  { id: 'desc', label: 'Açıklamanı zenginleştirebilirsin', icon: PencilEdit01Icon },
  { id: 'price', label: 'Fiyatını gözden geçirebilirsin', icon: Money01Icon },
  { id: 'category', label: 'Kategorini güncelleyebilirsin', icon: Tag01Icon },
  { id: 'cert', label: 'Orijinallik belgesi yükleyebilirsin', icon: DocumentAttachmentIcon },
  { id: 'size', label: 'Beden bilgisini netleştirebilirsin', icon: RulerIcon },
];

export function ModerationView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pending');
  const [detail, setDetail] = useState<Product | null>(null);
  const [selectedNotifs, setSelectedNotifs] = useState<{ [productId: string]: string[] }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token || token === 'mock_token') {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        // Normally fetch from API here. We removed hardcoded dummy data.
        setProducts([]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const pendingCount = products.filter(p => p.status === 'pending').length;
  const approvedCount = products.filter(p => p.status === 'approved').length;
  const notifiedCount = products.filter(p => p.status === 'notified').length;
  const rejectedCount = products.filter(p => p.status === 'rejected').length;

  const toggleNotif = (productId: string, label: string) => {
    setSelectedNotifs(prev => {
      const current = prev[productId] || [];
      if (current.includes(label)) return { ...prev, [productId]: current.filter(l => l !== label) };
      return { ...prev, [productId]: [...current, label] };
    });
  };

  const updateStatus = (id: string, status: Product['status'], notifs?: string[]) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status, notifications: notifs || p.notifications } : p));
  };

  const handleApprove = (p: Product) => { 
    const notifs = selectedNotifs[p.id] || [];
    updateStatus(p.id, 'approved', [...(p.notifications || []), ...notifs]); 
    setSelectedNotifs(prev => { const next = {...prev}; delete next[p.id]; return next; });
  };
  
  const handleReject = (p: Product) => { 
    const notifs = selectedNotifs[p.id] || [];
    updateStatus(p.id, 'rejected', [...(p.notifications || []), ...notifs]); 
    setSelectedNotifs(prev => { const next = {...prev}; delete next[p.id]; return next; });
  };
  
  const handleUndo = (p: Product) => { 
    updateStatus(p.id, 'pending', []); 
  };

  const tabs: TabItem[] = [
    { id: 'pending', label: `Bekleyen (${pendingCount})` },
    { id: 'approved', label: `Onaylanan (${approvedCount})` },
    { id: 'notified', label: `Bildirim (${notifiedCount})` },
    { id: 'rejected', label: `Reddedilen (${rejectedCount})` },
  ];

  const kpis: KPIItem[] = [
    { label: 'Bekleyen', value: pendingCount, icon: <HugeiconsIcon icon={CheckmarkCircle01Icon} size={24} />, colorClass: 'text-orange-500' },
    { label: 'Onaylanan', value: approvedCount, icon: <HugeiconsIcon icon={Tick01Icon} size={24} />, colorClass: 'text-green-500' },
    { label: 'Bildirim', value: notifiedCount, icon: <HugeiconsIcon icon={Message01Icon} size={24} />, colorClass: 'text-blue-500' },
    { label: 'Reddedilen', value: rejectedCount, icon: <HugeiconsIcon icon={Cancel01Icon} size={24} />, colorClass: 'text-red-500' },
  ];

  const filteredProducts = products.filter(p => {
    if (p.status !== tab) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: Column<Product>[] = [
    {
      header: 'İlan',
      accessor: (p) => (
        <div className="flex items-center gap-3">
          {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />}
          <div>
            <div className="font-bold text-gray-900 dark:text-white">{p.name}</div>
            <div className="text-xs text-gray-500">{p.category}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Satıcı',
      accessor: (p) => <span className="text-sm text-gray-700 dark:text-gray-300">{p.seller}</span>
    },
    {
      header: 'Fiyat',
      accessor: (p) => <span className="text-sm font-medium text-gray-900 dark:text-white">{p.price}</span>
    },
    {
      header: 'Durum',
      accessor: (p) => {
        let type: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';
        if (p.status === 'approved') type = 'success';
        if (p.status === 'notified') type = 'info';
        if (p.status === 'rejected') type = 'danger';
        if (p.status === 'pending') type = 'warning';

        let label: string = p.status;
        if (p.status === 'pending') label = 'Bekleyen';
        if (p.status === 'approved') label = 'Onaylandı';
        if (p.status === 'notified') label = 'Bildirim';
        if (p.status === 'rejected') label = 'Reddedildi';

        return <StatusBadge status={label} type={type} />;
      }
    },
    {
      header: 'İşlemler',
      accessor: (p) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDetail(p)} 
            className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
          >
            İncele
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      <PageHeader 
        title="İlan Onay" 
        description="Bekleyen ilanları inceleyin, onaylayın veya satıcılara bildirim gönderin." 
      />
      
      <KPIGrid items={kpis} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterTabs tabs={tabs} activeTab={tab} onChange={setTab} />
        <div className="w-full md:w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="İlan ara..." />
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        loading={loading}
        emptyMessage={tab === 'pending' ? 'Bekleyen ilan bulunmuyor.' : 'Kayıt bulunamadı.'}
      />

      <ActionModal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name || 'İlan Detayı'}
      >
        {detail && (
          <div className="space-y-4">
            {detail.image && (
              <img src={detail.image} alt={detail.name} className="w-full h-48 object-cover rounded-xl" />
            )}
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Satıcı</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{detail.seller}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Fiyat</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{detail.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tarih</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{detail.date}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-white/5 p-3 rounded-lg leading-relaxed">
              {detail.desc}
            </p>

            {detail.notifications && detail.notifications.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Gönderilen Bildirimler:</p>
                {detail.notifications.map((n, i) => (
                  <p key={i} className="text-xs text-blue-700 dark:text-blue-300 font-medium">• {n}</p>
                ))}
              </div>
            )}

            {detail.status === 'pending' && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {quickReplies.map(r => {
                  const isSelected = (selectedNotifs[detail.id] || []).includes(r.label);
                  return (
                    <button 
                      key={r.id} 
                      onClick={() => toggleNotif(detail.id, r.label)} 
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border transition-all text-left ${
                        isSelected 
                          ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10'
                      }`}
                    >
                      <HugeiconsIcon icon={r.icon} size={14} className="shrink-0" />
                      <span className="truncate">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
              {detail.status === 'pending' ? (
                <>
                  <button 
                    onClick={() => { handleReject(detail); setDetail(null); }} 
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} /> Reddet
                  </button>
                  <button 
                    onClick={() => { handleApprove(detail); setDetail(null); }} 
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <HugeiconsIcon icon={Tick01Icon} size={16} /> Onayla
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { handleUndo(detail); setDetail(null); }} 
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Geri Al
                </button>
              )}
            </div>
          </div>
        )}
      </ActionModal>
    </div>
  );
}

export default function Page() { return <ModerationView />; }
