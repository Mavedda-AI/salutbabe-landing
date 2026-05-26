'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Cancel01Icon, File01Icon, Tick01Icon, Timer02Icon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, SearchInput} from '@/app/dashboard/components/ui/FilterBar';
import {DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';

type Brand = { id: number; name: string; products: number; sellers: number; status: 'Onaylı' | 'Beklemede' | 'Engelli'; gmv: string; registeredAt: string; category: string };

export default function BrandManagementPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ type: 'detail' | 'add'; brand?: Brand } | null>(null);
  const [newBrand, setNewBrand] = useState({ name: '', category: '' });
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token === 'mock_token' || !token) {
      setBrands([]);
    } else {
      setBrands([]);
    }
  }, []);

  const filtered = brands
    .filter(b => activeTab === 'all' ? true : activeTab === 'pending' ? b.status === 'Beklemede' : b.status === 'Engelli')
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(b => b.id));

  const updateStatus = (id: number, status: Brand['status']) => {
    setBrands(p => p.map(b => b.id === id ? { ...b, status } : b));
    setActionDone(`Marka durumu "${status}" olarak güncellendi.`);
    setTimeout(() => setActionDone(null), 2500);
    setModal(null);
  };

  const bulkAction = (status: Brand['status']) => {
    setBrands(p => p.map(b => selected.includes(b.id) ? { ...b, status } : b));
    setActionDone(`${selected.length} marka "${status}" olarak güncellendi.`);
    setSelected([]);
    setTimeout(() => setActionDone(null), 2500);
  };

  const addBrand = () => {
    if (!newBrand.name) return;
    setBrands(p => [...p, { id: Date.now(), name: newBrand.name, products: 0, sellers: 0, status: 'Beklemede', gmv: '₺0', registeredAt: 'Bugün', category: newBrand.category || 'Genel' }]);
    setNewBrand({ name: '', category: '' });
    setModal(null);
    setActionDone(`"${newBrand.name}" markası eklendi.`);
    setTimeout(() => setActionDone(null), 2500);
  };

  const getStatusType = (status: string) => {
    if (status === 'Onaylı') return 'success';
    if (status === 'Beklemede') return 'warning';
    if (status === 'Engelli') return 'danger';
    return 'neutral';
  };

  const kpis = [
    { label: 'Onaylı Marka', value: brands.filter(b => b.status === 'Onaylı').length, icon: <HugeiconsIcon icon={Tick01Icon} size={24} />, colorClass: 'text-green-500' },
    { label: 'Beklemede', value: brands.filter(b => b.status === 'Beklemede').length, icon: <HugeiconsIcon icon={Timer02Icon} size={24} />, colorClass: 'text-yellow-500' },
    { label: 'Engelli', value: brands.filter(b => b.status === 'Engelli').length, icon: <HugeiconsIcon icon={Cancel01Icon} size={24} />, colorClass: 'text-red-500' },
  ];

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'pending', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Timer02Icon} size={16} /> Bekleyen</div> },
    { id: 'blocked', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Cancel01Icon} size={16} /> Engelli</div> },
  ];

  const columns = [
    {
      header: <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" />,
      accessor: (b: Brand) => <input type="checkbox" checked={selected.includes(b.id)} onChange={() => toggleSelect(b.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" />,
      className: 'w-10'
    },
    {
      header: 'Marka & Kategori',
      accessor: (b: Brand) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-black text-[#111827]">{b.name}</span>
            <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{b.category}</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{b.products} ürün · {b.sellers} satıcı</p>
        </div>
      )
    },
    {
      header: 'Durum',
      accessor: (b: Brand) => (
        <StatusBadge status={b.status} type={getStatusType(b.status) as any} />
      )
    },
    {
      header: 'Finansal',
      accessor: (b: Brand) => (
        <span className="text-[13px] font-medium text-gray-900">{b.gmv}</span>
      )
    },
    {
      header: 'Kayıt Tarihi',
      accessor: (b: Brand) => (
        <span className="text-[13px] text-gray-500">{b.registeredAt}</span>
      )
    },
    {
      header: 'İşlemler',
      accessor: (b: Brand) => (
        <div className="flex gap-1.5 shrink-0">
          <button onClick={() => setModal({ type: 'detail', brand: b })} className="text-[9px] font-black px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">DETAY</button>
          {b.status === 'Beklemede' && (
            <button onClick={() => updateStatus(b.id, 'Onaylı')} className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">ONAYLA</button>
          )}
          {b.status !== 'Engelli' && (
            <button onClick={() => updateStatus(b.id, 'Engelli')} className="text-[9px] font-black px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">ENGELLE</button>
          )}
          {b.status === 'Engelli' && (
            <button onClick={() => updateStatus(b.id, 'Onaylı')} className="text-[9px] font-black px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">AKTİFLEŞTİR</button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      {actionDone && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <HugeiconsIcon icon={Tick01Icon} size={16} className="text-green-400 inline-block" /> {actionDone}
        </div>
      )}

      <PageHeader 
        title="Marka Yönetimi"
        description={`${brands.length} marka · Doğrulama & Listeleme`}
        actions={
          <button onClick={() => setModal({ type: 'add' })} className="px-4 py-2 rounded-xl bg-[#111827] text-white text-[11px] font-bold hover:bg-black transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Marka Ekle
          </button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        <KPIGrid items={kpis} />

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <FilterTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className="w-full md:w-72">
            <SearchInput value={search} onChange={setSearch} placeholder="Marka adı ara..." />
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700">{selected.length} marka seçili</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => bulkAction('Onaylı')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold hover:bg-green-600">Toplu Onayla</button>
              <button onClick={() => bulkAction('Engelli')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600">Toplu Engelle</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
          <DataTable 
            data={filtered}
            columns={columns}
            keyExtractor={(b) => b.id}
            emptyMessage="Bu kategoride marka bulunamadı."
          />
        </div>
      </div>

      <ActionModal
        isOpen={modal?.type === 'detail'}
        onClose={() => setModal(null)}
        title={modal?.brand ? `${modal.brand.name} — Detay` : ''}
      >
        {modal?.brand && (
          <div className="space-y-3">
            {[['Durum', <StatusBadge key="status" status={modal.brand.status} type={getStatusType(modal.brand.status) as any} />], ['Kategori', modal.brand.category], ['Ürün Sayısı', String(modal.brand.products)], ['Satıcı Sayısı', String(modal.brand.sellers)], ['GMV', modal.brand.gmv], ['Kayıt Tarihi', modal.brand.registeredAt]].map(([l, v]: any, i: number) => (
              <div key={i} className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">{l}</span><span className="text-[12px] font-black text-gray-900">{v}</span></div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 mb-2">TESCİL BELGESİ</p>
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3">
                <HugeiconsIcon icon={File01Icon} size={20} />
                <span className="text-[11px] font-bold text-orange-600">Henüz tescil belgesi yüklenmemiş</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px] transition-colors">Kapat</button>
              {modal.brand.status === 'Beklemede' && <button onClick={() => updateStatus(modal.brand!.id, 'Onaylı')} className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[12px] transition-colors">Onayla</button>}
              {modal.brand.status !== 'Engelli' && <button onClick={() => updateStatus(modal.brand!.id, 'Engelli')} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[12px] transition-colors">Engelle</button>}
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modal?.type === 'add'}
        onClose={() => setModal(null)}
        title="Yeni Marka Ekle"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">MARKA ADI</label>
            <input type="text" value={newBrand.name} onChange={e => setNewBrand(p => ({ ...p, name: e.target.value }))} placeholder="Örn: Nike" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">KATEGORİ</label>
            <select value={newBrand.category} onChange={e => setNewBrand(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-[#111827]">
              <option value="">Seçiniz</option>
              <option>Kadın Giyim</option><option>Erkek Giyim</option><option>Spor</option><option>Aksesuar</option><option>Çanta</option><option>Bebek</option><option>Genel</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px]">Vazgeç</button>
            <button onClick={addBrand} disabled={!newBrand.name} className={`flex-1 py-2.5 rounded-xl font-bold text-[12px] transition-colors ${!newBrand.name ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#111827] text-white hover:bg-black'}`}>Marka Ekle</button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}

