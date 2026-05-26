'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {RecordIcon, Search01Icon, Tick01Icon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, SearchInput} from '@/app/dashboard/components/ui/FilterBar';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';

type Complaint = { id: number; store: string; subject: string; reporter: string; date: string; priority: 'Acil' | 'Yüksek' | 'Normal'; count: number; status: 'Açık' | 'İnceleniyor' | 'Çözüldü'; detail: string };

export default function StoreComplaintManagementPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<'all' | 'Açık' | 'İnceleniyor' | 'Çözüldü'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modal, setModal] = useState<Complaint | null>(null);
  const [note, setNote] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token === 'mock_token' || !token) {
      setComplaints([]);
      setLoading(false);
    } else {
      setComplaints([]);
      setLoading(false);
    }
  }, []);

  const filtered = complaints.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.store.toLowerCase().includes(search.toLowerCase()) || 
                          c.subject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleSelect = (id: string | number) => setSelected(p => p.includes(id as number) ? p.filter(x => x !== id) : [...p, id as number]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  const updateStatus = (id: number, status: Complaint['status']) => {
    setComplaints(p => p.map(c => c.id === id ? { ...c, status } : c));
    setActionDone(`Şikayet durumu "${status}" olarak güncellendi.`);
    setTimeout(() => setActionDone(null), 2500);
    setModal(null); setNote('');
  };

  const bulkUpdate = (status: Complaint['status']) => {
    setComplaints(p => p.map(c => selected.includes(c.id) ? { ...c, status } : c));
    setActionDone(`${selected.length} şikayet "${status}" olarak güncellendi.`);
    setSelected([]);
    setTimeout(() => setActionDone(null), 2500);
  };

  const kpis: KPIItem[] = [
    { label: 'Açık', value: complaints.filter(c => c.status === 'Açık').length, icon: <HugeiconsIcon icon={RecordIcon} size={24} /> },
    { label: 'İncelenen', value: complaints.filter(c => c.status === 'İnceleniyor').length, icon: <HugeiconsIcon icon={Search01Icon} size={24} /> },
    { label: 'Çözülen', value: complaints.filter(c => c.status === 'Çözüldü').length, icon: <HugeiconsIcon icon={Tick01Icon} size={24} /> },
  ];

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'Açık', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={RecordIcon} size={16} /> Açık</div> },
    { id: 'İnceleniyor', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Search01Icon} size={16} /> İnceleniyor</div> },
    { id: 'Çözüldü', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Tick01Icon} size={16} /> Çözüldü</div> },
  ];

  const columns: Column<Complaint>[] = [
    {
      header: 'Mağaza & Şikayet',
      accessor: (item) => (
        <div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">{item.store}</div>
          <div className="text-xs text-gray-500 mt-1">{item.subject}</div>
        </div>
      )
    },
    {
      header: 'İhbar',
      accessor: (item) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.reporter}</div>
          <div className="text-xs text-gray-500 mt-1">{item.date}</div>
        </div>
      )
    },
    {
      header: 'Durum',
      accessor: (item) => (
        <div className="flex flex-col gap-2 items-start">
          <StatusBadge 
            status={item.status} 
            type={item.status === 'Açık' ? 'danger' : item.status === 'İnceleniyor' ? 'info' : 'success'} 
          />
          <StatusBadge 
            status={item.priority} 
            type={item.priority === 'Acil' ? 'danger' : item.priority === 'Yüksek' ? 'warning' : 'neutral'} 
          />
        </div>
      )
    },
    {
      header: 'Şikayet',
      accessor: (item) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count} adet</span>
      )
    },
    {
      header: 'İşlemler',
      accessor: (item) => (
        <div className="flex gap-2">
          <button onClick={() => setModal(item)} className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-[10px] font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            İNCELE
          </button>
          {item.status === 'Açık' && (
            <button onClick={() => updateStatus(item.id, 'İnceleniyor')} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-[10px] font-bold transition-colors">
              AL
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0E14] font-sans">
      {actionDone && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] dark:bg-white dark:text-gray-900 text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <HugeiconsIcon icon={Tick01Icon} size={16} className="text-green-400" />
          {actionDone}
        </div>
      )}
      
      <PageHeader 
        title="Mağaza Şikayetleri" 
        description={`${complaints.length} toplam şikayet`} 
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <KPIGrid items={kpis} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <FilterTabs 
            tabs={tabs} 
            activeTab={filter} 
            onChange={(val) => setFilter(val as any)} 
          />
          <div className="w-full md:w-64">
            <SearchInput 
              value={search} 
              onChange={setSearch} 
              placeholder="Mağaza veya konu ara..." 
            />
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700 dark:text-blue-400">{selected.length} şikayet seçili</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => bulkUpdate('İnceleniyor')} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold transition-colors">İncelemeye Al</button>
              <button onClick={() => bulkUpdate('Çözüldü')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-bold transition-colors">Çözüldü Yap</button>
            </div>
          </div>
        )}

        <DataTable 
          data={filtered} 
          columns={columns} 
          keyExtractor={(item) => item.id} 
          loading={loading}
          emptyMessage="Şikayet bulunamadı."
          selectedIds={selected}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
        />
      </div>

      <ActionModal 
        isOpen={!!modal} 
        onClose={() => { setModal(null); setNote(''); }} 
        title="Şikayet Detayı"
      >
        {modal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
              <div>
                <span className="text-[11px] font-bold text-gray-500 block mb-1">Mağaza</span>
                <span className="text-[13px] font-black text-gray-900 dark:text-white">{modal.store}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 block mb-1">Öncelik & Durum</span>
                <div className="flex gap-2 mt-1">
                  <StatusBadge status={modal.priority} type={modal.priority === 'Acil' ? 'danger' : modal.priority === 'Yüksek' ? 'warning' : 'neutral'} />
                  <StatusBadge status={modal.status} type={modal.status === 'Açık' ? 'danger' : modal.status === 'İnceleniyor' ? 'info' : 'success'} />
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] font-bold text-gray-500 block mb-1">Konu</span>
                <span className="text-[13px] font-black text-gray-900 dark:text-white">{modal.subject}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 block mb-1">İhbarcı</span>
                <span className="text-[13px] font-black text-gray-900 dark:text-white">{modal.reporter}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 block mb-1">Tarih</span>
                <span className="text-[13px] font-black text-gray-900 dark:text-white">{modal.date}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Detay</p>
              <p className="text-[13px] text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-white/5 rounded-xl p-3 font-medium">
                {modal.detail}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">İşlem Notu</label>
              <textarea 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                rows={3} 
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-transparent dark:text-white px-4 py-3 text-[13px] font-medium focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none resize-none transition-all" 
                placeholder="Not ekleyin..." 
              />
            </div>

            <div className="pt-2 flex flex-col md:flex-row gap-2">
              <button 
                onClick={() => { setModal(null); setNote(''); }} 
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white font-bold text-[12px] transition-colors"
              >
                Kapat
              </button>
              {modal.status !== 'İnceleniyor' && (
                <button 
                  onClick={() => updateStatus(modal.id, 'İnceleniyor')} 
                  className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-[12px] transition-colors"
                >
                  İncelemeye Al
                </button>
              )}
              {modal.status !== 'Çözüldü' && (
                <button 
                  onClick={() => updateStatus(modal.id, 'Çözüldü')} 
                  className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-[12px] transition-colors"
                >
                  Çözüldü
                </button>
              )}
              <button 
                onClick={() => { 
                  setActionDone(`"${modal.store}" mağazası uyarıldı.`); 
                  setTimeout(() => setActionDone(null), 2500); 
                  setModal(null); 
                  setNote(''); 
                }} 
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[12px] transition-colors"
              >
                Mağazayı Uyar
              </button>
            </div>
          </div>
        )}
      </ActionModal>
    </div>
  );
}
