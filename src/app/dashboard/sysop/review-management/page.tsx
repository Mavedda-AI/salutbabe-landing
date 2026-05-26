'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Camera01Icon, Flag01Icon, StarIcon, Tick01Icon, Timer02Icon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, SearchInput, TabItem} from '@/app/dashboard/components/ui/FilterBar';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';

type Review = { id: number; user: string; product: string; rating: number; text: string; date: string; status: 'pending' | 'approved' | 'flagged'; images: number };

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<Review | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || token === 'mock_token') {
        setReviews([]);
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('https://api.mavedda.com/api/reviews', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  const filtered = reviews.filter(r => 
    r.status === activeTab &&
    (r.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length && filtered.length > 0 ? [] : filtered.map(r => r.id));

  const doAction = (ids: number[], action: 'approve' | 'delete' | 'flag', msg: string) => {
    if (action === 'delete') setReviews(p => p.filter(r => !ids.includes(r.id)));
    else setReviews(p => p.map(r => ids.includes(r.id) ? { ...r, status: action === 'approve' ? 'approved' : 'flagged' } : r));
    setSelected([]); 
    setModal(null);
    setActionDone(msg); 
    setTimeout(() => setActionDone(null), 2500);
  };

  const kpis: KPIItem[] = [
    { label: 'Bekleyen İnceleme', value: reviews.filter(r => r.status === 'pending').length, colorClass: 'text-[#FF8D28]', icon: <HugeiconsIcon icon={Timer02Icon} size={24} /> },
    { label: 'Onaylanan (Toplam)', value: reviews.filter(r => r.status === 'approved').length, colorClass: 'text-green-600', icon: <HugeiconsIcon icon={Tick01Icon} size={24} /> },
    { label: 'Ort. Puan', value: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0', colorClass: 'text-yellow-500', icon: <HugeiconsIcon icon={StarIcon} size={24} /> },
    { label: 'Bayrak Atılan', value: reviews.filter(r => r.status === 'flagged').length, colorClass: 'text-red-500', icon: <HugeiconsIcon icon={Flag01Icon} size={24} /> },
  ];

  const tabs: TabItem[] = [
    { id: 'pending', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Timer02Icon} size={16} /> Bekleyen</div> },
    { id: 'approved', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Tick01Icon} size={16} /> Onaylanan</div> },
    { id: 'flagged', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Flag01Icon} size={16} /> Bayraklı</div> }
  ];

  const renderStars = (rating: number) => (
    <span className="flex text-yellow-400">
      {Array.from({ length: rating }).map((_, i) => <HugeiconsIcon key={`star-${i}`} icon={StarIcon} size={14} className="text-yellow-400" />)}
      {Array.from({ length: 5 - rating }).map((_, i) => <HugeiconsIcon key={`empty-${i}`} icon={StarIcon} size={14} className="text-gray-300" />)}
    </span>
  );

  const columns: Column<Review>[] = [
    {
      header: (
        <input 
          type="checkbox" 
          checked={selected.length === filtered.length && filtered.length > 0} 
          onChange={toggleAll} 
          className="w-4 h-4 rounded border-gray-300 accent-[#111827]" 
        />
      ),
      accessor: (r) => (
        <input 
          type="checkbox" 
          checked={selected.includes(r.id)} 
          onChange={() => toggleSelect(r.id)} 
          className="w-4 h-4 rounded border-gray-300 accent-[#111827]" 
        />
      ),
      className: 'w-[40px] text-center'
    },
    {
      header: 'Kullanıcı / Ürün',
      accessor: (r) => (
        <div>
          <div className="font-bold text-[#111827]">{r.user}</div>
          <div className="text-[10px] text-gray-500">{r.product}</div>
        </div>
      )
    },
    {
      header: 'Puan',
      accessor: (r) => (
        <div className="flex flex-col gap-1">
          {renderStars(r.rating)}
          {r.images > 0 && (
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-max flex items-center gap-1">
              <HugeiconsIcon icon={Camera01Icon} size={12} /> {r.images}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Yorum',
      accessor: (r) => <div className="text-[12px] text-gray-700 max-w-xs truncate" title={r.text}>{r.text}</div>
    },
    {
      header: 'Tarih',
      accessor: (r) => <span className="text-[11px] text-gray-500">{r.date}</span>
    },
    {
      header: 'Durum',
      accessor: (r) => {
        let type: 'warning' | 'success' | 'danger' = 'warning';
        let label = 'Beklemede';
        if (r.status === 'approved') {
          type = 'success';
          label = 'Onaylı';
        } else if (r.status === 'flagged') {
          type = 'danger';
          label = 'Bayraklı';
        }
        return <StatusBadge status={label} type={type} />;
      }
    },
    {
      header: 'İşlem',
      accessor: (r) => (
        <div className="flex gap-2">
          <button onClick={() => setModal(r)} className="text-[10px] font-bold px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">DETAY</button>
          {r.status === 'pending' && <button onClick={() => doAction([r.id], 'approve', 'Yorum onaylandı.')} className="text-[10px] font-bold px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">ONAYLA</button>}
          {r.status !== 'flagged' && <button onClick={() => doAction([r.id], 'delete', 'Yorum silindi.')} className="text-[10px] font-bold px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100">SİL</button>}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      {actionDone && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <HugeiconsIcon icon={Tick01Icon} size={16} className="text-green-400" />
          {actionDone}
        </div>
      )}
      
      <PageHeader 
        title="Değerlendirme Yönetimi" 
        description="Ürün yorumları & puanlama"
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        <KPIGrid items={kpis} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <FilterTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={(id) => { setActiveTab(id); setSelected([]); }} 
          />
          <div className="w-full md:w-64">
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Yorum, ürün veya kullanıcı ara..." 
            />
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700">{selected.length} yorum seçili</span>
            <div className="flex gap-2 ml-auto">
              {activeTab === 'pending' && <button onClick={() => doAction(selected, 'approve', `${selected.length} yorum onaylandı.`)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold">Toplu Onayla</button>}
              <button onClick={() => doAction(selected, 'delete', `${selected.length} yorum silindi.`)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold">Toplu Sil</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4">
          <DataTable 
            data={filtered}
            columns={columns}
            keyExtractor={(r) => r.id}
            loading={loading}
            emptyMessage={searchQuery ? 'Aramanızla eşleşen yorum bulunamadı.' : 'Bu kategoride yorum bulunmamaktadır.'}
          />
        </div>
      </div>

      <ActionModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title="Yorum Detayı"
        description="Bu yorumun detaylarını aşağıda görebilirsiniz."
      >
        {modal && (
          <div className="space-y-4 pt-2">
            <div className="space-y-3">
              {[
                ['Kullanıcı', modal.user], 
                ['Ürün', modal.product], 
                ['Puan', renderStars(modal.rating)], 
                ['Görsel', modal.images > 0 ? `${modal.images} adet` : 'Yok'], 
                ['Tarih', modal.date], 
                ['Durum', modal.status === 'pending' ? 'Beklemede' : modal.status === 'approved' ? 'Onaylı' : 'Bayraklı']
              ].map(([l, v]: any, i: number) => (
                <div key={i} className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0">
                  <span className="text-[11px] font-bold text-gray-500">{l}</span>
                  <span className="text-[12px] font-black text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 mb-2">YORUM METNİ</p>
              <p className="text-[13px] text-gray-800 bg-gray-50 rounded-xl p-4 font-medium leading-relaxed">{modal.text}</p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px]">Kapat</button>
              {modal.status === 'pending' && <button onClick={() => doAction([modal.id], 'approve', 'Yorum onaylandı.')} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-bold text-[12px] hover:bg-green-700">Onayla</button>}
              <button onClick={() => doAction([modal.id], 'delete', 'Yorum silindi.')} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[12px] hover:bg-red-600">Sil</button>
            </div>
          </div>
        )}
      </ActionModal>
    </div>
  );
}

