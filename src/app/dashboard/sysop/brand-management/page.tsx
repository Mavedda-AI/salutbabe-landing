'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

type Brand = { id: number; name: string; products: number; sellers: number; status: 'Onaylı' | 'Beklemede' | 'Engelli'; gmv: string; registeredAt: string; category: string };

const initialBrands: Brand[] = [
  { id: 1, name: 'Zara', products: 1240, sellers: 12, status: 'Onaylı', gmv: '₺842K', registeredAt: '12 Oca 2026', category: 'Kadın Giyim' },
  { id: 2, name: 'H&M', products: 980, sellers: 8, status: 'Onaylı', gmv: '₺620K', registeredAt: '18 Şub 2026', category: 'Kadın Giyim' },
  { id: 3, name: 'Mango', products: 560, sellers: 5, status: 'Onaylı', gmv: '₺380K', registeredAt: '05 Mar 2026', category: 'Kadın Giyim' },
  { id: 4, name: 'Nike', products: 420, sellers: 15, status: 'Onaylı', gmv: '₺1.2M', registeredAt: '02 Oca 2026', category: 'Spor' },
  { id: 5, name: 'Adidas', products: 380, sellers: 10, status: 'Onaylı', gmv: '₺920K', registeredAt: '14 Oca 2026', category: 'Spor' },
  { id: 6, name: 'NoName TR', products: 24, sellers: 1, status: 'Beklemede', gmv: '₺8K', registeredAt: '14 May 2026', category: 'Aksesuar' },
  { id: 7, name: 'Bella Marka', products: 12, sellers: 1, status: 'Beklemede', gmv: '₺3K', registeredAt: '15 May 2026', category: 'Bebek' },
  { id: 8, name: 'FakeGucci', products: 0, sellers: 1, status: 'Engelli', gmv: '₺0', registeredAt: '10 May 2026', category: 'Aksesuar' },
  { id: 9, name: 'CopyLV', products: 0, sellers: 1, status: 'Engelli', gmv: '₺0', registeredAt: '08 May 2026', category: 'Çanta' },
];

export default function BrandManagementPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'blocked'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ type: 'detail' | 'add'; brand?: Brand } | null>(null);
  const [newBrand, setNewBrand] = useState({ name: '', category: '' });
  const [actionDone, setActionDone] = useState<string | null>(null);

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

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';
  const kpis = [
    { label: 'Onaylı Marka', value: brands.filter(b => b.status === 'Onaylı').length, icon: '✅' },
    { label: 'Beklemede', value: brands.filter(b => b.status === 'Beklemede').length, icon: '⏳' },
    { label: 'Engelli', value: brands.filter(b => b.status === 'Engelli').length, icon: '🚫' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Toast */}
      {actionDone && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          ✅ {actionDone}
        </div>
      )}

      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-black text-[#111827]">Marka Yönetimi</h1>
            <p className="text-[11px] font-medium text-gray-400">{brands.length} marka · Doğrulama & Listeleme</p>
          </div>
          <button onClick={() => setModal({ type: 'add' })} className="px-4 py-2 rounded-xl bg-[#111827] text-white text-[11px] font-bold hover:bg-black transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Marka Ekle
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((k, i) => (
            <div key={i} className={`${cardClass} p-4 text-center`}>
              <span className="text-[20px]">{k.icon}</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p>
              <p className="text-[22px] font-black text-[#111827]">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className={`${cardClass} p-3 flex items-center gap-3`}>
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Marka adı ara..." className="flex-1 bg-transparent outline-none text-[13px] font-medium text-gray-900 placeholder:text-gray-400" />
        </div>

        {/* Tabs */}
        <div className={`${cardClass} p-2 flex gap-1`}>
          {([['all', 'Tümü'], ['pending', '⏳ Bekleyen'], ['blocked', '🚫 Engelli']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setActiveTab(id); setSelected([]); }} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700">{selected.length} marka seçili</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => bulkAction('Onaylı')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold hover:bg-green-600">Toplu Onayla</button>
              <button onClick={() => bulkAction('Engelli')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600">Toplu Engelle</button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {/* Select All */}
          <div className="flex items-center gap-3 px-4">
            <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" />
            <span className="text-[11px] font-bold text-gray-400">Tümünü Seç</span>
          </div>

          {filtered.length === 0 ? (
            <div className={`${cardClass} p-8 text-center text-gray-400 text-[13px]`}>Bu kategoride marka bulunamadı.</div>
          ) : filtered.map(b => (
            <div key={b.id} className={`${cardClass} p-4`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.includes(b.id)} onChange={() => toggleSelect(b.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-black text-[#111827]">{b.name}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${b.status === 'Onaylı' ? 'bg-green-50 text-green-600' : b.status === 'Beklemede' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>{b.status}</span>
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{b.category}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{b.products} ürün · {b.sellers} satıcı · GMV: {b.gmv} · {b.registeredAt}</p>
                </div>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {modal.type === 'detail' && modal.brand && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="text-[16px] font-black text-gray-900">{modal.brand.name} — Detay</h3>
                  <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-6 space-y-3">
                  {[['Durum', modal.brand.status], ['Kategori', modal.brand.category], ['Ürün Sayısı', String(modal.brand.products)], ['Satıcı Sayısı', String(modal.brand.sellers)], ['GMV', modal.brand.gmv], ['Kayıt Tarihi', modal.brand.registeredAt]].map(([l, v], i) => (
                    <div key={i} className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">{l}</span><span className="text-[12px] font-black text-gray-900">{v}</span></div>
                  ))}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 mb-2">TESC\u0130L BELGES\u0130</p>
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3">
                      <span className="text-[20px]">📄</span>
                      <span className="text-[11px] font-bold text-orange-600">Henüz tescil belgesi yüklenmemiş</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px] transition-colors">Kapat</button>
                  {modal.brand.status === 'Beklemede' && <button onClick={() => updateStatus(modal.brand!.id, 'Onaylı')} className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[12px] transition-colors">Onayla</button>}
                  {modal.brand.status !== 'Engelli' && <button onClick={() => updateStatus(modal.brand!.id, 'Engelli')} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[12px] transition-colors">Engelle</button>}
                </div>
              </>
            )}
            {modal.type === 'add' && (
              <>
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-[16px] font-black text-gray-900">Yeni Marka Ekle</h3>
                </div>
                <div className="p-6 space-y-4">
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
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px]">Vazgeç</button>
                  <button onClick={addBrand} disabled={!newBrand.name} className={`flex-1 py-2.5 rounded-xl font-bold text-[12px] transition-colors ${!newBrand.name ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#111827] text-white hover:bg-black'}`}>Marka Ekle</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
