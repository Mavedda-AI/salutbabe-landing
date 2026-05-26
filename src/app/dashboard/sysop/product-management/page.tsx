'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import React, {useEffect, useState} from 'react';
import {AppStoreIcon, PauseCircleIcon, Store01Icon, Tick01Icon} from '@hugeicons/core-free-icons';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, SearchInput, TabItem} from '@/app/dashboard/components/ui/FilterBar';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';
import {apiUrl} from '@/lib/api';

export default function ProductManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token === "mock_token" || !token) {
        setProducts([]);
        return;
      }

      const res = await fetch(apiUrl('/admin/listings?page=1&limit=100'), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.payload && data.payload.listings) {
        setProducts(data.payload.listings.map((p: any) => ({
          id: p.listingID,
          name: p.title,
          store: p.seller?.userName ? `${p.seller.userName} ${p.seller.userSurname}` : 'Bilinmeyen Satıcı',
          price: `${p.price}₺`,
          status: p.status === 'active' ? 'Yayında' : p.status === 'pending_approval' ? 'Onay Bekliyor' : p.status === 'rejected' ? 'Reddedildi' : p.status,
          stock: p.stock || 1,
          date: new Date(p.createdAt).toLocaleDateString('tr-TR')
        })));
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStatus = async (listingID: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token === "mock_token" || !token) {
         setProducts(products.map(p => p.id === listingID ? { ...p, status: newStatus === 'active' ? 'Yayında' : 'Reddedildi' } : p));
         setActionDone(`İlan durumu güncellendi.`);
         setTimeout(() => setActionDone(null), 2500);
         setShowModal(null);
         return;
      }
      
      const res = await fetch(apiUrl(`/admin/listings/${listingID}/status`), {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === listingID ? { ...p, status: newStatus === 'active' ? 'Yayında' : 'Reddedildi' } : p));
        setActionDone(`İlan durumu güncellendi.`);
        setTimeout(() => setActionDone(null), 2500);
        setShowModal(null);
      } else {
        alert("Durum güncellenirken bir hata oluştu.");
      }
    } catch (e) {
      console.error(e);
      alert("Durum güncellenirken bir hata oluştu.");
    }
  };

  const filteredProducts = products.filter(p => {
    if (activeTab === 'active' && p.status !== 'Yayında') return false;
    if (activeTab === 'pending' && p.status !== 'Onay Bekliyor') return false;
    if (activeTab === 'rejected' && p.status !== 'Reddedildi') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusType = (status: string) => {
    switch (status) {
      case 'Yayında': return 'success';
      case 'Onay Bekliyor': return 'warning';
      case 'Reddedildi': return 'danger';
      default: return 'neutral';
    }
  };

  const kpis: KPIItem[] = [
    { label: 'TOPLAM İLAN', value: products.length, icon: <HugeiconsIcon icon={AppStoreIcon} size={32} className="text-blue-500" />, colorClass: 'text-blue-500' },
    { label: 'YAYINDA', value: products.filter(p => p.status === 'Yayında').length, icon: <HugeiconsIcon icon={Tick01Icon} size={32} className="text-green-500" />, colorClass: 'text-green-500' },
    { label: 'ONAY BEKLEYEN', value: products.filter(p => p.status === 'Onay Bekliyor').length, icon: <HugeiconsIcon icon={PauseCircleIcon} size={32} className="text-orange-500" />, colorClass: 'text-orange-500' },
    { label: 'MAĞAZALAR', value: new Set(products.map(p => p.store)).size, icon: <HugeiconsIcon icon={Store01Icon} size={32} className="text-purple-500" />, colorClass: 'text-purple-500' },
  ];

  const tabs: TabItem[] = [
    { id: 'all', label: 'Tüm İlanlar' },
    { id: 'active', label: 'Yayındakiler' },
    { id: 'pending', label: 'Onay Bekleyenler' },
    { id: 'rejected', label: 'Reddedilenler' }
  ];

  const columns: Column<any>[] = [
    {
      header: 'Ürün & Kategori',
      accessor: (p) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-gray-900 dark:text-white line-clamp-1">{p.name}</span>
          <span className="text-[10px] font-medium mt-0.5 text-gray-400">#{p.id}</span>
        </div>
      )
    },
    {
      header: 'Satıcı / Mağaza',
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
      accessor: (p) => <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">{p.store}</span>
    },
    {
      header: 'Fiyat & Stok',
      accessor: (p) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-black text-gray-900 dark:text-white">{p.price}</span>
          <span className="text-[10px] font-medium text-gray-400">{p.stock} adet stok</span>
        </div>
      )
    },
    {
      header: 'Tarih',
      className: 'hidden md:table-cell',
      headerClassName: 'hidden md:table-cell',
      accessor: (p) => <span className="text-[11px] font-medium text-gray-500">{p.date}</span>
    },
    {
      header: 'Durum',
      accessor: (p) => <StatusBadge status={p.status} type={getStatusType(p.status)} />
    },
    {
      header: 'İşlem',
      className: 'text-right',
      accessor: (p) => (
        <button onClick={() => setShowModal(p.id)} className="px-3 py-1.5 rounded-lg border text-[10px] md:text-[11px] font-bold transition-colors dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          İncele / Düzenle
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0C0E] font-sans">
      {actionDone && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">
          <HugeiconsIcon icon={Tick01Icon} size={16} className="text-green-400 inline-block mr-2" /> 
          {actionDone}
        </div>
      )}
      
      <PageHeader 
        title="Ürün Kataloğu Yönetimi" 
        description="Platformdaki tüm ürünleri, fiyatları ve stok durumlarını inceleyin." 
        actions={
          <button className="px-4 py-2.5 rounded-2xl bg-[#111827] dark:bg-white text-white dark:text-black text-[13px] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Yeni İlan Oluştur
          </button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5 pb-20">
        <KPIGrid items={kpis} />

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <FilterTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="İlan ara..." />
        </div>

        <DataTable 
          data={filteredProducts} 
          columns={columns} 
          keyExtractor={p => p.id}
          loading={loading}
          emptyMessage="Bu kriterlere uygun ilan bulunamadı."
        />
      </div>

      <ActionModal 
        isOpen={!!showModal} 
        onClose={() => setShowModal(null)} 
        title="İlan Aksiyonları"
        description="Bu ilan için uygulayacağınız aksiyonu seçin."
      >
        <button onClick={() => showModal && handleUpdateStatus(showModal, 'active')} className="w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          İlanı Onayla / Yayına Al
        </button>
        <button onClick={() => setShowModal(null)} className="w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-colors dark:border-white/10 dark:hover:bg-white/5 dark:text-white border-gray-200 hover:bg-gray-50 text-gray-700">
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          İlanı Düzenle
        </button>
        <button onClick={() => showModal && handleUpdateStatus(showModal, 'rejected')} className="w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          İlanı Reddet / Kaldır
        </button>
      </ActionModal>
    </div>
  );
}
