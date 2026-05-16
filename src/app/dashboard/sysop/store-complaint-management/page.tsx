'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

type Complaint = { id: number; store: string; subject: string; reporter: string; date: string; priority: 'Acil' | 'Yüksek' | 'Normal'; count: number; status: 'Açık' | 'İnceleniyor' | 'Çözüldü'; detail: string };

const initialComplaints: Complaint[] = [
  { id: 1, store: 'Fashion Palace', subject: 'Sahte ürün satışı ihbarı', reporter: 'Büşra K.', date: '2 saat önce', priority: 'Acil', count: 3, status: 'Açık', detail: 'Birden fazla kullanıcı aynı mağazanın sahte ürün sattığını bildirdi. Nike ve Adidas markalarında tescil sorgulaması yapılmalı.' },
  { id: 2, store: 'Style Hub', subject: 'Sipariş karşılanmıyor', reporter: 'Ahmet Y.', date: '5 saat önce', priority: 'Yüksek', count: 5, status: 'Açık', detail: 'Son 7 günde 5 farklı sipariş karşılanmadı. Mağaza iletişime geçmiyor.' },
  { id: 3, store: 'Quick Fashion', subject: 'Yanıltıcı ürün açıklaması', reporter: 'Cansu D.', date: '1 gün önce', priority: 'Normal', count: 2, status: 'İnceleniyor', detail: 'Ürün görseli ile gelen ürün farklı. Açıklamada %100 pamuk yazıyor fakat etiket polyester.' },
  { id: 4, store: 'Bella Moda', subject: 'İade reddi - haklı talep', reporter: 'Elif Ş.', date: '1 gün önce', priority: 'Yüksek', count: 4, status: 'Açık', detail: 'Mağaza hasarlı ürün için iade talebini reddetti. Kullanıcı kanıt fotoğrafları gönderdi.' },
  { id: 5, store: 'Kids World', subject: 'Geç kargo bildirimi', reporter: 'Zeynep K.', date: '3 gün önce', priority: 'Normal', count: 1, status: 'Çözüldü', detail: 'Kargo 7 gün gecikmeli teslim edildi. Mağaza özür kuponu gönderdi.' },
];

export default function StoreComplaintManagementPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [filter, setFilter] = useState<'all' | 'Açık' | 'İnceleniyor' | 'Çözüldü'>('all');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<Complaint | null>(null);
  const [note, setNote] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  const filtered = complaints.filter(c => filter === 'all' ? true : c.status === filter);
  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
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

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';
  const kpis = [
    { label: 'Açık', value: complaints.filter(c => c.status === 'Açık').length, icon: '🔴' },
    { label: 'İncelenen', value: complaints.filter(c => c.status === 'İnceleniyor').length, icon: '🔍' },
    { label: 'Çözülen', value: complaints.filter(c => c.status === 'Çözüldü').length, icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {actionDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">✅ {actionDone}</div>}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div><h1 className="text-[18px] font-black text-[#111827]">Mağaza Şikayetleri</h1><p className="text-[11px] font-medium text-gray-400">{complaints.length} toplam şikayet</p></div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((k, i) => (<div key={i} className={`${cardClass} p-4 text-center`}><span className="text-[20px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className="text-[22px] font-black text-[#111827]">{k.value}</p></div>))}
        </div>
        <div className={`${cardClass} p-2 flex gap-1`}>
          {([['all', 'Tümü'], ['Açık', '🔴 Açık'], ['İnceleniyor', '🔍 İnceleniyor'], ['Çözüldü', '✅ Çözüldü']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setFilter(id as any); setSelected([]); }} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${filter === id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700">{selected.length} şikayet seçili</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => bulkUpdate('İnceleniyor')} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[10px] font-bold">İncelemeye Al</button>
              <button onClick={() => bulkUpdate('Çözüldü')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-bold">Çözüldü Yap</button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-4">
          <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" />
          <span className="text-[11px] font-bold text-gray-400">Tümünü Seç ({filtered.length})</span>
        </div>
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className={`${cardClass} p-4 border-l-4 ${c.priority === 'Acil' ? 'border-l-red-400' : c.priority === 'Yüksek' ? 'border-l-orange-400' : 'border-l-gray-300'}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827] mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-bold text-[#111827]">{c.store}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${c.priority === 'Acil' ? 'bg-red-100 text-red-600' : c.priority === 'Yüksek' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>{c.priority}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${c.status === 'Açık' ? 'bg-red-50 text-red-600' : c.status === 'İnceleniyor' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>{c.status}</span>
                    <span className="text-[9px] font-bold text-gray-400">{c.count} şikayet</span>
                  </div>
                  <p className="text-[12px] text-gray-700 mt-1">{c.subject}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">İhbar: {c.reporter} · {c.date}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => setModal(c)} className="text-[9px] font-black px-3 py-2 bg-[#111827] text-white rounded-lg hover:bg-black transition-colors">İNCELE</button>
                  {c.status === 'Açık' && <button onClick={() => updateStatus(c.id, 'İnceleniyor')} className="text-[9px] font-black px-3 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100">AL</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => { setModal(null); setNote(''); }}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">Şikayet Detayı</h3>
              <button onClick={() => { setModal(null); setNote(''); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-3">
              {[['Mağaza', modal.store], ['Konu', modal.subject], ['Öncelik', modal.priority], ['Durum', modal.status], ['İhbarcı', modal.reporter], ['Tarih', modal.date], ['Şikayet Sayısı', String(modal.count)]].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">{l}</span><span className="text-[12px] font-black text-gray-900">{v}</span></div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-1">DETAY</p>
                <p className="text-[13px] text-gray-800 bg-gray-50 rounded-xl p-3 font-medium">{modal.detail}</p>
              </div>
              <div className="pt-3">
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">İşlem Notu</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] font-medium focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none resize-none" placeholder="Not ekleyin..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
              <button onClick={() => { setModal(null); setNote(''); }} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px]">Kapat</button>
              {modal.status !== 'İnceleniyor' && <button onClick={() => updateStatus(modal.id, 'İnceleniyor')} className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-[12px]">İncelemeye Al</button>}
              {modal.status !== 'Çözüldü' && <button onClick={() => updateStatus(modal.id, 'Çözüldü')} className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[12px]">Çözüldü</button>}
              <button onClick={() => { setActionDone(`"${modal.store}" mağazası uyarıldı.`); setTimeout(() => setActionDone(null), 2500); setModal(null); setNote(''); }} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[12px]">Mağazayı Uyar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
