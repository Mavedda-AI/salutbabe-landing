'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

type Review = { id: number; user: string; product: string; rating: number; text: string; date: string; status: 'pending' | 'approved' | 'flagged'; images: number };

const initialReviews: Review[] = [
  { id: 1, user: 'Büşra K.', product: 'Kadın Ceket - Siyah', rating: 5, text: 'Harika kalite, tam bedenim oldu!', date: '2 saat önce', status: 'pending', images: 2 },
  { id: 2, user: 'Ahmet Y.', product: 'Erkek Sneaker', rating: 2, text: 'Beden çok küçük geldi, iade ettim.', date: '4 saat önce', status: 'pending', images: 1 },
  { id: 3, user: 'Cansu D.', product: 'Çanta - Krem', rating: 1, text: 'Sahte ürün gibi duruyor, kalitesiz. Dikiş hataları var.', date: '5 saat önce', status: 'flagged', images: 3 },
  { id: 4, user: 'Elif Ş.', product: 'Elbise - Kırmızı', rating: 4, text: 'Çok beğendim, kumaş kaliteli.', date: '8 saat önce', status: 'pending', images: 0 },
  { id: 5, user: 'Zeynep K.', product: 'Trençkot', rating: 5, text: 'Mükemmel! Tekrar alırım.', date: '1 gün önce', status: 'approved', images: 1 },
  { id: 6, user: 'Merve A.', product: 'Bebek Body', rating: 3, text: 'Fena değil ama kumaş biraz sert.', date: '1 gün önce', status: 'pending', images: 0 },
  { id: 7, user: 'Ali Ö.', product: 'Spor Ayakkabı', rating: 1, text: 'SAHTE ÜRÜN! Kesinlikle almayın!', date: '2 gün önce', status: 'flagged', images: 4 },
  { id: 8, user: 'Fatma D.', product: 'Etek - Beyaz', rating: 5, text: 'Tam beklediğim gibi geldi.', date: '3 gün önce', status: 'approved', images: 0 },
];

export default function ReviewManagementPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'flagged'>('pending');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<Review | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const filtered = reviews.filter(r => r.status === activeTab);
  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));

  const doAction = (ids: number[], action: 'approve' | 'delete' | 'flag', msg: string) => {
    if (action === 'delete') setReviews(p => p.filter(r => !ids.includes(r.id)));
    else setReviews(p => p.map(r => ids.includes(r.id) ? { ...r, status: action === 'approve' ? 'approved' : 'flagged' } : r));
    setSelected([]); setModal(null);
    setActionDone(msg); setTimeout(() => setActionDone(null), 2500);
  };

  const kpis = [
    { label: 'Bekleyen İnceleme', value: reviews.filter(r => r.status === 'pending').length, color: 'text-[#FF8D28]', bg: 'bg-orange-50', icon: '⏳' },
    { label: 'Onaylanan (Toplam)', value: reviews.filter(r => r.status === 'approved').length, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { label: 'Ort. Puan', value: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1), color: 'text-yellow-500', bg: 'bg-yellow-50', icon: '⭐' },
    { label: 'Bayrak Atılan', value: reviews.filter(r => r.status === 'flagged').length, color: 'text-red-500', bg: 'bg-red-50', icon: '🚩' },
  ];
  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {actionDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">✅ {actionDone}</div>}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Değerlendirme Yönetimi</h1><p className="text-[11px] font-medium text-gray-400">Ürün yorumları & puanlama</p></div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((k, i) => (<div key={i} className={`${k.bg} border border-gray-100 rounded-[20px] p-4 text-center`}><span className="text-[22px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className={`text-[24px] font-black ${k.color}`}>{k.value}</p></div>))}
        </div>
        <div className={`${cardClass} p-2 flex gap-1`}>
          {([['pending', '⏳ Bekleyen'], ['approved', '✅ Onaylanan'], ['flagged', '🚩 Bayraklı']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setActiveTab(id); setSelected([]); }} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
          ))}
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
        {/* Select All */}
        <div className="flex items-center gap-3 px-4">
          <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" />
          <span className="text-[11px] font-bold text-gray-400">Tümünü Seç ({filtered.length})</span>
        </div>
        <div className="space-y-3">
          {filtered.length === 0 ? <div className={`${cardClass} p-8 text-center text-gray-400 text-[13px]`}>Bu kategoride yorum yok.</div> : filtered.map(r => (
            <div key={r.id} className={`${cardClass} p-4 ${r.status === 'flagged' ? 'border-l-4 border-l-red-400' : ''}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827] mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-[#111827]">{r.user}</span><span className="text-yellow-400 text-[12px]">{'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>{r.images > 0 && <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">📷 {r.images}</span>}</div>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">{r.product}</p>
                  <p className="text-[12px] text-gray-700 mt-1">{r.text}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">{r.date}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setModal(r)} className="text-[9px] font-black px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">DETAY</button>
                  {r.status === 'pending' && <button onClick={() => doAction([r.id], 'approve', 'Yorum onaylandı.')} className="text-[9px] font-black px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">ONAYLA</button>}
                  {r.status !== 'flagged' && <button onClick={() => doAction([r.id], 'delete', 'Yorum silindi.')} className="text-[9px] font-black px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100">SİL</button>}
                  {r.status === 'flagged' && <button onClick={() => setModal(r)} className="text-[9px] font-black px-3 py-2 bg-[#111827] text-white rounded-lg hover:bg-black">İNCELE</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">Yorum Detayı</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-3">
              {[['Kullanıcı', modal.user], ['Ürün', modal.product], ['Puan', '⭐'.repeat(modal.rating) + '☆'.repeat(5 - modal.rating)], ['Görsel', modal.images > 0 ? `${modal.images} adet` : 'Yok'], ['Tarih', modal.date], ['Durum', modal.status === 'pending' ? 'Beklemede' : modal.status === 'approved' ? 'Onaylı' : 'Bayraklı']].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">{l}</span><span className="text-[12px] font-black text-gray-900">{v}</span></div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-1">YORUM METNİ</p>
                <p className="text-[13px] text-gray-800 bg-gray-50 rounded-xl p-3 font-medium">{modal.text}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px]">Kapat</button>
              {modal.status === 'pending' && <button onClick={() => doAction([modal.id], 'approve', 'Yorum onaylandı.')} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-bold text-[12px] hover:bg-green-700">Onayla</button>}
              <button onClick={() => doAction([modal.id], 'delete', 'Yorum silindi.')} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[12px] hover:bg-red-600">Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
