'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

type UserReview = { id: number; reviewer: string; target: string; rating: number; text: string; date: string; type: 'Satıcı' | 'Mağaza'; status: 'pending' | 'approved' | 'removed' };

const initialReviews: UserReview[] = [
  { id: 1, reviewer: 'Büşra K.', target: 'Ahmet Y.', rating: 1, text: 'Ürünü hasarlı gönderdi, iletişime geçmiyor.', date: '3 saat önce', type: 'Satıcı', status: 'pending' },
  { id: 2, reviewer: 'Cansu D.', target: 'Fashion Palace', rating: 2, text: 'Sahte ürün gönderildi, güvenilmez.', date: '6 saat önce', type: 'Mağaza', status: 'pending' },
  { id: 3, reviewer: 'Elif Ş.', target: 'Merve Ç.', rating: 5, text: 'Çok ilgili, hızlı kargo.', date: '1 gün önce', type: 'Satıcı', status: 'pending' },
  { id: 4, reviewer: 'Zeynep K.', target: 'Urban Style TR', rating: 4, text: 'Güzel ürünler, fiyat biraz yüksek.', date: '2 gün önce', type: 'Mağaza', status: 'approved' },
  { id: 5, reviewer: 'Ali Ö.', target: 'Bella Moda', rating: 1, text: 'İade kabul etmiyorlar, dolandırıcılar!', date: '2 gün önce', type: 'Mağaza', status: 'pending' },
  { id: 6, reviewer: 'Fatma D.', target: 'Selin T.', rating: 5, text: 'Her şey mükemmeldi, teşekkürler.', date: '3 gün önce', type: 'Satıcı', status: 'approved' },
];

export default function UserReviewManagementPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<UserReview[]>(initialReviews);
  const [filter, setFilter] = useState<'all' | 'Satıcı' | 'Mağaza' | 'low'>('all');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<UserReview | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const filtered = reviews.filter(r => {
    if (filter === 'Satıcı') return r.type === 'Satıcı';
    if (filter === 'Mağaza') return r.type === 'Mağaza';
    if (filter === 'low') return r.rating <= 2;
    return true;
  });

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));

  const doAction = (ids: number[], action: 'approve' | 'remove', msg: string) => {
    if (action === 'remove') setReviews(p => p.filter(r => !ids.includes(r.id)));
    else setReviews(p => p.map(r => ids.includes(r.id) ? { ...r, status: 'approved' as const } : r));
    setSelected([]); setModal(null);
    setActionDone(msg); setTimeout(() => setActionDone(null), 2500);
  };

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';
  const kpis = [
    { label: 'Toplam', value: reviews.length, icon: '💬' },
    { label: 'Ort. Puan', value: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1), icon: '⭐' },
    { label: 'Düşük Puan (<3)', value: reviews.filter(r => r.rating < 3).length, icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {actionDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">✅ {actionDone}</div>}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Kullanıcı Değerlendirmeleri</h1><p className="text-[11px] font-medium text-gray-400">Kullanıcıdan kullanıcıya & mağazaya yorumlar</p></div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((k, i) => (<div key={i} className={`${cardClass} p-4 text-center`}><span className="text-[20px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className="text-[22px] font-black text-[#111827]">{k.value}</p></div>))}
        </div>
        <div className={`${cardClass} p-2 flex gap-1`}>
          {([['all', 'Tümü'], ['Satıcı', '👤 Satıcıya'], ['Mağaza', '🏪 Mağazaya'], ['low', '⚠️ Düşük Puan']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setFilter(id as any); setSelected([]); }} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${filter === id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700">{selected.length} seçili</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => doAction(selected, 'approve', `${selected.length} yorum onaylandı.`)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold">Toplu Onayla</button>
              <button onClick={() => doAction(selected, 'remove', `${selected.length} yorum kaldırıldı.`)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold">Toplu Kaldır</button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-4">
          <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" />
          <span className="text-[11px] font-bold text-gray-400">Tümünü Seç ({filtered.length})</span>
        </div>
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`${cardClass} p-4 ${r.rating <= 2 ? 'border-l-4 border-l-red-400' : ''}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827] mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[#111827]">{r.reviewer}</span>
                    <span className="text-[10px] text-gray-400">→</span>
                    <span className="text-[12px] font-bold text-[#007AFF]">{r.target}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{r.type}</span>
                    {r.status === 'approved' && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-600">Onaylı</span>}
                  </div>
                  <p className="text-yellow-400 text-[12px] mt-1">{'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                  <p className="text-[12px] text-gray-700 mt-1">{r.text}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">{r.date}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setModal(r)} className="text-[9px] font-black px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">DETAY</button>
                  {r.status !== 'approved' && <button onClick={() => doAction([r.id], 'approve', 'Yorum onaylandı.')} className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">ONAYLA</button>}
                  <button onClick={() => doAction([r.id], 'remove', 'Yorum kaldırıldı.')} className="text-[9px] font-black px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100">KALDIR</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">Değerlendirme Detayı</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-3">
              {[['Yazan', modal.reviewer], ['Hedef', modal.target], ['Tür', modal.type], ['Puan', '⭐'.repeat(modal.rating) + '☆'.repeat(5 - modal.rating)], ['Tarih', modal.date]].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">{l}</span><span className="text-[12px] font-black text-gray-900">{v}</span></div>
              ))}
              <div className="pt-3 border-t border-gray-100"><p className="text-[10px] font-bold text-gray-400 mb-1">YORUM</p><p className="text-[13px] text-gray-800 bg-gray-50 rounded-xl p-3">{modal.text}</p></div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-[12px]">Kapat</button>
              {modal.status !== 'approved' && <button onClick={() => doAction([modal.id], 'approve', 'Onaylandı.')} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-bold text-[12px]">Onayla</button>}
              <button onClick={() => doAction([modal.id], 'remove', 'Kaldırıldı.')} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[12px]">Kaldır</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
