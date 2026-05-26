'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import {Alert02Icon, Message01Icon, StarIcon, Store01Icon, Tick01Icon, UserIcon} from '@hugeicons/core-free-icons';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {PageHeader} from '@/app/dashboard/components/ui/PageHeader';
import {KPIGrid, KPIItem} from '@/app/dashboard/components/ui/KPIGrid';
import {FilterTabs, TabItem} from '@/app/dashboard/components/ui/FilterBar';
import {Column, DataTable} from '@/app/dashboard/components/ui/DataTable';
import {ActionModal, StatusBadge} from '@/app/dashboard/components/ui/StatusBadge';
import {useThemeLanguage} from '@/context/ThemeLanguageContext';

type UserReview = { id: number; reviewer: string; target: string; rating: number; text: string; date: string; type: 'Satıcı' | 'Mağaza'; status: 'pending' | 'approved' | 'removed' };

export default function UserReviewManagementPage() {
  const router = useRouter();
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';
  
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [filter, setFilter] = useState<'all' | 'Satıcı' | 'Mağaza' | 'low'>('all');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<UserReview | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || token === "mock_token") {
      setReviews([]);
    } else {
      setReviews([]);
    }
    setLoading(false);
  }, []);

  const filtered = reviews.filter(r => {
    if (filter === 'Satıcı') return r.type === 'Satıcı';
    if (filter === 'Mağaza') return r.type === 'Mağaza';
    if (filter === 'low') return r.rating <= 2;
    return true;
  });

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length && filtered.length > 0 ? [] : filtered.map(r => r.id));

  const doAction = (ids: number[], action: 'approve' | 'remove', msg: string) => {
    if (action === 'remove') setReviews(p => p.filter(r => !ids.includes(r.id)));
    else setReviews(p => p.map(r => ids.includes(r.id) ? { ...r, status: 'approved'  } : r));
    setSelected([]); setModal(null);
    setActionDone(msg); setTimeout(() => setActionDone(null), 2500);
  };

  const kpis: KPIItem[] = [
    { label: 'Toplam', value: reviews.length, icon: <HugeiconsIcon icon={Message01Icon} size={24} /> },
    { label: 'Ort. Puan', value: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0', icon: <HugeiconsIcon icon={StarIcon} size={24} /> },
    { label: 'Düşük Puan (<3)', value: reviews.filter(r => r.rating < 3).length, icon: <HugeiconsIcon icon={Alert02Icon} size={24} /> },
  ];

  const tabs: TabItem[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'Satıcı', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={UserIcon} size={16} /> Satıcıya</div> },
    { id: 'Mağaza', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Store01Icon} size={16} /> Mağazaya</div> },
    { id: 'low', label: <div className="flex items-center gap-1.5"><HugeiconsIcon icon={Alert02Icon} size={16} /> Düşük Puan</div> }
  ];

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {Array.from({length: rating}).map((_, i) => <HugeiconsIcon key={'star-'+i} icon={StarIcon} size={14} className="text-yellow-400" />)}
      {Array.from({length: 5 - rating}).map((_, i) => <HugeiconsIcon key={'empty-'+i} icon={StarIcon} size={14} className={isDark ? "text-gray-600" : "text-gray-300"} />)}
    </div>
  );

  const columns: Column<UserReview>[] = [
    {
      header: <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className={`w-4 h-4 rounded border-gray-300 accent-black ${isDark ? 'accent-white' : ''}`} />,
      accessor: (r) => <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className={`w-4 h-4 rounded border-gray-300 accent-black ${isDark ? 'accent-white' : ''}`} />,
      className: 'w-10'
    },
    {
      header: 'Yazan',
      accessor: (r) => <span className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{r.reviewer}</span>
    },
    {
      header: 'Hedef',
      accessor: (r) => (
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#007AFF]">{r.target}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{r.type}</span>
        </div>
      )
    },
    {
      header: 'Puan',
      accessor: (r) => renderStars(r.rating)
    },
    {
      header: 'Yorum',
      accessor: (r) => (
        <div className={`max-w-[300px] truncate text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>{r.text}</div>
      )
    },
    {
      header: 'Durum',
      accessor: (r) => r.status === 'approved' ? <StatusBadge status="Onaylı" type="success" /> : <StatusBadge status="Bekliyor" type="warning" />
    },
    {
      header: 'Tarih',
      accessor: (r) => <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{r.date}</span>
    },
    {
      header: 'İşlemler',
      accessor: (r) => (
        <div className="flex gap-2">
          <button onClick={() => setModal(r)} className={`text-[9px] font-black px-3 py-2 rounded-lg transition-colors ${isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>DETAY</button>
          {r.status !== 'approved' && <button onClick={() => doAction([r.id], 'approve', 'Yorum onaylandı.')} className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">ONAYLA</button>}
          <button onClick={() => doAction([r.id], 'remove', 'Yorum kaldırıldı.')} className={`text-[9px] font-black px-3 py-2 rounded-lg border transition-colors ${isDark ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'}`}>KALDIR</button>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen font-sans pb-20 ${isDark ? 'bg-[#0B0C0E]' : 'bg-[#F8F9FA]'}`}>
      {actionDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in"><HugeiconsIcon icon={Tick01Icon} size={16} className="text-green-400 inline-block" /> {actionDone}</div>}
      
      <PageHeader 
        title="Kullanıcı Değerlendirmeleri" 
        description="Kullanıcıdan kullanıcıya & mağazaya yorumlar"
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        <KPIGrid items={kpis} />

        <div className="space-y-4">
          <FilterTabs tabs={tabs} activeTab={filter} onChange={(id) => { setFilter(id as any); setSelected([]); }} />

          {selected.length > 0 && (
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
              <span className={`text-[12px] font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{selected.length} seçili</span>
              <div className="flex gap-2 ml-auto">
                <button onClick={() => doAction(selected, 'approve', `${selected.length} yorum onaylandı.`)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold">Toplu Onayla</button>
                <button onClick={() => doAction(selected, 'remove', `${selected.length} yorum kaldırıldı.`)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold">Toplu Kaldır</button>
              </div>
            </div>
          )}

          <DataTable 
            data={filtered}
            columns={columns}
            keyExtractor={(r) => r.id}
            loading={loading}
            emptyMessage="Değerlendirme bulunamadı."
          />
        </div>
      </div>

      <ActionModal 
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title="Değerlendirme Detayı"
      >
        {modal && (
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                ['Yazan', modal.reviewer], 
                ['Hedef', modal.target], 
                ['Tür', modal.type], 
                ['Puan', renderStars(modal.rating)], 
                ['Tarih', modal.date]
              ].map(([l, v]: any, i: number) => (
                <div key={i} className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                  <span className={`text-[11px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{l}</span>
                  <span className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{v}</span>
                </div>
              ))}
              <div className="pt-2">
                <p className={`text-[10px] font-bold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>YORUM</p>
                <p className={`text-[13px] rounded-xl p-3 ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-800'}`}>{modal.text}</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className={`flex-1 py-2.5 rounded-xl font-bold text-[12px] transition-colors ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Kapat</button>
              {modal.status !== 'approved' && <button onClick={() => doAction([modal.id], 'approve', 'Onaylandı.')} className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[12px] transition-colors">Onayla</button>}
              <button onClick={() => doAction([modal.id], 'remove', 'Kaldırıldı.')} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-[12px] transition-colors">Kaldır</button>
            </div>
          </div>
        )}
      </ActionModal>
    </div>
  );
}

